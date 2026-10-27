// /v3/auth/schedule*: day-part schedules. Each block gets a generated station; assigned locations switch
// to the station of the block that is due now (browser local time).
import { send } from '../envelope.js';
import { clone, pick, stamp, newId } from '../util.js';
import {
  assignStation, createDynamicStation, blocksOf, dueStationId, getStation, locationFull, locationList, collectDynamicStations,
} from '../music.js';
import { DEFAULT_STATION_ID } from '../../config.js';

var BLOCK_FIELDS = ['name', 'startTime', 'endTime', 'days', 'genres', 'tempo', 'hash'];

function blockView(tx, block, withStation) {
  var v = clone(block);
  if (withStation) v.station = clone(getStation(tx, block.station));
  return v;
}

// controllers/schedule.js handleScheduleEdits: locations dropped from the schedule go back to the default
// station; assigned ones get the due block's station (and a fresh queue).
function applySchedule(ctx, schedule) {
  var tx = ctx.tx;
  var assigned = (schedule.assignedLocations || []).filter(function (id) {
    var l = tx.get('locations', id);
    return l && !l.isDeleted;
  });
  var removed = tx.all('locations').filter(function (l) { return !l.isDeleted && l.schedule === schedule._id && assigned.indexOf(l._id) < 0; })
    .map(function (l) { return l._id; });
  var touchedLocations = [], touchedSchedules = [schedule];
  function remember(result) {
    if (!result) return;
    result.locations.forEach(function (l) { if (touchedLocations.indexOf(l) < 0) touchedLocations.push(l); });
    result.schedules.forEach(function (s) { if (!touchedSchedules.some(function (x) { return x._id === s._id; })) touchedSchedules.push(s); });
  }
  if (removed.length) remember(assignStation(ctx, removed, DEFAULT_STATION_ID, null));
  var due = dueStationId(tx, schedule, ctx.now());
  assigned.forEach(function (id) {
    if (due) {
      remember(assignStation(ctx, [id], due, schedule));
    } else {
      // No block covers this moment: the server silently left such a location without the schedule.
      // The mock assigns the schedule and keeps the current station until a block starts.
      var loc = tx.get('locations', id);
      var prev = loc.schedule && loc.schedule !== schedule._id ? tx.get('schedules', loc.schedule) : null;
      if (prev) {
        prev.assignedLocations = (prev.assignedLocations || []).filter(function (x) { return x !== id; });
        tx.put('schedules', prev);
        remember({ locations: [], schedules: [prev] });
      }
      loc.schedule = schedule._id;
      stamp(loc, ctx.now());
      tx.put('locations', loc);
      remember({ locations: [loc], schedules: [] });
    }
  });
  collectDynamicStations(tx);
  // Schedules touched elsewhere must not keep this location either.
  return {
    locations: touchedLocations.map(function (l) { return locationFull(ctx, l); }),
    schedules: touchedSchedules.map(clone),
  };
}

// GET /v3/auth/schedule
export function getSchedules(ctx) {
  var tx = ctx.tx;
  var schedules = tx.all('schedules').filter(function (s) { return !s.isDeleted && s.company === ctx.company._id; });
  var blocks = [];
  schedules.forEach(function (s) {
    (s.scheduleBlocks || []).forEach(function (id) {
      var b = tx.get('scheduleBlocks', id);
      if (b) blocks.push(clone(b));
    });
  });
  return send('DATA_FOUND', { schedules: schedules.map(clone), scheduleBlocks: blocks }, 'Schedule');
}

// POST /v3/auth/schedule. On the free plan a second schedule is created inactive (and still applied,
// as on the server).
export function postSchedule(ctx) {
  var tx = ctx.tx, b = ctx.body || {};
  var count = tx.all('schedules').filter(function (s) { return !s.isDeleted && s.company === ctx.company._id; }).length;
  var schedule = Object.assign({ name: '', description: '' }, pick(b, ['name', 'description']), {
    _id: newId(ctx), company: ctx.company._id, scheduleBlocks: [], assignedLocations: Array.isArray(b.assignedLocations) ? b.assignedLocations.slice() : [],
    isActive: !!ctx.company.subscribed || count < 1, isDeleted: false,
  });
  stamp(schedule, ctx.now(), true);
  var created = [];
  (Array.isArray(b.scheduleBlocks) ? b.scheduleBlocks : []).forEach(function (input) {
    var block = Object.assign(pick(input, BLOCK_FIELDS), { _id: newId(ctx), isDeleted: false });
    block.station = createDynamicStation(ctx, schedule, block)._id;
    stamp(block, ctx.now(), true);
    tx.put('scheduleBlocks', block);
    schedule.scheduleBlocks.push(block._id);
    created.push(block);
  });
  tx.put('schedules', schedule);
  var result = applySchedule(ctx, schedule);
  return send('SUCCESSFUL_CREATE', {
    locations: result.locations, schedules: result.schedules, scheduleBlocks: created.map(function (bl) { return blockView(tx, bl, true); }),
  }, 'Schedule');
}

// PATCH /v3/auth/schedule/:id. Edited blocks get a new generated station. (The server could not add
// blocks here; a block without a known _id is added.)
export function patchSchedule(ctx) {
  var tx = ctx.tx, b = ctx.body || {};
  var schedule = tx.get('schedules', ctx.params.id);
  if (!schedule || schedule.isDeleted) return send('UNSUCCESSFUL_UPDATE', null, 'Schedule');
  Object.assign(schedule, pick(b, ['name', 'description', 'isActive']));
  if (Array.isArray(b.assignedLocations)) schedule.assignedLocations = b.assignedLocations.slice();
  var updated = [];
  (Array.isArray(b.scheduleBlocks) ? b.scheduleBlocks : []).forEach(function (input) {
    var block = input && input._id ? tx.get('scheduleBlocks', input._id) : null;
    if (!block) {
      block = { _id: newId(ctx), isDeleted: false };
      stamp(block, ctx.now(), true);
      schedule.scheduleBlocks.push(block._id);
    }
    Object.assign(block, pick(input, BLOCK_FIELDS));
    block.station = createDynamicStation(ctx, schedule, block)._id;
    stamp(block, ctx.now());
    tx.put('scheduleBlocks', block);
    updated.push(block);
  });
  stamp(schedule, ctx.now());
  tx.put('schedules', schedule);
  var result = applySchedule(ctx, schedule);
  return send('SUCCESSFUL_UPDATE', {
    locations: result.locations, schedules: result.schedules, scheduleBlocks: updated.map(function (bl) { return blockView(tx, bl, false); }),
  }, 'Schedule');
}

// DELETE /v3/auth/schedule/:id. Its locations keep their current station and queue (so players are not
// told anything), exactly like the server.
export function deleteSchedule(ctx) {
  var tx = ctx.tx;
  var schedule = tx.get('schedules', ctx.params.id);
  if (!schedule || schedule.isDeleted) return send('UNSUCCESSFUL_DELETE', null, 'Schedule');
  var locations = [];
  (schedule.assignedLocations || []).forEach(function (id) {
    var loc = tx.get('locations', id);
    if (!loc) return;
    loc.schedule = null;
    stamp(loc, ctx.now());
    tx.put('locations', loc);
    locations.push(loc);
  });
  blocksOf(tx, schedule).forEach(function (bl) {
    bl.isDeleted = true;
    tx.put('scheduleBlocks', bl);
  });
  schedule.assignedLocations = [];
  schedule.isDeleted = true;
  stamp(schedule, ctx.now());
  tx.put('schedules', schedule);
  collectDynamicStations(tx);
  return send('SUCCESSFUL_DELETE', { locations: locations.map(function (l) { return locationList(ctx, l); }) }, 'Schedule');
}
