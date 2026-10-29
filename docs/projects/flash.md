# Flash

The Flash pieces Jake picked on 2026-10-26 from his archive: cartoons (NinjaDonut, Rocket Kyle, Samus and others) and caricatures of friends. They date from 2012 to 2019. The folder is `public/projects/flash/`; the card id is `flash`.

**Where it's listed:** in the Art section of the all-projects overlay, first, ahead of Sketchbook, as Jake asked on 2026-10-28. Until then it was in Animation. Its tags (Flash, Animation) are unchanged.

## Preview

`index.html` is a hand-written gallery in three sections: Cartoons, Web design class (since 2026-10-29) and Friends.
- **Tiles:** each tile is a thumbnail. Clicking one creates a single Ruffle player in a `<dialog>`, sized to that movie's stage (each tile's `data-w` and `data-h`). Closing the dialog throws the player away, so nothing keeps running or making noise.
- **Music:** opening a piece pauses the site's music, the same way the Escaping Confinement page does ([escaping-confinement.md](escaping-confinement.md)).
- **Ruffle:** the page loads Ruffle from `/vendor/ruffle/`. It calls `player.ruffle().load()`, the newer API, and falls back to `player.load()` for older builds.

**Files.** All 19 SWFs are self-contained: none loads another file. They're copied unchanged into `swf/` under plain names:

| Copy | Original | Date |
| --- | --- | --- |
| `pacman-ghost.swf` | `Flash/Box/Ghost.swf` | 2012-07 |
| `ninjadonut.swf` | `Flash/Box/Ninjadonut.swf` | 2012-06 |
| `ninjadonut-2.swf` | `Flash/Box/MyNinjaDonut2.swf` | 2012-06 |
| `rocket-kyle.swf` | `Flash/Box/Thing.swf` | 2012-08 |
| `kyle.swf` | `Flash/Box/Thing2.swf` | 2012-08 |
| `epic-kyle.swf` | `Flash/KyleNew.swf` | 2012-08 |
| `dinosaur.swf` | `Flash/dina.swf` | 2015-09 |
| `light-switch.swf` | `Flash/lightswitch.swf` | 2017-11 |
| `samus.swf` | `Flash/samus2.swf` | 2019-11 |
| `mole-day.swf` | `Chagoyan/Web2/MoleDay.swf` | 2012-05 |
| `blaster.swf` | `Chagoyan/Web2/Blaster.swf` | 2012-03 |
| `wtf.swf` | `Chagoyan/Web2/WTF.swf` | 2012-01 |
| `benny.swf` | `Flash/Benny.swf` | 2012-04 |
| `peter.swf` | `Flash/Peter.swf` | 2012-04 |
| `m3.swf` | `Flash/M3.swf` | 2012-04 |
| `medina.swf` | `Flash/Medina.swf` | 2013-11 |
| `andrew.swf` | `Flash/andrew.swf` | 2014-12 |
| `chu-chu.swf` | `Flash/chuchu.swf` | 2015-06 |
| `thereon.swf` | `Flash/thereon.swf` | 2017-12 |

`thumbs/` holds a 640×480 WebP of each, taken through Ruffle about 3.5 seconds in. They were made with a one-off script (headless Chrome, a small local server, the same Ruffle). Retake a thumbnail if its movie changes.

**The web design class pieces** were added on 2026-10-29, when Jake approved them from a second sweep of the archive. They come from `Old Computer/Documents/Chagoyan/Web2`, his second-semester folder for the 2012 high school web design class that [JAKE's Index](jakes-index.md) also came from. The dates are the `.fla` files' (MoleDay.swf and WTF.swf were re-saved in 2017). Mole Day Quiz is an interactive quiz; its title screen says "Brought to you in part by Jacob Motta", and the folder also holds a classmate's Mole Day site (`Jose/Mole Day`), so it may have been a shared assignment. Blaster is a single drawing, and WTF a few seconds of a stick figure. In the picker they were offered for the High School Portfolio, but that card frames the old site itself and has no hub to add them to, so they went here, beside the other Flash. Their thumbnails were taken the same way as the others, through Ruffle in headless Chrome.

## Left out on purpose

The archive has 68 SWFs, in `Old Computer/Documents/Flash` and `DropboxStuff/KevinsPics`, many of them duplicates.
- **Jake's own picks:** he left out his JM logo and self-portrait, `NippleGame`, `pic` (a photo of real people), Braum (official League art) and the test files (`BoxTrial`, `delete`, `run`, `sticky`).
- **Taken off on 2026-10-27:** Jake asked for Shootorial (`Flash/Shootorial/Ship.swf`, a side-scrolling shooter and the gallery's only game, which took its Game section with it), Pokéball (`Flash/Box/Poke.swf`) and Kev (`Flash/KevStuff/Face.swf`) to be removed. Their SWFs and thumbnails were deleted from `swf/` and `thumbs/`. They had been deployed, so the six files stay live until they're moved to the Trash in cPanel.
- **From the web design class:** `Titlescreen.swf` is the class site's 800×50 menu bar (First Semester, Second Semester), not a piece of its own, and `Shotgun` survives only as a `.fla`, which can't play without being exported from Flash. `Background.swf` and `Bottom.swf` are parts of the class site's layout.
- **Kevin pieces:** Jake asked to include the "Kevin" coloring book (`KevinsPics/`, 2011–12) and `KevinGayy` / `KevinGayyy` (2017). Claude declined to publish them: they pair ethnic, terrorism and anti-gay jokes with a real person's full name, on a public site. They're left out until Jake adds them himself.

## Card image

`public/images/projects/flash.webp`, the top of the gallery.
