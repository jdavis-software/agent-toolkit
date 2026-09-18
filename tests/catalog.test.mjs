import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadCatalog, validateEntries, parseSkill } from '../scripts/catalog.mjs';
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
test('personal skill catalog contains 54 local packages, not external library cards',()=>{
  const skills=entries.filter(e=>e.kind==='skill');
  assert.equal(skills.length,54);
  for(const entry of skills) {
    assert.equal(entry.origin,'original');
    assert.equal(entry.source,`https://github.com/jdavis-software/agent-toolkit/blob/main/skills/${entry.id}/SKILL.md`);
  }
});
test('external tools retain their own identities',()=>{
  assert.deepEqual(entries.filter(e=>e.kind==='tool'&&e.origin==='curated').map(e=>[e.id,e.author]),[
    ['skills-cli','Vercel'],['nx','Nx'],['playwright-mcp','Microsoft']
  ]);
});
test('new skills include synthetic evaluation inputs without host-run evidence',async()=>{
  for(const id of ['evidence-first-debugging','behavior-test-design','interface-quality-review']) {
    const text=await readFile(new URL(`../skills/${id}/references/scenarios.md`,import.meta.url),'utf8');
    for(const heading of ['Trigger case','Boundary case','Non-trigger case']) assert.ok(text.includes(`## ${heading}`),`${id}: ${heading}`);
    assert.ok(text.includes('not completed runs'));
    assert.deepEqual(entries.find(e=>e.id===id).evidence,[]);
  }
});

test('original utilities have local source and command documentation',()=>{
 const tools=entries.filter(e=>e.kind==='tool'&&e.origin==='original');
 assert.deepEqual(tools.map(e=>e.id),['skillcheck','bundle-resolver','agentflow']);
 for(const tool of tools){assert.match(tool.source,/blob\/main\/tools\/[a-z-]+\.mjs$/);assert.match(tool.documentation,/blob\/main\/docs\/[A-Z_]+\.md$/);}
});
test('original tools cannot use traversal or external sources',()=>{
 const tool=entries.find(e=>e.id==='bundle-resolver');
 assert.throws(()=>validateEntries([{...tool,sourcePath:'tools/../private.mjs'}]),/Invalid original tool/);
 assert.throws(()=>validateEntries([{...tool,docsPath:'https://outside.test/doc'}]),/Invalid original tool/);
});
