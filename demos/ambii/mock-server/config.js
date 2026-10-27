// Shared constants of the in-browser Ambii API. See README.md for the contract.

// Every request whose path starts with this is answered in the browser. The folder does not exist on the server.
export var API_BASE = '/projects/ambii-business/api';

// Hub page that links the three demos (written separately).
export var HUB_URL = '/projects/ambii-business/index.html';

// localStorage keys of the mock: one key per collection, plus "meta".
export var STORAGE_PREFIX = 'ambii-demo:';

// Keys removed by resetDemo(): the mock's own, then each app's.
export var RESET_PREFIXES = ['ambii-demo:', 'ambii-business:', 'ambii-player:', 'ambii-music:'];

// Bump to reseed every visitor's demo data on their next request.
export var SEED_VERSION = 1;

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

// A schedule block's generated station gets at least this many tracks (the catalogue has 13).
export var MIN_DYNAMIC_TRACKS = 8;

// Simulated network latency of the mock, in milliseconds.
export var LATENCY_MS = [100, 350];

// The mobile app's minimum supported version check: omitted, so it never asks for an update.
export var MOBILE_MIN_VERSION = 0;
