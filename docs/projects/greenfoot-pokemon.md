# Pokémon: Green Foot Edition

A Pokémon fan game Jake made with his classmate Logan Lovell in May 2012, in Greenfoot (Java), as the final project for their computer programming class. The title screen reads "Created By: Jacob Motta & Logan Lovell", and the page credits both. Its README says they "went way overboard on this project compared to the rest of the class", and that the sprites came from Google, with some made in Fireworks. The folder is `public/projects/greenfoot-pokemon/`; the card id is `greenfoot-pokemon`.

**Nintendo's art.** The sprites, the logo and the starters are Nintendo and Game Freak's. Jake decided on 2026-10-26 to publish it anyway. The page says it's a fan game and whose the characters are.

## Preview

`index.html` is a copy of the isGuy page and runs the same way: CheerpJ, the jar as an applet, a Play button, Run. See [isguy.md](isguy.md) for how that works and for CheerpJ's license. It's 816×669, the size of the 2012 export's own `V10.html`, and pressing Play pauses the site's music.

**The game.** You choose a starter (Bulbasaur, Charmander or Squirtle) and walk around TrainingVille: a pond, a Poké Mart, a Pokémon Center, a "Make it Here" sign and a lot of tall grass. Walking in the grass can start a wild battle. Going by the code, battles only got as far as a menu: Fight shows your starter's moves and Run takes you back to town. Controls, from the source:
- Space on the title screen;
- ← → and Enter to choose a starter;
- the arrow keys to walk, diagonals included, and Shift to run;
- Enter to clear a sign's pop-up or to pick from the battle menu;
- hold S for your stats (Pokémon beaten and town reputation).

The README also lists "b: bag", but nothing in V10 reads the B key, so the page leaves it out.

**Files.**
- `V10.jar` (13.6 MB) and `jl1.0.1.jar` (143 KB) are `Old Computer/Documents/Greenfoot/Pokemon/V10-export/`, copied unchanged. That's the only export in the archive, made with Greenfoot 2.1.2 on 2012-05-30 (Java 6 classes). `jl1.0.1.jar` is JLayer, the MP3 decoder that plays `BattleMusic3.mp3`; `V10.jar`'s manifest loads it.
- `start-at-title.jar` (720 bytes) is new, made on 2026-10-26. It holds one file, `standalone.properties`: `V10.jar`'s copy with one line changed, `main.class=TrainingVille` to `main.class=PokemonWorld`. The applet's `archive` lists it before `V10.jar`, so it's the copy Greenfoot reads.
- `browser-timer.jar` (2 KB) is new, made on 2026-10-27: `V10.jar`'s `greenfoot/util/HDTimer.class` (Greenfoot 2.1.2) without its busy-wait, explained in [isguy.md](isguy.md#speed).
- `closed-sign.jar` (618 bytes) is new, made on 2026-10-27. It holds `V10.jar`'s `ClosedSign.class` with the body of `createSign()` replaced by a bare `return`. See Speed below.
- `poster.webp` is TrainingVille, captured from the game running in CheerpJ.

The applet's `archive` is `start-at-title.jar,browser-timer.jar,closed-sign.jar,V10.jar`.

**Why `start-at-title.jar`.** As exported, the game opens on the town map and never shows the title screen or the starter choice. Its starting world is `TrainingVille`, whose constructor switches to `PokemonWorld` (the title and the starters), and Greenfoot 2.1.2's exported viewer ignores a switch made while the first world is being built; Reset does the same. Without a starter, a battle has no moves to show. Starting on `PokemonWorld` plays it the way the code intends, and puts both names on screen. To get the 2012 export's behavior back, drop `start-at-title.jar` from `JARS` in the page.

**Verified** in headless Chrome, served from `public/`: the title screen, Space, choosing a starter with the arrows and Enter, TrainingVille, and walking. On the desktop, `java -jar V10.jar` fails because the manifest names the applet class, but `java -cp V10.jar;jl1.0.1.jar greenfoot.export.GreenfootScenarioMain` opens the game.

Not verified: a wild battle (the test machine was busy, so walking was too slow to reach the grass in time), the battle music, and the Poké Mart and Pokémon Center.

## Speed

How the three Greenfoot games were measured and what was wrong with them all is in [isguy.md](isguy.md#speed). For Pokémon: the title screen and the starter choice run at full speed (about 58 acts a second, the most speed 50 allows being 61.6), but **TrainingVille still runs at about a third of the speed the game was made for**, 18–22 acts a second standalone and less inside the site's viewer.

**Why the town is slow.** TrainingVille has about 920 actors: 742 `TallGrass`, 85 rocks, 60 trees and the rest. Every act, Greenfoot runs each one's `act()` (each patch of grass asks whether Ash is standing on it), then repaints the world by drawing all 920 sprites through Java2D. CheerpJ does that drawing in software, about 25 ms a frame, and the acts take about as long again. Turning off every grass patch's `act()` only got it from about 19 to 23, so there's no single culprit left in the game's code.

**`closed-sign.jar`.** The one wasteful thing that could go: the Poké Mart, the shop and the Pokémon Center each make a `new ClosedSign("Hey")` every act, to have one ready in case Ash reads their sign. `ClosedSign`'s constructor calls `createSign()`, which makes a 329×97 image, a Times New Roman font and draws "NOTICE: Closed due to recent attacks!" on it, and then drops the image without ever showing it; the sign that's shown is `Notice.gif`, set after it's added. In CheerpJ each of those costs 2–5 ms (timed by making one sign per act on the empty title screen), so 6–9 ms of every act in the town, and each one printed "Font rempping for Times New Roman" to the console, about 60 lines a second. With `createSign()` empty, nothing on screen changes and the console stays quiet. On the busy test machine, alternating runs of the town gave 10–16 acts a second without it and 14–23 with it.

**What could make the town faster, none of them done:**
- Lighten the board while a game plays, which helps every game on the site ([isguy.md](isguy.md#speed)). It doesn't change the town's standalone speed.
- Rewrite how the town is drawn, for instance an override `TrainingVille` that paints the rocks, trees and grass into the background and keeps only invisible actors for collisions. That changes the 2012 game's code a lot more than the jars above, and stepping on grass would need its own drawing.
- Rebuild it from the source (V8 to V10 are in the archive, under `Greenfoot/Pokemon/`) with something that turns Java into JavaScript ahead of time instead of running a JVM in the browser. Not checked: what current Greenfoot offers for this, or whether the 2012 code builds on it.

## Left out on purpose

- V1 to V10 and `OldCrap` under `Greenfoot/Pokemon/`: source, and compiled classes for V8 to V10. `V10-export` is the build that was published.
- The repo's old export page, `public/projects/highschool/oldSite/OldSite/Greenfoot/PokemonGame-export/`, is untouched. Its applet tag points at `PokemonGame.jar`, which isn't in the archive.

## Card image

`public/images/projects/greenfoot-pokemon.webp`, the page before Play: TrainingVille under the Play button. With `#play`, the page would show the title screen once CheerpJ has loaded.
