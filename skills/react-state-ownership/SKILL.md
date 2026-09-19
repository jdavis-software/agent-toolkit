---
name: react-state-ownership
description: "Assign each UI value one authoritative owner across local state, URL state, form drafts, server caches and shared client stores, with explicit reconciliation rules."
metadata:
  version: "0.1.0"
---
# React State Ownership

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Assign each UI value one authoritative owner across local state, URL state, form drafts, server caches and shared client stores, with explicit reconciliation rules. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Inventory values rather than stores

List each value, its lifetime, who may change it and whether it can be derived. A selected record ID and the records themselves have different ownership; avoid storing a copied selected object that can drift.

### 2. Choose the nearest authority

Derive computed values; use local state for temporary interaction; use the router for shareable navigation; use a query cache or framework loader for server snapshots. A global client store is appropriate only for genuinely cross-cutting client state, not every fetched response.

### 3. Model drafts separately

An editable draft may intentionally differ from server state. Define save, cancel, conflict, background refresh and record-switch semantics. Store the accepted source version for conflict handling rather than silently overwriting dirty fields on refetch.

### 4. Keep transitions consistent

Use a reducer or discriminated state when multiple fields must change together. Specify tenant/account changes and cache cleanup. A useEffect that synchronizes two supposed authorities is a warning to revisit ownership, not a default repair.

### 5. Test changes at the boundaries

Exercise back/forward, reload, refetch during editing, stale responses and identity switches. Verify both visible values and outbound IDs. Confirm that derived counters cannot disagree with the source list.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A refetch overwrites a dirty form, while a local selected-object copy continues to show the previous record. Preserve the draft under an explicit conflict policy, derive selection by ID, and avoid introducing another synchronized copy. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A refetch overwrites a dirty form, while a local selected-object copy continues to show the previous record.

Expected behavior: Preserve the draft under an explicit conflict policy, derive selection by ID, and avoid introducing another synchronized copy.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/react-state-ownership/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [State structure](https://react.dev/learn/choosing-the-state-structure)
- [Avoid unnecessary effects](https://react.dev/learn/you-might-not-need-an-effect)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
