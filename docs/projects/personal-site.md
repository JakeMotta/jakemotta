# Personal Site

Jake's portfolio from 2016 ("Hello World! I'm Jake"), with clouds and balloons that bounce in. The folder is `public/projects/personal-site/`; the card id is `personal-site`.

## Preview

`index.htm`, `about.html` and `projects.html` are written as `X.static.html` by `scripts/convert-php-sites.mjs` (its `personal-site` entry):
- `index.htm` loads a second jQuery over plain `http://`, which an https page blocks. The other two pages link back to it.
- The projects page's links to Dan James and Black Chamber point at their previews here. The Bay Area Juneteenth and Team SAFE Racing links stay external.

Some quirks are the original's own and are left alone:
- The home page's menu scrolls within the page. Nothing on it links to the About or Projects pages; only `index (2).htm`, an unlinked variant, does.
- The home page logs `Cannot read properties of null (reading 'style')` on load: its loader hides an `elementID` element that was never in the page. It's harmless.

## Card image

`public/images/projects/personal-site.webp`, shot after the clouds and balloons have bounced in.
