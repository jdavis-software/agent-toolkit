import { check, doc, object, digest, revision, freshness, limits } from './common.mjs';
const repository=v=>typeof v==='string'&&/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(v);
const taskId=v=>typeof v==='string'&&/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+#[1-9][0-9]*$/.test(v);
export function reconcileReadiness(task,snapshot,now=Date.now()) {
  doc(task);doc(snapshot);
  check(taskId(task.id)&&repository(task.codeRepository)&&digest(task.contractRevision)&&revision(task.baseRevision),'invalid-task-identity');
  check(Array.isArray(task.dependencies)&&task.dependencies.length<=200&&Array.isArray(snapshot.dependencies)&&snapshot.dependencies.length<=200&&object(snapshot.task),'invalid-dependencies');
  const seen=new Set();
  for (const d of task.dependencies) { check(object(d)&&taskId(d.id)&&d.id!==task.id&&!seen.has(d.id)&&digest(d.contractRevision),'invalid-task-dependency'); seen.add(d.id); }
  const map=new Map();
  for (const d of snapshot.dependencies) { check(object(d)&&taskId(d.id)&&!map.has(d.id)&&['accepted','open','closed','unknown'].includes(d.state),'invalid-dependency-observation');map.set(d.id,d); }
  const checks=[];
  checks.push({check:'snapshot-freshness',ok:freshness(snapshot.observedAt,now,task.maxAgeSeconds)});
  checks.push({check:'identity-and-revisions',ok:['id','codeRepository','contractRevision','baseRevision'].every(k=>snapshot.task[k]===task[k])});
  checks.push({check:'ready-cue',ok:snapshot.task.ready===true});
  checks.push({check:'ownership-observed-available',ok:snapshot.task.ownership==='available'});
  for (const d of task.dependencies) {
    const found=map.get(d.id);
    const reason=!found?'unknown-prerequisite':found.contractRevision!==d.contractRevision?'stale-prerequisite':found.state!=='accepted'?'not-accepted':!digest(found.acceptanceEvidenceSha256)||!revision(found.candidateRevision)?'missing-acceptance-evidence':'accepted-record';
    checks.push({check:'prerequisite',id:d.id,ok:reason==='accepted-record',reason});
  }
  return {schemaVersion:1,kind:'tracker-readiness',ok:checks.every(c=>c.ok),taskId:task.id,checks,authority:'record-check-only',limits:[...limits,'No tracker is contacted; missing or filtered-out dependencies are unknown.','Availability is an observation, not an atomic reservation. Recheck and claim through the authoritative controller before dispatch.','The trusted caller must supply a complete prerequisite set and genuine independent acceptance evidence.']};
}
