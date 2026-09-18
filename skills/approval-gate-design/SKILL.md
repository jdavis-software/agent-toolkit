---
name: approval-gate-design
description: "Place approvals at consequential effect boundaries and bind them to exact scope, inputs, identity, expiry, and execution policy."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Approval Gate Design

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Place approvals at consequential effect boundaries and bind them to exact scope, inputs, identity, expiry, and execution policy. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Identify the effect

Classify the requested operation and what can change outside the worker’s local lane. Treat read, local mutation, repository mutation, financial, and production effects separately; categories are a design aid, not a universal legal ranking.

### Bind approval to a specific decision

Present the actual target, diff or payload digest, expected consequences, limits, and alternatives. Record the approver identity and decision through a trusted application. Do not use a generic yes from an unrelated task.

### Validate just before execution

Recheck inputs, scope, policy, identity, expiry, and revocation. Changed consequential inputs require a new decision. Keep approved plans distinct from authorized execution and completed effects.

### Exercise invalid approvals

Test missing, expired, mismatched, revoked, and replayed decisions in a safe fixture. Agentflow’s approval records are caller-supplied scheduling metadata; they do not authenticate an approver or enforce server-side authorization.

## Output

Approval placement, immutable decision context, enforcement owner, expiration/revocation behavior, and boundary tests. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A task input digest changes after approval: stop at the gate and obtain an appropriately scoped new decision. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A deploy was approved for artifact A. A later rebuild produces B; the launcher must not reuse A’s approval simply because the task ID is unchanged. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
