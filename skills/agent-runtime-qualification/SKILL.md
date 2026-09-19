---
name: agent-runtime-qualification
description: "Qualify one controller-to-agent execution interface for lifecycle, event identity, cancellation, authentication, and uncertain outcomes before admitting real tasks."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Runtime Adapter Qualification

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Qualify one controller-to-agent execution interface for lifecycle, event identity, cancellation, authentication, and uncertain outcomes before admitting real tasks. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Choose one interface for the controller

Inventory the existing launcher and choose the interface it actually needs. A controller already speaking a local app-server protocol need not be wrapped in a second SDK orchestrator. A bounded command-line job may use a JSON event stream. Record the executable/protocol version and supported capabilities.

### 2. Use a disposable canary

Define a harmless task, private scratch worktree, expected output, bounded duration, and independent check. Derive account and permissions from the trusted environment. Verify the effective authentication mode without exposing tokens. No implicit alternate account or separately billed fallback is allowed.

### 3. Follow real lifecycle evidence

Bind task, attempt, controller epoch, worker session and available source event IDs. Distinguish local sequence numbers from provider IDs. Preserve command failure, interruption, missing terminal events, and incomplete usage. A stream closing or process exiting zero is not integrated acceptance.

### 4. Exercise failure seams

Test a wrong worktree, unsupported approval request, interrupted event stream, expired credentials and quota failure with suitable non-billed fixtures. Test cancellation against real owned process/session identity; signal delivery is not proof every child or remote effect stopped. Unknown effects must be reconciled before retry.

### 5. Report qualification by capability

Record which startup, approval, cancellation, resume and usage behaviors actually ran. A saved-event parser test qualifies parsing only. Keep the prior execution path available. Hand accepted artifacts to independent validation and integration; the worker may not define its own success condition.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

The interface does not expose approval handling required by this workload. Mark that capability unsupported and use the qualified fallback instead of auto-approving everything.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

A cancelled worker has already written a patch. The adapter retains the patch and records interruption; an independent reviewer decides reuse. No task is closed merely because cancellation returned.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [Codex noninteractive execution](https://developers.openai.com/codex/noninteractive/)
- [Codex app-server](https://developers.openai.com/codex/app-server/)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
