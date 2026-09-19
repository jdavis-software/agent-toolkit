---
name: openapi-contract-evolution
description: "Evolve OpenAPI contracts against an accepted consumer baseline with explicit wire semantics, compatibility analysis, migration decisions, and runtime checks."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# OpenAPI Contract Evolution

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Evolve OpenAPI contracts against an accepted consumer baseline with explicit wire semantics, compatibility analysis, migration decisions, and runtime checks. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Locate the authoritative modular specifications and their owner/generation chain. Record accepted or released baseline and candidate revisions; an arbitrary moving branch is not automatically a customer-compatibility baseline.

### 2. Choose the supported contract

Specify required/optional properties, nullability, numeric bounds, enum extensions, errors, pagination, authentication, and idempotency where relevant. Separate schema facts from business invariants that the schema cannot express.

### 3. Implement or qualify the path

Use the configured compatibility checker, such as qualified oasdiff, to inspect removals, tightened constraints, response changes, and generator-facing operation IDs. Verify seeded compatible and incompatible fixtures.

### 4. Exercise failure and integration seams

For intentional breaks, document versioning or migration and overlapping consumer/server deployments. Generate with pinned tools and test supported old consumers as well as new ones; compilation of the new client alone is insufficient.

### 5. Verify and hand back evidence

Exercise bounded malformed/boundary requests and real response behavior against a disposable service. Maintain independent authorization, tenant, and effect assertions. Do not change the accepted baseline to hide a break.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Schema tests pass but a tenant receives another tenant’s object: fail the independent access invariant instead of calling the API correct. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

An optional field becomes required. A new client compiles, but an old server may omit it; check deployment order and both wire directions. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html)
- [oasdiff](https://www.oasdiff.com/)
- [Schemathesis](https://schemathesis.readthedocs.io/en/stable/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.

## Keep reference trees independent

Resolve the accepted baseline and candidate modular specifications within their own revision trees. Restrict external references deliberately; never resolve both against the newest shared files.

For a chosen oasdiff CLI, set an explicit failure threshold and seed a known breaking change. Invalid schemas, unresolved references or a failed tool must not become an empty passing report. Bounded live API tests must report actual selected-operation coverage.
