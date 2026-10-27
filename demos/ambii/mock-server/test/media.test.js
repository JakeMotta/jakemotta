// The MP3 duration parser against the real files, and the generated media data against the files on disk.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mp3Duration } from '../core/mp3.js';
import { TRACK_MEDIA, CLIP_MEDIA, ARTIST_PORTRAIT, AMBII_LOGO } from '../core/media-data.js';

var PUBLIC = fileURLToPath(new URL('../../../../public', import.meta.url));

test('every track and clip referenced by the catalogue exists, and the parser agrees with the stored durations', () => {
  var all = Object.values(TRACK_MEDIA).map((m) => [m.url, m.duration]).concat(Object.values(CLIP_MEDIA).map((m) => [m.url, m.duration]));
  for (var [url, duration] of all) {
    var file = PUBLIC + url;
    assert.ok(existsSync(file), url);
    var parsed = mp3Duration(readFileSync(file));
    // music-metadata (the stored values) and a frame count differ by up to ~0.3 s on some files
    // (encoder delay and padding); browsers' decoded durations match the frame count.
    assert.ok(Math.abs(parsed - duration) < 0.4, url + ': parsed ' + parsed + ' vs stored ' + duration);
  }
});

test('cover art, portrait and logo files exist in every size', () => {
  Object.values(TRACK_MEDIA).forEach((m) => [640, 320, 120].forEach((s) => assert.ok(existsSync(PUBLIC + m.cover + '-' + s + '.jpg'), m.cover + s)));
  [640, 320, 120].forEach((s) => assert.ok(existsSync(PUBLIC + ARTIST_PORTRAIT + '-' + s + '.jpg')));
  [512, 250, 120].forEach((s) => assert.ok(existsSync(PUBLIC + AMBII_LOGO + '-' + s + '.jpg')));
});

test('mp3Duration returns 0 for data that is not MPEG audio', () => {
  assert.equal(mp3Duration(new TextEncoder().encode('hello world, not audio at all')), 0);
  assert.equal(mp3Duration(new Uint8Array(0)), 0);
});
