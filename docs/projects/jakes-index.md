# JAKE's Index

A Flash homepage Jake made at Coalinga High School in 2011 for his web design class assignments. The folder is `public/projects/highschool/flashIndex/`; the card id is `jakes-index`. It came from the `misc` folder of his old-projects archive.

It shared a "High School Sites" card with his 2012 portfolio until 2026-10-27; why they were split, and where the old card's links go, is in [highschool-portfolio.md](highschool-portfolio.md).

## Preview

The page is written as `FlashIndex.static.html` by `scripts/convert-php-sites.mjs` (its `highschool` entry), and the card frames it. The converter adds Ruffle and fits the movie into whatever frame it's in.
- **Sizing:** the movie is a fixed 1280×768. Stretching the player to fit doesn't work, because once the movie is clicked it changes its own scale mode and shrinks into a corner. So the player keeps its size, and a small script scales the whole thing down and centers it.
- **Dead buttons:** the buttons link to the class server, `chsprogramming.com`, which is gone. Those links are inside the SWFs, so they can't be rewritten. Everything else still plays, including the Pac-Man.

## Card image

`public/images/projects/jakes-index.webp`, the movie a few seconds after Ruffle starts it.
