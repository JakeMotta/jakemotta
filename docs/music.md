# Music player

Music plays across the whole site. The player sits outside the routes in `App.tsx`, so it keeps playing as the visitor opens and closes tiles, and the visualizer reacts to the audio that's actually playing.

## The library

The tracks are the static arrays `musicList` and `favoriteArtists` in `src/common/constants.ts`, plus `welcomeTrack` (Dancin, what the board's "Play with sound" starts). The audio is in `public/music/` and the cover art in `public/images/music/`; a track with no `image` (the welcome track) shows a monogram in the hue. `src/common/music.ts` builds `LIBRARY`, every distinct `url` in all three, which the shuffle draws from, and `findTrack(url)`, which looks a track up for display. A track's `description` shows in the library's player, so leave it empty rather than writing filler.

## Playback and the queue

State lives in `src/store/audio.ts` (zustand):

| Field / action | Meaning |
| --- | --- |
| `audioUrl` | The track playing now. |
| `queue` | Tracks the visitor queued, in order. |
| `shuffled` | What plays once the queue runs dry. It starts as the whole library, shuffled, and is kept topped up. |
| `history` | Tracks that played before this one, for Previous (the last 50). |
| `entry` | Whether the visitor has chosen yet: `waiting`, `sound` or `silent` (see [board.md](board.md)). |
| `isPlaying`, `volume` | Mirrored from the `<audio>` element. |
| `audioElement`, `audioContext` | The player's element and Web Audio context, registered by `MusicPlayer` so any control can drive them. |
| `setAudioUrl(url)` | Play this track now. If it was queued or next in the shuffle, it leaves that line. If it's the track already loaded, it just resumes. |
| `toggleQueued(url)`, `clearQueue()` | Add the track to the end of the queue or take it out; empty the queue. |
| `playNext()` | Next: the first queued track, else the next shuffled one. Also called when a track ends. |
| `playPrevious()` | More than 3 seconds in, restart the track; otherwise go back to the one before it, which puts the current track back at the front of the shuffle so Next returns to it. |
| `togglePlayback()` | Play or pause. With nothing loaded yet, it starts the welcome track. |
| `setVolume(volume)` | 0 to 1. |

When the shuffle runs out, the whole library is shuffled again, leaving out the track that's playing so it can't play twice in a row. So music never stops on its own, and anything the visitor queues jumps ahead of the shuffle.

**In the UI:**
- The board's Now Playing tile is the player: seek slider (`TrackProgress`) and previous/play/next (`Transport`). The Up next tile lists the next four tracks, queued ones first with their place in line.
- The library (`/library`) adds volume (`VolumeSlider`) and the queue, and shows every song as a `MusicTile`: cover, a play button, and a queue toggle that shows a faint "add to queue" icon at rest and the track's place in line (1, 2…) once queued. Clicking it again removes the track.
- `MiniPlayer` (cover, title, play/pause, next) stands in wherever the Now Playing tile is out of sight: in the overlays, and on phones once it scrolls away.

**Autoplay:** browsers only allow audio after a user gesture. That's why the Now Playing tile asks the visitor to choose sound or silence first, and why `togglePlayback` resumes the `AudioContext` inside the click that called it, before `play()`. After that first gesture, moving on to the next track is allowed.

**Previews with sound:** most previews that make their own sound pause the music when they start, and it stays paused until the visitor presses play again. Not all do yet: NinjaDonut's Flash games play over it. `MusicPlayer` pauses when a page from the site's own origin posts `{ type: 'jakemotta:media-playing' }` to it, and its `onPause` handler keeps `isPlaying` and the buttons in step. Every preview with sound posts it to `window.top`, which works however deeply the page is framed, and the page doesn't need to know how the site plays its music:
- the Ambii Business demos, whenever one of them starts a song, an announcement or a preview, two frames deep in the phone app's case ([projects/ambii-business.md](projects/ambii-business.md));
- Escaping Confinement's film page, when the film plays ([projects/escaping-confinement.md](projects/escaping-confinement.md));
- the Flash gallery, when a piece opens;
- Asteroids, on the first click or key press in its frame;
- isGuy and Pokémon, when Play is pressed;
- the Ambii story page, when a video with sound plays.

Use the same message for new previews.

## The visualizer

`src/components/atoms/music-player` owns the one `<audio>` element.
- **Audio graph:** it builds the Web Audio graph once, on the first track: a `MediaElementAudioSourceNode` feeding an `AnalyserNode` (`fftSize` 2048) and then the output. An `<audio>` element can only ever feed one source node, so the graph is reused for every later track.
- **Two bands:** each frame, a `requestAnimationFrame` loop reads the frequency data for the lows (30–150 Hz: kick and bass) and the highs (4–12 kHz: hats and air). Each band adapts to the range the current track actually uses, so quiet and loud masters both swing from rest to full. The ranges reset on every new track.
- **Drawing:** the lows push the dark inset vignette in, and the highs flicker a tighter rim. Both are written straight onto `.audio-visualizer`'s `box-shadow` through a ref.
- **Eq bars:** the same loop writes both levels (0 to 1) to `audioLevels` (`music-player/levels.ts`). Each `EqBars` runs its own small loop that reads them and scales its bars: the first follows the lows, the last the highs, the ones between blend the two. So the bars on the tiles bounce with the real track, and rest when it's paused.
- **Keep per-frame values off React state.** Anything that changes every frame goes analyser → ref or canvas, inside an animation loop. The seek slider works the same way: it writes its position onto the input each frame.

## Silent while Claude previews

The dev server Claude starts (the `dev` config in `.claude/launch.json`) sets `REACT_APP_MUTE_AUDIO=1`, and everything it serves plays without sound. Jake asked for this so the site's music and the projects' sound don't play over whatever he's doing while Claude looks around. A `yarn dev` run by hand stays loud.
- **How:** `src/muteAudio.js` runs first in every page. `src/index.tsx` loads it into the app, and `src/setupProxy.js` inlines it at the top of every `.html` page under `public/` as it serves it, leaving the files on disk alone. It never reaches the build.
- **What it does:** `<audio>` and `<video>` elements are really muted as they load or play, while the page still reads back whatever it set `muted` to, so its own mute buttons work. Every `AudioContext` renders to no device (`sinkId: { type: 'none' }`, Chromium 110+), which covers Ruffle's Flash and the games.
- **The visualizer still moves.** Chromium applies an element's `muted` before the Web Audio graph, so an element that feeds a graph (the music player's) is left unmuted and goes silent at the context's sink instead. The analyser still gets the signal, and the vignette and eq bars react as usual.
- **Not covered:** cross-origin frames (the YouTube, SoundCloud and Vimeo embeds in the old sites, and listen-along's YouTube player) can't be reached from the page. None of the embeds autoplay, so they only make sound if something clicks play.
- **To hear it:** remove `REACT_APP_MUTE_AUDIO` from `.claude/launch.json`, or run `yarn dev` yourself. The screenshot script is muted separately, by its browser's `--mute-audio`.
