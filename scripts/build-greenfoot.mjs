#!/usr/bin/env node
// Builds Jake's Greenfoot games into JavaScript, so they run in the browser without a Java VM.
//
//   node scripts/build-greenfoot.mjs [id…]      (yarn projects:greenfoot)
//
// Each game's original jar stays as it is in public/projects/<id>/. The build reads the game's own compiled classes
// out of it, unchanged apart from one rename (java.awt.Color and Font, which a browser doesn't have, become
// Greenfoot's own greenfoot.Color and greenfoot.Font), and compiles them with TeaVM, an ahead-of-time Java-to-
// JavaScript compiler, against a small Greenfoot runtime of our own in demos/greenfoot/runtime/ that draws on a
// canvas. Out comes public/projects/<id>/web/: the game as one script, host.js (the browser side of the runtime),
// the images and sounds the game loads, as plain files, and manifest.json, which names them all.
// docs/projects/greenfoot-web.md has the details.
//
// Needs a JDK (javac), found through JAVA_HOME, then ~/.jdks/, then the PATH. TeaVM's jars are downloaded from
// Maven Central into ~/.cache/teavm/ the first time.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNTIME = join(ROOT, 'demos', 'greenfoot', 'runtime');
const HOST = join(ROOT, 'demos', 'greenfoot', 'host.js');

// jars: the applet's archive, in its order: a file in an earlier jar wins over the same file in a later one, so
// the small fix jars beside the original (docs/projects/<id>.md) apply here too.
const GAMES = [
    {
        id: 'coloris',
        jars: ['game-speed.jar', 'coloris.jar'],
    },
    // From the jar its CheerpJ copy runs (docs/projects/rebound.md)
    {
        id: 'rebound',
        jars: ['java/rebound.jar'],
    },
    // browser-timer.jar is a CheerpJ-only fix, so only the original jar
    {
        id: 'isguy',
        jars: ['isGuyFinal.jar'],
    },
    // Assembled from the scenario in Ninjai/ (docs/projects/ninjadonut-game.md)
    {
        id: 'ninjadonut-game',
        jars: ['ninjadonut.jar'],
    },
    {
        // start-at-title.jar opens on the title instead of the town; closed-sign.jar skips text the town drew and
        // threw away every act (docs/projects/greenfoot-pokemon.md)
        id: 'greenfoot-pokemon',
        jars: ['start-at-title.jar', 'closed-sign.jar', 'V10.jar'],
    },
];

const TEAVM_VERSION = '0.12.0';
const TEAVM_JARS = [
    'org/teavm/teavm-cli',
    'org/teavm/teavm-tooling',
    'org/teavm/teavm-core',
    'org/teavm/teavm-classlib',
    'org/teavm/teavm-interop',
    'org/teavm/teavm-metaprogramming-api',
    'org/teavm/teavm-metaprogramming-impl',
    'org/teavm/teavm-jso',
    'org/teavm/teavm-jso-apis',
    'org/teavm/teavm-jso-impl',
    'org/teavm/teavm-platform',
    'org/teavm/teavm-relocated-libs-asm',
    'org/teavm/teavm-relocated-libs-asm-analysis',
    'org/teavm/teavm-relocated-libs-asm-commons',
    'org/teavm/teavm-relocated-libs-asm-tree',
    'org/teavm/teavm-relocated-libs-asm-util',
    'org/teavm/teavm-relocated-libs-commons-cli',
    'org/teavm/teavm-relocated-libs-commons-io',
    'org/teavm/teavm-relocated-libs-hppc',
    'org/teavm/teavm-relocated-libs-rhino',
].map((path) => `${path}/${TEAVM_VERSION}/${path.split('/').pop()}-${TEAVM_VERSION}.jar`).concat([
    'commons-io/commons-io/2.18.0/commons-io-2.18.0.jar',
    'com/jcraft/jzlib/1.1.3/jzlib-1.1.3.jar',
    'joda-time/joda-time/2.12.2/joda-time-2.12.2.jar',
]);

// The jar's Greenfoot itself, which our runtime replaces, and the resource folders, where an old copy of a project
// can sit with its classes (Pokémon's images/PokemonGameV1/)
const GREENFOOT_PREFIXES = ['greenfoot/', 'bluej/', 'javazoom/', 'META-INF/', 'images/', 'sounds/'];
const IMAGE = /\.(png|gif|jpe?g|bmp)$/i;
const SOUND = /\.(wav|mp3|aiff?|au|mid|ogg)$/i;
const RENAMES = { 'java/awt/Color': 'greenfoot/Color', 'java/awt/Font': 'greenfoot/Font' };

const SEP = process.platform === 'win32' ? ';' : ':';

// Tools

function findJavac() {
    const exe = process.platform === 'win32' ? 'javac.exe' : 'javac';
    const homes = [];
    if (process.env.JAVA_HOME) homes.push(process.env.JAVA_HOME);
    const jdks = join(homedir(), '.jdks');
    if (existsSync(jdks)) homes.push(...readdirSync(jdks).sort().reverse().map((name) => join(jdks, name)));
    for (const home of homes) {
        const javac = join(home, 'bin', exe);
        if (existsSync(javac)) return { javac, java: join(home, 'bin', exe.replace('javac', 'java')) };
    }
    try {
        execFileSync('javac', ['-version'], { stdio: 'ignore' });
        return { javac: 'javac', java: 'java' };
    } catch {
        throw new Error('No JDK found. Install one (Temurin 21 is fine), or point JAVA_HOME at it.');
    }
}

async function teavmClasspath() {
    const dir = join(homedir(), '.cache', 'teavm', TEAVM_VERSION);
    mkdirSync(dir, { recursive: true });
    const files = [];
    for (const path of TEAVM_JARS) {
        const file = join(dir, path.split('/').pop());
        if (!existsSync(file)) {
            console.log(`Downloading ${path.split('/').pop()}`);
            const response = await fetch(`https://repo1.maven.org/maven2/${path}`);
            if (!response.ok) throw new Error(`Could not download ${path}: ${response.status}`);
            writeFileSync(file, Buffer.from(await response.arrayBuffer()));
        }
        files.push(file);
    }
    return files;
}

// Jars

/** A jar's entries as { name: Buffer }, read from its central directory */
function readJar(file) {
    const data = readFileSync(file);
    let end = data.length - 22;
    while (end >= 0 && data.readUInt32LE(end) !== 0x06054b50) end--;
    if (end < 0) throw new Error(`${file} is not a zip file`);
    const count = data.readUInt16LE(end + 10);
    let offset = data.readUInt32LE(end + 16);
    const entries = {};
    for (let i = 0; i < count; i++) {
        const method = data.readUInt16LE(offset + 10);
        const size = data.readUInt32LE(offset + 20);
        const nameLength = data.readUInt16LE(offset + 28);
        const extraLength = data.readUInt16LE(offset + 30);
        const commentLength = data.readUInt16LE(offset + 32);
        const local = data.readUInt32LE(offset + 42);
        const name = data.toString('utf8', offset + 46, offset + 46 + nameLength);
        offset += 46 + nameLength + extraLength + commentLength;
        if (name.endsWith('/')) continue;
        const start = local + 30 + data.readUInt16LE(local + 26) + data.readUInt16LE(local + 28);
        const raw = data.subarray(start, start + size);
        entries[name] = method === 0 ? raw : inflateRawSync(raw);
    }
    return entries;
}

/** The game's files, with earlier jars winning */
function readGame(game) {
    const files = {};
    for (const jar of [...game.jars].reverse()) Object.assign(files, readJar(join(ROOT, 'public', 'projects', game.id, jar)));
    return files;
}

function readProperties(buffer) {
    const properties = {};
    for (const line of (buffer ? buffer.toString('latin1') : '').split(/\r?\n/)) {
        const match = /^\s*([^#!][^=:]*?)\s*[=:]\s*(.*)$/.exec(line);
        if (match) properties[match[1]] = match[2].replace(/\\(.)/g, '$1');
    }
    return properties;
}

// Class files

/**
 * Parses a class file's constant pool and hands each UTF-8 constant to `rename`, which may return a new string.
 * Returns the rewritten class file and the strings in the pool (string literals included).
 */
function rewriteClass(bytes, rename) {
    const count = bytes.readUInt16BE(8);
    const parts = [bytes.subarray(0, 10)];
    const strings = [];
    let offset = 10;
    for (let index = 1; index < count; index++) {
        const tag = bytes[offset];
        let length;
        switch (tag) {
            case 1: {
                const size = bytes.readUInt16BE(offset + 1);
                const text = bytes.toString('utf8', offset + 3, offset + 3 + size);
                strings.push(text);
                const renamed = rename(text);
                if (renamed !== text) {
                    const encoded = Buffer.from(renamed, 'utf8');
                    const header = Buffer.from([1, encoded.length >> 8, encoded.length & 0xff]);
                    parts.push(header, encoded);
                    offset += 3 + size;
                    continue;
                }
                length = 3 + size;
                break;
            }
            case 7: case 8: case 16: case 19: case 20: length = 3; break;
            case 15: length = 4; break;
            case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: length = 5; break;
            case 5: case 6: length = 9; index++; break;
            default: throw new Error(`Unknown constant pool tag ${tag}`);
        }
        parts.push(bytes.subarray(offset, offset + length));
        offset += length;
    }
    parts.push(bytes.subarray(offset));
    return { bytes: Buffer.concat(parts), strings };
}

function renameAwt(text) {
    let result = text;
    for (const [from, to] of Object.entries(RENAMES)) result = result.split(from).join(to);
    return result;
}

// Greenfoot looks an image up under images/ first, then as given; a name with ../ in it was found inside the jar
// through a URL that dropped the ../ (see docs/projects/coloris.md)
function resolveResource(files, name, folder) {
    for (const candidate of [`${folder}/${name}`, name]) {
        const path = posix.normalize(candidate).replace(/^(\.\.\/)+/, '');
        if (files[path]) return path;
    }
    return null;
}

// The build

async function build(game, tools, teavm) {
    const work = mkdtempSync(join(tmpdir(), `greenfoot-${game.id}-`));
    try {
        const files = readGame(game);
        const project = readProperties(files['project.greenfoot']);
        const standalone = readProperties(files['standalone.properties']);
        const mainWorld = standalone['main.class'] || project['world.lastInstantiated'];
        const speed = Number(project['simulation.speed'] || 50);

        // The game's classes, renamed, and every string they hold
        const classes = join(work, 'classes');
        const strings = new Set();
        const awtLeft = new Set();
        for (const [name, bytes] of Object.entries(files)) {
            if (!name.endsWith('.class') || GREENFOOT_PREFIXES.some((prefix) => name.startsWith(prefix)) || name.includes('..')) continue;
            // Not a class name: a stray copy, like Pokémon's "BattleWorld (Lost Boy's conflicted copy 2012-05-28).class"
            if (!/^[\w$/]+\.class$/.test(name)) {
                console.log(`  ${game.id}: skipping ${name}`);
                continue;
            }
            const rewritten = rewriteClass(bytes, renameAwt);
            for (const text of rewritten.strings) {
                strings.add(text);
                for (const match of text.matchAll(/java\/awt\/[\w/$]+/g)) if (!RENAMES[match[0]]) awtLeft.add(match[0]);
            }
            mkdirSync(dirname(join(classes, name)), { recursive: true });
            writeFileSync(join(classes, name), rewritten.bytes);
        }
        if (awtLeft.size) throw new Error(`${game.id} uses AWT beyond Color and Font: ${[...awtLeft].join(', ')}`);

        // The images and sounds it names, plus project.greenfoot's class images
        const classImages = Object.entries(project)
            .filter(([key]) => /^class\.[^.]+\.image$/.test(key))
            .map(([key, file]) => [key.slice(6, -6), file]);
        const images = {};
        const sounds = {};
        for (const text of [...strings, ...classImages.map(([, file]) => file)]) {
            if (IMAGE.test(text)) {
                const path = resolveResource(files, text, 'images');
                if (path) images[text] = path;
                else console.warn(`  ${game.id}: no image for "${text}"`);
            } else if (SOUND.test(text)) {
                const path = resolveResource(files, text, 'sounds');
                if (path) sounds[text] = path;
                else console.warn(`  ${game.id}: no sound for "${text}"`);
            }
        }
        // Greenfoot's logo, which an actor without an image of its own shows
        images['<greenfoot-logo>'] = 'greenfoot.png';
        if (!files['greenfoot.png']) throw new Error(`${game.id}: the jar has no greenfoot.png`);

        // The launcher: the starting world, its speed and the class images
        const launcher = join(work, 'launcher');
        mkdirSync(launcher);
        const quote = (text) => JSON.stringify(text);
        writeFileSync(join(launcher, 'GreenfootWebMain.java'), [
            'public class GreenfootWebMain {',
            '    public static void main(String[] args) {',
            ...classImages.map(([name, file]) => `        greenfoot.Simulation.setClassImage(${quote(name)}, ${quote(file)});`),
            `        greenfoot.Simulation.start(() -> new ${mainWorld}(), ${speed});`,
            '    }',
            '}',
            '',
        ].join('\n'));

        const runtimeClasses = join(work, 'runtime');
        const jso = teavm.find((file) => file.includes('teavm-jso-0'));
        const runtimeSources = readdirSync(join(RUNTIME, 'greenfoot')).map((file) => join(RUNTIME, 'greenfoot', file));
        execFileSync(tools.javac, ['--release', '8', '-Xlint:-options', '-nowarn', '-cp', jso, '-d', runtimeClasses, ...runtimeSources], { stdio: 'inherit' });
        execFileSync(tools.javac, ['--release', '8', '-Xlint:-options', '-nowarn', '-cp', [runtimeClasses, classes].join(SEP), '-d', classes, join(launcher, 'GreenfootWebMain.java')], { stdio: 'inherit' });

        // TeaVM
        const out = join(ROOT, 'public', 'projects', game.id, 'web');
        rmSync(out, { recursive: true, force: true });
        mkdirSync(out, { recursive: true });
        execFileSync(tools.java, [
            '-cp', [...teavm, runtimeClasses, classes].join(SEP),
            'org.teavm.cli.TeaVMRunner',
            '-t', 'js', '-O', '2', '--minify', '--js-module-type', 'none',
            '-d', out, '-f', 'game.js',
            'GreenfootWebMain',
        ], { stdio: 'inherit' });

        // The files it loads. TeaVM leaves out every class the game can't reach, so a name that didn't make it into
        // game.js is never loaded and isn't shipped (Coloris's unused 3.8 MB map, for one).
        const script = readFileSync(join(out, 'game.js'), 'utf8');
        const kept = new Set(['<greenfoot-logo>', ...classImages.map(([, file]) => file)]);
        const copy = (folder, table) => {
            const manifest = {};
            for (const [name, path] of Object.entries(table)) {
                if (!kept.has(name) && !script.includes(name)) continue;
                const target = `${folder}/${path}`;
                mkdirSync(dirname(join(out, target)), { recursive: true });
                writeFileSync(join(out, target), files[path]);
                manifest[name] = target;
            }
            return manifest;
        };
        // The scripts are named by content hash, so neither a browser's cache nor the size-only deploy can keep an
        // old one; manifest.json, the one fixed name, is fetched uncached and uploaded every deploy
        const hashed = (name, contents) => {
            const file = name.replace('.js', `.${createHash('sha256').update(contents).digest('hex').slice(0, 10)}.js`);
            writeFileSync(join(out, file), contents);
            return file;
        };
        const manifest = {
            host: hashed('host.js', readFileSync(HOST)),
            game: hashed('game.js', script),
            images: copy('files', images),
            sounds: copy('files', sounds),
        };
        rmSync(join(out, 'game.js'));
        writeFileSync(join(out, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
        console.log(`${game.id}: ${mainWorld} at speed ${speed}, ${Object.keys(manifest.images).length} images, ${Object.keys(manifest.sounds).length} sounds -> public/projects/${game.id}/web/`);
    } finally {
        rmSync(work, { recursive: true, force: true });
    }
}

const wanted = process.argv.slice(2);
const unknown = wanted.filter((id) => !GAMES.some((game) => game.id === id));
if (unknown.length) {
    console.error(`Unknown game: ${unknown.join(', ')}. Known: ${GAMES.map((game) => game.id).join(', ')}`);
    process.exit(1);
}
const tools = findJavac();
const teavm = await teavmClasspath();
for (const game of GAMES.filter((g) => !wanted.length || wanted.includes(g.id))) {
    await build(game, tools, teavm);
}
