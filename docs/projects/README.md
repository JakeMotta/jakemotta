# Projects

Every project on the board has an entry in `homeProjectList` (`src/common/constants.ts`), a card image, a preview that the viewer at `/project/<id>` frames, and a page here. The first entry, the newest, is the board's featured tile; the rest are the small screenshots in its Projects tile ([board.md](../board.md)). The page is the place for anything that's only true of that project: where it came from, how its preview runs, what was left out and why.

| Card id | Preview | Notes |
| --- | --- | --- |
| `tapslaydie` | live at `https://tapslaydie.com/` | [tapslaydie.md](tapslaydie.md) |
| `asteroids` | `/projects/asteroids/index.html` (Godot's web export) | [asteroids.md](asteroids.md) |
| `ambii` | `/projects/ambii/story/index.html` (a hand-written story page in front of the 2018 landing page) | [ambii.md](ambii.md) |
| `black-chamber` | `/projects/black-chamber/index.html` | [black-chamber.md](black-chamber.md) |
| `pistol-art` | `/projects/pistol-art/index.html` | [pistol-art.md](pistol-art.md) |
| `ninjadonut` | `/projects/ninja-donut/index.html` | [ninjadonut.md](ninjadonut.md) |
| `ambii-business` | `/projects/ambii-business/index.html` (a hand-written hub in front of three built apps) | [ambii-business.md](ambii-business.md) |
| `floor-is-lava` | `/projects/cs134/floor-is-lava.html` (a JavaScript port of the jar) | [floor-is-lava.md](floor-is-lava.md) |
| `scott-pilgrim` | `/projects/cs134/scott-pilgrim.html` (a recorded clip) | [scott-pilgrim.md](scott-pilgrim.md) |
| `fooder` | `/projects/fooder/index.html` (a case study) | [fooder.md](fooder.md) |
| `survivor` | `/projects/survivor/index.html` (a case study) | [survivor.md](survivor.md) |
| `cs160` | `/projects/cs160/index.html` | [cs160.md](cs160.md) |
| `personal-site` | `/projects/personal-site/index%20(2).static.html` | [personal-site.md](personal-site.md) |
| `dan-james` | `/projects/dan-james/index.static.html` | [dan-james.md](dan-james.md) |
| `team-safe` | `/projects/motorsport/team-safe/About.html` | [team-safe.md](team-safe.md) |
| `coloris` | `/projects/coloris/index.html` (Java compiled to JavaScript) | [coloris.md](coloris.md) |
| `worxxx` | `/projects/motorsport/worxxx/index.static.html` | [worxxx.md](worxxx.md) |
| `rebound` | `/projects/rebound/index.html` (Greenfoot, ported to JavaScript) | [rebound.md](rebound.md) |
| `isguy` | `/projects/isguy/index.html` (Java, through CheerpJ) | [isguy.md](isguy.md) |
| `noah-garza` | `/projects/motorsport/noah-garza/index.static.html` | [noah-garza.md](noah-garza.md) |
| `sketchbook` | `/projects/sketchbook/index.html` (a hand-written gallery) | [sketchbook.md](sketchbook.md) |
| `flash` | `/projects/flash/index.html` (a hand-written gallery) | [flash.md](flash.md) |
| `highschool-portfolio` | `/projects/highschool/oldSite/index.html` | [highschool-portfolio.md](highschool-portfolio.md) |
| `greenfoot-pokemon` | `/projects/greenfoot-pokemon/index.html` (Java, through CheerpJ) | [greenfoot-pokemon.md](greenfoot-pokemon.md) |
| `escaping-confinement` | `/projects/escaping-confinement/index.html` (a video page) | [escaping-confinement.md](escaping-confinement.md) |
| `jakes-index` | `/projects/highschool/flashIndex/FlashIndex.static.html` | [jakes-index.md](jakes-index.md) |
| `pivot` | `/projects/pivot/index.html` (a hand-written gallery) | [pivot.md](pivot.md) |

## How previews run

A preview has to run in the browser with no server code: the host is static, and every `.php` under `public/projects/` is pruned from the build (`scripts/prune-build.mjs`).

- **Static copies** live in `public/projects/<folder>/` and are served as plain files. `public/.htaccess` keeps `/projects/` away from the React app's routing. In dev, CRA answers a bare folder path with the app, so `preview` always names the page file (`…/index.html`).
- **PHP sites** that only used PHP for `include`s, `echo`s and CouchCMS are rendered to `X.html` beside each `X.php` by `scripts/convert-php-sites.mjs` (`yarn projects:convert`). Each site is an entry in its `SITES` list. The converter stops on any PHP it doesn't understand; teach it the construct rather than hand-editing its output.
- **Plain HTML pages that need fixing** get the same treatment without any PHP. The site gets a `SITES` entry listing those `pages`, and each is written as `X.static.html` with:
  - links between the listed pages pointed at each other's copies;
  - libraries loaded over `http://` switched to https;
  - Ruffle added wherever there's Flash;
  - the site's literal `replace` fixes.

  Personal Site, Dan James and JAKE's Index work this way; the card's `preview` names the `.static.html` page.
- **One project, one card:** a folder that holds several sites or games (`motorsport/`, `highschool/`, `cs134/`) gives each its own card, framing that project's own page. Don't put a hub page in front of them; Jake asked on 2026-10-27 for every project to be its own card. Hubs that front one project's parts, like Ambii Business's three apps, are fine. Collections of small works in one category (Flash, Pivot, Sketchbook) stay one card each, as Jake decided the same day.
- **Galleries and videos:** work that was never a website (animations, drawings, a film, loose Flash movies) gets a hand-written page in its own folder: Pivot, Sketchbook, Escaping Confinement, Flash.
  - **Files:** keep the original files where browsers can show them (GIFs), and convert where they can't (TIFF to JPEG, MPEG to H.264 MP4). Each project's page says which originals were used and what was left out.
  - **Sound:** a page that plays sound pauses the site's music when it starts (see [escaping-confinement.md](escaping-confinement.md)). Under the dev server Claude starts, every preview plays silently ([music.md](../music.md#silent-while-claude-previews)).
- **Apps with a real back end** (CS160) get hand-written static pages that fake the back end in JS.
- **Apps whose source survives** (Ambii Business) are built from that source, with the old API answered by a mock that runs in the browser. The mock and the build tooling live in `demos/`, outside `public/`, and only the build output is published. The apps' own source isn't committed at all, because its upstream repositories are private ([ambii-business.md](ambii-business.md#where-the-source-lives)).
- **Flash** plays through Ruffle, self-hosted in `public/vendor/ruffle/`.
- **Java desktop games** (isGuy, Pokémon) run as the original jars through CheerpJ, which loads only when the visitor presses Play. CheerpJ's free Community License covers a personal site only while it loads from `cjrtnc.leaningtech.com` and the page credits it; self-hosting it would need a paid license. How those pages work is in [isguy.md](isguy.md).
- **Greenfoot games compiled to JavaScript** (Coloris, since 2026-10-27): `yarn projects:greenfoot` compiles the game's own classes, taken unchanged from its jar, with TeaVM against our own Greenfoot runtime in `demos/greenfoot/`, into `public/projects/<id>/web/`. It loads in seconds, runs at full speed and scales to fit. This is the route greenfoot.org uses for published scenarios, rebuilt here. How it works and what's left (isGuy and Pokémon): [greenfoot-web.md](greenfoot-web.md). Coloris's CheerpJ page stays beside it as `cheerpj.html`.
- **Small Greenfoot games** (Rebound) can be ported instead: `greenfoot.js`, a canvas version of the Greenfoot 2 API, with the game's Java translated class by class beside it and the original scenario kept unchanged ([rebound.md](rebound.md)).
- **Godot games** (Asteroids) are Godot's own web export, with threads off so the static host needs no special headers ([asteroids.md](asteroids.md)).
- **Java + OpenGL games** can't run in CheerpJ: JOGL needs native libraries. The Floor is Lava is translated into JavaScript from its compiled classes, line for line, and draws its own sprites on a canvas ([floor-is-lava.md](floor-is-lava.md)). Scott Pilgrim still has a recorded clip.
- **Games that can't run in a browser at all** get a case study of their design and art (Survivor, Fooder).

## Downloads

Every game with a desktop build has a Download button in the viewer, from the entry's `download` in `homeProjectList` (`url`, `label`, and a `note` saying the size and what it needs). Jake asked for them on 2026-10-27, the same day he had the viewer's "This is the original, saved just the way it was" line taken out; the button sits where it was. The files live in the project's folder, usually in `download/`:

| Game | Download | Notes |
| --- | --- | --- |
| Asteroids | `asteroids/download/asteroids-windows.zip`, a Godot Windows export | [asteroids.md](asteroids.md) |
| The Floor is Lava | `cs134/download/the-floor-is-lava.zip`, the original 2017 zip unchanged | [floor-is-lava.md](floor-is-lava.md) |
| Scott Pilgrim | `cs134/download/scott-pilgrim.zip`, the compiled game packed as a runnable jar | [scott-pilgrim.md](scott-pilgrim.md) |
| Coloris | `coloris/download/coloris.zip`, the jar plus a launcher that sets the speed | [coloris.md](coloris.md) |
| isGuy | `isguy/isGuyFinal.jar`, the preview's own jar | [isguy.md](isguy.md) |
| Pokémon | `greenfoot-pokemon/download/pokemon-green-foot-edition.zip`, the jars plus a launcher | [greenfoot-pokemon.md](greenfoot-pokemon.md) |

Three games have none. TapSlayDie isn't out on the App Store or Google Play yet (its site says "Coming soon"); link the store pages once it is. Survivor never had a finished build. Rebound was never exported from Greenfoot; one could be assembled the way Coloris's was ([rebound.md](rebound.md)). The deploy compares files by size only, so a rebuilt download needs a new name, or an explicit `put` in the workflow, to reach the server.
- **Live sites** on their own domain (TapSlayDie) are framed at their address. Their document is cross-origin, so the viewer's link handling can't reach inside them.

**Embedded third-party forms stay live.** JotForm embeds (Dan James's contact page, Pistol Art's register page, the 2012 high school page and its NinjaDonut copy) still submit for real. Jake decided on 2026-10-26 to leave them, along with his old contact details on the 2012 pages. Only the sites' own mail handlers are rerouted, because they'd need the PHP that isn't published.

Treat the originals under `public/projects/` as an archive: don't reformat or modify them. Only generated output (`X.html`, `X.static.*`) and the hand-written pages are edited.

## Card images

Card images are screenshots of each running preview, taken by `yarn projects:screenshot` (`scripts/screenshot-projects.mjs`) with `yarn dev` running. It drives headless Chrome, Edge or Brave and writes `public/images/projects/<id>.webp` at 960×720, the cards' 4:3.
- **Shots:** each project's shot is an entry in the script's `SHOTS` list. It says how long to let the page settle and, for a narrow fixed-width site, a narrower viewport so the site fills the frame. A shot can name a page inside the preview rather than its front page (Ambii's card shoots its 2018 landing page, not the story page), `scroll` down to the part worth showing (Pivot's grid), or `run` a line of script first, to open a panel (Noah Garza's About) or keep something off the card (the high school portfolio's phone number).
- **Audio and autoplay:** the browser runs muted, with autoplay allowed, so Ruffle starts the Flash instead of waiting behind its play button.

```bash
yarn projects:screenshot              # every project
yarn projects:screenshot cs160 ambii  # just these
```

Look at each image after taking it. A shot can catch a page mid-load, and a fixed-width site can leave wide empty margins or get cut off; adjust its `settle` or `width` and take it again.

The older images in `public/images/projects/` (`ambii.png`, `pistolArt.png` and the rest) are no longer used by the cards. They're kept, and CS160's own pages use copies of `faceme_output.png`.

## Adding a project

1. Get it running as a preview: a static copy in `public/projects/<folder>/` (a new `SITES` entry if it's PHP, or if some of its plain pages need fixes), or the address of a live site that allows framing (check its response headers for `X-Frame-Options` and `frame-ancestors`). On Windows, copying a batch of files into `public/` while `yarn dev` runs can crash the dev server (chokidar's `EBUSY: resource busy or locked`). Copy first and start the server after, or just restart it.
2. Add an entry to `homeProjectList`, one per project (see One project, one card above), newest first (so a new project becomes the featured tile): `id`, `title`, `date`, `category` (which section of the all-projects overlay it goes in: `website`, `app`, `game`, `art` or `animation`; a new one goes in `projectCategories`), `tags` (what kind of thing it is, shown as pills in the viewer: "Website", "Java Game", "School"…), `download` for a game with a desktop build (see Downloads above), a one-sentence `description` in Jake's voice that says what it is rather than how the preview runs, `preview`, and `image: '/images/projects/<id>.webp'`.
3. Add a `SHOTS` entry to `scripts/screenshot-projects.mjs`, run `yarn projects:screenshot <id>` and look at the result.
4. Write `docs/projects/<id>.md` and add it to the table above.
5. Open `/project/<id>` in the dev server, click around inside the frame, and check the console.
6. Check that nothing with credentials comes along: grep the copy for passwords, keys and connection strings, and leave those files out.
