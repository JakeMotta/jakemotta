# Greenfoot games without Java

How the Greenfoot games can run as JavaScript instead of as their jars in CheerpJ. Since 2026-10-27 five games run this way, and a sixth since 2026-10-29:
- Coloris ([coloris.md](coloris.md));
- isGuy ([isguy.md](isguy.md));
- Pokémon: Green Foot Edition ([greenfoot-pokemon.md](greenfoot-pokemon.md));
- Rebound ([rebound.md](rebound.md));
- NinjaDonut: The Game ([ninjadonut-game.md](ninjadonut-game.md));
- RandomChance ([randomchance.md](randomchance.md)), 2026-10-29.

Jake chose this route after comparing it with a hand port and with CheerpJ on Rebound. That leaves no game on CheerpJ: the earlier pages stay, unlinked, as `cheerpj.html` beside Coloris, isGuy and Pokémon.

## Why

On 2026-10-27, after the speed fixes in [isguy.md](isguy.md#speed), Jake still found the games a bad experience. CheerpJ runs a whole Java VM in the page:
- **Loading is slow.** It loads a Java runtime from CheerpJ's servers before it even asks for the game's jar, and then the whole jar (40 MB for isGuy). The pages warn that it "can take a minute or two". In the built-in preview browser on 2026-10-27 neither isGuy nor Coloris had got past "Starting Java…" after nearly three minutes, and Coloris's jar was never requested from the server. That browser may load CheerpJ more slowly than a desktop browser would, but the earlier speed work also measured loads in minutes.
- **Painting is slow.** Greenfoot draws every actor through Java2D in software, and CheerpJ's one thread does it, so Pokémon's town (about 920 actors) runs at a third of its speed.
- **Starting takes several steps.** Play, then Greenfoot's Run, then a click on the game so the keys work. The game can't be scaled to fit a phone either, because CheerpJ doesn't map clicks through a CSS transform.

## How it works

The games use almost nothing from Java beyond Greenfoot's own API. Scanning the three jars' classes, everything else they touch is `java.lang`, `java.util` lists, `System.out`, and `java.awt.Color` and `java.awt.Font` for drawing text and filling shapes. So the game's compiled classes can be compiled again, ahead of time, into JavaScript, as long as Greenfoot itself is replaced with something that draws on a canvas. That is what greenfoot.org has done with uploaded scenarios since 2017, with the same compiler, TeaVM. Its conversion code isn't published, so this is our own.

The Floor is Lava runs as JavaScript by hand-translation instead: it isn't Greenfoot but JOGL, translated from its bytecode ([floor-is-lava.md](floor-is-lava.md)). Rebound was hand-translated first too, onto `greenfoot.js`; on 2026-10-27 it was built this way as well, ran just as fast, and Jake picked this version for its card, keeping the hand port as `port.html` ([rebound.md](rebound.md#compared-with-the-coloris-way)). This route needs no translating, so it scales to isGuy's 72 classes and Pokémon's 64.

- **[TeaVM](https://teavm.org/)** (0.12) compiles Java bytecode to JavaScript. It needs no source: it reads the `.class` files.
- **The runtime**, `demos/greenfoot/runtime/greenfoot/`, is our own Java implementation of Greenfoot's API (`World`, `Actor`, `GreenfootImage`, `Greenfoot`, `GreenfootSound`, `MouseInfo`, `Color`, `Font`), written against Greenfoot 3.0.4's classes in the jars, and checked against Greenfoot 2.1.2's in Pokémon's (the same rules, as far as the three games use them). The rules that change how a game plays were copied from that bytecode: an actor's image is centred on its cell, the bounding box uses Greenfoot's own integer arithmetic, boxes touch only when they overlap (right and bottom edges exclusive), the world acts before its actors, actors act and paint in the order they were added unless `setActOrder` or `setPaintOrder` say otherwise (unlisted classes paint below), a background smaller than the world is tiled on white, an actor without an image shows the Greenfoot logo, keys pressed during an act still count as down for that act, and the speed slider's delay is Greenfoot's formula (speed 50 is an act every 16.2 ms).
- **Collision queries by class.** Greenfoot keeps actors in a spatial tree. Here a world keeps, for each class a query asks about, the list of its actors, rebuilt after any add or remove, so a query only tests actors of that class. That's what lets Pokémon's town run at full speed: its 742 patches of grass each ask every act whether Ash is on them, and each of those questions now tests one actor instead of 924. Boxes of unturned actors are worked out in integers without allocating. It also took Coloris from 27% to 11% of the main thread.
- **The browser side**, `demos/greenfoot/host.js`, is plain JavaScript: canvases, images, keyboard and mouse, sound, and the frame loop. The Java calls it through `@JSBody` methods in `Host.java`. Images are passed around as handles (an `<img>` or a `<canvas>`), copied only when drawn on, as Greenfoot does.
- **A start world that switches away:** if the start world's constructor calls `Greenfoot.setWorld`, the game starts on that world, on Reset too, as in Greenfoot 3. isGuy's `worldOne` opens its title screen this way; until 2026-10-27 the runtime replaced it with `worldOne` once the constructor returned. Rebuilding Coloris with the change gave it new script names and nothing else.
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
- **Sound follows the buttons, as in Greenfoot** (`host.js`, since 2026-10-28):
  - **Start over** stops every sound before the start world is built again. Before that, the old world's music kept playing under the new world's, so isGuy's songs doubled up on every Start over.
  - **Pause** pauses whatever is playing, and **Play** picks it up again.
  - A game's own `stop()` or `pause()` takes a sound out of that list.
- **Half volume:** every game plays at half the volume it sets, as Jake asked on 2026-10-28. `VOLUME` in `host.js` multiplies each sound's own volume, so isGuy's music, which the game sets to 50, plays at 25%. Asteroids, the one other game with sound, does the same through a gain node ([asteroids.md](asteroids.md)).
- **`#play`** starts it without a click, for `yarn projects:screenshot`.

## Fixing a game's own bugs

Fix a bug that Greenfoot plays the same way only when Jake asks for it, as he did for NinjaDonut's on 2026-10-28 ([ninjadonut-game.md](ninjadonut-game.md#fixes)) and RandomChance's on 2026-10-29 ([randomchance.md](randomchance.md#fixes)). The original files and jar stay as they are. Instead:

1. **Copy** each class's `.java` into `demos/greenfoot/fixes/<id>/`, unchanged.
2. **Edit the copy.** Start the file with a line saying it's a fixed copy, and mark every change with a `FIXED:` comment that says what was wrong.
3. **Compile and pack** the copies against the game's jar, with the JDK in `~/.jdks/` (Java 8 classes, as the games are):
   ```bash
   javac --release 8 -encoding UTF-8 -cp public/projects/<id>/<game>.jar -d <empty folder> demos/greenfoot/fixes/<id>/*.java
   jar --create --no-manifest --date=1980-01-01T00:00:02Z --file public/projects/<id>/fixes.jar -C <that folder> .
   ```
4. **Build:** list `fixes.jar` first in the game's `GAMES` entry, since an earlier jar wins. Then run `yarn projects:greenfoot <id>` and check the game (step 5 below).
5. **Document it:** each change and why, on the game's page.

If the game has no `.java` source, a fix jar can still replace a class's bytecode, as Pokémon's `closed-sign.jar` does, but write down exactly what was changed.

## Converting a game

The steps that took isGuy, Rebound and NinjaDonut: The Game from their jars and `.gfar` archives to the site on 2026-10-27. They work for any Greenfoot game whose code uses only Greenfoot's API and Java basics. Do it in a worktree of your own (CLAUDE.md, Branches and staging), with `yarn dev` running from that worktree.

**1. Get the game's jar.**
- **An exported jar** (Greenfoot's "Share → Application" before 3.8.2, or an applet export) is used as it is: copy it unchanged into `public/projects/<id>/`.
- **A `.gfar`** (Greenfoot's archive, a zip) or a scenario folder:
  1. Unpack it unchanged into `public/projects/<id>/<the scenario's folder name>/`, as the archive, like `ninjadonut-game/Ninjai/`. In PowerShell, `tar -xf "Ninja Donut.gfar" -C public/projects/ninjadonut-game` unpacks it: Windows' own `tar.exe` reads zips, and Git Bash's `tar` doesn't.
  2. Pack a jar from it: `yarn projects:greenfoot-pack public/projects/<id>/<folder> public/projects/<id>/<name>.jar <Project name>`.

  The packer (`scripts/pack-greenfoot.mjs`) takes the folder's compiled classes, `project.greenfoot`, `images/` and `sounds/`. It starts the game on `world.lastInstantiated`, the world Greenfoot opened it on, and adds the Greenfoot 3.0.4 runtime from `coloris.jar`. Packing the same folder again gives the same jar; it reproduces `ninjadonut.jar` and `rebound/java/rebound.jar` exactly.
- **Check:** the scenario must have its `.class` files. The packer stops if it has none, or none for the start world. A scenario saved without them needs compiling in Greenfoot first; nothing here compiles Java source.
- **Check the start world:** read the summary line. If it isn't the world the game should open on, set it in the jar's `standalone.properties`. A world that switches to a title screen from its constructor is fine (isGuy's `worldOne`): the runtime follows the switch (see How it works).

**2. Build it.** Add `{ id: '<id>', jars: ['<name>.jar'] }` to `GAMES` in `scripts/build-greenfoot.mjs`. List any small fix jars first: earlier jars win, as Coloris's `game-speed.jar` does. Leave out CheerpJ-only fixes like `browser-timer.jar`. Then run `yarn projects:greenfoot <id>`.
- **Check:** read its summary line, `<id>: <start world> at speed <n>, <n> images, <n> sounds`. The speed should be what the game was saved at, usually 50.
- **If it stops on a `java.awt` class** other than `Color` and `Font`, or a Greenfoot call the runtime doesn't have, teach the runtime in `demos/greenfoot/runtime/greenfoot/`. Never change the game's classes to make it build.
- **A bug that's the game's own**, one Greenfoot plays the same way, is fixed only when Jake asks, and never in the original: see Fixing a game's own bugs below. Then rebuild every game in `GAMES` (`yarn projects:greenfoot` with no id), since they share the runtime, and smoke-test them all (step 5).
- **Commit** the jar and `web/`. Don't edit `web/` by hand.

**3. Write the page.**
- **Copy:** start from a compiled game's `index.html` (`coloris/index.html`), not a CheerpJ one. If the game had a CheerpJ page, `git mv` it to `cheerpj.html` first and keep it.
- **What to change:**
  - the comment at the top, `<title>`, `<h1>` and the meta line (kind of game · year · "no sound" or "sound on");
  - the world's size in four places: `main`'s width, the comment above `.frame`, `.frame`'s `aspect-ratio`, and `canvas.width` / `canvas.height`;
  - the poster's `src`;
  - the hint and `READY_HINT`;
  - the controls (`<dl>`), the note, the canvas's `aria-label`, and the comment about sound.
- **The world's size** is in the start world's `super(width, height, cellSize…)` (in the `.java` if there is one). For an exported jar, the applet size less Greenfoot's frame gives it: 16 px of border across and 69 px of border and control bar down, so isGuy's 816×669 applet is 800×600.
- **The note** is in Jake's voice and says what the game is, never how the page works (CLAUDE.md, Style). The last line says it's his original code and that a phone needs a keyboard (or a mouse). **Don't add touch controls or change the game for phones**, as Jake decided on 2026-10-27.
- **`poster.webp`** is the game's starting view at the world's size, shown behind Play: screenshot the running game (`#play`) and crop the canvas. A CheerpJ capture works as well, as Rebound's does.

**4. Add it to the site.**
- **The card:** an entry in `homeProjectList` (`category: 'game'`, `tags: ['Java Game']`, and the year the game was made, not when it was last saved). Then a page in `docs/projects/<id>.md` and a row in [README.md](README.md)'s table; [ninjadonut-game.md](ninjadonut-game.md) is the model.
- **The card image** is just the game (README.md, Card images): add `{ id, url: '/projects/<id>/index.html#play', settle, clip: { selector: '#frame canvas' } }` to `SHOTS`, run `BASE_URL=http://localhost:<port> yarn projects:screenshot <id>` and look at the image.
  - Wait long enough for something to be happening (Ninja Donut's enemies need 10 s).
  - Use `focus` to pick which part of a wide world the 4:3 crop shows.
  - A shot that clicks with synthetic pointer events must stub out the canvas's `setPointerCapture` first (Rebound's entry).
- **A desktop download** only if the jar has actually been run with `java -jar` (README.md, Downloads).

**5. Check it.** `BASE_URL=http://localhost:<port> yarn projects:greenfoot-check <id> --keys ArrowRight:1500,Space:100` (`scripts/check-greenfoot.mjs`). It opens the page in headless Chrome, presses Play with a real click, holds the keys given, and reports:
- seconds until the game was ready;
- acts and frames a second, and how busy the main thread was;
- the sounds it played, and any errors;
- a screenshot.

A healthy game is ready within about a second, at about 60 acts and 60 frames a second, with the main thread well under half busy and no errors. On top of that:
- **Play it by hand** in a real browser, through every screen it has: the title, each level, the menus and the end screens.
- **Compare with the CheerpJ version** if there is one (`cheerpj.html`).
- **Open `/project/<id>`** and press Play inside the site's viewer.

**Things learned the hard way:**
- **Measure in a foreground tab.** The built-in browser pane runs its page as a background tab when the pane is hidden, which throttles timers: CheerpJ all but stops there, and any timing taken there is wrong.
- **Don't measure by reading the canvas.** Reading pixels back every frame (`getImageData`, or `drawImage` from the game's canvas) stalls the page being measured. Counting acts costs nothing: the check script counts calls to `GF.clearLatchedKeys`, which the runtime makes once after every act. Until 2026-10-29 it counted `isKeyDown` checks instead, which read nothing for a screen that checks no keys (isGuy's title) or a game with no controls (RandomChance).
- **Sound needs a real click.** Browsers only let sound start after the visitor's own gesture, so `#play` (no click) can't show whether a game's sounds work. The check script clicks Play for that reason.
- **The preview tool's dev server may serve the main checkout.** Under `yarn dev` from another folder, a page that only exists in the worktree answers with the site's own app. Start `yarn dev` in the worktree yourself, on a free `PORT` (with `REACT_APP_MUTE_AUDIO=1`, as Claude's previews are muted), and point `BASE_URL` at it.
- **The deploy compares files by size only.** The build's hashed names and `manifest.json`'s unconditional upload handle `web/`. A rebuilt jar or download of the same name and length would never reach the server: give it a new name.

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

- **isGuy's other levels.** It moved on 2026-10-27 with level 1, its title screen and its sounds checked; the other four levels and the menus haven't been compared with `cheerpj.html` yet ([isguy.md](isguy.md)).
- **Touch controls.** The games still need a keyboard. On-screen arrows that set the same keys would make them playable on a phone.
- **What's left of CheerpJ.** Coloris, isGuy and Pokémon keep their CheerpJ pages as `cheerpj.html`, unlinked, for comparison, so the CheerpJ license note in [README.md](README.md) and CLAUDE.md stays while they're published. If Jake drops them, the note can go, and so can `browser-timer.jar` and the other CheerpJ-only fix jars from the build's point of view (they'd stay in the repo as part of the record).

## Left out on purpose

- **Greenfoot's control bar** (Act, Run, Reset, the speed slider): the page's own two buttons replace it. The speed is the one the game was saved at.
- **`Greenfoot.ask`, the microphone and `UserInfo`** are stubs; none of the games use them.
- **Rotated collisions** use the actors' rotated rectangles (separating axes), close to Greenfoot's own corner test but not copied from it. Coloris never turns an actor. Pokémon's turned actors are the Pong game's: the paddle and Imgur at 180° (a plain box) and the ball at any angle, whose bounces off the paddle worked. isGuy turns actors too, and its other levels are still to be compared.
