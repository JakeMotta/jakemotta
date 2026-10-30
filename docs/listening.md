# What Jake's listening to

The site shows what Jake is listening to on Spotify and YouTube Music: the track playing right now (or the last one), his latest plays, and his top songs, albums and artists. Visitors can also **listen along**: play the YouTube copy of whatever he has on Spotify, in sync with him. And they can play his recent and top songs, and his Spotify playlist, in the site's own player, from their YouTube copies ([music.md](music.md#songs-from-youtube)).

**Status (2026-10-26):** built, tested and on the board, though not deployed yet:

- **On the board:** the "Recent listens" tile and the library's Recent listens tab it opens ([How it's hooked up](#how-its-hooked-up)). Listen-along is mounted too, but stays hidden until the Worker is deployed.
- **ListenBrainz is connected:** the account is [draymothisk](https://listenbrainz.org/user/draymothisk/) (`LISTENBRAINZ_USER`), linked to Spotify on 2026-10-26.
  - Nothing came through for about 2 hours. Plays started minutes after Jake disconnected and reconnected Spotify in ListenBrainz, so if it ever stalls, reconnect first.
  - Spotify also makes the link expire every 6 months, and ListenBrainz emails a reminder before it does.
- **The rest of setup isn't done:** the Worker and the history imports ([Setup](#setup)).
- **Web Scrobbler is skipped for now** (Jake's call, 2026-10-26).
- **The YouTube Music sync is shelved** (Jake's call, 2026-10-26). Its sign-in doesn't work, and the workaround was more than it was worth ([The iPhone sync](#the-iphone-sync)). Until it comes back, only Spotify reaches ListenBrainz.

## Where the plays come from

Everything goes into one public [ListenBrainz](https://listenbrainz.org) account, and the site reads its history from there.

| Where Jake listens | How it reaches ListenBrainz | Live "playing now"? |
| --- | --- | --- |
| Spotify, any device | ListenBrainz's own Spotify link (Settings → Music services) | Yes, on ListenBrainz's polling cycle, so it can trail a little |
| YouTube Music on the web | For now, the same sync job as the iPhone, since the history it reads holds every device's plays. Web Scrobbler, pointed at ListenBrainz, would make it live, but it's skipped for now. | Not without Web Scrobbler |
| YouTube Music on the iPhone | The sync job, every 30 minutes | No: plays appear 30 to 60 minutes later |
| Before any of that | One-off imports (see [Past history](#past-history)) | — |

ListenBrainz was chosen over Last.fm because its reads need no API key (so nothing secret is in the bundle) and because it accepts old plays, which Last.fm refuses after two weeks. Its cost: everything in it is public, with no private mode, and cover art is missing more often.

Listen-along needs more than ListenBrainz has (the exact position in the song, and whether it's paused), so it asks Spotify itself, through the listening Worker.

## On the site

- **`src/api/listenbrainz.ts`** reads the public API straight from the browser and turns its responses into two small shapes, `Listen` and `TopItem`, so no component reads ListenBrainz's own.
  - Which service a play came from: ListenBrainz's Spotify link and Web Scrobbler mark it differently, and the iPhone sync marks its plays `music.youtube.com`.
  - Links: Spotify plays carry their track link. YouTube Music plays carry the watch link, which holds the video ID.
- **Covers**, in order:
  1. The Cover Art Archive's, when ListenBrainz has matched the play to MusicBrainz.
  2. For a YouTube Music play, the video's thumbnail (for YouTube Music's own uploads that's the album art). Unknown videos give a small grey placeholder, which counts as no cover.
  3. For a Spotify play, Spotify's oEmbed thumbnail, asked once per track per visit. This is what covers the track playing now, which ListenBrainz never matches.
  4. Otherwise a monogram tile in the hue, like the project cards'.
- **`src/store/listening.ts`** (zustand) holds `nowPlaying`, `recent` and the top lists. `useLiveListening()` keeps the first two fresh: one poll every 30 seconds (`LISTENING_POLL_MS`), however many components ask, and only while the page is visible.
- **`atoms/now-playing`** is the card: "Playing now" with a pulsing dot, or "Last played · 3h ago".
  - The dot is a "live" light, not a visualizer: ListenBrainz says what's playing, not how loud.
  - The title is a link stretched over the whole card, so the "Listen along" button beside it stays a control of its own.
  - That button (`ListenAlongButton`) shows only while Jake is on Spotify and the Worker answers.
  - `useNowListening()` is what the card shows, shared with the overlay: the current listen (or the last), its label, and the listen-along state.
  - `compact` is the board's version: no arrow, no listen-along button, a smaller cover, and the short label "Played 3h ago", since the tile is one column wide.
- **`atoms/lately`** is the panel: Recent, Songs, Albums and Artists, with This month, This year and All time for the top lists.
  - ListenBrainz recalculates statistics now and then, and a range it hasn't counted answers 204. Until the visitor picks a range, the panel steps on to the next one that's ready. If they pick one that isn't, it says so.
- **`atoms/listen-row` and `atoms/listen-cover`** are the pieces both use. A row that can play in the site's player plays its song when it's clicked, with a play badge on its cover, and the service's logo at its end is the way out to the song there (since 2026-10-30, when Jake asked for the click to play rather than open Spotify; `usePlayListens()` decides which rows can). The `NowPlaying` card and the board's tile play the same way. Other rows link out. From 2026-10-27 a playable row had a round play button beside its link out, and before that rows had none, so they couldn't be mistaken for the library's songs ([music.md](music.md#songs-from-youtube)).
  - **YouTube Music plays** play as their own video, with no Worker.
  - **Spotify plays and top songs** play through the Worker's match, so their buttons show only once it answers.
  - **Albums and artists** never get a button.
- **The library's Favorite artists** (`pages/music/favorites.ts`, since 2026-10-28) come from the all-time top artists here, which hold Jake's whole Spotify history since its import on 2026-10-30, with photos from Spotify's long-term top artists through the Worker ([Top artists](#top-artists)). Until ListenBrainz has counted the import they're Spotify's ranking, and failing both a count of the latest plays. Each plays the artist's top song by the same rules ([music.md](music.md#playback-and-the-shuffle)).
- **Times are relative** ("3h ago"), never clock times, which would say when Jake sleeps.

## Listen along

### The Worker

`workers/listening` is a Cloudflare Worker on `jakemotta.com/api/listening*`. Cloudflare already sits in front of the domain, so it answers before a request reaches the Namecheap host, and it doesn't go through the FTP deploy at all.

- **`GET /api/listening/playlist`:** the songs on Jake's Spotify playlist (`SPOTIFY_PLAYLIST` in `wrangler.toml`), which the site's player deals into its shuffle.
  - **Reading it:** it uses Spotify's `GET /playlists/{id}/items`, which since February 2026 returns a playlist's songs only to its owner or a collaborator. A private playlist needs the `playlist-read-private` scope, which `scripts/spotify-auth.mjs` asks for.
  - **Caching:** the list is kept in KV, and cached, for 10 minutes. Local files and podcasts are left out, and so is anything in `HIDDEN`.
- **`GET /api/listening/top-artists`:** Jake's top artists on Spotify, for the library's Favorite artists ([Top artists](#top-artists)).
- **`GET /api/listening/match?spotify=<track id>`** or **`?artist=<artist>&title=<title>`:** the YouTube copy of one of Jake's songs, `{ youtube: { videoId, synced } | null }`, for the site's player.
  - **Only Jake's songs (`src/songs.js`):** the playlist, his 50 top songs on Spotify (the Favorite artists' songs), his last 100 ListenBrainz plays and his top 100 songs for each range (`LISTENBRAINZ_USER`). Anything else is refused with a 404 before YouTube is searched, so nobody can spend the day's search quota on other songs.
  - **Keeping the list:** it's kept in KV for 10 minutes. A song that isn't in it rebuilds it, at most once a minute, in case it was only just played.
  - **Matching and caching:** the same as listen-along's (below), with the same KV entries for Spotify songs. A song known only by name has no length to check, so it gets the best embeddable video. Answers are cached for an hour.
- **`GET /api/listening/now`:** what Jake's Spotify is playing, with `progressMs`, `isPlaying` and `fetchedAt` (the Worker's clock when Spotify answered). A visitor's position in the song is `progressMs` plus the time since `fetchedAt`.
- **`?youtube=1`** adds `youtube: { videoId, synced }`, the YouTube copy. It's `null` when none was found.
- **Caching:** answers are cached for 5 seconds, so Spotify is asked at most once per 5 seconds per Cloudflare location, however many visitors are listening.
- **Spotify:** only the `user-read-currently-playing`, `playlist-read-private` and `user-top-read` scopes (the last since 2026-10-28, for the top artists). The access token is kept in KV for its hour, and if Spotify ever rotates the refresh token, the new one is stored in KV and replaces the secret.
- **The sign-in lasts 180 days.** Spotify's dashboard gives the app ("Personal Site") a refresh-token lifetime of 180 days. When it runs out, `/now` and `/playlist` fail until the `spotify-auth.mjs` step in [Setup](#setup) is run again.
- **Matching (`src/youtube.js`):**
  - It searches the YouTube Data API for "first artist + title" among embeddable music videos, then checks each result's length and whether it may be embedded.
  - It picks the video within 3 seconds of the Spotify track's length, preferring the artist's "Artist - Topic" channel. That's YouTube Music's own upload, with the album audio, so it can join mid-song (`synced: true`). Failing that, it picks the best embeddable video and plays it from the top.
  - A search costs 100 of the 10,000 free daily units. Each track is looked up only when a visitor is listening along, and the answer is kept in KV for 30 days, the longest YouTube's policies allow (III.E.4.d). A miss is kept for a day, and a failed search (usually the day's quota) for an hour.
  - **Fixing a bad match:** `npx wrangler kv key put --binding LISTENING "yt-override:<spotify track id>" <video id>` always wins.
- **`HIDDEN`** in `wrangler.toml` lists artists, or "artist - title", never to play on the site: not for listen-along, not from the playlist, not through a match. They still show on ListenBrainz and in the card, since that data is public anyway.
- **Tests:** `yarn test` in `workers/listening` runs the Worker in Node with Spotify, YouTube, ListenBrainz and KV faked.
- **Locally:** `yarn dev` in `workers/listening` runs it on port 8787, with the secrets in a gitignored `.dev.vars`. `src/setupProxy.js` makes the site's own `yarn dev` pass `/api/listening` through to it. Without the Worker running, listen-along simply stays hidden.

### Top artists

`GET /api/listening/top-artists` answers `{ artists: [{ name, image, url, song? }] }`: Jake's 50 most-played artists on Spotify, most played first, for the library's Favorite artists (since 2026-10-28). Jake asked for them to come from as much of his history as there is, and ListenBrainz only had two days of plays. Since his Spotify history was imported (2026-10-30) ListenBrainz's all-time count ranks them, and this list lends its photos and songs. The Worker deployed on 2026-10-30 predates this route and answers it with a 404, so it needs `wrangler deploy` before the photos show.

- **Where from:** Spotify's `GET /me/top/artists` and `/me/top/tracks` with `time_range=long_term`, Spotify's longest range (about a year of plays and more). Each artist's `song` is their highest-ranked song among his 50 top songs, in the playlist's shape, and those songs join the list `/match` accepts.
- **Caching:** both lists are kept in KV for a day (`top-artists`, `top-tracks`), and answers are cached for 6 hours. `HIDDEN` artists and songs are left out.
- **The scope:** it needs `user-top-read`, which `scripts/spotify-auth.mjs` asks for since 2026-10-28. A refresh token from before that gets a 403, the route answers 502, and the site falls back to ListenBrainz.
- **Turning it on (not done yet):** deploy the Worker, then sign in again with the new scope:
  - run the `spotify-auth.mjs` step in [Setup](#setup) again;
  - then delete the old token from KV, which otherwise wins over the secret: `npx wrangler kv key delete --binding LISTENING --remote spotify:refresh_token`, and the same for `spotify:access_token`.

### The player

`atoms/listen-along` is YouTube's own embedded player, floating bottom-left over everything, with `store/listen-along.ts` behind it.

- **Following Jake:** every 5 seconds it asks the Worker what he's playing.
  - **New song:** it loads the new video at his position, or from the top if not synced.
  - **Paused:** when he pauses, it pauses.
  - **Drift:** more than 4 seconds out of step, it jumps back in line.
  - **Stopped:** it plays the song out, then closes.
  - **Visitor's own pause:** if the visitor pauses it themselves, it isn't forced back on.
- **With the site's music:** starting listen-along pauses the site's music, and closing it resumes the music if it had been playing. Starting the site's music ends listen-along.
- **YouTube's rules** ([API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)) shape it:
  - **Visible:** the player is always on screen, never under the overlays or the vignette. That's why it's at z-index 110, above both.
  - **Size:** it's never smaller than 200×200.
  - **No background play:** it pauses whenever the tab is hidden (III.I.9).
  - **Ads:** YouTube's ads aren't blocked (III.I.5).
  - **No downloads:** audio is never downloaded or kept (III.E.1).
- **What visitors may hit:**
  - an ad first;
  - a video whose owner blocks embedding ("This one can't play here", with a link to Spotify);
  - a song YouTube doesn't have;
  - on phones, playback stopping when the screen locks.

### The visualizer while listening along (opt-in)

The YouTube player is a cross-origin frame, so the site's analyser can't hear it, and by default the vignette rests while it plays.

- **Opting in:** on desktop Chrome and Edge, the player's "Light up the visualizer" button asks the browser to share this tab's sound. It uses `getDisplayMedia` with `preferCurrentTab`, offering just this tab, never the screen or other tabs.
- **Where the sound goes:** the store keeps the stream as `capture`, and the music player feeds it to its analyser only, never to the speakers, since the tab is already playing it.
- **Stopping:** Chrome's own "Stop sharing" ends it, and so does closing the player.
- **Elsewhere:** other browsers and phones can't share a tab's sound, so the button isn't shown there.
- **Policy:** measuring the sound comes close to YouTube's rule against isolating a video's audio (III.I.7). It's never played, recorded or changed, only measured each frame. If YouTube objected, the button comes out and nothing else changes.

## The iPhone sync

> **Shelved on 2026-10-26: as built, it can't work.**
>
> - **The sign-in is blocked.** It uses ytmusicapi's OAuth sign-in, which Google has rejected for YouTube Music since August 2025 ("HTTP 400: Request contains an invalid argument"). ytmusicapi's maintainer sees no path forward ([issue #813](https://github.com/sigma67/ytmusicapi/issues/813)), although its setup docs still describe it. Jake's first real run hit exactly that.
> - **The workaround is tied to one address.** ytmusicapi's browser-cookie sign-in still works, but only from the same public IP as the browser it was copied from ([issue #962](https://github.com/sigma67/ytmusicapi/issues/962)). So it can't run on GitHub's runners.
> - **Where it could run instead:**
>   - Jake's PC, as a scheduled task.
>   - TapSlayDie's VM, which has a reserved IP; Jake signs in through it once. The catch: a full Google session sits on an internet-facing box.
>   - No sync at all: Google Takeout exports imported by hand with `import_takeout.py`, which needs no sign-in.
> - **The workflow is gone.** `.github/workflows/ytmusic-sync.yml` was removed on 2026-10-26, so the schedule stops once that change is on `master`. Restore it from commit `da6456f` if the sync comes back.
> - **Left behind, now unused:**
>   - `setup_secrets.py`, which only fits the OAuth route;
>   - the published "jakemotta" OAuth app in Google Cloud;
>   - the privacy page's line about a GitHub secret.
>
> What follows describes the sync as it was built.

iOS doesn't let any app see what YouTube Music is playing, so nothing can scrobble the iPhone app live. Instead, a GitHub Actions workflow, `.github/workflows/ytmusic-sync.yml` (now removed), ran `scripts/ytmusic-sync/sync.py` at :07 and :37 past each hour. It uses [ytmusicapi](https://ytmusicapi.readthedocs.io) (unofficial, pinned in `requirements.txt`) to read the account's YouTube Music history, which holds every device's plays, and submits the ones ListenBrainz doesn't have yet.

- **What counts as new:** items on the history's "Today" and "Yesterday" shelves whose video isn't already in ListenBrainz from the last 72 hours, whether Web Scrobbler sent it or an earlier run did. That's how web plays aren't counted twice.
- **What it can't know:**
  - **When:** the history gives only the day. New plays are laid end to end, finishing at the moment the run found them.
  - **Skips:** a skipped song counts like any other.
  - **Repeats:** replaying a song moves it up the history rather than adding it again, so a song already in ListenBrainz from the last few days isn't submitted again.
  - **Playing now:** the iPhone's plays never show as playing now, so there's no listen-along for them either.
- **Not set up yet:** while none of its four secrets is set, the job passes with a note. With only some set, it fails and names the missing ones.
- **Gotchas:**
  - **GitHub schedule:** GitHub runs schedules late when busy, and turns them off after 60 days without a commit (it emails first). Nothing is lost while it's late, as long as the next run comes within a day or so.
  - **Public logs:** the repository is public, and so are the job's logs. The script prints only song titles, never a token.
- **Trying it:** run the workflow by hand from the Actions tab with "dry run" ticked, and it lists what it would add without adding it.
- **Tests:** `python -m unittest` in `scripts/ytmusic-sync`, which also covers the Takeout import and the secrets setup.

## Past history

Both imports go into ListenBrainz, so its "All time" statistics cover everything. The Spotify import went in on 2026-10-30: 58,194 plays, back to 2013. ListenBrainz counts its statistics in batches, so they lag an import by a day or more; until then its stats endpoints answer 204. ListenBrainz ignores a play it already has with the same time and track, so re-running an import is harmless.

- **Spotify:**
  - Request the **Extended streaming history** under Spotify's Account → Privacy settings; it can take up to 30 days to arrive.
  - Upload the zip in ListenBrainz's Settings → Import listens.
  - If the Spotify link has already recorded some of the same plays, check the importer for a date range so they aren't counted twice.
- **YouTube Music:**
  - Export "YouTube and YouTube Music" → history from Google Takeout, in **JSON**, with the Google account set to **English** (the script reads entries as "Watched <song>").
  - Then run `python scripts/ytmusic-sync/import_takeout.py watch-history.json --before <the day the sync started> --dry-run` to see what it finds, and again without `--dry-run` to import it. It needs `LISTENBRAINZ_TOKEN` set.
  - `--before` keeps it from overlapping the sync job.
  - Takeout has exact times but no lengths, so skipped songs count, and a music video's artist is its channel's name rather than the artist's.

## Setup

What Jake does once, in this order. Nothing secret goes in the repository.

1. **ListenBrainz:**
   - **Done:** the account, its username in `LISTENBRAINZ_USER`, and the Spotify link under Settings → Music services.
   - **Skipped for now:** pointing Web Scrobbler at ListenBrainz with the user token from Settings. Without it, YouTube Music on the web comes in through the sync job like the iPhone.
2. **iPhone sync:**
   - **In Google Cloud:**
     - enable the **YouTube Data API v3** (without it the sign-in fails as "OAuth client failure");
     - set up the OAuth consent screen and publish it "In production" (in "Testing", the sign-in expires after 7 days):
       - Google won't publish without a home page and a privacy policy.
       - The project "jakemotta" uses `https://jakemotta.com`, `https://jakemotta.com/privacy.html` (`public/privacy.html`) and the authorized domain `jakemotta.com`, all set on 2026-10-26.
       - The app is unverified, so the sign-in shows Google's "hasn't verified this app" warning. That's fine for an app only Jake uses.
     - create an OAuth client of type **TVs and Limited Input devices**.
   - **Then run, from the repository:** `py -m pip install --user -r scripts/ytmusic-sync/requirements.txt`, then `py scripts/ytmusic-sync/setup_secrets.py`. It:
     - asks for the client's ID and secret, and the ListenBrainz user token, without echoing them;
     - signs in to YouTube Music, and checks both the history and the token work;
     - hands GitHub the four secrets: `LISTENBRAINZ_TOKEN`, `YTMUSIC_CLIENT_ID`, `YTMUSIC_CLIENT_SECRET` and `YTMUSIC_OAUTH_JSON`.
   - **How the secrets get to GitHub:** with the GitHub CLI signed in, the script sets them itself. Otherwise it copies each to the clipboard and opens GitHub's new-secret page to paste into. Nothing is printed or saved.
   - **The schedule** only runs once the workflow is on `master`, and the workflow has since been removed (see above).
3. **Spotify app:** a developer app at developer.spotify.com, which needs Premium on the owner's account since February 2026, with the redirect URI `http://127.0.0.1:8888/callback`. For the playlist, put its ID (from its share link, `open.spotify.com/playlist/<ID>`) in `SPOTIFY_PLAYLIST` in `wrangler.toml`. It must be one Jake owns or collaborates on. A refresh token minted before 2026-10-27 lacks `playlist-read-private`, so for a private playlist, run the sign-in step below again.
   - **Done on 2026-10-28:** the app "Personal Site" (Development mode) has both redirect URIs, `https://jakemotta.com/` and `http://127.0.0.1:8888/callback`. The playlist is `1VwcuVIPRIZ8niiRfK5pbu`, and the KV namespace was created. Its ID is in `wrangler.toml`.
4. **YouTube key:** a YouTube Data API v3 key in the same Google Cloud project, restricted to that API.
5. **The Worker**, from `workers/listening`:
   - `yarn install`
   - `npx wrangler login`
   - `npx wrangler kv namespace create LISTENING`, then paste the ID into `wrangler.toml`
   - `npx wrangler secret put` for `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `YOUTUBE_API_KEY`
   - `SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-auth.mjs | npx wrangler secret put SPOTIFY_REFRESH_TOKEN`
     - **Check the output:** wrangler stores whatever the script prints, even when it fails ("Set SPOTIFY_CLIENT_ID… first", "Invalid client secret"). So "Success! Uploaded secret" alone doesn't mean it worked; look for an error above it, and run it again if there is one.
   - `npx wrangler deploy`
   - **On Windows PowerShell:**
     - **The `.cmd` shims:** script policy blocks `npx.ps1` and `yarn.ps1`, so use `npx.cmd` and `yarn.cmd`.
     - **Environment variables:** set them with `$env:NAME = '…'`, and enter the secret with `Read-Host -AsSecureString`, so it isn't saved in PSReadLine's history.
     - **The token pipe:** run it through `cmd /c "…"`, so PowerShell doesn't re-encode the token on its way to wrangler.
     - **Pasting secrets:** paste a secret only at a prompt. Typed on a command line, it lands in PSReadLine's history file.
6. **Past history:** the two imports above.

## How it's hooked up

Done on 2026-10-26, once the bento redesign had settled. Jake picked the placement from the [Listening Tile Placement canvas](https://claude.ai/artifact/JvNbfMdMFpPAmT4A1rWdgW): of the three options there, he had the tile take the cell of "Surprise me", which he removed.

1. **The tile:** `EarsTile` in `pages/home/tiles.tsx`, "Recent listens", in row 3 under the Now Playing tile ([board.md](board.md)).
   - It holds the compact `NowPlaying` card and the plays before it, each linking out.
   - On a desktop the tile is a fixed height, so a short screen shows fewer rows: one that doesn't fit is hidden whole, never cut.
   - Before the first answer it says "Tuning in…"; with nothing to show, "Quiet in here for now."
2. **The library tab:** its **Lately ↗** opens the library on its Recent listens tab (`/library?tab=recent`, `pages/music`).
   - At the top is the full `NowPlaying` card, which links out and carries the listen-along button. Under it is `Lately`, all at once: the last 100 plays (`getRecentListens` fetches 100), or the top 50 songs, albums or artists, in two columns on a wide screen, scrolling.
   - This was its own overlay at `/listening` until 2026-10-27, when Jake had it folded into the library. `/listening` redirects to the tab, so old links still work.
3. **Listen-along:** `<ListenAlong />` is mounted in `App.tsx`, right after `<MusicPlayer />`, outside the routes, so it survives navigation the way the player does. Until the Worker is deployed, `/api/listening/now` gets the app's own page back instead of JSON, so the button never shows.
4. **The music player hears the capture** (`atoms/music-player/index.tsx`):
   - **The chain is split:** the `<audio>` source connects to the speakers and, separately, to the analyser, which listens beside the speakers rather than in front of them.
   - **While `capture` is set:** an effect connects `context.createMediaStreamSource(capture)` to the analyser, never to the speakers, and resets the bands. It also builds the graph if no track has played yet and resumes the context.
   - **On cleanup:** it disconnects the stream and resets the bands again.

Checked on 2026-10-26 in the dev server:

- **The board:** at 1440×900, 1100×760 and on a phone.
- **The overlay:** it opens, Escape closes it, and focus goes back to Lately.
- **The music:** it still drives the vignette after the split.

Earlier, listen-along and the capture were tested together on the bento board, with a fake Worker and a synthetic stream:

- **Sync:** the player stayed within a second of Spotify's position and followed a skip to the next song.
- **The site's music:** listen-along paused it and closing resumed it. Starting the site's music ended listen-along.
- **The visualizer:** the captured stream drove it, and the site's own music still did after the split.
- **Not covered:** the real `getDisplayMedia` prompt in Chrome. In particular, whether the tab's sound keeps flowing after the picture track is dropped needs checking once it's live.
