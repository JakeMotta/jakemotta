export interface MusicItemProps {
    image: string;
    title: string;
    date: string;
    /** Shown in the library's player. Leave it empty rather than writing filler. */
    description: string;
    url: string;
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

/** What "Play with sound" starts on the board. It has no cover art, so it shows a monogram. */
export const welcomeTrack: MusicItemProps = {
    image: '',
    title: 'Dancin',
    description: '',
    url: '/music/dancin.mp3',
    date: '2016'
}

export interface HomeProject {
    id: string;
    image: string;
    title: string;
    date: string;
    description: string;
    /**
     * What the viewer at /project/:id frames. Either the project's browser-runnable copy under
     * /projects/ (name the page file, index.html, not just the folder: the dev server answers a
     * bare folder path with this app), or the full address of a project that is live on its own
     * domain and allows framing. Omit it when there is no preview yet.
     */
    preview?: string;
}

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
        description: 'A hardcore fantasy clicker RPG for iOS and Android: tap to slay, loot what you kill, and die.',
        preview: 'https://tapslaydie.com/',
    },
    {
        id: 'asteroids',
        image: '/images/projects/asteroids.webp',
        title: 'Asteroids',
        date: '2026',
        description: 'The arcade classic rebuilt in Godot, with UFOs, screen shake and my own music.',
        preview: '/projects/asteroids/index.html',
    },
    {
        id: 'ambii',
        image: '/images/projects/ambii.webp',
        title: 'Ambii',
        date: '2025',
        description: '',
        preview: '/projects/ambii/story/index.html',
    },
    {
        id: 'black-chamber',
        image: '/images/projects/black-chamber.webp',
        title: 'Black Chamber',
        date: '2025',
        description: 'Members, programs and events for the Silicon Valley Black Chamber of Commerce.',
        preview: '/projects/black-chamber/index.html',
    },
    {
        id: 'pistol-art',
        image: '/images/projects/pistol-art.webp',
        title: 'Pistol Art',
        date: '2025',
        description: 'Course schedules and class sign-ups for a pistol training school.',
        preview: '/projects/pistol-art/index.html',
    },
    {
        id: 'ninjadonut',
        image: '/images/projects/ninjadonut.webp',
        title: 'NinjaDonut',
        date: '2025',
        description: 'Games, comics and odds and ends, starring a very serious donut.',
        preview: '/projects/ninja-donut/index.html',
    },
    {
        id: 'ambii-business',
        image: '/images/projects/ambii-business.webp',
        title: 'Ambii Business',
        date: '2022',
        description: 'Background music for cafés and shops, with its dashboard, web player and phone app working again in your browser.',
        preview: '/projects/ambii-business/index.html',
    },
    {
        id: 'cs134',
        image: '/images/projects/cs134.webp',
        title: 'CS 134 Games',
        date: '2017',
        description: 'Two Java and OpenGL games: a miner racing rising lava, and a Scott Pilgrim side-scroller.',
        preview: '/projects/cs134/index.html',
    },
    {
        id: 'fooder',
        image: '/images/projects/fooder.webp',
        title: 'Fooder',
        date: '2017',
        description: 'A team Android app that deals out nearby restaurants one card at a time, swipe-style.',
        preview: '/projects/fooder/index.html',
    },
    {
        id: 'survivor',
        image: '/images/projects/survivor.webp',
        title: 'Survivor & Arena King',
        date: '2017',
        description: 'A prison-escape platformer and a dice-and-card dueling game, designed for a game design class.',
        preview: '/projects/survivor/index.html',
    },
    {
        id: 'cs160',
        image: '/images/projects/cs160.webp',
        title: 'CS160',
        date: '2016',
        description: 'Face Me: upload a video and get it back with a face mesh drawn on every frame.',
        preview: '/projects/cs160/index.html',
    },
    {
        id: 'personal-site',
        image: '/images/projects/personal-site.webp',
        title: 'Personal Site',
        date: '2016',
        description: 'My old portfolio, with drifting clouds and balloons tied to its hello.',
        preview: '/projects/personal-site/index.static.html',
    },
    {
        id: 'dan-james',
        image: '/images/projects/dan-james.webp',
        title: 'Dan James',
        date: '2016',
        description: 'A site for a music producer and mixing engineer, with a beat store and his mixing services.',
        preview: '/projects/dan-james/index.static.html',
    },
    {
        id: 'motorsport',
        image: '/images/projects/motorsport.webp',
        title: 'Motorsport Sites',
        date: '2014',
        description: 'Websites for an inline speed-skating team, a motorcycle race shop and a young kart racer.',
        preview: '/projects/motorsport/index.html',
    },
    {
        id: 'coloris',
        image: '/images/projects/coloris.webp',
        title: 'Coloris',
        date: '2014',
        description: 'An unfinished top-down RPG: walk Huey through a scrolling forest and change his color with the number keys.',
        preview: '/projects/coloris/index.html',
    },
    {
        id: 'isguy',
        image: '/images/projects/isguy.webp',
        title: 'The Adventures of isGuy',
        date: '2013',
        description: 'A five-level platformer with lasers, ladders, keys and doors, running again as the original Java game.',
        preview: '/projects/isguy/index.html',
    },
    {
        id: 'sketchbook',
        image: '/images/projects/sketchbook.webp',
        title: 'Sketchbook',
        date: '2012',
        description: 'Digital drawings of NinjaDonut, a few logos and some characters.',
        preview: '/projects/sketchbook/index.html',
    },
    {
        id: 'flash',
        image: '/images/projects/flash.webp',
        title: 'Flash',
        date: '2012',
        description: 'Cartoons, caricatures of friends and a side-scrolling shooter, playing again through Ruffle.',
        preview: '/projects/flash/index.html',
    },
    {
        id: 'highschool',
        image: '/images/projects/highschool.webp',
        title: 'High School Sites',
        date: '2012',
        description: 'A Flash homepage with a Pac-Man in it, and a portfolio with a parallax city skyline.',
        preview: '/projects/highschool/index.html',
    },
    {
        id: 'greenfoot-pokemon',
        image: '/images/projects/greenfoot-pokemon.webp',
        title: 'Pokémon: Green Foot Edition',
        date: '2012',
        description: 'A Pokémon fan game Logan Lovell and I made for a programming class: pick a starter and explore TrainingVille.',
        preview: '/projects/greenfoot-pokemon/index.html',
    },
    {
        id: 'escaping-confinement',
        image: '/images/projects/escaping-confinement.webp',
        title: 'Escaping Confinement',
        date: '2012',
        description: 'A five-minute Maya short about a desk fan that comes to life and tries to escape.',
        preview: '/projects/escaping-confinement/index.html',
    },
    {
        id: 'pivot',
        image: '/images/projects/pivot.webp',
        title: 'Pivot Animations',
        date: '2008',
        description: 'Stick-figure fights, sword moves, skate tricks and Goku versus Vegeta.',
        preview: '/projects/pivot/index.html',
    },
]