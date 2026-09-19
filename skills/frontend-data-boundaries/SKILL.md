---
name: frontend-data-boundaries
description: "Convert untrusted transport data into deliberate frontend view models without leaking service details, precision errors or unauthorized fields throughout the component tree."
metadata:
  version: "0.1.0"
---
# Frontend Data Boundaries

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Convert untrusted transport data into deliberate frontend view models without leaking service details, precision errors or unauthorized fields throughout the component tree. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Locate the actual input boundary

Trace the HTTP/stream/storage response, generated types, runtime validation and query insertion. Treat parsed JSON as unknown until validated. Generated TypeScript declarations do not inspect network bytes.

### 2. Specify wire and view semantics

Define optional versus null values, enum extension policy, identifier precision, date/timezone behavior and error categories. Keep large numeric IDs as the accepted exact representation. Present formatting belongs in a deliberate view layer, not scattered across every card.

### 3. Project narrowly

Map validated DTOs into the fields the feature needs. Do not spread a private service response into client props. Keep capabilities useful for presentation while enforcing the actual operation at the server. Avoid a second mirrored store merely to rename API fields.

### 4. Coordinate cache and version boundaries

Validate before caching, scope identity and document compatibility between generated consumers and deployed servers. Distinguish malformed success responses from transport/auth failures. Preserve original diagnostics in a protected channel without exposing secrets in a toast.

### 5. Verify observable behavior

Feed absent fields, unknown states, impossible numbers, malformed dates and cross-identity records through the real adapter. Assert both the visible fallback and the absence of inappropriate mutations. Recheck after contract generation changes.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A success response contains a numeric identifier above JavaScript exact precision and is silently rounded before a delete action. Reject the incompatible wire shape or use the accepted exact string representation; verify the action never targets a rounded identifier. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A success response contains a numeric identifier above JavaScript exact precision and is silently rounded before a delete action.

Expected behavior: Reject the incompatible wire shape or use the accepted exact string representation; verify the action never targets a rounded identifier.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-data-boundaries/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Next data security](https://nextjs.org/docs/app/guides/data-security)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
