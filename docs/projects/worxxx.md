# Worxxx PM

A client site Jake built for Worxxx Performance and Machine, a motorcycle race shop in Lemoore, California (December 2013 to January 2014). The folder is `public/projects/motorsport/worxxx/`; the card id is `worxxx`.

It's one of three motorsport sites that shared a "Motorsport Sites" card until 2026-10-27; why they were split, and where the old card's links go, is in [team-safe.md](team-safe.md).

## Where it came from

Copied on 2026-10-26 from `Z:\Old Computer\Documents\DropboxStuff\Worxxx`: 15 plain HTML pages, 2.6 MB with their images. Only the files the pages use were copied, byte for byte, with their dates.

## Preview

The site runs as plain HTML, but every page is listed in its `motorsport/worxxx` entry in `scripts/convert-php-sites.mjs` and written as `X.static.html`. The card frames `index.static.html`.
- **Why every page:** the pit stop kit page's menu links to `Kits/About.html` and four other pages that live one folder up, which was broken on the live site too. Its `redirects` fix those links, and every page that leads to it has to be a listed page for the fix to be reached.
- **Search box:** the Google site search in the menu bar no longer exists. Its `cse.js` is refused by the browser (`ERR_BLOCKED_BY_ORB`), and the box stays empty.
- **Placeholder copy:** the About page is still the trivia filler Jake put there, and some prices say `$xx.xx`. That's the site as it was.
- **External links:** the map and the links page go to outside sites. The viewer opens them in a new tab.

## Left out

Don't restore any of it to fill a gap.
- `Form/` and `freecontactformsettings.php`: a PHP contact-form kit that no page uses. The settings file wasn't opened.
- `Images/pngs/` and `Stuff/`: Fireworks sources and raw photos, plus a shop-rate spreadsheet that wasn't opened.
- The libraries the pages don't load: nivo-slider, the navigation-menu demos, `shopcart`, and PikaChoose's examples.

## Card image

`public/images/projects/worxxx.webp`, the home page at the default 1280 width.
