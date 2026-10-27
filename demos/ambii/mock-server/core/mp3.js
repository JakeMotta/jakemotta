// MP3 duration from the bytes (the server used mp3-duration): Xing/Info or VBRI header when present,
// otherwise a scan of every MPEG audio frame. Returns seconds, or 0 when the data is not MPEG audio.

var V1L1 = [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448];
var V1L2 = [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384];
var V1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
var V2L1 = [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256];
var V2L23 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
var RATES = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

function frameAt(b, i) {
  if (i + 4 > b.length || b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) return null;
  var ver = (b[i + 1] >> 3) & 3, layerBits = (b[i + 1] >> 1) & 3;
  var brIdx = (b[i + 2] >> 4) & 15, srIdx = (b[i + 2] >> 2) & 3;
  if (ver === 1 || layerBits === 0 || brIdx === 0 || brIdx === 15 || srIdx === 3) return null;
  var layer = 4 - layerBits;
  var sr = RATES[ver][srIdx];
  var table = ver === 3 ? (layer === 1 ? V1L1 : layer === 2 ? V1L2 : V1L3) : layer === 1 ? V2L1 : V2L23;
  var br = table[brIdx] * 1000;
  var pad = (b[i + 2] >> 1) & 1;
  var samples = layer === 1 ? 384 : layer === 3 && ver !== 3 ? 576 : 1152;
  var len = layer === 1 ? (Math.floor((12 * br) / sr) + pad) * 4 : Math.floor(((samples / 8) * br) / sr) + pad;
  var mono = ((b[i + 3] >> 6) & 3) === 3;
  return { ver: ver, layer: layer, sr: sr, samples: samples, len: len, mono: mono };
}

function u32(b, i) {
  return ((b[i] << 24) >>> 0) + (b[i + 1] << 16) + (b[i + 2] << 8) + b[i + 3];
}

function tag(b, i, s) {
  for (var k = 0; k < s.length; k++) if (b[i + k] !== s.charCodeAt(k)) return false;
  return true;
}

export function mp3Duration(input) {
  var b = input instanceof Uint8Array ? input : new Uint8Array(input);
  var pos = 0;
  if (b.length > 10 && tag(b, 0, 'ID3')) {
    pos = 10 + ((b[6] & 0x7f) << 21) + ((b[7] & 0x7f) << 14) + ((b[8] & 0x7f) << 7) + (b[9] & 0x7f);
    if (b[5] & 0x10) pos += 10;
  }
  var end = b.length;
  if (end > 128 && tag(b, end - 128, 'TAG')) end -= 128;

  // First frame: a valid header followed by another valid header.
  var first = null;
  for (; pos < end - 4; pos++) {
    var f = frameAt(b, pos);
    if (f && f.len > 4 && frameAt(b, pos + f.len)) {
      first = f;
      break;
    }
  }
  if (!first) return 0;

  // Xing / Info (VBR and LAME CBR files)
  var side = first.ver === 3 ? (first.mono ? 17 : 32) : first.mono ? 9 : 17;
  var x = pos + 4 + side;
  if (tag(b, x, 'Xing') || tag(b, x, 'Info')) {
    var flags = u32(b, x + 4);
    if (flags & 1) {
      var frames = u32(b, x + 8);
      if (frames > 0) return (frames * first.samples) / first.sr;
    }
  }
  // VBRI (Fraunhofer)
  if (tag(b, pos + 36, 'VBRI')) {
    var vf = u32(b, pos + 36 + 14);
    if (vf > 0) return (vf * first.samples) / first.sr;
  }

  var seconds = 0, misses = 0;
  while (pos < end - 4) {
    var fr = frameAt(b, pos);
    if (fr && fr.len > 4) {
      seconds += fr.samples / fr.sr;
      pos += fr.len;
      misses = 0;
    } else {
      pos++;
      if (++misses > 65536) break;
    }
  }
  return seconds;
}
