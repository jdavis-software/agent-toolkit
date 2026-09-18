---
name: agent-task-routing
description: "Match ready tasks to qualified workers using required capabilities, phase, effect policy, availability, and measured tradeoffs without hardcoding provider superiority."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Task Routing

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Match ready tasks to qualified workers using required capabilities, phase, effect policy, availability, and measured tradeoffs without hardcoding provider superiority. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Describe requirements before executors

For each task, specify its needed capabilities, scope, accepted input identity, execution phase, and allowed effects. A language label alone does not establish database, browser, or private-repository access.

### Filter before ranking

Exclude unavailable, expired, unauthorized, incompatible, or capacity-exhausted workers. Then apply a deterministic configured preference among qualifying candidates. Agentflow rank is an explicit policy value, not an automatically learned quality score.

### Treat fallback as a new decision

Recheck context size, structured-output needs, policies, credentials, and budget before changing workers or models. Preserve the same acceptance contract. Do not route to a paid API or weaker permission boundary simply because a subscription worker is unavailable.

### Measure the decision

Record candidates, exclusion reasons, chosen worker, expected limits, and observed outcome. Compare completed accepted work and human intervention, not raw response speed. Leave unknown usage or pricing unknown.

## Output

A routing decision with qualification evidence, tie-breaking policy, fallback conditions, and explicit exclusions. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

No candidate satisfies the required effect policy: return no eligible worker instead of widening permissions. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A browser-only verification task excludes two fast coding workers; an eligible browser worker wins despite a higher configured rank. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
