---
name: generated-client-integrity
description: "Keep generated Go and TypeScript clients, validators, and queries aligned with canonical inputs using pinned generation, reproducible output, and real consumer/wire tests."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Generated Client Integrity

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Keep generated Go and TypeScript clients, validators, and queries aligned with canonical inputs using pinned generation, reproducible output, and real consumer/wire tests. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map canonical source through generator/version/configuration to emitted files and actual consumers. Identify committed versus ignored outputs and non-file inputs. Consumers must depend on what they actually read.

### 2. Choose the supported contract

Edit canonical specifications, queries, or generation configuration instead of patching generated files. Keep custom adapters outside generated directories and fail on output drift rather than maintaining two hand-edited sources.

### 3. Implement or qualify the path

Generate in an owned directory, repeat, and compare output identities. Normalize only documented irrelevant variability. Identical generated output permits downstream reuse only where graph declarations support that dependency model.

### 4. Exercise failure and integration seams

Compile Go and TypeScript consumers and exercise serialization/runtime validation. Include absent/null values, large IDs, enum extensions, timestamps, and errors. Generating a validator does not mean requests and responses actually use it.

### 5. Verify and hand back evidence

Assign one writer to shared schemas/outputs and give downstream lanes stable contract/output identities. Report unavailable generators as blocked; do not fabricate generated code or hand-author dependency locks.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Consumed generated files are ignored by Git: prove downstream invalidation follows their content rather than relying on git diff alone. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

A generated integer type agrees in Go and TypeScript but exceeds JavaScript exact precision. Add a deliberate wire representation and cross-language round-trip fixtures. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen)
- [Hey API Valibot](https://heyapi.dev/docs/openapi/typescript/plugins/valibot)
- [sqlc](https://docs.sqlc.dev/en/latest/howto/transactions.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
