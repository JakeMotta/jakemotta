/*
 * Face Me: live face plot.
 *
 * Browser-side stand-in for the project's delaunay.cpp. The original ran once per
 * extracted video frame: it read the 68 OpenFace landmarks from <id>.<frame>_det_0.pts,
 * inserted them into an OpenCV Subdiv2D, drew the Delaunay triangles in blue and the
 * points as red dots, and saved the frame; ffmpeg then stitched the frames into
 * OUTPUT.webm at 30 fps. Here the same landmark data (js/landmarks.js, generated from
 * faceme/data_points/) is triangulated with Bowyer-Watson and drawn on a <canvas>.
 *
 * No server, no network: everything runs from the data already loaded on the page.
 */
(function () {
    'use strict';

    // ---------- Delaunay triangulation (Bowyer-Watson) ----------

    function circumcircle(ax, ay, bx, by, cx, cy) {
        var d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        if (Math.abs(d) < 1e-12) return null;
        var a2 = ax * ax + ay * ay, b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
        var ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
        var uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
        var dx = ax - ux, dy = ay - uy;
        return { x: ux, y: uy, r2: dx * dx + dy * dy };
    }

    // pts: flat [x0, y0, x1, y1, ...]. Returns a flat list of vertex indices, 3 per triangle.
    function triangulate(pts) {
        var n = pts.length / 2;
        var xs = [], ys = [];
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var i = 0; i < n; i++) {
            var x = pts[2 * i], y = pts[2 * i + 1];
            xs.push(x);
            ys.push(y);
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
        // A super-triangle that contains every point (like Subdiv2D's outer vertices).
        var dm = Math.max(maxX - minX, maxY - minY) || 1;
        var mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
        xs.push(mx - 20 * dm, mx, mx + 20 * dm);
        ys.push(my - dm, my + 20 * dm, my - dm);

        function makeTri(a, b, c) {
            return { a: a, b: b, c: c, cc: circumcircle(xs[a], ys[a], xs[b], ys[b], xs[c], ys[c]) };
        }

        var tris = [makeTri(n, n + 1, n + 2)];
        for (var p = 0; p < n; p++) {
            var px = xs[p], py = ys[p];
            var bad = [], keep = [];
            for (var t = 0; t < tris.length; t++) {
                var cc = tris[t].cc;
                var ddx = px - (cc ? cc.x : 0), ddy = py - (cc ? cc.y : 0);
                if (!cc || ddx * ddx + ddy * ddy < cc.r2) bad.push(tris[t]);
                else keep.push(tris[t]);
            }
            // Boundary of the hole: edges that belong to exactly one bad triangle.
            var edges = {};
            for (var k = 0; k < bad.length; k++) {
                var tr = bad[k];
                [[tr.a, tr.b], [tr.b, tr.c], [tr.c, tr.a]].forEach(function (e) {
                    var key = e[0] < e[1] ? e[0] + ',' + e[1] : e[1] + ',' + e[0];
                    if (edges[key]) edges[key].count++;
                    else edges[key] = { e: e, count: 1 };
                });
            }
            Object.keys(edges).forEach(function (key) {
                if (edges[key].count === 1) keep.push(makeTri(edges[key].e[0], edges[key].e[1], p));
            });
            tris = keep;
        }
        var out = [];
        for (var j = 0; j < tris.length; j++) {
            var tt = tris[j];
            // Like draw_delaunay(): skip triangles that touch the outer (virtual) vertices.
            if (tt.a < n && tt.b < n && tt.c < n) out.push(tt.a, tt.b, tt.c);
        }
        return out;
    }

    // ---------- Landmark data ----------

    function loadData() {
        var raw = window.FACEME_LANDMARKS;
        if (!raw || !raw.frames || !raw.frames.length) return null;
        var byFrame = [];
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        raw.frames.forEach(function (f) {
            byFrame[f[0]] = { n: f[0], pts: f[1], pose: f[2], tris: null };
            for (var i = 0; i < f[1].length; i += 2) {
                minX = Math.min(minX, f[1][i]);
                maxX = Math.max(maxX, f[1][i]);
                minY = Math.min(minY, f[1][i + 1]);
                maxY = Math.max(maxY, f[1][i + 1]);
            }
        });
        // For every frame number, the nearest detected frame at or before it
        // (OpenFace found no face in a few frames; those hold the previous result).
        var shown = [], last = raw.frames[0][0];
        for (var n = 1; n <= raw.lastFrame; n++) {
            if (byFrame[n]) last = n;
            shown[n] = last;
        }
        return {
            fps: raw.fps || 30,
            lastFrame: raw.lastFrame,
            detected: raw.frames.length,
            byFrame: byFrame,
            shown: shown,
            bounds: { minX: minX, minY: minY, maxX: maxX, maxY: maxY },
        };
    }

    var DATA = null;
    function data() {
        if (!DATA) DATA = loadData();
        return DATA;
    }

    function trianglesFor(frame) {
        if (!frame.tris) frame.tris = triangulate(frame.pts);
        return frame.tris;
    }

    // ---------- Drawing ----------

    var COLORS = {
        background: '#F0F0F0',
        mesh: 'rgb(0, 0, 255)', // delaunay_color(255,0,0) in OpenCV's BGR order
        point: 'rgb(255, 0, 0)', // points_color(0,0,255) in BGR
        text: '#757671',
    };

    function drawFrame(canvas, frameNumber, opts) {
        var d = data();
        if (!d) return;
        opts = opts || {};
        var ctx = canvas.getContext('2d');
        var w = canvas.width, h = canvas.height;
        var dpr = canvas._dpr || 1;
        var frame = d.byFrame[d.shown[frameNumber]];
        var held = d.shown[frameNumber] !== frameNumber;

        // Fixed view over all frames, so head movement shows as movement.
        var b = d.bounds, pad = 4;
        var bw = b.maxX - b.minX + 2 * pad, bh = b.maxY - b.minY + 2 * pad;
        var s = Math.min(w / bw, h / bh);
        var ox = (w - bw * s) / 2 - (b.minX - pad) * s;
        var oy = (h - bh * s) / 2 - (b.minY - pad) * s;

        ctx.fillStyle = COLORS.background;
        ctx.fillRect(0, 0, w, h);

        var p = frame.pts;
        if (opts.mesh !== false) {
            var t = trianglesFor(frame);
            ctx.beginPath();
            for (var i = 0; i < t.length; i += 3) {
                var a = t[i] * 2, c = t[i + 1] * 2, e = t[i + 2] * 2;
                ctx.moveTo(p[a] * s + ox, p[a + 1] * s + oy);
                ctx.lineTo(p[c] * s + ox, p[c + 1] * s + oy);
                ctx.lineTo(p[e] * s + ox, p[e + 1] * s + oy);
                ctx.closePath();
            }
            ctx.strokeStyle = COLORS.mesh;
            ctx.lineWidth = Math.max(1, dpr);
            ctx.globalAlpha = held ? 0.45 : 1;
            ctx.stroke();
        }
        if (opts.points !== false) {
            ctx.fillStyle = COLORS.point;
            var r = Math.max(2, 2.5 * dpr * (w / dpr / 434));
            for (var j = 0; j < p.length; j += 2) {
                ctx.beginPath();
                ctx.arc(p[j] * s + ox, p[j + 1] * s + oy, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
        if (opts.label !== false) {
            ctx.fillStyle = COLORS.text;
            ctx.font = 'bold ' + 11 * dpr + "px 'Noto Sans', sans-serif";
            ctx.textBaseline = 'top';
            ctx.fillText('frame ' + frameNumber + ' / ' + d.lastFrame + (held ? '  (no face found, holding last)' : ''), 8 * dpr, 8 * dpr);
        }
    }

    function sizeCanvas(canvas, cssWidth, cssHeight) {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas._dpr = dpr;
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
    }

    // A still frame, e.g. for a thumbnail in My Videos.
    function still(canvas, frameNumber, cssWidth, cssHeight) {
        if (!data()) return;
        sizeCanvas(canvas, cssWidth, cssHeight);
        drawFrame(canvas, frameNumber || 1, { label: false });
    }

    // ---------- Player ----------

    function el(tag, attrs, text) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            node.setAttribute(k, attrs[k]);
        });
        if (text) node.textContent = text;
        return node;
    }

    function mount(container, options) {
        options = options || {};
        var d = data();
        if (!d) {
            container.textContent = 'Landmark data failed to load.';
            return null;
        }
        container.classList.add('faceplot');

        var canvas = el('canvas', { class: 'faceplot-canvas', role: 'img', 'aria-label': 'Animated face mesh: 68 facial landmarks joined by a Delaunay triangulation, frame by frame' });
        var controls = el('div', { class: 'faceplot-controls' });
        var playBtn = el('button', { type: 'button', class: 'faceplot-play class-hover-effect', 'aria-label': 'Pause' }, 'Pause');
        var scrub = el('input', { type: 'range', min: '1', max: String(d.lastFrame), value: '1', step: '1', class: 'faceplot-scrub', 'aria-label': 'Frame' });
        var meshLabel = el('label', { class: 'faceplot-toggle' });
        var meshBox = el('input', { type: 'checkbox' });
        meshBox.checked = true;
        meshLabel.appendChild(meshBox);
        meshLabel.appendChild(document.createTextNode(' Mesh'));
        var ptsLabel = el('label', { class: 'faceplot-toggle' });
        var ptsBox = el('input', { type: 'checkbox' });
        ptsBox.checked = true;
        ptsLabel.appendChild(ptsBox);
        ptsLabel.appendChild(document.createTextNode(' Points'));
        controls.appendChild(playBtn);
        controls.appendChild(scrub);
        controls.appendChild(meshLabel);
        controls.appendChild(ptsLabel);
        container.appendChild(canvas);
        container.appendChild(controls);

        var frame = 1, playing = options.autoplay !== false, lastTime = 0, acc = 0;
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion && options.autoplay !== true) playing = false;

        function render() {
            drawFrame(canvas, frame, { mesh: meshBox.checked, points: ptsBox.checked });
            scrub.value = String(frame);
        }

        function resize() {
            var width = container.clientWidth || 434;
            sizeCanvas(canvas, width, Math.round((width * 3) / 4));
            canvas.style.height = Math.round((width * 3) / 4) + 'px';
            render();
        }

        function setPlaying(on) {
            playing = on;
            playBtn.textContent = on ? 'Pause' : 'Play';
            playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play');
            lastTime = 0;
            acc = 0;
        }

        function tick(time) {
            if (playing) {
                if (lastTime) acc += time - lastTime;
                lastTime = time;
                var step = 1000 / d.fps;
                if (acc >= step) {
                    var advance = Math.min(Math.floor(acc / step), 5);
                    acc -= advance * step;
                    frame = ((frame - 1 + advance) % d.lastFrame) + 1;
                    render();
                }
            }
            requestAnimationFrame(tick);
        }

        playBtn.addEventListener('click', function () {
            setPlaying(!playing);
        });
        scrub.addEventListener('input', function () {
            setPlaying(false);
            frame = parseInt(scrub.value, 10) || 1;
            render();
        });
        meshBox.addEventListener('change', render);
        ptsBox.addEventListener('change', render);
        window.addEventListener('resize', resize);

        setPlaying(playing);
        resize();
        requestAnimationFrame(tick);
        return {
            play: function () { setPlaying(true); },
            pause: function () { setPlaying(false); },
            seek: function (n) { frame = Math.max(1, Math.min(d.lastFrame, n)); render(); },
        };
    }

    window.FacePlot = { mount: mount, still: still, triangulate: triangulate, data: data };
})();
