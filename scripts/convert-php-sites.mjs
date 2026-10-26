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

/** Renders a page or partial: includes are inlined, echoes printed, plain HTML kept. */
const render = (file, pageDir, site, seen = []) => {
    if (seen.includes(file)) fail(`include loop: ${[...seen, file].join(' -> ')}`);
    const where = relative(PROJECTS, file);
    return read(file).replace(PHP_BLOCK, (_, code) => {
        if (site.cms && COUCH_HOOK.test(code)) return '';
        const include = code.match(/^\s*(?:include|require)(?:_once)?\s*\(?\s*["']([^"']+)["']\s*\)?\s*;?\s*$/i);
        if (include) {
            // PHP resolves relative includes against the requested page's folder first.
            const target = [resolve(pageDir, include[1]), resolve(dirname(file), include[1])].find(existsSync);
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

/** The site's literal fixes (see SITES). */
const applyReplace = (text, site) => {
    for (const [from, to] of site.replace ?? []) text = text.split(from).join(to);
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

    // A script or stylesheet the pages load that links to the old domains or to
    // .php, or that needs one of the site's fixes, gets a rewritten copy
    // (X.static.js, X.static.css), and the pages load that instead.
    const assetCopies = new Map();
    const assetCopy = (path) => {
        if (!assetCopies.has(path)) {
            const source = existsSync(path) ? read(path) : '';
            const rewritten = applyReplace(rewriteLinks(source, site), site);
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
        html = upgradeHttp(html);
        html = applyReplace(html, site);
        html = useAssetCopies(html, file);
        if (hasFlash(html)) html = addRuffle(html);
        return html;
    };

    for (const file of phpFiles) {
        if (included.has(file) || handlers.has(file)) continue;
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
