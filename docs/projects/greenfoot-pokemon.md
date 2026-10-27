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
- `poster.webp` is TrainingVille, captured from the game running in CheerpJ.

**Why `start-at-title.jar`.** As exported, the game opens on the town map and never shows the title screen or the starter choice. Its starting world is `TrainingVille`, whose constructor switches to `PokemonWorld` (the title and the starters), and Greenfoot 2.1.2's exported viewer ignores a switch made while the first world is being built; Reset does the same. Without a starter, a battle has no moves to show. Starting on `PokemonWorld` plays it the way the code intends, and puts both names on screen. To get the 2012 export's behavior back, drop `start-at-title.jar` from `JARS` in the page.

**Verified** in headless Chrome, served from `public/`: the title screen, Space, choosing a starter with the arrows and Enter, TrainingVille, and walking. On the desktop, `java -jar V10.jar` fails because the manifest names the applet class, but `java -cp V10.jar;jl1.0.1.jar greenfoot.export.GreenfootScenarioMain` opens the game.

Not verified: a wild battle (the test machine was busy, so walking was too slow to reach the grass in time), the battle music, and the Poké Mart and Pokémon Center.

## Left out on purpose

- V1 to V10 and `OldCrap` under `Greenfoot/Pokemon/`: source, and compiled classes for V8 to V10. `V10-export` is the build that was published.
- The repo's old export page, `public/projects/highschool/oldSite/OldSite/Greenfoot/PokemonGame-export/`, is untouched. Its applet tag points at `PokemonGame.jar`, which isn't in the archive.

## Card image

`public/images/projects/greenfoot-pokemon.webp`, the page before Play: TrainingVille under the Play button. With `#play`, the page would show the title screen once CheerpJ has loaded.
