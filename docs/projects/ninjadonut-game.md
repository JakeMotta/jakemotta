# NinjaDonut: The Game

A Greenfoot (Java) game starring the very serious donut from NinjaDonut ([ninjadonut.md](ninjadonut.md)). He stands in a scrolling grey city while enemy donuts run in from either side, one every one to six seconds, with no end (`levelOne` allows 32,000 of them). Ninja stars and the sword kill them for points, and Down turns him invisible. There's no sound. The folder is `public/projects/ninjadonut-game/`; the card id is `ninjadonut-game`.

The scenario's README names it "NinjaDonut: The Game", by Jacob Motta, V1, with the controls the page lists. Jake sent it on 2026-10-27 as `Ninja Donut.gfar` (412 KB, 129 files). The scenario folder inside is called `Ninjai`. Its `project.greenfoot` was last saved on 2018-11-29, and the archive also holds a Dropbox "conflicted copy" of it dated 2014-08-23, so the game is from 2014 at the latest. The card says 2014. Its classes are Java 8, compiled against Greenfoot 3.0.4's `java.awt.Color` and `Font`.

## How it runs

The way Coloris runs ([greenfoot-web.md](greenfoot-web.md)): the game's own compiled classes, unchanged, compiled to JavaScript with TeaVM against the site's Greenfoot runtime. Nothing in the game was changed, for phones or anything else.

- **`Ninjai/`** is the whole `.gfar`, unpacked and unchanged: the `.java`, `.class` and `.ctxt` files, both `project.greenfoot` files, the `README.TXT`, `images/` (and a stray `cityBackground2.htm` saved beside its image), and an `enemyRun.fw.png` outside `images/`.
- **`ninjadonut.jar`** (606 KB) is new, made on 2026-10-27, because the build reads jars. It was assembled like `rebound.jar` ([rebound.md](rebound.md#compared-with-the-coloris-way)), first with a one-off Python script; `yarn projects:greenfoot-pack public/projects/ninjadonut-game/Ninjai public/projects/ninjadonut-game/ninjadonut.jar NinjaDonut` now packs the same contents ([greenfoot-web.md](greenfoot-web.md#converting-a-game)). In it:
  - `Ninjai/`'s classes, `project.greenfoot` and the images in `images/`;
  - `coloris.jar`'s Greenfoot 3.0.4 runtime and manifest;
  - its `standalone.properties`, with `main.class=levelOne` and `project.name=NinjaDonut`.

  The build only reads the game's part. The rest would make `java -jar ninjadonut.jar` run it on a desktop, which hasn't been tried.
- **`fixes.jar`** (12 KB, 2026-10-28) holds four of the game's classes, fixed: see Fixes below. The build reads it ahead of `ninjadonut.jar`, so its classes win.
- **`web/`** is `yarn projects:greenfoot ninjadonut-game`'s output, its `GAMES` entry reading `fixes.jar` and then `ninjadonut.jar`: a game script, the shared host and the 66 images the game names. It's committed; don't edit it by hand.
- **`index.html`** is Coloris's page with this game's name, size (960×400, scaled down to fit), controls and note swapped in.
- **`poster.webp`** is the starting view, cut from a screenshot of the running game.

## Fixes

On 2026-10-28 Jake asked for three things to be fixed:
- the enemies landing at the wrong height;
- the headband and sword slipping during a jump;
- enemies getting stuck.

All three are bugs in the 2014 code; Greenfoot plays them the same way. So these are the one place the game itself was changed. `Ninjai/` and `ninjadonut.jar` are untouched.

The fixed copies are in `demos/greenfoot/fixes/ninjadonut-game/` (`Enemy.java`, `Ninja.java`, `Sword.java`, `tie.java`), each change marked `FIXED:`. They're compiled into `fixes.jar` as [greenfoot-web.md](greenfoot-web.md#fixing-a-games-own-bugs) describes.

- **The floor.**
  - **What was wrong:** the ninja and the enemies stop falling once they're at or below y = 362. How far past it they end up depends on how fast they were falling, so enemies stood anywhere from y = 362 to 368, up to 6 pixels off the ninja's floor. The ninja himself dipped a few pixels below the floor for one act on each landing.
  - **The fix:** both now land on a set floor line, with their feet on the world's bottom row: the ninja at y = 365 (his frames are 70 pixels tall), an enemy at 367 (66 pixels). The ninja lands in the same act his fall reaches it.
- **The headband and sword in a jump.**
  - **What was wrong:** the world passes the ninja's position to the headband (`tie`) and the sword (`Sword`) at the start of each act. That position is the one the ninja recorded before he moved, in the act before. So the two trailed him by two acts. That's up to 24 pixels while jumping, and 3 pixels while walking.
  - **The fix:** each now reads the ninja's position directly when it acts, which is after he has moved. Measured through a whole jump, the headband stays at (−35, −22) from him and the sword at (0, 0) on every frame.
- **Stuck enemies.** Three things in `Enemy.checkNinja`:
  - **Only within 500 pixels:** an enemy only chased the ninja inside that range, so one that landed further away (when he walked off while it fell) never moved.
  - **Always the middle of the screen:** it chased its own `ninjaX`, which was always 480. `levelOne` passes the ninja's position to a spare `Enemy` it makes and never adds, not to the one it adds. 480 is where the scrolling keeps him, except near the ends of the level, where he walks off the middle and every enemy waited in the middle instead.
  - **Inside him:** one that reached him stopped inside him, frozen mid-stride.

  **The fix:** enemies now chase the ninja's real position from anywhere. Within 60 pixels, about where the two donuts touch, they stop and face him in `enemyStand.png`, a frame the game had but never used. There they're in reach of the sword. Checked by walking him to the left end of the level: the enemies gathered on both sides of him, all on the floor.

Nothing else changed: enemies still spin in from either side, throw stars every 150 acts, and die the same ways.

## Verified

On 2026-10-27, in headless Chrome against `yarn dev`, and in the site's project viewer:
- **Playable:** 0.2–0.3 s after Play.
- **Speed:** 60 acts and 60 frames a second, the main thread 4% busy.
- **Play:** walking scrolls the city. Up jumps, X throws a star and Z swings the sword. Enemy donuts arrive within a few seconds, die to stars and the sword, and leave blood, and the score counts up (250 in one run).
- **No console errors.**

Not played through to see whether the ninja can die, or how.

## Card image

`public/images/projects/ninjadonut-game.webp` is just the game, ten seconds after `#play`: the middle 4:3 of the 960×400 canvas, with the ninja in the centre and, with luck, an enemy beside him. Enemies arrive at random, so every retake differs; retake it if none made it into the shot.

## Download

None. Greenfoot never exported it, and `ninjadonut.jar` hasn't been tried on a desktop.
