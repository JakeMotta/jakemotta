// Announcement music beds: the generated files and core/bed-data.js, and speakAnnouncement()'s timeline
// (bed in, the voice after the lead, the bed on for the tail) with fake Web Audio and speechSynthesis.
// Each test imports a fresh copy of browser/tts.js, which keeps its AudioContext and hooks in module state.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BED_MEDIA } from '../core/bed-data.js';
import { mp3Duration } from '../core/mp3.js';
import { API_BASE } from '../config.js';

var PUBLIC = fileURLToPath(new URL('../../../../public', import.meta.url));
var NAMES = { 2: 'Smooth', 3: 'Bright', 4: 'Light', 5: 'Distinct', 6: 'Mellow' };
var FAST = { lead: 0.15, tail: 0.2, fade: 0.1, level: 0.4, switchFade: 0.05, stopFade: 0.02, loadTimeout: 1 };

function wait(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

test('the five beds exist, each a whole loop of 20 to 30 s with room either side of its loop points', () => {
  assert.deepEqual(Object.keys(BED_MEDIA).sort(), ['2', '3', '4', '5', '6']);
  Object.keys(BED_MEDIA).forEach(function (n) {
    var b = BED_MEDIA[n], file = PUBLIC + b.url;
    assert.equal(b.name, NAMES[n]);
    assert.equal(b.url, '/projects/ambii-business/media/beds/' + n + '.mp3');
    assert.ok(existsSync(file), b.url);
    assert.ok(statSync(file).size < 400 * 1024, b.url + ' is ' + statSync(file).size + ' bytes');
    assert.ok(b.duration >= 20 && b.duration <= 30, n + ': ' + b.duration);
    assert.ok(Math.abs(b.loopEnd - b.loopStart - b.duration) < 1e-9, n + ' loop window');
    assert.ok(b.loopStart >= 0.25, n + ' loopStart leaves room for the encoder delay');
    // A whole number of MP3 frames, so every turn encodes (and decodes) to the same samples, and a whole number
    // of samples at 48 kHz, so a browser resampling to that rate loops it sample for sample too.
    var frames = (b.duration * 44100) / 1152;
    assert.ok(Math.abs(frames - Math.round(frames)) < 1e-6, n + ': ' + frames + ' frames');
    [b.loopStart, b.loopEnd].forEach(function (t) {
      assert.ok(Math.abs(t * 48000 - Math.round(t * 48000)) < 1e-6, n + ': ' + t + ' s at 48 kHz');
      assert.ok(Math.abs(t * 44100 - Math.round(t * 44100)) < 1e-6, n + ': ' + t + ' s at 44.1 kHz');
    });
    var seconds = mp3Duration(readFileSync(file));
    assert.ok(seconds >= b.loopEnd + 0.3, n + ': file ' + seconds + ' s, loop ends at ' + b.loopEnd);
  });
});

// ---------- fakes ----------

function fakeEnv(opts) {
  var o = opts || {};
  var log = { fetches: [], sources: [], gains: [], contexts: [], suspends: 0, resumes: 0, spoken: [], cancels: 0 };

  function Param(v) {
    this.value = v;
    this.events = [];
  }
  Param.prototype.setValueAtTime = function (v, t) { this.events.push(['set', v, t]); };
  Param.prototype.linearRampToValueAtTime = function (v, t) { this.events.push(['ramp', v, t]); };
  Param.prototype.cancelScheduledValues = function (t) { this.events.push(['cancel', t]); };
  Param.prototype.cancelAndHoldAtTime = function (t) { this.events.push(['hold', t]); };

  function AudioContext() {
    this.state = o.suspended ? 'suspended' : 'running';
    this.t0 = Date.now();
    this.destination = { name: 'destination' };
    log.contexts.push(this);
  }
  Object.defineProperty(AudioContext.prototype, 'currentTime', { get: function () { return (Date.now() - this.t0) / 1000; } });
  AudioContext.prototype.createGain = function () {
    var g = { gain: new Param(1), connect: function (to) { g.to = to; }, disconnect: function () { g.disconnected = true; } };
    log.gains.push(g);
    return g;
  };
  AudioContext.prototype.createBufferSource = function () {
    var s = {
      loop: false,
      connect: function (to) { s.to = to; },
      start: function (t) { s.started = t; },
      stop: function (t) { s.stopped = t === undefined ? 'now' : t; },
    };
    log.sources.push(s);
    return s;
  };
  AudioContext.prototype.decodeAudioData = function (data) { return Promise.resolve({ duration: 30, bytes: data }); };
  AudioContext.prototype.resume = function () {
    log.resumes++;
    if (!o.refuse) this.state = 'running';
    return o.refuse ? new Promise(function () {}) : Promise.resolve();
  };
  AudioContext.prototype.suspend = function () {
    log.suspends++;
    this.state = 'suspended';
    return Promise.resolve();
  };

  var synth = {
    paused: false,
    current: null,
    getVoices: function () { return o.voices || [{ name: 'Microsoft Zira', lang: 'en-US', localService: true }]; },
    addEventListener: function () {},
    removeEventListener: function () {},
    speak: function (u) {
      log.spoken.push({ u: u, at: Date.now() });
      synth.current = u;
      setTimeout(function () {
        if (synth.current !== u) return;
        if (u.onstart) u.onstart();
        setTimeout(function () {
          if (synth.current !== u) return;
          synth.current = null;
          if (u.onend) u.onend();
        }, o.speakMs || 120);
      }, 10);
    },
    cancel: function () {
      log.cancels++;
      var u = synth.current;
      synth.current = null;
      if (u) setTimeout(function () { if (u.onerror) u.onerror({ error: 'interrupted' }); }, 1);
    },
    pause: function () { synth.paused = true; },
    resume: function () { synth.paused = false; },
  };

  var saved = { window: globalThis.window, fetch: globalThis.fetch, U: globalThis.SpeechSynthesisUtterance, ls: globalThis.localStorage };
  var win = { AudioContext: AudioContext, speechSynthesis: o.noSpeech ? undefined : synth };
  win.top = win;
  globalThis.window = win;
  globalThis.SpeechSynthesisUtterance = function (text) { this.text = text; };
  if (o.noSpeech) delete globalThis.SpeechSynthesisUtterance;
  globalThis.fetch = function (url) {
    log.fetches.push(url);
    if (o.fetchFails) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve({ ok: true, status: 200, arrayBuffer: function () { return Promise.resolve(new ArrayBuffer(8)); } });
  };
  globalThis.localStorage = {
    getItem: function (k) { return (o.storage || {})[k] || null; },
  };
  return {
    log: log, synth: synth,
    restore: function () {
      ['window', 'fetch', 'localStorage'].forEach(function (k, i) {
        var v = [saved.window, saved.fetch, saved.ls][i];
        if (v === undefined) delete globalThis[k];
        else globalThis[k] = v;
      });
      if (saved.U === undefined) delete globalThis.SpeechSynthesisUtterance;
      else globalThis.SpeechSynthesisUtterance = saved.U;
    },
  };
}

var copies = 0;
async function freshTts() {
  var mod = await import('../browser/tts.js?copy=' + ++copies);
  Object.assign(mod.BED_TIMING, FAST);
  return mod;
}

function last(arr) {
  return arr[arr.length - 1];
}

var ISM = { message: 'Fresh croissants are out of the oven', voice: 'en-US-Wavenet-F', language: 'en-US', speed: 1 };

// ---------- bedFor ----------

test('bedFor: 2..6 have beds, 1 and anything else has none', async () => {
  var tts = await freshTts();
  [1, 0, 7, -2, null, undefined, '1', 'x', {}, { backgroundMusic: 1 }].forEach(function (v) { assert.equal(tts.bedFor(v), null, String(v)); });
  [2, 3, 4, 5, 6].forEach(function (n) {
    assert.equal(tts.bedFor(n).n, n);
    assert.equal(tts.bedFor(String(n)).url, BED_MEDIA[n].url);
    assert.equal(tts.bedFor({ backgroundMusic: n }).name, NAMES[n]);
  });
});

// ---------- the timeline ----------

test('with a bed: it fades in, the voice starts after the lead, and the bed plays on for the tail', async () => {
  var env = fakeEnv();
  try {
    var tts = await freshTts();
    var t0 = Date.now();
    var res = await tts.speakAnnouncement(Object.assign({ backgroundMusic: 3 }, ISM), { volume: 0.5 });
    var ms = Date.now() - t0;
    assert.deepEqual(res, { spoken: true, reason: 'ended', bed: 3 });
    assert.deepEqual(env.log.fetches, [BED_MEDIA[3].url]);
    assert.equal(env.log.sources.length, 1);
    var src = env.log.sources[0], gain = env.log.gains[0];
    assert.equal(src.loop, true);
    assert.equal(src.loopStart, BED_MEDIA[3].loopStart);
    assert.equal(src.loopEnd, BED_MEDIA[3].loopEnd);
    assert.ok(src.started !== undefined && src.stopped !== undefined, 'started and stopped');
    assert.equal(gain.to, env.log.contexts[0].destination);
    assert.deepEqual(gain.gain.events[0].slice(0, 2), ['set', 0]);
    assert.deepEqual(gain.gain.events[1].slice(0, 2), ['ramp', 0.2]); // 0.4 of the volume
    assert.ok(Math.abs(gain.gain.events[1][2] - gain.gain.events[0][2] - FAST.fade) < 1e-6, 'fades in over BED_TIMING.fade');
    // The fade-out after the voice: held, then down to 0 by the end of the tail.
    assert.ok(gain.gain.events.some(function (e) { return e[0] === 'ramp' && e[1] === 0; }), 'fades out');
    assert.equal(env.log.spoken.length, 1);
    var lead = env.log.spoken[0].at - t0;
    assert.ok(lead >= FAST.lead * 1000 - 5, 'voice after ' + lead + ' ms');
    assert.equal(env.log.spoken[0].u.volume, 0.5);
    assert.ok(ms >= lead + 120 + FAST.tail * 1000 - 10, 'resolved after the tail: ' + ms + ' ms');
    assert.ok(ms < lead + 120 + FAST.tail * 1000 + 400, 'not much later: ' + ms + ' ms');
  } finally {
    env.restore();
  }
});

test('No Music (1) or no backgroundMusic: the voice starts at once and nothing is loaded', async () => {
  var env = fakeEnv();
  try {
    var tts = await freshTts();
    for (var bm of [1, undefined]) {
      var t0 = Date.now();
      var res = await tts.speakAnnouncement(Object.assign({ backgroundMusic: bm }, ISM));
      assert.deepEqual(res, { spoken: true, reason: 'ended', bed: 0 });
      assert.ok(last(env.log.spoken).at - t0 < 60, 'spoke at once');
      assert.ok(Date.now() - t0 < 400);
    }
    assert.equal(env.log.fetches.length, 0);
    assert.equal(env.log.contexts.length, 0);
  } finally {
    env.restore();
  }
});

test('the bed is read from the stored preview when the announcement object has none', async () => {
  var storage = {};
  storage['ambii-demo:ttsPreviews'] = JSON.stringify({ 'preview-abc': { _id: 'preview-abc', message: 'Hello there everyone', voice: 'en-US-Wavenet-D', language: 'en-US', speed: 1, backgroundMusic: 4 } });
  var env = fakeEnv({ storage: storage });
  try {
    var tts = await freshTts();
    var res = await tts.speakAnnouncement({ url: API_BASE + '/tts/preview-abc' });
    assert.equal(res.bed, 4);
    assert.deepEqual(env.log.fetches, [BED_MEDIA[4].url]);
    assert.equal(env.log.spoken[0].u.text, 'Hello there everyone');
  } finally {
    env.restore();
  }
});

test('cancelSpeech() during the lead stops the bed at once, and the voice never starts', async () => {
  var env = fakeEnv();
  try {
    var tts = await freshTts();
    var p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 2 }, ISM));
    await wait(60);
    assert.equal(env.log.sources.length, 1, 'bed playing');
    var t0 = Date.now();
    tts.cancelSpeech();
    var res = await p;
    assert.ok(Date.now() - t0 < 20, 'resolved at once');
    assert.deepEqual(res, { spoken: false, reason: 'cancelled', bed: 2 });
    var gain = env.log.gains[0], src = env.log.sources[0];
    var ramp = last(gain.gain.events);
    assert.equal(ramp[0], 'ramp');
    assert.equal(ramp[1], 0);
    assert.ok(src.stopped !== undefined && src.stopped - ramp[2] < 0.05, 'stopped right after a ' + FAST.stopFade + ' s ramp');
    await wait(FAST.lead * 1000 + 50);
    assert.equal(env.log.spoken.length, 0, 'no speech afterwards');
  } finally {
    env.restore();
  }
});

test("an app's own speechSynthesis.cancel() stops the bed too (the methods are routed through cancelSpeech)", async () => {
  var env = fakeEnv({ speakMs: 400 });
  try {
    var tts = await freshTts();
    // during the lead
    var p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 5 }, ISM));
    await wait(60);
    window.speechSynthesis.cancel();
    assert.equal((await p).reason, 'cancelled');
    assert.ok(env.log.sources[0].stopped !== undefined);
    // while speaking
    p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 5 }, ISM));
    await wait(FAST.lead * 1000 + 100);
    assert.equal(env.log.spoken.length, 1, 'speaking');
    var before = env.log.cancels;
    window.speechSynthesis.cancel();
    var res = await p;
    assert.equal(res.reason, 'cancelled');
    assert.ok(env.log.cancels > before, 'the real cancel ran');
    assert.ok(env.log.sources[1].stopped !== undefined, 'second bed stopped');
  } finally {
    env.restore();
  }
});

test('a bed that cannot load is left out: the voice starts at once', async () => {
  var env = fakeEnv({ fetchFails: true });
  try {
    var tts = await freshTts();
    var t0 = Date.now();
    var res = await tts.speakAnnouncement(Object.assign({ backgroundMusic: 6 }, ISM));
    assert.deepEqual(res, { spoken: true, reason: 'ended', bed: 0 });
    assert.ok(env.log.spoken[0].at - t0 < 80, 'no lead');
    assert.equal(env.log.sources.length, 0);
  } finally {
    env.restore();
  }
});

test('a context the browser will not start (autoplay refused) means no bed, not a wait', async () => {
  var env = fakeEnv({ suspended: true, refuse: true });
  try {
    var tts = await freshTts();
    var t0 = Date.now();
    var res = await tts.speakAnnouncement(Object.assign({ backgroundMusic: 3 }, ISM));
    assert.equal(res.bed, 0);
    assert.equal(env.log.sources.length, 0);
    assert.ok(env.log.spoken[0].at - t0 < 900, 'spoke after ' + (env.log.spoken[0].at - t0) + ' ms');
  } finally {
    env.restore();
  }
});

test('setSpeechBed() crossfades to another bed, and to No Music', async () => {
  var env = fakeEnv({ speakMs: 300 });
  try {
    var tts = await freshTts();
    assert.equal(tts.setSpeechBed(4), false, 'nothing to change');
    var p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 3 }, ISM));
    await wait(FAST.lead * 1000 + 80); // speaking now
    assert.equal(tts.setSpeechBed(5), true);
    await wait(30);
    assert.equal(env.log.sources.length, 2);
    assert.ok(env.log.sources[0].stopped !== undefined, 'old bed fading out');
    assert.equal(env.log.sources[1].loopEnd, BED_MEDIA[5].loopEnd);
    var res = await p;
    assert.deepEqual(res, { spoken: true, reason: 'ended', bed: 5 });
    assert.equal(env.log.spoken.length, 1, 'the voice was not restarted');

    // To No Music during the lead: the voice starts now instead of waiting for its cue.
    p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 2 }, ISM));
    await wait(40);
    var t0 = Date.now();
    tts.setSpeechBed(1);
    await wait(30);
    assert.equal(env.log.spoken.length, 2);
    assert.ok(last(env.log.spoken).at - t0 < 25, 'voice started at once');
    res = await p;
    assert.equal(res.bed, 0);
    assert.ok(env.log.sources[2].stopped !== undefined);
  } finally {
    env.restore();
  }
});

test('pauseSpeech() holds the bed and the timeline; resumeSpeech() carries on', async () => {
  var env = fakeEnv();
  try {
    var tts = await freshTts();
    var t0 = Date.now();
    var p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 2 }, ISM));
    await wait(60);
    window.speechSynthesis.pause(); // as the phone app's pause does
    assert.equal(env.log.suspends, 1);
    assert.equal(env.synth.paused, false, 'nothing queued yet, so the speech engine is left alone');
    await wait(FAST.lead * 1000 + 100);
    assert.equal(env.log.spoken.length, 0, 'the cue waits while paused');
    tts.resumeSpeech();
    assert.ok(env.log.resumes >= 1);
    var res = await p;
    assert.equal(res.reason, 'ended');
    assert.ok(env.log.spoken[0].at - t0 >= FAST.lead * 1000 + 150, 'the cue came after the pause');
  } finally {
    env.restore();
  }
});

test('pausing while the voice speaks pauses the speech engine too, and resuming resumes it', async () => {
  var env = fakeEnv({ speakMs: 400 });
  try {
    var tts = await freshTts();
    var p = tts.speakAnnouncement(Object.assign({ backgroundMusic: 2 }, ISM));
    await wait(FAST.lead * 1000 + 80);
    assert.equal(env.log.spoken.length, 1, 'speaking');
    tts.pauseSpeech();
    assert.equal(env.synth.paused, true);
    assert.equal(env.log.contexts[0].state, 'suspended');
    window.speechSynthesis.resume(); // as the phone app's play does
    assert.equal(env.synth.paused, false);
    assert.equal(env.log.contexts[0].state, 'running');
    assert.equal((await p).reason, 'ended');
  } finally {
    env.restore();
  }
});

test('without a usable voice the bed still frames the stand-in: lead + the words\' time + tail', async () => {
  var env = fakeEnv({ voices: [] });
  try {
    var tts = await freshTts();
    var t0 = Date.now();
    var res = await tts.speakAnnouncement({ message: 'One two three', speed: 1, voice: 'en-US-Wavenet-F', backgroundMusic: 6 });
    var ms = Date.now() - t0;
    assert.deepEqual(res, { spoken: false, reason: 'no-local-voice', bed: 6 });
    var expected = (FAST.lead + 2 + FAST.tail) * 1000; // estimateSpeechSeconds gives at least 2 s
    assert.ok(ms >= expected - 30 && ms < expected + 400, 'took ' + ms + ' ms, expected about ' + expected);
  } finally {
    env.restore();
  }
});

test('no speechSynthesis at all: still resolves, after the stand-in, with the bed around it', async () => {
  var env = fakeEnv({ noSpeech: true });
  try {
    var tts = await freshTts();
    var res = await tts.speakAnnouncement(Object.assign({ backgroundMusic: 4 }, ISM));
    assert.deepEqual(res, { spoken: false, reason: 'unsupported', bed: 4 });
  } finally {
    env.restore();
  }
});
