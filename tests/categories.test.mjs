import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadCategories, validateCategories } from '../scripts/categories.mjs';
import { resolveBundle } from '../tools/lib/bundles.mjs';
const registry=JSON.parse(await readFile('catalog/categories.json','utf8'));
const entries=JSON.parse(await readFile('catalog/entries.json','utf8'));
const copy=x=>structuredClone(x);
test('twelve primary categories partition all 60 entries without duplicate counts',async()=>{
 const cs=await loadCategories();assert.equal(cs.length,12);assert.equal(cs.reduce((n,c)=>n+c.counts.entries,0),60);
 assert.equal(cs.reduce((n,c)=>n+c.counts.skills,0),54);assert.equal(cs.reduce((n,c)=>n+c.counts.tools,0),6);
 assert.equal(new Set(cs.flatMap(c=>c.entryIds)).size,60);
});
test('category totals come from entries rather than hand-maintained counts',()=>{
 const augmented=[...entries,{id:'synthetic-test',kind:'skill',categoryId:'typescript'}];
 const before=validateCategories(registry,entries).find(c=>c.id==='typescript');
 const after=validateCategories(registry,augmented).find(c=>c.id==='typescript');assert.equal(after.counts.skills,before.counts.skills+1);
});
test('unknown or absent assignments fail',()=>{for(const categoryId of [undefined,'no-such-category','../secret'])assert.throws(()=>validateCategories(registry,[...entries,{id:'bad',kind:'skill',categoryId}]));});
test('duplicate entries do not inflate counts',()=>assert.throws(()=>validateCategories(registry,[...entries,entries[0]]),/duplicate/));
test('duplicate categories fail',()=>{const r=copy(registry);r.categories.push(r.categories[0]);assert.throws(()=>validateCategories(r,entries),/duplicate/);});
test('invalid IDs and metadata fail',()=>{
 for(const patch of [{id:'../bad'},{id:'UPPER'},{id:'x'.repeat(65)},{title:''},{description:''},{icon:'no-such-icon'}]){const r=copy(registry);Object.assign(r.categories[0],patch);assert.throws(()=>validateCategories(r,entries));}
});
test('invalid registries fail',()=>{for(const r of [null,[],{}, {schemaVersion:2,categories:[]},{schemaVersion:1,categories:[]}])assert.throws(()=>validateCategories(r,entries));});
test('empty categories are not advertised',()=>{const r=copy(registry);r.categories.push({id:'empty',title:'Empty',description:'Not yet implemented',icon:'code'});assert.throws(()=>validateCategories(r,entries),/Empty category/);});
test('original fine-grained topics remain usable',()=>{assert.equal(entries.find(e=>e.id==='interface-quality-review').category,'Frontend');assert.equal(entries.find(e=>e.id==='typescript-7-adoption').category,'TypeScript');});
test('agentflow is an original tool, not a hosted-agent capability claim',()=>{
 const e=entries.find(e=>e.id==='agentflow');assert.equal(e.kind,'tool');assert.equal(e.origin,'original');assert.equal(e.categoryId,'agent-orchestration');assert.deepEqual(e.testedHosts,[]);
});
test('orchestration and runtime bundle manifests include actual companion modules',async()=>{
 for(const id of ['agent-orchestration','agent-runtime']){
  const r=await resolveBundle(process.cwd(),id);const paths=new Set(r.files.map(f=>f.path));
  for(const path of ['tools/agentflow.mjs','tools/lib/agentflow.mjs','tools/lib/contracts.mjs','docs/AGENTFLOW.md'])assert.ok(paths.has(path),path);
 }
});
test('new demonstration makes no worker calls and catches stale artifacts',async()=>{
 const {execFileSync}=await import('node:child_process');
 const result=JSON.parse(execFileSync(process.execPath,['examples/agentflow/demo.mjs'],{encoding:'utf8'}));
 assert.equal(result.execution,'none');assert.deepEqual(result.resume,['review']);assert.ok(result.afterArtifactChange.some(t=>t.reason==='stale-artifact'));
});
