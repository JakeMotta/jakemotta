# Asteroids

Jake's take on the arcade classic, built in Godot 4.5 in January 2026: a start menu, levels, UFOs, screen shake, a game-over screen, and his own music made in FL Studio. The source is its own repository, `C:\Users\Jake\Documents\Github\asteroids` (10 commits, last one on 2026-01-08). The folder here is `public/projects/asteroids/`; the card id is `asteroids`.

## Preview

`public/projects/asteroids/` is Godot's own web export, unchanged: `index.html` (Godot's page), `index.js`, `index.wasm` (the engine, about 36 MB, roughly 9 MB gzipped), `index.pck` (the game, 0.8 MB) and the audio worklets. The card frames `index.html`, and the game fills the frame.

**How it was exported (2026-10-26).**
- **Godot:** 4.5-stable, downloaded with Jake's OK from the official GitHub release, with checksums verified. It's in `C:\Users\Jake\Tools\godot-4.5\editor\`. Only the web templates were installed, to `%APPDATA%\Godot\export_templates\4.5.stable\`.
- **Source left alone:** the export ran from a copy of the project, without `.git` and `.godot`, so the asteroids repository has no export preset.
- **Preset:** a "Web" preset with threads off, so the page needs no cross-origin isolation headers on the static host. `.flp` files (FL Studio projects) are excluded, and the canvas fills the window. The project's renderer is Forward+, but web exports always use the Compatibility renderer, so the project didn't need changing.
- **The preset as used:**

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
html/head_include="<script>(function(){var done=false;function pause(){if(done)return;done=true;try{if(window.parent!==window)window.parent.document.querySelectorAll('audio').forEach(function(a){a.pause()})}catch(e){}}addEventListener('pointerdown',pause);addEventListener('keydown',pause)})();</script>"
html/focus_canvas_on_start=true
progressive_web_app/enabled=false
```

To re-export: copy the project somewhere, put that file in it as `export_presets.cfg` (UTF-8 **without** a byte-order mark; Godot won't read the preset otherwise), and run:

```
Godot_v4.5-stable_win64_console.exe --headless --path <copy> --import
Godot_v4.5-stable_win64_console.exe --headless --path <copy> --export-release "Web" <copy>\web\index.html
```

Then copy `web/` over `public/projects/asteroids/`. Stop `yarn dev` first, since copying into `public/` while it runs can crash it.

**Music.** The game plays its own music, so the `head_include` script pauses the site's music on the first click or key press in the frame, the same way the film and Flash pages do.

**Hosting notes.**
- **The `.wasm` type:** `public/.htaccess` doesn't declare one. If the host serves `.wasm` without `application/wasm`, the loader logs a warning and falls back to a slower, non-streaming load; it still runs.
- **Re-uploads:** the deploy compares files by size only. A re-export with a new engine build changes `index.wasm`'s size, so it gets uploaded. But a game-only change that happened to keep `index.pck` the same size wouldn't be, so check `index.pck` after a re-export.
- **Exit Game:** the menu's Exit Game does nothing useful in a browser.

**Verified** in Chrome through a local static server: the page loads, the title screen's attract mode runs, and Start Game starts a game with three lives. Steering and shooting weren't checked properly, because the testing tools tap keys faster than a game frame.

## Card image

`public/images/projects/asteroids.webp`, the title screen, with an 8-second `settle` while the engine loads.
