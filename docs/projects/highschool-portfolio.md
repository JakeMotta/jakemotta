# High School Portfolio

Jake's 2012 portfolio from the end of Coalinga High School, "Hello World!", with a parallax city skyline scrolling behind it. The folder is `public/projects/highschool/oldSite/`; the card id is `highschool-portfolio`. It came from the `misc` folder of his old-projects archive.

`public/projects/highschool/` holds Jake's first two websites, and each is its own card: this one and [JAKE's Index](jakes-index.md).
- **One card each since 2026-10-27:** until then they shared a single "High School Sites" card (`highschool`) that framed a hand-written hub page linking both. Jake asked for every project to be its own card, so the hub (`highschool/index.html`) was deleted. The deployed copy stays live until it's removed in cPanel.
- **Old links:** `/project/highschool` redirects to this card (`movedProjects` in `constants.ts`).
- **The old card image:** `highschool.webp` stays in `public/images/projects/` as archive.

## Preview

`oldSite/index.html` runs as-is, and the card frames it.
- Its "Previous site layout" link goes to `oldSite/OldSite/OldSite.html`.
- The Greenfoot Pokémon page it links is an export without its jar, so it doesn't run. The working game is its own card ([greenfoot-pokemon.md](greenfoot-pokemon.md)).
- Its three JotForm embeds are `http://` scripts: they load in dev, but the https site blocks them.
- `highschool/inventory/` is a Java class exercise, source only, and isn't linked from either card.

## Things to know

The page and the layout before it show Jake's old phone number and email, and link `Resume.pdf`. The same page is also in NinjaDonut's copy, at `ninja-donut/Pages/Students/JakeMotta/`. Both were in the repo, and deployed, before this card was added. On 2026-10-26 Jake chose to leave the contact details, the résumé link and the JotForm embeds as they are, so don't strip them from the preview.

## Card image

`public/images/projects/highschool-portfolio.webp`, the top of the page with the skyline. The card shows on the board itself, so its shot hides the contact line (its `run` in the `SHOTS` list) and the phone number and email don't end up in the image. The page keeps them.
