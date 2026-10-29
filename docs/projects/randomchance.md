# RandomChance

A Greenfoot (Java) survival game from 2012 that plays itself. A green hero wanders an 800×600 arena while red villains come out of the portals on either side, one a second, and every fight is settled by a roll of the dice. Nobody steers: the scenario has no controls at all. There's no sound. The folder is `public/projects/randomchance/`; the card id is `randomchance`, after the scenario's own name.

Jake approved it on 2026-10-29, from his old Dropbox on the NAS.

## Where it came from

`Z:\Old Computer\Documents\Random\OldDropBox\Greenfoot\RandomChanceGood\` holds the only copies on the NAS. A search of `Z:\Old Computer\Documents`, `Z:\Old Projects` and `Z:\Google Drive` found no other.
- **`RandomChance/`** is the one used. Its `.java` files were last edited between August and 2012-09-22; the classes and `project.greenfoot` were saved again by Greenfoot 2.2.1 on 2013-04-24, with no source changes. The card says 2012.
- **`Mess/`** beside it is the same scenario: its classes, sources and images are byte for byte the same, and its `project.greenfoot` differs only in the size of an editor window. It isn't copied.
- **`RandomChance/WorkingCopies/BasicWorking/`** is an earlier copy from 2012-09-22, before blood, invincibility and the empty power-up classes were added. It comes along with the folder, unchanged.

The `README.TXT` is Greenfoot's blank template, so the game has no title screen, credits or instructions of its own.

## How it plays

From the classes, as they are:
- **The hero** (`Hero`) starts at (200, 400) with 100 life. He moves a pixel an act, turns 10° one way or the other every ten acts, and turns around after 50 acts against an edge.
- **Villains** (`Villain`) appear every 100 acts at a random height, from the left or right portal (`PL`, `PR`, five-frame animations), and wander the same way. They never leave, so they pile up: about 55 after two minutes.
- **A fight:** while a villain touches him, the hero stands still, and every 30 acts it's a roll. 85% of the time the villain dies: a blood splat (`Blood`) fades out over 200 acts, the kill count goes up, and 5% of kills make him invincible for 2,000 acts (about 20 seconds), flashing through the six `Invinse` frames. Otherwise he loses 0 to 29 life, unless he's invincible.
- **Never used:** `Nuke`, `Bullet`, `Health` and `Invinsibility` are empty classes with an image each, and nothing ever adds them. `Hero.checkHealth` would heal him on touching a `Health`, but there never is one. The page's note says Jake drew them and never wired them in.
- **Speed:** the scenario was saved at speed 54, an act every 9.7 ms, so it runs at about 103 acts a second, as it did in Greenfoot.

The game's debug prints (the hero's state, every act) go nowhere, as for every compiled game.

### How it ends: game over

When his life reaches 0, the hero is gone and the game stops with "Game over" in the middle of the arena. Start over begins a new game. That ending is the one fix made to the game (Fixes, below); until 2026-10-29 it ended in a crash.

## How it runs

The way Coloris and NinjaDonut: The Game run ([greenfoot-web.md](greenfoot-web.md)): the game's own compiled classes, compiled to JavaScript with TeaVM against the site's Greenfoot runtime. Nothing in the runtime was changed for it; one class of the game was fixed, in `fixes.jar` (Fixes, below).

- **`RandomChance/`** is the scenario folder, copied unchanged: `.java`, `.class` and `.ctxt` files, `project.greenfoot`, `README.TXT`, `images/` (Fireworks `.fw.png` files beside the GIFs), an empty `sounds/`, the Javadoc Greenfoot made for `Hero` in `doc/`, and `WorkingCopies/`. Nothing in it holds a password or key; `doc/logfile.txt` names the paths of Jake's old `E:` drive.
- **`randomchance.jar`** (new, 2026-10-29) was packed by `yarn projects:greenfoot-pack public/projects/randomchance/RandomChance public/projects/randomchance/randomchance.jar RandomChance`: the 11 classes, `project.greenfoot`, the images, Coloris's Greenfoot 3.0.4 runtime, and `standalone.properties` starting `SurvivalWorld`. The build only reads the game's part.
- **`fixes.jar`** (3 KB, 2026-10-29) holds the fixed `Hero` class; see Fixes. The build reads it ahead of `randomchance.jar`, so its class wins.
- **`web/`** is `yarn projects:greenfoot randomchance`'s output, its `GAMES` entry reading `fixes.jar` and then `randomchance.jar` (`SurvivalWorld at speed 54, 31 images, 0 sounds`): a 190 KB game script, the shared host and the 30 images the game names, plus the Greenfoot logo. It's committed; don't edit it by hand.
- **`index.html`** is NinjaDonut: The Game's page with this game's name, size (800×600, scaled down to fit), note and hint swapped in. Its Controls list says there are none.
- **`poster.webp`** is the starting view (the hero, the portals, Life 100 and Kills 0), cut from a screenshot of the running game.

## Verified

On 2026-10-29, in headless Chrome, first with the worktree's `public/` served as plain files, then again under the worktree's muted `yarn dev`:
- **`yarn projects:greenfoot-check randomchance`:** ready 0.2–0.5 s after Play, 103 acts and 60 frames a second, the main thread 7–8% busy, no sounds, no errors.
- **Watched for two minutes:** villains arrive about once a second, fights end in blood splats and kills, and Life and Kills count on the board (Life 6, Kills 51 just before the end). The hero then died and the game stopped with the error that the fix below took away.
- **The buttons:** Pause stops it (the hero stays put), Start over builds a fresh world (the hero back at (200, 400), no villains) and stays paused, and Play carries on. The canvas keeps the focus.

Not checked: the site's own viewer (`/project/randomchance`), a real phone, and invincibility on screen (it's random, 1 kill in 20).

## Fixes

On 2026-10-29 Jake asked for the game's crash at the hero's death to be fixed. It's a bug in the 2012 code, and Greenfoot plays it the same way, so this is the one place the game itself was changed. `RandomChance/` and `randomchance.jar` are untouched.

- **What was wrong:** when his life reached 0, `Hero.damageHero` took him out of the world, but the rest of his `act` still ran, and `checkHealth` asked which objects were touching him. Greenfoot throws `IllegalStateException: Actor not in world` there (checked in Greenfoot 2.1.2's `Actor` bytecode, which already had the check) and stops. The page showed its "The game stopped." box over the canvas with that message and "Try reloading the page", and the console logged the error twice. His Life could also read below 0 for the act before.
- **The fix:** `act` returns once he's out of the world. When he dies, his Life reads 0, a "Game over" text (the game's own `GameText`) goes in the middle of the arena, painted above everything else, and `Greenfoot.stop()` stops the game, as Greenfoot's Pause would, so the page's button turns to Play. Start over begins a new game; Play carries on without him, the villains still pouring in.
- **Where:** the fixed copy is `demos/greenfoot/fixes/randomchance/Hero.java`, each change marked `FIXED:`, compiled into `fixes.jar` as [greenfoot-web.md](greenfoot-web.md#fixing-a-games-own-bugs) describes.
- **Checked:** with `yarn projects:greenfoot-check randomchance --wait 300000` against a plain-file server of the worktree's `public/`, twice: the hero died after about one and two minutes (31 and 76 kills), "Game over" showed above the villains with Life 0, the game stopped, and there were no errors.

## Card image

`public/images/projects/randomchance.webp` is just the game, clipped to the canvas twelve seconds after `#play`, when about a dozen villains are out. The world is already 4:3, so the whole of it shows. Every retake differs.

## Download

None. Greenfoot never exported it (the archive has no jar), and `randomchance.jar` hasn't been tried with `java -jar`, the same as Rebound and NinjaDonut: The Game.
