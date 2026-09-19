---
name: interface-motion-design
description: "Use motion to explain interaction and hierarchy while preserving reduced-motion alternatives, interruption behavior and rendering performance."
metadata:
  version: "0.1.0"
---
# Animation and Motion Design

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Use motion to explain interaction and hierarchy while preserving reduced-motion alternatives, interruption behavior and rendering performance. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Give motion a purpose

State what the transition communicates: continuity, progress, hierarchy or feedback. Do not animate every element or make users wait for decorative sequences. Reuse the existing motion/timing system.

### 2. Choose the smallest suitable mechanism

Use CSS for simple state changes, Web Animations API for imperative timelines, or the existing motion library for composition where justified. Do not install a second animation framework merely for one hover effect.

### 3. Design interruptions and alternatives

Specify reduced-motion behavior, rapid reversal, unmount and route changes. Preserve logical focus and reading order throughout. Reduced motion should keep state changes understandable rather than erase all feedback.

### 4. Avoid expensive animation paths

Favor suitable compositor-friendly properties when they meet the design, but measure the actual result. Avoid repeated layout reads/writes and unbounded animation work. A transformed offscreen element can still affect hit testing or assistive behavior.

### 5. Validate the interaction

Test keyboard and pointer activation, repeated toggles, reduced motion and a slower device profile. Check final states, cancel/cleanup, focus and layout. Keep animation timing out of correctness assumptions and do not assert performance from aesthetics.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A dialog’s exit animation removes the trigger before focus returns, and reduced-motion users wait through an unnecessary full-screen pan. Preserve a valid focus destination, make interruption safe and provide a reduced-motion transition that retains meaning. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A dialog’s exit animation removes the trigger before focus returns, and reduced-motion users wait through an unnecessary full-screen pan.

Expected behavior: Preserve a valid focus destination, make interruption safe and provide a reduced-motion transition that retains meaning.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/interface-motion-design/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Motion accessibility](https://motion.dev/docs/react-accessibility)
- [Reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
