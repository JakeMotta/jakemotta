# isGuy

The Adventures of isGuy, a five-level platformer Jake made in Greenfoot (Java) in March 2013: a stick figure with a gun, lasers, ladders, keys, doors, falling blocks and UFOs. It was published as a Java applet on NinjaDonut ("Project isGuy is finally here!"). The folder is `public/projects/isguy/`; the card id is `isguy`.

**Since 2026-10-27 isGuy runs as JavaScript**, the way Coloris does ([greenfoot-web.md](greenfoot-web.md)). Jake picked that route over CheerpJ after comparing the two on Rebound ([rebound.md](rebound.md#compared-with-the-coloris-way)).
- **The build:** `yarn projects:greenfoot isguy` compiles the jar's 72 classes, unchanged, into `web/`, with the 194 images and 9 sounds the game names. Its `GAMES` entry reads only `isGuyFinal.jar`: `browser-timer.jar` fixes a CheerpJ problem.
- **The page:** `index.html` is Coloris's page with isGuy's name, size (800×600), controls and note. Its music pauses the site's player the first time the game plays a sound.
- **The title screen:** `worldOne`, the start world, switches to the title screen (`gameStartWorld`) from its constructor. Greenfoot 3 keeps the world a constructor switches to, but the runtime first opened level 1 straight away; it now keeps it too (greenfoot-web.md).
- **Verified** on 2026-10-27 in headless Chrome against `yarn dev`:
  - playable 0.5–1.1 s after Play, at 60 acts and 60 frames a second with the main thread 8–9% busy;
  - the title screen with its song, Start into level 1, walking, jumping and shooting;
  - sound: the title song, the button's coin and the gunshot all played after a real click on Play;
  - in the site's viewer it boots at its full 800×600;
  - no console errors.
- **Not checked yet:** the other four levels, How to Play and Game Info, and the game-over and victory screens, against the CheerpJ version.

The rest of this page describes the CheerpJ version, which is still how Pokémon runs ([greenfoot-pokemon.md](greenfoot-pokemon.md)) and what Coloris's ([coloris.md](coloris.md)) and isGuy's own `cheerpj.html` copies do.

## Preview through CheerpJ

`cheerpj.html` (the page's `index.html` until 2026-10-27) is a hand-written page: the game's frame with a poster and a Play button, a hint line under it, the controls from the game's own How to Play screen, and a note about the game and CheerpJ. Pokémon's and Coloris's `cheerpj.html` pages are copies of it with their own text and settings (the variables at the top of the script).

**How the Java runs.** [CheerpJ](https://cheerpj.com/) (Leaning Technologies) runs Java 8 in the browser in WebAssembly.
- **Loading:** nothing loads until Play. Then the page adds CheerpJ's `loader.js` (version 4.3) from `https://cjrtnc.leaningtech.com/4.3/` and calls `cheerpjInit({ status: 'none' })`. CheerpJ fetches its runtime from that CDN and then downloads the whole jar in one request; it doesn't use range requests. isGuy's jar is 40 MB, so the first load is slow.
- **As an applet:** the jar's `greenfoot.export.GreenfootScenarioViewer` is a `JApplet`, so the page adds a `<cheerpj-applet>` with that `code`, `browser-timer.jar` and the game's jar as `archive` (see Speed), and 816×669, the size of the applet tag on the NinjaDonut page. It draws the game with no window frame around it. The applet route needs Java 8, CheerpJ's default.
- **`codebase_lookup=false`:** without this `<param>`, CheerpJ's applet loader asks the server (a `HEAD` request) for every resource the jar doesn't have. Greenfoot looks every image up twice, so for Coloris that was about 90 requests, one at a time: ten seconds at 80 ms each.
- **Loading message:** CheerpJ swaps the element for an `<object>` and paints the applet's window white first, then Greenfoot loads the world's images. The message stays up until a pixel a third of the way down the canvas turns from that white to the game, or for 30 seconds after the window appears.
- **Run:** Greenfoot scenarios start paused behind a Reset / Run bar, as they did on the old sites. There's no autorun setting in the exported viewer, so the hint tells the visitor to press Run (and, here, Start on the title screen).
- **Narrow screens:** before Play the poster is scaled down to fit. Once the game runs it stays at its own size and the frame scrolls sideways, because CheerpJ doesn't map clicks through a CSS transform: a scaled game drew fine but its Run button couldn't be clicked. CSS `zoom` stopped it drawing at all. The page itself never scrolls sideways; at 375 px the frame does, and the hint says so.
- **Keys:** arrow keys and Space are kept from scrolling the page while the game runs. The game only gets keys once it's been clicked, which pressing Run does.
- **`#play`:** `index.html#play` starts without a click, for screenshots.

**Pausing the site's music.** Pressing Play asks the site's player to pause with the `jakemotta:media-playing` message, the same way the Escaping Confinement page does ([escaping-confinement.md](escaping-confinement.md)). isGuy and Pokémon do; Coloris has no sound, so it leaves the music playing (`PAUSE_SITE_MUSIC` at the top of each page's script).

**CheerpJ's license.** The free [Community License](https://cheerpj.com/docs/licensing) covers an individual's personal projects, earning or not, as long as CheerpJ is loaded from `cjrtnc.leaningtech.com`; self-hosting it needs a paid license. It asks for appropriate credit, which is the CheerpJ line on each page. CheerpJ prints a "Community Edition, for personal and non-business use only" banner to the console. Checked on 2026-10-26, when 4.3 was current.

**Files.**
- `isGuyFinal.jar` (39.9 MB) is `Old Computer/Documents/Greenfoot/isGuy/isGuyFinal.jar`, copied unchanged. Jake re-exported the March 2013 project from Greenfoot 3.0.4 on 2017-11-10 (Java 8 classes); its 215 images match the 2013 export. It runs as is with `java -jar` too.
- `browser-timer.jar` (2 KB) is new, made on 2026-10-27. It holds one class, `greenfoot/util/HDTimer.class`, listed before `isGuyFinal.jar` so it replaces the jar's copy. See Speed below.
- `poster.webp` is the title screen, captured from the game running in CheerpJ. Both pages show it before Play.

**The music.** About 38 MB of the jar is six songs by other artists: The Orbiters, Tiesto & Allure, Adhesive Wombat, Soulero, and Trampboat & Soulero. The game credits them on its Game Info screen and the page names them. They're published as part of the jar: on 2026-10-26 Jake decided to keep them rather than ship a rebuilt, silent jar. Don't strip them unless he asks.

**Verified** in headless Chrome, served from `public/`:
- the page loads, the jar downloads, and the title screen appears;
- Start opens level 1, and the arrow keys, jump and Space (a bullet) work;
- once Run is pressed, CheerpJ plays audio through Web Audio (the music);
- inside a same-origin frame, Play pauses the parent page's music.

Not verified: how the music sounds (the browser ran muted), levels 2 to 5, keys, doors and the ending.

## Speed

On 2026-10-27 all three games were reported as far too slow to play. This section covers what was measured, what was wrong and what changed, for all three; [coloris.md](coloris.md) and [greenfoot-pokemon.md](greenfoot-pokemon.md) add what's particular to each.

**How it was measured.** The act rate came from a counter added for the test only: a patched `greenfoot.core.Simulation` that printed the time every 180 acts, served ahead of the game's jar through DevTools request interception, so nothing went into the repo. The pages ran under `yarn dev` in headless Chrome on Jake's desktop (i7-6700K), with other work loading the machine, so the numbers wobble by about 10%. Canvas updates were counted beside it.

**What it should run at.** The exported viewer takes its speed from the jar's `project.greenfoot` (`simulation.speed`), not from `standalone.properties`, so the speed the project was saved at is the one used. isGuy and Pokémon are at 50, Greenfoot's default: at most one act every 16.2 ms, 61.6 acts a second. Coloris is at 67, see [coloris.md](coloris.md). None of the games calls `Greenfoot.setSpeed`. So the speed setting wasn't the problem.

**What was wrong.** Three things, in order of size.
- **On the site, the board shares the game's thread.** A same-origin frame runs on the parent page's main thread, and the board behind the viewer keeps that thread 30–40% busy even when nobody touches it (the dev build, idle: 280–380 ms a second). About two thirds of that is the hue cycle in `App.tsx`, which re-renders the whole app and restyles the page whenever the hue moves; most of the rest is the particles. isGuy's level 1 ran at about 23 frames a second in the viewer against 47 standalone, and at 45 in the viewer once the board's animation loops were stopped. **Fixed on 2026-10-27 on the board's side:** first by pausing the hue cycle and the particles while any overlay is open, then, since Jake wanted the hue to keep moving, by making the hue cheap instead: it no longer re-renders the app, and the restyle each move costs is smaller ([performance.md](../performance.md#the-hue-cycle)). The particles still pause behind an overlay ([board.md](../board.md#overlays)).
- **Painting is what's expensive in CheerpJ.** CheerpJ runs the Java itself quickly: Pokémon's title at speed 100 managed over 20,000 acts a second. But Greenfoot repaints the whole world after every act (when 15 ms have passed since the last paint) and draws each actor through Java2D, in software. An 800×600 world with a few actors takes about 11 ms a frame; Pokémon's town, with about 920 actors, about 25 ms. Once an act and its paint take more than 28.6 ms, Greenfoot also waits for each paint to finish, so a heavy world runs at whatever speed painting allows.
- **Greenfoot's timer busy-waits.** To end each act's 16.2 ms precisely, `greenfoot.util.HDTimer` sleeps for most of it and then calls `Thread.yield()` and spins on `System.nanoTime()` for the rest. In CheerpJ every Java thread shares the page's one JavaScript thread, so that spin takes time away from painting.

**What changed: `browser-timer.jar`.** Each game's folder has one, listed before the game's own jar. It holds `greenfoot/util/HDTimer.class` from that game's runtime (Greenfoot 3.0.4 for isGuy and Coloris, 2.1.2 for Pokémon) with one method replaced. `sleepFromTime(long nanos, long start)` now sleeps for the time left and returns:

```java
long left = nanos - (System.nanoTime() - start);
if (left > 0) Thread.sleep(left / 1000000, (int) (left % 1000000));
```

Every other method and the constant pool are as they were. The classes were written with a one-off Python script (not kept), and each passed the desktop JVM's bytecode verifier (`-Xlog:verification`) with its game. Sleeping without the spin overshoots a little, so a speed-50 game runs at about 58 acts a second instead of 61.6; a variant that slept whole milliseconds reached 60 but kept the thread busier, which costs more on the site.

Measured standalone (acts a second, and how busy the page's main thread was):

| | Before | After |
| --- | --- | --- |
| isGuy, title | 54–58, 93–96% busy | 54–56, 70–81% busy |
| isGuy, level 1 | about 54, 85–87% busy | about 55, 72–84% busy |
| Coloris, standing | about 250 (speed 67), 100% busy | 53–57, 70–78% busy |
| Pokémon, title | about 60 | about 58 |
| Pokémon, town | 16–23, 100% busy | 18–22, 100% busy |

Painting kept up better too: isGuy drew 47–56 frames a second instead of 44–50, and Coloris 55 instead of 38–50.

**Tried and dropped.**
- CheerpJ 4.3 is the newest release (4.4 and 5.0 don't exist on the CDN), and `cheerpjInit` has no option that changes how fast Java runs.
- Application mode (`cheerpjRunMain` with `GreenfootScenarioMain`) instead of the applet: Pokémon's town ran at about 27 acts a second instead of 21, on Java 8 or 17 alike. It wasn't worth it: it adds a window frame and CheerpJ's Community Edition banner, and on Java 17 the battle music didn't play.
- `javaProperties: ['awt.nativeDoubleBuffering=true']`, to skip Swing's back buffer: CheerpJ then sent every draw call to the canvas (7,700–9,300 `putImageData` calls a second) and the town got slower.
- A lower frame cap that doesn't wait for paints (`Simulation`'s `MAX_FRAME_RATE` and `MIN_FRAME_RATE`): the acts got ahead, but painting starved to 3 frames a second.

## Download

The download is the jar itself, `public/projects/isguy/isGuyFinal.jar` (39.9 MB): its manifest names `greenfoot.export.GreenfootScenarioMain`, so a visitor with Java 8 or newer double-clicks it or runs `java -jar isGuyFinal.jar`, from any folder. Nothing new was made for it. Verified on 2026-10-27 with Java 25 on Windows 10: the window ("isGuyFinal") opens behind the Reset / Run bar, black until Run as on the site, with nothing on stderr. Not checked on the desktop: Run, playing, and the music. `browser-timer.jar` is for CheerpJ and isn't needed on the desktop. The deploy compares files by size only (see CLAUDE.md), which doesn't matter here as long as the jar stays as it is.

## Left out on purpose

- The 2013 export (`Greenfoot/isGuyExport/`, `isGuyExport.zip`): source and classes but no jar, and the same game.
- The NinjaDonut copy at `public/projects/ninja-donut/Pages/isGuy/` is untouched. Its applet tag points at `isGuyFinalExport/isGuyFinal.jar`, which isn't in the repo.

## Card image

`public/images/projects/isguy.webp` is just the game: the title screen, 5 seconds after `#play` (once its opening wipe has passed), clipped to the 800×600 canvas, already 4:3. Before 2026-10-27 it was the CheerpJ page with the Play button.
