---
name: mcp-adapter-design
description: "Design thin MCP adapters with bounded schemas, trusted application identity, shared authorization, and explicit effects rather than treating instructions as permissions."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# MCP Adapter Design

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Design thin MCP adapters with bounded schemas, trusted application identity, shared authorization, and explicit effects rather than treating instructions as permissions. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map guidance/context to suitable resources or prompts and executable operations to tools. A skill file is not an MCP server. Avoid remotely exposing every internal helper without a concrete operational contract.

### 2. Choose the supported contract

Reuse shared application policy and use cases while keeping transport parsing/error translation thin. Do not allow arbitrary tenant, filesystem root, or elevated identity selection through client arguments.

### 3. Implement or qualify the path

Define schemas, bounds, pagination, timeout/cancellation, error categories, and effects. Avoid general arbitrary-shell tools. Tool annotations describe behavior; enforcement belongs in the server and application.

### 4. Exercise failure and integration seams

Validate credentials, audience, scopes, and required approval at execution. Do not pass through unrelated downstream tokens or treat untrusted tool output as authoritative instructions.

### 5. Verify and hand back evidence

Test initialization/capabilities, discovery, malformed arguments, oversized output, cancellation, authorization, tenant boundaries, and effect errors. Verify delegated-agent access independently from the parent connection.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A client supplies another tenant’s ID in valid JSON: enforce trusted identity and reject unauthorized access regardless of schema validity. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

A bounded check tool takes an approved check ID and validated lane ID; the server maps them to allowed commands rather than accepting a shell string. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [MCP security](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
