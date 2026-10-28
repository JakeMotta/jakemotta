// /v3/auth/location*, /v3/auth/zone*
import { send } from '../envelope.js';
import { clone, pick, stamp, newId, randomCode, fullStateName } from '../util.js';
import { assignStation, locationFull, locationList, followSchedule } from '../music.js';
import { DEFAULT_STATION_ID } from '../../config.js';

var LOCATION_FIELDS = ['name', 'addressLineOne', 'addressLineTwo', 'city', 'country', 'postalCode', 'phoneNumber', 'explicitAllowed', 'isActive', 'allowPlayerToChangeStation', 'state'];

function uniqueCode(ctx, letter, collection, field) {
  for (;;) {
    var code = letter + randomCode(ctx.random, 5);
    if (!ctx.tx.findOne(collection, function (d) { return d[field] === code; })) return code;
  }
}

function myLocations(ctx) {
  var assigned = ctx.user.assignedLocations || [];
  return ctx.tx.all('locations').filter(function (l) {
    return !l.isDeleted && l.company === ctx.company._id && assigned.indexOf(l._id) >= 0;
  });
}

// controllers/location.js createLocation: store code, zone, default station, added to the owner's locations.
export function createLocation(ctx, data, isActive) {
  var tx = ctx.tx;
  var id = newId(ctx);
  var zone = {
    _id: newId(ctx), name: data.name || 'My Zone', location: id, company: ctx.company._id, zoneCode: uniqueCode(ctx, 'Z', 'zones', 'zoneCode'),
    isActive: false, isDeleted: false, explicitAllowed: false, schedule: null, trackSchedule: null, currentTrack: null, currentTrackNumber: 0,
    lastTrack: null, station: null, stationHistory: [], pairedDevice: null,
  };
  stamp(zone, ctx.now(), true);
  tx.put('zones', zone);
  var loc = Object.assign({
    name: '', addressLineOne: '', addressLineTwo: '', city: '', state: '', country: 'United States', postalCode: '', phoneNumber: '', cords: [],
    businessType: 'Cafe', explicitAllowed: false, allowPlayerToChangeStation: false,
  }, pick(data, LOCATION_FIELDS.concat(['cords'])), {
    _id: id, company: ctx.company._id, storeCode: uniqueCode(ctx, 'L', 'locations', 'storeCode'), zones: [zone._id], isActive: isActive,
    isDeleted: false, station: null, schedule: null, trackSchedule: null, currentTrack: null, currentTrackNumber: 0, lastTrack: null,
    stationHistory: [], pairedDevice: null, subscription: null,
  });
  if (typeof loc.addressLineTwo !== 'string') loc.addressLineTwo = '';
  loc.state = fullStateName(loc.state);
  stamp(loc, ctx.now(), true);
  tx.put('locations', loc);
  assignStation(ctx, [id], DEFAULT_STATION_ID, null);
  var user = ctx.user;
  user.assignedLocations = user.assignedLocations || [];
  if (user.assignedLocations.indexOf(id) < 0) user.assignedLocations.push(id);
  tx.put('users', user);
  return loc;
}

// GET /v3/auth/location. A store with a simulated player (demo only) first moves to its schedule's due
// block, as its player would have; then each location's Now Playing is read off the wall clock.
export function getLocations(ctx) {
  var list = myLocations(ctx);
  list.forEach(function (l) { followSchedule(ctx, l); });
  return send('DATA_FOUND', list.map(function (l) { return locationList(ctx, l); }), 'Location');
}

// GET /v3/auth/location/:id (no client calls it)
export function getLocation(ctx) {
  var loc = myLocations(ctx).filter(function (l) { return l._id === ctx.params.id; })[0];
  if (!loc) return send('INTERNAL_SERVER_ERROR');
  followSchedule(ctx, loc);
  return send('DATA_FOUND', locationList(ctx, loc), 'Location');
}

// POST /v3/auth/location/. A company on the free plan keeps one active location: further ones are
// created inactive, silently, as the server did (it never sent PRODUCT_LIMIT_REACHED_LOCATION).
export function postLocation(ctx) {
  var active = ctx.tx.all('locations').filter(function (l) { return !l.isDeleted && l.isActive && l.company === ctx.company._id; }).length;
  var limitReached = !ctx.company.subscribed && active >= 1;
  var loc = createLocation(ctx, ctx.body || {}, !limitReached);
  return send('SUCCESSFUL_CREATE', locationFull(ctx, loc), 'Location');
}

function authorizedLocation(ctx) {
  return myLocations(ctx).filter(function (l) { return l._id === ctx.params.id; })[0] || null;
}

// PATCH /v3/auth/location/:id. Deactivating is picked up by the location's player at its next track end.
export function patchLocation(ctx) {
  var loc = authorizedLocation(ctx);
  if (!loc) return send('BAD_REQUEST');
  var changes = pick(ctx.body, LOCATION_FIELDS);
  if (changes.state !== undefined) changes.state = fullStateName(changes.state);
  Object.assign(loc, changes);
  stamp(loc, ctx.now());
  ctx.tx.put('locations', loc);
  return send('SUCCESSFUL_UPDATE', null, 'Location');
}

// DELETE /v3/auth/location/:id: soft delete, removed from announcements and from its schedule.
export function deleteLocation(ctx) {
  var tx = ctx.tx;
  var loc = authorizedLocation(ctx);
  if (!loc) return send('BAD_REQUEST');
  loc.isDeleted = true;
  stamp(loc, ctx.now());
  tx.put('locations', loc);
  tx.all('announcements').forEach(function (a) {
    if ((a.assignedLocations || []).indexOf(loc._id) >= 0) {
      a.assignedLocations = a.assignedLocations.filter(function (x) { return x !== loc._id; });
      tx.put('announcements', a);
    }
  });
  var data = null;
  var schedule = loc.schedule ? tx.get('schedules', loc.schedule) : null;
  if (schedule) {
    schedule.assignedLocations = (schedule.assignedLocations || []).filter(function (x) { return x !== loc._id; });
    stamp(schedule, ctx.now());
    tx.put('schedules', schedule);
    data = { schedules: [clone(schedule)] };
  }
  return send('SUCCESSFUL_DELETE', data, 'Location');
}

// GET /v3/auth/zone (nothing in the dashboard renders zones)
export function getZones(ctx) {
  var assigned = ctx.user.assignedLocations || [];
  var zones = ctx.tx.all('zones').filter(function (z) { return !z.isDeleted && z.company === ctx.company._id && assigned.indexOf(z.location) >= 0; })
    .map(function (z) {
      var v = clone(z);
      delete v.location;
      delete v.company;
      return v;
    });
  return send('DATA_FOUND', zones, 'Zone');
}

var ZONE_FIELDS = ['name', 'addressLineOne', 'addressLineTwo', 'city', 'country', 'postalCode', 'phoneNumber', 'explicitAllowed'];

// PATCH /v3/auth/zone/:id. The server always answered 500 here (no "zone" branch in checkIfAuthorized);
// the mock does what it was meant to do.
export function patchZone(ctx) {
  var zone = ctx.tx.get('zones', ctx.params.id);
  if (!zone || zone.isDeleted || zone.company !== ctx.company._id) return send('UNSUCCESSFUL_UPDATE', null, 'Zone');
  Object.assign(zone, pick(ctx.body, ZONE_FIELDS));
  stamp(zone, ctx.now());
  ctx.tx.put('zones', zone);
  return send('SUCCESSFUL_UPDATE', null, 'Zone');
}

// DELETE /v3/auth/zone/:id
export function deleteZone(ctx) {
  var zone = ctx.tx.get('zones', ctx.params.id);
  if (!zone || zone.isDeleted || zone.company !== ctx.company._id) return send('UNSUCCESSFUL_DELETE', null, 'Zone');
  zone.isDeleted = true;
  stamp(zone, ctx.now());
  ctx.tx.put('zones', zone);
  return send('SUCCESSFUL_DELETE', null, 'Zone');
}
