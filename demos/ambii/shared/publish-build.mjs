#!/usr/bin/env node
// Copies an Ambii demo's build output into public/projects/ambii-business/<app>/, replacing what was
// there, and leaves out files that must not be published. Each demo's `demo:build`
// script ends with this, so the folder under public/ always matches one build.
//
// Usage: node publish-build.mjs <build-dir> <app-folder>
//   e.g. node ../shared/publish-build.mjs build dashboard
//
// Left out:
// - *.map: source maps. They would publish the apps' full source, which comes from private
//   repositories and is kept out of this repo too (docs/projects/ambii-business.md).
// - asset-manifest.json, service-worker.js, precache-manifest.*.js: nothing reads the
//   manifest, and a service worker would cache an old build in visitors' browsers.

import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [buildArg, name] = process.argv.slice(2);
if (!buildArg || !['dashboard', 'player', 'mobile'].includes(name)) {
    console.error('usage: node publish-build.mjs <build-dir> dashboard|player|mobile');
    process.exit(1);
}

const build = resolve(buildArg);
const target = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'public', 'projects', 'ambii-business', name);
if (!existsSync(join(build, 'index.html'))) {
    console.error(`publish-build: ${build} has no index.html; build first`);
    process.exit(1);
}

const skip = (file) => file.endsWith('.map') || ['asset-manifest.json', 'service-worker.js'].includes(file) || /^precache-manifest\..*\.js$/.test(file);

rmSync(target, { recursive: true, force: true });
cpSync(build, target, { recursive: true, filter: (src) => statSync(src).isDirectory() || !skip(basename(src)) });

let files = 0;
const count = (dir) => readdirSync(dir, { withFileTypes: true }).forEach((entry) => (entry.isDirectory() ? count(join(dir, entry.name)) : files++));
count(target);
console.log(`publish-build: ${files} files in public/projects/ambii-business/${name}/`);
