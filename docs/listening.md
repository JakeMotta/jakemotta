# What Jake's listening to

The site shows what Jake is listening to on Spotify and YouTube Music: the track playing right now (or the last one), his latest plays, and his top songs, albums and artists. Visitors can also **listen along**: play the YouTube copy of whatever he has on Spotify, in sync with him.

**Status (2026-10-26):** all of it is built and tested, but none of it is live:

- **Not mounted:** nothing is on the board yet. Placing the card and the panel, and the two small hook-up edits in [Hooking it up](#hooking-it-up), wait for the bento redesign to settle.
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
- **`atoms/now-playing`** is the card: "Now spinning" with a pulsing dot, or "Last spun · 3h ago".
  - The dot is a "live" light, not a visualizer: ListenBrainz says what's playing, not how loud.
  - The title is a link stretched over the whole card, so the "Listen along" button beside it stays a control of its own.
  - That button shows only while Jake is on Spotify and the Worker answers.
- **`atoms/lately`** is the panel: Recent, Songs, Albums and Artists, with This month, This year and All time for the top lists.
  - ListenBrainz recalculates statistics now and then, and a range it hasn't counted answers 204. Until the visitor picks a range, the panel steps on to the next one that's ready. If they pick one that isn't, it says so.
- **`atoms/listen-row` and `atoms/listen-cover`** are the pieces both use. Rows link out and have no play button, so they can't be mistaken for the library's songs.
- **Times are relative** ("3h ago"), never clock times, which would say when Jake sleeps.

## Listen along

### The Worker

`workers/listening` is a Cloudflare Worker on `jakemotta.com/api/listening*`. Cloudflare already sits in front of the domain, so it answers before a request reaches the Namecheap host, and it doesn't go through the FTP deploy at all.

- **`GET /api/listening/now`:** what Jake's Spotify is playing, with `progressMs`, `isPlaying` and `fetchedAt` (the Worker's clock when Spotify answered). A visitor's position in the song is `progressMs` plus the time since `fetchedAt`.
- **`?youtube=1`** adds `youtube: { videoId, synced }`, the YouTube copy. It's `null` when none was found.
- **Caching:** answers are cached for 5 seconds, so Spotify is asked at most once per 5 seconds per Cloudflare location, however many visitors are listening.
- **Spotify:** only the `user-read-currently-playing` scope. The access token is kept in KV for its hour, and if Spotify ever rotates the refresh token, the new one is stored in KV and replaces the secret.
- **Matching (`src/youtube.js`):**
  - It searches the YouTube Data API for "first artist + title" among embeddable music videos, then checks each result's length and whether it may be embedded.
  - It picks the video within 3 seconds of the Spotify track's length, preferring the artist's "Artist - Topic" channel. That's YouTube Music's own upload, with the album audio, so it can join mid-song (`synced: true`). Failing that, it picks the best embeddable video and plays it from the top.
  - A search costs 100 of the 10,000 free daily units. Each track is looked up only when a visitor is listening along, and the answer is kept in KV for 30 days, the longest YouTube's policies allow (III.E.4.d). A miss is kept for a day, and a failed search (usually the day's quota) for an hour.
  - **Fixing a bad match:** `npx wrangler kv key put --binding LISTENING "yt-override:<spotify track id>" <video id>` always wins.
- **`HIDDEN`** in `wrangler.toml` lists artists, or "artist - title", never to offer listen-along for. They still show on ListenBrainz and in the card, since that data is public anyway.
- **Tests:** `yarn test` in `workers/listening` runs the Worker in Node with Spotify, YouTube and KV faked.
- **Locally:** `yarn dev` in `workers/listening` runs it on port 8787, with the secrets in a gitignored `.dev.vars`. `src/setupProxy.js` makes the site's own `yarn dev` pass `/api/listening` through to it. Without the Worker running, listen-along simply stays hidden.

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
> - **Left behind, now unused:**
>   - `ytmusic-sync.yml` and `setup_secrets.py`, which only fit the OAuth route;
>   - the published "jakemotta" OAuth app in Google Cloud;
>   - the privacy page's line about a GitHub secret.
>
> What follows describes the sync as it was built.

iOS doesn't let any app see what YouTube Music is playing, so nothing can scrobble the iPhone app live. Instead, `.github/workflows/ytmusic-sync.yml` runs `scripts/ytmusic-sync/sync.py` at :07 and :37 past each hour. It uses [ytmusicapi](https://ytmusicapi.readthedocs.io) (unofficial, pinned in `requirements.txt`) to read the account's YouTube Music history, which holds every device's plays, and submits the ones ListenBrainz doesn't have yet.

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

Both imports go into ListenBrainz, so its "All time" statistics cover everything. ListenBrainz ignores a play it already has with the same time and track, so re-running an import is harmless.

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
   - **The schedule** only runs once the workflow is on `master`.
3. **Spotify app:** a developer app at developer.spotify.com, which needs Premium on the owner's account since February 2026, with the redirect URI `http://127.0.0.1:8888/callback`.
4. **YouTube key:** a YouTube Data API v3 key in the same Google Cloud project, restricted to that API.
5. **The Worker**, from `workers/listening`:
   - `yarn install`
   - `npx wrangler login`
   - `npx wrangler kv namespace create LISTENING`, then paste the ID into `wrangler.toml`
   - `npx wrangler secret put` for `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `YOUTUBE_API_KEY`
   - `SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-auth.mjs | npx wrangler secret put SPOTIFY_REFRESH_TOKEN`
   - `npx wrangler deploy`
6. **Past history:** the two imports above.

## Hooking it up

Wait for the bento redesign, then:

1. **Place `<NowPlaying />` and `<Lately />` on the board.** Both are self-contained `primary-dark` surfaces, and render nothing until `LISTENBRAINZ_USER` is set.
2. **Mount `<ListenAlong />` in `App.tsx`**, right after `<MusicPlayer />`, outside the routes, so it survives navigation the way the player does.
3. **Let the music player hear the capture**, in `atoms/music-player/index.tsx`:
   - **Split the chain.** Replace `createMediaElementSource(…).connect(analyzer)` followed by `analyzer.connect(context.destination)` with a source connected to both the destination and the analyser. The analyser then listens beside the speakers rather than in front of them.
   - **Read the capture:** `const capture = useListenAlongStore((store) => store.capture);`
   - **Feed it to the analyser:** an effect that, while `capture` is set:
     - calls `ensureAudioGraph()`;
     - resumes the context;
     - connects `context.createMediaStreamSource(capture)` to the analyser, and never to the destination;
     - resets `bands`;
     - and on cleanup disconnects it and resets `bands` again.
4. **Update the docs:** `docs/music.md` (the analyser's two inputs, and that the vignette rests during listen-along unless the visitor opts in), and the "Music and visualizer" part of `CLAUDE.md`.

Steps 2 and 3 were tested together on the bento board, using a fake Worker and a synthetic stream:

- **Sync:** the player stayed within a second of Spotify's position and followed a skip to the next song.
- **The site's music:** listen-along paused it and closing resumed it. Starting the site's music ended listen-along.
- **The visualizer:** the captured stream drove it, and the site's own music still did after the split.
- **Not covered:** the real `getDisplayMedia` prompt in Chrome. In particular, whether the tab's sound keeps flowing after the picture track is dropped needs checking once it's live.
