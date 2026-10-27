# Ambii

A music app for listening together: everyone's favorite music, with any group, anywhere. Ambii was Jake's startup from 2017 to 2021; it had a team and designers, so its sites and designs aren't all Jake's own work.

## Preview

The card opens `public/projects/ambii/story/index.html`, a hand-written hub that tells Ambii's story in four short sections and links to or embeds each piece. The 2018 landing page that used to be the preview is the first of them.

### The 2018 landing page

`public/projects/ambii/` is the static landing page, copied from the `JakeMotta/ambii_landing_page` repository at commit `41bff74` (2018-10-05). Only the files the page serves are here; its SCSS and gulp sources stay in that repo (`SOURCE.txt` says the same). It runs as-is, with no conversion. The story page links to it as `../index.html`; nothing outside `story/` was changed when the story page was added.

`public/projects/pistol-art/files/` happens to hold an unrelated compiled build of the Ambii web app (React, Auth0, the `hola.ambii.io` API). It isn't wired up to anything, and the preview doesn't use it.

### The story page (`story/`)

Added on 2026-10-26 from Jake's Ambii drive (`Z:\Google Drive\Ambii\…`). Section by section:

**1. The websites.** Three cards, each with a 640×400 screenshot in `story/thumbs/` taken in headless Chrome.
- **Play Music Together** (2018) links to the landing page above.
- **Join the Party!** is `story/sites/2019-02/`, an unchanged, complete copy of `Ambii Resources\Old Sites\2-20-19`.
  - **What it is:** a Colorlib "Transcend" template that was half turned into an Ambii site in mid-2018 (its files are dated June 2018) and saved in February 2019.
  - **What's unfinished:** the hero, the About blurb and the three products (Party Queue, Party Radio, Presence) are Ambii's; the rest is still the template's lorem ipsum and contact details.
  - **What's included:** the template's `readme.txt` and its `styles.html` demo page, which nothing links to.
- **Your Music. Everywhere.** is `story/sites/2019-09/alora/`, the 2019 site with Home, About, FAQ and Contact pages (files dated February 2019).
  - **Where it came from:** `Old Sites\9-4-2019`, a working copy of the `ambii_landing_page` repo saved in September 2019.
  - **The folder's root** is the landing page with two small changes: the Play Store link points at `com.ambii_group_music`, and there's a Google site-verification tag. The page links to it, and its privacy policy, as "the landing page as it stood then". It duplicates about 14 MB of the landing page's images.
  - **Copied as-is, minus what isn't served:** `.git/` (19 MB, and it would have nested a repository), `.gitignore`, `.htaccess` (an http→https redirect for ambii.io), the empty `cgi-bin/`, `gulpfile.js`, `package*.json`, `README.md`, `scss/`, `alora/scss/`, `alora/.ftpquota`, the slider plugin's `index.php` placeholders, and `alora/php/`. The last one holds the contact and newsletter handlers, and `newsletter-subscribe.php` contains a Mailchimp API key.

**2. The Techstars intro** (October 2019). The team's one-minute introduction, `story/videos/techstars-intro.mp4`.
- **Source:** `Z:\Google Drive\TechStarsIntro.mp4` (1920×1080, 252 MB).
- **Re-encoding:** done with Blender's video sequencer to 1280×720, H.264 at CRF "medium" with AAC 160k audio, which came to 8.6 MB. The same settings at 1080p gave 19.4 MB, so 720p was kept.
- **Poster:** `techstars-intro.jpg` is its first frame. It shows the team on camera, as recorded for the application.

**3. Ambii for Business** (2020). Three screen recordings from `Ambii Resources\Legacy\`, copied byte for byte: each was already H.264 (Main profile) in MP4 with its index at the front, under 15 MB, and with no audio track.

| File | Source | Size |
| --- | --- | --- |
| `mobile-and-web.mp4` | `Ambii mobile and web.mp4` (May 2020, the web player paired with the phone app) | 13.5 MB |
| `ambii-io.mp4` | `ambii.io - 4-3-20.mp4` (the business site) | 7.8 MB |
| `business-ambii-io.mp4` | `business.ambii.io - 4-3-20.mp4` (the station browser and player) | 4.2 MB |

Each poster (`.jpg` beside it) is the recording's first frame.

**4. Design history.** A gallery of 20 designs in `story/designs/`, opened full size in a `<dialog>` like Sketchbook's. They're JPEG copies at quality 82 with no metadata, sized to at most 1600 px wide (1600 tall for phone screens, 1100 wide for the tall 4.0 marketing page). Captions give only the version and year.

| Files | Source |
| --- | --- |
| `v2-party` | `Ambii 2.0 Concept\Open with Video.png` |
| `poster` | `Ambii Layouts\Poster Design\Ambii-Poster-Dark.png` |
| `logo-spec` | `Z:\Google Drive\Logo Design.png` |
| `v3-home`, `v3-invite`, `v3-party`, `v3-color-guide`, `v3-paper` | `Ambii Layouts\Ambii3.0\`: `Homepage - normal`, `Join 2`, `Party_1`, `Color Guide`, `IMG_2443.JPG` |
| `android-2018` | `Ambii 3.0 Concept\App Images\Screenshot_20181008-125946.png` |
| `ios-2018-party`, `ios-2018-onboarding` | `Ambii Layouts\screens\old\use\1.png`, `5.png` |
| `radio-start`, `radio-station` | `Ambii Layouts\Ambii Radio\1.jpg`, `6.jpg` |
| `ios-2019-party`, `ipad-2019-join` | `Ambii Layouts\screens\5-28-19\`: iPhone 6 Plus `(2)`, iPad Pro `(4)` |
| `v4-splash`, `v4-web-home`, `v4-web-party` | `Ambii Layouts\Ambii 4.0\Web App\`: `SPLASH PAGE`, `Home Page`, `Party Page - Horizontal Scrolling` |
| `v4-mobile-connect`, `v4-mobile-party` | `Ambii Layouts\Ambii 4.0\Mobile App\`: `Connect`, `Party Page` |

**Sound.** Only the Techstars intro has sound. When it plays, the page pauses the site's music in the parent page, the same way as [Escaping Confinement](escaping-confinement.md); the silent recordings leave the music alone. Starting any video pauses the others. When the planned `jakemotta:media-playing` message exists, this page should send it too.

### The 2019 sites as they run

Both run on a static host, with no 404s from the story page itself. Fixes go through a converter entry in `scripts/convert-php-sites.mjs`, never by editing the copies. Only one fix was made; everything else that's broken or live is as it was in 2019.
- **Join the Party!**
  - **Mailchimp form, switched off:** its subscribe form posted, through `js/main.js`, to the template's own demo Mailchimp list (`facebook.us8.list-manage.com`, the URL its `readme.txt` gives), not Ambii's, so a visitor's address would have gone to a stranger. The converter's `ambii/story/sites/2019-02` entry writes `index.static.html` with the form renamed (`mc-form-off`, `onsubmit="return false"`), so `main.js` never binds it. The story page links to that copy.
  - **Hotlinks and dead links:** the hero animation is hotlinked from `media0.giphy.com`, and "Party On!" goes to `http://www.beta.ambii.io`.
- **Your Music. Everywhere.** (`alora/`)
  - **Missing images:** four were already missing from the saved folder, so they 404: `images/1920x920.jpg`, `1920x572.jpg` and `1920x415.jpg` from `css/theme.css`, and `images/background/bg-whychoose.png`.
  - **Contact page:** `contact.html` throws `$(...).validate is not a function` (it never loads `jquery.validate.js`), so its contact form isn't bound to its handler and submits as a GET to itself.
  - **Newsletter forms:** they have no `action`, so they POST to the page they're on.
  - **Nothing leaves the site:** none of these forms sends data anywhere but jakemotta.com, because the PHP handlers were left out.
  - **Links:** the touch-icon links are root-relative (`/images/apple-icon-57x57.png`). Others point at the old `app.ambii.io`, the Play Store and Vimeo.
  - **People:** the About page carries a cofounder's bio, photo and social links, and the home page a testimonial with a photo, as published in 2019.

No trackers were found in any of the copies, and every library loads over https.

### Left out on purpose

- **Other people's work or faces:**
  - the `Ambii Pitches 11-17-17` practice videos;
  - `Rosenburg Design Class` (other students' work);
  - the `Ghiath` folder (another designer's files);
  - the 3.0 moodboard (a collage of other products' designs);
  - Ambii Radio's Spotify reference screenshot.
- **Personal details:**
  - the 3.0 concept app screenshots whose "Online Users" list names real attendees;
  - the 4.0 About and friends-list designs, which carry team bios and photos.
- **Too big or not shareable:**
  - `Ambii Business Plan Pitch.MOV` (6 GB);
  - pitch-deck slides with financials;
  - APK builds and `node_modules`.
- **Credentials:** everything under `Server`, and the `.pem`, `.ppk`, `keys`, `env` and `ssl` files, none of which were opened.
- **Formats browsers can't show:** design sources (PSD, AI, Sketch and Fireworks `.fw.png`), the prototype PDF and the `.docx` notes.
- **Low value:** `source_logos`, which is mostly Spotify and YouTube marks.

A grep of everything under `story/` for passwords, secrets, API keys and tokens finds only CSS selectors and library code.

## Card image

`public/images/projects/ambii.webp`, a screenshot of the 2018 landing page taken by `yarn projects:screenshot ambii`. Its shot names `/projects/ambii/index.html` rather than the story hub in front of it, the way the high school card shoots its Flash index. The card has no description; that's deliberate rather than missing.
