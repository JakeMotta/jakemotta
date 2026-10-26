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
yarn build        # production build into build/
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

**Project links point outside the React app.** Each project's `to` is a path under `/projects/…` (e.g. `/projects/pistol-art/index.php`). Those are standalone sites served as plain files from `public/projects/` (old PHP/Flash/HTML sites, about 1.6GB together with the music) and are not routes in the app. `ProjectCard` is a plain `<a href>` to them, so the browser does a full page load; react-router's `navigate()` or `<Link>` would only change the URL inside the SPA, where no route matches `/projects/…`. Treat `public/projects/` as archived third-party content: don't reformat or modify it. (`.cursorrules` likewise contains just `projects/`.)

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

- be a real link (`<a href>`) to its `/projects/…` site, so the full page load, keyboard focus and middle-click all work, with a visible `:focus-visible` ring;
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

- **Nothing is ever deleted on the server** (no `--delete`), so the standalone `/projects/` sites and old hashed bundles survive every deploy.
- **Files are compared by size only** (`--ignore-time`), because CI rewrites every timestamp. A file whose contents change but whose length doesn't would never be re-uploaded. Hashed bundles are safe; `index.html`, `asset-manifest.json` and the modpack pointer files are uploaded unconditionally for this reason. Any new file that is rewritten in place under a fixed name needs the same explicit `put` in the workflow.
- `FTP_SERVER` must not be a Cloudflare-proxied hostname (Cloudflare does not pass FTP); the workflow's preflight step checks for this.

Hosting is Apache. `public/.htaccess` sends unknown paths to `index.html` so client-side routes such as `/home` survive a refresh, and it excludes `/projects/` so the standalone sites keep their own rewrite rules. A new top-level route needs no server change; a new directory of static files that must bypass the SPA does.
