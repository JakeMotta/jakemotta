// Browser harness for the transport layer: real axios builds (0.19 as in the dashboard and the mobile app,
// 0.21 as in the web player) against the XHR shim, rc-upload-style multipart uploads, pass-through
// downloads, fetch, TTS and the media-playing message. Results land in window.__results.
import * as demo from '../../index.js';

var params = new URLSearchParams(location.search);
var api = demo.installAmbiiDemo({ app: 'harness', badge: params.get('badge') === '0' ? false : { position: params.get('corner') || 'bottom-right' } });
window.demo = demo;
window.api = api;
var BASE = demo.API_BASE;

var DEFAULT_AXIOS = ['/demos/ambii/business-web/node_modules/axios/dist/axios.js', '/demos/ambii/web-player/node_modules/axios/dist/axios.js'];

function log(line, cls) {
  var el = document.createElement('div');
  el.textContent = line;
  if (cls) el.className = cls;
  document.getElementById('log').appendChild(el);
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = function () { reject(new Error('could not load ' + src)); };
    document.head.appendChild(s);
  });
}

async function loadAxiosBuilds(urls) {
  var out = [];
  for (var url of urls) {
    delete window.axios;
    await loadScript(url);
    out.push({ url: url, axios: window.axios, version: window.axios.VERSION || (url.match(/\d+\.\d+\.\d+/) || ['?'])[0] });
  }
  return out;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function rejects(promise) {
  try {
    await promise;
  } catch (e) {
    return e;
  }
  throw new Error('expected a rejection');
}

function rcUpload(file) {
  // The same calls rc-upload (antd Upload) makes.
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    var progress = [];
    xhr.upload.onprogress = function (e) { if (e.total > 0) progress.push((e.loaded / e.total) * 100); };
    var form = new FormData();
    form.append('sampleFile', file);
    xhr.onerror = function (e) { resolve({ error: e }); };
    xhr.onload = function () {
      var text = xhr.responseText || xhr.response;
      var body;
      try { body = JSON.parse(text); } catch (e) { body = text; }
      resolve({ status: xhr.status, body: body, progress: progress });
    };
    xhr.open('post', BASE + '/v3/auth/announcement/upload', true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Authorization', 'Bearer demo');
    xhr.send(form);
  });
}

function suiteFor(axios, label) {
  var tests = [];
  function t(name, fn) { tests.push([label + ': ' + name, fn]); }
  var http = axios.create ? axios : axios;

  t('GET envelope through XHR', async () => {
    var r = await http.get(BASE + '/v3/auth/jwt', { headers: { ambii_api_key: 'x', Authorization: 'Bearer demo' } });
    assert(r.status === 200, 'status ' + r.status);
    assert(r.data.success === true && r.data.message === 'User data found', JSON.stringify(r.data).slice(0, 80));
    assert(r.headers['content-type'].indexOf('application/json') === 0, 'content-type ' + r.headers['content-type']);
    assert(r.request && r.request.responseURL.indexOf(BASE) > 0, 'responseURL');
  });

  t('POST JSON, 400 rejects with err.response', async () => {
    var ok = await http.post(BASE + '/v3/api/player/connect', { storeCode: 'LBEAN7', deviceId: 'web-HARNESS' + label.replace(/\W/g, ''), deviceName: 'web', deviceBrand: 'web', override: true, utc_offset: new Date().getTimezoneOffset() });
    assert(ok.data.type === 'SUCCESSFUL_PAIRED', ok.data.type);
    assert(ok.data.data.location.trackSchedule.queue.length >= 8, 'queue');
    var err = await rejects(http.post(BASE + '/v3/api/player/connect', { storeCode: 'NOPE00', deviceId: 'web-X' }));
    assert(err.response && err.response.status === 400, 'status');
    assert(err.response.data.message === 'Invalid store code', err.response.data.message);
    // revoked token -> 401 TOKEN_INVALID
    var err2 = await rejects(http.get(BASE + '/v3/api/announcement/?locationId=x&hash=', { headers: { ambii_player_jwt: 'demo.revoked.token' } }));
    assert(err2.response.status === 401 && err2.response.data.type === 'TOKEN_INVALID', 'token invalid');
  });

  t('missing leading slash and trailing slash still route', async () => {
    var r = await http.get(BASE + '/v3/api/announcement/?hash=');
    assert(r.data.type === 'DATA_FOUND');
    var e = await rejects(http.post(BASE + 'v3/api/player/downvote', { reason: 'TRACK_DISLIKED', trackId: 'x', stationId: 'y' }));
    assert(e.response.status === 500 && /locationId/.test(e.response.data.message), 'downvote without a token reaches the handler');
  });

  t('responseType json / arraybuffer / blob on mock responses', async () => {
    var j = await http.get(BASE + '/v3/api/voices', { responseType: 'json' });
    assert(j.data.data['English (US)'].length === 10, 'json');
    var ab = await http.get(BASE + '/v3/api/voices', { responseType: 'arraybuffer' });
    assert(ab.data instanceof ArrayBuffer && JSON.parse(new TextDecoder().decode(ab.data)).success === true, 'arraybuffer');
    var b = await http.get(BASE + '/v3/api/voices', { responseType: 'blob' });
    assert(b.data instanceof Blob && b.data.type.indexOf('application/json') === 0, 'blob');
  });

  t('arraybuffer download of /music/*.mp3 passes through untouched', async () => {
    var url = '/music/alone.mp3';
    var r = await http.get(url, { responseType: 'arraybuffer' });
    assert(r.status === 200, 'status');
    assert(r.data.byteLength === 2825350, 'bytes ' + r.data.byteLength);
    var head = new Uint8Array(r.data.slice(0, 3));
    assert((head[0] === 0x49 && head[1] === 0x44 && head[2] === 0x33) || head[0] === 0xff, 'mp3 header');
    assert(r.headers['content-type'] === 'audio/mpeg', 'native content-type ' + r.headers['content-type']);
    var entries = performance.getEntriesByName(new URL(url, location.href).href);
    assert(entries.length > 0, 'the browser fetched it over the network');
    var img = await http.get('/projects/ambii-business/media/covers/breathe-640.jpg', { responseType: 'arraybuffer' });
    var jpg = new Uint8Array(img.data.slice(0, 2));
    assert(jpg[0] === 0xff && jpg[1] === 0xd8, 'jpeg');
    var nf = await rejects(http.get('/projects/ambii-business/nothing-here.txt'));
    assert(nf.response.status === 404, 'native 404');
  });

  t('timeout and cancel', async () => {
    var e = await rejects(http.get(BASE + '/v3/auth/jwt', { timeout: 5 }));
    assert(e.code === 'ECONNABORTED', 'timeout code ' + e.code);
    var source = axios.CancelToken.source();
    var p = http.get(BASE + '/v3/auth/jwt', { cancelToken: source.token });
    setTimeout(function () { source.cancel('bye'); }, 20);
    var c = await rejects(p);
    assert(axios.isCancel(c), 'cancelled');
  });

  t('upload progress callback (onUploadProgress) on a mock POST', async () => {
    var seen = [];
    await http.post(BASE + '/v3/api/log', { log: 'x'.repeat(2000) }, { onUploadProgress: function (e) { seen.push(e.loaded); } });
    assert(seen.length > 0 && seen[seen.length - 1] > 2000, 'progress ' + seen);
  });

  return tests;
}

var shared = [];
function s(name, fn) { shared.push([name, fn]); }

s('rc-upload multipart upload, then download it as arraybuffer and play it via resolveMediaUrl', async () => {
  var blob = await (await fetch('/projects/ambii-business/media/announcements/loyalty-card.mp3')).blob();
  var file = new File([blob], 'harness-upload.mp3', { type: 'audio/mpeg' });
  var up = await rcUpload(file);
  assert(up.status === 200, 'status ' + up.status);
  assert(up.body.success && up.body.message === 'Announcement upload was successful', up.body.message);
  assert(up.progress.length && up.progress[up.progress.length - 1] === 100, 'upload progress ' + up.progress);
  var ism = up.body.data;
  assert(Math.abs(ism.duration - 9.77) < 0.3, 'duration ' + ism.duration);
  var axios = window.axiosBuilds[window.axiosBuilds.length - 1].axios;
  var r = await axios.get(ism.url, { responseType: 'arraybuffer' });
  assert(r.data.byteLength === file.size, 'bytes ' + r.data.byteLength + ' vs ' + file.size);
  assert(r.headers['content-type'] === 'audio/mpeg', 'type');
  var src = await demo.resolveMediaUrl(ism.url);
  assert(src.indexOf('blob:') === 0, 'object URL ' + src);
  assert((await demo.resolveMediaUrl('/music/alone.mp3')) === '/music/alone.mp3', 'other URLs unchanged');
  var audio = new Audio();
  audio.src = src;
  var dur = await new Promise(function (resolve, reject) {
    audio.onloadedmetadata = function () { resolve(audio.duration); };
    audio.onerror = function () { reject(new Error('audio error')); };
  });
  assert(Math.abs(dur - ism.duration) < 0.3, 'audio element duration ' + dur);
  window.__uploaded = ism;
});

s('fetch() goes through the mock for API_BASE and natively otherwise', async () => {
  var r = await fetch(BASE + '/v3/api/voices');
  assert(r.status === 200 && r.headers.get('content-type').indexOf('application/json') === 0, 'status/type');
  assert((await r.json()).data['English (US)'], 'voices');
  var post = await fetch(BASE + '/v3/auth/billing-address', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addressLineOne: '1 Fetch St', city: 'San Jose', state: 'CA', postalCode: '95110', setAsDefault: false }) });
  assert((await post.json()).message === 'Billing address successfully created', 'post');
  var bad = await fetch(BASE + '/v3/auth/nothing');
  assert(bad.status === 404, '404');
  var native = await fetch('/projects/ambii-business/media/brand/ambii-logo-120.jpg');
  assert(native.status === 200 && native.headers.get('content-type') === 'image/jpeg', 'native fetch');
});

s('TTS: preview URL is recognised and speakAnnouncement always resolves', async () => {
  var r = await fetch(BASE + '/v3/auth/announcement/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hash: 'harness1', voice: 'en-US-Wavenet-F', language: 'en-US', message: 'Fresh croissants are out of the oven.', speed: 1, backgroundMusic: 2 }) });
  var url = (await r.json()).data;
  assert(demo.isTtsAnnouncement(url) && demo.isTtsAnnouncement({ url: url }), 'isTts');
  assert(!demo.isTtsAnnouncement({ url: '/projects/ambii-business/media/announcements/happy-hour.mp3' }), 'not tts');
  var t0 = performance.now();
  var res = await demo.speakAnnouncement({ url: url }, { volume: 0.5 });
  var ms = performance.now() - t0;
  window.__speech = { result: res, ms: ms, voices: speechSynthesis.getVoices().map(function (v) { return v.name + ' ' + v.lang + ' local=' + v.localService; }) };
  assert(typeof res.spoken === 'boolean' && ms < 15000, 'resolved in ' + ms);
  var silent = await fetch(url);
  assert(silent.status === 200 && silent.headers.get('content-type') === 'audio/mpeg', 'tts URL fetched as audio gives silence');
});

s('TTS without a usable voice: silent stand-in that lasts as long as the words would', async () => {
  var real = speechSynthesis.getVoices;
  speechSynthesis.getVoices = function () { return []; };
  try {
    var t0 = performance.now();
    var res = await demo.speakAnnouncement({ message: 'One two three four five six seven eight nine ten eleven twelve thirteen', speed: 1, voice: 'en-US-Wavenet-F' });
    var ms = performance.now() - t0;
    assert(res.spoken === false && res.reason === 'no-local-voice', JSON.stringify(res));
    assert(ms > 4500 && ms < 6500, 'took ' + Math.round(ms) + ' ms, expected about 5000');
    var empty = await demo.speakAnnouncement({ message: '' });
    assert(empty.reason === 'empty', JSON.stringify(empty));
  } finally {
    speechSynthesis.getVoices = real;
  }
});

s('badge steps above a fixed bar whose button it would cover, and comes back', async () => {
  var host = document.getElementById('ambii-demo-badge');
  if (!host) return; // harness opened with ?badge=0
  var home = host.getBoundingClientRect();
  var bar = document.createElement('div');
  bar.setAttribute('style', 'position:fixed;left:0;right:0;bottom:0;height:70px;background:#ddd;z-index:10');
  bar.innerHTML = '<button style="position:absolute;right:14px;bottom:8px;width:44px;height:44px">X</button>';
  document.body.appendChild(bar);
  try {
    await new Promise(function (r) { setTimeout(r, 900); });
    var lifted = host.getBoundingClientRect();
    assert(lifted.bottom <= window.innerHeight - 70 - 4, 'badge bottom ' + lifted.bottom + ' should be above the bar top ' + (window.innerHeight - 70));
  } finally {
    bar.remove();
  }
  await new Promise(function (r) { setTimeout(r, 900); });
  var back = host.getBoundingClientRect();
  assert(Math.abs(back.top - home.top) < 1, 'back home: ' + back.top + ' vs ' + home.top);
});

s('getAllResponseHeaders / getResponseHeader / readyState sequence on a raw XHR', async () => {
  var states = [];
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () { states.push(xhr.readyState); };
  var done = new Promise(function (resolve) { xhr.onloadend = resolve; });
  xhr.open('GET', BASE + '/v3/auth/zone');
  xhr.send();
  await done;
  assert(states.join(',') === '1,2,3,4', 'states ' + states.join(','));
  assert(/content-type: application\/json/.test(xhr.getAllResponseHeaders()), 'all headers');
  assert(xhr.getResponseHeader('Content-Type').indexOf('application/json') === 0, 'header');
  assert(JSON.parse(xhr.responseText).message === 'Zone data found', 'body');
  assert(xhr instanceof XMLHttpRequest, 'instanceof');
});

window.runSuite = async function () {
  var urls = (params.get('axios') || DEFAULT_AXIOS.join(',')).split(',');
  window.axiosBuilds = await loadAxiosBuilds(urls);
  var all = [];
  window.axiosBuilds.forEach(function (b) { all = all.concat(suiteFor(b.axios, 'axios ' + b.version)); });
  all = all.concat(shared);
  var results = [];
  for (var [name, fn] of all) {
    try {
      await fn();
      results.push({ name: name, ok: true });
      log('PASS ' + name, 'pass');
    } catch (e) {
      results.push({ name: name, ok: false, error: String(e && e.stack || e) });
      log('FAIL ' + name + ': ' + (e && e.message), 'fail');
    }
  }
  window.__results = results;
  return results;
};

window.harnessReady = true;
if (params.get('run') === '1') window.runSuite();
