// Synthetic records with intentionally small values that can be checked by hand.
export function canaryFixture() {
  const sha = 'a'.repeat(64), rev = 'b'.repeat(40);
  const accepted = (id, terminalSeconds) => ({ id, assignedSeconds: 0, status: 'accepted', terminalSeconds,
    candidateRevision: rev, validationEvidenceSha256: sha, integrationEvidenceSha256: sha });
  const attempt = (id, taskId, role, startedSeconds, endedSeconds, n) => ({ id, taskId, role, parentId: null,
    startedSeconds, endedSeconds, outcome: 'completed', tokens: { inputTokens: n, outputTokens: 0 } });
  return { schemaVersion: 1, runId: 'synthetic-canary', evidenceKind: 'synthetic', clockId: 'fixture-coordinator-1', durationSeconds: 20,
    protocol: { workloadSha256: sha, acceptanceSha256: sha, sourceRevision: rev, environmentSha256: sha,
      contextSha256: sha, cacheCondition: 'cold', taskIds: ['a', 'b'], requiredGates: ['profile', 'integration'], maxSeconds: 30, maxTokens: 100, implementationCap: 2 },
    attemptInventoryComplete: true, tasks: [accepted('a', 12), accepted('b', 20)],
    attempts: [attempt('a-1', 'a', 'implementation', 0, 5, 10), attempt('b-1', 'b', 'implementation', 0, 8, 20),
      attempt('review-1', 'a', 'reviewer', 5, 12, 5), attempt('integrate-1', 'b', 'integration', 8, 20, 5)],
    gates: [{ id: 'profile', status: 'passed', evidenceSha256: sha }, { id: 'integration', status: 'passed', evidenceSha256: sha }] };
}
