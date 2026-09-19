# Context checkpoints and bounded canary evidence

These are optional additions to Harnesskit, not a memory service, scheduler, worker launcher, or benchmark platform. All examples are synthetic. Commands use Node built-ins; checkpoint operations also reuse the existing Git observation. No account credentials, model calls, browser sessions, tracker writes, or private project configuration are involved.

## Commands

```bash
node tools/harnesskit.mjs checkpoint REQUEST.json --root REPOSITORY
node tools/harnesskit.mjs revalidate CHECKPOINT.json BINDING.json --root REPOSITORY
node tools/harnesskit.mjs canary examples/harnesskit/canary.json
node examples/harnesskit/evidence-demo.mjs
node --test tests/harness-evidence.test.mjs
```

Commands write JSON to stdout. Save it outside the measured repository. Exit 0 is success for the scoped operation; exit 3 preserves a mismatch/incomplete report; exit 2 is invalid input or a probe error. Capture success is not permission to resume work. A canary report's `ok` is not an adoption decision.

## Checkpoint capture

The request has exactly `schemaVersion:1`, `binding`, `maxAgeSeconds` (1–86400), and `files` (1–32 unique entries). The binding has `taskId`, `contractSha256`, and `environmentSha256`. Hashes are 64 lowercase hexadecimal characters. Each file entry has a stable `id` and a literal repository-relative `path`; directories, traversal, `.git`, absolute paths, symlinks, and globs are not supported.

Example request, with placeholder hashes that must be replaced by the accepted private adapter:

```json
{
  "schemaVersion": 1,
  "binding": {
    "taskId": "example/repository#17",
    "contractSha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "environmentSha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  },
  "maxAgeSeconds": 3600,
  "files": [
    {"id": "api-contract", "path": "contracts/api.json"},
    {"id": "task-findings", "path": "private-ignored/task-findings.md"}
  ]
}
```

Store actual findings, failed approaches, remaining questions, and their recheck conditions in approved files. The checkpoint records file identities and hashes, not their bodies; it does not generate or endorse those findings. It includes the actual Git-visible fingerprint and root identity, the caller's task/contract/environment binding, creation time, and explicitly selected file bytes. Each file is limited to 2 MiB; selected evidence totals at most 8 MiB.

Capture samples source and file identities twice and rejects observed mutation. Verification checks packet integrity, age, current binding, current Git-visible state, and every selected file. Missing or inaccessible evidence stays visible as `unavailable`; changes become `changed`. A private adapter supplies the current binding rather than blindly reusing the old values. `BINDING.json` is the three-field binding object, without the request's other fields.

An ignored file is covered only when selected explicitly. Untracked nonignored files are included through Git observation. Unsaved editor buffers, unselected ignored files, remote sources, permissions, account state, and live processes are not observed. The repository must be the actual owned Git worktree root. This conservative mode invalidates on unrelated Git-visible changes too; it does not claim to infer minimal semantic dependencies.

A matching hash proves byte consistency, not truth or authority. Someone who controls the packet can rewrite it and recompute its hash. Two reads are not an atomic snapshot or a defense against a hostile writer, and arbitrary ABA changes can evade detection. Use a quiescent owned worktree; keep accepted protocol and authority outside agent-editable evidence. A root hash is not secrecy for a guessable path. Relative filenames can also be sensitive: private manifests do not belong in public Git.

## Canary report contract

`examples/harnesskit/canary.json` is a complete runnable example. The report accepts one normalized record, not an unbounded event log. Existing event reconciliation can supply reviewed per-attempt usage; do not pass thread-wide cumulative totals as separate attempt costs.

Top-level fields are `schemaVersion:1`, `runId`, `evidenceKind` (`synthetic` or `observed`), `clockId`, `durationSeconds`, `protocol`, `attemptInventoryComplete`, `tasks`, `attempts`, and `gates`. Unknown fields fail validation. `evidenceKind` and completeness are caller declarations, not authenticated facts.

The protocol freezes workload/acceptance/environment/context hashes, `sourceRevision`, `cacheCondition`, all `taskIds`, `requiredGates`, `maxSeconds`, nullable `maxTokens`, and `implementationCap`. It is hashed in the output for comparison with the separately accepted protocol. Missing task rows or extra tasks fail; stopping early requires explicit unfinished rows. Do not change the protocol to excuse missing work. This tool cannot prove the supplied protocol was actually frozen before the run.

All `...Seconds` values are finite, nonnegative elapsed seconds from one coordinator clock origin, not independent wall clocks or clocks reset on retry. The run cutoff is at least one millisecond and at most seven days. An adapter spanning a restart must reconcile elapsed time into one defensible basis or decline to report; the tool does not synchronize clocks.

| Record | Required fields and semantics |
| --- | --- |
| Task | `id`, `assignedSeconds`, `status`, `terminalSeconds`, `candidateRevision`, `validationEvidenceSha256`, `integrationEvidenceSha256`. Status is accepted/failed/cancelled/unfinished. Unfinished has null terminal time. Accepted requires all three independent acceptance references plus a completed implementation attempt. Nonaccepted records have null acceptance fields. |
| Attempt | Unique `id`, nullable `taskId`, `role`, nullable `parentId`, `startedSeconds`, nullable `endedSeconds`, `outcome`, and nullable `tokens`. Roles are implementation/coordinator/reviewer/integration. Nested attempts keep their functional role and name their parent, so a nested implementation worker still counts toward the implementation cap. Unknown parents and cycles fail. Outcome is completed/failed/cancelled/running/indeterminate. Running/indeterminate has no terminal time. Tokens contain disjoint per-attempt input/output totals. |
| Gate | `id`, passed/failed/blocked/not-run `status`, nullable `evidenceSha256`. Passed requires an evidence reference. Missing required gates remain missing; extra undeclared gates and duplicate IDs fail. |

At most 200 tasks, 2,000 attempts, and 32 gates are supported, within the existing 2 MiB JSON input limit. Duplicate normalized identities are rejected rather than guessed to be retries. Deduplicate raw event IDs in the qualified event importer first. Parent and child usage must be disjoint; the reporter cannot discover duplicated provider totals under different attempt IDs.

## Calculations and interpretation

Assigned-to-accepted latency includes dependency waits, retries, review, and integration. Failed/cancelled/unfinished tasks have null accepted latency, not their cutoff substituted as a completion. Throughput uses accepted count times 3600 divided by full run wall seconds. Every assigned task remains in counts. Zero accepted tasks means zero throughput and undefined per-acceptance usage.

Agent seconds are summed by role; overlapping intervals can exceed wall time and are not additional wall-clock duration. Open attempts contribute elapsed lower bounds through the cutoff and remain unresolved. Implementation retries count extra implementation attempts per task; support roles are not retries. Overlapping implementation attempts for one task are flagged, not silently treated as ordinary retries. Half-open intervals let a worker finish exactly when another starts without false overlap.

Token totals remain null if attempt inventory or usage is incomplete or work remains active. A known observed subtotal is reported separately. Unknown usage prevents satisfying a token cap; without a requested token gate, lifecycle/quality reporting can succeed with explicitly unknown usage. The code checks integer overflow. No currency costs, subscription equivalents, percentiles, speedup, or model-quality rankings are invented.

`ok` requires all declared tasks accepted, required gates passed, complete attempt inventory, no unresolved attempts, and observed limits respected. All source, acceptance, gate and inventory observations remain caller supplied. Required signatures, actual check execution, tracker reconciliation, effect authority, process control and adoption live in the private execution boundary. The report always says `adoption: not-evaluated`.

## Evaluation and scope

The hand-checkable fixture has two assigned tasks, 20 wall seconds, accepted latencies of 12 and 20, 32 overlapping agent seconds, 40 tokens across implementation/review/integration, and a peak of two implementation workers. These numbers are artificial test values, not production measurements. Negative fixtures cover omitted work, incomplete usage, failed gates, retries, concurrency, open attempts, forged acceptance shape and invalid timing. Actual Git fixtures demonstrate selected ignored-file invalidation without a Git diff.

No live Codex/Devin/Symphony/Contrabass qualification or comparison was run. Checkpoint tests are not proof that an agent remembers correctly. Canary calculations are not proof that supplied evidence is authentic. A small adopted configuration must be requalified before larger concurrency, another environment, or combined experimental changes.

Implementation references: [Node filesystem APIs](https://nodejs.org/api/fs.html), [Git status and ignored files](https://git-scm.com/docs/git-status). These describe the underlying APIs, not borrowed skill implementations.
