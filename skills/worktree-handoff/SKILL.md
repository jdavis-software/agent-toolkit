---
name: worktree-handoff
description: Prepare a commit-specific engineering handoff from an existing Git worktree, separating actual changes and executed checks from unresolved work, resource ownership, and integration risks.
---
# Worktree Handoff

New experimental starter instructions. Host behavior has not yet been evaluated.

## When to use
Use when handing repository work to another agent or human, before submitting an owned branch for integration, or when pausing an unfinished task.

## When not to use
Do not use this as permission to create, merge, delete, reset, or clean worktrees. A branch does not establish filesystem, process, or credential isolation.

## Procedure
1. Read the work packet and repository instructions. Confirm the current path and actual worktree with read-only Git commands.
2. Read `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, and `git worktree list --porcelain`. Detached HEAD is a condition to report, not a reason to create a branch automatically.
3. Resolve the agreed integration baseline. Use a diff against that verified revision to identify owned changes. If the baseline is absent or stale, say so instead of guessing `main` or fetching without permission.
4. Separate committed, staged, unstaged, and untracked work. Report out-of-scope changes without deleting, reverting, or claiming ownership of them.
5. Record checks from actual outputs: command, working directory, checked revision/state, exit result, and artifact location. A clean worktree is not proof that tests passed.
6. Record only known resources owned by this task: worktree, ports, test database, process IDs, or queues. Do not include credentials. Leave cleanup to an authorized, ownership-aware operation.
7. State the smallest next action and any integration conflicts or missing evidence. Do not mark unfinished work complete.

## Output
Return task ID; accepted base; submitted HEAD; worktree and branch; committed/uncommitted state; summary; owned changed paths; check evidence; unresolved issues; owned resources; and integration recommendation. Do not include private machine paths in a public handoff: use repository-relative paths and public-safe identifiers.

## Failure handling
If Git is unavailable, the location is not a repository, or the branch is detached, report the condition precisely. Never manufacture a commit SHA or substitute an agent's claim for a command result. Preserve unmerged and untracked work.

## Example
Synthetic incomplete handoff:

```text
task: catalog-category-search
HEAD: unknown (must be read from Git)
changes: category matching added; one uncommitted test remains
checks: not run; dependency installation unavailable
integration: not ready for merge
next action: install locked dependencies, run checks, review diff, commit
cleanup: none performed
```

This is an example of honest incomplete evidence, not a successful execution trace.
