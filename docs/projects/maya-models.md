# Maya Models

Jake's first 3D models, made in Maya from 2010 to 2014: guns, a raven, a car, a podracer, a few characters and robots, a skateboard, the Dragon Wasp, the kitchen and fan from [Escaping Confinement](escaping-confinement.md), two turntables and a toon-shaded spin, and the computer desk from 2014. Jake approved them on 2026-10-29. The computer desk had a card of its own (`maya-desk`) for a day, until Jake had it moved in here on 2026-10-29; its old address, `/project/maya-desk`, opens this one (`movedProjects`). The folder is `public/projects/maya-models/`; the card id is `maya-models`.

## Preview

`index.html` is a hand-written gallery, a dark sibling of [Sketchbook](sketchbook.md)'s: 23 stills and 4 videos in a grid, newest first. Each tile is a plain link to its file; clicking one opens it full size in a `<dialog>` (a video opens playing, with controls), and clicking again or Escape closes it.

**The videos** sit in the grid as silent, looping `<video>` tiles with a poster. They play only while on screen (an `IntersectionObserver`), and not at all with `prefers-reduced-motion`. None has sound, so the page never pauses the site's music.

**Dates.** The stills carry no metadata: they're the copies Jake posted to Facebook, saved later by Google Drive. Their years are estimated from the Facebook photo ids in the file names, which rise with time, against albums of his whose dates are known (`LATrip2010`, `Prom2011`, `SpringBreak2013` and others in the same folder): the `3DModels` album and the podracer and big-eyed character sit at or before the 2010 trip, the skateboard just before 2011's, the Dragon Wasp, green guy and robot after Prom 2011, and the kitchen in early 2012, which matches the dates of the Maya scenes in `FanProject/` (February to March 2012). Elipse's frames are dated 18 December 2012. The two Facebook videos aren't dated on the page: their ids only say when they were uploaded (2013).

## Which originals became which files

Stills from `Z:\Old Computer\Drive Photos\3DModels_7dXxfUxyqQ` (A) and `Maya3DDesign_bkJ-23fHDQ` (B). Most are copied unchanged: they're already JPEGs between 640 and 1230 pixels wide, so re-encoding would only lose quality. Four are cropped (Blender, JPEG quality 85), marked below.

| File in `models/` | Original | Year |
| --- | --- | --- |
| `kitchen-fan.jpg` | B `466521_336588816387499_…` | 2012 |
| `kitchen.jpg` | B `460340_339751342737913_…` | 2012 |
| `dragon-wasp.jpg` | B `192878_225516537494728_…` | 2011 |
| `dragon-wasp-wires.jpg` | B `287207_225516504161398_…` | 2011 |
| `dragon-wasp-up-close.jpg` | B `291595_225516584161390_…` | 2011 |
| `green-guy.jpg` | B `267098_202908669755515_…` | 2011 |
| `robot.jpg` | B `272907_202908679755514_…` | 2011 |
| `skateboard.jpg` | B `209826_181941165185599_…`, cropped to Maya's viewport (963×453) | 2011 |
| `skateboard-wires.jpg` | B `191244_181941145185601_…`, cropped the same way | 2011 |
| `podracer.jpg` | B `163201_157456714300711_…`, a 1-pixel frame line trimmed off | 2010 |
| `big-eyes.jpg` | B `131679_159648920748157_…` | 2010 |
| `big-eyes-head.jpg` | B `164850_159609187418797_…` | 2010 |
| `car.jpg` | A `35407_116263768420006_…` | 2010 |
| `car-front.jpg` | A `36862_116264298419953_…` | 2010 |
| `raven.jpg` | A `28562_105937506119299_…` | 2010 |
| `raven-eye.jpg` | A `28562_105937519452631_…` | 2010 |
| `pulse-rifle.jpg` | A `28562_105937856119264_…` | 2010 |
| `pulse-rifle-back.jpg` | A `28562_105937859452597_…` | 2010 |
| `rifle.jpg` | A `30112_109913169055066_…` | 2010 |
| `pistol.jpg` | A `31812_106169362762780_…` | 2010 |
| `knife.jpg` | A `31812_106442686068781_…` | 2010 |
| `little-guy.jpg` | A `28562_105937526119297_…` | 2010 |
| `ninjadonut-com.jpg` | A `28562_105940066119043_…`, a screenshot of Maya cropped to the letters (370×185) | 2010 |

The skateboard and NinjaDonut.com shots were screenshots of the whole Maya window, taskbar and all; the crops keep only the viewport.

Videos in `videos/`, each with a poster frame (`<name>.jpg`, its first frame):

| File | Original | How |
| --- | --- | --- |
| `elipse.mp4` (1.2 MB, 1024×768, 18.8 s) | `Z:\Old Computer\Documents\Maya\Elipse\Images\Test\New_Project\images\Test3.1.jpg` to `Test3.450.jpg` | Encoded at 24 fps, Maya's default (`film`). Frames 451–455 are identical copies of 450 and are left off, so the loop doesn't stall. |
| `computer-fan.mp4` (1.7 MB, 640×480, 29.9 s) | `Z:\Old Computer\Drive Photos\videos\1163792_573089096070802_17415_n_300551119991269.mp4` | Re-encoded without its sound track (see below), at its own 29.97 fps. |
| `computer-desk.mp4` (2.0 MB, 1280×720, 20.8 s) | `Z:\Old Computer\Documents\Maya\Room\Renders\360Rotation\New_Project\images\untitled.1.tga` to `untitled.499.tga` | See The computer desk below. |
| `car.mp4` (1.4 MB, 320×240, 50 s) | `Z:\Old Computer\Drive Photos\videos\1294840_585509568162088_25300_n_116594528386930.mp4` | Copied unchanged: already H.264, silent, with its index at the front. |

**How the videos were encoded.** Blender 4.5's video sequencer (ffmpeg isn't installed here), H.264 at Blender's "High" quality, no audio, with the `Standard` view transform so the colors pass through unchanged, as for [Escaping Confinement](escaping-confinement.md). Blender writes the MP4's index (`moov`) at the end, so a small script moved it to the front afterwards, letting a video start before it has fully downloaded.

**Elipse doesn't loop seamlessly.** It isn't a full turn: the gold emblem tumbles, then spins fast in place, and the loop cuts from that spin back to the start. Jake chose to put it in the gallery rather than give it a card.

**The computer desk** (March 2014) is a 360° turntable: drawers pulled out, a keyboard tray, a CPU shelf and castors, turning once round on a grey backdrop. It had its own video page in `public/projects/maya-desk/` until it moved in here; that page is gone from the repo but still on the server, which never deletes.
- **Which render:** `360Rotation` holds two 500-frame renders of the same turn, both 1280×720 TGAs made on the night of 19 March 2014. `Room_Proj/images/` was rendered in ten minutes, the desk on plain black with no shadows; `New_Project/images/` took nearly two hours, with shadows on a graded backdrop. The gallery uses `New_Project`'s.
- **The loop:** the scene (`Room/DeskRotate.ma`) keys the desk from 0° at frame 1 to −360° at frame 500, easing in and out, at 24 fps. Frame 500 is the same pose as frame 1, so it's left off, and the video loops without a jump.
- **Poster:** `computer-desk.jpg` is frame 1, the desk from the front.

## Left out on purpose

- **Not Jake's:** a colored side view of the pulse rifle (A `28562_105937862785930_…`, 314×244) and a photo of a knife on white (A `31812_106442856068764_…`), both reference pictures.
- **Near-duplicates:** the second full raven (A `…105937512785965…`), the first pulse rifle side view (A `…105937522785964…`), the other rifle side view and its two close-ups (A `…109913162388400…`, `…109913172388399…`, `…109913175721732…`), the other pistol angle (A `…106169356096114…`), the third car shot (A `…116264758419907…`), the big-eyed character's other turnarounds (B `132372_…`, `133556_…`), the podracer's four-view (B `133914_…`), the green guy's earlier stages (B `265929_…`, `266969_…`), the robot's four-view (B `266552_…`), the Dragon Wasp's green wireframe (B `285815_…`) and the dark, untextured kitchen (B `456602_…`).
- **Screenshots where the model is too small to see** or the window is mostly something else: the four of the pulse rifle in Maya (A `…105940042785712…` to `…105940059452377…`), the second NinjaDonut.com (A `…105940069452376…`), the two of an unclear winged shape (A `…105940079452375…`, `…105940082785708…`), the skateboard's wheel and truck wireframes (B `191404_…`, `194456_…`, `201974_…`) and the fan blade with a calculator open beside it (B `324808_…`).
- **Drawings, not models:** the outlines of a person from the front and side and of the raven (A `…105937839452599…`, `…105937846119265…`, `…105937852785931…`), the guides the models were built over.
- **An unclear part** (A `31812_106442676068782_…`), a small grey piece on its own.
- **The fan video's sound track.** It's loud from start to finish, so it was probably added when the video was put together (Maya renders no sound); the gallery's turntables are all silent.
- **The desk's other files:** the "Andy" rig test (`New_Project/movies/andyRigv*.avi`), which isn't the desk; the quick render in `Room_Proj/images/` and the test frames in both `images/tmp/` folders; the Maya scenes (`Room.ma`, `DeskRotate.ma`, `New_Project/scenes/COMP.ma`) and their textures.
- **Elipse's other files:** the 455 `asdfN.iff` frames (Maya's own format, the same animation) and the test renders in `images/tmp/`.

## Card image

`public/images/projects/maya-models.webp`, the top of the gallery. Computer Desk's own card image, `maya-desk.webp`, stays in `public/images/projects/` with the other old ones.
