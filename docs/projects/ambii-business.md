# Ambii Business

Background music for cafés, shops and restaurants, 2019–2022. A business owner picked stations, schedules and announcements in a web dashboard, and a player in each store (a web page or a phone app) played them. It's a different product from the consumer Ambii app on the [`ambii`](ambii.md) card.

The card frames a hub page, and from there the visitor opens three working apps. They are the real apps, built from their source, but the server they talked to is gone, so a mock of its API answers them inside the browser.

## Where it came from

Four private repositories under the `shariqs` GitHub account, which Jake has access to. Visitors can't open them, so the hub doesn't link to them. Jake is the top committer on the dashboard, the server and the phone app.

| Part | Repository and commit used | Here |
| --- | --- | --- |
| Dashboard | `shariqs/ambii_business_web`, `master` 6d56131 (2022-01-07), plus the one-line tempo fix from `fix/tempo-fix` and the CSV location upload from `develop` | `demos/ambii/business-web/` → `public/projects/ambii-business/dashboard/` |
| Web player | `shariqs/ambii-web-player`, `master` acc33d4 (2022-01-07) | `demos/ambii/web-player/` → `…/player/` |
| Phone app | `shariqs/ambii_business_music`, `development` b3f5284 (2021-12-11), React Native 0.61 | `demos/ambii/music-app/` → `…/mobile/` |
| Server | `shariqs/ambii_business_server`, `master` 61e7757 (2022-01-07), Express, MongoDB, Auth0, Stripe, AWS | not copied; reimplemented as `demos/ambii/mock-server/` |

Only the files each web build uses were copied (no `android/`, `ios/` or CI config). The dashboard's CSV location upload is the one thing taken from another branch: Jake's last finished dashboard feature, on `develop` (8794c19, a406e61 and 03edb53, merged as PR #53 on 2022-01-17 and never deployed), brought in on top of `master`. Its server half (`createMultipleLocationsAPI` on the server's `develop`) is reimplemented in the mock. No other branch was used.

## Where the source lives

The three apps' source isn't in this repository. Their upstream repositories are private and this one is public, so Jake decided on 2026-10-26 to keep it out (CLAUDE.md, "Kept and removed files").

- **On Jake's machine:** `demos/ambii/business-web/`, `web-player/` and `music-app/`, which `.gitignore` leaves out. Each holds its app as of the commit in the table, changed for the demo, with a `DEMO-CHANGES.md` that lists the changes. The phone app's web port (`music-app/web/`: the webpack config, the native-module shims and the phone-frame page) is there too. These folders are plain copies, not git checkouts.
- **Upstream, on a `jakemotta-demo` branch:** each private repository in the table has one, first pushed on 2026-10-27. It is the commit in the table plus the demo's commits: the first with the demo as it went live (the dashboard's comes after the two `fix/tempo-fix` commits), the second, pushed on 2026-10-28, with the expansion (the guest music's credit line, the CSV upload, signup and the rest; dashboard 95d2a90, web player 5caaba4, phone app 3bc1eb5). Every file in the folder above is on it unchanged, apart from the phone app's `.npmrc` (`legacy-peer-deps=true`), which that repository's `.gitignore` ignores. The branches are a backup, not something to merge: they build only inside `demos/ambii/`, next to the mock and `shared/`.
  - **Restoring the source** on another machine: clone each repository's `jakemotta-demo` branch into its folder (`ambii_business_web` → `business-web/`, `ambii-web-player` → `web-player/`, `ambii_business_music` → `music-app/`).
  - **After changing an app's source,** update its branch too. Copy the folder over a checkout of the branch, leaving out `node_modules`, `build` and `dist`, then commit and push. Otherwise the folder is again the only copy of that change. Copying never deletes, so a file removed from the folder needs a `git rm` on the branch. A file that is on the branch but not in the folder isn't always one the demo removed, though: the folders never held the phone app's `android/` and `ios/`, the CI config or the editor settings, and those stay on the branch. In the dashboard, `package.json` and `package-lock.json` are stored with CRLF line endings upstream; convert them back before committing, or the diff rewrites every line.
- **In this repository:** the build output in `public/projects/ambii-business/` (minified bundles, no source maps), the mock in `demos/ambii/mock-server/`, the shared build tooling in `demos/ambii/shared/`, `demos/ambii/README.md` and `scripts/build-ambii-demos.mjs`.

So a fresh clone can serve and deploy the demos but can't rebuild them until the three folders are restored from the branches, and `yarn projects:ambii` stops and names the missing folders. That includes changes to the mock, which is bundled into each app.

## How the preview runs

- **The hub** (`public/projects/ambii-business/index.html`) is hand-written and is the card's `preview`. It explains the product and the demo, links each app (the web player opens straight onto store `LBEAN7`), lists things to try and the seven store codes, says what's different from the real thing, credits the music, and has a "Reset the demo" button. Its tile images in `media/hub/` are screenshots of the running apps. The music credits, between its `<!-- credits:start -->` and `<!-- credits:end -->` markers, are written by the mock's `tools/build-media.mjs` from `core/guests.js` ([Music](#music)), so edit that file, not the list.
- **Each app has its own address** in the viewer: `/project/ambii-business/dashboard`, `/player` and `/phone` (`pages` in its `homeProjectList` entry; [README.md](README.md#hub-pages)). The hub's links open them there, with their hash routes. Escape on an app returns to the hub.
- **The invoice page** (`invoice.html`, beside the hub) is hand-written too: the stand-in for Stripe's hosted invoice page, which the dashboard opens from Settings > Invoices as `invoice.html?id=<invoice id>`. It reads the invoice from the mock's `ambii-demo:invoices` in localStorage, loads nothing else, and has a Print button. With no id, or one this browser doesn't have, it lists the invoices that are there.
- **The apps** are built output, committed like the converted PHP sites: CI only runs `yarn build`, which copies `public/` as-is, and never builds them. The dashboard and web player use hash routes, because `/projects/` has no SPA fallback; the phone app has no URL routes.
- **The mock** (`demos/ambii/mock-server/`) is bundled into each app and starts before any app code. It answers every request under `/projects/ambii-business/api` (a folder that doesn't exist on the server) from data in `localStorage`, which the three apps share because they're on one origin. So a station assigned in the dashboard reaches a player at its next track change, just as it did with the real server. Each app shows a small "Demo" badge with "Reset demo".
- **The phone app** runs through react-native-web in a phone-frame page (`mobile/index.html`, the app itself in `mobile/app/`). Its WebView screens frame the dashboard in in-app mode, two frames deep inside the viewer.
- **Nothing leaves the site.** Auth0, Stripe, Google Maps, Google's text-to-speech, analytics and the old `ambii.io` hosts are all replaced or removed. Sign-in is a one-click stand-in, subscribing uses a read-only sample card (no card fields at all), the address search suggests a few made-up places, the CSV upload's template is the demo's own sample, and announcements made in the demo are spoken by the browser's own voices over music beds the demo synthesizes.

The contract between the apps (storage keys, the links between them, the WebView bridge) is in [`demos/ambii/README.md`](../../demos/ambii/README.md). The mock's routes are the `ROUTES` table in `demos/ambii/mock-server/core/server.js`, described in [`demos/ambii/mock-server/README.md`](../../demos/ambii/mock-server/README.md). Every change to an app's source carries a `DEMO:` comment and is listed in that app's `DEMO-CHANGES.md`, along with the upstream quirks that were left as they were; both are in the local copies and on the `jakemotta-demo` branches, not in this repository ([Where the source lives](#where-the-source-lives)). One change goes beyond the original rather than restoring it: the web player's station picker works on phones and tablets, as a full-width sheet (the original had no layout for it at 990 px and under).

## Demo data

The seed is a café chain, Bean & Beat Coffee Co., run by Maya Rivera, as whom the visitor is already signed in. It's about 12½ months old, on Premium, with seven stores. Details, ids and the departures from the real server are in the Seed section of `demos/ambii/mock-server/README.md`.

| Code | Store | What it shows |
| --- | --- | --- |
| `LBEAN7` | Downtown Café, San Jose | Plays Morning Pour-Over, and players may change station. No player is paired, so the hub's link connects at once. The Welcome announcement plays here. |
| `LMKT42` | Market Street Kiosk, San Jose | The Café Day schedule. Its "Back Office iPad" has it, so connecting asks to take over. |
| `LJACK5` | Jack London Square, Oakland | The Night Owl schedule, explicit songs allowed. The "Bar iPad" has it. |
| `LPAVE8` | Palo Alto Roastery | The Weekend Brunch schedule, on its own Tapioca Tempo until its first block starts; players may change station. A Galaxy Tab has it. |
| `LSURF8` | Santa Cruz Surf Shack | Weekend Brunch, on Saturday Rush until its first block starts. A Lenovo tablet has it. |
| `LCSTR6` | Castro Street Café, Mountain View | Night Owl, with no player yet, so the web player opens straight onto the schedule row and its day parts. |
| `LGATE3` | Airport Pop-up, San Jose | A seasonal pop-up, switched off since, so players are turned away. |

- **Schedules:** Café Day (Morning, Afternoon, Evening and Late Night, every day), Weekend Brunch (Brunch and Weekend Afternoon, Saturdays and Sundays only) and Night Owl (Daytime, Happy Hour, Evening and a Late Night that runs past midnight). Each block has a generated station of its genres and tempo band.
- **Simulated players:** the four tablets are stand-ins (a demo-only `simulated: true` on the player), so the dashboard's Locations page shows those stores Online with Now Playing on a first visit, as a real owner would have seen them. Nothing runs in the background: what they play is worked out from the clock whenever the dashboard looks, and a scheduled one follows its schedule. A real player that connects to one asks to take over, then carries on from the song the store was on.
- **Announcements:** five. Happy Hour (every 15 minutes), Closing Soon (weekdays at 21:45), Loyalty Card Promo (an uploaded file, hourly), Holiday Hours (assigned nowhere) and Welcome on `LBEAN7`, which the mock moves to two minutes after the next whole minute at every connect there, so a short visit hears it once, until the visitor edits its time. All five are recordings ([Announcements](#announcements)).
- **Billing:** Premium, a saved Visa ending 4242 (brand and last four only), and 13 monthly invoices at $16 for each store open on the billing day, from $16 to $96; the newest is still open, so the dashboard shows its red dot. Each opens the invoice page. Cancelling drops the company to the free plan; subscribing again switches every store back on, the closed Airport Pop-up included, as the real server did.
- **A business of the visitor's own:** besides Bean & Beat, the mock can hold one more business. Opening `dashboard/index.html?signup#/stations` (the hub's "Start your own business"), pressing Favorite on a station while signed out, or Assign in the phone app while signed out, starts it. That runs the original onboarding: "Let's set up your first location!", the place search with its made-up places, company and owner details, confetti, then a free-plan account with the banner, the Upgrade tabs, ads in its stores' queues and extra stores created inactive. It has no business type, so it sees the restaurant station rows, as every real customer did. Bean & Beat stays as it was: Sign In returns to Maya, signing up again returns to the same new business, and Reset clears it. Its store codes work in the web player and the phone app.
- **CSV upload:** the dashboard's Locations page has "Upload CSV", whose template link downloads `media/sample-locations.csv` (three made-up stores, hand-written).
- **Reset:** the badge in each app and the hub's button clear every `ambii-demo:`, `ambii-business:`, `ambii-player:` and `ambii-music:` key and the `ambii-demo` IndexedDB database (uploaded announcements). Two hand-written copies of that list exist, in the hub's script and in the phone-frame page (`demos/ambii/music-app/web/frame/index.html`); keep both in step with `RESET_PREFIXES` in the mock's `config.js`, and rebuild the phone app after editing its frame page.
- **Changing the seed, the catalogue or the stations:** bump `SEED_VERSION` in the mock's `config.js` (3 since 2026-10-27) and rebuild all three apps together. Visitors are reseeded whenever their stored version differs, so apps built with different versions would keep reseeding each other.

## Music

81 tracks, nearly five hours: 14 of Jake's own and 67 free-licensed tracks by 26 other artists. Jake chose free-licensed music over streaming from YouTube (2026-10-27), so the stations have some variety without anything playing from another host.

- **Jake's tracks** are a fixed list (`TRACKS` in `demos/ambii/mock-server/tools/build-media.mjs`, and `TRACK_INFO` in `core/catalogue.js` with each one's year, tempo and genres), titled as in `musicList`. They play from `public/music/`, except the seven over about 5 MB (`OWN_TRACKS_REENCODED` in `core/guests.js`): the players download each track whole, the web player as a base64 data URI, so the demo serves 128 kbps copies of those from `media/music/`. `public/music/` keeps the originals for the site's own player. Files added to that folder since, and `super_bitch.wav`, aren't in the demo.
- **The guest tracks** are listed in `core/guests.js` (`GUEST_ARTISTS`, `GUEST_ALBUMS`, `GUEST_TRACKS`, `LICENSES`), on albums where the artist released them that way, each with its licence, `page` (where the licensor states the licence) and `file` (the licensor's or library's own download). They're re-encoded to 128 kbps at a common loudness into `media/tracks/<slug>.mp3`, with their title, artist, album, licence and source page in the file's tags.
- **The art** for the guests is drawn for the demo by `tools/covers.mjs`, not taken from the artists: a cover per album or single in `media/albums/` (a style per main genre; the covers in one style take the palettes in turn, so no two look alike) and a picture per artist in `media/artists/`. Jake's tracks use his own art where they have it.
- **Sizes:** `media/tracks/` is about 216 MB and `media/music/` 30 MB, committed and uploaded once by the first deploy that carries them.

### Licence rules

Decided with Jake on 2026-10-27. Every track was found, then checked again independently.

- Only CC0, CC BY or CC BY-SA, stated by the rights holder or the hosting library on its own page. No NC or ND licences, no custom "free for videos" licences, no rips from YouTube.
- The artist's site-wide terms count too. An artist whose terms add a condition the demo breaks is out, whatever the track's page says.
- The file comes from the licensor's or the library's own download.

**Rejected, so don't add them back:**

- Audionautix (Jason Shaw): his terms require the music to be part of some other work.
- Scott Buckley: no standalone streaming; his music has to be synced to other media.
- Silverman Sound (Shane Ivers): no standalone redistribution.
- Sascha Ende: custom terms on top of CC BY.
- Advent Chamber Orchestra: its own notes put the recordings under the EFF Open Audio License, not plainly CC BY-SA.
- Dan Knoflicek: his stated position is that his music is for games.
- José Rafael, LowDown Brass Band and Dal Studio: their licensing contradicts itself between Jamendo and their own pages.
- ccMixter: it refuses downloads that don't come from its own pages, and working around that wasn't done.

**Kept, with conditions:**

- Josh Woodward asks for his credit by the player controls, and that the demo isn't presented as music for real stores.
- Nihilore asks that titles be shown exactly as published.
- The Free Music Archive asks that credits link the track's page, not the MP3. The hub's "source" links are the `page`s.
- Brylie Christopher asks to be credited as "Music by Brylie Christopher (brylie.music)", with a link. The hub links her name to brylie.music, and the player line names it.

An artist's `credit` in `guests.js` is how they ask to be credited; it goes into the files' tags.

### The credit line in the players

Every guest track carries a demo-only `credit` field, built in `core/catalogue.js` from its licence and its artist's `label`, or the host of their `site` where they have no label ("CC BY 4.0 · joshwoodward.com"). An artist whose site is a profile on a library gets a label, so the line doesn't name only the library: "Free Music Archive", "tcarisland on OpenGameArt" (as Thor Arisland asks), "ko-fi.com/zanelittle". All three players show it in a small line under the artist, a DEMO change in each (the web player's `containers/player`, the phone's `screens/MusicPlayer`, the dashboard's preview player `components/player`), because Josh Woodward asks for his credit by the player controls; every guest gets the same line. Jake's own tracks have none. The dashboard's station preview stops above its player bar so the line stays in view while a preview plays. The full credit (title, album, source page, licence) is in the hub's list and in each file's tags.

### Stations

- **32 static stations** in `core/station-list.js`, 12 to 30 tracks each. Their ids are `61a7d0…n` (16, 27 and 33 unused), except Ambii Essentials, which has the server's default station id; the 12 stations from before the expansion kept their ids and names.
- **Rows:** Popular Today 9; Coffee Curiosity, Classical Cappuccino, Boba Beats, Countryside Cafe, "Late Night Study " (with its trailing space), Barbecue Bash, Asian Eats, Taco Truck Temposetter and Royalty Dining 4 each; Hamburger Hits 5; Bookstore Barista 3. A station can be in more than one row. Bean & Beat sees the cafe rows (its demo-only `businessType`). The restaurant rows matter too: the real company record had no business type, so every customer saw them, and here a signed-out visitor and a new business do.
- **Picked by `tools/pick-stations.mjs`:** per station, the genres it wants, a preferred tempo range, a size and a few pinned tracks; a heavier penalty each time a track is reused, at most 7 stations per track beyond its pins, and at most 4 tracks per artist. It prints each station's length, tempo band, main genre, artists and worst overlap, and with `--write` rewrites `station-list.js` with explicit lists. The lists are kept as written, so adding music doesn't reshuffle the stations unless it's rerun.
- **Spread:** every track is on 3 to 9 stations. Stations of the same family overlap a lot (up to 86%, Porch Swing and Harvest Table), because the catalogue is 81 tracks, not the thousands the real service had.
- **The preview** shows each station's 10 popular songs (its first ten, each artist at most twice, topped up from the rest when the station has too few artists: Fast Lane's 12 tracks are by 5) and its 5 featured artists (by share of the station).
- **Genres and tempo:** album genres only use the dashboard's 13 genre keys (`GENRE_KEYS` in `catalogue.js`), and a guest album's genres are the most common among its tracks. A track's tempo is the licensor's stated BPM where there is one, else `fetch-guest-tracks.mjs`'s estimate, halved or doubled where it read the wrong octave for the genre.
- **Schedule blocks:** a block's generated station takes the tracks of its genres in its tempo band, topped up to 12 (`MIN_DYNAMIC_TRACKS`) with the closest tempos; a track whose main genre is one of the block's comes before one that only lists it second. Most of the catalogue sits at 110 BPM and under, so the seeded blocks use the bands the music fills.

### Adding or removing a guest track

The tools take their npm packages from a folder of their own, passed as `--deps` (not the site's `node_modules`): `fetch-guest-tracks.mjs` needs mpg123-decoder 1, @wasm-audio-decoders/ogg-vorbis 0.1 and wasm-media-encoders 0.7, and `build-media.mjs` needs sharp 0.33, lamejs 1.2.1 and music-metadata 7. One folder can hold all six. The commands below run from the repository root, with `tools/` short for `demos/ambii/mock-server/tools/`.

**Adding one:**

1. **Check its licence** against the rules above, on the track's own page and in the artist's terms.
2. **Add it to `core/guests.js`:** the artist to `GUEST_ARTISTS` if new (the next unused `n`, `name`, `site`, `credit` if they ask for a wording, and `label` if their site is a profile on a library), the album to `GUEST_ALBUMS` if the track is from a multi-track release (a track without one is a single), and the track to `GUEST_TRACKS`: a new `n` (never reuse one: the track's id and its ISRC, `AMBDMO####`, come from it), `slug` (its file name), `title` exactly as published, `artist`, `album`, `year`, `bpm`, `genres` (from the 13 keys, main first), `license` (a key of `LICENSES`), `page` and `file`.
3. **Fetch it:** `node tools/fetch-guest-tracks.mjs --deps <dir> --only <slug>`. It downloads `file` into a cache outside the repository, brings it to -14 LUFS without letting it decode above a 0.98 peak, encodes 128 kbps stereo and writes `media/tracks/<slug>.mp3` with its tags. It prints a tempo estimate for `bpm` when the licensor gives none.
4. **Draw its art:** `node tools/build-media.mjs --deps <dir> --images-only` (the album's cover, and a new artist's picture).
5. **Measure it:** `node tools/build-media.mjs --deps <dir> --tracks-only`. This writes its duration and size into `core/media-data.js` (the catalogue only takes a guest track once it has been measured) and rewrites the hub's music credits.
6. **Put it on stations:** add its slug to stations in `core/station-list.js` by hand, or re-pick them all with `node tools/pick-stations.mjs` (read its report, then rerun with `--write`). A test checks that every track is on a station.
7. **Bump `SEED_VERSION`** in `demos/ambii/mock-server/config.js`, so stored queues and schedule stations are rebuilt with it.
8. **Test and rebuild:** `node --test "test/*.test.js"` in `demos/ambii/mock-server/` (`test/catalogue.test.js` checks every file, duration, cover and id), then `yarn projects:ambii`, since all three apps bundle the catalogue. Commit `guests.js`, `station-list.js`, `media-data.js`, `config.js`, the new files under `media/`, the hub and the three builds.

**Removing one:**

1. Take its slug out of every station in `core/station-list.js` and out of the pins in `tools/pick-stations.mjs`; the catalogue refuses a station that names a track it no longer has. To re-pick all the stations instead, empty `STATION_INFO` and run `pick-stations.mjs --write` once the track is out of `guests.js`.
2. Remove it from `GUEST_TRACKS`, and its album and artist if nothing else uses them. Don't reuse its `n`.
3. Delete its files: `media/tracks/<slug>.mp3`, and the cover (`media/albums/<album or slug>-640.jpg`, `-320`, `-120`) and the artist's picture if nothing else uses them. The tools never delete anything.
4. Run `build-media.mjs --tracks-only`, bump `SEED_VERSION` (stored queues still name the track, and its file would 404), run the tests and rebuild all three apps.
5. If it was ever deployed, its files are still on the server, since the deploy never deletes. Move them to the Trash in cPanel if they must go (a licence problem, say).

**Jake's own tracks:** renaming or removing one of the 14 in `public/music/` breaks the demo's catalogue. To change the list, edit `TRACKS` in `build-media.mjs` and `TRACK_INFO` in `core/catalogue.js` together (new tracks at the end of `TRACK_INFO`: ids and ISRCs follow its order), add a design in `tools/covers.mjs` for a track without its own art, and add a track over about 5 MB to `OWN_TRACKS_REENCODED` (`fetch-guest-tracks.mjs --only <slug>` makes its copy). Then follow steps 4 to 8 above.

## Announcements

- **The seeded ones are recordings**, in `media/announcements/` (and the ad in `media/ads/`), spoken by Windows' built-in voices (Zira, David) and mixed over the Smooth music bed the way the server mixed them, apart from Loyalty Card Promo, which stands for an uploaded file. They're the `CLIPS` of `build-media.mjs`, which renders them only on Windows; `--clips-only` renders just the new or changed ones.
- **Ones the visitor makes are spoken by the browser**, with an on-device voice picked by language and by the gender of the Google voice chosen, over the music bed chosen in Background Music: five loops synthesized for the demo (`media/beds/`, Smooth, Bright, Light, Distinct and Mellow; "No Music" has none), on the server's timeline of 3 s of bed, the voice, 3 s more, with fades. Their stored duration is the speech estimate, plus those 6 s when there's a bed, as the server stored the mixed file's length.
- **Editing a seeded one's** words, voice, speed or bed turns it into a spoken one, since the recording has the old ones mixed in.
- **In the dashboard,** changing Background Music while a preview plays switches the bed under it (a recording's preview starts over as a spoken one).
- **In the players,** Pause stops a spoken announcement and Play starts it again from the beginning; speech can't be resumed mid-sentence reliably. Recorded ones pause and resume as before.

## Pausing the site's music

The apps make their own sound. Whenever one starts a song, an announcement or a preview, the mock posts `{ type: 'jakemotta:media-playing' }` to `window.top`, and the site's `MusicPlayer` pauses ([music.md](../music.md)). The phone app holds its sound until the visitor taps its "Tap to start" cover, so it never pauses the site's music on its own.

## Rebuilding

```bash
yarn projects:ambii                 # all three apps
yarn projects:ambii dashboard       # or dashboard, player, mobile
```

Rebuilding needs the apps' source in `demos/ambii/`, so it only works on Jake's machine, or on one where the folders were restored from the `jakemotta-demo` branches ([Where the source lives](#where-the-source-lives)). `scripts/build-ambii-demos.mjs` installs each app from its own lockfile (`npm ci --legacy-peer-deps`, the first time and whenever the lockfile is newer than `node_modules`), then runs its `demo:build`, which builds and copies the output into `public/projects/ambii-business/<app>/` through `demos/ambii/shared/publish-build.mjs`. That copy leaves out source maps, `asset-manifest.json` and any service worker.

- **Toolchains:** the dashboard and web player keep their Create React App builds (react-scripts 3 and 4, run through react-app-rewired, with `--openssl-legacy-provider` in their scripts for current Node). The phone app was a Metro build for iOS and Android; for the web it is bundled with webpack 5 and react-native-web, with shims for its native modules in `music-app/web/shims/`.
- **Icons:** FontAwesome Pro needed a paid token, so its icons are aliased to stand-ins in `demos/ambii/shared/fontawesome-pro/`: the free icon of the same name, or a close one, and, where the free sets have nothing close, small icons drawn in `substitutes.js` (the tempo animals, the waveform, the Stations signal, the beds' piano and triangle). They aren't Pro artwork. The folder is bundled into all three apps.
- **The mock is part of every bundle,** so a change to it means rebuilding all three apps.
- **Tests:** `node --test "test/*.test.js"` in `demos/ambii/mock-server/` runs its unit tests.
- **What's committed:** git ignores the three app folders, and `node_modules`, `build` and `dist` anywhere under `demos/`. Prettier ignores `demos/`, so the old sources keep their own formatting.

**Deploying a rebuild.** Each app's `index.html` names its hashed bundles, so a rebuild can change it without changing its length, and the deploy compares by size. The deploy workflow therefore uploads the hub, the invoice page and the four app `index.html` files (including `mobile/app/index.html`) on every run, like the site's own `index.html`.

**Re-rendering media that's already deployed.** The media have fixed names, and a re-rendered track, bed, clip or cover usually comes out exactly the same size (constant bit rates, fixed lengths), so the size-only deploy would never upload it. New files go up as usual. To replace one that's live, give it a new name, or move the old file to the Trash in cPanel before deploying. The same goes for `media/sample-locations.csv` if it's ever edited.

## Left out on purpose

- **The apps' source,** which stays on Jake's machine and in the private repositories ([Where the source lives](#where-the-source-lives)). Source maps are left out of the build output for the same reason: they'd publish it.
- **Secrets the repositories held:** the old API keys, the CodePush key, the Google Maps key, the tracker IDs (Tag Manager, Analytics), the Auth0 settings, and, in the server, its TLS key and database connection string. None was copied. The server isn't copied at all.
- **Anything that would call another host:** Google Fonts, cdnjs, the Maps script and the Tag Manager iframe are removed from the pages. The few `ambii.io` strings left in the bundles are inert hostname checks and an email comparison. The web player also still names an S3 logo for its old MVIX white-label mode, which only switches on when the page's path contains "mvix", so it never loads here.
- **The store listings:** the app is gone from the App Store and Google Play, so the store buttons in the dashboard's Connect Player modal open the phone app demo instead.
- **Music that doesn't meet the licence rules** ([Licence rules](#licence-rules)), and the licensed catalogue the real service played, which is gone with it.

## Known limits

Found when the expansion was checked on 2026-10-27, and left as they are. The upstream quirks the demo keeps are listed in each app's `DEMO-CHANGES.md`.

- In the phone app's in-app Stations, a station preview plays on top of the store's own music. Going back to the player stops it.
- The web player opened from a link, with no click on the page before, connects and waits on its Play button, by the browser's autoplay rules.
- Jake's 128 kbps copies are made at their own level, so they keep the clipping in his masters. Keeping "She wants my package" from clipping would leave it 2.6 dB quieter than everything around it, which is easier to hear.

## Card image

`public/images/projects/ambii-business.webp`, a screenshot of the hub taken by `yarn projects:screenshot ambii-business`.
