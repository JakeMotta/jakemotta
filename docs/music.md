# Music player

Music plays across the whole site. The player sits outside the routes in `App.tsx`, so it keeps playing as the visitor moves between pages, and the visualizer reacts to the audio that's actually playing.

## The library

The tracks are the static arrays `musicList` and `favoriteArtists` in `src/common/constants.ts`. The audio is in `public/music/` and the cover art in `public/images/music/`. The player's library for shuffling is every distinct `url` in both lists.

## Playback and the queue

State lives in `src/store/audio.ts` (zustand):

| Field / action | Meaning |
| --- | --- |
| `audioUrl` | The track playing now. |
| `queue` | Tracks the visitor queued, in order. |
| `shuffled` | What plays once the queue runs dry. |
| `setAudioUrl(url)` | Play this track now. If it was queued, it leaves the queue. |
| `toggleQueued(url)` | Add the track to the end of the queue, or take it out if it's already there. |
| `playNext(library)` | Called when a track ends (see below). |

When a track ends, the player calls `playNext`:
1. If anything is queued, the first queued track plays and leaves the queue.
2. Otherwise, the next track in `shuffled` plays.
3. When `shuffled` is empty too, the whole library is shuffled again, leaving out the track that just finished so it can't play twice in a row.

So music never stops on its own, and anything the visitor queues jumps ahead of the shuffle.

**In the UI:**
- Clicking a `MusicTile` on Home plays it now.
- Each tile has a queue button on its right. At rest it shows a faint "add to queue" icon, which turns solid on hover. Once the track is queued, the button shows its place in line (1, 2…), and clicking it again removes the track.
- The Welcome page's "Enter with Music" plays `/music/dancin.mp3`.

**Autoplay:** browsers only allow audio after a user gesture. That's why the Welcome page asks the visitor to choose before entering. After that first gesture, moving on to the next track is allowed.

## The visualizer

`src/components/atoms/music-player` owns the one `<audio>` element.
- **Audio graph:** it builds the Web Audio graph once, on the first track: a `MediaElementAudioSourceNode` feeding an `AnalyserNode` (`fftSize` 2048) and then the output. An `<audio>` element can only ever feed one source node, so the graph is reused for every later track.
- **Two bands:** each frame, a `requestAnimationFrame` loop reads the frequency data for the lows (30–150 Hz: kick and bass) and the highs (4–12 kHz: hats and air). Each band adapts to the range the current track actually uses, so quiet and loud masters both swing from rest to full. The ranges reset on every new track.
- **Drawing:** the lows push the dark inset vignette in, and the highs flicker a tighter rim. Both are written straight onto `.audio-visualizer`'s `box-shadow` through a ref. Keep per-frame values on that path (analyser → ref or canvas, inside the animation loop) rather than routing them through React state.
