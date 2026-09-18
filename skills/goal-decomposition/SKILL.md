---
name: goal-decomposition
description: "Turn a broad engineering goal into independently reviewable outcomes, explicit uncertainty, dependency edges, and a bounded first execution wave."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Goal Decomposition

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Turn a broad engineering goal into independently reviewable outcomes, explicit uncertainty, dependency edges, and a bounded first execution wave. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Define the finish line

Read the accepted request, constraints, and relevant repository state. Describe what a user, caller, or operator must observe when the goal is met. Separate required outcomes from suggested implementation. Preserve unresolved behavior rather than asking a worker to invent it.

### Split at evidence boundaries

Create tasks around observable artifacts or behaviors. Put foundational contract decisions before dependent implementations. Avoid slicing only by file count, creating one agent per function, or parallelizing several agents onto an unresolved shared schema.

### Make each dependency explain itself

For each edge, state the required input and who accepts it. Record ownership, exclusions, independent check IDs, and a handoff. Use the existing Work Packet Planner to validate graph cycles and conflicting ownership instead of inventing a second task schema.

### Choose the first useful wave

Distinguish ready, decision-blocked, resource-blocked, and deferred work. Prefer a small validated end-to-end path before wide fan-out. A complete graph does not authorize execution, and a planned check is not a result.

## Output

A goal contract, task graph, edge rationale, acceptance owner, and first ready wave. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

Two proposed tasks both own the API specification with no ordering: assign one owner or establish a dependency before dispatch. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

An export feature needs a wire contract, two adapters, a client, and acceptance tests. The contract is accepted before adapter/client work fans out; integration validates their combination. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
