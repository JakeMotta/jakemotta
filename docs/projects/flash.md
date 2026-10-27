# Flash

The Flash pieces Jake picked on 2026-10-26 from his archive: cartoons (NinjaDonut, Rocket Kyle, Samus and others) and caricatures of friends. They date from 2012 to 2019. The folder is `public/projects/flash/`; the card id is `flash`.

## Preview

`index.html` is a hand-written gallery in two sections: Cartoons and Friends.
- **Tiles:** each tile is a thumbnail. Clicking one creates a single Ruffle player in a `<dialog>`, sized to that movie's stage (each tile's `data-w` and `data-h`). Closing the dialog throws the player away, so nothing keeps running or making noise.
- **Music:** opening a piece pauses the site's music, the same way the Escaping Confinement page does ([escaping-confinement.md](escaping-confinement.md)).
- **Ruffle:** the page loads Ruffle from `/vendor/ruffle/`. It calls `player.ruffle().load()`, the newer API, and falls back to `player.load()` for older builds.

**Files.** All 16 SWFs are self-contained: none loads another file. They're copied unchanged into `swf/` under plain names:

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
| `benny.swf` | `Flash/Benny.swf` | 2012-04 |
| `peter.swf` | `Flash/Peter.swf` | 2012-04 |
| `m3.swf` | `Flash/M3.swf` | 2012-04 |
| `medina.swf` | `Flash/Medina.swf` | 2013-11 |
| `andrew.swf` | `Flash/andrew.swf` | 2014-12 |
| `chu-chu.swf` | `Flash/chuchu.swf` | 2015-06 |
| `thereon.swf` | `Flash/thereon.swf` | 2017-12 |

`thumbs/` holds a 640×480 WebP of each, taken through Ruffle about 3.5 seconds in. They were made with a one-off script (headless Chrome, a small local server, the same Ruffle). Retake a thumbnail if its movie changes.

## Left out on purpose

The archive has 68 SWFs, in `Old Computer/Documents/Flash` and `DropboxStuff/KevinsPics`, many of them duplicates.
- **Jake's own picks:** he left out his JM logo and self-portrait, `NippleGame`, `pic` (a photo of real people), Braum (official League art) and the test files (`BoxTrial`, `delete`, `run`, `sticky`).
- **Taken off on 2026-10-27:** Jake asked for Shootorial (`Flash/Shootorial/Ship.swf`, a side-scrolling shooter and the gallery's only game, which took its Game section with it), Pokéball (`Flash/Box/Poke.swf`) and Kev (`Flash/KevStuff/Face.swf`) to be removed. Their SWFs and thumbnails were deleted from `swf/` and `thumbs/`. They had been deployed, so the six files stay live until they're moved to the Trash in cPanel.
- **Kevin pieces:** Jake asked to include the "Kevin" coloring book (`KevinsPics/`, 2011–12) and `KevinGayy` / `KevinGayyy` (2017). Claude declined to publish them: they pair ethnic, terrorism and anti-gay jokes with a real person's full name, on a public site. They're left out until Jake adds them himself.

## Card image

`public/images/projects/flash.webp`, the top of the gallery.
