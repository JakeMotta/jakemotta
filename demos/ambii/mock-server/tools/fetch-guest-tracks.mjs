// Downloads the guest tracks listed in core/guests.js from their licensors' own hosts, re-encodes them
// to 128 kbps stereo MP3 at a common loudness, tags each with its title, artist, credit and license, and
// writes them to public/projects/ambii-business/media/tracks/<slug>.mp3. Those files are committed, so
// this only needs running to add or replace a track; build-media.mjs then measures them and draws their art.
//
//   node demos/ambii/mock-server/tools/fetch-guest-tracks.mjs --deps <node_modules folder> [--cache <dir>] [--only a,b] [--force]
//   node demos/ambii/mock-server/tools/fetch-guest-tracks.mjs --deps <node_modules folder> --measure <file.mp3> ...
//
// Needs, in that node_modules folder: mpg123-decoder 1, @wasm-audio-decoders/ogg-vorbis 0.1 and wasm-media-encoders 0.7
// (LAME compiled to WebAssembly: lamejs, which build-media.mjs uses for the short clips, is too slow for whole tracks).
// Downloads are kept in the cache folder (default: <os tmpdir>/ambii-guest-cache) so a rerun only re-encodes.
// --measure prints the loudness and estimated tempo of local files without writing anything.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { GUEST_TRACKS, GUEST_ARTISTS, GUEST_ALBUMS, LICENSES, OWN_TRACKS_REENCODED } from '../core/guests.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const OUT = join(REPO, 'public/projects/ambii-business/media/tracks');
const OWN_OUT = join(REPO, 'public/projects/ambii-business/media/music');

// Integrated loudness (EBU R128 / BS.1770) every track is brought to, unless that would clip: about
// the median of Jake's own 13 demo tracks (-14.6 LUFS), so the guests sit at the same level between his.
const TARGET_LUFS = -14;
const PEAK_LIMIT = 0.98;
const KBPS = 128;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

const deps = arg('--deps') || process.env.AMBII_MEDIA_DEPS;
if (!deps) throw new Error('Pass --deps <node_modules folder holding mpg123-decoder, @wasm-audio-decoders/ogg-vorbis and wasm-media-encoders>');
const require = createRequire(join(resolve(deps), 'x.js'));
const importDep = (name) => import(pathToFileURL(require.resolve(name)).href);

// ---------- decoding ----------

// Some hosts put text in front of the file (one prints a PHP warning before the MP3): start at the ID3 tag
// or the first frame sync.
function trimToMpeg(buf) {
  if (buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) return buf;
  if (buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return buf;
  const id3 = buf.indexOf('ID3');
  if (id3 >= 0 && id3 < 8192) return buf.subarray(id3);
  for (let i = 0; i < Math.min(buf.length - 1, 8192); i++) if (buf[i] === 0xff && (buf[i + 1] & 0xe0) === 0xe0) return buf.subarray(i);
  return buf;
}

async function decode(buf) {
  if (buf.subarray(0, 4).toString('ascii') === 'OggS') {
    const { OggVorbisDecoder } = await importDep('@wasm-audio-decoders/ogg-vorbis');
    const d = new OggVorbisDecoder();
    await d.ready;
    const r = await d.decodeFile(new Uint8Array(buf));
    d.free();
    return { channels: r.channelData, rate: r.sampleRate };
  }
  const { MPEGDecoder } = await importDep('mpg123-decoder');
  const d = new MPEGDecoder();
  await d.ready;
  const r = d.decode(new Uint8Array(trimToMpeg(buf)));
  d.free();
  if (!r.samplesDecoded) throw new Error('decoded no audio');
  return { channels: r.channelData, rate: r.sampleRate };
}

// ---------- loudness (BS.1770-4: K-weighting, 400 ms blocks with 75% overlap, -70 LUFS and -10 LU gates) ----------

function biquad(x, [b0, b1, b2, a0, a1, a2]) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}

function kWeight(x, rate) {
  const A = Math.pow(10, 4 / 40), w0 = (2 * Math.PI * 1500) / rate, cs = Math.cos(w0), al = Math.sin(w0) / (2 / Math.SQRT2), sa = 2 * Math.sqrt(A) * al;
  const shelf = [A * (A + 1 + (A - 1) * cs + sa), -2 * A * (A - 1 + (A + 1) * cs), A * (A + 1 + (A - 1) * cs - sa), A + 1 - (A - 1) * cs + sa, 2 * (A - 1 - (A + 1) * cs), A + 1 - (A - 1) * cs - sa];
  const w1 = (2 * Math.PI * 38) / rate, c1 = Math.cos(w1), a1 = Math.sin(w1) / (2 * 0.5);
  const hp = [(1 + c1) / 2, -(1 + c1), (1 + c1) / 2, 1 + a1, -2 * c1, 1 - a1];
  return biquad(biquad(x, shelf), hp);
}

function loudness(channels, rate) {
  const k = channels.map((c) => kWeight(c, rate));
  const block = Math.round(rate * 0.4), step = Math.round(rate * 0.1), powers = [];
  for (let s = 0; s + block <= k[0].length; s += step) {
    let z = 0;
    for (const c of k) {
      let sum = 0;
      for (let i = s; i < s + block; i++) sum += c[i] * c[i];
      z += sum / block;
    }
    powers.push(z);
  }
  const lufs = (z) => -0.691 + 10 * Math.log10(z);
  const abs = powers.filter((z) => lufs(z) > -70);
  if (!abs.length) return -70;
  const rel = lufs(abs.reduce((a, b) => a + b, 0) / abs.length) - 10;
  const gated = abs.filter((z) => lufs(z) > rel);
  return lufs(gated.reduce((a, b) => a + b, 0) / gated.length);
}

function peak(channels) {
  let m = 0;
  for (const c of channels) for (let i = 0; i < c.length; i++) m = Math.max(m, Math.abs(c[i]));
  return m;
}

// ---------- tempo (an estimate for the station and schedule logic, which only needs it within a band) ----------

// Onset strength from the energy rise in 11 ms frames of a mono, low-passed copy, then the autocorrelation
// peak between 60 and 190 BPM, weighted towards 120 so that half- and double-time readings lose.
function estimateBpm(channels, rate) {
  const n = channels[0].length, hop = Math.round(rate * 0.0116);
  const env = [];
  let lp = 0, prev = 0;
  for (let s = 0; s + hop <= n; s += hop) {
    let e = 0;
    for (let i = s; i < s + hop; i++) {
      let v = 0;
      for (const c of channels) v += c[i];
      lp += 0.08 * (v / channels.length - lp);
      e += lp * lp;
    }
    e = Math.log(1e-9 + e);
    env.push(Math.max(0, e - prev));
    prev = e;
  }
  const mean = env.reduce((a, b) => a + b, 0) / env.length;
  const x = env.map((v) => v - mean);
  const fps = rate / hop;
  let best = 0, bestScore = -Infinity;
  for (let bpm = 60; bpm <= 190; bpm += 0.5) {
    const lag = (60 * fps) / bpm;
    let sum = 0;
    for (const mult of [1, 2, 4]) {
      const L = lag * mult, l0 = Math.floor(L), f = L - l0;
      let acc = 0;
      for (let i = 0; i + l0 + 1 < x.length; i++) acc += x[i] * (x[i + l0] * (1 - f) + x[i + l0 + 1] * f);
      sum += acc / mult;
    }
    const score = sum * Math.exp(-0.5 * Math.pow(Math.log2(bpm / 120) / 0.9, 2));
    if (score > bestScore) { bestScore = score; best = bpm; }
  }
  return Math.round(best);
}

// ---------- encoding and tagging ----------

function scaled(x, gain) {
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = Math.max(-1, Math.min(1, x[i] * gain));
  return out;
}

// 128 kbps CBR, joint stereo; a mono source is written as two identical channels.
async function encode(channels, rate, gain) {
  const { createMp3Encoder } = require('wasm-media-encoders');
  const enc = await createMp3Encoder();
  enc.configure({ sampleRate: rate, channels: 2, bitrate: KBPS });
  const left = scaled(channels[0], gain), right = channels.length > 1 ? scaled(channels[1], gain) : left;
  const parts = [], step = rate * 4;
  // encode() returns a view into the encoder's memory that the next call reuses, so copy each chunk.
  for (let i = 0; i < left.length; i += step) parts.push(Buffer.from(enc.encode([left.subarray(i, i + step), right.subarray(i, i + step)])));
  parts.push(Buffer.from(enc.finalize()));
  return Buffer.concat(parts);
}

function synchsafe(n) {
  return Buffer.from([(n >> 21) & 0x7f, (n >> 14) & 0x7f, (n >> 7) & 0x7f, n & 0x7f]);
}

function frame(id, body) {
  const head = Buffer.alloc(10);
  head.write(id, 0, 'ascii');
  head.writeUInt32BE(body.length, 4);
  return Buffer.concat([head, body]);
}

// ID3v2.3: text in UTF-16 with a BOM (names like "José" and "París"), URLs in Latin-1.
function utf16(s) {
  return Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(s, 'utf16le')]);
}
const textFrame = (id, s) => frame(id, Buffer.concat([Buffer.from([1]), utf16(s)]));
const urlFrame = (id, url) => frame(id, Buffer.from(url, 'latin1'));
const commFrame = (s) => frame('COMM', Buffer.concat([Buffer.from([1]), Buffer.from('eng', 'ascii'), utf16(''), Buffer.from([0, 0]), utf16(s)]));

function id3(track) {
  const artist = GUEST_ARTISTS[track.artist], album = track.album ? GUEST_ALBUMS[track.album] : null, license = LICENSES[track.license];
  const frames = [
    textFrame('TIT2', track.title),
    textFrame('TPE1', artist.name),
    textFrame('TALB', album ? album.title : track.title),
    track.year ? textFrame('TYER', String(track.year)) : null,
    textFrame('TCOP', `${track.year || ''} ${artist.name}, ${track.license}`.trim()),
    urlFrame('WCOP', license.url),
    urlFrame('WOAF', track.page),
    commFrame(`${creditLine(track)}. Re-encoded to ${KBPS} kbps for the Ambii Business demo on jakemotta.com.`),
  ].filter(Boolean);
  const body = Buffer.concat(frames);
  return Buffer.concat([Buffer.from('ID3', 'ascii'), Buffer.from([3, 0, 0]), synchsafe(body.length), body]);
}

export function creditLine(track) {
  const artist = GUEST_ARTISTS[track.artist];
  return `"${track.title}" by ${artist.credit || artist.name}, ${track.license} (${LICENSES[track.license].url})`;
}

// ---------- main ----------

async function download(track, cacheDir) {
  const file = join(cacheDir, track.slug + (/\.ogg(\?|$)/i.test(track.file) ? '.ogg' : '.mp3'));
  if (existsSync(file) && !process.argv.includes('--force')) return readFileSync(file);
  const res = await fetch(track.file, { redirect: 'follow', headers: { 'User-Agent': 'curl/8.9.1', Accept: '*/*' } });
  if (!res.ok) throw new Error(`${track.slug}: HTTP ${res.status} from ${track.file}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(file, buf);
  return buf;
}

async function measure(files) {
  for (const f of files) {
    const { channels, rate } = await decode(readFileSync(f));
    console.log(JSON.stringify({ file: f, seconds: +(channels[0].length / rate).toFixed(1), rate, lufs: +loudness(channels, rate).toFixed(2), peak: +peak(channels).toFixed(3), bpm: estimateBpm(channels, rate) }));
  }
}

async function main() {
  const m = process.argv.indexOf('--measure');
  if (m > 0) return measure(process.argv.slice(m + 1).filter((a) => !a.startsWith('--')));
  const cacheDir = arg('--cache') || join(tmpdir(), 'ambii-guest-cache');
  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  const only = arg('--only') ? arg('--only').split(',') : null;
  // Jake's larger tracks: re-encoded at their own level (no loudness change), tagged with title and artist.
  mkdirSync(OWN_OUT, { recursive: true });
  for (const [slug, title] of Object.entries(OWN_TRACKS_REENCODED)) {
    if (only && only.indexOf(slug) < 0) continue;
    const { channels, rate } = await decode(readFileSync(join(REPO, 'public/music', slug + '.mp3')));
    const tag = Buffer.concat([textFrame('TIT2', title), textFrame('TPE1', 'Jake Motta'), commFrame(`Re-encoded to ${KBPS} kbps for the Ambii Business demo on jakemotta.com.`)]);
    const mp3 = Buffer.concat([Buffer.from('ID3', 'ascii'), Buffer.from([3, 0, 0]), synchsafe(tag.length), tag, await encode(channels.slice(0, 2), rate, 1)]);
    writeFileSync(join(OWN_OUT, slug + '.mp3'), mp3);
    console.log(JSON.stringify({ slug, own: true, seconds: +(channels[0].length / rate).toFixed(1), rate, bytes: mp3.length }));
  }
  // A host that fails doesn't stop the others; the failures are listed at the end.
  const failed = [];
  for (const track of GUEST_TRACKS) {
    if (only && only.indexOf(track.slug) < 0) continue;
    try {
      const { channels, rate } = await decode(await download(track, cacheDir));
      const stereo = channels.slice(0, 2);
      const lufs = loudness(stereo, rate), pk = peak(stereo);
      const gain = Math.min(Math.pow(10, (TARGET_LUFS - lufs) / 20), PEAK_LIMIT / pk);
      const mp3 = Buffer.concat([id3(track), await encode(stereo, rate, gain)]);
      writeFileSync(join(OUT, track.slug + '.mp3'), mp3);
      console.log(JSON.stringify({ slug: track.slug, seconds: +(stereo[0].length / rate).toFixed(1), rate, lufsIn: +lufs.toFixed(2), gainDb: +(20 * Math.log10(gain)).toFixed(2), bpmEstimate: estimateBpm(stereo, rate), bytes: mp3.length }));
    } catch (err) {
      failed.push(track.slug);
      console.error(`${track.slug}: ${err.message}`);
    }
  }
  if (failed.length) {
    console.error('failed: ' + failed.join(', '));
    process.exitCode = 1;
  }
}

await main();
