import test from 'node:test';
import assert from 'node:assert/strict';
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
