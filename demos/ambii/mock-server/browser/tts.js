// Announcements created or previewed in the demo have no audio file: their url is API_BASE/tts/<id>
// and the browser speaks them. The server used Google Wavenet voices; here the closest on-device voice
// is picked by language and by the Wavenet voice's gender. Only voices with localService are used, so the
// text never leaves the browser (Chrome's "Google ..." voices are network voices).
//
// The server also mixed the voice over a music bed, announcement.backgroundMusic 2..6 (Smooth, Bright,
// Light, Distinct, Mellow; 1 is "No Music"), with sox: 3 s of bed, the voice over it, 3 s more, 1.5 s
// linear fades in and out (controllers/announcement.js, announcementBackgroundMusic). The demo's beds are
// synthesized loops (core/bed-data.js, made by tools/build-media.mjs) played with Web Audio on the same
// timeline under the speech, at 0.4 of the announcement's volume.
import { API_BASE, STORAGE_PREFIX } from '../config.js';
import { VOICE_GENDER, normalizeLanguage } from '../core/voices.js';
import { estimateSpeechSeconds, hasBed, BED_LEAD_SECONDS, BED_TAIL_SECONDS } from '../core/handlers/announcements.js';
import { BED_MEDIA } from '../core/bed-data.js';
import { notifyMediaPlaying } from './notify.js';

var TTS_PATH = API_BASE + '/tts/';
var FEMALE = /female|zira|aria|jenny|michelle|emma|ava|allison|samantha|victoria|karen|moira|tessa|fiona|susan|hazel|libby|sonia|natasha|clara|heera|kalpana|swara|neerja|haruka|ayumi|sayaka|nanami|kyoko|heami|sunhi|yuna|huihui|yaoyao|hanhan|xiaoxiao|tingting|meijia|mei-jia|sinji|sin-ji|hsiaochen|hsiaoyu|helena|laura|elvira|monica|paulina|hortense|julie|denise|amelie|aurelie|elsa|hoaimy|linh|zuzana|hoda|salma|zariyah|amira|blessica/i;
var MALE = /\bmale\b|david|mark|guy|ryan|george|daniel|alex|fred|tom\b|aaron|arthur|oliver|thomas|james|william|brian|andrew|christopher|eric|roger|steffan|liam|ravi|hemant|prabhat|madhur|ichiro|keita|otoya|hattori|kangkang|yunyang|yunxi|danny|zhiwei|paul|pablo|raul|jorge|juan|diego|alvaro|claude|henri|remy|an\b|namminh|naayf|hamed|bayan|injoon|hyunsu|angelo/i;

// The server's mix, in seconds (lead and tail: bed alone before and after the voice; fade: in at the start,
// out at the end), and the bed's level as a share of the announcement's volume. switchFade is the crossfade
// when setSpeechBed() changes the bed mid-announcement, stopFade the ramp that keeps a cancel click-free,
// loadTimeout how long a bed may take to load before the voice goes ahead without one. Lead and tail come from
// core/handlers/announcements.js, whose spokenSeconds() adds them to a bedded announcement's stored duration.
export var BED_TIMING = { lead: BED_LEAD_SECONDS, tail: BED_TAIL_SECONDS, fade: 1.5, level: 0.4, switchFade: 0.6, stopFade: 0.04, loadTimeout: 4 };

var current = null; // the announcement being spoken (see speakAnnouncement)

export function ttsIdFromUrl(url) {
  if (typeof url !== 'string') return null;
  var i = url.indexOf(TTS_PATH);
  if (i < 0) return null;
  var id = url.slice(i + TTS_PATH.length).split(/[?#/]/)[0];
  return id || null;
}

// True for an announcement (or a URL) that has no audio file and must go through speakAnnouncement().
export function isTtsAnnouncement(ism) {
  var url = typeof ism === 'string' ? ism : ism && ism.url;
  return !!ttsIdFromUrl(url);
}

// The music bed of an announcement (or of a backgroundMusic value): its BED_MEDIA entry with its number as
// `n`, or null for 1 ("No Music"), a missing value or one with no bed.
export function bedFor(ism) {
  var n = Number(ism !== null && typeof ism === 'object' ? ism.backgroundMusic : ism);
  return hasBed(n) ? Object.assign({ n: n }, BED_MEDIA[n]) : null;
}

function readCollection(name) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + name) || '{}') || {};
  } catch (e) {
    return {};
  }
}

// The text, voice and bed of an announcement or preview, from the object itself or from the stored record.
function details(ism) {
  var obj = typeof ism === 'string' ? { url: ism } : Object.assign({}, ism || {});
  if (!obj.message || obj.backgroundMusic == null) {
    var id = ttsIdFromUrl(obj.url);
    var rec = id ? readCollection('announcements')[id] || readCollection('ttsPreviews')[id] : null;
    if (rec) {
      obj = Object.assign({}, rec, obj, {
        message: obj.message || rec.message, voice: obj.voice || rec.voice, language: obj.language || rec.language, speed: obj.speed || rec.speed,
        backgroundMusic: obj.backgroundMusic != null ? obj.backgroundMusic : rec.backgroundMusic,
      });
    }
  }
  return obj;
}

function browserLang(code) {
  var map = { 'cmn-CN': 'zh-CN', 'cmn-TW': 'zh-TW', 'yue-HK': 'zh-HK', 'ar-XA': 'ar' };
  return (map[code] || code || 'en-US').toLowerCase();
}

function genderOf(voiceName) {
  var g = VOICE_GENDER[voiceName];
  if (g) return g;
  return /female/i.test(voiceName || '') ? 'FEMALE' : /male/i.test(voiceName || '') ? 'MALE' : null;
}

function guessGender(v) {
  var n = (v.name || '') + ' ' + (v.voiceURI || '');
  if (FEMALE.test(n)) return 'FEMALE';
  if (MALE.test(n)) return 'MALE';
  return null;
}

export function pickVoice(voices, language, wavenetVoice) {
  var want = browserLang(language), primary = want.split('-')[0], gender = genderOf(wavenetVoice);
  var best = null, bestScore = -Infinity;
  (voices || []).forEach(function (v) {
    if (v.localService === false) return;
    var lang = String(v.lang || '').replace('_', '-').toLowerCase();
    var score = 0;
    if (lang === want) score += 6;
    else if (lang.split('-')[0] === primary) score += 3;
    else score -= 10;
    var g = guessGender(v);
    if (gender && g === gender) score += 2;
    else if (gender && g && g !== gender) score -= 2;
    if (v.default) score += 0.5;
    if (score > bestScore) {
      best = v;
      bestScore = score;
    }
  });
  return best;
}

function loadVoices(synth) {
  return new Promise(function (resolve) {
    var list = synth.getVoices();
    if (list && list.length) { resolve(list); return; }
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      try { synth.removeEventListener('voiceschanged', finish); } catch (e) { /* old Safari */ }
      resolve(synth.getVoices() || []);
    }
    try { synth.addEventListener('voiceschanged', finish); } catch (e) { /* old Safari */ }
    setTimeout(finish, 1000);
  });
}

// ---------- speechSynthesis, and the apps' direct calls to it ----------

var raw = null; // speechSynthesis's own cancel/pause/resume, kept when hookSynth() routes them through here

function synthesis() {
  return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis : null;
}

function rawCall(name) {
  var synth = synthesis();
  if (!synth) return;
  try {
    (raw && raw.synth === synth ? raw[name] : synth[name]).call(synth);
  } catch (e) { /* ignore */ }
}

// The apps also call speechSynthesis.cancel(), pause() and resume() themselves (Stop Preview, closing the
// player, a stalled announcement). Those go through cancelSpeech(), pauseSpeech() and resumeSpeech(), so the
// bed and the timeline stop or wait with the voice, including before the voice has started.
function hookSynth() {
  var synth = synthesis();
  if (!synth || (raw && raw.synth === synth)) return;
  raw = { synth: synth, cancel: synth.cancel, pause: synth.pause, resume: synth.resume };
  try {
    synth.cancel = function () { cancelSpeech(); };
    synth.pause = function () { pauseSpeech(); };
    synth.resume = function () { resumeSpeech(); };
  } catch (e) { /* read-only: only the exported functions then reach the bed */ }
}

// ---------- the music bed (Web Audio) ----------

var bedCtx = null, bedBuffers = {}, unlockHooked = false;

function bedContext() {
  if (bedCtx && bedCtx.state !== 'closed') return bedCtx;
  var AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;
  if (!AC) return null;
  try {
    bedCtx = new AC();
  } catch (e) {
    bedCtx = null;
    return null;
  }
  // A context made without a recent user gesture can start suspended; the visitor's next click lets it run.
  if (!unlockHooked && typeof document !== 'undefined') {
    unlockHooked = true;
    var unlock = function () {
      if (bedCtx && bedCtx.state === 'suspended' && !(current && current.paused)) quiet(bedCtx.resume());
    };
    ['pointerdown', 'keydown', 'touchend'].forEach(function (type) { document.addEventListener(type, unlock, true); });
  }
  return bedCtx;
}

function quiet(p) {
  if (p && typeof p.then === 'function') p.then(null, function () {});
}

// Resolves true once the context runs, false when it does not within `ms` (autoplay refused).
function whenRunning(ctx, ms) {
  if (ctx.state === 'running') return Promise.resolve(true);
  return new Promise(function (resolve) {
    var done = false;
    function end() {
      if (done) return;
      done = true;
      resolve(ctx.state === 'running');
    }
    try {
      var p = ctx.resume();
      if (p && typeof p.then === 'function') p.then(end, end);
    } catch (e) { /* old Safari */ }
    setTimeout(end, ms);
  });
}

function fetchBytes(url) {
  if (typeof fetch !== 'function') return Promise.reject(new Error('no fetch'));
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.arrayBuffer();
  });
}

function decode(ctx, data) {
  return new Promise(function (resolve, reject) {
    var p = ctx.decodeAudioData(data, resolve, reject); // callbacks for old Safari, the promise elsewhere
    if (p && typeof p.then === 'function') p.then(resolve, reject);
  });
}

// The decoded bed (cached per bed), or null when it cannot be had; a failure is retried next time.
function loadBed(bed) {
  var ctx = bedContext();
  if (!ctx) return Promise.resolve(null);
  if (!bedBuffers[bed.n]) {
    bedBuffers[bed.n] = fetchBytes(bed.url).then(function (data) { return decode(ctx, data); }).then(null, function () {
      delete bedBuffers[bed.n];
      return null;
    });
  }
  return bedBuffers[bed.n];
}

// Holds an AudioParam at its current value (mid-ramp included) so a new ramp starts from there.
function holdAt(param, t) {
  if (typeof param.cancelAndHoldAtTime === 'function') {
    try {
      param.cancelAndHoldAtTime(t);
      return;
    } catch (e) { /* fall back */ }
  }
  var v = param.value;
  param.cancelScheduledValues(t);
  param.setValueAtTime(v, t);
}

// Starts a bed looping from its first beat, fading in to `level` over `fade` seconds.
function playBed(ctx, buffer, bed, level, fade) {
  var src = ctx.createBufferSource(), gain = ctx.createGain(), now = ctx.currentTime, ended = false;
  src.buffer = buffer;
  src.loop = true;
  if (buffer.duration >= bed.loopEnd) {
    src.loopStart = bed.loopStart;
    src.loopEnd = bed.loopEnd;
  } else {
    // a decoder that dropped some of the file's end: keep the loop's length, a little earlier
    src.loopEnd = buffer.duration;
    src.loopStart = Math.max(0, buffer.duration - bed.duration);
  }
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(level, now + fade);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(now);
  function cut() {
    if (ended) return;
    ended = true;
    try { src.stop(); } catch (e) { /* already stopped */ }
    try { gain.disconnect(); } catch (e) { /* already */ }
  }
  return {
    n: bed.n,
    // Holds the level for `after` seconds (reaching `level` first if still fading in), then fades out over `seconds`.
    fadeOut: function (after, seconds, lvl) {
      if (ended) return;
      var t = ctx.currentTime;
      holdAt(gain.gain, t);
      if (after > 0) gain.gain.linearRampToValueAtTime(lvl, t + after);
      gain.gain.linearRampToValueAtTime(0, t + after + seconds);
    },
    // Fades out over `seconds` and stops. A suspended (paused) context would never get there, so it is cut at once.
    stop: function (seconds) {
      if (ended) return;
      if (ctx.state !== 'running' || !(seconds > 0)) {
        cut();
        return;
      }
      var t = ctx.currentTime;
      holdAt(gain.gain, t);
      gain.gain.linearRampToValueAtTime(0, t + seconds);
      try { src.stop(t + seconds + 0.02); } catch (e) { cut(); return; }
      src.onended = cut;
    },
  };
}

// setTimeout timers that pause and resume together, so a paused announcement keeps its timeline.
function timerSet() {
  var list = [], paused = false;
  function arm(t) {
    t.since = Date.now();
    t.id = setTimeout(function () {
      var i = list.indexOf(t);
      if (i >= 0) list.splice(i, 1);
      t.fn();
    }, t.left);
  }
  return {
    add: function (ms, fn) {
      var t = { fn: fn, left: Math.max(0, ms), id: null, since: 0 };
      list.push(t);
      if (!paused) arm(t);
      return t;
    },
    clear: function (t) {
      var i = list.indexOf(t);
      if (i < 0) return;
      list.splice(i, 1);
      clearTimeout(t.id);
    },
    clearAll: function () {
      list.forEach(function (t) { clearTimeout(t.id); });
      list = [];
    },
    pause: function () {
      if (paused) return;
      paused = true;
      list.forEach(function (t) {
        clearTimeout(t.id);
        t.left = Math.max(0, t.left - (Date.now() - t.since));
      });
    },
    resume: function () {
      if (!paused) return;
      paused = false;
      list.forEach(arm);
    },
  };
}

// ---------- the public API ----------

// Stops the announcement being spoken, voice and bed together, at once. Its promise resolves with
// reason "cancelled".
export function cancelSpeech() {
  var c = current;
  current = null;
  rawCall('cancel');
  var synth = synthesis();
  if (synth && synth.paused) rawCall('resume'); // Chrome stays paused after a cancel, and would hold the next speech
  if (c) c.cancel();
}

// Pauses the announcement being spoken: voice, bed and timeline. speechSynthesis.pause() does the same.
export function pauseSpeech() {
  if (current) current.pause();
  else rawCall('pause');
}

// Resumes what pauseSpeech() paused. speechSynthesis.resume() does the same.
export function resumeSpeech() {
  if (current) current.resume();
  else rawCall('resume');
}

// Changes the bed under the announcement being spoken (a backgroundMusic value: 1 is none), crossfading to
// it; the dashboard's preview follows its Background Music choice with it. Returns false when nothing is
// being spoken or the voice has finished.
export function setSpeechBed(backgroundMusic) {
  return current ? current.setBed(backgroundMusic) : false;
}

// Speaks ism.message over its bed (ism.backgroundMusic, read from the stored record when the object has none):
// the bed fades in, the voice starts BED_TIMING.lead seconds later, and the bed plays on for BED_TIMING.tail
// seconds after the voice ends, fading out. With no bed (1, missing, or a bed that cannot load or play) the voice
// starts at once and the promise resolves when it ends.
// Always resolves (never rejects), with {spoken, reason, bed}. When the browser cannot speak it (no
// speechSynthesis, no on-device voice, speech refused or never starting, as in headless browsers), the voice's
// part lasts the time the words would have taken (the announcement's `duration` is the same estimate, plus the
// lead and tail when it has a bed: spokenSeconds() in core/handlers/announcements.js), so a player's
// announcement still lasts as long as announced. Speech that starts but never reports its end is
// cut off by a timer too. cancelSpeech() (or speechSynthesis.cancel()) ends it at once.
export function speakAnnouncement(ism, options) {
  var opts = options || {};
  var info = details(ism);
  var text = String(info.message || '').trim();
  var speed = Number(info.speed) > 0 ? Number(info.speed) : 1;
  var expected = estimateSpeechSeconds(text, speed) * 1000;
  var volume = typeof opts.volume === 'number' ? Math.max(0, Math.min(1, opts.volume)) : 1;
  var timing = BED_TIMING;
  cancelSpeech();
  hookSynth();
  notifyMediaPlaying();
  return new Promise(function (resolve) {
    var timers = timerSet(), settled = false, voiceStarted = false, voiceOver = false, standingIn = false, voiceT0 = 0;
    var bed = null, bedNo = 0, leadTimer = null, waiting = null, outgoing = []; // outgoing: beds playing on until the next one is ready
    var session = { paused: false };

    function level() {
      return timing.level * volume;
    }

    function finish(reason, spoken) {
      if (settled) return;
      settled = true;
      timers.clearAll();
      if (bed) bed.stop(timing.stopFade);
      letGo(timing.stopFade);
      if (current === session) current = null;
      resolve({ spoken: !!spoken, reason: reason, bed: bedNo });
    }

    // The voice's part is over: with a bed, it plays on for the tail and fades out; without, done now.
    function voiceDone(reason, spoken) {
      if (settled || voiceOver) return;
      voiceOver = true;
      if (!bed) {
        finish(reason, spoken);
        return;
      }
      bed.fadeOut(Math.max(0, timing.tail - timing.fade), Math.min(timing.fade, timing.tail), level());
      timers.add(timing.tail * 1000, function () { finish(reason, spoken); });
    }

    // Silent stand-in for the voice: done when the speech would have ended.
    function fallback(reason) {
      if (settled || standingIn || voiceOver) return;
      standingIn = true;
      timers.add(expected - (Date.now() - voiceT0), function () { voiceDone(reason, false); });
    }

    function startVoice() {
      if (settled || voiceStarted) return;
      voiceStarted = true;
      voiceT0 = Date.now();
      var synth = synthesis();
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
        fallback('unsupported');
        return;
      }
      loadVoices(synth).then(function (voices) {
        if (settled) return;
        var language = normalizeLanguage(info.language, info.voice);
        var voice = pickVoice(voices, language, info.voice);
        if (!voice) {
          fallback('no-local-voice');
          return;
        }
        var u = new SpeechSynthesisUtterance(text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = Math.max(0.5, Math.min(2, speed));
        u.pitch = 1;
        u.volume = volume;
        var started = false, gaveUp = false;
        u.onstart = function () {
          started = true;
          timers.add(expected * 1.6 + 4000, function () {
            gaveUp = true;
            rawCall('cancel');
            voiceDone('timeout', true);
          });
        };
        u.onend = function () {
          if (gaveUp || settled) return;
          if (started) voiceDone('ended', true);
          else fallback('ended-unheard'); // an end without a start: nothing was spoken
        };
        u.onerror = function (e) {
          if (gaveUp || settled) return;
          var why = (e && e.error) || 'error';
          // Cancelled by the page (speechSynthesis.cancel() from outside, when it could not be routed through
          // cancelSpeech()): everything stops now. Failed after it began: the voice is done. Refused before it
          // began ("not-allowed" without a user gesture, no engine): stand in.
          if (why === 'canceled' || why === 'interrupted') finish('error:' + why, started);
          else if (started) voiceDone('error:' + why, true);
          else fallback('error:' + why);
        };
        timers.add(3000, function () {
          if (!started && !settled && !standingIn) {
            gaveUp = true;
            rawCall('cancel');
            fallback('never-started');
          }
        });
        try {
          if (synth.paused) rawCall('resume');
          synth.speak(u);
        } catch (e) {
          fallback('error');
        }
      });
    }

    // The voice's cue: BED_TIMING.lead seconds after the first bed starts, or at once when there is none.
    function cue() {
      if (voiceStarted || leadTimer) return;
      if (waiting) timers.clear(waiting);
      if (bed) leadTimer = timers.add(timing.lead * 1000, startVoice);
      else startVoice();
    }

    function letGo(fade) {
      outgoing.forEach(function (b) { b.stop(fade); });
      outgoing = [];
    }

    // Starts `next`, fading in over `fade`, if it is still the bed wanted once it has loaded, while any bed it
    // replaces fades out (a crossfade); a bed that cannot load or play is left out. Then gives the voice its cue.
    function bringIn(next, fade) {
      loadBed(next).then(function (buffer) {
        var ctx = bedCtx;
        if (!buffer || !ctx) return null;
        if (session.paused) return buffer; // suspended by the pause: resumeSpeech() starts it again
        return whenRunning(ctx, 600).then(function (running) { return running ? buffer : null; });
      }).then(function (buffer) {
        if (settled || bedNo !== next.n || bed) return;
        if (buffer) {
          bed = playBed(bedCtx, buffer, next, level(), fade);
          if (session.paused) quiet(bedCtx.suspend());
        } else bedNo = 0;
        letGo(timing.switchFade);
        cue();
      });
    }

    session.cancel = function () { finish('cancelled', false); };
    // The speech itself is paused only while it is being spoken: Chrome, paused with nothing queued, can then sit
    // on the next utterance for good.
    var speechPaused = false;
    session.pause = function () {
      if (settled || session.paused) return;
      session.paused = true;
      timers.pause();
      if (voiceStarted && !voiceOver && !standingIn) {
        speechPaused = true;
        rawCall('pause');
      }
      if (bedCtx && bedCtx.state === 'running') quiet(bedCtx.suspend());
    };
    session.resume = function () {
      if (settled || !session.paused) return;
      session.paused = false;
      timers.resume();
      if (speechPaused) {
        speechPaused = false;
        rawCall('resume');
      }
      if (bedCtx && bedCtx.state === 'suspended') quiet(bedCtx.resume());
    };
    session.setBed = function (value) {
      if (settled || voiceOver) return false;
      var next = bedFor(value);
      if ((next ? next.n : 0) === bedNo) return true;
      if (bed) outgoing.push(bed);
      bed = null;
      bedNo = next ? next.n : 0;
      if (!next) {
        letGo(timing.switchFade);
        // No music: nothing to lead in with, so a voice still waiting for its cue starts now.
        if (!voiceStarted) {
          if (leadTimer) timers.clear(leadTimer);
          startVoice();
        }
        return true;
      }
      notifyMediaPlaying();
      bringIn(next, timing.switchFade);
      return true;
    };
    current = session;

    if (!text) {
      timers.add(300, function () { finish('empty'); });
      return;
    }
    var first = bedFor(info);
    if (!first) {
      startVoice();
      return;
    }
    // The bed first, then the voice BED_TIMING.lead seconds later. A bed that has not loaded within
    // loadTimeout, or cannot play, is left out and the voice starts straight away.
    bedNo = first.n;
    waiting = timers.add(timing.loadTimeout * 1000, function () {
      waiting = null;
      if (bed || voiceStarted) return;
      bedNo = 0;
      startVoice();
    });
    bringIn(first, timing.fade);
  });
}
