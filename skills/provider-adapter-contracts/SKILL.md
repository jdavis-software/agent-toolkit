---
name: provider-adapter-contracts
description: "Integrate providers through capability-aware contracts, normalized outcomes, bounded retries, authenticated callbacks, and explicit reconciliation/cancellation differences."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Provider Adapter Contracts

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Integrate providers through capability-aware contracts, normalized outcomes, bounded retries, authenticated callbacks, and explicit reconciliation/cancellation differences. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Record input/output limits, asynchronous behavior, lookup, idempotency, cancellation, rate/cost policy, and callback verification per actual provider/version. Normalize common behavior without hiding unsupported features.

### 2. Choose the supported contract

Define validated application request/result shapes, provider reference storage, error categories, and sensitive fields. Keep provider signing, polling, and wire translation inside thin adapters.

### 3. Implement or qualify the path

Distinguish rejected, accepted, running, completed, failed, cancelled, and indeterminate states as required. Apply actual retry/rate guidance and reconcile ambiguous submissions before repeating expensive effects.

### 4. Exercise failure and integration seams

Authenticate callbacks using the provider’s documented mechanism and raw-body requirements. Deduplicate events, tolerate ordering differences, and reconcile authoritative state. Transport acknowledgment need not mean downstream completion.

### 5. Verify and hand back evidence

Test success, invalid inputs, rate limits, timeouts, duplicate/out-of-order callbacks, unsupported capabilities, and cancellation through public-safe fixtures. Reserve real integration for authorized sandbox credentials and avoid paid production smoke calls.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Submission timed out before receiving the provider reference: reconcile if supported or report indeterminate rather than blindly submit again. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Two image providers differ on post-acceptance cancellation; report the difference and reconcile a late success instead of promising both jobs stopped. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [OpenAPI](https://spec.openapis.org/oas/v3.1.1.html)
- [Webhook behavior example](https://docs.stripe.com/webhooks)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
