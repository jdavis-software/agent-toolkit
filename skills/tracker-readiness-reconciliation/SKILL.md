---
name: tracker-readiness-reconciliation
description: "Reconcile full task identity, accepted prerequisites, source contracts, and ownership immediately before dispatch without treating labels or filtered queries as acceptance."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Tracker Readiness Reconciliation

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Reconcile full task identity, accepted prerequisites, source contracts, and ownership immediately before dispatch without treating labels or filtered queries as acceptance. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Keep the tracker authoritative

Identify the task repository and implementation repository separately. Use repository-plus-issue identity, not a bare issue number. The controller may keep an attempt ledger but must not create a second editable source of project status.

### 2. Resolve the complete prerequisite set

Use accepted task contracts and authorized tracker reads to resolve dependencies, including those excluded by status or label filters. An absent prerequisite is unknown, not completed. A closed issue is not necessarily an independently accepted implementation.

### 3. Match revisions and evidence

Require each accepted prerequisite to name its relevant contract revision, candidate revision and independent acceptance evidence. Check the task contract and implementation base as well. Do not satisfy a changed dependency with an old acceptance record simply because its issue identifier matches.

### 4. Separate eligibility from claiming

Treat an agent-ready label as a cue. Check current ownership, active or uncertain attempts, resource limits and required approvals through the selected controller. A read-only eligibility result is not an atomic lease. Recheck and claim at the actual execution boundary.

### 5. Explain blocked states

Return unknown, unaccepted, stale, occupied and unauthorized reasons separately. Keep filtered records and tracker errors visible. Harnesskit readiness checks a supplied snapshot and never writes labels, claims work, or authenticates acceptance records.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

Task B depends on A, but A is outside the agent-ready filter. Hold B until A can be resolved and its acceptance established; never turn an empty dependency result into permission.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

A planning issue points to a separate code repository. The adapter reads that mapping and uses the approved implementation worktree instead of cloning the planning repository.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [GitHub issue dependencies](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies)
- [Symphony specification](https://github.com/openai/symphony/blob/main/SPEC.md)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
