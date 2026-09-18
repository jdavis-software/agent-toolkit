---
name: build-cache-trust
description: "Review producer/consumer cache authority, scoped credentials, sensitive output, nonproduction denial tests, and recovery from suspect artifacts."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Build Cache Trust

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Review producer/consumer cache authority, scoped credentials, sensitive output, nonproduction denial tests, and recovery from suspect artifacts. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map read, write, overwrite, and deletion authority by public contribution, branch CI, protected integration, and release identity. Consider first-writer poisoning as well as replacement of existing keys.

### 2. Choose the supported contract

Check the exact maintained cache implementation and installed package status, including Nx self-hosted cache deprecation where relevant. A branch name or directory prefix is not authorization.

### 3. Implement or qualify the path

Separate untrusted writes from release-trusted publication with enforceable permissions. Review whether cache reads expose private output. Scope BuildKit exports so competing writers do not unexpectedly replace one mutable reference.

### 4. Exercise failure and integration seams

Use a disposable cache to demonstrate denied restricted writes and allowed trusted publication. Verify sensitive-read restrictions where required. Never poison the production cache to demonstrate the risk.

### 5. Verify and hand back evidence

Define detection, disabling risky reuse, and trusted recomputation for suspect artifacts. Keep cache recovery separate from deletion of canonical source, worktrees, or persistent databases.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Only a directory label separates untrusted and release jobs: require real permissions instead of claiming namespace security. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

A fork job can run tests but cannot upload results into the protected release cache; a fixture demonstrates denied writes with the restricted identity. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Nx cache deprecation](https://nx.dev/docs/reference/deprecated/self-hosted-cache-packages)
- [Docker cache backends](https://docs.docker.com/build/cache/backends/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
