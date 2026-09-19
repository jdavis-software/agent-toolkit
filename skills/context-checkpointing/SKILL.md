---
name: context-checkpointing
description: "Preserve task state across compaction or handoff with source-backed decisions, unresolved failures, current artifacts, and explicit freshness checks."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Context Checkpointing

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Preserve task state across compaction or handoff with source-backed decisions, unresolved failures, current artifacts, and explicit freshness checks. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Capture the accepted state

Record the task/run/attempt IDs, accepted base, current source state, owned paths, active resources, artifacts, and completed checks. Distinguish pending decisions and proposed experiments from accepted requirements.

### Preserve uncertainty

Include failed experiments, blocked checks, ambiguous external effects, and remaining budget. Do not let a friendly summary erase the conditions that made an action unsafe or inconclusive.

### Link rather than duplicate

Use canonical decisions and source references with versions or observed fingerprints. Keep private context under private access policy and separate durable knowledge from a transient task checkpoint.

### Rehydrate cautiously

On resume, inspect referenced files and actual running/resource state. Recheck stale inputs and approvals. A checkpoint is context for recovery, not proof that commands ran, side effects completed, or a worker stopped.

## Output

A compact recovery packet with authoritative references, actual/unknown state, unresolved work, and required rechecks. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A checkpoint says tests passed but names no revision or output: retain the claim as unverified and rerun the required check where authorized. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

Before compaction, the worker records that a provider call may have succeeded and the response is missing; the resumed worker reconciles instead of submitting it again. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.

## Revision-bound checkpoints

Record task/attempt/epoch, accepted contracts, Git-visible fingerprint, required generated-input hashes, completed checks, rejected approaches, unresolved questions and next discriminating experiment. For each rejected approach, name what changed evidence would justify retrying it. Never carry benchmark answers between independent runs.

Revalidate referenced files and access on resume; stale or inaccessible sources remain explicit. Harnesskit observe supplies a Git-visible fingerprint, not ignored artifacts, unsaved editor buffers, credential state or atomic snapshots.
