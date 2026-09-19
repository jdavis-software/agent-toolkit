import { check, doc, id, digest, revision, object, canonical, hash, limits } from './common.mjs';

function keys(value, required) {
  check(object(value) && Object.keys(value).length === required.length && required.every(k => Object.hasOwn(value, k)), 'invalid-canary-shape');
}
function list(value, max, allowEmpty = false) { check(Array.isArray(value) && value.length <= max && (allowEmpty || value.length > 0), 'invalid-canary-list'); }
function unique(items, field) { const seen = new Set(); for (const item of items) { check(id(item[field]) && !seen.has(item[field]), 'duplicate-or-invalid-identity'); seen.add(item[field]); } }
function seconds(value, max) { check(Number.isFinite(value) && value >= 0 && value <= max, 'invalid-duration'); }
function safeSum(values) { const total = values.reduce((a, b) => a + b, 0); check(Number.isSafeInteger(total), 'counter-overflow'); return total; }
const roles = new Set(['implementation', 'coordinator', 'reviewer', 'integration']);

/** Pure report over supplied records. Does not query a runtime or authenticate acceptance. */
export function reportCanary(run) {
  keys(run, ['schemaVersion', 'runId', 'evidenceKind', 'clockId', 'durationSeconds', 'protocol', 'attemptInventoryComplete', 'tasks', 'attempts', 'gates']); doc(run);
  check(id(run.runId) && id(run.clockId) && ['synthetic', 'observed'].includes(run.evidenceKind), 'invalid-run-identity');
  seconds(run.durationSeconds, 604800); check(run.durationSeconds >= 0.001 && typeof run.attemptInventoryComplete === 'boolean', 'invalid-run');
  const p = run.protocol;
  keys(p, ['workloadSha256', 'acceptanceSha256', 'sourceRevision', 'environmentSha256', 'contextSha256', 'cacheCondition', 'taskIds', 'requiredGates', 'maxSeconds', 'maxTokens', 'implementationCap']);
  check([p.workloadSha256, p.acceptanceSha256, p.environmentSha256, p.contextSha256].every(digest) && revision(p.sourceRevision), 'invalid-protocol-identity');
  check(['cold', 'warm', 'unknown'].includes(p.cacheCondition), 'invalid-cache-condition');
  seconds(p.maxSeconds, 604800); check(p.maxSeconds > 0, 'invalid-time-limit');
  check(p.maxTokens === null || Number.isSafeInteger(p.maxTokens) && p.maxTokens > 0, 'invalid-token-limit');
  check(Number.isSafeInteger(p.implementationCap) && p.implementationCap >= 1 && p.implementationCap <= 100, 'invalid-worker-limit');
  list(p.taskIds, 200); check(p.taskIds.every(id) && new Set(p.taskIds).size === p.taskIds.length, 'invalid-workload');
  list(p.requiredGates, 32); check(p.requiredGates.every(id) && new Set(p.requiredGates).size === p.requiredGates.length, 'invalid-gates');
  list(run.tasks, 200); list(run.attempts, 2000, true); list(run.gates, 32, true);
  unique(run.tasks, 'id'); unique(run.attempts, 'id'); unique(run.gates, 'id');
  check(run.tasks.length === p.taskIds.length && run.tasks.every(t => p.taskIds.includes(t.id)), 'workload-coverage-mismatch');
  const tasks = new Map(run.tasks.map(t => [t.id, t])), attempts = new Map(run.attempts.map(a => [a.id, a]));
  const counts = { assigned: run.tasks.length, accepted: 0, failed: 0, cancelled: 0, unfinished: 0 };
  const taskReports = [];
  for (const task of run.tasks) {
    keys(task, ['id', 'assignedSeconds', 'status', 'terminalSeconds', 'candidateRevision', 'validationEvidenceSha256', 'integrationEvidenceSha256']);
    seconds(task.assignedSeconds, run.durationSeconds);
    check(['accepted', 'failed', 'cancelled', 'unfinished'].includes(task.status), 'invalid-task-status');
    if (task.status === 'unfinished') check(task.terminalSeconds === null, 'unfinished-has-terminal');
    else { seconds(task.terminalSeconds, run.durationSeconds); check(task.terminalSeconds !== null && task.terminalSeconds >= task.assignedSeconds, 'invalid-task-order'); }
    if (task.status === 'accepted') check(revision(task.candidateRevision) && digest(task.validationEvidenceSha256) && digest(task.integrationEvidenceSha256), 'acceptance-needs-evidence');
    else check(task.candidateRevision === null && task.validationEvidenceSha256 === null && task.integrationEvidenceSha256 === null, 'unaccepted-has-acceptance');
    counts[task.status]++;
    taskReports.push({ id: task.id, status: task.status,
      assignedToAcceptedSeconds: task.status === 'accepted' ? task.terminalSeconds - task.assignedSeconds : null,
      elapsedToCutoffSeconds: run.durationSeconds - task.assignedSeconds });
  }
  const agentSecondsByRole = {}, tokens = [], intervals = [], implementationAttempts = new Map();
  let missingUsage = 0, active = 0;
  for (const attempt of run.attempts) {
    keys(attempt, ['id', 'taskId', 'role', 'parentId', 'startedSeconds', 'endedSeconds', 'outcome', 'tokens']);
    check(roles.has(attempt.role) && (attempt.taskId === null || tasks.has(attempt.taskId)), 'invalid-attempt-binding');
    check(attempt.parentId === null || attempts.has(attempt.parentId) && attempt.parentId !== attempt.id, 'invalid-parent');
    check(['completed', 'failed', 'cancelled', 'running', 'indeterminate'].includes(attempt.outcome), 'invalid-attempt-outcome');
    seconds(attempt.startedSeconds, run.durationSeconds);
    const open = ['running', 'indeterminate'].includes(attempt.outcome);
    check(open === (attempt.endedSeconds === null), 'invalid-attempt-terminal');
    const end = open ? run.durationSeconds : attempt.endedSeconds;
    seconds(end, run.durationSeconds); check(end >= attempt.startedSeconds, 'invalid-attempt-order');
    if (attempt.taskId !== null) {
      const task = tasks.get(attempt.taskId);
      check(attempt.startedSeconds >= task.assignedSeconds && (task.terminalSeconds === null || !open && end <= task.terminalSeconds), 'attempt-outside-task');
    }
    if (attempt.role === 'implementation') {
      check(attempt.taskId !== null, 'implementation-needs-task');
      implementationAttempts.set(attempt.taskId, (implementationAttempts.get(attempt.taskId) ?? 0) + 1);
      if (end > attempt.startedSeconds) intervals.push([attempt.startedSeconds, 1], [end, -1]);
    }
    if (open) active++;
    agentSecondsByRole[attempt.role] = (agentSecondsByRole[attempt.role] ?? 0) + end - attempt.startedSeconds;
    if (attempt.tokens === null) missingUsage++;
    else {
      keys(attempt.tokens, ['inputTokens', 'outputTokens']);
      check(Object.values(attempt.tokens).every(n => Number.isSafeInteger(n) && n >= 0), 'invalid-usage');
      tokens.push(safeSum(Object.values(attempt.tokens)));
    }
  }
  for (const attempt of run.attempts) {
    let parent = attempt.parentId; const visited = new Set([attempt.id]);
    while (parent !== null) { check(!visited.has(parent), 'parent-cycle'); visited.add(parent); parent = attempts.get(parent).parentId; }
  }
  for (const task of run.tasks) if (task.status === 'accepted') check(run.attempts.some(a => a.taskId === task.id && a.role === 'implementation' && a.outcome === 'completed'), 'acceptance-without-completed-attempt');
  let concurrent = 0, peak = 0;
  for (const [, delta] of intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1])) { concurrent += delta; peak = Math.max(peak, concurrent); }
  const gateMap = new Map();
  for (const gate of run.gates) {
    keys(gate, ['id', 'status', 'evidenceSha256']);
    check(p.requiredGates.includes(gate.id) && ['passed', 'failed', 'blocked', 'not-run'].includes(gate.status), 'invalid-gate');
    check(gate.evidenceSha256 === null || digest(gate.evidenceSha256), 'invalid-gate-evidence');
    check(gate.status !== 'passed' || digest(gate.evidenceSha256), 'passing-gate-without-evidence');
    gateMap.set(gate.id, gate);
  }
  const subtotal = safeSum(tokens), usageComplete = run.attemptInventoryComplete && missingUsage === 0 && active === 0 && run.attempts.length > 0;
  const issues = [];
  if (counts.accepted !== counts.assigned) issues.push('not-all-tasks-accepted');
  if (!run.attemptInventoryComplete) issues.push('attempt-inventory-incomplete');
  if (active) issues.push('active-or-indeterminate-attempts');
  if (run.durationSeconds > p.maxSeconds) issues.push('wall-budget-exceeded');
  if (peak > p.implementationCap) issues.push('implementation-cap-exceeded');
  if (p.maxTokens !== null && !usageComplete) issues.push('token-budget-unverifiable');
  if (p.maxTokens !== null && subtotal > p.maxTokens) issues.push('token-budget-exceeded');
  for (const taskId of p.taskIds) {
    const spans = run.attempts.filter(a => a.taskId === taskId && a.role === 'implementation').sort((a, b) => a.startedSeconds - b.startedSeconds);
    if (spans.some((a, i) => i > 0 && a.startedSeconds < (spans[i - 1].endedSeconds ?? run.durationSeconds))) issues.push('overlapping-task-attempts');
  }
  const gates = p.requiredGates.map(gateId => ({ id: gateId, status: gateMap.get(gateId)?.status ?? 'missing' }));
  if (gates.some(g => g.status !== 'passed')) issues.push('required-gates-incomplete');
  return { schemaVersion: 1, kind: 'canary-report', ok: issues.length === 0, adoption: 'not-evaluated', evidenceKind: run.evidenceKind,
    runId: run.runId, protocolSha256: hash(canonical(p)), recordSha256: hash(canonical(run)), counts, tasks: taskReports,
    metrics: { wallSeconds: run.durationSeconds, acceptedTasksPerHour: counts.accepted * 3600 / run.durationSeconds,
      implementationRetries: [...implementationAttempts.values()].reduce((n, count) => n + Math.max(0, count - 1), 0),
      observedPeakImplementation: peak, agentSecondsByRole, activeTimeCoverage: active || !run.attemptInventoryComplete ? 'lower-bound' : 'complete',
      observedTokenSubtotal: subtotal, totalTokens: usageComplete ? subtotal : null,
      tokensPerAcceptedTask: usageComplete && counts.accepted > 0 ? subtotal / counts.accepted : null,
      missingUsageAttempts: missingUsage, activeAttempts: active, nestedAttempts: run.attempts.filter(a => a.parentId !== null).length }, gates, issues,
    limits: [...limits, 'All lifecycle, inventory, elapsed-clock, protocol and acceptance records are caller supplied; checks do not authenticate them or run a canary.',
      'Keep all attempts and all roles. Do not submit cumulative usage as per-attempt totals. Nested records must represent disjoint usage, not a parent aggregate repeated as child usage.',
      'Agent durations overlap and can exceed wall time. Unfinished tasks have no fabricated completion duration. A valid synthetic report is not a live evaluation, speedup claim, or adoption decision.'] };
}
