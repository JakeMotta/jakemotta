// Membership comes ONLY from the pinned manifests inside published server ZIPs.
// Project metadata is an attribution cache, never a separately maintained mod list.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha = data => createHash('sha256').update(data).digest('hex');
export function zipFile(buffer, wanted) {
    const end = buffer.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
    if (end < 0) throw new Error('Invalid ZIP');
    let offset = buffer.readUInt32LE(end + 16);
    const found = [];
    for (let i = 0; i < buffer.readUInt16LE(end + 10); i++) {
        if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error('Invalid ZIP directory');
        const length = buffer.readUInt16LE(offset + 28);
        const name = buffer.toString('utf8', offset + 46, offset + 46 + length);
        if (name === wanted) {
            const local = buffer.readUInt32LE(offset + 42);
            if (buffer.readUInt32LE(local) !== 0x04034b50) throw new Error('Invalid ZIP entry');
            const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
            const data = buffer.subarray(start, start + buffer.readUInt32LE(offset + 20));
            const method = buffer.readUInt16LE(offset + 10);
            if (![0, 8].includes(method)) throw new Error('Unsupported ZIP compression');
            found.push(method === 8 ? inflateRawSync(data) : data);
        }
        offset += 46 + length + buffer.readUInt16LE(offset + 30) + buffer.readUInt16LE(offset + 32);
    }
    if (found.length !== 1) throw new Error(`Expected exactly one ${wanted}`);
    return found[0];
}

async function json(url) {
    const response = await fetch(url, { headers: { 'User-Agent': 'jakemotta.com/modpack-credits (public attribution)' }, signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Attribution source ${url}: ${response.status}`);
    return response.json();
}

export function projectKey(mod) {
    const url = new URL(mod.url);
    if (url.hostname === 'cdn.modrinth.com') {
        const id = url.pathname.match(/^\/data\/([^/]+)\/versions\//)?.[1];
        if (id) return `modrinth:${id}`;
    }
    if (url.hostname === 'maven.ftb.dev') {
        const artifact = url.pathname.match(/^\/releases\/dev\/ftb\/mods\/(ftb-[a-z-]+)-neoforge\//)?.[1];
        if (artifact) return `ftb:${artifact}`;
    }
    throw new Error(`No verified metadata provider for ${mod.filename}; add a provider, never omit the mod`);
}

export async function resolveProject(key) {
    if (key.startsWith('modrinth:')) {
        const project = await json(`https://api.modrinth.com/v2/project/${key.slice(9)}`);
        const members = await json(`https://api.modrinth.com/v2/team/${project.team}/members`);
        const projectUrl = `https://modrinth.com/mod/${project.slug}`;
        return {
            name: project.title, project: projectUrl, source: project.source_url,
            authors: members.map(m => ({ name: m.user.username, role: m.role, url: `https://modrinth.com/user/${encodeURIComponent(m.user.username)}` })),
            // Modrinth declares the license on the project page; /license is
            // not a supported project route. Use an explicit publisher URL
            // when provided, otherwise link to that actual declaration.
            license: { name: project.license.name || project.license.id.replace('LicenseRef-', '').replaceAll('-', ' '), url: project.license.url || projectUrl },
            evidence: [`https://api.modrinth.com/v2/project/${project.id}`, `https://api.modrinth.com/v2/team/${project.team}/members`],
        };
    }
    const artifact = key.slice(4);
    const name = artifact.split('-').map(p => p === 'ftb' ? 'FTB' : p[0].toUpperCase() + p.slice(1)).join(' ');
    const repo = `FTBTeam/${name.replaceAll(' ', '-')}`;
    const branch = await json(`https://api.github.com/repos/${repo}`);
    const ref = (await json(`https://api.github.com/repos/${repo}/branches/${encodeURIComponent(branch.default_branch)}`)).commit.sha;
    const manifest = await json(`https://api.github.com/repos/${repo}/contents/fabric/src/main/resources/fabric.mod.json?ref=${ref}`);
    const data = JSON.parse(Buffer.from(manifest.content, 'base64').toString('utf8'));
    const files = await json(`https://api.github.com/repos/${repo}/contents?ref=${ref}`);
    const license = files.find(f => /^license/i.test(f.name));
    return {
        name: data.name, project: `https://github.com/${repo}`, source: `https://github.com/${repo}`,
        authors: data.authors.map(author => ({ name: typeof author === 'string' ? author : author.name, role: 'Author', url: 'https://github.com/FTBTeam' })),
        license: { name: data.license, url: license?.html_url || manifest.html_url },
        evidence: [manifest.html_url, ...(license ? [license.html_url] : [])],
    };
}

export function artifactAttribution(buffer, pin) {
    if (sha(buffer) !== pin.sha256) throw new Error(`Pinned mod hash mismatch: ${pin.filename}`);
    let text;
    for (const file of ['META-INF/neoforge.mods.toml', 'META-INF/mods.toml']) {
        try { text = zipFile(buffer, file).toString('utf8'); break; } catch (error) {
            if (!error.message.startsWith('Expected exactly one')) throw error;
        }
    }
    if (!text) throw new Error(`No supported author manifest in ${pin.filename}`);
    const authors = [...text.matchAll(/^\s*authors\s*=\s*["']([^"'\r\n]+)["']/gm)].map(m => m[1]);
    const license = text.match(/^\s*license\s*=\s*["']([^"'\r\n]+)["']/m)?.[1];
    if (!authors.length || !license) throw new Error(`Missing pinned author/license declaration: ${pin.filename}`);
    return { authors: [...new Set(authors)], license, evidence: pin.url };
}

export function creditEntries(lock, cache, artifacts) {
    const entries = lock.mods.map(mod => {
        const key = projectKey(mod), metadata = cache[key];
        if (!metadata?.authors?.length || !metadata?.license?.name || !metadata?.license?.url || !metadata?.project) throw new Error(`Missing verified attribution: ${key}`);
        for (const url of [metadata.project, metadata.source, metadata.license.url, ...metadata.authors.map(a => a.url)].filter(Boolean)) {
            if (new URL(url).protocol !== 'https:') throw new Error('Attribution links must use HTTPS');
        }
        const declared = artifacts?.[mod.sha256];
        if (!declared?.authors?.length || !declared?.license) throw new Error(`Missing pinned artifact attribution: ${mod.filename}`);
        return { ...metadata, declaredAuthors: declared.authors, declaredLicense: declared.license, artifactEvidence: declared.evidence, filename: mod.filename, version: mod.version, sha256: mod.sha256, side: mod.client && mod.server ? 'Client & server' : mod.server ? 'Server only' : 'Client only' };
    });
    return entries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export async function generateCredits(root = ROOT) {
    const downloads = join(root, 'public/downloads/progression-survival');
    const releases = JSON.parse(readFileSync(join(downloads, 'releases.json'), 'utf8')).releases;
    const approved = JSON.parse(readFileSync(join(downloads, 'packwiz/current.json'), 'utf8'));
    const versions = [...new Set([approved.version, releases[0].version])];
    const cachePath = join(root, 'scripts/modpack-projects.json');
    const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};
    const artifactPath = join(root, 'scripts/modpack-artifacts.json');
    const artifacts = existsSync(artifactPath) ? JSON.parse(readFileSync(artifactPath, 'utf8')) : {};
    const result = { approved: approved.version, latest: releases[0].version, releases: [] };
    for (const version of versions) {
        const release = releases.find(r => r.version === version);
        if (!release) throw new Error(`Approved release ${version} missing from published release index`);
        const path = resolve(root, 'public', '.' + release.server.url);
        const archiveRelative = relative(resolve(downloads, 'releases'), path);
        if (archiveRelative.startsWith('..') || isAbsolute(archiveRelative)) throw new Error('Server archive outside published release directory');
        const archive = readFileSync(path);
        if (sha(archive) !== release.server.sha256) throw new Error(`Server archive hash mismatch: ${version}`);
        const manifest = zipFile(archive, 'mods.lock.json');
        const lock = JSON.parse(manifest.toString('utf8'));
        if (lock.version !== version || !Array.isArray(lock.mods) || !lock.mods.length) throw new Error('Pinned manifest does not match published release');
        for (const mod of lock.mods) {
            const key = projectKey(mod);
            if (!cache[key]) cache[key] = await resolveProject(key);
            if (!artifacts[mod.sha256]) {
                const response = await fetch(mod.url, { signal: AbortSignal.timeout(30000) });
                if (!response.ok) throw new Error(`Pinned mod metadata unavailable: ${mod.filename}`);
                artifacts[mod.sha256] = artifactAttribution(Buffer.from(await response.arrayBuffer()), mod);
            }
        }
        result.releases.push({ version, manifestSha256: sha(manifest), serverSha256: release.server.sha256, mods: creditEntries(lock, cache, artifacts) });
    }
    // Changes are written only after every manifest and attribution has validated.
    writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n');
    writeFileSync(artifactPath, JSON.stringify(artifacts, null, 2) + '\n');
    const output = join(root, 'src/common/modpack-credits.json');
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
    console.log(`Generated mod credits for ${versions.join(', ')} from verified published server manifests`);
    return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    await generateCredits();
}
