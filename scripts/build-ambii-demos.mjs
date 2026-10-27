#!/usr/bin/env node
// Builds the three Ambii Business demos and publishes them under
// public/projects/ambii-business/ (dashboard/, player/, mobile/).
//
//   node scripts/build-ambii-demos.mjs [dashboard|player|mobile ...]
//
// Each app in demos/ambii/ is its own npm project with the old toolchain it was
// written for (react-scripts 3 and 4, webpack 5 for the react-native-web port),
// so this installs each one from its lockfile when its node_modules is missing
// or older than the lockfile, then runs its `demo:build` script, which builds
// and copies the output into public/ through demos/ambii/shared/publish-build.mjs.
// The output is committed: CI only runs `yarn build`, which copies public/ as-is.
// The apps' own source isn't: their upstream repositories are private, so the three
// folders are gitignored and this only runs where they exist (Jake's machine, or a clone
// of each repository's jakemotta-demo branch).
// How the demos work: demos/ambii/README.md and docs/projects/ambii-business.md.

import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEMOS = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'demos', 'ambii');

const APPS = {
    dashboard: 'business-web',
    player: 'web-player',
    mobile: 'music-app',
};

const wanted = process.argv.slice(2);
for (const name of wanted) {
    if (!APPS[name]) {
        console.error(`build-ambii-demos: unknown app "${name}"; expected ${Object.keys(APPS).join(', ')}`);
        process.exit(1);
    }
}

const missing = Object.entries(APPS)
    .filter(([name, folder]) => (!wanted.length || wanted.includes(name)) && !existsSync(join(DEMOS, folder, 'package.json')))
    .map(([, folder]) => `demos/ambii/${folder}/`);
if (missing.length) {
    console.error(`build-ambii-demos: missing ${missing.join(', ')}. The apps' source isn't in this repo; clone each one's private repository at its jakemotta-demo branch (see "Where the source lives" in docs/projects/ambii-business.md).`);
    process.exit(1);
}

const run = (cwd, args) => {
    console.log(`\n> npm ${args.join(' ')}   (demos/ambii/${cwd.split(/[\\/]/).pop()})`);
    // npm is npm.cmd on Windows, which spawn only finds through a shell. The arguments are fixed words,
    // so there they go into the command line (Node deprecates an argument list alongside shell: true).
    const options = { cwd, stdio: 'inherit' };
    const result = process.platform === 'win32' ? spawnSync(`npm ${args.join(' ')}`, { ...options, shell: true }) : spawnSync('npm', args, options);
    if (result.status !== 0) process.exit(result.status ?? 1);
};

for (const [name, folder] of Object.entries(APPS)) {
    if (wanted.length && !wanted.includes(name)) continue;
    const cwd = join(DEMOS, folder);
    const modules = join(cwd, 'node_modules');
    const lock = join(cwd, 'package-lock.json');
    // The apps' old peer ranges (React 16 libraries next to React 17) need --legacy-peer-deps under npm 7+.
    if (!existsSync(modules) || statSync(lock).mtimeMs > statSync(modules).mtimeMs) run(cwd, ['ci', '--legacy-peer-deps', '--no-audit', '--no-fund']);
    run(cwd, ['run', 'demo:build']);
}
