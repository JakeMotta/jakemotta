// Announcements created or previewed in the demo have no audio file: their url is API_BASE/tts/<id>
// and the browser speaks them. The server used Google Wavenet voices; here the closest on-device voice
// is picked by language and by the Wavenet voice's gender. Only voices with localService are used, so the
// text never leaves the browser (Chrome's "Google ..." voices are network voices).
import { API_BASE, STORAGE_PREFIX } from '../config.js';
import { VOICE_GENDER, normalizeLanguage } from '../core/voices.js';
import { estimateSpeechSeconds } from '../core/handlers/announcements.js';
import { notifyMediaPlaying } from './notify.js';

var TTS_PATH = API_BASE + '/tts/';
var FEMALE = /female|zira|aria|jenny|michelle|emma|ava|allison|samantha|victoria|karen|moira|tessa|fiona|susan|hazel|libby|sonia|natasha|clara|heera|kalpana|swara|neerja|haruka|ayumi|sayaka|nanami|kyoko|heami|sunhi|yuna|huihui|yaoyao|hanhan|xiaoxiao|tingting|meijia|mei-jia|sinji|sin-ji|hsiaochen|hsiaoyu|helena|laura|elvira|monica|paulina|hortense|julie|denise|amelie|aurelie|elsa|hoaimy|linh|zuzana|hoda|salma|zariyah|amira|blessica/i;
var MALE = /\bmale\b|david|mark|guy|ryan|george|daniel|alex|fred|tom\b|aaron|arthur|oliver|thomas|james|william|brian|andrew|christopher|eric|roger|steffan|liam|ravi|hemant|prabhat|madhur|ichiro|keita|otoya|hattori|kangkang|yunyang|yunxi|danny|zhiwei|paul|pablo|raul|jorge|juan|diego|alvaro|claude|henri|remy|an\b|namminh|naayf|hamed|bayan|injoon|hyunsu|angelo/i;

var current = null; // {utterance, finish}

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

function readCollection(name) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + name) || '{}') || {};
  } catch (e) {
    return {};
  }
}

// The text and voice of an announcement or preview, from the object itself or from the stored record.
function details(ism) {
  var obj = typeof ism === 'string' ? { url: ism } : Object.assign({}, ism || {});
  if (!obj.message) {
    var id = ttsIdFromUrl(obj.url);
    var rec = id ? readCollection('announcements')[id] || readCollection('ttsPreviews')[id] : null;
    if (rec) obj = Object.assign({}, rec, obj, { message: rec.message, voice: obj.voice || rec.voice, language: obj.language || rec.language, speed: obj.speed || rec.speed });
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

export function cancelSpeech() {
  var c = current;
  current = null;
  try {
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  } catch (e) { /* ignore */ }
  if (c) c.finish('cancelled');
}

// Speaks ism.message. Always resolves (never rejects), with {spoken, reason}. When the browser cannot
// speak it (no speechSynthesis, no on-device voice, speech refused or never starting, as in headless
// browsers), it resolves once the time the words would have taken has passed (the announcement's
// `duration` comes from the same estimate), so a player's announcement still lasts as long as announced.
// Speech that starts but never reports its end is cut off by a timer too.
export function speakAnnouncement(ism, options) {
  var opts = options || {};
  var info = details(ism);
  var text = String(info.message || '').trim();
  var speed = Number(info.speed) > 0 ? Number(info.speed) : 1;
  var expected = estimateSpeechSeconds(text, speed) * 1000;
  var t0 = Date.now();
  cancelSpeech();
  notifyMediaPlaying();
  return new Promise(function (resolve) {
    var settled = false, standingIn = false, timers = [];
    function finish(reason, spoken) {
      if (settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      if (current && current.finish === finish) current = null;
      resolve({ spoken: !!spoken, reason: reason });
    }
    // Silent stand-in: resolve when the speech would have ended.
    function fallback(reason) {
      if (settled || standingIn) return;
      standingIn = true;
      timers.push(setTimeout(function () { finish(reason, false); }, Math.max(0, expected - (Date.now() - t0))));
    }
    var synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!text) {
      timers.push(setTimeout(function () { finish('empty'); }, 300));
      return;
    }
    current = { finish: finish };
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
      u.volume = typeof opts.volume === 'number' ? Math.max(0, Math.min(1, opts.volume)) : 1;
      var started = false;
      u.onstart = function () {
        started = true;
        timers.push(setTimeout(function () { finish('timeout', true); }, expected * 1.6 + 4000));
      };
      var gaveUp = false;
      u.onend = function () {
        if (gaveUp) return;
        if (started) finish('ended', true);
        else fallback('ended-unheard'); // an end without a start: nothing was spoken
      };
      u.onerror = function (e) {
        if (gaveUp) return;
        var why = (e && e.error) || 'error';
        // Cancelled by the page (a Stop button calling speechSynthesis.cancel()) or speech that had begun:
        // done now. Refused before it began ("not-allowed" without a user gesture, no engine): stand in.
        if (started || why === 'canceled' || why === 'interrupted') finish('error:' + why, started);
        else fallback('error:' + why);
      };
      timers.push(setTimeout(function () {
        if (!started && !settled && !standingIn) {
          gaveUp = true;
          try { synth.cancel(); } catch (e) { /* ignore */ }
          fallback('never-started');
        }
      }, 3000));
      try {
        synth.speak(u);
      } catch (e) {
        fallback('error');
      }
    });
  });
}
