# High School Portfolio

Jake's 2012 portfolio from the end of Coalinga High School, "Hello World!", with a parallax city skyline scrolling behind it. The folder is `public/projects/highschool/oldSite/`; the card id is `highschool-portfolio`. It came from the `misc` folder of his old-projects archive.

`public/projects/highschool/` holds Jake's first two websites, and each is its own card: this one and [JAKE's Index](jakes-index.md).
- **One card each since 2026-10-27:** until then they shared a single "High School Sites" card (`highschool`) that framed a hand-written hub page linking both. Jake asked for every project to be its own card, so the hub (`highschool/index.html`) was deleted. The deployed copy stays live until it's removed in cPanel.
- **Old links:** `/project/highschool` redirects to this card (`movedProjects` in `constants.ts`).
- **The old card image:** `highschool.webp` stays in `public/images/projects/` as archive.

## Preview

The card frames `oldSite/index.static.html`, which `yarn projects:convert` writes from `oldSite/index.html` with one fix, since 2026-10-28: the skyline scrolls again.
- **Why it stopped:** jQuery Spritely (`jquery.spritely-0.6.1.js`) took `window.Touch` to mean an iPhone, which only iPhones had in 2012. Every browser has it now, so its iPhone path ran for the bird sprite the page doesn't have, threw, and the clouds and the two city layers never started panning.
- **The fix:** the copy loads `jquery.spritely-0.6.1.static.js`, whose touch check also wants a touch screen and an element. It's the highschool entry's last literal fix in `scripts/convert-php-sites.mjs`, limited to `oldSite/` (a fix's third entry names the folder it applies to).
- Its "Previous site layout" link goes to `oldSite/OldSite/OldSite.html`.
- The Greenfoot Pokémon page it links is an export without its jar, so it doesn't run. The working game is its own card ([greenfoot-pokemon.md](greenfoot-pokemon.md)).
- Its three JotForm embeds were deleted at JotForm, so they showed its "missing form" page (and the https site blocked their `http://` scripts anyway). Since 2026-10-29 the copy has none: the language poll beside the résumé link is gone, and the comment box and five-star rating are look-alikes that submit nowhere ([README.md](README.md#how-previews-run)).
- `highschool/inventory/` is a Java class exercise, source only, and isn't linked from either card.

## Things to know

The page and the layout before it show Jake's old phone number and email, and link `Resume.pdf`. The same page is also in NinjaDonut's copy, at `ninja-donut/Pages/Students/JakeMotta/`, which the converter writes as `index.static.html` with the same forms (NinjaDonut's student page links that). Both were in the repo, and deployed, before this card was added. On 2026-10-26 Jake chose to leave the contact details and the résumé link as they are, so don't strip them from the preview.

## Card image

`public/images/projects/highschool-portfolio.webp`, the top of the fixed copy with the skyline. The card shows on the board itself, so its shot hides the contact line (its `run` in the `SHOTS` list) and the phone number and email don't end up in the image. The page keeps them.
