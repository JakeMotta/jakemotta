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
| Row 3 | Modpack | Favorite artists | Surprise me | Say hi |

## The tiles

- **Hero** (`HeroTile`): the name, the one-line tagline, whether sound is on, and links to Music (`/music`), Projects (the newest project's viewer) and Minecraft (`/minecraft`). It holds the page's only `<h1>`.
- **Now Playing** (`NowPlayingTile`): the player. Cover, title, byline, a seek slider and previous/play/next, plus a link to the library. It also holds the sound-or-silence choice (below), and when the visitor chose silence it offers to start the welcome track.
- **Featured project** (`FeaturedTile`): the first entry in `homeProjectList`, which is the newest, marked "Newest". The whole tile links to its viewer.
- **Up next** (`UpNextTile`): the next four tracks, queued ones first with their place in line, then the shuffle. Clicking one plays it now.
- **Projects** (`ProjectsTile`): every other project as a small 4:3 screenshot with its name and year, each linking to its viewer.
- **Modpack** (`ModpackTile`): links to `/minecraft`, and shows the latest version from `releases.json`.
- **Favorite artists** (`ArtistsTile`): the names in `favoriteArtists`; clicking one plays its track.
- **Surprise me** (`SurpriseTile`): plays a random track that isn't the one playing.
- **Say hi** (`SayHiTile`): Jake's GitHub.

## Sound or silence

Browsers only let audio start after a click. So until the visitor chooses, the Now Playing tile asks "Press play to come in", and every other tile is dimmed, blurred and `inert`, with a "shh… pick one first" sticker over them on a desktop.

- **Play with sound** plays `welcomeTrack` (Dancin).
- **Browse in silence** (it reads "Click here if you're lame" on hover or focus) just lets them in.

Playing anything from anywhere also counts as choosing sound. The choice is the store's `entry` (`waiting`, `sound` or `silent`) and lasts until the page reloads.

## Overlays

A tile opens as an overlay route drawn over the board, which stays mounted behind it, blurred and `inert`. The routes are children of the board's layout route in `App.tsx`, rendered into its `<Outlet />`:

| Route | Page | What it is |
| --- | --- | --- |
| `/music` | `pages/music` | The library: the big player, volume and the queue on the left; My music and Favorite artists as cover tiles on the right, each with play and a queue toggle. |
| `/project/:id` | `pages/project` | The project viewer (see [projects/README.md](projects/README.md)). |
| `/minecraft` | `pages/minecraft` | The modpack download page as a board of its own: Download, Install, Playing, Updating, Troubleshooting and Server files tiles (see [modpack.md](modpack.md)). |

Each uses `templates/bento-overlay`, which:
- portals the panel to `<body>`, over a scrim, under the visualizer's vignette;
- closes on Escape, on its close button and on a click on the scrim, all by going to `/`;
- moves focus to its close button on open and hands it back to whatever opened it on close.

The board turns `inert` off in a layout effect, so it's live again by the time focus comes back. On phones an overlay fills the screen and scrolls.

The overlays carry a `MiniPlayer` (the library has the full player instead), so the music stays in reach. On phones the same pill is fixed to the bottom of the board whenever the Now Playing tile has scrolled out of view.
