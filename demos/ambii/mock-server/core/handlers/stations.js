// /v3/api/station*
import { send, rawError } from '../envelope.js';
import { clone } from '../util.js';
import { STATIONS } from '../catalogue.js';
import { getStation, stationLite, stationDetail, assignStation, locationFull } from '../music.js';

// GET /v3/api/station[?page=n]. Without a page: every static station (the dashboard). With one: 15 per
// page starting at page 1 (the web player starts at page=1; the server's page*15 gave it nothing).
export function listStations(ctx) {
  var list = Object.keys(STATIONS).map(function (id) { return STATIONS[id]; }).filter(function (s) { return !s.isDeleted && s.type === 'static'; });
  var limit = parseInt(ctx.query.limit, 10);
  if (limit > 0) list = list.slice(0, limit);
  if (ctx.query.page !== undefined && ctx.query.page !== '') {
    var page = Math.max(1, parseInt(ctx.query.page, 10) || 1);
    list = list.slice((page - 1) * 15, page * 15);
  }
  return send('SUCCESSFUL', list.map(stationLite));
}

// GET /v3/api/station/:id (the dashboard's station preview)
export function getStationDetail(ctx) {
  var st = getStation(ctx.tx, ctx.params.id);
  if (!st || st.isDeleted) return send('REQUIRED_DATA_NOT_FOUND');
  return send('SUCCESSFUL', stationDetail(st));
}

// POST /v3/api/station/:id {locations:[...]}: the dashboard's "Assign", or the web player's side menu
// (player JWT; then the location must allow players to change station). Assigning a station removes the
// location's schedule and builds a new queue, which players pick up at their next track end.
export function postAssignStation(ctx) {
  var tx = ctx.tx, b = ctx.body || {};
  if (!Array.isArray(b.locations)) return rawError(500, "No 'locations' list found");
  var companyId = ctx.companyId;
  var found = tx.all('locations').filter(function (l) { return b.locations.indexOf(l._id) >= 0 && l.company === companyId; });
  if (found.length !== b.locations.length) return send('INCOMPLETE_REQUEST');
  if (ctx.playerAuth && found[0] && !found[0].allowPlayerToChangeStation) return send('INSUFFICIENT_PRIVILEGES');
  if (!getStation(tx, ctx.params.id)) return send('REQUIRED_DATA_NOT_FOUND', null, 'Station');
  var result = assignStation(ctx, b.locations, ctx.params.id, null);
  if (!result.locations.length) return send('NO_LOCATIONS_FOUND', null, 'Station');
  return send('STATION_ASSIGN_SUCCESSFUL', {
    locations: result.locations.map(function (l) { return locationFull(ctx, l); }),
    schedules: result.schedules.map(clone),
  }, 'Station');
}
