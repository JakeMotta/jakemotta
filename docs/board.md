# The board

The whole site is one bento board: `src/components/pages/home`, at `/` and `/home`. Jake picked the layout from the "2 · Bento" pages of the [jakemotta.com Layout Concepts canvas](https://claude.ai/artifact/Ppw6uZbYxKSoktKAXB6b4U). The tiles themselves are in `pages/home/tiles.tsx`, and the grid and every tile's look are in `pages/home/index.scss`.

## Layout

| Width | Grid | Scrolls? |
| --- | --- | --- |
| 1100px and up | 4 columns × 3 rows, exactly one screen tall. Rows stop shrinking at 220px, so a very short window scrolls. | No |
| 640–1099px | 2 columns, rows at least 250px. Hero and Projects take both columns; Now Playing is 300px tall, and Projects stops at 560px and scrolls inside. | Yes |
| Under 640px | 1 column | Yes |

On a desktop the tiles sit like this:

| | Column 1 | Column 2 | Column 3 | Column 4 |
| --- | --- | --- | --- | --- |
| Row 1 | Hero | Hero | Now Playing | Featured project |
| Row 2 | Projects | Projects | Recent listens | Dev log |
| Row 3 | Projects | Projects | Modpack | Say hi |

Jake had the music made smaller and the projects bigger on 2026-10-29: Projects grew from two cells to four (two across, two down), and Now Playing and Recent listens went down to one cell each, one above the other, so the music keeps to one column. Until then Now Playing took two cells down and Recent listens two across.

The tiles come in that order in the page (`pages/home/index.tsx`), row by row as a desktop reads them, so keyboard focus follows the board and a tablet or phone stacks them the same way.

## The tiles

- **Hero** (`HeroTile`): a "HELLO my name is" name tag. A band in ink says HELLO, then the name is written on the pale tag, a little crooked, over the one-line tagline. It held links to Music, Projects, Minecraft and Dev log too, until Jake had them taken out on 2026-10-29: each has its own tile. It's the only tile that rests tilted, and its bottom-right corner peels up on hover. It's drawn at 96% (97% on hover) with a 6px shadow, so the tilt stays inside its cell instead of reaching into Projects below (2026-10-28). Jake picked it on 2026-10-28 from three ideas in the [current-site canvas](https://claude.ai/artifact/Bq5BT6oGzdfkUWyEYK8HWf) (the other two, a marquee poster and letters hopping to the beat, are still there), to make the hero unlike the rest of the site. It holds the page's only `<h1>`.
- **Now Playing** (`NowPlayingTile`): the player. Cover, title, byline, a seek slider, previous/play/next, and at the bottom right a speaker button whose vertical volume slider shows on hover, plus **Library ↗** in the header. It also holds the sound-or-silence choice (below), and when the visitor chose silence it offers to start some music, with a random first song like **Play with sound**.
  - **One cell, on a desktop and a tablet** (since 2026-10-29). The `PlayerCard` is laid out compact there: the cover small on the left, the title, byline and seek slider beside it, the controls across the bottom. The tile is a size container, so the cover takes whatever height the header and the controls leave (`100cqh` less theirs), between 56px and 45% of the tile's width. That's about 90px on a 1440×780 window and 150px on 1920×950. Before the choice, and after silence, the record sits half out of the tile behind the words, top right while it waits and on the right edge after silence. A phone keeps the full card, with its big square cover.
  - **A song from YouTube** can't show its video in a cover that small, since YouTube's player is never under 200×200 and grown past the cover it would hide the controls. So the floating player comes up beside the tile and holds the video, while the tile keeps the cover and the controls ([music.md](music.md#songs-from-youtube)).
- **Featured project** (`FeaturedTile`): the first entry in `homeProjectList`, which is the newest, marked "Newest". The whole tile links to its viewer.
- **Dev log** (`DevlogTile`): the dev log's newest post (its date and title), a small code frequency chart of Jake's weeks of code (the same `CodeFrequency` as the dev log's, without dates or hover numbers), and his commit and GitHub contribution counts. The whole tile links to `/devlog`. It took the cell of **Up next** (the next ten songs in the shuffle) on 2026-10-29, as Jake asked; the next songs are still in the library, beside its player.
- **Projects** (`ProjectsTile`, four cells on a desktop, two across and two down): every other project as a 4:3 screenshot with its name and year, each linking to its viewer. The screenshots are at least 190px wide, as many columns as fit (three on a laptop, four on a wide screen; five small ones until 2026-10-29, when the tile grew). They scroll inside the tile once there are more than fit; **All *n* ↗** opens all of them. On a phone the board grows with its tiles, so this one stops at 300px and scrolls inside (since 2026-10-28; it used to make the page thousands of pixels long), and on a tablet at 560px.
- **Modpack** (`ModpackTile`): "Minecraft Modpack". Links to `/minecraft`, and shows the latest version from `releases.json`. Its pixel cube is 44px, the size of the featured tile's arrow button, in the same corner. It sits under Recent listens since 2026-10-29 (bottom left until then).
- **Recent listens** (`EarsTile`, one cell, under Now Playing): what Jake is listening to on Spotify, from ListenBrainz. It shows the song playing now (or the last one, "Played 40m ago") as a card that links to it, then the plays before it: the last 100, in one column, scrolling inside the tile (Jake, 2026-10-28; until then it was eight, in two columns of four). It was two cells wide, with the plays in two columns, until 2026-10-29. **Lately ↗** opens the library on its Recent listens tab (`/library?tab=recent`). It took the cell of **Surprise me** (a random-track button), which Jake removed on 2026-10-26; the placement came from the [Listening Tile Placement canvas](https://claude.ai/artifact/JvNbfMdMFpPAmT4A1rWdgW). How it works: [listening.md](listening.md).
- **Say hi** (`SayHiTile`): links to Jake's profiles (`socialLinks` in `common/constants.ts`): GitHub, LinkedIn and Instagram.

### Opening a tile

A tile with more behind it opens into an overlay. A tile that is one thing (the featured project, the dev log, the modpack) is a link as a whole. A tile that holds several things has an expand link in its header (`ExpandLink`, styled `.tile-expand`): Library, All *n*, Lately. Its whole header row opens the same overlay too, as Jake asked on 2026-10-28: the title is a link (`TitleLink`, `.tile-head__link`) stretched over the row, and the row's own buttons and links sit above it. The title doesn't tint or change colour on hover (Jake, 2026-10-29); the tile's own lift is the hint. The Favorite artists tile was taken off the board on 2026-10-27, and Recent listens grew into its cell; the artists live on as the library's Favorite artists tab. Hero and Say hi have nothing more to show, so they don't open.

## Sound or silence

Browsers only let audio start after a click. So until the visitor chooses, the Now Playing tile says "Let's kick it", and every other tile is dimmed, blurred and `inert`, with a "psst… sound or silence" sticker over them on a desktop.

- **Play with sound** starts on a random song (`playFirstSong()`, `store/first-song.ts`), as Jake asked on 2026-10-29; until then it was always Dancin. The pick is one of Jake's own songs, a song from Recent listens or one from his playlist: a source first, at random, then a song in it, so his own dozen-odd songs come up as often as a playlist of hundreds. A source with nothing playable yet sits out: Recent listens and the playlist need the listening Worker (Spotify plays reach the player through it), so until it's deployed every visit starts on one of Jake's songs. The record on the tile reads "surprise", since the song isn't picked until the click.
- **Browse in silence** (it reads "Click here if you're lame" on hover or focus) just lets them in.

Playing anything from anywhere also counts as choosing sound. The choice is the store's `entry` (`waiting`, `sound` or `silent`) and lasts until the page reloads.

## Overlays

**The board rests behind an overlay, all but its hue.** While one is open, the particles pause (`overlayOpen` in `store/common.ts`, which the board sets), and the board's own eq bars and seek slider stop drawing, since it's `inert` and out of sight. A framed project runs on the same browser thread, and a Java game in the viewer ran at half speed while all of it kept going ([projects/isguy.md](projects/isguy.md)). The hue keeps cycling at the same speed, in 2° steps rather than 1°: Jake asked on 2026-10-27 for it never to pause, so it was made cheap instead ([performance.md](performance.md#the-hue-cycle)). The music's visualizer and the overlay's own eq bars keep moving.

A tile opens as an overlay route drawn over the board, which stays mounted behind it, blurred and `inert`. The routes are children of the board's layout route in `App.tsx`, rendered into its `<Outlet />`. An overlay's path must not match a folder in `public/` (`downloads`, `images`, `music`, `projects`, `vendor`): on the live server a refresh or a shared link would get the folder, not the app. That's why the library is at `/library`, not `/music`, which redirected to a file listing of the audio.

| Route | Page | What it is |
| --- | --- | --- |
| `/library` | `pages/music` | The library: on the left the same `PlayerCard` as the board's Now Playing tile (one component, so they always match), then the next ten songs in the shuffle (click one to play it); the header's subtitle changes with the tab; on the right, My music and Favorite artists as numbered rows (`MusicRow`; cover tiles until 2026-10-28), a Playlist tab of the songs that play from YouTube (only when there are some, [music.md](music.md#songs-from-youtube)), and a last tab, Recent listens (`?tab=recent`), with the full `NowPlaying` card (link out and listen-along) above the `Lately` lists. |
| `/listening` | (redirect) | Sends old links to `/library?tab=recent`. It was its own overlay until Jake had it removed on 2026-10-27, since the library's tab shows the same. |
| `/project` | `pages/project-gallery` | Every project as cards with screenshot, name, year and description, in sections by `category` (Websites, Apps, Games, Art, Animation), each newest first (`projectSections` in `common/projects.ts`; Jake asked for the sections on 2026-10-27). The "Newest" badge stays on the newest project, wherever its section falls. It's at `/project`, singular, because `/projects/` is the folder of standalone sites, which `.htaccess` keeps from the app. |
| `/project/:id` | `pages/project` | The project viewer (see [projects/README.md](projects/README.md)). Opened from the all-projects overlay, it closes back to it; opened from the board, back to the board. The frame fills the left edge to edge; the side panel has the title, the year and `tags` pills (across the panel's full width; only the title keeps clear of the close button), the description, then "Open in a new tab" and Back and Forward at its foot. The new-tab link sat on the frame's bottom right corner until Jake had it moved on 2026-10-28, as it covered the projects (the previous and next project in the all-projects overlay's order, `orderedProjects`, wrapping from the last section to the first; replacing the history entry so the browser's Back closes the viewer). The address bar and the strip of every project were removed on 2026-10-27. |
| `/project/:id/:page` | `pages/project` | A hub's page, one step in: one of Ambii Business's apps or Ambii's old sites (`pages` in `homeProjectList`; [projects/README.md](projects/README.md#hub-pages)). The same viewer frames the page, titled with its name under a "← project" crumb. Escape, the close button and the crumb go back to the hub. |
| `/devlog` | `pages/devlog` | The dev log, opened from the board's Dev log tile: Jake's posts, his Claude usage by day and project, and his code on GitHub (commits, code frequency, the latest commits), as a board of its own (see [devlog.md](devlog.md)). |
| `/minecraft` | `pages/minecraft` | The modpack download page as a board of its own: Download, Install, Playing, Updating and Older releases tiles (Older releases replaced Troubleshooting on 2026-10-27), written for players, with one line for self-hosters (see [modpack.md](modpack.md)). |

Each uses `templates/bento-overlay`, which:
- portals the panel to `<body>`, over a scrim, under the visualizer's vignette;
- closes on Escape, on its close button and on a click on the scrim, all through the page's `onClose`, which goes to `/` (the viewer goes back to `/project` when it was opened from there). Escape also works while focus is inside a framed project, because the overlay listens in each same-origin frame's document, every page it shows, from the moment the page is parsed (it checks the frames every 100 ms). Until 2026-10-28 it started listening at the frame's load event, which waits for every image, so Escape did nothing for the first seconds of a heavy page like Ambii Business's dashboard. A live site on another domain (TapSlayDie) is out of reach; there, click the overlay outside the frame first. Escape is left alone when the page already used it (`defaultPrevented`), like a framed site closing its own lightbox, and while a framed page has a `<dialog>` open (the Sketchbook, Flash, Pivot, Fooder, CS160 extras and Ambii story galleries), since the browser closes that on Escape without marking the key used. The next Escape closes the overlay;
- moves focus to its close button on open and hands it back to whatever opened it on close.

The board turns `inert` off in a layout effect, so it's live again by the time focus comes back. On phones an overlay fills the screen and scrolls.

Wherever the Now Playing tile is out of sight (an overlay is open, or on a phone it has scrolled away) the board shows one `FloatingPlayer` (`atoms/floating-player`), portaled to `<body>` above the overlays:
- **At rest** it's a circle of the cover art, ringed with the song's progress (drawn every frame through a ref, like the visualizer). A click on the cover opens it sideways into the full `MiniPlayer` pill: title, play/pause, next and volume; another click, or a click anywhere else, closes it. Keyboard focus opens it too. It used to open on hover; Jake asked for click on 2026-10-27.
- **It can be dragged** by the cover or title to any of eight spots, the corners and the middles of the edges (never the page's centre). It snaps to the one in whichever third of the screen it's let go in, and remembers it in `localStorage` (`jakemotta:player-dock`, a per-visitor convenience). It starts bottom right.
- **Only while music plays**, as Jake asked on 2026-10-27. After a silent start, or once the music has been paused for 1.5s (`HIDE_DELAY`, so the gap between songs doesn't blink it), it's gone, and it's back the moment something plays. Two exceptions keep it up while paused: it's open (so pausing from it doesn't pull it out from under the pointer; it goes when it closes), or the song is from YouTube, whose paused video still needs a slot to sit in rather than the bare bottom-left corner.
- **It replaced** the music pill in each overlay's header, the one in the project viewer, and the phone's bottom bar, on 2026-10-27.
