---
name: delegation-evaluation
description: "Evaluate whether delegation improves accepted task outcomes using matched inputs, independent checks, repeated sessions, and explicit handoff/integration scoring."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Delegation Evaluation

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Evaluate whether delegation improves accepted task outcomes using matched inputs, independent checks, repeated sessions, and explicit handoff/integration scoring. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Specify the evaluation question

Compare a concrete delegated workflow with a no-delegation control or another qualified configuration. Pin task corpus, host/model/tool/skill revisions, budget, and acceptance rules before running.

### Control the conditions

Use fresh sessions and isolated public-safe fixtures. Keep requirements and acceptance tests independent from the worker’s implementation convenience. Document unavailable or incompatible comparison features instead of quietly disabling them.

### Score the full path

Measure correct completion, regressions, forbidden effects, interventions, duplicate work, context losses, integration success, elapsed time, and exposed usage. A child’s answer is not an accepted integrated change.

### Report the sample honestly

Repeat tasks, retain failures and sample counts, and show spread. Separate tool tests, scenario inputs, host runs, and real production outcomes. A passing schema or polished demo cannot establish superiority across all agents.

## Output

A matched evaluation protocol, complete run records, independent scores, limitations, and a scoped adoption decision. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A comparator cannot access the required browser: report the mismatch or redesign the comparison instead of claiming an easier run is a fair win. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

Two configurations both produce compiling patches; only one passes the independent cross-tenant denial and combined integration tests. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.

## Small adoption canary

Begin with one host, two disjoint implementation lanes, independent validation and one integration owner. Freeze source/model/tool versions, accepted tests, limits and cache conditions. Minimum safety repairs define the baseline rather than an invented speedup.

Retain every failed, cancelled and unfinished attempt plus operator interventions, time and observed usage. Record a scoped go/no-go decision. A two-lane result does not qualify larger fan-out; no giant benchmark lab is required before a useful canary.
