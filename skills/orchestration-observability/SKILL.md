---
name: orchestration-observability
description: "Capture task/attempt traces that explain delegation, queue time, context identity, resource pressure, and whether submitted work was actually integrated."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# Orchestration Observability

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Capture task/attempt traces that explain delegation, queue time, context identity, resource pressure, and whether submitted work was actually integrated. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Choose a minimal event contract

Correlate run, parent/child task, attempt, worker, source/context identity, phase, and declared effects. Use bounded metadata and artifact references instead of complete prompts or tool payloads.

### Record actual boundaries

Capture enqueue/start/finish/review/integration observations, failures, and visible usage. Separate queue time from model time and local verification from external latency. Unknown usage remains unknown; never synthesize token counts.

### Protect trace content

Redact credentials, private paths, user data, raw histories, and sensitive prompts before publication. Store raw traces under the product’s access/retention policy. Correlation IDs do not authorize access.

### Use traces to resolve decisions

Identify repeated tasks, stale context, blocked integration, lost children, and review bottlenecks. Replaying a journal reconstructs state; it does not replay nondeterministic model outputs or external effects.

## Output

A redacted trace index, phase timings where observed, result-to-integration mapping, and a focused bottleneck finding. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

Trace payloads contain a credential or private source prompt: restrict and redact them before sharing any diagnostic artifact. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

Ten workers appear busy but completed work waits on one integration lane. Report integration queue growth instead of celebrating model throughput. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.

## Separate execution and acceptance evidence

Use one versioned event importer for the chosen interface. Preserve stable IDs or explicitly local sequences, counter basis, resets and missing usage. A turn terminal notification is not candidate_accepted.

Harnesskit events imports saved Codex exec JSONL or normalized observations without mutating Agentflow. Link its digest and private capture reference as evidence; the authoritative integrator still owns acceptance. No source event alone grants permissions.
