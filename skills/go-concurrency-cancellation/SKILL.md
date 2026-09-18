---
name: go-concurrency-cancellation
description: "Implement bounded Go concurrency with clear goroutine lifetimes, cancellation, backpressure, channel ownership, and verified shutdown/error behavior."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Go Concurrency and Cancellation

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Implement bounded Go concurrency with clear goroutine lifetimes, cancellation, backpressure, channel ownership, and verified shutdown/error behavior. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Name who starts each goroutine, waits for it, cancels it, and closes each channel. Specify queue capacity and maximum concurrent effects. An unbounded goroutine count is not a resource budget.

### 2. Choose the supported contract

Propagate the caller context through blocking operations. Use context-aware APIs and cancellation-aware sends/receives where needed. Cancel derived contexts. Do not discard inherited deadlines by switching to a background context.

### 3. Implement or qualify the path

Define partial-result and failure semantics: cancel peers, collect all results, or retain completed work. Keep channel closure with the producing owner and prevent cancelled consumers from stranding blocked producers.

### 4. Exercise failure and integration seams

Bound worker pools to CPU, database, or provider constraints. Stop admission before draining/cancelling and join owned goroutines as required. A cancellation request does not prove an external operation stopped or undid its effects.

### 5. Verify and hand back evidence

Test slow producers, early consumer exits, full queues, partial failure, deadline expiry, and repeated shutdown. Use controlled in-process schedules where supported plus race detection on exercised paths. Keep real dependency tests for the integration boundary.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A provider completes after local cancellation: reconcile that outcome rather than assuming cancellation reversed the effect. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Four thumbnail calls may be active. Cancellation stops admission and signals cooperative work; the caller joins owned workers rather than leaving an unlimited retry loop. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Go context](https://pkg.go.dev/context)
- [Go race detector](https://go.dev/doc/articles/race_detector)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
