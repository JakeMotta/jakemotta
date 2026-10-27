// The demo company every visitor starts with. Fixed ids and store codes; only time-relative fields
// (createdAt, invoices, last-seen times, the "specific time" announcement) depend on when it is seeded.
// Bump SEED_VERSION in config.js after changing anything here.
import { CLIP_MEDIA } from './media-data.js';
import { STATION_IDS } from './catalogue.js';
import { fixedId, seededRandom, hash32, stamp } from './util.js';
import { assignStation, createDynamicStation, dueStationId } from './music.js';
import { SEED_VERSION, DEFAULT_STATION_ID } from '../config.js';

export var IDS = {
  company: fixedId('61b0c0', 1),
  user: fixedId('61b0e0', 1),
  downtown: fixedId('61b010', 1),
  market: fixedId('61b010', 2),
  airport: fixedId('61b010', 3),
  schedule: fixedId('61b030', 1),
  backOfficeIpad: fixedId('61b070', 1),
  billingAddress: fixedId('61b060', 1),
  card: 'card_demo_visa_4242',
};

function daysAgo(now, n) {
  return new Date(now.getTime() - n * 86400000);
}

function dated(doc, when) {
  stamp(doc, when, true);
  return doc;
}

export function seed(baseCtx) {
  var tx = baseCtx.tx;
  var now = baseCtx.now();
  var ctx = Object.assign({}, baseCtx, { random: seededRandom(20210904) });
  var created = daysAgo(now, 120);

  tx.wipe();

  // Company and user phones are digits only: the dashboard edits them in <input type="number">, which shows nothing
  // for "(408) 555-0100". (Location phones are a text input and keep their formatting.)
  tx.put('companies', dated({
    _id: IDS.company, name: 'Bean & Beat Coffee Co.', addressLineOne: '101 Espresso Way', addressLineTwo: '', city: 'San Jose', state: 'California',
    country: 'United States', postalCode: '95113', phoneNumber: '4085550100', cords: [], subscribed: true,
    adFreeUntil: daysAgo(now, 106).toISOString(), cancellationReason: null, cancellationDescription: '',
    businessType: 'cafe', // demo-only: the dashboard picks its station rows from it (the server had no such field)
    isDeleted: false,
  }, created));

  tx.put('users', dated({
    _id: IDS.user, email: 'owner@beanandbeat.example', name: 'Maya Rivera', firstName: 'Maya', lastName: 'Rivera', phoneNumber: '4085550101',
    company: IDS.company, role: 'owner', inviteCode: '', isVerified: true, favorites: [STATION_IDS.tapiocaTempo, STATION_IDS.midnightOil],
    assignedLocations: [IDS.downtown, IDS.market, IDS.airport], stripeCustomerId: 'cus_demo', productId: 'prod_demo', priceId: 'price_demo',
    subscriptionId: 'sub_demo', defaultPaymentMethodId: IDS.card, defaultBillingAddressId: IDS.billingAddress, isDeleted: false,
  }, created));

  var locations = [
    [IDS.downtown, 'Downtown Café', 'LBEAN7', '101 Espresso Way', 'San Jose', '95113', '(408) 555-0110', true, true],
    [IDS.market, 'Market Street Kiosk', 'LMKT42', '42 Market Street', 'San Jose', '95112', '(408) 555-0142', true, false],
    [IDS.airport, 'Airport Pop-up', 'LGATE3', 'Terminal B, Gate 3', 'San Jose', '95110', '(408) 555-0133', false, false],
  ];
  locations.forEach(function (l, i) {
    var zoneId = fixedId('61b020', i + 1);
    tx.put('zones', dated({
      _id: zoneId, name: l[1], location: l[0], company: IDS.company, zoneCode: ['ZK4P7Q', 'ZM8RTX', 'ZG3HWN'][i], isActive: false, isDeleted: false,
      explicitAllowed: false, schedule: null, trackSchedule: null, currentTrack: null, currentTrackNumber: 0, lastTrack: null, station: null,
      stationHistory: [], pairedDevice: null,
    }, created));
    tx.put('locations', dated({
      _id: l[0], name: l[1], storeCode: l[2], addressLineOne: l[3], addressLineTwo: '', city: l[4], state: 'California', country: 'United States',
      postalCode: l[5], phoneNumber: l[6], cords: [], company: IDS.company, businessType: 'Cafe', isActive: l[7], isDeleted: false,
      explicitAllowed: false, allowPlayerToChangeStation: l[8], station: null, schedule: null, trackSchedule: null, currentTrack: null,
      currentTrackNumber: 0, lastTrack: null, stationHistory: [], pairedDevice: null, zones: [zoneId], subscription: null,
    }, daysAgo(now, 120 - i * 20)));
  });

  assignStation(ctx, [IDS.downtown], STATION_IDS.morningPourOver, null, [fixedId('61b090', 1)]);
  assignStation(ctx, [IDS.airport], DEFAULT_STATION_ID, null, [fixedId('61b090', 3)]);

  // "Café Day" on the kiosk: four day-part blocks, each with its generated station.
  var schedule = dated({
    _id: IDS.schedule, company: IDS.company, name: 'Café Day', description: 'Mellow mornings, poppy afternoons, slow evenings.',
    scheduleBlocks: [], assignedLocations: [IDS.market], isActive: true, isDeleted: false,
  }, daysAgo(now, 60));
  var allDays = [0, 1, 2, 3, 4, 5, 6];
  var blocks = [
    ['Morning', 21600, 43200, { jazz: 100, folk: 100 }, { min: 0, max: 110, selected: 0, name: 'Slower' }],
    ['Afternoon', 43200, 64800, { pop: 100, 'soul & funk': 100 }, { min: 121, max: 127, selected: 2, name: 'Moderate' }],
    ['Evening', 64800, 86400, { jazz: 100, 'r&b': 100 }, { min: 111, max: 120, selected: 1, name: 'Slow' }],
    ['Late Night', 0, 21600, { electro: 100, dance: 100 }, { min: 128, max: 140, selected: 3, name: 'Fast' }],
  ];
  blocks.forEach(function (b, i) {
    var block = { _id: fixedId('61b040', i + 1), name: b[0], startTime: b[1], endTime: b[2], days: allDays.slice(), genres: b[3], tempo: b[4], isDeleted: false };
    block.hash = hash32(JSON.stringify([b[0], b[1], b[2], b[3], b[4]]));
    block.station = createDynamicStation(ctx, schedule, block, fixedId('61b080', i + 1))._id;
    tx.put('scheduleBlocks', dated(block, daysAgo(now, 60)));
    schedule.scheduleBlocks.push(block._id);
  });
  tx.put('schedules', schedule);
  assignStation(ctx, [IDS.market], dueStationId(tx, schedule, now) || DEFAULT_STATION_ID, schedule, [fixedId('61b090', 2)]);

  // An iPad in the back office was the kiosk's player and was left paired: the web player or the mobile app
  // connecting to LMKT42 gets the "play on this device instead?" prompt.
  tx.put('players', dated({
    _id: IDS.backOfficeIpad, deviceId: 'ios-BACKOFFICE01', deviceName: 'Back Office iPad', deviceBrand: 'Apple', deviceToken: 'none',
    utc_offset: now.getTimezoneOffset(), lastActive: daysAgo(now, 2).toISOString(), isPlaying: false, locationHistory: {}, isDeleted: false,
  }, daysAgo(now, 59)));
  var market = tx.get('locations', IDS.market);
  market.pairedDevice = IDS.backOfficeIpad;
  tx.get('players', IDS.backOfficeIpad).locationHistory[IDS.market] = true;
  tx.put('locations', market);

  // Announcements. Seeded TTS ones have pre-rendered audio (Windows SAPI voices standing in for Google Wavenet).
  var closing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 45, 0);
  var weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var isms = [
    { _id: fixedId('61b050', 1), title: 'Happy Hour', clip: 'happy-hour', voice: 'en-US-Wavenet-F', frequency: '15', specifiedTimes: [], assignedLocations: [IDS.downtown, IDS.market], backgroundMusic: 2 },
    { _id: fixedId('61b050', 2), title: 'Closing Soon', clip: 'closing-soon', voice: 'en-US-Wavenet-D', frequency: 'specific time', assignedLocations: [IDS.downtown], backgroundMusic: 2,
      specifiedTimes: [{ days: weekdays, time: { selectedTime: closing.toTimeString(), unixTimeStamp: Math.floor(closing.getTime() / 1000) }, hash: hash32(Math.floor(closing.getTime() / 1000) + weekdays.join('')) }] },
    { _id: fixedId('61b050', 3), title: 'Loyalty Card Promo', clip: 'loyalty-card', uploaded: true, fileName: 'loyalty-card-promo.mp3', frequency: '60', specifiedTimes: [], assignedLocations: [IDS.market], backgroundMusic: 1 },
    { _id: fixedId('61b050', 4), title: 'Holiday Hours', clip: 'holiday-hours', voice: 'en-US-Wavenet-B', frequency: '0', specifiedTimes: [], assignedLocations: [], backgroundMusic: 2 },
  ];
  isms.forEach(function (m, i) {
    var clip = CLIP_MEDIA[m.clip];
    var doc = {
      _id: m._id, company: IDS.company, title: m.title, message: m.uploaded ? '' : clip.text, description: '', voice: m.uploaded ? '' : m.voice,
      language: m.uploaded ? '' : 'en-US', speed: 1, frequency: m.frequency, backgroundMusic: m.backgroundMusic, specifiedTimes: m.specifiedTimes,
      uploaded: !!m.uploaded, duration: clip.duration, url: clip.url, isActive: true, isDeleted: false, assignedLocations: m.assignedLocations,
    };
    if (m.uploaded) doc.fileName = m.fileName;
    tx.put('announcements', dated(doc, daysAgo(now, 50 - i * 10)));
  });

  tx.put('billingAddresses', dated({
    _id: IDS.billingAddress, userId: IDS.user, addressName: 'Head Office', addressLineOne: '101 Espresso Way', addressLineTwo: 'Suite 2',
    city: 'San Jose', state: 'California', country: 'United States', postalCode: '95113', isDeleted: false,
  }, created));

  // Only what the dashboard shows; no card number beyond the last four digits is ever stored.
  tx.put('cards', dated({
    _id: IDS.card, cardId: IDS.card, userId: IDS.user, nameOnCard: 'Maya Rivera', brand: 'visa', cardNumber: '4242', expMonth: 12, expYear: 2030,
    cvc_check: 'pass', isDeleted: false,
  }, created));

  for (var k = 3; k >= 1; k--) addInvoice(tx, daysAgo(now, k * 30), 2, 'DEMO-000' + (4 - k));

  tx.setMeta({ seedVersion: SEED_VERSION, seededAt: now.toISOString() });
}

// A paid monthly invoice, shaped like the Stripe invoice objects the server passed through, plus createdAt.
export function addInvoice(tx, when, activeLocations, number) {
  var total = 1600 * Math.max(1, activeLocations);
  var created = Math.floor(when.getTime() / 1000);
  var id = 'in_demo_' + number.replace(/\W/g, '').toLowerCase();
  tx.put('invoices', {
    _id: id, id: id, object: 'invoice', number: number, status: 'paid', currency: 'usd', total: total, subtotal: total, amount_due: total,
    amount_paid: total, created: created, createdAt: when.toISOString(), period_start: created - 30 * 86400, period_end: created,
    customer_email: 'owner@beanandbeat.example', hosted_invoice_url: null, invoice_pdf: null, userId: IDS.user,
    lines: { object: 'list', data: [{ description: activeLocations + ' × Ambii Premium location (monthly)', amount: total, quantity: activeLocations }] },
  });
}
