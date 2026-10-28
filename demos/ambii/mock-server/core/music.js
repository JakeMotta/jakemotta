// Music logic ported from ambii_business_server: track schedules (queues), ads, station assignment,
// schedule blocks with generated ("dynamic") stations, and the populated shapes the clients read.
import { TRACKS, STATIONS, trackById, adId, isAdId, allTrackIds, genreWeights, bpmStats, artistById, topTracks, topArtists } from './catalogue.js';
import { newId, shuffle, clone, stamp, hash32, toNumber } from './util.js';
import { DEFAULT_STATION_ID, AD_INTERVAL_SECONDS, MIN_DYNAMIC_TRACKS, IDLE_OFFLINE_MS } from '../config.js';

export function getStation(tx, id) {
  if (!id) return null;
  return STATIONS[id] || tx.get('stations', id);
}

// ---------- queues (controllers/trackSchedule.js createTrackSchedule) ----------

// Shuffle the station's tracks, drop explicit ones unless the location allows them, drop the ones
// downvoted at this location for this station. Fixes two server bugs: the shuffle no longer always drops
// one track, and downvotes apply to every queue built for the station (the server only applied them
// when a station was assigned). Falls back rather than returning an empty queue.
export function musicQueue(ctx, location, station) {
  var down = {};
  ctx.tx.all('downvotes').forEach(function (d) {
    if (!d.isDeleted && d.locationId === location._id && d.stationId === station._id) down[d.trackId] = true;
  });
  var explicitOk = !!location.explicitAllowed;
  var pool = shuffle((station.tracks || []).filter(function (id) { return TRACKS[id]; }), ctx.random);
  var clean = pool.filter(function (id) { return explicitOk || !TRACKS[id].explicit_lyrics; });
  var queue = clean.filter(function (id) { return !down[id]; });
  if (!queue.length) queue = clean;
  if (!queue.length) queue = shuffle(allTrackIds(), ctx.random);
  return queue;
}

// The server's ad loop: one ad before the first track that starts after each 15 minutes of cumulative
// play (ad time included). Only when the company is not subscribed (the server used req.subscribed, which
// is undefined for player requests, so players always got ads; the mock uses company.subscribed).
export function withAds(queue, subscribed) {
  var music = queue.filter(function (id) { return !isAdId(id); });
  if (subscribed) return music;
  var out = [], adBreaks = 1, dur = 0, n = 0;
  music.forEach(function (id) {
    if (dur / AD_INTERVAL_SECONDS > adBreaks) {
      adBreaks += 1;
      dur = dur - (dur % AD_INTERVAL_SECONDS);
      n += 1;
      out.push(adId(n));
      dur += trackById(adId(n)).duration;
    }
    out.push(id);
    dur += TRACKS[id] ? TRACKS[id].duration : 0;
  });
  return out;
}

function isSubscribed(ctx, location) {
  var company = ctx.tx.get('companies', location.company);
  return !!(company && company.subscribed);
}

export function newQueueHash(ctx) {
  return hash32(String(ctx.now().getTime()) + ':' + ctx.random());
}

// createAndSaveTrackScheduleToLocation: a new trackSchedule doc (new queueHash) replaces the old one.
export function buildTrackSchedule(ctx, location, stationId, fixedTsId) {
  var station = getStation(ctx.tx, stationId) || STATIONS[DEFAULT_STATION_ID];
  var subscribed = isSubscribed(ctx, location);
  var ts = {
    _id: fixedTsId || newId(ctx), queue: withAds(musicQueue(ctx, location, station), subscribed), queueHash: newQueueHash(ctx),
    hasAds: !subscribed, location: location._id, station: station._id,
  };
  stamp(ts, ctx.now(), true);
  if (location.trackSchedule && location.trackSchedule !== ts._id) ctx.tx.remove('trackSchedules', location.trackSchedule);
  ctx.tx.put('trackSchedules', ts);
  location.trackSchedule = ts._id;
  return ts;
}

// After a plan change: same music order, ads added or removed, new queueHash so players pick it up at
// their next track end. (The server left existing queues alone until the next station assignment.)
export function refreshAds(ctx, location) {
  var ts = ctx.tx.get('trackSchedules', location.trackSchedule);
  if (!ts) return;
  var subscribed = isSubscribed(ctx, location);
  if (ts.hasAds === !subscribed) return;
  ts.queue = withAds(ts.queue, subscribed);
  ts.hasAds = !subscribed;
  ts.queueHash = newQueueHash(ctx);
  stamp(ts, ctx.now());
  ctx.tx.put('trackSchedules', ts);
}

// controllers/station.js assignStationToLocations. `schedule` is the schedule doc doing the assigning,
// or null for a plain station assignment (which removes any schedule from the location).
export function assignStation(ctx, locationIds, stationId, schedule, fixedTsIds) {
  var tx = ctx.tx;
  var station = getStation(tx, stationId);
  if (!station) return null;
  var found = tx.all('locations').filter(function (l) { return !l.isDeleted && locationIds.indexOf(l._id) >= 0; });
  var modified = [];
  found.forEach(function (loc, i) {
    var newScheduleId = schedule ? schedule._id : null;
    var prev = loc.schedule ? tx.get('schedules', loc.schedule) : null;
    if (prev && prev._id !== newScheduleId) {
      prev.assignedLocations = (prev.assignedLocations || []).filter(function (x) { return x !== loc._id; });
      stamp(prev, ctx.now());
      tx.put('schedules', prev);
      if (!modified.some(function (s) { return s._id === prev._id; })) modified.push(prev);
    }
    loc.schedule = newScheduleId;
    var ts = buildTrackSchedule(ctx, loc, stationId, fixedTsIds && fixedTsIds[i]);
    loc.station = station._id;
    loc.currentTrack = ts.queue[0] || null;
    loc.lastTrack = null;
    loc.currentTrackNumber = 0;
    loc.stationHistory = loc.stationHistory || [];
    if (loc.stationHistory.indexOf(station._id) < 0) loc.stationHistory.push(station._id);
    stamp(loc, ctx.now());
    tx.put('locations', loc);
  });
  return { locations: found, schedules: modified };
}

// ---------- schedules (controllers/schedule.js, station.js createDynamicStation) ----------

export function blocksOf(tx, schedule) {
  return (schedule.scheduleBlocks || []).map(function (id) { return tx.get('scheduleBlocks', id); }).filter(function (b) { return b && !b.isDeleted; });
}

// The block's generated station: tracks whose album has one of the block's genres and whose BPM is in the
// block's tempo range. The server fell back to every genre match when fewer than 100 tracks were in range,
// so tempo never mattered with a small catalogue. Here the range is inclusive (so the five tempo bands
// tile), and the station is topped up to MIN_DYNAMIC_TRACKS with the closest tempos: genre matches
// first, then the rest of the catalogue. A track whose first genre is one of the block's counts as a
// closer match than one that only lists it second, at the same tempo distance.
export function createDynamicStation(ctx, schedule, block, fixedStationId) {
  var keys = Object.keys(block.genres || {});
  var tempo = block.tempo || {};
  var min = toNumber(tempo.min, NaN), max = toNumber(tempo.max, NaN);
  var hasTempo = !isNaN(min) && !isNaN(max);
  var all = allTrackIds().map(function (id) { return TRACKS[id]; });
  var genreMatch = all.filter(function (t) { return t.album.genres.some(function (g) { return keys.indexOf(g) >= 0; }); });
  function inTempo(t) { return hasTempo && t.bpm >= min && t.bpm <= max; }
  function distance(t) { return !hasTempo || inTempo(t) ? 0 : Math.min(Math.abs(t.bpm - min), Math.abs(t.bpm - max)); }
  function lead(t) { return keys.indexOf(t.album.genres[0]) >= 0 ? 0 : 1; }
  var chosen = hasTempo ? genreMatch.filter(inTempo) : genreMatch.slice();
  chosen.sort(function (a, b) { return lead(a) - lead(b); });
  function topUp(from) {
    from.filter(function (t) { return chosen.indexOf(t) < 0; })
      .sort(function (a, b) { return distance(a) + lead(a) * 8 - (distance(b) + lead(b) * 8); })
      .forEach(function (t) { if (chosen.length < MIN_DYNAMIC_TRACKS) chosen.push(t); });
  }
  if (chosen.length < MIN_DYNAMIC_TRACKS) topUp(genreMatch);
  if (chosen.length < MIN_DYNAMIC_TRACKS) topUp(all);
  var ids = chosen.map(function (t) { return t._id; });
  var station = {
    _id: fixedStationId || newId(ctx), name: block.name || 'Schedule', type: 'dynamic', isPublic: false, description: '',
    genres: genreWeights(ids), bpm: bpmStats(ids), tags: [], era: {}, supersets: [], tracks: ids, top_tracks: topTracks(ids),
    top_artists: topArtists(ids), locationHistory: (schedule.assignedLocations || []).slice(), isDeleted: false,
  };
  stamp(station, ctx.now(), true);
  ctx.tx.put('stations', station);
  return station;
}

export function secondsOfDay(now) {
  return now.getHours() * 3600 + now.getMinutes() * 60;
}

// getStationFromSchedule, in the browser's local time. Last match wins, as on the server. Improvements:
// a block whose end is not after its start runs past midnight, and a block's `days` (0 = Sunday) are
// honoured when the block has any.
export function dueBlock(blocks, now) {
  var t = secondsOfDay(now), day = now.getDay(), hit = null;
  blocks.forEach(function (b) {
    if (!b || b.isDeleted) return;
    var s = Number(b.startTime), e = Number(b.endTime);
    var inside = e > s ? t >= s && t < e : t >= s || t < e;
    var days = Array.isArray(b.days) ? b.days.map(Number) : [];
    if (inside && (days.length === 0 || days.indexOf(day) >= 0)) hit = b;
  });
  return hit;
}

export function dueStationId(tx, schedule, now) {
  var b = dueBlock(blocksOf(tx, schedule), now);
  return b && b.station && getStation(tx, b.station) ? b.station : '';
}

// Drop generated stations nothing points at any more (the server kept them forever).
export function collectDynamicStations(tx) {
  var used = {};
  tx.all('scheduleBlocks').forEach(function (b) { if (!b.isDeleted && b.station) used[b.station] = true; });
  tx.all('locations').forEach(function (l) { if (l.station) used[l.station] = true; });
  tx.all('stations').forEach(function (s) { if (!used[s._id]) tx.remove('stations', s._id); });
}

// ---------- simulated in-store players (demo only) ----------

// The seeded stores' players are stand-ins, not devices: a player document with the demo-only field
// `simulated: true` plays in its store all day, so the dashboard's Locations page shows stores Online with
// Now Playing on a first visit (a real company's stores were playing whenever the owner looked). Nothing
// runs in the background: the position is worked out from the wall clock whenever a location is read.
// A real player that connects with override replaces it, and the simulation stops for that store.
export function isSimulatedPlayer(p) {
  return !!(p && p.simulated && !p.isDeleted);
}

export function simulatedPlayerAt(ctx, loc) {
  var p = loc && loc.pairedDevice ? ctx.tx.get('players', loc.pairedDevice) : null;
  return isSimulatedPlayer(p) ? p : null;
}

// Where a queue that started playing at trackSchedule.createdAt and loops forever is at `nowMs`: the
// elapsed time modulo the queue's total length, walked through the tracks' durations (ads included).
// lastTrack is the music track before it, as finishedTrack records it (never an ad; none before the
// first track of the first pass). Null for an empty queue.
export function simulatedPosition(ts, nowMs) {
  var queue = ts && Array.isArray(ts.queue) ? ts.queue : [];
  var durations = queue.map(function (id) {
    var t = trackById(id);
    return t ? Math.max(0, Number(t.duration) || 0) : 0;
  });
  var total = durations.reduce(function (a, b) { return a + b; }, 0);
  if (!(total > 0)) return null;
  var elapsed = Math.max(0, (nowMs - new Date(ts.createdAt || 0).getTime()) / 1000);
  var loops = Math.floor(elapsed / total);
  var t = elapsed - loops * total;
  var index = 0;
  while (index < queue.length - 1 && t >= durations[index]) {
    t -= durations[index];
    index += 1;
  }
  var lastTrack = null;
  for (var k = 1; k < queue.length && !lastTrack; k++) {
    var j = index - k;
    if (j < 0) {
      if (loops === 0) break;
      j += queue.length;
    }
    if (!isAdId(queue[j])) lastTrack = queue[j];
  }
  return { currentTrackNumber: index, currentTrack: queue[index], lastTrack: lastTrack, offset: t, loops: loops };
}

// What a simulated store is playing now, or null when the location has no simulated player.
export function simulatedNowPlaying(ctx, loc) {
  if (!simulatedPlayerAt(ctx, loc)) return null;
  return simulatedPosition(ctx.tx.get('trackSchedules', loc.trackSchedule), ctx.now().getTime());
}

// The block whose start came last, within the past week (honouring its days), and that start in epoch ms:
// with no block due, what a player that has followed the schedule all along is still playing, since a player
// keeps its station when a block ends and no other is due. Null when no block has started in that week.
export function lastStartedBlock(blocks, now) {
  var best = null, bestStart = -Infinity;
  blocks.forEach(function (b) {
    if (!b || b.isDeleted) return;
    var secs = Number(b.startTime);
    if (!isFinite(secs)) return;
    var days = Array.isArray(b.days) ? b.days.map(Number) : [];
    for (var back = 0; back <= 7; back++) {
      // In local time: the Date constructor folds the seconds into the local day (see followSchedule).
      var start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back, 0, 0, secs);
      if (start.getTime() > now.getTime() || (days.length && days.indexOf(start.getDay()) < 0)) continue;
      if (start.getTime() >= bestStart) { // a tie goes to the later block, as in dueBlock
        best = b;
        bestStart = start.getTime();
      }
      break; // its starts on earlier days are earlier still
    }
  });
  return best ? { block: best, start: bestStart } : null;
}

// A simulated store on a schedule moves to the block that is due now, as its player would have at the
// first track end after the boundary. The new queue counts as started when the block began, so the store
// is mid-queue rather than on its first track. With no block due, a store already on one of the schedule's
// block stations moves to the block that ran last (its player would have switched to it and kept it after it
// ended, even though nobody looked meanwhile); a store on a station of its own keeps it (Weekend Brunch first
// seen on a weekday). Called by the dashboard's GET (it writes, inside that request's transaction); returns
// true when the station changed.
export function followSchedule(ctx, loc) {
  var tx = ctx.tx, now = ctx.now();
  if (!loc || loc.isDeleted || loc.isActive === false || !simulatedPlayerAt(ctx, loc)) return false;
  var schedule = loc.schedule ? tx.get('schedules', loc.schedule) : null;
  if (!schedule || schedule.isDeleted) return false;
  var blocks = blocksOf(tx, schedule);
  var block = dueBlock(blocks, now), start = NaN;
  if (block) {
    // The block's start in local time (the Date constructor folds the seconds into the local day, so a
    // daylight-saving change that day doesn't shift it); a block that started before midnight began yesterday.
    var secs = Number(block.startTime);
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, secs).getTime();
    if (start > now.getTime()) start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, secs).getTime();
  } else {
    var following = blocks.some(function (b) { return b.station && b.station === loc.station; });
    var last = following ? lastStartedBlock(blocks, now) : null;
    if (!last) return false;
    block = last.block;
    start = last.start;
  }
  if (!block.station || !getStation(tx, block.station) || block.station === loc.station) return false;
  assignStation(ctx, [loc._id], block.station, schedule);
  var ts = tx.get('trackSchedules', loc.trackSchedule);
  if (ts && isFinite(start)) {
    ts.createdAt = new Date(start).toISOString();
    tx.put('trackSchedules', ts);
  }
  return true;
}

// ---------- populated shapes ----------

export function stationLite(st) {
  if (!st) return null;
  var v = clone(st);
  delete v.tracks;
  delete v.top_tracks;
  delete v.top_artists;
  delete v.locationHistory;
  return v;
}

// GET /v3/api/station/:id: lite + top_tracks / top_artists populated.
export function stationDetail(st) {
  if (!st) return null;
  var v = stationLite(st);
  v.top_tracks = (st.top_tracks || []).map(trackById).filter(Boolean);
  v.top_artists = (st.top_artists || []).map(artistById).filter(Boolean);
  return v;
}

export function scheduleWithBlocks(tx, schedule) {
  if (!schedule) return null;
  var v = clone(schedule);
  v.scheduleBlocks = (schedule.scheduleBlocks || []).map(function (id) { return tx.get('scheduleBlocks', id); }).filter(Boolean).map(clone);
  return v;
}

export function trackScheduleFull(ts) {
  if (!ts) return null;
  var v = clone(ts);
  v.queue = ts.queue.map(trackById).filter(Boolean);
  return v;
}

// Online/offline, computed on read (the server flipped isPlaying off after 15 idle minutes). A track longer
// than that (none in the catalogue, but uploads...) does not make a playing device look offline.
// A simulated player (demo only) is playing whenever its location is active.
export function playerView(ctx, playerId, location) {
  var p = playerId ? ctx.tx.get('players', playerId) : null;
  if (!p) return null;
  var v = clone(p);
  if (isSimulatedPlayer(p)) {
    v.isPlaying = !location || location.isActive !== false;
    if (v.isPlaying) v.lastActive = ctx.now().toISOString();
    return v;
  }
  var current = location ? trackById(location.currentTrack) : null;
  var limit = Math.max(IDLE_OFFLINE_MS, current ? current.duration * 1000 + 120000 : 0);
  var last = new Date(p.lastActive || 0).getTime();
  v.isPlaying = !!p.isPlaying && ctx.now().getTime() - last < limit;
  return v;
}

// LocationFull: connect, station assignment, schedule create/update, POST location.
export function locationFull(ctx, loc) {
  var tx = ctx.tx;
  var v = clone(loc);
  v.company = clone(tx.get('companies', loc.company));
  v.station = stationDetail(getStation(tx, loc.station));
  var schedule = loc.schedule ? tx.get('schedules', loc.schedule) : null;
  v.schedule = schedule && !schedule.isDeleted ? scheduleWithBlocks(tx, schedule) : null;
  v.trackSchedule = trackScheduleFull(tx.get('trackSchedules', loc.trackSchedule));
  var sim = simulatedNowPlaying(ctx, loc);
  if (sim) {
    v.currentTrackNumber = sim.currentTrackNumber;
    v.currentTrack = trackById(sim.currentTrack);
    v.lastTrack = trackById(sim.lastTrack);
  } else {
    v.currentTrack = trackById(loc.currentTrack);
    v.lastTrack = trackById(loc.lastTrack);
  }
  v.pairedDevice = playerView(ctx, loc.pairedDevice, loc);
  v.subscription = null;
  return v;
}

// LocationList: GET /v3/auth/location, schedule delete.
export function locationList(ctx, loc) {
  var tx = ctx.tx;
  var v = clone(loc);
  v.station = stationLite(getStation(tx, loc.station));
  var schedule = loc.schedule ? tx.get('schedules', loc.schedule) : null;
  v.schedule = schedule && !schedule.isDeleted ? clone(schedule) : null;
  var sim = simulatedNowPlaying(ctx, loc);
  if (sim) {
    v.currentTrackNumber = sim.currentTrackNumber;
    v.lastTrack = sim.lastTrack;
  }
  v.currentTrack = trackById(sim ? sim.currentTrack : loc.currentTrack);
  v.pairedDevice = playerView(ctx, loc.pairedDevice, loc);
  v.subscription = null;
  return v;
}
