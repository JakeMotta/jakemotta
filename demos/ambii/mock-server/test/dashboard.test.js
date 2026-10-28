// The dashboard's CSV location upload (POST /v3/auth/location/upload) and "start a new business" (a second user
// and company, picked by the dashboard's token).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeServer, connect, todayAt } from './helpers.js';
import { SEED_VERSION, DEFAULT_STATION_ID } from '../config.js';
import { IDS } from '../core/seed.js';
import { DEMO_TOKENS, NEW_BUSINESS_IDS } from '../core/handlers/account.js';
import { matchRoute } from '../core/server.js';

var OWNER = { authorization: 'Bearer ' + DEMO_TOKENS.owner };
var NEW_BIZ = { authorization: 'Bearer ' + DEMO_TOKENS.newBusiness };

// What the upload modal sends for one CSV row (parseRowData).
function row(name, extra) {
  return Object.assign({
    name: name, addressLineOne: '1 Test St', addressLineTwo: '', city: 'San Jose', state: 'CA', postalCode: '95113', phoneNumber: '(408) 555-0190',
    explicitAllowed: false, allowPlayerToChangeStation: true,
  }, extra || {});
}

var SIGNUP = {
  locationName: 'Bluebird Coffee House', addressLineOne: 'Lincoln Ave', addressLineTwo: '', city: 'San Jose', state: 'California', postalCode: '95125',
  locationPhoneNumber: '(408) 555-0142', cords: [-121.8996, 37.3049], companyName: 'Bluebird Coffee', firstName: 'Sam', lastName: 'Park', userPhoneNumber: '4085550199',
};

test('upload: route sits above location/:id', () => {
  assert.equal(matchRoute('POST', 'v3/auth/location/upload').template, 'v3/auth/location/upload');
});

test('upload: every row becomes a location with a zone, a store code and the default station', async () => {
  var s = makeServer({ time: todayAt(10, 0) });
  var before = (await s.call('GET', '/v3/auth/location')).body.data.length;
  var r = await s.call('POST', '/v3/auth/location/upload', [row('Willow Glen'), row('  Campus Corner  ', { state: 'california', addressLineTwo: 'Unit 2' }), row('Harbor', { state: 'new york', explicitAllowed: 'true' })]);
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.message, 'Location successfully created');
  assert.equal(r.body.type, 'SUCCESSFUL_CREATE');
  assert.equal(r.body.data.length, 3);
  r.body.data.forEach(function (item) {
    assert.equal(item.success, true);
    assert.deepEqual(item.message, { code: 200, message: 'Successfully created', type: 'SUCCESSFUL_CREATE', success: true });
    assert.match(item.data.storeCode, /^L[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/);
    assert.equal(item.data.station._id, DEFAULT_STATION_ID);
    assert.equal(item.data.isActive, true); // Premium: every row is active
    assert.equal(item.data.zones.length, 1);
  });
  var locs = r.body.data.map((i) => i.data);
  assert.deepEqual(locs.map((l) => l.name), ['Willow Glen', 'Campus Corner', 'Harbor']); // trimmed, in order
  assert.deepEqual(locs.map((l) => l.state), ['California', 'California', 'New York']);
  assert.deepEqual(locs.map((l) => l.explicitAllowed), [false, false, true]);
  assert.equal(locs[1].addressLineTwo, 'Unit 2');
  assert.equal(new Set(locs.map((l) => l.storeCode)).size, 3);
  var zones = s.collection('zones');
  locs.forEach(function (l) {
    var zone = zones[l.zones[0]._id || l.zones[0]];
    assert.ok(zone, 'zone stored');
    assert.equal(zone.location, l._id);
    assert.match(zone.zoneCode, /^Z[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{5}$/);
  });
  var after = (await s.call('GET', '/v3/auth/location')).body.data;
  assert.equal(after.length, before + 3);
  assert.equal((await connect(s, locs[0].storeCode)).body.type, 'SUCCESSFUL_PAIRED');
});

test('upload: Joi-style validation rejects the whole upload and creates nothing', async () => {
  var s = makeServer();
  await s.call('GET', '/v3/auth/jwt'); // seeds
  var before = Object.keys(s.collection('locations')).length;
  async function rejects(body, status, message) {
    var r = await s.call('POST', '/v3/auth/location/upload', body);
    assert.equal(r.status, status, message);
    assert.deepEqual(r.body, { statusCode: status, error: true, data: {}, message: message });
  }
  await rejects([], 400, '"value" must contain at least 1 items');
  await rejects({ name: 'x' }, 400, '"value" must be an array');
  await rejects([row('Ok'), row('   ')], 400, '"[1].name" is not allowed to be empty');
  await rejects([row('Ok', { city: 7 })], 400, '"[0].city" must be a string');
  await rejects([row('Ok', { explicitAllowed: 'yes' })], 400, '"[0].explicitAllowed" must be a boolean');
  await rejects([row('Ok', { storeCode: 'LXXXXX' })], 400, '"[0].storeCode" is not allowed');
  await rejects([row('Ok'), row('Bad state', { state: 'XX' })], 500, 'State is invalid!');
  await rejects(['just a string'], 400, '"[0]" must be of type object');
  var big = [];
  for (var i = 0; i < 1001; i++) big.push(row('Store ' + i));
  await rejects(big, 400, '"value" must contain less than or equal to 1000 items');
  assert.equal(Object.keys(s.collection('locations')).length, before);
});

test('upload: a row without a state fails on its own, as on the server', async () => {
  var s = makeServer();
  var noState = row('No state');
  delete noState.state;
  var r = await s.call('POST', '/v3/auth/location/upload', [row('Fine'), noState]);
  assert.equal(r.body.type, 'SUCCESSFUL_CREATE');
  assert.equal(r.body.data[0].success, true);
  assert.deepEqual(r.body.data[1], { success: false, message: { code: 500, message: 'Internal server error', type: 'INTERNAL_SERVER_ERROR', success: false } });
});

test('upload on the free plan: free seats first, the rest inactive', async () => {
  var s = makeServer();
  // A new business with no locations yet: one free seat.
  var r = await s.call('POST', '/v3/auth/location/upload', [row('First'), row('Second'), row('Third')], NEW_BIZ);
  assert.deepEqual(r.body.data.map((i) => i.data.isActive), [true, false, false]);
  // Its one active location uses the seat, so a second upload is all inactive.
  r = await s.call('POST', '/v3/auth/location/upload', [row('Fourth')], NEW_BIZ);
  assert.deepEqual(r.body.data.map((i) => i.data.isActive), [false]);
  // The seeded company after cancelling its plan keeps one active location.
  await s.call('PATCH', '/v3/auth/subscription', {});
  r = await s.call('POST', '/v3/auth/location/upload', [row('Fifth')]);
  assert.deepEqual(r.body.data.map((i) => i.data.isActive), [false]);
  // The new business's rows are its own, not the seeded owner's.
  var mine = (await s.call('GET', '/v3/auth/location', null, NEW_BIZ)).body.data.map((l) => l.name).sort();
  assert.deepEqual(mine, ['First', 'Fourth', 'Second', 'Third']);
});

test('new business: the token makes a blank company that opens the sign-up modal', async () => {
  var s = makeServer({ time: todayAt(11, 0) });
  var maya = (await s.call('GET', '/v3/auth/jwt', null, OWNER)).body.data;
  var r = await s.call('GET', '/v3/auth/jwt', null, NEW_BIZ);
  assert.equal(r.body.type, 'DATA_FOUND');
  var user = r.body.data;
  assert.equal(user._id, NEW_BUSINESS_IDS.user);
  assert.equal(user.firstName, '');
  assert.equal(user.role, 'owner');
  assert.deepEqual(user.favorites, []);
  assert.equal(user.company._id, NEW_BUSINESS_IDS.company);
  assert.equal(user.company.name, ''); // App.js opens SignUpModal when the company has keys but no name
  assert.ok(Object.keys(user.company).length > 1);
  assert.equal(user.company.subscribed, false);
  assert.equal(user.company.businessType, undefined); // restaurant rows on Stations
  assert.deepEqual((await s.call('GET', '/v3/auth/location', null, NEW_BIZ)).body.data, []);
  assert.deepEqual((await s.call('GET', '/v3/auth/zone', null, NEW_BIZ)).body.data, []);
  assert.deepEqual((await s.call('GET', '/v3/auth/schedule', null, NEW_BIZ)).body.data.schedules, []);
  assert.deepEqual((await s.call('GET', '/v3/api/announcement', null, NEW_BIZ)).body.data.announcements, []);
  assert.ok((await s.call('GET', '/v3/api/announcement', null, OWNER)).body.data.announcements.length > 0);
  // A second request finds the same user rather than making another.
  assert.equal((await s.call('GET', '/v3/auth/jwt', null, NEW_BIZ)).body.data._id, NEW_BUSINESS_IDS.user);
  assert.equal(Object.values(s.collection('users')).filter((u) => u.company === NEW_BUSINESS_IDS.company).length, 1);
  // The seeded owner is untouched, with or without her token.
  assert.equal((await s.call('GET', '/v3/auth/jwt', null, OWNER)).body.data.company.name, maya.company.name);
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data._id, IDS.user);
});

test('new business: sign-up, a free plan with ads, its own store a player can connect to', async () => {
  var s = makeServer({ time: todayAt(11, 0) });
  var mayaLocations = (await s.call('GET', '/v3/auth/location', null, OWNER)).body.data.map((l) => l._id).sort();
  var r = await s.call('POST', '/v3/auth/signup', SIGNUP, NEW_BIZ);
  assert.equal(r.body.message, 'Successful');
  assert.equal(r.body.data.user._id, NEW_BUSINESS_IDS.user);
  assert.equal(r.body.data.user.firstName, 'Sam');
  assert.equal(r.body.data.user.company.name, 'Bluebird Coffee');
  assert.equal(r.body.data.user.company.subscribed, false);
  var loc = r.body.data.locations[0];
  assert.equal(loc.name, 'Bluebird Coffee House');
  assert.equal(loc.isActive, true);
  assert.equal(loc.company._id || loc.company, NEW_BUSINESS_IDS.company);
  assert.equal(loc.trackSchedule.hasAds, true);
  assert.ok(loc.trackSchedule.queue.some((t) => t.isrc.indexOf('ADVERT_') === 0));
  assert.deepEqual((await s.call('GET', '/v3/auth/location', null, NEW_BIZ)).body.data.map((l) => l.storeCode), [loc.storeCode]);
  // The seeded owner's stores are as they were, and the new one isn't among them.
  assert.deepEqual((await s.call('GET', '/v3/auth/location', null, OWNER)).body.data.map((l) => l._id).sort(), mayaLocations);
  assert.equal((await s.call('GET', '/v3/auth/jwt')).body.data.firstName, 'Maya');

  // The web player and the phone app connect to its store code like any other.
  var c = await connect(s, loc.storeCode);
  assert.equal(c.body.type, 'SUCCESSFUL_PAIRED');
  assert.equal(c.body.data.location._id, loc._id);
  assert.equal(c.body.data.location.trackSchedule.hasAds, true);
  var h = { ambii_player_jwt: c.body.data.ambii_player_jwt };
  assert.equal((await s.call('GET', '/v3/api/announcement?locationId=' + loc._id, null, h)).body.type, 'DATA_FOUND');

  // The dashboard's Assign (POST /v3/api/station/:id) goes to the business its token names.
  var stations = (await s.call('GET', '/v3/api/station')).body.data;
  var other = stations.filter((st) => st._id !== DEFAULT_STATION_ID)[0];
  var assign = await s.call('POST', '/v3/api/station/' + other._id, { locations: [loc._id] }, NEW_BIZ);
  assert.equal(assign.body.type, 'STATION_ASSIGN_SUCCESSFUL');
  assert.equal(assign.body.data.locations[0].station._id, other._id);
  var wrong = await s.call('POST', '/v3/api/station/' + other._id, { locations: [loc._id] }, OWNER);
  assert.equal(wrong.body.type, 'INCOMPLETE_REQUEST');
  var notMine = await s.call('POST', '/v3/api/station/' + other._id, { locations: [mayaLocations[0]] }, NEW_BIZ);
  assert.equal(notMine.body.type, 'INCOMPLETE_REQUEST');

  // Favorites and the free-plan limits are the new business's own.
  await s.call('PATCH', '/v3/auth/user/favorite/' + other._id, null, NEW_BIZ);
  assert.deepEqual((await s.call('GET', '/v3/auth/jwt', null, NEW_BIZ)).body.data.favorites.map((f) => f._id), [other._id]);
  assert.ok((await s.call('GET', '/v3/auth/jwt', null, OWNER)).body.data.favorites.every((f) => f._id !== other._id));
  var second = await s.call('POST', '/v3/auth/location/', { name: 'Second Bluebird', state: 'CA' }, NEW_BIZ);
  assert.equal(second.body.data.isActive, false);
});

test('new business: Reset demo (a cleared storage) and a reseed start it over', async () => {
  var s = makeServer();
  await s.call('POST', '/v3/auth/signup', SIGNUP, NEW_BIZ);
  assert.equal((await s.call('GET', '/v3/auth/jwt', null, NEW_BIZ)).body.data.company.name, 'Bluebird Coffee');
  s.storage.setItem('ambii-demo:meta', JSON.stringify({ seedVersion: SEED_VERSION - 1 }));
  var r = await s.call('GET', '/v3/auth/jwt', null, NEW_BIZ);
  assert.equal(r.body.data.company.name, '');
  assert.deepEqual((await s.call('GET', '/v3/auth/location', null, NEW_BIZ)).body.data, []);
});

test('new business: a subscription that fails (no card yet) changes nothing, so the free plan still has one active store', async () => {
  var s = makeServer();
  await s.call('POST', '/v3/auth/signup', SIGNUP, NEW_BIZ);
  var second = (await s.call('POST', '/v3/auth/location/', { name: 'Second Bluebird', state: 'CA' }, NEW_BIZ)).body.data;
  var uploaded = (await s.call('POST', '/v3/auth/location/upload', [row('Third Bluebird')], NEW_BIZ)).body.data[0].data;
  assert.equal(second.isActive, false);
  assert.equal(uploaded.isActive, false);
  var r = await s.call('POST', '/v3/auth/subscription', { cardId: 'card_none' }, NEW_BIZ);
  assert.equal(r.body.message, 'User please add a card');
  var locations = s.collection('locations');
  assert.equal(locations[second._id].isActive, false);
  assert.equal(locations[uploaded._id].isActive, false);
  assert.equal(s.collection('companies')[NEW_BUSINESS_IDS.company].subscribed, false);
  assert.equal((await s.call('GET', '/v3/auth/invoice', null, NEW_BIZ)).body.type, 'NO_DATA_FOUND');
  // With a card it goes through, and every store is switched on.
  await s.call('POST', '/v3/auth/card', { nameOnCard: 'Sam Park', brand: 'Visa', cardNumber: '4242', expMonth: '12', expYear: '2030' }, NEW_BIZ);
  r = await s.call('POST', '/v3/auth/subscription', { cardId: 'x' }, NEW_BIZ);
  assert.equal(r.body.message, 'User subscription success');
  locations = s.collection('locations');
  assert.ok([second._id, uploaded._id].every((id) => locations[id].isActive));
});
