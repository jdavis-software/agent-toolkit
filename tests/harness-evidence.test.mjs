import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createCheckpoint, verifyCheckpoint } from '../tools/lib/harness/checkpoint.mjs';
import { reportCanary } from '../tools/lib/harness/canary.mjs';
import { canaryFixture } from '../examples/harnesskit/canary-fixture.mjs';
const now = Date.parse('2026-01-01T00:00:00Z'), sha = 'a'.repeat(64);
const binding = () => ({ taskId: 'example/repo#1', contractSha256: sha, environmentSha256: sha });
const request = () => ({ schemaVersion: 1, binding: binding(), maxAgeSeconds: 60, files: [{ id: 'contract', path: 'contract.txt' }, { id: 'notes', path: 'ignored/notes.txt' }] });
const cli = fileURLToPath(new URL('../tools/harnesskit.mjs', import.meta.url));
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), 'context-evidence-')); t.after(() => rmSync(dir, { recursive: true, force: true }));
  const git = args => execFileSync('git', ['-C', dir, ...args], { stdio: 'ignore' });
  git(['init', '-q']); git(['config', 'core.hooksPath', '/dev/null']);
  writeFileSync(join(dir, '.gitignore'), 'ignored/\n'); writeFileSync(join(dir, 'contract.txt'), 'accepted contract\n');
  git(['add', '.']); git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture']);
  mkdirSync(join(dir, 'ignored')); writeFileSync(join(dir, 'ignored/notes.txt'), 'private finding body');
  return dir;
}
test('checkpoint observes actual selected bytes, retains no bodies, and revalidates', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now);
  assert.equal(verifyCheckpoint(c, binding(), root, now + 1000).ok, true);
  assert.equal(JSON.stringify(c).includes('private finding body'), false);
  assert.equal(JSON.stringify(c).includes(root), false);
  assert.equal(c.files.length, 2);
});
test('explicit ignored evidence changes invalidate checkpoint without a Git diff', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now);
  writeFileSync(join(root, 'ignored/notes.txt'), 'changed notes');
  const r = verifyCheckpoint(c, binding(), root, now);
  assert.equal(r.ok, false); assert.equal(r.checks.find(x => x.id === 'workspace').status, 'matched');
  assert.equal(r.checks.find(x => x.id === 'notes').status, 'changed');
});
test('tracked and nonignored untracked changes invalidate source identity', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now);
  writeFileSync(join(root, 'new.txt'), 'new evidence');
  assert.equal(verifyCheckpoint(c, binding(), root, now).ok, false);
});
test('missing file is retained as unavailable, not silently omitted', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now); rmSync(join(root, 'ignored/notes.txt'));
  const r = verifyCheckpoint(c, binding(), root, now); assert.equal(r.ok, false);
  assert.equal(r.checks.find(x => x.id === 'notes').status, 'unavailable');
});
for (const field of ['taskId', 'contractSha256', 'environmentSha256']) test(`changed ${field} rejects reuse`, t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now), b = binding();
  b[field] = field === 'taskId' ? 'other/repo#1' : 'c'.repeat(64);
  assert.equal(verifyCheckpoint(c, b, root, now).ok, false);
});
test('old and implausibly future checkpoints remain stale', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now);
  assert.equal(verifyCheckpoint(c, binding(), root, now + 61000).ok, false);
  assert.equal(verifyCheckpoint(c, binding(), root, now - 6000).ok, false);
});
test('same files in a different root cannot satisfy original workspace identity', t => {
  const a = fixture(t), b = fixture(t), c = createCheckpoint(request(), a, now);
  assert.equal(verifyCheckpoint(c, binding(), b, now).ok, false);
});
test('rewritten checkpoint without matching integrity hash fails', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now); c.files[0].sha256 = 'b'.repeat(64);
  assert.throws(() => verifyCheckpoint(c, binding(), root, now), /integrity/);
});
for (const path of ['../outside', '/tmp/outside', 'ignored/../contract.txt', 'C:\\secret', '.git/config', 'a//b', 'a\0b']) test(`unsafe path rejected: ${JSON.stringify(path)}`, t => {
  const root = fixture(t), r = request(); r.files[0].path = path;
  assert.throws(() => createCheckpoint(r, root, now), /reference/);
});
test('symlink evidence is rejected at capture and marked unavailable at verification', t => {
  const root = fixture(t), c = createCheckpoint(request(), root, now); rmSync(join(root, 'ignored/notes.txt'));
  symlinkSync('../contract.txt', join(root, 'ignored/notes.txt'));
  assert.throws(() => createCheckpoint(request(), root, now), /symlink/);
  assert.equal(verifyCheckpoint(c, binding(), root, now).ok, false);
});
test('a symlink directory cannot import external evidence', t => {
  const root = fixture(t); symlinkSync(tmpdir(), join(root, 'escape')); const r = request(); r.files[0].path = 'escape/a';
  assert.throws(() => createCheckpoint(r, root, now), /symlink/);
});
test('oversized selected evidence fails before it can become a checkpoint', t => {
  const root = fixture(t); writeFileSync(join(root, 'ignored/notes.txt'), Buffer.alloc(2 * 1024 * 1024 + 1));
  assert.throws(() => createCheckpoint(request(), root, now), /file/);
});
test('duplicate ids, paths, empty selection and extra binding fields fail', t => {
  const root = fixture(t);
  for (const change of [r => r.files.push(r.files[0]), r => { r.files = []; }, r => { r.binding.authority = 'admin'; }]) {
    const r = request(); change(r); assert.throws(() => createCheckpoint(r, root, now));
  }
});
test('checkpoint CLI creates reusable evidence outside the measured root and exits 3 on drift', t => {
  const root = fixture(t), out = mkdtempSync(join(tmpdir(), 'checkpoint-output-')); t.after(() => rmSync(out, { recursive: true, force: true }));
  const r = join(out, 'request.json'), b = join(out, 'binding.json'), c = join(out, 'checkpoint.json');
  writeFileSync(r, JSON.stringify(request())); writeFileSync(b, JSON.stringify(binding()));
  const created = spawnSync(process.execPath, [cli, 'checkpoint', r, '--root', root], { encoding: 'utf8' });
  assert.equal(created.status, 0, created.stderr); writeFileSync(c, created.stdout);
  assert.equal(spawnSync(process.execPath, [cli, 'revalidate', c, b, '--root', root]).status, 0);
  writeFileSync(join(root, 'ignored/notes.txt'), 'new');
  const stale = spawnSync(process.execPath, [cli, 'revalidate', c, b, '--root', root], { encoding: 'utf8' });
  assert.equal(stale.status, 3); assert.equal(JSON.parse(stale.stdout).ok, false);
});

test('canary hand calculations use batch wall time and include support roles', () => {
  const r = reportCanary(canaryFixture()); assert.equal(r.ok, true); assert.equal(r.adoption, 'not-evaluated');
  assert.equal(r.metrics.wallSeconds, 20); assert.equal(r.metrics.acceptedTasksPerHour, 360);
  assert.deepEqual(r.tasks.map(t => t.assignedToAcceptedSeconds), [12, 20]);
  assert.deepEqual(r.metrics.agentSecondsByRole, { implementation: 13, reviewer: 7, integration: 12 });
  assert.equal(r.metrics.totalTokens, 40); assert.equal(r.metrics.tokensPerAcceptedTask, 20);
});
test('record replay is deterministic and does not publish or mutate acceptance', () => {
  const r = canaryFixture(), original = JSON.stringify(r);
  assert.deepEqual(reportCanary(r), reportCanary(r)); assert.equal(JSON.stringify(r), original);
});
test('retry does not restart assigned-to-accepted time and remains in usage', () => {
  const f = canaryFixture(), failed = { ...structuredClone(f.attempts[0]), id: 'a-failed', endedSeconds: 2, outcome: 'failed', tokens: { inputTokens: 3, outputTokens: 0 } };
  f.attempts[0].startedSeconds = 2; f.attempts.push(failed); const r = reportCanary(f);
  assert.equal(r.metrics.implementationRetries, 1); assert.equal(r.metrics.totalTokens, 43); assert.equal(r.tasks[0].assignedToAcceptedSeconds, 12);
});
test('unfinished work has null completion latency and remains in denominator', () => {
  const f = canaryFixture(); Object.assign(f.tasks[1], { status: 'unfinished', terminalSeconds: null, candidateRevision: null, validationEvidenceSha256: null, integrationEvidenceSha256: null });
  const r = reportCanary(f); assert.equal(r.ok, false); assert.equal(r.counts.assigned, 2); assert.equal(r.counts.unfinished, 1);
  assert.equal(r.tasks[1].assignedToAcceptedSeconds, null); assert.equal(r.metrics.acceptedTasksPerHour, 180);
});
test('zero accepted tasks give zero throughput and undefined per-acceptance usage', () => {
  const f = canaryFixture(); for (const task of f.tasks) Object.assign(task, { status: 'unfinished', terminalSeconds: null, candidateRevision: null, validationEvidenceSha256: null, integrationEvidenceSha256: null });
  const r = reportCanary(f); assert.equal(r.metrics.acceptedTasksPerHour, 0); assert.equal(r.metrics.tokensPerAcceptedTask, null);
});
test('dropping a hard task cannot satisfy the declared workload', () => {
  const f = canaryFixture(); f.tasks.pop(); f.attempts = f.attempts.filter(a => a.taskId !== 'b');
  assert.throws(() => reportCanary(f), /coverage/);
});
test('missing usage is not zero and prevents a bounded token claim', () => {
  const f = canaryFixture(); f.attempts[0].tokens = null; const r = reportCanary(f);
  assert.equal(r.metrics.totalTokens, null); assert.equal(r.metrics.observedTokenSubtotal, 30);
  assert.equal(r.metrics.tokensPerAcceptedTask, null); assert.ok(r.issues.includes('token-budget-unverifiable'));
});
test('unknown usage without a token gate leaves resource claims unknown', () => {
  const f = canaryFixture(); f.attempts[0].tokens = null; f.protocol.maxTokens = null;
  const r = reportCanary(f); assert.equal(r.ok, true); assert.equal(r.metrics.totalTokens, null);
});
test('partial attempt inventory prevents apparent completeness', () => {
  const f = canaryFixture(); f.attemptInventoryComplete = false; const r = reportCanary(f);
  assert.equal(r.ok, false); assert.equal(r.metrics.totalTokens, null); assert.equal(r.metrics.activeTimeCoverage, 'lower-bound');
});
for (const field of ['validationEvidenceSha256', 'integrationEvidenceSha256', 'candidateRevision']) test(`acceptance requires ${field}`, () => {
  const f = canaryFixture(); f.tasks[0][field] = null; assert.throws(() => reportCanary(f), /acceptance/);
});
for (const status of ['failed', 'blocked', 'not-run']) test(`required ${status} gate prevents review-ready report`, () => {
  const f = canaryFixture(); f.gates[0].status = status; assert.equal(reportCanary(f).ok, false);
});
test('omitted required gates remain explicitly missing', () => {
  const f = canaryFixture(); f.gates.pop(); const r = reportCanary(f);
  assert.equal(r.ok, false); assert.equal(r.gates[1].status, 'missing');
});
test('passed gate without evidence cannot be accepted', () => {
  const f = canaryFixture(); f.gates[0].evidenceSha256 = null; assert.throws(() => reportCanary(f));
});
test('actual observed peak rather than declared cap identifies oversubscription', () => {
  const f = canaryFixture(); f.protocol.implementationCap = 1; const r = reportCanary(f);
  assert.equal(r.metrics.observedPeakImplementation, 2); assert.ok(r.issues.includes('implementation-cap-exceeded'));
});
test('adjacent half-open intervals are not simultaneous workers', () => {
  const f = canaryFixture(); f.attempts[1].startedSeconds = 5; f.protocol.implementationCap = 1;
  assert.equal(reportCanary(f).metrics.observedPeakImplementation, 1);
});
test('overlapping attempts for one task are not ordinary retry evidence', () => {
  const f = canaryFixture(); f.attempts.push({ ...f.attempts[0], id: 'a-overlap' });
  assert.ok(reportCanary(f).issues.includes('overlapping-task-attempts'));
});
test('wall and token overruns remain visible', () => {
  const f = canaryFixture(); f.protocol.maxSeconds = 10; f.protocol.maxTokens = 20;
  const r = reportCanary(f); assert.ok(r.issues.includes('wall-budget-exceeded')); assert.ok(r.issues.includes('token-budget-exceeded'));
});
test('running attempts stay active at cutoff; they are not successful completions', () => {
  const f = canaryFixture(); Object.assign(f.tasks[1], { status: 'unfinished', terminalSeconds: null, candidateRevision: null, validationEvidenceSha256: null, integrationEvidenceSha256: null });
  Object.assign(f.attempts[1], { endedSeconds: null, outcome: 'running' });
  const r = reportCanary(f); assert.equal(r.ok, false); assert.equal(r.metrics.activeAttempts, 1); assert.equal(r.metrics.totalTokens, null);
});
test('duplicate normalized attempt or task identities fail rather than deduping guesses', () => {
  const f = canaryFixture(); f.attempts.push(f.attempts[0]); assert.throws(() => reportCanary(f), /duplicate/);
});
test('parent cycles and missing parents are invalid', () => {
  const f = canaryFixture(); f.attempts[0].parentId = f.attempts[1].id; f.attempts[1].parentId = f.attempts[0].id;
  assert.throws(() => reportCanary(f), /cycle/); f.attempts[0].parentId = 'absent'; assert.throws(() => reportCanary(f), /parent/);
});
test('negative times, future terminal, and cross-task timing cannot yield metrics', () => {
  for (const change of [f => { f.durationSeconds = 0; }, f => { f.tasks[0].terminalSeconds = 30; }, f => { f.attempts[0].startedSeconds = -1; }, f => { f.tasks[0].assignedSeconds = 4; }]) {
    const f = canaryFixture(); change(f); assert.throws(() => reportCanary(f));
  }
});
test('unsafe aggregate token counts are rejected', () => {
  const f = canaryFixture(); f.attempts[0].tokens = { inputTokens: Number.MAX_SAFE_INTEGER, outputTokens: 1 }; assert.throws(() => reportCanary(f), /overflow/);
});
test('extra fields cannot introduce hidden authorization or unsupported measurements', () => {
  const f = canaryFixture(); f.approved = true; assert.throws(() => reportCanary(f), /shape/);
});
test('canary CLI preserves incomplete report with exit 3 and input failures with exit 2', t => {
  const dir = mkdtempSync(join(tmpdir(), 'canary-cli-')); t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, 'run.json'), f = canaryFixture(); writeFileSync(path, JSON.stringify(f));
  assert.equal(spawnSync(process.execPath, [cli, 'canary', path]).status, 0);
  f.gates = []; writeFileSync(path, JSON.stringify(f)); const result = spawnSync(process.execPath, [cli, 'canary', path], { encoding: 'utf8' });
  assert.equal(result.status, 3); assert.equal(JSON.parse(result.stdout).ok, false);
  assert.equal(spawnSync(process.execPath, [cli, 'canary', path, '--root', dir]).status, 2);
});


test('nested implementation workers count toward implementation concurrency',()=>{
 const f=canaryFixture();f.attempts.push({...f.attempts[0],id:'nested-implementation',taskId:'b',parentId:'a-1'});
 const r=reportCanary(f);assert.equal(r.metrics.nestedAttempts,1);assert.equal(r.metrics.observedPeakImplementation,3);assert.equal(r.ok,false);
});
test('nested is not a role that hides the worker function from accounting',()=>{
 const f=canaryFixture();f.attempts[0].role='nested';assert.throws(()=>reportCanary(f));
});
test('sub-millisecond run duration is rejected rather than overflowing throughput',()=>{
 const f=canaryFixture();f.durationSeconds=Number.MIN_VALUE;assert.throws(()=>reportCanary(f));
});
test('checkpoint total evidence bound is independent of per-file limit',t=>{
 const root=fixture(t),r=request();r.files=[];
 for(let i=0;i<5;i++){const path='ignored/file-'+i;writeFileSync(join(root,path),Buffer.alloc(2*1024*1024));r.files.push({id:'file-'+i,path});}
 assert.throws(()=>createCheckpoint(r,root,now),/oversized-evidence/);
});
test('checkpoint selection count is bounded',t=>{
 const root=fixture(t),r=request();r.files=Array.from({length:33},(_,i)=>({id:'file-'+i,path:'ignored/file-'+i}));
 assert.throws(()=>createCheckpoint(r,root,now),/file-list/);
});
