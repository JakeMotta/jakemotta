# The Floor is Lava

Jake's final project for SJSU's CS 134 (game programming), November 2017: a desktop game in Java on top of OpenGL through JOGL 2.3.2, with no engine. The window, sprite loading (from `.tga` files), animation, camera and collisions are all hand-written. The page is `public/projects/cs134/floor-is-lava.html`; the card id is `floor-is-lava`.

A miner on a 10-column grid. Blocks drop from the sky (a red `!` warns where), the lava rises and the floor sinks into it. He digs blocks loose with a pickaxe, picks up what drops and places it under his feet to climb. Controls: ←/→ step one block, ↑ jump, Z (held) mine, Space or ↓ drop a carried block underneath, Ctrl + arrow turn without moving, Enter to retry.

`public/projects/cs134/` holds both of Jake's CS 134 games, and each is its own card: this one and the [Scott Pilgrim side-scroller](scott-pilgrim.md).
- **One card each since 2026-10-27:** until then they shared a single "CS 134 Games" card (`cs134`), framing one page with both clips side by side. Jake asked for every project to be its own card, so that page (`cs134/index.html`) was split in two and deleted. The deployed copy stays live until it's removed in cPanel.
- **Old links:** `/project/cs134` redirects to this card (`movedProjects` in `constants.ts`).
- **The old card image:** `cs134.webp` stays in `public/images/projects/` as archive.

## Preview

`floor-is-lava.html` is laid out like the [Coloris](coloris.md) page, as Jake asked on 2026-10-27: title, a meta line, the game behind a Play button over a poster, a hint, the controls and a note. The game is 640×960 and scales down to the frame's width and the window's height, drawn with `image-rendering: pixelated`. Play goes straight into a run (the original opens on its GAME OVER screen and waits for Enter). It needs a keyboard. `#play` starts it without a click, for the card screenshot. The poster is `floor-is-lava.jpg`, the old clip's first frame.

**Why a port.** Jake asked for it to be playable. The original can't run in CheerpJ the way the Greenfoot games do: JOGL draws through native OpenGL libraries, which a browser JVM can't load. And there's no source to rebuild from (see Which build). So `floor-is-lava/game.js` is a translation of the jar's compiled classes into JavaScript, one Java method to one function, keeping the Java names (`Main`'s loop is `step()`, plus `Hero`, `Block`, `Item`, `Lava`, `Background`, `Camera`, `Images`).
- **How it was read:** there's no JDK here, so the 15 classes were disassembled with a small Python class-file reader, and its listing turned into goto-style pseudo-Java (neither script kept; any decompiler such as CFR does the same).
- **Drawing:** `glDrawSprite` becomes `drawImage` at the same rectangle, minus the camera, with smoothing off (the textures were `GL_NEAREST`).
- **Timing:** one pass of the original's loop per frame at 60 a second. Its inner physics loop runs once per pass, since its timer is read once before the loop; the original was paced by vsync.
- **Keys:** held-key state, like NEWT's `kbState`, ignoring auto-repeat. Up, Left, Right and Space act once per press; Down and Z repeat while held; Ctrl is a held modifier; Esc does nothing. One addition: a key pressed and released between two steps still counts for one step, so a quick tap isn't lost.
- **Kept as they were,** on purpose: light blocks stay where they stopped when the block under them is mined, while dark ones fall again; floor blocks always drop apples (their IDs are multiples of 7); the score on screen is the best ever, never reset between runs; the depth numbers down the right edge lose their minus signs (the font has none); a block falling through the miner hurts him while he stands inside it; a run started straight after dying can keep a few blocks, because the original clears its lists half at a time.
- **Not checked against the original side by side:** speed and feel were read from the code, not timed against the running jar.

**The sprites.** `floor-is-lava/` holds the 97 sprites the code loads, as PNGs converted from its `.tga` files exactly as `glTexImageTGAFile` reads them (BGRA, data row 0 at the bottom of the drawn sprite). The `.png` copies in the archive's `Sprites/` weren't used, since the game never loaded them. The converter was a short Python script (not kept). Blocks and the wall are 64×64, the miner 32×32 drawn at 64, the lava 64×64 drawn at 128, the font glyphs 14×18 to 14×21.

**Sound.** None: the page says "no sound", and the site's music keeps playing, like Coloris. The music (`main_music.wav`, 40 MB, origin unrecorded) and the pop when a block breaks are left out.

**The old clip.** Until 2026-10-27 the page showed `floor-is-lava.mp4`, a 25-second recording of the original played by a small bot (recorded on 2026-10-26 from the jar on Java 25, frames grabbed with `PrintWindow` at 15 fps, encoded in Blender, with the sounds swapped for silence). The page no longer uses it; it stays in the folder as archive, and its first frame, `floor-is-lava.jpg`, is the poster.

**Which build.** The compiled `TheFloorIsLava.jar` from `Z:\Old Projects\files\games\TheFloorIsLava.zip`. Its source isn't in the archive. `Z:\Old Computer\Documents\Old Save\School\134_final` is an early start on it from May 2017, built on the Scott Pilgrim code with only block and lava tiles, not the final game.

**Credits.** Where the miner sheet (`Sprites/Sheets/Miner.png`) and bricks came from isn't recorded, so the page doesn't say who drew them.

## Download

`public/projects/cs134/download/the-floor-is-lava.zip` (47.6 MB) is `TheFloorIsLava.zip` from the archive, unchanged: the jar, `TheFloorIsLava_lib/jogamp-fat.jar` (JOGL 2.3.2), the `.tga` and `.png` sprites, `Sounds/` (the music and the pop) and a one-line README. A visitor needs Java and opens `TheFloorIsLava.jar` from its own folder, since the game opens `Sprites/…` and `sounds/…` relative to where Java starts. The viewer's note says it's made for Windows:
- **Mac:** JOGL 2.3.2 has no Apple Silicon libraries.
- **Linux:** the code asks for `sounds/pop.wav` but the folder is `Sounds`, so a case-sensitive file system fails.

Verified on 2026-10-27 with Java 25 on Windows 10, from an unzipped copy with the two sounds swapped for silence: `java --enable-native-access=ALL-UNNAMED -jar TheFloorIsLava.jar` opened the "The Floor is Lava" window with nothing on stderr.

Shipping the music means hosting a 40 MB track whose origin isn't recorded, as isGuy's jar already ships six commercial songs ([isguy.md](isguy.md)); Jake asked for the games to be downloadable, so the zip goes out as it was.

## Left out on purpose

- **The source:** it isn't in the archive.
- **The music and the pop in the browser:** see Sound.

## Card image

`public/images/projects/floor-is-lava.webp`, taken with the clip a couple of seconds in. Retake it with `#play` so it shows the game itself.
