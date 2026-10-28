#!/usr/bin/env node
// Removes what must never be published from build/ after `react-scripts build`
// copies all of public/ into it. Runs as part of `yarn build`, so the deploy,
// which uploads build/ as-is, never sees these files.
//
// - pistol-art/myAdmin: the old CouchCMS admin, with its database settings.
// - the Ambii build in pistol-art/files: a compiled Ambii web app whose source
//   maps hold Ambii's private source, plus an old scraper's notes. Pistol Art's
//   own files beside them (its CSS, scripts, partials and pdfs/) stay.
// - every .php under projects/: the PHP sites are published as the static
//   .html pages scripts/convert-php-sites.mjs writes beside them, and the
//   originals include mail handlers that would send real email.

import { existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'build');
const PROJECTS = join(BUILD, 'projects');

if (!existsSync(BUILD)) {
    console.error('prune-build: no build/ folder; run react-scripts build first');
    process.exit(1);
}

rmSync(join(PROJECTS, 'pistol-art', 'myAdmin'), { recursive: true, force: true });

const AMBII_BUILD = join(PROJECTS, 'pistol-art', 'files');
const AMBII_FILES = ['static', '.htaccess', 'index.html', 'asset-manifest.json', 'manifest.json', 'service-worker.js', 'favicon.ico', 'icon.png', 'README.md', 'requirements.txt'];
for (const name of AMBII_FILES) rmSync(join(AMBII_BUILD, name), { recursive: true, force: true });
if (existsSync(AMBII_BUILD)) {
    for (const name of readdirSync(AMBII_BUILD)) if (name.startsWith('precache-manifest.')) rmSync(join(AMBII_BUILD, name));
}

let removed = 0;
const prune = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) prune(path);
        else if (entry.name.toLowerCase().endsWith('.php')) {
            rmSync(path);
            removed++;
        }
    }
};
if (existsSync(PROJECTS)) prune(PROJECTS);

console.log(`prune-build: removed pistol-art/myAdmin, the Ambii build in pistol-art/files and ${removed} .php files`);
