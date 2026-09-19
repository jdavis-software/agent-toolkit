---
name: tailwind-css-engineering
description: "Build maintainable utility-based interfaces with version-correct tokens, statically discoverable variants, responsive behavior and tested component composition."
metadata:
  version: "0.1.0"
---
# Tailwind CSS Engineering

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Build maintainable utility-based interfaces with version-correct tokens, statically discoverable variants, responsive behavior and tested component composition. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Inspect the actual CSS pipeline

Confirm Tailwind major version, framework integration, source scanning, prefixes and existing token/component files. Tailwind v3 configuration and v4 CSS-first theming are not interchangeable. Preserve the repository’s selected package manager and build ownership.

### 2. Define semantic design decisions

Reuse established colors, spacing, radii and type scales. Use semantic variables for themes rather than scattering hard-coded colors through components. Document a small variant matrix and when a one-off value is justified.

### 3. Keep generated classes discoverable

Use complete literal class strings in explicit variant maps. Do not build a utility by concatenating fragments such as a color name into a class. Configure additional scanned sources only where actual shared-package files require them; do not scan secrets or all node_modules.

### 4. Compose without cascade surprises

Let component variants own appearance and caller classes own supported layout adjustments. Follow the installed merge utility’s compatibility or use nonconflicting classes; the last class in an HTML string does not necessarily win. Keep responsive, focus-visible, disabled, dark and reduced-motion behavior deliberate.

### 5. Check production output

Compile the actual production CSS, render every accepted variant, and test narrow/wide containers, long text, focus and themes. Include a variant only selected at runtime in fixtures to detect missing CSS. Record output size instead of assuming utility syntax guarantees small bundles.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

An API status produces `bg-${color}-500`; the development page looks acceptable but the selected variant has no generated production CSS. Replace fragment construction with a finite literal variant map and assert computed styles from the actual compiled CSS. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: An API status produces `bg-${color}-500`; the development page looks acceptable but the selected variant has no generated production CSS.

Expected behavior: Replace fragment construction with a finite literal variant map and assert computed styles from the actual compiled CSS.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/tailwind-css-engineering/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Source discovery](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Theme variables](https://tailwindcss.com/docs/theme)
- [Variants](https://tailwindcss.com/docs/hover-focus-and-other-states)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
