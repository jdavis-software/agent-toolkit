---
name: frontend-behavior-preserving-refactoring
description: "Restructure React components, hooks and data flow while preserving user-visible behavior, state lifetime, focus and effect ownership."
metadata:
  version: "0.1.0"
---
# Frontend Behavior-preserving Refactoring

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Restructure React components, hooks and data flow while preserving user-visible behavior, state lifetime, focus and effect ownership. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Freeze the observed behavior

Identify callers, state owners, keys, subscriptions, navigation and server effects before editing. Record known bugs separately from intentional behavior changes. Set a bounded owned scope and acceptance flow.

### 2. Choose a responsibility seam

Extract behavior that has one coherent owner or reusable consumer. Avoid moving a large component into an equally opaque hook or generic abstraction. Keep native semantics and the public prop contract explicit.

### 3. Preserve lifecycle and identity

Check whether moving a component, changing a key or lifting state changes remounts, draft lifetime and focus. Keep effects tied to actual external systems and preserve cleanup. Do not suppress exhaustive-dependency checks to reproduce accidental closure behavior.

### 4. Move incrementally

Use tested structural transformations for mechanical edits and language tools for symbol-sensitive changes. Keep generated files canonical. Separate a dependency upgrade or visual redesign from the behavior-preserving refactor unless explicitly in scope.

### 5. Re-run the real flow

Compare request/effect counts, user input, keyboard focus, validation, back navigation and failure handling. Typecheck consumers and inspect relevant visual states. A reduced line count is not proof of a better boundary.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

Extracting a row editor changes its key, causing unsaved input to reset whenever a background query refreshes. Preserve the editor’s accepted record identity and draft policy, then test refetch while typing and keyboard focus. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: Extracting a row editor changes its key, causing unsaved input to reset whenever a background query refreshes.

Expected behavior: Preserve the editor’s accepted record identity and draft policy, then test refetch while typing and keyboard focus.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-behavior-preserving-refactoring/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Effects](https://react.dev/learn/you-might-not-need-an-effect)
- [Identity](https://react.dev/learn/preserving-and-resetting-state)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
