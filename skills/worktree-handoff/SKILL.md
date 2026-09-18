---
name: worktree-handoff
description: Prepare a commit-specific engineering handoff from an existing Git worktree, separating actual changes and executed checks from unresolved work, resource ownership, and integration risks.
---
# Worktree Handoff

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use when pausing work, handing a branch to another engineer or agent, or submitting a completed change for integration. A useful handoff tells the recipient exactly what state exists and what to do next.

## When not to use
This does not authorize creation, merge, reset, cleanup, or deletion of a worktree. An unfinished handoff is valid; pretending uncommitted work belongs to a tested commit is not.

## Procedure
### Read state rather than reconstruct it from memory
Read the work packet and actual repository instructions. Resolve the agreed baseline from the repository; never silently substitute a guessed branch. Run the read-only snapshot against the target worktree:

```bash
node tools/skillcheck.mjs snapshot --repo ../target-repo --base BASE_REVISION --scope src/search/ --scope tests/search.test.mjs
```

`BASE_REVISION` must be a real agreed revision, not a literal placeholder. The report identifies HEAD, the supplied base, the comparison merge-base, detached-HEAD state, committed changes, staged/unstaged/untracked changes, and out-of-scope paths. Renames account for both old and new paths. The helper does not fetch, stage, reset, or delete anything.

### Bind checks to the handoff state
Use receipts from Affected Verification for actual checks. Before citing a passing receipt, check it against the present target state:

```bash
node tools/skillcheck.mjs verify ../evidence/search-check.json --repo ../target-repo
```

A changed Git-visible state makes the receipt stale. A receipt is not signed proof: inspect who produced it and the command it records. Changed environment variables, ignored inputs, caches, services, and adversarial edits are outside this fingerprint's guarantee. Run broader required checks where those inputs matter.

### Preserve unfinished work
Classify the handoff as ready-for-review, incomplete, or blocked. For a ready-for-review handoff, require a committed reviewed diff and passing required checks; use `--require-clean` when collecting the final snapshot. A clean Git status alone is not a successful test result. If a formatter changes tracked files after testing, rerun affected checks on the final state.

List known task-owned resources separately. Record outstanding integration or cleanup actions without executing them. Keep the full local artifact private until paths, command arguments, and logs have been reviewed for publication.

## Output
Return task and goal; baseline and comparison base; actual HEAD; summary of changes by state; scope violations; check receipts; unfinished work; owned resources; readiness and the smallest next action. The recipient should not need to reconstruct missing state from conversation history.

## Failure handling
Missing Git, an invalid baseline, unsupported file types, oversized inputs, or concurrent mutation prevents a reliable snapshot and must be reported. Detached HEAD is a condition to explain, not permission to create a branch. Never resolve an ownership warning by deleting another task's files.

## Example
A check passed, then `src/search/query.ts` was edited without committing. Receipt verification now fails even if HEAD has not changed. The handoff says which check became stale and asks for a rerun; it does not reuse the old green result. Automated fixtures cover this behavior with disposable Git repositories.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
