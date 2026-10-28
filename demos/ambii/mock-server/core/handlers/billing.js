// /v3/auth/billing-address*, /v3/auth/card*, /v3/auth/subscription, /v3/auth/invoice.
// Stripe is gone: nothing here is sent anywhere, and a card is only ever stored as brand + last four digits.
import { send, rawError } from '../envelope.js';
import { clone, pick, stamp, newId, randomToken, fullStateName } from '../util.js';
import { refreshAds } from '../music.js';
import { addInvoice } from '../seed.js';

var ADDRESS_FIELDS = ['addressName', 'addressLineOne', 'addressLineTwo', 'city', 'state', 'country', 'postalCode'];

function requireFields(body, fields) {
  for (var i = 0; i < fields.length; i++) {
    var v = body[fields[i]];
    if (v === undefined || v === null || v === '') return rawError(400, '"' + fields[i] + '" is required');
  }
  return null;
}

// GET /v3/auth/billing-address
export function getBillingAddresses(ctx) {
  var list = ctx.tx.all('billingAddresses').filter(function (a) { return !a.isDeleted && a.userId === ctx.user._id; }).map(clone);
  return send('DATA_FOUND', list, 'Billing Address');
}

// POST /v3/auth/billing-address
export function postBillingAddress(ctx) {
  var b = ctx.body || {};
  var bad = requireFields(b, ['addressLineOne', 'city', 'state', 'postalCode']);
  if (bad) return bad;
  var doc = Object.assign({ addressLineTwo: '' }, pick(b, ADDRESS_FIELDS), { _id: newId(ctx), userId: ctx.user._id, isDeleted: false });
  doc.state = fullStateName(doc.state);
  ctx.tx.put('billingAddresses', stamp(doc, ctx.now(), true));
  if (b.setAsDefault === true) {
    ctx.user.defaultBillingAddressId = doc._id;
    ctx.tx.put('users', ctx.user);
  }
  return send('SUCCESSFUL_CREATE', { billingAddressId: doc._id }, 'Billing Address');
}

// PATCH /v3/auth/billing-address/:id (the dashboard can send the id "undefined": answer success anyway)
export function patchBillingAddress(ctx) {
  var b = ctx.body || {};
  var doc = ctx.tx.get('billingAddresses', ctx.params.id);
  if (doc && doc.userId === ctx.user._id) {
    Object.assign(doc, pick(b, ADDRESS_FIELDS));
    if (doc.state) doc.state = fullStateName(doc.state);
    ctx.tx.put('billingAddresses', stamp(doc, ctx.now()));
    if (b.setAsDefault === true) {
      ctx.user.defaultBillingAddressId = doc._id;
      ctx.tx.put('users', ctx.user);
    }
  }
  return send('SUCCESSFUL_UPDATE', null, 'Billing Address');
}

// DELETE /v3/auth/billing-address/:id (no UI calls it)
export function deleteBillingAddress(ctx) {
  var doc = ctx.tx.get('billingAddresses', ctx.params.id);
  if (!doc || doc.isDeleted) return send('UNSUCCESSFUL_DELETE', null, 'Billing Address');
  doc.isDeleted = true;
  ctx.tx.put('billingAddresses', stamp(doc, ctx.now()));
  return send('SUCCESSFUL_DELETE', ctx.params.id, 'Billing Address');
}

function cardView(c) {
  return { cardId: c.cardId, nameOnCard: c.nameOnCard, brand: c.brand, cardNumber: c.cardNumber, expMonth: c.expMonth, expYear: c.expYear, cvc_check: c.cvc_check };
}

// GET /v3/auth/card
export function getCards(ctx) {
  var list = ctx.tx.all('cards').filter(function (c) { return !c.isDeleted && c.userId === ctx.user._id; }).map(cardView);
  if (!list.length) return send('NO_DATA_FOUND', null, 'Card');
  return send('DATA_FOUND', list, 'Card');
}

function brandFromNumber(digits) {
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'american express';
  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover';
  if (/^3(0|6|8)/.test(digits)) return 'diners club';
  if (/^35/.test(digits)) return 'jcb';
  return 'visa';
}

function saveCard(ctx, b) {
  var digits = String(b.cardNumber || '').replace(/\D/g, '');
  var brand = digits.length > 4 ? brandFromNumber(digits) : String(b.brand || 'visa').toLowerCase();
  var id = 'card_demo_' + randomToken(ctx.random, 12);
  var card = {
    _id: id, cardId: id, userId: ctx.user._id, nameOnCard: b.nameOnCard || [ctx.user.firstName, ctx.user.lastName].filter(Boolean).join(' '),
    brand: brand, cardNumber: digits.slice(-4) || '4242', expMonth: Number(b.expMonth) || 12, expYear: Number(b.expYear) || 2030, cvc_check: 'pass',
    isDeleted: false,
  };
  ctx.tx.put('cards', stamp(card, ctx.now(), true));
  if (b.setAsDefault !== false) {
    ctx.user.defaultPaymentMethodId = id;
    ctx.user.stripeCustomerId = ctx.user.stripeCustomerId || 'cus_demo';
    ctx.tx.put('users', ctx.user);
  }
  return card;
}

// POST /v3/auth/card: the demo's card form. Lenient (the server's Joi schema would reject the dashboard's
// own payload), and the full card comes back so the plan page can show it straight away.
export function postCard(ctx) {
  return send('SUCCESSFUL_CREATE', cardView(saveCard(ctx, ctx.body || {})), 'Card');
}

// POST /v3/auth/card/:paymentMethodId: the Stripe Elements path. The id is ignored; a demo Visa is stored.
export function postCardById(ctx) {
  var b = ctx.body || {};
  return send('SUCCESSFUL_CREATE', cardView(saveCard(ctx, { nameOnCard: b.nameOnCard, brand: 'visa', cardNumber: '4242', expMonth: 12, expYear: 2030 })), 'Card');
}

// DELETE /v3/auth/card/:id (no UI calls it)
export function deleteCard(ctx) {
  var card = ctx.tx.get('cards', ctx.params.id);
  if (!card || card.isDeleted) return send('NO_DATA_FOUND', null, 'Card');
  card.isDeleted = true;
  ctx.tx.put('cards', stamp(card, ctx.now()));
  return send('SUCCESSFUL_DELETE', ctx.params.id, 'Card');
}

function companyDocs(ctx, name) {
  return ctx.tx.all(name).filter(function (d) { return !d.isDeleted && d.company === ctx.company._id; });
}

// POST /v3/auth/subscription {cardId}: upgrade to Premium. Like the server, every location, schedule and
// announcement is activated. Queues lose their ads (players pick that up at their next track end). A refusal
// (no location, no card) changes nothing: the checks come before the activation (when they came after it, a free
// business that tried without a card was left with every store switched on).
export function subscribe(ctx) {
  if (ctx.company.subscribed) return send('ALREADY_SUBSCRIBED', {});
  var count = companyDocs(ctx, 'locations').length;
  if (count <= 0) return send('NO_LOCATIONS_FOUND', {});
  var hasCard = ctx.tx.all('cards').some(function (c) { return !c.isDeleted && c.userId === ctx.user._id; });
  if (!hasCard) return send('CARD_NOT_CONFIGURED', {}, 'User');
  ['locations', 'schedules', 'announcements'].forEach(function (name) {
    companyDocs(ctx, name).forEach(function (d) {
      if (!d.isActive) {
        d.isActive = true;
        ctx.tx.put(name, stamp(d, ctx.now()));
      }
    });
  });
  ctx.user.subscriptionId = 'sub_demo_' + randomToken(ctx.random, 10);
  ctx.tx.put('users', stamp(ctx.user, ctx.now()));
  ctx.company.subscribed = true;
  ctx.company.cancellationReason = null;
  ctx.company.cancellationDescription = '';
  ctx.tx.put('companies', stamp(ctx.company, ctx.now()));
  addInvoice(ctx.tx, ctx.now(), count, 'DEMO-' + randomToken(ctx.random, 6).toUpperCase(), { userId: ctx.user._id });
  companyDocs(ctx, 'locations').forEach(function (l) { refreshAds(ctx, l); });
  return send('STRIPE_USER_UPDATE_SUBSCRIPTION_SUCCESS', null, 'User');
}

// PATCH /v3/auth/subscription: cancel. One location, schedule and announcement stay active (the ones
// named in the body, else the first); the rest are deactivated, so their players are sent away at
// their next track end. Queues get ads again. A second cancel answers "no subscription" (no 500).
export function cancelSubscription(ctx) {
  var b = ctx.body || {};
  if (!ctx.company.subscribed && !ctx.user.subscriptionId) return send('STRIPE_USER_SUBSCRIPTION_NOT_FOUND', null, 'User');
  ctx.user.subscriptionId = null;
  ctx.tx.put('users', stamp(ctx.user, ctx.now()));
  ctx.company.subscribed = false;
  ctx.company.cancellationReason = b.cancellationReason || null;
  ctx.company.cancellationDescription = b.cancellationDescription || '';
  ctx.tx.put('companies', stamp(ctx.company, ctx.now()));
  [['locations', b.locationId], ['schedules', b.scheduleId], ['announcements', b.announcementId]].forEach(function (pair) {
    var docs = companyDocs(ctx, pair[0]);
    var keep = pair[1] ? pair[1] : docs.length > 1 ? docs[0]._id : null;
    if (!keep) return;
    docs.forEach(function (d) {
      if (d._id !== keep && d.isActive) {
        d.isActive = false;
        ctx.tx.put(pair[0], stamp(d, ctx.now()));
      }
    });
  });
  companyDocs(ctx, 'locations').forEach(function (l) { refreshAds(ctx, l); });
  return send('STRIPE_USER_CANCEL_SUBSCRIPTION_SUCCESS', null, 'User');
}

// GET /v3/auth/invoice. Each invoice's hosted_invoice_url is the demo's invoice page (invoice.html?id=),
// which the dashboard's Settings > Invoices opens in a new tab.
export function getInvoices(ctx) {
  var list = ctx.tx.all('invoices').filter(function (i) { return i.userId === ctx.user._id; })
    .sort(function (a, b) { return b.created - a.created; }).map(function (i) {
      var v = clone(i);
      delete v._id;
      delete v.userId;
      return v;
    });
  if (!list.length) return send('NO_DATA_FOUND', null, 'Invoice');
  return send('DATA_FOUND', list, 'Invoice');
}
