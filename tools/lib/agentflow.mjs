// Offline coordination core. It never launches agents, grants authority, or runs checks.
import { createHash } from 'node:crypto';
import { readFile, lstat, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { validatePlan, validScope, scopesOverlap } from './contracts.mjs';

const phases = ['implementation', 'verification', 'integration'];
const effects = ['read', 'local-write', 'repository-write', 'external-write', 'financial', 'production'];
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hashPattern = /^[0-9a-f]{64}$/;
const fail = (ok, message) => { if (!ok) throw new Error(message); };
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.trim().length > 0 && x.length <= 2000;
const id = x => typeof x === 'string' && x.length <= 64 && idPattern.test(x) && !['constructor','prototype'].includes(x);
const int = x => Number.isSafeInteger(x) && x >= 0 && x <= 1_000_000_000;
const strings = x => Array.isArray(x) && x.length <= 100 && x.every(id) && new Set(x).size === x.length;
const evidence = x => Array.isArray(x) && x.length > 0 && x.length <= 30 && x.every(text);
const hash = x => typeof x === 'string' && hashPattern.test(x);
const keys = (value, allowed, name) => fail(object(value) && Object.keys(value).every(k => allowed.includes(k)), `Unexpected ${name} field`);
export function canonical(value, depth = 0) {
  fail(depth < 40, 'Document nesting exceeds limit');
  if (Array.isArray(value)) return '[' + value.map(v => canonical(v, depth + 1)).join(',') + ']';
  if (object(value)) return '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+canonical(value[k],depth+1)).join(',') + '}';
  fail(value === null || ['string','boolean'].includes(typeof value) || (typeof value === 'number' && Number.isFinite(value)), 'Invalid JSON value');
  return JSON.stringify(value);
}
export const fingerprint = value => createHash('sha256').update(canonical(value)).digest('hex');
function resources(value, name) {
  fail(object(value) && Object.keys(value).length <= 30, `Invalid ${name} resources`);
  for (const [key, amount] of Object.entries(value)) fail(id(key) && int(amount), `Invalid ${name} resource`);
}
export function validateFlow(plan) {
  keys(plan, ['schemaVersion','runId','policy','tasks'], 'plan');
  fail(plan.schemaVersion === 1 && id(plan.runId), 'Invalid run identity');
  const base = validatePlan(plan);
  fail(base.ok, base.errors.map(e => `${e.path}: ${e.message}`).join('; '));
  const p = plan.policy;
  keys(p, ['maxConcurrent','reservedReviewSlots','maxTokens','allowedEffects','resources'], 'policy');
  fail(int(p.maxConcurrent) && p.maxConcurrent > 0 && p.maxConcurrent <= 100, 'Invalid concurrency');
  fail(int(p.reservedReviewSlots) && p.reservedReviewSlots < p.maxConcurrent, 'Invalid review reservation');
  fail(int(p.maxTokens) && p.maxTokens > 0, 'Invalid token budget');
  fail(strings(p.allowedEffects) && p.allowedEffects.every(e => effects.includes(e)), 'Invalid effect policy');
  resources(p.resources, 'policy');
  for (const t of plan.tasks) {
    keys(t, ['id','goal','owns','dependsOn','checks','acceptance','blockedBy','inputDigest','capabilities','effects','phase','tokenBudget','maxAttempts','resources','requiresApproval'], 'task');
    fail(id(t.id) && hash(t.inputDigest), `Invalid task input identity: ${t.id}`);
    fail(strings(t.capabilities) && t.capabilities.length && strings(t.effects) && t.effects.length && t.effects.every(e => effects.includes(e)), `Invalid capabilities/effects: ${t.id}`);
    fail(phases.includes(t.phase) && int(t.tokenBudget) && t.tokenBudget > 0 && int(t.maxAttempts) && t.maxAttempts > 0 && t.maxAttempts <= 10, `Invalid task limits: ${t.id}`);
    fail(typeof t.requiresApproval === 'boolean', `Explicit approval requirement missing: ${t.id}`);
    resources(t.resources, t.id);
  }
  return base;
}
export function validateCapabilities(registry, now = Date.now()) {
  keys(registry, ['schemaVersion','validUntil','workers','approvals'], 'registry');
  fail(registry.schemaVersion === 1 && Array.isArray(registry.workers) && registry.workers.length <= 100, 'Invalid capability registry');
  fail(typeof registry.validUntil === 'string' && Number.isFinite(Date.parse(registry.validUntil)), 'Invalid registry expiry');
  fail(Date.parse(registry.validUntil) > now, 'Capability registry expired');
  const seen = new Set();
  for (const w of registry.workers) {
    keys(w, ['id','capabilities','effects','phases','capacity','available','rank'], 'worker');
    fail(id(w.id) && !seen.has(w.id), 'Duplicate or invalid worker'); seen.add(w.id);
    fail(strings(w.capabilities) && strings(w.effects) && w.effects.every(e => effects.includes(e)) && strings(w.phases) && w.phases.every(p => phases.includes(p)), `Invalid worker capabilities: ${w.id}`);
    fail(int(w.capacity) && w.capacity > 0 && w.capacity <= 100 && typeof w.available === 'boolean' && int(w.rank), `Invalid worker availability: ${w.id}`);
  }
  fail(Array.isArray(registry.approvals) && registry.approvals.length <= 200, 'Invalid approval records');
  for (const a of registry.approvals) {
    keys(a, ['taskId','taskDigest','expiresAt','reference'], 'approval');
    fail(id(a.taskId) && hash(a.taskDigest) && typeof a.expiresAt === 'string' && Number.isFinite(Date.parse(a.expiresAt)) && text(a.reference), 'Invalid approval record');
  }
  return registry;
}
export function taskDigests(plan) {
  validateFlow(plan);
  const tasks = new Map(plan.tasks.map(t => [t.id,t])), result = new Map();
  function get(id) {
    if (!result.has(id)) {
      const t = tasks.get(id);
      result.set(id, fingerprint({task:t,dependencies:[...t.dependsOn].sort().map(d => [d,get(d)])}));
    }
    return result.get(id);
  }
  for (const id of [...tasks.keys()].sort()) get(id);
  return result;
}
export function createRun(plan) {
  validateFlow(plan);
  return {schemaVersion:1,plan:structuredClone(plan),planDigest:fingerprint(plan),events:[]};
}
function initialStates(plan) {
  return new Map(plan.tasks.map(t => [t.id, {status:'queued',attempt:0,worker:null,chargedTokens:0,artifact:null}]));
}
function applyEvent(states, plan, event, digests) {
  keys(event, ['id','taskId','taskDigest','type','attempt','workerId','usedTokens','artifact','evidence','reviewer','reason'], 'event');
  const t = plan.tasks.find(t => t.id === event.taskId), s = states.get(event.taskId);
  fail(id(event.id) && t && event.taskDigest === digests.get(t.id), 'Event task identity mismatch');
  fail(int(event.attempt), 'Invalid attempt');
  const before = s.status;
  if (event.type === 'started') {
    fail(before === 'queued' && event.attempt === s.attempt + 1 && event.attempt <= t.maxAttempts && id(event.workerId), 'Invalid start transition');
    fail(t.dependsOn.every(d => states.get(d).status === 'accepted'), 'Dependencies not accepted');
    fail(!t.blockedBy?.length, 'Task has unresolved blockers');
    s.status='running'; s.attempt=event.attempt; s.worker=event.workerId; s.artifact=null;
  } else {
    fail(event.attempt === s.attempt, 'Event attempt mismatch');
    if (event.type === 'submitted' || event.type === 'failed' || event.type === 'indeterminate') {
      fail(before === 'running', 'Only a running attempt can finish');
      fail(event.usedTokens === null || int(event.usedTokens), 'Explicit usage or null is required');
      s.chargedTokens += event.usedTokens ?? t.tokenBudget;
      fail(int(s.chargedTokens), 'Accumulated usage exceeds supported range');
      fail(evidence(event.evidence), 'Outcome evidence required');
      if (event.type === 'submitted') {
        keys(event.artifact, ['path','sha256'], 'artifact');
        fail(validScope(event.artifact.path) && !event.artifact.path.endsWith('/') && hash(event.artifact.sha256), 'Invalid artifact record');
        s.artifact=structuredClone(event.artifact);
      }
      s.status=event.type;
    } else if (event.type === 'accepted') {
      fail(before === 'submitted' && id(event.reviewer) && event.reviewer !== s.worker && evidence(event.evidence), 'Independent declared review evidence required');
      s.status='accepted';
    } else if (event.type === 'retry') {
      fail(before === 'failed' && s.attempt < t.maxAttempts && text(event.reason), 'Retry requires a failed, bounded, explained attempt');
      s.status='queued';
    } else if (event.type === 'reconciled-failure') {
      fail(['running','indeterminate','submitted'].includes(before) && evidence(event.evidence) && text(event.reason), 'Reconciliation evidence required');
      if (before === 'running') s.chargedTokens += t.tokenBudget; // Unknown interrupted usage remains charged.
      s.status='failed';
    } else throw new Error('Unknown event type');
  }
}
export function replayRun(run) {
  keys(run, ['schemaVersion','plan','planDigest','events'], 'run');
  fail(run.schemaVersion === 1, 'Invalid run schema'); validateFlow(run.plan);
  fail(run.planDigest === fingerprint(run.plan), 'Run plan digest mismatch');
  fail(Array.isArray(run.events) && run.events.length <= 2000, 'Invalid event journal');
  const states=initialStates(run.plan), seen=new Set(), digests=taskDigests(run.plan); let previous=run.planDigest;
  for (const [index, item] of run.events.entries()) {
    keys(item,['sequence','previous','event','hash'],'journal');
    fail(item.sequence===index+1 && item.previous===previous && !seen.has(item.event?.id), 'Journal order or duplicate event');
    fail(item.hash===fingerprint({sequence:item.sequence,previous:item.previous,event:item.event}), 'Journal hash mismatch');
    applyEvent(states,run.plan,item.event,digests); seen.add(item.event.id); previous=item.hash;
  }
  return {states,head:previous,events:run.events.length};
}
export function appendEvent(run,event,expectedHead) {
  const {head}=replayRun(run);
  fail(expectedHead===head, 'Stale journal head');
  const next=structuredClone(run), item={sequence:run.events.length+1,previous:head,event:structuredClone(event)};
  next.events.push({...item,hash:fingerprint(item)}); replayRun(next); return next;
}
export async function artifactMatches(root, artifact) {
  try {
    fail(validScope(artifact.path) && !artifact.path.endsWith('/'), 'Unsafe artifact path');
    const base=await realpath(root); let path=base;
    for (const part of artifact.path.split('/')) {path=resolve(path,part); fail(!(await lstat(path)).isSymbolicLink(),'Artifact symlink');}
    fail(path.startsWith(base+sep),'Artifact outside root');
    const stat=await lstat(path); fail(stat.isFile() && stat.size<=2*1024*1024,'Invalid artifact size/type');
    const bytes=await readFile(path); fail(bytes.length<=2*1024*1024,'Oversized artifact');
    return createHash('sha256').update(bytes).digest('hex')===artifact.sha256;
  } catch {return false;}
}
export async function schedule(plan, registry, {run, artifactRoot, now=Date.now()}={}) {
  validateFlow(plan); validateCapabilities(registry,now);
  const current=taskDigests(plan), states=initialStates(plan), blocked=[], selected=[], reusable=[];
  let consumed=0, active=0, implementation=0;
  const resourceUse=new Map(), workerUse=new Map(), activeScopes=[];
  function chargeResources(t) {for(const [key,v] of Object.entries(t.resources))resourceUse.set(key,(resourceUse.get(key)||0)+v);}
  if (run) {
    fail(plan.runId===run.plan.runId, 'Run ID mismatch');
    const old=replayRun(run).states, digests=taskDigests(run.plan);
    for(const [taskId,s] of old) {
      consumed+=s.chargedTokens;
      if(s.status==='running') consumed+=run.plan.tasks.find(t=>t.id===taskId).tokenBudget;
      if(s.status==='running'||s.status==='indeterminate') {
        const oldTask=run.plan.tasks.find(t=>t.id===taskId);
        // An uncertain effect may still be running. Never release its logical capacity by timeout alone.
        active++; if(oldTask.phase==='implementation')implementation++; chargeResources(oldTask); activeScopes.push(...oldTask.owns);
        workerUse.set(s.worker,(workerUse.get(s.worker)||0)+1);
      }
      if (!states.has(taskId)) {
        if(['running','indeterminate'].includes(s.status))blocked.push({taskId,reason:'removed-task-needs-reconciliation'});
        continue;
      }
      const copy=structuredClone(s); states.set(taskId,copy);
      if(digests.get(taskId)!==current.get(taskId))copy.status='stale-inputs';
      else if(s.status==='accepted') {
        if(!artifactRoot)copy.status='needs-artifact-check';
        else if(!(await artifactMatches(artifactRoot,s.artifact)))copy.status='stale-artifact';
      }
    }
  }
  // Invalidate accepted descendants when any prerequisite cannot be reused.
  for (const wave of validateFlow(plan).waves) for (const taskId of wave) {
    const task=plan.tasks.find(t=>t.id===taskId), state=states.get(taskId);
    if(state.status==='accepted' && task.dependsOn.some(d=>states.get(d).status!=='accepted'))state.status='stale-dependency';
  }
  const p=plan.policy;
  const ordered=[...plan.tasks].sort((a,b)=>phases.indexOf(b.phase)-phases.indexOf(a.phase)||a.id.localeCompare(b.id,'en'));
  for(const t of ordered) {
    const state=states.get(t.id); let reason;
    if(state.status==='accepted'){reusable.push(t.id);continue;}
    if(state.status!=='queued')reason=['running','indeterminate'].includes(state.status)?'needs-reconciliation':state.status;
    else if(t.blockedBy?.length)reason='declared-blocker';
    else if(!t.dependsOn.every(d=>states.get(d).status==='accepted'))reason='dependencies-not-accepted';
    else if(t.owns.some(a=>activeScopes.some(b=>scopesOverlap(a,b))))reason='active-scope-conflict';
    else if(!t.effects.every(e=>p.allowedEffects.includes(e)))reason='effect-outside-policy';
    else if(t.requiresApproval && !registry.approvals.some(a=>a.taskId===t.id && a.taskDigest===current.get(t.id) && Date.parse(a.expiresAt)>now))reason='approval-required';
    else if(consumed+t.tokenBudget>p.maxTokens)reason='token-budget';
    else if(active>=p.maxConcurrent || (t.phase==='implementation' && implementation>=p.maxConcurrent-p.reservedReviewSlots))reason='concurrency-reserved';
    else if(Object.entries(t.resources).some(([key,v])=>!(key in p.resources)||(resourceUse.get(key)||0)+v>p.resources[key]))reason='resource-capacity';
    const candidates=registry.workers.filter(w=>w.available && t.capabilities.every(c=>w.capabilities.includes(c)) && t.effects.every(e=>w.effects.includes(e)) && w.phases.includes(t.phase) && (workerUse.get(w.id)||0)<w.capacity).sort((a,b)=>a.rank-b.rank||a.id.localeCompare(b.id,'en'));
    if(!reason && !candidates.length)reason='no-capable-worker';
    if(reason){blocked.push({taskId:t.id,reason});continue;}
    const worker=candidates[0]; selected.push({taskId:t.id,workerId:worker.id,taskDigest:current.get(t.id),tokenReservation:t.tokenBudget,resources:t.resources});
    consumed+=t.tokenBudget; active++; if(t.phase==='implementation')implementation++;
    chargeResources(t); workerUse.set(worker.id,(workerUse.get(worker.id)||0)+1);
  }
  return {schemaVersion:1,runId:plan.runId,selected,blocked,reusable,tokensCommitted:consumed,overBudget:consumed>p.maxTokens,execution:'none',limitations:['Offline proposal, not live scheduling or authorization.','Capabilities, input digests, approvals, usage and reviews are caller-supplied.','Journal hashes detect inconsistency, not malicious rewriting or competing heads.','Artifact reads are bounded observations, not atomic snapshots or acceptance tests.']};
}
export function runStatus(run) {
  const {states,head,events}=replayRun(run);
  return {schemaVersion:1,runId:run.plan.runId,head,events,tasks:[...states].map(([taskId,s])=>({taskId,...s})),execution:'none'};
}
