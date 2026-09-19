---
name: agent-loop-detection
description: "Detect repeated no-progress tool calls, equivalent patches, and unchanged failures using bounded evidence windows and explicit stop/escalation criteria."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Agent Loop Detection

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Detect repeated no-progress tool calls, equivalent patches, and unchanged failures using bounded evidence windows and explicit stop/escalation criteria. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Define progress before counting activity

Use accepted artifacts, changed evidence, resolved uncertainty, or a new discriminating experiment as progress. Token output, tool volume, and repeated completion messages are not useful substitutes.

### Compare bounded attempts

Track task/input identity, tool request signature, failure signature, meaningful diff, and result. Redact sensitive arguments. Identify repeated equivalent work without storing full private prompts.

### Distinguish waits from thrash

Respect legitimate backoff, long-running work, and newly changed prerequisites. Set retry limits and an observation window appropriate to the operation, rather than a universal number of identical messages.

### Stop new churn

Preserve work and evidence, stop admitting equivalent attempts, and route to a bounded diagnosis or human decision. Do not kill unrelated processes, clear all caches, weaken tests, or spawn more agents to mask stalled work.

## Output

A loop signature, window and evidence, progress comparison, and safe pause/diagnosis/escalation decision. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A provider is still processing a legitimate long job: use bounded status polling instead of treating every unchanged status as failure. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A worker alternates two import fixes while the same type error persists. Capture the cycle and inspect the actual package-resolution contract before another edit. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.

## Conditional intervention, not permanent supervision

Classify process, service, credentials, quota, human waits and legitimate compilation deterministically first. Only invoke a model reviewer under a predeclared progress rule and a shared global budget.

A reviewer must propose one discriminating experiment, identify a missing decision, narrow the task, or escalate. Bound repeated interventions and recursive reviewers. Record false interventions and the reviewer usage instead of assuming supervision is free.
