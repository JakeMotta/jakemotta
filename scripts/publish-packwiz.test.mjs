import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { channelManifest, immutableCopy, publishPackwiz } from './publish-packwiz.mjs';

test('immutable publication is idempotent and refuses changed or extra files', () => {
    const root = mkdtempSync(join(tmpdir(), 'packwiz-publisher-'));
    mkdirSync(join(root, 'source')); writeFileSync(join(root, 'source/pack.toml'), 'fixture');
    immutableCopy(join(root, 'source'), join(root, 'target'));
    immutableCopy(join(root, 'source'), join(root, 'target'));
    writeFileSync(join(root, 'target/extra.txt'), 'retain evidence');
    assert.throws(() => immutableCopy(join(root, 'source'), join(root, 'target')), /immutable/);
    assert.equal(readFileSync(join(root, 'target/extra.txt'), 'utf8'), 'retain evidence');
});

test('channel manifest pins a content-addressed root index without changing its hash', () => {
    const input = 'version = "1.0.0-rc.12"\n[index]\nfile = "index.toml"\nhash = "abc"\n';
    const actual = channelManifest(input, 'a'.repeat(64));
    assert.match(actual, /file = "index-a{64}\.toml"/);
    assert.match(actual, /hash = "abc"/); assert.doesNotMatch(actual, /\.\.\//);
    assert.throws(() => channelManifest(input, '../../escape'), /Invalid index hash/);
    assert.throws(() => channelManifest('different input', 'a'.repeat(64)), /Unexpected/);
});

test('publishing a newer candidate does not advance the approved server channel', () => {
    const siteRoot = mkdtempSync(join(tmpdir(), 'packwiz-channel-'));
    const folder = join(siteRoot, 'public/downloads/progression-survival/packwiz'); mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, 'pack.toml'), 'unchanged approved pointer');
    writeFileSync(join(folder, 'current.json'), '{"version":"retained"}\n');
    const packRepoRoot = resolve('../minecraft-progression');
    const version = process.env.PACKWIZ_TEST_RELEASE ?? JSON.parse(readFileSync(join(packRepoRoot, 'outputs/Latest-Release/latest.json'), 'utf8')).version;
    const result = publishPackwiz({ siteRoot, packRepoRoot, sourceDir: join(packRepoRoot, 'outputs/Progression-Survival-' + version) });
    assert.equal(result.version, version);
    assert.equal(readFileSync(join(folder, 'pack.toml'), 'utf8'), 'unchanged approved pointer');
    assert.equal(readFileSync(join(folder, 'current.json'), 'utf8'), '{"version":"retained"}\n');
});
