---
name: usage-metering-idempotency
description: "Account for usage through stable event identities, explicit precision and settlement policy, duplicate protection, adjustments, and replayable reconciliation."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Usage Metering Idempotency

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Account for usage through stable event identities, explicit precision and settlement policy, duplicate protection, adjustments, and replayable reconciliation. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Separate estimates, reservations, provider cost, customer usage, and settled billing. Use approved definitions for billable events, precision, refunds, and timing; do not invent policy inside an adapter.

### 2. Choose the supported contract

Assign effect identities stable across retries and callbacks. Reject incompatible reuse and enforce uniqueness in authoritative persistence rather than relying on in-memory deduplication.

### 3. Implement or qualify the path

Model reservation, settlement, release, adjustment, and reversal as required. Preserve auditable history and explicit rounding/precision. Do not assume every usage unit or currency uses two decimals.

### 4. Exercise failure and integration seams

Coordinate ambiguous provider outcomes, cancellation races, partial results, and retries with durable job state. A local request failure does not prove no provider work occurred or authorize an automatic refund.

### 5. Verify and hand back evidence

Test duplicate/out-of-order events, reconciliation replay, corrected quantities, negative adjustments, and concurrent settlement. Check totals and uniqueness in a real isolated store when transactional semantics matter.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Cancellation returns locally while the provider completes: reconcile using the accepted metering policy, not an assumed refund rule. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Three copies of a success event settle one usage operation once; a later approved correction creates a separate linked adjustment. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [Provider idempotency example](https://docs.stripe.com/api/idempotent_requests)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.

## Distinguish advisory budgets from admission control

Report whether the actual executing adapter observes, warns or rejects excess reservations. A local warning flag does not cap provider billing. Keep charges from failed and ambiguous operations visible and serialize authoritative concurrent reservations. Releasing a reservation is not evidence that a remote operation was refunded.
