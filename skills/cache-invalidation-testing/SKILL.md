---
name: cache-invalidation-testing
description: "Verify cache reuse with controlled input mutations and fresh reference execution, including generated and ignored outputs, environment, and toolchain changes."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Cache Invalidation Testing

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Verify cache reuse with controlled input mutations and fresh reference execution, including generated and ignored outputs, environment, and toolchain changes. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Separate affected selection, task-result reuse, compiler caches, container caches, and runtime-data caches. A selected task may reuse a valid result; a matching key still does not establish producer trust.

### 2. Choose the supported contract

Create a disposable baseline with source, generator, configuration, toolchain, environment, and fixture identity. Declare expected task invalidation before observing results. Do not delete canonical source or application state to simulate a cold build.

### 3. Implement or qualify the path

Mutate meaningful source, test, unrelated documentation, contract, generated/ignored output, environment, and tool-version inputs one at a time. Include a deliberately omitted dependency that must expose stale reuse.

### 4. Exercise failure and integration seams

Record selection, cache decisions, restored artifacts, and a fresh reference result. Compare meaningful output/behavior rather than hit rates alone. Normalize only documented irrelevant variability and use focused key diagnostics instead of clearing every cache.

### 5. Verify and hand back evidence

Correct the narrow missing relationship and rerun the matrix. Identical generated output may preserve consumer reuse where explicitly supported. Report false misses separately from false hits and keep remote-cache publication isolated.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A cache hits after consumed ignored output changed: prove whether it is stale and correct the actual missing dependency. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Ignored generated validators change while git diff is empty; consumers must revalidate. A no-op generation should not invalidate unrelated applications. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Nx inputs](https://nx.dev/docs/reference/inputs)
- [Go cache commands](https://pkg.go.dev/cmd/go)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
