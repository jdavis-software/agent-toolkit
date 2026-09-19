---
name: url-navigation-state
description: "Use a validated URL as the authority for shareable frontend state while preserving browser history, unrelated parameters and safe navigation boundaries."
metadata:
  version: "0.1.0"
---
# URL and Navigation State

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Use a validated URL as the authority for shareable frontend state while preserving browser history, unrelated parameters and safe navigation boundaries. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Select only navigation-owned values

Decide which filters, selection, sort and pagination should survive reload or be shareable. Keep passwords, private drafts and ephemeral hover/dialog state out of URLs. Use the existing framework router rather than a second uncoordinated history layer.

### 2. Parse into a bounded contract

Validate enums, numbers, duplicates and maximum lengths. Specify defaults and canonical serialization. Treat URL input as untrusted; never pass a supplied redirect to navigation without an explicit same-origin/approved-destination policy.

### 3. Choose push versus replace

Use push for meaningful user navigation and replace for transient typing or canonical correction according to the product. Keep unrelated accepted parameters and fragments intact. Reset pagination atomically when a filter changes rather than through a second effect.

### 4. Make rendering follow one owner

Derive query keys and visible filters from the parsed route. Handle popstate/framework navigation and initial server rendering consistently. An input draft may be separate from a committed search, but its commit boundary must be explicit.

### 5. Test the browser history

Exercise direct URL, reload, back/forward, invalid parameters, empty search and multiple rapid updates. Verify the address, controls and data agree. A history change must not secretly perform an unauthorized server action.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

Browser Back changes the URL, but the select control and query remain on the newer workspace because each keeps separate local state. Subscribe to the selected router state, derive controls and query identity together, and prove back/forward restores all three. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: Browser Back changes the URL, but the select control and query remain on the newer workspace because each keeps separate local state.

Expected behavior: Subscribe to the selected router state, derive controls and query identity together, and prove back/forward restores all three.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/url-navigation-state/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [Next search params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
