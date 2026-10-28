// The mock API: routing, identity, seeding and transactions. Environment-agnostic (no window, no DOM):
// the browser glue (../browser/*) and the node tests both drive it through createServer().handle().
import { send, notFound } from './envelope.js';
import { createStore } from './store.js';
import { seed, IDS } from './seed.js';
import { SILENCE_MP3_BASE64 } from './media-data.js';
import * as account from './handlers/account.js';
import * as locations from './handlers/locations.js';
import * as upload from './handlers/upload.js';
import * as stations from './handlers/stations.js';
import * as player from './handlers/player.js';
import * as schedules from './handlers/schedules.js';
import * as announcements from './handlers/announcements.js';
import * as billing from './handlers/billing.js';
import * as misc from './handlers/misc.js';
import { API_BASE, STORAGE_PREFIX, SEED_VERSION } from '../config.js';

// [method, path template, handler]. Paths are matched on the "v3/(api|auth|public)/..." part, with
// slashes collapsed and trailing ones dropped. More specific templates come first.
export var ROUTES = [
  ['GET', 'v3/auth/jwt', account.getJwt],
  ['POST', 'v3/auth/signup', account.signup],
  ['PATCH', 'v3/auth/user/favorite/:id', account.toggleFavorite],
  ['PATCH', 'v3/auth/user/:id', account.patchUser],
  ['PATCH', 'v3/auth/company', account.patchCompany],
  ['GET', 'v3/auth/company', account.getCompany],

  ['GET', 'v3/auth/location', locations.getLocations],
  ['POST', 'v3/auth/location', locations.postLocation],
  ['POST', 'v3/auth/location/upload', upload.uploadLocations],
  ['GET', 'v3/auth/location/:id', locations.getLocation],
  ['PATCH', 'v3/auth/location/:id', locations.patchLocation],
  ['DELETE', 'v3/auth/location/:id', locations.deleteLocation],
  ['GET', 'v3/auth/zone', locations.getZones],
  ['PATCH', 'v3/auth/zone/:id', locations.patchZone],
  ['DELETE', 'v3/auth/zone/:id', locations.deleteZone],

  ['GET', 'v3/api/station', stations.listStations],
  ['GET', 'v3/api/station/:id', stations.getStationDetail],
  ['POST', 'v3/api/station/:id', stations.postAssignStation],

  ['POST', 'v3/api/player/connect', player.connect],
  ['POST', 'v3/api/player/disconnect', player.disconnect],
  ['POST', 'v3/api/player/finishedTrack', player.finishedTrack],
  ['POST', 'v3/api/player/downvote', player.downvote],
  ['GET', 'v3/api/player/favorite', player.favorites],

  ['GET', 'v3/auth/schedule', schedules.getSchedules],
  ['POST', 'v3/auth/schedule', schedules.postSchedule],
  ['PATCH', 'v3/auth/schedule/:id', schedules.patchSchedule],
  ['DELETE', 'v3/auth/schedule/:id', schedules.deleteSchedule],

  ['GET', 'v3/api/announcement', announcements.getAnnouncements],
  ['GET', 'v3/api/voices', announcements.getVoices],
  ['POST', 'v3/auth/announcement/preview', announcements.preview],
  ['POST', 'v3/auth/announcement/upload', announcements.uploadAnnouncement],
  ['PATCH', 'v3/auth/announcement/upload/:id', announcements.updateUploaded],
  ['POST', 'v3/auth/announcement', announcements.createAnnouncement],
  ['PATCH', 'v3/auth/announcement/:id', announcements.editAnnouncement],
  ['DELETE', 'v3/auth/announcement/:id', announcements.deleteAnnouncement],

  ['GET', 'v3/auth/billing-address', billing.getBillingAddresses],
  ['POST', 'v3/auth/billing-address', billing.postBillingAddress],
  ['PATCH', 'v3/auth/billing-address/:id', billing.patchBillingAddress],
  ['DELETE', 'v3/auth/billing-address/:id', billing.deleteBillingAddress],
  ['GET', 'v3/auth/card', billing.getCards],
  ['POST', 'v3/auth/card', billing.postCard],
  ['POST', 'v3/auth/card/:id', billing.postCardById],
  ['DELETE', 'v3/auth/card/:id', billing.deleteCard],
  ['POST', 'v3/auth/subscription', billing.subscribe],
  ['PATCH', 'v3/auth/subscription', billing.cancelSubscription],
  ['GET', 'v3/auth/invoice', billing.getInvoices],

  ['POST', 'v3/api/log/error', misc.logError],
  ['POST', 'v3/api/log', misc.log],
  ['GET', 'v3/public/mobile/version', misc.mobileVersion],
  ['GET', 'v3/public/valid-states', misc.validStates],
];

// "/projects/ambii-business/api/v3/auth/location/" -> {route: "v3/auth/location"}; also
// "/projects/ambii-business/apiv3/api/player/downvote" (the mobile app's missing slash).
export function routeOf(pathname) {
  if (pathname.indexOf(API_BASE) !== 0) return null;
  var rest = pathname.slice(API_BASE.length).replace(/\/{2,}/g, '/');
  var media = /^\/media\/([\w-]+?)(?:\.mp3)?\/?$/.exec(rest);
  if (media) return { media: media[1] };
  var tts = /^\/tts\/([\w-]+)\/?$/.exec(rest);
  if (tts) return { tts: tts[1] };
  var m = /v3\/(?:api|auth|public)(?:\/|$)/.exec(rest);
  if (!m) return { route: null };
  return { route: rest.slice(m.index).replace(/\/+$/, '') };
}

export function matchRoute(method, path) {
  var segs = path.split('/');
  for (var i = 0; i < ROUTES.length; i++) {
    var r = ROUTES[i];
    if (r[0] !== method) continue;
    var t = r[1].split('/');
    if (t.length !== segs.length) continue;
    var params = {}, ok = true;
    for (var k = 0; k < t.length && ok; k++) {
      if (t[k].charAt(0) === ':') {
        try { params[t[k].slice(1)] = decodeURIComponent(segs[k]); } catch (e) { params[t[k].slice(1)] = segs[k]; }
      } else if (t[k] !== segs[k]) ok = false;
    }
    if (ok) return { handler: r[2], template: r[1], params: params };
  }
  return null;
}

function base64ToBytes(b64) {
  var bin = typeof atob === 'function' ? atob(b64) : '';
  var out = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function lowerKeys(h) {
  var out = {};
  Object.keys(h || {}).forEach(function (k) { out[k.toLowerCase()] = h[k]; });
  return out;
}

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function json(res) {
  return { status: res.status, contentType: 'application/json; charset=utf-8', body: res.body };
}

// options: storage (Storage-like), media ({put, get}), withLock(fn) -> Promise, now() -> Date, random() -> [0,1),
// latency [min, max] ms, decodeDuration(arrayBuffer) -> Promise<seconds> (fallback for odd MP3s),
// fence {read() -> Promise<rev>, write(rev) -> Promise} (cross-tab consistency, see waitForFence).
export function createServer(options) {
  var opts = options || {};
  var store = createStore(opts.storage, STORAGE_PREFIX);
  var now = opts.now || function () { return new Date(); };
  var random = opts.random || Math.random;
  var withLock = opts.withLock || function (fn) { return fn(); };
  var latency = opts.latency || [0, 0];

  function delay() {
    var ms = latency[0] + Math.floor(random() * Math.max(0, latency[1] - latency[0]));
    return ms > 0 ? sleep(ms) : Promise.resolve();
  }

  // localStorage is not strongly consistent between tabs: Chrome gives each renderer process its own
  // cached copy and syncs it asynchronously, so a tab that takes the lock right after another tab's
  // write can still read the old data. The fence (an IndexedDB record, which is consistent) holds the
  // revision of the last commit; before reading, wait until this document's localStorage shows it.
  function waitForFence() {
    if (!opts.fence) return Promise.resolve();
    return Promise.resolve(opts.fence.read()).then(function (target) {
      if (!target) return null;
      var start = Date.now();
      return new Promise(function (resolve) {
        (function check() {
          if (store.revision() >= target || Date.now() - start > 1500) resolve();
          else setTimeout(check, 4);
        })();
      });
    }, function () { return null; });
  }

  // Runs one request against storage, holding the cross-document lock. Seeds first when the stored data
  // is missing or from an older seed. Nothing is written when the handler throws.
  function transaction(fn) {
    return withLock(function () {
      return waitForFence().then(function () {
        var tx = store.begin();
        var meta = tx.getMeta();
        if (!meta || meta.seedVersion !== SEED_VERSION) seed({ tx: tx, now: now, random: random });
        return Promise.resolve(fn(tx)).then(function (res) {
          var rev = tx.commit();
          if (!rev || !opts.fence) return res;
          return Promise.resolve(opts.fence.write(rev)).then(function () { return res; }, function () { return res; });
        });
      });
    });
  }

  // The dashboard's token names its user (account.userForToken): the seeded owner, or the business a visitor starts.
  // On /v3/auth it always decides; on /v3/api it decides when there is no player token (the dashboard's station
  // assign is POST /v3/api/station/:id). With no token, or any other, it is the seeded owner.
  function identify(ctx, area, headers, template) {
    var tx = ctx.tx;
    var bearer = /^Bearer\s+(\S+)/i.exec(String(headers.authorization || ''));
    var signedIn = bearer ? account.userForToken(ctx, bearer[1]) : null;
    var user = signedIn || tx.get('users', IDS.user) || tx.findOne('users', function (u) { return !u.isDeleted; });
    ctx.user = user;
    var companyId = user ? user.company : null;
    if (area === 'api') {
      // A player token identifies a player, and its location's company.
      var token = headers.ambii_player_jwt;
      if (token && token !== 'null' && token !== 'undefined') {
        var jwt = tx.get('playerJWTs', token);
        if (jwt) {
          ctx.playerAuth = { jwt: jwt };
          var loc = tx.get('locations', jwt.location);
          if (loc) companyId = loc.company;
        } else if (template !== 'v3/api/player/connect') {
          // A revoked token (another device took over the location): the only 401 the mock sends.
          return send('TOKEN_INVALID');
        }
      }
    }
    ctx.companyId = companyId;
    ctx.company = companyId ? tx.get('companies', companyId) : null;
    return null;
  }

  // req: {method, url, headers, body (parsed JSON object / string / null), files ({field: File})}
  // returns: {status, contentType, body} with body a JSON-able object, a Blob or a Uint8Array.
  function handle(req) {
    var method = String(req.method || 'GET').toUpperCase();
    var url = new URL(req.url, 'http://mock.invalid/');
    var where = routeOf(url.pathname);
    return delay().then(function () {
      if (!where) return json(notFound());
      if (where.media) {
        if (method !== 'GET' && method !== 'HEAD') return json(notFound());
        return Promise.resolve(opts.media ? opts.media.get(where.media) : null).then(function (rec) {
          if (!rec || !rec.blob) return json(notFound());
          return { status: 200, contentType: rec.type || 'audio/mpeg', body: rec.blob };
        }, function () { return json(notFound()); });
      }
      if (where.tts) {
        // Browser-spoken announcements have no audio file: anything fetching one as audio gets a second of silence.
        return { status: 200, contentType: 'audio/mpeg', body: base64ToBytes(SILENCE_MP3_BASE64) };
      }
      if (!where.route) return json(notFound());
      var match = matchRoute(method === 'HEAD' ? 'GET' : method, where.route);
      if (!match) return json(notFound());
      var headers = lowerKeys(req.headers);
      var query = {};
      url.searchParams.forEach(function (v, k) { query[k] = v; });
      return transaction(function (tx) {
        var ctx = {
          tx: tx, now: now, random: random, params: match.params, query: query, headers: headers, body: req.body, files: req.files || {},
          media: opts.media, decodeDuration: opts.decodeDuration, route: match.template,
        };
        var denied = identify(ctx, where.route.split('/')[1], headers, match.template);
        if (denied) return json(denied);
        return Promise.resolve(match.handler(ctx)).then(json);
      }).catch(function (err) {
        if (typeof console !== 'undefined') console.error('[ambii-demo] ' + method + ' ' + where.route + ' failed', err);
        return json(send('INTERNAL_SERVER_ERROR'));
      });
    });
  }

  return { handle: handle, store: store };
}
