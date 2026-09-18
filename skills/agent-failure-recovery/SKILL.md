---
name: agent-failure-recovery
description: "Classify agent failures, preserve evidence, and choose bounded retries or reconciliation without repeating costly or unsafe effects."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Failure Recovery

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Classify agent failures, preserve evidence, and choose bounded retries or reconciliation without repeating costly or unsafe effects. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Classify the failure boundary

Separate task ambiguity, missing capability, dependency failure, tool/process failure, budget exhaustion, and lost contact. A provider timeout after acceptance differs from a request rejected before any effect.

### Preserve the attempt

Keep inputs, worktree changes, observed outputs, error and tool identities, and actual/unknown usage. Do not delete failed evidence or repair a report to make an attempt look successful.

### Choose a safe recovery

Retry only with a bounded attempt policy and a reason grounded in changed conditions. Reconcile indeterminate effects first. Route capability failures through discovery and policy again, not an automatic privileged or paid fallback.

### Escalate nonprogress

After the retry limit or repeated unchanged failure, stop new admission and provide a minimal reproducible handoff. Revisit the requirement or environment with its owner instead of repeatedly rewriting unrelated code.

## Output

Failure classification, preserved attempt evidence, retry/reconcile/escalate decision, remaining budget, and recovery check. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

The prior attempt may have completed an irreversible effect: reconcile its state before authorizing any repeat. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A missing browser executable blocks verification. Repair the authorized test environment rather than rewriting the UI or marking browser checks passed. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
