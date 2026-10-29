# Black Chamber (2017)

Jake's 2017 redesign of the Silicon Valley Black Chamber of Commerce site, built in Adobe Muse: about 36 pages of programs, services, events, sponsors, a media kit, a video gallery, a calendar and the chamber's radio show. It replaced the 2015 site ([black-chamber.md](black-chamber.md)), which has its own card. Jake approved showing it on 2026-10-29.

## Where it came from

`Z:\Google Drive\Stuff\Chamber_Website.zip` (25 MB, dated 2017-08-23), on Jake's NAS. The zip holds one folder, `For Bobby/`: the Muse export as Jake handed it over in August 2017, to whoever was taking the site on. "For Bobby" is only that folder's name. Nothing inside the pages mentions a Bobby, and the name isn't published anywhere.

The pages link to each other at `scbc01.businesscatalyst.com`, the Adobe Business Catalyst staging address the site was built on. Some sections are unfinished. The media kit's "Low Cost Office Rental", for example, still says "Carl to add text to this portion!".

**How it relates to the old `muse/` folder.** The 2015 site's folder once held a `muse/` folder (230 MB, deleted in `f1266f1`, left out on purpose when the 2015 site was restored). That folder was a pile of dated Muse exports of this same redesign, from `1-26-2016` to `8-3-2017`, with the `.muse` source files. This zip is a later, final export from three weeks after the last of them. The pages match the `8-3-2017` export, except that `catalog.html` and `member_type.html` are gone and two empty `login.html` and `dashboard.html` shells were added. So the preview is built from this zip, and `muse/` stays out.

Copied into `public/projects/black-chamber-2017/` (40 MB in all, 475 files; the export itself is 34 MB):
- 36 pages. Each has an `X.static.html` copy written by the converter (6.5 MB each set).
- `css/`, without Muse's IE-only stylesheets.
- `scripts/`, without its PHP.
- All 311 images in `images/` (23 MB). Every one is used, at 1× and Muse's 2× for high-density screens.

## Preview

`/projects/black-chamber-2017/index.static.html`, rendered by `scripts/convert-php-sites.mjs` through its `black-chamber-2017` entry:
- **`origins`:** the Business Catalyst staging address. Links to it point at the local pages.
- **`pages`:** every page, written as `X.static.html`.
- **`redirects`:** Business Catalyst also answered `home.html` and ignored case, so `home.html`, `Initiatives.html` and `Global1.html` go to `index`, `initiatives` and `global1`.
- **`replace`:**
  - **jQuery:** Muse's jQuery from Adobe's retired CDN becomes its bundled copy.
  - **Open Sans:** it came from Adobe's Edge Web Fonts, which is gone, and now comes from Google Fonts.
  - **Google Analytics:** pointed at an empty script, so nothing is sent.
  - **Radio Show:** the header's Radio Show link went to the old site's radio page (`blackchamber.com/radioshow`), and now goes to this site's own Radio Show page.
  - **Past events:** the events and supporters pages linked to side sites on the old domain (`BNBFundraiser`, `hackathon`, `wearecodevrhackathon`), which were never kept. They go to this site's own pages for those event series: the Blacks 'n Business awards and the Bay Area Black Youth Tech-a-thon.
  - **The contact form:** it posted to a PHP mail handler. It now shows Muse's own "Form received." and sends nothing.
  - **The press release PDF:** the media kit embedded the release as a PDF that isn't in the export. Its script replaced the whole page with that PDF, so the embed is taken out and a short "Archived preview" note stands in. The release is on the page as text.
  - **The video gallery's posters:** these were never in the export (`assets/`), so each slide shows its video's own YouTube thumbnail. All six videos are still on YouTube.
  - **Muse's RequireJS:** Muse loads RequireJS asynchronously, which raced the widgets' own libraries further down the page. The calendar and the video gallery registered as RequireJS modules instead of globals and stayed empty. Once RequireJS has run, only the scripts it loads itself are shown `define.amd`.

What still doesn't work, as on the archived original:
- **The calendar:** it shows an empty month. Its events came from a Google Calendar through an API key that isn't published (below).
- **The Radio Show's nine SoundCloud players:** they're blank, because SoundCloud no longer has those tracks.
- **The newsletter archive's Constant Contact feed:** it doesn't load.
- **The "Show Video Player" widget on `global`:** it throws, because it calls a `fluidvids` script the export never included.
- **"Member Login", "Become a Member" and the business directory:** they link to `blackchambercommerce.org`, a separate site, and stay external, as on the 2015 card.

## Left out on purpose

- **The PHP mail handlers** in `scripts/` (`form-u276321.php`, `form_process.php`, `form_check.php`, `form_throttle.php`). They would mail the chamber's real inbox.
- **Unused pages and Muse's own files:**
  - `login.html` and `dashboard.html`: empty Business Catalyst shells that nothing links to.
  - `media-kit-copy.html`: an unlinked draft of the media kit.
  - Their stylesheets.
  - Muse's IE-only `iefonts_*.css` and `nomq_*.css`, which load only in IE 8 and older.
  - `muse_manifest.xml`, `sitemap.xml` (the staging address's) and the unused `header.png` and `footer.png`.
- **Held back from the pages when they were copied.** These were cut from the copy itself, not just from the preview, because the repository is public:
  - **The calendar's Google API key:** `googleCalendarApiKey` is empty.
  - **The press release's contact for Karl Welch:** his personal email and phone number. The marketing contact's name and title stay.
  - **The Bay Area Tutoring Association contact's phone number,** in the same press release. The organization's name, its director's name and its (broken) email stay.
  - **The Social Media Director's email** in About Us' Key Personnel. His name and title stay.

  The chamber's own office line, fax, `info@` and `pres@` addresses stay; the 2015 site shows them too. If Jake wants any held-back item back, it's in the zip.

## Card image

`public/images/projects/black-chamber-2017.webp`, taken by `yarn projects:screenshot black-chamber-2017` in the default 1280-wide viewport: the brown welcome band, the logos and the President's Message. The site is responsive, so no narrower width is needed.
