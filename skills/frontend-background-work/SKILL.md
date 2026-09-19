---
name: frontend-background-work
description: "Move suitable CPU-heavy work away from urgent UI interactions while controlling worker ownership, message identity, cancellation and stale results."
metadata:
  version: "0.1.0"
---
# Frontend Concurrency and Background Work

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Move suitable CPU-heavy work away from urgent UI interactions while controlling worker ownership, message identity, cancellation and stale results. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Measure the actual bottleneck

Separate CPU work from network waiting and layout/paint. A transition changes scheduling priority; it does not turn a synchronous calculation into background-thread execution. Avoid worker overhead for trivial work.

### 2. Define the message protocol

Use bounded typed messages carrying operation IDs, version and result/error states. Validate messages at the boundary. Account for structured-clone cost and transferred buffers; transferring ownership can detach the sender’s buffer.

### 3. Own the worker lifecycle

Create workers at an appropriate feature/service boundary and dispose them when owned work ends. Limit outstanding work and coalesce superseded requests. Workers cannot manipulate the page DOM directly.

### 4. Handle cancellation and ordering

Use request identity to ignore obsolete replies even when underlying computation cannot stop immediately. Define cooperative cancellation or termination and what partial state survives. Never let a late result overwrite the currently selected document.

### 5. Verify under pressure

Test rapid inputs, reverse completion, malformed messages, worker errors, unload and large data transfers. Confirm input/focus remains responsive and all owned workers/ports are cleaned up. Compare end-to-end time and memory, not computation time alone.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A thumbnail worker returns results for an old project after the user switches projects and the UI attaches those results to the current project. Bind request and project identity to each result, reject stale messages and test cleanup during switching. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A thumbnail worker returns results for an old project after the user switches projects and the UI attaches those results to the current project.

Expected behavior: Bind request and project identity to each result, reject stale messages and test cleanup during switching.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-background-work/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [React scheduling](https://react.dev/reference/react/useTransition)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
