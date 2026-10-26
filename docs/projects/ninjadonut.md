# NinjaDonut

Games, comics and odds and ends, starring a very serious donut. Originally at `jakemotta.com/NinjaDonut/` and NinjaDonut.net. The folder is `public/projects/ninja-donut/`; the card id is `ninjadonut`.

## Preview

The original PHP site, rendered to static pages by `scripts/convert-php-sites.mjs` (its `ninja-donut` entry): each `X.php` becomes an `X.html` beside it, and links to the old `jakemotta.com/NinjaDonut/` address and to `.php` pages point at those `.html` pages. Scripts that hold such links (`gamePick.js`, `randomSelect.js`, `randomStudent.js`) get `X.static.js` copies with the links fixed.

The games are Flash. Ruffle (`public/vendor/ruffle/`) plays them; the converter adds its script to every page with Flash.

**The Games page.** The category links (Action, Adventure…) are `javascript:void(0)` links that expand a list in place, and picking a game from a list runs `gamePick()`, which loads `Games/<Name>.html` in the same frame. The viewer leaves `javascript:` links alone, so none of this opens a new tab. That was a bug until 2026-10-26, when the viewer gave such links a blank new tab.

## Kept, but never published

Every `.php` file stays as the converter's source and is pruned from the build. They were uploaded once, by the first successful deploy, and moved to cPanel's Trash on 2026-10-26.

## Card image

`public/images/projects/ninjadonut.webp`, taken by `yarn projects:screenshot ninjadonut` in a 960-wide viewport. The site is a fixed 960px wide, so a wider shot leaves empty margins.
