---
name: subagent-execution-contract
description: "Give a delegated worker a bounded goal, accepted source identity, explicit tools/effects, resource limits, check requirements, and a result envelope."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Subagent Execution Contract

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Give a delegated worker a bounded goal, accepted source identity, explicit tools/effects, resource limits, check requirements, and a result envelope. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Resolve the binding

Use real repository paths and accepted contract/source revisions in the private adapter. Include the task ID, attempt ID, context fingerprint, owned/read-only/excluded paths, and prerequisites. Do not include tokens or secrets in the message.

### State permissions independently

List the permitted tools and effect classes, approval requirements, and escalation route. Bind technical controls in the host/server. Instructions alone do not sandbox the worker, and the parent cannot delegate authority it does not possess.

### Define completion and interruption

Specify expected artifacts, independent acceptance checks, budget/deadline, progress signals, and stop conditions. Distinguish submitted output from reviewer acceptance. Explain how to preserve partial work and report indeterminate effects after interruption.

### Confirm the child sees the contract

Probe actual context and tool access in the child environment. Have it report unavailable bindings before work starts. Bind returned output to this attempt and input identity; reject results for a different task or stale base.

## Output

A task/attempt envelope plus an acceptance schema and a confirmed child capability binding. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

The child cannot access a required file or tool: return a precise blocked result rather than fabricate the missing context. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

An adapter worker may edit one package and its tests but may not regenerate shared contracts; a discovered contract gap is returned to the owner. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
