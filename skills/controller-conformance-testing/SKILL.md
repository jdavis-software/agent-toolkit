---
name: controller-conformance-testing
description: "Test a selected controller against deterministic readiness, restart, cancellation, retention, stale-attempt, and independent-acceptance scenarios before deployment."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Controller Conformance Testing

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Test a selected controller against deterministic readiness, restart, cancellation, retention, stale-attempt, and independent-acceptance scenarios before deployment. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Freeze a small behavioral contract

Select one controller and a disposable workload. Record required operations and installed revision. Define expected transitions independently of the implementation. Do not adopt a controller merely because it uses the preferred language or provides a dashboard.

### 2. Bind observable actions

Implement a narrow trusted adapter that can set up scratch tasks, apply actions, observe actual state, and dispose only positively owned fixtures. Capture source and evidence outside removable workspaces. Apply process and time limits outside an in-process test harness.

### 3. Exercise critical failures

Test filtered-out blockers, restart with a live or uncertain worker, cancellation without completion, dirty/untracked source retention, superseded-attempt submission, failed integration checks, and zero process exit without acceptance. Confirm the test oracle detects a deliberately broken fixture for each requirement.

### 4. Verify implementation paths, not hooks alone

Inspect actual deletion and finalization paths. A failed pre-removal hook is not protection unless the caller honors the veto. Check startup, initialization failure and terminal-task cleanup paths. Preserve evidence before authorized removal; never point initial tests at a real backlog.

### 5. Make an adoption decision

Report passed, failed and untested behaviors by exact controller version. Keep one lifecycle authority. Adapt only small gaps; retain the existing launcher when qualification would become a major fork. The shipped synthetic fixture suite does not qualify Symphony, Contrabass or any live tracker.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

A controller ignores a failed retention hook and deletes the directory. Fail the actual retention case; adding more warnings to the hook is not a repair.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

The reference fixture passes seven cases. Seven deliberately defective variants each fail their named case. A real adapter must repeat those behaviors against the actual selected controller.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [Symphony specification](https://github.com/openai/symphony/blob/main/SPEC.md)
- [Git worktrees](https://git-scm.com/docs/git-worktree)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
