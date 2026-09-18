---
name: agent-permission-delegation
description: "Reduce child-agent authority to the intersection of parent authority, task needs, organization policy, and currently approved effects."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Permission Delegation

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Reduce child-agent authority to the intersection of parent authority, task needs, organization policy, and currently approved effects. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Enumerate authority sources

Separate authenticated identity, project membership, tool capability, policy, and task approval. Do not treat skill metadata, an agent role label, or a capability registry as a credential.

### Narrow the child binding

Grant only required tool operations, resources, tenants, effects, and lifetime. Reuse shared application authorization across transports. Avoid general shell or arbitrary filesystem access when a bounded operation is sufficient.

### Recheck changes

Define revocation, expiry, tenant changes, and delegation-chain limits at the real execution boundary. A child may have less authority than its parent; it must not gain authority by spawning grandchildren.

### Test denial paths

Use nonproduction fixtures to attempt unauthorized reads, writes, cross-tenant access, and privileged fallback. Assert absence of side effects, not only an error message. Agentflow checks declared metadata only; the private runtime enforces access.

## Output

A least-privilege delegation binding, policy/identity sources, expiry/revocation rules, and executed denial evidence. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A child requests broader access than the parent holds: deny and escalate through the legitimate owner, never self-authorize. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A parent can publish a repository, but its implementation child only receives local source and check access. Publication remains a separate approved operation. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
