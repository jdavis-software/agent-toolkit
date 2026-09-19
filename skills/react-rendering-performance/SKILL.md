---
name: react-rendering-performance
description: "Identify the actual cause of slow React interactions and reduce unnecessary work using measured state boundaries, subscriptions, scheduling and justified memoization."
metadata:
  version: "0.1.0"
---
# React Rendering and Performance

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Identify the actual cause of slow React interactions and reduce unnecessary work using measured state boundaries, subscriptions, scheduling and justified memoization. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Define the slow interaction

Name the interaction and device/data conditions, then record a baseline trace. Separate network wait, JavaScript, React render, DOM layout and paint. Development Strict Mode behavior is not a production timing result.

### 2. Locate the work

Use the React Profiler and browser performance tools to identify expensive commits and broad subscriptions. Look for duplicated derived state, effect cascades, unstable context values and offscreen work. Record the candidate source and whether React Compiler is enabled.

### 3. Change the largest supported cause

Move transient state close to its consumers, select narrower data and compute cheap derivations during render. Memoize only when it avoids observed work or satisfies a real identity contract. Do not make application correctness depend on a memo cache.

### 4. Choose scheduling or virtualization deliberately

Keep input updates urgent and defer expensive dependent presentation where appropriate. Transitions do not move CPU work onto another thread or establish network response order. Large lists may need virtualization, but validate focus, reading order, variable heights and restoration.

### 5. Repeat the workload

Compare the same production build mode, data size and devices. Include memory, request count, dropped input and visual correctness, not just fewer renders. Remove speculative optimizations that add complexity without a demonstrated benefit.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A search field becomes unresponsive because every keystroke filters and paints a very large table. Measure the bottleneck, isolate urgent input, reduce or defer presentation work, and verify that the newest search result and keyboard focus remain correct. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A search field becomes unresponsive because every keystroke filters and paints a very large table.

Expected behavior: Measure the bottleneck, isolate urgent input, reduce or defer presentation work, and verify that the newest search result and keyboard focus remain correct.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/react-rendering-performance/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Profiler](https://react.dev/reference/react/Profiler)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Transitions](https://react.dev/reference/react/useTransition)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
