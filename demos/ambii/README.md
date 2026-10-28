# Ambii Business demos

Three apps from the Ambii Business product (2019–2022, background music for stores), brought back as demos on jakemotta.com. The real backend, `ambii_business_server` (Express, MongoDB, Auth0, Stripe, AWS), is gone, so every demo runs on a mock of that server that lives in the browser.

| Demo | Upstream repo and commit | Served from |
|---|---|---|
| Business dashboard | [shariqs/ambii_business_web](https://github.com/shariqs/ambii_business_web) `master` 6d56131 (2022-01-07), plus the one-line fix from `fix/tempo-fix` 723d5e7 and the CSV location upload from `develop` (8794c19, a406e61, 03edb53; PR #53, never deployed) | `/projects/ambii-business/dashboard/` |
| Web player | [shariqs/ambii-web-player](https://github.com/shariqs/ambii-web-player) `master` acc33d4 (2022-01-07). `main` is an empty initial commit. | `/projects/ambii-business/player/` |
| Mobile app | [shariqs/ambii_business_music](https://github.com/shariqs/ambii_business_music) `development` b3f5284 (2021-12-11), React Native 0.61 run through react-native-web | `/projects/ambii-business/mobile/` |
| (the API they all call) | [shariqs/ambii_business_server](https://github.com/shariqs/ambii_business_server) `master` 61e7757 (2022-01-07), reimplemented in `mock-server/` | nowhere: answered in the browser |

All four repositories are private (the `shariqs` account); the links work only for people with access.

For the same reason the three app folders aren't in the jakemotta repository, which is public: `.gitignore` leaves out `business-web/`, `web-player/` and `music-app/`. They are on Jake's machine, and each app's private repository has them on a `jakemotta-demo` branch. A clone has `mock-server/`, `shared/`, this README and the built apps in `public/projects/ambii-business/`, so it can serve and deploy the demos, but rebuilding them needs the three folders restored from those branches. Details: "Where the source lives" in [docs/projects/ambii-business.md](../../docs/projects/ambii-business.md#where-the-source-lives).

Each app folder holds that app's source as of the commit above, with the changes the demo needs. Only the files the web build uses were copied (no `android/`, `ios/`, CI config). Secrets that were committed upstream (API keys, a CodePush key, a Google Maps key, tracker IDs) were removed rather than copied.

## How it fits together

```
demos/ambii/
  mock-server/        the in-browser API: routes, seed data, music logic, storage
  shared/             FontAwesome Pro stand-ins, publish-build.mjs
  business-web/       dashboard source (CRA 3, React 16, antd 3)                     not committed
  web-player/         web player source (CRA 4 + react-app-rewired, React 17, antd 4) not committed
  music-app/          mobile app source + web/ (webpack 5, react-native-web,        not committed
                      native-module shims, phone-frame page)
public/projects/ambii-business/
  index.html          the hub the site's project card frames: what Ambii Business was, a way into each app, the music
                      credits (written by mock-server/tools/build-media.mjs)
  invoice.html        stand-in for Stripe's hosted invoice page; reads ambii-demo:invoices (hand-written)
  dashboard/  player/  mobile/   built output, committed (like the converted PHP sites)
  media/              demo media: guest tracks (tracks/), 128 kbps copies of Jake's larger tracks (music/), cover art
                      (covers/, albums/), artist pictures, announcement and ad audio, music beds (beds/), logos,
                      the hub's screenshots (hub/), the CSV upload's sample (sample-locations.csv)
public/music/*.mp3    14 of Jake's own tracks (TRACKS in mock-server/tools/build-media.mjs) are in the demo catalogue,
                      beside the 67 guest tracks of mock-server/core/guests.js
```

### The mock server (`mock-server/`)

- **Entry point.** Each app calls `installAmbiiDemo({ app })` from `mock-server/index.js` before any other app code runs, with `app` set to `'business'`, `'player'` or `'music'`. The apps import it through a webpack alias.
- **Interception.** It patches `XMLHttpRequest` and `fetch`. Requests whose path starts with `API_BASE` (`/projects/ambii-business/api`) are answered in the browser; that folder does not exist on the server. Every other request (track audio, cover art, the apps' own files) goes through untouched.
- **API URL.** Each app's API URL is set to `API_BASE`. Routes are matched on the `v3/(api|auth|public)/…` part of the path, so a missing leading slash or an extra trailing slash still matches.
- **Responses.** They follow the server's conventions:
  - the `{ success, message, type, data }` envelope;
  - the server's message strings;
  - HTTP 200 with `success: false` for soft failures;
  - non-2xx only for real errors;
  - 401 `TOKEN_INVALID` only for a revoked `ambii_player_jwt`.
- **Storage.**
  - Data is kept in `localStorage` under keys that start with `ambii-demo:`. It is seeded on first use and re-read on every request, because the three apps run in separate documents (same origin) and share it.
  - Writes are serialized with `navigator.locks`.
  - Uploaded announcement audio is kept in IndexedDB (database `ambii-demo`).
- **What the demos share.** The three apps share one demo company, plus the visitor's own business once they start one from the dashboard (below). A station assigned in the dashboard reaches a connected player at its next track change, exactly as with the real server. The players never polled; they learned about changes from `finishedTrack`.
- **Media URLs.**
  - Uploaded audio is served at `${API_BASE}/media/<id>.mp3`. XHR downloads of those URLs are answered from IndexedDB.
  - For an `<audio>` element, call `await resolveMediaUrl(url)`, which returns an object URL. Any other URL is returned unchanged.
- **Text-to-speech.** The server rendered announcements with Google Cloud TTS, which is gone. The seeded announcements are pre-rendered MP3s in `public/projects/ambii-business/media/`. Announcements created in the demo get a URL under `${API_BASE}/tts/`. Players check `isTtsAnnouncement(announcement)` and play those with `await speakAnnouncement(announcement, { volume })`, which uses the browser's `speechSynthesis` over the announcement's music bed (`backgroundMusic` 2–6), on the server's timeline: 3 s of bed, the voice, 3 s more. Such an announcement's `duration` includes those 6 s when it has a bed.
  - `cancelSpeech()` stops voice and bed together. The players call it on Pause (and on skip, Disconnect and a reload), then speak the announcement again from the start on Play, since speech can't be resumed mid-sentence reliably. `pauseSpeech()` and `resumeSpeech()` exist but the players don't use them.
  - `setSpeechBed(backgroundMusic)` crossfades to another bed while one is spoken; the dashboard's preview calls it when Background Music changes.
- **Pausing the site's music.** jakemotta.com plays its own background music. When a demo starts playing, the mock posts `{ type: 'jakemotta:media-playing' }` to `window.top` so the site can pause its own track:
  - `<audio>` and `<video>` elements in the document are caught by a capture-phase `play` listener;
  - other sound must call `notifyMediaPlaying()`.
  - The mobile app makes no sound until the visitor taps its phone page's "Tap to start" cover, even in a browser that would allow autoplay, so opening the phone page never pauses the site by itself. The dashboard and the web player behave as the originals did: the dashboard plays only when the visitor starts a preview, and the web player plays as soon as it connects to a store (a `#/<storeCode>` link or a remembered session), where the browser allows it.
- **Demo badge.** A small badge says the data lives in this browser and offers "Reset demo". `resetDemo()` clears `ambii-demo:*`, each app's own keys and the IndexedDB database, then reloads. Pass `badge: false` to hide it; the mobile app shows it on its phone-frame page instead.

### Keeping the apps apart in one origin

All three demos (and jakemotta.com) share one origin, so they share `localStorage`.

- Each app prefixes its own keys:
  - the dashboard uses `ambii-business:`;
  - the web player uses `ambii-player:` (including the redux-persist key and `darkTheme`);
  - the mobile app uses `ambii-music:` (AsyncStorage).
- Without the prefixes the dashboard's `ambii_auth_jwt` and the player's `deviceId` would leak into each other.
- The dashboard's in-app mode (used when the mobile app shows it in a WebView) is kept in `sessionStorage`, so it never sticks to the standalone dashboard.

### Links between the demos

- **Dashboard to player.** "Play on Web" opens `/projects/ambii-business/player/index.html#/<storeCode>`. The dashboard and the web player use hash routing (the phone app has no URL routes), because `/projects/` has no SPA fallback on Apache, and in development CRA answers unknown paths with the site itself.
- **Player to dashboard.** "Sign up" and "Admin panel" open `/projects/ambii-business/dashboard/index.html`.
- **Starting a new business.** `dashboard/index.html?signup#/<route>` (also with `?inApp=1&signup`) stores the dashboard's second sign-in token, `ambii-demo-newbiz`, and drops `signup` from the address. The mock keeps a separate, blank business for that token (the mock's README, "How a request runs"). A signed-out visitor's Favorite, or Assign in the phone app, does the same. Sign In returns to the seeded owner.
- **Dashboard to invoice page.** Settings > Invoices opens each invoice's `hosted_invoice_url`, `/projects/ambii-business/invoice.html?id=<invoice id>`, which reads the invoice from `ambii-demo:invoices`.
- **Mobile app to dashboard (WebView).**
  - The mobile app's WebView is an `<iframe>` of `/projects/ambii-business/dashboard/index.html?inApp=1#/<route>`.
  - The dashboard defines `window.ReactNativeWebView.postMessage(string)` when it is framed in in-app mode. That function posts `{ type: 'ambii-webview-message', data: string }` to its parent.
  - The WebView shim turns that message into `onMessage({ nativeEvent: { data } })`.
  - `injectJavaScript` runs in the frame directly, which works because the frame has the same origin.
  - The phone sends `locationId` to the dashboard again after pairing (Sign In / Sign Up pairs from inside the WebView), and when it re-shows the address already loaded: `signup` and Stations both open `?inApp=1#/stations`, and a WebView doesn't reload for the same address.
  - When the dashboard gets the phone's `introLogin` message, `App.js` also fires the window event `ambii-demo:introLogin`, so Stations pairs the phone at once (`player/<storeCode>`) even when its locations had already loaded.
  - When the WebView screen loses focus (Back, the drawer's Playing At row, an Assign), the phone stops what the dashboard frame plays: it presses the dashboard's own Stop Preview, pauses every `<audio>` and `<video>`, and stops any `play` until the screen is shown again.

## Rebuilding

Run `yarn projects:ambii` at the repository root, on a machine that has the three app folders. It installs and builds each app with its own pinned dependencies, then copies the output into `public/projects/ambii-business/` through `shared/publish-build.mjs`. Commit that output: the deploy only uploads what is in `public/`, and CI never builds these apps. When an app's own source changed, push it to its `jakemotta-demo` branch as well.

To work on one app, run `npm ci --legacy-peer-deps` and then `npm run demo:build` inside its folder. The CRA apps need `--openssl-legacy-provider` on Node 17 and newer, which their scripts set.

### Toolchain changes

- FontAwesome Pro is aliased to `shared/fontawesome-pro/`: free icons under the Pro names, and small icons drawn in `substitutes.js` where the free sets have nothing close (the tempo animals, the waveform, the Stations signal, the beds' piano and triangle). All three apps bundle it, so a change there means rebuilding them all.
- `node-sass` is replaced by `sass`.
- The `git://` dependency on Jake's react-native-track-player fork is replaced by an HTML5-audio shim.
- The dashboard's CSV upload (from `develop`) reads files with a small local stand-in for `react-papaparse`, which isn't in its lockfile.
