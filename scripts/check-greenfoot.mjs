#!/usr/bin/env node
// Smoke-tests compiled Greenfoot games (docs/projects/greenfoot-web.md, Converting a game): opens each game's page
// in headless Chrome, presses Play with a real click, holds the keys given, and reports how long it took to start,
// how fast it runs, how busy the page is, the sounds it played and any errors, with a screenshot of the game.
//
//   yarn projects:greenfoot-check <id>[,<id>…] [--keys ArrowRight:1500,Space:100] [--wait 3000]
//
// Needs `yarn dev` running (or BASE_URL), and Chrome, Edge or Brave (or CHROME_PATH), like yarn projects:screenshot.
// Run it in a foreground terminal: a background tab is throttled and would read as slow.
//
// What it reports:
// - ready: seconds from the click on Play until the page marks itself game-ready;
// - acts/s: how often each key is checked with Greenfoot.isKeyDown, which every game here does once an act for its
//   controls, so the most-checked key is the act rate (a key checked by two actors reads double);
// - frames/s: animation frames the page drew, and busy: the share of the time the main thread worked;
// - sounds: each media file the game started, and whether the browser let it play;
// - errors: console errors, uncaught exceptions and the page's own error box.
// Screenshots go to the system temp folder, named after the game.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const KEY_CODES = { ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Space: 32, Enter: 13, ShiftLeft: 16, Escape: 27 };

const fail = (message) => {
    console.error(`check-greenfoot: ${message}`);
    process.exit(1);
};

const args = process.argv.slice(2);
const option = (flag, fallback) => {
    const at = args.indexOf(flag);
    return at >= 0 ? args.splice(at, 2)[1] : fallback;
};
const keys = option('--keys', '')
    .split(',')
    .filter(Boolean)
    .map((pair) => {
        const [code, ms] = pair.split(':');
        return { code, ms: Number(ms) || 200 };
    });
const wait = Number(option('--wait', '3000'));
const ids = args.flatMap((arg) => arg.split(',')).filter(Boolean);
if (!ids.length) fail('usage: yarn projects:greenfoot-check <id>[,<id>…] [--keys ArrowRight:1500,Space:100] [--wait 3000]');

const browserPath =
    process.env.CHROME_PATH ||
    [
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
    ].find((path) => existsSync(path)) ||
    fail('no Chrome, Edge or Brave found; set CHROME_PATH');

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const profile = mkdtempSync(join(tmpdir(), 'greenfoot-check-'));
const browser = spawn(browserPath, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--mute-audio', 'about:blank']);
const endpoint = await new Promise((done, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error(`browser did not start:\n${log}`)), 20000);
    browser.stderr.on('data', (chunk) => {
        log += chunk;
        const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) {
            clearTimeout(timer);
            done(match[1]);
        }
    });
});

const socket = new WebSocket(endpoint);
await new Promise((done) => (socket.onopen = done));
let nextId = 0;
const pending = new Map();
const events = [];
socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    } else events.push(message);
};
const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, sessionId }));
    });

// Records every media file the page starts, and whether the browser let it play
const RECORD_SOUNDS = `window.__sounds = [];
const play = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function () {
    const name = decodeURIComponent((this.currentSrc || this.src).split('/').pop());
    const result = play.apply(this, arguments);
    if (result && result.then) result.then(() => window.__sounds.push(name + ' played'), (e) => window.__sounds.push(name + ' refused (' + e.name + ')'));
    return result;
};`;

// Counts isKeyDown checks per key and animation frames over a stretch of time
const MEASURE = (ms) => `new Promise((done) => {
    const counts = {}, real = GF.isKeyDown; let frames = 0;
    GF.isKeyDown = function (key) { counts[key] = (counts[key] || 0) + 1; return real.apply(this, arguments); };
    const start = performance.now();
    (function tick(now) {
        frames++;
        if (now - start < ${ms}) return requestAnimationFrame(tick);
        GF.isKeyDown = real;
        const seconds = (now - start) / 1000;
        done({ acts: Math.max(0, ...Object.values(counts)) / seconds, frames: frames / seconds });
    })(start);
})`;

let failed = 0;
for (const id of ids) {
    const errors = [];
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId: s } = await send('Target.attachToTarget', { targetId, flatten: true });
    const js = async (expression) => {
        const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, s);
        if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
        return result.value;
    };
    try {
        await send('Page.enable', {}, s);
        await send('Runtime.enable', {}, s);
        await send('Performance.enable', {}, s);
        await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false }, s);
        await send('Page.addScriptToEvaluateOnNewDocument', { source: RECORD_SOUNDS }, s);
        const from = events.length;
        await send('Page.navigate', { url: `${BASE_URL}/projects/${id}/index.html` }, s);
        let play = null;
        for (let i = 0; i < 100 && !play; i++) {
            await sleep(100);
            play = await js(`(() => { const b = document.getElementById('play'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`).catch(() => null);
        }
        if (!play) throw new Error(`no Play button on /projects/${id}/index.html; is it a compiled Greenfoot page?`);

        // A real click, so the browser counts it as the visitor's gesture and lets sound start
        const clicked = Date.now();
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: play[0], y: play[1], button: 'left', clickCount: 1 }, s);
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: play[0], y: play[1], button: 'left', clickCount: 1 }, s);
        let ready = false;
        for (let i = 0; i < 300 && !ready; i++) {
            await sleep(50);
            ready = await js(`document.documentElement.classList.contains('game-ready')`);
        }
        const readyAfter = (Date.now() - clicked) / 1000;
        const world = ready ? await js(`(() => { const c = document.querySelector('#frame canvas'); return c ? c.width + '×' + c.height : '?'; })()`) : '?';

        for (const { code, ms } of keys) {
            const key = code.startsWith('Key') ? code.slice(3).toLowerCase() : code.startsWith('Digit') ? code.slice(5) : code === 'Space' ? ' ' : code;
            const vk = KEY_CODES[code] || (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0);
            await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key, windowsVirtualKeyCode: vk }, s);
            await sleep(ms);
            await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key, windowsVirtualKeyCode: vk }, s);
        }

        const metrics = async () => Object.fromEntries((await send('Performance.getMetrics', {}, s)).metrics.map((m) => [m.name, m.value]));
        const before = await metrics();
        const measured = ready ? await js(MEASURE(wait)) : { acts: 0, frames: 0 };
        const after = await metrics();
        const busy = (100 * (after.TaskDuration - before.TaskDuration)) / (wait / 1000);

        const { data } = await send('Page.captureScreenshot', { format: 'png' }, s);
        const shot = join(tmpdir(), `greenfoot-check-${id}.png`);
        writeFileSync(shot, Buffer.from(data, 'base64'));

        const errorBox = await js(`(document.querySelector('#frame .loading') || {}).textContent || ''`);
        if (errorBox && ready) errors.push(`error box: ${errorBox}`);
        for (const event of events.slice(from)) {
            if (event.sessionId !== s) continue;
            if (event.method === 'Runtime.exceptionThrown') errors.push(event.params.exceptionDetails.exception?.description || event.params.exceptionDetails.text);
            if (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error') errors.push(event.params.args.map((a) => a.value ?? a.description).join(' '));
        }
        const sounds = await js('window.__sounds');

        console.log(`${id}: ${ready ? `ready ${readyAfter.toFixed(1)} s after Play` : 'NOT READY after 15 s'}, world ${world}`);
        const acts = measured.acts ? `${measured.acts.toFixed(1)} acts/s` : 'acts/s unknown (nothing checked a key on this screen)';
        console.log(`  ${acts}, ${measured.frames.toFixed(1)} frames/s, main thread ${Math.round(busy)}% busy`);
        console.log(`  sounds: ${sounds.length ? sounds.join(', ') : 'none'}`);
        console.log(`  errors: ${errors.length ? '\n    ' + errors.map((e) => String(e).slice(0, 300)).join('\n    ') : 'none'}`);
        console.log(`  screenshot: ${shot}`);
        if (!ready || errors.length) failed++;
    } catch (error) {
        failed++;
        console.error(`${id}: FAILED: ${error.message}`);
    } finally {
        await send('Target.closeTarget', { targetId }).catch(() => {});
    }
}
socket.close();
browser.kill();
await sleep(500);
try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
} catch {}
process.exit(failed ? 1 : 0);
