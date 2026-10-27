// The demo music catalogue: Jake Motta's own tracks (public/music), as the server's TrackV2 / Album /
// Artist / StationV2 documents. Static: it lives in code, not in localStorage.
import { TRACK_MEDIA, CLIP_MEDIA, ARTIST_PORTRAIT, AMBII_LOGO } from './media-data.js';
import { fixedId } from './util.js';
import { DEFAULT_STATION_ID } from '../config.js';

var CREATED = '2021-09-04T17:00:00.000Z';

// slug, title (from musicList in src/common/constants.ts), year, bpm, album genres.
// BPM: from the files' own ID3 tags where present; dancin, fearless, hide_and_seek and uprising have none
// and were estimated with realtime-bpm-analyzer's analyzeFullBuffer (hide_and_seek's estimate is weak).
// Genres are demo labels chosen so that every genre key the dashboard knows is covered.
var TRACK_INFO = [
  ['uprising', 'Uprising', 2022, 92, ['electro', 'dance']],
  ['marceline', 'S3RL feat. Sara - Marceline the Vampire Queen (A Bad Remix)', 2022, 175, ['dance', 'pop']],
  ['alone', 'Alone', 2019, 170, ['pop', 'alternative']],
  ['memories', 'Memories', 2018, 70, ['pop', 'r&b']],
  ['anguish', 'Anguish', 2017, 115, ['rock', 'alternative']],
  ['breathe', 'Breathe', 2017, 140, ['electro', 'blues']],
  ['fearless', 'Fearless', 2016, 120, ['rap/hip hop', 'blues']],
  ['hide_and_seek', 'Hide & Seek - Les Edit', 2016, 124, ['folk', 'electro']],
  ['dancin', 'Dancin', 2016, 120, ['dance', 'soul & funk']],
  ['transition', 'Transition', 2015, 90, ['jazz', 'soul & funk']],
  ['identity', 'Identity', 2015, 63, ['r&b', 'classical']],
  ['stepping_clouds', 'Stepping Clouds', 2015, 120, ['classical', 'jazz']],
  ['innocence', 'Innocence', 2012, 130, ['folk', 'country']],
];

function sized(base, sizes) {
  return { small: base + '-' + sizes[2] + '.jpg', med: base + '-' + sizes[1] + '.jpg', large: base + '-' + sizes[0] + '.jpg' };
}

var portrait = sized(ARTIST_PORTRAIT, [640, 320, 120]);
export var ARTIST = {
  _id: fixedId('61a7a0', 1), name: 'Jake Motta',
  portrait_small: portrait.small, portrait_med: portrait.med, portrait_large: portrait.large, portrait_xl: portrait.large,
  fanCount: 0, uniqueListeners: 0, playcount: 0, tags: ['Jake Motta'], isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
};

var logo = sized(AMBII_LOGO, [512, 250, 120]);
var AMBII_ARTIST = {
  _id: fixedId('61a7a0', 2), name: 'Ambii',
  portrait_small: logo.small, portrait_med: logo.med, portrait_large: logo.large, portrait_xl: logo.large,
  fanCount: 0, tags: ['Ambii'], isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
};

export var TRACKS = {};
export var TRACK_BY_SLUG = {};
export var ALBUMS = {};

TRACK_INFO.forEach(function (t, i) {
  var slug = t[0], media = TRACK_MEDIA[slug];
  var cover = sized(media.cover, [640, 320, 120]);
  var released = t[2] + '-01-01T00:00:00.000Z';
  var album = {
    _id: fixedId('61a7ab', i + 1), title: t[1], upc: '', cover_small: cover.small, cover_med: cover.med, cover_large: cover.large, cover_xl: cover.large,
    genres: t[4], label: 'Jake Motta', nb_tracks: 1, duration: media.duration, rating: 0, release_date: released, explicit_lyrics: false,
    isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
  var track = {
    _id: fixedId('61a7c0', i + 1), title: t[1], url: media.url, isrc: 'JMOTTA' + (i + 1 < 10 ? '0' : '') + (i + 1), duration: media.duration,
    release_date: released, rank: 500000 - i * 1000, explicit_lyrics: false, explicit_content_lyrics: 0, explicit_content_cover: 0,
    preview: media.url, bpm: t[3], gain: 0, tags: [], contributors: [ARTIST], album: album, artist: ARTIST,
    isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
  ALBUMS[album._id] = album;
  TRACKS[track._id] = track;
  TRACK_BY_SLUG[slug] = track;
});

// The ad. The real server had one "ADVERT_60" track; here each slot in a queue gets its own _id and isrc
// (ADVERT_AMBII_<n>) because the mobile app uses isrc as a unique queue id. Ad ids share a prefix.
var AD_ID_PREFIX = '61a7ad';
var AD_BASE = {
  title: 'Advertisement', url: CLIP_MEDIA['ambii-ad'].url, duration: CLIP_MEDIA['ambii-ad'].duration, release_date: CREATED, rank: 0,
  explicit_lyrics: false, explicit_content_lyrics: 0, explicit_content_cover: 0, preview: CLIP_MEDIA['ambii-ad'].url, bpm: 60, gain: 0,
  tags: ['advertisement'], picture: logo.large, contributors: [AMBII_ARTIST], artist: AMBII_ARTIST,
  album: { _id: fixedId('61a7ab', 255), title: 'Advertisement', cover_small: logo.small, cover_med: logo.med, cover_large: logo.large, cover_xl: logo.large, genres: [], label: 'Ambii', isDeleted: false },
  isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
};

export function adId(n) {
  return fixedId(AD_ID_PREFIX, n);
}

export function isAdId(id) {
  return typeof id === 'string' && id.length === 24 && id.indexOf(AD_ID_PREFIX) === 0;
}

export function adTrack(id) {
  var n = parseInt(id.slice(6), 16);
  return Object.assign({}, AD_BASE, { _id: id, isrc: 'ADVERT_AMBII_' + n });
}

export function trackById(id) {
  if (!id) return null;
  if (isAdId(id)) return adTrack(id);
  return TRACKS[id] || null;
}

export function allTrackIds() {
  return Object.keys(TRACKS);
}

// Static stations: the browse rows of a cafe ("Popular Today" + constants/supersets.js "cafe",
// including the trailing space of "Late Night Study ").
var STATION_INFO = [
  [DEFAULT_STATION_ID, 'Ambii Essentials', ['Popular Today'],
    ['uprising', 'marceline', 'alone', 'memories', 'anguish', 'breathe', 'fearless', 'hide_and_seek', 'dancin', 'transition', 'identity', 'stepping_clouds', 'innocence'],
    ['Variety', 'Feel Good', 'Everyday', 'Upbeat'], 'A little bit of everything. A safe pick for any room, any time of day.'],
  [fixedId('61a7d0', 2), 'Morning Pour-Over', ['Coffee Curiosity', 'Popular Today'],
    ['memories', 'transition', 'identity', 'stepping_clouds', 'hide_and_seek', 'innocence', 'dancin', 'uprising', 'fearless'],
    ['Mellow', 'Warm', 'Morning', 'Smooth'], 'Gentle grooves for the first cup of the day.'],
  [fixedId('61a7d0', 3), 'Espresso Shot', ['Coffee Curiosity'],
    ['breathe', 'marceline', 'alone', 'fearless', 'anguish', 'innocence', 'hide_and_seek', 'uprising', 'dancin'],
    ['Energetic', 'Bright', 'Rush Hour'], 'Quick, bright and a little over-caffeinated.'],
  [fixedId('61a7d0', 4), 'Between the Shelves', ['Bookstore Barista', 'Classical Cappuccino'],
    ['transition', 'stepping_clouds', 'identity', 'memories', 'hide_and_seek', 'innocence', 'alone', 'anguish'],
    ['Focus', 'Calm', 'Reading'], 'Unhurried tracks for browsing and reading.'],
  [fixedId('61a7d0', 5), 'Strings & Steam', ['Classical Cappuccino'],
    ['stepping_clouds', 'identity', 'innocence', 'transition', 'memories', 'hide_and_seek', 'breathe', 'anguish'],
    ['Elegant', 'Cinematic', 'Calm'], 'Sweeping, cinematic pieces with a classical touch.'],
  [fixedId('61a7d0', 6), 'Tapioca Tempo', ['Boba Beats', 'Popular Today'],
    ['marceline', 'alone', 'dancin', 'uprising', 'breathe', 'memories', 'fearless', 'hide_and_seek', 'innocence'],
    ['Pop', 'Playful', 'Upbeat', 'Young'], 'Sweet, bouncy pop to go with the boba.'],
  [fixedId('61a7d0', 7), 'Brown Sugar Bounce', ['Boba Beats'],
    ['dancin', 'fearless', 'uprising', 'marceline', 'breathe', 'anguish', 'alone', 'transition'],
    ['Dance', 'Groovy', 'Afternoon'], 'Groovy afternoon energy with a chewy bassline.'],
  [fixedId('61a7d0', 8), 'Porch Swing', ['Countryside Cafe'],
    ['innocence', 'hide_and_seek', 'transition', 'stepping_clouds', 'memories', 'fearless', 'anguish', 'dancin'],
    ['Folk', 'Sunny', 'Easygoing'], 'Easygoing, sunny tunes with a little twang.'],
  [fixedId('61a7d0', 9), 'Barn Door Brunch', ['Countryside Cafe', 'Popular Today'],
    ['innocence', 'dancin', 'breathe', 'fearless', 'transition', 'uprising', 'hide_and_seek', 'alone'],
    ['Brunch', 'Cheerful', 'Weekend'], 'A cheerful soundtrack for long weekend brunches.'],
  [fixedId('61a7d0', 10), 'Midnight Oil', ['Late Night Study '],
    ['identity', 'memories', 'stepping_clouds', 'transition', 'uprising', 'hide_and_seek', 'anguish', 'breathe'],
    ['Chill', 'Focus', 'Late Night', 'Lo-Fi'], 'Low-key beats for the last few chapters.'],
  [fixedId('61a7d0', 11), 'Lamplight Lo-Fi', ['Late Night Study ', 'Bookstore Barista'],
    ['memories', 'identity', 'transition', 'uprising', 'stepping_clouds', 'fearless', 'innocence', 'alone'],
    ['Lo-Fi', 'Cozy', 'Study'], 'A cozy, dim-the-lights study companion.'],
  [fixedId('61a7d0', 12), 'Saturday Rush', ['Popular Today'],
    ['marceline', 'alone', 'breathe', 'innocence', 'anguish', 'fearless', 'dancin', 'uprising', 'hide_and_seek'],
    ['Party', 'High Energy', 'Weekend'], 'High-energy picks for your busiest hours.'],
];

export var STATION_IDS = {
  essentials: STATION_INFO[0][0], morningPourOver: STATION_INFO[1][0], tapiocaTempo: STATION_INFO[5][0], midnightOil: STATION_INFO[9][0],
};

// genres: share of the station's tracks per album genre, in percent (the dashboard draws them as a bar).
export function genreWeights(trackIds) {
  var counts = {}, total = 0;
  trackIds.forEach(function (id) {
    var t = TRACKS[id];
    if (!t) return;
    t.album.genres.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; total++; });
  });
  var out = {};
  Object.keys(counts).forEach(function (g) { out[g] = Math.round((counts[g] / total) * 100); });
  return out;
}

export function bpmStats(trackIds) {
  var bpms = trackIds.map(function (id) { return TRACKS[id] ? TRACKS[id].bpm : null; }).filter(function (b) { return b; });
  if (!bpms.length) return { mean: 100 };
  var sum = bpms.reduce(function (a, b) { return a + b; }, 0);
  return { mean: Math.round(sum / bpms.length), min: Math.min.apply(null, bpms), max: Math.max.apply(null, bpms) };
}

export var STATIONS = {};
STATION_INFO.forEach(function (s) {
  var ids = s[3].map(function (slug) { return TRACK_BY_SLUG[slug]._id; });
  STATIONS[s[0]] = {
    _id: s[0], name: s[1], type: 'static', isPublic: true, description: s[5], genres: genreWeights(ids), bpm: bpmStats(ids),
    tags: s[4], era: {}, supersets: s[2], tracks: ids, top_tracks: ids.slice(0, 6), top_artists: [ARTIST._id],
    isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
});

export function artistById(id) {
  if (id === ARTIST._id) return ARTIST;
  if (id === AMBII_ARTIST._id) return AMBII_ARTIST;
  return null;
}
