# Greenfoot games without Java

How the Greenfoot games can run as JavaScript instead of as their jars in CheerpJ. Coloris ([coloris.md](coloris.md)) and Pokémon ([greenfoot-pokemon.md](greenfoot-pokemon.md)) run this way since 2026-10-27, and Rebound has a build to compare with its hand port ([rebound.md](rebound.md)). isGuy still runs through CheerpJ ([isguy.md](isguy.md)); see Not done yet.

## Why

On 2026-10-27, after the speed fixes in [isguy.md](isguy.md#speed), Jake still found the games a bad experience. CheerpJ runs a whole Java VM in the page:
- **Loading is slow.** It loads a Java runtime from CheerpJ's servers before it even asks for the game's jar, and then the whole jar (40 MB for isGuy). The pages warn that it "can take a minute or two". In the built-in preview browser on 2026-10-27 neither isGuy nor Coloris had got past "Starting Java…" after nearly three minutes, and Coloris's jar was never requested from the server. That browser may load CheerpJ more slowly than a desktop browser would, but the earlier speed work also measured loads in minutes.
- **Painting is slow.** Greenfoot draws every actor through Java2D in software, and CheerpJ's one thread does it, so Pokémon's town (about 920 actors) runs at a third of its speed.
- **Starting takes several steps.** Play, then Greenfoot's Run, then a click on the game so the keys work. The game can't be scaled to fit a phone either, because CheerpJ doesn't map clicks through a CSS transform.

## How it works

The games use almost nothing from Java beyond Greenfoot's own API. Scanning the three jars' classes, everything else they touch is `java.lang`, `java.util` lists, `System.out`, and `java.awt.Color` and `java.awt.Font` for drawing text and filling shapes. So the game's compiled classes can be compiled again, ahead of time, into JavaScript, as long as Greenfoot itself is replaced with something that draws on a canvas. That is what greenfoot.org has done with uploaded scenarios since 2017, with the same compiler, TeaVM. Its conversion code isn't published, so this is our own.

Two other games on the site run as JavaScript by hand-translation instead: Rebound, translated class by class onto `greenfoot.js` ([rebound.md](rebound.md)), and The Floor is Lava, which isn't Greenfoot but JOGL, translated from its bytecode ([floor-is-lava.md](floor-is-lava.md)). This route needs no translating, so it scales to isGuy's 72 classes and Pokémon's 64. Rebound is built this way too (`teavm.html`), to compare with its hand port, which its card still frames; the two ran equally fast ([rebound.md](rebound.md#compared-with-the-coloris-way)).

- **[TeaVM](https://teavm.org/)** (0.12) compiles Java bytecode to JavaScript. It needs no source: it reads the `.class` files.
- **The runtime**, `demos/greenfoot/runtime/greenfoot/`, is our own Java implementation of Greenfoot's API (`World`, `Actor`, `GreenfootImage`, `Greenfoot`, `GreenfootSound`, `MouseInfo`, `Color`, `Font`), written against Greenfoot 3.0.4's classes in the jars, and checked against Greenfoot 2.1.2's in Pokémon's (the same rules, as far as the three games use them). The rules that change how a game plays were copied from that bytecode: an actor's image is centred on its cell, the bounding box uses Greenfoot's own integer arithmetic, boxes touch only when they overlap (right and bottom edges exclusive), the world acts before its actors, actors act and paint in the order they were added unless `setActOrder` or `setPaintOrder` say otherwise (unlisted classes paint below), a background smaller than the world is tiled on white, an actor without an image shows the Greenfoot logo, keys pressed during an act still count as down for that act, and the speed slider's delay is Greenfoot's formula (speed 50 is an act every 16.2 ms).
- **Collision queries by class.** Greenfoot keeps actors in a spatial tree. Here a world keeps, for each class a query asks about, the list of its actors, rebuilt after any add or remove, so a query only tests actors of that class. That's what lets Pokémon's town run at full speed: its 742 patches of grass each ask every act whether Ash is on them, and each of those questions now tests one actor instead of 924. Boxes of unturned actors are worked out in integers without allocating. It also took Coloris from 27% to 11% of the main thread.
- **The browser side**, `demos/greenfoot/host.js`, is plain JavaScript: canvases, images, keyboard and mouse, sound, and the frame loop. The Java calls it through `@JSBody` methods in `Host.java`. Images are passed around as handles (an `<img>` or a `<canvas>`), copied only when drawn on, as Greenfoot does.
- **The frame loop** acts at the game's speed on `requestAnimationFrame`: once a frame when the speed is within 10% of the display's rate (speed 50 on a 60 Hz screen), otherwise as many acts as the time allows, up to 8 a frame. It paints after any frame that acted.
- **`java.awt.Color` and `java.awt.Font`** don't exist in a browser. The build renames them to `greenfoot.Color` and `greenfoot.Font` in the game's classes (a constant-pool rewrite, nothing else changed), and those two classes carry both Greenfoot 3's API and the AWT one old scenarios used. Any other `java.awt` class stops the build with its name.
- **`System.out` is quiet.** The games' debug prints went to a Java console nobody saw; in the browser they would fill the console every act (Coloris prints Huey's color 60 times a second). `System.err` still prints.
- **`GF.dumpWorld()`**, typed in the browser's console, lists the current world's actors, one a line: class, cell, image size and rotation. It's for checking a port against the original's layout (it found Pokémon's 924 town actors).

## The build

`yarn projects:greenfoot [id…]` (`scripts/build-greenfoot.mjs`), for the games in its `GAMES` list.

1. Reads the game's jars in the applet's order, an earlier jar winning (so `game-speed.jar` and the like still apply), and takes the game's own classes: everything but `greenfoot/`, `bluej/`, `javazoom/`, `META-INF/`, and the resource folders `images/` and `sounds/` (Pokémon's jar has an old copy of the project, classes included, under `images/PokemonGameV1/`). A class file whose name can't be a Java class, like Dropbox's `BattleWorld (Lost Boy's conflicted copy 2012-05-28).class`, is skipped and named in the output.
2. Renames AWT's `Color` and `Font`, and collects every string in the classes.
3. Reads the start world (`standalone.properties`' `main.class`), the speed and the class images (`project.greenfoot`), and writes a small launcher, `GreenfootWebMain`, that starts them.
4. Compiles the runtime and the launcher with `javac`, then everything with TeaVM (`-O 2`, minified).
5. Writes `public/projects/<id>/web/`: the game as `game.<hash>.js`, `host.<hash>.js`, and every image and sound the game names, under `files/`, at the path Greenfoot would have found it (`images/` first, then as given; `../` dropped, as the jar URL did for Coloris). An image whose name TeaVM left out of the script is never loaded, so it isn't shipped (Coloris's unused 3.8 MB `RedMap.jpg`). `manifest.json` names the two scripts and maps each name the game uses to its file.

Its output is committed, like the converted PHP sites. **Needs a JDK**, found through `JAVA_HOME`, then `~/.jdks/`, then the `PATH`; on Jake's machine it's a portable Temurin 21 in `~/.jdks/`. TeaVM's jars are downloaded from Maven Central into `~/.cache/teavm/0.12.0/` the first time. A build takes about 10 seconds.

**Hashed names.** The deploy compares files by size only (CLAUDE.md, Deployment), so a rebuilt script of the same length would never be uploaded, and a browser could keep an old one. The scripts are named by content hash instead, and `manifest.json`, the one fixed name, is fetched with `cache: 'no-cache'` and uploaded on every deploy (`.github/workflows/deploy.yml`, the loop over `build/projects/*/web/manifest.json`).

## The page

Each game's `index.html` is hand-written, like the CheerpJ ones: a poster and a Play button, then the canvas.
- **Loading:** Play fetches `web/manifest.json`, loads the two scripts, and `GF.boot()` loads every image (waiting on `load`, not `decode()`, which can wait until a hidden tab is shown again), then calls TeaVM's `main()`. Sounds aren't preloaded; each streams from its own file when it first plays.
- **Running:** the game starts running at once, with no Run bar. Under it, Pause/Play and Start over (Greenfoot's Reset: a new start world). The canvas takes keyboard focus on start, so the keys work without a click.
- **Size:** the canvas is the world's size and is scaled down by CSS to fit a narrower screen; clicks are mapped back through the scale. A game whose worlds differ in size (Pokémon: an 800×600 town, a 600×400 title and battle) gets `onResize(width, height)` from the host when the world changes, and its page shows each world at its own scale, centred in the largest one's frame, as Greenfoot's viewer did.
- **Music:** the first time the game plays a sound, the page posts `jakemotta:media-playing` to the site's player, as the CheerpJ pages did on Play. A game with no sound leaves the music alone without a setting.
- **`#play`** starts it without a click, for `yarn projects:screenshot`.

## Measured

Coloris, 2026-10-27, served from `public/` by a static server on Jake's desktop:
- **Headless Chrome at 60 Hz** (`--headless=new`, walking): 59.3 acts and 58.6 frames a second, the main thread 27% busy, 22% of it in script. Through CheerpJ the earlier speed work measured 53–57 acts, 55 frames and 70–78% busy.
- **Loading:** about 2.4 MB in all (the game's script is 72 KB, the rest its images), against CheerpJ's runtime plus the 5.7 MB jar. Playable 0.3 seconds after Play in the preview browser with a warm cache, and 1.6 seconds from a cold headless start.
- **The game:** the starting view matches the CheerpJ capture pixel for pixel in layout; walking scrolls the world, the trees block Huey, the number keys change his color, Pause and Start over work, and in a same-origin frame real key presses reach the game straight after Play.

- **In the site's project viewer** (`/project/coloris` under `yarn dev`, the board behind it): 61 acts a second, with real clicks and key presses (Play, walking, the color keys). Through CheerpJ it was about 46.

Pokémon, 2026-10-27, the same way (headless Chrome, real key events):
- **The town:** 59.8–60.3 acts a second, standing or walking, the main thread 26–43% busy. In CheerpJ it ran at 18–22, the main thread always busy.
- **Loading:** 3.7 MB (94 images and the script), against CheerpJ's runtime plus the 13.6 MB jar. Ready 0.3–1.3 seconds after Play from a warm headless start, 4 seconds cold.
- **The game:** the title, the starter choice, the town (drawn sprite for sprite like the CheerpJ capture), walking and the rocks, the grass starting its Pong battle, the paddle, the ball's return to town and the stats board; see [greenfoot-pokemon.md](greenfoot-pokemon.md).

After the class index went in, Coloris measured 60.1 acts a second at 11% busy, and Rebound's build 59.9 at 9% with a mouse shot bouncing off its walls.

Not measured: Pokémon in the site's own viewer, and either game on a real phone.

## Not done yet

- **isGuy.** It needs what Coloris and Pokémon didn't: sound (its six songs and its effects; Pokémon turned out to play none), mouse menus, and checking its turned actors' collisions. It's a `GAMES` entry, a page like the others, and checking every level against the CheerpJ version. Jake said "not now" on 2026-10-27, after asking for Pokémon first.
- **Touch controls.** The games still need a keyboard. On-screen arrows that set the same keys would make them playable on a phone.
- **What's left of CheerpJ.** Coloris and Pokémon keep their CheerpJ pages as `cheerpj.html`, unlinked, for comparison. Once isGuy has moved too, the CheerpJ license note in [README.md](README.md) and CLAUDE.md can go, and so can `browser-timer.jar` and the other CheerpJ-only fix jars (they'd stay in the repo as part of the record).

## Left out on purpose

- **Greenfoot's control bar** (Act, Run, Reset, the speed slider): the page's own two buttons replace it. The speed is the one the game was saved at.
- **`Greenfoot.ask`, the microphone and `UserInfo`** are stubs; none of the games use them.
- **Rotated collisions** use the actors' rotated rectangles (separating axes), close to Greenfoot's own corner test but not copied from it. Coloris never turns an actor; isGuy does, so check its collisions when it moves over.
