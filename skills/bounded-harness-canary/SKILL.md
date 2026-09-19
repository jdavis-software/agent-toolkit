---
name: bounded-harness-canary
description: "Evaluate one harness change with a fixed workload, explicit limits, all-attempt accounting, independent integration evidence, and a review decision that preserves unfinished work."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Bounded Harness Canary

Original, project-agnostic guidance. This procedure is experimental; a synthetic report is not an executed live-agent canary.

## When to use

Use before adopting a changed execution profile, controller adapter, context strategy, or worker cap. Start with the smallest representative workload that can expose the relevant failure. Use the existing controller and project-owned checks rather than installing another scheduler.

## When not to use

Do not require a benchmark campaign for an unrelated small edit. This skill does not authorize model spending, changes to account authentication, production execution, or automatic concurrency increases. An unsafe baseline must be repaired before comparison, not retained to exaggerate a speedup.

## Inputs

Resolve the accepted source revision, task identities and acceptance definitions, environment/configuration identity, initial context, cache condition, required gates, worker cap, time/token limits, and stop policy before starting. Keep task and implementation repository identity separate. The accepted protocol lives outside the worker's editable acceptance files.

## Procedure

### 1. Freeze the question and workload

Select one change and a predeclared set of tasks. Keep workload partitioning, independent checks, model settings, permission policy, and cache conditions fixed where they are not the treatment. A removed hard task is unfinished scope, not a faster run. Capture setup and preparation inside the elapsed run boundary rather than starting the clock after them.

### 2. Qualify required controls first

Use the execution-profile, tracker-readiness, and controller-conformance procedures where applicable. A required gate without evidence is missing; an optional experiment may be explicitly deferred. Keep one lifecycle authority. An expired lease or a quiet event stream is not proof that an old worker stopped.

### 3. Start small and preserve every attempt

Use a disposable integration target and authorized resources. Begin with a single-host workload and only the worker cap previously allowed for the trial. Give retries distinct attempt IDs without resetting the original assignment clock. Attribute coordinator, reviewer, integration, and nested-agent usage separately and avoid double-counting parent aggregates as child usage. Preserve failed, cancelled, active, and indeterminate attempts.

### 4. Require independent accepted integration

Record candidate identity, successful independent validation evidence, and confirmation in the designated integration target. Worker exit, a closed issue, and a passing isolated branch do not establish this boundary. At the fixed cutoff, report unfinished tasks without invented completion timestamps. Do not clean up unaccepted source merely to make the run look complete.

### 5. Produce a scoped report

The optional `node tools/harnesskit.mjs canary RUN.json` validates supplied normalized records and computes lead time, batch throughput, implementation retries, overlapping all-role agent time, observed implementation concurrency, and token coverage. It does not query a live tracker, run workers, authenticate evidence, or decide adoption. Required workload rows, independent evidence references, and required gates must be present.

### 6. Decide rather than auto-scale

Review outcomes, resource use, failures, and human intervention alongside the original hypothesis. Do not compare partial completion with a completed baseline or turn one synthetic fixture into a throughput claim. Repeat only as needed under an agreed bounded protocol. Record adopt, reject, or defer with the exact qualified scope. A two-worker result does not qualify eight workers, another host, another runtime, or the combined effect of several untested changes.

## Output

A versioned protocol, complete task/attempt records, independently backed acceptance references, source-bound report, limitations, and a separately reviewed adoption or deferral decision. Keep receipts in the approved private evidence location, outside the measured worktree where needed.

## Failure handling

Stop new dispatch on uncertain ownership, failed required gates, exhausted budgets, or missing authentication. Preserve active/indeterminate work for reconciliation. Missing token observations stay unknown; they cannot establish compliance with a token cap. A partial report remains useful evidence but is not a passing canary.

## Example

A synthetic two-task run ends after 20 seconds. Both tasks are accepted at 12 and 20 seconds; total agent time is 32 seconds because workers and support roles overlap. The report gives 360 accepted tasks per hour for that artificial fixture, not an actual engineering-performance claim. Marking the second task unfinished reduces the accepted subset and makes its completion latency null; deleting it entirely violates the declared workload.

## Companion tooling and evaluation

[Checkpoint and canary contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESS_EVIDENCE.md) define the actual helper scope. Run `node examples/harnesskit/evidence-demo.mjs` for original, synthetic acceptance checks. These tests do not establish agent effectiveness or real controller adoption. `references/scenarios.json` contains not-run host-evaluation inputs.

## Preserve units and experiment structure

Freeze the independent task unit, repeated-attempt grouping, condition order and warm/cold policy before collection. A fixed workload is not automatically a randomized experiment. Dataset Readiness Review checks the observations; Engineering Experiment Analysis interprets them with design-appropriate uncertainty. Do not turn a report over a few fixture tasks into a universal speedup claim.
