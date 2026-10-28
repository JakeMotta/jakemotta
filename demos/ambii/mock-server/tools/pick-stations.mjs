// Picks each static station's tracks from the catalogue by genre and tempo, spreading tracks across stations
// (a heavier penalty each time a track is reused, and at most 7 stations per track beyond its pins), prints how
// each station came out (length, tempo band, main genre, artists, worst overlap) and, with --write, rewrites
// core/station-list.js with the explicit lists. The lists are kept as written, so adding music doesn't reshuffle
// the stations; rerun this to re-pick them, then check the report and bump SEED_VERSION. The catalogue refuses a
// station that names a track it no longer has, so after removing a track, empty STATION_INFO before rerunning.
//   node demos/ambii/mock-server/tools/pick-stations.mjs [--write]
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRACK_BY_SLUG } from '../core/catalogue.js';

const MOCK = join(dirname(fileURLToPath(import.meta.url)), '..');

const slugOf = {};
for (const [slug, t] of Object.entries(TRACK_BY_SLUG)) slugOf[t._id] = slug;
const all = Object.keys(TRACK_BY_SLUG);

// id n (61a7d0 + n; 1 is the server's default station), name, rows, genre wants, preferred bpm range, size, pins, tags, description.
const P = 'Popular Today', CC = 'Coffee Curiosity', BB = 'Bookstore Barista', CL = 'Classical Cappuccino', BO = 'Boba Beats', CO = 'Countryside Cafe', LN = 'Late Night Study ';
const HH = 'Hamburger Hits', BQ = 'Barbecue Bash', AE = 'Asian Eats', TT = 'Taco Truck Temposetter', RD = 'Royalty Dining';
const SPECS = [
  [1, 'Ambii Essentials', [P], { pop: 1, rock: 1, jazz: 1, folk: 1, 'soul & funk': 1, electro: 1, dance: 0.8, 'r&b': 0.8, country: 0.6, blues: 0.6, 'rap/hip hop': 0.6, alternative: 0.6, classical: 0.4 }, [70, 140], 30,
    ['uprising', 'memories', 'bossa-antigua', 'good-to-go', 'got-funk', 'night-owl'], ['Variety', 'Feel Good', 'Everyday', 'Upbeat'], 'A little bit of everything. A safe pick for any room, any time of day.'],
  [2, 'Morning Pour-Over', [CC, P], { jazz: 1, folk: 0.8, 'soul & funk': 0.3, classical: 0.3 }, [55, 112], 20,
    ['memories', 'transition', 'bossa-antigua', 'little-tomcat', 'around-the-mountain'], ['Mellow', 'Warm', 'Morning', 'Acoustic'], 'Gentle grooves for the first cup of the day.'],
  [3, 'Espresso Shot', [CC], { pop: 1, electro: 0.8, dance: 0.5 }, [108, 140], 16,
    ['breathe', 'marceline', 'morning-blue', 'werq'], ['Energetic', 'Bright', 'Rush Hour', 'Upbeat'], 'Quick, bright and a little over-caffeinated.'],
  [4, 'Between the Shelves', [BB, CL], { jazz: 1, folk: 0.6, classical: 0.4 }, [50, 110], 16,
    ['stepping_clouds', 'identity', 'gymnopedie-no-1', 'waiting-stillness'], ['Focus', 'Calm', 'Reading', 'Instrumental'], 'Unhurried tracks for browsing and reading.'],
  [5, 'Strings & Steam', [CL], { classical: 1, jazz: 0.4 }, [40, 160], 12,
    ['stepping_clouds', 'sheep-may-safely-graze', 'chopin-waltz-op-64-2', 'goldberg-variatio-1'], ['Elegant', 'Cinematic', 'Classical'], 'Sweeping, cinematic pieces with a classical touch.'],
  [6, 'Tapioca Tempo', [BO, P], { pop: 1, electro: 0.6, dance: 0.6 }, [88, 130], 18,
    ['marceline', 'alone', 'ants', 'wallpaper'], ['Pop', 'Playful', 'Upbeat', 'Young'], 'Sweet, bouncy pop to go with the boba.'],
  [7, 'Brown Sugar Bounce', [BO, TT], { dance: 1, 'soul & funk': 0.9 }, [100, 135], 16,
    ['dancin', 'funkotron', 'aletheia', 'raspberry-jam'], ['Funk', 'Groovy', 'Afternoon', 'Dance'], 'Groovy afternoon energy with a chewy bassline.'],
  [8, 'Porch Swing', [CO, BQ], { folk: 1, country: 0.8, blues: 0.3 }, [55, 116], 16,
    ['innocence', 'hide_and_seek', 'going-to', 'water-in-the-creek', 'down-the-river'], ['Folk', 'Sunny', 'Easygoing', 'Acoustic'], 'Easygoing, sunny tunes with a little twang.'],
  [9, 'Barn Door Brunch', [CO, P], { country: 1, folk: 0.7, rock: 0.4, pop: 0.3 }, [94, 180], 16,
    ['jumping-jamboree', 'still-pickin', 'fireflies-and-stardust', 'good-to-go'], ['Brunch', 'Cheerful', 'Weekend', 'Country'], 'A cheerful soundtrack for long weekend brunches.'],
  [10, 'Midnight Oil', [LN], { 'rap/hip hop': 1, 'r&b': 0.7, jazz: 0.4 }, [55, 100], 14,
    ['autumn', 'moonlit-skyline', 'midnight-in-c-minor', 'identity'], ['Chill', 'Focus', 'Late Night', 'Lo-Fi'], 'Low-key beats for the last few chapters.'],
  [11, 'Lamplight Lo-Fi', [LN, BB], { 'rap/hip hop': 0.8, jazz: 0.7, electro: 0.4, 'r&b': 0.4 }, [60, 115], 16,
    ['blue-skies', 'new-hip-hop-beat', 'memories', 'circles-round-the-sun'], ['Lo-Fi', 'Cozy', 'Study', 'Chill'], 'A cozy, dim-the-lights study companion.'],
  [12, 'Saturday Rush', [P, HH], { rock: 1, dance: 0.9, pop: 0.4 }, [120, 180], 16,
    ['marceline', 'airplane-mode', 'she_wants_my_package', 'surf-shimmy'], ['Party', 'High Energy', 'Weekend', 'Upbeat'], 'High-energy picks for your busiest hours.'],
  [13, 'Latte Art Lounge', [CC, RD], { jazz: 1, 'r&b': 0.4, 'soul & funk': 0.3 }, [60, 135], 16,
    ['circle-round', 'be-cool', 'bossa-antigua'], ['Jazz', 'Lounge', 'Smooth', 'Warm'], 'Smooth cafe jazz with a little swing in its step.'],
  [14, 'Cold Brew Grooves', [CC, BO], { 'r&b': 1, 'soul & funk': 0.8, jazz: 0.5 }, [65, 110], 14,
    ['swings-and-roundabouts', 'neo-soul', 'smooth-lovin', 'wednesday-night'], ['Soul', 'Smooth', 'Afternoon', 'Groovy'], 'Laid-back soul and funk, served over ice.'],
  [15, 'Paperback Piano', [BB, CL, AE], { classical: 1, jazz: 0.6 }, [40, 120], 12,
    ['goldberg-aria', 'gymnopedie-no-1', 'chopin-nocturne-op-9-2', 'waiting-stillness'], ['Piano', 'Calm', 'Reading', 'Instrumental'], 'Solo piano for quiet pages and slow sips.'],
  [17, 'Bubble Pop', [BO, AE], { pop: 1, electro: 0.8, dance: 0.5 }, [90, 140], 16,
    ['python', 'take-me-higher', 'island-meet-and-greet', 'enthusiast'], ['Pop', 'Bright', 'Playful', 'Young'], 'Fizzy synths and sunny hooks.'],
  [18, 'Harvest Table', [CO, BQ], { country: 1, blues: 0.6, folk: 0.5 }, [65, 140], 14,
    ['railroads-whiskey-co', 'sundown-in-twang-town', 'still-pickin', 'yellow-sticker-blues'], ['Country', 'Warm', 'Dinner', 'Easygoing'], 'Front-porch picking for a long table and a full plate.'],
  [19, 'Night Shift', [LN], { electro: 1, alternative: 0.8, 'rap/hip hop': 0.4 }, [85, 135], 14,
    ['night-owl', 'chill-wave', 'southside', 'uprising'], ['Electronic', 'Chill', 'Late Night', 'Focus'], 'Glowing electronica for after the rush.'],
  [20, 'Diner Jukebox', [HH, P], { pop: 1, rock: 0.8, 'soul & funk': 0.3 }, [92, 140], 16,
    ['afterglow', 'morning-blue', 'summer-highway-cruising', 'california-lullabye'], ['Rock', 'Retro', 'Upbeat', 'Feel Good'], 'Burgers, shakes and guitars on the jukebox.'],
  [21, 'Surf & Turf', [HH], { rock: 1, country: 0.5 }, [110, 180], 12,
    ['surf-shimmy', 'surf-inspector', 'summer-highway-cruising', 'breakfast-on-a-new-day'], ['Surf', 'Rock', 'Retro', 'Sunny'], 'Twangy surf guitars and open-road rock.'],
  [22, 'Fries & Feedback', [HH], { alternative: 1, rock: 0.8, electro: 0.4 }, [90, 140], 14,
    ['anguish', 'roads-that-burned-our-boots', 'siesta', 'enthusiast'], ['Indie', 'Rock', 'Afternoon'], 'Fuzzy indie guitars for the lunch crowd.'],
  [23, 'Smokehouse Blues', [BQ], { blues: 1, rock: 0.5, 'soul & funk': 0.4 }, [60, 130], 16,
    ['slow-burn', 'blues-and-tooth', 'the-stevie-shuffle', 'bathed-in-fine-dust', 'hollow-body-blues'], ['Blues', 'Smoky', 'Evening', 'Groovy'], 'Low and slow, like the brisket.'],
  [24, 'Pit Master Picks', [BQ, CO], { country: 0.8, rock: 0.8, blues: 0.6 }, [75, 180], 16,
    ['last-dance', 'fireflies-and-stardust', 'caldera-blue', 'jumping-jamboree'], ['Country', 'Rock', 'Weekend', 'Feel Good'], 'Southern-fried rock and twang for the smoker crowd.'],
  [25, 'Night Market', [AE], { electro: 1, dance: 0.6, alternative: 0.5 }, [95, 135], 14,
    ['enthusiast', 'wallpaper', 'chill-wave', 'blue-skies'], ['Electronic', 'Bright', 'Evening', 'Lo-Fi'], 'Neon synths and street-food energy.'],
  [26, 'Noodle Bar Beats', [AE, LN], { 'rap/hip hop': 1, electro: 0.8, pop: 0.3 }, [85, 125], 14,
    ['new-hip-hop-beat', 'moonlit-skyline', 'midnight-in-c-minor', 'fearless'], ['Lo-Fi', 'Chill', 'Hip Hop', 'Cozy'], 'Head-nodding beats between slurps.'],
  [28, 'Fiesta Fuego', [TT], { 'soul & funk': 1, dance: 0.6, jazz: 0.4 }, [85, 140], 16,
    ['got-funk', 'island-meet-and-greet', 'circles-round-the-sun'], ['Latin', 'Party', 'Upbeat', 'Groovy'], 'Hot rhythms and brass for the taco line.'],
  [29, 'Salsa Verde Lounge', [TT, RD], { jazz: 1, 'soul & funk': 0.5 }, [65, 125], 14,
    ['bossa-antigua', 'circles-round-the-sun'], ['Latin', 'Lounge', 'Jazz', 'Evening'], 'Bossa, brass and a little Latin jazz.'],
  [30, 'Island Time', [TT, P], { 'r&b': 0.8, pop: 0.6, 'soul & funk': 0.6 }, [75, 125], 14,
    ['island-meet-and-greet', 'raspberry-jam', 'satellite'], ['Tropical', 'Sunny', 'Easygoing', 'Feel Good'], 'Reggae lilts and island breezes.'],
  [31, 'Candlelight Dinner', [RD, CL], { classical: 1, jazz: 0.8, 'r&b': 0.4 }, [40, 120], 14,
    ['chopin-nocturne-op-9-2', 'goldberg-aria', 'around-the-mountain', 'smooth-lovin'], ['Dinner', 'Romantic', 'Elegant', 'Calm'], 'Soft piano and slow jazz for the last course.'],
  [32, 'Velvet Lounge', [RD], { jazz: 1, 'r&b': 0.8, 'soul & funk': 0.4 }, [60, 120], 16,
    ['smooth-lovin', 'satellite', 'neo-soul', 'be-cool'], ['Lounge', 'Smooth', 'Late Night', 'Romantic'], 'Smoky late-night jazz and soul.'],
  [34, 'Feel-Good Friday', [P], { pop: 1, rock: 0.6, folk: 0.6, 'soul & funk': 0.5 }, [92, 180], 20,
    ['california-lullabye', 'afterglow', 'chiado', 'dancin'], ['Feel Good', 'Upbeat', 'Weekend', 'Cheerful'], 'Sing-along sunshine to end the week.'],
  [35, 'Fast Lane', [P, HH], { rock: 0.8, pop: 0.8, dance: 0.8, country: 0.5 }, [140, 200], 12,
    ['airplane-mode', 'california-lullabye', 'fireflies-and-stardust', 'surf-shimmy', 'marceline', 'alone', 'chopin-waltz-op-64-2', 'jumping-jamboree', 'she_wants_my_package'], ['High Energy', 'Rush Hour', 'Upbeat', 'Party'], 'Full throttle: the fastest tracks we have.'],
];

const used = {};
function score(t, wants, range) {
  let g = 0;
  t.album.genres.forEach((genre, i) => { if (wants[genre]) g += wants[genre] * (i === 0 ? 1 : 0.45); });
  if (!g) return -Infinity;
  const [lo, hi] = range;
  const tempo = t.bpm >= lo && t.bpm <= hi ? 0.35 : -Math.min(Math.abs(t.bpm - lo), Math.abs(t.bpm - hi)) / 40;
  return g + tempo - 0.3 * (used[t._id] || 0);
}

const out = [];
for (const [n, name, rows, wants, range, size, pins, tags, description] of SPECS) {
  const chosen = [];
  const perArtist = {};
  const add = (slug) => {
    const t = TRACK_BY_SLUG[slug];
    if (!t) throw new Error(name + ': no track ' + slug);
    if (chosen.indexOf(slug) >= 0) return;
    chosen.push(slug);
    perArtist[t.artist._id] = (perArtist[t.artist._id] || 0) + 1;
  };
  pins.forEach(add);
  const ranked = all.map((slug) => ({ slug, s: score(TRACK_BY_SLUG[slug], wants, range) })).filter((x) => x.s > -Infinity).sort((a, b) => b.s - a.s);
  for (const { slug } of ranked) {
    if (chosen.length >= size) break;
    const a = TRACK_BY_SLUG[slug].artist._id;
    if ((perArtist[a] || 0) >= 4) continue;
    if ((used[TRACK_BY_SLUG[slug]._id] || 0) >= 7) continue;
    add(slug);
  }
  chosen.forEach((slug) => { const id = TRACK_BY_SLUG[slug]._id; used[id] = (used[id] || 0) + 1; });
  out.push({ n, name, rows, tracks: chosen, tags, description });
}

// Report: size, mean bpm and band, dominant genre share, artists, and the worst overlap with another station.
const band = (b) => (b <= 110 ? 'Slower' : b <= 120 ? 'Slow' : b <= 127 ? 'Moderate' : b <= 140 ? 'Fast' : 'Faster');
for (const s of out) {
  const ts = s.tracks.map((x) => TRACK_BY_SLUG[x]);
  const mean = Math.round(ts.reduce((a, t) => a + t.bpm, 0) / ts.length);
  const g = {};
  ts.forEach((t) => { g[t.album.genres[0]] = (g[t.album.genres[0]] || 0) + 1; });
  const top = Object.entries(g).sort((a, b) => b[1] - a[1])[0];
  const artists = new Set(ts.map((t) => t.artist.name)).size;
  let worst = 0, worstName = '';
  for (const o of out) {
    if (o === s) continue;
    const shared = s.tracks.filter((x) => o.tracks.indexOf(x) >= 0).length / Math.min(s.tracks.length, o.tracks.length);
    if (shared > worst) { worst = shared; worstName = o.name; }
  }
  const mins = Math.round(ts.reduce((a, t) => a + t.duration, 0) / 60);
  console.log(`${s.name.padEnd(20)} ${String(s.tracks.length).padStart(2)} tr ${String(mins).padStart(3)} min  bpm ${mean} ${band(mean).padEnd(8)} ${top[0]} ${Math.round((top[1] / ts.length) * 100)}%  ${artists} artists  overlap ${Math.round(worst * 100)}% ${worstName}`);
}
const counts = Object.values(used);
console.log('tracks used:', counts.length, 'of', all.length, '; per track min/max', Math.min(...counts), Math.max(...counts));
console.log('unused:', all.filter((slug) => !used[TRACK_BY_SLUG[slug]._id]).join(', '));
const rows = {};
out.forEach((s) => s.rows.forEach((r) => (rows[r] = (rows[r] || 0) + 1)));
console.log('rows:', JSON.stringify(rows));

if (process.argv.includes('--write')) {
  const q = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const rowName = { [P]: 'P', [CC]: 'CC', [BB]: 'BB', [CL]: 'CL', [BO]: 'BO', [CO]: 'CO', [LN]: 'LN', [HH]: 'HH', [BQ]: 'BQ', [AE]: 'AE', [TT]: 'TT', [RD]: 'RD' };
  const lines = out.map((s) => {
    const id = s.n === 1 ? 'DEFAULT_STATION_ID' : `fixedId('61a7d0', ${s.n})`;
    const wrapped = [];
    let line = '';
    s.tracks.map(q).forEach((t) => { if ((line + t).length > 150) { wrapped.push(line.trim()); line = ''; } line += t + ', '; });
    wrapped.push(line.trim().replace(/,$/, ''));
    return `  { id: ${id}, name: ${q(s.name)}, rows: [${s.rows.map((r) => rowName[r]).join(', ')}],\n    tracks: [\n      ${wrapped.join('\n      ')},\n    ],\n    tags: [${s.tags.map(q).join(', ')}], description: ${q(s.description)} },`;
  });
  const src = `// The static stations: id, name, the browse rows ("supersets") it appears in, its tracks (catalogue slugs, in
// the order their top tracks are taken from), tags and description. Rows are "Popular Today" plus the cafe and
// restaurant rows of the dashboard's constants/supersets.js, including the trailing space of "Late Night Study ".
// Station ids are fixed: the seed, favorites and stored queues point at them (16, 27 and 33 are unused).
// The track lists were picked by tools/pick-stations.mjs (by genre and tempo, spreading tracks so stations differ)
// and are kept as written, so adding music later doesn't reshuffle them.
import { fixedId } from './util.js';
import { DEFAULT_STATION_ID } from '../config.js';

var P = 'Popular Today';
var CC = 'Coffee Curiosity', BB = 'Bookstore Barista', CL = 'Classical Cappuccino', BO = 'Boba Beats', CO = 'Countryside Cafe', LN = 'Late Night Study ';
var HH = 'Hamburger Hits', BQ = 'Barbecue Bash', AE = 'Asian Eats', TT = 'Taco Truck Temposetter', RD = 'Royalty Dining';

export var STATION_INFO = [
${lines.join('\n')}
];
`;
  writeFileSync(join(MOCK, 'core/station-list.js'), src);
  console.log('wrote station-list.js');
}
