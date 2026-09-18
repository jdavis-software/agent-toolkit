---
name: postgres-transaction-boundaries
description: "Implement database invariants with explicit transaction ownership, isolation decisions, constraint-backed concurrency control, and retry-safe effects."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# PostgreSQL Transaction Boundaries

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Implement database invariants with explicit transaction ownership, isolation decisions, constraint-backed concurrency control, and retry-safe effects. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

State the invariant across relevant rows and concurrent requests. Separate authoritative database state from caches. A single-request pass is not evidence for a concurrent invariant.

### 2. Choose the supported contract

Assign transaction begin/commit/rollback to the use-case owner. Pass transaction-bound query adapters through lower layers; qualify sqlc WithTx with the actual pgx/database integration. Avoid hidden commits in helpers.

### 3. Implement or qualify the path

Choose constraints, conditional writes, row locks, or serializable execution according to the invariant. Record isolation behavior, lock ordering, conflicts, and retries. An unchecked read-then-write can admit competing writers.

### 4. Exercise failure and integration seams

Keep external effects outside ambiguous transaction retries through an accepted intent/outbox or other coordination strategy. Retrying a serialization failure must rebuild the transaction’s decisions, not only replay its final SQL statement.

### 5. Verify and hand back evidence

Use a real disposable PostgreSQL fixture for isolation/constraints. Coordinate overlapping transactions and assert final state, results, and prohibited effects. Exercise rollback, cancellation, and retry exhaustion with private writable resources per lane.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

An external effect completed before a transaction retry: prevent repeating it through durable coordination rather than claiming database atomicity covers the provider. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Two requests compete for the final slot; require exactly one reservation, nonnegative capacity, and no duplicate notification intent. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- [sqlc transactions](https://docs.sqlc.dev/en/latest/howto/transactions.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
