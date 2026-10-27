import test from 'node:test';
import assert from 'node:assert/strict';
import { makeServer, connect, finishedBody, todayAt, PLAYER } from './helpers.js';
import { routeOf, matchRoute } from '../core/server.js';
import { SEED_VERSION, DEFAULT_STATION_ID } from '../config.js';
import { IDS } from '../core/seed.js';

test('routing: trailing slash, missing leading slash, query, unknown routes', () => {
  assert.deepEqual(routeOf('/projects/ambii-business/api/v3/auth/location/'), { route: 'v3/auth/location' });
  assert.deepEqual(routeOf('/projects/ambii-business/apiv3/api/player/downvote'), { route: 'v3/api/player/downvote' });
  assert.deepEqual(routeOf('/projects/ambii-business/api//v3/api/announcement/'), { route: 'v3/api/announcement' });
  assert.deepEqual(routeOf('/projects/ambii-business/api/media/abc123.mp3'), { media: 'abc123' });
  assert.deepEqual(routeOf('/projects/ambii-business/api/tts/preview-abc'), { tts: 'preview-abc' });
  assert.equal(routeOf('/music/alone.mp3'), null);
  assert.equal(matchRoute('PATCH', 'v3/auth/announcement/upload/x').template, 'v3/auth/announcement/upload/:id');
  assert.equal(matchRoute('PATCH', 'v3/auth/announcement/x').template, 'v3/auth/announcement/:id');
  assert.equal(matchRoute('PATCH', 'v3/auth/user/favorite/x').template, 'v3/auth/user/favorite/:id');
  assert.equal(matchRoute('PATCH', 'v3/auth/user/x').template, 'v3/auth/user/:id');
  assert.equal(matchRoute('GET', 'v3/auth/nothing'), null);
});

test('unknown route answers the server 404 shape', async () => {
  var s = makeServer();
  var r = await s.call('GET', '/v3/auth/nothing');
  assert.equal(r.status, 404);
  assert.deepEqual(r.body, { statusCode: 404, error: true, data: {} });
});

test('seeds on first request; a seed version bump reseeds', async () => {
  var s = makeServer();
  var r = await s.call('GET', '/v3/auth/jwt');
  assert.equal(r.status, 200);
  assert.equal(r.body.message, 'User data found');
  assert.equal(r.body.type, 'DATA_FOUND');
  assert.equal(r.body.data.company.name, 'Bean & Beat Coffee Co.');
  assert.equal(r.body.data.company.subscribed, true);
  assert.equal(r.body.data.company.businessType, 'cafe');
  assert.notEqual(r.body.data.email, 'apple@ambii.io');
  assert.deepEqual(r.body.data.favorites.map((f) => f.name), ['Tapioca Tempo', 'Midnight Oil']);
  assert.equal(r.body.data.favorites[0].tracks, undefined);
  await s.call('PATCH', '/v3/auth/company', { name: 'Changed' });
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.company.name, 'Changed');
  s.storage.setItem('ambii-demo:meta', JSON.stringify({ seedVersion: SEED_VERSION - 1 }));
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.company.name, 'Bean & Beat Coffee Co.');
});

test('seed is deterministic apart from time-relative fields', async () => {
  var a = makeServer({ time: todayAt(9, 0) }), b = makeServer({ time: todayAt(9, 0) });
  var la = (await a.call('GET', '/v3/auth/location')).body.data, lb = (await b.call('GET', '/v3/auth/location')).body.data;
  assert.deepEqual(la.map((l) => [l._id, l.storeCode, l.station._id, l.trackSchedule]), lb.map((l) => [l._id, l.storeCode, l.station._id, l.trackSchedule]));
  assert.deepEqual(a.collection('trackSchedules'), b.collection('trackSchedules'));
});

test('dashboard locations: three seeded locations, shapes the cards read', async () => {
  var s = makeServer({ time: todayAt(9, 30) });
  var r = await s.call('GET', '/v3/auth/location');
  assert.equal(r.body.message, 'Location data found');
  var byCode = Object.fromEntries(r.body.data.map((l) => [l.storeCode, l]));
  assert.deepEqual(Object.keys(byCode).sort(), ['LBEAN7', 'LGATE3', 'LMKT42']);
  assert.equal(byCode.LBEAN7.isActive, true);
  assert.equal(byCode.LGATE3.isActive, false);
  assert.equal(byCode.LBEAN7.station.name, 'Morning Pour-Over');
  assert.equal(byCode.LBEAN7.allowPlayerToChangeStation, true);
  assert.equal(byCode.LMKT42.schedule.name, 'Café Day');
  assert.equal(byCode.LMKT42.station.name, 'Morning'); // 9:30 is in the Morning block
  assert.equal(byCode.LMKT42.station.type, 'dynamic');
  assert.equal(byCode.LMKT42.pairedDevice.deviceName, 'Back Office iPad');
  assert.equal(byCode.LMKT42.pairedDevice.isPlaying, false);
  assert.equal(byCode.LGATE3.station._id, DEFAULT_STATION_ID);
  for (var l of r.body.data) {
    assert.equal(typeof l.addressLineTwo, 'string');
    assert.equal(typeof l.storeCode, 'string');
    assert.equal(l.storeCode.length, 6);
    assert.equal(l.station.tracks, undefined);
    assert.ok(l.currentTrack.title && l.currentTrack.artist.name && l.currentTrack.album.cover_med);
    assert.equal(l.subscription, null);
  }
});

test('stations: list for the dashboard, pages of 15 for the web player, detail with playable top tracks', async () => {
  var s = makeServer();
  var all = (await s.call('GET', '/v3/api/station')).body;
  assert.equal(all.message, 'Successful');
  assert.ok(all.data.length >= 10);
  assert.ok(all.data.every((st) => st.type === 'static' && st.tracks === undefined && Array.isArray(st.tags) && Array.isArray(st.supersets)));
  assert.ok(all.data.every((st) => st.bpm.mean > 0 && st.bpm.mean < 999 && Object.keys(st.genres).length > 0));
  var supersets = new Set(all.data.flatMap((st) => st.supersets));
  for (var row of ['Popular Today', 'Coffee Curiosity', 'Bookstore Barista', 'Classical Cappuccino', 'Boba Beats', 'Countryside Cafe', 'Late Night Study ']) assert.ok(supersets.has(row), row);
  assert.ok(all.data.some((st) => st._id === DEFAULT_STATION_ID));
  var page1 = (await s.call('GET', '/v3/api/station?page=1')).body.data;
  assert.equal(page1.length, Math.min(15, all.data.length));
  assert.equal(page1[0]._id, all.data[0]._id);
  assert.deepEqual((await s.call('GET', '/v3/api/station?page=2')).body.data, all.data.slice(15, 30));
  var detail = (await s.call('GET', '/v3/api/station/' + all.data[1]._id)).body.data;
  assert.ok(detail.top_tracks.length >= 3);
  assert.ok(detail.top_tracks.some((t) => t.preview && !t.explicit_lyrics));
  assert.equal(detail.top_artists[0].name, 'Jake Motta');
  var missing = await s.call('GET', '/v3/api/station/000000000000000000000000');
  assert.equal(missing.status, 404);
  assert.equal(missing.body.message, 'Cannot find required data');
});

test('connect: pairs, issues a token, dashboard shows Online and Now Playing', async () => {
  var s = makeServer();
  var r = await connect(s, 'LBEAN7');
  assert.equal(r.status, 200);
  assert.equal(r.body.message, 'Player successfully paired');
  assert.equal(r.body.type, 'SUCCESSFUL_PAIRED');
  var loc = r.body.data.location;
  assert.equal(typeof r.body.data.ambii_player_jwt, 'string');
  assert.equal(loc.storeCode, 'LBEAN7');
  assert.ok(loc.trackSchedule.queue.length >= 8);
  assert.equal(new Set(loc.trackSchedule.queue.map((t) => t.isrc)).size, loc.trackSchedule.queue.length);
  assert.ok(loc.trackSchedule.queue.every((t) => t.url && t.duration > 0 && t.album.cover_large && t.artist.name));
  assert.equal(loc.trackSchedule.hasAds, false);
  assert.equal(loc.station.name, 'Morning Pour-Over');
  assert.equal(loc.company.name, 'Bean & Beat Coffee Co.');
  var dash = (await s.call('GET', '/v3/auth/location')).body.data.find((l) => l.storeCode === 'LBEAN7');
  assert.equal(dash.pairedDevice.isPlaying, true);
  assert.equal(dash.pairedDevice.deviceName, 'web');
  // finishedTrack moves "Now Playing"
  var body = finishedBody(loc, 0);
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', body, { ambii_player_jwt: r.body.data.ambii_player_jwt });
  assert.equal(ft.body.message, 'Successful');
  assert.deepEqual(ft.body.data, {});
  dash = (await s.call('GET', '/v3/auth/location')).body.data.find((l) => l.storeCode === 'LBEAN7');
  assert.equal(dash.currentTrack._id, body.nextTrackId);
  assert.equal(dash.currentTrackNumber, 1);
});

test('connect errors: bad code, non-string code, inactive location', async () => {
  var s = makeServer();
  var bad = await connect(s, 'NOPE12');
  assert.equal(bad.status, 400);
  assert.deepEqual(bad.body, { success: false, message: 'Invalid store code', type: 'INVALID_CODE' });
  assert.equal((await connect(s, 'lbean7')).body.type, 'INVALID_CODE'); // case-sensitive like the server
  assert.equal((await connect(s, { nativeEvent: {} })).body.type, 'INVALID_CODE');
  var inactive = await connect(s, 'LGATE3');
  assert.equal(inactive.status, 400);
  assert.equal(inactive.body.message, 'The requested location is inactive');
});

test('already paired: bare DEVICE_ALREADY_PAIRED, override kicks the other device with 401 TOKEN_INVALID', async () => {
  var s = makeServer();
  var first = await connect(s, 'LBEAN7');
  var token1 = first.body.data.ambii_player_jwt;
  var other = await connect(s, 'LBEAN7', { deviceId: 'android-OTHER', deviceName: 'Pixel' });
  assert.equal(other.status, 200);
  assert.equal(other.body.success, true);
  assert.equal(other.body.type, 'DEVICE_ALREADY_PAIRED');
  assert.equal(other.body.data, 'DEVICE_ALREADY_PAIRED');
  var taken = await connect(s, 'LBEAN7', { deviceId: 'android-OTHER', deviceName: 'Pixel', override: true });
  assert.equal(taken.body.type, 'SUCCESSFUL_PAIRED');
  var kicked = await s.call('GET', '/v3/api/announcement/?locationId=' + IDS.downtown + '&hash=', null, { ambii_player_jwt: token1 });
  assert.equal(kicked.status, 401);
  assert.equal(kicked.body.type, 'TOKEN_INVALID');
  assert.equal(kicked.body.message, 'You have been logged out, please login again');
  // the old device's finishedTrack (deviceId no longer paired) gets the bare string too
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(first.body.data.location, 0), {});
  assert.equal(ft.body.data, 'DEVICE_ALREADY_PAIRED');
  // a revoked token on connect is treated as absent (the device can pair again)
  var again = await s.call('POST', '/v3/api/player/connect', Object.assign({}, PLAYER, { storeCode: 'LBEAN7', override: true }), { ambii_player_jwt: token1 });
  assert.equal(again.body.type, 'SUCCESSFUL_PAIRED');
  // the seeded kiosk has an old iPad paired
  assert.equal((await connect(s, 'LMKT42')).body.data, 'DEVICE_ALREADY_PAIRED');
});

test('dashboard requests never get a 401, whatever headers they carry', async () => {
  var s = makeServer();
  var r = await s.call('GET', '/v3/auth/location', null, { authorization: 'Bearer junk', ambii_player_jwt: 'junk' });
  assert.equal(r.status, 200);
  var st = await s.call('GET', '/v3/api/station', null, { authorization: 'Bearer junk', ambii_player_jwt: 'null' });
  assert.equal(st.status, 200);
});

test('station assigned in the dashboard reaches the player at its next finishedTrack', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var loc = c.body.data.location, token = c.body.data.ambii_player_jwt;
  var target = (await s.call('GET', '/v3/api/station')).body.data.find((st) => st.name === 'Espresso Shot');
  var a = await s.call('POST', '/v3/api/station/' + target._id, { locations: [IDS.downtown] });
  assert.equal(a.body.message, 'Station station successfully assigned');
  assert.equal(a.body.type, 'STATION_ASSIGN_SUCCESSFUL');
  assert.equal(a.body.data.locations[0].station.name, 'Espresso Shot');
  assert.deepEqual(a.body.data.schedules, []);
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), { ambii_player_jwt: token });
  assert.equal(ft.body.data.newStation, true);
  assert.equal(ft.body.data.newTrackSchedule, true);
  assert.equal(ft.body.data.station.name, 'Espresso Shot');
  assert.equal(ft.body.data.trackSchedule.queueHash, a.body.data.locations[0].trackSchedule.queueHash);
  assert.equal(ft.body.data.trackSchedule.queue[0].title.length > 0, true);
  // the player now sends the new hash: nothing changes
  var newLoc = Object.assign({}, loc, { station: ft.body.data.station, trackSchedule: ft.body.data.trackSchedule });
  var ft2 = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(newLoc, 0), { ambii_player_jwt: token });
  assert.deepEqual(ft2.body.data, {});
});

test('station assignment from the web player needs allowPlayerToChangeStation', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var token = c.body.data.ambii_player_jwt;
  var st = (await s.call('GET', '/v3/api/station?page=1', null, { ambii_player_jwt: token })).body.data[2];
  var ok = await s.call('POST', '/v3/api/station/' + st._id, { locations: [IDS.downtown] }, { ambii_player_jwt: token });
  assert.equal(ok.body.success, true);
  assert.equal(ok.body.data.locations[0].currentTrackNumber, 0);
  await s.call('PATCH', '/v3/auth/location/' + IDS.downtown, { allowPlayerToChangeStation: false });
  var denied = await s.call('POST', '/v3/api/station/' + st._id, { locations: [IDS.downtown] }, { ambii_player_jwt: token });
  assert.equal(denied.status, 400);
  assert.equal(denied.body.message, 'You do not have privileges to perform this action');
  var foreign = await s.call('POST', '/v3/api/station/' + st._id, { locations: ['ffffffffffffffffffffffff'] });
  assert.equal(foreign.status, 422);
  var noList = await s.call('POST', '/v3/api/station/' + st._id, {});
  assert.equal(noList.status, 500);
  assert.equal(noList.body.message, "No 'locations' list found");
});

test('deactivating or deleting a location kicks its player at the next track end', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var p = await s.call('PATCH', '/v3/auth/location/' + IDS.downtown, { isActive: false });
  assert.equal(p.body.message, 'Location successfully updated');
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), h);
  assert.equal(ft.status, 400);
  assert.equal(ft.body.type, 'INACTIVE_LOCATION');
  assert.equal((await connect(s, 'LBEAN7')).body.type, 'INACTIVE_LOCATION');
  await s.call('PATCH', '/v3/auth/location/' + IDS.downtown, { isActive: true });
  var d = await s.call('DELETE', '/v3/auth/location/' + IDS.downtown);
  assert.equal(d.body.message, 'Location successfully deleted');
  assert.equal(d.body.data, undefined); // no schedule
  var gone = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), h);
  assert.equal(gone.body.type, 'LOCATION_DOES_NOT_EXIST');
  var list = (await s.call('GET', '/v3/auth/location')).body.data;
  assert.equal(list.length, 2);
  var anns = (await s.call('GET', '/v3/api/announcement/?hash=')).body.data.announcements;
  assert.ok(anns.every((a) => a.assignedLocations.indexOf(IDS.downtown) < 0));
  var dk = await s.call('DELETE', '/v3/auth/location/' + IDS.market);
  assert.equal(dk.body.data.schedules[0]._id, IDS.schedule);
  assert.deepEqual(dk.body.data.schedules[0].assignedLocations, []);
});

test('disconnect unpairs, dashboard shows offline; missing deviceId is "Player data not found"', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var bad = await s.call('POST', '/v3/api/player/disconnect', {}, h);
  assert.equal(bad.body.message, 'Player data not found');
  var ok = await s.call('POST', '/v3/api/player/disconnect', { deviceId: PLAYER.deviceId }, h);
  assert.equal(ok.body.message, 'Player successfully disconnected');
  var dash = (await s.call('GET', '/v3/auth/location')).body.data.find((l) => l.storeCode === 'LBEAN7');
  assert.equal(dash.pairedDevice, null);
  assert.equal((await s.call('GET', '/v3/api/player/favorite', null, h)).status, 401); // token deleted
});

test('players go offline after 15 idle minutes (computed on read)', async () => {
  var s = makeServer();
  await connect(s, 'LBEAN7');
  s.advance(14 * 60 * 1000);
  var l = (await s.call('GET', '/v3/auth/location')).body.data.find((x) => x.storeCode === 'LBEAN7');
  assert.equal(l.pairedDevice.isPlaying, true);
  s.advance(12 * 60 * 1000);
  l = (await s.call('GET', '/v3/auth/location')).body.data.find((x) => x.storeCode === 'LBEAN7');
  assert.equal(l.pairedDevice.isPlaying, false);
});

test('connecting a device elsewhere unpairs it from its previous location', async () => {
  var s = makeServer();
  await connect(s, 'LBEAN7');
  await connect(s, 'LMKT42', { override: true });
  var list = (await s.call('GET', '/v3/auth/location')).body.data;
  assert.equal(list.find((l) => l.storeCode === 'LBEAN7').pairedDevice, null);
  assert.equal(list.find((l) => l.storeCode === 'LMKT42').pairedDevice.deviceId, PLAYER.deviceId);
});

test('downvote (also without the leading slash) and favorites', async () => {
  var s = makeServer();
  var c = await connect(s, 'LBEAN7');
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var r = await s.server.handle({ method: 'POST', url: '/projects/ambii-business/apiv3/api/player/downvote', headers: h, body: { reason: 'TRACK_DISLIKED', stationId: loc.station._id, trackId: loc.currentTrack._id } });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.data, {});
  var bad = await s.call('POST', '/v3/api/player/downvote', { reason: 'NOPE', stationId: 'x', trackId: 'y' }, h);
  assert.equal(bad.status, 500);
  // the downvoted track is not in the next queue built for that station
  var a = await s.call('POST', '/v3/api/station/' + loc.station._id, { locations: [IDS.downtown] });
  assert.ok(a.body.data.locations[0].trackSchedule.queue.every((t) => t._id !== loc.currentTrack._id));
  var fav = await s.call('GET', '/v3/api/player/favorite', null, h);
  assert.equal(fav.body.message, 'Player data found');
  assert.deepEqual(fav.body.data.map((f) => f.name), ['Tapioca Tempo', 'Midnight Oil']);
  var t = await s.call('PATCH', '/v3/auth/user/favorite/' + loc.station._id);
  assert.deepEqual(t.body.data, { type: 'add' });
  assert.equal(t.body.message, 'User successfully updated');
  assert.equal((await s.call('GET', '/v3/api/player/favorite', null, h)).body.data.length, 3);
  assert.deepEqual((await s.call('PATCH', '/v3/auth/user/favorite/' + loc.station._id)).body.data, { type: 'remove' });
});

test('user, company, zones', async () => {
  var s = makeServer();
  var u = await s.call('PATCH', '/v3/auth/user/' + IDS.user, { firstName: 'Sam', lastName: 'Lee', phoneNumber: '(408) 555-0199' });
  assert.equal(u.body.message, 'User successfully updated');
  assert.equal(u.body.data, undefined);
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.firstName, 'Sam');
  assert.equal((await s.call('PATCH', '/v3/auth/user/ffffffffffffffffffffffff', {})).status, 400);
  var c = await s.call('PATCH', '/v3/auth/company', { state: 'NY', city: 'New York' });
  assert.equal(c.body.message, 'Company successfully updated');
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.company.state, 'New York');
  var z = await s.call('GET', '/v3/auth/zone');
  assert.equal(z.body.message, 'Zone data found');
  assert.equal(z.body.data.length, 3);
  assert.equal(z.body.data[0].location, undefined);
  var zp = await s.call('PATCH', '/v3/auth/zone/' + z.body.data[0]._id, { name: 'Front' });
  assert.equal(zp.body.message, 'Zone successfully updated');
  var zd = await s.call('DELETE', '/v3/auth/zone/' + z.body.data[0]._id);
  assert.equal(zd.body.message, 'Zone successfully deleted');
  assert.equal((await s.call('GET', '/v3/auth/zone')).body.data.length, 2);
});

test('new location: store code, default station, owner gets it, free plan creates it inactive', async () => {
  var s = makeServer();
  var r = await s.call('POST', '/v3/auth/location/', { name: 'Campus Cart', addressLineOne: '1 College Ave', addressLineTwo: '', city: 'San Jose', state: 'CA', postalCode: '95192', phoneNumber: '(408) 555-0177', explicitAllowed: false, allowPlayerToChangeStation: true });
  assert.equal(r.body.message, 'Location successfully created');
  var loc = r.body.data;
  assert.match(loc.storeCode, /^L[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/);
  assert.equal(loc.state, 'California');
  assert.equal(loc.station._id, DEFAULT_STATION_ID);
  assert.equal(loc.isActive, true);
  assert.ok(loc.trackSchedule.queue.length >= 8);
  assert.equal((await s.call('GET', '/v3/auth/location')).body.data.length, 4);
  assert.equal((await connect(s, loc.storeCode)).body.type, 'SUCCESSFUL_PAIRED');
  await s.call('PATCH', '/v3/auth/subscription', {});
  var free = await s.call('POST', '/v3/auth/location/', { name: 'Second' });
  assert.equal(free.body.data.isActive, false);
});

test('signup creates the location and returns the user', async () => {
  var s = makeServer();
  var r = await s.call('POST', '/v3/auth/signup', { locationName: 'Bean Two', addressLineOne: '9 Oak St', addressLineTwo: '', city: 'Oakland', state: 'California', postalCode: '94607', locationPhoneNumber: '1', companyName: 'Bean Two Co', firstName: 'Ann', lastName: 'Lee', userPhoneNumber: '2' });
  assert.equal(r.body.message, 'Successful');
  assert.equal(r.body.data.user.company.name, 'Bean Two Co');
  assert.equal(r.body.data.locations[0].name, 'Bean Two');
});

test('billing: addresses, cards (last four only), invoices', async () => {
  var s = makeServer();
  var a = await s.call('GET', '/v3/auth/billing-address');
  assert.equal(a.body.message, 'Billing address data found');
  assert.equal(a.body.data[0].addressName, 'Head Office');
  var created = await s.call('POST', '/v3/auth/billing-address', { addressName: 'Home', addressLineOne: '1 A St', addressLineTwo: '', city: 'San Jose', state: 'California', postalCode: '95110', setAsDefault: true });
  assert.equal(created.body.message, 'Billing address successfully created');
  assert.ok(created.body.data.billingAddressId);
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.defaultBillingAddressId, created.body.data.billingAddressId);
  assert.equal((await s.call('POST', '/v3/auth/billing-address', { addressName: 'x' })).status, 400);
  assert.equal((await s.call('PATCH', '/v3/auth/billing-address/undefined', { city: 'x', setAsDefault: false })).body.success, true);
  var cards = await s.call('GET', '/v3/auth/card');
  assert.equal(cards.body.message, 'Card data found');
  assert.deepEqual(Object.keys(cards.body.data[0]).sort(), ['brand', 'cardId', 'cardNumber', 'cvc_check', 'expMonth', 'expYear', 'nameOnCard']);
  assert.equal(cards.body.data[0].cardNumber, '4242');
  var card = await s.call('POST', '/v3/auth/card', { nameOnCard: 'Sam Lee', cardNumber: '5555555555554444', expMonth: '11', expYear: '2031', cvc: '123', setAsDefault: true });
  assert.equal(card.body.message, 'Card successfully created');
  assert.equal(card.body.data.cardNumber, '4444');
  assert.equal(card.body.data.brand, 'mastercard');
  assert.equal(card.body.data.expYear, 2031);
  assert.ok(!JSON.stringify(s.collection('cards')).includes('5555555555554444'));
  assert.ok(!JSON.stringify(s.collection('cards')).includes('"cvc"'));
  var patch = await s.call('POST', '/v3/auth/card', { nameOnCard: 'Sam', brand: 'Visa', cardNumber: '4242', expMonth: '12', expYear: '2030' });
  assert.equal(patch.body.data.brand, 'visa');
  var inv = await s.call('GET', '/v3/auth/invoice');
  assert.equal(inv.body.message, 'Invoice data found');
  assert.equal(inv.body.data.length, 3);
  assert.ok(inv.body.data.every((i) => i.status === 'paid' && i.total > 0 && i.createdAt && i.hosted_invoice_url === null));
  assert.ok(new Date(inv.body.data[0].createdAt) > new Date(inv.body.data[2].createdAt));
});

test('subscription: cancel deactivates all but the first, adds ads; a second cancel is a 400; subscribing again restores', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  var c = await connect(s, 'LBEAN7');
  var loc = c.body.data.location, h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  var already = await s.call('POST', '/v3/auth/subscription', { cardId: IDS.card });
  assert.deepEqual(already.body, { success: false, message: 'You are already subscribed', type: 'ALREADY_SUBSCRIBED', data: {} });
  var cancel = await s.call('PATCH', '/v3/auth/subscription', { cancellationReason: 'TOO_EXPENSIVE', cancellationDescription: 'demo' });
  assert.equal(cancel.body.message, 'User cancel subscription success');
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.company.subscribed, false);
  var list = (await s.call('GET', '/v3/auth/location')).body.data;
  assert.deepEqual(list.map((l) => [l.storeCode, l.isActive]), [['LBEAN7', true], ['LMKT42', false], ['LGATE3', false]]);
  // the player at the kept location gets a queue with ads at its next track end
  var ft = await s.call('POST', '/v3/api/player/finishedTrack', finishedBody(loc, 0), h);
  assert.equal(ft.body.data.newTrackSchedule, true);
  assert.equal(ft.body.data.newStation, undefined);
  assert.equal(ft.body.data.trackSchedule.hasAds, true);
  var ads = ft.body.data.trackSchedule.queue.filter((t) => t.isrc.indexOf('ADVERT_') === 0);
  assert.ok(ads.length >= 1);
  assert.ok(ads.every((t) => t.picture && t.album.cover_large && t.url.endsWith('.mp3')));
  assert.equal(new Set(ft.body.data.trackSchedule.queue.map((t) => t.isrc)).size, ft.body.data.trackSchedule.queue.length);
  var again = await s.call('PATCH', '/v3/auth/subscription', {});
  assert.equal(again.status, 400);
  assert.equal(again.body.message, 'User no subscription found for this user, create one');
  var sub = await s.call('POST', '/v3/auth/subscription', { cardId: IDS.card });
  assert.equal(sub.body.message, 'User subscription success');
  list = (await s.call('GET', '/v3/auth/location')).body.data;
  assert.ok(list.every((l) => l.isActive));
  assert.equal((await s.call('GET', '/v3/auth/invoice')).body.data.length, 4);
});

test('zero-card account cannot subscribe', async () => {
  var s = makeServer();
  await s.call('GET', '/v3/auth/jwt');
  var cards = s.collection('cards');
  Object.values(cards).forEach((c) => { c.isDeleted = true; });
  s.storage.setItem('ambii-demo:cards', JSON.stringify(cards));
  await s.call('PATCH', '/v3/auth/subscription', {});
  var r = await s.call('POST', '/v3/auth/subscription', { cardId: 'x' });
  assert.equal(r.body.message, 'User please add a card');
});

test('mobile version and logs', async () => {
  var s = makeServer();
  var v = await s.call('GET', '/v3/public/mobile/version');
  assert.deepEqual(v.body, { success: true, message: 'Successful', type: 'SUCCESSFUL' });
  var e = await s.call('POST', '/v3/api/log/error', { platform: 'web-player', function: 'x', error: '{}' });
  assert.equal(e.body.message, 'Successful');
  var l = await s.call('POST', '/v3/api/log', { log: 'hello' });
  assert.deepEqual(l.body.data, {});
  assert.equal((await s.call('GET', '/v3/public/valid-states')).body.data.length, 100);
});

test('state is shared through storage: a second server on the same storage sees the first one\'s writes', async () => {
  var a = makeServer();
  var b = makeServer({ storage: a.storage });
  var c = await connect(a, 'LBEAN7');
  var seen = (await b.call('GET', '/v3/auth/location')).body.data.find((l) => l.storeCode === 'LBEAN7');
  assert.equal(seen.pairedDevice.deviceId, PLAYER.deviceId);
  await b.call('PATCH', '/v3/auth/location/' + IDS.downtown, { isActive: false });
  var ft = await a.call('POST', '/v3/api/player/finishedTrack', finishedBody(c.body.data.location, 0), { ambii_player_jwt: c.body.data.ambii_player_jwt });
  assert.equal(ft.body.type, 'INACTIVE_LOCATION');
});

test('a failed write answers 500 and leaves storage as it was', async () => {
  var s = makeServer();
  await s.call('GET', '/v3/auth/jwt');
  var before = s.storage.getItem('ambii-demo:companies');
  var setItem = s.storage.setItem;
  s.storage.setItem = function () { throw new Error('QuotaExceededError'); };
  var r = await s.call('PATCH', '/v3/auth/company', { name: 'Nope' });
  s.storage.setItem = setItem;
  assert.equal(r.status, 500);
  assert.equal(r.body.message, 'Internal server error');
  assert.equal(s.storage.getItem('ambii-demo:companies'), before);
});
