---
name: postgres-migration-safety
description: "Test schema changes against populated prior versions, rolling application compatibility, locks/backfills, and explicit recovery rather than clean-install success alone."
metadata:
  version: "0.1.1"
  collection: "jordans-agent-toolkit"
---
# PostgreSQL Migration Safety

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Test schema changes against populated prior versions, rolling application compatibility, locks/backfills, and explicit recovery rather than clean-install success alone. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Read the actual migration runner, ordering, applied-version tracking, and transaction mode. Separate upward/downward sections as executed. Identify supported starting schemas instead of assuming an empty database.

### 2. Choose the supported contract

Assess table size, locks, indexes, defaults, constraints, and old/new readers and writers. Use staged expand/backfill/contract where necessary. Make large backfills bounded and resumable with one accountable owner.

### 3. Implement or qualify the path

Lint the SQL that actually executes with the selected PostgreSQL/transaction settings. Qualify configured tools such as Squawk using risky and valid fixtures. Static linting is not a measurement of production lock duration.

### 4. Exercise failure and integration seams

Test fresh installation and populated upgrades with representative synthetic data. Assert preservation, constraints, application behavior, and resume/repeat semantics. Snapshot identity includes version, extensions, migrations, and data; restore only inactive owned resources.

### 5. Verify and hand back evidence

Define rollback versus forward repair before rollout. Test overlapping application versions and explicitly approve compatibility removal. Do not run production migrations or broad destructive restores just to finish a review.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Another lane is using the database selected for restore: wait or allocate separate owned resources rather than reset shared active state. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

An optional column becomes required through compatible writes, a backfill, and later enforcement; verify a populated upgrade and both old/new writers. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Squawk](https://squawkhq.com/docs/)
- [PostgreSQL test snapshots](https://golang.testcontainers.org/modules/postgres/)
- [ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.

## Match the real migration runner

When the runner separates up/down SQL or renders templates, lint the rendered upward migration as actually executed. Preserve source mapping, PostgreSQL target version and transaction assumptions; do not concatenate rollback SQL into the deployment lint input.

Retain populated old-schema upgrade tests separately from clean installation. Prefer one owned fixture per DB-requiring lane/suite; snapshots are an optimization, not permission to restore active shared database state.
