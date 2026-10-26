# Projects

Every project on the board has an entry in `homeProjectList` (`src/common/constants.ts`), a card image, a preview that the viewer at `/project/<id>` frames, and a page here. The first entry, the newest, is the board's featured tile; the rest are the small screenshots in its Projects tile ([board.md](../board.md)). The page is the place for anything that's only true of that project: where it came from, how its preview runs, what was left out and why.

| Card id | Preview | Notes |
| --- | --- | --- |
| `tapslaydie` | live at `https://tapslaydie.com/` | [tapslaydie.md](tapslaydie.md) |
| `ambii` | `/projects/ambii/index.html` | [ambii.md](ambii.md) |
| `black-chamber` | `/projects/black-chamber/index.html` | [black-chamber.md](black-chamber.md) |
| `pistol-art` | `/projects/pistol-art/index.html` | [pistol-art.md](pistol-art.md) |
| `ninjadonut` | `/projects/ninja-donut/index.html` | [ninjadonut.md](ninjadonut.md) |
| `cs160` | `/projects/cs160/index.html` | [cs160.md](cs160.md) |

`public/projects/` also holds `highschool/` and `personal-site/`, old sites with no card yet.

## How previews run

A preview has to run in the browser with no server code: the host is static, and every `.php` under `public/projects/` is pruned from the build (`scripts/prune-build.mjs`).

- **Static copies** live in `public/projects/<folder>/` and are served as plain files. `public/.htaccess` keeps `/projects/` away from the React app's routing. In dev, CRA answers a bare folder path with the app, so `preview` always names the page file (`…/index.html`).
- **PHP sites** that only used PHP for `include`s, `echo`s and CouchCMS are rendered to `X.html` beside each `X.php` by `scripts/convert-php-sites.mjs` (`yarn projects:convert`). Each site is an entry in its `SITES` list. The converter stops on any PHP it doesn't understand; teach it the construct rather than hand-editing its output.
- **Apps with a real back end** (CS160) get hand-written static pages that fake the back end in JS.
- **Flash** plays through Ruffle, self-hosted in `public/vendor/ruffle/`.
- **Live sites** on their own domain (TapSlayDie) are framed at their address. Their document is cross-origin, so the viewer's link handling can't reach inside them.

Treat the originals under `public/projects/` as an archive: don't reformat or modify them. Only generated output (`X.html`, `X.static.*`) and the hand-written pages are edited.

## Card images

Card images are screenshots of each running preview, taken by `yarn projects:screenshot` (`scripts/screenshot-projects.mjs`) with `yarn dev` running. It drives headless Chrome, Edge or Brave and writes `public/images/projects/<id>.webp` at 960×720, the cards' 4:3. Each project's shot is an entry in the script's `SHOTS` list, with how long to let the page settle and, for a narrow fixed-width site, a narrower viewport so the site fills the frame.

```bash
yarn projects:screenshot              # every project
yarn projects:screenshot cs160 ambii  # just these
```

Look at each image after taking it. A shot can catch a page mid-load, and a fixed-width site can leave wide empty margins or get cut off; adjust its `settle` or `width` and take it again.

The older images in `public/images/projects/` (`ambii.png`, `pistolArt.png` and the rest) are no longer used by the cards. They're kept, and CS160's own pages use copies of `faceme_output.png`.

## Adding a project

1. Get it running as a preview: a static copy in `public/projects/<folder>/` (a new `SITES` entry if it's PHP), or the address of a live site that allows framing (check its response headers for `X-Frame-Options` and `frame-ancestors`).
2. Add an entry to `homeProjectList`, newest first (so a new project becomes the featured tile): `id`, `title`, `date`, a one-sentence `description`, `preview`, and `image: '/images/projects/<id>.webp'`.
3. Add a `SHOTS` entry to `scripts/screenshot-projects.mjs`, run `yarn projects:screenshot <id>` and look at the result.
4. Write `docs/projects/<id>.md` and add it to the table above.
5. Open `/project/<id>` in the dev server, click around inside the frame, and check the console.
6. Check that nothing with credentials comes along: grep the copy for passwords, keys and connection strings, and leave those files out.
