---
name: async-job-state-machines
description: "Model durable jobs with legal transition authority, stable operation/attempt identity, guarded effects, cancellation races, and recoverable indeterminate outcomes."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Async Job State Machines

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Model durable jobs with legal transition authority, stable operation/attempt identity, guarded effects, cancellation races, and recoverable indeterminate outcomes. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Define needed states and who may authorize each transition. Keep transient UI loading state separate from durable job state. State which evidence can establish acceptance, success, failure, cancellation, or ambiguity.

### 2. Choose the supported contract

Distinguish logical jobs from attempts, provider submissions, callbacks, and assets. Define deduplication and stale-event handling so an obsolete attempt cannot overwrite a newer accepted result.

### 3. Implement or qualify the path

Specify races between completion, cancellation, and timeout. A cancellation request is not completed cancellation. Apply the accepted reconciliation policy rather than whichever event arrives last.

### 4. Exercise failure and integration seams

Guard state transitions and protected effects with appropriate durable concurrency control. Persist required result/error and correlation references without secrets. Bound retries and expose a recovery path for indeterminate outcomes.

### 5. Verify and hand back evidence

Test duplicate success, late failure, stale attempts, repeated cancellation, crash/restart, and concurrent changes using an independent transition table. Assert side effects as well as state; real provider checks remain separate.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Success arrives after a cancellation request: reconcile using explicit race policy and authoritative evidence instead of inventing an event-order rule. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

The client times out while an external export succeeds; stored provider identity allows attaching the asset without creating a duplicate job or false cancellation. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Temporal workflows](https://docs.temporal.io/workflows)
- [Webhook ordering example](https://docs.stripe.com/webhooks)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
