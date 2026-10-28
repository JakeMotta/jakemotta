# Pokémon: Green Foot Edition

A Pokémon fan game Jake made with his classmate Logan Lovell in May 2012, in Greenfoot (Java), as the final project for their computer programming class. The title screen reads "Created By: Jacob Motta & Logan Lovell", and the page credits both. Its README says they "went way overboard on this project compared to the rest of the class", and that the sprites came from Google, with some made in Fireworks. The folder is `public/projects/greenfoot-pokemon/`; the card id is `greenfoot-pokemon`.

**Nintendo's art.** The sprites, the logo and the starters are Nintendo and Game Freak's. Jake decided on 2026-10-26 to publish it anyway. The page says it's a fan game and whose the characters are.

## Preview

**Since 2026-10-27, `index.html` runs the game as JavaScript**, the second Greenfoot game to move off CheerpJ, after Coloris. `yarn projects:greenfoot greenfoot-pokemon` reads `start-at-title.jar`, `closed-sign.jar` and `V10.jar` in that order, as the applet did, takes the game's 64 classes unchanged apart from renaming `java.awt.Color` and `Font`, and compiles them with TeaVM against our own Greenfoot runtime into `web/`: the script and the 94 images the game loads, 3.7 MB in all. How that works is in [greenfoot-web.md](greenfoot-web.md). The town is 800×600 and the title and the battle 600×400; the page frames the town's size and shows each world at its own scale, centred, as Greenfoot's viewer did. It starts on Play with no Run bar, and has Pause/Play and Start over under it. The game has no sound (see The game), so the site's music keeps playing.

**`cheerpj.html`** is the earlier page, kept for comparison: the jars as an applet through CheerpJ, 816×669, the size of the 2012 export's own `V10.html`. See [isguy.md](isguy.md) for how that works and for CheerpJ's license. Nothing links to it. On 2026-10-27 its meta line was corrected from "sound on" to "no sound", and it no longer pauses the site's music.

**The game.** You choose a starter (Bulbasaur, Charmander or Squirtle) and walk around TrainingVille: a pond, a Poké Mart, a Pokémon Center, a "Make it Here" sign and a lot of tall grass. Walking in the grass starts a battle after a black-screen flash, and in V10 every battle is the same joke: `BattleWorld` is a game of Pong. A message reads "Cesar must beat Imgur, else Ash's journey must start over."; after 250 acts it gives way to a Poké Ball (`Ball`), which bounces between the player's paddle (`Cesar`, a photo of a person, moved with ↑ ↓) and the Imgur logo (`Imgur`) on the right, speeding up at each hit. When it gets past the paddle, a new TrainingVille starts, with Ash back at the start. The proper battle (`AttackPrompt`, `SelectionPrompt`, the starters' moves, `EnemyHP` and the wild Pokémon classes) is in the jar, but nothing in V10 reaches it: the only switch into a battle world is `TallGrass`'s, and it builds this one. The earlier version of this page, read from the code, described a Fight/Run menu instead; that was wrong for V10.

**No sound.** `BattleMusic3.mp3` is in the jar's `sounds/` and its `soundindex.list`, and the manifest pulls in JLayer to decode MP3s, but no class plays it or any other sound (checked on 2026-10-27 by searching every class file, the stray copies included). So the game is silent in CheerpJ too.

**Cesar's photo.** The Pong paddle is `Cesar.png`/`Cesar.gif`, a full-length photo of a person, stored upside down and turned upright by the game's `setRotation(180)`. Who it is isn't recorded. It has been in the published jar since the CheerpJ page went up; it's noted here because nothing on the site mentioned it before, and whether it stays is Jake's call.

Controls, from the source:
- Space on the title screen;
- ← → and Enter to choose a starter;
- the arrow keys to walk, diagonals included, and Shift to run;
- Enter to clear a sign's pop-up;
- hold S for your stats (Pokémon beaten and town reputation);
- ↑ ↓ to move the paddle in the Pong battle.

The README also lists "b: bag", but nothing in V10 reads the B key, so the page leaves it out.

**Files.**
- `V10.jar` (13.6 MB) and `jl1.0.1.jar` (143 KB) are `Old Computer/Documents/Greenfoot/Pokemon/V10-export/`, copied unchanged. That's the only export in the archive, made with Greenfoot 2.1.2 on 2012-05-30 (Java 6 classes). `jl1.0.1.jar` is JLayer, the MP3 decoder Greenfoot 2 used for MP3 sounds; `V10.jar`'s manifest loads it, though the game never plays one. `V10.jar` also holds Dropbox's stray copies of a few classes (`BattleWorld (Lost Boy's conflicted copy 2012-05-28).class`) and an old copy of the project under `images/PokemonGameV1/`, class files included; nothing loads them, and the JavaScript build skips them.
- `start-at-title.jar` (720 bytes) is new, made on 2026-10-26. It holds one file, `standalone.properties`: `V10.jar`'s copy with one line changed, `main.class=TrainingVille` to `main.class=PokemonWorld`. The applet's `archive` lists it before `V10.jar`, so it's the copy Greenfoot reads.
- `browser-timer.jar` (2 KB) is new, made on 2026-10-27: `V10.jar`'s `greenfoot/util/HDTimer.class` (Greenfoot 2.1.2) without its busy-wait, explained in [isguy.md](isguy.md#speed).
- `closed-sign.jar` (618 bytes) is new, made on 2026-10-27. It holds `V10.jar`'s `ClosedSign.class` with the body of `createSign()` replaced by a bare `return`. See Speed below.
- `web/` is the JavaScript build's output, regenerated by `yarn projects:greenfoot greenfoot-pokemon`; don't edit it by hand.
- `poster.webp` is TrainingVille at the start, 800×600, captured from the JavaScript build's canvas on 2026-10-27. It matches the earlier capture from CheerpJ sprite for sprite, without Greenfoot's border and control bar.

The applet's `archive` (in `cheerpj.html`) is `start-at-title.jar,browser-timer.jar,closed-sign.jar,V10.jar`. The JavaScript build uses the same jars minus `browser-timer.jar`, which only replaces a Greenfoot class and so means nothing to it.

**Why `start-at-title.jar`.** As exported, the game opens on the town map and never shows the title screen or the starter choice. Its starting world is `TrainingVille`, whose constructor switches to `PokemonWorld` (the title and the starters), and Greenfoot 2.1.2's exported viewer ignores a switch made while the first world is being built; Reset does the same. Without a starter, a battle has no moves to show. Starting on `PokemonWorld` plays it the way the code intends, and puts both names on screen. To get the 2012 export's behavior back, drop `start-at-title.jar` from the build's `GAMES` entry (and from `JARS` in `cheerpj.html`). The JavaScript runtime would honour the switch in `TrainingVille`'s constructor, unlike Greenfoot 2.1.2, so there the title would show either way; the jar keeps the two versions starting the same.

**Verified** in headless Chrome, served from `public/`: the title screen, Space, choosing a starter with the arrows and Enter, TrainingVille, and walking. On the desktop, `java -jar V10.jar` fails because the manifest names the applet class, but `java -cp V10.jar;jl1.0.1.jar greenfoot.export.GreenfootScenarioMain` opens the game.

**Verified for the JavaScript build** on 2026-10-27, in headless Chrome with real key events, served from `public/` by a static server: the title (600×400, centred), Space, the pointer moving to Charmander with → and his prompt, Enter into TrainingVille, walking at 1 px an act (60 px a second) and the rocks stopping Ash, the grass starting the Pong battle after about 6 seconds of walking, the message giving way to the ball, the paddle returning it (5 returns, played by a script following the ball), the ball getting past and the town starting over, and the stats board while S is held (drawn in Courier). `GF.dumpWorld()` listed the town's actors: 742 `TallGrass`, 85 `Rock`, 60 `Tree`, 18 `Flowers`, 8 `Plant` and one each of the rest, 924 in all.

Not verified: the signs on the Poké Mart, the shop and the Pokémon Center (reaching them means crossing the grass, where a battle cuts in), the game inside the site's own viewer, and on a phone.

## Speed

**As JavaScript, the town runs at full speed:** 59.8–60.3 acts a second in headless Chrome at 60 Hz, standing or walking, with the main thread 26–43% busy. That needed one change to the runtime: a collision query for a class only tests that class's actors, so the grass's 742 checks for Ash each test one actor instead of 924 ([greenfoot-web.md](greenfoot-web.md#how-it-works)). Painting all 924 sprites on a canvas costs little. The rest of this section is about CheerpJ, which `cheerpj.html` still runs.

How the three Greenfoot games were measured in CheerpJ and what was wrong with them all is in [isguy.md](isguy.md#speed). For Pokémon: the title screen and the starter choice run at full speed (about 58 acts a second, the most speed 50 allows being 61.6), but **in CheerpJ TrainingVille still runs at about a third of the speed the game was made for**, 18–22 acts a second standalone and less inside the site's viewer.

**Why the town is slow.** TrainingVille has about 920 actors: 742 `TallGrass`, 85 rocks, 60 trees and the rest. Every act, Greenfoot runs each one's `act()` (each patch of grass asks whether Ash is standing on it), then repaints the world by drawing all 920 sprites through Java2D. CheerpJ does that drawing in software, about 25 ms a frame, and the acts take about as long again. Turning off every grass patch's `act()` only got it from about 19 to 23, so there's no single culprit left in the game's code.

**`closed-sign.jar`.** The one wasteful thing that could go: the Poké Mart, the shop and the Pokémon Center each make a `new ClosedSign("Hey")` every act, to have one ready in case Ash reads their sign. `ClosedSign`'s constructor calls `createSign()`, which makes a 329×97 image, a Times New Roman font and draws "NOTICE: Closed due to recent attacks!" on it, and then drops the image without ever showing it; the sign that's shown is `Notice.gif`, set after it's added. In CheerpJ each of those costs 2–5 ms (timed by making one sign per act on the empty title screen), so 6–9 ms of every act in the town, and each one printed "Font rempping for Times New Roman" to the console, about 60 lines a second. With `createSign()` empty, nothing on screen changes and the console stays quiet. On the busy test machine, alternating runs of the town gave 10–16 acts a second without it and 14–23 with it.

**What could have made the CheerpJ town faster** was listed here. The last idea, compiling the Java to JavaScript ahead of time, is what the page does now, from the compiled classes rather than the source.

## Download

`public/projects/greenfoot-pokemon/download/pokemon-green-foot-edition.zip` (13.2 MB, made on 2026-10-27) is the game to run on a desktop. It unzips to one `pokemon-green-foot-edition/` folder:
- `pokemon-green-foot-edition.jar` (932 bytes), new: a launcher with no code. It holds a manifest, `Main-Class: greenfoot.export.GreenfootScenarioMain` and `Class-Path: V10.jar jl1.0.1.jar`, and `start-at-title.jar`'s `standalone.properties`, byte for byte. Java puts the launcher first on the class path, so Greenfoot reads that copy and the game opens on the title screen, as on the site.
- `V10.jar` and `jl1.0.1.jar`, copied unchanged from this folder.
- `README.txt`: how to run it, the controls and the credits (it says it's a fan game and whose the characters are).

`browser-timer.jar` and `closed-sign.jar` are left out: both are there for CheerpJ's sake, and a desktop JVM runs the game at speed without them.

**What a visitor needs.** Java 8 or newer, and the three jars kept together. Double-click the launcher or run `java -jar pokemon-green-foot-edition.jar`; it works from any folder, since Greenfoot reads everything from the jars. The window is titled "V10" (the export's `project.name`) and opens paused, so the README says to press Run.

**Verified** on 2026-10-27 with Java 25 on Windows 10, from an unzipped copy: the launcher opens the title screen ("Press the Space Bar to enter", both names), with nothing on stderr. Built without the properties file, the same launcher opened TrainingVille instead, which is why it's in there. Not checked on the desktop: playing past the title.

**Two mistakes in the zip's README**, found on 2026-10-27 after it went live: it says battles are a Fight/Run menu, and that `jl1.0.1.jar` "plays the battle music". In V10 the battle is the Pong game and nothing plays a sound (see The game). The zip is deployed, so fixing it means a new zip under a new name (the deploy compares by size only) and pointing the download at it; not done yet.

**How it was made, and rebuilding it.** A one-off Python script (`zipfile`; not kept) built the launcher in memory and the zip around it: the README, then the three jars stored uncompressed. Every entry is dated 2012-05-30, so the same inputs give a byte-identical zip. The deploy compares files by size only (see CLAUDE.md), so a rebuilt zip of the same length wouldn't be uploaded: give a changed download a new name, or add it to the workflow's unconditional uploads.

## Left out on purpose

- V1 to V10 and `OldCrap` under `Greenfoot/Pokemon/`: source, and compiled classes for V8 to V10. `V10-export` is the build that was published.
- The repo's old export page, `public/projects/highschool/oldSite/OldSite/Greenfoot/PokemonGame-export/`, is untouched. Its applet tag points at `PokemonGame.jar`, which isn't in the archive.

## Card image

`public/images/projects/greenfoot-pokemon.webp`, the page before Play: TrainingVille under the Play button. Retaken on 2026-10-27 with the new poster. With `#play`, the page would show the title screen.
