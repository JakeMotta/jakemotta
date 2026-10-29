#!/usr/bin/env node
// Writes build/sitemap.xml, the list of pages search engines are pointed at
// (public/robots.txt names it). Runs as part of `yarn build`, after
// react-scripts build, so the project pages always match src/content.json.
//
// It lists the app's own routes: the board, its overlays, one viewer page
// per project and one per hub page (Ambii Business's apps). The standalone sites under /projects/ are left out; each is
// reached through its viewer page.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(ROOT, 'build');
const SITE_URL = 'https://jakemotta.com';

if (!existsSync(BUILD)) {
    console.error('write-sitemap: no build/ folder; run react-scripts build first');
    process.exit(1);
}

// The ids come from src/content.json, which lists every project in order. A hub's pages (pages: [{ slug, … }])
// have their own addresses under the project's; they're read from constants.ts's source, since it's TypeScript.
const ids = JSON.parse(readFileSync(join(ROOT, 'src', 'content.json'), 'utf8')).projects.map((project) => project.id);
const constants = readFileSync(join(ROOT, 'src', 'common', 'constants.ts'), 'utf8');
const start = constants.indexOf('const projectDetails');
const details = constants.slice(start, constants.indexOf('\n};', start));
const pages = details
    .split(/^ {4}'?([a-z0-9-]+)'?: \{\r?$/m)
    .slice(1)
    .flatMap((part, i, parts) => (i % 2 ? [] : [...parts[i + 1].matchAll(/slug: '([^']+)'/g)].map((match) => `/project/${part}/${match[1]}`)));
if (!ids.length) {
    console.error('write-sitemap: found no projects in src/content.json');
    process.exit(1);
}

const paths = ['/', '/project', '/library', '/minecraft', '/devlog', ...ids.map((id) => `/project/${id}`), ...pages];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(BUILD, 'sitemap.xml'), xml);
console.log(`write-sitemap: ${paths.length} pages`);
