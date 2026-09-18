# Agentflow: offline orchestration contracts

Agentflow turns a declared task graph and a caller-supplied capability registry into a bounded dispatch proposal. It also checks explicit run records and proposes what may resume. **It does not discover live agents, launch workers, execute check commands, call a model, authenticate an approval, or enforce permissions on external systems.**

This is an original dependency-free Node utility. Node 22.12 or newer is sufficient; no website dependencies are needed. Reuse Skillcheck for command execution evidence and Bundle Resolver for package selection. Those are separate operations with separate authority.

## Try the synthetic example

From a full toolkit checkout:

```bash
node tools/agentflow.mjs plan examples/agentflow/plan.json
node tools/agentflow.mjs capabilities examples/agentflow/capabilities.json
node tools/agentflow.mjs schedule examples/agentflow/plan.json examples/agentflow/capabilities.json
node examples/agentflow/demo.mjs
node --test tests/agentflow.test.mjs
```

The capability file contains fictitious workers and a long expiry so the example stays runnable. It is not evidence of installed or connected agents. The demo uses a disposable directory, ordinary local JSON artifacts, and explicit synthetic events; it makes no external calls.

## Plan contract

A schema-version-1 document contains `runId`, `policy`, and `tasks`. Every task has the existing Skillcheck plan fields: `id`, `goal`, `owns`, `dependsOn`, `checks`, `acceptance`, and optional `blockedBy`. Ownership is a literal repository-relative file or a directory ending in `/`, not a glob. Each acceptance criterion references a declared check. Checks contain argv arrays but Agentflow never executes them.

Additional required task fields are:

| Field | Meaning |
| --- | --- |
| `inputDigest` | SHA-256 supplied by the adapter for accepted inputs/context. The utility does not scan the source to produce it. |
| `capabilities` | Exact required capability IDs; similar names are not substituted. |
| `effects` | Declared effects: `read`, `local-write`, `repository-write`, `external-write`, `financial`, or `production`. |
| `phase` | `implementation`, `verification`, or `integration`. |
| `tokenBudget` | Positive integer reservation for one attempt, not a measured tokenizer result. |
| `maxAttempts` | Integer from 1 through 10; retries are explicit events. |
| `resources` | Integer requirements against named resource pools. |
| `requiresApproval` | Explicit Boolean. A matching supplied approval record is required when true. |

`policy` specifies `maxConcurrent` (1–100), `reservedReviewSlots` (strictly smaller), `maxTokens`, `allowedEffects`, and resource-pool capacities. The graph is limited to 200 tasks. Cycles, missing dependencies, uncoordinated ownership overlaps, malformed fields, and unmapped acceptance criteria fail validation.

The utility computes each task identity from its definition and transitive dependency identities. Changing an input digest, check, dependency, or task contract invalidates that task and its affected dependents. Input digests remain only as trustworthy and complete as the adapter that produces them.

## Capability registry and dispatch

The registry contains `schemaVersion`, `validUntil`, `workers`, and `approvals`. Each worker declares `id`, `capabilities`, `effects`, `phases`, `capacity`, `available`, and integer `rank`. Lower rank wins; the worker ID breaks ties. Rank is a supplied routing preference, not a measured claim about model quality, cost, or speed.

The scheduler prioritizes integration, then verification, then implementation. It withholds work until prerequisites are accepted and reusable, matches exact capabilities, respects declared effects, reserves per-attempt tokens, accounts for active work, and leaves review slots out of implementation capacity. Named resource pools are separate from agent count. It returns selected tasks plus explicit reasons for blocked tasks. A dispatch proposal does not imply a worker started or a task passed.

Approval records contain `taskId`, the computed `taskDigest`, `expiresAt`, and a reference. A stale digest or expired record cannot satisfy a required gate. **These local records are not authenticated permissions.** A real adapter must verify identity, current policy, approval scope, budget, and revocation at the actual execution boundary. Discovery never grants authority.

## Run records

Use a private location outside the measured repository. `init` and `record` create new files with restrictive permissions and refuse to overwrite an existing destination:

```bash
node tools/agentflow.mjs init examples/agentflow/plan.json --out /tmp/my-new-run.json
node tools/agentflow.mjs status /tmp/my-new-run.json
node tools/agentflow.mjs verify /tmp/my-new-run.json
```

A record embeds its accepted plan, plan digest, and a sequence of hash-linked events. Event IDs must be unique. A record operation must name the exact current head:

```text
node tools/agentflow.mjs record run.json event.json --expect-head <actual-head> --out next-run.json
```

Supported transitions are `queued → running → submitted → accepted`, with explicit failure/indeterminate outcomes, bounded retry from failure, and evidence-backed reconciliation. `started` increments the attempt, names a worker, and requires accepted dependencies and no declared blockers. Outcome records require explicit used tokens or `null` plus evidence references. A submitted result includes a relative artifact path and SHA-256. Acceptance names a different declared reviewer and evidence; it does not run those checks or authenticate that person.

`record` records an observation; it does not authorize starting work. The caller must serialize updates to its authoritative run pointer. An expected head detects stale updates within the supplied history, **not two independent writers publishing competing new histories**. Hashes detect inconsistency, not malicious rewriting, forged evidence, rollback of the entire record, or tampering by someone who can recompute them. No distributed locking or exactly-once guarantee is provided.

`usedTokens: null` conservatively charges the full attempt reservation. Observed overspend remains recorded and blocks further admission rather than discarding the evidence. This is local accounting, not a provider spending limit. Interruptions with unknown usage remain charged until the accepted recovery policy resolves them.

## Resume without repeating uncertain effects

```bash
node tools/agentflow.mjs resume plan.json capabilities.json run.json --artifacts /path/to/owned-artifacts
```

An accepted result is reusable only when task/dependency identities match and the selected artifact's actual bytes match its recorded hash. Without an artifact root, reuse remains unverified. Missing files, changed bytes, traversal, symlink components, and oversized artifacts fail reuse. A stale prerequisite invalidates accepted dependents even when their own files still exist.

Running and indeterminate attempts keep their declared worker/resource/scope reservations. A timeout is not evidence the external operation stopped. They require explicit reconciliation; they are never silently retried. Removed tasks with uncertain effects also remain visible and reserved. Submitted results await review rather than being relaunched.

A materially changed plan yields stale-input decisions, not an automatic journal migration. Review the changed plan and create a new bounded run, reconciling old effects and resources first. The tool does not copy accepted state into a changed plan or silently increase budgets.

## Limits and private adapters

JSON files and artifacts are limited to 2 MiB; histories to 2,000 events; registries to 100 workers. Reads are bounded observations, not atomic filesystem snapshots or a hostile-filesystem sandbox. The caller must protect input locations from concurrent replacement. Do not store secrets, private context, or full sensitive traces in public fixtures.

Keep concrete worker executables, repository roots, credentials, authenticated approval checks, live capability probes, cancellation, resource allocation, and provider usage reporting in separately reviewed adapters. No Codex, Claude, Gemini, DriftGate, or AvatarOps adapter is implemented by this version. Writing a skill about those boundaries does not deploy them.

Agentflow tests validate graph, scheduling, record, artifact, and CLI behavior using synthetic fixtures. They do not establish agent effectiveness or outperform another orchestrator. The accompanying skill scenarios remain not-run until independent host evaluations produce actual results.
