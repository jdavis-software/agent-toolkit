---
name: tenant-authorization-boundaries
description: "Enforce tenant-scoped operations across transports, jobs, data, and caches using trusted identity and independent cross-tenant denial tests."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Tenant Authorization Boundaries

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Enforce tenant-scoped operations across transports, jobs, data, and caches using trusted identity and independent cross-tenant denial tests. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map sessions, service accounts, jobs, memberships, and resource ownership. Derive effective tenant/permissions from trusted context; a request tenant ID is not proof of membership.

### 2. Choose the supported contract

Apply shared application authorization across HTTP, MCP, CLI, workers, storage, and administrative paths. Decide which jobs use an accepted authorization snapshot and which recheck policy, including revocation consequences.

### 3. Implement or qualify the path

Review query scopes, row security, cache keys, storage paths, search/vector retrieval, and signed URLs. Test the actual PostgreSQL executing role; owners and bypass roles can behave differently from intended application roles.

### 4. Exercise failure and integration seams

Use independent fixtures for two tenants and role variants. Attempt direct-object access, list/search leaks, mutations, stale credentials, and job/callback confusion. Assert absent side effects as well as response errors.

### 5. Verify and hand back evidence

Keep audit correlation attributable without secrets or sensitive payloads. Test role changes and revocation at their defined boundary. Successful denial fixtures are scoped evidence, not a complete security certification.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Tests run as a table owner that bypasses the intended row policies: repeat with the actual application role and explain the difference. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

A callback identifies a job; the worker loads tenant context from trusted stored ownership rather than an untrusted callback tenant field. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [PostgreSQL row security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [MCP security](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
