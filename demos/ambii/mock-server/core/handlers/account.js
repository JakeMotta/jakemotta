// /v3/auth/jwt, /v3/auth/signup, /v3/auth/user*, /v3/auth/company
import { send } from '../envelope.js';
import { clone, pick, stamp, fullStateName } from '../util.js';
import { getStation, stationLite, locationFull } from '../music.js';
import { createLocation } from './locations.js';

export function userView(ctx, user) {
  var v = clone(user);
  v.company = clone(ctx.tx.get('companies', user.company));
  v.favorites = (user.favorites || []).map(function (id) { return stationLite(getStation(ctx.tx, id)); }).filter(Boolean);
  return v;
}

// GET /v3/auth/jwt: the dashboard's bootstrap. The demo owner is always signed in.
export function getJwt(ctx) {
  if (!ctx.user || ctx.user.isDeleted) return send('NO_USERS_FOUND');
  return send('DATA_FOUND', userView(ctx, ctx.user), 'User');
}

// POST /v3/auth/signup: the onboarding modal (only shown when the company has no name).
export function signup(ctx) {
  var b = ctx.body || {};
  var user = ctx.user, company = ctx.company;
  company.name = b.companyName || company.name;
  stamp(company, ctx.now());
  ctx.tx.put('companies', company);
  if (b.firstName !== undefined) user.firstName = b.firstName;
  if (b.lastName !== undefined) user.lastName = b.lastName;
  if (b.userPhoneNumber !== undefined) user.phoneNumber = b.userPhoneNumber;
  stamp(user, ctx.now());
  ctx.tx.put('users', user);
  var loc = createLocation(ctx, {
    name: b.locationName, addressLineOne: b.addressLineOne, addressLineTwo: b.addressLineTwo, city: b.city, state: b.state,
    postalCode: b.postalCode, phoneNumber: b.locationPhoneNumber, cords: Array.isArray(b.cords) ? b.cords : [],
  }, true);
  return send('SUCCESSFUL', { user: userView(ctx, user), locations: [locationFull(ctx, loc)] });
}

var USER_FIELDS = ['email', 'name', 'phoneNumber', 'firstName', 'lastName', 'role', 'favorites', 'assignedLocations'];

// PATCH /v3/auth/user/:id
export function patchUser(ctx) {
  var target = ctx.tx.get('users', ctx.params.id);
  if (!target || target.company !== ctx.company._id) return send('BAD_REQUEST');
  Object.assign(target, pick(ctx.body, USER_FIELDS));
  stamp(target, ctx.now());
  ctx.tx.put('users', target);
  return send('SUCCESSFUL_UPDATE', null, 'User');
}

// PATCH /v3/auth/user/favorite/:stationId
export function toggleFavorite(ctx) {
  var user = ctx.user, id = ctx.params.id;
  user.favorites = user.favorites || [];
  var i = user.favorites.indexOf(id), type;
  if (i >= 0) {
    user.favorites.splice(i, 1);
    type = 'remove';
  } else {
    user.favorites.push(id);
    type = 'add';
  }
  stamp(user, ctx.now());
  ctx.tx.put('users', user);
  return send('SUCCESSFUL_UPDATE', { type: type }, 'User');
}

var COMPANY_FIELDS = ['name', 'addressLineOne', 'addressLineTwo', 'city', 'country', 'postalCode', 'phoneNumber', 'state', 'businessType'];

// PATCH /v3/auth/company
export function patchCompany(ctx) {
  var company = ctx.company;
  var changes = pick(ctx.body, COMPANY_FIELDS);
  if (changes.state !== undefined) changes.state = fullStateName(changes.state);
  Object.assign(company, changes);
  stamp(company, ctx.now());
  ctx.tx.put('companies', company);
  return send('SUCCESSFUL_UPDATE', null, 'Company');
}

// GET /v3/auth/company (no client calls it)
export function getCompany(ctx) {
  return send('DATA_FOUND', clone(ctx.company), 'Company');
}
