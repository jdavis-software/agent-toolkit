---
name: affected-verification
description: Select relevant project-owned checks for an observed change and produce an evidence-based verification report that distinguishes passed, failed, skipped, blocked, and not-run checks.
---
# Affected Verification

New experimental starter instructions. Host behavior has not yet been evaluated.

## When to use
Use after a scoped change, during review, or before a handoff when running the entire repository's checks would be wasteful or when a full validation policy must be applied deliberately.

## When not to use
Do not replace mandatory CI or release checks with a smaller local selection. Do not run destructive integration tests, migrations, external publishing, or production operations without the required authorization.

## Procedure
1. Read repository instructions, package/build manifests, the work packet, and the actual diff against a verified baseline. Capture the revision and uncommitted state being checked.
2. Map changed files to their projects and consumers using existing repository-owned graph tooling when available. Explain uncertainty where the graph is incomplete.
3. Select tests, type checks, formatting, linting, and build targets relevant to the observed change. Contract, lockfile, build configuration, migration, and shared-module edits often justify wider checks; explain the selection.
4. Inspect each command's prerequisites and side effects. Use the correct worktree and test environment. Do not invent Nx targets, scripts, credentials, or services.
5. Run authorized commands and capture exit codes and relevant output. Record cache use if visible; do not call cached results fresh execution. A timeout is not a pass.
6. Record failures before attempting fixes. Never weaken assertions, skip mandatory checks, or alter production behavior solely to obtain green output.
7. Recheck the working state and identify changes made after verification. Tie results to the checked state and list the additional integration/release checks still required.

## Output
Return the baseline and checked revision/state, impact analysis, selection rationale, one row per check (command, status, result/evidence), limitations, and readiness conclusion. Use only `passed`, `failed`, `skipped`, `blocked`, or `not-run` for check status. Say what the evidence covers rather than claiming universal correctness.

## Failure handling
If dependencies or services are unavailable, report blocked checks and the specific missing prerequisite. When a target is missing, inspect the project configuration instead of guessing. Preserve failing output; distinguish flaky results from reproducible failures.

## Example
Synthetic report, not executed evidence:

```text
change: search normalizes category and title text
selected: unit tests + browser search/clear/navigation cases
unit tests: not-run
browser tests: blocked (browser dependency missing)
release readiness: not established
next action: provide the required browser, then run the documented checks
```
