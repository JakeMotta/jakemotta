# Survivor and Arena King

Two games Jake designed in spring 2017 for SJSU's CS 108 (game design). The folder is `public/projects/survivor/`; the card id is `survivor`. The sources are in `Z:\Google Drive\School\College\CS 108\`, plus the later sprites in `Z:\Old Computer\Documents\Old Save\School\108\`.

- **Survivor** (March–April 2017): a GameMaker Studio 2 platformer Jake made with a classmate. An innocent prisoner tries to escape a detention center past moving platforms, electric barriers, fake floors, elevators and spikes. The plan: one screen per level, crossed left to right; five levels; one life with a little health; one clock for the whole escape.
- **Arena King** (February 2017): a tabletop game for 2–4 players with character cards (HP, ATK, DEF), dice, coins and a store of buffs. Players fight one card each per match and win by claiming the most defeated cards.

## Preview

`index.html` is a hand-written case study, Survivor first, on the yellow of Survivor's design mockup.

**Survivor.** The game can't be shown running: the only GameMaker project in the archive (`CS 108 Game/suvivorGame`, 24 March 2017) is an early test room with one object that moves with the arrow keys. Its player sprite is a downloaded render of Mario, a stand-in. The finished game isn't anywhere in the archive, and GameMaker isn't installed here anyway. So the page shows:
- **The mockup:** `design.png` (768×576), with the clock, two elevators and a moving platform over spikes.
- **The prisoner:** running both ways, flipping between `right_run.png`/`right_run2.png` and `left_run.png`/`left_run2.png` (32×64, April 2017).
- **A parts box of the level pieces:** an electric barrier built from its pieces (`block_left_laser`, `elec_left_start1/2`, `elec1–3`, `elec_right_start_1/2`, `block_right_laser`) and animated, plus the elevator, ladder, floor spike, ceiling spike, floor block and moving platform.
- **What the game was:** the description and the bullet points, rewritten from `Game Doc.docx`.

The sprites in `sprites/` are the original PNGs, copied unchanged with their own names. They were drawn in Adobe Fireworks (it's in their metadata); `left_run.png` is 48 KB because it still holds Fireworks' editing data. They're drawn enlarged with `image-rendering: pixelated`. A small script swaps the frames of anything with `data-frames`; with `prefers-reduced-motion` it doesn't run and the first frame stays.

**Arena King.** Written up from `BoardGame.docx` and `ArenaKing-Rules.docx` (25 February 2017, the same rules; `BoardGame.docx` adds "withholding buffs" to the pitch).
- **The rules:** what's in the box, setup, the four phases of a round, the damage rule (ATK minus DEF, never below zero) and how to win.
- **The buffs:** a table. In the docs, blue buffs (ATK, DEF) last the match and red ones are used once; the table shows that as a tag. The docs give no prices, so the page only says what the playtest shows: the +1, +3 and +5 buffs cost 1, 2 and 3 copper.
- **The playtest:** summarized from `arena king 1.docx`, Jake's session report: five matches, which the playtester won 3 cards to 2. The closing line about what the log shows (one heavy hitter took three matches; high defense stalled a match until Poison broke it) is a reading of the log, not something the report says.

**Names.** Classmates appear by first name or role only. The design doc names Survivor's two-person team; the page says "with a classmate, Elias". The playtest report names the other player; the page says "a playtester". The card names are Jake's own and kept as written, "Big Ass Sword" included.

## Left out on purpose

- **The GameMaker project:** the test room, its Mario stand-in sprite and its `.yy` files. There's nothing to run, and the Mario render isn't Jake's.
- **Duplicate sprites:** where the two sets overlap, the April drawing is used. The March prisoner (`prisoner_*_run_*.png`, 32×56) and elevator are left out, and so is April's `moving_floor_block.png`, the same platform as March's `moving_tile.png` on a 64×64 canvas. `floor_block.png`, `moving_tile.png` and `spike.png` come from the March set.
- **Screens and sound:** `win.png` and `lose.png` ("YOU WIN!" and "YOU DIED!" on a transparent 800×600) add nothing. No sound files are in the archive.
- **Other files:** `CS 108 Notes.docx` (a list of the MDA aesthetics) and `PsychOut.html` (an empty canvas stub).
- **Full names:** the teammate's and playtester's surnames, as above.

## Card image

`public/images/projects/survivor.webp`, the top of the page: the mockup, the description and the running prisoner.
