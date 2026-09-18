---
name: nx-graph-and-boundaries
description: "Use current project/task graphs and semantic navigation to map impact, enforce important boundaries, and validate derived configuration without duplicating existing tooling."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Nx Graph and Boundaries

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Use current project/task graphs and semantic navigation to map impact, enforce important boundaries, and validate derived configuration without duplicating existing tooling. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Confirm the CLI, agent, MCP server, and language server resolve the same actual worktree and candidate files. Read existing configuration before generating or installing integrations.

### 2. Choose the supported contract

Use project graphs for dependency structure, task graphs for execution order, and language services for symbols/types. Do not infer deployable ownership or all business dependencies solely from imports.

### 3. Implement or qualify the path

Start with a few actionable rules such as client/server adapter separation. Qualify the enforcement version and language coverage; TypeScript import checks do not automatically enforce Go architecture.

### 4. Exercise failure and integration seams

Where sync generators are configured, introduce derived drift in a disposable fixture, detect it, generate the correction, and confirm the next run is unchanged. Keep substantial code generation explicit.

### 5. Verify and hand back evidence

Test allowed/forbidden edges and representative source, contract, and configuration changes. Record selection and check results. Missing graph edges are correctness defects; making every task depend on everything is not precision.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

A graph server points to main while a child edits a worktree: fix the binding or mark the data stale instead of using it as candidate evidence. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Reject a client import of a server adapter while allowing shared contracts; qualify a separate appropriate check for Go package boundaries. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Nx graph exploration](https://nx.dev/docs/features/explore-graph)
- [Nx boundaries](https://nx.dev/docs/features/enforce-module-boundaries)
- [gopls](https://go.dev/gopls/features/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
