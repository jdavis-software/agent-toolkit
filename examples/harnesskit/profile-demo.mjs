import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {observeWorkspace,auditProfile} from '../../tools/lib/harness/profile.mjs';
const root=mkdtempSync(join(tmpdir(),'harness-preflight-'));
try {
  const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.startsWith('GIT_')));
  const git=args=>execFileSync('git',args,{cwd:root,env:{...env,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'},stdio:'pipe',timeout:5000});
  git(['init']);writeFileSync(join(root,'source.txt'),'fixture');git(['add','.']);git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','fixture']);
  const before=observeWorkspace(root), expected={schemaVersion:1,gitRevision:before.workspace.head,requireClean:true,maxAgeSeconds:300,fields:{nodeVersion:process.version}};
  assert.equal(auditProfile(expected,before,observeWorkspace(root)).ok,true);
  const runtimeRequired={...expected,fields:{...expected.fields,authMode:'chatgpt'}};
  assert.equal(auditProfile(runtimeRequired,before,observeWorkspace(root)).ok,false);
  writeFileSync(join(root,'untracked.txt'),'new work');
  assert.equal(auditProfile(expected,before,observeWorkspace(root)).ok,false);
  console.log(JSON.stringify({scope:'disposable Git and Node only',matchingHost:true,missingRuntimeBlocked:true,changedWorktreeBlocked:true,liveAgentQualification:false}));
} finally {rmSync(root,{recursive:true,force:true});}
