import { readFile, realpath } from 'node:fs/promises';
import { resolve, isAbsolute, basename } from 'node:path';
import { executableIdentity,openRPC,capture,hash } from './rpc.mjs';
import { readJSON,readText,canonical } from '../harness/common.mjs';
import { observeWorkspace,auditProfile } from '../harness/profile.mjs';
import { reconcileReadiness } from '../harness/readiness.mjs';

export async function probeCodex(config,root) {
  const skills=config.expectedSkills??[];
  if(!Array.isArray(skills)||skills.length>12||skills.some(s=>!s||typeof s.name!=='string'||!/^[-a-z0-9]+$/.test(s.name)||!isAbsolute(s.path??'')||!/^[a-f0-9]{64}$/.test(s.sha256??''))||new Set(skills.map(s=>s.name)).size!==skills.length)throw new Error('Invalid expected skill bindings');
  if(config.expectedAccountSha256!==undefined&&!/^[a-f0-9]{64}$/.test(config.expectedAccountSha256))throw new Error('Invalid expected account binding');
  if(process.env.OPENAI_API_KEY||process.env.CODEX_API_KEY)throw new Error('API-key override present; explicit subscription-only probe stopped');
  const identity=await executableIdentity(config.codexExecutable);
  const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!['GITHUB_TOKEN','GH_TOKEN','GITHUB_ENTERPRISE_TOKEN','GH_ENTERPRISE_TOKEN'].includes(k)));
  const version=(await capture(identity.path,['--version'],{cwd:root,env})).trim();
  if(!/^codex(?:-cli)? [\w.\-+]{1,80}$/.test(version))throw new Error('Unexpected Codex version response');
  const rpc=openRPC(identity.path,['app-server'],{cwd:root,env});
  try {
    await rpc.request('initialize',{clientInfo:{name:'toolkit-local-probe',version:'0.1.0'},capabilities:{experimentalApi:false}});
    rpc.notify('initialized');
    const result=await rpc.request('account/read',{refreshToken:false}),a=result?.account;
    if(a?.type!=='chatgpt')throw new Error('Expected ChatGPT-managed Codex authentication');
    if(config.expectedPlanType&&a.planType!==config.expectedPlanType)throw new Error('Unexpected Codex plan');
    // The account value never leaves the process. A private caller can bind the intended account.
    if(config.expectedAccountSha256&&hash(a.email??'')!==config.expectedAccountSha256)throw new Error('Unexpected Codex account');
    const params={cwds:[root],forceReload:true};
    if(config.skillRoot)params.perCwdExtraUserRoots=[{cwd:root,extraUserRoots:[await realpath(config.skillRoot)]}];
    const listed=await rpc.request('skills/list',params);
    const group=listed?.data?.find(d=>resolve(d.cwd)===root);
    if(!group||!Array.isArray(group.skills)||!Array.isArray(group.errors)||group.errors.length)throw new Error('Skill discovery incomplete');
    const expected=config.expectedSkills??[],discovered=[];
    for(const s of expected){
      const matches=group.skills.filter(x=>x.name===s.name&&x.enabled===true);
      if(matches.length!==1||typeof matches[0].path!=='string')throw new Error('Selected skill missing, duplicate, disabled or unbound');
      const path=await realpath(matches[0].path),want=await realpath(s.path);
      if(path!==want||hash(await readFile(path))!==s.sha256)throw new Error('Discovered skill bytes/path differ from selection');
      discovered.push(s.name);
    }
    return {fields:{authMode:{observed:'chatgpt',provenance:'runtime-response',mutability:'startup'},runtimeVersion:{observed:version,provenance:'host-probe',mutability:'startup'},runtimeExecutableSha256:{observed:identity.sha256,provenance:'host-probe',mutability:'startup'}},discovery:{checked:expected.length,names:discovered,activation:'discovered-only'},accountBinding:config.expectedAccountSha256?'matched':'not-configured'};
  } finally {await rpc.close();}
}
export function issuePath(id){
  const m=/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#([1-9][0-9]*)$/.exec(id);
  if(!m||['.','..'].includes(m[1])||['.','..'].includes(m[2])||!Number.isSafeInteger(Number(m[3])))throw new Error('Invalid full issue identity');
  return `repos/${m[1]}/${m[2]}/issues/${m[3]}`;
}
export async function readGitHubIssue(gh,root,id) {
  const data=JSON.parse(await capture(gh,['api','--hostname','github.com','--method','GET',issuePath(id)],{cwd:root}));
  const number=Number(id.split('#')[1]);
  if(data.number!==number||data.pull_request||!['open','closed'].includes(data.state))throw new Error('Unexpected tracker response');
  if(data.html_url!==`https://github.com/${id.replace('#','/issues/')}`)throw new Error('Tracker repository identity mismatch');
  return {id,state:data.state,reason:data.state_reason??null,ready:data.state==='open'&&data.labels?.some(l=>l.name==='agent-ready')===true};
}
export async function readAcceptance(dir,dependency,codeRepository) {
  if(!dir)return null;
  const root=await realpath(dir),recordPath=resolve(root,hash(dependency.id)+'.json');
  let a;try{a=readJSON(recordPath);}catch(e){if(e.code==='ENOENT')return null;throw e;}
  if(a.schemaVersion!==1||a.taskId!==dependency.id||a.codeRepository!==codeRepository||a.verdict!=='accepted'||a.contractRevision!==dependency.contractRevision||!/^[a-f0-9]{40,64}$/.test(a.candidateRevision))return null;
  if(typeof a.evidenceFile!=='string'||basename(a.evidenceFile)!==a.evidenceFile||!/^[-a-zA-Z0-9_.]+$/.test(a.evidenceFile)||a.evidenceFile==='.'||a.evidenceFile==='..')throw new Error('Invalid acceptance evidence path');
  const evidence=readText(resolve(root,a.evidenceFile));
  if(hash(evidence)!==a.acceptanceEvidenceSha256)throw new Error('Acceptance evidence changed');
  return {contractRevision:a.contractRevision,candidateRevision:a.candidateRevision,acceptanceEvidenceSha256:a.acceptanceEvidenceSha256};
}
// No implicit dependency inference from a filtered candidate list.
// The controller supplies observed ownership separately; this adapter never claims an issue.
export async function trackerSnapshot(task,{readIssue,acceptance=async()=>null,ownership=async()=> 'unknown'},now=Date.now()) {
  issuePath(task.id);
  if(!Array.isArray(task.dependencies)||task.dependencies.length>200)throw new Error('Invalid task dependency list');
  const observed=await readIssue(task.id),dependencies=[];
  for(const d of task.dependencies){
    issuePath(d.id);let state;
    try{state=await readIssue(d.id);}catch{dependencies.push({id:d.id,state:'unknown'});continue;}
    const a=state.state==='closed'&&state.reason==='completed'?await acceptance(d):null;
    dependencies.push({id:d.id,state:a?'accepted':state.state,...(a??{})});
  }
  return {schemaVersion:1,observedAt:new Date(now).toISOString(),task:{id:task.id,codeRepository:task.codeRepository,contractRevision:task.contractRevision,baseRevision:task.baseRevision,ready:observed.ready===true,ownership:await ownership(task)},dependencies};
}
export async function probeLocal(config,{ownership}={}) {
  const allowed=new Set(['schemaVersion','codeRoot','codexExecutable','ghExecutable','profilePath','taskPath','acceptanceRoot','expectedPlanType','expectedAccountSha256','skillRoot','expectedSkills']);
  if(config?.schemaVersion!==1||Object.keys(config).some(k=>!allowed.has(k)))throw new Error('Invalid local adapter configuration');
  for(const k of ['codeRoot','codexExecutable','profilePath'])if(typeof config[k]!=='string'||!isAbsolute(config[k]))throw new Error('Explicit absolute local bindings required');
  const root=await realpath(config.codeRoot),before=observeWorkspace(root),expected=readJSON(config.profilePath);
  const runtime=await probeCodex(config,root);
  const observed={...before,fields:{...before.fields,...runtime.fields}};
  let readiness=null;
  if(config.taskPath){
    const task=readJSON(config.taskPath),gh=await executableIdentity(config.ghExecutable);
    if(task.baseRevision!==before.workspace.head)throw new Error('Task base differs from current code checkout');
    const remote=(await capture('git',['-c','core.fsmonitor=false','-C',root,'remote','get-url','origin'],{env:Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.startsWith('GIT_')))})).trim();
    if(![`https://github.com/${task.codeRepository}.git`,`https://github.com/${task.codeRepository}`,`git@github.com:${task.codeRepository}.git`].includes(remote))throw new Error('Implementation repository identity mismatch');
    const snapshot=await trackerSnapshot(task,{readIssue:id=>readGitHubIssue(gh.path,root,id),acceptance:d=>readAcceptance(config.acceptanceRoot,d,task.codeRepository),ownership});
    readiness=reconcileReadiness(task,snapshot);
  }
  const after=observeWorkspace(root);
  if(canonical(before.workspace)!==canonical(after.workspace))throw new Error('Source changed during probes');
  const profile=auditProfile(expected,observed,after);
  return {schemaVersion:1,kind:'local-codex-github-observation',ok:profile.ok&&(readiness===null||readiness.ok),profile,readiness,discovery:runtime.discovery,accountBinding:runtime.accountBinding,workerInvocation:'not-run',integrationAcceptance:'not-evaluated',limits:['Explicit local subprocesses and GitHub reads only; no model turn, tracker mutation, install or cleanup.','Readiness depends on a trusted complete task contract, protected acceptance store and controller ownership probe. CLI ownership stays unknown.','Discovery is not invocation. macOS/Codex real-task smoke requires an actual authorized host.']};
}
