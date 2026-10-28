// The demo company every visitor starts with. Fixed ids and store codes; only time-relative fields
// (createdAt, invoices, last-seen times, queue start times, the "specific time" announcements) depend on when
// it is seeded. Bump SEED_VERSION in config.js after changing anything here.
import { CLIP_MEDIA } from './media-data.js';
import { STATION_IDS } from './catalogue.js';
import { fixedId, seededRandom, hash32, stamp } from './util.js';
import { assignStation, createDynamicStation, dueStationId } from './music.js';
import { ttsUrl, spokenSeconds } from './handlers/announcements.js';
import { SEED_VERSION, DEFAULT_STATION_ID, INVOICE_PAGE_URL } from '../config.js';

export var IDS = {
  company: fixedId('61b0c0', 1),
  user: fixedId('61b0e0', 1),
  downtown: fixedId('61b010', 1),
  market: fixedId('61b010', 2),
  airport: fixedId('61b010', 3),
  jackLondon: fixedId('61b010', 4),
  paloAlto: fixedId('61b010', 5),
  santaCruz: fixedId('61b010', 6),
  castro: fixedId('61b010', 7),
  schedule: fixedId('61b030', 1), // "Café Day"
  brunch: fixedId('61b030', 2), // "Weekend Brunch"
  nightOwl: fixedId('61b030', 3), // "Night Owl"
  backOfficeIpad: fixedId('61b070', 1),
  welcome: fixedId('61b050', 5),
  billingAddress: fixedId('61b060', 1),
  card: 'card_demo_visa_4242',
};

var DAY = 86400000;
var DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
var WEEKENDS = [0, 6];

// The dashboard's tempo bands (constants/tempos.js), as a block stores them.
var TEMPO = {
  slower: { min: 0, max: 110, selected: 0, name: 'Slower' },
  slow: { min: 111, max: 120, selected: 1, name: 'Slow' },
  moderate: { min: 121, max: 127, selected: 2, name: 'Moderate' },
  fast: { min: 128, max: 140, selected: 3, name: 'Fast' },
  faster: { min: 141, max: 900, selected: 4, name: 'Faster' },
};

function daysAgo(now, n) {
  return new Date(now.getTime() - n * DAY);
}

// The same day of the month n months later (or earlier), clamped to the month's last day.
export function addMonths(date, n) {
  var d = new Date(date.getTime());
  var day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return d;
}

function dated(doc, when) {
  stamp(doc, when, true);
  return doc;
}

function pad4(n) {
  return ('000' + n).slice(-4);
}

// One "specific time" entry, shaped like the dashboard's (components/announcement-form): the time as
// toTimeString() (players read its first five characters, local time), its unix time, and a hash of both.
export function specifiedTime(date, days) {
  var unix = Math.floor(date.getTime() / 1000);
  return { days: days.slice(), time: { selectedTime: date.toTimeString(), unixTimeStamp: unix }, hash: hash32(unix + days.join('')) };
}

// The "Welcome" announcement's time: the next whole minute plus two, on the day that falls on. Players
// queue announcements only on whole minutes, so a visit of two or three minutes hears it once. player.js
// connect moves it again at every connect (see IDS.welcome and the demoAutoTime field).
export function welcomeTime(now) {
  var t = new Date(now.getTime());
  t.setSeconds(0, 0);
  t = new Date(t.getTime() + 3 * 60000);
  return specifiedTime(t, [DAY_NAMES[t.getDay()]]);
}

// The stores, in the order the dashboard lists them. `opened`/`closed` are days ago (null: the company's
// first day / still open); they date the documents and decide what each month's invoice bills. `plays` is
// a station, or a schedule with the station it keeps while no block is due. `player` is the store's
// simulated in-store player (demo only, see music.js): a store without one shows Offline until a real
// player connects. Store codes follow the server's format: L and five of ABCDEFGHJKMNPQRSTUVWXYZ23456789.
var STORES = [
  {
    id: IDS.downtown, name: 'Downtown Café', code: 'LBEAN7', zone: 'ZK4P7Q', address: '101 Espresso Way', city: 'San Jose', postalCode: '95113',
    phone: '(408) 555-0110', opened: null, allowChange: true, station: STATION_IDS.morningPourOver,
    // No player: the hub's "Play a store" link connects here without the take-over prompt.
  },
  {
    id: IDS.market, name: 'Market Street Kiosk', code: 'LMKT42', zone: 'ZM8RTX', address: '42 Market Street', city: 'San Jose', postalCode: '95112',
    phone: '(408) 555-0142', opened: 300, schedule: IDS.schedule, station: DEFAULT_STATION_ID,
    player: { n: 1, deviceId: 'ios-BACKOFFICE01', deviceName: 'Back Office iPad', deviceBrand: 'Apple', since: 59, minutesIn: 23 },
  },
  {
    id: IDS.airport, name: 'Airport Pop-up', code: 'LGATE3', zone: 'ZG3HWN', address: 'Terminal B, Gate 3', city: 'San Jose', postalCode: '95110',
    phone: '(408) 555-0133', opened: 230, closed: 75, station: DEFAULT_STATION_ID, // a seasonal pop-up, switched off since
  },
  {
    id: IDS.jackLondon, name: 'Jack London Square', code: 'LJACK5', zone: 'ZJ5KDW', address: '55 Water Street', city: 'Oakland', postalCode: '94607',
    phone: '(510) 555-0155', opened: 190, schedule: IDS.nightOwl, station: STATION_IDS.espressoShot, explicitAllowed: true,
    player: { n: 2, deviceId: 'ios-JACKLONDON01', deviceName: 'Bar iPad', deviceBrand: 'Apple', since: 188, minutesIn: 41 },
  },
  {
    id: IDS.paloAlto, name: 'Palo Alto Roastery', code: 'LPAVE8', zone: 'ZP8VNC', address: '480 University Avenue', city: 'Palo Alto', postalCode: '94301',
    phone: '(650) 555-0148', opened: 130, schedule: IDS.brunch, station: STATION_IDS.tapiocaTempo, allowChange: true,
    player: { n: 3, deviceId: 'android-PALOALTO01', deviceName: 'Galaxy Tab A7', deviceBrand: 'samsung', since: 128, minutesIn: 9 },
  },
  {
    id: IDS.santaCruz, name: 'Santa Cruz Surf Shack', code: 'LSURF8', zone: 'ZS2RFH', address: '1110 Pacific Avenue', city: 'Santa Cruz', postalCode: '95060',
    phone: '(831) 555-0186', opened: 70, schedule: IDS.brunch, station: STATION_IDS.saturdayRush,
    player: { n: 4, deviceId: 'android-SANTACRUZ01', deviceName: 'Lenovo Tab M10', deviceBrand: 'Lenovo', since: 69, minutesIn: 57 },
  },
  {
    // The newest store, its player not set up yet: on a schedule with no device paired, so the web player
    // shows the schedule row and its day parts without the take-over prompt.
    id: IDS.castro, name: 'Castro Street Café', code: 'LCSTR6', zone: 'ZC6TMB', address: '230 Castro Street', city: 'Mountain View', postalCode: '94041',
    phone: '(650) 555-0162', opened: 18, schedule: IDS.nightOwl, station: STATION_IDS.espressoShot,
  },
];

// Day-part schedules: [name, start, end (seconds of the day; an end before the start runs past midnight),
// days (0 = Sunday), genres, tempo]. Each block gets a generated station (music.js createDynamicStation).
var SCHEDULES = [
  {
    id: IDS.schedule, name: 'Café Day', description: 'Mellow mornings, poppy afternoons, slow evenings.', created: 60, firstBlock: 1,
    blocks: [
      ['Morning', 21600, 43200, ALL_DAYS, { jazz: 100, folk: 100 }, TEMPO.slower],
      ['Afternoon', 43200, 64800, ALL_DAYS, { pop: 100, 'soul & funk': 100 }, TEMPO.slow],
      ['Evening', 64800, 86400, ALL_DAYS, { jazz: 100, 'r&b': 100 }, TEMPO.slower],
      ['Late Night', 0, 21600, ALL_DAYS, { electro: 100, dance: 100 }, TEMPO.fast],
    ],
  },
  {
    id: IDS.brunch, name: 'Weekend Brunch', description: 'Easy brunch grooves on Saturdays and Sundays.', created: 125, firstBlock: 5,
    blocks: [
      ['Brunch', 28800, 46800, WEEKENDS, { jazz: 100, 'soul & funk': 100, folk: 100 }, TEMPO.slow],
      ['Weekend Afternoon', 46800, 64800, WEEKENDS, { pop: 100, 'r&b': 100, country: 100 }, TEMPO.faster],
    ],
  },
  {
    id: IDS.nightOwl, name: 'Night Owl', description: 'Easy days, a lively happy hour and a late-night set.', created: 185, firstBlock: 7,
    blocks: [
      ['Daytime', 25200, 57600, ALL_DAYS, { pop: 100, folk: 100, alternative: 100 }, TEMPO.moderate],
      ['Happy Hour', 57600, 68400, ALL_DAYS, { 'soul & funk': 100, 'r&b': 100, dance: 100 }, TEMPO.slow],
      ['Evening', 68400, 79200, ALL_DAYS, { jazz: 100, blues: 100, 'r&b': 100 }, TEMPO.slow],
      ['Late Night', 79200, 7200, ALL_DAYS, { electro: 100, dance: 100, 'rap/hip hop': 100 }, TEMPO.slower],
    ],
  },
];

export function seed(baseCtx) {
  var tx = baseCtx.tx;
  var now = baseCtx.now();
  var ctx = Object.assign({}, baseCtx, { random: seededRandom(20210904) });

  // Monthly billing: the newest invoice was finalized two hours ago, the first one twelve months before it,
  // when the 14-day trial (adFreeUntil) ended. The company is about 12½ months old.
  var newestInvoice = new Date(now.getTime() - 2 * 3600000);
  var subscribed = addMonths(newestInvoice, -12);
  var created = new Date(subscribed.getTime() - 14 * DAY);
  function openedAt(s) {
    return s.opened ? daysAgo(now, s.opened) : created;
  }
  function openOn(s, when) {
    return openedAt(s).getTime() <= when.getTime() && !(s.closed && daysAgo(now, s.closed).getTime() <= when.getTime());
  }

  tx.wipe();

  // Company and user phones are digits only: the dashboard edits them in <input type="number">, which shows nothing
  // for "(408) 555-0100". (Location phones are a text input and keep their formatting.)
  tx.put('companies', dated({
    _id: IDS.company, name: 'Bean & Beat Coffee Co.', addressLineOne: '101 Espresso Way', addressLineTwo: '', city: 'San Jose', state: 'California',
    country: 'United States', postalCode: '95113', phoneNumber: '4085550100', cords: [], subscribed: true,
    adFreeUntil: subscribed.toISOString(), cancellationReason: null, cancellationDescription: '',
    businessType: 'cafe', // demo-only: the dashboard picks its station rows from it (the server had no such field)
    isDeleted: false,
  }, created));

  tx.put('users', dated({
    _id: IDS.user, email: 'owner@beanandbeat.example', name: 'Maya Rivera', firstName: 'Maya', lastName: 'Rivera', phoneNumber: '4085550101',
    company: IDS.company, role: 'owner', inviteCode: '', isVerified: true, favorites: [STATION_IDS.tapiocaTempo, STATION_IDS.midnightOil],
    assignedLocations: STORES.map(function (s) { return s.id; }), stripeCustomerId: 'cus_demo', productId: 'prod_demo', priceId: 'price_demo',
    subscriptionId: 'sub_demo', defaultPaymentMethodId: IDS.card, defaultBillingAddressId: IDS.billingAddress, isDeleted: false,
  }, created));

  STORES.forEach(function (s, i) {
    var zoneId = fixedId('61b020', i + 1);
    tx.put('zones', dated({
      _id: zoneId, name: s.name, location: s.id, company: IDS.company, zoneCode: s.zone, isActive: false, isDeleted: false,
      explicitAllowed: false, schedule: null, trackSchedule: null, currentTrack: null, currentTrackNumber: 0, lastTrack: null, station: null,
      stationHistory: [], pairedDevice: null,
    }, openedAt(s)));
    tx.put('locations', dated({
      _id: s.id, name: s.name, storeCode: s.code, addressLineOne: s.address, addressLineTwo: '', city: s.city, state: 'California',
      country: 'United States', postalCode: s.postalCode, phoneNumber: s.phone, cords: [], company: IDS.company, businessType: 'Cafe',
      isActive: !s.closed, isDeleted: false, explicitAllowed: !!s.explicitAllowed, allowPlayerToChangeStation: !!s.allowChange, station: null,
      schedule: null, trackSchedule: null, currentTrack: null, currentTrackNumber: 0, lastTrack: null, stationHistory: [], pairedDevice: null,
      zones: [zoneId], subscription: null,
    }, openedAt(s)));
  });

  // Schedules, each block with its generated station (fixed ids: block n is 61b040…n, its station 61b080…n).
  var schedules = {};
  SCHEDULES.forEach(function (def) {
    var when = daysAgo(now, def.created);
    var schedule = dated({
      _id: def.id, company: IDS.company, name: def.name, description: def.description, scheduleBlocks: [],
      assignedLocations: STORES.filter(function (s) { return s.schedule === def.id; }).map(function (s) { return s.id; }), isActive: true, isDeleted: false,
    }, when);
    def.blocks.forEach(function (b, i) {
      var n = def.firstBlock + i;
      var block = { _id: fixedId('61b040', n), name: b[0], startTime: b[1], endTime: b[2], days: b[3].slice(), genres: b[4], tempo: b[5], isDeleted: false };
      block.hash = hash32(JSON.stringify(b));
      block.station = createDynamicStation(ctx, schedule, block, fixedId('61b080', n))._id;
      tx.put('scheduleBlocks', dated(block, when));
      schedule.scheduleBlocks.push(block._id);
    });
    tx.put('schedules', schedule);
    schedules[def.id] = schedule;
  });

  // What each store plays (queue n is 61b090…n). A scheduled store gets the block due now, or keeps its own
  // station while no block is (Weekend Brunch on a weekday).
  STORES.forEach(function (s, i) {
    var schedule = s.schedule ? schedules[s.schedule] : null;
    var stationId = (schedule && dueStationId(tx, schedule, now)) || s.station;
    assignStation(ctx, [s.id], stationId, schedule, [fixedId('61b090', i + 1)]);
  });

  // The simulated in-store players (demo only): each store's tablet has been playing for a while, so the
  // stores are at different points of their queues on a first visit. A real player connecting to one of
  // these stores gets the "play on this device instead?" prompt, and replaces it.
  STORES.forEach(function (s) {
    if (!s.player) return;
    var p = s.player;
    var player = dated({
      _id: fixedId('61b070', p.n), deviceId: p.deviceId, deviceName: p.deviceName, deviceBrand: p.deviceBrand, deviceToken: 'none',
      utc_offset: now.getTimezoneOffset(), lastActive: now.toISOString(), isPlaying: true, locationHistory: {}, isDeleted: false,
      simulated: true, // demo-only: see music.js "simulated in-store players"
    }, daysAgo(now, p.since));
    player.locationHistory[s.id] = true;
    tx.put('players', player);
    var loc = tx.get('locations', s.id);
    loc.pairedDevice = player._id;
    tx.put('locations', loc);
    var ts = tx.get('trackSchedules', loc.trackSchedule);
    ts.createdAt = new Date(now.getTime() - p.minutesIn * 60000).toISOString();
    tx.put('trackSchedules', ts);
  });

  // Announcements. Seeded TTS ones have pre-rendered audio (Windows SAPI voices standing in for Google Wavenet).
  // "Welcome" plays its pre-rendered "welcome" clip; without one in media-data.js the browser speaks the same words.
  var closing = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 45, 0);
  var welcomeClip = CLIP_MEDIA.welcome || {
    url: ttsUrl(IDS.welcome), tts: true,
    text: "Welcome to Bean & Beat! We're so glad you stopped in. Our baristas are pulling fresh shots all day, so ask about today's single-origin pour-over, and make yourself at home.",
  };
  var welcome = welcomeTime(now);
  var isms = [
    { _id: fixedId('61b050', 1), title: 'Happy Hour', clip: CLIP_MEDIA['happy-hour'], voice: 'en-US-Wavenet-F', frequency: '15', specifiedTimes: [],
      assignedLocations: [IDS.downtown, IDS.market, IDS.jackLondon, IDS.paloAlto], backgroundMusic: 2, created: 50 },
    { _id: fixedId('61b050', 2), title: 'Closing Soon', clip: CLIP_MEDIA['closing-soon'], voice: 'en-US-Wavenet-D', frequency: 'specific time',
      assignedLocations: [IDS.downtown, IDS.paloAlto, IDS.santaCruz], backgroundMusic: 2, created: 40,
      specifiedTimes: [specifiedTime(closing, ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])] },
    { _id: fixedId('61b050', 3), title: 'Loyalty Card Promo', clip: CLIP_MEDIA['loyalty-card'], uploaded: true, fileName: 'loyalty-card-promo.mp3', frequency: '60',
      specifiedTimes: [], assignedLocations: [IDS.market, IDS.santaCruz, IDS.castro], backgroundMusic: 1, created: 30 },
    { _id: fixedId('61b050', 4), title: 'Holiday Hours', clip: CLIP_MEDIA['holiday-hours'], voice: 'en-US-Wavenet-B', frequency: '0', specifiedTimes: [],
      assignedLocations: [], backgroundMusic: 2, created: 20 },
    // Demo-only behaviour: player.js connect moves its time to just after each connect while demoAutoTime
    // still matches it (an edit in the dashboard stops that).
    { _id: IDS.welcome, title: 'Welcome', clip: welcomeClip, voice: 'en-US-Wavenet-C', frequency: 'specific time', specifiedTimes: [welcome],
      assignedLocations: [IDS.downtown], backgroundMusic: 2, created: 3, demoAutoTime: welcome.time.unixTimeStamp },
  ];
  isms.forEach(function (m) {
    var clip = m.clip;
    var doc = {
      _id: m._id, company: IDS.company, title: m.title, message: m.uploaded ? '' : clip.text, description: '', voice: m.uploaded ? '' : m.voice,
      language: m.uploaded ? '' : 'en-US', speed: 1, frequency: m.frequency, backgroundMusic: m.backgroundMusic, specifiedTimes: m.specifiedTimes,
      uploaded: !!m.uploaded, duration: clip.tts ? spokenSeconds(clip.text, 1, m.backgroundMusic) : clip.duration, url: clip.url, isActive: true, isDeleted: false,
      assignedLocations: m.assignedLocations,
    };
    if (m.uploaded) doc.fileName = m.fileName;
    if (m.demoAutoTime) doc.demoAutoTime = m.demoAutoTime;
    tx.put('announcements', dated(doc, daysAgo(now, m.created)));
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

  // One invoice a month since the subscription began, $16 for each store that was open on the day; the
  // newest is still "open" (finalized, payment pending), so the dashboard shows its red dot.
  for (var m = 0; m <= 12; m++) {
    var when = addMonths(newestInvoice, m - 12);
    var open = STORES.filter(function (s) { return openOn(s, when); }).length;
    addInvoice(tx, when, open, 'DEMO-' + pad4(m + 1), { status: m === 12 ? 'open' : 'paid' });
  }

  tx.setMeta({ seedVersion: SEED_VERSION, seededAt: now.toISOString() });
}

// A monthly invoice, shaped like the Stripe invoice objects the server passed through (with the customer
// details Stripe copies onto an invoice when it is finalized), plus createdAt. hosted_invoice_url is the
// demo's own invoice page, which reads the invoice from localStorage. options: status ('paid', the
// default, or 'open'), userId (default: the seeded owner).
export function addInvoice(tx, when, activeLocations, number, options) {
  var opts = options || {};
  var quantity = Math.max(1, activeLocations);
  var unit = 1600, total = unit * quantity;
  var paid = opts.status !== 'open';
  var created = Math.floor(when.getTime() / 1000);
  var periodEnd = Math.floor(addMonths(when, 1).getTime() / 1000);
  var id = 'in_demo_' + number.replace(/\W/g, '').toLowerCase();
  var user = tx.get('users', opts.userId || IDS.user);
  var company = user ? tx.get('companies', user.company) : null;
  var address = user ? tx.get('billingAddresses', user.defaultBillingAddressId) : null;
  var card = user ? tx.get('cards', user.defaultPaymentMethodId) : null;
  tx.put('invoices', {
    _id: id, id: id, object: 'invoice', number: number, status: paid ? 'paid' : 'open', paid: paid, currency: 'usd',
    collection_method: 'charge_automatically', billing_reason: 'subscription_cycle', account_name: 'Ambii',
    total: total, subtotal: total, amount_due: total, amount_paid: paid ? total : 0, amount_remaining: paid ? 0 : total,
    created: created, createdAt: when.toISOString(), period_start: created, period_end: periodEnd,
    status_transitions: { finalized_at: created, paid_at: paid ? created + 3600 : null },
    customer_name: company && company.name ? company.name : user ? user.name : '', customer_email: user ? user.email : '',
    customer_address: address ? {
      line1: address.addressLineOne, line2: address.addressLineTwo || null, city: address.city, state: address.state,
      postal_code: address.postalCode, country: address.country,
    } : null,
    default_payment_method: card ? { id: card.cardId, object: 'payment_method', type: 'card', card: { brand: card.brand, last4: card.cardNumber } } : null,
    hosted_invoice_url: INVOICE_PAGE_URL + '?id=' + id, invoice_pdf: null, userId: user ? user._id : opts.userId || IDS.user,
    lines: {
      object: 'list',
      data: [{
        id: 'il_' + id.slice(3), object: 'line_item', description: quantity + ' × Ambii Premium (at $16.00 / month)', amount: total, currency: 'usd',
        quantity: quantity, price: { unit_amount: unit, currency: 'usd', recurring: { interval: 'month' } }, period: { start: created, end: periodEnd },
      }],
    },
  });
}
