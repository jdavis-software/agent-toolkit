import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCatalog, validateEntries, parseSkill, verifyFileDigest, loadSources, verifySnapshots } from '../scripts/catalog.mjs';
const entries = await loadCatalog();
const first = entries.find(e => e.origin === 'original');
const raw = { ...first }; delete raw.title; delete raw.description; delete raw.source;
test('catalog is nonempty with unique ids', () => assert.equal(new Set(entries.map(e=>e.id)).size, entries.length));
test('rejects duplicate ids', () => assert.throws(()=>validateEntries([raw,raw]),/duplicate/));
test('rejects traversal source paths', () => assert.throws(()=>validateEntries([{...raw,sourcePath:'../secret'}]),/source path/));
test('rejects unsupported validation claims', () => assert.throws(()=>validateEntries([{...raw,stage:'released'}]),/Unsupported validation/));
test('does not duplicate instruction descriptions', () => assert.throws(()=>validateEntries([{...raw,description:'another copy'}]),/SKILL.md/));
test('rejects unsafe reference URLs', () => {
  const ref = entries.find(e=>e.origin==='curated');
  assert.throws(()=>validateEntries([{...ref,url:'javascript:alert(1)'}]),/URL/);
});
test('rejects incomplete instructions', () => assert.throws(()=>parseSkill('---\nname: test\ndescription: test\n---\nHello','test'),/Missing When to use/));
test('new skills make no host compatibility claims', () => {
 for (const entry of entries.filter(e=>e.origin==='original')) { assert.equal(entry.stage,'experimental'); assert.deepEqual(entry.testedHosts,[]); }
});

import { readFile } from 'node:fs/promises';
import { transformMarkdown } from '../scripts/safe-markdown.mjs';
const sources = await loadSources();
test('individual collection excludes legacy repository cards', () => {
 assert.equal(entries.filter(e=>e.listed!==false).length,22);
 assert.equal(entries.filter(e=>e.vendorPath).length,12);
 assert.equal(entries.filter(e=>e.upstreamPath).length,16);
});
test('rejects traversal vendor path', () => {
 const entry=entries.find(e=>e.vendorPath);
 assert.throws(()=>validateEntries([{...entry,vendorPath:'vendor/../../private'}]),/vendor path/);
});
test('requires selection rationale', () => assert.throws(()=>validateEntries([{...raw,why:''}]),/Missing why/));
test('upstream files have a separate schema, not forced original headings', () => {
 const parsed=parseSkill('---\nname: upstream-name\ndescription: useful\n---\n# Different structure','source-id',false);
 assert.equal(parsed.name,'upstream-name');
});
test('snapshot integrity and package licenses agree', async () => {
 const lock=await verifySnapshots(entries,sources);
 assert.equal(lock.packages.length,12);
 assert.equal(lock.packages.flatMap(p=>p.files).length,73);
 for(const p of lock.packages) assert.ok(p.files.some(f=>f.path===p.licensePath));
});
test('detects changed source bytes', async () => {
 const lock=JSON.parse(await readFile('catalog/upstream-lock.json','utf8'));
 const f=lock.packages[0].files[0];
 assert.throws(()=>verifyFileDigest(Buffer.from('changed'),f.sha256,f.path),/hash mismatch/);
});
test('rendering escapes HTML, images, and executable links', () => {
 const tree={type:'root',children:[{type:'html',value:'<script>alert(1)</script>'},{type:'image',url:'https://tracker.test/a',alt:'source image'},{type:'link',url:'javascript:alert(1)',children:[]},{type:'heading',depth:1,children:[]}]};
 transformMarkdown(tree,'/vendor/ecc/api-design/SKILL.md',sources);
 assert.equal(tree.children[0].type,'text');assert.equal(tree.children[1].type,'text');
 assert.equal(tree.children[2].url,'#');assert.equal(tree.children[3].depth,2);
});
test('relative supporting-file links resolve to pinned upstream', () => {
 const tree={type:'link',url:'root-cause-tracing.md',children:[]};
 transformMarkdown(tree,'/vendor/superpowers/systematic-debugging/SKILL.md',sources);
 assert.equal(tree.url,`https://github.com/obra/superpowers/blob/${sources.superpowers.revision}/skills/systematic-debugging/root-cause-tracing.md`);
});
