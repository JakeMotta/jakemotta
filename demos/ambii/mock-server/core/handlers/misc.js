// /v3/api/log*, /v3/public/*
import { send } from '../envelope.js';
import { stamp, newId, validStatesList } from '../util.js';
import { MOBILE_MIN_VERSION } from '../../config.js';

// POST /v3/api/log/error: kept (the last 50) so a curious developer can look at them in localStorage.
export function logError(ctx) {
  var b = ctx.body || {};
  var doc = { _id: newId(ctx), kind: 'error', platform: b.platform, function: b.function, error: b.error, version: b.version, location: b.location, player: b.player };
  ctx.tx.put('logs', stamp(doc, ctx.now(), true));
  var all = ctx.tx.all('logs');
  if (all.length > 50) all.slice(0, all.length - 50).forEach(function (l) { ctx.tx.remove('logs', l._id); });
  return send('SUCCESSFUL');
}

// POST /v3/api/log (only sent by non-production builds of the mobile app)
export function log() {
  return send('SUCCESSFUL', {});
}

// GET /v3/public/mobile/version: no minimum, so the mobile app never asks to be updated.
export function mobileVersion() {
  return send('SUCCESSFUL', MOBILE_MIN_VERSION);
}

// GET /v3/public/valid-states
export function validStates() {
  return send('SUCCESSFUL', validStatesList());
}
