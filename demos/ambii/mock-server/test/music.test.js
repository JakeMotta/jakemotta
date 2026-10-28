import test from 'node:test';
import assert from 'node:assert/strict';
import { makeServer, connect, finishedBody, todayAt, PLAYER } from './helpers.js';
import { withAds, dueBlock, musicQueue, lastStartedBlock } from '../core/music.js';
import { TRACKS, ALBUMS, STATIONS, GENRE_KEYS, isAdId, trackById } from '../core/catalogue.js';
import { GUEST_TRACKS } from '../core/guests.js';
import { seededRandom, fixedId } from '../core/util.js';
import { IDS } from '../core/seed.js';
import { DEFAULT_STATION_ID } from '../config.js';

var HOUR = 3600 * 1000;

test('catalogue: Jake\'s 14 tracks plus the guests, with measured durations, every genre key covered, stations with >= 8 tracks', () => {
  var tracks = Object.values(TRACKS);
  var own = tracks.filter((t) => t.artist.name === 'Jake Motta');
  assert.equal(own.length, 14);
  assert.equal(tracks.length, 14 + GUEST_TRACKS.length);
  assert.ok(own.every((t) => /^(\/music\/|\/projects\/ambii-business\/media\/music\/)/.test(t.url)));
  assert.ok(tracks.filter((t) => own.indexOf(t) < 0).every((t) => t.url.indexOf('/projects/ambii-business/media/tracks/') === 0));
  assert.ok(tracks.every((t) => t.duration > 60 && t.url.endsWith('.mp3') && t.album && t.album.genres.length && t.album.genres.every((g) => GENRE_KEYS.indexOf(g) >= 0)));
  assert.ok(!tracks.some((t) => /super_bitch/.test(t.url)));
  // ids and ISRCs are unique, and no ISRC looks like an ad or announcement to the web player
  assert.equal(new Set(tracks.map((t) => t.isrc)).size, tracks.length);
  assert.ok(!tracks.some((t) => /ADVERT_|ISM_/.test(t.isrc)));
  assert.ok(!Object.keys(ALBUMS).some((id) => id === fixedId('61a7ab', 255)), 'no album takes the ad album id');
  var genres = new Set(tracks.flatMap((t) => t.album.genres));
  for (var g of ['pop', 'rock', 'alternative', 'dance', 'electro', 'rap/hip hop', 'r&b', 'folk', 'country', 'jazz', 'blues', 'classical', 'soul & funk']) assert.ok(genres.has(g), g);
  var bands = [[0, 110], [111, 120], [121, 127], [128, 140], [141, 900]];
  bands.forEach((b) => assert.ok(tracks.some((t) => t.bpm >= b[0] && t.bpm <= b[1]), 'tempo band ' + b));
  assert.ok(Object.values(STATIONS).every((s) => s.tracks.length >= 8));
  assert.ok(STATIONS[DEFAULT_STATION_ID]);
});

test('ads: none when subscribed; one before the first track after each 15 minutes otherwise', () => {
  // Jake's first 13 tracks: a ~49 minute queue, as a station would hold
  var ids = Object.keys(TRACKS).slice(0, 13);
  assert.deepEqual(withAds(ids, true), ids);
  var q = withAds(ids, false);
  var played = 0, adBreaks = 0;
  q.forEach((id) => {
    var t = trackById(id);
    if (isAdId(id)) {
      adBreaks++;
      assert.ok(played > 900 * adBreaks, 'ad comes after ' + adBreaks * 15 + ' minutes');
    }
    played += t.duration;
  });
  var total = ids.reduce((a, id) => a + TRACKS[id].duration, 0);
  assert.ok(adBreaks >= Math.floor(total / 900) - 1 && adBreaks >= 2, 'ads in a ~49 minute queue: ' + adBreaks);
  // ids and isrcs unique per queue
  assert.equal(new Set(q).size, q.length);
  assert.equal(new Set(q.map((id) => trackById(id).isrc)).size, q.length);
  // refreshing keeps the music order
  assert.deepEqual(withAds(q, true), ids);
});

test('queue: shuffled, full station, downvotes and explicit filtered', () => {
  var station = STATIONS[DEFAULT_STATION_ID];
  var ctx = { random: seededRandom(1), tx: { all: () => [{ locationId: 'L', stationId: station._id, trackId: station.tracks[3], isDeleted: false }] } };
  var q = musicQueue(ctx, { _id: 'L', explicitAllowed: false }, station);
  assert.equal(q.length, station.tracks.length - 1);
  assert.ok(q.indexOf(station.tracks[3]) < 0);
  assert.notDeepEqual(q, station.tracks.filter((id) => id !== station.tracks[3]));
});

test('dueBlock: local time, last match wins, wraps past midnight, honours days', () => {
  var blocks = [
    { name: 'A', startTime: 0, endTime: 43200, days: [] },
    { name: 'B', startTime: 43200, endTime: 86400, days: [] },
    { name: 'Night', startTime: 79200, endTime: 7200, days: [] },
  ];
  assert.equal(dueBlock(blocks, new Date(todayAt(9, 0))).name, 'A');
  assert.equal(dueBlock(blocks, new Date(todayAt(13, 0))).name, 'B');
  assert.equal(dueBlock(blocks, new Date(todayAt(23, 0))).name, 'Night');
  assert.equal(dueBlock(blocks, new Date(todayAt(1, 0))).name, 'Night');
  var today = new Date().getDay();
  assert.equal(dueBlock([{ name: 'X', startTime: 0, endTime: 86400, days: [(today + 1) % 7] }], new Date()), null);
  assert.equal(dueBlock([{ name: 'X', startTime: 0, endTime: 86400, days: [today] }], new Date()).name, 'X');
});

test('lastStartedBlock: the block that began last, looking back up to a week and honouring its days', () => {
  var blocks = [
    { name: 'Brunch', startTime: 28800, endTime: 46800, days: [0, 6] },
    { name: 'Afternoon', startTime: 46800, endTime: 64800, days: [0, 6] },
    { name: 'Night', startTime: 79200, endTime: 7200, days: [] },
  ];
  // Saturday 20:00: Afternoon began at 13:00 today
  var sat = new Date(2026, 9, 24, 20, 0);
  var r = lastStartedBlock(blocks.slice(0, 2), sat);
  assert.equal(r.block.name, 'Afternoon');
  assert.equal(r.start, new Date(2026, 9, 24, 13, 0).getTime());
  // the following Wednesday: Sunday's Afternoon
  r = lastStartedBlock(blocks.slice(0, 2), new Date(2026, 9, 28, 10, 0));
  assert.equal(r.start, new Date(2026, 9, 25, 13, 0).getTime());
  // 03:00: the night block that began at 22:00 yesterday, not one that starts later today
  r = lastStartedBlock(blocks, new Date(2026, 9, 28, 3, 0));
  assert.equal(r.block.name, 'Night');
  assert.equal(r.start, new Date(2026, 9, 27, 22, 0).getTime());
  // across the autumn daylight-saving change, 22:00 local is still 22:00
  r = lastStartedBlock([blocks[2]], new Date(2026, 10, 1, 21, 0));
  assert.equal(r.start, new Date(2026, 9, 31, 22, 0).getTime());
  assert.equal(lastStartedBlock([], sat), null);
  assert.equal(lastStartedBlock([{ name: 'Never', startTime: 0, endTime: 3600, days: [9] }], sat), null);
});

test('schedule: the kiosk switches block at the next track end after the boundary', async () => {
  var s = makeServer({ time: todayAt(11, 50) });
  var c = await connect(s, 'LMKT42', { override: true });
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  assert.equal(loc.station.name, 'Morning');
  assert.equal(loc.schedule.name, 'Café Day');
  assert.equal(loc.schedule.scheduleBlocks.length, 4);
  assert.equal(typeof loc.schedule.scheduleBlocks[0], 'object');
  // still morning: nothing new
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), h);
  assert.deepEqual(ft.body.data, {});
  s.advance(15 * 60 * 1000); // 12:05, Afternoon
  ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 1), h);
  assert.equal(ft.body.data.newStation, true);
  assert.equal(ft.body.data.newTrackSchedule, true);
  assert.equal(ft.body.data.station.name, 'Afternoon');
  assert.equal(ft.body.data.schedule.name, 'Café Day');
  assert.equal(ft.body.data.newSchedule, undefined);
  var dash = (await s.call('GET', '/v3/auth/location')).body.data.find((l) => l.storeCode === 'LMKT42');
  assert.equal(dash.station.name, 'Afternoon');
  assert.equal(dash.currentTrack._id, ft.body.data.trackSchedule.queue[0]._id);
});

test('schedule: the mobile app (no scheduleId key) is not re-queued at every track end', async () => {
  var s = makeServer({ time: todayAt(9, 0) });
  var c = await connect(s, 'LMKT42', { override: true });
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var body = finishedBody(loc, 0);
  delete body.scheduleId;
  body.trackScheduleId = loc.trackSchedule._id;
  body.songCompletion = 100;
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', body, h);
  assert.deepEqual(ft.body.data, {});
  // the web player sending scheduleId null learns about the schedule
  ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 1, { scheduleId: null }), h);
  assert.equal(ft.body.data.newSchedule, true);
  assert.equal(ft.body.data.newStation, true);
});

test('schedule CRUD: create applies it now, edit makes new block stations, delete keeps the station', async () => {
  var s = makeServer({ time: todayAt(15, 0) });
  var c = await connect(s, 'LBEAN7');
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var blocks = [
    { name: 'Morning', startTime: 21600, endTime: 43200, days: [0, 1, 2, 3, 4, 5, 6], genres: { jazz: 100 }, tempo: { min: 0, max: 110, selected: 0, name: 'Slower' }, hash: 'a' },
    { name: 'Afternoon', startTime: 43200, endTime: 64800, days: [0, 1, 2, 3, 4, 5, 6], genres: { dance: 100, electro: 100 }, tempo: { min: 141, max: 900, selected: 4, name: 'Faster' }, hash: 'b' },
    { name: 'Evening', startTime: 64800, endTime: 86400, days: [0, 1, 2, 3, 4, 5, 6], genres: { 'r&b': 100 }, tempo: { min: 111, max: 120, selected: 1, name: 'Slow' }, hash: 'c' },
    { name: 'Late Night', startTime: 0, endTime: 21600, days: [0, 1, 2, 3, 4, 5, 6], genres: { classical: 100 }, tempo: { min: 0, max: 110, selected: 0, name: 'Slower' }, hash: 'd' },
  ];
  var r = await s.call('POST', '/v3/auth/schedule', { name: 'Weekdays', description: 'A weekly music schedule', assignedLocations: [IDS.downtown], scheduleBlocks: blocks });
  assert.equal(r.body.message, 'Schedule successfully created');
  var sched = r.body.data.schedules[0];
  assert.equal(sched.name, 'Weekdays');
  assert.equal(sched.isActive, true);
  assert.equal(r.body.data.scheduleBlocks.length, 4);
  assert.equal(typeof r.body.data.scheduleBlocks[0].station, 'object');
  assert.equal(r.body.data.scheduleBlocks[0].station.type, 'dynamic');
  var dl = r.body.data.locations.find((l) => l._id === IDS.downtown);
  assert.equal(dl.schedule._id, sched._id);
  assert.equal(dl.station.name, 'Afternoon');
  // the Afternoon block (dance/electro, Faster) starts with the fast genre matches
  var afternoon = r.body.data.scheduleBlocks[1].station;
  assert.ok(afternoon.tracks.length >= 8);
  var fastMatches = Object.values(TRACKS).filter((t) => t.bpm >= 141 && t.album.genres.some((g) => g === 'dance' || g === 'electro'));
  assert.deepEqual(afternoon.tracks.slice(0, fastMatches.length).sort(), fastMatches.map((t) => t._id).sort());
  // the player switches at its next track end, and sees the schedule
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), h);
  assert.equal(ft.body.data.newStation, true);
  assert.equal(ft.body.data.schedule.name, 'Weekdays');
  var list = (await s.call('GET', '/v3/auth/schedule')).body;
  assert.equal(list.message, 'Schedule data found');
  assert.equal(list.data.schedules.length, 4); // the three seeded ones and this one
  assert.equal(list.data.scheduleBlocks.length, 14);
  assert.equal(typeof list.data.scheduleBlocks[0].station, 'string');
  // edit the afternoon block: new generated station, location follows
  var stored = list.data.scheduleBlocks.find((b) => b.name === 'Afternoon' && list.data.schedules.find((x) => x._id === sched._id).scheduleBlocks.indexOf(b._id) >= 0);
  var edited = Object.assign({}, stored, { genres: { jazz: 100 }, tempo: { min: 111, max: 120, selected: 1, name: 'Slow' }, hash: 'e' });
  var p = await s.call('PATCH', '/v3/auth/schedule/' + sched._id, { scheduleBlocks: [edited] });
  assert.equal(p.body.message, 'Schedule successfully updated');
  assert.notEqual(p.body.data.scheduleBlocks[0].station, stored.station);
  var after = (await s.call('GET', '/v3/auth/location')).body.data.find((l) => l._id === IDS.downtown);
  assert.equal(after.station._id, p.body.data.scheduleBlocks[0].station);
  // the old generated station was cleaned up
  assert.equal((await s.call('GET', '/v3/api/station/' + stored.station)).status, 404);
  // the kiosk moved onto the new schedule is taken off Café Day
  var move = await s.call('PATCH', '/v3/auth/schedule/' + sched._id, { assignedLocations: [IDS.downtown, IDS.market] });
  assert.ok(move.body.data.schedules.some((x) => x._id === IDS.schedule && x.assignedLocations.length === 0));
  // delete: locations keep their station, schedule removed
  var d = await s.call('DELETE', '/v3/auth/schedule/' + sched._id);
  assert.equal(d.body.message, 'Schedule successfully deleted');
  assert.ok(d.body.data.locations.every((l) => l.schedule === null && l.station));
  assert.equal((await s.call('GET', '/v3/auth/schedule')).body.data.schedules.length, 3);
});

test('removing a location from a schedule gives it the default station', async () => {
  var s = makeServer({ time: todayAt(9, 0) });
  var r = await s.call('PATCH', '/v3/auth/schedule/' + IDS.schedule, { assignedLocations: [] });
  var kiosk = r.body.data.locations.find((l) => l._id === IDS.market);
  assert.equal(kiosk.station._id, DEFAULT_STATION_ID);
  assert.equal(kiosk.schedule, null);
});

test('assigning a station removes the schedule and reports the schedule it left', async () => {
  var s = makeServer({ time: todayAt(9, 0) });
  var r = await s.call('POST', '/v3/api/station/' + DEFAULT_STATION_ID, { locations: [IDS.market] });
  assert.equal(r.body.data.locations[0].schedule, null);
  assert.equal(r.body.data.schedules[0]._id, IDS.schedule);
  assert.deepEqual(r.body.data.schedules[0].assignedLocations, []);
});
