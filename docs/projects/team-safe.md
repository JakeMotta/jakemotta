# Team SAFE Racing

A client site Jake built for Team SAFE Racing, an inline speed-skating team sponsored by SAFE Security (2014, kept up until 2019). The folder is `public/projects/motorsport/team-safe/`; the card id is `team-safe`.

`public/projects/motorsport/` holds three client sites Jake built for people who race: this one, [Worxxx PM](worxxx.md) and [Noah Garza Racing](noah-garza.md). Each had its own card; since 2026-10-28 only this one does.
- **One card each since 2026-10-27:** until then they shared a single "Motorsport Sites" card (`motorsport`) that framed a hand-written hub page linking all three. Jake asked for every project to be its own card, so the hub (`motorsport/index.html`) was deleted. The deployed copy stays live until it's removed in cPanel.
- **Old links:** `/project/motorsport` redirects to this card (`movedProjects` in `constants.ts`).
- **The old card image:** `motorsport.webp` stays in `public/images/projects/` as archive.

## Where it came from

Copied on 2026-10-26 from Jake's old-computer archive on `Z:`, along with the other two motorsport sites. Only the files the pages use were copied, byte for byte, with their dates: 262 files and 15 MB across the three sites, 5 MB of it this one.

This is the copy in `Z:\Old Computer\Documents\Websites\TeamSafe`, not the newer one in `Z:\Jobs\TeamSafe`.
- **Why not the newer one:** that copy is the 2015 CouchCMS rebuild, and every page's text moved into the CMS database. Its pages are empty `<cms:editable>` regions, `<cms:show>` and `<cms:embed>` tags, and the database is in neither folder, so they would render as empty frames.
- **What this copy has:** the 2014 site, with its text written into the pages: eight main pages and 24 athlete, sponsor and story pages under `pages/`. It was last edited in July 2019, when its pages moved to jQuery 3.4.1.

## Preview

The site is rendered by `scripts/convert-php-sites.mjs` (its `motorsport/team-safe` entry): includes and echoes only, so each `X.php` gets an `X.html`. The card frames `About.html`.
- **No home page:** `index.php` is a CouchCMS blog template. Its posts lived in the database, and its list view is a snippet inside `couch/`, which wasn't kept. The converter `skip`s it, and links to the home page go to About, the page that says "Welcome to Team SAFE Racing".
- **Home link:** the menu's Home link has an empty `href`, so on the live site it only reloaded the page it was on. The copy points it at About.
- **Subfolder partials:** the pages in `pages/` include `../sec_pages_topNav.php`, `../sec_pages_sideBar.php` and `../sec_pages_Links.php`, copies of the partials made for that folder's `../` paths. Neither archive copy has them. The converter's `includes` map renders the site-root partials (`files/sec_*.php`) in their place, anchored to the site root, so those pages keep their menu, sponsor column and footer links.
- **Slideshow:** the 2019 move to jQuery 3.4.1 broke the header slideshow, because its plugin calls `.size()`, which jQuery 3 removed. A `replace` makes the rewritten copy of the plugin (`files/responsiveslides.min.static.js`) use `.length`.
- **Old domain and trackers:** the one link to `teamsaferacing.net` goes to About. The Facebook SDK is stripped, and Google Fonts load over https.
- **Width:** the site is a fixed 960 px, so on a phone it scrolls sideways.

## Left out

Don't restore any of it to fill a gap.
- `couch/`: the CouchCMS admin. Its `config.php` holds the database login. It also held the blog snippets.
- From the `Z:\Jobs` copy, nothing. That includes:
  - its `Procedures/` how-to guides for running the CMS (Word documents, not opened);
  - `DadContribute/`: the bios, team documents and full-size photos the team sent in;
  - `logos/`: `.eps` and Fireworks sources.
- `hello.php`, a PHP test page.
- `_notes/` (Dreamweaver sync files), and images no page uses, such as the backgrounds and stock vectors (about 20 MB).

## Things to know

- **Skaters' email addresses stay, as Jake decided on 2026-10-26.** Twelve athlete pages end with that skater's email address, mostly personal ones, as the live site did. They're in the published `.html` pages and in the `.php` originals in the repo. Don't strip them unless Jake asks.
- **External links:** the Gallery and sponsor links go to outside sites. The viewer opens them in a new tab.

## Card image

`public/images/projects/team-safe.webp` is shot from the About page at the default 1280 width, on the slideshow's first slide.
