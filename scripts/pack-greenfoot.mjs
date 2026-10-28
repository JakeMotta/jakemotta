#!/usr/bin/env node
// Packs a Greenfoot scenario folder (an unpacked .gfar) into a jar that yarn projects:greenfoot can build from, for a
// game Greenfoot never exported. See docs/projects/greenfoot-web.md, Converting a game.
//
//   yarn projects:greenfoot-pack <scenario folder> <jar to write> [project name]
//
// The jar is laid out like a Greenfoot 3.0.4 export, so `java -jar` should run it too:
// - the game: the folder's compiled .class files and project.greenfoot, its images/ (PNG, GIF, JPEG) and sounds/,
//   unchanged. The .java, .ctxt and other files are left out;
// - the Greenfoot 3.0.4 runtime (greenfoot/, bluej/, javazoom/ and the control-bar icons), copied byte for byte
//   from public/projects/coloris/coloris.jar, with its manifest;
// - standalone.properties: coloris.jar's, with main.class set to the scenario's world.lastInstantiated (the world
//   Greenfoot opened it on) and project.name to the name given (the folder's name by default);
// - soundindex.list, empty.
// The scenario's classes must already be compiled: the build never compiles source.
//
// Entries are written in a fixed order with a fixed date, so packing the same folder again gives the same jar.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RUNTIME_JAR = join(ROOT, 'public', 'projects', 'coloris', 'coloris.jar');
const RUNTIME = ['greenfoot/', 'bluej/', 'javazoom/'];
const ICONS = ['greenfoot.png', 'noParking.png', 'pause.png', 'reset.png', 'run.png', 'step.png'];
const IMAGE = /\.(png|gif|jpe?g)$/i;

const fail = (message) => {
    console.error(`pack-greenfoot: ${message}`);
    process.exit(1);
};

const [folderArg, jarArg, nameArg] = process.argv.slice(2);
if (!folderArg || !jarArg) fail('usage: yarn projects:greenfoot-pack <scenario folder> <jar to write> [project name]');
const folder = resolve(folderArg);
if (!existsSync(join(folder, 'project.greenfoot'))) fail(`${folder} has no project.greenfoot; is it an unpacked scenario?`);

/** A zip's entries, in order, as [name, bytes] */
function readZip(file) {
    const data = readFileSync(file);
    let end = data.length - 22;
    while (end >= 0 && data.readUInt32LE(end) !== 0x06054b50) end--;
    if (end < 0) fail(`${file} is not a zip file`);
    const count = data.readUInt16LE(end + 10);
    let offset = data.readUInt32LE(end + 16);
    const entries = [];
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
        entries.push([name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw)]);
    }
    return entries;
}

/** Writes entries ([name, bytes]) as a zip, deflated, dated 1980-01-01 */
function writeZip(file, entries) {
    const locals = [];
    const central = [];
    let offset = 0;
    for (const [name, bytes] of entries) {
        const nameBytes = Buffer.from(name, 'utf8');
        const packed = deflateRawSync(bytes, { level: 9 });
        const crc = crc32(bytes) >>> 0;
        const header = Buffer.alloc(30);
        header.writeUInt32LE(0x04034b50, 0);
        header.writeUInt16LE(20, 4); // version needed
        header.writeUInt16LE(0x0800, 6); // UTF-8 names
        header.writeUInt16LE(8, 8); // deflate
        header.writeUInt16LE(0, 10); // time
        header.writeUInt16LE(0x21, 12); // date: 1980-01-01
        header.writeUInt32LE(crc, 14);
        header.writeUInt32LE(packed.length, 18);
        header.writeUInt32LE(bytes.length, 22);
        header.writeUInt16LE(nameBytes.length, 26);
        locals.push(header, nameBytes, packed);
        const entry = Buffer.alloc(46);
        entry.writeUInt32LE(0x02014b50, 0);
        entry.writeUInt16LE(20, 4);
        entry.writeUInt16LE(20, 6);
        entry.writeUInt16LE(0x0800, 8);
        entry.writeUInt16LE(8, 10);
        entry.writeUInt16LE(0, 12);
        entry.writeUInt16LE(0x21, 14);
        entry.writeUInt32LE(crc, 16);
        entry.writeUInt32LE(packed.length, 20);
        entry.writeUInt32LE(bytes.length, 24);
        entry.writeUInt16LE(nameBytes.length, 28);
        entry.writeUInt32LE(offset, 42);
        central.push(entry, nameBytes);
        offset += 30 + nameBytes.length + packed.length;
    }
    const centralSize = central.reduce((sum, part) => sum + part.length, 0);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(entries.length, 8);
    end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(offset, 16);
    writeFileSync(file, Buffer.concat([...locals, ...central, end]));
}

const files = (dir) => (existsSync(dir) ? readdirSync(dir).filter((name) => statSync(join(dir, name)).isFile()).sort() : []);

// project.greenfoot, read as Java properties
const project = {};
for (const line of readFileSync(join(folder, 'project.greenfoot'), 'latin1').split(/\r?\n/)) {
    const match = /^\s*([^#!][^=:]*?)\s*[=:]\s*(.*)$/.exec(line);
    if (match) project[match[1]] = match[2];
}
const mainWorld = project['world.lastInstantiated'];
if (!mainWorld) fail('project.greenfoot names no world.lastInstantiated; open the scenario in Greenfoot once, or set main.class by hand');
const name = nameArg || basename(folder);

const game = [];
for (const file of files(folder)) {
    if (file.endsWith('.class') || file === 'project.greenfoot') game.push([file, readFileSync(join(folder, file))]);
}
const classes = game.filter(([file]) => file.endsWith('.class')).length;
if (!classes) fail(`${folder} has no compiled .class files; compile it in Greenfoot first`);
if (!existsSync(join(folder, `${mainWorld}.class`))) fail(`the start world, ${mainWorld}, has no ${mainWorld}.class`);
for (const file of files(join(folder, 'images'))) if (IMAGE.test(file)) game.push([`images/${file}`, readFileSync(join(folder, 'images', file))]);
for (const file of files(join(folder, 'sounds'))) game.push([`sounds/${file}`, readFileSync(join(folder, 'sounds', file))]);

const runtimeJar = readZip(RUNTIME_JAR);
const manifest = runtimeJar.find(([file]) => file === 'META-INF/MANIFEST.MF');
const standalone = runtimeJar.find(([file]) => file === 'standalone.properties')[1].toString('latin1').split(/\r?\n/);
const properties = standalone.map((line) => (line.startsWith('main.class=') ? `main.class=${mainWorld}` : line.startsWith('project.name=') ? `project.name=${name}` : line));
const runtime = runtimeJar.filter(([file]) => RUNTIME.some((prefix) => file.startsWith(prefix)) || ICONS.includes(file));

writeZip(resolve(jarArg), [manifest, ...game, ['standalone.properties', Buffer.from(properties.join('\n').replace(/\n+$/, '') + '\n', 'latin1')], ['soundindex.list', Buffer.alloc(0)], ...runtime]);
console.log(`${jarArg}: ${name}, starting on ${mainWorld}; ${classes} classes, ${game.length - classes - 1} images and sounds, ${runtime.length} runtime entries`);
