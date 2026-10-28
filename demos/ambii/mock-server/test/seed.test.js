// The seed (the stores, schedules, invoices and the Welcome announcement) and the simulated in-store players.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeServer, connect, finishedBody, todayAt, PLAYER } from './helpers.js';
import { IDS, addMonths } from '../core/seed.js';
import { simulatedPosition } from '../core/music.js';
import { TRACKS, STATION_IDS, adId, trackById, isAdId } from '../core/catalogue.js';
import { DEFAULT_STATION_ID } from '../config.js';

var MIN = 60 * 1000;
var DAY = 24 * 60 * MIN;
var DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var INVOICE_PAGE = fileURLToPath(new URL('../../../../public/projects/ambii-business/invoice.html', import.meta.url));

// The next given weekday (0 = Sunday) at h:m local time, today included.
function nextWeekday(dow, h, m) {
  var d = new Date();
  d.setHours(h, m || 0, 0, 0);
  d.setDate(d.getDate() + ((dow - d.getDay() + 7) % 7));
  return d.getTime();
}

async function byCode(s) {
  var list = (await s.call('GET', '/v3/auth/location')).body.data;
  return Object.fromEntries(list.map((l) => [l.storeCode, l]));
}

// What a looping queue plays at `at`, worked out independently of music.js.
function expectedAt(ts, at) {
  var durations = ts.queue.map((id) => trackById(id).duration);
  var total = durations.reduce((a, b) => a + b, 0);
  var t = ((at - new Date(ts.createdAt).getTime()) / 1000) % total;
  var i = 0;
  while (t >= durations[i]) t -= durations[i++];
  return { index: i, id: ts.queue[i], left: durations[i] - t };
}

test('stores: seven, with their codes, zones, cities, roles and staggered opening dates', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  var stores = await byCode(s);
  assert.deepEqual(Object.keys(stores), ['LBEAN7', 'LMKT42', 'LGATE3', 'LJACK5', 'LPAVE8', 'LSURF8', 'LCSTR6']);
  for (var code of Object.keys(stores)) assert.match(code, /^L[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/);
  // the original three keep their ids and roles
  assert.equal(stores.LBEAN7._id, IDS.downtown);
  assert.equal(stores.LMKT42._id, IDS.market);
  assert.equal(stores.LGATE3._id, IDS.airport);
  assert.equal(stores.LBEAN7.station._id, STATION_IDS.morningPourOver);
  assert.equal(stores.LBEAN7.schedule, null);
  assert.equal(stores.LBEAN7.pairedDevice, null); // the hub's link connects without a prompt
  assert.equal(stores.LBEAN7.allowPlayerToChangeStation, true);
  assert.equal(stores.LMKT42.schedule._id, IDS.schedule);
  assert.equal(stores.LGATE3.isActive, false);
  assert.equal(stores.LGATE3.station._id, DEFAULT_STATION_ID);
  // one inactive store; the rest active, across Bay Area cities
  assert.deepEqual(Object.values(stores).filter((l) => !l.isActive).map((l) => l.storeCode), ['LGATE3']);
  assert.deepEqual([...new Set(Object.values(stores).map((l) => l.city))].sort(), ['Mountain View', 'Oakland', 'Palo Alto', 'San Jose', 'Santa Cruz']);
  assert.ok(Object.values(stores).every((l) => l.addressLineOne && /^\(\d{3}\) 555-01\d\d$/.test(l.phoneNumber) && l.state === 'California'));
  // each its own zone, with a server-format zone code
  var zones = Object.values(s.collection('zones'));
  assert.equal(zones.length, 7);
  assert.equal(new Set(zones.map((z) => z.location)).size, 7);
  assert.ok(zones.every((z) => /^Z[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/.test(z.zoneCode)));
  assert.ok(Object.values(stores).every((l) => l.zones.length === 1 && zones.some((z) => z._id === l.zones[0] && z.location === l._id)));
  // opened one after another; the first with the company, about a year and a month ago
  var opened = Object.values(stores).map((l) => new Date(l.createdAt).getTime());
  assert.deepEqual(opened.slice().sort((a, b) => a - b), opened);
  assert.equal(new Set(opened).size, 7);
  var company = (await s.call('GET', '/v3/auth/jwt')).body.data.company;
  assert.equal(new Date(company.createdAt).getTime(), opened[0]);
  var age = (Date.now() - opened[0]) / DAY;
  assert.ok(age > 370 && age < 395, 'company age ' + age);
  // the owner manages all of them; favorites unchanged
  var user = (await s.call('GET', '/v3/auth/jwt')).body.data;
  assert.equal(user.assignedLocations.length, 7);
  assert.deepEqual(user.favorites.map((f) => f._id), [STATION_IDS.tapiocaTempo, STATION_IDS.midnightOil]);
});

test('schedules: Café Day, Weekend Brunch on two stores (weekends only), Night Owl into the small hours', async () => {
  var s = makeServer({ time: nextWeekday(3, 10, 0) }); // a Wednesday
  var data = (await s.call('GET', '/v3/auth/schedule')).body.data;
  var byName = Object.fromEntries(data.schedules.map((x) => [x.name, x]));
  assert.deepEqual(Object.keys(byName), ['Café Day', 'Weekend Brunch', 'Night Owl']);
  assert.ok(data.schedules.every((x) => x.isActive && !x.isDeleted));
  assert.deepEqual(byName['Café Day'].assignedLocations, [IDS.market]);
  assert.deepEqual(byName['Weekend Brunch'].assignedLocations, [IDS.paloAlto, IDS.santaCruz]);
  assert.deepEqual(byName['Night Owl'].assignedLocations, [IDS.jackLondon, IDS.castro]);
  var blocks = Object.fromEntries(data.scheduleBlocks.map((b) => [b._id, b]));
  var stations = s.collection('stations');
  for (var sched of data.schedules) {
    for (var id of sched.scheduleBlocks) {
      var b = blocks[id];
      assert.ok(b.station && stations[b.station] && stations[b.station].type === 'dynamic', b.name);
      assert.ok(stations[b.station].tracks.length >= 8, b.name);
      assert.ok(Object.keys(b.genres).length > 0 && b.tempo.max >= b.tempo.min);
    }
  }
  var brunch = byName['Weekend Brunch'].scheduleBlocks.map((id) => blocks[id]);
  assert.ok(brunch.length >= 2 && brunch.every((b) => b.days.slice().sort().join() === '0,6'));
  var night = byName['Night Owl'].scheduleBlocks.map((id) => blocks[id]);
  assert.ok(night.some((b) => b.endTime < b.startTime), 'a late-night block runs past midnight');
  // on a weekday no brunch block is due: the two brunch stores keep their own stations
  var stores = await byCode(s);
  assert.equal(stores.LPAVE8.schedule.name, 'Weekend Brunch');
  assert.equal(stores.LPAVE8.station._id, STATION_IDS.tapiocaTempo);
  assert.equal(stores.LSURF8.station._id, STATION_IDS.saturdayRush);
  assert.equal(stores.LJACK5.station.name, 'Daytime');
  assert.equal(stores.LCSTR6.station.name, 'Daytime');
});

test('schedules: on a Saturday the brunch stores play Brunch; Night Owl plays Late Night after midnight', async () => {
  var sat = makeServer({ time: nextWeekday(6, 10, 0) });
  var stores = await byCode(sat);
  assert.equal(stores.LPAVE8.station.name, 'Brunch');
  assert.equal(stores.LSURF8.station.name, 'Brunch');
  assert.equal(stores.LPAVE8.station._id, stores.LSURF8.station._id);
  var late = makeServer({ time: todayAt(1, 30) });
  stores = await byCode(late);
  assert.equal(stores.LJACK5.station.name, 'Late Night');
  assert.equal(stores.LCSTR6.station.name, 'Late Night');
});

test('simulated players: four stores show Online with their tablets, the others Offline, however long nobody looks', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  var stores = await byCode(s);
  var online = Object.values(stores).filter((l) => l.pairedDevice && l.pairedDevice.isPlaying).map((l) => l.storeCode);
  assert.deepEqual(online, ['LMKT42', 'LJACK5', 'LPAVE8', 'LSURF8']);
  assert.equal(stores.LMKT42.pairedDevice.deviceName, 'Back Office iPad');
  assert.equal(stores.LMKT42.pairedDevice._id, IDS.backOfficeIpad);
  assert.ok(online.every((c) => stores[c].pairedDevice.deviceName && stores[c].currentTrack.album.cover_med && stores[c].currentTrack.artist.name));
  assert.equal(stores.LCSTR6.pairedDevice, null);
  assert.equal(stores.LGATE3.pairedDevice, null);
  assert.ok(Object.values(s.collection('players')).every((p) => p.simulated === true));
  // the four stores are at different points of their queues on a first visit (checked before the clock
  // moves: at 13:00 on a weekend both Brunch stores move to the Weekend Afternoon block, which starts both
  // queues at 13:00)
  var tss = s.collection('trackSchedules');
  var started = Object.values(s.collection('locations')).filter((l) => l.pairedDevice).map((l) => tss[l.trackSchedule].createdAt);
  assert.equal(new Set(started).size, 4);
  s.advance(3 * 60 * MIN);
  stores = await byCode(s);
  assert.ok(['LMKT42', 'LJACK5', 'LPAVE8', 'LSURF8'].every((c) => stores[c].pairedDevice.isPlaying));
});

test('simulated players: the block start survives a daylight-saving change and a block that began yesterday', async () => {
  // A Sunday in early November (US clocks fall back that day): Café Day's Afternoon starts at 12:00 local.
  var d = new Date(new Date().getFullYear(), 10, 1);
  d.setDate(1 + ((7 - d.getDay()) % 7));
  var s = makeServer({ time: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 11, 50).getTime() });
  await byCode(s);
  s.advance(40 * MIN);
  await byCode(s);
  var ts = s.collection('trackSchedules')[s.collection('locations')[IDS.market].trackSchedule];
  assert.equal(new Date(ts.createdAt).getTime(), new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0).getTime());
  // Night Owl's Late Night starts at 22:00 and runs past midnight: at 00:30 it began yesterday
  var late = makeServer({ time: todayAt(21, 30) });
  await byCode(late);
  late.advance(3 * 60 * MIN); // 00:30 tomorrow
  assert.equal((await byCode(late)).LJACK5.station.name, 'Late Night');
  var lts = late.collection('trackSchedules')[late.collection('locations')[IDS.jackLondon].trackSchedule];
  assert.equal(new Date(lts.createdAt).getTime(), todayAt(22, 0));
});

test('simulated players: Now Playing follows the wall clock, track by track, and loops', async () => {
  var s = makeServer({ time: nextWeekday(3, 10, 0) });
  var stores = await byCode(s);
  var loc = s.collection('locations')[IDS.jackLondon];
  var ts = s.collection('trackSchedules')[loc.trackSchedule];
  var now = s.clock.time;
  var exp = expectedAt(ts, now);
  assert.equal(stores.LJACK5.currentTrack._id, exp.id);
  assert.equal(stores.LJACK5.currentTrackNumber, exp.index);
  // just after the track ends, the next one
  s.advance(Math.ceil(exp.left * 1000) + 500);
  var next = expectedAt(ts, s.clock.time);
  assert.equal(next.index, (exp.index + 1) % ts.queue.length);
  stores = await byCode(s);
  assert.equal(stores.LJACK5.currentTrack._id, next.id);
  assert.equal(stores.LJACK5.lastTrack, isAdId(exp.id) ? stores.LJACK5.lastTrack : exp.id);
  // a whole queue later, the same track again (the block lasts until 16:00)
  var total = ts.queue.reduce((a, id) => a + trackById(id).duration, 0);
  if (s.clock.time + total * 1000 < nextWeekday(3, 15, 59)) {
    s.advance(Math.round(total * 1000));
    assert.equal((await byCode(s)).LJACK5.currentTrack._id, next.id);
  }
  // nothing is written for it: the stored location still has the queue's first track
  assert.equal(s.collection('locations')[IDS.jackLondon].currentTrack, ts.queue[0]);
});

test('simulatedPosition: durations walked with ads, lastTrack skips ads, nothing before the first pass', () => {
  var ids = Object.keys(TRACKS).slice(0, 3);
  var d = ids.map((id) => TRACKS[id].duration);
  var ad = trackById(adId(1)).duration;
  var start = Date.UTC(2021, 8, 4, 17, 0, 0);
  var ts = { queue: [ids[0], adId(1), ids[1], ids[2]], createdAt: new Date(start).toISOString() };
  var total = d[0] + ad + d[1] + d[2];
  var at = (sec) => simulatedPosition(ts, start + sec * 1000);
  assert.deepEqual([at(0).currentTrackNumber, at(0).currentTrack, at(0).lastTrack, at(0).loops], [0, ids[0], null, 0]);
  assert.deepEqual([at(d[0] + 1).currentTrack, at(d[0] + 1).lastTrack], [adId(1), ids[0]]);
  assert.deepEqual([at(d[0] + ad + 1).currentTrack, at(d[0] + ad + 1).lastTrack], [ids[1], ids[0]]);
  assert.deepEqual([at(total - 1).currentTrack, at(total - 1).lastTrack], [ids[2], ids[1]]);
  assert.deepEqual([at(total + 1).currentTrack, at(total + 1).lastTrack, at(total + 1).loops], [ids[0], ids[2], 1]);
  assert.equal(at(3 * total + d[0] + ad + 0.5).currentTrackNumber, 2);
  assert.ok(Math.abs(at(d[0] + 10).offset - 10) < 1e-6);
  assert.equal(at(-60).currentTrackNumber, 0); // a queue that starts later sits on its first track
  assert.equal(simulatedPosition({ queue: [], createdAt: ts.createdAt }, start), null);
  assert.equal(simulatedPosition(null, start), null);
});

test('simulated players: a scheduled store moves to the due block when the dashboard looks, mid-queue from the block start', async () => {
  var s = makeServer({ time: todayAt(11, 50) });
  var stores = await byCode(s);
  assert.equal(stores.LMKT42.station.name, 'Morning');
  var before = s.collection('locations')[IDS.market].trackSchedule;
  s.advance(40 * MIN); // 12:30, Afternoon
  stores = await byCode(s);
  assert.equal(stores.LMKT42.station.name, 'Afternoon');
  assert.equal(stores.LMKT42.schedule.name, 'Café Day');
  var loc = s.collection('locations')[IDS.market];
  assert.notEqual(loc.trackSchedule, before);
  var ts = s.collection('trackSchedules')[loc.trackSchedule];
  assert.equal(new Date(ts.createdAt).getTime(), todayAt(12, 0));
  assert.equal(stores.LMKT42.currentTrack._id, expectedAt(ts, s.clock.time).id);
  // the next look changes nothing
  await byCode(s);
  assert.equal(s.collection('locations')[IDS.market].trackSchedule, loc.trackSchedule);
  // a Weekend Brunch store picks up Brunch on Saturday morning
  var w = makeServer({ time: nextWeekday(5, 18, 0) }); // a Friday evening
  assert.equal((await byCode(w)).LPAVE8.station._id, STATION_IDS.tapiocaTempo);
  w.advance(16 * 60 * MIN); // Saturday 10:00
  assert.equal((await byCode(w)).LPAVE8.station.name, 'Brunch');
});

test('simulated players: with no block due, a store following its schedule plays the last block that ran, though nobody looked during it', async () => {
  // Saturday 10:00 the brunch stores play Brunch; the next look is at 20:00, after Weekend Afternoon (13:00 to 18:00)
  // has run. A player would have switched at 13:00 and kept that station once the block ended.
  var s = makeServer({ time: nextWeekday(6, 10, 0) });
  assert.equal((await byCode(s)).LPAVE8.station.name, 'Brunch');
  s.advance(10 * 60 * MIN);
  var stores = await byCode(s);
  assert.equal(stores.LPAVE8.station.name, 'Weekend Afternoon');
  assert.equal(stores.LSURF8.station.name, 'Weekend Afternoon');
  var ts = s.collection('trackSchedules')[s.collection('locations')[IDS.paloAlto].trackSchedule];
  assert.equal(new Date(ts.createdAt).getTime(), nextWeekday(6, 13, 0));
  assert.equal(stores.LPAVE8.currentTrack._id, expectedAt(ts, s.clock.time).id);
  // and keeps it through the week, as the player would (the next look changes nothing)
  s.advance(4 * DAY);
  assert.equal((await byCode(s)).LPAVE8.station.name, 'Weekend Afternoon');
  assert.equal(s.collection('locations')[IDS.paloAlto].trackSchedule, ts._id);
  // Night Owl: seen during Evening, next looked at at 03:00, after Late Night (22:00 to 02:00) has run
  var n = makeServer({ time: todayAt(20, 0) });
  assert.equal((await byCode(n)).LJACK5.station.name, 'Evening');
  n.advance(7 * 60 * MIN);
  assert.equal((await byCode(n)).LJACK5.station.name, 'Late Night');
  var lts = n.collection('trackSchedules')[n.collection('locations')[IDS.jackLondon].trackSchedule];
  assert.equal(new Date(lts.createdAt).getTime(), todayAt(22, 0));
  // A store on a station of its own while no block is due keeps it (Weekend Brunch, first seen on a weekday evening).
  var w = makeServer({ time: nextWeekday(3, 20, 0) });
  assert.equal((await byCode(w)).LPAVE8.station._id, STATION_IDS.tapiocaTempo);
  w.advance(DAY);
  assert.equal((await byCode(w)).LPAVE8.station._id, STATION_IDS.tapiocaTempo);
});

test('simulated players: a deactivated store shows Offline; the take-over prompt, then a real player carries on from the same song', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  await s.call('PATCH', '/v3/auth/location/' + IDS.jackLondon, { isActive: false });
  assert.equal((await byCode(s)).LJACK5.pairedDevice.isPlaying, false);
  await s.call('PATCH', '/v3/auth/location/' + IDS.jackLondon, { isActive: true });
  assert.equal((await byCode(s)).LJACK5.pairedDevice.isPlaying, true);

  s.advance(7 * MIN);
  var seen = (await byCode(s)).LMKT42;
  var prompt = await connect(s, 'LMKT42');
  assert.equal(prompt.body.data, 'DEVICE_ALREADY_PAIRED');
  var c = await connect(s, 'LMKT42', { override: true });
  assert.equal(c.body.type, 'SUCCESSFUL_PAIRED');
  var loc = c.body.data.location;
  assert.equal(loc.currentTrackNumber, seen.currentTrackNumber);
  assert.equal(loc.currentTrack._id, seen.currentTrack._id);
  assert.equal(loc.trackSchedule.queue[loc.currentTrackNumber]._id, seen.currentTrack._id);
  var after = (await byCode(s)).LMKT42;
  assert.equal(after.pairedDevice.deviceId, PLAYER.deviceId);
  assert.equal(after.pairedDevice.deviceName, 'web');
  assert.equal(after.pairedDevice.simulated, undefined);
  // the simulation has stopped: Now Playing moves only with the real player's finishedTrack
  s.advance(10 * MIN);
  assert.equal((await byCode(s)).LMKT42.currentTrack._id, seen.currentTrack._id);
  var n = loc.currentTrackNumber;
  await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, n), { ambii_player_jwt: c.body.data.ambii_player_jwt });
  var q = loc.trackSchedule.queue;
  assert.equal((await byCode(s)).LMKT42.currentTrack._id, q[(n + 1) % q.length]._id);
});

test('simulated players: taking over after a block boundary nobody saw joins the new block partway through', async () => {
  // Saturday: seen at 10:00 during Brunch, taken over at 15:10, two hours into Weekend Afternoon (13:00 to 18:00).
  var s = makeServer({ time: nextWeekday(6, 10, 0) });
  assert.equal((await byCode(s)).LPAVE8.station.name, 'Brunch');
  s.advance(5 * 60 * MIN + 10 * MIN);
  var c = await connect(s, 'LPAVE8', { override: true });
  assert.equal(c.body.type, 'SUCCESSFUL_PAIRED');
  var loc = c.body.data.location;
  assert.equal(loc.station.name, 'Weekend Afternoon');
  var ts = s.collection('trackSchedules')[s.collection('locations')[IDS.paloAlto].trackSchedule];
  assert.equal(new Date(ts.createdAt).getTime(), nextWeekday(6, 13, 0));
  var at = expectedAt(ts, s.clock.time);
  assert.equal(loc.currentTrackNumber, at.index);
  assert.equal(loc.currentTrack._id, at.id);
});

test('the scheduled store with no player opens straight onto its schedule', async () => {
  var s = makeServer({ time: todayAt(17, 0) });
  var c = await connect(s, 'LCSTR6');
  assert.equal(c.body.type, 'SUCCESSFUL_PAIRED');
  var loc = c.body.data.location;
  assert.equal(loc.schedule.name, 'Night Owl');
  assert.equal(loc.station.name, 'Happy Hour');
  assert.equal(loc.schedule.scheduleBlocks.length, 4);
  assert.equal(typeof loc.schedule.scheduleBlocks[0], 'object');
  assert.ok(loc.trackSchedule.queue.length >= 8);
});

test('Welcome: plays at the next whole minute plus two after each connect, once, until edited', async () => {
  var s = makeServer({ time: todayAt(10, 0) + 20 * 1000 }); // 10:00:20
  var list = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements;
  var w = list.find((a) => a._id === IDS.welcome);
  assert.equal(w.title, 'Welcome');
  assert.equal(w.frequency, 'specific time');
  assert.deepEqual(w.assignedLocations, [IDS.downtown]);
  assert.ok(w.url && w.duration > 3 && w.message.length > 10 && w.isActive);
  assert.equal(w.specifiedTimes.length, 1);
  assert.equal(w.specifiedTimes[0].time.selectedTime.slice(0, 5), '10:03');
  assert.deepEqual(w.specifiedTimes[0].days, [DAY_NAMES[new Date(s.clock.time).getDay()]]);

  s.advance(30 * MIN + 40 * 1000); // 10:31:00 exactly: the next whole minute is 10:32
  var c = await connect(s, 'LBEAN7');
  var h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var mine = (await s.call('GET', '/v3/api/announcement/?locationId=' + IDS.downtown + '&hash=', null, h)).body.data;
  w = mine.announcements.find((a) => a.title === 'Welcome');
  assert.equal(w.specifiedTimes[0].time.selectedTime.slice(0, 5), '10:34');
  assert.equal(w.specifiedTimes[0].time.unixTimeStamp, Math.floor(todayAt(10, 34) / 1000));
  // a track end doesn't move it (so it plays once), and neither does a connect elsewhere
  s.advance(4 * MIN);
  await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(c.body.data.location, 0), h);
  await connect(s, 'LMKT42', { deviceId: 'web-OTHER', override: true });
  var again = (await s.call('GET', '/v3/api/announcement/?locationId=' + IDS.downtown + '&hash=', null, h)).body.data;
  assert.equal(again.messageHash, mine.messageHash);
  // a reconnect moves it again
  var c2 = await connect(s, 'LBEAN7');
  w = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements.find((a) => a.title === 'Welcome');
  assert.equal(w.specifiedTimes[0].time.selectedTime.slice(0, 5), '10:38');
  assert.ok(c2.body.data.ambii_player_jwt);
  // once its time is edited in the dashboard, it's left alone
  var mine2 = { days: ['Sat'], time: { selectedTime: '08:00:00 GMT-0700 (PDT)', unixTimeStamp: 1 }, hash: 'x' };
  await s.call('PATCH', '/v3/auth/announcement/' + IDS.welcome, { announcementId: IDS.welcome, frequency: 'specific time', specifiedTimes: [mine2] });
  await connect(s, 'LBEAN7');
  w = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements.find((a) => a.title === 'Welcome');
  assert.deepEqual(w.specifiedTimes, [mine2]);
});

test('invoices: one a month for thirteen months, $16 per store open that day, the newest still open', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  var list = (await s.call('GET', '/v3/auth/invoice')).body.data; // newest first
  assert.equal(list.length, 13);
  var oldestFirst = list.slice().reverse();
  assert.deepEqual(oldestFirst.map((i) => i.total / 100), [16, 16, 16, 32, 32, 48, 64, 64, 80, 80, 80, 80, 96]);
  assert.deepEqual(oldestFirst.map((i) => i.number), oldestFirst.map((_, k) => 'DEMO-' + String(k + 1).padStart(4, '0')));
  // monthly, ending two hours ago
  var newest = new Date(list[0].createdAt);
  assert.equal(newest.getTime(), s.clock.time - 2 * 60 * MIN);
  oldestFirst.forEach((inv, k) => assert.equal(inv.createdAt, addMonths(newest, k - 12).toISOString()));
  // the total follows the stores open on the day (the Airport Pop-up closed in between)
  var locs = Object.values(s.collection('locations'));
  var nonAirport = locs.filter((l) => l._id !== IDS.airport);
  oldestFirst.forEach((inv) => {
    var open = nonAirport.filter((l) => new Date(l.createdAt) <= new Date(inv.createdAt)).length;
    assert.ok(inv.lines.data[0].quantity === open || inv.lines.data[0].quantity === open + 1, inv.number);
  });
  // statuses
  assert.equal(list[0].status, 'open');
  assert.equal(list[0].amount_paid, 0);
  assert.equal(list[0].amount_remaining, list[0].total);
  assert.ok(list.slice(1).every((i) => i.status === 'paid' && i.paid && i.amount_paid === i.total && i.status_transitions.paid_at));
  // what the invoice page shows
  for (var inv of list) {
    var line = inv.lines.data[0];
    assert.equal(line.quantity * line.price.unit_amount, inv.total);
    assert.equal(line.amount, inv.total);
    assert.match(line.description, /^\d+ × Ambii Premium \(at \$16\.00 \/ month\)$/);
    assert.ok(inv.period_end > inv.period_start && line.period.start === inv.period_start);
    assert.equal(inv.hosted_invoice_url, '/projects/ambii-business/invoice.html?id=' + inv.id);
  }
  assert.equal(list[0].customer_name, 'Bean & Beat Coffee Co.');
  assert.equal(list[0].customer_email, 'owner@beanandbeat.example');
  assert.equal(list[0].customer_address.line1, '101 Espresso Way');
  assert.deepEqual(list[0].default_payment_method.card, { brand: 'visa', last4: '4242' });
  // the page reads them straight from storage, keyed by id
  var stored = s.collection('invoices');
  assert.ok(list.every((i) => stored[i.id] && stored[i.id].id === i.id));
  // ids are fixed
  assert.equal(list[list.length - 1].id, 'in_demo_demo0001');
});

test('a new subscription invoice goes to the subscribing user and links the invoice page', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  await s.call('PATCH', '/v3/auth/subscription', {});
  await s.call('POST', '/v3/auth/subscription', { cardId: IDS.card });
  var list = (await s.call('GET', '/v3/auth/invoice')).body.data;
  assert.equal(list.length, 14);
  var inv = list[0];
  assert.equal(inv.status, 'paid');
  assert.equal(inv.total, 7 * 1600); // every location is reactivated
  assert.equal(inv.hosted_invoice_url, '/projects/ambii-business/invoice.html?id=' + inv.id);
  assert.equal(s.collection('invoices')[inv.id].userId, IDS.user);
});

test('the seed is the same for everyone seeded at the same moment', async () => {
  var t = todayAt(14, 10);
  var a = makeServer({ time: t }), b = makeServer({ time: t });
  await a.call('GET', '/v3/auth/location');
  await b.call('GET', '/v3/auth/location');
  for (var name of ['users', 'companies', 'locations', 'zones', 'stations', 'schedules', 'scheduleBlocks', 'trackSchedules', 'announcements', 'players', 'billingAddresses', 'cards', 'invoices']) {
    assert.deepEqual(a.collection(name), b.collection(name), name);
  }
});

test('invoice page: hand-written, reads the demo invoices from localStorage, loads nothing from another host', () => {
  var html = readFileSync(INVOICE_PAGE, 'utf8');
  assert.match(html, /ambii-demo:invoices/);
  assert.match(html, /media\/brand\/ambii-logo-/);
  assert.match(html, /[Dd]emo/);
  assert.ok(!/(src|href)\s*=\s*["']?(https?:)?\/\//i.test(html), 'no external src or href');
  assert.ok(!/url\(\s*["']?(https?:)?\/\//i.test(html), 'no external CSS url()');
  assert.ok(!/@import/i.test(html));
  assert.ok(!/\bfetch\(|XMLHttpRequest/.test(html), 'reads localStorage only');
});
