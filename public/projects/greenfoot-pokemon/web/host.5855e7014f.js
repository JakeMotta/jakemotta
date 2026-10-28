// The browser side of the Greenfoot runtime in demos/greenfoot/runtime/ (see docs/projects/greenfoot-web.md).
// scripts/build-greenfoot.mjs copies it beside each game's script. The page calls GF.boot(), which loads every
// image the game names, then starts the game; the game's Java calls back into GF for canvases, input and sound.
(function () {
    'use strict';

    var manifest = { images: {}, sounds: {} };
    var base = '';
    var images = {};
    var screen = null;
    var screenContext = null;
    var options = {};
    var scratch = document.createElement('canvas').getContext('2d');

    var keysDown = {};
    var keysLatched = {};
    var keyNames = {};
    var lastKey = null;
    var mouseEvents = [];
    var press = null;

    var resetFlag = false;
    var runToggleFlag = false;
    var soundStarted = false;
    // Every game plays at half volume, as Jake asked on 2026-10-28
    var VOLUME = 0.5;
    // The sounds playing (or paused by Pause), which Pause, Play and Start over act on as Greenfoot's own controls do
    var playing = [];
    var pausedByRun = [];

    function forget(list, sound) {
        var at = list.indexOf(sound);
        if (at >= 0) list.splice(at, 1);
    }

    function startAudio(sound) {
        var started = sound.audio.play();
        if (started && started.catch) started.catch(function () {});
    }

    function context(canvas) {
        return canvas.getContext('2d');
    }

    function newCanvas(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        return canvas;
    }

    // Java's key names, as Greenfoot spells them
    var NAMED = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', ' ': 'space', Enter: 'enter',
        Escape: 'escape', Tab: 'tab', Backspace: 'backspace', Shift: 'shift', Control: 'control', Alt: 'alt',
        Delete: 'delete', Home: 'home', End: 'end', PageUp: 'page up', PageDown: 'page down', Insert: 'insert'
    };

    function namesFor(event) {
        var names = [];
        if (NAMED[event.key]) names.push(NAMED[event.key]);
        else if (/^F\d{1,2}$/.test(event.key)) names.push(event.key.toLowerCase());
        else if (event.key.length === 1) names.push(event.key.toLowerCase());
        // The physical key too, so Shift+1 still counts as "1"
        var code = /^(?:Key|Digit|Numpad)([A-Z0-9])$/.exec(event.code || '');
        if (code && names.indexOf(code[1].toLowerCase()) < 0) names.push(code[1].toLowerCase());
        return names;
    }

    function typedKey(event) {
        if (NAMED[event.key]) return NAMED[event.key];
        if (/^F\d{1,2}$/.test(event.key)) return event.key;
        return event.key.length === 1 ? event.key : null;
    }

    function isGameKey(event) {
        var target = event.target;
        return !(target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)));
    }

    function onKeyDown(event) {
        if (!isGameKey(event) || event.metaKey) return;
        var names = namesFor(event);
        keyNames[event.code || event.key] = names;
        names.forEach(function (name) {
            keysDown[name] = true;
            keysLatched[name] = true;
        });
        var typed = typedKey(event);
        if (typed && !event.repeat) lastKey = typed;
        // Keep the game's keys from scrolling the page or moving focus
        if (/^(ArrowUp|ArrowDown|ArrowLeft|ArrowRight| |Tab|Backspace)$/.test(event.key)) event.preventDefault();
    }

    function onKeyUp(event) {
        var names = keyNames[event.code || event.key] || namesFor(event);
        delete keyNames[event.code || event.key];
        names.forEach(function (name) {
            delete keysDown[name];
        });
    }

    function releaseAllKeys() {
        keysDown = {};
        keyNames = {};
    }

    // The mouse, in world pixels: the canvas may be scaled by CSS
    function worldPoint(event) {
        var rect = screen.getBoundingClientRect();
        return {
            x: Math.floor((event.clientX - rect.left) * screen.width / rect.width),
            y: Math.floor((event.clientY - rect.top) * screen.height / rect.height)
        };
    }

    function pushMouse(type, point, button, clicks) {
        mouseEvents.push(type, point.x, point.y, button, clicks);
        if (mouseEvents.length > 500) mouseEvents.splice(0, mouseEvents.length - 500);
    }

    function greenfootButton(event) {
        return event.button === 1 ? 2 : event.button === 2 ? 3 : 1;
    }

    function onPointerDown(event) {
        var point = worldPoint(event);
        press = { x: point.x, y: point.y, dragged: false, button: greenfootButton(event) };
        screen.setPointerCapture && screen.setPointerCapture(event.pointerId);
        pushMouse(1, point, press.button, 1);
    }

    function onPointerMove(event) {
        var point = worldPoint(event);
        if (press) {
            if (Math.abs(point.x - press.x) > 3 || Math.abs(point.y - press.y) > 3) press.dragged = true;
            if (press.dragged) pushMouse(4, point, press.button, 0);
        } else {
            pushMouse(3, point, 0, 0);
        }
    }

    function onPointerUp(event) {
        if (!press) return;
        var point = worldPoint(event);
        pushMouse(press.dragged ? 5 : 2, point, press.button, Math.max(1, event.detail || 1));
        press = null;
    }

    var GF = {
        /**
         * Loads the game's images and starts it. options: canvas, base (the web/ folder's URL), manifest (its
         * manifest.json), and the callbacks onProgress(loaded, total), onReady(), onError(message),
         * onRunning(running), onSound(), and onResize(width, height) when a world of another size is shown. The page
         * loads this script and the game's, both named in the manifest.
         */
        boot: function (opts) {
            options = opts;
            screen = opts.canvas;
            screenContext = context(screen);
            base = opts.base.replace(/\/?$/, '/');
            screen.tabIndex = 0;
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);
            window.addEventListener('blur', releaseAllKeys);
            screen.addEventListener('pointerdown', onPointerDown);
            screen.addEventListener('pointermove', onPointerMove);
            screen.addEventListener('pointerup', onPointerUp);
            screen.addEventListener('contextmenu', function (event) { event.preventDefault(); });

            manifest = opts.manifest;
            return Promise.resolve()
                .then(function () {
                    var names = Object.keys(manifest.images);
                    var done = 0;
                    if (opts.onProgress) opts.onProgress(0, names.length);
                    // load, not decode(): decode() can wait until a hidden tab is shown again
                    return Promise.all(names.map(function (name) {
                        return new Promise(function (resolve, reject) {
                            var image = new Image();
                            image.onload = function () {
                                images[name] = image;
                                done++;
                                if (opts.onProgress) opts.onProgress(done, names.length);
                                resolve();
                            };
                            image.onerror = function () { reject(new Error('Could not load ' + manifest.images[name])); };
                            image.src = base + manifest.images[name];
                        });
                    }));
                })
                .then(function () {
                    // game.js defines main(), TeaVM's entry point
                    window.main([]);
                    if (opts.onReady) opts.onReady();
                })
                .catch(function (error) {
                    GF.error(String(error && error.message || error));
                });
        },

        reset: function () { resetFlag = true; },
        toggleRun: function () { runToggleFlag = true; },
        focus: function () { screen.focus({ preventScroll: true }); },

        // Called from Java

        run: function (callback) {
            function loop(now) {
                callback(now);
                requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
        },
        error: function (message) {
            console.error('Greenfoot: ' + message);
            if (options.onError) options.onError(message);
        },
        // Pause pauses the game's sounds and Play picks them up again, as in Greenfoot
        setRunning: function (running) {
            if (running) {
                pausedByRun.forEach(startAudio);
                pausedByRun = [];
            } else {
                pausedByRun = playing.filter(function (sound) { return !sound.audio.paused; });
                pausedByRun.forEach(function (sound) { sound.audio.pause(); });
            }
            if (options.onRunning) options.onRunning(running);
        },
        // Start over stops every sound before the world is built again, as Greenfoot's Reset does; otherwise the
        // old world's music plays on under the new world's
        resetRequested: function () {
            var flag = resetFlag;
            resetFlag = false;
            if (flag) {
                playing.forEach(function (sound) {
                    sound.audio.pause();
                    sound.audio.currentTime = 0;
                });
                playing = [];
                pausedByRun = [];
            }
            return flag;
        },
        runToggleRequested: function () { var flag = runToggleFlag; runToggleFlag = false; return flag; },

        image: function (name) {
            return images[name] || null;
        },
        canvas: newCanvas,
        copy: function (image) {
            var canvas = newCanvas(image.width, image.height);
            context(canvas).drawImage(image, 0, 0);
            return canvas;
        },
        scaled: function (image, width, height) {
            var canvas = newCanvas(width, height);
            var ctx = context(canvas);
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(image, 0, 0, width, height);
            return canvas;
        },
        rotated: function (image, degrees) {
            var canvas = newCanvas(image.width, image.height);
            var ctx = context(canvas);
            ctx.translate(image.width / 2, image.height / 2);
            ctx.rotate(degrees * Math.PI / 180);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            return canvas;
        },
        mirrored: function (image, horizontal) {
            var canvas = newCanvas(image.width, image.height);
            var ctx = context(canvas);
            if (horizontal) ctx.setTransform(-1, 0, 0, 1, image.width, 0);
            else ctx.setTransform(1, 0, 0, -1, 0, image.height);
            ctx.drawImage(image, 0, 0);
            return canvas;
        },
        drawImage: function (target, image, x, y, alpha) {
            if (alpha <= 0) return;
            var ctx = context(target);
            ctx.globalAlpha = alpha;
            ctx.drawImage(image, x, y);
            ctx.globalAlpha = 1;
        },
        // Java2D's shapes: outlines are drawn on the pixel centres, one pixel wider and taller than the shape
        draw: function (target, color, font, shape, args) {
            var ctx = context(target);
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            var x = args[0], y = args[1], w = args[2], h = args[3];
            ctx.beginPath();
            switch (shape) {
                case 'fillRect': ctx.fillRect(x, y, w, h); return;
                case 'drawRect': ctx.strokeRect(x + 0.5, y + 0.5, w, h); return;
                case 'fillOval': ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.fill(); return;
                case 'drawOval': ctx.ellipse(x + w / 2 + 0.5, y + h / 2 + 0.5, w / 2, h / 2, 0, 0, Math.PI * 2); ctx.stroke(); return;
                case 'drawLine': ctx.moveTo(x + 0.5, y + 0.5); ctx.lineTo(w + 0.5, h + 0.5); ctx.stroke(); return;
                case 'fillPolygon':
                case 'drawPolygon':
                    for (var i = 0; i < args.length; i += 2) {
                        var offset = shape === 'drawPolygon' ? 0.5 : 0;
                        if (i === 0) ctx.moveTo(args[i] + offset, args[i + 1] + offset);
                        else ctx.lineTo(args[i] + offset, args[i + 1] + offset);
                    }
                    ctx.closePath();
                    if (shape === 'fillPolygon') ctx.fill(); else ctx.stroke();
                    return;
            }
        },
        drawString: function (target, color, font, text, x, y) {
            var ctx = context(target);
            ctx.font = font;
            ctx.fillStyle = color;
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(text, x, y);
        },
        textWidth: function (font, text) {
            scratch.font = font;
            return Math.ceil(scratch.measureText(text).width);
        },
        clear: function (target) {
            context(target).clearRect(0, 0, target.width, target.height);
        },
        getPixel: function (image, x, y) {
            var canvas = image instanceof HTMLCanvasElement ? image : GF.copy(image);
            var p = context(canvas).getImageData(x, y, 1, 1).data;
            return ((p[3] << 24) | (p[0] << 16) | (p[1] << 8) | p[2]) | 0;
        },
        setPixel: function (target, x, y, argb) {
            var ctx = context(target);
            var data = ctx.createImageData(1, 1);
            data.data[0] = (argb >> 16) & 255;
            data.data[1] = (argb >> 8) & 255;
            data.data[2] = argb & 255;
            data.data[3] = (argb >>> 24) & 255;
            ctx.putImageData(data, x, y);
        },

        beginPaint: function (width, height, background) {
            if (screen.width !== width || screen.height !== height) {
                screen.width = width;
                screen.height = height;
                if (options.onResize) options.onResize(width, height);
            }
            screenContext.globalAlpha = 1;
            screenContext.setTransform(1, 0, 0, 1, 0, 0);
            screenContext.fillStyle = '#fff';
            screenContext.fillRect(0, 0, width, height);
            if (background) screenContext.drawImage(background, 0, 0);
        },
        paintActor: function (image, x, y, rotation, alpha) {
            if (alpha <= 0) return;
            var ctx = screenContext;
            ctx.globalAlpha = alpha;
            if (rotation === 0) {
                ctx.drawImage(image, Math.floor(x - image.width / 2), Math.floor(y - image.height / 2));
            } else {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(image, Math.floor(-image.width / 2), Math.floor(-image.height / 2));
                ctx.restore();
            }
            ctx.globalAlpha = 1;
        },
        // World.showText: bold white text with a dark outline, centred on the cell
        paintText: function (text, x, y) {
            var ctx = screenContext;
            ctx.font = 'bold 25px Arial, Helvetica, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#fff';
            text.split('\n').forEach(function (line, i, lines) {
                var lineY = y + (i - (lines.length - 1) / 2) * 28;
                ctx.strokeText(line, x, lineY);
                ctx.fillText(line, x, lineY);
            });
            ctx.textAlign = 'start';
        },

        isKeyDown: function (name) {
            return !!(keysDown[name] || keysLatched[name]);
        },
        getKey: function () {
            var key = lastKey;
            lastKey = null;
            return key;
        },
        clearLatchedKeys: function () {
            keysLatched = {};
        },
        takeMouseEvents: function () {
            var events = mouseEvents;
            mouseEvents = [];
            return events;
        },

        // Sounds stream from their own files, so nothing is downloaded until it plays
        sound: function (name) {
            var path = manifest.sounds[name];
            if (!path) {
                console.warn('Greenfoot: no sound named ' + name);
                return null;
            }
            var audio = new Audio();
            audio.preload = 'none';
            audio.src = base + path;
            audio.volume = VOLUME;
            var sound = { audio: audio, volume: 100 };
            audio.addEventListener('ended', function () { if (!audio.loop) forget(playing, sound); });
            return sound;
        },
        playSound: function (sound, loop) {
            if (!soundStarted) {
                soundStarted = true;
                if (options.onSound) options.onSound();
            }
            sound.audio.loop = loop;
            if (sound.audio.ended) sound.audio.currentTime = 0;
            if (playing.indexOf(sound) < 0) playing.push(sound);
            forget(pausedByRun, sound);
            if (sound.audio.paused) startAudio(sound);
        },
        stopSound: function (sound, rewind) {
            sound.audio.pause();
            if (rewind) sound.audio.currentTime = 0;
            forget(playing, sound);
            forget(pausedByRun, sound);
        },
        isSoundPlaying: function (sound) {
            return !sound.audio.paused && !sound.audio.ended;
        },
        setSoundVolume: function (sound, volume) {
            sound.volume = volume;
            sound.audio.volume = Math.max(0, Math.min(1, volume / 100)) * VOLUME;
        }
    };

    window.GF = GF;
})();
