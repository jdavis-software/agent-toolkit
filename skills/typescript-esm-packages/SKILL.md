---
name: typescript-esm-packages
description: "Build ESM package boundaries against real Node/browser consumers, export maps, declaration files, and initialization behavior instead of workspace-only imports."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# TypeScript ESM Packages

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Build ESM package boundaries against real Node/browser consumers, export maps, declaration files, and initialization behavior instead of workspace-only imports. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Read package type, module/moduleResolution settings, extensions, export conditions, and the actual runtime. Match Node-targeted resolution to Node and bundled resolution to the bundler. TypeScript path aliases do not automatically create runtime aliases.

### 2. Choose the supported contract

Define supported entry points and declarations. Keep internal files private through an explicit export map. Check emitted JavaScript extensions and imports. Add CommonJS output only for an actual supported consumer and test that output separately.

### 3. Implement or qualify the path

Inspect import-time side effects, environment access, server dependencies in browser entry points, and dependencies exposed by declarations. Use type-only imports where appropriate. Importing a library must not silently launch workers or open a database.

### 4. Exercise failure and integration seams

Create a local package archive using the repository package manager. Exercise it in disposable consumers without publishing to a registry. Test public subpaths, types, and intentional private-subpath rejection against the packed artifact.

### 5. Verify and hand back evidence

Reconcile editor, tests, and production imports. Distinguish missing build output, invalid exports, extension mismatch, and unsupported runtime. Do not make all internals public to hide a resolution failure.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A downstream consumer requires CommonJS: record and test a deliberate compatibility route rather than claiming ESM is automatically sufficient. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

An SDK source alias works inside the monorepo but fails outside it. A consumer of the packed artifact tests the corrected public JavaScript and declaration entry points. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Node packages](https://nodejs.org/api/packages.html)
- [TypeScript modules](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
