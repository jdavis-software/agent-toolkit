---
name: codebase-orientation
description: "Map the owners, entry points, contracts and verification paths relevant to a change, with source-backed relationships and explicit unknown coverage."
metadata:
  version: "0.1.0"
---
# Codebase Orientation

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Map the owners, entry points, contracts and verification paths relevant to a change, with source-backed relationships and explicit unknown coverage.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Start with the question, not a full scan

State what the task must explain: an entry point, a failure path, a contract change, or an unfamiliar subsystem. Read repository instructions and existing accepted diagrams, project graphs and module boundaries. Record the actual checkout and source revision, including whether uncommitted and generated inputs matter. A map generated for another task is a lead, not automatically the right context.

### 2. Follow one representative path

Trace from an actual entry point through application behavior, state, external effects and the observable result. Read enough source to identify ownership and relevant tests. Use an installed project graph for package edges and language services for resolved symbols; use targeted file search where that is more direct. Do not infer runtime ordering from import edges or pretend syntax-only edges resolve dynamic dispatch.

### 3. Make the evidence legible

For each node record its responsibility, canonical paths and a source reference. Give every relationship a type and evidence state: observed in source, observed in a trace, inferred, or unresolved. Explain where the map stops, which generated files or languages are omitted, and which services are outside the available checkout. Keep proposed architecture separate from implemented behavior.

### 4. Choose a small reading and change surface

Return the shortest useful ordered reading list, owners to consult, contracts that must not drift, and relevant independent checks. A navigation map is not an edit allowlist: confirm authorized scope separately. Do not replace a real authorization or runtime trace with a graph screenshot.

### 5. Hand over a refreshable artifact

Recheck the referenced files before handoff and bind the map to the observed source identity. Link to canonical source rather than copying whole modules into a second wiki. Refresh affected relationships after an edit; stale notes remain labeled. Use Code Index Qualification before relying on optional graph results, and Bounded Context Assembly to select context for each child.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

A graph has no edge to a generated client excluded from indexing. Report incomplete coverage and inspect the client directly; do not declare that there are no consumers. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

A synthetic export has a TypeScript request mapper and a Go worker. The map observes each local entry point and labels the cross-process connection inferred until the message schema and publisher/consumer bindings are inspected. It does not draw a verified call edge merely because both files contain the word export. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [Nx project graphs](https://nx.dev/docs/features/explore-graph)
- [Tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html)
