# Dan James

A 2016 site for Dan James, a music producer and mixing engineer. It has a home page with a slider and a beat store, plus About, Mixing and Contact pages. It used to live at `jakemotta.com/DanJames/`, and the personal site's projects page still linked there. The folder is `public/projects/dan-james/`; the card id is `dan-james`.

It was copied on 2026-10-26 from the `DanJames` folder of Jake's old-projects archive, as-is apart from `.DS_Store`. `images/fw/` holds the Fireworks sources for the slider and record images (about 15 MB). The pages don't use them, but they're part of the archive.

## Preview

All four pages are written as `X.static.html` by `scripts/convert-php-sites.mjs` (its `dan-james` entry), and they link to each other's copies.
- **Beat store:** it was a MyFlashStore widget in an iframe. That service's domain no longer resolves, and the frame would show the browser's error page in the middle of the home page. The copy replaces it with a short note.
- **Contact form:** the contact page embedded a JotForm form ("DanJames Contact Form") that was still live, so a message sent from the preview would really have been delivered. Since 2026-10-29 `contact.static.html` has a copy of it that submits nowhere, without its reCAPTCHA (see "How previews run" in [README.md](README.md)).

## Card image

`public/images/projects/dan-james.webp`, shot after the loader clears, on the slider's first slide.
