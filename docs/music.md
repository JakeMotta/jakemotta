# Music player

Music plays across the whole site. The player sits outside the routes in `App.tsx`, so it keeps playing as the visitor opens and closes tiles, and the visualizer reacts to the audio that's actually playing.

## The library

The tracks are the static arrays `musicList` and `favoriteArtists` in `src/common/constants.ts`, plus `welcomeTrack` (Dancin, what the board's "Play with sound" starts). The audio is in `public/music/` and the cover art in `public/images/music/`; a track with no `image` (the welcome track) shows a monogram in the hue. A track's `description` shows in the library's player, so leave it empty rather than writing filler.

Songs from YouTube join them in the same shuffle ([Songs from YouTube](#songs-from-youtube)): `youtubeSongs` in `constants.ts`, and the songs on Jake's Spotify playlist once the listening Worker sends them.

`src/common/music.ts` keeps every track the site knows:
- `libraryUrls()` is what the shuffle draws from, each `url` once.
- `findTrack(url)` looks a track up for display.
- `addTracks()` adds the ones that arrive later: the playlist's, and a play picked from Recent listens, which can be played but doesn't join the shuffle.

## Playback and the shuffle

State lives in `src/store/audio.ts` (zustand):

| Field / action | Meaning |
| --- | --- |
| `audioUrl` | The track playing now. |
| `shuffled` | What plays next: the whole library, shuffled, kept topped up. This is the only "queue"; visitors don't build one. |
| `history` | Tracks that played before this one, for Previous (the last 50). |
| `entry` | Whether the visitor has chosen yet: `waiting`, `sound` or `silent` (see [board.md](board.md)). |
| `isPlaying`, `volume` | Mirrored from whichever player has the current track. `volume` starts at 0.5, as Jake asked on 2026-10-27. |
| `audioElement`, `audioContext` | The player's element and Web Audio context, registered by `MusicPlayer` so any control can drive them. |
| `youtube` | The YouTube player, dressed as an `<audio>` element (`paused`, `currentTime`, `duration`, `play`, `pause`), registered by `YouTubePlayer` once it's ready. |
| `media()` | Whichever of the two has the current track. Every control goes through it, never straight to `audioElement`. |
| `playlist` | The Spotify playlist's songs, for the library's Playlist tab. |
| `playTrack(track)` | Play a track that isn't in the library (a play from Recent listens). |
| `addToLibrary(tracks)` | Add songs to the library and deal them into the shuffle at random places (the playlist's). |
| `setAudioUrl(url)` | Play this track now, and take it out of the shuffle so it doesn't come round again straight after; the shuffle carries on when it ends. If it's the track already loaded, it just resumes. |
| `playNext()` | Next: the next shuffled track. Also called when a track ends. |
| `playPrevious()` | More than 3 seconds in, restart the track; otherwise go back to the one before it, which puts the current track back at the front of the shuffle so Next returns to it. |
| `togglePlayback()` | Play or pause. With nothing loaded yet, it starts the welcome track. |
| `setVolume(volume)` | 0 to 1. |

When the shuffle runs out, the whole library is shuffled again, leaving out the track that's playing so it can't play twice in a row. So music never stops on its own. There's no manual queue: Jake had the add-to-queue buttons and the Queued list taken out on 2026-10-27, so songs shuffle on their own and pressing play on one plays it now.

**In the UI:**
- The player is `PlayerCard` (`atoms/player-card`): what's on, with a speaker button in that header row whose vertical volume slider (`VolumeSlider`) drops down on hover, focus or a tap; then cover, title and byline, the seek slider (`TrackProgress`), and previous/play/next (`Transport`) centred as one group. The board's Now Playing tile and the library both show it, so they always match. The Up next tile lists every song left in the shuffle and scrolls.
- The library (`/library`) adds every song left in the shuffle under the player, scrolling, and shows every song as a `MusicTile`: cover and a play button. Its Playlist tab ("What I've had on repeat.") lists `youtubeSongs` and the Spotify playlist's songs, and only shows when there are some.
- `FloatingPlayer` stands in wherever the Now Playing tile is out of sight: behind the overlays, and on phones once it scrolls away. It's a `MiniPlayer` (cover, title, play/pause, next and a `VolumeControl`) collapsed to a circle of the cover, ringed with the song's progress, until it's clicked open, and the visitor can drag it to any corner or edge middle ([board.md](board.md)).

**Autoplay:** browsers only allow audio after a user gesture. That's why the Now Playing tile asks the visitor to choose sound or silence first, and why `togglePlayback` resumes the `AudioContext` inside the click that called it, before `play()`. After that first gesture, moving on to the next track is allowed.

**Previews with sound:** most previews that make their own sound pause the music when they start, and it stays paused until the visitor presses play again. Not all do yet: NinjaDonut's Flash games play over it. `MusicPlayer` pauses when a page from the site's own origin posts `{ type: 'jakemotta:media-playing' }` to it, and its `onPause` handler keeps `isPlaying` and the buttons in step. Every preview with sound posts it to `window.top`, which works however deeply the page is framed, and the page doesn't need to know how the site plays its music:
- the Ambii Business demos, whenever one of them starts a song, an announcement or a preview, two frames deep in the phone app's case ([projects/ambii-business.md](projects/ambii-business.md));
- Escaping Confinement's film page, when the film plays ([projects/escaping-confinement.md](projects/escaping-confinement.md));
- the Flash gallery, when a piece opens;
- Asteroids, on the first click or key press in its frame;
- isGuy and Pokémon, when Play is pressed;
- the Ambii story page, when a video with sound plays.

Use the same message for new previews.

## Songs from YouTube

Jake asked on 2026-10-27 for songs from YouTube, and his Spotify songs through their YouTube copies, to play in the site's player, in the same shuffle as his own tracks. When it's one's turn, its video plays where the player is.

**What a track's `url` says** (`common/music.ts`, `isStreamed()`):

| `url` | Plays |
| --- | --- |
| `/music/foo.mp3` | in the site's `<audio>`, as always |
| `youtube:<video id>` | that YouTube video |
| `spotify:<track id>` | the YouTube copy of a Spotify song, which the listening Worker finds (`/api/listening/match`, [listening.md](listening.md#the-worker)) |
| `song:<artist>/<title>` | the same for a song known only by name: ListenBrainz's top songs |

**Where the songs come from:**
- **`youtubeSongs`** in `constants.ts`: Jake's own picks.
  - The `url` is `youtube:` and the video's ID.
  - Leave `image` empty to use the video's thumbnail, which for YouTube Music's own uploads is the album art.
  - `artist` shows in place of "Jake Motta · year".
  - It's empty to start with; the comment above it shows an entry.
- **Jake's Spotify playlist** (`SPOTIFY_PLAYLIST` in the Worker's `wrangler.toml`): `YouTubePlayer` asks the Worker for it once per visit (`/api/listening/playlist`), and its songs are dealt into the shuffle as `spotify:` tracks.
- **Recent listens:** rows that can play here get a play button beside the link out (`ListenRow`'s `onPlay`). These play on a pick and don't join the shuffle:
  - YouTube Music plays play as their own video;
  - Spotify plays, and top songs, play through the Worker's match;
  - albums and artists have no play button.

Everything that needs the Worker stays hidden until it answers.

**The player, `atoms/youtube-player`:** `YouTubePlayer` is mounted in `App.tsx` beside `MusicPlayer`, so it survives navigation the same way.
- **One player for the visit:** it's YouTube's own embedded player (the IFrame API, loaded once by `common/youtube.ts`, which listen-along shares), made the first time a song from YouTube comes up.
- **How a song plays:** a `youtube:` song plays straight away. Any other is matched first, through `matchSong()`, and each answer is kept for the visit. A song with no match, or one YouTube won't play (embedding off, removed), is skipped to the next.
- **The controls:** they drive it through `media()`, so play, pause, Next, Previous, seeking, the progress ring and the volume all work as they do for an MP3. `MusicPlayer` pauses its `<audio>` while a song from YouTube is on, and each player only reports `isPlaying` for its own songs.
- **Where the video shows:** in place of the cover, as `VideoSlot`. The player card's slot (`PlayerCard`, on the board and in the library) comes first. When no card is in sight (behind any other overlay, or on a phone once the tile scrolls away), the floating player shows a 200×200 slot beside its pill, on the side away from the edge it's docked to.
  - **Not inside the slot:** an iframe reloads whenever it's moved in the page. So the player is fixed above everything, and a `requestAnimationFrame` loop lays it over the slot on screen, written straight onto the element like the visualizer.
  - **Picking the slot:** the newest card at least half in view and not `inert` (the board's, behind an overlay, is), then the floating player's, then any card partly in view, and as a last resort the bottom-left corner.
  - **The volume card:** it opens over the cover, so the player cuts a hole (`clip-path`) wherever an open volume card overlaps it, as if the card were on top.
- **YouTube's rules** ([API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies)), as for listen-along:
  - **Visible:** the video is always visible while it plays. It's at z-index 105, above the overlays (60), the floating player (80) and the vignette (100), and under listen-along's (110).
  - **Size:** it's never under 200×200. The slots' minimums keep it there, and a smaller slot gets a player that grows past it, centred.
  - **It plays on in a hidden tab, against YouTube's rules.** Section III.I.9 forbids playing YouTube audio from a player that isn't on screen. Until 2026-10-28 the player paused whenever the tab was hidden. That day Jake chose to let it play on, like his own tracks. He knew the risk: YouTube can suspend or revoke the project's API access (III.J.3). That would stop the listening Worker finding YouTube copies, so the playlist, the Recent listens play buttons and listen-along would stop working. If that happens, or YouTube writes about it, putting back the `visibilitychange` effect (removed in that change) restores the pause. Listen-along's player still pauses in a hidden tab.
  - **Ads:** YouTube's ads aren't blocked.
- **The vignette rests during these songs.** YouTube's frame is cross-origin, so the analyser can't hear it, and the eq bars rest too. Listen-along's opt-in tab capture ([listening.md](listening.md#the-visualizer-while-listening-along-opt-in)) isn't offered here yet.

## The visualizer

`src/components/atoms/music-player` owns the one `<audio>` element.
- **Audio graph:** it builds the Web Audio graph once, on the first track: a `MediaElementAudioSourceNode` feeding the output and, beside it, an `AnalyserNode` (`fftSize` 2048). An `<audio>` element can only ever feed one source node, so the graph is reused for every later track.
- **The analyser's second input:** while a visitor listens along with Jake ([listening.md](listening.md#listen-along)), the YouTube player is a cross-origin frame the analyser can't hear, so the vignette rests. If they opt in to sharing the tab's sound, the store's `capture` stream is connected to the analyser too, never to the output, since the tab is already playing it. The analyser listens beside the output rather than in front of it so that this second input stays silent.
- **Two bands:** each frame, a `requestAnimationFrame` loop reads the frequency data for the lows (30–150 Hz: kick and bass) and the highs (4–12 kHz: hats and air). Each band adapts to the range the current track actually uses, so quiet and loud masters both swing from rest to full. The ranges reset on every new track.
- **Drawing:** the lows push the dark inset vignette in, and the highs flicker a tighter rim. Each is a layer inside `.audio-visualizer` with its inset shadow painted once at full strength; the loop stretches it past the screen's edges (`transform: scale`) and fades it (`opacity`) through a ref, so the compositor does the work and nothing repaints. It writes only when a level moves by a hundredth. It used to rewrite the `box-shadow` every frame, which repainted the whole screen 60 times a second ([performance.md](performance.md#the-vignette)).
- **Eq bars:** the same loop writes both levels (0 to 1) to `audioLevels` (`music-player/levels.ts`). Each `EqBars` runs its own small loop that reads them and scales its bars: the first follows the lows, the last the highs, the ones between blend the two. So the bars on the tiles bounce with the real track, and rest when it's paused.
- **Keep per-frame values off React state.** Anything that changes every frame goes analyser → ref or canvas, inside an animation loop. The seek slider works the same way: it writes its position onto the input each frame.

## Silent while Claude previews

The dev server Claude starts (the `dev` config in `.claude/launch.json`) sets `REACT_APP_MUTE_AUDIO=1`, and everything it serves plays without sound. Jake asked for this so the site's music and the projects' sound don't play over whatever he's doing while Claude looks around. A `yarn dev` run by hand stays loud.
- **How:** `src/muteAudio.js` runs first in every page. `src/index.tsx` loads it into the app, and `src/setupProxy.js` inlines it at the top of every `.html` page under `public/` as it serves it, leaving the files on disk alone. It never reaches the build.
- **What it does:** `<audio>` and `<video>` elements are really muted as they load or play, while the page still reads back whatever it set `muted` to, so its own mute buttons work. Every `AudioContext` renders to no device (`sinkId: { type: 'none' }`, Chromium 110+), which covers Ruffle's Flash and the games.
- **The visualizer still moves.** Chromium applies an element's `muted` before the Web Audio graph, so an element that feeds a graph (the music player's) is left unmuted and goes silent at the context's sink instead. The analyser still gets the signal, and the vignette and eq bars react as usual.
- **YouTube's players:** the site's own (songs from YouTube) and listen-along's are cross-origin frames the script can't reach. Under `REACT_APP_MUTE_AUDIO` each calls the IFrame API's `mute()` when it's ready (`MUTED` in `common/youtube.ts`).
- **Not covered:** the other cross-origin frames, the YouTube, SoundCloud and Vimeo embeds in the old sites, can't be reached from the page. None of them autoplay, so they only make sound if something clicks play.
- **To hear it:** remove `REACT_APP_MUTE_AUDIO` from `.claude/launch.json`, or run `yarn dev` yourself. The screenshot script is muted separately, by its browser's `--mute-audio`.
