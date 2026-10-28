# Rebound

A bounce-shot game Jake made in Greenfoot (Java) in April 2013. Aim with the mouse, click, and the ball flies off at a power set by how far away the mouse is, bouncing off the walls and slowing down; get it into the target within the level's shots. The scenario folder is called `TargetFinder`, and its unused title world says "Rebound", which is what Jake called the archive. It was saved in Greenfoot 2.2.1 on 2013-04-30 (`project.greenfoot`). The folder is `public/projects/rebound/`; the card id is `rebound`.

Jake sent it on 2026-10-27 as `Rebound.gfar` (174 KB, 84 files) and asked for it as an HTML5 game.

## How it runs

Unlike isGuy, which runs its jar through CheerpJ ([isguy.md](isguy.md)), and Coloris and Pokémon, whose own compiled classes run as JavaScript ([greenfoot-web.md](greenfoot-web.md)), Rebound is a port: `greenfoot.js` is the part of Greenfoot 2.2.1 the game uses, written for a canvas, and `rebound.js` is the game's Java translated into JavaScript class by class. The page loads in a moment, scales to any width, and takes touch.

**Why not Greenfoot's own conversion.** Greenfoot's only route to HTML5 is publishing the scenario on greenfoot.org: the site converts it on its own servers with TeaVM and its own JavaScript version of the Greenfoot API, and the conversion isn't available to run anywhere else. Greenfoot 3.8.2 (December 2023) also dropped exporting a standalone jar. Going that way would have meant publishing the game on greenfoot.org under Jake's account, then framing it from there. Greenfoot 3 also wouldn't compile the 2013 code as it is, because it uses `java.awt.Color` and `Font`, which Greenfoot 3 replaced with its own. CheerpJ would have worked, as it did for Coloris then, but the game is small enough (21 classes, about 1,700 lines, only basic drawing) that a port came out lighter and truer to a browser. The same day, greenfoot.org's route was rebuilt here for Coloris: TeaVM and our own Greenfoot runtime, compiling the game's unchanged classes, with `Color` and `Font` renamed in the bytecode ([greenfoot-web.md](greenfoot-web.md)). Rebound's classes could likely go through it too, which hasn't been tried.

**`rebound.js`** follows the Java method for method and in the same order, so the two read side by side. What the translation has to spell out:
- Java's integer division and `(int)` casts, through `int()` (`Math.trunc`);
- fields that Java starts at 0, `false` or `null`;
- field initialisers, which run after `super()` as in Java.

A few locals that shared a class's name are renamed, and the four walls (`bF`, `bFM`, `bL`, `bLM`), which differ only in size, share a `wall()` helper. Nothing about the game is changed. If the port needs a fix, it belongs in `greenfoot.js` unless the game itself is meant to change.

**`greenfoot.js`** reproduces the Greenfoot 2 behavior the game depends on:
- **Each act cycle:** the world acts first, then every actor that was in it when the cycle began, in the order they were added.
- **Adding an actor to the world it's already in does nothing.** This matters twice. `levelFailed()` re-adds the dim screen every act, and it still falls. `SWorld`'s `addObject` still appends to its scroll list on every call, so the aiming arrow piles up duplicates there, as it did in the original.
- **The mouse:** `mouseMoved`, `mousePressed` and `mouseClicked` report what happened since the last cycle, `getMouseInfo()` is null when nothing did, and moving with a button held is a drag, not a move.
- **Paint order:** `setPaintOrder` puts the first class on top. An actor takes its nearest listed superclass's place, and unlisted classes go underneath.
- **Collisions** test the images as rectangles turned with the actor, with touching edges not counting.
- **Bounds:** worlds are bounded unless they say otherwise (`SWorld` says unbounded).
- **Class images** come from `project.greenfoot`'s `class.<name>.image` lines, copied into `rebound.js`.
- **The starting world** is `levelOne`, Greenfoot's `world.lastInstantiated`.
- **Speed:** the act rate is capped at 61.6 a second, what `simulation.speed=50` gives ([isguy.md](isguy.md#speed)). After a slow frame it catches up by at most four acts, then drops the rest.

**Differences on purpose:**
- **Removed actors.** Greenfoot 2 throws "Actor not in world" when a removed actor's location is read or set; the 2.1.2 runtime in Pokémon's `V10.jar` has the check. Rebound hits it when you scroll while a shot is in flight: the arrow has been taken out of the world but is still on `SWorld`'s scroll list. So the original most likely stopped with that error there, though nobody ran it to check. In the port, `setLocation` on a removed actor does nothing and `getX`/`getY` give its last place, so the game carries on.
- **Touch.** A finger can't hover, so on touch screens touching and dragging count as moving the mouse, and lifting counts as the click. Phones can play the first level. The second needs the arrow keys to see the target.
- **The control bar** is just Pause and Reset (Reset makes a new `levelOne`). The game runs as soon as the page loads, instead of waiting behind Greenfoot's Run button.
- **Drawing:** the canvas smooths the circles' edges, where Java2D may have drawn them hard. Text uses Times New Roman, falling back to the browser's serif.

**Kept as the game was.** These look like bugs, but they're the 2013 game:
- the score counts frames the ball spends moving;
- the Retry button lights up but does nothing (R restarts);
- the second level's target does nothing, so the game ends there;
- the score and shots text scrolls away with the level;
- the aiming arrow stays behind at the launch spot during a shot (`checkMouse()` removes it, then `addArrow()` puts it back in the same act);
- left and right jump the view 55 pixels an act, since `player` sets its x to 505 or 95 rather than moving;
- `menuWorld`'s title is never drawn and nothing opens it.

## Compared with the Coloris way

On 2026-10-27 Jake asked to see the hand port beside the same game made the way Coloris runs. Coloris had just moved from CheerpJ to its classes compiled to JavaScript ([greenfoot-web.md](greenfoot-web.md)), and Rebound now has both:
- `teavm.html`: the compiled version, like Coloris's page now;
- `java/`: the CheerpJ version, the way Coloris ran before;
- `compare.html`: the port and the compiled version side by side, with the CheerpJ one under them.

None of these is linked from the site: the card still frames the port. Open `/projects/rebound/compare.html` directly.

**`java/rebound.jar`** (554 KB, 296 entries) is what both of the others are made from. It was assembled the way `coloris.jar` was ([coloris.md](coloris.md)), with a Python script (`zipfile`; not kept), and nothing in it was changed or recompiled. In it:
- **The game:** the 24 `.class` files and `project.greenfoot` from `TargetFinder/`, and its eight `.png` images under `images/`. The `.java`, `.ctxt` and `.fla` files are left out.
- **The Greenfoot 3.0.4 runtime:** `greenfoot/`, `bluej/`, `javazoom/` and the six control-bar icons, 260 entries copied byte for byte from `coloris.jar`, which took them from `isGuyFinal.jar`.
- **Settings:** `coloris.jar`'s `standalone.properties` with `main.class=levelOne` and `project.name=Rebound`, an empty `soundindex.list`, and its manifest, so `java -jar rebound.jar` should run it on the desktop too (not tried).

**The compiled version.**
- **The build:** `rebound` is an entry in `scripts/build-greenfoot.mjs`'s `GAMES`, reading `java/rebound.jar`, and `yarn projects:greenfoot rebound` writes `web/`. That's a 195 KB game script, the shared host and 7 images; the build output is committed and isn't edited by hand.
- **The page:** `teavm.html` is Coloris's page with the game's name, controls and note swapped in. It borrows `java/poster.webp`.
- **The runtime:** it ran Rebound without any change. `drawString`, fonts, transparency, ovals and the paint order already worked.

**The CheerpJ version.** `java/browser-timer.jar` is Coloris's, unchanged ([isguy.md](isguy.md#speed)). There's no `game-speed.jar`, since Rebound was saved at speed 50 already. `java/index.html` is Coloris's old CheerpJ page with the game swapped in, and the CheerpJ credit kept. `java/poster.webp` is the starting view, cut from a screenshot of the game in CheerpJ.

**What the comparison showed.** These are from headless Chrome on Jake's desktop against `yarn dev`, in a foreground tab, during the same shot in each. Acts were counted from `Ball.act`'s one `isKeyDown("r")` a cycle, which both JavaScript versions route through a JavaScript function; CheerpJ's doesn't, so its acts couldn't be counted:

| | Hand port | Compiled (TeaVM) | CheerpJ |
| --- | --- | --- | --- |
| Playable after opening | at once | 0.2–0.4 s after Play | 41–91 s from a cold cache, then Run |
| Acts a second | 61.6–61.9 | 60.0–60.2 | not countable |
| Browser frames a second | 59–60 | 60 | 61 |
| Main thread busy | 21–27% | 26–29% | 49% |

- **Speed:** both JavaScript versions run at the full speed of 50. The port acts on its own clock, capped at 61.6 a second, so it fits in an extra act now and then. The compiled one acts once a frame when the speed is that close to the screen's 60 Hz, as greenfoot-web.md describes.
- **A false start:** a first measurement read the canvases back every frame to count distinct pictures. That readback slowed the pages it measured, the compiled one most, and showed it at 26–29 frames a second. The table above reads nothing from the canvas.
- **Looks:** all three draw the same game: the trails, the score, and the aiming arrow left at the launch spot during a shot, which bears out the port on that quirk. CheerpJ draws the score in a sans-serif font, its stand-in for Times New Roman; both JavaScript versions use Times New Roman, as Java on Windows would have.

The Browser pane is no good for timing any of this. When it's hidden its page runs as a background tab, and CheerpJ all but stops.

## Files

- `TargetFinder/` is the whole `.gfar`, unpacked and unchanged: the 21 `.java` files with their compiled `.class` and `.ctxt` files, `project.greenfoot`, `README.TXT` (BlueJ's empty template), `soundindex.list` and `images/`, `.fla` sources included. The page reads its images from `TargetFinder/images/`.
- `greenfoot.js` and `rebound.js`: the port, written on 2026-10-27.
- `index.html`: the page, with the canvas, the controls and a note in Jake's voice. The game has no sound, so it leaves the site's music playing.
- `teavm.html` and `web/`, `java/`, and `compare.html`: the compiled version, the CheerpJ version and the side-by-side page (see Compared with the Coloris way).

## Verified

On 2026-10-27, in headless Chrome driven over the DevTools protocol, with the page opened from disk:
- **The first level:** aiming, shooting, bouncing and the trail; scrolling both ways mid-shot (no error); a second shot that happened to land, switching to level two with the score carried over.
- **Running out of shots:** the dim screen falls, Retry slides in, it lights up on hover, and clicking it does nothing. R restarts the level.
- **Level two:** it draws, and scrolls to show its target.
- **Touch** emulation: drag to aim, lift to shoot.
- **No console errors.**

It hasn't been checked inside the site's viewer. The dev server this was tested with served another checkout, so the test opened the file from disk instead.

## Card image

`public/images/projects/rebound.webp` shows a shot in flight. Its `SHOTS` entry in `scripts/screenshot-projects.mjs` aims and clicks with synthetic pointer events, then waits 1.2 s. The shapes falling behind the level are random, so every retake differs.

## Download

None yet. Greenfoot never exported Rebound, so there's no desktop build to offer. One could be assembled the way Coloris's was ([coloris.md](coloris.md)): the compiled classes, `project.greenfoot` and `images/` in a jar with the Greenfoot runtime, and a launcher.
