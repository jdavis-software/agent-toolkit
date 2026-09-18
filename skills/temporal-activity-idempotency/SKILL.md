---
name: temporal-activity-idempotency
description: "Design retryable effects with stable business identities, bounded timeouts, durable reconciliation, and tests for success before acknowledgment failure."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Temporal Activity Idempotency

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Design retryable effects with stable business identities, bounded timeouts, durable reconciliation, and tests for success before acknowledgment failure. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Identify the business effect that must not repeat and distinguish it from activity attempt IDs. Decide what may repeat safely and what requires deduplication or reconciliation. Retries do not provide an exactly-once guarantee.

### 2. Choose the supported contract

Carry a stable accepted-operation key across attempts rather than generating a new one each time. Reject incompatible key reuse and qualify the provider’s actual scope, expiry, and replay semantics.

### 3. Implement or qualify the path

Bound timeout, retry, concurrency, heartbeat, and cancellation behavior to the actual operation. Cancelling a local wait does not necessarily cancel a remote job. Avoid overlapping retries creating uncontrolled effects.

### 4. Exercise failure and integration seams

Plan for provider success followed by timeout/crash before acknowledgment. Check durable state or provider status before repeating a non-idempotent action. When reconciliation is impossible, expose indeterminate status and a reviewed recovery path.

### 5. Verify and hand back evidence

Complete the effect in a disposable fixture, fail before acknowledgment, and retry. Assert effect counts and stored results. Also test duplicate delivery, payload changes with reused keys, cancellation, and exhaustion without paid production calls.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

The provider’s idempotency retention expires before retry: use durable reconciliation or an indeterminate outcome rather than blindly resubmit. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

An export was accepted but the activity lost its response. Retry reconciles the existing export using the same business identity instead of creating and billing another one. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Temporal failure handling](https://docs.temporal.io/develop/go/failure-detection)
- [Provider idempotency example](https://docs.stripe.com/api/idempotent_requests)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
