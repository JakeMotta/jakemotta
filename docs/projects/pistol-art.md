# Pistol Art (Armed Response Training)

Course schedules and class sign-ups for a pistol training school, originally at `pistolart.net`.

## Preview

`public/projects/pistol-art/` is the original PHP site, rendered to static pages by `scripts/convert-php-sites.mjs` (its `pistol-art` entry). The PHP only stitched in shared partials (`files/footer.php`, `files/lead-nav.php`, `files/rightcolumn.php`), so each `X.php` becomes an `X.html` beside it. Links to `pistolart.net` and to `.php` pages point at those `.html` pages.

The two mail forms never send anything: the converter points `contact_send.php` at `message_recieved.html` and `form_send.php` at `thankyou.html`, the pages they redirected to once the mail went out.

## Kept, but never published

- `myAdmin/` is an old CouchCMS admin. Its `config.php` holds a database password, which has been in the public repo since the first commit. It stays in the repo as archive and is pruned from every build by `scripts/prune-build.mjs`. The fix for the exposed password is changing it, not deleting or rewriting files.
- Every `.php` file stays as the converter's source and is pruned from the build. The mail handlers would send real email if published.
- Both were uploaded once, by the first successful deploy, and were moved to cPanel's Trash by hand on 2026-10-26. Don't restore them.

`files/` also holds an unrelated compiled build of the Ambii web app and an old scraper's notes. Neither is wired up.

## Card image

`public/images/projects/pistol-art.webp`, taken by `yarn projects:screenshot pistol-art`.
