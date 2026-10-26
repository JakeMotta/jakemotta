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
// Anything PHP the converter does not understand stops it with the file and
// the snippet, so nothing is dropped silently. Rerun it after editing a page.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
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

/** Renders a page or partial: includes are inlined, echoes printed, plain HTML kept. */
const render = (file, pageDir, site, seen = []) => {
    if (seen.includes(file)) fail(`include loop: ${[...seen, file].join(' -> ')}`);
    const where = relative(PROJECTS, file);
    return read(file).replace(PHP_BLOCK, (_, code) => {
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
        .replace(/<!--\s*hitwebcounter Code START\s*-->\s*<a\b[\s\S]*?<\/a>/gi, '');

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

    // A script the pages load that links to the old domains or to .php gets a
    // rewritten copy, X.static.js, and the pages load that instead.
    const scriptCopies = new Map();
    const scriptCopy = (path) => {
        if (!scriptCopies.has(path)) {
            const source = existsSync(path) ? read(path) : '';
            const rewritten = rewriteLinks(source, site);
            const copy = rewritten === source ? null : path.replace(/\.js$/, '.static.js');
            if (copy) {
                write(copy, rewritten);
                scripts++;
            }
            scriptCopies.set(path, copy);
        }
        return scriptCopies.get(path);
    };

    for (const file of phpFiles) {
        if (included.has(file) || handlers.has(file)) continue;
        // A leftover partial nothing includes any more (sec_NavbarBAD.php) is not a page.
        if (!/<(!doctype|html|head|body)\b/i.test(read(file))) continue;
        let html = render(file, dirname(file), site);
        html = rewriteForms(html, site);
        html = rewriteLinks(html, site);
        html = stripTrackers(html);
        html = upgradeHttp(html);
        html = html.replace(/(<script\b[^>]*\bsrc=["'])([^"']+\.js)(["'])/gi, (whole, open, src, close) => {
            if (isExternal(src)) return whole;
            const target = src.startsWith('/') ? join(PROJECTS, '..', src) : resolve(dirname(file), src);
            return scriptCopy(target) ? `${open}${src.replace(/\.js$/, '.static.js')}${close}` : whole;
        });
        if (hasFlash(html)) html = addRuffle(html);
        write(file.replace(/\.php$/, '.html'), html);
        pages++;
    }
}

console.log(`convert-php-sites: wrote ${pages} pages and ${scripts} rewritten scripts`);
