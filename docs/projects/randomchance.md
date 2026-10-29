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

### How it ends: the game's own crash

When his life reaches 0, `Hero.damageHero` removes him from the world, but the rest of his `act` still runs, and `checkHealth` asks for touching objects while he's out of the world. Greenfoot throws `IllegalStateException: Actor not in world` there (checked in Greenfoot 2.1.2's `Actor` bytecode, which already had the check), stops the run and prints it in its terminal window. The compiled game does the same. The page shows its "The game stopped." box over the canvas with that message and the hint "Try reloading the page", and the browser console logs the error twice.

That's the only end the game has, and it's the game's own bug, so it's left as Greenfoot played it. In headless Chrome the hero died after about two minutes, with over 50 kills. If Jake wants a proper ending, the fix would be a marked copy of `Hero.java` in `demos/greenfoot/fixes/randomchance/` that stops acting once he's removed ([greenfoot-web.md](greenfoot-web.md#fixing-a-games-own-bugs)), and perhaps a game-over message; nothing like that has been made.

Smaller quirks, also left alone: `Villain.act` tests `if (outOfSpawn = false)` and `if (outOfSpawn = true)` (assignments), so villains skip their walk out of the portal and wander from the first act; the villains at the right portal are added at x = 800 and land on 799, the world's edge.

## How it runs

The way Coloris and NinjaDonut: The Game run ([greenfoot-web.md](greenfoot-web.md)): the game's own compiled classes, unchanged, compiled to JavaScript with TeaVM against the site's Greenfoot runtime. Nothing in the game or the runtime was changed for it.

- **`RandomChance/`** is the scenario folder, copied unchanged: `.java`, `.class` and `.ctxt` files, `project.greenfoot`, `README.TXT`, `images/` (Fireworks `.fw.png` files beside the GIFs), an empty `sounds/`, the Javadoc Greenfoot made for `Hero` in `doc/`, and `WorkingCopies/`. Nothing in it holds a password or key; `doc/logfile.txt` names the paths of Jake's old `E:` drive.
- **`randomchance.jar`** (new, 2026-10-29) was packed by `yarn projects:greenfoot-pack public/projects/randomchance/RandomChance public/projects/randomchance/randomchance.jar RandomChance`: the 11 classes, `project.greenfoot`, the images, Coloris's Greenfoot 3.0.4 runtime, and `standalone.properties` starting `SurvivalWorld`. The build only reads the game's part.
- **`web/`** is `yarn projects:greenfoot randomchance`'s output (`SurvivalWorld at speed 54, 31 images, 0 sounds`): a 190 KB game script, the shared host and the 30 images the game names, plus the Greenfoot logo. It's committed; don't edit it by hand.
- **`index.html`** is NinjaDonut: The Game's page with this game's name, size (800×600, scaled down to fit), note and hint swapped in. Its Controls list says there are none.
- **`poster.webp`** is the starting view (the hero, the portals, Life 100 and Kills 0), cut from a screenshot of the running game.

## Verified

On 2026-10-29, in headless Chrome, first with the worktree's `public/` served as plain files, then again under the worktree's muted `yarn dev`:
- **`yarn projects:greenfoot-check randomchance`:** ready 0.2–0.5 s after Play, 103 acts and 60 frames a second, the main thread 7–8% busy, no sounds, no errors.
- **Watched for two minutes:** villains arrive about once a second, fights end in blood splats and kills, and Life and Kills count on the board (Life 6, Kills 51 just before the end). The hero then died and the game stopped with the error above.
- **The buttons:** Pause stops it (the hero stays put), Start over builds a fresh world (the hero back at (200, 400), no villains) and stays paused, and Play carries on. The canvas keeps the focus.

Not checked: the site's own viewer (`/project/randomchance`), a real phone, and invincibility on screen (it's random, 1 kill in 20).

## Card image

`public/images/projects/randomchance.webp` is just the game, clipped to the canvas twelve seconds after `#play`, when about a dozen villains are out. The world is already 4:3, so the whole of it shows. Every retake differs.

## Download

None. Greenfoot never exported it (the archive has no jar), and `randomchance.jar` hasn't been tried with `java -jar`, the same as Rebound and NinjaDonut: The Game.
