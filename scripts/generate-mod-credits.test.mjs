import test from 'node:test';
import assert from 'node:assert/strict';
import { creditEntries, projectKey, zipFile, generateCredits, artifactAttribution } from './generate-mod-credits.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const metadata = { name: 'Creator’s mod', project: 'https://modrinth.com/mod/example', authors: [{name:'Creator',url:'https://modrinth.com/user/creator'}], license:{name:'MIT',url:'https://modrinth.com/mod/example/license'} };
const pin = { filename:'server-only.jar',version:'1.2',url:'https://cdn.modrinth.com/data/EXAMPLE/versions/pinned/file.jar',client:false,server:true,sha256:'abc' };
const artifacts = {abc:{authors:['Original creator'],license:'MIT',evidence:pin.url}};
test('new pinned server-only mods appear automatically; removing a pin removes its credit', () => {
    const cache = {'modrinth:EXAMPLE':metadata, 'modrinth:UNUSED':metadata};
    const entries = creditEntries({mods:[pin]},cache,artifacts);
    assert.equal(entries.length,1);
    assert.equal(entries[0].side,'Server only');
    assert.equal(entries[0].version,'1.2');
    assert.deepEqual(entries[0].declaredAuthors,['Original creator']);
    assert.deepEqual(creditEntries({mods:[]},cache,artifacts),[]);
});
test('unknown sources and incomplete attribution stop generation instead of silently dropping mods', () => {
    assert.throws(()=>creditEntries({mods:[pin]},{}),/Missing verified attribution/);
    assert.throws(()=>projectKey({...pin,url:'https://unverified.example/mod.jar'}),/No verified metadata provider/);
    assert.throws(()=>creditEntries({mods:[pin]},{'modrinth:EXAMPLE':{...metadata,authors:[]}}),/Missing verified attribution/);
});
test('FTB publisher coordinates resolve without an independent membership list', () => {
    assert.equal(projectKey({...pin,url:'https://maven.ftb.dev/releases/dev/ftb/mods/ftb-library-neoforge/1/ftb-library.jar'}),'ftb:ftb-library');
});
test('invalid ZIPs cannot masquerade as pinned manifests', () => {
    assert.throws(()=>zipFile(Buffer.from('not a zip'),'mods.lock.json'),/Invalid ZIP/);
});
const storedZip = (name, content) => {
    const file = Buffer.from(content), filename = Buffer.from(name);
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt32LE(file.length,18); header.writeUInt32LE(file.length,22); header.writeUInt16LE(filename.length,26);
    const local = Buffer.concat([header,filename,file]);
    const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50); central.writeUInt32LE(file.length,20); central.writeUInt32LE(file.length,24); central.writeUInt16LE(filename.length,28);
    const directory = Buffer.concat([central,filename]);
    const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(1,8); end.writeUInt16LE(1,10); end.writeUInt32LE(directory.length,12); end.writeUInt32LE(local.length,16);
    return Buffer.concat([local,directory,end]);
};
test('original artifact authors survive project-team changes and tampered pinned JARs are rejected', () => {
    const jar=storedZip('META-INF/neoforge.mods.toml','license="MPL-2.0"\n[[mods]]\nauthors="Original author, Upstream project"\n');
    const hash=createHash('sha256').update(jar).digest('hex');
    assert.deepEqual(artifactAttribution(jar,{...pin,sha256:hash}).authors,['Original author, Upstream project']);
    assert.throws(()=>artifactAttribution(jar,pin),/Pinned mod hash mismatch/);
});
test('approved and latest manifests stay separate and unused cached projects never become credits', async () => {
    const root=mkdtempSync(join(tmpdir(),'mod-credits-'));
    try {
        const dir=join(root,'public/downloads/progression-survival');
        mkdirSync(join(dir,'packwiz'),{recursive:true}); mkdirSync(join(root,'scripts'),{recursive:true});
        writeFileSync(join(root,'scripts/modpack-projects.json'),JSON.stringify({'modrinth:EXAMPLE':metadata,'modrinth:UNUSED':metadata}));
        writeFileSync(join(root,'scripts/modpack-artifacts.json'),JSON.stringify(artifacts));
        const releases=['v2','v1'].map(version=>{
            const archive=storedZip('mods.lock.json',JSON.stringify({version,mods:[{...pin,version}]}));
            mkdirSync(join(dir,'releases',version),{recursive:true});writeFileSync(join(dir,'releases',version,'server.zip'),archive);
            return {version,server:{url:`/downloads/progression-survival/releases/${version}/server.zip`,sha256:createHash('sha256').update(archive).digest('hex')}};
        });
        writeFileSync(join(dir,'releases.json'),JSON.stringify({releases}));writeFileSync(join(dir,'packwiz/current.json'),JSON.stringify({version:'v1'}));
        const credits=await generateCredits(root);
        assert.deepEqual(credits.releases.map(r=>[r.version,r.mods.length,r.mods[0].version]),[['v1',1,'v1'],['v2',1,'v2']]);
    } finally {rmSync(root,{recursive:true,force:true});}
});
test('published server hash must match before pinned authors or manifests can be used', async () => {
    const root = mkdtempSync(join(tmpdir(),'mod-credits-'));
    try {
        const dir=join(root,'public/downloads/progression-survival');
        mkdirSync(join(dir,'packwiz'),{recursive:true});
        mkdirSync(join(dir,'releases/v1'),{recursive:true});
        writeFileSync(join(dir,'releases/v1/server.zip'),'changed archive');
        writeFileSync(join(dir,'packwiz/current.json'),JSON.stringify({version:'v1'}));
        writeFileSync(join(dir,'releases.json'),JSON.stringify({releases:[{version:'v1',server:{url:'/downloads/progression-survival/releases/v1/server.zip',sha256:'wrong'}}]}));
        await assert.rejects(generateCredits(root),/Server archive hash mismatch/);
    } finally { rmSync(root,{recursive:true,force:true}); }
});
