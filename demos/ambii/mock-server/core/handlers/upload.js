// POST /v3/auth/location/upload: the dashboard's CSV location upload. Only on the server's develop branch
// (createMultipleLocationsAPI, merged 2022-01-17, never deployed): the dashboard's develop branch is where the upload
// modal comes from. Each row is created the way POST /v3/auth/location creates one (store code, zone, default station).
import { send, rawError, MESSAGES } from '../envelope.js';
import { validStatesList, fullStateName } from '../util.js';
import { locationFull } from '../music.js';
import { createLocation } from './locations.js';

var FREE_LOCATIONS = 1; // config.freeLocations
var MAX_ROWS = 1000;

// validators/location.js `location`, in its key order (Joi checks the keys in schema order, then the unknown ones).
var SCHEMA = [
  ['name', 'string'], ['addressLineOne', 'string'], ['addressLineTwo', 'string', true], ['city', 'string'], ['country', 'string'],
  ['postalCode', 'string'], ['phoneNumber', 'string'], ['explicitAllowed', 'boolean'], ['isActive', 'boolean'],
  ['allowPlayerToChangeStation', 'boolean'], ['state', 'state'],
];

var STATE_BY_LOWER = null;
function stateMatch(value) {
  if (!STATE_BY_LOWER) {
    STATE_BY_LOWER = {};
    validStatesList().forEach(function (s) { STATE_BY_LOWER[s.toLowerCase()] = s; });
  }
  return STATE_BY_LOWER[value.toLowerCase()] || null;
}

// One row through the Joi schema (convert on, abortEarly): returns { value } or { error: <the response> }. A Joi error
// is a 400 with Joi's message; `state` has a custom .error(new Error(...)), which the error handler sent as a 500.
function validateRow(item, i) {
  var label = function (key) { return '"[' + i + '].' + key + '"'; };
  if (!item || typeof item !== 'object' || Array.isArray(item)) return { error: rawError(400, '"[' + i + ']" must be of type object') };
  var out = {};
  for (var k = 0; k < SCHEMA.length; k++) {
    var key = SCHEMA[k][0], type = SCHEMA[k][1], v = item[key];
    if (v === undefined) continue;
    if (type === 'boolean') {
      if (typeof v === 'string' && /^(true|false)$/i.test(v)) v = v.toLowerCase() === 'true';
      if (typeof v !== 'boolean') return { error: rawError(400, label(key) + ' must be a boolean') };
    } else if (type === 'state') {
      var match = typeof v === 'string' ? stateMatch(v.trim()) : null;
      if (!match) return { error: rawError(500, 'State is invalid!') };
      v = match;
    } else {
      if (typeof v !== 'string') return { error: rawError(400, label(key) + ' must be a string') };
      v = v.trim();
      if (v === '' && !SCHEMA[k][2]) return { error: rawError(400, label(key) + ' is not allowed to be empty') };
    }
    out[key] = v;
  }
  var known = SCHEMA.map(function (s) { return s[0]; });
  var extra = Object.keys(item).filter(function (key) { return known.indexOf(key) < 0; })[0];
  if (extra) return { error: rawError(400, label(extra) + ' is not allowed') };
  return { value: out };
}

// Each row's result carried the server's message object itself (configs/messages.js), not its text.
function messageObject(type) {
  var m = MESSAGES[type];
  return { code: m[0], message: m[2], type: type, success: m[1] };
}

export function uploadLocations(ctx) {
  var rows = ctx.body;
  if (!Array.isArray(rows)) return rawError(400, '"value" must be an array');
  var clean = [];
  for (var i = 0; i < rows.length; i++) {
    var r = validateRow(rows[i], i);
    if (r.error) return r.error;
    clean.push(r.value);
  }
  if (clean.length < 1) return rawError(400, '"value" must contain at least 1 items');
  if (clean.length > MAX_ROWS) return rawError(400, '"value" must contain less than or equal to ' + MAX_ROWS + ' items');

  // Free seats are filled first: a free company keeps one active location, so the rows past it are created inactive.
  // (The server counted seats as freeLocations minus the active locations for a subscribed company too, which made
  // every uploaded row inactive for a Premium company that had a location; the modal promises those rows are billed,
  // so the mock does what was meant: on Premium every row is active.)
  var company = ctx.company;
  var active = ctx.tx.all('locations').filter(function (l) { return !l.isDeleted && l.isActive && l.company === company._id; }).length;
  var seats = company.subscribed ? Infinity : Math.max(0, FREE_LOCATIONS - active);
  var created = clean.map(function (data) {
    // createLocation put `isActive: seats > 0` before the row, so a row's own isActive (the modal never sends one) won.
    var isActive = typeof data.isActive === 'boolean' ? data.isActive : seats > 0;
    seats--;
    // A row without a state threw in createLocation (state.substring) before anything was saved; that row's result
    // was the failure, and the answer as a whole still said "successfully created". (The modal requires a state.)
    if (typeof data.state !== 'string') return { success: false, message: messageObject('INTERNAL_SERVER_ERROR') };
    data.state = fullStateName(data.state);
    var loc = createLocation(ctx, data, isActive);
    return { success: true, message: messageObject('SUCCESSFUL_CREATE'), data: locationFull(ctx, loc) };
  });
  return send('SUCCESSFUL_CREATE', created, 'Location');
}
