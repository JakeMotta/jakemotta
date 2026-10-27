# Motorsport Sites

Three client sites Jake built for people who race: Team SAFE Racing, an inline speed-skating team sponsored by SAFE Security (2014, kept up until 2019); Worxxx PM, a motorcycle race shop in Lemoore, California (2013); and Noah Garza Racing, a one-page site for a young kart racer (2012). The folder is `public/projects/motorsport/`, with one subfolder per site; the card id is `motorsport`.

## Where it came from

Copied on 2026-10-26 from Jake's old-computer archive on `Z:`. Only the files the pages use were copied, byte for byte, with their dates: 262 files, 15 MB.

- **Team SAFE** (`team-safe/`, 5 MB) is the copy in `Z:\Old Computer\Documents\Websites\TeamSafe`, not the newer one in `Z:\Jobs\TeamSafe`.
  - **Why not the newer one:** that copy is the 2015 CouchCMS rebuild, and every page's text moved into the CMS database. Its pages are empty `<cms:editable>` regions, `<cms:show>` and `<cms:embed>` tags, and the database is in neither folder, so they would render as empty frames.
  - **What this copy has:** the 2014 site, with its text written into the pages: eight main pages and 24 athlete, sponsor and story pages under `pages/`. It was last edited in July 2019, when its pages moved to jQuery 3.4.1.
- **Worxxx** (`worxxx/`, 2.6 MB) is from `Z:\Old Computer\Documents\DropboxStuff\Worxxx`: 15 plain HTML pages from December 2013 to January 2014.
- **Noah Garza** (`noah-garza/`, 6.4 MB) is from `Z:\Old Computer\Documents\Websites\Noah`: one page from December 2012 and the 58 resized photos its gallery shows.

## Preview

The folder never had a front page, so `index.html` is a hand-written hub that links to the three sites, like the high school one. The card frames the hub.

**Team SAFE** is rendered by `scripts/convert-php-sites.mjs` (its `motorsport/team-safe` entry): includes and echoes only, so each `X.php` gets an `X.html`. The hub links to `About.html`.
- **No home page:** `index.php` is a CouchCMS blog template. Its posts lived in the database, and its list view is a snippet inside `couch/`, which wasn't kept. The converter `skip`s it, and links to the home page go to About, the page that says "Welcome to Team SAFE Racing".
- **Home link:** the menu's Home link has an empty `href`, so on the live site it only reloaded the page it was on. The copy points it at About.
- **Subfolder partials:** the pages in `pages/` include `../sec_pages_topNav.php`, `../sec_pages_sideBar.php` and `../sec_pages_Links.php`, copies of the partials made for that folder's `../` paths. Neither archive copy has them. The converter's `includes` map renders the site-root partials (`files/sec_*.php`) in their place, anchored to the site root, so those pages keep their menu, sponsor column and footer links.
- **Slideshow:** the 2019 move to jQuery 3.4.1 broke the header slideshow, because its plugin calls `.size()`, which jQuery 3 removed. A `replace` makes the rewritten copy of the plugin (`files/responsiveslides.min.static.js`) use `.length`.
- **Old domain and trackers:** the one link to `teamsaferacing.net` goes to About. The Facebook SDK is stripped, and Google Fonts load over https.
- **Width:** the site is a fixed 960 px, so on a phone it scrolls sideways.

**Worxxx** runs as plain HTML, but every page is listed in its `motorsport/worxxx` entry and written as `X.static.html`.
- **Why every page:** the pit stop kit page's menu links to `Kits/About.html` and four other pages that live one folder up, which was broken on the live site too. Its `redirects` fix those links, and every page that leads to it has to be a listed page for the fix to be reached. The hub links to `index.static.html`.
- **Search box:** the Google site search in the menu bar no longer exists. Its `cse.js` is refused by the browser (`ERR_BLOCKED_BY_ORB`), and the box stays empty.
- **Placeholder copy:** the About page is still the trivia filler Jake put there, and some prices say `$xx.xx`. That's the site as it was.

**Noah Garza** is written as `index.static.html` (its `motorsport/noah-garza` entry) only to load Google Fonts over https.
- **Panels:** the page opens with just the header. The footer links slide open each panel (About, Achievements, Photos, Sponsors, Schedule).
- **Photos:** the gallery's lightbox runs on the jQuery 1.2.3 bundled with it, and it works.

## Left out

Don't restore any of it to fill a gap.
- **Team SAFE:**
  - `couch/`: the CouchCMS admin. Its `config.php` holds the database login. It also held the blog snippets.
  - From the `Z:\Jobs` copy, nothing. That includes:
    - its `Procedures/` how-to guides for running the CMS (Word documents, not opened);
    - `DadContribute/`: the bios, team documents and full-size photos the team sent in;
    - `logos/`: `.eps` and Fireworks sources.
  - `hello.php`, a PHP test page.
  - `_notes/` (Dreamweaver sync files), and images no page uses, such as the backgrounds and stock vectors (about 20 MB).
- **Worxxx:**
  - `Form/` and `freecontactformsettings.php`: a PHP contact-form kit that no page uses. The settings file wasn't opened.
  - `Images/pngs/` and `Stuff/`: Fireworks sources and raw photos, plus a shop-rate spreadsheet that wasn't opened.
  - The libraries the pages don't load: nivo-slider, the navigation-menu demos, `shopcart`, and PikaChoose's examples.
- **Noah Garza:**
  - `Pictures/Garza/` and the rest of `Pictures/` (2.1 GB of full-size originals) and `Pictures/Resized/Marked/` (watermarked copies the page doesn't use).
  - The lightbox's demo page and photos, `Images/*.fw.png` sources, and `Thumbs.db`.

## Things to know

- **Skaters' email addresses stay, as Jake decided on 2026-10-26.** Twelve Team SAFE athlete pages end with that skater's email address, mostly personal ones, as the live site did. They're in the published `.html` pages and in the `.php` originals in the repo. Don't strip them unless Jake asks.
- **Noah's age:** Noah was 11, and the page uses his full name and photos, as the public site did.
- **External links:** Team SAFE's Gallery and sponsor links, and Worxxx's map and links, go to outside sites. The viewer opens them in a new tab.

## Card image

`public/images/projects/motorsport.webp` is shot from Team SAFE's About page rather than the hub, which is only text. It's taken at the default 1280 width, on the slideshow's first slide.
