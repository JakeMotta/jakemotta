// /v3/auth/jwt, /v3/auth/signup, /v3/auth/user*, /v3/auth/company
import { send } from '../envelope.js';
import { clone, pick, stamp, fullStateName, fixedId } from '../util.js';
import { getStation, stationLite, locationFull } from '../music.js';
import { createLocation } from './locations.js';

export function userView(ctx, user) {
  var v = clone(user);
  v.company = clone(ctx.tx.get('companies', user.company));
  v.favorites = (user.favorites || []).map(function (id) { return stationLite(getStation(ctx.tx, id)); }).filter(Boolean);
  return v;
}

// The dashboard's sign-in stand-in (its Auth0Helper) stores one of these and sends it as "Authorization: Bearer <token>".
// Sign In stores the owner's; a signed-out visitor's Favorite (Auth0 sign-up in the original) stores the new business's.
export var DEMO_TOKENS = { owner: 'ambii-demo-owner', newBusiness: 'ambii-demo-newbiz' };
export var NEW_BUSINESS_IDS = { company: fixedId('61c0c0', 1), user: fixedId('61c0e0', 1) };

// The user a dashboard token names, or null for the seeded owner (no token, the owner's, or any other). The new
// business is created on first use, as the server's createUserIfNonExistent did at a first Auth0 sign-in: an owner
// with no names, and a company with no name (which opens the dashboard's "Let's set up your first location!"
// modal), on the free plan, with no locations and no businessType (so the dashboard shows the restaurant rows, as it
// did for every real customer). It lives beside the seeded company in the same storage, so Reset demo and a reseed
// clear it, and players connect to its store codes like any other.
export function userForToken(ctx, token) {
  if (token !== DEMO_TOKENS.newBusiness) return null;
  var tx = ctx.tx, now = ctx.now();
  var user = tx.get('users', NEW_BUSINESS_IDS.user);
  if (user && !user.isDeleted && tx.get('companies', user.company)) return user;
  tx.put('companies', stamp({
    _id: NEW_BUSINESS_IDS.company, name: '', addressLineOne: '', addressLineTwo: '', city: '', state: '', country: 'United States', postalCode: '',
    phoneNumber: '', cords: [], subscribed: false, adFreeUntil: new Date(now.getTime() + 14 * 86400000).toISOString(), cancellationReason: null,
    cancellationDescription: '', isDeleted: false,
  }, now, true));
  user = stamp({
    _id: NEW_BUSINESS_IDS.user, email: 'you@new-business.example', name: '', phoneNumber: '', firstName: '', lastName: '',
    company: NEW_BUSINESS_IDS.company, role: 'owner', inviteCode: '', isVerified: false, favorites: [], assignedLocations: [],
    stripeCustomerId: '', productId: '', priceId: '', subscriptionId: '', defaultPaymentMethodId: null, defaultBillingAddressId: null,
    isDeleted: false,
  }, now, true);
  tx.put('users', user);
  return user;
}

// GET /v3/auth/jwt: the dashboard's bootstrap: the user its token names (the demo owner unless it started a business).
export function getJwt(ctx) {
  if (!ctx.user || ctx.user.isDeleted) return send('NO_USERS_FOUND');
  return send('DATA_FOUND', userView(ctx, ctx.user), 'User');
}

// POST /v3/auth/signup: the onboarding modal (only shown when the company has no name: the business a visitor starts).
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
