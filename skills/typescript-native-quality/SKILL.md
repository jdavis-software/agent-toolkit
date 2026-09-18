---
name: typescript-native-quality
description: "Compose native compiler diagnostics, formatting, linting, type-aware analysis, and runtime tests as distinct checks with precise task inputs and actual evidence."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# TypeScript Native Quality Checks

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Compose native compiler diagnostics, formatting, linting, type-aware analysis, and runtime tests as distinct checks with precise task inputs and actual evidence. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map current commands to formatting, style/syntax linting, type-aware linting, compiler diagnostics, runtime testing, and emitting builds. Running tsx or a bundler is not a full typecheck. Reuse selected tools rather than installing an overlapping stack.

### 2. Choose the supported contract

Qualify the pinned TypeScript, Oxlint, optional type-aware service, and task-runner combination. Verify required rules and compiler-API consumers. Keep experimental integrations optional until positive and negative fixtures establish the required behavior.

### 3. Implement or qualify the path

Include inherited config, rule files, generator outputs, relevant environment inputs, tool versions, and dependency outputs in task identity. Give concurrent lanes private mutable compiler/build state. Focused selection does not replace mandatory integration gates.

### 4. Exercise failure and integration seams

Separate authorized fix mode from verification. Formatting may change owned files; verification should report drift without editing unrelated files. Re-run relevant checks after a tool modifies source because earlier results describe the previous state.

### 5. Verify and hand back evidence

Seed a formatting violation, forbidden import, type error, and runtime defect in suitable disposable fixtures. Record which gate detects each and that valid fixtures pass. Preserve unsupported-capability and skipped-check labels instead of presenting a blanket pass.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A formatter edits source after tests pass: invalidate the earlier state-specific evidence and rerun the relevant checks. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Formatting passes while a regenerated SDK fails type checking. Report each result independently rather than treating the native toolchain as one interchangeable check. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Oxlint type-aware checks](https://oxc.rs/docs/guide/usage/linter/type-aware)
- [Nx inputs](https://nx.dev/docs/reference/inputs)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
