// /v3/api/player/*: pairing, the finishedTrack heartbeat, downvotes, favorites.
import { send, rawError } from '../envelope.js';
import { stamp, newId, randomToken, toNumber } from '../util.js';
import { trackById, isAdId } from '../catalogue.js';
import {
  getStation, assignStation, buildTrackSchedule, blocksOf, dueBlock, stationLite, stationDetail, scheduleWithBlocks, trackScheduleFull, locationFull,
  isSimulatedPlayer, simulatedNowPlaying, followSchedule,
} from '../music.js';
import { welcomeTime } from '../seed.js';
import { DEFAULT_STATION_ID } from '../../config.js';

function activeSchedule(tx, loc) {
  var s = loc.schedule ? tx.get('schedules', loc.schedule) : null;
  return s && !s.isDeleted ? s : null;
}

// Demo only: an announcement with demoAutoTime (the seeded "Welcome") is moved to just after each connect
// to one of its locations, so a short visit hears it once. It stays put between connects, so it plays once,
// not at every track end. Once its time is edited in the dashboard, demoAutoTime no longer matches and the
// visitor's time is kept.
function retimeWelcome(ctx, loc) {
  var tx = ctx.tx, now = ctx.now();
  tx.all('announcements').forEach(function (a) {
    if (a.isDeleted || !a.isActive || !a.demoAutoTime || a.frequency !== 'specific time') return;
    if ((a.assignedLocations || []).indexOf(loc._id) < 0) return;
    var times = Array.isArray(a.specifiedTimes) ? a.specifiedTimes : [];
    if (times.length !== 1 || !times[0].time || Number(times[0].time.unixTimeStamp) !== Number(a.demoAutoTime)) return;
    var t = welcomeTime(now);
    a.specifiedTimes = [t];
    a.demoAutoTime = t.time.unixTimeStamp;
    stamp(a, now);
    tx.put('announcements', a);
  });
}

// POST /v3/api/player/connect
export function connect(ctx) {
  var tx = ctx.tx, b = ctx.body || {}, now = ctx.now();
  var loc = null;
  if (b.locationId) loc = tx.get('locations', b.locationId);
  else if (typeof b.storeCode === 'string') loc = tx.findOne('locations', function (l) { return l.storeCode === b.storeCode && !l.isDeleted; });
  if (!loc) return send('INVALID_CODE');
  if (loc.isActive === false) return send('INACTIVE_LOCATION');

  var paired = loc.pairedDevice ? tx.get('players', loc.pairedDevice) : null;
  if (paired && paired.deviceId && paired.deviceId !== b.deviceId && !b.override) return send('DEVICE_ALREADY_PAIRED', 'DEVICE_ALREADY_PAIRED');

  // Demo only: taking over from a simulated in-store player carries on from the song the store is playing
  // (the players start at location.currentTrackNumber). The store first catches up with its schedule, as the
  // dashboard's next look would, so a block that began since then is joined partway through, not at its start.
  if (isSimulatedPlayer(paired)) {
    followSchedule(ctx, loc);
    var sim = simulatedNowPlaying(ctx, loc);
    if (sim) {
      loc.currentTrack = sim.currentTrack;
      loc.currentTrackNumber = sim.currentTrackNumber;
      loc.lastTrack = sim.lastTrack;
    }
  }

  // A scheduled location switches to the block that is due now.
  var schedule = activeSchedule(tx, loc);
  if (schedule) {
    var block = dueBlock(blocksOf(tx, schedule), now);
    if (block && block.station && getStation(tx, block.station) && block.station !== loc.station) assignStation(ctx, [loc._id], block.station, schedule);
  }

  var player = b.deviceId ? tx.findOne('players', function (p) { return p.deviceId === b.deviceId && !p.isDeleted; }) : null;
  if (!player) {
    player = { _id: newId(ctx), deviceId: b.deviceId || 'unknown-' + randomToken(ctx.random, 10), locationHistory: {}, isDeleted: false };
    stamp(player, now, true);
  }
  player.locationHistory = player.locationHistory || {};
  player.locationHistory[loc._id] = true;
  if (b.deviceName !== undefined) player.deviceName = b.deviceName;
  if (b.deviceBrand !== undefined) player.deviceBrand = b.deviceBrand;
  if (b.deviceToken !== undefined) player.deviceToken = b.deviceToken;
  player.utc_offset = typeof b.utc_offset === 'number' ? b.utc_offset : player.utc_offset !== undefined ? player.utc_offset : 420;
  // The server only marked a new device as playing at its first finishedTrack; the dashboard should
  // show it online right away.
  player.lastActive = now.toISOString();
  player.isPlaying = true;
  stamp(player, now);
  tx.put('players', player);

  // A device plays at one location: unpair it (and drop its tokens) everywhere else. The server left the
  // old location paired, which showed two locations "Online" with one device.
  tx.all('locations').forEach(function (l) {
    if (l._id !== loc._id && l.pairedDevice === player._id) {
      l.pairedDevice = null;
      tx.put('locations', l);
    }
  });
  loc.pairedDevice = player._id;

  if (!loc.trackSchedule || !tx.get('trackSchedules', loc.trackSchedule)) {
    if (!loc.station) loc.station = DEFAULT_STATION_ID;
    var ts = buildTrackSchedule(ctx, loc, loc.station);
    loc.currentTrack = ts.queue[0] || null;
    loc.lastTrack = null;
    loc.currentTrackNumber = 0;
  }
  stamp(loc, now);
  tx.put('locations', loc);
  retimeWelcome(ctx, loc);

  // Pairing revokes every other token of this location (that is how another device gets kicked: its next
  // request answers 401 TOKEN_INVALID). A valid token the device already holds for this location is kept.
  var keep = ctx.playerAuth && ctx.playerAuth.jwt.location === loc._id ? ctx.playerAuth.jwt : null;
  tx.all('playerJWTs').forEach(function (j) {
    if ((j.location === loc._id || j.player === player._id) && (!keep || j._id !== keep._id)) tx.remove('playerJWTs', j._id);
  });
  var token = keep ? keep._id : 'demo.' + loc._id + '.' + randomToken(ctx.random, 24);
  if (!keep) tx.put('playerJWTs', stamp({ _id: token, playerJWT: token, player: player._id, location: loc._id }, now, true));

  return send('SUCCESSFUL_PAIRED', { location: locationFull(ctx, loc), ambii_player_jwt: token }, 'Player');
}

// POST /v3/api/player/disconnect {deviceId}
export function disconnect(ctx) {
  var tx = ctx.tx, b = ctx.body || {};
  if (!b.deviceId) return send('NO_DATA_FOUND', null, 'Player');
  if (ctx.playerAuth) {
    var loc = tx.get('locations', ctx.playerAuth.jwt.location);
    var p = loc && loc.pairedDevice ? tx.get('players', loc.pairedDevice) : null;
    if (p && p.deviceId === b.deviceId) {
      loc.pairedDevice = null;
      p.isPlaying = false;
      stamp(p, ctx.now());
      tx.put('locations', loc);
      tx.put('players', p);
    }
    tx.remove('playerJWTs', ctx.playerAuth.jwt._id);
  }
  return send('SUCCESSFUL_DISCONNECT', null, 'Player');
}

// POST /v3/api/player/finishedTrack: the only thing players send while playing. Its answer is how a
// player learns about a new station, schedule or queue; it is also the heartbeat behind "Online" and
// "Now Playing" in the dashboard.
export function finishedTrack(ctx) {
  var tx = ctx.tx, b = ctx.body || {}, now = ctx.now();
  if (!b.locationId && !b.stationId && !b.nextTrackId && !b.lastTrackId) return send('BAD_REQUEST');
  var loc = b.locationId ? tx.get('locations', b.locationId) : null;
  if (loc && loc.isDeleted) loc = null;
  if (loc && loc.isActive === false) return send('INACTIVE_LOCATION');
  if (!loc) return send('LOCATION_DOES_NOT_EXIST');

  var paired = loc.pairedDevice ? tx.get('players', loc.pairedDevice) : null;
  // The server wrapped this one as {data: "DEVICE_ALREADY_PAIRED"}, which neither player recognised.
  if (b.deviceId && (!paired || paired.deviceId !== b.deviceId)) return send('DEVICE_ALREADY_PAIRED', 'DEVICE_ALREADY_PAIRED');

  var data = {};
  var schedule = activeSchedule(tx, loc);
  if (schedule) {
    var block = dueBlock(blocksOf(tx, schedule), now);
    var due = block && block.station && getStation(tx, block.station) ? block.station : '';
    // The mobile app never sends scheduleId (it sends trackScheduleId): a missing key means "unknown",
    // not "different", or every track end would rebuild its queue.
    var scheduleChanged = Object.prototype.hasOwnProperty.call(b, 'scheduleId') && String(b.scheduleId) !== String(schedule._id);
    if (due && (scheduleChanged || String(b.stationId) !== due)) {
      if (loc.station !== due) assignStation(ctx, [loc._id], due, schedule);
      var sts = tx.get('trackSchedules', loc.trackSchedule);
      loc.currentTrackNumber = 0;
      loc.currentTrack = sts.queue[0] || null;
      loc.lastTrack = null;
      data = {
        newTrackSchedule: true, trackSchedule: trackScheduleFull(sts), track: trackById(sts.queue[0]), newStation: true,
        station: stationDetail(getStation(tx, due)), schedule: scheduleWithBlocks(tx, schedule),
      };
      if (scheduleChanged) data.newSchedule = true;
    }
  }

  if (!data.newStation) {
    var ts = tx.get('trackSchedules', loc.trackSchedule);
    if (!ts) ts = buildTrackSchedule(ctx, loc, loc.station || DEFAULT_STATION_ID);
    if (String(b.queueHash || '') !== ts.queueHash) {
      // A new queue (station assigned in the dashboard, plan change): send it.
      data.newTrackSchedule = true;
      data.trackSchedule = trackScheduleFull(ts);
      data.track = trackById(b.nextTrackId) || trackById(ts.queue[0]);
      if (String(b.stationId) !== String(loc.station)) {
        data.newStation = true;
        data.station = stationDetail(getStation(tx, loc.station));
        if (schedule) data.schedule = scheduleWithBlocks(tx, schedule);
        loc.currentTrackNumber = 0;
        loc.currentTrack = ts.queue[0] || null;
      } else {
        loc.currentTrackNumber = toNumber(b.currentTrackNumber, 0);
        if (trackById(b.nextTrackId)) loc.currentTrack = b.nextTrackId;
      }
      loc.lastTrack = null;
    } else {
      loc.currentTrackNumber = toNumber(b.currentTrackNumber, loc.currentTrackNumber);
      if (trackById(b.nextTrackId)) loc.currentTrack = b.nextTrackId;
      if (b.lastTrackId && !isAdId(b.lastTrackId) && trackById(b.lastTrackId)) loc.lastTrack = b.lastTrackId;
    }
  }

  stamp(loc, now);
  tx.put('locations', loc);
  if (paired) {
    paired.lastActive = now.toISOString();
    paired.isPlaying = true;
    tx.put('players', paired);
  }
  return send('SUCCESSFUL', data);
}

var REASONS = ['TRACK_DISLIKED', 'TRACK_OVERPLAYED', 'TRACK_BAD_FIT', 'EXPLICIT_ALBUM_ART'];

// POST /v3/api/player/downvote (the mobile app posts to "v3/api/..." without the leading slash)
export function downvote(ctx) {
  var b = ctx.body || {};
  if (REASONS.indexOf(b.reason) < 0) return rawError(500, "'reason' is required or invalid!. Valid reasons are: [" + REASONS.join(', ') + ']');
  if (!b.trackId) return rawError(500, "'trackId' is required!");
  if (!b.stationId) return rawError(500, "'stationId' is required!");
  if (!ctx.playerAuth) return rawError(500, "'locationId' is required!");
  var doc = { _id: newId(ctx), reason: b.reason, trackId: String(b.trackId), stationId: String(b.stationId), locationId: ctx.playerAuth.jwt.location, isDeleted: false };
  ctx.tx.put('downvotes', stamp(doc, ctx.now(), true));
  return send('SUCCESSFUL', {});
}

// GET /v3/api/player/favorite: favorites of the users who manage this player's location.
export function favorites(ctx) {
  var tx = ctx.tx;
  var locId = ctx.playerAuth ? ctx.playerAuth.jwt.location : null;
  var seen = {}, out = [];
  tx.all('users').forEach(function (u) {
    if (u.isDeleted || u.company !== ctx.companyId || !locId || (u.assignedLocations || []).indexOf(locId) < 0) return;
    (u.favorites || []).forEach(function (id) {
      var st = getStation(tx, id);
      if (st && !seen[id]) {
        seen[id] = true;
        out.push(stationLite(st));
      }
    });
  });
  return send('DATA_FOUND', out, 'Player');
}
