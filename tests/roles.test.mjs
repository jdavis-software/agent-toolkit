import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { validateRoles, loadRoles, resolveRole, validateRolePackages } from '../tools/lib/roles.mjs';
const root=process.cwd();
const entries=JSON.parse(await readFile('catalog/entries.json','utf8'));
const registry=JSON.parse(await readFile('catalog/roles.json','utf8'));
const copy=x=>structuredClone(x);
const hash=x=>createHash('sha256').update(x).digest('hex');
const entry={id:'demo',kind:'skill',origin:'original',sourcePath:'skills/demo/SKILL.md'};
function document(){const r=copy(registry.roles[0]);r.skills=['demo'];return {schemaVersion:1,roles:[r]};}
async function fixture(t,{git=false}={}){
 const dir=await mkdtemp(join(tmpdir(),'role-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 await mkdir(join(dir,'catalog'));await mkdir(join(dir,'skills/demo'),{recursive:true});
 await writeFile(join(dir,'catalog/roles.json'),JSON.stringify(document()));
 await writeFile(join(dir,'catalog/entries.json'),JSON.stringify([entry]));
 await writeFile(join(dir,'catalog/bundles.json'),JSON.stringify({schemaVersion:1,bundles:[]}));
 await writeFile(join(dir,'skills/demo/SKILL.md'),'Original synthetic instruction\n');
 if(git){const run=args=>execFileSync('git',['-C',dir,...args],{stdio:'ignore'});run(['init','-q']);run(['config','core.hooksPath','/dev/null']);run(['add','.']);run(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','fixture']);}
 return dir;
}
test('eight roles reference original skills without increasing catalog entries',async()=>{assert.equal(await validateRolePackages(root),8);assert.equal(entries.length,121);assert.equal(entries.filter(e=>e.kind==='skill').length,112);assert.ok(entries.every(e=>e.kind!=='role'));});
test('role definitions remain experimental and reviewer modes request read-only',()=>{for(const r of validateRoles(registry,entries)){assert.equal(r.stage,'experimental');if(['review','analysis'].includes(r.kind))assert.equal(r.requestedMode,'read-only');}});
for(const [label,mutate] of [
 ['unknown skills',d=>d.roles[0].skills=['missing']],
 ['duplicate skills',d=>d.roles[0].skills.push(d.roles[0].skills[0])],
 ['duplicate roles',d=>d.roles.push(copy(d.roles[0]))],
 ['path traversal',d=>d.roles[0].id='../outside'],
 ['unapproved extra field',d=>d.roles[0].allowedTools=['shell']],
 ['reviewer mutation mode',d=>{d.roles[0].kind='review';d.roles[0].requestedMode='task-bound';}],
 ['empty deliverables',d=>d.roles[0].deliverables=[]],
 ['invalid stage',d=>d.roles[0].stage='validated'],
 ['nonliteral version',d=>d.roles[0].version='latest'],
 ['oversized text',d=>d.roles[0].description='x'.repeat(401)],
 ['control character',d=>d.roles[0].title='bad\ntitle'],
 ['duplicate context',d=>d.roles[0].context.push(d.roles[0].context[0])],
])test(`reject ${label}`,()=>{const d=copy(registry);mutate(d);assert.throws(()=>validateRoles(d,entries));});
test('external links are not local skill packages',()=>{assert.throws(()=>validateRoles(document(),[{...entry,origin:'curated'}]));});
test('invalid registries fail',()=>{for(const d of [null,{},[],{schemaVersion:1,roles:[]},{...registry,permission:'all'}])assert.throws(()=>validateRoles(d,entries));});
test('content-only role resolution hashes actual bytes and includes registry identity',async t=>{const dir=await fixture(t);const r=await resolveRole(dir,'frontend-engineer');assert.equal(r.execution,'none');assert.equal(r.source.verification,'content-only');assert.ok(r.files.some(f=>f.path==='catalog/roles.json'));for(const f of r.files)assert.equal(hash(await readFile(join(dir,f.path))),f.sha256);assert.ok(!JSON.stringify(r).includes(dir));});
test('role metadata changes invalidate its digest',async t=>{const dir=await fixture(t);const a=await resolveRole(dir,'frontend-engineer');const d=document();d.roles[0].deliverables=['A different explicit handoff'];await writeFile(join(dir,'catalog/roles.json'),JSON.stringify(d));assert.notEqual((await resolveRole(dir,'frontend-engineer')).roleDigest,a.roleDigest);});
test('skill file changes invalidate role digest',async t=>{const dir=await fixture(t);const a=await resolveRole(dir,'frontend-engineer');await writeFile(join(dir,'skills/demo/SKILL.md'),'Changed\n');assert.notEqual((await resolveRole(dir,'frontend-engineer')).roleDigest,a.roleDigest);});
test('stable resolution is deterministic and sorted',async t=>{const dir=await fixture(t);const a=await resolveRole(dir,'frontend-engineer'),b=await resolveRole(dir,'frontend-engineer');assert.equal(a.roleDigest,b.roleDigest);assert.deepEqual(a.files.map(f=>f.path),a.files.map(f=>f.path).sort());});
test('unknown role and invalid role path fail',async()=>{for(const id of ['missing','../secret','X',null])await assert.rejects(resolveRole(root,id));});
test('missing skill fails rather than substituting a package',async t=>{const dir=await fixture(t);await rm(join(dir,'skills/demo/SKILL.md'));await assert.rejects(resolveRole(dir,'frontend-engineer'));});
test('symlinked registry fails before reading external data',async t=>{const dir=await fixture(t);await rm(join(dir,'catalog/roles.json'));await symlink('/etc/passwd',join(dir,'catalog/roles.json'));await assert.rejects(loadRoles(dir));});
test('symlinked skill support is rejected',async t=>{const dir=await fixture(t);await symlink('/etc/passwd',join(dir,'skills/demo/other'));await assert.rejects(resolveRole(dir,'frontend-engineer'));});
test('strict resolution requires actual clean Git provenance',async t=>{const dir=await fixture(t);await assert.rejects(resolveRole(dir,'frontend-engineer',{requireClean:true}));});
test('strict clean role validates matching revision and rejects stale pin and dirty state',async t=>{const dir=await fixture(t,{git:true});const revision=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();assert.equal((await resolveRole(dir,'frontend-engineer',{expectedRevision:revision})).source.dirty,false);await assert.rejects(resolveRole(dir,'frontend-engineer',{expectedRevision:'0'.repeat(40)}));await writeFile(join(dir,'extra'),'changed');await assert.rejects(resolveRole(dir,'frontend-engineer',{requireClean:true}));});
test('CLI lists metadata and resolves selected files without execution',()=>{for(const command of [['roles'],['role','architecture-reviewer']]){const r=spawnSync(process.execPath,['tools/bundle.mjs',...command],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).execution,'none');}});
test('CLI rejects unsupported roles options and commands',()=>{for(const args of [['roles','--require-clean'],['role','missing'],['launch','frontend-engineer'],['role','frontend-engineer','--root',root,'--root',root]])assert.equal(spawnSync(process.execPath,['tools/bundle.mjs',...args],{encoding:'utf8'}).status,2);});
test('role companions include executable support, not installed upstream packages',async()=>{const r=await resolveRole(root,'video-producer');assert.ok(r.files.some(f=>f.path==='tools/publication_lib/timeline.py'));assert.ok(!r.files.some(f=>f.path.includes('node_modules')));});
