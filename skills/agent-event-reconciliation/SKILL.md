---
name: agent-event-reconciliation
description: "Normalize runtime event captures with explicit identity, usage basis, duplicate handling, missing coverage and independent acceptance boundaries."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Event and Usage Reconciliation

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Normalize runtime event captures with explicit identity, usage basis, duplicate handling, missing coverage and independent acceptance boundaries. Activate for a task that crosses this boundary, not every edit.

## When not to use

Do not turn a trivial change into an orchestration project. Do not replace the selected controller, invoke billed agents, inspect credentials, install software or modify private project configuration without the required task authorization.

## Inputs

Resolve the accepted task and source identity, installed tools and interface versions, owned scratch scope, allowed effects, independent checks and expected outputs. Private roots, identities, credentials references and policy bindings stay in the consuming adapter.

## Procedure

### 1. Declare the source interface

Record one runtime and protocol version plus task/attempt binding. Do not mix slash-separated app-server notifications with dot-separated exec events. The supplied import recipe supports saved Codex exec JSONL only; other sources need separately qualified mappings.

### 2. Retain identity without exporting content

Preserve source identifiers when present and label locally assigned sequences. Normalize event types, terminal outcomes and usage while omitting raw prompts, commands, patches, tokens and error bodies from public summaries. Keep any raw capture under approved private retention.

### 3. Reconcile counters according to their basis

Distinguish per-turn deltas from cumulative counters and explicitly identify counter epochs. Deduplicate only by reliable identity; two equal totals in different turns are not duplicates. Detect conflicts under the same ID, missing observations, overflow and counter resets. Cached input and reasoning output are breakdowns, not additional totals.

### 4. Preserve partial or failed work

An interrupted stream has missing coverage even when some totals are known. Do not replace unknown usage with zero or infer subscription charges from a fixed plan price. Keep failed attempts in the record. Never use a turn-completed event to create candidate acceptance.

### 5. Replay and integrate deliberately

The same saved capture must yield the same summary. Link the summary as evidence in the existing run ledger; do not auto-replay journal mutations or grant approval. Qualify captured fixtures against the installed runtime before claiming full event coverage. Protect the authoritative writer from duplicate or conflicting imports.

## Output

A bounded implementation or qualification record: task/attempt and revision, observations with provenance, actual checks and artifacts, explicit mismatches/unknowns, and the next justified action. Separate passed, failed, blocked and not-run states.

## Failure handling

A cumulative counter falls after reconnect. Keep previous known usage, flag the reset, and require an explicit new epoch or reconciliation; do not interpret the lower value as negative cost.

Preserve unaccepted work and evidence. Unknown ownership or effects require reconciliation, not a speculative retry, broad cleanup, or weaker acceptance.

## Example

Observations of 1200 and 1700 cumulative tokens account for 1700 overall. Two independent 1200-token turn reports account for 2400. Replaying one capture does not add a new accepted task.

This is a synthetic scenario. The companion tests do not establish that an installed agent host follows the whole procedure.

## Executable support and evaluation

[Harnesskit contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESSKIT.md) specify implemented probes, snapshot checks, saved-event imports and the controller adapter suite. The structural recipe is in `evals/structural-refactoring/`. Use only the part needed for this task. `references/scenarios.json` contains not-run trigger, boundary and non-trigger host-evaluation inputs.

## Technical references

- [Codex JSON events](https://developers.openai.com/codex/noninteractive/)
- [Codex app-server](https://developers.openai.com/codex/app-server/)

Check the installed version. These are technical references, not imported skill bodies or a controller adoption decision.
