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