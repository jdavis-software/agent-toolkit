---
name: typescript-type-design
description: "Design domain types and runtime input boundaries that distinguish legal states, optional values, and exhaustive transitions without unsafe assertions."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# TypeScript Type Design

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Design domain types and runtime input boundaries that distinguish legal states, optional values, and exhaustive transitions without unsafe assertions. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Find actual input boundaries: HTTP, storage, environment, jobs, or plugins. Treat unvalidated external values as unknown. State which validation permits constructing trusted domain values; compile-time types do not validate JSON.

### 2. Choose the supported contract

Model dependent fields with a discriminated union rather than an optional-field bag. Specify missing versus undefined versus null semantics. Use branded identifiers only with controlled constructors and validation.

### 3. Implement or qualify the path

Keep exported types deliberate and local inference simple. Prefer inspectable types over unbounded generic machinery. Choose literal unions, enums, or runtime objects for their actual runtime/packaging needs rather than assuming one is universally superior.

### 4. Exercise failure and integration seams

Add compile-time negative fixtures and exhaustive handlers. Exercise runtime validators with malformed input, null/absent fields, unknown versions, enum additions, numeric limits, serialization, and documented errors. Expected behavior comes from the accepted contract, not the implementation alone.

### 5. Verify and hand back evidence

Review emitted declarations and supported consumers. Specify whether unknown fields are rejected or preserved. Do not widen public contracts or use any/double assertions merely to make a failing check pass.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

An API adds an enum value that an old client receives: use the documented unknown-value policy; local exhaustive types do not validate future wire values. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Represent a job as queued, running, succeeded with an asset, or failed with an error. Validate external job data before creating the corresponding union member. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
