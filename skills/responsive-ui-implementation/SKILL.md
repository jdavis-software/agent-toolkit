---
name: responsive-ui-implementation
description: "Implement layouts that adapt to container space, content length, input mode and zoom without hiding required actions or masking overflow."
metadata:
  version: "0.1.0"
---
# Responsive UI Implementation

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Implement layouts that adapt to container space, content length, input mode and zoom without hiding required actions or masking overflow. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Define content priorities

Identify the primary task, indispensable actions and meaningful content order. Inspect the existing breakpoint and container conventions; do not choose device labels instead of actual layout needs.

### 2. Build intrinsically

Use grid/flex constraints, minmax, wrapping and sensible minimums before adding many media queries. Set min-width or min-inline-size deliberately for shrinking children. Handle long identifiers, images and table overflow within owned regions instead of hiding document overflow.

### 3. Adapt interactions, not just widths

Keep keyboard and touch access to actions that desktop reveals on hover. Use the same logical reading order as the visual order. Preserve labels and an accessible path to secondary controls rather than deleting critical navigation on mobile.

### 4. Account for real environments

Test zoom/text enlargement, on-screen keyboard space, safe areas, reduced motion and pointer differences relevant to the target. Container queries are useful for reusable cards, while page navigation may use viewport breakpoints. Confirm support against the actual browser matrix.

### 5. Measure rendered results

Exercise at least narrow, intermediate and wide widths plus long content and empty/error states. Assert required actions remain visible and usable, compare scroll widths, and inspect screenshots. A zero-overflow assertion does not prove nothing was clipped by overflow:hidden.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A sidebar hides skill-to-bundle navigation on narrow screens, leaving no visible route back to the relevant workflow. Keep the required link in visible semantic navigation, click it on the narrow viewport, and verify it was not merely found in hidden DOM. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A sidebar hides skill-to-bundle navigation on narrow screens, leaving no visible route back to the relevant workflow.

Expected behavior: Keep the required link in visible semantic navigation, click it on the narrow viewport, and verify it was not merely found in hidden DOM.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/responsive-ui-implementation/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [Tailwind responsiveness](https://tailwindcss.com/docs/responsive-design)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
