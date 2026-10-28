// The catalogue's guest music against the files on disk, and the ids the apps rely on being unique.
// (media.test.js covers Jake's tracks, the clips, his portrait and the logo.)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mp3Duration } from '../core/mp3.js';
import { GUEST_MEDIA } from '../core/media-data.js';
import { BED_MEDIA } from '../core/bed-data.js';
import { GUEST_TRACKS, GUEST_ALBUMS, GUEST_ARTISTS, LICENSES } from '../core/guests.js';
import { TRACKS, ALBUMS, ARTISTS, STATIONS, adTrack, adId, isAdId } from '../core/catalogue.js';
import { STATION_INFO } from '../core/station-list.js';
import { fixedId } from '../core/util.js';

var PUBLIC = fileURLToPath(new URL('../../../../public', import.meta.url));

test('guest tracks: every file exists, the parser agrees with the stored duration and size', () => {
  for (var t of GUEST_TRACKS) {
    var m = GUEST_MEDIA[t.slug];
    assert.ok(m, t.slug + ' is measured');
    var file = PUBLIC + m.url;
    assert.ok(existsSync(file), m.url);
    var bytes = readFileSync(file);
    assert.equal(bytes.length, m.bytes, m.url + ' size');
    assert.ok(Math.abs(mp3Duration(bytes) - m.duration) < 0.4, m.url + ': parsed ' + mp3Duration(bytes) + ' vs stored ' + m.duration);
  }
});

test('every cover, portrait, track and bed the apps are given exists (no 404 in any player)', () => {
  var urls = new Set();
  Object.values(TRACKS).forEach((t) => {
    urls.add(t.url);
    ['cover_small', 'cover_med', 'cover_large', 'cover_xl'].forEach((k) => urls.add(t.album[k]));
  });
  Object.values(ARTISTS).forEach((a) => ['portrait_small', 'portrait_med', 'portrait_large', 'portrait_xl'].forEach((k) => urls.add(a[k])));
  var ad = adTrack(adId(1));
  [ad.url, ad.picture, ad.album.cover_small, ad.album.cover_med, ad.album.cover_large].forEach((u) => urls.add(u));
  Object.values(BED_MEDIA).forEach((b) => urls.add(b.url));
  var missing = [...urls].filter((u) => !existsSync(PUBLIC + u));
  assert.deepEqual(missing, []);
});

test('ids: tracks, albums and artists unique and clear of the ads; guest numbers fixed and unique; cover files one per album', () => {
  var ids = Object.keys(TRACKS).concat(Object.keys(ALBUMS), Object.keys(ARTISTS), Object.keys(STATIONS));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(Object.keys(TRACKS).every((id) => !isAdId(id)));
  assert.ok(!ALBUMS[fixedId('61a7ab', 255)], 'no album takes the ad album id');
  // every album's track count is its tracks', and an album holds one artist
  Object.values(ALBUMS).forEach((a) => {
    var own = Object.values(TRACKS).filter((t) => t.album._id === a._id);
    assert.equal(a.nb_tracks, own.length, a.title);
    assert.ok(own.every((t) => t.artist._id === a.artist._id), a.title);
  });
  function unique(list, what) {
    assert.equal(new Set(list).size, list.length, what);
  }
  unique(GUEST_TRACKS.map((t) => t.n), 'guest track n');
  unique(GUEST_TRACKS.map((t) => t.slug), 'guest track slug');
  unique(Object.values(GUEST_ALBUMS).map((a) => a.n), 'guest album n');
  unique(Object.values(GUEST_ARTISTS).map((a) => a.n), 'guest artist n');
  // album ids are 0x100 + n and singles 0x800 + n: n must stay below 0x700 so the two never meet
  assert.ok(Object.values(GUEST_ALBUMS).every((a) => a.n > 0 && a.n < 0x700));
  assert.ok(GUEST_TRACKS.every((t) => t.n > 0 && t.n < 0x700));
  // a single's cover is media/albums/<its slug>, an album's media/albums/<its key>: they must not share a file
  var singles = GUEST_TRACKS.filter((t) => !t.album).map((t) => t.slug);
  var albumKeys = {};
  GUEST_TRACKS.forEach((t) => { if (t.album) albumKeys[t.album] = true; });
  assert.deepEqual(singles.filter((slug) => albumKeys[slug]), []);
  assert.ok(GUEST_TRACKS.every((t) => GUEST_ARTISTS[t.artist] && (!t.album || GUEST_ALBUMS[t.album]) && LICENSES[t.license]));
});

test('stations: every track once per station, all of them known, and every track in some station', () => {
  var used = new Set();
  STATION_INFO.forEach((s) => {
    assert.equal(new Set(s.tracks).size, s.tracks.length, s.name + ' lists a track twice');
    s.tracks.forEach((slug) => used.add(slug));
    var st = STATIONS[s.id];
    assert.ok(st.top_tracks.every((id) => st.tracks.indexOf(id) >= 0), s.name);
    assert.equal(new Set(st.top_tracks).size, st.top_tracks.length, s.name);
    assert.ok(st.top_artists.every((id) => ARTISTS[id]), s.name);
  });
  var all = Object.values(TRACKS).length;
  assert.equal(used.size, all);
});
