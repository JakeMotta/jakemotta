// Uploaded announcement audio lives in IndexedDB ("ambii-demo", store "media"), shared by every demo
// document of the origin. resolveMediaUrl() turns API_BASE/media/<id>.mp3 into an object URL that
// this document can hand to an <audio> element (a blob: URL only works in the document that made it).
import { API_BASE, IDB_NAME } from '../config.js';

var dbPromise = null;
var memory = {}; // fallback when IndexedDB is unavailable (then uploads stay in this document)

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise(function (resolve, reject) {
    if (typeof indexedDB === 'undefined' || !indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    var req;
    try { req = indexedDB.open(IDB_NAME, 2); } catch (e) { reject(e); return; }
    req.onupgradeneeded = function () {
      var db = req.result;
      if (!db.objectStoreNames.contains('media')) db.createObjectStore('media');
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    req.onsuccess = function () {
      var db = req.result;
      // Another document deleting the database (Reset demo) must not be blocked by this one.
      db.onversionchange = function () {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    req.onerror = function () { reject(req.error); };
    req.onblocked = function () { reject(new Error('IndexedDB blocked')); };
  });
  dbPromise.catch(function () { dbPromise = null; });
  return dbPromise;
}

function run(mode, fn, storeName) {
  var name = storeName || 'media';
  return openDb().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(name, mode);
      var result;
      tx.oncomplete = function () { resolve(result); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error || new Error('aborted')); };
      fn(tx.objectStore(name), function (r) { result = r; });
    });
  });
}

export var idbMedia = {
  put: function (id, record) {
    return run('readwrite', function (store) { store.put(record, id); }).catch(function () { memory[id] = record; });
  },
  get: function (id) {
    if (memory[id]) return Promise.resolve(memory[id]);
    return run('readonly', function (store, done) {
      var r = store.get(id);
      r.onsuccess = function () { done(r.result || null); };
    }).catch(function () { return null; });
  },
};

// The revision of the last commit to the shared localStorage data (see waitForFence in core/server.js).
// IndexedDB is consistent across tabs, localStorage is not.
export var idbFence = {
  read: function () {
    return run('readonly', function (store, done) {
      var r = store.get('rev');
      r.onsuccess = function () { done(r.result || 0); };
    }, 'meta').catch(function () { return 0; });
  },
  write: function (rev) {
    return run('readwrite', function (store) { store.put(rev, 'rev'); }, 'meta').catch(function () {});
  },
};

export function closeMediaDb() {
  var p = dbPromise;
  dbPromise = null;
  if (p) p.then(function (db) { db.close(); }, function () {});
}

// Deletes the database; resolves even when another tab blocks it (the delete then completes once that
// tab closes its connection, which our onversionchange handler does).
export function deleteMediaDb() {
  closeMediaDb();
  memory = {};
  return new Promise(function (resolve) {
    if (typeof indexedDB === 'undefined' || !indexedDB) { resolve(); return; }
    var done = false;
    function finish() { if (!done) { done = true; resolve(); } }
    try {
      var req = indexedDB.deleteDatabase(IDB_NAME);
      req.onsuccess = finish;
      req.onerror = finish;
      req.onblocked = function () { setTimeout(finish, 300); };
    } catch (e) { finish(); }
    setTimeout(finish, 1500);
  });
}

var objectUrls = {};

export function mediaIdFromUrl(url) {
  if (typeof url !== 'string' || typeof location === 'undefined') return null;
  var u;
  try { u = new URL(url, location.href); } catch (e) { return null; }
  if (u.origin !== location.origin) return null;
  var m = new RegExp('^' + API_BASE.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '/media/([\\w-]+?)(?:\\.mp3)?$').exec(u.pathname);
  return m ? m[1] : null;
}

// For <audio src>: API_BASE/media/<id>.mp3 -> blob: URL of the uploaded file; any other URL unchanged.
export function resolveMediaUrl(url) {
  var id = mediaIdFromUrl(url);
  if (!id) return Promise.resolve(url);
  if (objectUrls[id]) return Promise.resolve(objectUrls[id]);
  return idbMedia.get(id).then(function (rec) {
    if (!rec || !rec.blob) return url;
    var blob = rec.blob.type ? rec.blob : new Blob([rec.blob], { type: rec.type || 'audio/mpeg' });
    objectUrls[id] = URL.createObjectURL(blob);
    return objectUrls[id];
  }, function () { return url; });
}

// Exact duration of an odd MP3 the frame parser could not read, by decoding it.
export function decodeDuration(arrayBuffer) {
  var Ctx = typeof window !== 'undefined' && (window.OfflineAudioContext || window.webkitOfflineAudioContext);
  if (!Ctx) return Promise.resolve(0);
  return new Promise(function (resolve) {
    try {
      var ctx = new Ctx(1, 1, 44100);
      var p = ctx.decodeAudioData(arrayBuffer, function (buf) { resolve(buf.duration); }, function () { resolve(0); });
      if (p && p.then) p.then(function (buf) { resolve(buf.duration); }, function () { resolve(0); });
    } catch (e) { resolve(0); }
  });
}
