// Imported by the release publisher; also usable as a standalone backfill/promotion command.
// Publishing an immutable candidate NEVER advances the server-approved client channel.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = '/downloads/progression-survival/packwiz';
const sha = data => createHash('sha256').update(data).digest('hex');
export function tree(folder, prefix = '') {
    if (!existsSync(folder)) return {};
    const result = {};
    for (const item of readdirSync(folder, { withFileTypes: true })) {
        if (item.isSymbolicLink()) throw new Error('Symlinks are not public release files');
        const name = prefix + item.name;
        if (item.isDirectory()) Object.assign(result, tree(join(folder, item.name), name + '/'));
        else result[name] = readFileSync(join(folder, item.name));
    }
    return result;
}

export function immutableCopy(source, target) {
    const input = tree(source), output = tree(target);
    if (existsSync(target)) {
        if (Object.keys(input).length !== Object.keys(output).length || Object.keys(input).some(n => !output[n] || !input[n].equals(output[n])))
            throw new Error('Published Packwiz version is immutable: ' + target);
        return;
    }
    mkdirSync(target, { recursive: true });
    for (const [name, data] of Object.entries(input)) {
        const path = join(target, name);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, data);
    }
}

function python() {
    const candidates = [process.env.MODPACK_PYTHON, process.env.PYTHON, process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, 'Python/bin/python3.14.exe'), 'python3', 'python'].filter(Boolean);
    for (const exe of candidates) {
        try { execFileSync(exe, ['-c', 'import sys,tomllib;assert sys.version_info >= (3,11)'], { stdio: 'pipe' }); return exe; } catch {}
    }
    throw new Error('Python 3.11+ is required; set MODPACK_PYTHON to its executable');
}

export function channelManifest(text, indexHash) {
    if (!/^[a-f0-9]{64}$/.test(indexHash)) throw new Error('Invalid index hash');
    if (!text.includes('file = "index.toml"')) throw new Error('Unexpected immutable index location');
    // Keeping the index at the feed root also keeps installed files at the game root.
    return text.replace('file = "index.toml"', `file = "index-${indexHash}.toml"`);
}

const GUIDE = `# Progression Survival: install and automatic updates

1. Install Prism Launcher from https://prismlauncher.org/download/ and sign in to your Microsoft account privately.
2. Download the auto-updating Prism ZIP from https://jakemotta.com/minecraft.
3. Choose Add Instance > Import in Prism and select that ZIP. Review the included pre-launch command: it should use the bundled Packwiz installer and the HTTPS feed on jakemotta.com. Accept only the trusted download's command prompt.
4. Use Java 21 and about 4 GB of memory. Click Play. The first launch downloads the approved mods and settings; later launches check for approved updates before Minecraft starts.
5. Add the server address Jake gives you. The address is not included in public downloads.

## Bringing your settings

Keep and back up your old instance with Prism Copy > Select all before changing anything. Close Minecraft. Import the new starter as a separate instance, then copy options.txt and servers.dat from the old game folder into the new game folder. For personal worlds, resource packs, shaders and screenshots, copy saves, resourcepacks, shaderpacks and screenshots if you want them. Do not overwrite existing files without a backup.

Do not copy old mods, pack-owned config folders, launcher account files or updater state. This avoids restoring obsolete mods or private credentials. Your multiplayer progression stays on the server. Keep the old instance until the new one works.

## What updates automatically

This instance follows the server-compatible approved channel, which can intentionally be older than the latest published release. Before every game launch, Packwiz synchronizes approved mods, scripts and pack-owned configs. Personal saves, options and server lists are not in its managed file list. Edits to pack-owned configs can be replaced by an update, so back up custom changes.

An Internet connection is required. A failed check blocks startup instead of launching a partly updated pack. Close and relaunch Minecraft to get updates; a running session does not change. Minecraft/NeoForge upgrades and new updater-tool versions require a replacement starter instance and coordinated instructions. Updating downloads does not restart or update the live server.

## Manual downloads

Existing .mrpack installations remain manual. Use the release matching your server, back up first, and use Prism's Edit > Modrinth URL field > Update Pack when available. Importing a new .mrpack as a separate instance remains a fallback. Do not assume the latest published .mrpack matches the currently running server.
`;

export function publishPackwiz({ sourceDir, packRepoRoot, approveServerDir, dryRun = false, siteRoot = ROOT }) {
    const exe = python();
    const version = JSON.parse(readFileSync(join(sourceDir, 'mods.lock.json'), 'utf8')).version;
    if (!/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(version)) throw new Error('Invalid version');
    const generated = join(packRepoRoot, 'outputs/Packwiz-Releases', version);
    const argv = [join(packRepoRoot, 'work/build-packwiz-release.py'), '--release-dir', sourceDir, '--out', generated];
    if (dryRun) argv.push('--check');
    const report = JSON.parse(execFileSync(exe, argv, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }));
    if (dryRun) return report;
    const publicRoot = join(siteRoot, 'public', DIR);
    const candidate = join(publicRoot, 'releases', version);
    // All immutable bytes have been validated by the generator before publication.
    immutableCopy(generated, candidate);
    if (approveServerDir) {
        const evidence = JSON.parse(execFileSync(exe, [join(packRepoRoot, 'work/verify-packwiz-server.py'), '--release-dir', sourceDir, '--server-dir', approveServerDir], { encoding: 'utf8', maxBuffer: 1024 * 1024 }));
        if (!evidence.passed || evidence.sourceClientSha256 !== report.sourceClientSha256) throw new Error('Active server compatibility check failed');
        const currentFile = join(publicRoot, 'current.json');
        const current = existsSync(currentFile) ? JSON.parse(readFileSync(currentFile, 'utf8')) : null;
        if (current && (current.minecraft !== report.minecraft || current.neoforge !== report.neoforge)) throw new Error('Loader/game upgrade needs a new starter channel; existing clients must not auto-upgrade');
        const channelFiles = { [`index-${report.indexHash}.toml`]: readFileSync(join(candidate, 'index.toml')) };
        for (const name of report.channelFiles) {
            if (name.includes('..') || name.startsWith('/') || name.includes('\\')) throw new Error('Unsafe channel file');
            channelFiles[name] = readFileSync(join(candidate, name));
        }
        // New hashed metadata lands before the one mutable approved manifest changes.
        for (const [name, data] of Object.entries(channelFiles)) {
            const file = join(publicRoot, name);
            if (existsSync(file) && !readFileSync(file).equals(data)) throw new Error('Immutable channel object collision');
            mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, data);
        }
        const approved = { version, journal: report.journal, minecraft: report.minecraft, neoforge: report.neoforge, java: report.java, starter: { ...report.starter, url: `${DIR}/releases/${version}/${report.starter.name}` }, guide: `${DIR}/Install-and-Update.md`, feed: `${DIR}/pack.toml` };
        const files = {
            'Install-and-Update.md': GUIDE,
            '.htaccess': `# Approved client channel; versioned payloads are immutable.\nAddType text/plain .toml\n<IfModule mod_headers.c>\n  <FilesMatch "^(pack\\.toml|current\\.json|Install-and-Update\\.md)$">\n    Header always set Cache-Control "no-store"\n  </FilesMatch>\n</IfModule>\n<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteRule ^latest-prism\\.zip$ ${approved.starter.url} [R=302,L]\n</IfModule>\n`,
            'current.json': JSON.stringify(approved, null, 2) + '\n',
            'pack.toml': channelManifest(readFileSync(join(candidate, 'pack.toml'), 'utf8'), report.indexHash),
        };
        for (const [name, data] of Object.entries(files)) {
            const file = join(publicRoot, name), temp = file + '.tmp';
            writeFileSync(temp, data); renameSync(temp, file);
        }
        const evidenceDir = join(packRepoRoot, 'outputs/Packwiz-Publication-Evidence');
        mkdirSync(evidenceDir, { recursive: true });
        writeFileSync(join(evidenceDir, 'server-compatibility-' + version + '.json'), JSON.stringify(evidence, null, 2) + '\n');
    }
    return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2), value = key => { const n = args.indexOf(key); return n >= 0 ? args[n + 1] : undefined; };
    const packRepoRoot = resolve(value('--pack-repo') || join(ROOT, '../minecraft-progression'));
    const sourceDir = resolve(value('--release-dir') || join(packRepoRoot, 'outputs/Latest-Release'));
    const report = publishPackwiz({ sourceDir, packRepoRoot, approveServerDir: value('--approve-server'), dryRun: args.includes('--dry-run') });
    console.log(`${args.includes('--dry-run') ? 'Validated' : 'Published candidate'} Packwiz ${report.version}; ${Object.keys(report.managedClientFiles).length} managed files${value('--approve-server') ? '; active-server channel approved' : '; approved channel unchanged'}`);
}
