---
name: frontend-accessibility
description: "Implement and verify accessible frontend interactions through native semantics, meaningful names, keyboard/focus behavior and explicit assistive-technology limits."
metadata:
  version: "0.1.0"
---
# Frontend Accessibility

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Implement and verify accessible frontend interactions through native semantics, meaningful names, keyboard/focus behavior and explicit assistive-technology limits. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Start with the user task

Identify controls, reading structure, input alternatives and status changes for a real flow. Prefer native buttons, links, inputs, headings and fieldsets. Use ARIA only where native semantics do not represent the intended pattern.

### 2. Provide names and relationships

Associate labels, help and error text with fields; name icon-only controls on the actionable element. Hide decorative SVGs from the accessibility tree. Do not rely on placeholder text, color or a hover-only tooltip as the sole meaning.

### 3. Manage focus deliberately

Define entry, traversal, dismissal and return focus for dialogs/popovers. Prefer a qualified primitive for complex composite behavior. Keep focus visible and prevent a hidden background from remaining interactable when the selected modal pattern requires isolation.

### 4. Announce without overwhelming

Use appropriate status/error regions for meaningful updates, not every render. Preserve user input and reachable recovery actions. Test reduced motion, contrast/forced colors and text enlargement under the accepted accessibility target.

### 5. Test with multiple methods

Exercise the whole task by keyboard and inspect names/roles/states. Use automated checks as one layer, then conduct manual assistive-technology review where required. Record exact coverage and unresolved issues; passing a DOM assertion is not a full accessibility certification.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A dialog opens from an icon-only action but has no accessible title, loses the trigger on close and leaves keyboard focus behind the overlay. Give the action and dialog names, use a qualified focus pattern, test dismissal/return focus, and record any untested assistive-technology coverage. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A dialog opens from an icon-only action but has no accessible title, loses the trigger on close and leaves keyboard focus behind the overlay.

Expected behavior: Give the action and dialog names, use a qualified focus pattern, test dismissal/return focus, and record any untested assistive-technology coverage.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-accessibility/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Forms](https://www.w3.org/WAI/tutorials/forms/)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
