// Small helpers shared by the handlers. ES2017, no dependencies.

// A deterministic PRNG (mulberry32), used for seeding so every visitor starts from the same data.
export function seededRandom(seed) {
  var s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex(random, n) {
  var out = '';
  for (var i = 0; i < n; i++) out += Math.floor(random() * 16).toString(16);
  return out;
}

// Mongo-style 24-hex id: 8 hex of seconds, then 16 random hex.
export function newId(ctx) {
  var secs = Math.floor(ctx.now().getTime() / 1000).toString(16);
  while (secs.length < 8) secs = '0' + secs;
  return secs.slice(-8) + hex(ctx.random, 16);
}

// Fixed ids for the seed: a 6-hex prefix per collection plus a counter.
export function fixedId(prefix, n) {
  var s = Number(n).toString(16);
  while (s.length < 18) s = '0' + s;
  return prefix + s;
}

export function randomToken(random, n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var out = '';
  for (var i = 0; i < n; i++) out += chars.charAt(Math.floor(random() * chars.length));
  return out;
}

// Store and zone codes, as the server made them: a letter, then 5 of these (no I, L, O, 0, 1).
var CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function randomCode(random, n) {
  var out = '';
  for (var i = 0; i < n; i++) out += CODE_CHARS.charAt(Math.floor(random() * CODE_CHARS.length));
  return out;
}

export function clone(x) {
  return x === undefined ? undefined : JSON.parse(JSON.stringify(x));
}

export function pick(obj, keys) {
  var out = {};
  if (!obj || typeof obj !== 'object') return out;
  keys.forEach(function (k) {
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

export function values(map) {
  return Object.keys(map || {}).map(function (k) { return map[k]; });
}

export function shuffle(list, random) {
  var a = list.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(random() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

// 32-hex content hash (two 53-bit cyrb53 runs). Only compared for equality by the clients.
export function hash32(str) {
  function cyrb53(s, seed) {
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    var a = (h2 >>> 0).toString(16), b = (h1 >>> 0).toString(16);
    while (a.length < 8) a = '0' + a;
    while (b.length < 8) b = '0' + b;
    return a + b;
  }
  var s = String(str);
  return cyrb53(s, 1) + cyrb53(s, 2);
}

export function stamp(doc, now, isNew) {
  var iso = now.toISOString();
  if (isNew || !doc.createdAt) doc.createdAt = iso;
  doc.updatedAt = iso;
  if (doc.__v === undefined) doc.__v = 0;
  return doc;
}

export var STATES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky',
  LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

// The server stored full state names and turned 2-letter codes into them ("California" for unknown codes).
export function fullStateName(state) {
  if (typeof state !== 'string') return state;
  if (state.length === 2) return STATES[state.toUpperCase()] || 'California';
  return state;
}

export function validStatesList() {
  var out = [];
  Object.keys(STATES).forEach(function (code) { out.push(STATES[code], code); });
  return out;
}

export function toNumber(x, fallback) {
  var n = Number(x);
  return isFinite(n) ? n : fallback;
}
