#!/usr/bin/env node
// Turns the PHP sites under public/projects/ into plain HTML that runs anywhere.
//
//   node scripts/convert-php-sites.mjs
//
// Their PHP only ever stitched in shared partials (include) and printed fixed
// strings (echo), so every page renders to the same HTML for every visitor and
// can be written out once. Each X.php page gets an X.html beside it; the .php
// files stay as the originals and are dropped from the build by
// scripts/prune-build.mjs.
//
// Along the way the pages are made to work as a hosted preview: links that
// pointed at the old domains or at .php point at the .html pages here, the mail
// forms go straight to their thank-you page instead of sending anything, old
// trackers are removed, and pages with Flash load Ruffle to play it.
//
// A site built on CouchCMS (black-chamber) has no admin or database here: its
// hooks render as nothing and each <cms:editable> region prints the draft copy
// written into the page as its default. Plain .html pages that need the same
// link fixes are listed per site and written as X.static.html beside them.
// A page whose content only ever lived in a CMS database can be skipped, and a
// partial that was not kept can be given a stand-in (team-safe has both).
//
// Anything PHP the converter does not understand stops it with the file and
// the snippet, so nothing is dropped silently. Rerun it after editing a page.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECTS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'projects');

const SITES = [
    {
        dir: 'pistol-art',
        // The pages link to the client's own domain throughout.
        origins: ['http://pistolart.net/', 'https://pistolart.net/', '//pistolart.net/'],
        // Mail handler -> the page it redirected to once the mail was sent.
        forms: { 'contact_send.php': 'message_recieved.php', 'form_send.php': 'thankyou.php' },
    },
    {
        dir: 'ninja-donut',
        origins: ['http://jakemotta.com/NinjaDonut/', 'https://jakemotta.com/NinjaDonut/', '//jakemotta.com/NinjaDonut/'],
        forms: {},
        // Jake's student page is a copy of the 2012 high school page, JotForm embeds and all.
        pages: ['Pages/Students/JakeMotta/index.html'],
    },
    {
        dir: 'black-chamber',
        // The footer's "wwww" is a typo on the original site.
        origins: [
            'http://www.blackchamber.com/',
            'https://www.blackchamber.com/',
            'http://blackchamber.com/',
            'https://blackchamber.com/',
            'http://wwww.blackchamber.com/',
        ],
        forms: {},
        // CouchCMS: myAdmin/ is not restored, so its hooks become no-ops.
        cms: true,
        // The Radio Show page is a Muse export that links back to the main
        // site's old domain; it is written as radioshow/index.static.html.
        pages: ['radioshow/index.html'],
        // Links to pages that never existed in this copy, sent to the closest
        // page that does (paths relative to the site folder). The Radio Show's
        // phone menu was made for the later Muse version of the whole site
        // (the muse/ folder, not restored), so its pages are missing here.
        redirects: {
            radioshow: 'radioshow/index.html',
            'radioshow/abousus.html': 'AboutUs.html',
            'radioshow/contact.html': 'AboutUs.html#Contact',
            'radioshow/videocollection.html': 'AboutUs.html#Videos',
            'radioshow/newsletters.html': 'http://archive.constantcontact.com/fs110/1100850105922/archive/1119971362591.html',
            'radioshow/newslettersarchive.html': 'http://archive.constantcontact.com/fs110/1100850105922/archive/1119971362591.html',
            'radioshow/members.html': 'Members.html',
            'radioshow/supporters.html': 'Members.html#Sponsors',
            'radioshow/sponsors-partners.html': 'Members.html#Sponsors',
            'radioshow/programs.html': 'Programs&Services.html',
            'radioshow/initiatives.html': 'Programs&Services.html',
            'radioshow/services.html': 'Programs&Services.html#services',
            'radioshow/giving.html': 'Donating.html',
            'radioshow/events.html': 'Calendar.html',
            'radioshow/calendar.html': 'Calendar.html',
            'radioshow/radioshow.html': 'radioshow/index.html',
            'radioshow/radioshow1.html': 'radioshow/index.html',
            'radioshow/radioshow3.html': 'radioshow/index.html',
            'radioshow/catalog.html': 'index.html',
            'radioshow/productsforsale.html': 'index.html',
            'radioshow/advertising.html': 'index.html',
            'radioshow/communication.html': 'index.html',
            'radioshow/mediakit.html': 'index.html',
            'radioshow/picturegallery.html': 'index.html',
        },
        // Literal fixes, applied to the pages and to the scripts and stylesheets they load.
        replace: [
            // Every inner page points its slider's loading image at a folder that never existed.
            ['url(Pages/images/loading.gif)', 'url(images/loading.gif)'],
            // The IE7/8 fix in mainCSS.css asks for an empty.gif that was never uploaded.
            ["url('empty.gif')", "url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')"],
            // Muse loads jQuery from Adobe's retired CDN on http pages; use its bundled copy.
            ['http://musecdn.businesscatalyst.com/scripts/4.0/', 'scripts/'],
        ],
    },
    // The sites below are plain HTML with no PHP: only their listed pages are rewritten.
    {
        dir: 'highschool',
        origins: [],
        forms: {},
        // The Flash homepage needs Ruffle to play, and the 2012 portfolio's skyline stopped scrolling.
        pages: ['flashIndex/FlashIndex.html', 'oldSite/index.html'],
        replace: [
            // The movie is pinned at 1280x768 and runs off the edge of anything smaller, like the
            // viewer's frame. Resizing the player doesn't work: the movie changes its own scale
            // mode once it's clicked and shrinks into a corner. So the player keeps its size and
            // the page scales the whole thing down to fit, centred.
            ['#flashContent { width:100%; height:100%; }', '#flashContent { width:1280px; height:768px; position:absolute; transform-origin:0 0; }', 'flashIndex/'],
            [
                '</body>',
                '<script>\n(function () {\n' +
                    "    var player = document.getElementById('flashContent');\n" +
                    '    var fit = function () {\n' +
                    '        var scale = Math.min(1, innerWidth / 1280, innerHeight / 768);\n' +
                    "        player.style.left = (innerWidth - 1280 * scale) / 2 + 'px';\n" +
                    "        player.style.top = (innerHeight - 768 * scale) / 2 + 'px';\n" +
                    "        player.style.transform = 'scale(' + scale + ')';\n" +
                    '    };\n' +
                    "    addEventListener('resize', fit);\n" +
                    '    fit();\n' +
                    '})();\n</script>\n</body>',
                'flashIndex/',
            ],
            // Spritely took window.Touch to mean an iPhone, which only iPhones had in 2012. Every
            // browser has it now, so Spritely's iPhone path runs for the bird sprite the page
            // doesn't have, throws, and the clouds and cities never start panning.
            ['if (window.Touch) {', "if (window.Touch && 'ontouchstart' in window && $(this)[0]) {", 'oldSite/'],
        ],
    },
    {
        dir: 'personal-site',
        origins: [],
        forms: {},
        // The home page is index (2).htm, the later of the two: scrolling past the clouds slides in
        // About, Projects, Music and Contact. index.htm (a menu of dead # links instead) is left as
        // it was, and About's Home link goes to the scroll-down page. Both load jQuery over http.
        pages: ['index (2).htm', 'about.html', 'projects.html'],
        redirects: { 'index.htm': 'index (2).htm' },
        replace: [
            // The projects page links to two sites that have their own previews here now.
            ['http://jakemotta.com/DanJames/', '/projects/dan-james/index.static.html'],
            ['http://blackchamber.com/', '/projects/black-chamber/index.html'],
            // Only About was ever linked from the home page; Projects goes to its page too.
            ['<span class="large jockey center" style="color:#FBFDFF;">Projects</span>', '<span class="large jockey center" style="color:#FBFDFF;"><a href="projects.static.html">Projects</a></span>'],
            // On the home page the clouds and balloons are nudged right to about 950px, "Scroll
            // Down!" pulses a full-width line to 105% forever, and Projects and Contact slide in
            // from (and back out to) the right. That's all decoration, so the page clips it
            // rather than scroll sideways and keep flickering a scrollbar.
            ['<div id="ich">', '<style>html { overflow-x: hidden; }</style>\n\t\t<div id="ich">'],
            // All three pages are laid out 960px wide for a 2016 desktop, so in anything narrower,
            // like the viewer's frame, they scale down to fit instead. The zoom goes on <body>: on
            // <html> it changes the window's reported size too, and the home page's slide-ins then
            // trigger past the end of the page. Those slide-ins also measure where they trigger
            // only once, while "Scroll Down!" is still rising into place (and before the fonts
            // have loaded), so they triggered about 240px too late, past the end of a tall
            // window's scroll. They're measured again whenever an entrance animation ends.
            [
                '</body>',
                '<script>\n(function () {\n' +
                    '    var fit = function () {\n' +
                    '        document.body.style.zoom = Math.min(1, document.documentElement.clientWidth / 980);\n' +
                    '    };\n' +
                    "    addEventListener('resize', fit);\n" +
                    '    fit();\n' +
                    '    var remeasure = function () {\n' +
                    '        if (window.Waypoint) Waypoint.refreshAll();\n' +
                    '    };\n' +
                    "    addEventListener('animationend', remeasure);\n" +
                    '    if (document.fonts) document.fonts.ready.then(remeasure);\n' +
                    '})();\n</script>\n</body>',
            ],
        ],
    },
    // Three motorsport client sites, each its own card: Team SAFE, Worxxx and Noah Garza.
    {
        dir: 'motorsport/team-safe',
        // Jake's own page links back to the live domain.
        origins: ['https://www.teamsaferacing.net/', 'http://www.teamsaferacing.net/', 'http://teamsaferacing.net/', 'https://teamsaferacing.net/'],
        forms: {},
        // The home page is a CouchCMS template: its posts lived in the CMS database and its list
        // view in couch/ (the admin, not kept), so there is nothing here to render it from.
        skip: ['index.php'],
        // Links to it go to About, the page that welcomes visitors.
        redirects: { 'index.html': 'About.html' },
        replace: [
            // The menu's Home link has an empty href, which only reloads the page it's on.
            ['<a href=>Home</a>', '<a href=/projects/motorsport/team-safe/About.html>Home</a>'],
            // The 2019 move to jQuery 3.4.1 stopped the header slideshow: the plugin calls
            // .size(), which jQuery 3 removed.
            ['e.size()', 'e.length'],
        ],
        // The pages/ subfolder included copies of the partials made for its ../ paths, and those
        // copies were not kept. The site-root partials stand in, anchored to the site root.
        includes: {
            'sec_pages_topNav.php': 'files/sec_topNav.php',
            'sec_pages_sideBar.php': 'files/sec_sideBar.php',
            'sec_pages_Links.php': 'files/sec_Links.php',
        },
    },
    {
        dir: 'motorsport/worxxx',
        origins: [],
        forms: {},
        // The pit stop kit's menu links into Kits/ to pages that are one folder up, which
        // makes every page that leads to it a listed page too.
        pages: [
            'index.html',
            'Products.html',
            'Storage.html',
            'Reviews.html',
            'About.html',
            'Contact.html',
            'CustomWork.html',
            'JacobMotta.html',
            'Links.html',
            'Public.html',
            'Kits/Kits.html',
            'Kits/DumbKit.html',
            'Kits/PitStopKit.html',
            'Kits/rearStandKit.html',
            'Kits/sideKit.html',
        ],
        redirects: {
            'Kits/index.html': 'index.html',
            'Kits/Products.html': 'Products.html',
            'Kits/Storage.html': 'Storage.html',
            'Kits/About.html': 'About.html',
            'Kits/Contact.html': 'Contact.html',
        },
    },
    {
        dir: 'motorsport/noah-garza',
        origins: [],
        forms: {},
        // Its Google Fonts stylesheet is loaded over plain http.
        pages: ['index.html'],
    },
    {
        dir: 'dan-james',
        origins: [],
        forms: {},
        // The home page holds the dead widget below, and the others link back to it.
        pages: ['index.html', 'about.html', 'mixing.html', 'contact.html'],
        replace: [
            // The beat store was a MyFlashStore widget; the service is gone, and its frame
            // would show the browser's error page in the middle of the site.
            [
                '<iframe id="mfs_html5" src="//www.myflashstore.net/widgets/html5/?uid=124282&config=215831" width="900" height="600" frameborder="0" scrolling="no"></iframe>',
                '<p style="margin:24px auto;max-width:600px;padding:6px 10px;border-left:3px solid #c9a227;background:#faf6e8;color:#555;font:italic 12px/1.4 sans-serif">' +
                    'Archived preview: the beat store here was a MyFlashStore widget, and that service no longer exists.</p>',
            ],
        ],
    },
    {
        dir: 'ambii/story/sites/2019-02',
        origins: [],
        forms: {},
        pages: ['index.html'],
        replace: [
            // The subscribe form still posts to the website template's own demo Mailchimp list, not
            // Ambii's, so a visitor's address would go to a stranger. Renamed, js/main.js no longer
            // binds it, and it submits nowhere.
            ['<form id="mc-form" class="group mc-form" novalidate="true">', '<form id="mc-form-off" class="group mc-form" novalidate="true" onsubmit="return false">'],
        ],
    },
    {
        // The 2017 Adobe Muse redesign of the Black Chamber site, as handed over in August 2017
        // (docs/projects/black-chamber-2017.md). Every page links to the others at the Business
        // Catalyst staging address it was built on.
        dir: 'black-chamber-2017',
        origins: ['http://scbc01.businesscatalyst.com/', 'https://scbc01.businesscatalyst.com/'],
        forms: {},
        pages: [
            'about-us.html',
            'advertising.html',
            'african-diaspora-investment-symposium.html',
            'bay-area-black-youth-tech-a-thon.html',
            'black-legends-awards.html',
            'blacks-‘n-business-blacks-‘n-technology-awards-ceremony.html',
            'calendar.html',
            'communication.html',
            'contact-us.html',
            'events.html',
            'giving.html',
            'global.html',
            'global1.html',
            'grant-writing-summit.html',
            'index.html',
            'initiatives.html',
            'juneteenth.html',
            'media-kit.html',
            'members.html',
            'mlk-luncheon-event.html',
            'naacp-–-gala-event.html',
            'newsletters.html',
            'newslettersarchive.html',
            'offerings.html',
            'other-partnership-events.html',
            'partners.html',
            'picture-gallery.html',
            'products-for-sale.html',
            'programs.html',
            'radio-show.html',
            'services.html',
            'sponsors.html',
            'supplier-diversity-expo.html',
            'supporters.html',
            'video-collection.html',
            'workshops.html',
        ],
        // Business Catalyst served the home page as home.html too and ignored case; this host doesn't.
        redirects: {
            'home.html': 'index.html',
            'Initiatives.html': 'initiatives.html',
            'Global1.html': 'global1.html',
        },
        replace: [
            // Muse loads jQuery from Adobe's retired CDN on http pages; use its bundled copy.
            ['http://musecdn.businesscatalyst.com/scripts/4.0/', 'scripts/'],
            // Open Sans came from Adobe's Edge Web Fonts, which is gone (stripDeadServices drops
            // its script). Google Fonts has the same typeface, under the name "Open Sans".
            ['</head>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"/>\n</head>'],
            ['open-sans, sans-serif', 'Open Sans, open-sans, sans-serif'],
            // Muse loads RequireJS asynchronously, and the widgets' own libraries further down the page
            // (the calendar's, the video gallery's) see its `define.amd` and register as RequireJS
            // modules instead of globals, so the widgets find nothing and stay empty. Once RequireJS
            // has run, only the scripts it loads itself are shown `define.amd`.
            [
                'onload="if (requirejs) requirejs.onError',
                'onload="if (window.define && define.amd) (function (amd) { Object.defineProperty(define, \'amd\', { configurable: true, get: function () { ' +
                    "var s = document.currentScript; return s && s.hasAttribute('data-requiremodule') ? amd : undefined; } }); })(define.amd); " +
                    'if (requirejs) requirejs.onError',
            ],
            // Google Analytics: the loader is pointed at an empty script, so nothing is sent.
            ["'//www.google-analytics.com/analytics.js','ga');", "'data:text/javascript,','ga');"],
            // The header's Radio Show link went to the old site's radio page; this site has its own.
            ['href="http://www.blackchamber.com/radioshow"', 'href="radio-show.static.html"'],
            ['href="http://blackchamber.com"', 'href="index.static.html"'],
            // Past events linked to side sites on the old domain that were never kept
            // (docs/projects/black-chamber.md). Each goes to this site's page for the same event series.
            ['href="http://blackchamber.com/BNBFundraiser/"', 'href="blacks-%E2%80%98n-business-blacks-%E2%80%98n-technology-awards-ceremony.static.html"'],
            ['href="http://blackchamber.com/hackathon/"', 'href="bay-area-black-youth-tech-a-thon.static.html"'],
            ['href="http://blackchamber.com/wearecodevrhackathon/"', 'href="bay-area-black-youth-tech-a-thon.static.html"'],
            // The contact form posted to a PHP mail handler (not kept). It shows its "sent" state
            // and sends nothing.
            [
                'function(elem) { return new WebPro.Widget.Form(elem, {',
                'function(elem) { WebPro.Widget.Form.prototype._submitFormInternal = function () { var f = this.$element, o = this.options; ' +
                    'f.addClass(o.formSubmittedClass); setTimeout(function () { f.removeClass(o.formSubmittedClass).addClass(o.formDeliveredClass); f[0].reset(); ' +
                    "f.find('.' + o.notEmptyClass).removeClass(o.notEmptyClass); }, 400); }; return new WebPro.Widget.Form(elem, {",
                'contact-us.html',
            ],
            // The video galleries' poster images were never in the export, so each slide shows its
            // video's own YouTube thumbnail instead.
            ...[
                ['bib-flyer-front-2', ['FwJGxKuop28', 'e46fXl1KEHM', 'BqdLbUNMkqw']],
                ['logos', ['uAAfqJyp_hc', 'S1NY1f3lmRg', 'H-rcHClUCkc']],
            ].flatMap(([poster, videos]) =>
                videos.map((video, i) => [`video_poster_${i + 1} = "assets/${poster}.jpg";`, `video_poster_${i + 1} = "https://i.ytimg.com/vi/${video}/hqdefault.jpg";`, 'video-collection.html']),
            ),
            // The media kit embedded the press release as a PDF that isn't in the export, and the
            // script that embedded it replaced the whole page with it. The release is on the page as text.
            ['var success = new PDFObject({ url: "assets/bytechpress.pdf" }).embed();', '', 'media-kit.html'],
            ['<object data="assets/bytechpress.pdf" type="application/pdf" width="100%" height="100%">', '<div>', 'media-kit.html'],
            ['</object>', '</div>', 'media-kit.html'],
            [
                "<p>It appears you don't have Adobe Reader or PDF support in this web browser.</p>",
                '<p style="margin:12px auto;max-width:600px;padding:6px 10px;border-left:3px solid #c9a227;background:#faf6e8;color:#555;font:italic 12px/1.4 sans-serif">' +
                    'Archived preview: the press release above was also embedded here as a PDF, and that file was not kept.</p>',
                'media-kit.html',
            ],
            ['<a href="assets/bytechpress.pdf">Click here to download the PDF</a>', '', 'media-kit.html'],
        ],
    },
];

// Never walked: the CMS admin is not part of the preview and is kept out of
// the build entirely.
const SKIP_DIRS = new Set(['myAdmin', 'node_modules', '_notes']);

const RUFFLE = '<script src="/vendor/ruffle/ruffle.js"></script>';

// Read and written as latin1 so whatever bytes the old pages hold (they predate
// UTF-8 everywhere) pass through untouched.
const read = (path) => readFileSync(path, 'latin1');
const write = (path, text) => writeFileSync(path, text, 'latin1');

const fail = (message) => {
    console.error(`convert-php-sites: ${message}`);
    process.exit(1);
};

const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) return [];
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });

// `<?xml …?>` declarations look like short PHP tags but aren't.
const PHP_BLOCK = /<\?(?!xml)(?:php)?([\s\S]*?)(?:\?>|$)/gi;

/** The PHP string literals in `echo "…"` statements, unescaped. */
const parseEchoes = (code, where) => {
    const out = [];
    // Comments first, so a commented-out line is not mistaken for code.
    let rest = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*(#|\/\/).*$/gm, '');
    const statement = /^\s*echo\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*;?/i;
    while (rest.trim()) {
        const match = rest.match(statement);
        if (!match) fail(`${where}: cannot convert PHP near: ${rest.trim().slice(0, 120)}`);
        const literal = match[1];
        out.push(
            literal[0] === '"'
                ? literal.slice(1, -1).replace(/\\([\\"$nt])/g, (_, c) => ({ n: '\n', t: '\t' })[c] ?? c)
                : literal.slice(1, -1).replace(/\\([\\'])/g, '$1'),
        );
        rest = rest.slice(match[0].length);
    }
    return out.join('');
};

/**
 * The partials are written for the top-level pages, so a relative link in one breaks
 * when a page in a subfolder includes it (the shared column's register link does).
 * Anchor them to the site root.
 */
const anchorRelative = (html, root) =>
    html.replace(/(\b(?:href|src)\s*=\s*)(["']?)([^"'\s>]+)/gi, (whole, attr, quote, url) =>
        isExternal(url) || /^([/#?]|[a-z]+:)/i.test(url) ? whole : `${attr}${quote}${root}${url}`,
    );

// CouchCMS loads itself at the top of each page (require_once 'myAdmin/cms.php')
// and renders it at the bottom (COUCH::invoke()). Without the CMS both do nothing.
const COUCH_HOOK = /^\s*(?:(?:require|include)(?:_once)?\s*\(?\s*["'][^"']*myAdmin\/cms\.php["']\s*\)?|COUCH::invoke\(\s*\))\s*;?\s*$/i;

// The site's CSS reset takes the margins off <p>, which would run the paragraphs together.
const DRAFT_NOTE =
    '<style>.cms-draft p{margin:0 0 10px}</style>\n' +
    '<p style="margin:0 0 12px;padding:6px 10px;border-left:3px solid #c9a227;background:#faf6e8;color:#555;font:italic 12px/1.4 sans-serif">' +
    'Archived preview: this is the draft text written into the page template. The live site loaded its copy from a CMS database that was not kept.</p>';

/**
 * A <cms:editable> region printed its default content until someone edited it in the
 * admin, and the edits lived in the database. The defaults here are plain-text drafts,
 * so blank lines become paragraphs and line breaks stay line breaks.
 */
const renderEditables = (html, where) => {
    let first = true;
    const out = html.replace(/<cms:editable\b[^>]*>([\s\S]*?)<\/cms:editable>/gi, (_, draft) => {
        const blocks = draft
            .trim()
            .split(/\r?\n[ \t]*\r?\n/)
            .map((block) => {
                const parts = [];
                let lines = [];
                const flush = () => {
                    if (lines.length) parts.push(`<p>${lines.join('<br>\n')}</p>`);
                    lines = [];
                };
                for (const line of block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)) {
                    if (/^(<!--.*-->|<hr\s*\/?>)$/i.test(line)) {
                        flush();
                        parts.push(line);
                    } else lines.push(line);
                }
                flush();
                return parts.join('\n');
            });
        const note = first ? `${DRAFT_NOTE}\n` : '';
        first = false;
        return `<div class="cms-draft">\n${note}${blocks.join('\n\n')}\n</div>`;
    });
    const other = out.match(/<\/?cms:[^>]*>/i);
    if (other) fail(`${where}: cannot convert CouchCMS tag: ${other[0]}`);
    return out;
};

/** A missing partial the site names a stand-in for (see `includes` in SITES). */
const standIn = (path, site) => {
    const siteDir = join(PROJECTS, site.dir);
    const to = site.includes?.[relative(siteDir, path).split(sep).join('/')];
    if (!to) return undefined;
    const target = join(siteDir, to);
    if (!existsSync(target)) fail(`no such stand-in partial: ${target}`);
    return target;
};

/** Renders a page or partial: includes are inlined, echoes printed, plain HTML kept. */
const render = (file, pageDir, site, seen = []) => {
    if (seen.includes(file)) fail(`include loop: ${[...seen, file].join(' -> ')}`);
    const where = relative(PROJECTS, file);
    return read(file).replace(PHP_BLOCK, (_, code) => {
        if (site.cms && COUCH_HOOK.test(code)) return '';
        const include = code.match(/^\s*(?:include|require)(?:_once)?\s*\(?\s*["']([^"']+)["']\s*\)?\s*;?\s*$/i);
        if (include) {
            // PHP resolves relative includes against the requested page's folder first.
            const target = [resolve(pageDir, include[1]), resolve(dirname(file), include[1])].find(existsSync) ?? standIn(resolve(pageDir, include[1]), site);
            if (target) return anchorRelative(render(target, pageDir, site, [...seen, file]), `/projects/${site.dir}/`);
            // PHP's include warns and carries on, so the live page rendered without it too.
            console.warn(`convert-php-sites: ${where}: include not found, left out as PHP did: ${include[1]}`);
            return '';
        }
        return parseEchoes(code, where);
    });
};

const isExternal = (url) => /^([a-z]+:)?\/\//i.test(url);

/** Points links at this copy: old domains become /projects/<dir>/, .php becomes .html. */
const rewriteLinks = (text, site) => {
    const root = `/projects/${site.dir}/`;
    for (const origin of site.origins) text = text.split(origin).join(root);
    // A bare folder link would be caught by the dev server's SPA fallback, so
    // name the index page outright.
    text = text.split(`${root}"`).join(`${root}index.html"`).split(`${root}'`).join(`${root}index.html'`).split(`${root}>`).join(`${root}index.html>`);
    text = text.split(`${root}#`).join(`${root}index.html#`);
    // Each ".php" is traced back to the start of its path by hand: a regex that
    // matched the path itself backtracks for minutes on minified bundles.
    return text.replace(/\.php(?=["'\s#?>)]|$)/gm, (ext, offset, whole) => {
        let start = offset;
        while (start > 0 && !/["'\s<>()=]/.test(whole[start - 1])) start--;
        const path = whole.slice(start, offset);
        return !path || isExternal(path) ? ext : '.html';
    });
};

/** The forms post to mail handlers; send them to the handler's thank-you page instead. */
const rewriteForms = (text, site) =>
    text.replace(/<form\b[^>]*>/gi, (tag) => {
        const action = tag.match(/\baction\s*=\s*["']([^"']*)["']/i)?.[1];
        const handler = action && Object.keys(site.forms).find((name) => action.endsWith(name));
        if (!handler) return tag;
        return tag.replace(action, site.forms[handler]).replace(/\bmethod\s*=\s*["']post["']/i, 'method="get"');
    });

/** Analytics, hit counters and social widgets from the original hosting have no place in a preview. */
const stripTrackers = (text) =>
    text
        .replace(/<script\b[^>]*\bsrc=["'][^"']*(googletagmanager|google-analytics|hitwebcounter)[^"']*["'][^>]*>\s*<\/script>/gi, '')
        .replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?(gtag\(|facebook-jssdk|_gaq)[\s\S]*?<\/script>/gi, '')
        // The counter snippet has no END marker in these pages; it is the comment plus one link.
        .replace(/<!--\s*hitwebcounter Code START\s*-->\s*<a\b[\s\S]*?<\/a>/gi, '')
        .replace(/<!--\s*Start of StatCounter Code[\s\S]*?End of StatCounter Code[^>]*-->/gi, '');

/** Scripts from services that no longer exist only fail to load (Adobe's Muse web fonts). */
const stripDeadServices = (text) => text.replace(/<script\b[^>]*\bsrc=["'][^"']*webfonts\.creativecloud\.com[^"']*["'][^>]*>\s*<\/script>/gi, '');

// The JotForm embeds, by form id. JotForm deleted the high school page's three, which then
// showed its "missing form" page, and the two that still load would send real submissions.
// Each is swapped for a copy of how it looked (scripts/jotform/<id>.html) that submits
// nowhere, or for nothing. A form missing from this list stops the converter.
const JOTFORMS = {
    // PistolArt's course sign-up and Dan James's contact form, copied from the live forms.
    82907418724160: 'scripts/jotform/82907418724160.html',
    62201054934144: 'scripts/jotform/62201054934144.html',
    // The 2012 high school page: a language poll (left out, as Jake asked), a comment box and a
    // five-star rating of the site.
    21562389538160: null,
    21510138934145: 'scripts/jotform/21510138934145.html',
    21578602597160: 'scripts/jotform/21578602597160.html',
};

const replaceJotForms = (text, where) =>
    text.replace(/<script\b[^>]*\bsrc=["'][^"']*\/\/form\.jotform\.[a-z]+\/jsform\/(\d+)["'][^>]*>\s*<\/script>/gi, (_, id) => {
        if (!(id in JOTFORMS)) fail(`${where}: no stand-in for JotForm form ${id} (see JOTFORMS)`);
        return JOTFORMS[id] ? read(join(PROJECTS, '..', '..', JOTFORMS[id])).trim() : '';
    });

/** The site's literal fixes (see SITES); one with a third entry applies only to files under that folder of the site. */
const applyReplace = (text, site, file) => {
    const path = relative(join(PROJECTS, site.dir), file).split(sep).join('/');
    for (const [from, to, only] of site.replace ?? []) if (!only || path.startsWith(only)) text = text.split(from).join(to);
    return text;
};

const staticName = (path) => path.replace(/\.html?$/i, '.static.html');

/**
 * Sends links to the plain .html pages that were rewritten (X.html -> X.static.html) and
 * links to pages that never existed here to the site's chosen stand-in.
 */
const relink = (text, file, site) => {
    const targets = new Map(Object.entries(site.redirects ?? {}));
    for (const page of site.pages ?? []) targets.set(page, staticName(page));
    if (!targets.size) return text;
    const siteDir = join(PROJECTS, site.dir);
    const lookup = (key) => {
        const to = targets.get(key);
        if (!to || isExternal(to)) return to;
        const [path, hash = ''] = to.split('#');
        const page = (site.pages ?? []).includes(path) ? staticName(path) : path;
        return `/projects/${site.dir}/${page}${hash && `#${hash}`}`;
    };
    return text.replace(/(\bhref\s*=\s*)(["']?)([^"'\s>]+)/gi, (whole, attr, quote, url) => {
        if (isExternal(url) || /^([#?]|[a-z]+:)/i.test(url)) return whole;
        const [, path, rest] = url.match(/^([^?#]*)(.*)$/);
        let decoded;
        try {
            decoded = decodeURIComponent(path.replace(/&amp;/g, '&'));
        } catch {
            return whole;
        }
        const target = decoded.startsWith('/') ? join(PROJECTS, '..', decoded) : resolve(dirname(file), decoded);
        const key = relative(siteDir, target).split(sep).join('/');
        if (key.startsWith('..')) return whole;
        const to = lookup(key);
        if (!to) return whole;
        return `${attr}${quote}${to.includes('#') ? to : to + rest}`;
    });
};

/** Fonts and libraries linked over plain http would be blocked on an https page. */
const upgradeHttp = (text) => text.replace(/http:\/\/(fonts\.googleapis\.com|code\.jquery\.com|ajax\.googleapis\.com)/g, 'https://$1');

const hasFlash = (text) => /\.swf\b|application\/x-shockwave-flash/i.test(text);

const addRuffle = (text) => {
    if (/<\/head>/i.test(text)) return text.replace(/<\/head>/i, `${RUFFLE}\n</head>`);
    return text.replace(/<body\b[^>]*>/i, (body) => `${body}\n${RUFFLE}`);
};

let pages = 0;
let scripts = 0;

for (const site of SITES) {
    const siteDir = join(PROJECTS, site.dir);
    if (!existsSync(siteDir)) fail(`no such folder: ${siteDir}`);
    const phpFiles = walk(siteDir).filter((f) => f.endsWith('.php'));
    const included = new Set();
    for (const file of phpFiles) {
        for (const [, code] of read(file).matchAll(PHP_BLOCK)) {
            const include = code.match(/(?:include|require)(?:_once)?\s*\(?\s*["']([^"']+)["']/i);
            if (include) included.add(resolve(dirname(file), include[1]));
        }
    }
    const handlers = new Set(Object.keys(site.forms).map((name) => join(siteDir, name)));
    const skipped = new Set((site.skip ?? []).map((page) => join(siteDir, page)));

    // A script or stylesheet the pages load that links to the old domains or to
    // .php, or that needs one of the site's fixes, gets a rewritten copy
    // (X.static.js, X.static.css), and the pages load that instead.
    const assetCopies = new Map();
    const assetCopy = (path) => {
        if (!assetCopies.has(path)) {
            const source = existsSync(path) ? read(path) : '';
            const rewritten = applyReplace(rewriteLinks(source, site), site, path);
            const copy = rewritten === source ? null : path.replace(/\.(js|css)$/, '.static.$1');
            if (copy) {
                write(copy, rewritten);
                scripts++;
            }
            assetCopies.set(path, copy);
        }
        return assetCopies.get(path);
    };
    // Script src and RequireJS data-main, stylesheet href; Muse adds ?crc=… to each.
    const useAssetCopies = (html, file) =>
        html.replace(/<(?:script|link)\b[^>]*>/gi, (tag) => {
            if (/^<link/i.test(tag) && !/\brel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
            return tag.replace(/(\b(?:src|data-main|href)=["'])([^"'?#]+\.(?:js|css))(?=[?#"'])/gi, (whole, open, src) => {
                if (isExternal(src)) return whole;
                const target = src.startsWith('/') ? join(PROJECTS, '..', src) : resolve(dirname(file), src);
                return assetCopy(target) ? `${open}${src.replace(/\.(js|css)$/, '.static.$1')}` : whole;
            });
        });

    const finish = (html, file) => {
        html = rewriteForms(html, site);
        html = rewriteLinks(html, site);
        html = relink(html, file, site);
        html = stripTrackers(html);
        html = stripDeadServices(html);
        html = replaceJotForms(html, relative(PROJECTS, file));
        html = upgradeHttp(html);
        html = applyReplace(html, site, file);
        html = useAssetCopies(html, file);
        if (hasFlash(html)) html = addRuffle(html);
        return html;
    };

    for (const file of phpFiles) {
        if (included.has(file) || handlers.has(file) || skipped.has(file)) continue;
        // A leftover partial nothing includes any more (sec_NavbarBAD.php) is not a page.
        if (!/<(!doctype|html|head|body)\b/i.test(read(file))) continue;
        let html = render(file, dirname(file), site);
        if (site.cms) html = renderEditables(html, relative(PROJECTS, file));
        write(file.replace(/\.php$/, '.html'), finish(html, file));
        pages++;
    }

    for (const page of site.pages ?? []) {
        const file = join(siteDir, page);
        if (!existsSync(file)) fail(`no such page: ${file}`);
        write(join(siteDir, staticName(page)), finish(read(file), file));
        pages++;
    }
}

console.log(`convert-php-sites: wrote ${pages} pages and ${scripts} rewritten scripts and stylesheets`);
