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
    // The title screen, with its attract-mode asteroids drifting; the engine takes a few seconds to load
    { id: 'asteroids', url: '/projects/asteroids/index.html', settle: 8000 },
    // The clouds and balloons bounce in over the first couple of seconds
    { id: 'personal-site', url: '/projects/personal-site/index%20(2).static.html', settle: 3000 },
    // After its loader clears, on the slider's first slide
    { id: 'dan-james', url: '/projects/dan-james/index.static.html', settle: 4000 },
    { id: 'jakes-index', url: '/projects/highschool/flashIndex/FlashIndex.static.html', settle: 5000 },
    // The old phone number and email stay on the page but not on the card, which shows on the board itself
    { id: 'highschool-portfolio', url: '/projects/highschool/oldSite/index.html', settle: 2500, run: "document.getElementById('contact').style.visibility = 'hidden'" },
    { id: 'sketchbook', url: '/projects/sketchbook/index.html', settle: 1500 },
    // Its thumbnails load lazily, which a background tab never gets round to
    { id: 'flash', url: '/projects/flash/index.html', settle: 1500, run: "document.querySelectorAll('img[loading]').forEach((img) => (img.loading = 'eager'))" },
    // The poster frame, with the film's title on the wall
    { id: 'escaping-confinement', url: '/projects/escaping-confinement/index.html', settle: 1500 },
    // Down past the three wide ones, onto the grid of smaller GIFs mid-animation
    { id: 'pivot', url: '/projects/pivot/index.html', settle: 3000, scroll: 2010 },
    { id: 'floor-is-lava', url: '/projects/cs134/floor-is-lava.html#play', settle: 2500 },
    { id: 'scott-pilgrim', url: '/projects/cs134/scott-pilgrim.html', settle: 2500 },
    { id: 'fooder', url: '/projects/fooder/index.html', settle: 1500 },
    { id: 'survivor', url: '/projects/survivor/index.html', settle: 1500 },
    // On the slideshow's first slide
    { id: 'team-safe', url: '/projects/motorsport/team-safe/About.html', settle: 2500 },
    { id: 'worxxx', url: '/projects/motorsport/worxxx/index.static.html', settle: 2500 },
    // The page opens on just its header; the About panel has his photo and story
    { id: 'noah-garza', url: '/projects/motorsport/noah-garza/index.static.html', settle: 2500, width: 1000, run: 'aboutDiv()' },
    // The Java games: their pages before Play, with the title-screen poster (the game itself is black until Run)
    { id: 'coloris', url: '/projects/coloris/index.html', settle: 2000 },
    { id: 'isguy', url: '/projects/isguy/index.html', settle: 2000 },
    { id: 'greenfoot-pokemon', url: '/projects/greenfoot-pokemon/index.html', settle: 2000 },
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
            { format: 'webp', quality: QUALITY, clip: { x: 0, y: scrolled.value, ...viewport, scale: OUTPUT_WIDTH / viewport.width }, captureBeyondViewport: false },
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
