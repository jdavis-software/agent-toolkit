---
name: frontend-loading-error-states
description: "Design initial, empty, refreshing, partially failed and mutation-pending UI states that preserve useful data and offer safe, attributable recovery."
metadata:
  version: "0.1.0"
---
# Frontend Loading and Error States

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Design initial, empty, refreshing, partially failed and mutation-pending UI states that preserve useful data and offer safe, attributable recovery. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Enumerate states per region

Separate initial no-data pending, success with zero results, success with records, background refresh, error without data and error with stale data. Track writes separately. One page-level isLoading flag cannot represent all independent regions.

### 2. Preserve meaning during transitions

Reserve layout space appropriately and keep stale content only when it belongs to the same authorized identity. Distinguish stale information from a fresh empty result. Do not blank the whole screen for a background refresh or hide error evidence behind an infinite skeleton.

### 3. Make failure actionable

Choose safe error text and a scoped retry action. Explain when a write outcome is uncertain and require reconciliation for non-idempotent effects. Preserve drafts and useful successful regions; an error boundary is not a substitute for handling ordinary rejected requests.

### 4. Keep feedback accessible

Announce meaningful completion and failure without repeating every render. Mark the region busy where useful and keep navigation/recovery reachable. Pending icons should not be the only feedback, and disabled controls must have an understandable state.

### 5. Test competing outcomes

Control response order and test timeout, offline, permission loss, partial responses and mutation failure. Assert stale data does not migrate to another account. Confirm retry cannot duplicate an externally completed write.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A refetch fails while valid cached rows exist; the screen replaces them with an empty-state message saying no items exist. Retain the same-identity data with an explicit refresh error and scoped retry, and do not relabel a request failure as successful emptiness. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A refetch fails while valid cached rows exist; the screen replaces them with an empty-state message saying no items exist.

Expected behavior: Retain the same-identity data with an explicit refresh error and scoped retry, and do not relabel a request failure as successful emptiness.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-loading-error-states/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [TanStack defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [React Suspense](https://react.dev/reference/react/Suspense)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
