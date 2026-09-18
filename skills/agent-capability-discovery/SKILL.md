---
name: agent-capability-discovery
description: "Build an expiring capability inventory from actual worker and tool probes while separating advertised, observed, unavailable, and authorized operations."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Agent Capability Discovery

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Build an expiring capability inventory from actual worker and tool probes while separating advertised, observed, unavailable, and authorized operations. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Identify the execution environment

Record host, tool adapter, repository/worktree binding, supported model selection, and configured limits. Inspect current tools before assuming that a name, installed plugin, or parent connection implies child-agent availability.

### Probe narrowly

Use read-only capability discovery and a small approved smoke probe. Record operation, version, response, and time. Do not spend provider credits, install global configuration, or invoke write operations just to discover capabilities.

### Separate capability from authority

Record technical availability and permitted effects independently. A browser can navigate without being authorized to send a message. Keep credentials and private roots out of public registries; a capability tag cannot elevate authority.

### Bind and expire the inventory

Give each worker a stable identifier, capacity, supported phases, and an expiry. Recheck after configuration or permission changes and inside delegated workers. Agentflow validates a supplied registry; it does not perform these live probes.

## Output

A versioned registry plus probe evidence, expiry, missing capabilities, and distinct authorization notes. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

A registry is expired or rooted in another worktree: refresh it or report the task blocked, not supported. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

A parent has browser tools but its coding child does not. Route UI verification to a worker with a verified browser instead of assuming inherited access. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.
