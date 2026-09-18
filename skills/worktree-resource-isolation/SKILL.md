---
name: worktree-resource-isolation
description: "Manage parallel lanes with separate source, mutable output, port, database, queue, process, lease, and recoverable cleanup ownership."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Worktree Resource Isolation

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Manage parallel lanes with separate source, mutable output, port, database, queue, process, lease, and recoverable cleanup ownership. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Select an authorized worktree and record base, branch, owner, owned paths, and exclusions. Worktree separation does not isolate credentials, processes, database effects, or all filesystem access.

### 2. Choose the supported contract

Use the existing allocator to reserve ports, build directories, compiler state, databases, queues, and reports atomically. Avoid check-then-use collisions. Share compatible immutable artifacts, not writable outputs.

### 3. Implement or qualify the path

Preflight actual CLI/MCP/language-server worktree bindings and resource ownership. Apply credentials and external-action restrictions separately from diff allowlists. Keep public records free of private paths and secrets.

### 4. Exercise failure and integration seams

Track activity and bounded leases through the existing lifecycle mechanism. Preserve interrupted changes and diagnostics. An expired lease is a reason to inspect, not proof that deletion is safe.

### 5. Verify and hand back evidence

Release only positively owned inactive resources after checking unmerged source. Test collision, abandonment, and concurrent allocation in disposable fixtures. Avoid broad prune, clean, database-drop, or kill operations across lanes.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

An expired lane lease still has an active process: preserve resources and reconcile ownership before cleanup. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Two Git worktrees share compiler state and a test database; preflight detects the collision and allocates private mutable resources while immutable downloads remain reusable. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Git worktrees](https://git-scm.com/docs/git-worktree)
- [Docker cache optimization](https://docs.docker.com/build/cache/optimize/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
