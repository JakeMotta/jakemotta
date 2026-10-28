#!/usr/bin/env node
// Screenshots each project's running preview for its card on the home page.
//
//   yarn projects:screenshot              every project in SHOTS
//   yarn projects:screenshot cs160 ambii  only these
//
// Needs `yarn dev` running for the previews under /projects/ (or BASE_URL pointing at a
// server that has them), and Chrome, Edge or Brave installed (or CHROME_PATH set). It drives
// the browser headless over the DevTools protocol with Node's built-in WebSocket, so there
// is nothing to install.
//
// Each shot is taken in a 4:3 viewport, the cards' shape, 1280×960 unless the shot says
// otherwise, and saved at 960×720 as WebP: sharp at twice the size a card is drawn on a
// desktop screen, and around 20–100 KB.
// Output goes to public/images/projects/<id>.webp, the path `image` names in
// homeProjectList (src/common/constants.ts).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'projects');
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const DEFAULT_WIDTH = 1280;
const OUTPUT_WIDTH = 960;
const QUALITY = 85;

// What to shoot for each card. `url` is a path on BASE_URL or a full address; `settle` is how
// long to wait after the page loads, for web fonts, Ruffle's Flash and animations to get going.
// `width` narrows the viewport for a fixed-width site that would otherwise sit in empty
// margins; `scroll` moves the page down first, for a site whose best view isn't at the top;
// `run` is a line of script run once the page loads, to open a panel or hide something.
// `clip` shoots just one element, for the games, so the card is the game and not its page:
// `selector` names it, `inset` ([top, right, bottom, left], in CSS pixels) trims more off
// it, and the card is the largest 4:3 area left, placed by `focus` ([x, y], 0 to 1, centred
// by default), scaled to 960×720. The element's own border is left out, and the rounded
// corners of it and its frames are squared off first, so no page shows in the corners.
const SHOTS = [
    // The 2018 landing page rather than the story page in front of it
    { id: 'ambii', url: '/projects/ambii/index.html', settle: 2500 },
    { id: 'black-chamber', url: '/projects/black-chamber/index.html', settle: 2500, width: 1140 },
    { id: 'pistol-art', url: '/projects/pistol-art/index.html', settle: 2000 },
    { id: 'ninjadonut', url: '/projects/ninja-donut/index.html', settle: 5000, width: 960 },
    // The hub, with a tile for each of the three apps
    { id: 'ambii-business', url: '/projects/ambii-business/index.html', settle: 1500 },
    // Mid-animation, so the face mesh is drawn
    { id: 'cs160', url: '/projects/cs160/index.html', settle: 3500 },
    { id: 'tapslaydie', url: 'https://tapslaydie.com/', settle: 4000 },
    // The title screen, with its attract-mode asteroids drifting; the engine takes a few seconds to load. Its canvas
    // fills the page, so the page is already just the game.
    { id: 'asteroids', url: '/projects/asteroids/index.html', settle: 8000 },
    // The clouds and balloons bounce in over the first couple of seconds
    { id: 'personal-site', url: '/projects/personal-site/index%20(2).static.html', settle: 3000 },
    // After its loader clears, on the slider's first slide
    { id: 'dan-james', url: '/projects/dan-james/index.static.html', settle: 4000 },
    { id: 'jakes-index', url: '/projects/highschool/flashIndex/FlashIndex.static.html', settle: 5000 },
    // The old phone number and email stay on the page but not on the card, which shows on the board itself
    { id: 'highschool-portfolio', url: '/projects/highschool/oldSite/index.static.html', settle: 2500, run: "document.getElementById('contact').style.visibility = 'hidden'" },
    { id: 'sketchbook', url: '/projects/sketchbook/index.html', settle: 1500 },
    // Its thumbnails load lazily, which a background tab never gets round to
    { id: 'flash', url: '/projects/flash/index.html', settle: 1500, run: "document.querySelectorAll('img[loading]').forEach((img) => (img.loading = 'eager'))" },
    // The poster frame, with the film's title on the wall
    { id: 'escaping-confinement', url: '/projects/escaping-confinement/index.html', settle: 1500 },
    // Down past the three wide ones, onto the grid of smaller GIFs mid-animation
    { id: 'pivot', url: '/projects/pivot/index.html', settle: 3000, scroll: 2010 },
    // The game is portrait, so the card is its bottom: the miner on the bricks over the lava
    { id: 'floor-is-lava', url: '/projects/cs134/floor-is-lava.html#play', settle: 2500, clip: { selector: 'canvas', focus: [0.5, 1] } },
    // The recording itself, without the page around it
    { id: 'scott-pilgrim', url: '/projects/cs134/scott-pilgrim.html', settle: 2500, clip: { selector: 'video.screen' } },
    { id: 'fooder', url: '/projects/fooder/index.html', settle: 1500 },
    // The start screen, once a name is in: the red title over the square, without the page's instructions and leaderboard
    {
        id: 'psycho',
        url: '/projects/psycho/play.html',
        settle: 1500,
        clip: { selector: 'canvas#context', focus: [0.5, 0.55] },
        run: "document.getElementById('name').value = 'Jake'; document.querySelector('.addValue').click()",
    },
    // On the slideshow's first slide
    { id: 'team-safe', url: '/projects/motorsport/team-safe/About.html', settle: 2500 },
    // The Greenfoot games: just the running game (#play starts it without a click), cropped to 4:3
    { id: 'coloris', url: '/projects/coloris/index.html#play', settle: 2000, clip: { selector: '#frame canvas' } },
    // The title screen, once its opening wipe has passed; the world is 4:3 already
    { id: 'isguy', url: '/projects/isguy/index.html#play', settle: 5000, clip: { selector: '#frame canvas' } },
    // Ten seconds in, once enemy donuts have had time to run in at the ninja in the middle (they come at random)
    { id: 'ninjadonut-game', url: '/projects/ninjadonut-game/index.html#play', settle: 10000, clip: { selector: '#frame canvas' } },
    // TrainingVille, the 800×600 town: Space past the title, Enter for the starter the pointer is on, then the town
    {
        id: 'greenfoot-pokemon',
        url: '/projects/greenfoot-pokemon/index.html#play',
        settle: 7000,
        run: "(async () => { const press = async (key, code) => { window.dispatchEvent(new KeyboardEvent('keydown', { key, code })); await new Promise((r) => setTimeout(r, 100)); window.dispatchEvent(new KeyboardEvent('keyup', { key, code })); await new Promise((r) => setTimeout(r, 1200)); }; while (!document.documentElement.classList.contains('game-ready')) await new Promise((r) => setTimeout(r, 50)); await press(' ', 'Space'); await press('Enter', 'Enter'); })()",
        clip: { selector: '#frame canvas' },
    },
    // Mid-shot, with the ball's trail behind it: aim down and to the right, then click. A synthetic pointer can't be
    // captured, so capture is stubbed out first, or the host's press handler would throw before recording the click.
    {
        id: 'rebound',
        url: '/projects/rebound/index.html#play',
        settle: 1700,
        // The left of the world, where the ball, its trail and the target are
        clip: { selector: '#frame canvas', focus: [0, 0.5] },
        run: "const q = () => document.querySelector('#frame canvas'), p = (type) => { const c = q(), b = c.getBoundingClientRect(); c.setPointerCapture = () => {}; c.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse', clientX: b.left + (420 * b.width) / 600, clientY: b.top + (330 * b.height) / 400, buttons: type === 'pointerdown' ? 1 : 0, bubbles: true })); }; setTimeout(() => p('pointermove'), 800); setTimeout(() => p('pointerdown'), 1000)",
    },
];

const fail = (message) => {
    console.error(`screenshot-projects: ${message}`);
    process.exit(1);
};

const findBrowser = () => {
    if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
    const candidates = {
        win32: [
            'C:/Program Files/Google/Chrome/Application/chrome.exe',
            'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
            'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
        ],
        darwin: [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
            '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
        ],
        linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'],
    }[process.platform] ?? [];
    return candidates.find((path) => existsSync(path)) ?? fail('no Chrome, Edge or Brave found; set CHROME_PATH');
};

const launch = (executable, profile) =>
    new Promise((done, reject) => {
        const browser = spawn(executable, [
            '--headless=new',
            '--remote-debugging-port=0',
            `--user-data-dir=${profile}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--hide-scrollbars',
            '--mute-audio',
            // Without a click, Ruffle would wait behind its play button instead of starting the movie
            '--autoplay-policy=no-user-gesture-required',
            'about:blank',
        ]);
        let log = '';
        const timer = setTimeout(() => reject(new Error(`browser did not start:\n${log}`)), 20000);
        browser.stderr.on('data', (chunk) => {
            log += chunk;
            const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
            if (match) {
                clearTimeout(timer);
                done({ browser, endpoint: match[1] });
            }
        });
        browser.on('error', reject);
    });

// A minimal DevTools protocol client: one socket, flattened sessions, promises keyed by id.
const connect = (endpoint) =>
    new Promise((done, reject) => {
        const socket = new WebSocket(endpoint);
        const pending = new Map();
        const listeners = new Set();
        let nextId = 0;
        socket.onmessage = ({ data }) => {
            const message = JSON.parse(data);
            if (message.id && pending.has(message.id)) {
                const { resolve: settle, reject: refuse } = pending.get(message.id);
                pending.delete(message.id);
                message.error ? refuse(new Error(message.error.message)) : settle(message.result);
            } else listeners.forEach((listener) => listener(message));
        };
        socket.onerror = reject;
        socket.onopen = () =>
            done({
                send: (method, params = {}, sessionId) =>
                    new Promise((settle, refuse) => {
                        const id = ++nextId;
                        pending.set(id, { resolve: settle, reject: refuse });
                        socket.send(JSON.stringify({ id, method, params, sessionId }));
                    }),
                once: (method, sessionId, timeout) =>
                    new Promise((settle) => {
                        const listener = (message) => {
                            if (message.method === method && message.sessionId === sessionId) finish();
                        };
                        const finish = () => {
                            listeners.delete(listener);
                            clearTimeout(timer);
                            settle();
                        };
                        // Some pages never fire load (a stalled third-party request); shoot anyway
                        const timer = setTimeout(finish, timeout);
                        listeners.add(listener);
                    }),
                close: () => socket.close(),
            });
    });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

// The largest 4:3 area of an element (less its inset), in document coordinates, scaled to the card's width
const clipOf = async (cdp, sessionId, { selector, inset = [0, 0, 0, 0], focus = [0.5, 0.5] }) => {
    const { result } = await cdp.send(
        'Runtime.evaluate',
        {
            expression: `(() => {
                const e = document.querySelector(${JSON.stringify(selector)});
                if (!e) return null;
                for (let n = e; n && n !== document.body; n = n.parentElement) n.style.borderRadius = '0';
                const b = e.getBoundingClientRect();
                return [b.left + scrollX + e.clientLeft, b.top + scrollY + e.clientTop, e.clientWidth, e.clientHeight];
            })()`,
            returnByValue: true,
        },
        sessionId,
    );
    if (!result.value) throw new Error(`nothing matches ${selector}`);
    const [left, top, width, height] = result.value;
    const box = { x: left + inset[3], y: top + inset[0], width: width - inset[1] - inset[3], height: height - inset[0] - inset[2] };
    const w = Math.min(box.width, (box.height * 4) / 3);
    const h = (w * 3) / 4;
    return { x: box.x + (box.width - w) * focus[0], y: box.y + (box.height - h) * focus[1], width: w, height: h, scale: OUTPUT_WIDTH / w };
};

const shoot = async (cdp, shot) => {
    const url = /^https?:/.test(shot.url) ? shot.url : `${BASE_URL}${shot.url}`;
    const viewport = { width: shot.width ?? DEFAULT_WIDTH, height: Math.round(((shot.width ?? DEFAULT_WIDTH) * 3) / 4) };
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    try {
        await cdp.send('Page.enable', {}, sessionId);
        await cdp.send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false }, sessionId);
        const loaded = cdp.once('Page.loadEventFired', sessionId, 30000);
        const { errorText } = await cdp.send('Page.navigate', { url }, sessionId);
        if (errorText) throw new Error(`${url}: ${errorText}`);
        await loaded;
        if (shot.run) await cdp.send('Runtime.evaluate', { expression: shot.run }, sessionId);
        if (shot.scroll) await cdp.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${shot.scroll})` }, sessionId);
        await sleep(shot.settle);
        // The clip is measured from the top of the document, so it starts where the page scrolled to
        const { result: scrolled } = await cdp.send('Runtime.evaluate', { expression: 'window.scrollY' }, sessionId);

        // The dev server answers a missing page with this site's React app instead of a 404
        if (!/^https?:/.test(shot.url)) {
            const { result } = await cdp.send('Runtime.evaluate', { expression: '!!document.querySelector(\'script[src*="/static/js/"]\')' }, sessionId);
            if (result.value) throw new Error(`${url} answered with the site's own app; is the preview missing?`);
        }

        const { data } = await cdp.send(
            'Page.captureScreenshot',
            shot.clip
                ? { format: 'webp', quality: QUALITY, clip: await clipOf(cdp, sessionId, shot.clip), captureBeyondViewport: true }
                : { format: 'webp', quality: QUALITY, clip: { x: 0, y: scrolled.value, ...viewport, scale: OUTPUT_WIDTH / viewport.width }, captureBeyondViewport: false },
            sessionId,
        );
        const file = join(OUT_DIR, `${shot.id}.webp`);
        writeFileSync(file, Buffer.from(data, 'base64'));
        return { file, bytes: Buffer.byteLength(data, 'base64') };
    } finally {
        await cdp.send('Target.closeTarget', { targetId }).catch(() => {});
    }
};

const only = process.argv.slice(2);
const shots = only.length ? SHOTS.filter((shot) => only.includes(shot.id)) : SHOTS;
const unknown = only.filter((id) => !SHOTS.some((shot) => shot.id === id));
if (unknown.length) fail(`no shot defined for ${unknown.join(', ')}; add it to SHOTS`);

const local = shots.some((shot) => !/^https?:/.test(shot.url));
if (local) {
    const reachable = await fetch(BASE_URL).then((response) => response.ok, () => false);
    if (!reachable) fail(`${BASE_URL} is not answering; start \`yarn dev\` or set BASE_URL`);
}

mkdirSync(OUT_DIR, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'project-shots-'));
const { browser, endpoint } = await launch(findBrowser(), profile);
const cdp = await connect(endpoint);
let failed = 0;
try {
    for (const shot of shots) {
        try {
            const { bytes } = await shoot(cdp, shot);
            console.log(`  ${shot.id.padEnd(20)} public/images/projects/${shot.id}.webp  ${Math.round(bytes / 1024)} KB`);
        } catch (error) {
            failed++;
            console.error(`  ${shot.id.padEnd(20)} FAILED: ${error.message}`);
        }
    }
} finally {
    cdp.close();
    browser.kill();
    await sleep(500);
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
process.exit(failed ? 1 : 0);
