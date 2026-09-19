---
name: tested-structural-refactoring
description: "Author and qualify scoped structural transformations with positive and negative examples, reviewed diffs, repeat-application checks, and independent runtime/type validation."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Tested Structural Refactoring

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Author and qualify scoped structural transformations with positive and negative examples, reviewed diffs, repeat-application checks, and independent runtime/type validation. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Choose syntax or semantic tooling deliberately

Determine whether the change is purely structural or requires binding/type information. Use language-service refactors where shadowing or overload resolution matters. Read the existing toolchain and use one selected ast-grep binary rather than installing several distributions.

### 2. State the transformation contract

Specify owned files, source shape, replacement shape, behavior to preserve and excluded forms. Keep configuration/version under review. A pattern matching a name does not prove it refers to the intended imported symbol.

### 3. Test the rule before applying it

Write should-match and should-not-match cases, including comments, string literals, computed access and different argument shapes. Check exact replacement output separately from match detection. Seed a wrong rule or missing match to demonstrate the gate fails for the intended reason.

### 4. Review and apply to owned source

Preview the diff in an isolated checkout and verify candidate count and scope. Apply only to authorized paths, then compile and run independent affected behavior checks. Do not apply blanket changes to generated output or unrelated worktrees.

### 5. Prove repeatability and hand back evidence

A second application should make no further changes for an idempotent migration. Compare original and transformed fixture behavior and type checks. Record tool/rule/source identities and excluded cases. The included small TypeScript recipe demonstrates syntax behavior, not universal symbol-safe refactoring.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

The same syntactic function name is locally shadowed. Stop the broad rewrite and use semantic symbol resolution or narrow the accepted fixture scope; do not claim AST matching resolves identity.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

In an owned fixture with explicit debug/logger declarations, migrate a one-argument debug.trace call. Leave string/comment lookalikes, computed access and two-argument calls unchanged, and verify the transformed result and repeat application.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [ast-grep rule tests](https://ast-grep.github.io/guide/test-rule.html)
- [ast-grep rewriting](https://ast-grep.github.io/guide/rewrite-code.html)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
