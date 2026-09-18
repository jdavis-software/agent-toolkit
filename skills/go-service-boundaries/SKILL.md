---
name: go-service-boundaries
description: "Implement cohesive Go packages with thin transports, explicit dependency and transaction ownership, and shared application policy across API, CLI, and MCP entry points."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Go Service Boundaries

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Implement cohesive Go packages with thin transports, explicit dependency and transaction ownership, and shared application policy across API, CLI, and MCP entry points. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Trace the actual feature through go.mod, imports, handlers, application behavior, and persistence. Distinguish files, Go compilation packages, and deployable services. Keep unrelated restructuring out of the task.

### 2. Choose the supported contract

Group behavior that changes together and use internal packages where appropriate. Place interfaces near their consumers when a real substitution boundary warrants them. Avoid global miscellaneous/interfaces packages and tiny forwarding packages.

### 3. Implement or qualify the path

Keep HTTP, CLI, and MCP adapters responsible for transport validation, trusted identity construction, use-case calls, and outcome translation. Business rules and authorization should converge on shared application behavior.

### 4. Exercise failure and integration seams

Pass dependencies explicitly instead of using package globals. Propagate context and assign owners for transactions, goroutines, and cleanup. Avoid hidden commits in low-level repositories and background work started at import time.

### 5. Verify and hand back evidence

Test use-case behavior separately from transport mapping, then exercise a representative transport-to-storage path. Preserve useful error identity through errors.Is/errors.As where appropriate while redacting sensitive public details. Run the actual package and boundary checks.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Package extraction creates an import cycle: fix responsibility ownership rather than creating a service or miscellaneous type package solely to silence the compiler. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

HTTP and an agent tool create a reservation through one use case that owns its transaction; adapters translate the same domain conflict into their documented transport errors. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Go module layout](https://go.dev/doc/modules/layout)
- [Go errors](https://pkg.go.dev/errors)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
