---
name: parallel-dispatch-planning
description: "Select genuinely ready parallel work without colliding on shared files, mutable resources, unstable contracts, or review capacity."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Parallel Dispatch Planning

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Select genuinely ready parallel work without colliding on shared files, mutable resources, unstable contracts, or review capacity. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Verify readiness

Read the current graph and accepted dependencies. Submitted work is not accepted work; starting a child against an unreviewed upstream artifact can multiply rework. Keep decisions and scope blocks explicit.

### Inspect collision domains

Check file and directory ownership, generated outputs, compiler state, ports, databases, queues, and shared provider quotas. A worktree only separates some source state. Account for running or indeterminate previous attempts before scheduling replacements.

### Admit within a shared budget

Reserve tokens and resource slots for the proposed wave, plus capacity for verification/integration. Keep LLM worker count distinct from compiler and database parallelism. Use Agentflow schedule as an offline admission proposal, not an actual dispatcher.

### Revalidate at the execution boundary

The private launcher must atomically reserve resources, confirm approvals and context freshness, and start only the selected bounded operation. Repeatedly running a planning command does not reserve anything or make its proposals unique.

## Output

Selected tasks and workers, resource/token reservations, deferred tasks with reasons, and launch-time checks. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

An interrupted task may still be running on the same files: reconcile it before admitting a conflicting replacement. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

Two independent adapters can run together, but the third implementation waits so review retains a slot. Their shared generated client has one upstream owner. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
