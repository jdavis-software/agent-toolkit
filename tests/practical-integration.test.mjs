import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, rm, writeFile, readFile, mkdir, symlink, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { loadRoles,resolveRole,stageRole,verifyStage } from '../tools/lib/roles.mjs';
import { syncInventory,inventory } from '../scripts/inventory.mjs';
import { trackerSnapshot,issuePath,readAcceptance,probeCodex } from '../tools/lib/local-adapter/probe.mjs';
import { hash,openRPC } from '../tools/lib/local-adapter/rpc.mjs';
import { reconcileReadiness } from '../tools/lib/harness/readiness.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha='a'.repeat(64),revision='b'.repeat(40);
async function scratch(t){const d=await mkdtemp(join(tmpdir(),'toolkit-practical-'));t.after(()=>rm(d,{recursive:true,force:true}));return d;}
const git=(r,...a)=>execFileSync('git',['-c','user.name=Fixture','-c','user.email=fixture@localhost','-C',r,...a],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
async function checkout(t){const d=await scratch(t),r=join(d,'source');await cp(root,r,{recursive:true,filter:p=>!p.split('/').some(s=>['.git','node_modules','dist'].includes(s))});git(r,'init');git(r,'add','.');git(r,'commit','-m','fixture');return{d,r,rev:git(r,'rev-parse','HEAD')};}

test('four small roles resolve canonical skills and complete companions',async()=>{
 const roles=await loadRoles(root);assert.equal(roles.length,4);
 for(const r of roles){const m=await resolveRole(root,r.id);assert.deepEqual(m.skills,[...r.skills].sort());assert(m.skills.length<=12);assert(m.files.some(f=>f.path==='tools/skillcheck.mjs'));}
 const m=await resolveRole(root,'coordinator');assert(m.files.some(f=>f.path==='tools/lib/harness/readiness.mjs'));assert(m.files.some(f=>f.path==='tools/agentflow.mjs'));
});
test('generated documentation counts match the catalog',async()=>{
 const c=await syncInventory({root});assert.equal(c.skills,72);assert.equal(c.roles,4);assert.equal(c.scenarios,198);
});
test('documentation drift fails rather than quietly passing',async t=>{
 const {r}=await checkout(t);const p=join(r,'docs/ROADMAP.md');await writeFile(p,(await readFile(p,'utf8')).replace('72 original skills','2 original skills'));
 await assert.rejects(syncInventory({root:r}),/Inventory drift/);await syncInventory({root:r,write:true});await syncInventory({root:r});
});
test('immutable stage preserves helper closure and discovery links',async t=>{
 const {r,d,rev}=await checkout(t),dest=join(d,'stage');await stageRole(r,'coordinator',dest,rev);
 const report=await verifyStage(dest);assert(report.ok);assert.equal(report.activation,'not-tested');
 for(const entry of ['harnesskit','skillcheck','agentflow'])assert.match(execFileSync(process.execPath,[join(dest,`tools/${entry}.mjs`),'--help'],{encoding:'utf8'}),/./);
 await assert.rejects(stageRole(r,'coordinator',dest,rev),/EEXIST/);
});
test('staging requires an exact clean reviewed revision and external destination',async t=>{
 const {r,d,rev}=await checkout(t);await assert.rejects(stageRole(r,'go-worker',join(d,'a')),/revision/);
 await assert.rejects(stageRole(r,'go-worker',join(d,'a'),'c'.repeat(40)),/Revision mismatch/);
 await assert.rejects(stageRole(r,'go-worker',join(r,'out'),rev),/outside/);
 await writeFile(join(r,'dirty'),'x');await assert.rejects(stageRole(r,'go-worker',join(d,'b'),rev),/clean/);
});
test('package verification rejects tampering and unexpected files',async t=>{
 const {r,d,rev}=await checkout(t),dest=join(d,'stage');await stageRole(r,'go-worker',dest,rev);
 await writeFile(join(dest,'surprise'),'x');await assert.rejects(verifyStage(dest),/Unexpected/);await rm(join(dest,'surprise'));
 await writeFile(join(dest,'tools/skillcheck.mjs'),'changed');await assert.rejects(verifyStage(dest),/changed/);
});
test('role resolution rejects symlink package inputs',async t=>{
 const {r,d}=await checkout(t);await writeFile(join(d,'foreign'),'x');await symlink(join(d,'foreign'),join(r,'skills/worktree-handoff/foreign'));
 await assert.rejects(resolveRole(r,'go-worker'),/Symlink/);
});
const task=()=>({schemaVersion:1,id:'example/tasks#2',codeRepository:'example/code',contractRevision:sha,baseRevision:revision,maxAgeSeconds:300,dependencies:[{id:'example/tasks#1',contractRevision:sha}]});
test('tracker adapter explicitly reads prerequisites outside any ready filter',async()=>{
 const seen=[];const s=await trackerSnapshot(task(),{readIssue:async id=>{seen.push(id);return{id,state:'open',ready:id.endsWith('#2')};}});
 assert.deepEqual(seen,['example/tasks#2','example/tasks#1']);assert.equal(s.dependencies[0].state,'open');assert.equal(s.task.ownership,'unknown');assert.equal(reconcileReadiness(task(),s).ok,false);
});
test('closed or canceled issues are not accepted without independent evidence',async()=>{
 for(const reason of ['completed','not_planned',null]){const s=await trackerSnapshot(task(),{readIssue:async id=>({id,state:'closed',reason,ready:true}),ownership:async()=> 'available'});assert.equal(s.dependencies[0].state,'closed');assert.equal(reconcileReadiness(task(),s).ok,false);}
});
test('read failure stays unknown, never completed',async()=>{
 const s=await trackerSnapshot(task(),{readIssue:async id=>{if(id.endsWith('#1'))throw new Error('secret');return{id,state:'open',ready:true};}});assert.equal(s.dependencies[0].state,'unknown');assert(!JSON.stringify(s).includes('secret'));
});
test('matching trusted acceptance and observed ownership satisfy scoped readiness',async()=>{
 const s=await trackerSnapshot(task(),{readIssue:async id=>({id,state:id.endsWith('#1')?'closed':'open',reason:'completed',ready:true}),acceptance:async()=>({contractRevision:sha,candidateRevision:revision,acceptanceEvidenceSha256:sha}),ownership:async()=> 'available'});assert(reconcileReadiness(task(),s).ok);
});
test('full identity parser rejects traversal and bare numbers',()=>{
 assert.equal(issuePath('example/tasks#2'),'repos/example/tasks/issues/2');for(const bad of ['2','../tasks#2','example/tasks#0','example/tasks#2?x'])assert.throws(()=>issuePath(bad));
});
test('acceptance reader verifies actual evidence bytes',async t=>{
 const d=await scratch(t),dep=task().dependencies[0],body='independent fixture evidence';await writeFile(join(d,'evidence.txt'),body);
 const rec={schemaVersion:1,taskId:dep.id,codeRepository:'example/code',verdict:'accepted',contractRevision:sha,candidateRevision:revision,evidenceFile:'evidence.txt',acceptanceEvidenceSha256:hash(body)};
 await writeFile(join(d,hash(dep.id)+'.json'),JSON.stringify(rec));assert(await readAcceptance(d,dep,'example/code'));await writeFile(join(d,'evidence.txt'),'tampered');await assert.rejects(readAcceptance(d,dep,'example/code'),/changed/);
});
async function fakeCodex(t,accountType='chatgpt'){
 const d=await scratch(t),file=join(d,'codex'),skill=join(d,'SKILL.md'),log=join(d,'calls.jsonl');await writeFile(skill,'fixture skill');
 const content=`#!/usr/bin/env node\nimport fs from 'node:fs';import readline from 'node:readline';\nif(process.argv.includes('--version')){console.log('codex-cli 0.0.0-fixture');process.exit(0);}\nconst rl=readline.createInterface({input:process.stdin});rl.on('line',line=>{const x=JSON.parse(line);fs.appendFileSync(${JSON.stringify(log)},JSON.stringify({method:x.method})+'\\n');if(x.id===undefined)return;let result={};if(x.method==='account/read')result={account:{type:${JSON.stringify(accountType)},planType:'pro',email:'fixture-secret@example.invalid'}};if(x.method==='skills/list')result={data:[{cwd:process.cwd(),skills:[{name:'fixture',enabled:true,path:${JSON.stringify(skill)}}],errors:[]}]};console.log(JSON.stringify({id:x.id,result}));});`;
 await writeFile(file,content);await chmod(file,0o700);return{d,file,skill,log};
}
test('real subprocess with synthetic protocol verifies identity/discovery without model calls or secret output',async t=>{
 const f=await fakeCodex(t),r=await probeCodex({codexExecutable:f.file,expectedPlanType:'pro',expectedAccountSha256:hash('fixture-secret@example.invalid'),expectedSkills:[{name:'fixture',path:f.skill,sha256:hash('fixture skill')}]},f.d);
 assert.equal(r.fields.authMode.observed,'chatgpt');assert.equal(r.accountBinding,'matched');assert.deepEqual(r.discovery.names,['fixture']);assert(!JSON.stringify(r).includes('fixture-secret'));
 const methods=(await readFile(f.log,'utf8')).trim().split('\n').map(x=>JSON.parse(x).method);assert.deepEqual(methods,['initialize','initialized','account/read','skills/list']);
});
test('API-key authenticated runtime is blocked',async t=>{const f=await fakeCodex(t,'apiKey');await assert.rejects(probeCodex({codexExecutable:f.file},f.d),/ChatGPT-managed/);});
test('wrong account and tampered discovered skills fail',async t=>{
 const f=await fakeCodex(t);await assert.rejects(probeCodex({codexExecutable:f.file,expectedAccountSha256:sha},f.d),/Unexpected Codex account/);
 await assert.rejects(probeCodex({codexExecutable:f.file,expectedSkills:[{name:'fixture',path:f.skill,sha256:sha}]},f.d),/differ/);
});
test('RPC deadline stops only its owned stalled process',async()=>{
 const r=openRPC(process.execPath,['-e','setInterval(()=>{},1000)'],{timeoutMs:100});await assert.rejects(r.request('initialize',{}),/deadline/);await r.close();
});
test('missing RPC executable fails without unhandled signal error',async()=>{
 const r=openRPC('/nonexistent-toolkit-fixture',[],{timeoutMs:100});await assert.rejects(r.request('initialize',{}));await r.close();
});


test('invalid RPC envelope fails as a bounded error',async()=>{
 const r=openRPC(process.execPath,['-e',"process.stdin.on('data',()=>process.stdout.write('null\\n'))"],{timeoutMs:1000});
 await assert.rejects(r.request('initialize',{}),/Invalid RPC/);await r.close();
});
test('malformed expected skill bindings fail before any executable launches',async()=>{
 await assert.rejects(probeCodex({codexExecutable:'/nonexistent-toolkit-fixture',expectedSkills:[{name:'x',path:'relative',sha256:'bad'}]},root),/Invalid expected/);
});
test('staged role label cannot disagree with its hashed selection',async t=>{
 const {r,d,rev}=await checkout(t),dest=join(d,'stage');await stageRole(r,'reviewer',dest,rev);
 const path=join(dest,'role-manifest.json'),m=JSON.parse(await readFile(path,'utf8'));m.roleId='coordinator';await writeFile(path,JSON.stringify(m));await assert.rejects(verifyStage(dest),/Role identity/);
});
