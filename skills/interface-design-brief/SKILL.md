---
name: interface-design-brief
description: "Turn a frontend task into a coherent, testable interface direction grounded in the audience, product workflow, existing system and realistic content states."
metadata:
  version: "0.1.0"
---
# Interface Design Brief

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Turn a frontend task into a coherent, testable interface direction grounded in the audience, product workflow, existing system and realistic content states. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Define the task and constraints

Identify the user, primary job, success criteria, content density and device/input context. Read existing screens, tokens, components and brand constraints. Distinguish accepted requirements from aesthetic assumptions.

### 2. Choose an explicit direction

Specify hierarchy, typography, spacing, color roles, density, icon family and motion purpose. Use references for visual questions rather than copying a complete design database. Avoid contradictory styles and generic decoration unrelated to the task.

### 3. Design the whole state set

Include loading, empty, permission-limited, validation, failure and long-content states alongside the ideal screenshot. Keep critical actions discoverable and make keyboard/touch behavior part of acceptance.

### 4. Translate decisions into components

Map the direction to existing primitives and a small variant/token plan. Mark any new component or dependency as a separate justified choice. Describe responsive changes by content needs, not simply scaling a desktop mockup.

### 5. Review against the brief

Use a representative rendered composition with realistic synthetic content. Compare hierarchy, readability and interaction to the accepted direction. Record intentional deviations and unresolved questions before broad implementation.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A polished dashboard concept assumes short labels and full permissions; the real screen has long names, no data and a read-only user. Produce usable empty/read-only/long-content compositions and a clear action hierarchy before declaring the design ready. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A polished dashboard concept assumes short labels and full permissions; the real screen has long names, no data and a read-only user.

Expected behavior: Produce usable empty/read-only/long-content compositions and a clear action hierarchy before declaring the design ready.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/interface-design-brief/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [WAI page structure](https://www.w3.org/WAI/tutorials/page-structure/)
- [shadcn composition](https://ui.shadcn.com/docs)
- [Tailwind themes](https://tailwindcss.com/docs/theme)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
