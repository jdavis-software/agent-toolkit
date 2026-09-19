---
name: react-component-architecture
description: "Design React components around stable identity, explicit ownership and composable behavior; preserve focus and local state while making feature boundaries easier to change."
metadata:
  version: "0.1.0"
---
# React Component Architecture

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Design React components around stable identity, explicit ownership and composable behavior; preserve focus and local state while making feature boundaries easier to change. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Trace one interaction

Follow a user action through props, state, effects and data access before extracting components. Identify the feature owner, shared visual primitives and actual consumers. Keep a small one-use component local; file count is not architecture quality.

### 2. Specify the public contract

Choose controlled or uncontrolled behavior for each value and document defaults, change events, disabled behavior and ref needs. Use a discriminated union when modes have different required props. Avoid a switchboard of unrelated boolean flags and do not mirror controlled props into an independent state store.

### 3. Compose at stable boundaries

Use children, slots or narrowly named render props where callers genuinely need composition. Keep component definitions at module scope; use stable domain keys for reorderable records, not array positions or freshly generated keys. Pass immutable values and preserve native button/input semantics.

### 4. Keep effects and hooks accountable

Call hooks consistently and define cleanup for subscriptions. Put user-triggered effects in event handlers, not an effect observing a flag. Use context for a justified shared contract rather than concealing every dependency. Check installed React and primitive versions before choosing ref or polymorphic APIs.

### 5. Prove the seam survived

Exercise controlled and uncontrolled callers, reorder with an active input, conditional mounting, ref/focus behavior and subscription cleanup. Typecheck the public contract and inspect a real browser interaction. Extraction is complete only when behavior and accessibility remain intact.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A reordered editable list loses focus and applies the draft to a different record because keys use array positions. Keep identity with the record ID, preserve the draft and focused field during reorder, and test that editing record A never changes B. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A reordered editable list loses focus and applies the draft to a different record because keys use array positions.

Expected behavior: Keep identity with the record ID, preserve the draft and focused field during reorder, and test that editing record A never changes B.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/react-component-architecture/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [React identity](https://react.dev/learn/preserving-and-resetting-state)
- [React composition](https://react.dev/learn/passing-props-to-a-component)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
