// Builds the Ambii demo media into public/projects/ambii-business/media/ and writes
// mock-server/core/media-data.js (measured durations, the embedded silent clip).
//
//   node demos/ambii/mock-server/tools/build-media.mjs --deps <node_modules folder>
//
// Needs, in that node_modules folder: sharp 0.33, lamejs 1.2.1, music-metadata 7.
// Needs Windows (announcements are spoken by the built-in SAPI voices "Microsoft Zira
// Desktop" and "Microsoft David Desktop" through PowerShell). Nothing here touches the network.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import vm from 'node:vm';
import { coverDesigns, artistPortrait } from './covers.mjs';

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

// The demo catalogue: a fixed list of slugs, each public/music/<slug>.mp3. Other files in public/music
// (super_bitch.wav, and tracks added since) are not in the demo; core/catalogue.js TRACK_INFO must match this list.
const TRACKS = ['uprising', 'marceline', 'alone', 'memories', 'anguish', 'breathe', 'fearless', 'hide_and_seek', 'transition', 'identity', 'stepping_clouds', 'innocence', 'dancin'];
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

async function buildAudio() {
  const clips = {};
  for (const [id, c] of Object.entries(CLIPS)) {
    ensure(join(MEDIA, c.dir));
    const voice = normalize(trimSilence(speak(c.text, c.voice)), 0.9);
    const samples = c.bed ? mixWithBed(voice) : voice;
    const file = join(MEDIA, c.dir, id + '.mp3');
    writeFileSync(file, encodeMp3(samples));
    clips[id] = { url: `${MEDIA_URL}/${c.dir}/${id}.mp3`, duration: await duration(file), text: c.text, bed: c.bed };
    console.log('clip', id, clips[id].duration);
  }
  const tracks = {};
  for (const slug of TRACKS) {
    const file = join(MUSIC, slug + '.mp3');
    tracks[slug] = { url: `/music/${slug}.mp3`, duration: await duration(file), bytes: readFileSync(file).length };
  }
  // One second of silence (16 kHz, 16 kbps), served by the mock for TTS URLs fetched as audio by mistake.
  const silence = encodeMp3(new Float32Array(16000), 16000, 16).toString('base64');
  return { clips, tracks, silence };
}

const images = !process.argv.includes('--audio-only');
const audio = !process.argv.includes('--images-only');
if (images) await buildImages();
if (audio) {
  const { clips, tracks, silence } = await buildAudio();
  const art = (slug) => `${MEDIA_URL}/covers/${slug.replace(/_/g, '-')}`;
  const src = `// Generated by tools/build-media.mjs from the files in public/. Do not edit by hand.
// Durations are measured from the MP3s (seconds).

export var MEDIA_URL = ${JSON.stringify(MEDIA_URL)};

export var TRACK_MEDIA = ${JSON.stringify(Object.fromEntries(TRACKS.map((s) => [s, Object.assign({}, tracks[s], { cover: art(s) })])), null, 2)};

export var CLIP_MEDIA = ${JSON.stringify(clips, null, 2)};

export var ARTIST_PORTRAIT = ${JSON.stringify(MEDIA_URL + '/artists/jake-motta')};
export var AMBII_LOGO = ${JSON.stringify(MEDIA_URL + '/brand/ambii-logo')};

export var SILENCE_MP3_BASE64 = ${JSON.stringify(silence)};
`;
  writeFileSync(OUT_MODULE, src);
  console.log('wrote', OUT_MODULE);
}
