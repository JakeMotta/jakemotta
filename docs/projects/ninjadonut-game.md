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
- **`web/`** is `yarn projects:greenfoot ninjadonut-game`'s output, its `GAMES` entry reading `ninjadonut.jar`: a game script, the shared host and the 66 images the game names. It's committed; don't edit it by hand.
- **`index.html`** is Coloris's page with this game's name, size (960×400, scaled down to fit), controls and note swapped in.
- **`poster.webp`** is the starting view, cut from a screenshot of the running game.

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
