---
name: agent-budget-control
description: "Reserve and reconcile agent, token, tool, and effect budgets without converting missing usage into free execution or silently switching billing paths."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Budget Control

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Reserve and reconcile agent, token, tool, and effect budgets without converting missing usage into free execution or silently switching billing paths. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Define each unit and owner

Separate estimated token work, observed usage, provider cost, subscription limits, tool calls, elapsed time, and business effects. Establish the approved limits and reporting source; do not assume API credits and subscription allowances are interchangeable.

### Reserve before admission

Allocate conservative per-task and run-wide headroom before starting a wave. Include retries, reviewers, context assembly, and integration. A plan’s reservation is not an enforced provider quota; real limits belong in the launcher/gateway.

### Reconcile actual and unknown usage

Record the observed amount even when it exceeds a reservation. Preserve unknown usage conservatively until reconciled instead of dropping failed attempts. Pause further admission when the remaining budget cannot safely cover the next task.

### Make escalation explicit

Offer a smaller scope, a supported cheaper route, delayed work, or an approved budget change. Requalify model/capability and data policy for any fallback. Never silently spend on an API because a subscription worker ran out.

## Output

Budget definitions, reservations, actual/unknown usage, remaining capacity, and a policy-bound next-action decision. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

The provider exposes no usage count: mark it unknown and preserve a conservative charge, not zero. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A failed worker used more tokens than expected. Its usage stays charged, so the next implementation waits while verification retains its budget. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
