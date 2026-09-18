---
name: context-budget-planning
description: "Allocate task context by relevance and authority while preserving accepted constraints, high-value code, unresolved failures, and recoverable references."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Context Budget Planning

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Allocate task context by relevance and authority while preserving accepted constraints, high-value code, unresolved failures, and recoverable references. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Inventory context needs

Identify the question, accepted contract, current source, active decisions, and evidence needed for the next action. Separate stable instructions from changing observations and untrusted retrieved content.

### Allocate the working packet

Prioritize constraints and relevant source before verbose history. Include concise summaries with source references and fingerprints, plus room for tool results. Do not guess exact token counts where the host does not expose them.

### Disclose progressively

Start with the smallest useful packet and retrieve deeper references only when needed. Keep omitted context discoverable through canonical paths. Do not remove constraints or failures merely to fit a context limit.

### Verify after reduction

Check that the child can still name its goal, accepted inputs, exclusions, required checks, and unresolved issues. Refresh source identities after changes. Provider prompt caching is a separate version-qualified optimization, not a reason to retain stale context.

## Output

A context allocation, included/omitted references, authority and freshness notes, and a child-readiness check. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

The accepted schema is omitted to reduce size: restore that contract and remove lower-value history instead. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A worker fixing one retry seam receives the accepted effect contract, activity boundary, and failure case rather than an entire company knowledge base. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
