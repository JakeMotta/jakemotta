# Escaping Confinement

A five-minute animated short Jake made in Maya in spring 2012, about a desk fan that comes to life and tries to escape. He did everything, as its closing credit says: directing, modeling, coloring, animation and rendering. The folder is `public/projects/escaping-confinement/`; the card id is `escaping-confinement`.

## Preview

`index.html` is a hand-written page with the film in a `<video>`, a poster frame, and the title and credits under it.

**The video file.** `escaping-confinement.mp4` (18 MB, 772×768, H.264 with AAC sound) was re-encoded on 2026-10-26 from `FinalRender/Try5.mpeg`.
- **Which render:** the archive has four renders of the same cut, all exported on 7 April 2012: `EscapingConfinement.3gp` and `Try3.3gp` (352×288), `Try4.avi` (720×480, 1.1 GB) and `Try5.mpeg` (1024×768, 434 MB). `Try5` is the sharpest and the last one exported.
- **Cropping:** its picture is pillarboxed in a 1024-wide frame, so the encode crops it to the 772 columns that hold the picture.
- **How it was encoded:** Blender's video sequencer, with the `Standard` view transform so the colors pass through unchanged. ffmpeg isn't installed here.
- **Poster:** `poster.jpg` is frame 150, the title on the wall.

**Pausing the site's music.** The site's music plays in the page around the viewer's frame, so the film page pauses the parent page's `<audio>` when the film starts. The player's own pause handler then updates its buttons. This reaches into the app's page directly, which only works because the preview is same-origin. A `{type: 'jakemotta:media-playing'}` message for the viewer to handle is planned for the Ambii Business demos; once that exists, this page should send it instead.

## Left out on purpose

The other renders, the Maya scenes (`.mb`), the Premiere project and its preview files, and the sound effects all stay in the archive.

## Card image

`public/images/projects/escaping-confinement.webp`, the page with its poster frame.
