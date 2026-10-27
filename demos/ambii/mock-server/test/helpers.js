// Test helpers: a server over in-memory storage and media, with a controllable clock.
import { createServer } from '../core/server.js';
import { memoryStorage } from '../core/store.js';
import { API_BASE } from '../config.js';

export function makeServer(options) {
  var opts = options || {};
  var clock = { time: opts.time ? new Date(opts.time).getTime() : Date.now() };
  var storage = opts.storage || memoryStorage();
  var mediaMap = opts.mediaMap || {};
  var media = {
    put: function (id, rec) { mediaMap[id] = rec; return Promise.resolve(); },
    get: function (id) { return Promise.resolve(mediaMap[id] || null); },
  };
  var server = createServer({ storage: storage, media: media, now: function () { return new Date(clock.time); }, random: opts.random });
  async function call(method, path, body, headers, files) {
    var res = await server.handle({ method: method, url: API_BASE + path, body: body === undefined ? null : body, headers: headers || {}, files: files });
    return res;
  }
  return {
    server: server, storage: storage, mediaMap: mediaMap, clock: clock, call: call,
    advance: function (ms) { clock.time += ms; },
    // Reads a collection straight from storage, as another document would.
    collection: function (name) { return JSON.parse(storage.getItem('ambii-demo:' + name) || '{}'); },
  };
}

// A local time today (in the machine's timezone) as epoch ms.
export function todayAt(h, m) {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m || 0, 0).getTime();
}

export var PLAYER = { deviceName: 'web', deviceId: 'web-TESTDEVICE', deviceBrand: 'web', override: false, utc_offset: 420 };

export async function connect(s, storeCode, extra) {
  var res = await s.call('POST', '/v3/api/player/connect', Object.assign({}, PLAYER, { storeCode: storeCode }, extra || {}));
  return res;
}

// The web player's finishedTrack body after `location` finished queue[n] and moves to n+1.
export function finishedBody(location, n, extra) {
  var q = location.trackSchedule.queue;
  var next = n + 1 < q.length ? n + 1 : 0;
  return Object.assign({
    locationId: location._id, stationId: location.station._id, scheduleId: location.schedule ? location.schedule._id : null,
    nextTrackId: q[next]._id, lastTrackId: q[n]._id, deviceId: PLAYER.deviceId, songCompletion: '100.00', currentTrackNumber: String(next),
    queueHash: location.trackSchedule.queueHash,
  }, extra || {});
}
