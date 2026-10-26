# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Jake Motta's personal website (jakemotta.com): a playful showcase of his work, music and other projects. The product goals that shape most changes:

- **Background music with an in-sync visualizer.** Music keeps playing while the visitor moves around the site, and the visualizer reacts to the audio that is actually playing, not to a timer.
- **Project previews.** Projects are linked from the site, and each one should show a good preview (image, title, date, description) before the visitor clicks through.
- **Fun over corporate.** The look is deliberately loud: a hue that cycles continuously, particle backgrounds, cheeky copy.

## Commands

Yarn is the package manager (`yarn.lock`, and CI runs `yarn install --frozen-lockfile`).

```bash
yarn dev          # CRA dev server on http://localhost:3000 (also the "dev" config in .claude/launch.json)
yarn build        # production build into build/, then scripts/prune-build.mjs strips what must not be published
yarn projects:convert   # regenerate the static .html pages of the PHP project sites (see Project previews)
yarn test         # Jest in watch mode (react-scripts)
yarn test --watchAll=false src/path/to/File.test.tsx   # one test file, single run
yarn prettier     # format everything (2 spaces, single quotes, semicolons, printWidth 200)
yarn modpack:release <release-folder> [--force]       # publish a Minecraft modpack release, see below
```

There are no tests in `src/` yet, and no lint script beyond the ESLint that CRA runs during `dev`/`build`. Type errors surface through the CRA build.

## Architecture

Create React App (react-scripts 5) + TypeScript, React 19, react-router v7, Ant Design 5, Tailwind 3 alongside per-component SCSS, zustand for state.

**Layout of `src/components/`** follows atomic design: `atoms/` (small pieces, including the music player and project card), `templates/` (page shells), `pages/` (routes). Each folder has an `index.ts` barrel, and new components are exported through it.

**What stays mounted across routes.** `App.tsx` renders the `<Routes>` and, beside them (outside `BrowserRouter`), `<TsParticleBackground />` and `<MusicPlayer />`. Because the player sits outside the routes it survives navigation, which is what lets music keep playing between pages. Anything else that must persist across pages belongs there too.

**Theme / color cycling.** `App.tsx` runs a `requestAnimationFrame` loop that rotates the hue through 360° every 30s from a random start and calls `setPrimaryColor`. `contexts/ThemeContext.tsx` derives `primaryDark` and writes both to the CSS variables `--color-primary` / `--color-primary-dark`. Tailwind's `primary` and `primary-dark` colors (`tailwind.config.js`) point at those variables, and the antd `ConfigProvider` theme in `App.tsx` is fed the same values. So use `text-primary`, `bg-primary-dark` etc. rather than fixed colors, and expect antd components to need their tokens wired in `App.tsx` to follow the cycling hue. `templates/color-shifting-background` paints the page background from `primaryColor` and is the shell every page wraps itself in.

**Music and visualizer.**
- `store/audio.ts` (zustand) holds the single `audioUrl`. Anything that wants to play a track calls `setAudioUrl`; the Welcome page's "Enter with Music" button and the `MusicTile`s on Home do this.
- `atoms/music-player` owns the one `<audio>` element. On each `audioUrl` change it builds a Web Audio graph (`MediaElementAudioSourceNode` → `AnalyserNode` with `fftSize` 1024 → destination), then runs a rAF loop that averages the first 5 frequency bins (bass) and writes an inset `box-shadow` straight onto the `.audio-visualizer` div through a ref. That direct DOM write, instead of React state, is what keeps the visualizer in sync at frame rate; keep new visualizer work on the same path (analyser data → ref/canvas in rAF) rather than routing per-frame values through React state.
- Browser autoplay rules: audio can only start after a user gesture, which is why the Welcome page asks the visitor to choose before entering. `AudioContext.resume()` is called before `play()` for the same reason.
- A media element can be attached to only one `MediaElementAudioSourceNode` for its lifetime. The player calls `createMediaElementSource` again on the same `<audio>` element each time the track changes, so switching tracks is a place to check when touching this code.
- `realtime-bpm-analyzer` and `react-use-audio-player` are installed but not used yet.

**Content data.** The music lists (`musicList`, `favoriteArtists`), the Home tabs and the project cards (`homeProjectList`) are static arrays in `common/constants.ts`. Adding a song or project means editing that file and putting its assets in `public/` (`public/music/`, `public/images/music/`, `public/images/projects/`), referenced by absolute paths like `/music/foo.mp3`.

**Project previews.** Two paths that look alike and must not be mixed up:
- `/project/:id` (singular) is an app route, `pages/project`. Cards link there with a router `<Link>`, so the music keeps playing. The viewer frames the project's `preview` from `homeProjectList` in a same-origin iframe, under a bar with Back and "Open in new tab". It opens links that leave `/projects/` in a new tab instead of inside the frame, and shows the screenshot with a note for projects that have no `preview` yet.
- `/projects/<site>/` (plural) are the projects themselves: standalone sites served as plain files from `public/projects/` (about 1.5GB), never routes. `.htaccess` keeps them away from the SPA. In dev, CRA's fallback answers any folder path with the app, so `preview` names the page file (`…/index.html`).

Every preview has to run as static files in the browser, with no server code:
- **PHP sites** (`pistol-art`, `ninja-donut`, `black-chamber`) only used PHP for `include`s and `echo`s, so `scripts/convert-php-sites.mjs` renders each page to an `X.html` beside its `X.php`. It also points the old domains and `.php` links at those pages, sends the mail forms to their thank-you page instead of sending email, strips old trackers, and writes `X.static.js` copies of scripts that hold such links. It stops on any PHP it doesn't understand. The generated files are committed; rerun `yarn projects:convert` after editing a `.php` page, and add new constructs to the converter rather than hand-editing the output.
  - `black-chamber` also used CouchCMS. Its `cms: true` entry in the converter turns the CMS hooks into no-ops and prints each `<cms:editable>` region's draft text under an "archived preview" note. Plain `.html` pages that need link fixes, like the Radio Show, are written as `X.static.html` beside the original.
- **CS160 (Face Me)** had a real back end (Postgres, ffmpeg, OpenFace, a C++ Delaunay program), so it isn't converted. `public/projects/cs160/` has hand-written static pages beside the restored originals. `js/faceme.js` fakes the back end: any login works, and an upload adds a sample entry without reading the file. `js/faceplot.js` triangulates the real landmark data in `js/landmarks.js`, which is generated from `faceme/data_points/*.pts`. The video frames those points came from no longer exist, so the mesh draws on a plain background. `videos/out1.webm` and `out2.webm` are the original pipeline's own output.
- **Flash** plays through Ruffle, self-hosted in `public/vendor/ruffle/` (version in `VERSION.txt`). The converter adds its script to every page with Flash.
- **Ambii** is the static landing page copied from the `JakeMotta/ambii_landing_page` repo (`public/projects/ambii/SOURCE.txt`).
- `public/projects/pistol-art/files/` also holds an unrelated compiled build of the Ambii web app (React, Auth0, the `hola.ambii.io` API) and an old scraper's notes. Neither is wired up.

Apart from regenerating the converted output, treat `public/projects/` as an archive: don't reformat or modify the original files. (`.cursorrules` likewise contains just `projects/`.)

**Minecraft modpack page.** `/minecraft` (`pages/minecraft`) is a download page for the Progression Survival modpack. It fetches `/downloads/progression-survival/releases.json` at runtime, so new releases need no code change. `scripts/release-modpack.mjs` copies a built release folder into `public/downloads/progression-survival/releases/<version>/`, audits the archives so no world, player or admin files get published, and regenerates `releases.json`, `latest.json` and that folder's `.htaccess`. Published versions are immutable; only those pointer files change between releases.

## Style

Decisions Jake has made about the look. Follow them unless he says otherwise.

- **The color-cycling background and its UI stay.** Every page sits on `ColorShiftingBackground`, the hue keeps cycling, and the particles, the inset vignette that pulses with the bass, and the floating play button bottom-right are all part of the identity. New work goes on top of them; it doesn't replace or tone them down.
- **All color comes from the cycling hue.** Use `primary` (`hsl(h, 40%, 60%)`) for the page ground and `primary-dark` (the same hue at lightness −30) for surfaces like cards and panels, through the Tailwind classes or the CSS variables. Don't introduce fixed hex colors for UI; they stop matching as the hue moves. The `secondary` and `brand` colors in `tailwind.config.js` are unused leftovers.
- **Text on `primary-dark` surfaces uses `primary-light`, not `primary`.** `primary` on `primary-dark` is only about 3:1, which is fine for 24px bold section titles but too faint for body text. `primary-light` (`--color-primary-light`, `hsl(h, 45%, 94%)`, set by `ThemeContext` alongside the other two) is the pale tint for that text and for light buttons; keep `primary` for accents.
- **Type:** the system font stack, bold weights. Section titles are `StickySectionTitle`: 24px bold `primary-dark`, sticky while their section scrolls.
- **Tone is playful.** Small tilts, lifts and springy easing on hover are welcome; corporate polish is not the goal.

### Project cards

Every project card must:

- be a real link (a router `<Link>` to `/project/<id>`), so keyboard focus and middle-click work and the music keeps playing, with a visible `:focus-visible` ring;
- show a preview: the project's screenshot from `public/images/projects/`, or, when there is none, a monogram tile in the hue. Never an empty `src` or a placeholder box;
- keep equal heights in a row: the image at a fixed 4:3 aspect ratio (the screenshots are about 257×200) and the description clamped to a few lines;
- make it obvious the card goes somewhere (on desktop the hover reveal below; on phones the always-visible arrow).

**Direction: minimal hover reveal**, built in `atoms/project-card` from the "C2" boards on the [Project Card Mockups canvas](https://claude.ai/artifact/49o5Z3bUZ81nC4gpLL5NPB). Jake picked it for being minimal; keep it that way rather than adding chrome. The cards are fed by `homeProjectList` in `common/constants.ts`: an empty `image` gives the monogram tile and an empty `description` shows none, so leave a field empty rather than writing filler.

- At rest the card is just the screenshot, edge to edge, with a small `primary-dark` pill holding the name and year.
- On hover or keyboard focus the pill fades and a `primary-dark` panel slides up from the bottom with the name, year, a one-line description (two lines at most) and a "Visit site ↗" pill in the pale tint. The card lifts slightly and the image zooms and dims a little.
- Phones have no hover, so the panel is always visible as a compact bar: name, year, a one-line description that truncates, and a round arrow button. The SCSS writes this touch layout first and layers the reveal on under `@media (hover: hover) and (min-width: 640px)`, so it's chosen by whether the device can hover, not by width alone.
- Descriptions say what the project is in one plain sentence. They don't start with "This is a project…" and aren't padded to fill space.

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

**Black Chamber and CS160 were restored only in part, on 2026-10-26.** Both came back from commit `916adc1` (they had been deleted in `f1266f1`). What was left out was left out on purpose; don't restore it to fill a gap.
- **Black Chamber:** only the six main pages, the assets they use and the Radio Show page came back. Left out: `myAdmin/` (the CMS isn't needed); `muse/` (230MB, a later export of the whole site that nothing on the main site links to); the side sites `Hackathon`, `BNBFundraiser`, `SVCED`, `Comedy`, `silentAuction`, `htdocs`, `wearecodevrhackathon`, `juneteenth`, `video1`, `video2` and `SVBCC`; `template_3-11-15.rar`; and the Radio Show's PHP mail handlers. The Radio Show's phone menu linked into `muse/`, so the converter's `redirects` send those links to the nearest main-site page instead.
- **CS160:** left out `config.php` and `faceme/test.php` (database passwords); `faceme/faceme_privatekey.ppk` (an SSH key); `Upload.php`, `Videos.php`, `grabPoints.php`, `pupilPoints.php` and `postgres.c` (each hardcodes the class VM's `postgres`/`student` login); the older `HTML/` copy; build output and binaries; the html5lightbox library; and `CS160.zip`.
- The database password, the remote host and the SSH key are still in history at `ae7c5c4` and `916adc1`. As with `myAdmin`, the remedy is changing them, not deleting files.

**Removing a file from the site takes a manual step.** Because the deploy never deletes, a file that has been uploaded stays live until it is removed in cPanel. Removing it from the repo or adding it to `prune-build.mjs` only keeps it from being uploaded again. When something that was already deployed gets pruned, remove it in cPanel too, and prefer the Trash over a permanent delete.

**Modpack downloads.** Under `public/downloads/progression-survival/`:
- A deployed release folder is never edited, overwritten or deleted. Friends and the `latest` redirects may point at it, and the deploy would not notice a same-size change anyway. A fix goes out as a new version. `--force` is only for a version that hasn't been pushed yet.
- Only the client `.mrpack`, the server `.zip`, `Release-Notes.md` and a `SHA256SUMS.txt` covering those two archives are published. The pack builder's other output stays in its own workspace on purpose: the custom-source ZIP (it holds local paths and test-command names), `mods.lock.json`, `package-acceptance.json` and the other verification files.
- Third-party mod jars are never hosted here. The `.mrpack` downloads them from their publishers (Modrinth, FTB's Maven), because the mods' licences haven't been checked for redistribution.
- `releases.json`, `latest.json` and the folder's `.htaccess` are generated by `scripts/release-modpack.mjs`; edit the script, not the output.
