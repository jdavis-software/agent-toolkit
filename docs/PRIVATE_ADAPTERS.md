# Public core, private adapters

The public toolkit should solve reusable engineering problems. A private project supplies context, not a second hand-edited copy of the same skills.

## Three separate layers

**Public packages:** canonical `SKILL.md` instructions, synthetic examples/scenarios, optional helper implementations, and versioned bundle selections. These contain no private repositories, credentials, customer inputs, production queue names, or unpublished company contracts.

**Private bindings:** a reviewed toolkit commit and bundle digest, repository/worktree roots, accepted API/schema revisions, project-owned check IDs and argument arrays, resource allocation policy, host capabilities, service identities, approvals, and protected evidence destinations. Keep actual secret values in the appropriate secret system, not in skill text or resolved manifests.

**Runtime adapter:** an internal CLI/MCP/agent integration that validates those bindings and supplies task-scoped context or executes bounded operations. This layer must enforce its own authentication, authorization, tenant ownership, side-effect policy, input validation, and resource limits. The public resolver does not implement this layer.

## Suggested binding contract

This is a design checklist for a future private schema, not an implemented endpoint or a supported input file for `bundle.mjs`.

| Field group | Private responsibility |
| --- | --- |
| Source pin | Reviewed repository, full commit, selected bundle, accepted bundle/file digests |
| Workspace identity | Validated root/worktree and accepted base; avoid a server silently rooted in another checkout |
| Canonical inputs | Approved API/schema/policy locations and revisions; distinguish experiments from accepted decisions |
| Check registry | Stable operation IDs mapped to project-owned executable and argument arrays; no arbitrary shell-string field |
| Tool bindings | Actual compiler, semantic navigation, task graph, browser, database, and workflow capabilities |
| Effect policy | Explicit read/write/network/production boundaries, approvals, tenant scope, cancellation and retry rules |
| Resource policy | Output directories, port/database/queue allocation, concurrency budgets, lease and cleanup ownership |
| Evidence policy | Protected output location, redaction, retention, source-state identity, and permitted publication |

A project may narrow a skill's scope or provide concrete commands. It must not reinterpret a bundle as permission to bypass host, repository, or organization policy. Public guidance is subordinate to applicable policy and the user's actual authorized task.

## Suggested MCP surfaces

Expose small, versioned resources or prompts for guidance and task context. Expose tools only for stable bounded operations with reviewed contracts. For example, a check operation may accept an approved check ID and a validated lane ID. The server resolves those IDs to an allowed command and workspace; the caller does not provide an unrestricted command line or tenant identity.

Use the protocol/SDK supported by the consuming host and test initialization, capability negotiation, discovery, output limits, cancellation, invalid arguments, authorization, and errors. Verify delegated-agent availability separately from the parent connection.

Prefer a thin adapter over a duplicated business-policy layer. HTTP, MCP, CLI, workers, and SDK entry points should converge on shared application use cases where appropriate. Reusable skills can guide this design but cannot enforce it by themselves.

## Update protocol

Select a reviewed public commit; obtain a clean isolated checkout; resolve the intended bundle with `--expected-revision`; compare accepted file and bundle digests; review changed instructions and helpers; then run private binding and host behavior tests. Promote the new pin only after relevant checks pass. Keep the old pin and a recovery path.

Do not silently follow a moving branch in production tooling. Do not regenerate private overlays into this public repository. Avoid overriding an entire skill body to change one command; bind the command at the private boundary instead. Treat source updates, private-policy updates, and execution authorization as different decisions.

## Adoption boundary

The public repository supplies skills, bundle selection, and a read-only resolver. It does not install private company integrations, configure identities, connect production databases, authorize a provider call, or create internal MCP servers. Product-specific adoption needs its own approved implementation and tests.

Technical protocol references: [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [MCP resources](https://modelcontextprotocol.io/specification/2025-11-25/server/resources), and [security guidance](https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices). Use documentation matching the installed protocol and SDK versions.
