import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { inspectWorktree } from '../worktree.mjs';
import { check, doc, object, hash, digest, revision, canonical, freshness, limits } from './common.mjs';
const fields = new Set(['nodeVersion','platform','architecture','model','reasoning','authMode','runtimeVersion','runtimeExecutableSha256','approvalPolicy','sandbox','instructionsSha256','skillBundleSha256','mcpRootSha256']);
const scalar=v=>typeof v==='string' && v.length>0 && v.length<=512 && !/[\x00-\x1f]/.test(v);
export function observeWorkspace(root, now=Date.now()) {
  const snapshot=inspectWorktree(root);
  return {schemaVersion:1,kind:'harness-observation',observedAt:new Date(now).toISOString(),workspace:{rootSha256:hash(realpathSync(resolve(root))),head:snapshot.head,stateSha256:snapshot.stateSha256,dirty:snapshot.dirty},fields:Object.fromEntries(Object.entries({nodeVersion:process.version,platform:process.platform,architecture:process.arch}).map(([name,value])=>[name,{observed:value,provenance:'host-probe',mutability:'startup'}])),limits:[snapshot.coverage,...limits,'Node identity is this reporter process, not an observed coding-agent runtime.']};
}
export function auditProfile(expected, observed, live, now=Date.now()) {
  doc(expected);doc(observed);doc(live);
  check(object(expected.fields) && Object.keys(expected.fields).length>0 && typeof expected.requireClean==='boolean' && revision(expected.gitRevision),'invalid-profile');
  check(object(observed.workspace) && object(observed.fields) && object(live.workspace) && object(live.fields),'invalid-observations');
  const fresh=freshness(observed.observedAt,now,expected.maxAgeSeconds);
  const bound=['rootSha256','head','stateSha256'].every(k=>typeof observed.workspace[k]==='string' && observed.workspace[k]===live.workspace[k]);
  check(digest(live.workspace.rootSha256)&&digest(live.workspace.stateSha256)&&revision(live.workspace.head)&&typeof live.workspace.dirty==='boolean','invalid-live-observation');
  const checks=[{field:'source-revision',status:live.workspace.head===expected.gitRevision?'matched':'mismatch'},{field:'worktree-cleanliness',status:!expected.requireClean||!live.workspace.dirty?'matched':'mismatch'},{field:'observation-binding',status:bound?'matched':'mismatch'},{field:'observation-freshness',status:fresh?'matched':'stale'}];
  for (const [name,value] of Object.entries(expected.fields)) {
    check(fields.has(name)&&scalar(value),'invalid-profile-field');
    // Host identity is measured here. Everything else requires a separately qualified adapter.
    const record=['nodeVersion','platform','architecture'].includes(name)?live.fields[name]:observed.fields[name];
    if (!record) { checks.push({field:name,status:'unknown'});continue; }
    check(object(record)&&['host-probe','runtime-response','launch-arguments','configuration'].includes(record.provenance)&&['startup','reloadable','unknown'].includes(record.mutability),'invalid-field-provenance');
    for (const key of ['requested','resolved','observed']) check(record[key]===undefined||record[key]===null||scalar(record[key]),'invalid-field-value');
    const trustedShape=record.provenance!=='configuration'&&record.provenance!=='launch-arguments';
    checks.push({field:name,status:!bound?'unbound':!fresh?'stale':!trustedShape||record.observed==null?'unknown':record.observed===value?'matched':'mismatch',requestedMatches:record.requested==null?null:record.requested===value,resolvedMatches:record.resolved==null?null:record.resolved===value,mutability:record.mutability,provenance:record.provenance});
  }
  return {schemaVersion:1,kind:'execution-profile-audit',ok:checks.every(c=>c.status==='matched'),checks,workspace:live.workspace,profileSha256:hash(canonical(expected)),limits:[...limits,'Only Git-visible state and this Node process are probed. Auth/model/instructions/MCP fields are caller-supplied observations, not independently authenticated.','Field values and absolute paths are omitted; hashes are not a general redaction or secrecy mechanism.']};
}
