import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadBundles, resolveBundle, validateBundleDefinitions, safeBundlePath, validateExpansion } from '../tools/lib/bundles.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const entry={id:'example-skill',kind:'skill',origin:'original',sourcePath:'skills/example-skill/SKILL.md'};
const registry=()=>({schemaVersion:1,bundles:[{id:'example',title:'Example',description:'Synthetic test bundle',version:'0.1.0',stage:'experimental',skills:['example-skill']}]});
async function fixture(t,{git=false}={}) {
 const dir=await mkdtemp(join(tmpdir(),'bundle-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await mkdir(join(dir,'catalog'));await mkdir(join(dir,'skills/example-skill/references'),{recursive:true});
 await writeFile(join(dir,'catalog/entries.json'),JSON.stringify([entry]));await writeFile(join(dir,'catalog/bundles.json'),JSON.stringify(registry()));
 await writeFile(join(dir,entry.sourcePath),'---\nname: example-skill\ndescription: synthetic\n---\n# Example\n');
 await writeFile(join(dir,'skills/example-skill/references/notes.md'),'Synthetic support\n');
 if(git) {
  const run=(args)=>execFileSync('git',['-C',dir,...args],{stdio:'ignore'});
  run(['init','-q']);run(['config','core.hooksPath','/dev/null']);run(['add','.']);run(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','fixture']);
 }
 return dir;
}
const check=(d,entries=[entry])=>validateBundleDefinitions(d,entries);
test('twelve bundles cover all 73 original skills and 201 new scenario inputs',async()=>assert.deepEqual(await validateExpansion(root),{bundles:12,skills:73,scenarioInputs:201}));
test('bundle registry requires its version and nonempty list',()=>{for(const d of [null,{},[],{schemaVersion:2,bundles:[]},{schemaVersion:1,bundles:[]}])assert.throws(()=>check(d));});
test('unknown skill IDs fail rather than selecting a similar name',()=>{const d=registry();d.bundles[0].skills=['example-skil'];assert.throws(()=>check(d),/Unknown/);});
test('curated links cannot masquerade as local skill packages',()=>assert.throws(()=>check(registry(),[{...entry,origin:'curated'}]),/nonlocal/));
test('duplicate bundle IDs fail',()=>{const d=registry();d.bundles.push({...d.bundles[0]});assert.throws(()=>check(d),/duplicate bundle/);});
test('duplicate selections fail',()=>{const d=registry();d.bundles[0].skills.push('example-skill');assert.throws(()=>check(d),/duplicate skill/);});
test('malformed names and traversal in IDs fail',()=>{for(const id of ['../outside','X','x/y','a'.repeat(65),null]){const d=registry();d.bundles[0].id=id;assert.throws(()=>check(d));}});
test('unsafe source paths are rejected before reading',()=>assert.throws(()=>check(registry(),[{...entry,sourcePath:'../private'}]),/nonlocal/));
test('blank metadata and unsupported release labels fail',()=>{for(const patch of [{title:''},{description:''},{stage:'released'},{version:'latest'}]){const d=registry();Object.assign(d.bundles[0],patch);assert.throws(()=>check(d));}});
test('unsafe file-path forms fail',()=>{for(const p of ['../x','/etc/passwd','skills//x','x\\y','x/.git/config','a/./b','C:x','a\nb',''])assert.throws(()=>safeBundlePath(p));});
test('content-only checkout resolves with explicit unknown Git provenance',async t=>{const dir=await fixture(t),r=await resolveBundle(dir,'example');assert.deepEqual(r.source,{revision:null,dirty:null,verification:'content-only'});assert.equal(r.files.length,4);});
test('unchanged files produce deterministic sorted manifests',async t=>{const dir=await fixture(t);const a=await resolveBundle(dir,'example'),b=await resolveBundle(dir,'example');assert.equal(a.bundleDigest,b.bundleDigest);assert.deepEqual(a.files.map(f=>f.path),a.files.map(f=>f.path).sort());});
test('file checksums describe actual bytes',async t=>{const dir=await fixture(t),r=await resolveBundle(dir,'example');for(const f of r.files){const b=await readFile(join(dir,f.path));assert.equal(f.sha256,sha(b));assert.equal(f.bytes,b.length);}});
test('supporting file edits change the bundle digest',async t=>{const dir=await fixture(t),a=await resolveBundle(dir,'example');await writeFile(join(dir,'skills/example-skill/references/notes.md'),'Changed\n');assert.notEqual((await resolveBundle(dir,'example')).bundleDigest,a.bundleDigest);});
test('new regular support files join the manifest',async t=>{const dir=await fixture(t);await writeFile(join(dir,'skills/example-skill/references/new.txt'),'new');assert.ok((await resolveBundle(dir,'example')).files.some(f=>f.path.endsWith('/new.txt')));});
test('selected SKILL.md must exist',async t=>{const dir=await fixture(t);await rm(join(dir,entry.sourcePath));await assert.rejects(resolveBundle(dir,'example'),/Missing skill/);});
test('missing bundle is a failure',async t=>{const dir=await fixture(t);await assert.rejects(resolveBundle(dir,'missing'),/Unknown bundle/);});
test('file symlinks cannot import outside content',async t=>{const dir=await fixture(t);await symlink('/etc/passwd',join(dir,'skills/example-skill/references/out'));await assert.rejects(resolveBundle(dir,'example'),/Symlink/);});
test('directory symlinks are rejected',async t=>{const dir=await fixture(t);await symlink(tmpdir(),join(dir,'skills/example-skill/references/dir'));await assert.rejects(resolveBundle(dir,'example'),/Symlink/);});
test('oversized selected files fail',async t=>{const dir=await fixture(t);await writeFile(join(dir,'skills/example-skill/references/large.txt'),Buffer.alloc(2*1024*1024+1));await assert.rejects(resolveBundle(dir,'example'),/oversized/);});
test('strict mode requires Git provenance',async t=>{const dir=await fixture(t);await assert.rejects(resolveBundle(dir,'example',{requireClean:true}),/clean verified/);});
test('a clean fixture reports its real revision and accepts the matching pin',async t=>{const dir=await fixture(t,{git:true});const revision=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();const r=await resolveBundle(dir,'example',{expectedRevision:revision});assert.equal(r.source.revision,revision);assert.equal(r.source.dirty,false);});
test('strict mode rejects untracked work',async t=>{const dir=await fixture(t,{git:true});await writeFile(join(dir,'untracked.txt'),'new');await assert.rejects(resolveBundle(dir,'example',{requireClean:true}),/clean verified/);});
test('strict mode rejects changed tracked inputs',async t=>{const dir=await fixture(t,{git:true});await writeFile(join(dir,entry.sourcePath),'changed');const r=await resolveBundle(dir,'example');assert.equal(r.source.dirty,true);await assert.rejects(resolveBundle(dir,'example',{requireClean:true}),/clean verified/);});
test('a wrong revision pin cannot be accepted',async t=>{const dir=await fixture(t,{git:true});await assert.rejects(resolveBundle(dir,'example',{expectedRevision:'0'.repeat(40)}),/mismatch/);});
test('expected revision syntax is checked',async t=>{const dir=await fixture(t);for(const value of ['main','--help','abc',123])await assert.rejects(resolveBundle(dir,'example',{expectedRevision:value}),/Invalid expected/);});
test('resolver output omits machine paths',async t=>{const dir=await fixture(t,{git:true});assert.equal(JSON.stringify(await resolveBundle(dir,'example')).includes(dir),false);});
test('core-skill bundles include all Skillcheck companion modules',async()=>{const r=await resolveBundle(root,'parallel-engineering');for(const p of ['tools/skillcheck.mjs','tools/lib/contracts.mjs','tools/lib/runner.mjs','tools/lib/worktree.mjs'])assert.ok(r.files.some(f=>f.path===p),p);});
test('scenario status remains not-run rather than invented execution evidence',async()=>{const entries=JSON.parse(await readFile(join(root,'catalog/entries.json'),'utf8'));for(const e of entries.filter(e=>e.scenarioPath)){const d=JSON.parse(await readFile(join(root,e.scenarioPath),'utf8'));assert.equal(d.status,'not-run');assert.deepEqual(e.evidence,[]);}});
test('CLI discovery succeeds and unknown operations fail',()=>{const cli=join(root,'tools/bundle.mjs');const good=spawnSync(process.execPath,[cli,'list','--root',root],{encoding:'utf8'});assert.equal(good.status,0);assert.equal(JSON.parse(good.stdout).bundles.length,12);for(const args of [['install'],['resolve','missing','--root',root],['list','--require-clean'],['list','--root',root,'--root',root]])assert.equal(spawnSync(process.execPath,[cli,...args],{encoding:'utf8'}).status,2);});

test('web research includes the actual Python implementation and wrapper',async()=>{
 const result=await resolveBundle(root,'web-research');const files=new Set(result.files.map(f=>f.path));
 for(const path of ['tools/sourcekit.mjs','tools/sourcekit.py','tools/sourcekit_lib/common.py','tools/sourcekit_lib/transport.py','tools/sourcekit_lib/formats.py','tools/sourcekit_lib/routing.py','tools/sourcekit_lib/assessment.py','docs/SOURCEKIT.md'])assert.ok(files.has(path),path);
 assert.ok(![...files].some(p=>p.includes('__pycache__')));
});


test('harness bundle includes every original helper dependency and no executable adapter installation',async()=>{
 const r=await resolveBundle(root,'harness-engineering');const paths=new Set(r.files.map(f=>f.path));
 for(const p of ['tools/harnesskit.mjs','tools/lib/harness/common.mjs','tools/lib/harness/profile.mjs','tools/lib/harness/events.mjs','tools/lib/harness/readiness.mjs','tools/lib/harness/conformance.mjs','tools/lib/worktree.mjs','tools/lib/contracts.mjs','docs/HARNESSKIT.md'])assert.ok(paths.has(p),p);
 assert.equal(paths.has('evals/structural-refactoring/qualify.py'),false);
});


test('checkpoint and canary consumers receive all required modules and contracts',async()=>{
 const manifest=await resolveBundle(root,'harness-engineering');
 const text=JSON.stringify(manifest);
 for(const path of ['tools/lib/harness/checkpoint.mjs','tools/lib/harness/canary.mjs','docs/HARNESS_EVIDENCE.md','skills/bounded-harness-canary/SKILL.md'])assert.ok(text.includes(path),path);
});
