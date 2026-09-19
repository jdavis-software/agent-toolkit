---
name: design-system-architecture
description: "Establish a small versioned system of semantic tokens, accessible primitives and feature compositions with clear ownership and migration criteria."
metadata:
  version: "0.1.0"
---
# Design System Architecture

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Establish a small versioned system of semantic tokens, accessible primitives and feature compositions with clear ownership and migration criteria. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Inventory before standardizing

Inspect real screens, existing primitives and recurring product decisions. Distinguish one product’s implementation detail from a genuinely shared pattern. Do not create a universal component library before there are consumers.

### 2. Separate token layers

Name foundational scales, semantic roles and component-level decisions. Specify themes, density, typography, spacing and focus treatment. Avoid using color alone to convey state; account for contrast and forced-color modes.

### 3. Write behavior contracts

For each primitive, define allowed variants, interaction semantics, keyboard/ref behavior, loading/disabled states and composition slots. Decide which component owns presentation and which owns business behavior. Keep data fetching out of a generic visual primitive.

### 4. Version changes by consumer impact

A renamed token, altered focus path or changed default can break consumers even without a TypeScript error. Assign owners, migration examples and deprecation criteria. Inspect generated or copied component source instead of blindly overwriting local fixes.

### 5. Evaluate representative compositions

Test a form, list, modal and navigation control across themes, narrow containers, long translations and validation states. Prefer a small state gallery with real behavior over a page of static swatches. Record known exceptions instead of inventing universal consistency.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A global token update makes destructive buttons indistinguishable from primary actions and removes visible focus in dark mode. Test semantic states and focus in each theme, preserve noncolor cues, and migrate affected consumers with explicit acceptance. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A global token update makes destructive buttons indistinguishable from primary actions and removes visible focus in dark mode.

Expected behavior: Test semantic states and focus in each theme, preserve noncolor cues, and migrate affected consumers with explicit acceptance.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/design-system-architecture/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [WAI button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Tailwind tokens](https://tailwindcss.com/docs/theme)
- [shadcn source model](https://ui.shadcn.com/docs)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
