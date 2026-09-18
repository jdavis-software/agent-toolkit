---
name: resource-aware-agent-scheduling
description: "Budget model workers separately from CPU, memory, database, browser, and build resources while reserving capacity for acceptance and integration."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Resource-aware Agent Scheduling

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Budget model workers separately from CPU, memory, database, browser, and build resources while reserving capacity for acceptance and integration. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Inventory shared bottlenecks

Record active and uncertain model attempts, compiler/test subprocesses, databases, container builds, browser workers, and provider limits. Multiple agent pools can contend for the same machine even when their task graphs are independent.

### Define admission policy

Set global capacity and resource pools from measurements. Reserve a portion for verification/integration. Declare each task’s resource demand, then match ready work to both worker capacity and resource availability.

### Preserve uncertain reservations

When contact is lost, keep the potentially running attempt’s logical resources until the runtime confirms its state. A wall-clock timeout is not proof that a process or provider stopped.

### Measure accepted throughput

Increase concurrency in controlled steps and observe queue, rework, memory, and integrated completion. Agentflow provides a deterministic offline proposal; an atomic private allocator must enforce real reservations.

## Output

Resource pools, review reservation, admitted/deferred tasks with reasons, and measured bottleneck evidence. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

Integration is saturated while implementation output grows: reduce new implementation admission rather than adding more workers. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

Two coding agents can share cached downloads but cannot each consume the only database fixture. Serialize or allocate distinct resources while keeping one review slot. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
