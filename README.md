# Jordan's Agent Toolkit Collection

A personal collection of original agent skills, engineering workflows, and selected developer tools. One place to explore the work, inspect the source, and share a useful approach from a profile or an article.

[Explore the website](https://jdavis-software.github.io/agent-toolkit/) · [Browse the skills](skills/) · [Follow the workflow](https://jdavis-software.github.io/agent-toolkit/workflows/) · [Read the engineering article](https://jdavis-software.github.io/content/articles/parallel-agent-engineering/)

## The expanded skill collection

**36 original skills · 8 focused bundles · 2 original utilities · 3 selected external tools.**

Start with [TypeScript](https://jdavis-software.github.io/agent-toolkit/bundles/typescript/), [Go](https://jdavis-software.github.io/agent-toolkit/bundles/go-backend/), [contracts and data](https://jdavis-software.github.io/agent-toolkit/bundles/contracts-data/), [durable workflows](https://jdavis-software.github.io/agent-toolkit/bundles/durable-workflows/), [parallel engineering](https://jdavis-software.github.io/agent-toolkit/bundles/parallel-engineering/), [infrastructure](https://jdavis-software.github.io/agent-toolkit/bundles/infrastructure/), [media/provider pipelines](https://jdavis-software.github.io/agent-toolkit/bundles/media-integrations/), or [MCP tooling](https://jdavis-software.github.io/agent-toolkit/bundles/mcp-tooling/).

Each skill is maintained under `skills/`. Bundles reference canonical files; private adapters supply repository paths, commands, accepted contracts, and policies without forking the public instructions. TypeScript 7 qualification is covered without silently changing this Astro site's compiler dependency.

```bash
node tools/bundle.mjs list
node tools/bundle.mjs resolve typescript
node tools/bundle.mjs resolve mcp-tooling --require-clean
```

The resolver uses Node built-ins and prints selection/file hashes. It does not install skills, call models, run selected tools, or start an MCP server. See [bundle contracts](docs/BUNDLES.md), [private adapter design](docs/PRIVATE_ADAPTERS.md), and [coverage and evidence](docs/ENGINEERING_COVERAGE.md).

New domain packages contain synthetic trigger, boundary, and non-trigger scenarios. Those inputs are not completed agent-host runs; instruction effectiveness remains experimental.

<!-- skill-index:start -->

| Skill | Area |
| --- | --- |
| [Work Packet Planner](skills/work-packet-planner/SKILL.md) | Planning |
| [Worktree Handoff](skills/worktree-handoff/SKILL.md) | Parallel engineering |
| [Affected Verification](skills/affected-verification/SKILL.md) | Verification |
| [Evidence First Debugging](skills/evidence-first-debugging/SKILL.md) | Debugging |
| [Behavior Test Design](skills/behavior-test-design/SKILL.md) | Testing |
| [Interface Quality Review](skills/interface-quality-review/SKILL.md) | Frontend |
| [TypeScript 7 Adoption](skills/typescript-7-adoption/SKILL.md) | TypeScript |
| [TypeScript Type Design](skills/typescript-type-design/SKILL.md) | TypeScript |
| [TypeScript ESM Packages](skills/typescript-esm-packages/SKILL.md) | TypeScript |
| [TypeScript Native Quality Checks](skills/typescript-native-quality/SKILL.md) | TypeScript |
| [Go Service Boundaries](skills/go-service-boundaries/SKILL.md) | Go |
| [Go Concurrency and Cancellation](skills/go-concurrency-cancellation/SKILL.md) | Go |
| [Go Deterministic Testing](skills/go-testing-determinism/SKILL.md) | Go |
| [Go Performance Profiling](skills/go-performance-profiling/SKILL.md) | Go |
| [OpenAPI Contract Evolution](skills/openapi-contract-evolution/SKILL.md) | Contracts |
| [Generated Client Integrity](skills/generated-client-integrity/SKILL.md) | Contracts |
| [PostgreSQL Transaction Boundaries](skills/postgres-transaction-boundaries/SKILL.md) | Data |
| [PostgreSQL Migration Safety](skills/postgres-migration-safety/SKILL.md) | Data |
| [Temporal Workflow Determinism](skills/temporal-workflow-determinism/SKILL.md) | Durable workflows |
| [Temporal Activity Idempotency](skills/temporal-activity-idempotency/SKILL.md) | Durable workflows |
| [Temporal Worker Rollout](skills/temporal-worker-rollout/SKILL.md) | Durable workflows |
| [Nx Graph and Boundaries](skills/nx-graph-and-boundaries/SKILL.md) | Parallel engineering |
| [Cache Invalidation Testing](skills/cache-invalidation-testing/SKILL.md) | Parallel engineering |
| [Build Cache Trust](skills/build-cache-trust/SKILL.md) | Infrastructure |
| [Worktree Resource Isolation](skills/worktree-resource-isolation/SKILL.md) | Parallel engineering |
| [Bounded Context Assembly](skills/bounded-context-assembly/SKILL.md) | Parallel engineering |
| [Toolchain Reproducibility](skills/toolchain-reproducibility/SKILL.md) | Infrastructure |
| [Docker Development Loop](skills/docker-development-loop/SKILL.md) | Infrastructure |
| [Integration Artifact Promotion](skills/integration-artifact-promotion/SKILL.md) | Infrastructure |
| [MCP Adapter Design](skills/mcp-adapter-design/SKILL.md) | MCP and bundles |
| [Provider Adapter Contracts](skills/provider-adapter-contracts/SKILL.md) | Integrations |
| [Tenant Authorization Boundaries](skills/tenant-authorization-boundaries/SKILL.md) | Security and state |
| [Usage Metering Idempotency](skills/usage-metering-idempotency/SKILL.md) | Security and state |
| [Async Job State Machines](skills/async-job-state-machines/SKILL.md) | Security and state |
| [Asset Lineage and Provenance](skills/asset-lineage-provenance/SKILL.md) | Media pipelines |
| [Skill Bundle Composition](skills/skill-bundle-composition/SKILL.md) | MCP and bundles |

<!-- skill-index:end -->

## Skills with executable support

| Skill | What it produces | Companion check |
| --- | --- | --- |
| [Work Packet Planner](skills/work-packet-planner/SKILL.md) | A bounded task with ownership, dependencies, and acceptance criteria. | Reject cycles, overlapping parallel ownership, and unmapped criteria; compute dependency waves. |
| [Worktree Handoff](skills/worktree-handoff/SKILL.md) | A commit-specific account of changes, checks, and unresolved work. | Inspect actual Git state, both sides of renames, and out-of-scope paths without cleanup. |
| [Affected Verification](skills/affected-verification/SKILL.md) | Focused checks tied to actual execution and measured source state. | Record process results and reject stale or invalidated receipts. |
| [Evidence First Debugging](skills/evidence-first-debugging/SKILL.md) | A supported diagnosis and bounded repair tied to the original reproduction. | Reject inconsistent fixed conclusions; run controlled asynchronous defect probes. |
| [Behavior Test Design](skills/behavior-test-design/SKILL.md) | Requirement-linked cases, independent expected results, and prohibited effects. | Detect uncovered requirements and incomplete case contracts. |
| [Interface Quality Review](skills/interface-quality-review/SKILL.md) | Reproducible rendered-interface findings and scoped verification. | Keep missing keyboard, interaction, layout, or console evidence visible. |

The instructions, helper code, and examples were written for this collection with AI assistance. Helpers have executable fixture tests; agent-host effectiveness remains experimental. A structural checker cannot authenticate evidence or establish that an agent performs better than another skill. Simple tasks can still use a brief natural-language plan.

## Try the helpers without installing the website

From a full checkout, use Node >=22.12. Git is required only for the repository-state and process-receipt commands. No npm installation, model API, or hosted service is needed for these examples:

```bash
node tools/skillcheck.mjs --help
node tools/skillcheck.mjs plan examples/skillcheck/plan.json
node examples/skillcheck/defect-demo.mjs
node --test tests/skillcheck.test.mjs
```

The demo detects three deliberately seeded defects in small original search/lease functions and checks six corrected cases. It is not a benchmark against another repository. The helper test suite uses disposable Git repositories and real child processes.

[Helper commands and full contracts](docs/SKILL_TOOLS.md) · [Evaluation and comparison method](docs/EVALUATION.md)

## Collection, not a link directory

The primary catalog contains local instructions and examples. External executable tools remain separately identified with their real authors and sources. The website does not install tools. The helper only executes a command when explicitly invoked with `run`; it inherits the caller's permissions and is not a sandbox.

[Original authoring approach](docs/ORIGINAL_SKILLS.md) · [Catalog metadata](catalog/entries.json) · [Getting started](docs/GETTING_STARTED.md) · [Roadmap](docs/ROADMAP.md) · [Contribution guide](CONTRIBUTING.md)

## Develop the website

Use Node 24 and the pinned package manager, `pnpm@12.4.2`.

```bash
npm install --global pnpm@12.4.2
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm validate  # Package shape and provenance checks
pnpm test      # Catalog and executable helper tests
pnpm check     # Astro / TypeScript checks
pnpm build     # Static output in dist/
pnpm exec playwright install chromium
pnpm test:site # Browser tests against the production build
```

The site uses `/agent-toolkit/` as its base, including during local development. Repository checks and browser tests do not evaluate agent-host behavior.

## Hosting

The deployment workflow builds and publishes changes that reach `main`. GitHub Pages uses GitHub Actions as its source. No database, hosted MCP server, paid CMS, or Notion credentials are needed by the site. Check the deployment run for the revision currently published.

## Authorship and terms

The collection is maintained for Jordan Davis. Each original package has its own instructions, examples, and evidence requirements. Actual reused materials and dependencies retain applicable notices and terms. See [ATTRIBUTION.md](ATTRIBUTION.md), [docs/ORIGINAL_SKILLS.md](docs/ORIGINAL_SKILLS.md), and [AGENTS.md](AGENTS.md).

A license for this repository's original content has not yet been selected. Public source visibility does not itself grant a reuse license. External projects retain their own terms; none are relicensed by this repository. Never publish private configurations, credentials, company code, or unapproved knowledge-base content here.
