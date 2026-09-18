---
name: go-performance-profiling
description: "Investigate Go latency, CPU, allocation, and contention bottlenecks using representative profiles, controlled benchmarks, and correctness-preserving changes."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Go Performance Profiling

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Investigate Go latency, CPU, allocation, and contention bottlenecks using representative profiles, controlled benchmarks, and correctness-preserving changes. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Define the user-visible target: latency, throughput, allocation, startup, or resource use. Include queue and dependency time for an end-to-end claim. Record workload, concurrency, warm state, tools, hardware, and limits.

### 2. Choose the supported contract

Collect baseline profiles appropriate to the symptom: CPU, heap/allocation, blocking, mutex, or trace. Use authorized environments and protect sensitive profiles and diagnostics endpoints.

### 3. Implement or qualify the path

Rank causes from evidence rather than code appearance. Separate computation, lock contention, allocation, database delay, and serialization. Check whether more parallelism increases total resource contention.

### 4. Exercise failure and integration seams

Change one meaningful factor while preserving behavior tests. Re-run equivalent measurements and retain the baseline. Pooling, caching, and batching require correct bounds, lifetime, and invalidation rules.

### 5. Verify and hand back evidence

Repeat measurements and report sample counts and spread. Include memory, latency, correctness, and affected workloads that regress. A microbenchmark improvement is not an application-wide speed multiplier.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A faster microbenchmark doubles peak memory: report both and judge against the predeclared acceptance target. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Most endpoint time is spent waiting for a serialized database operation. Investigate that transaction path rather than rewriting a small JSON helper. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Go diagnostics](https://go.dev/doc/diagnostics)
- [Go benchmarks](https://pkg.go.dev/testing)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
