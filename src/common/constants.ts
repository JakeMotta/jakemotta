import { TabsProps } from "antd";
import { MusicItemProps } from "../components/atoms";

export const siteSections = {
    music: 'Music',
    stats: 'Stats',
    about: 'About',
    blog: 'Blog',
    goals: 'Goals',
    skills: 'Skills',
    projects: 'Projects',
    work: 'Work',
    contact: 'Contact'
} as const;

export const musicTabs: TabsProps['items'] = [
    {
        key: '1',
        label: 'My Music',
    },
    {
        key: '2',
        label: 'Favorite Artists',
    },
    {
        key: '3',
        label: 'Recommended Music',
    },
];


export const musicList: MusicItemProps[] = [
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Uprising',
        description: 'Feeling like the first song I had created from scratch in a long while.',
        url: '/music/uprising.mp3',
        date: '2022'
    },
    {
        image: '/images/music/marceline.jpg',
        title: 'S3RL feat. Sara - Marceline the Vampire Queen (A Bad Remix)',
        description: 'My second attempt at a remix. Was really happy with how this turned out.',
        url: '/music/marceline.mp3',
        date: '2022'
    },
    {
        image: '/images/music/super_bitch.jpg',
        title: 'Super Bitch (ft. Anzu)',
        description: "Made in one night with no purpose.",
        url: '/music/super_bitch.wav',
        date: '2022'
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
        description: 'My first attempt at a remix',
        url: '/music/anguish.mp3',
        date: '2017'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Breathe',
        description: 'My first attempt at a remix',
        url: '/music/breathe.mp3',
        date: '2017'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Fearless',
        description: 'My first attempt at a remix',
        url: '/music/fearless.mp3',
        date: '2016'
    },
    {
        image: '/images/music/hide_and_seek.jpg',
        title: 'Hide & Seek - Les Edit',
        description: 'My first attempt at a remix',
        url: '/music/hide_and_seek.mp3',
        date: '2016'
    },
    {
        image: '/images/music/transition.jpg',
        title: 'Transition',
        description: 'My first attempt at a remix',
        url: '/music/transition.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Identity',
        description: 'My first attempt at a remix',
        url: '/music/identity.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Stepping Clouds',
        description: 'My first attempt at a remix',
        url: '/music/stepping_clouds.mp3',
        date: '2015'
    },
    {
        image: '/images/music/ctrl_alt_del.jpeg',
        title: 'Innocence',
        description: 'My first attempt at a remix',
        url: '/music/innocence.mp3',
        date: '2012'
    },
]

export const favoriteArtists: MusicItemProps[] = [
    {
        image: '/images/marceline.jpg',
        title: 'S3RL',
        description: 'My second attempt at a remix',
        url: '/music/marceline.mp3',
        date: '2022'
    },
    {
        image: '/images/super_bitch.jpg',
        title: 'WeAreCastor',
        description: 'A valid description',
        url: '/music/super_bitch.wav',
        date: '2022'
    },
    {
        image: '',
        title: 'Dancin',
        description: 'My first attempt at a remix',
        url: '/music/dancin.mp3',
        date: '2016'
    },
]

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
        id: 'ambii',
        image: '/images/projects/ambii.webp',
        title: 'Ambii',
        date: '2025',
        description: '',
        preview: '/projects/ambii/index.html',
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
        id: 'cs160',
        image: '/images/projects/cs160.webp',
        title: 'CS160',
        date: '2016',
        description: 'Face Me: upload a video and get it back with a face mesh drawn on every frame.',
        preview: '/projects/cs160/index.html',
    },
]