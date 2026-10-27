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
| Row 3 | Modpack | Favorite artists | In Jake's ears | Say hi |

## The tiles

- **Hero** (`HeroTile`): the name, the one-line tagline, whether sound is on, and links to Music (`/library`), Projects (`/project`) and Minecraft (`/minecraft`). It holds the page's only `<h1>`.
- **Now Playing** (`NowPlayingTile`): the player. Cover, title, byline, a seek slider and previous/play/next, plus **Library ↗**. It also holds the sound-or-silence choice (below), and when the visitor chose silence it offers to start the welcome track.
- **Featured project** (`FeaturedTile`): the first entry in `homeProjectList`, which is the newest, marked "Newest". The whole tile links to its viewer.
- **Up next** (`UpNextTile`): the next four tracks, queued ones first with their place in line, then the shuffle. Clicking one plays it now. **Queue ↗** opens the library, where the queue is.
- **Projects** (`ProjectsTile`): every other project as a small 4:3 screenshot with its name and year, each linking to its viewer. The screenshots scroll inside the tile once there are more than fit; **All *n* ↗** opens all of them.
- **Modpack** (`ModpackTile`): links to `/minecraft`, and shows the latest version from `releases.json`.
- **Favorite artists** (`ArtistsTile`): the names in `favoriteArtists`; clicking one plays its track. **Library ↗** opens the library on its Favorite artists tab (`/library?tab=favorites`).
- **In Jake's ears** (`EarsTile`): what Jake is listening to on Spotify, from ListenBrainz. It shows the song playing now (or the last one, "Spun 40m ago") as a card that links to it, then the plays before it, as many as fit. **Lately ↗** opens `/listening`. It took the cell of **Surprise me** (a random-track button), which Jake removed on 2026-10-26; the placement came from the [Listening Tile Placement canvas](https://claude.ai/artifact/JvNbfMdMFpPAmT4A1rWdgW). How it works: [listening.md](listening.md).
- **Say hi** (`SayHiTile`): Jake's GitHub.

### Opening a tile

A tile with more behind it opens into an overlay. A tile that is one thing (the featured project, the modpack) is a link as a whole. A tile that holds several things has an expand link in its header (`ExpandLink`, styled `.tile-expand`): Library, Queue, All *n*, Lately. Hero and Say hi have nothing more to show, so they don't open.

## Sound or silence

Browsers only let audio start after a click. So until the visitor chooses, the Now Playing tile asks "Press play to come in", and every other tile is dimmed, blurred and `inert`, with a "shh… pick one first" sticker over them on a desktop.

- **Play with sound** plays `welcomeTrack` (Dancin).
- **Browse in silence** (it reads "Click here if you're lame" on hover or focus) just lets them in.

Playing anything from anywhere also counts as choosing sound. The choice is the store's `entry` (`waiting`, `sound` or `silent`) and lasts until the page reloads.

## Overlays

A tile opens as an overlay route drawn over the board, which stays mounted behind it, blurred and `inert`. The routes are children of the board's layout route in `App.tsx`, rendered into its `<Outlet />`. An overlay's path must not match a folder in `public/` (`downloads`, `images`, `music`, `projects`, `vendor`): on the live server a refresh or a shared link would get the folder, not the app. That's why the library is at `/library`, not `/music`, which redirected to a file listing of the audio.

| Route | Page | What it is |
| --- | --- | --- |
| `/library` | `pages/music` | The library: the big player, volume and the queue on the left; My music and Favorite artists as cover tiles on the right, each with play and a queue toggle. |
| `/listening` | `pages/listening` | In Jake's ears opened: the song Jake has on now (or had on last), big, with "Open in Spotify" and listen-along, beside his recent plays and top songs, albums and artists (see [listening.md](listening.md)). |
| `/project` | `pages/project-gallery` | Every project, newest first, as cards with screenshot, name, year and description. It's at `/project`, singular, because `/projects/` is the folder of standalone sites, which `.htaccess` keeps from the app. |
| `/project/:id` | `pages/project` | The project viewer (see [projects/README.md](projects/README.md)). Opened from the all-projects overlay, it closes back to it; opened from the board, back to the board. Its side panel links to all projects too. The strip under the frame holds every project, more than fit, so it keeps the open one centred: at once when the viewer opens, then gliding as the visitor steps (at once under reduced motion). |
| `/minecraft` | `pages/minecraft` | The modpack download page as a board of its own: Download, Install, Playing, Updating and Troubleshooting tiles, written for players, with one line for self-hosters (see [modpack.md](modpack.md)). |

Each uses `templates/bento-overlay`, which:
- portals the panel to `<body>`, over a scrim, under the visualizer's vignette;
- closes on Escape, on its close button and on a click on the scrim, all through the page's `onClose`, which goes to `/` (the viewer goes back to `/project` when it was opened from there). Escape also works while focus is inside a framed project, because the overlay listens in each same-origin frame's document every time it loads a page. A live site on another domain (TapSlayDie) is out of reach; there, click the overlay outside the frame first. Escape is left alone when the page already used it (`defaultPrevented`), like a framed site closing its own lightbox, and while a framed page has a `<dialog>` open (the Sketchbook, Flash, Pivot, Fooder, CS160 extras and Ambii story galleries), since the browser closes that on Escape without marking the key used. The next Escape closes the overlay;
- moves focus to its close button on open and hands it back to whatever opened it on close.

The board turns `inert` off in a layout effect, so it's live again by the time focus comes back. On phones an overlay fills the screen and scrolls.

The overlays carry a `MiniPlayer` (the library has the full player instead), so the music stays in reach. On phones the same pill is fixed to the bottom of the board whenever the Now Playing tile has scrolled out of view.
