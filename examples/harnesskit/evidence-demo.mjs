import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createCheckpoint, verifyCheckpoint } from '../../tools/lib/harness/checkpoint.mjs';
import { reportCanary } from '../../tools/lib/harness/canary.mjs';
import { canaryFixture } from './canary-fixture.mjs';
const root = mkdtempSync(join(tmpdir(), 'harness-evidence-demo-'));
try {
  const git = args => execFileSync('git', ['-C', root, ...args], { stdio: 'ignore' });
  git(['init', '-q']); git(['config', 'core.hooksPath', '/dev/null']);
  writeFileSync(join(root, '.gitignore'), 'ignored/\n'); writeFileSync(join(root, 'contract.txt'), 'synthetic contract');
  git(['add', '.']); git(['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture']);
  mkdirSync(join(root, 'ignored')); writeFileSync(join(root, 'ignored/findings.txt'), 'Rejected approach; retry only if contract changes.');
  const binding = { taskId: 'example/repo#1', contractSha256: 'a'.repeat(64), environmentSha256: 'b'.repeat(64) };
  const checkpoint = createCheckpoint({ schemaVersion: 1, binding, maxAgeSeconds: 60, files: [{ id: 'contract', path: 'contract.txt' }, { id: 'findings', path: 'ignored/findings.txt' }] }, root);
  assert.equal(verifyCheckpoint(checkpoint, binding, root).ok, true);
  writeFileSync(join(root, 'ignored/findings.txt'), 'New evidence requires review.');
  const changed = verifyCheckpoint(checkpoint, binding, root);
  assert.equal(changed.ok, false); assert.equal(changed.checks.find(c => c.id === 'workspace').status, 'matched');
  assert.equal(changed.checks.find(c => c.id === 'findings').status, 'changed');
  const complete = reportCanary(canaryFixture()); assert.equal(complete.ok, true); assert.equal(complete.metrics.totalTokens, 40);
  const incomplete = canaryFixture(); Object.assign(incomplete.tasks[1], { status: 'unfinished', terminalSeconds: null, candidateRevision: null, validationEvidenceSha256: null, integrationEvidenceSha256: null });
  const partial = reportCanary(incomplete); assert.equal(partial.ok, false); assert.equal(partial.tasks[1].assignedToAcceptedSeconds, null);
  const omitted = canaryFixture(); omitted.tasks.pop(); assert.throws(() => reportCanary(omitted), /coverage/);
  const unknown = canaryFixture(); unknown.attempts[0].tokens = null; const missing = reportCanary(unknown);
  assert.equal(missing.metrics.totalTokens, null); assert.equal(missing.ok, false);
  console.log(JSON.stringify({ scope: 'synthetic canary and actual disposable Git only', ignoredEvidenceDriftDetected: true,
    partialWorkPreserved: true, omittedWorkRejected: true, missingUsagePreserved: true, complete, partial }, null, 2));
} finally { rmSync(root, { recursive: true, force: true }); }
