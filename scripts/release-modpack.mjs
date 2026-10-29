#!/usr/bin/env node
// Copies a built Progression Survival release into public/downloads/ and
// regenerates the files that say which release is the latest.
//
//   yarn modpack:release <release-folder>
//
// <release-folder> is what the pack builder writes, e.g.
//   ...\minecraft-progressive-smithing\outputs\Progression-Survival-1.0.0-rc.1
// It must hold mods.lock.json, SHA256SUMS.txt, Release-Notes.md, one .mrpack and
// one Progression-Survival-Server-*.zip.
//
// Published versions are immutable: every file gets a versioned name and path,
// so the deploy (which compares by size) and any cache can never serve a stale
// copy. The only files that change between releases are the pointers written
// at the end — releases.json, latest.json and .htaccess — and the deploy
// uploads those unconditionally.
//
// Only the client pack, the server template and the notes are published. The
// custom-source ZIP and the build evidence stay in the build workspace.

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SLUG = 'progression-survival';
const SITE_DIR = `/downloads/${SLUG}`;
const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'downloads', SLUG);

// Anything matching these inside an archive is a world, player state, an admin
// list or a secret, none of which may reach a public download. That includes a
// player's own client files: options.txt (and OptiFine's and Iris's copies),
// the saved server list, single-player saves, screenshots and launcher
// accounts. A pack that shipped options.txt would overwrite every player's
// settings with the builder's.
const PRIVATE_ENTRY =
    /(^|\/)(level\.dat|playerdata|advancements|stats|region|jake-progress\.json|locked-armor-returns\.json|empty-server-clock\.json|ops\.json|banned-[a-z]+\.json|whitelist\.json|usercache\.json|server\.properties|launcher_[a-z_]+\.json|logs|crash-reports|backups?|options(of|shaders)?\.txt|servers\.dat(_old)?|saves|screenshots|accounts\.json|\.env)(\/|$)|preview-unlock|\.log$/i;

const fail = (message) => {
    console.error(`release-modpack: ${message}`);
    process.exit(1);
};

const args = process.argv.slice(2);
const force = args.includes('--force');
const source = args.find((arg) => !arg.startsWith('--'));
if (!source) fail('usage: yarn modpack:release <release-folder> [--force]');
const sourceDir = resolve(source);
if (!existsSync(sourceDir)) fail(`no such folder: ${sourceDir}`);

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

// Entry names from a ZIP's central directory. Enough to audit what a pack would
// unpack without pulling in a ZIP library.
const zipEntries = (path) => {
    const buf = readFileSync(path);
    const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    if (eocd < 0) fail(`${basename(path)} is not a ZIP archive`);
    const count = buf.readUInt16LE(eocd + 10);
    let offset = buf.readUInt32LE(eocd + 16);
    const names = [];
    for (let i = 0; i < count; i++) {
        if (buf.readUInt32LE(offset) !== 0x02014b50) fail(`${basename(path)} has a damaged central directory`);
        const nameLength = buf.readUInt16LE(offset + 28);
        const extraLength = buf.readUInt16LE(offset + 30);
        const commentLength = buf.readUInt16LE(offset + 32);
        names.push(buf.toString('utf8', offset + 46, offset + 46 + nameLength));
        offset += 46 + nameLength + extraLength + commentLength;
    }
    return names;
};

const lockPath = join(sourceDir, 'mods.lock.json');
if (!existsSync(lockPath)) fail(`${sourceDir} has no mods.lock.json`);
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
const version = lock.version;
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(version ?? '')) fail(`mods.lock.json has an unusable version: ${version}`);

const listing = readdirSync(sourceDir);
const pick = (label, test) => {
    const matches = listing.filter(test);
    if (matches.length !== 1) fail(`expected exactly one ${label} in ${sourceDir}, found ${matches.length}`);
    return matches[0];
};
const clientFile = pick('client .mrpack', (name) => name.endsWith('.mrpack'));
const serverFile = pick('server ZIP', (name) => /^Progression-Survival-Server-.*\.zip$/.test(name));
if (!clientFile.includes(version) || !serverFile.includes(version)) fail(`archive names do not match lock version ${version}: ${clientFile}, ${serverFile}`);
if (!existsSync(join(sourceDir, 'Release-Notes.md'))) fail(`${sourceDir} has no Release-Notes.md`);

// The builder's own checksums. A mismatch means an archive was rebuilt after
// the sums were written, and which one is right is not something to guess.
// Some builds write only latest.json, whose artifacts carry the same hashes.
const sumsPath = join(sourceDir, 'SHA256SUMS.txt');
const builderLatestPath = join(sourceDir, 'latest.json');
let expected;
if (existsSync(sumsPath)) {
    expected = Object.fromEntries(
        readFileSync(sumsPath, 'utf8')
            .split(/\r?\n/)
            .map((line) => line.trim().split(/\s+\*?/))
            .filter(([hash, name]) => hash && name)
            .map(([hash, name]) => [name, hash.toLowerCase()]),
    );
} else if (existsSync(builderLatestPath)) {
    const builderLatest = JSON.parse(readFileSync(builderLatestPath, 'utf8'));
    if (builderLatest.version !== version) fail(`latest.json is for ${builderLatest.version}, not ${version}`);
    expected = Object.fromEntries((builderLatest.artifacts ?? []).map(({ file, sha256 }) => [file, String(sha256).toLowerCase()]));
} else {
    fail(`${sourceDir} has neither SHA256SUMS.txt nor latest.json`);
}

const describe = (name) => {
    const path = join(sourceDir, name);
    const hash = sha256(path);
    if (expected[name] !== hash) fail(`${name} does not match SHA256SUMS.txt (${expected[name] ?? 'not listed'} vs ${hash})`);
    const leaked = zipEntries(path).filter((entry) => PRIVATE_ENTRY.test(entry));
    if (leaked.length) fail(`${name} contains private files:\n  ${leaked.join('\n  ')}`);
    return { name, url: `${SITE_DIR}/releases/${version}/${name}`, bytes: statSync(path).size, sha256: hash };
};
const client = describe(clientFile);
const server = describe(serverFile);

const releaseDir = join(OUT_DIR, 'releases', version);
if (existsSync(releaseDir) && !force) fail(`${version} is already published. Releases are immutable — bump the version, or pass --force to overwrite one that has not been deployed yet.`);
mkdirSync(releaseDir, { recursive: true });
for (const name of [clientFile, serverFile, 'Release-Notes.md']) copyFileSync(join(sourceDir, name), join(releaseDir, name));
writeFileSync(join(releaseDir, 'SHA256SUMS.txt'), `${client.sha256}  ${client.name}\n${server.sha256}  ${server.name}\n`);

// The first paragraph after the title, for the download page.
const notes = readFileSync(join(sourceDir, 'Release-Notes.md'), 'utf8');
const summary = notes.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).find((block) => block && !block.startsWith('#')) ?? '';

const indexPath = join(OUT_DIR, 'releases.json');
const index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : { pack: lock.pack, releases: [] };
const previous = index.releases.find((release) => release.version === version);
const release = {
    version,
    prerelease: version.includes('-'),
    published: previous?.published ?? new Date().toISOString().slice(0, 10),
    minecraft: lock.minecraft,
    neoforge: lock.neoforge,
    java: lock.java,
    summary,
    notes: `${SITE_DIR}/releases/${version}/Release-Notes.md`,
    checksums: `${SITE_DIR}/releases/${version}/SHA256SUMS.txt`,
    client,
    server,
};
index.pack = lock.pack;
index.releases = [release, ...index.releases.filter((entry) => entry.version !== version)];
const latest = index.releases[0];

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
writeFileSync(join(OUT_DIR, 'latest.json'), `${JSON.stringify({ pack: index.pack, ...latest }, null, 2)}\n`);

// Stable links that always resolve to the newest files. A 302, never a 301:
// browsers keep a 301 forever and would pin a friend to an old release.
writeFileSync(
    join(OUT_DIR, '.htaccess'),
    `# Generated by scripts/release-modpack.mjs — do not edit by hand.

AddType application/x-modrinth-modpack+zip .mrpack

<IfModule mod_rewrite.c>
\tRewriteEngine On
\tRewriteRule ^latest\\.mrpack$ ${latest.client.url} [R=302,L]
\tRewriteRule ^latest-server\\.zip$ ${latest.server.url} [R=302,L]
</IfModule>

<IfModule mod_headers.c>
\t# The pointers must be re-checked on every request, or a cache in front of
\t# the site keeps handing out the previous release after a deploy.
\t<FilesMatch "\\.json$">
\t\tHeader set Cache-Control "no-cache"
\t</FilesMatch>
\tHeader always set Cache-Control "no-store" "expr=%{REQUEST_URI} =~ m#/latest(-server)?\\.(mrpack|zip)$#"

\t# Archives download rather than open, under their versioned name.
\t<FilesMatch "\\.(mrpack|zip)$">
\t\tHeader set Content-Disposition attachment
\t</FilesMatch>
</IfModule>
`,
);

console.log(`Published ${lock.pack} ${version} to public${SITE_DIR}/releases/${version}/`);
console.log(`  ${client.name}  ${client.bytes} bytes`);
console.log(`  ${server.name}  ${server.bytes} bytes`);
console.log(`latest -> ${latest.version}`);
