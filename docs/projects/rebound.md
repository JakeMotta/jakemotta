# Rebound

A bounce-shot game Jake made in Greenfoot (Java) in April 2013. Aim with the mouse, click, and the ball flies off at a power set by how far away the mouse is, bouncing off the walls and slowing down; get it into the target within the level's shots. The scenario folder is called `TargetFinder`, and its unused title world says "Rebound", which is what Jake called the archive. It was saved in Greenfoot 2.2.1 on 2013-04-30 (`project.greenfoot`). The folder is `public/projects/rebound/`; the card id is `rebound`.

Jake sent it on 2026-10-27 as `Rebound.gfar` (174 KB, 84 files) and asked for it as an HTML5 game.

## How it runs

Unlike isGuy and Pokémon, which run their jars through CheerpJ ([isguy.md](isguy.md)), and Coloris, whose own compiled classes run as JavaScript ([greenfoot-web.md](greenfoot-web.md)), Rebound is a port: `greenfoot.js` is the part of Greenfoot 2.2.1 the game uses, written for a canvas, and `rebound.js` is the game's Java translated into JavaScript class by class. The page loads in a moment, scales to any width, and takes touch.

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

## Files

- `TargetFinder/` is the whole `.gfar`, unpacked and unchanged: the 21 `.java` files with their compiled `.class` and `.ctxt` files, `project.greenfoot`, `README.TXT` (BlueJ's empty template), `soundindex.list` and `images/`, `.fla` sources included. The page reads its images from `TargetFinder/images/`.
- `greenfoot.js` and `rebound.js`: the port, written on 2026-10-27.
- `index.html`: the page, with the canvas, the controls and a note in Jake's voice. The game has no sound, so it leaves the site's music playing.

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
