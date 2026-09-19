---
name: engineering-experiment-analysis
description: "Analyze predeclared engineering comparisons with complete task and attempt records, correct pairing and explicit uncertainty instead of equating fewer tokens with better results."
metadata:
  version: "0.1.0"
---
# Engineering Experiment Analysis

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Analyze predeclared engineering comparisons with complete task and attempt records, correct pairing and explicit uncertainty instead of equating fewer tokens with better results.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Reconstruct the experimental question

Read the frozen workload, outcome definition, baseline, candidate configuration and stopping rule. Identify the independent unit, repeated attempts, pairing, blocks, run order and cache policy. A repeat on one task is not another independent task. Distinguish randomized comparisons from observational logs before any causal interpretation.

### 2. Establish usable observations

Apply Dataset Readiness Review first. Retain unsuccessful and timed-out tasks in outcome accounting and preserve unknown duration or usage as unknown. Check protocol changes, condition leakage and shared resource contention. Do not drop inconvenient trials to make a ratio look better.

### 3. Compare like with like

Choose the estimand explicitly: acceptance rate, end-to-end completion, accumulated attempt execution, total provider usage or another predeclared outcome. Use within-task differences for paired workloads. Summing attempt durations is not wall-clock latency when work overlaps. Report the population used for each metric and any complete-case selection.

### 4. Separate description from inference

The included experiment command supplies descriptive paired differences for the supplied dataset, including all attempts through acceptance. It does not calculate confidence intervals, statistical significance or recommend adoption. For inferential claims, choose a design-appropriate established numerical library, check assumptions, account for clustering and multiplicity, and justify precision from the actual independent sample size. A p-value is not the probability that the claim is true.

### 5. Report tradeoffs and limits

Present acceptance alongside cost/time, absolute differences alongside relative changes, and missing coverage alongside reported totals. Preserve failed candidates and protocol deviations. State what evidence would justify a follow-up rather than claiming universal superiority from a small canary. Link conclusions to immutable inputs and independently reviewed criteria.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

All fast candidate runs succeeded, but failed candidate tasks were removed from the CSV. The fixed workload completeness check fails; do not report a favorable average over the remaining rows. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

Three synthetic tasks run under baseline and candidate conditions. One baseline task needs two attempts; one candidate never reaches acceptance. The report counts the failed candidate, adds both baseline attempts, and reports timing differences only for the two accepted complete pairs, explicitly not for the entire workload. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [NIST paired observations](https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm)
- [NIST experimental design](https://www.itl.nist.gov/div898/handbook/pri/section3/pri3.htm)
