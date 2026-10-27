# Coloris

An unfinished top-down RPG Jake worked on in Greenfoot (Java) from October 2013 into 2014. Huey walks a scrolling map of forest, hills and stairs, and the number keys change his color. There are no enemies, goals or sounds yet; blood and injury effects are drawn but switched off in the code. The scrolling comes from danpost's `SWorld` class (v2.0, January 2013), shared on greenfoot.org. The folder is `public/projects/coloris/`; the card id is `coloris`.

## Preview

`index.html` is a copy of the isGuy page and runs the same way: CheerpJ, the jar as an applet, a Play button, Run. See [isguy.md](isguy.md) for how that works and for CheerpJ's license. It's 616×469, a 600×400 world plus Greenfoot's border and control bar. Coloris has no sound, so pressing Play leaves the site's music playing.

Controls, from `Huey.java`: the arrow keys walk, and 1 to 6 set Huey's color (1 white, 2 black, 3 red, 4 green, 5 blue, 6 yellow).

**Which Coloris.** The archive has four copies:

| Folder | What it is |
| --- | --- |
| `Random/OldDropBox/Greenfoot/ColorisScroll/Coloris` | Source from October 2013 to March 2014, compiled on 2014-03-10 (Java 6). Three connected areas with hills, a cliff and stairs. **This one.** |
| `Coloris/Coloris2` | Source from June 2014, recompiled on 2017-05-10 (Java 8). One area; its stairs lead nowhere. |
| `Coloris/Coloris` | The June 2014 source with `gLevelOne` and `gLevelTwo`, but no compiled classes. Without a JDK it can't be built. |
| `Greenfoot/Coloris/Coloris` | A two-class prototype from late 2013. |

ColorisScroll has the most to walk around. Coloris2 also runs (it was built and tested the same way) and is the fallback if Jake prefers the later code.

**The jar is new.** Greenfoot never exported Coloris, so `coloris.jar` (5.7 MB, 491 entries) was assembled on 2026-10-26 from the ColorisScroll folder with a one-off Python script (`zipfile`; not kept). Nothing in it was changed or recompiled. In it:
- **The game:** ColorisScroll's 28 `.class` files and `project.greenfoot`, and its whole `images/` folder (29 files, including the 3.8 MB `RedMap.jpg`).
- **Its sprites:** the 85 files the source loads as `"../Sprites/…"` (Huey's walking frames in six colors, his brush, the blood and injury frames), from the `Sprites` folder beside the project. In the IDE, Greenfoot found them through the project's parent folder. In a jar each is stored twice:
  - `../Sprites/<path>` is the name Greenfoot's lookup, `getResource(name)`, finds;
  - `Sprites/<path>` is what Java then opens, because the `jar:` URL it gets back drops the `../`.

  The rest of the `Sprites` folder, including Pokémon Emerald sprite sheets, is unused and left out.
- **The Greenfoot 3.0.4 runtime:** `greenfoot/`, `bluej/`, `javazoom/` and the six control-bar icons (`greenfoot.png`, `noParking.png`, `pause.png`, `reset.png`, `run.png`, `step.png`), 260 entries copied byte for byte from `isGuyFinal.jar` ([isguy.md](isguy.md)). The classes were compiled against Greenfoot 2.x and run on it unchanged.
- **Settings:**
  - `standalone.properties` is `isGuyFinal.jar`'s, with `main.class=greenWorld` and `project.name=Coloris`;
  - `soundindex.list` is empty, since Coloris has no sounds;
  - the manifest names `greenfoot.export.GreenfootScenarioMain`, so `java -jar coloris.jar` runs it on the desktop too.

`poster.webp` is the starting view, captured from the game running in CheerpJ.

**The art.** The trees, grass and hills look like they come from a Pokémon tileset, and the `Sprites` folder holds Pokémon Emerald sheets. Where Huey's frames came from hasn't been checked.

**Verified:**
- with `java -jar` on the desktop: the jar opens with no errors (Coloris2 the same);
- in headless Chrome, served from `public/`: the map loads, Run starts it, walking scrolls the world, and the number keys change Huey's color;
- at 375 px wide, after scrolling the frame sideways to the Run button;
- inside a same-origin frame, Play leaves the parent page's music playing.

## Left out on purpose

- The other three copies, the `.java` sources and the unused sprites.
- `Random/OldDropBox/coloris.gif` (January 2014, 601×400, 305 frames): a recording of the same first corridor, made redundant by the running game.

## Card image

`public/images/projects/coloris.webp`. Either the page before Play (the poster under the Play button) or, with `#play`, the game once CheerpJ has loaded.
