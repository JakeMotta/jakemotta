// Builds the Ambii demo media into public/projects/ambii-business/media/ and writes
// mock-server/core/media-data.js (measured durations, the embedded silent clip).
//
//   node demos/ambii/mock-server/tools/build-media.mjs --deps <node_modules folder> [--images-only | --audio-only | --tracks-only | --beds-only | --clips-only [<clip id> ...]]
//
// Needs, in that node_modules folder: sharp 0.33, lamejs 1.2.1, music-metadata 7.
// Needs Windows (announcements are spoken by the built-in SAPI voices "Microsoft Zira
// Desktop" and "Microsoft David Desktop" through PowerShell). Nothing here touches the network.
// --tracks-only skips the announcements, beds and ad (keeping what media-data.js already holds for them)
// and only re-measures the music, so it runs anywhere. The guest tracks and the 128 kbps copies of Jake's
// larger tracks come from tools/fetch-guest-tracks.mjs, which must run first.
// --beds-only renders just the five announcement music beds (media/beds/, core/bed-data.js), which are
// synthesized, so it runs anywhere too; a full or --audio-only run renders them as well.
// --clips-only renders just the announcement and ad clips (CLIPS) that are new or changed: no MP3 yet, not in
// media-data.js, or listed there with other words, folder or bed. A new voice alone isn't noticed, so name the
// clip (--clips-only happy-hour) to render it again. Every other clip, the tracks and the hub's credits stay as
// they are. A full or --audio-only run renders every clip.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import { coverDesigns, artistPortrait, guestCover, guestPortrait } from './covers.mjs';
import { GUEST_ARTISTS, GUEST_ALBUMS, GUEST_TRACKS, OWN_TRACKS_REENCODED, LICENSES } from '../core/guests.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../../..');
const MEDIA = join(REPO, 'public/projects/ambii-business/media');
const MUSIC = join(REPO, 'public/music');
const OUT_MODULE = join(HERE, '../core/media-data.js');
const MEDIA_URL = '/projects/ambii-business/media';

const depsArg = process.argv.indexOf('--deps');
const deps = depsArg > 0 ? process.argv[depsArg + 1] : process.env.AMBII_MEDIA_DEPS;
if (!deps) throw new Error('Pass --deps <node_modules folder holding sharp, lamejs and music-metadata>');
const require = createRequire(join(resolve(deps), 'x.js'));
const sharp = require('sharp');
const mm = require('music-metadata');
// lamejs 1.2.1's CommonJS entry is broken (MPEGMode is not defined); its single-file build works.
const lamejs = vm.runInNewContext(readFileSync(require.resolve('lamejs/lame.all.js'), 'utf8') + ';lamejs', {
  Int8Array, Int16Array, Int32Array, Float32Array, Float64Array, Uint8Array, Math, console, Array, Object, String, Number, Error,
});

// Jake's tracks in the demo: a fixed list of slugs, each public/music/<slug>.mp3. Other files in public/music
// (super_bitch.wav, and tracks added since) are not in the demo; core/catalogue.js TRACK_INFO must match this list.
// The ones in OWN_TRACKS_REENCODED are served from their 128 kbps copies in media/music/ instead.
const TRACKS = ['uprising', 'marceline', 'alone', 'memories', 'anguish', 'breathe', 'fearless', 'hide_and_seek', 'transition', 'identity', 'stepping_clouds', 'innocence', 'dancin', 'she_wants_my_package'];
const OWN_ART = { alone: 'alone.jpg', hide_and_seek: 'hide_and_seek.jpg', marceline: 'marceline.jpg', memories: 'memories.jpg', transition: 'transition.jpg' };

// Announcement and ad copy. `voice` picks the SAPI voice; `bed` mixes the soft music bed
// under the voice the way the real server's sox pipeline did (3 s padding each side, fades).
const CLIPS = {
  'happy-hour': { dir: 'announcements', voice: 'Microsoft Zira Desktop', bed: true,
    text: "Hey coffee lovers! It's happy hour at Bean & Beat. All iced drinks are half price until five o'clock, so grab a cold brew and stay a while." },
  'closing-soon': { dir: 'announcements', voice: 'Microsoft David Desktop', bed: true,
    text: 'Thanks for spending your evening with us. Bean & Beat closes in fifteen minutes, so please place any last orders at the counter. See you tomorrow!' },
  'loyalty-card': { dir: 'announcements', voice: 'Microsoft Zira Desktop', bed: false,
    text: 'Have you picked up a Bean & Beat loyalty card? Collect a stamp with every drink, and your tenth coffee is on us. Just ask your barista!' },
  'holiday-hours': { dir: 'announcements', voice: 'Microsoft David Desktop', bed: true,
    text: "Happy holidays from everyone at Bean & Beat! On holiday weekends we're open from eight until two. Gift cards are available at the register." },
  // The seeded "Welcome" (core/seed.js reads CLIP_MEDIA.welcome; its voice, en-US-Wavenet-C, is female).
  welcome: { dir: 'announcements', voice: 'Microsoft Zira Desktop', bed: true,
    text: "Welcome to Bean & Beat! We're so glad you stopped in. Our baristas are pulling fresh shots all day, so ask about today's single-origin pour-over, and make yourself at home." },
  'ambii-ad': { dir: 'ads', voice: 'Microsoft Zira Desktop', bed: true,
    text: 'This music is brought to you by Ambii: hand-picked, fully licensed music for your business. Want it ad free? Upgrade to Ambii Premium.' },
};

const SR = 44100;

function ensure(dir) { mkdirSync(dir, { recursive: true }); }

async function writeSizes(input, base, sizes) {
  for (const s of sizes) {
    await sharp(input).resize(s, s, { fit: 'cover' }).flatten({ background: '#2C2033' }).jpeg({ quality: s >= 320 ? 86 : 82, mozjpeg: true }).toFile(`${base}-${s}.jpg`);
  }
}

// hide_and_seek's own art is a grey 16:9 video thumbnail: keep all of it (the title is on it),
// letterboxed on a blurred copy, and give it a two-colour tint so the player's colour extraction finds a palette.
async function duotoneSquare(file) {
  const dark = [27, 20, 100], light = [126, 232, 250];
  async function tone(img, w, h) {
    const { data, info } = await img.resize(w, h, { fit: 'cover' }).greyscale().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(info.width * info.height * 3);
    for (let i = 0; i < info.width * info.height; i++) {
      const t = data[i * info.channels] / 255;
      for (let c = 0; c < 3; c++) out[i * 3 + c] = Math.round(dark[c] + (light[c] - dark[c]) * t);
    }
    return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } });
  }
  const bg = await (await tone(sharp(file), 1080, 1080)).blur(18).modulate({ brightness: 0.8 }).png().toBuffer();
  const fg = await (await tone(sharp(file), 1000, 563)).png().toBuffer();
  return sharp(bg).composite([{ input: fg, left: 40, top: 258 }]).png().toBuffer();
}

async function buildImages() {
  ensure(join(MEDIA, 'covers'));
  for (const slug of TRACKS) {
    let input;
    if (slug === 'hide_and_seek') input = await duotoneSquare(join(REPO, 'public/images/music', OWN_ART[slug]));
    else if (OWN_ART[slug]) input = readFileSync(join(REPO, 'public/images/music', OWN_ART[slug]));
    else input = Buffer.from(coverDesigns[slug]());
    await writeSizes(input, join(MEDIA, 'covers', slug.replace(/_/g, '-')), [640, 320, 120]);
  }
  ensure(join(MEDIA, 'artists'));
  await writeSizes(Buffer.from(artistPortrait()), join(MEDIA, 'artists', 'jake-motta'), [640, 320, 120]);
  // Guest albums (a single is an album named after its track) and guest artists get drawn art.
  ensure(join(MEDIA, 'albums'));
  const drawn = new Set();
  for (const t of GUEST_TRACKS) {
    const slug = t.album || t.slug;
    if (drawn.has(slug)) continue;
    drawn.add(slug);
    const title = t.album ? GUEST_ALBUMS[t.album].title : t.title;
    await writeSizes(Buffer.from(guestCover({ slug, title, artist: GUEST_ARTISTS[t.artist].name, genre: t.genres[0] })), join(MEDIA, 'albums', slug), [640, 320, 120]);
  }
  for (const [key, a] of Object.entries(GUEST_ARTISTS)) {
    await writeSizes(Buffer.from(guestPortrait({ slug: key, name: a.name })), join(MEDIA, 'artists', key), [640, 320, 120]);
  }
  // The logo comes from the dashboard's source, which isn't committed (its repository is private),
  // so anywhere but Jake's machine the logo files already in media/brand/ are kept as they are.
  const logo = join(REPO, 'demos/ambii/business-web/src/images/ambii_logo_inverse.png');
  if (existsSync(logo)) {
    ensure(join(MEDIA, 'brand'));
    await writeSizes(logo, join(MEDIA, 'brand', 'ambii-logo'), [512, 250, 120]);
  } else {
    console.warn('build-media: kept the existing Ambii logo; its source is in demos/ambii/business-web/, which is not committed');
  }
}

// ---------- audio ----------

function speak(text, voice) {
  const dir = join(tmpdir(), 'ambii-media-tts');
  ensure(dir);
  const txt = join(dir, 'in.txt'), wav = join(dir, 'out.wav'), ps1 = join(dir, 'speak.ps1');
  writeFileSync(txt, text, 'utf8');
  writeFileSync(ps1, [
    'param($TextFile, $Voice, $Out)',
    'Add-Type -AssemblyName System.Speech',
    '$s = New-Object System.Speech.Synthesis.SpeechSynthesizer',
    '$s.SelectVoice($Voice)',
    '$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(44100, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)',
    '$s.SetOutputToWaveFile($Out, $fmt)',
    '$s.Speak([System.IO.File]::ReadAllText($TextFile))',
    '$s.Dispose()',
  ].join('\r\n'), 'utf8');
  if (existsSync(wav)) rmSync(wav);
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps1, '-TextFile', txt, '-Voice', voice, '-Out', wav], { stdio: 'inherit' });
  return readWav(readFileSync(wav));
}

function readWav(buf) {
  let pos = 12, fmt = null;
  while (pos < buf.length) {
    const id = buf.toString('ascii', pos, pos + 4), len = buf.readUInt32LE(pos + 4);
    if (id === 'fmt ') fmt = { channels: buf.readUInt16LE(pos + 10), rate: buf.readUInt32LE(pos + 12), bits: buf.readUInt16LE(pos + 22) };
    if (id === 'data') {
      if (!fmt || fmt.bits !== 16 || fmt.channels !== 1 || fmt.rate !== SR) throw new Error('unexpected WAV format ' + JSON.stringify(fmt));
      const n = len / 2, out = new Float32Array(n);
      for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(pos + 8 + i * 2) / 32768;
      return out;
    }
    pos += 8 + len + (len % 2);
  }
  throw new Error('no data chunk');
}

// Trim leading/trailing near-silence SAPI leaves around the speech.
function trimSilence(x) {
  let a = 0, b = x.length - 1;
  while (a < b && Math.abs(x[a]) < 0.004) a++;
  while (b > a && Math.abs(x[b]) < 0.004) b--;
  return x.subarray(Math.max(0, a - SR * 0.05), Math.min(x.length, b + SR * 0.15));
}

// A soft electric-piano-ish pad (Cmaj9, Am9, Fmaj9, G6) with a gentle pluck arpeggio: the "Smooth" bed.
function bed(seconds) {
  const n = Math.ceil(seconds * SR), out = new Float32Array(n);
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const chords = [[48, 52, 55, 59, 62], [45, 48, 52, 55, 59], [41, 45, 48, 52, 55], [43, 47, 50, 52, 57]];
  const chordLen = 3.2;
  for (let c = 0; c * chordLen < seconds + chordLen; c++) {
    const notes = chords[c % chords.length], t0 = c * chordLen;
    for (const m of notes) {
      for (const det of [-0.0025, 0.0025]) {
        const f = hz(m) * (1 + det);
        const start = Math.floor(t0 * SR), end = Math.min(n, Math.floor((t0 + chordLen + 1.2) * SR));
        for (let i = Math.max(0, start); i < end; i++) {
          const t = (i - start) / SR;
          const env = Math.min(1, t / 0.9) * Math.min(1, Math.max(0, (chordLen + 1.2 - t) / 1.2));
          const ph = 2 * Math.PI * f * t;
          out[i] += env * 0.05 * (Math.sin(ph) + 0.25 * Math.sin(2 * ph) + 0.08 * Math.sin(3 * ph));
        }
      }
    }
    const arp = [notes[2] + 12, notes[3] + 12, notes[4] + 12, notes[3] + 12];
    for (let k = 0; k < 8; k++) {
      const f = hz(arp[k % arp.length]), start = Math.floor((t0 + k * (chordLen / 8)) * SR);
      for (let i = Math.max(0, start); i < Math.min(n, start + SR * 1.2); i++) {
        const t = (i - start) / SR;
        out[i] += 0.035 * Math.exp(-t * 4) * Math.sin(2 * Math.PI * f * t) * Math.min(1, t / 0.005);
      }
    }
  }
  return normalize(out, 0.22);
}

function normalize(x, peak) {
  let m = 0;
  for (let i = 0; i < x.length; i++) m = Math.max(m, Math.abs(x[i]));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] *= peak / m;
  return x;
}

function mixWithBed(voice) {
  const pad = 3, total = voice.length / SR + pad * 2;
  const out = bed(total);
  const off = pad * SR;
  for (let i = 0; i < voice.length; i++) out[off + i] += voice[i];
  const fade = 1.5 * SR;
  for (let i = 0; i < out.length; i++) {
    const g = Math.min(1, i / fade, (out.length - 1 - i) / fade);
    out[i] = Math.max(-1, Math.min(1, out[i] * g));
  }
  return out;
}

// ---------- announcement beds ----------
// The server mixed the voice over one of five music beds (announcement.backgroundMusic 2..6: Smooth, Bright,
// Light, Distinct, Mellow; 1 was no music), files of unknown licence. The demo's are synthesized here. Each is
// rendered as a circular loop (a note, echo or reverb tail that runs past the end comes back in at the start),
// so it repeats without a seam. browser/tts.js plays it under browser-spoken announcements with Web Audio,
// looping between loopStart and loopEnd. The file holds more of the loop on each side of that window, so the
// encoder's first frames (it takes about a second to settle), its delay and its final padding all fall outside
// it: in between, every turn encodes to the very same frames.

const BED_DIR = join(MEDIA, 'beds');
const BED_MODULE = join(HERE, '../core/bed-data.js');
const BED_PRE = 2.56; // seconds of the loop before loopStart (two 1.28 s units, see loopOf())
const BED_POST = 1;
const BED_LOUDNESS = 0.07; // every bed equally loud (see loudness()); tts.js plays them at 0.4 of the announcement's volume
const BED_KBPS = 80;

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

// A small seeded PRNG (mulberry32), so a rebuild writes the same files.
function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Adds a rendered sound into the loop at `at` seconds, wrapping round the loop's end.
function place(loop, sound, at, gain = 1) {
  const n = loop.length, s0 = ((Math.round(at * SR) % n) + n) % n;
  for (let i = 0; i < sound.length; i++) loop[(s0 + i) % n] += sound[i] * gain;
}

// Linear attack at the start and linear release at the end.
function shape(x, attack, release) {
  const n = x.length, a = Math.max(1, Math.round(attack * SR)), r = Math.max(1, Math.round(release * SR));
  for (let i = 0; i < Math.min(a, n); i++) x[i] *= i / a;
  for (let i = Math.max(0, n - r); i < n; i++) x[i] *= (n - i) / r;
  return x;
}

// A sum of decaying sine partials, each [frequency ratio, amplitude, decay per second].
function partials(f, seconds, list, attack = 0.004, release = 0.08) {
  const n = Math.round(seconds * SR), out = new Float32Array(n);
  for (const [ratio, amp, decay] of list) {
    if (f * ratio > SR * 0.4) continue;
    const w = (2 * Math.PI * f * ratio) / SR, k = Math.exp(-decay / SR);
    let g = amp;
    for (let i = 0; i < n; i++, g *= k) out[i] += g * Math.sin(w * i);
  }
  return shape(out, attack, release);
}

// Piano-ish: slightly stretched partials, the higher ones (and higher notes) dying sooner.
function piano(m, seconds, vel = 1) {
  const f = midiHz(m), bright = Math.pow(f / 262, 0.35), list = [];
  for (let k = 1; k <= 9; k++) list.push([k * Math.sqrt(1 + 0.00035 * k * k), vel * Math.pow(k, -1.1), (0.8 + 0.75 * k) * bright]);
  return partials(f, seconds, list, 0.003, 0.12);
}

// Music box / celesta: a beating fundamental and a few inharmonic partials.
function bell(m, seconds, vel = 1) {
  return partials(midiHz(m), seconds, [[1, 0.55 * vel, 0.9], [1.0018, 0.45 * vel, 1], [2, 0.2 * vel, 1.8], [3.01, 0.09 * vel, 2.8], [4.17, 0.06 * vel, 4.2], [5.43, 0.03 * vel, 6]], 0.002, 0.3);
}

// A soft pad: two slightly detuned sines and a little octave, slow in and out.
function softPad(m, seconds, attack = 1.2, release = 1.5) {
  return partials(midiHz(m), seconds, [[0.9983, 0.5, 0], [1.0017, 0.5, 0], [2, 0.12, 0.15]], attack, release);
}

function roundBass(m, seconds, vel = 1) {
  return partials(midiHz(m), seconds, [[1, vel, 1.6], [2, 0.35 * vel, 3], [3, 0.12 * vel, 5]], 0.005, 0.05);
}

// Plucked synth bass: a sawtooth's harmonics, the high ones fading fast like a closing filter.
function pluckBass(m, seconds, vel = 1) {
  const list = [];
  for (let k = 1; k <= 14; k++) list.push([k, vel / k, 2 + 2.6 * k]);
  return partials(midiHz(m), seconds, list, 0.003, 0.04);
}

function keysStab(m, seconds, vel = 1) {
  return partials(midiHz(m), seconds, [[1, vel, 5], [2, 0.45 * vel, 8], [3, 0.2 * vel, 12], [4, 0.1 * vel, 16]], 0.003, 0.05);
}

// Karplus-Strong plucked string, tuned with an allpass, the burst shaped for a soft nylon-string pluck.
function pluck(m, seconds, rnd, vel = 1) {
  const f = midiHz(m), n = Math.round(seconds * SR), y = new Float32Array(n), period = SR / f;
  const N = Math.floor(period - 0.6), frac = period - 0.5 - N, c = (1 - frac) / (1 + frac);
  const rho = Math.pow(0.001, 1 / (f * Math.max(1.4, Math.min(4, 4.2 - f / 220))));
  const burst = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) burst[i] = lp = 0.25 * (rnd() * 2 - 1) + 0.75 * lp;
  const pos = Math.max(1, Math.round(N * 0.17)); // plucked about a sixth of the way along
  for (let i = N - 1; i >= pos; i--) burst[i] -= burst[i - pos];
  let apIn = 0, apOut = 0;
  for (let i = 0; i < n; i++) {
    const avg = rho * 0.5 * ((i >= N ? y[i - N] : 0) + (i > N ? y[i - N - 1] : 0));
    apOut = c * avg + apIn - c * apOut;
    apIn = avg;
    y[i] = apOut + (i < N ? burst[i] * vel : 0);
  }
  return shape(y, 0.001, 0.25);
}

function noise(seconds, rnd) {
  const x = new Float32Array(Math.round(seconds * SR));
  for (let i = 0; i < x.length; i++) x[i] = rnd() * 2 - 1;
  return x;
}

function lowpass(x, fc) {
  const a = Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0;
  for (let i = 0; i < x.length; i++) x[i] = y = (1 - a) * x[i] + a * y;
  return x;
}

function highpass(x, fc) {
  const a = Math.exp((-2 * Math.PI * fc) / SR);
  let y = 0, p = 0;
  for (let i = 0; i < x.length; i++) {
    y = a * (y + x[i] - p);
    p = x[i];
    x[i] = y;
  }
  return x;
}

function decaying(x, rate, gain = 1) {
  for (let i = 0; i < x.length; i++) x[i] *= gain * Math.exp((-rate * i) / SR);
  return x;
}

function kick(vel = 1) {
  const n = Math.round(0.45 * SR), x = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (46 + 90 * Math.exp(-t * 30))) / SR;
    x[i] = vel * Math.sin(ph) * Math.exp(-t * 7);
  }
  return shape(x, 0.001, 0.03);
}

function snare(rnd, vel = 1) {
  const body = partials(190, 0.25, [[1, 0.45, 22], [1.6, 0.2, 28]], 0.001, 0.02);
  const hiss = decaying(lowpass(highpass(noise(0.25, rnd), 1500), 8000), 17, 0.9);
  for (let i = 0; i < body.length; i++) body[i] = vel * (body[i] + hiss[i]);
  return shape(body, 0.001, 0.03);
}

function hat(rnd, vel = 1, open = false) {
  const x = decaying(highpass(highpass(noise(open ? 0.4 : 0.09, rnd), 7000), 7000), open ? 9 : 60, vel);
  return shape(x, 0.001, 0.02);
}

function shaker(rnd, vel = 1) {
  return shape(decaying(lowpass(highpass(noise(0.1, rnd), 4500), 10000), 38, vel), 0.008, 0.02);
}

function snap(rnd, vel = 1) {
  return shape(decaying(lowpass(highpass(noise(0.12, rnd), 1200), 4000), 45, vel), 0.001, 0.02);
}

// Runs a stateful per-sample effect over the loop twice and keeps the second pass, so what the effect
// carries past the end (echoes, reverb) comes back in at the start.
function circular(loop, makeStep) {
  const n = loop.length, out = new Float32Array(n), step = makeStep();
  for (let i = 0; i < 2 * n; i++) {
    const v = step(loop[i % n]);
    if (i >= n) out[i - n] = v;
  }
  return out;
}

// The delayed copies only (no dry signal), each a little duller than the last.
function echo(seconds, feedback, tone) {
  return () => {
    const d = Math.round(seconds * SR), buf = new Float32Array(d), a = Math.exp((-2 * Math.PI * tone) / SR);
    let i = 0, lp = 0;
    return (x) => {
      const out = buf[i];
      lp = (1 - a) * out + a * lp;
      buf[i] = x + lp * feedback;
      i = (i + 1) % d;
      return out;
    };
  };
}

// A Freeverb-style room: six damped combs into two allpasses, the reverberation only.
function reverb(rt60) {
  return () => {
    const combs = [1116, 1188, 1277, 1356, 1422, 1557].map((d) => ({ buf: new Float32Array(d), i: 0, lp: 0, g: Math.pow(10, (-3 * d) / (SR * rt60)) }));
    const aps = [556, 441].map((d) => ({ buf: new Float32Array(d), i: 0 }));
    return (x) => {
      let s = 0;
      for (const c of combs) {
        const out = c.buf[c.i];
        c.lp = out * 0.65 + c.lp * 0.35;
        c.buf[c.i] = x + c.lp * c.g;
        c.i = (c.i + 1) % c.buf.length;
        s += out;
      }
      s /= combs.length;
      for (const ap of aps) {
        const b = ap.buf[ap.i];
        ap.buf[ap.i] = s + b * 0.5;
        ap.i = (ap.i + 1) % ap.buf.length;
        s = b - s;
      }
      return s;
    };
  };
}

function rms(x) {
  let sum = 0;
  for (let i = 0; i < x.length; i++) sum += x[i] * x[i];
  return Math.sqrt(sum / x.length);
}

// Adds `wet` (scaled to `amount` of the dry signal's level) into `dry`.
function addWet(dry, wet, amount) {
  const g = (amount * rms(dry)) / (rms(wet) || 1);
  for (let i = 0; i < dry.length; i++) dry[i] += wet[i] * g;
  return dry;
}

// How loud a bed sounds, roughly: its level with the bass weighted down (as it is heard quietly, under a voice).
function loudness(x) {
  const y = highpass(highpass(Float32Array.from(x), 150), 150);
  return rms(lowpass(y, 12000));
}

// Rumble and DC out, every bed to the same loudness, and a soft knee that keeps peaks under 0.9.
function finishBed(loop) {
  const x = circular(loop, () => {
    const a = Math.exp((-2 * Math.PI * 30) / SR);
    let y = 0, p = 0;
    return (v) => {
      y = a * (y + v - p);
      p = v;
      return y;
    };
  });
  const g = BED_LOUDNESS / loudness(x);
  for (let i = 0; i < x.length; i++) {
    const v = x[i] * g, av = Math.abs(v);
    x[i] = av <= 0.6 ? v : Math.sign(v) * (0.6 + 0.3 * Math.tanh((av - 0.6) / 0.3));
  }
  return x;
}

// 2 Smooth: the pad already under the seeded announcements (bed() above), two turns of its four chords, 75 BPM.
function smoothBed(seconds) {
  const skip = 12.8; // from the second turn on, every chord's tail from the one before is in place
  const x = bed(skip + seconds + 0.5);
  return Float32Array.from(x.subarray(Math.round(skip * SR), Math.round((skip + seconds) * SR)));
}

// 3 Bright: bouncy pop piano at 125 BPM in G (G D Em C, twelve bars), a round bass, shaker and finger snaps,
// and a glockenspiel tune in the second and third turns.
function brightBed(seconds) {
  const loop = new Float32Array(Math.round(seconds * SR)), rnd = seeded(3), beat = seconds / 48, bar = 4 * beat;
  const chords = [[43, [67, 71, 74]], [38, [66, 69, 74]], [40, [67, 71, 76]], [36, [67, 72, 76]]];
  const tune = [
    [[0, 79, 1], [1, 81, 0.5], [1.5, 83, 1.5], [3, 81, 1]],
    [[0, 78, 1], [1, 76, 0.5], [1.5, 74, 2.5]],
    [[0, 76, 1], [1, 79, 0.5], [1.5, 83, 1.5], [3, 81, 1]],
    [[0, 79, 1.5], [1.5, 76, 0.5], [2, 74, 2]],
  ];
  for (let b = 0; b < 12; b++) {
    const [root, triad] = chords[b % 4], t0 = b * bar;
    [[0, 0.9, 1.5], [1.5, 0.7, 1.5], [3, 0.8, 1]].forEach(([at, vel, len]) => triad.forEach((m) => place(loop, piano(m, len * beat + 0.15, vel), t0 + at * beat, 0.2)));
    [[0, 0, 1.2], [1.5, 12, 0.4], [2, 0, 1], [3, 7, 0.8], [3.5, 12, 0.4]].forEach(([at, up, len]) => place(loop, roundBass(root + up, len * beat, at % 1 ? 0.7 : 1), t0 + at * beat, 0.22));
    for (let s = 0; s < 16; s++) place(loop, shaker(rnd, [0.5, 0.25, 1, 0.25][s % 4]), t0 + (s * beat) / 4, 0.16);
    [1, 3].forEach((at) => place(loop, snap(rnd), t0 + at * beat, 0.3));
    if (b >= 4) tune[b % 4].forEach(([at, m, len]) => place(loop, bell(m + 12, len * beat + 0.8, 0.9), t0 + at * beat, 0.16));
  }
  return addWet(loop, circular(loop, reverb(1.2)), 0.3);
}

// 4 Light: a slow waltz (80 BPM, 3/4) of music-box bells and their echoes over a high, airy pad in D
// (Dmaj7 Bm9 Gmaj7 Asus2, three bars each). No bass, no drums.
function lightBed(seconds) {
  const loop = new Float32Array(Math.round(seconds * SR)), bells = new Float32Array(loop.length), rnd = seeded(4), beat = seconds / 36, bar = 3 * beat;
  const chords = [
    [[62, 66, 69, 73], [74, 76, 78, 81, 85, 86]],
    [[59, 62, 66, 73], [71, 73, 74, 78, 81, 83]],
    [[55, 62, 66, 71], [71, 74, 76, 78, 79, 83]],
    [[57, 64, 69, 71], [69, 71, 73, 76, 81, 83]],
  ];
  let idx = 2;
  for (let b = 0; b < 12; b++) {
    const [pad, notes] = chords[Math.floor(b / 3) % 4], t0 = b * bar;
    if (b % 3 === 0) pad.forEach((m) => place(loop, softPad(m, 3 * bar + 1.5, 1.5, 2), t0, 0.07));
    for (let k = 0; k < 3; k++) {
      if (k > 0 && rnd() < 0.5) continue;
      idx = Math.max(0, Math.min(notes.length - 1, idx + Math.round((rnd() - 0.5) * 3.2)));
      place(bells, bell(notes[idx], 2.6, 0.65 + 0.35 * rnd()), t0 + k * beat, 0.3);
      if (rnd() < 0.18) place(bells, bell(notes[Math.min(notes.length - 1, idx + 1)], 2, 0.5), t0 + (k + 0.5) * beat, 0.3);
    }
  }
  addWet(bells, circular(bells, echo(beat * 0.75, 0.35, 3500)), 0.35); // dotted-eighth echoes
  for (let i = 0; i < loop.length; i++) loop[i] += bells[i];
  return addWet(loop, circular(loop, reverb(2.6)), 0.5);
}

// 5 Distinct: a 99 BPM groove in A minor (Am7 D9 four times, then Fmaj7 E7sus4): kick, snare and hats, a
// plucked synth bass and short keyboard stabs.
function distinctBed(seconds) {
  const loop = new Float32Array(Math.round(seconds * SR)), rnd = seeded(5), bars = 10, beat = seconds / (4 * bars), step = beat / 4, bar = 4 * beat;
  const minor = [0, 0, 12, 0, 10, 12, 7];
  const chords = [[33, [55, 60, 64, 69], minor], [38, [54, 60, 64, 69], minor]];
  const turnaround = [[41, [52, 57, 60, 65], [0, 0, 12, 0, 7, 12, 4]], [40, [50, 57, 59, 64], [0, 0, 12, 0, 10, 12, 5]]];
  for (let b = 0; b < bars; b++) {
    const t0 = b * bar, even = b % 2 === 0, last = b === bars - 1;
    const [root, stab, offsets] = b >= bars - 2 ? turnaround[b - (bars - 2)] : chords[b % 2];
    (even ? [0, 7, 8] : [0, 3, 8, 10]).forEach((s) => place(loop, kick(s % 8 ? 0.75 : 1), t0 + s * step, 0.4));
    [4, 12].forEach((s) => place(loop, snare(rnd), t0 + s * step, 0.45));
    if (!even && !last) place(loop, snare(rnd, 0.3), t0 + 15 * step, 0.45);
    if (last) [13, 14, 15].forEach((s, k) => place(loop, snare(rnd, 0.4 + 0.2 * k), t0 + s * step, 0.45));
    for (let s = 0; s < 16; s += 2) {
      const open = s === 14 && !even && !last;
      place(loop, hat(rnd, open ? 0.8 : s % 4 === 2 ? 1 : 0.6, open), t0 + s * step, 0.3);
    }
    [[0, 3], [3, 1], [6, 1], [8, 2], [10, 1], [11, 1], [14, 2]].forEach(([s, len], k) => place(loop, pluckBass(root + offsets[k], len * step + 0.05, s % 4 ? 0.75 : 1), t0 + s * step, 0.22));
    [6, 14].forEach((s) => stab.forEach((m) => place(loop, keysStab(m, 0.22, 0.9), t0 + s * step, 0.15)));
    if (!even) stab.forEach((m) => place(loop, keysStab(m, 0.16, 0.6), t0 + 3 * step, 0.15));
  }
  return addWet(loop, circular(loop, reverb(0.8)), 0.15);
}

// 6 Mellow: a fingerpicked nylon-string guitar in E minor, a slow 6/8 lilt (Em9 Cmaj7 Gmaj7 D/F#, two bars
// each), with a warm, low pad.
function mellowBed(seconds) {
  const loop = new Float32Array(Math.round(seconds * SR)), rnd = seeded(6), eighth = seconds / 48, bar = 6 * eighth;
  const chords = [
    [[40, 47, 55, 62, 66], [52, 59]],
    [[48, 55, 59, 64, 67], [48, 55]],
    [[43, 50, 54, 59, 62], [55, 62]],
    [[42, 50, 57, 62, 64], [50, 57]],
  ];
  const patterns = [[0, 2, 3, 4, 3, 2], [0, 3, 2, 4, 1, 3]];
  for (let b = 0; b < 8; b++) {
    const [notes, pad] = chords[Math.floor(b / 2) % 4], t0 = b * bar;
    patterns[b % 2].forEach((i, k) => {
      const vel = (i === 0 ? 1 : 0.62) * (0.85 + 0.15 * rnd());
      place(loop, pluck(notes[i], 3.2, rnd, vel), t0 + k * eighth + (rnd() - 0.5) * 0.016, 0.5);
    });
    if (b % 2 === 0) pad.forEach((m) => place(loop, softPad(m, 2 * bar + 1, 1.2, 1.5), t0, 0.035));
  }
  const warm = circular(loop, () => {
    const a = Math.exp((-2 * Math.PI * 2500) / SR);
    let y = 0;
    return (v) => (y = (1 - a) * v + a * y);
  });
  return addWet(warm, circular(warm, reverb(1.6)), 0.4);
}

// Every loop lasts a multiple of 1.28 s: 49 MP3 frames of 1152 samples at 44.1 kHz, and a whole number of
// samples at 48 kHz too. So each turn encodes to the same frames, and a browser decoding (and resampling) to
// either rate loops it sample for sample. The tempos are set to fit.
const loopOf = (seconds) => (Math.round(seconds / 1.28) * 49 * 1152) / SR;
const BEDS = [
  { n: 2, name: 'Smooth', seconds: loopOf(25.6), render: smoothBed }, // 25.6 s
  { n: 3, name: 'Bright', seconds: loopOf(23), render: brightBed }, // 23.04 s, 125 BPM
  { n: 4, name: 'Light', seconds: loopOf(27), render: lightBed }, // 26.88 s, 80 BPM
  { n: 5, name: 'Distinct', seconds: loopOf(24), render: distinctBed }, // 24.32 s, 99 BPM
  { n: 6, name: 'Mellow', seconds: loopOf(24), render: mellowBed }, // 24.32 s
];

// Renders the beds into media/beds/<n>.mp3 and writes core/bed-data.js (not media-data.js). Only lamejs is used, no SAPI.
async function buildBeds() {
  ensure(BED_DIR);
  const beds = {};
  for (const b of BEDS) {
    const loop = finishBed(b.render(b.seconds)), n = loop.length;
    // The loop from its first beat, round and round for BED_PRE + seconds + BED_POST: the window
    // [BED_PRE, BED_PRE + seconds) is one whole turn, wherever the decoder starts.
    const samples = new Float32Array(n + Math.round((BED_PRE + BED_POST) * SR));
    for (let i = 0; i < samples.length; i++) samples[i] = loop[i % n];
    const file = join(BED_DIR, b.n + '.mp3');
    writeFileSync(file, encodeMp3(samples, SR, BED_KBPS));
    const pre = Math.round(BED_PRE * SR);
    beds[b.n] = { url: `${MEDIA_URL}/beds/${b.n}.mp3`, name: b.name, duration: n / SR, loopStart: pre / SR, loopEnd: (pre + n) / SR };
    console.log('bed', b.n, b.name, b.seconds.toFixed(3) + ' s', readFileSync(file).length + ' bytes');
  }
  writeFileSync(BED_MODULE, `// Generated by tools/build-media.mjs (--beds-only renders just these). Do not edit by hand.
// The music beds the server mixed under spoken announcements, by announcement.backgroundMusic (1 is no music):
// synthesized loops that browser/tts.js plays under browser-spoken announcements. duration is the loop's length
// in seconds. Each file loops seamlessly between loopStart and loopEnd (seconds into the decoded file) and holds a
// little more of the loop on each side of that window.

export var BED_MEDIA = ${JSON.stringify(beds, null, 2)};
`);
  console.log('wrote', BED_MODULE);
}

function encodeMp3(samples, rate = SR, kbps = 96) {
  const enc = new lamejs.Mp3Encoder(1, rate, kbps);
  const pcm = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767)));
  const parts = [];
  for (let i = 0; i < pcm.length; i += 1152) {
    const b = enc.encodeBuffer(pcm.subarray(i, i + 1152));
    if (b.length) parts.push(Buffer.from(b));
  }
  parts.push(Buffer.from(enc.flush()));
  return Buffer.concat(parts);
}

async function duration(file) {
  const m = await mm.parseFile(file, { duration: true });
  return Math.round(m.format.duration * 1000) / 1000;
}

// Renders the clips in `only` (every clip when it is null); the others keep their entries in `previous`, the
// media-data.js module as it stands, and so does the silent clip.
async function buildClips(only, previous) {
  const clips = {};
  for (const [id, c] of Object.entries(CLIPS)) {
    if (only && !only.includes(id)) {
      clips[id] = previous.CLIP_MEDIA[id];
      continue;
    }
    ensure(join(MEDIA, c.dir));
    const voice = normalize(trimSilence(speak(c.text, c.voice)), 0.9);
    const samples = c.bed ? mixWithBed(voice) : voice;
    const file = join(MEDIA, c.dir, id + '.mp3');
    writeFileSync(file, encodeMp3(samples));
    clips[id] = { url: `${MEDIA_URL}/${c.dir}/${id}.mp3`, duration: await duration(file), text: c.text, bed: c.bed };
    console.log('clip', id, clips[id].duration);
  }
  if (only && !only.length) console.log('clips: none new or changed');
  // One second of silence (16 kHz, 16 kbps), served by the mock for TTS URLs fetched as audio by mistake.
  const silence = only ? previous.SILENCE_MP3_BASE64 : encodeMp3(new Float32Array(16000), 16000, 16).toString('base64');
  return { clips, silence };
}

// The clips --clips-only renders: the ids named after it, or else the ones that are new or changed against
// `listed` (media-data.js's CLIP_MEDIA).
function clipsToRender(argv, listed) {
  const named = [];
  for (let i = argv.indexOf('--clips-only') + 1; i < argv.length && !argv[i].startsWith('--'); i++) named.push(argv[i]);
  const unknown = named.filter((id) => !Object.prototype.hasOwnProperty.call(CLIPS, id));
  if (unknown.length) throw new Error(`no clip ${unknown.join(', ')} in CLIPS`);
  if (named.length) return named;
  return Object.keys(CLIPS).filter((id) => {
    const c = CLIPS[id], was = listed[id];
    return !was || !existsSync(join(MEDIA, c.dir, id + '.mp3')) || was.text !== c.text || was.bed !== c.bed || was.url !== `${MEDIA_URL}/${c.dir}/${id}.mp3`;
  });
}

// Jake's tracks (from public/music, or their 128 kbps copies in media/music) and the guest tracks (media/tracks).
async function measureTracks() {
  const tracks = {};
  for (const slug of TRACKS) {
    const own = Object.prototype.hasOwnProperty.call(OWN_TRACKS_REENCODED, slug);
    const file = own ? join(MEDIA, 'music', slug + '.mp3') : join(MUSIC, slug + '.mp3');
    if (!existsSync(file)) throw new Error(`missing ${file}: run tools/fetch-guest-tracks.mjs first`);
    tracks[slug] = { url: own ? `${MEDIA_URL}/music/${slug}.mp3` : `/music/${slug}.mp3`, duration: await duration(file), bytes: readFileSync(file).length };
  }
  const guests = {};
  for (const t of GUEST_TRACKS) {
    const file = join(MEDIA, 'tracks', t.slug + '.mp3');
    if (!existsSync(file)) throw new Error(`missing ${file}: run tools/fetch-guest-tracks.mjs first`);
    guests[t.slug] = { url: `${MEDIA_URL}/tracks/${t.slug}.mp3`, duration: await duration(file), bytes: readFileSync(file).length };
  }
  return { tracks, guests };
}

// The hub's music credits, between the <!-- credits:start --> and <!-- credits:end --> markers in its index.html,
// written from core/guests.js so the list can't drift from the catalogue. The hub is uploaded on every deploy.
function writeCredits(guests) {
  const hub = join(MEDIA, '..', 'index.html');
  const html = readFileSync(hub, 'utf8');
  const start = html.indexOf('<!-- credits:start -->'), end = html.indexOf('<!-- credits:end -->');
  if (start < 0 || end < start) throw new Error('the hub has no credits markers');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const artists = new Set(GUEST_TRACKS.map((t) => t.artist));
  const minutes = Math.round(Object.values(guests).reduce((a, g) => a + g.duration, 0) / 60);
  const byArtist = [...artists].sort((a, b) => GUEST_ARTISTS[a].name.localeCompare(GUEST_ARTISTS[b].name));
  const items = byArtist.map((key) => {
    const a = GUEST_ARTISTS[key];
    const tracks = GUEST_TRACKS.filter((t) => t.artist === key).map((t) => {
      const album = t.album ? `, from <cite>${esc(GUEST_ALBUMS[t.album].title)}</cite>` : '';
      return `<li>“${esc(t.title)}”${album} · <a href="${esc(t.page)}">source</a> · <a href="${esc(LICENSES[t.license].url)}">${esc(t.license)}</a></li>`;
    });
    return `              <li><a href="${esc(a.site)}">${esc(a.name)}</a>\n                <ul>\n                  ${tracks.join('\n                  ')}\n                </ul>\n              </li>`;
  });
  const block = `<!-- credits:start -->
          <!-- Written by demos/ambii/mock-server/tools/build-media.mjs from core/guests.js. Edit that file, not this list. -->
          <p>
            Besides 14 of my own tracks, the stations play ${GUEST_TRACKS.length} tracks (${minutes} minutes) by ${artists.size} artists who release their music under
            Creative Commons licences or into the public domain. Each was downloaded from the artist's or the library's own site and re-encoded to 128 kbps for the
            demo; the album covers and artist pictures in the apps were drawn for it.
          </p>
          <details>
            <summary>Every track, its source and licence</summary>
            <ul class="credits__list">
${items.join('\n')}
            </ul>
          </details>
          `;
  writeFileSync(hub, html.slice(0, start) + block + html.slice(end));
  console.log('wrote the credits into', hub);
}

const bedsOnly = process.argv.includes('--beds-only');
const tracksOnly = process.argv.includes('--tracks-only');
const clipsOnly = process.argv.includes('--clips-only');
const images = !process.argv.includes('--audio-only') && !tracksOnly && !bedsOnly && !clipsOnly;
const audio = !process.argv.includes('--images-only') && !bedsOnly;
if (images) await buildImages();
if (bedsOnly || (audio && !tracksOnly && !clipsOnly)) await buildBeds();
if (audio) {
  // --tracks-only keeps the clips already measured in media-data.js, and --clips-only the other clips and the tracks.
  const previous = tracksOnly || clipsOnly ? await import(pathToFileURL(OUT_MODULE).href + '?t=' + Date.now()) : null;
  if (clipsOnly) {
    const unmeasured = TRACKS.filter((s) => !previous.TRACK_MEDIA[s]).concat(GUEST_TRACKS.map((t) => t.slug).filter((s) => !previous.GUEST_MEDIA[s]));
    if (unmeasured.length) throw new Error(`media-data.js has no measurements for ${unmeasured.join(', ')}: run without --clips-only`);
  }
  const { clips, silence } = tracksOnly ? { clips: previous.CLIP_MEDIA, silence: previous.SILENCE_MP3_BASE64 } : await buildClips(clipsOnly ? clipsToRender(process.argv, previous.CLIP_MEDIA) : null, previous);
  const { tracks, guests } = clipsOnly ? { tracks: previous.TRACK_MEDIA, guests: previous.GUEST_MEDIA } : await measureTracks();
  const art = (slug) => `${MEDIA_URL}/covers/${slug.replace(/_/g, '-')}`;
  const src = `// Generated by tools/build-media.mjs from the files in public/. Do not edit by hand.
// Durations are measured from the MP3s (seconds).

export var MEDIA_URL = ${JSON.stringify(MEDIA_URL)};

export var TRACK_MEDIA = ${JSON.stringify(Object.fromEntries(TRACKS.map((s) => [s, Object.assign({}, tracks[s], { cover: art(s) })])), null, 2)};

export var GUEST_MEDIA = ${JSON.stringify(guests, null, 2)};

export var CLIP_MEDIA = ${JSON.stringify(clips, null, 2)};

export var ARTIST_PORTRAIT = ${JSON.stringify(MEDIA_URL + '/artists/jake-motta')};
export var AMBII_LOGO = ${JSON.stringify(MEDIA_URL + '/brand/ambii-logo')};

export var SILENCE_MP3_BASE64 = ${JSON.stringify(silence)};
`;
  writeFileSync(OUT_MODULE, src);
  console.log('wrote', OUT_MODULE);
  if (!clipsOnly) writeCredits(guests);
}
