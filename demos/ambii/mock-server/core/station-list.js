// The static stations: id, name, the browse rows ("supersets") it appears in, its tracks (catalogue slugs, in
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
  { id: DEFAULT_STATION_ID, name: 'Ambii Essentials', rows: [P],
    tracks: [
      'uprising', 'memories', 'bossa-antigua', 'good-to-go', 'got-funk', 'night-owl', 'afterglow', 'morning-blue', 'take-me-higher', 'werq', 'satellite',
      'railroads-whiskey-co', 'going-to', 'caldera-blue', 'hide_and_seek', 'transition', 'chiado', 'wallpaper', 'ants', 'python', 'breakfast-on-a-new-day',
      'wednesday-night', 'hollow-body-blues', 'the-stevie-shuffle', 'neo-soul', 'aletheia', 'little-tomcat', 'enthusiast', 'southside',
      'circles-round-the-sun',
    ],
    tags: ['Variety', 'Feel Good', 'Everyday', 'Upbeat'], description: 'A little bit of everything. A safe pick for any room, any time of day.' },
  { id: fixedId('61a7d0', 2), name: 'Morning Pour-Over', rows: [CC, P],
    tracks: [
      'memories', 'transition', 'bossa-antigua', 'little-tomcat', 'around-the-mountain', 'be-cool', 'waiting-stillness', 'water-in-the-creek',
      'down-the-river', 'railroads-whiskey-co', 'chiado', 'follow-the-road', 'roads-that-burned-our-boots', 'last-dance', 'yellow-sticker-blues',
      'gymnopedie-no-1', 'goldberg-variatio-1', 'chopin-nocturne-op-9-2', 'swings-and-roundabouts', 'funkotron',
    ],
    tags: ['Mellow', 'Warm', 'Morning', 'Acoustic'], description: 'Gentle grooves for the first cup of the day.' },
  { id: fixedId('61a7d0', 3), name: 'Espresso Shot', rows: [CC],
    tracks: [
      'breathe', 'marceline', 'morning-blue', 'werq', 'she_wants_my_package', 'disco-medusae', 'python', 'ants', 'dancin', 'night-owl', 'enthusiast',
      'siesta', 'island-meet-and-greet', 'blue-skies', 'moonlit-skyline', 'wallpaper',
    ],
    tags: ['Energetic', 'Bright', 'Rush Hour', 'Upbeat'], description: 'Quick, bright and a little over-caffeinated.' },
  { id: fixedId('61a7d0', 4), name: 'Between the Shelves', rows: [BB, CL],
    tracks: [
      'stepping_clouds', 'identity', 'gymnopedie-no-1', 'waiting-stillness', 'be-cool', 'around-the-mountain', 'transition', 'bossa-antigua',
      'goldberg-aria', 'water-in-the-creek', 'down-the-river', 'hollow-body-blues', 'neo-soul', 'satellite', 'caldera-blue', 'circles-round-the-sun',
    ],
    tags: ['Focus', 'Calm', 'Reading', 'Instrumental'], description: 'Unhurried tracks for browsing and reading.' },
  { id: fixedId('61a7d0', 5), name: 'Strings & Steam', rows: [CL],
    tracks: [
      'stepping_clouds', 'sheep-may-safely-graze', 'chopin-waltz-op-64-2', 'goldberg-variatio-1', 'goldberg-aria', 'chopin-nocturne-op-9-2',
      'gymnopedie-no-1', 'circle-round', 'identity', 'wednesday-night', 'the-stevie-shuffle', 'circles-round-the-sun',
    ],
    tags: ['Elegant', 'Cinematic', 'Classical'], description: 'Sweeping, cinematic pieces with a classical touch.' },
  { id: fixedId('61a7d0', 6), name: 'Tapioca Tempo', rows: [BO, P],
    tracks: [
      'marceline', 'alone', 'ants', 'wallpaper', 'werq', 'take-me-higher', 'island-meet-and-greet', 'python', 'chill-wave', 'uprising',
      'she_wants_my_package', 'southside', 'good-to-go', 'siesta', 'afterglow', 'breakfast-on-a-new-day', 'night-owl', 'enthusiast',
    ],
    tags: ['Pop', 'Playful', 'Upbeat', 'Young'], description: 'Sweet, bouncy pop to go with the boba.' },
  { id: fixedId('61a7d0', 7), name: 'Brown Sugar Bounce', rows: [BO, TT],
    tracks: [
      'dancin', 'funkotron', 'aletheia', 'raspberry-jam', 'disco-medusae', 'swings-and-roundabouts', 'got-funk', 'werq', 'she_wants_my_package',
      'wednesday-night', 'island-meet-and-greet', 'caldera-blue', 'satellite', 'uprising', 'marceline',
    ],
    tags: ['Funk', 'Groovy', 'Afternoon', 'Dance'], description: 'Groovy afternoon energy with a chewy bassline.' },
  { id: fixedId('61a7d0', 8), name: 'Porch Swing', rows: [CO, BQ],
    tracks: [
      'innocence', 'hide_and_seek', 'going-to', 'water-in-the-creek', 'down-the-river', 'railroads-whiskey-co', 'still-pickin', 'little-tomcat',
      'sundown-in-twang-town', 'jumping-jamboree', 'yellow-sticker-blues', 'chiado', 'slow-burn', 'blues-and-tooth', 'bathed-in-fine-dust',
      'follow-the-road',
    ],
    tags: ['Folk', 'Sunny', 'Easygoing', 'Acoustic'], description: 'Easygoing, sunny tunes with a little twang.' },
  { id: fixedId('61a7d0', 9), name: 'Barn Door Brunch', rows: [CO, P],
    tracks: [
      'jumping-jamboree', 'still-pickin', 'fireflies-and-stardust', 'good-to-go', 'innocence', 'airplane-mode', 'california-lullabye', 'going-to',
      'roads-that-burned-our-boots', 'anguish', 'surf-shimmy', 'surf-inspector', 'summer-highway-cruising', 'afterglow', 'railroads-whiskey-co',
      'sundown-in-twang-town',
    ],
    tags: ['Brunch', 'Cheerful', 'Weekend', 'Country'], description: 'A cheerful soundtrack for long weekend brunches.' },
  { id: fixedId('61a7d0', 10), name: 'Midnight Oil', rows: [LN],
    tracks: [
      'autumn', 'moonlit-skyline', 'midnight-in-c-minor', 'identity', 'new-hip-hop-beat', 'smooth-lovin', 'fearless', 'blue-skies', 'satellite',
      'hollow-body-blues', 'neo-soul', 'southside', 'got-funk', 'around-the-mountain',
    ],
    tags: ['Chill', 'Focus', 'Late Night', 'Lo-Fi'], description: 'Low-key beats for the last few chapters.' },
  { id: fixedId('61a7d0', 11), name: 'Lamplight Lo-Fi', rows: [LN, BB],
    tracks: [
      'blue-skies', 'new-hip-hop-beat', 'memories', 'circles-round-the-sun', 'autumn', 'midnight-in-c-minor', 'moonlit-skyline', 'chill-wave',
      'smooth-lovin', 'raspberry-jam', 'be-cool', 'waiting-stillness', 'fearless', 'the-stevie-shuffle', 'southside', 'transition',
    ],
    tags: ['Lo-Fi', 'Cozy', 'Study', 'Chill'], description: 'A cozy, dim-the-lights study companion.' },
  { id: fixedId('61a7d0', 12), name: 'Saturday Rush', rows: [P, HH],
    tracks: [
      'marceline', 'airplane-mode', 'she_wants_my_package', 'surf-shimmy', 'surf-inspector', 'summer-highway-cruising', 'morning-blue',
      'california-lullabye', 'dancin', 'anguish', 'werq', 'disco-medusae', 'roads-that-burned-our-boots', 'breakfast-on-a-new-day', 'bathed-in-fine-dust',
      'afterglow',
    ],
    tags: ['Party', 'High Energy', 'Weekend', 'Upbeat'], description: 'High-energy picks for your busiest hours.' },
  { id: fixedId('61a7d0', 13), name: 'Latte Art Lounge', rows: [CC, RD],
    tracks: [
      'circle-round', 'be-cool', 'bossa-antigua', 'around-the-mountain', 'waiting-stillness', 'smooth-lovin', 'raspberry-jam', 'transition',
      'stepping_clouds', 'circles-round-the-sun', 'midnight-in-c-minor', 'satellite', 'hollow-body-blues', 'the-stevie-shuffle', 'swings-and-roundabouts',
      'aletheia',
    ],
    tags: ['Jazz', 'Lounge', 'Smooth', 'Warm'], description: 'Smooth cafe jazz with a little swing in its step.' },
  { id: fixedId('61a7d0', 14), name: 'Cold Brew Grooves', rows: [CC, BO],
    tracks: [
      'swings-and-roundabouts', 'neo-soul', 'smooth-lovin', 'wednesday-night', 'funkotron', 'midnight-in-c-minor', 'satellite', 'raspberry-jam', 'got-funk',
      'identity', 'caldera-blue', 'memories', 'aletheia', 'hollow-body-blues',
    ],
    tags: ['Soul', 'Smooth', 'Afternoon', 'Groovy'], description: 'Laid-back soul and funk, served over ice.' },
  { id: fixedId('61a7d0', 15), name: 'Paperback Piano', rows: [BB, CL, AE],
    tracks: [
      'goldberg-aria', 'gymnopedie-no-1', 'chopin-nocturne-op-9-2', 'waiting-stillness', 'sheep-may-safely-graze', 'goldberg-variatio-1', 'stepping_clouds',
      'chopin-waltz-op-64-2', 'bossa-antigua', 'be-cool', 'around-the-mountain', 'circle-round',
    ],
    tags: ['Piano', 'Calm', 'Reading', 'Instrumental'], description: 'Solo piano for quiet pages and slow sips.' },
  { id: fixedId('61a7d0', 17), name: 'Bubble Pop', rows: [BO, AE],
    tracks: [
      'python', 'take-me-higher', 'island-meet-and-greet', 'enthusiast', 'breathe', 'wallpaper', 'ants', 'chill-wave', 'uprising', 'disco-medusae',
      'night-owl', 'siesta', 'she_wants_my_package', 'hide_and_seek', 'southside', 'good-to-go',
    ],
    tags: ['Pop', 'Bright', 'Playful', 'Young'], description: 'Fizzy synths and sunny hooks.' },
  { id: fixedId('61a7d0', 18), name: 'Harvest Table', rows: [CO, BQ],
    tracks: [
      'railroads-whiskey-co', 'sundown-in-twang-town', 'still-pickin', 'yellow-sticker-blues', 'jumping-jamboree', 'innocence', 'going-to', 'slow-burn',
      'blues-and-tooth', 'little-tomcat', 'water-in-the-creek', 'bathed-in-fine-dust', 'last-dance', 'fireflies-and-stardust',
    ],
    tags: ['Country', 'Warm', 'Dinner', 'Easygoing'], description: 'Front-porch picking for a long table and a full plate.' },
  { id: fixedId('61a7d0', 19), name: 'Night Shift', rows: [LN],
    tracks: [
      'night-owl', 'chill-wave', 'southside', 'uprising', 'enthusiast', 'blue-skies', 'moonlit-skyline', 'breathe', 'siesta', 'fearless', 'anguish',
      'take-me-higher', 'autumn', 'wallpaper',
    ],
    tags: ['Electronic', 'Chill', 'Late Night', 'Focus'], description: 'Glowing electronica for after the rush.' },
  { id: fixedId('61a7d0', 20), name: 'Diner Jukebox', rows: [HH, P],
    tracks: [
      'afterglow', 'morning-blue', 'summer-highway-cruising', 'california-lullabye', 'surf-inspector', 'good-to-go', 'breakfast-on-a-new-day',
      'island-meet-and-greet', 'anguish', 'roads-that-burned-our-boots', 'take-me-higher', 'ants', 'python', 'alone', 'last-dance', 'wallpaper',
    ],
    tags: ['Rock', 'Retro', 'Upbeat', 'Feel Good'], description: 'Burgers, shakes and guitars on the jukebox.' },
  { id: fixedId('61a7d0', 21), name: 'Surf & Turf', rows: [HH],
    tracks: [
      'surf-shimmy', 'surf-inspector', 'summer-highway-cruising', 'breakfast-on-a-new-day', 'fireflies-and-stardust', 'airplane-mode', 'anguish',
      'morning-blue', 'jumping-jamboree', 'california-lullabye', 'innocence', 'sundown-in-twang-town',
    ],
    tags: ['Surf', 'Rock', 'Retro', 'Sunny'], description: 'Twangy surf guitars and open-road rock.' },
  { id: fixedId('61a7d0', 22), name: 'Fries & Feedback', rows: [HH],
    tracks: [
      'anguish', 'roads-that-burned-our-boots', 'siesta', 'enthusiast', 'surf-inspector', 'summer-highway-cruising', 'breathe', 'bathed-in-fine-dust',
      'night-owl', 'good-to-go', 'afterglow', 'morning-blue', 'breakfast-on-a-new-day', 'hide_and_seek',
    ],
    tags: ['Indie', 'Rock', 'Afternoon'], description: 'Fuzzy indie guitars for the lunch crowd.' },
  { id: fixedId('61a7d0', 23), name: 'Smokehouse Blues', rows: [BQ],
    tracks: [
      'slow-burn', 'blues-and-tooth', 'the-stevie-shuffle', 'bathed-in-fine-dust', 'hollow-body-blues', 'yellow-sticker-blues', 'caldera-blue',
      'sundown-in-twang-town', 'neo-soul', 'last-dance', 'fearless', 'funkotron', 'dancin', 'going-to', 'got-funk', 'swings-and-roundabouts',
    ],
    tags: ['Blues', 'Smoky', 'Evening', 'Groovy'], description: 'Low and slow, like the brisket.' },
  { id: fixedId('61a7d0', 24), name: 'Pit Master Picks', rows: [BQ, CO],
    tracks: [
      'last-dance', 'fireflies-and-stardust', 'caldera-blue', 'jumping-jamboree', 'slow-burn', 'still-pickin', 'surf-shimmy', 'airplane-mode',
      'bathed-in-fine-dust', 'sundown-in-twang-town', 'roads-that-burned-our-boots', 'summer-highway-cruising', 'blues-and-tooth', 'innocence',
      'little-tomcat', 'water-in-the-creek',
    ],
    tags: ['Country', 'Rock', 'Weekend', 'Feel Good'], description: 'Southern-fried rock and twang for the smoker crowd.' },
  { id: fixedId('61a7d0', 25), name: 'Night Market', rows: [AE],
    tracks: [
      'enthusiast', 'wallpaper', 'chill-wave', 'blue-skies', 'disco-medusae', 'she_wants_my_package', 'werq', 'night-owl', 'dancin', 'uprising', 'breathe',
      'moonlit-skyline', 'aletheia', 'siesta',
    ],
    tags: ['Electronic', 'Bright', 'Evening', 'Lo-Fi'], description: 'Neon synths and street-food energy.' },
  { id: fixedId('61a7d0', 26), name: 'Noodle Bar Beats', rows: [AE, LN],
    tracks: [
      'new-hip-hop-beat', 'moonlit-skyline', 'midnight-in-c-minor', 'fearless', 'blue-skies', 'autumn', 'southside', 'chill-wave', 'chiado', 'hide_and_seek',
      'ants', 'python', 'uprising', 'got-funk',
    ],
    tags: ['Lo-Fi', 'Chill', 'Hip Hop', 'Cozy'], description: 'Head-nodding beats between slurps.' },
  { id: fixedId('61a7d0', 28), name: 'Fiesta Fuego', rows: [TT],
    tracks: [
      'got-funk', 'island-meet-and-greet', 'circles-round-the-sun', 'wednesday-night', 'funkotron', 'aletheia', 'dancin', 'swings-and-roundabouts',
      'circle-round', 'transition', 'raspberry-jam', 'disco-medusae', 'stepping_clouds', 'be-cool', 'waiting-stillness', 'satellite',
    ],
    tags: ['Latin', 'Party', 'Upbeat', 'Groovy'], description: 'Hot rhythms and brass for the taco line.' },
  { id: fixedId('61a7d0', 29), name: 'Salsa Verde Lounge', rows: [TT, RD],
    tracks: [
      'bossa-antigua', 'circles-round-the-sun', 'around-the-mountain', 'transition', 'circle-round', 'be-cool', 'waiting-stillness', 'smooth-lovin',
      'funkotron', 'stepping_clouds', 'the-stevie-shuffle', 'neo-soul', 'caldera-blue', 'wednesday-night',
    ],
    tags: ['Latin', 'Lounge', 'Jazz', 'Evening'], description: 'Bossa, brass and a little Latin jazz.' },
  { id: fixedId('61a7d0', 30), name: 'Island Time', rows: [TT, P],
    tracks: [
      'island-meet-and-greet', 'raspberry-jam', 'satellite', 'smooth-lovin', 'midnight-in-c-minor', 'memories', 'follow-the-road', 'take-me-higher',
      'chiado', 'identity', 'ants', 'python', 'swings-and-roundabouts', 'aletheia',
    ],
    tags: ['Tropical', 'Sunny', 'Easygoing', 'Feel Good'], description: 'Reggae lilts and island breezes.' },
  { id: fixedId('61a7d0', 31), name: 'Candlelight Dinner', rows: [RD, CL],
    tracks: [
      'chopin-nocturne-op-9-2', 'goldberg-aria', 'around-the-mountain', 'smooth-lovin', 'sheep-may-safely-graze', 'goldberg-variatio-1', 'gymnopedie-no-1',
      'stepping_clouds', 'identity', 'chopin-waltz-op-64-2', 'bossa-antigua', 'hollow-body-blues', 'the-stevie-shuffle', 'neo-soul',
    ],
    tags: ['Dinner', 'Romantic', 'Elegant', 'Calm'], description: 'Soft piano and slow jazz for the last course.' },
  { id: fixedId('61a7d0', 32), name: 'Velvet Lounge', rows: [RD],
    tracks: [
      'smooth-lovin', 'satellite', 'neo-soul', 'be-cool', 'raspberry-jam', 'identity', 'midnight-in-c-minor', 'memories', 'circle-round', 'funkotron',
      'dancin', 'wednesday-night',
    ],
    tags: ['Lounge', 'Smooth', 'Late Night', 'Romantic'], description: 'Smoky late-night jazz and soul.' },
  { id: fixedId('61a7d0', 34), name: 'Feel-Good Friday', rows: [P],
    tracks: [
      'california-lullabye', 'afterglow', 'chiado', 'dancin', 'alone', 'airplane-mode', 'good-to-go', 'take-me-higher', 'surf-shimmy', 'marceline',
      'down-the-river', 'hide_and_seek', 'railroads-whiskey-co', 'going-to', 'surf-inspector', 'fireflies-and-stardust', 'breakfast-on-a-new-day',
      'summer-highway-cruising', 'jumping-jamboree', 'werq',
    ],
    tags: ['Feel Good', 'Upbeat', 'Weekend', 'Cheerful'], description: 'Sing-along sunshine to end the week.' },
  { id: fixedId('61a7d0', 35), name: 'Fast Lane', rows: [P, HH],
    tracks: [
      'airplane-mode', 'california-lullabye', 'fireflies-and-stardust', 'surf-shimmy', 'marceline', 'alone', 'chopin-waltz-op-64-2', 'jumping-jamboree',
      'she_wants_my_package', 'morning-blue', 'surf-inspector', 'innocence',
    ],
    tags: ['High Energy', 'Rush Hour', 'Upbeat', 'Party'], description: 'Full throttle: the fastest tracks we have.' },
];
