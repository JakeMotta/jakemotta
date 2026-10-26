#!/usr/bin/env node
// Removes what must never be published from build/ after `react-scripts build`
// copies all of public/ into it. Runs as part of `yarn build`, so the deploy,
// which uploads build/ as-is, never sees these files.
//
// - pistol-art/myAdmin: the old CouchCMS admin, with its database settings.
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

console.log(`prune-build: removed pistol-art/myAdmin and ${removed} .php files`);
