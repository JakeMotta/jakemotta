# Scott Pilgrim side-scroller

Jake's first game for SJSU's CS 134 (game programming), March 2017: a desktop game in Java on top of OpenGL through JOGL 2.3.2, with no engine. The page is `public/projects/cs134/scott-pilgrim.html`; the card id is `scott-pilgrim`.

Scott Pilgrim idles, runs in four directions and punches (Z) across a scrolling level, throwing a fireball with each punch. Ramona follows him and jumps when he swings. The window title is "I can't charge my phone and listen to music at the same time".

It shared a "CS 134 Games" card with [The Floor is Lava](floor-is-lava.md) until 2026-10-27. That page says why they were split and where the old card's links go, and how both clips were recorded.

## Preview

`scott-pilgrim.html` is a hand-written page with a clip of the game above its description. Like the Floor is Lava's, the clip is silent, autoplays muted and loops, and is paused on its poster frame under `prefers-reduced-motion`.

**The clip.** `scott-pilgrim.mp4`: 800×600, 20.7 s, 0.7 MB. The run, punch and fireball moves follow a fixed key script. Its poster, `scott-pilgrim.jpg`, is the clip's first frame.

**Which build.** The compiled `bin/` of `cs134_game.zip` (30 March 2017, the latest of the snapshots in `Z:\Google Drive\School\College\CS 134\`), run from the project folder so it finds `Sprites/`.

**Credits.** Scott and Ramona are sprites from *Scott Pilgrim vs. the World: The Game* (Ubisoft, 2010; art by Paul Robertson). The grass and dirt tiles are from *Super Mario World* (Nintendo; `Final_Project/Sprite Sheets/tiles-ground.png` is the ripped sheet). The page credits both.

## Download

`public/projects/cs134/download/scott-pilgrim.zip` (9.1 MB, made on 2026-10-27) is the game to run on a desktop, since it can't run in a browser. It unzips to one `scott-pilgrim/` folder:
- `scott-pilgrim.jar`, new: the 11 `.class` files of `bin/`, unchanged, and a manifest with `Main-Class: main.Main`, `Class-Path: lib/jogamp-fat.jar` and `Enable-Native-Access: ALL-UNNAMED`. That last line keeps Java 22 and later from warning about JOGL loading its native libraries; older Java ignores it.
- `lib/jogamp-fat.jar`, `bin/`'s JOGL 2.3.2, unchanged. It carries the native libraries for Windows, Linux and Intel Macs.
- `Sprites/`: the 89 `.tga` files in the project's `Sprites/` folder. The code loads only `.tga`s (the `.png` copies beside them are left out), and opens them with `FileInputStream("Sprites/…")`, relative to the folder Java was started in.
- `README.txt`: how to run it, the controls and the credits.

Nothing else from the archive: no source, `.DS_Store`, `__MACOSX`, Eclipse files or `.metadata`. The game doesn't load any sounds.

**What a visitor needs.** Java 8 or newer (the classes are Java 7 and 8). Double-click the jar or run `java -jar scott-pilgrim.jar` **from inside the folder**: started from anywhere else, the window opens but every sprite fails to load ("Could not open for reading" on stderr), the tiles and the sky included. The README says so. Windows Explorer starts a double-clicked jar in its own folder; that wasn't tested, nor was a Mac (an Apple Silicon Mac needs an Intel Java for these libraries, if it runs at all). The game prints "Hero on screen!" to the console every frame while Ramona is in view; that's the 2017 code.

**Verified** on 2026-10-27 with Java 25 on Windows 10, from an unzipped copy: `java -jar scott-pilgrim.jar` and `java --enable-native-access=ALL-UNNAMED -jar scott-pilgrim.jar` both open the window with Scott, Ramona and the level drawn, with nothing on stderr; started from the parent folder, the sprites go missing as above.

**How it was made, and rebuilding it.** A one-off Python script (`zipfile`; not kept) built the jar in memory and the zip around it from an extracted `cs134_game.zip`: the README, then the two jars stored uncompressed, then the sprites. Every entry is dated 2017-03-30, so the same inputs give a byte-identical zip. To change it, unzip `cs134_game.zip` somewhere new (leaving out `__MACOSX` and `.metadata`) and repeat those steps. The deploy compares files by size only (see CLAUDE.md), so a rebuilt zip of the same length wouldn't be uploaded: give a changed download a new name, or add it to the workflow's unconditional uploads.

## Left out on purpose

- **The source:** the `.java` files, the Eclipse project and the loose classes in `src/` stay in the archive. The compiled game and JOGL are in the download above.
- **Other snapshots and homework:** the earlier snapshots (`cs134_game_perfect_scroll.zip`, `cs134_game_able_to_fire.zip`), `hw2_export.zip` (a sprite-walking homework titled "Magicarp Used Fly"), and the unused Mario sheets in `Final_Project/`.

## Card image

`public/images/projects/scott-pilgrim.webp`, the page with the clip a couple of seconds in.
