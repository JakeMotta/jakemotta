# Computer Desk

A 360° turntable of a computer desk Jake modeled in Maya in March 2014: drawers pulled out, a keyboard tray, a CPU shelf and castors, turning once round on a grey backdrop. Jake approved it on 2026-10-29. The folder is `public/projects/maya-desk/`; the card id is `maya-desk`.

## Preview

`index.html` is a hand-written video page, a sibling of [Escaping Confinement](escaping-confinement.md)'s: the turntable in a `<video>` with a poster frame, and the title and a line about it under it. It's silent, so it plays on its own (`autoplay muted loop playsinline`), and it never pauses the site's music. With `prefers-reduced-motion` it waits for a click.

**The video file.** `computer-desk.mp4` (2.0 MB, 1280×720, H.264, no sound, 20.8 s) was encoded on 2026-10-29 from `Z:\Old Computer\Documents\Maya\Room\Renders\360Rotation\New_Project\images\untitled.1.tga` to `untitled.499.tga`.
- **Which render:** `360Rotation` holds two 500-frame renders of the same turn, both 1280×720 TGAs made on the night of 19 March 2014. `Room_Proj/images/` was rendered in ten minutes, the desk on plain black with no shadows; `New_Project/images/` took nearly two hours, with shadows on a graded backdrop. The page uses `New_Project`'s.
- **The loop:** the scene (`Room/DeskRotate.ma`) keys the desk from 0° at frame 1 to −360° at frame 500, easing in and out, at Maya's 24 fps (`film`). Frame 500 is the same pose as frame 1, so it's left off, and the video loops without a jump: the desk slows to a stop facing front and sets off again.
- **How it was encoded:** Blender 4.5's video sequencer at "High" quality, with the `Standard` view transform so the colors pass through unchanged, as for Escaping Confinement. Blender writes the MP4's index at the end, so a small script moved it to the front afterwards, letting the video start before it has fully downloaded.
- **Poster:** `poster.jpg` is frame 1, the desk from the front.

## Left out on purpose

- **The "Andy" rig test** (`New_Project/movies/andyRigv*.avi`), which isn't the desk.
- **The quick render** in `Room_Proj/images/`, and the test frames in both `images/tmp/` folders.
- **The Maya scenes** (`Room.ma`, `DeskRotate.ma`, `New_Project/scenes/COMP.ma`) and the project folders' textures.

## Card image

`public/images/projects/maya-desk.webp`, the video itself, clipped from the page.
