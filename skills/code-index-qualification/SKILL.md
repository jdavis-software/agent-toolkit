---
name: code-index-qualification
description: "Qualify one derived code index against the intended checkout, source bytes, coverage and known query answers before using it for impact decisions."
metadata:
  version: "0.1.0"
---
# Code Index Qualification

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Qualify one derived code index against the intended checkout, source bytes, coverage and known query answers before using it for impact decisions.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Identify the actual backend and view

Record the executable/version, index configuration, language coverage, root binding, exclusion rules and whether the engine uses models or network services. Inspect initialization effects before installing. A project name or current HEAD in a status response is not proof of the indexed revision. Prefer an existing qualified backend over adding competing permanent indexes.

### 2. Define independent probe answers

Choose a small representative corpus and derive expected symbols, relationships and known omissions directly from source before querying. Include a negative query, but do not equate absence in an incomplete index with semantic nonexistence. Record which files and query scope each expectation covers. Keep expected answers separate from the engine response.

### 3. Exercise drift and competing views

Build the index, then test an uncommitted edit, rename, deletion, generated-file change and a different linked worktree. Reconcile what the index actually read. Include failed or busy refresh and an interrupted update; require visible stale or unavailable states rather than converting an old answer into a fresh one.

### 4. Check both records and operations

The Publicationcheck index command compares supplied expectations with observations, selected source hashes, scope identity and required query results. It neither queries a graph engine nor authenticates an observation. Run the actual backend separately and retain its receipts; a fabricated passing record is not qualification. Inspect source before relying on a consequential deletion or cross-service impact conclusion.

### 5. Measure benefit without hiding setup cost

Separate installation, cold indexing, incremental refresh, query time and whole-task cost. Fix question order or randomize it in advance and keep quality scoring independent. Retain empty answers and failures. Select one backend only when the workload benefits; do not repeat upstream benchmark multipliers as measurements of this repository.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

A query succeeds using a stale index after a refresh lock timeout. Preserve the answer as exploratory evidence, but do not accept it as a current impact result. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

In the included synthetic corpus, a stored symbol answer initially matches worker.go. Changing that file without updating its expected hash makes the record check fail even if the supplied observation still claims fresh. A second fixture labels refresh as stale and cannot pass. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [Tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html)
- [Git worktrees](https://git-scm.com/docs/git-worktree)
