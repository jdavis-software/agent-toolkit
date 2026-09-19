---
name: visual-regression-verification
description: "Use reproducible visual evidence to detect frontend regressions while preserving independent interaction, accessibility and content checks."
metadata:
  version: "0.1.0"
---
# Visual Regression and UI Verification

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Use reproducible visual evidence to detect frontend regressions while preserving independent interaction, accessibility and content checks. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Choose the visual contract

Select representative routes, states, themes and viewport sizes. Explain which differences are intentional. A screenshot is evidence of one rendered state, not a complete behavioral or accessibility test.

### 2. Stabilize the environment

Pin browser/platform and relevant fonts, seed content, wait for actual readiness and control nondeterministic timestamps/animations. Capture reduced-motion or a settled state without hiding a real layout defect. Avoid cross-platform pixel comparisons without a justified tolerance.

### 3. Exercise before capturing

Run the actual user action that reaches the state: open, filter, validate, fail, recover or navigate. Assert page identity, meaningful content and console health first. Screenshots of an error overlay can still be valid image files.

### 4. Review differences responsibly

Inspect clipping, overlap, labels, contrast, focus, scroll regions and missing controls. Do not blindly update baselines after every failure or mask the whole dynamic region. Explain the minimum accepted change and retain useful surrounding context.

### 5. Pair pixels with semantics

Check accessible names, focused element, URL and visible status along with images. Keep mobile critical actions exercised, not merely present in DOM. Report whether comparisons used baselines, manual review or both.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A screenshot test is updated to accept a narrow layout that clipped the Save action and hid the focused control. Reject the baseline update until the action is visible and usable, test it directly, and record the corrected screenshot. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A screenshot test is updated to accept a narrow layout that clipped the Save action and hid the focused control.

Expected behavior: Reject the baseline update until the action is visible and usable, test it directly, and record the corrected screenshot.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/visual-regression-verification/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Playwright snapshots](https://playwright.dev/docs/test-snapshots)
- [Playwright assertions](https://playwright.dev/docs/test-assertions)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
