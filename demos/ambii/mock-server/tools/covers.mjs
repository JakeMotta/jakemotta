// SVG designs for the demo cover art that has no artwork of its own.
// Each returns a 640x640 SVG string; build-media.mjs rasterizes them with sharp.
// Every design has its own palette so the web player's colour extraction differs per track.

const W = 640;

// Small deterministic PRNG so rebuilding gives the same pictures.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function frame(body, { title, sub = 'JAKE MOTTA', ink = '#ffffff', shade = 'rgba(0,0,0,0.35)', size = 52 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
${body}
<g font-family="Segoe UI, Arial, sans-serif">
  <text x="44" y="${W - 74}" font-size="${size}" font-weight="800" fill="${shade}" transform="translate(3 3)">${esc(title)}</text>
  <text x="44" y="${W - 74}" font-size="${size}" font-weight="800" fill="${ink}">${esc(title)}</text>
  <text x="46" y="${W - 40}" font-size="20" font-weight="600" letter-spacing="6" fill="${ink}" opacity="0.85">${esc(sub)}</text>
</g>
</svg>`;
}

export const coverDesigns = {
  // Synthwave sunrise.
  uprising: () => {
    const rays = [];
    for (let i = 0; i < 18; i++) {
      const a = Math.PI + (i + 0.5) * (Math.PI / 18);
      const x1 = 320 + Math.cos(a - 0.04) * 700, y1 = 420 + Math.sin(a - 0.04) * 700;
      const x2 = 320 + Math.cos(a + 0.04) * 700, y2 = 420 + Math.sin(a + 0.04) * 700;
      rays.push(`<polygon points="320,420 ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="#ffd166" opacity="${i % 2 ? 0.10 : 0.18}"/>`);
    }
    const bands = [];
    for (let i = 0; i < 7; i++) bands.push(`<rect x="0" y="${330 + i * 14 + i * i * 2}" width="${W}" height="${3 + i * 1.6}" fill="#2b1055"/>`);
    return frame(`
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset="0.55" stop-color="#d53a9d"/><stop offset="1" stop-color="#ff7b00"/></linearGradient>
  <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset="0.6" stop-color="#ffb347"/><stop offset="1" stop-color="#ff5e62"/></linearGradient>
</defs>
<rect width="${W}" height="${W}" fill="url(#sky)"/>
${rays.join('\n')}
<circle cx="320" cy="420" r="190" fill="url(#sun)"/>
${bands.join('\n')}
<rect y="455" width="${W}" height="${W - 455}" fill="#2b1055" opacity="0.92"/>
<g stroke="#ff4fd8" stroke-width="2" opacity="0.7">
  ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="0" y1="${470 + i * i * 6}" x2="${W}" y2="${470 + i * i * 6}"/>`).join('')}
  ${[-6, -4, -2, 0, 2, 4, 6].map((i) => `<line x1="${320 + i * 30}" y1="455" x2="${320 + i * 160}" y2="${W}"/>`).join('')}
</g>`, { title: 'Uprising' });
  },

  // Shattered crimson glass.
  anguish: () => {
    const r = rng(7);
    const shards = [];
    const reds = ['#e63946', '#9d0208', '#ff006e', '#6a040f', '#ff4d6d', '#d00000'];
    for (let i = 0; i < 26; i++) {
      const cx = r() * W, cy = r() * W * 0.85;
      const pts = [];
      const n = 3 + Math.floor(r() * 2);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + r() * 0.8, d = 30 + r() * 120;
        pts.push(`${(cx + Math.cos(a) * d).toFixed(1)},${(cy + Math.sin(a) * d).toFixed(1)}`);
      }
      shards.push(`<polygon points="${pts.join(' ')}" fill="${reds[i % reds.length]}" opacity="${(0.35 + r() * 0.55).toFixed(2)}"/>`);
    }
    return frame(`
<defs><radialGradient id="g" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#5c0a1e"/><stop offset="1" stop-color="#12030a"/></radialGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${shards.join('\n')}
<polyline points="90,0 170,120 140,190 260,300 230,380 350,470 330,560 420,640" fill="none" stroke="#fff0f3" stroke-width="5" opacity="0.9"/>
<polyline points="260,300 380,260 470,330 600,300" fill="none" stroke="#fff0f3" stroke-width="3" opacity="0.7"/>`, { title: 'Anguish', ink: '#fff0f3' });
  },

  // Slow concentric breaths in teal.
  breathe: () => {
    const rings = [];
    for (let i = 1; i <= 11; i++) rings.push(`<circle cx="320" cy="280" r="${i * 34}" fill="none" stroke="#e0fff8" stroke-width="${(7 - i * 0.5).toFixed(1)}" opacity="${(1 - i * 0.08).toFixed(2)}"/>`);
    return frame(`
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#05445e"/><stop offset="0.6" stop-color="#189ab4"/><stop offset="1" stop-color="#75e6da"/></linearGradient>
  <radialGradient id="c" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#d4f1f4"/><stop offset="1" stop-color="#d4f1f4" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
<circle cx="320" cy="280" r="220" fill="url(#c)" opacity="0.55"/>
${rings.join('\n')}
<circle cx="320" cy="280" r="26" fill="#ffffff"/>`, { title: 'Breathe', shade: 'rgba(5,68,94,0.45)' });
  },

  // Disco dots and a mirror ball.
  dancin: () => {
    const dots = [];
    const cols = ['#ffd60a', '#ff5d8f', '#c77dff', '#4cc9f0', '#80ffdb'];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const d = Math.hypot(x - 7.5, y - 5.5);
      dots.push(`<circle cx="${20 + x * 40}" cy="${20 + y * 40}" r="${Math.max(2, 13 - d * 1.3).toFixed(1)}" fill="${cols[(x + y) % cols.length]}" opacity="0.9"/>`);
    }
    const tiles = [];
    for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) {
      if (x * x + y * y > 26) continue;
      tiles.push(`<rect x="${320 + x * 16 - 7}" y="${230 + y * 16 - 7}" width="14" height="14" fill="${(x + y) % 3 === 0 ? '#ffffff' : (x * y) % 2 ? '#b8c0ff' : '#e0e1ff'}"/>`);
    }
    return frame(`
<rect width="${W}" height="${W}" fill="#1a0b2e"/>
${dots.join('\n')}
<circle cx="320" cy="230" r="92" fill="#3c096c"/>
${tiles.join('\n')}
<line x1="320" y1="0" x2="320" y2="138" stroke="#e0e1ff" stroke-width="3"/>`, { title: 'Dancin', shade: 'rgba(26,11,46,0.8)' });
  },

  // Lightning bolt on electric blue.
  fearless: () => {
    const stripes = [];
    for (let i = -10; i < 20; i++) stripes.push(`<polygon points="${i * 48},0 ${i * 48 + 22},0 ${i * 48 + 22 - 640},640 ${i * 48 - 640},640" fill="#ffffff" opacity="0.07"/>`);
    return frame(`
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0029ff"/><stop offset="1" stop-color="#00c2ff"/></linearGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${stripes.join('\n')}
<g transform="translate(320 270) scale(0.82) translate(-320 -300)"><polygon points="372,40 196,330 300,330 236,560 452,240 338,240 412,40" fill="#001a66" transform="translate(14 14)" opacity="0.6"/>
<polygon points="372,40 196,330 300,330 236,560 452,240 338,240 412,40" fill="#ffe600" stroke="#fff6a6" stroke-width="6" stroke-linejoin="round"/></g>`, { title: 'Fearless', shade: 'rgba(0,26,102,0.6)' });
  },

  // Overlapping rotated squares in violet.
  identity: () => {
    const sq = [];
    const cols = ['#7b2cbf', '#c77dff', '#ff70a6', '#3a0ca3', '#4361ee', '#f72585'];
    for (let i = 0; i < 12; i++) {
      const s = 360 - i * 24;
      sq.push(`<rect x="${320 - s / 2}" y="${270 - s / 2}" width="${s}" height="${s}" rx="18" fill="none" stroke="${cols[i % cols.length]}" stroke-width="10" opacity="0.85" transform="rotate(${i * 9} 320 270)"/>`);
    }
    return frame(`
<defs><radialGradient id="g" cx="0.5" cy="0.42" r="0.8"><stop offset="0" stop-color="#240046"/><stop offset="1" stop-color="#10002b"/></radialGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${sq.join('\n')}
<circle cx="320" cy="270" r="34" fill="#ffd6ff"/>`, { title: 'Identity' });
  },

  // Pastel blobs and a little flower.
  innocence: () => {
    const r = rng(42);
    const blobs = [];
    const cols = ['#ffb4a2', '#cdb4db', '#ffc8dd', '#bde0fe', '#fde4cf', '#a2d2ff'];
    for (let i = 0; i < 9; i++) blobs.push(`<ellipse cx="${(r() * W).toFixed(0)}" cy="${(r() * 520).toFixed(0)}" rx="${(90 + r() * 120).toFixed(0)}" ry="${(70 + r() * 100).toFixed(0)}" fill="${cols[i % cols.length]}" opacity="0.75" filter="url(#b)"/>`);
    const petals = [];
    for (let i = 0; i < 8; i++) petals.push(`<ellipse cx="320" cy="200" rx="26" ry="62" fill="#ffffff" transform="rotate(${i * 45} 320 262)"/>`);
    return frame(`
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd6c9"/><stop offset="1" stop-color="#cbb7ff"/></linearGradient>
  <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
</defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${blobs.join('\n')}
${petals.join('\n')}
<circle cx="320" cy="262" r="30" fill="#ffb703"/>`, { title: 'Innocence', ink: '#5a189a', shade: 'rgba(255,255,255,0.6)' });
  },

  // Neon waves over a horizon grid, in the guest-cover style.
  she_wants_my_package: () => guestCover({ slug: 'she_wants_my_package', title: 'She wants my package', artist: 'Jake Motta', genre: 'electro' }),

  // Clouds climbing like stairs across a pink sky.
  stepping_clouds: () => {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      const x = 40 + i * 120, y = 440 - i * 78;
      clouds.push(`<g opacity="${(0.75 + i * 0.05).toFixed(2)}"><rect x="${x}" y="${y}" width="150" height="46" rx="23" fill="#ffffff"/><circle cx="${x + 50}" cy="${y + 4}" r="30" fill="#ffffff"/><circle cx="${x + 96}" cy="${y - 6}" r="38" fill="#ffffff"/></g>`);
    }
    return frame(`
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d5af1"/><stop offset="0.55" stop-color="#6ec6ff"/><stop offset="1" stop-color="#ffb6d9"/></linearGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
<circle cx="520" cy="110" r="54" fill="#fff4c2" opacity="0.9"/>
${clouds.join('\n')}`, { title: 'Stepping Clouds', size: 46, shade: 'rgba(61,90,241,0.45)' });
  },
};

// ---------- guest art ----------
// The guest tracks (core/guests.js) come without artwork we may reuse (an album's art is often under
// other terms than its music), so each album gets a drawn cover in a style that suits its first genre,
// with a palette picked from its slug, and each guest artist a drawn portrait.

function hashSeed(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const PALETTES = [
  ['#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#f4d35e'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#3d0c02', '#7f1d1d', '#c2410c', '#f59e0b', '#fde68a'],
  ['#1b1b3a', '#693668', '#a74482', '#f84aa7', '#ff3562'],
  ['#0d1b2a', '#1b263b', '#415a77', '#778da9', '#e0e1dd'],
  ['#132a13', '#31572c', '#4f772d', '#90a955', '#ecf39e'],
  ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'],
  ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
  ['#3c1642', '#086375', '#1dd3b0', '#affc41', '#b2ff9e'],
  ['#2d00f7', '#6a00f4', '#a100f2', '#db00b6', '#f20089'],
  ['#582f0e', '#7f4f24', '#936639', '#b6ad90', '#ede0d4'],
];

// Title over one or two lines, sized to fit, with the artist under it.
function guestFrame(body, { title, sub, ink = '#ffffff', shade = 'rgba(0,0,0,0.4)', serif = false }) {
  const words = String(title).split(/\s+/);
  let lines = [title];
  if (title.length > 16 && words.length > 1) {
    let best = null;
    for (let k = 1; k < words.length; k++) {
      const a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
      const worst = Math.max(a.length, b.length);
      if (!best || worst < best.worst) best = { worst, lines: [a, b] };
    }
    lines = best.lines;
  }
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.max(28, Math.min(56, Math.floor(1000 / Math.max(10, longest))));
  const family = serif ? 'Georgia, Times New Roman, serif' : 'Segoe UI, Arial, sans-serif';
  const top = W - 40 - 34 - (lines.length - 1) * (size + 6);
  const text = lines.map((l, i) => {
    const y = top + i * (size + 6);
    return `<text x="44" y="${y}" font-size="${size}" font-weight="800" fill="${shade}" transform="translate(3 3)">${esc(l)}</text>
  <text x="44" y="${y}" font-size="${size}" font-weight="800" fill="${ink}">${esc(l)}</text>`;
  }).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
${body}
<g font-family="${family}">
  ${text}
  <text x="46" y="${W - 40}" font-size="18" font-weight="600" letter-spacing="5" fill="${ink}" opacity="0.85">${esc(String(sub).toUpperCase())}</text>
</g>
</svg>`;
}

const GUEST_STYLES = {
  // Jazz: offset blocks and a big circle, record-sleeve style.
  jazz: (r, p) => {
    const blocks = [];
    for (let i = 0; i < 5; i++) blocks.push(`<rect x="${(40 + r() * 360).toFixed(0)}" y="${(40 + r() * 280).toFixed(0)}" width="${(80 + r() * 200).toFixed(0)}" height="${(16 + r() * 60).toFixed(0)}" fill="${p[2 + (i % 3)]}" opacity="0.9"/>`);
    return `<rect width="${W}" height="${W}" fill="${p[0]}"/>
<circle cx="${(380 + r() * 120).toFixed(0)}" cy="${(200 + r() * 80).toFixed(0)}" r="170" fill="${p[1]}"/>
<circle cx="${(380 + r() * 120).toFixed(0)}" cy="${(200 + r() * 80).toFixed(0)}" r="60" fill="${p[4]}" opacity="0.9"/>
${blocks.join('\n')}`;
  },
  // Blues: a low moon over layered dusk bands.
  blues: (r, p) => {
    const bands = [];
    for (let i = 0; i < 5; i++) {
      const y = 330 + i * 52, amp = 20 + r() * 30;
      bands.push(`<path d="M0 ${y} C 160 ${y - amp}, 320 ${y + amp}, 640 ${y - amp / 2} L 640 640 L 0 640 Z" fill="${p[i % 2 ? 1 : 0]}" opacity="${(0.55 + i * 0.1).toFixed(2)}"/>`);
    }
    return `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[0]}"/></linearGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
<circle cx="${(200 + r() * 240).toFixed(0)}" cy="250" r="110" fill="${p[4]}" opacity="0.85"/>
${bands.join('\n')}`;
  },
  // Classical: a parchment ground, a fine ornament ring and a stave.
  classical: (r, p) => {
    p = ['#2b2118', p[1], p[2], p[3], '#f3ede2'];
    const ticks = [];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      ticks.push(`<line x1="${(320 + Math.cos(a) * 150).toFixed(1)}" y1="${(250 + Math.sin(a) * 150).toFixed(1)}" x2="${(320 + Math.cos(a) * (i % 4 ? 162 : 178)).toFixed(1)}" y2="${(250 + Math.sin(a) * (i % 4 ? 162 : 178)).toFixed(1)}" stroke="${p[1]}" stroke-width="${i % 4 ? 2 : 4}"/>`);
    }
    const staff = [0, 1, 2, 3, 4].map((i) => `<line x1="60" y1="${200 + i * 26}" x2="580" y2="${200 + i * 26}" stroke="${p[2]}" stroke-width="2" opacity="0.6"/>`);
    return `<rect width="${W}" height="${W}" fill="${p[4]}"/>
<rect x="24" y="24" width="${W - 48}" height="${W - 48}" fill="none" stroke="${p[1]}" stroke-width="3"/>
${staff.join('\n')}
<circle cx="320" cy="250" r="140" fill="${p[3]}" opacity="${(0.35 + r() * 0.2).toFixed(2)}"/>
${ticks.join('\n')}`;
  },
  // Folk and country: sun, rolling hills and a few stars.
  folk: (r, p) => {
    const hills = [];
    for (let i = 0; i < 4; i++) {
      const y = 360 + i * 60, cx = r() * W;
      hills.push(`<ellipse cx="${cx.toFixed(0)}" cy="${y + 160}" rx="${(380 + r() * 200).toFixed(0)}" ry="200" fill="${p[1 + (i % 3)]}" opacity="${(0.7 + i * 0.08).toFixed(2)}"/>`);
    }
    const stars = [];
    for (let i = 0; i < 14; i++) stars.push(`<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 220).toFixed(0)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="${p[4]}"/>`);
    return `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${stars.join('\n')}
<circle cx="${(160 + r() * 320).toFixed(0)}" cy="320" r="90" fill="${p[4]}"/>
${hills.join('\n')}`;
  },
  // Pop: bright soft blobs.
  pop: (r, p) => {
    const blobs = [];
    for (let i = 0; i < 8; i++) blobs.push(`<ellipse cx="${(r() * W).toFixed(0)}" cy="${(r() * 500).toFixed(0)}" rx="${(80 + r() * 130).toFixed(0)}" ry="${(70 + r() * 110).toFixed(0)}" fill="${p[1 + (i % 4)]}" opacity="0.8" filter="url(#b)"/>`);
    return `<defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter></defs>
<rect width="${W}" height="${W}" fill="${p[0]}"/>
${blobs.join('\n')}
<circle cx="${(200 + r() * 240).toFixed(0)}" cy="${(160 + r() * 160).toFixed(0)}" r="${(50 + r() * 40).toFixed(0)}" fill="#ffffff" opacity="0.85"/>`;
  },
  // Rock: hard diagonal slashes.
  rock: (r, p) => {
    const slashes = [];
    for (let i = 0; i < 9; i++) {
      const x = -200 + i * 110 + r() * 40, w = 30 + r() * 60;
      slashes.push(`<polygon points="${x.toFixed(0)},640 ${(x + w).toFixed(0)},640 ${(x + w + 420).toFixed(0)},0 ${(x + 420).toFixed(0)},0" fill="${p[1 + (i % 4)]}" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`);
    }
    return `<rect width="${W}" height="${W}" fill="${p[0]}"/>
${slashes.join('\n')}
<rect y="420" width="${W}" height="220" fill="${p[0]}" opacity="0.55"/>`;
  },
  // Electro and dance: a neon horizon grid and waves.
  electro: (r, p) => {
    const waves = [];
    for (let i = 0; i < 6; i++) {
      const y = 120 + i * 40, a = 18 + r() * 30, f = 1 + r() * 2;
      let d = `M0 ${y}`;
      for (let x = 0; x <= W; x += 16) d += ` L${x} ${(y + Math.sin((x / W) * Math.PI * 2 * f + i) * a).toFixed(1)}`;
      waves.push(`<path d="${d}" fill="none" stroke="${p[2 + (i % 3)]}" stroke-width="4" opacity="0.85"/>`);
    }
    const grid = [];
    for (let i = 0; i < 7; i++) grid.push(`<line x1="0" y1="${400 + i * i * 7}" x2="${W}" y2="${400 + i * i * 7}" stroke="${p[3]}" stroke-width="2" opacity="0.6"/>`);
    for (let i = -6; i <= 6; i++) grid.push(`<line x1="${320 + i * 24}" y1="400" x2="${320 + i * 150}" y2="${W}" stroke="${p[3]}" stroke-width="2" opacity="0.6"/>`);
    return `<rect width="${W}" height="${W}" fill="${p[0]}"/>
<rect y="400" width="${W}" height="240" fill="${p[1]}" opacity="0.7"/>
${waves.join('\n')}
${grid.join('\n')}`;
  },
  // Hip hop and lo-fi: a halftone dot field under a window-light rectangle.
  hiphop: (r, p) => {
    const dots = [];
    for (let y = 0; y < 14; y++) for (let x = 0; x < 14; x++) {
      const d = Math.hypot(x - 10, y - 4);
      dots.push(`<circle cx="${23 + x * 46}" cy="${23 + y * 46}" r="${Math.max(1.5, 16 - d * 1.6).toFixed(1)}" fill="${p[3]}" opacity="0.8"/>`);
    }
    return `<rect width="${W}" height="${W}" fill="${p[0]}"/>
${dots.join('\n')}
<rect x="${(70 + r() * 60).toFixed(0)}" y="${(90 + r() * 40).toFixed(0)}" width="220" height="260" rx="10" fill="${p[1]}" stroke="${p[4]}" stroke-width="6"/>
<line x1="180" y1="100" x2="180" y2="380" stroke="${p[4]}" stroke-width="4" opacity="0.6"/>
<circle cx="${(240 + r() * 40).toFixed(0)}" cy="170" r="38" fill="${p[4]}" opacity="0.9"/>`;
  },
  // Soul and funk: a retro sunburst.
  soul: (r, p) => {
    const rays = [];
    for (let i = 0; i < 24; i++) {
      const a0 = (i / 24) * Math.PI * 2, a1 = ((i + 0.5) / 24) * Math.PI * 2;
      rays.push(`<polygon points="320,300 ${(320 + Math.cos(a0) * 700).toFixed(0)},${(300 + Math.sin(a0) * 700).toFixed(0)} ${(320 + Math.cos(a1) * 700).toFixed(0)},${(300 + Math.sin(a1) * 700).toFixed(0)}" fill="${p[i % 2 ? 2 : 3]}" opacity="0.9"/>`);
    }
    const rings = [0, 1, 2].map((i) => `<circle cx="320" cy="300" r="${150 - i * 40}" fill="${p[[1, 4, 0][i]]}"/>`);
    return `<rect width="${W}" height="${W}" fill="${p[0]}"/>
${rays.join('\n')}
${rings.join('\n')}`;
  },
  // Latin, reggae and world: tropical leaves and a sun.
  world: (r, p) => {
    const leaves = [];
    for (let i = 0; i < 10; i++) {
      const x = r() * W, y = r() * 420, a = r() * 360, s = 0.7 + r() * 0.8;
      leaves.push(`<path d="M0 0 C 40 -60, 120 -60, 160 0 C 120 60, 40 60, 0 0 Z" fill="${p[1 + (i % 3)]}" opacity="0.85" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)}) scale(${s.toFixed(2)})"/>`);
    }
    return `<rect width="${W}" height="${W}" fill="${p[4]}"/>
<circle cx="${(220 + r() * 200).toFixed(0)}" cy="230" r="130" fill="${p[3]}"/>
${leaves.join('\n')}`;
  },
};

const GENRE_STYLE = {
  jazz: 'jazz', blues: 'blues', classical: 'classical', folk: 'folk', country: 'folk', pop: 'pop', alternative: 'pop', rock: 'rock',
  electro: 'electro', dance: 'electro', 'rap/hip hop': 'hiphop', 'lo-fi': 'hiphop', ambient: 'electro', 'r&b': 'soul', 'soul & funk': 'soul',
  latin: 'world', reggae: 'world', world: 'world',
};

// Light grounds (classical, world) take dark type.
export function guestCover({ slug, title, artist, genre }) {
  const style = GENRE_STYLE[genre] || 'pop';
  const seed = hashSeed(slug);
  const r = rng(seed);
  const p = PALETTES[seed % PALETTES.length];
  const light = style === 'classical' || style === 'world';
  return guestFrame(GUEST_STYLES[style](r, p), {
    title, sub: artist, ink: style === 'classical' ? '#2b2118' : light ? p[0] : '#ffffff', shade: light ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)', serif: style === 'classical' || style === 'jazz',
  });
}

// A guest artist's portrait: their initials over a pattern in their own palette.
export function guestPortrait({ slug, name }) {
  const seed = hashSeed('artist:' + slug);
  const r = rng(seed);
  const p = PALETTES[seed % PALETTES.length];
  const initials = String(name).replace(/\(.*?\)/g, '').split(/[\s/-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const rings = [];
  for (let i = 0; i < 7; i++) rings.push(`<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * W).toFixed(0)}" r="${(60 + r() * 160).toFixed(0)}" fill="${p[1 + (i % 4)]}" opacity="0.55"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<rect width="${W}" height="${W}" fill="${p[0]}"/>
${rings.join('\n')}
<circle cx="320" cy="320" r="170" fill="${p[0]}" opacity="0.55"/>
<text x="320" y="372" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${initials.length > 1 ? 150 : 180}" font-weight="800" fill="#ffffff">${esc(initials)}</text>
</svg>`;
}

// Artist portrait: a monogram with equalizer bars.
export function artistPortrait() {
  const bars = [];
  const hs = [60, 120, 90, 170, 130, 210, 150, 100, 180, 80, 140, 60];
  hs.forEach((h, i) => bars.push(`<rect x="${92 + i * 40}" y="${560 - h}" width="24" height="${h}" rx="12" fill="#ffffff" opacity="${(0.35 + (i % 4) * 0.12).toFixed(2)}"/>`));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff006e"/><stop offset="0.5" stop-color="#8338ec"/><stop offset="1" stop-color="#3a86ff"/></linearGradient></defs>
<rect width="${W}" height="${W}" fill="url(#g)"/>
${bars.join('\n')}
<circle cx="320" cy="250" r="150" fill="#ffffff" opacity="0.16"/>
<text x="320" y="300" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="150" font-weight="800" fill="#ffffff">JM</text>
</svg>`;
}
