# High School Sites

Jake's first websites, from Coalinga High School: JAKE's Index, a Flash homepage for his web design assignments (2011), and his 2012 portfolio with a parallax city skyline. The folder is `public/projects/highschool/`; the card id is `highschool`. It came from the `misc` folder of his old-projects archive.

## Preview

The folder never had a front page, so `index.html` is a hand-written hub that links to the two sites. The card frames the hub.

- **JAKE's Index** (`flashIndex/`) is written as `FlashIndex.static.html` by `scripts/convert-php-sites.mjs` (its `highschool` entry). The converter adds Ruffle and fits the movie into whatever frame it's in.
  - **Sizing:** the movie is a fixed 1280×768. Stretching the player to fit doesn't work, because once the movie is clicked it changes its own scale mode and shrinks into a corner. So the player keeps its size, and a small script scales the whole thing down and centers it.
  - **Dead buttons:** the buttons link to the class server, `chsprogramming.com`, which is gone. Those links are inside the SWFs, so they can't be rewritten. Everything else still plays, including the Pac-Man.
- **The 2012 site** (`oldSite/index.html`) runs as-is.
  - Its "Previous site layout" link goes to `oldSite/OldSite/OldSite.html`.
  - The Greenfoot Pokémon page it links is an export without its jar, so it doesn't run.
  - Its three JotForm embeds are `http://` scripts: they load in dev, but the https site blocks them.
- `inventory/` is a Java class exercise, source only, and isn't linked.

## Things to know

The 2012 page and the layout before it show Jake's old phone number and email, and link `Resume.pdf`. The same page is also in NinjaDonut's copy, at `ninja-donut/Pages/Students/JakeMotta/`. Both were in the repo, and deployed, before this card was added. On 2026-10-26 Jake chose to leave the contact details, the résumé link and the JotForm embeds as they are, so don't strip them from the previews.

## Card image

`public/images/projects/highschool.webp` is shot from the Flash index rather than from the hub.
