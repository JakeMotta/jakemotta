# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Jake Motta's personal website (jakemotta.com): a playful showcase of his work, music and other projects. The product goals that shape most changes:

- **Background music with an in-sync visualizer.** Music keeps playing while the visitor moves around the site, and the visualizer reacts to the audio that is actually playing, not to a timer.
- **Project previews.** Projects are linked from the site, and each one should show a good preview (image, title, date, description) before the visitor clicks through.
- **Fun over corporate.** The look is deliberately loud: a hue that cycles continuously, particle backgrounds, cheeky copy.

## Documentation

This file holds the rules for the whole repo. The detail lives in `docs/`:

- [`docs/projects/README.md`](docs/projects/README.md): how project previews and card images work, and the checklist for adding a project. Each project has its own page beside it (`docs/projects/<card id>.md`), covering where the project came from, how its preview runs, and what was left out on purpose.
- [`docs/board.md`](docs/board.md): the bento board, its tiles, the sound-or-silence choice, and the overlays its tiles open.
- [`docs/music.md`](docs/music.md): the music player, its queue and shuffle, and the visualizer.
- [`docs/modpack.md`](docs/modpack.md): publishing a Minecraft modpack release, and the rules for the downloads.

**Keep the docs current as part of every change.** When a change alters behavior, a decision, a workflow or what's kept or removed, update this file or the relevant `docs/` page in the same commit; Jake has asked for this standing. If something has no home yet, such as a new project or feature, create its page and link it here. Docs live in `docs/`, never in `public/`, which is deployed.

## Commands

Yarn is the package manager (`yarn.lock`, and CI runs `yarn install --frozen-lockfile`).

```bash
yarn dev          # CRA dev server on http://localhost:3000 (also the "dev" config in .claude/launch.json)
yarn build        # production build into build/, then scripts/prune-build.mjs strips what must not be published
yarn projects:convert   # regenerate the static .html pages of the PHP project sites (see Project previews)
yarn projects:screenshot [id…]   # retake the project card images from the running previews; needs `yarn dev`
yarn test         # Jest in watch mode (react-scripts)
yarn test --watchAll=false src/path/to/File.test.tsx   # one test file, single run
yarn prettier     # format everything (2 spaces, single quotes, semicolons, printWidth 200)
yarn modpack:release <release-folder> [--force]       # publish a Minecraft modpack release, see below
```

There are no tests in `src/` yet, and no lint script beyond the ESLint that CRA runs during `dev`/`build`. Type errors surface through the CRA build.

## Architecture

Create React App (react-scripts 5) + TypeScript, React 19, react-router v7, Ant Design 5, Tailwind 3 alongside per-component SCSS, zustand for state.

**Layout of `src/components/`** follows atomic design: `atoms/` (small pieces: the music player, the transport and sliders, cover art, project images, the eq bars), `templates/` (page shells: the color-shifting background and the overlay), `pages/` (routes). Each folder has an `index.ts` barrel, and new components are exported through it.

**The board and its overlays** (full spec in [`docs/board.md`](docs/board.md)). The whole site is one bento board, `pages/home`, at `/` (and `/home`). Its tiles open as overlays drawn over it, each a route of its own: `/music` (`pages/music`), `/project` (all projects, `pages/project-gallery`), `/project/:id` (`pages/project`) and `/minecraft` (`pages/minecraft`). A tile that holds several things opens through an expand link in its header, like the Now Playing tile's Library. In `App.tsx` the board is a layout route and the overlays render into its `<Outlet />`, so the board stays mounted, dimmed and inert, behind whichever one is open, and Back, Escape or the close button return to it. Overlays use `templates/bento-overlay`, which portals them to `<body>`. Any other path redirects to `/`.

**What stays mounted across routes.** `App.tsx` renders the `<Routes>` and, beside them (outside `BrowserRouter`), `<TsParticleBackground />` and `<MusicPlayer />`. Because the player sits outside the routes it survives navigation, which is what lets music keep playing between pages. Anything else that must persist across pages belongs there too.

**Theme / color cycling.** `App.tsx` runs a `requestAnimationFrame` loop that rotates the hue through 360° every 30s from a random start and calls `setPrimaryColor`. `contexts/ThemeContext.tsx` derives `primaryDark`, `primaryLight` and `primaryInk` and writes all four to the CSS variables `--color-primary`, `--color-primary-dark`, `--color-primary-light` and `--color-primary-ink`. Tailwind's `primary`, `primary-dark`, `primary-light` and `primary-ink` colors (`tailwind.config.js`) point at those variables, and the antd `ConfigProvider` theme in `App.tsx` is fed the same values. So use `text-primary`, `bg-primary-dark` etc. (or the variables in SCSS) rather than fixed colors. No antd components are in use any more; one added later needs its tokens wired in `App.tsx` to follow the cycling hue. `templates/color-shifting-background` paints the page background from `primaryColor` and is the shell the board wraps itself in.

**Music and visualizer** (full spec in [`docs/music.md`](docs/music.md)).
- `store/audio.ts` (zustand) holds the playing `audioUrl`, the visitor's `queue`, the `shuffled` fallback, a `history` for Previous, `isPlaying`, `volume` and the visitor's `entry` choice. It also holds the `<audio>` element and its `AudioContext`, which the player registers, so every control (`togglePlayback`, `playNext`, `playPrevious`, `setVolume`) drives the one element from anywhere. `setAudioUrl` plays a track now; `toggleQueued` adds or removes it from the queue. When a track ends, `playNext` plays the next queued track, else the next shuffled one. The shuffle is kept topped up, never repeating the track that just ended, so "Up next" always has something to show.
- `atoms/music-player` owns the one `<audio>` element and has no buttons of its own. It builds the Web Audio graph once, on the first track: a media element can feed only one `MediaElementAudioSourceNode` for its lifetime. A rAF loop reads two adaptive bands (lows and highs) and writes the vignette's `box-shadow` straight onto `.audio-visualizer` through a ref. It also writes the levels to `audioLevels`, which the small `EqBars` read in their own loops. That direct DOM write, instead of React state, keeps the visualizers in sync at frame rate; keep per-frame work on that path (the seek slider follows the same rule).
- Browser autoplay rules: audio can only start after a user gesture. That's why the board's Now Playing tile asks the visitor to choose sound or silence before anything plays, and the rest of the board waits, dimmed, until they do. `AudioContext.resume()` is called before `play()` for the same reason.
- `realtime-bpm-analyzer` and `react-use-audio-player` are installed but not used yet.

**Content data.** The music lists (`musicList`, `favoriteArtists`), the welcome track (`welcomeTrack`, what "Play with sound" starts) and the projects (`homeProjectList`) are static arrays in `common/constants.ts`; `common/music.ts` derives the shuffle library and looks tracks up by URL. Adding a song or project means editing that file and putting its assets in `public/` (`public/music/`, `public/images/music/`, `public/images/projects/`), referenced by absolute paths like `/music/foo.mp3`. A track's `description` shows in the library's player, so leave it empty rather than writing filler.

**Project previews** (how they work and how to add one: [`docs/projects/README.md`](docs/projects/README.md); one page per project beside it). Two paths that look alike and must not be mixed up:
- `/project/:id` (singular) is an app route, `pages/project`: the project viewer, an overlay on the board. `/project` with no id lists every project (`pages/project-gallery`); never put an app route at `/projects`, which the server hands to the static sites. The board's project tiles link there with a router `<Link>`, so the music keeps playing. The viewer frames the project's `preview` from `homeProjectList` under an address bar with previous/next and "Open in new tab", with a strip of every project below it and the project's details beside it. Stepping between projects replaces the history entry, so Back closes the viewer.
  - **Link handling:** it opens links that leave `/projects/` in a new tab, leaves `javascript:` links to run in place, and shows the screenshot with a note for a project that has no `preview`.
  - **Live sites:** `preview` can also be a live site's own address (TapSlayDie). That frame is cross-origin, and the link handling can't reach into it.
- `/projects/<site>/` (plural) are the projects themselves: standalone sites served as plain files from `public/projects/`, never routes. `.htaccess` keeps them away from the SPA. In dev, CRA's fallback answers any folder path with the app, so `preview` names the page file (`…/index.html`).

Every preview has to run in the browser with no server code. PHP sites are rendered to static `.html` by `scripts/convert-php-sites.mjs` (`yarn projects:convert`). The generated files are committed. Teach the converter a new construct rather than hand-editing its output. An app with a real back end gets hand-written static pages that fake it (CS160). Flash plays through Ruffle, self-hosted in `public/vendor/ruffle/`.

Apart from regenerating the converted output, treat `public/projects/` as an archive: don't reformat or modify the original files. (`.cursorrules` likewise contains just `projects/`.)

**Card images** are screenshots of each running preview, taken by `yarn projects:screenshot` (`scripts/screenshot-projects.mjs`) as `public/images/projects/<id>.webp`. A new project needs an entry in that script's `SHOTS` list too.

**Minecraft modpack page.** `/minecraft` (`pages/minecraft`) is the modpack tile opened: the Progression Survival download page, laid out as a board of its own over the main one. It and the board's modpack tile read `/downloads/progression-survival/releases.json` at runtime (`common/modpack.ts`), and `yarn modpack:release` publishes a new version. Procedure and rules: [`docs/modpack.md`](docs/modpack.md).

## Style

Decisions Jake has made about the look. Follow them unless he says otherwise.

- **The color-cycling background and its UI stay.** The board sits on `ColorShiftingBackground`, the hue keeps cycling, and the particles and the inset vignette that pulses with the bass are part of the identity. New work goes on top of them; it doesn't replace or tone them down. The player lives in the board's Now Playing tile, and wherever that tile is out of sight (in the overlays, and on phones once it scrolls away) a `MiniPlayer` pill takes over. Together they replaced the old floating play button.
- **All color comes from the cycling hue.** Use `primary` (`hsl(h, 40%, 60%)`) for the page ground and `primary-dark` (the same hue at lightness −30) for surfaces like tiles and panels, through the Tailwind classes or the CSS variables. Don't introduce fixed hex colors for UI; they stop matching as the hue moves. The `secondary` and `brand` colors in `tailwind.config.js` are unused leftovers.
- **Text on `primary-dark` surfaces uses `primary-light`, not `primary`.** `primary` on `primary-dark` is only about 3:1, which is fine for 24px bold titles but too faint for body text. `primary-light` (`--color-primary-light`, `hsl(h, 45%, 94%)`) is the pale tint for that text and for light buttons; keep `primary` for accents.
- **Text straight on the ground uses `primary-ink`.** `primary-dark` on `primary` is under 3:1 too. `primary-ink` (`--color-primary-ink`, `hsl(h, 45%, 15%)`) is the near-black of the hue, for text and rims on the page ground and on `primary-light` tiles.
- **Type:** the system font stack, bold weights: 900 for names and headings, 800 for most other text. Tiles head themselves with a small uppercase eyebrow or a bold heading; there are no sticky section titles any more.
- **Tone is playful.** Small tilts, lifts and springy easing on hover are welcome; corporate polish is not the goal. Every tile leans its own way on hover (`--tilt`), and `prefers-reduced-motion` turns the tilts and spins off.

### The board

**Direction: the Bento board**, built from the "2 · Bento" pages of the [jakemotta.com Layout Concepts canvas](https://claude.ai/artifact/Ppw6uZbYxKSoktKAXB6b4U). Jake picked it over five other layouts. Tile by tile it's described in [`docs/board.md`](docs/board.md); the rules that hold across it:

- Desktop (1100px and up) is four columns by three rows, exactly one screen tall, with no page scroll. Tablets get two columns and phones one, and there the board scrolls.
- A tile that does one thing is one link or button; a tile that holds several things is a `<section>` with a heading.
- Opening a tile never leaves the board: it's an overlay route over it (see Architecture).
- Before the visitor chooses sound or silence, only the Now Playing tile is live; the rest are dimmed and inert. The choice isn't remembered across reloads, since sound can't start without a click anyway.

### Project tiles

Projects appear on the board as the featured tile (the first, newest entry in `homeProjectList`, marked "Newest") and as small screenshots in the Projects tile, and in the viewer's strip. Every one of them must:

- be a real link (a router `<Link>` to `/project/<id>`), so keyboard focus and middle-click work and the music keeps playing, with a visible `:focus-visible` ring (pale with a dark halo, so it shows on any surface);
- show a preview through `atoms/project-image`: the project's screenshot from `public/images/projects/`, or, when there is none, a monogram tile in the hue. Never an empty `src` or a placeholder box;
- keep the image at a fixed 4:3 aspect ratio (the screenshots are 960×720 WebP from `yarn projects:screenshot`), names truncated and descriptions clamped to two lines;
- make it obvious it goes somewhere: a lift and tilt on hover, and the featured tile's arrow.

The tiles are fed by `homeProjectList` in `common/constants.ts`: an empty `image` gives the monogram tile and an empty `description` shows none, so leave a field empty rather than writing filler. Descriptions say what the project is in one plain sentence. They don't start with "This is a project…" and aren't padded to fill space.

## Deployment

Pushing to `master` deploys (`.github/workflows/deploy.yml`): `yarn build`, then `lftp mirror --reverse` of `build/` to the host over FTPS. Things that follow from how it works:

- **Nothing is ever deleted on the server** (no `--delete`), so the standalone `/projects/` sites and old hashed bundles survive every deploy. That also means a file once uploaded stays public, which is why `yarn build` prunes `pistol-art/myAdmin` (an old CMS admin whose `config.php` holds database credentials) and every `.php` under `projects/` before the upload ever sees them.
- **Files are compared by size only** (`--ignore-time`), because CI rewrites every timestamp. A file whose contents change but whose length doesn't would never be re-uploaded. Hashed bundles are safe; `index.html`, `asset-manifest.json` and the modpack pointer files are uploaded unconditionally for this reason. Any new file that is rewritten in place under a fixed name needs the same explicit `put` in the workflow.
- `FTP_SERVER` must not be a Cloudflare-proxied hostname (Cloudflare does not pass FTP); the workflow's preflight step checks for this. It is the Namecheap server's own name, `premium313.web-hosting.com`, whose certificate (`*.web-hosting.com`) passes the workflow's certificate check; a `jakemotta.com` name would not. `FTP_SERVER_DIR` is `/public_html/`, because the FTP accounts start in the home directory, one level above the web root.

Hosting is Namecheap shared hosting (cPanel user `jakedufc`), served by LiteSpeed, which reads Apache `.htaccess` files. `public/.htaccess` sends unknown paths to `index.html` so client-side routes such as `/home` survive a refresh, and it excludes `/projects/` so the standalone sites keep their own rewrite rules. A new top-level route needs no server change; a new directory of static files that must bypass the SPA does.

## Kept and removed files

Settled decisions about what is in the repo, what is published and what has been removed. Don't reverse one without Jake asking.

**In the repo but never published.** `public/projects/pistol-art/myAdmin/` and every `.php` under `public/projects/` stay in the repo and are stripped from `build/` by `scripts/prune-build.mjs`.
- The `.php` files are the source that `yarn projects:convert` reads to write the `.html` pages that are published. Deleting them would leave nothing to regenerate from.
- `myAdmin` is kept as part of the archive (see Project previews). Its `config.php` holds a database password that has been in the public repo since the first commit. Deleting the file now would not remove it from the history, so the remedy is changing that password, not deleting or rewriting files.
- Don't remove either from `prune-build.mjs`, and don't publish them some other way. The mail handlers (`contact_send.php`, `form_send.php`) would send real email.

**Removed from the server on 2026-10-26.** The first deploy to succeed uploaded `myAdmin` and 137 `.php` files before the prune script existed. They were moved to cPanel's Trash (`/home/jakedufc/.trash`) by hand and now return 404. Don't restore them from the Trash, and don't re-upload them to "fix" a `.php` link: the fix is in the converter, which points links at the `.html` pages.

**Black Chamber and CS160 were restored only in part, on 2026-10-26.** Both came back from commit `916adc1`, having been deleted in `f1266f1`. Whatever was left out was left out on purpose: `myAdmin`, Black Chamber's 230MB `muse/` export and side sites, and every CS160 file holding a password or key. Don't restore any of it to fill a gap. Each project's page lists what was left out and why: [`black-chamber.md`](docs/projects/black-chamber.md), [`cs160.md`](docs/projects/cs160.md). The credentials those files held are still in history at `ae7c5c4` and `916adc1`; as with `myAdmin`, the remedy is changing them, not deleting files.

**TapSlayDie isn't copied into this repo.** Its card frames the live site, and only the card image lives here ([`tapslaydie.md`](docs/projects/tapslaydie.md)).

**Removing a file from the site takes a manual step.** Because the deploy never deletes, a file that has been uploaded stays live until it is removed in cPanel. Removing it from the repo or adding it to `prune-build.mjs` only keeps it from being uploaded again. When something that was already deployed gets pruned, remove it in cPanel too, and prefer the Trash over a permanent delete.

**Modpack downloads.** A deployed release folder is never edited, overwritten or deleted, so a fix ships as a new version. Only the `.mrpack`, the server `.zip`, the release notes and their checksums are published. Third-party mod jars are never hosted here. The full rules are in [`docs/modpack.md`](docs/modpack.md).

**Old card images.** `public/images/projects/` keeps the earlier screenshots (`ambii.png`, `pistolArt.png` and others) that the cards no longer use. They're archive, and CS160's pages use their own copy of `faceme_output.png`. Don't delete them to tidy up.
