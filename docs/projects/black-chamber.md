# Black Chamber

Members, programs and events for the Silicon Valley Black Chamber of Commerce, a San Jose business chamber, with its weekly radio show. Originally at `blackchamber.com`.

## Where it came from

The site was in this repo under `public/projects/BlackChamber/` until commit `f1266f1` deleted it. It was restored from commit `916adc1` on 2026-10-26, **only in part**, into `public/projects/black-chamber/` (3 MB).

**Restored:** the six main pages (`index`, `AboutUs`, `Members`, `Programs&Services`, `Calendar`, `Donating`) as `.php`, their partials and stylesheets in `files/`, the 52 images they use, the Radio Show page (`radioshow/`, with only the stylesheets, scripts and images it uses), and `juneteenth/bg.png`, which a stylesheet references.

**Left out on purpose. Don't restore any of it to fill a gap:**
- `myAdmin/`: the CouchCMS admin. The preview doesn't need it, and its `config.php` holds database credentials.
- `muse/` (230 MB): a later Adobe Muse export of the whole site. Nothing on the main site links to it.
- The side sites: `Hackathon`, `BNBFundraiser`, `SVCED` (which has its own `myAdmin`), `Comedy`, `silentAuction` (likewise), `htdocs`, `wearecodevrhackathon`, `juneteenth` (all but `bg.png`), `video1`, `video2`, `SVBCC`.
- `template_3-11-15.rar`, `template.html`, `underConstruction.html`, `stats.PNG`, `_notes`, and the old root `AboutUs.html`. The converter now writes a new `AboutUs.html` at that path.
- The Radio Show's PHP mail handlers (`form_process.php`, `form_check.php`, `form_throttle.php`, `form-u241690.php`) and its unused CSS and images.

The `myAdmin` database password is still in the repo's history at `916adc1`. The fix is changing it, not deleting files.

## Preview

Rendered by `scripts/convert-php-sites.mjs`, through its `black-chamber` entry:
- **`cms: true`:** CouchCMS hooks (`require_once('myAdmin/cms.php')`, `COUCH::invoke()`) render as nothing. Each `<cms:editable>` region prints the draft copy written into the page template as its default, split into paragraphs. A small "Archived preview" note on each page says so. That text is the site's own; nothing was invented. Any other `<cms:…>` tag stops the converter.
- **`origins`:** `blackchamber.com` with and without `www`, plus the footer's `wwww` typo. Links to them point at the local pages.
- **`pages`:** plain `.html` pages that need the same link fixes are written as `X.static.html` beside the original. The Radio Show is served at `radioshow/index.static.html`.
- **`redirects`:** the Radio Show's phone-width menu linked to pages that only exist in `muse/`. Each goes to the nearest main-site page instead (about → AboutUs, members → Members, programs → Programs&Services, giving → Donating, events → Calendar, the rest → home).
- **`replace`:** fixes for assets that never existed (`Pages/images/loading.gif`, `empty.gif`) and for Muse's retired jQuery CDN.

There were no member lists, logins or forms driven by the CMS. The calendar is the original static "We're Moving!" page. "Member Login", "Become a Member" and the business directory link to `blackchambercommerce.org`, a separate site, and stay external.

## Card image

`public/images/projects/black-chamber.webp`, taken by `yarn projects:screenshot black-chamber` in a 1140-wide viewport. The site is fixed-width, and its phone graphic sticks out on the right; any narrower cuts it off.
