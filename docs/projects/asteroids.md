# Asteroids

Jake's take on the arcade classic, built in Godot 4.5 in January 2026: a start menu, levels, UFOs, screen shake, a game-over screen, and his own music made in FL Studio. The source is its own repository, `C:\Users\Jake\Documents\Github\asteroids` (10 commits, last one on 2026-01-08). The folder here is `public/projects/asteroids/`; the card id is `asteroids`.

## Preview

`public/projects/asteroids/` is Godot's own web export, unchanged: `index.html` (Godot's page), `index.js`, `index.wasm` (the engine, about 36 MB, roughly 9 MB gzipped), `index.pck` (the game, 0.8 MB) and the audio worklets. The card frames `index.html`, and the game fills the frame.

**How it was exported (2026-10-26).**
- **Godot:** 4.5-stable, downloaded with Jake's OK from the official GitHub release, with checksums verified. It's in `C:\Users\Jake\Tools\godot-4.5\editor\`. Only the web templates were installed, to `%APPDATA%\Godot\export_templates\4.5.stable\`.
- **Source left alone:** the export ran from a copy of the project, without `.git` and `.godot`, so the asteroids repository has no export preset.
- **Preset:** a "Web" preset with threads off, so the page needs no cross-origin isolation headers on the static host. `.flp` files (FL Studio projects) are excluded, and the canvas fills the window. The project's renderer is Forward+, but web exports always use the Compatibility renderer, so the renderer didn't need changing.
- **Presets as used** (the Web one, and the Windows one described under [Windows download](#windows-download)):

```ini
[preset.0]
name="Web"
platform="Web"
runnable=true
export_filter="all_resources"
exclude_filter="*.flp"
script_export_mode=2

[preset.0.options]
variant/extensions_support=false
variant/thread_support=false
vram_texture_compression/for_desktop=true
vram_texture_compression/for_mobile=false
html/export_icon=true
html/canvas_resize_policy=2
html/head_include="<script>(function(){var done=false;function pause(){if(done)return;done=true;if(window.top!==window)window.top.postMessage({type:'jakemotta:media-playing'},location.origin)}addEventListener('pointerdown',pause);addEventListener('keydown',pause)})();</script>"
html/focus_canvas_on_start=true
progressive_web_app/enabled=false

[preset.1]
name="Windows Desktop"
platform="Windows Desktop"
runnable=true
export_filter="all_resources"
exclude_filter="*.flp"
script_export_mode=2

[preset.1.options]
binary_format/architecture="x86_64"
binary_format/embed_pck=true
texture_format/s3tc_bptc=true
texture_format/etc2_astc=false
debug/export_console_wrapper=0
codesign/enable=false
application/modify_resources=false
```

**Full-resolution rendering (2026-10-27).** Jake said Asteroids didn't feel like it rendered at full scale or a good resolution. The project had `window/stretch/mode="viewport"`, so the game drew at its 1152×648 base size and the browser stretched that picture to the frame, which went soft on big frames and HiDPI screens. The export copy's `project.godot` now has, under `[display]`:

```ini
window/stretch/mode="canvas_items"
window/stretch/aspect="keep"
window/dpi/allow_hidpi=true
```

`canvas_items` draws at the frame's real pixel size (the canvas backing store is the frame's CSS size × `devicePixelRatio`), and `keep` keeps the play area at the same 16:9 1152×648 world, so the game plays exactly as before. Only the export copy changes; the asteroids repository still says `viewport`. Nothing in the game is pixel art that this would spoil: the sprites (ship, asteroids, UFO, buttons) are thin white outlines at 64–328px, imported with Godot's default linear filtering, and the HUD and menu text use Joystix, a pixel-style font loaded as a normal dynamic font, which now renders at the real size instead of being stretched. The only change in the output was `index.pck`.

To re-export: copy the project somewhere, make the `[display]` change above in the copy's `project.godot`, put the presets in it as `export_presets.cfg` (UTF-8 **without** a byte-order mark; Godot won't read the preset otherwise), and run:

```
Godot_v4.5-stable_win64_console.exe --headless --path <copy> --import
Godot_v4.5-stable_win64_console.exe --headless --path <copy> --export-release "Web" <copy>\web\index.html
```

Then copy `web/` over `public/projects/asteroids/`, leaving out the `*.png.import` files Godot writes beside the icons. Stop `yarn dev` first, since copying into `public/` while it runs can crash it.

**Music.** The game plays its own music, so the `head_include` script asks the site's player to pause (the `jakemotta:media-playing` message) on the first click or key press in the frame, the same way the film and Flash pages do. It was switched to the message after the export, in both the preset above and the published `index.html`, where Godot had copied the line as is.

**Hosting notes.**
- **The `.wasm` type:** `public/.htaccess` doesn't declare one. If the host serves `.wasm` without `application/wasm`, the loader logs a warning and falls back to a slower, non-streaming load; it still runs.
- **Re-uploads:** the deploy compares files by size only. A re-export with a new engine build changes `index.wasm`'s size, so it gets uploaded. But a game-only change can keep `index.pck` the same size, and then it isn't. That is exactly what happened with the 2026-10-27 stretch change: the new `index.pck` has different contents but the same 849,496 bytes, so `.github/workflows/deploy.yml` now uploads `projects/asteroids/index.pck` on every deploy with an explicit `put`. That covers future re-exports of it too.
- **The pane-hidden warning:** a load in a tab that has no size yet logs a dozen `GL_INVALID_FRAMEBUFFER_OPERATION … zero size` WebGL warnings once and then runs normally. Seen only on the first load in a hidden browser pane; reloads were clean.
- **Exit Game:** the menu's Exit Game does nothing useful in a browser.

**Verified** in Chrome through a local static server: the page loads, the title screen's attract mode runs, and Start Game starts a game with three lives. Steering and shooting weren't checked properly, because the testing tools tap keys faster than a game frame. After the stretch change (2026-10-27), at a 1024×768 window with `devicePixelRatio` 1.25 the canvas was 1280×960, its CSS size × the ratio, and Start Game still started a three-life game.

## Windows download

`public/projects/asteroids/download/asteroids-windows.zip` (about 34 MB; the exe inside is about 98 MB) holds one file, `Asteroids.exe`, the game with its `.pck` embedded, so there is nothing to install and nothing beside it to lose. It is the same export copy as the web build, `canvas_items` stretch included, through the "Windows Desktop" preset above: release, x86_64, `.flp` excluded, no console wrapper, no code signing, and `application/modify_resources=false`, which skips rcedit, so the exe keeps Godot's default icon and file details. Being unsigned, Windows SmartScreen will warn on first run. It runs the project's own Forward+ renderer.

**Templates.** The Windows template, `windows_release_x86_64.exe`, was extracted from `C:\Users\Jake\Tools\godot-4.5\downloads\Godot_v4.5-stable_export_templates.tpz` (a zip; the file is under `templates/` in it) into `%APPDATA%\Godot\export_templates\4.5.stable\` beside the web ones. Nothing else from the `.tpz` is installed.

**To remake it,** in the same export copy:

```
Godot_v4.5-stable_win64_console.exe --headless --path <copy> --export-release "Windows Desktop" <copy>\win\Asteroids.exe
```

Then zip `Asteroids.exe` on its own (at the zip's root) as `public/projects/asteroids/download/asteroids-windows.zip`. The deploy compares by size only, so a remade zip that comes out the same length as the last one won't be uploaded; check its size, as with `index.pck`.

**Checked** on 2026-10-27: launched with `--audio-driver Dummy` (so it stayed quiet), it opened a responding window titled "Asteroids" within ten seconds and was closed.

The site doesn't link to the download yet.

## Card image

`public/images/projects/asteroids.webp`, the title screen, with an 8-second `settle` while the engine loads.
