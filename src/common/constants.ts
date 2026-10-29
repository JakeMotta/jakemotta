import content from '../content.json';

export interface MusicItemProps {
    image: string;
    title: string;
    date: string;
    /** Shown in the library's player and under the song in its list. Leave it empty rather than writing filler. */
    description: string;
    /**
     * A file in public/music/, or a song that plays from YouTube (common/music.ts):
     * `youtube:<video id>`, `spotify:<track id>` or `song:<artist>/<title>`.
     */
    url: string;
    /** Whose song it is, for songs that aren't Jake's. Shown in place of "Jake Motta · year". */
    artist?: string;
}

/** Jake's own songs, in the library's order. Each one's name, year, description, cover and file are in src/content.json. */
export const musicList: MusicItemProps[] = content.music;

/**
 * Songs that play from YouTube, in the shuffle with everything else. `url` is `youtube:` and the
 * video's ID (the part after `v=` in its link). Leave `image` empty to use the video's thumbnail,
 * which for YouTube Music's own uploads is the album art. The songs on Jake's Spotify playlist join
 * these when the listening Worker is running (docs/music.md).
 *
 *     { image: '', title: 'Song', artist: 'Artist', description: '', url: 'youtube:dQw4w9WgXcQ', date: '' },
 */
export const youtubeSongs: MusicItemProps[] = [];

/** The board's Say hi tile, in this order. public/index.html lists the same profiles as the Person's sameAs. */
export const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/JakeMotta' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jakemotta/' },
    { label: 'Instagram', url: 'https://www.instagram.com/foulprogramming' },
];

/** The sections of the all-projects overlay, in the order they're shown. */
export const projectCategories = [
    { id: 'website', label: 'Websites' },
    { id: 'app', label: 'Apps' },
    { id: 'game', label: 'Games' },
    { id: 'art', label: 'Art' },
    { id: 'animation', label: 'Animation' },
] as const;

export type ProjectCategory = (typeof projectCategories)[number]['id'];

export interface HomeProject {
    id: string;
    image: string;
    title: string;
    date: string;
    // Which section of the all-projects overlay it's in (common/projects.ts)
    category: ProjectCategory;
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
    /**
     * The separate things a hub preview opens, like Ambii Business's three apps. Each gets its own
     * address under the project's, /project/:id/:slug, which frames its `preview`, so Escape steps
     * back to the hub instead of closing the viewer. A link in the hub to a page's file opens it
     * there, keeping the link's own query and hash.
     */
    pages?: ProjectPage[];
    /**
     * A copy to take home, shown as a Download button in the viewer: every game that has a desktop
     * build gets one. `label` is the button's text and `note` the small print under it (what it
     * needs to run). Downloads live in the project's folder under /projects/, usually in download/.
     */
    download?: { url: string; label: string; note?: string };
}

export interface ProjectPage {
    slug: string;
    title: string;
    preview: string;
}

/**
 * Old card ids, so links to them still land on a project: cards that held several projects before
 * each got its own, and Computer Desk, which went into Maya Models on 2026-10-29.
 */
export const movedProjects: Record<string, string> = {
    motorsport: 'team-safe',
    highschool: 'highschool-portfolio',
    cs134: 'floor-is-lava',
    'maya-desk': 'maya-models',
};

/** What a project needs besides its words: everything in HomeProject but its name, year and description */
type ProjectDetails = Omit<HomeProject, 'id' | 'title' | 'date' | 'description'>;

/**
 * Each project's card image, section, tags, preview and the rest, by id. Its name, year and
 * description, and the order of the projects (newest first), are in src/content.json; a new project
 * goes in both. Leave `image` empty to show a monogram tile. Card images are screenshots of each
 * running preview, made by `yarn projects:screenshot` (scripts/screenshot-projects.mjs) as
 * /images/projects/<id>.webp; add a new project there too. Each project's notes are in docs/projects/<id>.md.
 */
const projectDetails: Record<string, ProjectDetails> = {
    tapslaydie: {
        image: '/images/projects/tapslaydie.webp',
        category: 'game',
        tags: ['Mobile Game'],
        preview: 'https://tapslaydie.com/',
    },
    asteroids: {
        image: '/images/projects/asteroids.webp?v=2',
        category: 'game',
        tags: ['HTML5 Game'],
        preview: '/projects/asteroids/index.html',
        download: { url: '/projects/asteroids/download/asteroids-windows.zip', label: 'Download for Windows', note: '34 MB. Unzip and run Asteroids.exe.' },
    },
    'ambii-business': {
        image: '/images/projects/ambii-business.webp',
        category: 'app',
        tags: ['Web App', 'Mobile App'],
        preview: '/projects/ambii-business/index.html',
        pages: [
            { slug: 'dashboard', title: 'Dashboard', preview: '/projects/ambii-business/dashboard/index.html' },
            { slug: 'player', title: 'Web player', preview: '/projects/ambii-business/player/index.html#/LBEAN7' },
            { slug: 'phone', title: 'Phone app', preview: '/projects/ambii-business/mobile/index.html' },
        ],
    },
    ambii: {
        image: '/images/projects/ambii.webp',
        category: 'app',
        tags: ['Startup', 'App', 'Website'],
        preview: '/projects/ambii/story/index.html',
        pages: [
            { slug: 'landing-2018', title: 'Play Music Together', preview: '/projects/ambii/index.html' },
            { slug: 'template-site', title: 'Join the Party!', preview: '/projects/ambii/story/sites/2019-02/index.static.html' },
            { slug: 'wireframes', title: 'Wireframes', preview: '/projects/ambii/story/wireframes/pages/page229050244-sketched.xhtml' },
            { slug: 'prototype', title: 'Clickable prototype', preview: '/projects/ambii/story/prototype/pages/page229050244-sketched.xhtml' },
            { slug: 'site-2019', title: 'Your Music. Everywhere.', preview: '/projects/ambii/story/sites/2019-09/alora/index.html' },
        ],
    },
    'floor-is-lava': {
        image: '/images/projects/floor-is-lava.webp',
        category: 'game',
        tags: ['Java Game', 'School'],
        preview: '/projects/cs134/floor-is-lava.html',
        download: { url: '/projects/cs134/download/the-floor-is-lava.zip', label: 'Download the game', note: '48 MB. Unzip and open TheFloorIsLava.jar from its folder. Needs Java (java.com). Made for Windows.' },
    },
    'scott-pilgrim': {
        image: '/images/projects/scott-pilgrim.webp',
        category: 'game',
        tags: ['Java Game', 'School'],
        preview: '/projects/cs134/scott-pilgrim.html',
        download: { url: '/projects/cs134/download/scott-pilgrim.zip', label: 'Download the game', note: '9 MB. Unzip and open scott-pilgrim.jar from its folder. Needs Java (java.com). Made for Windows.' },
    },
    fooder: {
        image: '/images/projects/fooder.webp',
        category: 'app',
        tags: ['Android App', 'School'],
        preview: '/projects/fooder/index.html',
    },
    psycho: {
        image: '/images/projects/psycho.webp',
        category: 'game',
        tags: ['Web Game', 'School'],
        preview: '/projects/psycho/play.html',
    },
    'black-chamber-2017': {
        image: '/images/projects/black-chamber-2017.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/black-chamber-2017/index.static.html',
    },
    'pistol-art': {
        image: '/images/projects/pistol-art.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/pistol-art/index.html',
    },
    'cs160': {
        image: '/images/projects/cs160.webp',
        category: 'app',
        tags: ['Web App', 'School'],
        preview: '/projects/cs160/index.html',
    },
    'dan-james': {
        image: '/images/projects/dan-james.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/dan-james/index.static.html',
    },
    'black-chamber': {
        image: '/images/projects/black-chamber.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/black-chamber/index.html',
    },
    'team-safe': {
        image: '/images/projects/team-safe.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/motorsport/team-safe/About.html',
    },
    'ninjadonut-game': {
        image: '/images/projects/ninjadonut-game.webp',
        category: 'game',
        tags: ['Java Game'],
        preview: '/projects/ninjadonut-game/index.html',
    },
    coloris: {
        image: '/images/projects/coloris.webp?v=2',
        category: 'game',
        tags: ['Java Game'],
        preview: '/projects/coloris/index.html',
        download: { url: '/projects/coloris/download/coloris.zip', label: 'Download the game', note: '6 MB. Unzip and open play-coloris.jar. Needs Java (java.com). Windows, Mac or Linux.' },
    },
    rebound: {
        image: '/images/projects/rebound.webp',
        category: 'game',
        tags: ['Java Game'],
        preview: '/projects/rebound/index.html',
    },
    isguy: {
        image: '/images/projects/isguy.webp?v=2',
        category: 'game',
        tags: ['Java Game'],
        preview: '/projects/isguy/index.html',
        download: { url: '/projects/isguy/isGuyFinal.jar', label: 'Download the game', note: '40 MB. Open isGuyFinal.jar. Needs Java (java.com). Windows, Mac or Linux.' },
    },
    'personal-site': {
        image: '/images/projects/personal-site.webp?v=2',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/personal-site/index%20(2).static.html',
    },
    flash: {
        image: '/images/projects/flash.webp',
        category: 'art',
        tags: ['Flash', 'Animation'],
        preview: '/projects/flash/index.html',
    },
    sketchbook: {
        image: '/images/projects/sketchbook.webp',
        category: 'art',
        tags: ['Art'],
        preview: '/projects/sketchbook/index.html',
    },
    'highschool-portfolio': {
        image: '/images/projects/highschool-portfolio.webp',
        category: 'website',
        tags: ['Website'],
        preview: '/projects/highschool/oldSite/index.static.html',
    },
    randomchance: {
        image: '/images/projects/randomchance.webp',
        category: 'game',
        tags: ['Java Game'],
        preview: '/projects/randomchance/index.html',
    },
    'greenfoot-pokemon': {
        image: '/images/projects/greenfoot-pokemon.webp?v=2',
        category: 'game',
        tags: ['Java Game', 'School'],
        preview: '/projects/greenfoot-pokemon/index.html',
        download: { url: '/projects/greenfoot-pokemon/download/pokemon-green-foot-edition.zip', label: 'Download the game', note: '14 MB. Unzip and open pokemon-green-foot-edition.jar. Needs Java (java.com). Windows, Mac or Linux.' },
    },
    'escaping-confinement': {
        image: '/images/projects/escaping-confinement.webp',
        category: 'animation',
        tags: ['3D Animation', 'Short Film', 'School'],
        preview: '/projects/escaping-confinement/index.html',
    },
    'jakes-index': {
        image: '/images/projects/jakes-index.webp',
        category: 'website',
        tags: ['Website', 'Flash', 'School'],
        preview: '/projects/highschool/flashIndex/FlashIndex.static.html',
    },
    ninjadonut: {
        image: '/images/projects/ninjadonut.webp',
        category: 'website',
        tags: ['Website', 'Games', 'Comics'],
        preview: '/projects/ninja-donut/index.html',
    },
    'maya-models': {
        image: '/images/projects/maya-models.webp?v=2',
        category: 'art',
        tags: ['3D Models', 'Maya'],
        preview: '/projects/maya-models/index.html',
    },
    pivot: {
        image: '/images/projects/pivot.webp',
        category: 'animation',
        tags: ['Animation'],
        preview: '/projects/pivot/index.html',
    },
};

/** Every project, in src/content.json's order, with its details from above */
export const homeProjectList: HomeProject[] = content.projects.map((words) => {
    const details = projectDetails[words.id];
    if (!details) throw new Error(`src/content.json has a project with no details in constants.ts: ${words.id}`);
    return { ...words, ...details };
});