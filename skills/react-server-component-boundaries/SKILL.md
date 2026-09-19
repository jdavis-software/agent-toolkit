---
name: react-server-component-boundaries
description: "Keep server-only data and execution out of client graphs while composing small interactive React islands with explicit serialization and hydration contracts."
metadata:
  version: "0.1.0"
---
# React Server Component Boundaries

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Keep server-only data and execution out of client graphs while composing small interactive React islands with explicit serialization and hydration contracts. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Identify module and render boundaries

Read the actual framework support and imports. A client directive defines a module-graph boundary; it is not permission to import private services. Rendering server-provided children through a client shell differs from importing server implementation into that shell.

### 2. Reduce the client surface

Keep data preparation and noninteractive rendering server-side where supported. Move the boundary down to the interactive subtree. A provider should wrap only the portion needing its client context, without turning every unrelated component into client code.

### 3. Project safe values

Return only the fields the browser needs through supported serializable shapes. Avoid leaking tokens, internal roles, provider secrets, arbitrary class instances or extra database columns. Use server-only guards where the framework supports them, but still review the resulting artifacts.

### 4. Make the first render agree

Control locale, time, random identifiers, storage and viewport-dependent behavior so initial server and client content agree. Do not blanket-suppress hydration warnings. Use supported IDs and post-mount behavior only for genuinely browser-dependent details.

### 5. Exercise the boundary

Test server-only import rejection, anonymous/authorized payloads, repeated requests from different identities and hydration after navigation. Inspect emitted JavaScript and serialized data as well as markup. A CSS-hidden value is still sent to the browser.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A harmless-looking shared barrel re-exports a server database helper into a client component. Split the export boundary, fail an intentional forbidden-import fixture, and inspect the browser bundle and serialized props for private values. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A harmless-looking shared barrel re-exports a server database helper into a client component.

Expected behavior: Split the export boundary, fail an intentional forbidden-import fixture, and inspect the browser bundle and serialized props for private values.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/react-server-component-boundaries/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Server/client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Server Components](https://react.dev/reference/rsc/server-components)
- [Data security](https://nextjs.org/docs/app/guides/data-security)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
