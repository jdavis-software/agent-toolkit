---
name: temporal-workflow-determinism
description: "Evolve deterministic orchestration using representative history replay, version-qualified SDK behavior, and separate tests for external activity effects."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Temporal Workflow Determinism

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Evolve deterministic orchestration using representative history replay, version-qualified SDK behavior, and separate tests for external activity effects. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Trace workflow calls and separate network, filesystem, database, and provider effects into activities or appropriate supported SDK mechanisms. Use the installed SDK’s deterministic workflow time/concurrency APIs.

### 2. Choose the supported contract

Specify timers, signals/updates, cancellation, compensation, retry decisions, terminal states, and history growth. Keep payloads bounded; asset bytes should use suitable storage and durable references instead of oversized workflow arguments.

### 3. Implement or qualify the path

Review command-sequence changes against running executions. Qualify version markers, deployment pinning, or supported evolution methods for the actual SDK/server. A refactor is not automatically replay-neutral.

### 4. Exercise failure and integration seams

Replay a synthetic or sanitized corpus covering meaningful waiting, cancellation, retry, compensation, and completion states. Record history identities and include a deliberately incompatible fixture to prove the replay gate detects the intended failure.

### 5. Verify and hand back evidence

Test activities and effects separately. Replay does not execute providers, prove idempotency, or preserve database compatibility. Coordinate workflow, worker, API, and schema transitions before release.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

History replay passes but an activity can double-charge on retry: keep the effect invariant unresolved and test it separately. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Adding an activity before a timer can change command history. Test representative old histories and an accepted evolution strategy rather than relying on compilation. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Temporal Go replay](https://docs.temporal.io/develop/go/best-practices/testing-suite)
- [Workflow versioning](https://docs.temporal.io/develop/go/workflows/versioning)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
