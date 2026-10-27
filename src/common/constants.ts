export interface MusicItemProps {
    image: string;
    title: string;
    date: string;
    /** Shown in the library's player. Leave it empty rather than writing filler. */
    description: string;
    /**
     * A file in public/music/, or a song that plays from YouTube (common/music.ts):
     * `youtube:<video id>`, `spotify:<track id>` or `song:<artist>/<title>`.
     */
    url: string;
    /** Whose song it is, for songs that aren't Jake's. Shown in place of "Jake Motta · year". */
    artist?: string;
}

export const musicList: MusicItemProps[] = [
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'She wants my package',
        description: '',
        url: '/music/she_wants_my_package.mp3',
        date: '2021'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Uprising',
        description: 'Feeling like the first song I had created from scratch in a long while.',
        url: '/music/uprising.mp3',
        date: '2021'
    },
    {
        image: '/images/music/marceline.jpg',
        title: 'S3RL feat. Sara - Marceline the Vampire Queen (A Bad Remix)',
        description: 'My second attempt at a remix. Was really happy with how this turned out.',
        url: '/music/marceline.mp3',
        date: '2021'
    },
    {
        image: '/images/music/super_bitch.jpg',
        title: 'Super Bitch (ft. Anzu)',
        description: "Made in one night with no purpose.",
        url: '/music/super_bitch.wav',
        date: '2021'
    },
    {
        image: '/images/music/alone.jpg',
        title: 'Alone',
        description: "Attempt at working with vocals in a track, matching key and bpm. Couldn't really settle on how I wanted this song to sound though, so I gave up.",
        url: '/music/alone.mp3',
        date: '2019'
    },
    {
        image: '/images/music/memories.jpg',
        title: 'Memories',
        description: 'My first attempt at a remix',
        url: '/music/memories.mp3',
        date: '2018'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Anguish',
        description: '',
        url: '/music/anguish.mp3',
        date: '2017'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Breathe',
        description: '',
        url: '/music/breathe.mp3',
        date: '2017'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Fearless',
        description: '',
        url: '/music/fearless.mp3',
        date: '2016'
    },
    {
        image: '/images/music/hide_and_seek.jpg',
        title: 'Hide & Seek - Les Edit',
        description: '',
        url: '/music/hide_and_seek.mp3',
        date: '2016'
    },
    {
        image: '/images/music/transition.jpg',
        title: 'Transition',
        description: '',
        url: '/music/transition.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Identity',
        description: '',
        url: '/music/identity.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Stepping Clouds',
        description: '',
        url: '/music/stepping_clouds.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Innocence',
        description: '',
        url: '/music/innocence.mp3',
        date: '2012'
    },
]

export const favoriteArtists: MusicItemProps[] = [
    {
        image: '/images/music/marceline.jpg',
        title: 'S3RL',
        description: '',
        url: '/music/marceline.mp3',
        date: '2021'
    },
    {
        image: '/images/music/super_bitch.jpg',
        title: 'WeAreCastor',
        description: '',
        url: '/music/super_bitch.wav',
        date: '2021'
    },
]

/**
 * Songs that play from YouTube, in the shuffle with everything else. `url` is `youtube:` and the
 * video's ID (the part after `v=` in its link). Leave `image` empty to use the video's thumbnail,
 * which for YouTube Music's own uploads is the album art. The songs on Jake's Spotify playlist join
 * these when the listening Worker is running (docs/music.md).
 *
 *     { image: '', title: 'Song', artist: 'Artist', description: '', url: 'youtube:dQw4w9WgXcQ', date: '' },
 */
export const youtubeSongs: MusicItemProps[] = [];

/** What "Play with sound" starts on the board. It has no cover art, so it shows a monogram. */
export const welcomeTrack: MusicItemProps = {
    image: '',
    title: 'Dancin',
    description: '',
    url: '/music/dancin.mp3',
    date: '2016'
}

/** The board's Say hi tile, in this order. public/index.html lists the same profiles as the Person's sameAs. */
export const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/JakeMotta' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jakemotta/' },
    { label: 'Instagram', url: 'https://www.instagram.com/foulprogramming' },
];

export interface HomeProject {
    id: string;
    image: string;
    title: string;
    date: string;
    // What kind of thing it is, shown as pills after the year in the viewer: "Website", "Java Game", "School"…
    tags?: string[];
    description: string;
    /**
     * What the viewer at /project/:id frames. Either the project's browser-runnable copy under
     * /projects/ (name the page file, index.html, not just the folder: the dev server answers a
     * bare folder path with this app), or the full address of a project that is live on its own
     * domain and allows framing. Omit it when there is no preview yet.
     */
    preview?: string;
}

/** Cards that held several projects before each got its own, so links to their old ids still land on one. */
export const movedProjects: Record<string, string> = {
    motorsport: 'team-safe',
    highschool: 'highschool-portfolio',
    cs134: 'floor-is-lava',
};

/**
 * Leave `image` empty to show a monogram tile, and `description` empty to show none. Card
 * images are screenshots of each running preview, made by `yarn projects:screenshot`
 * (scripts/screenshot-projects.mjs) as /images/projects/<id>.webp; add a new project there too.
 * Each project's notes are in docs/projects/<id>.md.
 */
export const homeProjectList: HomeProject[] = [
    {
        id: 'tapslaydie',
        image: '/images/projects/tapslaydie.webp',
        title: 'TapSlayDie',
        date: '2026',
        tags: ['Mobile Game'],
        description: 'A hardcore fantasy clicker RPG for iOS and Android: tap to slay, loot what you kill, and die.',
        preview: 'https://tapslaydie.com/',
    },
    {
        id: 'asteroids',
        image: '/images/projects/asteroids.webp',
        title: 'Asteroids',
        date: '2026',
        tags: ['HTML5 Game'],
        description: 'The arcade classic rebuilt in Godot, with UFOs, screen shake and my own music.',
        preview: '/projects/asteroids/index.html',
    },
    {
        id: 'ambii',
        image: '/images/projects/ambii.webp',
        title: 'Ambii',
        date: '2025',
        tags: ['Startup', 'App', 'Website'],
        description: 'My startup from 2017 to 2021: a music app for listening together, where everyone in the room gets a say in what plays next.',
        preview: '/projects/ambii/story/index.html',
    },
    {
        id: 'black-chamber',
        image: '/images/projects/black-chamber.webp',
        title: 'Black Chamber',
        date: '2025',
        tags: ['Website'],
        description: 'Members, programs and events for the Silicon Valley Black Chamber of Commerce.',
        preview: '/projects/black-chamber/index.html',
    },
    {
        id: 'pistol-art',
        image: '/images/projects/pistol-art.webp',
        title: 'Pistol Art',
        date: '2025',
        tags: ['Website'],
        description: 'Course schedules and class sign-ups for a pistol training school.',
        preview: '/projects/pistol-art/index.html',
    },
    {
        id: 'ninjadonut',
        image: '/images/projects/ninjadonut.webp',
        title: 'NinjaDonut',
        date: '2025',
        tags: ['Website', 'Games', 'Comics'],
        description: 'Games, comics and odds and ends, starring a very serious donut.',
        preview: '/projects/ninja-donut/index.html',
    },
    {
        id: 'ambii-business',
        image: '/images/projects/ambii-business.webp',
        title: 'Ambii Business',
        date: '2022',
        tags: ['Web App', 'Mobile App'],
        description: 'Background music for cafés and shops: the dashboard, the web player and the phone app, all working again.',
        preview: '/projects/ambii-business/index.html',
    },
    {
        id: 'floor-is-lava',
        image: '/images/projects/floor-is-lava.webp',
        title: 'The Floor is Lava',
        date: '2017',
        tags: ['Java Game', 'School'],
        description: 'A miner digs blocks loose and stacks them under his feet to stay above the rising lava.',
        preview: '/projects/cs134/floor-is-lava.html',
    },
    {
        id: 'scott-pilgrim',
        image: '/images/projects/scott-pilgrim.webp',
        title: 'Scott Pilgrim Side-Scroller',
        date: '2017',
        tags: ['Java Game', 'School'],
        description: 'My first OpenGL game: Scott punches fireballs across a scrolling level while Ramona tags along.',
        preview: '/projects/cs134/scott-pilgrim.html',
    },
    {
        id: 'fooder',
        image: '/images/projects/fooder.webp',
        title: 'Fooder',
        date: '2017',
        tags: ['Android App', 'School'],
        description: 'A team Android app that deals out nearby restaurants one card at a time, swipe-style.',
        preview: '/projects/fooder/index.html',
    },
    {
        id: 'survivor',
        image: '/images/projects/survivor.webp',
        title: 'Survivor',
        date: '2017',
        tags: ['Game Design', 'School'],
        description: 'A prison-escape platformer full of spikes, electric barriers and fake floors, designed for a game design class.',
        preview: '/projects/survivor/index.html',
    },
    {
        id: 'cs160',
        image: '/images/projects/cs160.webp',
        title: 'CS160',
        date: '2016',
        tags: ['Web App', 'School'],
        description: 'Face Me: upload a video and get it back with a face mesh drawn on every frame.',
        preview: '/projects/cs160/index.html',
    },
    {
        id: 'personal-site',
        image: '/images/projects/personal-site.webp',
        title: 'Personal Site',
        date: '2016',
        tags: ['Website'],
        description: 'My old portfolio, with drifting clouds and balloons tied to its hello.',
        preview: '/projects/personal-site/index%20(2).static.html',
    },
    {
        id: 'dan-james',
        image: '/images/projects/dan-james.webp',
        title: 'Dan James',
        date: '2016',
        tags: ['Website'],
        description: 'A site for a music producer and mixing engineer, with a beat store and his mixing services.',
        preview: '/projects/dan-james/index.static.html',
    },
    {
        id: 'team-safe',
        image: '/images/projects/team-safe.webp',
        title: 'Team SAFE Racing',
        date: '2014',
        tags: ['Website'],
        description: 'A site for an inline speed-skating team, with a bio page for every skater.',
        preview: '/projects/motorsport/team-safe/About.html',
    },
    {
        id: 'coloris',
        image: '/images/projects/coloris.webp',
        title: 'Coloris',
        date: '2014',
        tags: ['Java Game'],
        description: 'An unfinished top-down RPG: walk Huey through a scrolling forest and change his color with the number keys.',
        preview: '/projects/coloris/index.html',
    },
    {
        id: 'worxxx',
        image: '/images/projects/worxxx.webp',
        title: 'Worxxx PM',
        date: '2013',
        tags: ['Website'],
        description: 'A motorcycle race shop in Lemoore, California: service rates, pit stop kits and Öhlins suspension.',
        preview: '/projects/motorsport/worxxx/index.static.html',
    },
    {
        id: 'isguy',
        image: '/images/projects/isguy.webp',
        title: 'The Adventures of isGuy',
        date: '2013',
        tags: ['Java Game'],
        description: 'A five-level platformer with lasers, ladders, keys and doors.',
        preview: '/projects/isguy/index.html',
    },
    {
        id: 'noah-garza',
        image: '/images/projects/noah-garza.webp',
        title: 'Noah Garza Racing',
        date: '2012',
        tags: ['Website'],
        description: "A one-page site for a young kart racer, with his wins, the season's schedule and a photo gallery.",
        preview: '/projects/motorsport/noah-garza/index.static.html',
    },
    {
        id: 'sketchbook',
        image: '/images/projects/sketchbook.webp',
        title: 'Sketchbook',
        date: '2012',
        tags: ['Art'],
        description: 'Digital drawings of NinjaDonut, a few logos and some characters.',
        preview: '/projects/sketchbook/index.html',
    },
    {
        id: 'flash',
        image: '/images/projects/flash.webp',
        title: 'Flash',
        date: '2012',
        tags: ['Flash', 'Animation'],
        description: 'Cartoons and caricatures of my friends.',
        preview: '/projects/flash/index.html',
    },
    {
        id: 'highschool-portfolio',
        image: '/images/projects/highschool-portfolio.webp',
        title: 'High School Portfolio',
        date: '2012',
        tags: ['Website'],
        description: 'My portfolio from the end of high school, with a parallax city skyline scrolling behind it.',
        preview: '/projects/highschool/oldSite/index.html',
    },
    {
        id: 'greenfoot-pokemon',
        image: '/images/projects/greenfoot-pokemon.webp',
        title: 'Pokémon: Green Foot Edition',
        date: '2012',
        tags: ['Java Game', 'School'],
        description: 'A Pokémon fan game Logan Lovell and I made for a programming class: pick a starter and explore TrainingVille.',
        preview: '/projects/greenfoot-pokemon/index.html',
    },
    {
        id: 'escaping-confinement',
        image: '/images/projects/escaping-confinement.webp',
        title: 'Escaping Confinement',
        date: '2012',
        tags: ['3D Animation', 'Short Film', 'School'],
        description: 'A five-minute Maya short about a desk fan that comes to life and tries to escape.',
        preview: '/projects/escaping-confinement/index.html',
    },
    {
        id: 'jakes-index',
        image: '/images/projects/jakes-index.webp',
        title: "JAKE's Index",
        date: '2011',
        tags: ['Website', 'Flash', 'School'],
        description: 'A Flash homepage for my web design class assignments, with a Pac-Man hiding in it.',
        preview: '/projects/highschool/flashIndex/FlashIndex.static.html',
    },
    {
        id: 'pivot',
        image: '/images/projects/pivot.webp',
        title: 'Pivot Animations',
        date: '2008',
        tags: ['Animation'],
        description: 'Stick-figure fights, sword moves, skate tricks and Goku versus Vegeta.',
        preview: '/projects/pivot/index.html',
    },
]