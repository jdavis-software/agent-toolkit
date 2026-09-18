---
name: agent-result-integration
description: "Accept worker results against independent contracts and integrate combined changes without treating individual green branches as release evidence."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Result Integration

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Accept worker results against independent contracts and integrate combined changes without treating individual green branches as release evidence. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Check result identity

Resolve the task, attempt, accepted base, owned diff, artifact identities, and checks actually executed. Reject results from a stale task contract or a different worktree. Treat an agent narrative as a summary, not the evidence source.

### Review independently

Use accepted requirements and checks that the implementation worker cannot silently weaken. Inspect prohibited side effects and out-of-scope changes. A different reviewer label is not proof of actual reviewer independence; bind that in the host.

### Validate the combination

Assemble the authorized integration candidate in an owned lane and run relevant combined checks. Reconcile contract, database, worker, and deployment-order interactions that isolated tests may miss.

### Record acceptance precisely

Distinguish submitted, accepted for integration, integrated, and published. Bind the record to the actual candidate and artifact. A journal acceptance event does not perform a Git merge or grant release permission.

## Output

Result acceptance or rejection, exact combined candidate, executed evidence, unresolved conflicts, and separate release status. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

The worker changed the acceptance test to match its output: restore independent review before accepting the result. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A new server and client each pass their local fixtures but disagree on a nullable field. Combined integration rejects the mismatch before publication. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
