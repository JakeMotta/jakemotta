// The demo music catalogue, as the server's TrackV2 / Album / Artist / StationV2 documents: Jake Motta's own
// tracks (public/music) and the free-licensed guest tracks in guests.js, by many artists on multi-track albums.
// Static: it lives in code, not in localStorage.
import { TRACK_MEDIA, GUEST_MEDIA, CLIP_MEDIA, ARTIST_PORTRAIT, AMBII_LOGO, MEDIA_URL } from './media-data.js';
import { GUEST_ARTISTS, GUEST_ALBUMS, GUEST_TRACKS } from './guests.js';
import { STATION_INFO } from './station-list.js';
import { fixedId } from './util.js';
import { DEFAULT_STATION_ID } from '../config.js';

var CREATED = '2021-09-04T17:00:00.000Z';

// The 13 genre keys the dashboard colours and lets schedules target (genreColors in its constants).
export var GENRE_KEYS = ['pop', 'rock', 'alternative', 'dance', 'electro', 'rap/hip hop', 'r&b', 'folk', 'country', 'jazz', 'blues', 'classical', 'soul & funk'];

// Jake's tracks: slug, title (from musicList in src/common/constants.ts), year, bpm, album genres.
// BPM: from the files' own ID3 tags where present; dancin, fearless, hide_and_seek and uprising have none
// and were estimated with realtime-bpm-analyzer's analyzeFullBuffer (hide_and_seek's estimate is weak),
// she_wants_my_package with tools/fetch-guest-tracks.mjs --measure. Ids and ISRCs follow the order, so
// new tracks go at the end.
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
  ['she_wants_my_package', 'She wants my package', 2021, 128, ['electro', 'dance']],
];

function sized(base, sizes) {
  return { small: base + '-' + sizes[2] + '.jpg', med: base + '-' + sizes[1] + '.jpg', large: base + '-' + sizes[0] + '.jpg' };
}

function artistDoc(id, name, portraitBase, tags) {
  var p = sized(portraitBase, [640, 320, 120]);
  return {
    _id: id, name: name, portrait_small: p.small, portrait_med: p.med, portrait_large: p.large, portrait_xl: p.large,
    fanCount: 0, uniqueListeners: 0, playcount: 0, tags: tags || [name], isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
}

export var ARTIST = artistDoc(fixedId('61a7a0', 1), 'Jake Motta', ARTIST_PORTRAIT);
var AMBII_ARTIST = artistDoc(fixedId('61a7a0', 2), 'Ambii', AMBII_LOGO);
var logo = sized(AMBII_LOGO, [512, 250, 120]);
AMBII_ARTIST.portrait_small = logo.small; AMBII_ARTIST.portrait_med = logo.med; AMBII_ARTIST.portrait_large = logo.large; AMBII_ARTIST.portrait_xl = logo.large;

export var ARTISTS = {};
ARTISTS[ARTIST._id] = ARTIST;
ARTISTS[AMBII_ARTIST._id] = AMBII_ARTIST;
var ARTIST_BY_KEY = {};
Object.keys(GUEST_ARTISTS).forEach(function (key) {
  var a = GUEST_ARTISTS[key];
  var doc = artistDoc(fixedId('61a7a0', 0x100 + a.n), a.name, MEDIA_URL + '/artists/' + key);
  ARTISTS[doc._id] = doc;
  ARTIST_BY_KEY[key] = doc;
});

export var TRACKS = {};
export var TRACK_BY_SLUG = {};
export var ALBUMS = {};

function albumDoc(id, title, artist, year, genres, coverBase, label) {
  var cover = sized(coverBase, [640, 320, 120]);
  return {
    _id: id, title: title, upc: '', cover_small: cover.small, cover_med: cover.med, cover_large: cover.large, cover_xl: cover.large,
    genres: genres, label: label, nb_tracks: 0, duration: 0, rating: 0, release_date: (year || 2021) + '-01-01T00:00:00.000Z', explicit_lyrics: false,
    artist: { _id: artist._id, name: artist.name }, isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
}

function trackDoc(id, title, isrc, media, rank, bpm, artist, album, explicit) {
  album.nb_tracks += 1;
  album.duration = Math.round((album.duration + media.duration) * 1000) / 1000;
  return {
    _id: id, title: title, url: media.url, isrc: isrc, duration: media.duration, release_date: album.release_date, rank: rank,
    explicit_lyrics: !!explicit, explicit_content_lyrics: explicit ? 1 : 0, explicit_content_cover: 0, preview: media.url, bpm: bpm, gain: 0,
    tags: [], contributors: [artist], album: album, artist: artist, isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
}

function add(slug, track) {
  ALBUMS[track.album._id] = track.album;
  TRACKS[track._id] = track;
  TRACK_BY_SLUG[slug] = track;
}

// Jake's tracks are singles: an album of one, named after the track, as on his own site.
TRACK_INFO.forEach(function (t, i) {
  var slug = t[0], media = TRACK_MEDIA[slug];
  var album = albumDoc(fixedId('61a7ab', i + 1), t[1], ARTIST, t[2], t[4], media.cover, 'Jake Motta');
  add(slug, trackDoc(fixedId('61a7c0', i + 1), t[1], 'JMOTTA' + (i + 1 < 10 ? '0' : '') + (i + 1), media, 500000 - i * 1000, t[3], ARTIST, album));
});

// Guest albums: a declared album holds its tracks; a track without one is a single. Album genres are the
// most common genres of the album's tracks (the server kept genres on albums, not tracks). Album ids start
// at 0x100 and single ids at 0x800, clear of the ad album (255); ISRCs never contain ADVERT_ or ISM_.
// A guest track enters the catalogue once build-media.mjs has measured its file (the tests check they all have).
var GUESTS = GUEST_TRACKS.filter(function (t) { return GUEST_MEDIA[t.slug]; });
var albumTracks = {};
GUESTS.forEach(function (t) {
  var key = t.album || 'single:' + t.slug;
  (albumTracks[key] = albumTracks[key] || []).push(t);
});

function topGenres(tracks) {
  var counts = {};
  tracks.forEach(function (t) { t.genres.forEach(function (g, i) { counts[g] = (counts[g] || 0) + (3 - Math.min(i, 2)); }); });
  return Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 3);
}

var guestAlbums = {};
Object.keys(albumTracks).forEach(function (key) {
  var tracks = albumTracks[key], first = tracks[0], artist = ARTIST_BY_KEY[first.artist];
  var declared = first.album ? GUEST_ALBUMS[first.album] : null;
  var id = declared ? fixedId('61a7ab', 0x100 + declared.n) : fixedId('61a7ab', 0x800 + first.n);
  var coverSlug = declared ? first.album : first.slug;
  guestAlbums[key] = albumDoc(id, declared ? declared.title : first.title, artist, declared ? declared.year : first.year, topGenres(tracks),
    MEDIA_URL + '/albums/' + coverSlug, GUEST_ARTISTS[first.artist].name);
});

GUESTS.forEach(function (t) {
  var media = GUEST_MEDIA[t.slug];
  var album = guestAlbums[t.album || 'single:' + t.slug];
  var isrc = 'AMBDMO' + ('0000' + t.n).slice(-4);
  add(t.slug, trackDoc(fixedId('61a7c0', 0x100 + t.n), t.title, isrc, media, 400000 - t.n * 997, t.bpm, ARTIST_BY_KEY[t.artist], album, t.explicit));
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

// genres: share of the station's tracks per album genre, in percent (the dashboard draws them as a bar).
// A track's first album genre counts double, so a station's character shows.
export function genreWeights(trackIds) {
  var counts = {}, total = 0;
  trackIds.forEach(function (id) {
    var t = TRACKS[id];
    if (!t) return;
    t.album.genres.forEach(function (g, i) { var w = i === 0 ? 2 : 1; counts[g] = (counts[g] || 0) + w; total += w; });
  });
  var out = {};
  Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).forEach(function (g) { out[g] = Math.round((counts[g] / total) * 100); });
  return out;
}

export function bpmStats(trackIds) {
  var bpms = trackIds.map(function (id) { return TRACKS[id] ? TRACKS[id].bpm : null; }).filter(function (b) { return b; });
  if (!bpms.length) return { mean: 100 };
  var sum = bpms.reduce(function (a, b) { return a + b; }, 0);
  return { mean: Math.round(sum / bpms.length), min: Math.min.apply(null, bpms), max: Math.max.apply(null, bpms) };
}

// The preview modal shows up to 10 popular songs and 5 featured artists. Top tracks are the station's first
// ten, each artist at most twice so one artist doesn't fill the list; top artists by how many of the
// station's tracks are theirs. The dashboard's preview player needs a non-explicit track among them.
export function topTracks(trackIds) {
  var perArtist = {}, out = [], rest = [];
  trackIds.forEach(function (id) {
    var t = TRACKS[id];
    if (!t) return;
    var a = t.artist._id;
    if (out.length < 10 && (perArtist[a] || 0) < 2) { out.push(id); perArtist[a] = (perArtist[a] || 0) + 1; } else rest.push(id);
  });
  for (var i = 0; out.length < 10 && i < rest.length; i++) out.push(rest[i]);
  if (out.length && out.every(function (id) { return TRACKS[id].explicit_lyrics; })) {
    var clean = trackIds.filter(function (id) { return TRACKS[id] && !TRACKS[id].explicit_lyrics; })[0];
    if (clean) out[out.length - 1] = clean;
  }
  return out;
}

export function topArtists(trackIds) {
  var counts = {}, order = [];
  trackIds.forEach(function (id) {
    var t = TRACKS[id];
    if (!t) return;
    var a = t.artist._id;
    if (!counts[a]) order.push(a);
    counts[a] = (counts[a] || 0) + 1;
  });
  return order.sort(function (a, b) { return counts[b] - counts[a] || order.indexOf(a) - order.indexOf(b); }).slice(0, 5);
}

// Static stations (station-list.js): the browse rows of a cafe and a restaurant plus "Popular Today".
export var STATIONS = {};
STATION_INFO.forEach(function (s) {
  var ids = s.tracks.map(function (slug) {
    if (!TRACK_BY_SLUG[slug]) throw new Error('station ' + s.name + ': unknown track ' + slug);
    return TRACK_BY_SLUG[slug]._id;
  });
  STATIONS[s.id] = {
    _id: s.id, name: s.name, type: 'static', isPublic: true, description: s.description, genres: genreWeights(ids), bpm: bpmStats(ids),
    tags: s.tags, era: {}, supersets: s.rows, tracks: ids, top_tracks: topTracks(ids), top_artists: topArtists(ids),
    isDeleted: false, createdAt: CREATED, updatedAt: CREATED, __v: 0,
  };
});

export var STATION_IDS = {
  essentials: DEFAULT_STATION_ID, morningPourOver: fixedId('61a7d0', 2), espressoShot: fixedId('61a7d0', 3), tapiocaTempo: fixedId('61a7d0', 6),
  midnightOil: fixedId('61a7d0', 10), saturdayRush: fixedId('61a7d0', 12),
};

export function artistById(id) {
  return ARTISTS[id] || null;
}
