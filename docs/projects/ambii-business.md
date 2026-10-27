# Ambii Business

Background music for cafés, shops and restaurants, 2019–2022. A business owner picked stations, schedules and announcements in a web dashboard, and a player in each store (a web page or a phone app) played them. It's a different product from the consumer Ambii app on the [`ambii`](ambii.md) card.

The card frames a hub page, and from there the visitor opens three working apps. They are the real apps, built from their source, but the server they talked to is gone, so a mock of its API answers them inside the browser.

## Where it came from

Four private repositories under the `shariqs` GitHub account, which Jake has access to. Visitors can't open them, so the hub doesn't link to them. Jake is the top committer on the dashboard, the server and the phone app.

| Part | Repository and commit used | Here |
| --- | --- | --- |
| Dashboard | `shariqs/ambii_business_web`, `master` 6d56131 (2022-01-07), plus the one-line tempo fix from `fix/tempo-fix` | `demos/ambii/business-web/` → `public/projects/ambii-business/dashboard/` |
| Web player | `shariqs/ambii-web-player`, `master` acc33d4 (2022-01-07) | `demos/ambii/web-player/` → `…/player/` |
| Phone app | `shariqs/ambii_business_music`, `development` b3f5284 (2021-12-11), React Native 0.61 | `demos/ambii/music-app/` → `…/mobile/` |
| Server | `shariqs/ambii_business_server`, `master` 61e7757 (2022-01-07), Express, MongoDB, Auth0, Stripe, AWS | not copied; reimplemented as `demos/ambii/mock-server/` |

Only the files each web build uses were copied (no `android/`, `ios/` or CI config). Other branches weren't used: the dashboard's `develop` adds a CSV location upload and nothing else that's finished.

## Where the source lives

The three apps' source isn't in this repository. Their upstream repositories are private and this one is public, so Jake decided on 2026-10-26 to keep it out (CLAUDE.md, "Kept and removed files").

- **On Jake's machine:** `demos/ambii/business-web/`, `web-player/` and `music-app/`, which `.gitignore` leaves out. Each holds its app as of the commit in the table, changed for the demo, with a `DEMO-CHANGES.md` that lists the changes. The phone app's web port (`music-app/web/`: the webpack config, the native-module shims and the phone-frame page) is there too. These folders are plain copies, not git checkouts.
- **Upstream, on a `jakemotta-demo` branch:** each private repository in the table has one, pushed on 2026-10-27. It is the commit in the table plus one commit with the demo's changes (the dashboard's comes after the two `fix/tempo-fix` commits), and every file in the folder above is on it unchanged, apart from the phone app's `.npmrc` (`legacy-peer-deps=true`), which that repository's `.gitignore` ignores. The branches are a backup, not something to merge: they build only inside `demos/ambii/`, next to the mock and `shared/`.
  - **Restoring the source** on another machine: clone each repository's `jakemotta-demo` branch into its folder (`ambii_business_web` → `business-web/`, `ambii-web-player` → `web-player/`, `ambii_business_music` → `music-app/`).
  - **After changing an app's source,** update its branch too. Copy the folder over a checkout of the branch, leaving out `node_modules`, `build` and `dist`, then commit and push. Otherwise the folder is again the only copy of that change. In the dashboard, `package.json` and `package-lock.json` are stored with CRLF line endings upstream; convert them back before committing, or the diff rewrites every line.
- **In this repository:** the build output in `public/projects/ambii-business/` (minified bundles, no source maps), the mock in `demos/ambii/mock-server/`, the shared build tooling in `demos/ambii/shared/`, `demos/ambii/README.md` and `scripts/build-ambii-demos.mjs`.

So a fresh clone can serve and deploy the demos but can't rebuild them until the three folders are restored from the branches, and `yarn projects:ambii` stops and names the missing folders. That includes changes to the mock, which is bundled into each app.

## How the preview runs

- **The hub** (`public/projects/ambii-business/index.html`) is hand-written and is the card's `preview`. It explains the product and the demo, links each app (the web player opens straight onto store `LBEAN7`), lists things to try and the store codes, and has a "Reset the demo" button. Its tile images in `media/hub/` are screenshots of the running apps.
- **The apps** are built output, committed like the converted PHP sites: CI only runs `yarn build`, which copies `public/` as-is, and never builds them. The dashboard and web player use hash routes, because `/projects/` has no SPA fallback; the phone app has no URL routes.
- **The mock** (`demos/ambii/mock-server/`) is bundled into each app and starts before any app code. It answers every request under `/projects/ambii-business/api` (a folder that doesn't exist on the server) from data in `localStorage`, which the three apps share because they're on one origin. So a station assigned in the dashboard reaches a player at its next track change, just as it did with the real server. Each app shows a small "Demo" badge with "Reset demo".
- **The phone app** runs through react-native-web in a phone-frame page (`mobile/index.html`, the app itself in `mobile/app/`). Its WebView screens frame the dashboard in in-app mode, two frames deep inside the viewer.
- **Nothing leaves the site.** Auth0, Stripe, Google Maps, Google's text-to-speech, analytics and the old `ambii.io` hosts are all replaced or removed. Sign-in is a one-click stand-in, subscribing uses a read-only sample card (no card fields at all), the address search suggests a few made-up places, and announcements made in the demo are spoken by the browser's own voices.

The contract between the apps (storage keys, the links between them, the WebView bridge) is in [`demos/ambii/README.md`](../../demos/ambii/README.md). The mock's routes are the `ROUTES` table in `demos/ambii/mock-server/core/server.js`, described in [`demos/ambii/mock-server/README.md`](../../demos/ambii/mock-server/README.md). Every change to an app's source carries a `DEMO:` comment and is listed in that app's `DEMO-CHANGES.md`, along with the upstream quirks that were left as they were; both are in the local copies and on the `jakemotta-demo` branches, not in this repository ([Where the source lives](#where-the-source-lives)).

## Demo data

- **The seed:** Bean & Beat Coffee Co., run by Maya Rivera, with three stores: Downtown Café `LBEAN7` (plays a station), Market Street Kiosk `LMKT42` (runs the "Café Day" schedule, and is still paired to a "Back Office iPad", so connecting asks to take over) and Airport Pop-up `LGATE3` (inactive). Twelve stations, four announcements, a saved Visa ending 4242 and three invoices. Details: the Seed section of `demos/ambii/mock-server/README.md`.
- **The music** is 13 of Jake's own tracks in `public/music/`, a fixed list (`TRACKS` in `demos/ambii/mock-server/tools/build-media.mjs`), with titles from `musicList`. Files added to the folder since, and `super_bitch.wav`, aren't in the demo. The cover art, the announcement and ad audio (recorded with Windows' built-in voices) and the Ambii logo are in `public/projects/ambii-business/media/`, made by that script, which also writes `core/media-data.js` with each track's URL and duration.
- **Renaming or removing one of those 13 tracks in `public/music/` breaks the demo's catalogue.** To change the list, edit `TRACKS` (and, for a track without its own art, a design in `tools/covers.mjs`) and `TRACK_INFO` in `core/catalogue.js`, rerun the script (Windows only, with `--deps`; see the Media section of the mock's README), bump `SEED_VERSION`, and rebuild all three apps.
- **Reset:** the badge in each app and the hub's button clear every `ambii-demo:`, `ambii-business:`, `ambii-player:` and `ambii-music:` key and the `ambii-demo` IndexedDB database (uploaded announcements). Two hand-written copies of that list exist, in the hub's script and in the phone-frame page (`demos/ambii/music-app/web/frame/index.html`); keep both in step with `RESET_PREFIXES` in the mock's `config.js`, and rebuild the phone app after editing its frame page.
- **Changing the seed:** bump `SEED_VERSION` in the mock's `config.js` and rebuild all three apps together. Visitors are reseeded whenever their stored version differs, so apps built with different versions would keep reseeding each other.

## Pausing the site's music

The apps make their own sound. Whenever one starts a song, an announcement or a preview, the mock posts `{ type: 'jakemotta:media-playing' }` to `window.top`, and the site's `MusicPlayer` pauses ([music.md](../music.md)). The phone app holds its sound until the visitor taps its "Tap to start" cover, so it never pauses the site's music on its own.

## Rebuilding

```bash
yarn projects:ambii                 # all three apps
yarn projects:ambii dashboard       # or dashboard, player, mobile
```

Rebuilding needs the apps' source in `demos/ambii/`, so it only works on Jake's machine, or on one where the folders were restored from the `jakemotta-demo` branches ([Where the source lives](#where-the-source-lives)). `scripts/build-ambii-demos.mjs` installs each app from its own lockfile (`npm ci --legacy-peer-deps`, the first time and whenever the lockfile is newer than `node_modules`), then runs its `demo:build`, which builds and copies the output into `public/projects/ambii-business/<app>/` through `demos/ambii/shared/publish-build.mjs`. That copy leaves out source maps, `asset-manifest.json` and any service worker.

- **Toolchains:** the dashboard and web player keep their Create React App builds (react-scripts 3 and 4, run through react-app-rewired, with `--openssl-legacy-provider` in their scripts for current Node). The phone app was a Metro build for iOS and Android; for the web it is bundled with webpack 5 and react-native-web, with shims for its native modules in `music-app/web/shims/`.
- **Icons:** FontAwesome Pro needed a paid token, so its icons are aliased to free stand-ins in `demos/ambii/shared/fontawesome-pro/`.
- **The mock is part of every bundle,** so a change to it means rebuilding all three apps.
- **Tests:** `node --test "test/*.test.js"` in `demos/ambii/mock-server/` runs its unit tests.
- **What's committed:** git ignores the three app folders, and `node_modules`, `build` and `dist` anywhere under `demos/`. Prettier ignores `demos/`, so the old sources keep their own formatting.

**Deploying a rebuild.** Each app's `index.html` names its hashed bundles, so a rebuild can change it without changing its length, and the deploy compares by size. The deploy workflow therefore uploads the hub and the four app `index.html` files (including `mobile/app/index.html`) on every run, like the site's own `index.html`.

## Left out on purpose

- **The apps' source,** which stays on Jake's machine and in the private repositories ([Where the source lives](#where-the-source-lives)). Source maps are left out of the build output for the same reason: they'd publish it.
- **Secrets the repositories held:** the old API keys, the CodePush key, the Google Maps key, the tracker IDs (Tag Manager, Analytics), the Auth0 settings, and, in the server, its TLS key and database connection string. None was copied. The server isn't copied at all.
- **Anything that would call another host:** Google Fonts, cdnjs, the Maps script and the Tag Manager iframe are removed from the pages. The few `ambii.io` strings left in the bundles are inert hostname checks and an email comparison. The web player also still names an S3 logo for its old MVIX white-label mode, which only switches on when the page's path contains "mvix", so it never loads here.
- **The store listings:** the app is gone from the App Store and Google Play, so the store buttons in the dashboard's Connect Player modal open the phone app demo instead.

## Card image

`public/images/projects/ambii-business.webp`, a screenshot of the hub taken by `yarn projects:screenshot ambii-business`.
