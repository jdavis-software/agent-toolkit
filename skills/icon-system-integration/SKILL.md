---
name: icon-system-integration
description: "Select and integrate a coherent icon family using React Icons, Lucide or an existing library with accessible meaning, bounded imports and preserved upstream license information."
metadata:
  version: "0.1.0"
---
# Icon System Integration — React Icons

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Select and integrate a coherent icon family using React Icons, Lucide or an existing library with accessible meaning, bounded imports and preserved upstream license information. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Inspect the existing visual language

Identify the installed icon library, family, stroke/fill convention, size grid and brand requirements. Prefer one compatible family for ordinary UI actions. Brand marks and decorative illustration may have different rules; do not mix arbitrary families merely because a catalog is large.

### 2. Review actual package and asset terms

Confirm the installed import API and the source family’s license. React Icons aggregates families with different terms; its wrapper license is not a universal license for every glyph. Preserve required notices for reused assets and keep logo/trademark usage separate from generic icon code.

### 3. Use explicit bounded imports

Import named icons from the documented family entry point, such as react-icons/bs, or from the selected direct library. Avoid `import * as` across whole packs and unbounded string-driven dynamic lookup. Use a small typed registry only when data really selects an icon, and measure emitted output rather than assuming tree shaking.

### 4. Put meaning on the control

Use currentColor and the existing component sizing contract. Hide decorative SVGs with aria-hidden and avoid extra tab stops. Give an icon-only button a meaningful accessible name; name/state belong on the button, not only a title inside the SVG. Accompany status with text or another noncolor cue.

### 5. Verify in context

Test keyboard activation, accessible names, hover/touch behavior, themes, alignment, forced colors where applicable and missing-icon fallback. Inspect bundle metadata and retain family/license provenance. An icon import that compiles can still be semantically wrong or inaccessible.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A toolbar imports every React Icons pack by namespace and exposes unlabeled icon-only buttons whose SVG titles disappear in the accessibility tree. Use a finite family/registry, label the actionable elements, verify keyboard/accessible names and inspect the production bundle and family notices. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A toolbar imports every React Icons pack by namespace and exposes unlabeled icon-only buttons whose SVG titles disappear in the accessibility tree.

Expected behavior: Use a finite family/registry, label the actionable elements, verify keyboard/accessible names and inspect the production bundle and family notices.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/icon-system-integration/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [React Icons](https://github.com/react-icons/react-icons)
- [Bootstrap family](https://react-icons.github.io/react-icons/icons/bs/)
- [Lucide](https://lucide.dev/guide/react)
- [Button semantics](https://www.w3.org/WAI/ARIA/apg/patterns/button/)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
