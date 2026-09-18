---
name: temporal-worker-rollout
description: "Qualify worker upgrades against self-hosted prerequisites, actual execution routing, replay evidence, external compatibility, and safe version drainage."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Temporal Worker Rollout

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Qualify worker upgrades against self-hosted prerequisites, actual execution routing, replay evidence, external compatibility, and safe version drainage. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Inventory installed server/SDK versions and check the intended Worker Versioning APIs and prerequisites. Do not silently upgrade a self-hosted server to make a recipe usable.

### 2. Choose the supported contract

Define which version receives new work and which versions continue existing executions. Specify workflow types, queues, activity placement, and drain criteria; a version label alone does not establish routing.

### 3. Implement or qualify the path

Run replay and relevant worker tests and ensure old workers remain compatible with new schemas/APIs. Preserve needed old artifacts/configuration for the required lifetime; pinning execution does not freeze external dependencies.

### 4. Exercise failure and integration seams

In nonproduction, start representative long-running executions on the old version, introduce the candidate, and observe routing and completion. Test supported ramp reduction, recovery, cancellation, and rollback using actual visibility evidence.

### 5. Verify and hand back evidence

Remove old workers only after supported visibility and status checks demonstrate they are no longer required. Coordinate retention and external compatibility retirement; do not kill them merely because new replicas are healthy.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

An old pinned worker requires a database column removed by the rollout: reject the plan until that cross-system dependency is resolved. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Hours-long export workflows remain on a supported old route while new executions enter the candidate; schema compatibility persists until the old executions drain. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Temporal Worker Versioning](https://docs.temporal.io/worker-versioning)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
