---
name: headless-component-integration
description: "Compose installed headless primitives and shadcn/ui source components without breaking keyboard semantics, local changes or version-specific APIs."
metadata:
  version: "0.1.0"
---
# Headless Components and shadcn/ui

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Compose installed headless primitives and shadcn/ui source components without breaking keyboard semantics, local changes or version-specific APIs. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Discover the actual component system

Read components.json, aliases, theme files, package versions and installed source. Identify whether the primitive base is Radix, Base UI or another supported system. Similar component names do not imply identical props or behavior.

### 2. Inspect before adding

Prefer the existing component or variant when it fits. Preview an authorized registry addition and its dependencies, file writes and styles. Do not overwrite local customizations or install a community registry entry solely because it is discoverable.

### 3. Respect the primitive contract

Compose required titles, descriptions, trigger/content relationships and state handling. Use asChild/render composition only according to the installed base. Preserve prop/ref/event forwarding and avoid nested buttons or conflicting controlled owners.

### 4. Separate appearance and behavior

Use supported variants and semantic tokens. Keep feature policy and data access outside generic primitives. Maintain local component provenance and a reviewed upgrade path because copied source is now maintained by the application.

### 5. Test the combined control

Verify open/close, escape, outside interaction, focus return, validation, disabled state and nested overlays. Check portal and stacking behavior within the actual application. A primitive’s upstream accessibility support does not certify every custom composition.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A wrapper drops the trigger ref and event props, so a composed dropdown no longer returns focus or opens from the keyboard. Preserve the actual base contract and test the composed control’s keyboard/focus behavior rather than replacing it with a visually similar div. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A wrapper drops the trigger ref and event props, so a composed dropdown no longer returns focus or opens from the keyboard.

Expected behavior: Preserve the actual base contract and test the composed control’s keyboard/focus behavior rather than replacing it with a visually similar div.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/headless-component-integration/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [shadcn source model](https://ui.shadcn.com/docs)
- [Radix accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [shadcn installation](https://ui.shadcn.com/docs/installation)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
