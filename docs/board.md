# The board

The whole site is one bento board: `src/components/pages/home`, at `/` and `/home`. Jake picked the layout from the "2 · Bento" pages of the [jakemotta.com Layout Concepts canvas](https://claude.ai/artifact/Ppw6uZbYxKSoktKAXB6b4U). The tiles themselves are in `pages/home/tiles.tsx`, and the grid and every tile's look are in `pages/home/index.scss`.

## Layout

| Width | Grid | Scrolls? |
| --- | --- | --- |
| 1100px and up | 4 columns × 3 rows, exactly one screen tall. Rows stop shrinking at 220px, so a very short window scrolls. | No |
| 640–1099px | 2 columns, rows at least 250px | Yes |
| Under 640px | 1 column | Yes |

On a desktop the tiles sit like this:

| | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| Row 1 | Hero | Hero | Now Playing | Featured project |
| Row 2 | Projects | Projects | Now Playing | Up next |
| Row 3 | Modpack | Recent listens | Recent listens | Say hi |

## The tiles

- **Hero** (`HeroTile`): on an opaque surface mixed from `primary` and `primary-light` (mostly the ground), with the ink outline, the name, the one-line tagline and links to Music (`/library`), Projects (`/project`), Minecraft (`/minecraft`) and Dev log (`/devlog`, added 2026-10-27). It holds the page's only `<h1>`.
- **Now Playing** (`NowPlayingTile`): the player. Cover, title, byline, a seek slider, previous/play/next and a speaker button whose vertical volume slider shows on hover, plus **Library ↗**. It also holds the sound-or-silence choice (below), and when the visitor chose silence it offers to start the welcome track.
- **Featured project** (`FeaturedTile`): the first entry in `homeProjectList`, which is the newest, marked "Newest". The whole tile links to its viewer.
- **Up next** (`UpNextTile`): every song left in the shuffle, scrolling inside the tile. Clicking one plays it now. **All songs ↗** opens the library.
- **Projects** (`ProjectsTile`): every other project as a small 4:3 screenshot with its name and year, each linking to its viewer. The screenshots scroll inside the tile once there are more than fit; **All *n* ↗** opens all of them.
- **Modpack** (`ModpackTile`): links to `/minecraft`, and shows the latest version from `releases.json`.
- **Recent listens** (`EarsTile`, two cells wide on a desktop): what Jake is listening to on Spotify, from ListenBrainz. The plays before the card run in two columns, up to six. It shows the song playing now (or the last one, "Played 40m ago") as a card that links to it, then the plays before it, as many as fit. **Lately ↗** opens the library on its Recent listens tab (`/library?tab=recent`). It took the cell of **Surprise me** (a random-track button), which Jake removed on 2026-10-26; the placement came from the [Listening Tile Placement canvas](https://claude.ai/artifact/JvNbfMdMFpPAmT4A1rWdgW). How it works: [listening.md](listening.md).
- **Say hi** (`SayHiTile`): links to Jake's profiles (`socialLinks` in `common/constants.ts`): GitHub, LinkedIn and Instagram.

### Opening a tile

A tile with more behind it opens into an overlay. A tile that is one thing (the featured project, the modpack) is a link as a whole. A tile that holds several things has an expand link in its header (`ExpandLink`, styled `.tile-expand`): Library, All songs, All *n*, Lately. The Favorite artists tile was taken off the board on 2026-10-27, and Recent listens grew into its cell; the artists live on as the library's Favorite artists tab. Hero and Say hi have nothing more to show, so they don't open.

## Sound or silence

Browsers only let audio start after a click. So until the visitor chooses, the Now Playing tile says "Kick on them tunes", and every other tile is dimmed, blurred and `inert`, with a "psst… sound or silence" sticker over them on a desktop.

- **Play with sound** plays `welcomeTrack` (Dancin).
- **Browse in silence** (it reads "Click here if you're lame" on hover or focus) just lets them in.

Playing anything from anywhere also counts as choosing sound. The choice is the store's `entry` (`waiting`, `sound` or `silent`) and lasts until the page reloads.

## Overlays

A tile opens as an overlay route drawn over the board, which stays mounted behind it, blurred and `inert`. The routes are children of the board's layout route in `App.tsx`, rendered into its `<Outlet />`. An overlay's path must not match a folder in `public/` (`downloads`, `images`, `music`, `projects`, `vendor`): on the live server a refresh or a shared link would get the folder, not the app. That's why the library is at `/library`, not `/music`, which redirected to a file listing of the audio.

| Route | Page | What it is |
| --- | --- | --- |
| `/library` | `pages/music` | The library: on the left the same `PlayerCard` as the board's Now Playing tile (one component, so they always match), then every song left in the shuffle, scrolling (click one to play it); the header's subtitle changes with the tab; My music and Favorite artists as cover tiles on the right, each with a play button, a Playlist tab of the songs that play from YouTube (only when there are some, [music.md](music.md#songs-from-youtube)), and a last tab, Recent listens (`?tab=recent`), with the full `NowPlaying` card (link out and listen-along) above the `Lately` lists. |
| `/listening` | (redirect) | Sends old links to `/library?tab=recent`. It was its own overlay until Jake had it removed on 2026-10-27, since the library's tab shows the same. |
| `/project` | `pages/project-gallery` | Every project, newest first, as cards with screenshot, name, year and description. It's at `/project`, singular, because `/projects/` is the folder of standalone sites, which `.htaccess` keeps from the app. |
| `/project/:id` | `pages/project` | The project viewer (see [projects/README.md](projects/README.md)). Opened from the all-projects overlay, it closes back to it; opened from the board, back to the board. The frame fills the left edge to edge, with "Open in a new tab" on its bottom right corner; the side panel has the title, the year and `tags` pills, the description, then Back and Forward at its foot (the previous and next project, replacing the history entry so the browser's Back closes the viewer). The address bar and the strip of every project were removed on 2026-10-27. |
| `/devlog` | `pages/devlog` | The dev log, opened from the Hero's Dev log chip: Jake's posts, his Claude usage by day and project, and the latest commits, as a board of its own (see [devlog.md](devlog.md)). |
| `/minecraft` | `pages/minecraft` | The modpack download page as a board of its own: Download, Install, Playing, Updating and Older releases tiles (Older releases replaced Troubleshooting on 2026-10-27), written for players, with one line for self-hosters (see [modpack.md](modpack.md)). |

Each uses `templates/bento-overlay`, which:
- portals the panel to `<body>`, over a scrim, under the visualizer's vignette;
- closes on Escape, on its close button and on a click on the scrim, all through the page's `onClose`, which goes to `/` (the viewer goes back to `/project` when it was opened from there). Escape also works while focus is inside a framed project, because the overlay listens in each same-origin frame's document every time it loads a page. A live site on another domain (TapSlayDie) is out of reach; there, click the overlay outside the frame first. Escape is left alone when the page already used it (`defaultPrevented`), like a framed site closing its own lightbox, and while a framed page has a `<dialog>` open (the Sketchbook, Flash, Pivot, Fooder, CS160 extras and Ambii story galleries), since the browser closes that on Escape without marking the key used. The next Escape closes the overlay;
- moves focus to its close button on open and hands it back to whatever opened it on close.

The board turns `inert` off in a layout effect, so it's live again by the time focus comes back. On phones an overlay fills the screen and scrolls.

Wherever the Now Playing tile is out of sight (an overlay is open, or on a phone it has scrolled away) the board shows one `FloatingPlayer` (`atoms/floating-player`), portaled to `<body>` above the overlays:
- **At rest** it's a circle of the cover art, ringed with the song's progress (drawn every frame through a ref, like the visualizer). A click on the cover opens it sideways into the full `MiniPlayer` pill: title, play/pause, next and volume; another click, or a click anywhere else, closes it. Keyboard focus opens it too. It used to open on hover; Jake asked for click on 2026-10-27.
- **It can be dragged** by the cover or title to any of eight spots, the corners and the middles of the edges (never the page's centre). It snaps to the one in whichever third of the screen it's let go in, and remembers it in `localStorage` (`jakemotta:player-dock`, a per-visitor convenience). It starts bottom right.
- **It replaced** the music pill in each overlay's header, the one in the project viewer, and the phone's bottom bar, on 2026-10-27.
