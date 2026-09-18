---
name: typescript-7-adoption
description: "Qualify a repository for native TypeScript 7 with a compatibility matrix, separate compiler-API consumers, diagnostic parity, measured performance, and reversible adoption."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# TypeScript 7 Adoption

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Qualify a repository for native TypeScript 7 with a compatibility matrix, separate compiler-API consumers, diagnostic parity, measured performance, and reversible adoption. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Inventory actual compiler commands, package locks, tsconfig inheritance, editor integration, build scripts, CI, and tools importing the TypeScript compiler API. Record which executable each path invokes; a version file alone is not runtime evidence.

### 2. Choose the supported contract

Check official release notes for the exact candidate version. TypeScript 7.0 ships a native compiler without the previous compiler API. Retain a deliberately pinned TypeScript 6 path for integrations that require it. Name its owner and retirement condition instead of making two ambiguous global tsc commands.

### 3. Implement or qualify the path

In an owned branch, compare baseline and candidate diagnostics, declaration output, module resolution, project references, and relevant editor behavior on identical source. Replace removed configuration options deliberately; do not suppress errors wholesale or equate transpilation with checking.

### 4. Exercise failure and integration seams

Exercise Node ESM packages, browser-bundled packages, generated consumers, and compiler-API integrations independently. Test emitted packages from a disposable external consumer, not only workspace aliases. Keep unsupported integrations as explicit bounded blockers.

### 5. Verify and hand back evidence

Measure repeated cold and warm runs with the same workload and hardware. Report wall time, observable memory, diagnostic parity, and aggregate concurrency. Reserve capacity for other lanes. Adopt only qualified paths and retain a tested baseline rollback.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A framework plugin imports the classic compiler API: preserve a scoped compatibility route rather than forcing a native compiler into that API slot. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

An SDK can qualify native checks while an Astro documentation site retains its compatible toolchain. An unrelated Go service is outside this compiler migration. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [TypeScript 7.0 release](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Nx TypeScript 7](https://nx.dev/docs/kb/typescript-7)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
