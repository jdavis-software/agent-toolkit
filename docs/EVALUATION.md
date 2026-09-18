# Evaluation: make useful claims reproducible

## The improvement delivered in this revision

The previous six-package collection at `b8dd9b2f514af8c4ad39ddbe2473fc43ab6ac0ac` had instruction files and scenario descriptions. This revision gives those same six skills concrete machine-checkable support: coordinated task packets, Git state snapshots, command receipts, stale-state verification, and debugging/test-design/interface report contracts. The source is original to this collection; no upstream skill bodies or scripts are imported.

The point is not longer prompts or a larger catalog. It is catching specific mistakes without requiring a second model to interpret every routine claim. Simple tasks can still use a brief natural-language plan; the helpers are opt-in at the task level.

## Runnable evidence

```bash
node --test tests/skillcheck.test.mjs
node examples/skillcheck/defect-demo.mjs
```

The helper test suite uses disposable local Git repositories and actual child processes. It covers parallel-plan ordering and overlap, blockers, malformed contracts, rename ownership, staged/unstaged/untracked state, stale receipts, deceptive success text with a nonzero exit, timeouts, missing executables, source mutation during checks, output truncation, literal shell metacharacters, and report-consistency failures.

The separate defect demo runs six deterministic cases across deliberately faulty and corrected functions authored for the demonstration. It catches three seeded defects: out-of-order search completion, applying a cancelled result, and renewing a lease exactly at its inclusive expiry boundary. All six corrected cases must satisfy independently stated assertions. It uses no sleeps, credentials, external APIs, or models. This is a narrow synthetic experiment, not a production benchmark or evidence of agent effectiveness.

Do not freeze a test count in the catalog. The exact revision's CI log is the source of truth. The website suite, catalog suite, helper suite, and agent-host evaluations are different scopes and must not be added together as a claim about model reliability.

## Comparison with the reference ecosystem

Research snapshot: September 17, 2026, U.S. Pacific date. The comparison is of documented scope, not a head-to-head evaluation of skill behavior.

| Reference | Documented emphasis | Our implementation choice |
| --- | --- | --- |
| [ECC repository](https://github.com/affaan-m/ECC) | A broader harness toolkit including skills, workflows, memory and hooks. | Keep this batch narrow: a local, dependency-free helper without installing a harness, memory system, or hooks. |
| [Superpowers repository](https://github.com/obra/superpowers) | A development methodology with planning, worktrees, debugging, testing, verification, and skill-behavior evaluation guidance. | Preserve task-sized adoption, add deterministic checks around artifacts, and do not enforce a mandatory whole-project workflow. |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Focused guidance for frontend work, React performance and composition, plus other platform-specific skills. | Make the interface review about a measured user journey; specialized framework optimization needs separate implementation and evaluation. |

These projects already discuss testing and evidence. This document does **not** claim they are merely prompts, have no equivalent helper, lack tests, or are worse overall. Their README-level scope was reviewed; their entire implementations were not audited or benchmarked here. No rankings or vendor performance figures are reused.

## What would establish a stronger comparative claim

Choose one task class first—for example, debugging the same controlled asynchronous defect. Pin the competing skill revisions, model and host versions, repository fixture, tools, context and permission budgets. Include the prior toolkit version, the revised version, and a no-skill control. Use a predeclared mix of ordinary tasks, boundary cases, and held-out failures. Keep the implementation acceptance tests independent of the skill author.

Run multiple fresh sessions with the same task conditions and counterbalanced order. Preserve failures rather than retrying until success. Record raw task outcomes, regressions, unauthorized side effects, unnecessary changed files, required human interventions, wall-clock time, and model/tool usage when genuinely exposed by the host. Report sample sizes and uncertainty, not invented token estimates or universal speed multipliers.

Define the win for that task in advance: higher correct-completion rate without increased harmful side effects; or equal correctness with lower observed time/cost. A helper catching a malformed packet is not evidence that an agent writes better code. A passing browser suite is not evidence that the skill activated in a host.

Current status: deterministic helper and fixture tests are executable. Comparative host runs have not been performed, and host-specific activation, installation, and removal remain unverified. This boundary does not prevent using the tools; it prevents unsupported marketing claims.

## Maintenance

Every defect fixed in a helper needs a regression test. Keep source and evidence at the same revision. Preserve negative cases. When changing a schema, version it and supply migration guidance rather than silently changing the meaning of prior receipts. Report unsupported platforms and input limits openly.

Implementation references for standard APIs: [Git status porcelain](https://git-scm.com/docs/git-status), [Git diff](https://git-scm.com/docs/git-diff), and [Node child processes](https://nodejs.org/api/child_process.html). These are technical references, not incorporated skill implementations.
