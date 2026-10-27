# Personal Site

Jake's portfolio from 2016 ("Hello World! I'm Jake"), with clouds and balloons that bounce in. The folder is `public/projects/personal-site/`; the card id is `personal-site`.

## Which home page

The folder has two home pages, and the preview shows the later one, `index (2).htm` (Jake chose it on 2026-10-27, wanting the site back the way it used to work):
- `index (2).htm`: the clouds and balloons bounce in around "Hello World!", then "Scroll Down!", and scrolling slides in About, Projects, Music and Contact.
- `index.htm`: the same clouds under a menu (Home, Projects, Computers…) whose links are all `#`. Nothing links to it any more, and it has no static copy.

Every copy of the site was searched for this: the repo's history back to its 2018 commits (where the folder was `dev/`) and `Z:\Old Projects\dev` on the NAS. All of them hold the same four pages, so nothing else was ever lost. The site was never finished: About is a heading and a placeholder, and Music and Contact were never links.

## Preview

`index (2).htm`, `about.html` and `projects.html` are written as `X.static.html` by `scripts/convert-php-sites.mjs` (its `personal-site` entry):
- Both home pages load a second jQuery over plain `http://`, which an https page blocks.
- About's Home link pointed at `index.htm`; it goes to `index (2).static.html` instead (the entry's `redirects`).
- Projects on the home page is a link to the projects page. Only About was ever a link; Projects was added because the page exists.
- The projects page's links to Dan James and Black Chamber point at their previews here. The Bay Area Juneteenth and Team SAFE Racing links stay external.
- All three pages are laid out 960px wide, so in a narrower window, like the viewer's frame, a script scales `<body>` down to fit (`zoom`, against the page's width without its scrollbar). The zoom goes on `<body>`: on `<html>` it also changes the window size the slide-ins measure against.
- The home page clips sideways overflow (`html { overflow-x: hidden }`). The clouds and balloons are nudged right to about 950px, "Scroll Down!" pulses a full-width line to 105% forever, and Projects and Contact slide in from the right. Without the clip, the frame scrolled sideways and kept flickering a scrollbar.
- The slide-ins (Waypoints) measure where to trigger once, while "Scroll Down!" is still rising into place, so they triggered about 240px too late. In a tall window that's past the end of the page, and only About ever appeared; the original had this bug too. The script measures them again whenever an entrance animation ends and once the fonts load.

Some quirks are the original's own and are left alone:
- The home page logs `Cannot read properties of null (reading 'style')` on load: its loader hides an `elementID` element that was never in the page. It's harmless.
- The projects page has no link back home; the browser's Back goes there.

## Card image

`public/images/projects/personal-site.webp`, shot from `index (2).static.html` after the clouds and balloons have bounced in.
