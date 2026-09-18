---
name: subagent-lifecycle
description: "Track allocated, running, submitted, accepted, failed, and indeterminate work with explicit ownership and recoverable interruption."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Subagent Lifecycle

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Track allocated, running, submitted, accepted, failed, and indeterminate work with explicit ownership and recoverable interruption. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Separate observation from control

Use one authoritative run/task/attempt identity. Record transitions from actual launcher and reviewer observations, not optimistic agent messages. Agentflow records supplied events; it is not itself the launcher.

### Make transitions conditional

Require dependencies and stable inputs before starting. Require an output artifact and evidence before submission, and independent declared review before acceptance. Keep terminal outcomes distinct from a cancelled local wait.

### Handle interruptions conservatively

On lost contact, preserve work and treat effect state as unknown until the worker or provider is reconciled. Retain logical resource reservations while uncertain work may still be active. Do not assume lease expiry proves inactivity.

### Release owned resources deliberately

Let an ownership-aware private lifecycle controller release resources after inactivity and source-preservation checks. Retain diagnostic and acceptance records; never broadly clean worktrees or shared databases as a lifecycle shortcut.

## Output

A current state, transition history, owner/attempt identity, unresolved effects, and next safe action. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A running attempt times out: keep it out of automatic retry until there is evidence that repeating it is safe. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A worker uploads an artifact, then disconnects before reporting success. The run remains indeterminate until the artifact and external effect are reconciled. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
