---
name: execution-profile-audit
description: "Compare an intended agent execution profile with current worktree-bound observations, separating requested settings, resolved configuration, and actual runtime behavior."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Execution Profile Audit

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Compare an intended agent execution profile with current worktree-bound observations, separating requested settings, resolved configuration, and actual runtime behavior. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Name the execution boundary

Identify the controller, its selected worker interface, accepted source revision, and owned worktree. Inspect the repository bootstrap before introducing another manager. The CLI, app server, editor, container, and child agents may not share a configuration.

### 2. Collect narrowly, without secrets

Probe source state and selected executable identity. Obtain model, reasoning, authentication mode, permissions, instruction and bundle identities from the actual worker interface where supported. Preserve a non-secret provenance label and observation time. Never copy authentication stores, full environment dumps, private prompts, or browser sessions into a report.

### 3. Keep three settings distinct

Record requested, resolved, and observed values, including whether a field is startup-only, reloadable, or unknown. Configuration and launch arguments are not proof that the worker applied them. Unsupported observations remain unknown. A successful reload message does not prove every affected service adopted a value.

### 4. Compare the correct source view

Bind observations to the canonical worktree root and Git-visible state fingerprint, including dirty and untracked changes. Reject another checkout, a stale observation, or an edited source state. Identify ignored generated inputs and unsaved editor buffers separately; a Git fingerprint does not cover them.

### 5. Hand back a preflight decision

Return mismatches and unknown required fields before dispatch. Do not repair global settings, expand permissions, select another paid route, or install tools as a side effect. Re-probe after an approved change. Use Harnesskit observe/profile for the documented subset, not as proof of live Codex authentication.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

An MCP observation is rooted in main while the worker owns a feature worktree. Block the required binding and reconnect through the approved adapter; do not merely edit the expected fingerprint.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

The parent requested subscription authentication, but a worker observation reports a different effective mode. Preserve the work and pause rather than guessing the billing path from a model name.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [Codex configuration](https://developers.openai.com/codex/config-basic/)
- [Codex authentication](https://developers.openai.com/codex/auth/)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
