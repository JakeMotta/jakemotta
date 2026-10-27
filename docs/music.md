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

## The visualizer

`src/components/atoms/music-player` owns the one `<audio>` element.
- **Audio graph:** it builds the Web Audio graph once, on the first track: a `MediaElementAudioSourceNode` feeding an `AnalyserNode` (`fftSize` 2048) and then the output. An `<audio>` element can only ever feed one source node, so the graph is reused for every later track.
- **Two bands:** each frame, a `requestAnimationFrame` loop reads the frequency data for the lows (30–150 Hz: kick and bass) and the highs (4–12 kHz: hats and air). Each band adapts to the range the current track actually uses, so quiet and loud masters both swing from rest to full. The ranges reset on every new track.
- **Drawing:** the lows push the dark inset vignette in, and the highs flicker a tighter rim. Both are written straight onto `.audio-visualizer`'s `box-shadow` through a ref.
- **Eq bars:** the same loop writes both levels (0 to 1) to `audioLevels` (`music-player/levels.ts`). Each `EqBars` runs its own small loop that reads them and scales its bars: the first follows the lows, the last the highs, the ones between blend the two. So the bars on the tiles bounce with the real track, and rest when it's paused.
- **Keep per-frame values off React state.** Anything that changes every frame goes analyser → ref or canvas, inside an animation loop. The seek slider works the same way: it writes its position onto the input each frame.
