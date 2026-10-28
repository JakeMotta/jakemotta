# Noah Garza Racing

**Off the project list since 2026-10-28,** as Jake asked: no card, and no `SHOTS` entry. The files stay as archive and are still converted; the deployed pages stay live at their addresses until removed in cPanel. To bring it back, restore its `homeProjectList` entry and `SHOTS` entry from git history (before `claude/psycho`).

A one-page client site Jake built for Noah Garza, a young kart racer (December 2012). The folder is `public/projects/motorsport/noah-garza/`; the card id is `noah-garza`.

It's one of three motorsport sites that shared a "Motorsport Sites" card until 2026-10-27; why they were split, and where the old card's links go, is in [team-safe.md](team-safe.md).

## Where it came from

Copied on 2026-10-26 from `Z:\Old Computer\Documents\Websites\Noah`: one page and the 58 resized photos its gallery shows, 6.4 MB. Only the files the page uses were copied, byte for byte, with their dates.

## Preview

The page is written as `index.static.html` (its `motorsport/noah-garza` entry in `scripts/convert-php-sites.mjs`) only to load Google Fonts over https. The card frames it.
- **Panels:** the page opens with just the header. The menu links slide open each panel (About, Achievements, Photos, Sponsors, Schedule).
- **Photos:** the gallery's lightbox runs on the jQuery 1.2.3 bundled with it, and it works.

## Left out

Don't restore any of it to fill a gap.
- `Pictures/Garza/` and the rest of `Pictures/` (2.1 GB of full-size originals) and `Pictures/Resized/Marked/` (watermarked copies the page doesn't use).
- The lightbox's demo page and photos, `Images/*.fw.png` sources, and `Thumbs.db`.

## Things to know

- **Noah's age:** Noah was 11, and the page uses his full name and photos, as the public site did.

## Card image

`public/images/projects/noah-garza.webp`. The page opens on just its header, so the shot runs `aboutDiv()` first (its `run` in the `SHOTS` list) to open the About panel, in a 1000 px window to fit the 960 px site.
