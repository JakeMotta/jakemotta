# isGuy

The Adventures of isGuy, a five-level platformer Jake made in Greenfoot (Java) in March 2013: a stick figure with a gun, lasers, ladders, keys, doors, falling blocks and UFOs. It was published as a Java applet on NinjaDonut ("Project isGuy is finally here!"). The folder is `public/projects/isguy/`; the card id is `isguy`.

This page also covers how all three Greenfoot games run, since they share it. Pokémon ([greenfoot-pokemon.md](greenfoot-pokemon.md)) and Coloris ([coloris.md](coloris.md)) only describe what differs.

## Preview

`index.html` is a hand-written page: the game's frame with a poster and a Play button, a hint line under it, the controls from the game's own How to Play screen, and a note about the game and CheerpJ. The Pokémon and Coloris pages are copies of it with their own text and settings (the variables at the top of the script).

**How the Java runs.** [CheerpJ](https://cheerpj.com/) (Leaning Technologies) runs Java 8 in the browser in WebAssembly.
- **Loading:** nothing loads until Play. Then the page adds CheerpJ's `loader.js` (version 4.3) from `https://cjrtnc.leaningtech.com/4.3/` and calls `cheerpjInit({ status: 'none' })`. CheerpJ fetches its runtime from that CDN and then downloads the whole jar in one request; it doesn't use range requests. isGuy's jar is 40 MB, so the first load is slow.
- **As an applet:** the jar's `greenfoot.export.GreenfootScenarioViewer` is a `JApplet`, so the page adds a `<cheerpj-applet>` with that `code`, the jar as `archive`, and 816×669, the size of the applet tag on the NinjaDonut page. It draws the game with no window frame around it. The applet route needs Java 8, CheerpJ's default.
- **`codebase_lookup=false`:** without this `<param>`, CheerpJ's applet loader asks the server (a `HEAD` request) for every resource the jar doesn't have. Greenfoot looks every image up twice, so for Coloris that was about 90 requests, one at a time: ten seconds at 80 ms each.
- **Loading message:** CheerpJ swaps the element for an `<object>` and paints the applet's window white first, then Greenfoot loads the world's images. The message stays up until a pixel a third of the way down the canvas turns from that white to the game, or for 30 seconds after the window appears.
- **Run:** Greenfoot scenarios start paused behind a Reset / Run bar, as they did on the old sites. There's no autorun setting in the exported viewer, so the hint tells the visitor to press Run (and, here, Start on the title screen).
- **Narrow screens:** before Play the poster is scaled down to fit. Once the game runs it stays at its own size and the frame scrolls sideways, because CheerpJ doesn't map clicks through a CSS transform: a scaled game drew fine but its Run button couldn't be clicked. CSS `zoom` stopped it drawing at all. The page itself never scrolls sideways; at 375 px the frame does, and the hint says so.
- **Keys:** arrow keys and Space are kept from scrolling the page while the game runs. The game only gets keys once it's been clicked, which pressing Run does.
- **`#play`:** `index.html#play` starts without a click, for screenshots.

**Pausing the site's music.** Pressing Play asks the site's player to pause with the `jakemotta:media-playing` message, the same way the Escaping Confinement page does ([escaping-confinement.md](escaping-confinement.md)). isGuy and Pokémon do; Coloris has no sound, so it leaves the music playing (`PAUSE_SITE_MUSIC` at the top of each page's script).

**CheerpJ's license.** The free [Community License](https://cheerpj.com/docs/licensing) covers an individual's personal projects, earning or not, as long as CheerpJ is loaded from `cjrtnc.leaningtech.com`; self-hosting it needs a paid license. It asks for appropriate credit, which is the CheerpJ line on each page. CheerpJ prints a "Community Edition, for personal and non-business use only" banner to the console. Checked on 2026-10-26, when 4.3 was current.

**Files.**
- `isGuyFinal.jar` (39.9 MB) is `Old Computer/Documents/Greenfoot/isGuy/isGuyFinal.jar`, copied unchanged. Jake re-exported the March 2013 project from Greenfoot 3.0.4 on 2017-11-10 (Java 8 classes); its 215 images match the 2013 export. It runs as is with `java -jar` too.
- `poster.webp` is the title screen, captured from the game running in CheerpJ.

**The music.** About 38 MB of the jar is six songs by other artists: The Orbiters, Tiesto & Allure, Adhesive Wombat, Soulero, and Trampboat & Soulero. The game credits them on its Game Info screen and the page names them. They're published as part of the jar: on 2026-10-26 Jake decided to keep them rather than ship a rebuilt, silent jar. Don't strip them unless he asks.

**Verified** in headless Chrome, served from `public/`:
- the page loads, the jar downloads, and the title screen appears;
- Start opens level 1, and the arrow keys, jump and Space (a bullet) work;
- once Run is pressed, CheerpJ plays audio through Web Audio (the music);
- inside a same-origin frame, Play pauses the parent page's music.

Not verified: how the music sounds (the browser ran muted), levels 2 to 5, keys, doors and the ending.

## Left out on purpose

- The 2013 export (`Greenfoot/isGuyExport/`, `isGuyExport.zip`): source and classes but no jar, and the same game.
- The NinjaDonut copy at `public/projects/ninja-donut/Pages/isGuy/` is untouched. Its applet tag points at `isGuyFinalExport/isGuyFinal.jar`, which isn't in the repo.

## Card image

`public/images/projects/isguy.webp`, the page before Play: the title screen poster under the Play button. Before Run the game itself is a black screen (the level's fade-in), so a `#play` shot would show black.
