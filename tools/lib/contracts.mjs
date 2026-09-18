// Original contracts for Jordan's Agent Toolkit Collection. No runtime dependencies.
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = value => typeof value === 'string' && value.trim().length > 0;
const list = value => Array.isArray(value);
const evidence = value => list(value) && value.length > 0 && value.every(text);
const object = value => value !== null && typeof value === 'object' && !list(value);
export function validScope(value) {
  return text(value) && !value.startsWith('/') && !/[\\\u0000-\u001f*?\[\]{}:]/.test(value)
    && value.replace(/\/$/, '').split('/').every(p => p && p !== '.' && p !== '..' && p.toLowerCase() !== '.git');
}
export const ownsPath = (scope, path) => scope.endsWith('/') ? path.startsWith(scope) : path === scope;
export const scopesOverlap = (a, b) => a.replace(/\/$/,'') === b.replace(/\/$/,'') || ownsPath(a, b) || ownsPath(b, a);
function checker() {
  const errors = [];
  return { errors, require(ok, path, message) { if (!ok) errors.push({path, message}); } };
}
function identifiers(items, path, c) {
  c.require(list(items) && items.length > 0, path, 'Expected a nonempty array');
  if (!list(items)) return new Map();
  const found = new Map();
  for (const [i, entry] of items.entries()) {
    c.require(object(entry) && text(entry.id) && slug.test(entry.id) && !found.has(entry.id), `${path}[${i}].id`, 'Expected a unique lowercase identifier');
    if (object(entry)) found.set(entry.id, entry);
  }
  return found;
}
export function validatePlan(plan) {
  const c = checker();
  c.require(object(plan) && plan.schemaVersion === 1, 'schemaVersion', 'Expected version 1');
  c.require(!list(plan?.tasks) || plan.tasks.length<=200, 'tasks', 'Split plans larger than 200 tasks');
  if(c.errors.length)return {ok:false, errors:c.errors, waves:[]};
  const tasks = identifiers(plan?.tasks, 'tasks', c);
  if (!tasks.size || c.errors.length) return {ok:false, errors:c.errors, waves:[]};
  for (const [id, t] of tasks) {
    const p = `tasks.${id}`;
    c.require(text(t.goal), `${p}.goal`, 'State an observable outcome');
    c.require(list(t.owns) && t.owns.length > 0 && t.owns.every(validScope), `${p}.owns`, 'Use relative literal files or directory prefixes ending in /; no globs');
    c.require(list(t.dependsOn) && t.dependsOn.every(d => tasks.has(d) && d !== id) && new Set(t.dependsOn).size === t.dependsOn.length, `${p}.dependsOn`, 'Dependencies must be distinct existing task IDs, not self');
    const checks = identifiers(t.checks, `${p}.checks`, c);
    for (const [checkId, check] of checks) {
      c.require(list(check.argv) && check.argv.length > 0 && check.argv.every(v => typeof v === 'string' && !v.includes('\0')) && text(check.argv[0]), `${p}.checks.${checkId}.argv`, 'Provide a command argument array, not a shell string');
    }
    const criteria = identifiers(t.acceptance, `${p}.acceptance`, c);
    for (const [criterionId, criterion] of criteria) {
      c.require(text(criterion.expect), `${p}.acceptance.${criterionId}.expect`, 'State the expected observation');
      c.require(list(criterion.checkIds) && criterion.checkIds.length > 0 && criterion.checkIds.every(key => checks.has(key)), `${p}.acceptance.${criterionId}.checkIds`, 'Map the criterion to declared checks');
    }
    if (t.blockedBy !== undefined) c.require(list(t.blockedBy) && t.blockedBy.every(text), `${p}.blockedBy`, 'Blockers must be explicit strings');
  }
  if (c.errors.length) return {ok:false, errors:c.errors, waves:[]};
  // Topological levels are a planning aid, not an agent launcher or concurrency quota.
  const done = new Set(), waves = [];
  while (done.size < tasks.size) {
    const next = [...tasks].filter(([id,t]) => !done.has(id) && t.dependsOn.every(d => done.has(d))).map(([id]) => id).sort();
    if (!next.length) { c.require(false, 'tasks', 'Dependency cycle detected'); break; }
    waves.push(next); next.forEach(id => done.add(id));
  }
  if (c.errors.length) return {ok:false, errors:c.errors, waves:[]};
  const ancestors = id => {
    const result = new Set(), queue = [...tasks.get(id).dependsOn];
    while (queue.length) { const d=queue.pop(); if (!result.has(d)) { result.add(d); queue.push(...tasks.get(d).dependsOn); } }
    return result;
  };
  const ids = [...tasks.keys()], parents = new Map(ids.map(id => [id, ancestors(id)]));
  for (let i=0;i<ids.length;i++) for (let j=i+1;j<ids.length;j++) {
    const a=ids[i], b=ids[j];
    if (parents.get(a).has(b) || parents.get(b).has(a)) continue;
    const overlap = tasks.get(a).owns.flatMap(x => tasks.get(b).owns.filter(y => scopesOverlap(x,y)).map(y => [x,y]));
    if (overlap.length) c.require(false, `tasks.${a}/${b}`, `Unordered ownership overlap: ${JSON.stringify(overlap)}`);
  }
  const blocked = ids.filter(id => [id,...parents.get(id)].some(d => tasks.get(d).blockedBy?.length));
  return {ok:c.errors.length===0, errors:c.errors, waves:c.errors.length ? [] : waves.map(w=>w.filter(id=>!blocked.includes(id))).filter(w=>w.length), blocked, scopeSemantics:'case-sensitive literal paths; not a filesystem sandbox', checksExecuted:false};
}
export function validateDebug(record) {
  const c = checker();
  c.require(record?.schemaVersion === 1, 'schemaVersion', 'Expected version 1');
  const hypotheses = identifiers(record?.hypotheses, 'hypotheses', c);
  for (const [id,h] of hypotheses) {
    c.require(text(h.claim) && text(h.falsifier), `hypotheses.${id}`, 'Provide an explanation and an observation that would refute it');
  }
  c.require(object(record?.reproduction) && text(record.reproduction.checkId) && text(record.reproduction.signature), 'reproduction', 'Identify the original check and expected failure signature');
  c.require(['failed','blocked','not-run'].includes(record?.reproduction?.status), 'reproduction.status', 'Record the pre-repair observation separately from setup failures');
  c.require(list(record?.experiments), 'experiments', 'Expected an experiment array');
  const experiments=list(record?.experiments)?record.experiments:[];
  for (const [i,e] of experiments.entries()) {
    c.require(object(e) && hypotheses.has(e.hypothesisId) && text(e.observation) && evidence(e.evidence) && ['supports','contradicts','inconclusive'].includes(e.result), `experiments[${i}]`, 'Expected a known hypothesis, observation, result, and evidence reference');
  }
  c.require(['fixed','supported','unresolved'].includes(record?.conclusion), 'conclusion', 'Use fixed, supported, or unresolved');
  if (['fixed','supported'].includes(record?.conclusion)) {
    c.require(hypotheses.has(record.selectedHypothesis) && experiments.some(e => e?.hypothesisId===record.selectedHypothesis && e.result==='supports'), 'selectedHypothesis', 'A supported conclusion needs a supporting experiment');
  }
  if (record?.conclusion === 'fixed') {
    c.require(record.reproduction?.status==='failed' && evidence(record.reproduction?.evidence), 'reproduction', 'A blocked or unrun reproduction cannot establish a fix');
    c.require(record.verification?.checkId===record.reproduction?.checkId && record.verification?.status==='passed' && evidence(record.verification?.evidence) && evidence(record.regressionEvidence), 'verification', 'Repeat the original check and provide passing and regression evidence');
  }
  return {ok:c.errors.length===0, errors:c.errors, evidenceAuthenticity:'not verified; review the referenced artifacts'};
}
export function validateTestDesign(record) {
  const c = checker();
  c.require(record?.schemaVersion===1, 'schemaVersion', 'Expected version 1');
  const requirements = identifiers(record?.requirements, 'requirements', c);
  for (const [id,r] of requirements) c.require(text(r.expect), `requirements.${id}.expect`, 'Provide an independently specified expected behavior');
  const cases = identifiers(record?.cases, 'cases', c), covered=new Set();
  for (const [id,entry] of cases) {
    c.require(list(entry.requirementIds) && entry.requirementIds.length>0 && entry.requirementIds.every(r=>requirements.has(r)), `cases.${id}.requirementIds`, 'Map to declared requirements');
    if (list(entry.requirementIds)) entry.requirementIds.forEach(r=>covered.add(r));
    for (const field of ['arrange','act','assert','oracle','partition']) c.require(text(entry[field]), `cases.${id}.${field}`, `Missing ${field}`);
    c.require(list(entry.forbiddenEffects) && entry.forbiddenEffects.every(text), `cases.${id}.forbiddenEffects`, 'List prohibited state changes; an empty array is explicit');
  }
  for (const id of requirements.keys()) c.require(covered.has(id), `requirements.${id}`, 'No case protects this requirement');
  return {ok:c.errors.length===0, errors:c.errors, casesExecuted:false};
}
export function validateInterface(record) {
  const c = checker();
  c.require(record?.schemaVersion===1, 'schemaVersion', 'Expected version 1');
  c.require(text(record?.journey), 'journey', 'Describe the actual user interaction');
  const env=record?.environment;
  c.require(object(env) && text(env.browser) && Number.isInteger(env.width) && env.width>0 && Number.isInteger(env.height) && env.height>0, 'environment', 'Record a browser and positive integer viewport dimensions');
  const checks=identifiers(record?.checks,'checks',c);
  for (const id of ['primary','keyboard','layout','console']) c.require(checks.has(id), `checks.${id}`, 'Include this check, even when not tested');
  for (const [id,row] of checks) {
    c.require(['passed','failed','not-tested'].includes(row.status), `checks.${id}.status`, 'Use passed, failed, or not-tested');
    c.require(text(row.expected) && text(row.observed), `checks.${id}`, 'Record expected and actual observations or the testing blocker');
    if (row.status!=='not-tested') c.require(evidence(row.evidence), `checks.${id}.evidence`, 'Observed results need evidence references');
  }
  c.require(['complete','partial'].includes(record?.conclusion), 'conclusion', 'Use complete or partial for this scoped review');
  if (record?.conclusion==='complete') c.require(checks.size>0 && [...checks.values()].every(row=>row.status==='passed'), 'conclusion', 'Untested or failed checks cannot produce a complete passing review');
  return {ok:c.errors.length===0, errors:c.errors, evidenceAuthenticity:'not verified; inspect screenshots and interaction traces'};
}
