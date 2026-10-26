/*
 * Face Me: static stand-in for the PHP + Postgres back end.
 *
 * The original pages posted to authenticate.php / Register.php / Upload.php, which
 * talked to Postgres and ran ffprobe, ffmpeg, OpenFace and the delaunay binary on the
 * server. In this archive copy every one of those is a dummy function below:
 *   - logging in or signing up accepts any username and password and only remembers
 *     the username in sessionStorage (the PHP $_SESSION['User']);
 *   - "uploading" never reads or sends the file: it plays the processing steps and
 *     adds an entry with the file's name to a list kept in this browser's localStorage;
 *   - My Videos is pre-populated with the project's two real output videos and its
 *     landmark data.
 * Nothing on these pages makes a network request beyond loading their own files.
 */
(function () {
    'use strict';

    var SESSION_KEY = 'faceme.user';
    var VIDEOS_PREFIX = 'faceme.videos.';

    function safeGet(store, key) {
        try {
            return window[store].getItem(key);
        } catch (e) {
            return null;
        }
    }
    function safeSet(store, key, value) {
        try {
            if (value === null) window[store].removeItem(key);
            else window[store].setItem(key, value);
        } catch (e) {
            /* storage blocked: the demo still works for this page view */
        }
    }

    // Kept in memory too, for browsers that block storage.
    var memoryUser = null;

    // ---------- Dummy auth (authenticate.php, Register.php, logout.php) ----------

    function currentUser() {
        return safeGet('sessionStorage', SESSION_KEY) || memoryUser;
    }

    function logIn(username) {
        var name = String(username || '').trim().replace(/[^\w.\- ]/g, '').slice(0, 32) || 'guest';
        memoryUser = name;
        safeSet('sessionStorage', SESSION_KEY, name);
        return name;
    }

    function logOut() {
        memoryUser = null;
        safeSet('sessionStorage', SESSION_KEY, null);
    }

    function requireUser() {
        var user = currentUser();
        if (!user) window.location.replace('index.html');
        return user;
    }

    // ---------- Dummy video store (the per-user Postgres table) ----------

    var SAMPLES = [
        {
            id: 'out1',
            name: 'Video Output 1',
            file: 'videos/out1.webm',
            thumb: 'images/faceme_output.png',
            info: '1280 × 720 · 7.1 s · 30 fps',
            sample: true,
        },
        {
            id: 'out2',
            name: 'Video Output 2',
            file: 'videos/out2.webm',
            thumb: 'images/faceme_output2.png',
            info: '1280 × 720 · 0.8 s · 30 fps',
            sample: true,
        },
        {
            id: 'landmarks',
            name: 'Landmark data, video 1',
            info: '430 frames · 68 points per frame',
            plot: true,
            sample: true,
        },
    ];

    function uploads(user) {
        var raw = safeGet('localStorage', VIDEOS_PREFIX + user);
        try {
            var list = JSON.parse(raw || '[]');
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    }

    function listVideos(user) {
        return SAMPLES.concat(uploads(user));
    }

    function findVideo(user, id) {
        var all = user ? listVideos(user) : SAMPLES;
        for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
        return null;
    }

    // Upload.php ran: postgres (ffprobe + ffmpeg frame split), datapoints_script (OpenFace),
    // delaunay_script (delaunay per frame, then ffmpeg -> OUTPUT.webm). Here: nothing is sent.
    var PIPELINE = [
        'Saving videos/{user}/{name}/',
        'ffprobe: reading width, height, fps and frame count',
        'ffmpeg: splitting the video into frames',
        'OpenFace FaceLandmarkImg: finding 68 landmarks per frame',
        'delaunay: triangulating and drawing each frame',
        'ffmpeg: stitching the frames into OUTPUT.webm',
    ];

    function fakeUpload(user, fileName, onStep, onDone) {
        var name = String(fileName || 'sample_clip.mp4').replace(/^.*[\\/]/, '').slice(0, 80);
        var entry = {
            id: 'u' + Date.now().toString(36),
            name: name,
            info: 'Processed in this browser (demo)',
            plot: true,
            uploaded: new Date().toISOString(),
        };
        var i = 0;
        (function next() {
            if (i < PIPELINE.length) {
                onStep(PIPELINE[i].replace('{user}', user).replace('{name}', name), i, PIPELINE.length);
                i++;
                setTimeout(next, 550);
                return;
            }
            var list = uploads(user);
            list.push(entry);
            safeSet('localStorage', VIDEOS_PREFIX + user, JSON.stringify(list));
            onDone(entry);
        })();
    }

    // ---------- Shared page bits ----------

    function setWelcome(user) {
        var target = document.getElementById('topnav-text');
        if (target && user) target.textContent = 'Welcome, ' + user;
    }

    // Some embedded browsers refuse to stream media straight from a URL; fall back to a
    // same-origin fetch into a blob. (Still only the page's own file, nothing is sent.)
    function playVideo(video, src) {
        var fellBack = false;
        video.addEventListener('error', function () {
            if (fellBack) return;
            fellBack = true;
            fetch(src)
                .then(function (r) {
                    return r.blob();
                })
                .then(function (b) {
                    video.src = URL.createObjectURL(new Blob([b], { type: 'video/webm' }));
                    video.play().catch(function () {});
                })
                .catch(function () {});
        });
        video.src = src;
    }

    function param(name) {
        var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
        return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
    }

    window.FaceMe = {
        currentUser: currentUser,
        logIn: logIn,
        logOut: logOut,
        requireUser: requireUser,
        listVideos: listVideos,
        findVideo: findVideo,
        fakeUpload: fakeUpload,
        setWelcome: setWelcome,
        playVideo: playVideo,
        param: param,
    };
})();
