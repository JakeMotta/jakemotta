// Ambii Business demo: the in-browser replacement for ambii_business_server, shared by the dashboard,
// the web player and the mobile app. See README.md (this folder) and ../README.md (the contract).
//
//   import { installAmbiiDemo } from '<alias>/index.js';
//   installAmbiiDemo({ app: 'business' });   // before any other app code runs
import { API_BASE, RESET_PREFIXES, LATENCY_MS, LOCK_NAME } from './config.js';
import { createServer } from './core/server.js';
import { memoryStorage, keysWithPrefix } from './core/store.js';
import { installXhr, installFetch } from './browser/transport.js';
import { idbMedia, idbFence, resolveMediaUrl, decodeDuration, deleteMediaDb } from './browser/media.js';
import { isTtsAnnouncement, speakAnnouncement, cancelSpeech } from './browser/tts.js';
import { notifyMediaPlaying, installPlayNotifier } from './browser/notify.js';
import { mountBadge } from './browser/badge.js';

export { API_BASE, resolveMediaUrl, isTtsAnnouncement, speakAnnouncement, cancelSpeech, notifyMediaPlaying };

var localChain = Promise.resolve();

// Serializes every request across all demo documents of the origin (tabs, iframes) with navigator.locks;
// without it (old browsers, insecure origins) only within this document.
export function withLock(fn) {
  if (typeof navigator !== 'undefined' && navigator.locks && typeof navigator.locks.request === 'function') {
    return navigator.locks.request(LOCK_NAME, function () { return fn(); });
  }
  var run = localChain.then(fn, fn);
  localChain = run.then(function () {}, function () {});
  return run;
}

function safeLocalStorage() {
  try {
    var ls = window.localStorage;
    ls.setItem('ambii-demo:probe', '1');
    ls.removeItem('ambii-demo:probe');
    return ls;
  } catch (e) {
    return memoryStorage();
  }
}

function clearPrefixes(storage) {
  if (!storage) return;
  RESET_PREFIXES.forEach(function (prefix) {
    keysWithPrefix(storage, prefix).forEach(function (k) {
      try { storage.removeItem(k); } catch (e) { /* ignore */ }
    });
  });
}

// Forgets everything the demos stored in this browser (shared data, each app's own keys, uploaded audio)
// and reloads, so the next request seeds the demo company again. Pass {reload: false} to skip the reload.
export function resetDemo(options) {
  var opts = options || {};
  cancelSpeech();
  return withLock(function () {
    try { clearPrefixes(window.localStorage); } catch (e) { /* ignore */ }
    try { clearPrefixes(window.sessionStorage); } catch (e) { /* ignore */ }
    return deleteMediaDb();
  }).then(function () {
    if (opts.reload !== false) window.location.reload();
  });
}

// Installs the mock in this document. Idempotent: later calls return the first call's handle.
// options: app ('business' | 'player' | 'music'), badge (true | false | {position, compact, style}),
// latency ([min, max] ms).
export function installAmbiiDemo(options) {
  if (typeof window === 'undefined') return null;
  var opts = options || {};
  if (window.__ambiiDemo) {
    if (opts.badge && !document.getElementById('ambii-demo-badge')) mountBadge(opts.badge, function () { resetDemo(); });
    return window.__ambiiDemo;
  }
  var storage = safeLocalStorage();
  var shared = false;
  try { shared = storage === window.localStorage; } catch (e) { /* storage blocked: in-memory data */ }
  var server = createServer({
    // The fence only makes sense when the data really is shared through localStorage.
    storage: storage, media: idbMedia, fence: shared ? idbFence : null, withLock: withLock, latency: opts.latency || LATENCY_MS, decodeDuration: decodeDuration,
  });
  installXhr(server);
  installFetch(server);
  installPlayNotifier();
  if (opts.badge !== false) mountBadge(opts.badge, function () { resetDemo(); });
  var api = {
    app: opts.app || null, API_BASE: API_BASE, server: server, resetDemo: resetDemo, resolveMediaUrl: resolveMediaUrl,
    isTtsAnnouncement: isTtsAnnouncement, speakAnnouncement: speakAnnouncement, cancelSpeech: cancelSpeech, notifyMediaPlaying: notifyMediaPlaying,
  };
  window.__ambiiDemo = api;
  return api;
}

export default installAmbiiDemo;
