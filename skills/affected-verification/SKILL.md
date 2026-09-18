---
name: affected-verification
description: Select relevant project-owned checks for an observed change and produce an evidence-based verification report that distinguishes passed, failed, skipped, blocked, and not-run checks.
---
# Affected Verification

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use after a scoped change or before handing work to an integrator. Prefer the smallest check set that proves the changed behavior while preserving mandatory repository and release checks.

## When not to use
Do not replace required integration checks with a convenient unit test. Do not add new frameworks or run production mutations to verify an unrelated edit. A command runner inherits the caller's authority; it is not a sandbox.

## Procedure
### Choose checks from the actual change
Read the baseline, diff, project manifests, and acceptance criteria. Use existing dependency or affected-target tooling when available. Connect each criterion to a real check; explain why shared contracts, migrations, lockfiles, or build wiring require wider coverage. Do not guess scripts or run every package by default.

### Execute without losing the exit result
After inspecting the command and its side effects, run it directly as an argument array through the helper. Store output outside the target repository:

```bash
node tools/skillcheck.mjs run --repo ../target-repo --id search-tests --timeout-ms 60000 -- node --test tests/search.test.mjs > ../evidence/search-check.json
```

Create the evidence directory first. The runner does not invoke a shell, does not approve the command, and does not hide nonzero exits behind a display pipeline. It captures exit code, signal, elapsed time, bounded stdout/stderr, full-stream digests, runtime, and before/after Git-visible fingerprints.

Receipt outcomes are `passed`, `failed`, `blocked`, `timed-out`, or `invalidated`. A missing executable is blocked. A killed command does not pass. Exit zero with changed source is invalidated. Human-report categories may also include skipped or not-run, but those never become passing receipts. A printed success message cannot override the real process result.

### Reconcile what was actually proved
The helper deliberately leaves cache status unknown: a successful command can have used its own cache. Check the tool's output before calling a run fresh. Record skipped or unavailable checks with reasons. Preserve failure evidence before repairing a defect.

Before handoff, verify each passing receipt against the current state. If ignored configuration, external services, environment variables, or cache state changed, reevaluate even when the Git fingerprint matches. For long-running or writing tests, choose an isolated fixture and explicitly describe outputs.

## Output
Return the impact analysis and selection rationale, baseline and final revision/state, one row per check, receipt locations, cache information actually observed, excluded checks, and a scoped conclusion. Distinguish a passing focused check from release readiness.

## Failure handling
Stop claiming completion at the failed boundary, not necessarily all useful work. Reproduce a failing check before changing its assertion. Do not automatically retry until a pass hides flakiness. Run formatters before final verification because source changes invalidate earlier receipts. Review artifacts for secrets before sharing them.

## Example
The command prints `PASS` and exits 7. The runner emits status failed and exits nonzero. A different command exits 0 but edits a tracked source file; its receipt is invalidated. Both cases are exercised automatically rather than left as prompt instructions.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
