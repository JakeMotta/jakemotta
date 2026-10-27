# The Floor is Lava

Jake's final project for SJSU's CS 134 (game programming), November 2017: a desktop game in Java on top of OpenGL through JOGL 2.3.2, with no engine. The window, sprite loading (from `.tga` files), animation, camera and collisions are all hand-written. The page is `public/projects/cs134/floor-is-lava.html`; the card id is `floor-is-lava`.

A miner on a 10-column grid. Blocks drop from the sky (a red `!` warns where), the lava rises and the floor sinks into it. He digs blocks loose with a pickaxe, picks up what drops and places it under his feet to climb. Controls: ←/→ step one block, ↑ jump, Z (held) mine, Space or ↓ drop a carried block underneath, Ctrl + arrow turn without moving, Enter to retry.

`public/projects/cs134/` holds both of Jake's CS 134 games, and each is its own card: this one and the [Scott Pilgrim side-scroller](scott-pilgrim.md).
- **One card each since 2026-10-27:** until then they shared a single "CS 134 Games" card (`cs134`), framing one page with both clips side by side. Jake asked for every project to be its own card, so that page (`cs134/index.html`) was split in two and deleted. The deployed copy stays live until it's removed in cPanel.
- **Old links:** `/project/cs134` redirects to this card (`movedProjects` in `constants.ts`).
- **The old card image:** `cs134.webp` stays in `public/images/projects/` as archive.

## Preview

`floor-is-lava.html` is a hand-written page with a clip of the game beside its description (stacked on phones). The clip is silent, so unlike [Escaping Confinement](escaping-confinement.md) the page doesn't pause the site's music. It autoplays muted and loops; with `prefers-reduced-motion` it's paused on its poster frame instead.

**Recording the clips** (this one and Scott Pilgrim's, on 2026-10-26). Both games still run on Java 25 (the installed Temurin JRE). JOGL 2.3.2 from 2015 loads its natives without any `--add-opens`; only `--enable-native-access=ALL-UNNAMED` was passed.
- **Capture:** frames were grabbed from the game window with `PrintWindow` (`PW_RENDERFULLCONTENT`) at 15 fps. A plain screen copy of a JOGL window comes out black.
- **Input:** key presses were posted straight to the game window, so none could reach another app.
- **Encoding:** Blender's video sequencer, an image strip, the `Standard` view transform, H.264 at the window's own size.

**This clip.** `floor-is-lava.mp4`: 640×960, 25 s, 0.5 MB. The music and pop sound were swapped for silence in a scratch copy before running, so nothing played on the speakers. Its poster, `floor-is-lava.jpg`, is the clip's first frame.
- **Who's playing:** the miner is played by a small bot that reads each frame. It dodges falling blocks, mines blocks beside it, picks up the drops, climbs onto blocks and places them. The 25 seconds are the second half of a 60-second run, once blocks had piled up and the lava had risen.
- **Starting a run:** the game opens on its GAME OVER screen, so a run starts with Enter.

**Which build.** The compiled `TheFloorIsLava.jar` from `Z:\Old Projects\files\games\TheFloorIsLava.zip`. Its source isn't in the archive. `Z:\Old Computer\Documents\Old Save\School\134_final` is an early start on it from May 2017, built on the Scott Pilgrim code with only block and lava tiles, not the final game.

**Credits.** Where the miner sheet (`Sprites/Sheets/Miner.png`) and bricks came from isn't recorded, so the page doesn't say who drew them.

## Left out on purpose

- **The game itself:** it's a Java desktop program and can't run in a browser. The jar, JOGL (`jogamp-fat.jar`, 9 MB) and the source stay in the archive.
- **The music:** `main_music.wav` is 40 MB and its origin isn't recorded. The clip is silent.
- **Sprites:** the sprites and the font images aren't copied; the clip shows them in use.
- **The original screenshot:** `MineGuy.png` (255×198) from the old portfolio; the clip shows more.

## Card image

`public/images/projects/floor-is-lava.webp`, the page with the clip a couple of seconds in.
