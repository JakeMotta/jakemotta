# Survivor

A GameMaker Studio 2 platformer Jake designed with a classmate in March–April 2017 for SJSU's CS 108 (game design). An innocent prisoner tries to escape a detention center past moving platforms, electric barriers, fake floors, elevators and spikes. The plan: one screen per level, crossed left to right; five levels; one life with a little health; one clock for the whole escape. The page is `public/projects/survivor/index.html`; the card id is `survivor`. The sources are in `Z:\Google Drive\School\College\CS 108\`, plus the later sprites in `Z:\Old Computer\Documents\Old Save\School\108\`.

The same class's other game, the tabletop Arena King, is no longer on the site.
- **Removed on 2026-10-27:** until that morning the two shared this card and one page, as "Survivor & Arena King". Arena King got a card of its own (`survivor/arena-king.html`), and later the same day Jake asked for it to be taken off the site. Its page, card image and doc were deleted; its sources are still in `Z:\Google Drive\School\College\CS 108\`. The page was already deployed, so it stays live until it's moved to the Trash in cPanel.
- **Old links:** `/project/survivor` still opens this card.

## Preview

`index.html` is a hand-written case study on the yellow of the design mockup. The game can't be shown running: the only GameMaker project in the archive (`CS 108 Game/suvivorGame`, 24 March 2017) is an early test room with one object that moves with the arrow keys. Its player sprite is a downloaded render of Mario, a stand-in. The finished game isn't anywhere in the archive, and GameMaker isn't installed here anyway. So the page shows:
- **The mockup:** `design.png` (768×576), with the clock, two elevators and a moving platform over spikes.
- **The prisoner:** running both ways, flipping between `right_run.png`/`right_run2.png` and `left_run.png`/`left_run2.png` (32×64, April 2017).
- **A parts box of the level pieces:** an electric barrier built from its pieces (`block_left_laser`, `elec_left_start1/2`, `elec1–3`, `elec_right_start_1/2`, `block_right_laser`) and animated, plus the elevator, ladder, floor spike, ceiling spike, floor block and moving platform.
- **What the game was:** the description and the bullet points, rewritten from `Game Doc.docx`.

The sprites in `sprites/` are the original PNGs, copied unchanged with their own names. They were drawn in Adobe Fireworks (it's in their metadata); `left_run.png` is 48 KB because it still holds Fireworks' editing data. They're drawn enlarged with `image-rendering: pixelated`. A small script swaps the frames of anything with `data-frames`; with `prefers-reduced-motion` it doesn't run and the first frame stays.

**Names.** The design doc names the two-person team; the page says "with a classmate, Elias".

## Left out on purpose

- **The GameMaker project:** the test room, its Mario stand-in sprite and its `.yy` files. There's nothing to run, and the Mario render isn't Jake's.
- **Duplicate sprites:** where the two sets overlap, the April drawing is used. The March prisoner (`prisoner_*_run_*.png`, 32×56) and elevator are left out, and so is April's `moving_floor_block.png`, the same platform as March's `moving_tile.png` on a 64×64 canvas. `floor_block.png`, `moving_tile.png` and `spike.png` come from the March set.
- **Screens and sound:** `win.png` and `lose.png` ("YOU WIN!" and "YOU DIED!" on a transparent 800×600) add nothing. No sound files are in the archive.
- **Other files:** `CS 108 Notes.docx` (a list of the MDA aesthetics) and `PsychOut.html` (an empty canvas stub).
- **Full names:** the teammate's surname, as above.

## Card image

`public/images/projects/survivor.webp` is the design mockup of a level, clipped from the page (`design.png`, 4:3 already). There was never a finished build to shoot.
