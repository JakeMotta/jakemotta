# Performance

The site is loud on purpose: a hue that never stops moving, particles, a vignette that pulses with the bass. All of it shares one browser thread with everything else on the page, including a project framed in the viewer: a same-origin frame runs on its parent's main thread, so whatever the board spends, a Java game in the viewer loses. This page is what keeps that cheap enough for slow devices, and the rules for anything new that runs every frame.

Jake asked for a performance pass on 2026-10-27, with two conditions: nothing taken away, and the hue never paused for the games (the particles may pause).

## What it costs

Measured on 2026-10-27 on production builds of the same commit, before and after, in headless Chrome at 1440×900 on Jake's desktop, with the music playing, muted. Each figure is the share of the main thread busy over six seconds (`TaskDuration` from `Performance.getMetrics`, through the DevTools protocol), as the range over three runs.

| | Before | After |
| --- | --- | --- |
| Script for the first screen (gzipped) | 226 kB | 129 kB |
| Board, waiting for sound or silence | 24–28% | 14–15% |
| Board, music playing | 31–37% | 21–24% |
| Overlay open (the library) | 19–21%, with the hue paused | 20–22%, with the hue running |

Script time on the board fell from about 11% of the thread to 3%. With an overlay open the page now costs what it did with the hue paused, while the hue keeps going.

To measure again: build, serve `build/` with any static server that falls back to `index.html`, and drive Chrome through the DevTools protocol: `Performance.enable`, then compare `Performance.getMetrics` (`TaskDuration`, `ScriptDuration`, `RecalcStyleDuration`) before and after a few seconds on the board, after "Play with sound", and with an overlay open. Compare two builds at full speed, run in turns: with `Emulation.setCPUThrottlingRate` at 4 both versions keep the thread nearly full, which hides the difference (about 97% before against 87–94% after).

## The hue cycle

The hue moves about twelve times a second (a whole degree at a time, 360° in 30s), and every move restyles the whole page, because every color on it is one of the four CSS variables.

- **Never React state.** `App.tsx`'s loop calls `applyHue` (`contexts/ThemeContext.tsx`), which writes the four variables onto `<html>` directly. The hue used to be state in `ThemeContext`, which re-rendered the whole app twelve times a second; that was most of the board's script time, and about two thirds of what slowed the games ([projects/isguy.md](projects/isguy.md)). Read the hue through the variables, never through a context value or a prop.
- **Typed variables.** `global.scss` registers the four with `@property` as `<color>`. The same restyle costs roughly 40% less than with plain variables.
- **No color transitions on anything painted in the hue.** A `transition` on `background-color` (or `color`, `border-color`, `all`) of an element whose color is a hue variable restarts with every move of the hue, so the element animates without end and the page restyles every frame. The ground (`templates/color-shifting-background`) and the transport's play button both did. Hover transitions between fixed colors (transparent to `rgba(…)`) are fine.
- **It keeps running behind an overlay, in 2° steps.** Same speed, half as many restyles, since the board behind restyles with the rest of the page and that's what the hue costs a framed game. A 2° step on the overlay's dark panel is too small to see; on the board itself it stays at 1°.

## The vignette

`atoms/music-player` draws the vignette with two layers inside `.audio-visualizer`, each with its inset shadow painted once at full strength. Each frame it stretches them past the screen's edges (`transform: scale`) and fades them (`opacity`), which the compositor does without repainting anything. It used to write a new `box-shadow` every frame, which repainted the whole screen 60 times a second. It only writes when a level moves by a hundredth, so it's idle between songs and through the YouTube ones.

Never animate `box-shadow`, `filter` or a background on something the size of the screen; animate `transform` and `opacity` of a layer that's painted once.

## Loops that run every frame

The eq bars, the seek slider and the floating player's ring each read the music in their own `requestAnimationFrame` loop and write straight to the DOM through a ref (never React state). Each write restyles the page, so they:

- write only when the value they show has changed (rounded to what can be seen);
- skip their work when they're inside an `inert` ancestor, which is how the board marks itself behind an overlay.

The eq bars are also each on a compositor layer of their own (`will-change: transform`), so their bounce doesn't repaint the page around them.

Anything new that animates with the music follows the same three rules: a ref, a change check, and the `inert` skip.

## What rests behind an overlay

The particles pause (`overlayOpen` in `store/common.ts`, which the board sets), and the board's eq bars and seek slider stop drawing. The hue, the vignette and everything inside the overlay keep going ([board.md](board.md#overlays)).

## Particles

`atoms/ts-particle-background` loads tsparticles' basic bundle (`@tsparticles/basic`): moving circles in one color need nothing more, and the full bundle (`@tsparticles/all`, still in `package.json` but no longer imported) was most of the site's script. It's capped at 60 frames a second; it was 120.

## Loading

- **The overlays are chunks of their own.** `App.tsx` loads each overlay page with `React.lazy`, and the board's `<Outlet />` sits in a `<Suspense>` that shows nothing while one arrives. They're fetched as soon as the browser is idle after the board has loaded, so opening one doesn't wait on the network. Import the board from `pages/home` directly, never through the `pages` barrel, or every overlay comes back into the first chunk.
- **No antd JavaScript.** No antd component is in use, so its `ConfigProvider` went with the hue state; only its reset stylesheet is still loaded.
- **Images decode off the main thread** (`decoding="async"`), and the project screenshots and listen covers load lazily, as they come into view.
