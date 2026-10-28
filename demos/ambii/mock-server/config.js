// Shared constants of the in-browser Ambii API. See README.md for the contract.

// Every request whose path starts with this is answered in the browser. The folder does not exist on the server.
export var API_BASE = '/projects/ambii-business/api';

// Hub page that links the three demos (written separately).
export var HUB_URL = '/projects/ambii-business/index.html';

// Hand-written page that shows one demo invoice from localStorage (?id=<invoice id>): the invoices'
// hosted_invoice_url, standing in for Stripe's hosted invoice page.
export var INVOICE_PAGE_URL = '/projects/ambii-business/invoice.html';

// localStorage keys of the mock: one key per collection, plus "meta".
export var STORAGE_PREFIX = 'ambii-demo:';

// Keys removed by resetDemo(): the mock's own, then each app's.
export var RESET_PREFIXES = ['ambii-demo:', 'ambii-business:', 'ambii-player:', 'ambii-music:'];

// Bump to reseed every visitor's demo data on their next request. (3: version 2 was first built from a
// work-in-progress catalogue whose stored queues and stations name four tracks since removed.)
export var SEED_VERSION = 3;

// navigator.locks name that serializes reads and writes across the three apps' documents.
export var LOCK_NAME = 'ambii-demo-db';

// IndexedDB database (object store "media") holding uploaded announcement audio.
export var IDB_NAME = 'ambii-demo';

// The real server's config.defaultStation: given to new locations and to locations removed from a schedule.
export var DEFAULT_STATION_ID = '6132e2e3f42b121582bac293';

// A paired player that has not reported a track end for this long shows as offline (server: services/player.js).
export var IDLE_OFFLINE_MS = 15 * 60 * 1000;

// One ad before the first track that starts after each 15 minutes of play (free plan only).
export var AD_INTERVAL_SECONDS = 900;

// A schedule block's generated station gets at least this many tracks: its genre and tempo matches, topped up
// with the closest tempos (most of the catalogue sits at 110 BPM and under, so the faster bands need topping up).
export var MIN_DYNAMIC_TRACKS = 12;

// Simulated network latency of the mock, in milliseconds.
export var LATENCY_MS = [100, 350];

// The mobile app's minimum supported version check: omitted, so it never asks for an update.
export var MOBILE_MIN_VERSION = 0;
