// localStorage-backed collections. One key per collection ("ambii-demo:locations" = {id: doc}),
// read fresh at the start of every request, because three documents (dashboard, web player, mobile app)
// share them. Callers run a whole request inside the cross-document lock, so a transaction's
// read-modify-write cannot interleave with another document's.

export var COLLECTIONS = [
  'users', 'companies', 'locations', 'zones', 'stations', 'schedules', 'scheduleBlocks', 'trackSchedules',
  'announcements', 'ttsPreviews', 'players', 'playerJWTs', 'downvotes', 'billingAddresses', 'cards', 'invoices', 'logs',
];

// A Storage-like object kept in memory (node tests, or a browser where localStorage throws).
export function memoryStorage() {
  var data = {};
  return {
    get length() { return Object.keys(data).length; },
    key: function (i) { return Object.keys(data)[i] === undefined ? null : Object.keys(data)[i]; },
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null; },
    setItem: function (k, v) { data[k] = String(v); },
    removeItem: function (k) { delete data[k]; },
    clear: function () { data = {}; },
  };
}

export function keysWithPrefix(storage, prefix) {
  var out = [];
  try {
    for (var i = 0; i < storage.length; i++) {
      var k = storage.key(i);
      if (k && k.indexOf(prefix) === 0) out.push(k);
    }
  } catch (e) { /* storage unavailable */ }
  return out;
}

export function createStore(storage, prefix) {
  function read(name) {
    var raw = null;
    try { raw = storage.getItem(prefix + name); } catch (e) { raw = null; }
    if (!raw) return {};
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
  }

  function begin() {
    var cache = {};
    var dirty = {};
    function coll(name) {
      if (!cache[name]) cache[name] = read(name);
      return cache[name];
    }
    return {
      get: function (name, id) {
        if (id === null || id === undefined || id === '') return null;
        var doc = coll(name)[String(id)];
        return doc || null;
      },
      // Documents in insertion order (ids are never integer-like, so object key order is preserved).
      all: function (name) {
        var c = coll(name);
        return Object.keys(c).map(function (k) { return c[k]; });
      },
      find: function (name, test) {
        return this.all(name).filter(test);
      },
      findOne: function (name, test) {
        return this.all(name).filter(test)[0] || null;
      },
      put: function (name, doc) {
        coll(name)[String(doc._id)] = doc;
        dirty[name] = true;
        return doc;
      },
      remove: function (name, id) {
        delete coll(name)[String(id)];
        dirty[name] = true;
      },
      // Replace a whole collection (seeding).
      replace: function (name, map) {
        cache[name] = map;
        dirty[name] = true;
      },
      getMeta: function () {
        var raw = null;
        try { raw = storage.getItem(prefix + 'meta'); } catch (e) { raw = null; }
        try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
      },
      setMeta: function (meta) {
        storage.setItem(prefix + 'meta', JSON.stringify(meta));
      },
      wipe: function () {
        keysWithPrefix(storage, prefix).forEach(function (k) {
          if (k.slice(prefix.length).indexOf('ui:') === 0) return; // keep per-viewer UI state (badge)
          try { storage.removeItem(k); } catch (e) { /* ignore */ }
        });
        cache = {};
        dirty = {};
      },
      // Writes the changed collections, then "meta" with a new revision (a timestamp, strictly increasing).
      // Returns that revision, or null when nothing changed.
      commit: function () {
        var names = Object.keys(dirty);
        if (!names.length) return null;
        names.forEach(function (name) {
          storage.setItem(prefix + name, JSON.stringify(cache[name]));
        });
        dirty = {};
        var meta = this.getMeta() || {};
        meta.rev = Math.max(Date.now(), (Number(meta.rev) || 0) + 1);
        storage.setItem(prefix + 'meta', JSON.stringify(meta));
        return meta.rev;
      },
    };
  }

  // The revision of the data this document's storage currently shows.
  function revision() {
    try {
      var meta = JSON.parse(storage.getItem(prefix + 'meta') || 'null');
      return meta ? Number(meta.rev) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  return { begin: begin, revision: revision };
}
