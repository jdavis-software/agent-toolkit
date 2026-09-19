---
name: nextjs-application-architecture
description: "Plan App Router features around route ownership, server/client execution, loading and failure boundaries, cache semantics and the actual deployment target."
metadata:
  version: "0.1.0"
---
# Next.js Application Architecture

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Plan App Router features around route ownership, server/client execution, loading and failure boundaries, cache semantics and the actual deployment target. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Read the installed framework and hosting contract

Inspect Next.js/React versions, routing mode, cache flags, runtime targets, authentication and deployment configuration. Do not transfer cache defaults or APIs from a different major version. A static export and a running server have different supported operations.

### 2. Map the route tree

Place shared layout, page-specific data and route groups according to navigation behavior. Decide which boundaries persist and which remount. Use loading, error and not-found behavior at the correct segment and test parallel/intercepted routes only when the product actually needs them.

### 3. Assign execution and data access

Keep private reads and authorization in a reviewed server-side layer. Make client islands only where interaction/browser APIs require them. Start independent server reads without an accidental waterfall. Return minimal serializable view data, not database/session objects.

### 4. Name each cache and invalidation owner

Document request memoization, persistent server data/output caching, client navigation state and any query cache separately. For the selected version, specify stale behavior and which write invalidates which consumers. Do not infer mutation authorization from Server Action placement or a hidden button.

### 5. Verify the deployed behavior

Build for the actual runtime, navigate directly and client-side, exercise rejected reads/writes, and compare initial HTML and hydrated content. Test overlapping old/new deployments where contracts change. Keep secrets out of bundles and hydration payloads.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A feature works in a development server but depends on a server-only write while the accepted target is a static export. Report the incompatible deployment contract, choose an authorized backend boundary, and do not advertise working server behavior from a static build. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A feature works in a development server but depends on a server-only write while the accepted target is a static export.

Expected behavior: Report the incompatible deployment contract, choose an authorized backend boundary, and do not advertise working server behavior from a static build.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/nextjs-application-architecture/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Routing](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Caching](https://nextjs.org/docs/app/getting-started/caching)
- [Data security](https://nextjs.org/docs/app/guides/data-security)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
