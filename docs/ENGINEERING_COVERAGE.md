# Engineering coverage and evidence

The collection contains 62 original skills: six core procedures, 30 domain skills, 18 orchestration/runtime/context additions, and eight source-access skills. Four original utilities and three separately identified external tools make 69 catalog entries. Thirteen primary categories partition those entries without duplicate counts. Eleven overlapping bundles select canonical packages rather than copy their instructions.

## Inputs to the design

Jordan's [Parallel Agent Engineering article](https://jdavis-software.github.io/content/articles/parallel-agent-engineering/) and the independent architecture/tooling experiment plan identify useful engineering problems: bounded tasks, cohesive ownership, generated contracts, semantic navigation, worktree/resource isolation, accurate invalidation, trusted caches, fresh evidence, and combined-candidate validation.

Those sources mix architectural direction, proposed experiments, illustrative models, and vendor capabilities. This collection does not treat every proposal as an installed product feature or a proven performance gain. No private knowledge-base export or product configuration is included. The category browsing pattern follows the card layout Jordan selected, with this collection's own names, descriptions, and counts.

## Domain coverage

| Area | Packages |
| --- | --- |
| TypeScript | Native TypeScript 7 adoption, type design, ESM packages, separate quality checks |
| Go | Package/service boundaries, cancellation/concurrency, deterministic tests, profiling |
| Contracts and data | OpenAPI evolution, generated client integrity, transaction ownership, migration safety |
| Temporal | Workflow determinism/replay, activity idempotency, worker rollout |
| Parallel engineering | Graph/boundary use, invalidation tests, resource isolation, bounded context |
| Infrastructure | Producer cache trust, toolchain reproducibility, Docker development, artifact promotion |
| Integrations and state | Provider capabilities, tenant authorization, metering, asynchronous jobs |
| Media | Immutable asset identity, derivation lineage, protected provenance |
| MCP | Thin adapters, canonical bundle selection, separate private bindings |
| Orchestration | Goals, capability discovery, task routing, dispatch, execution contracts, lifecycle, resume, recovery, result integration, observability, resource scheduling |
| Runtime and evaluation | Permission delegation, approval boundaries, budgets, loop detection, delegation evaluation |
| Context and memory | Context budgeting and recoverable checkpoints |

The six core skills retain their executable Skillcheck support. Domain and orchestration instructions include 168 synthetic scenario inputs in JSON; these are not 168 completed host evaluations. Earlier core scenario notes remain available separately. New skills describe procedures and actual boundaries, not newly implemented compilers, provider services, or autonomous workers.

## Executable coordination

Agentflow validates declared plans, matches a supplied capability registry, accounts for reservations, checks hash-linked run-record consistency, and proposes reuse after checking accepted artifacts. It does not probe or launch workers, execute task commands, call models, or authenticate permission metadata. Bundle Resolver includes declared companion files without installing or running them. See [Agentflow](AGENTFLOW.md) and [bundles](BUNDLES.md).

## Version-sensitive guidance

TypeScript 7 is a subject of qualification, not a silent dependency upgrade for the Astro website. Its release-specific compiler API and integration limitations must be checked against official documentation. Go, Nx, PostgreSQL, Docker, Temporal, providers, and MCP likewise require the actual installed version and configured command rather than an invented universal setup.

Each domain package links underlying technical documentation. None is a vendored or paraphrased upstream skill body. Existing historical research and notices remain intact.

## What the checks establish

Catalog checks verify IDs, paths, frontmatter, local source, and generated README consistency. Category checks verify one primary assignment, membership, and derived counts. Bundle checks verify selection, file boundaries, hashes, and optional clean Git provenance. Helper tests verify executable behavior in controlled Git/process/artifact fixtures. Website tests exercise actual rendered routes, search, filters, theme, mobile layout, and source links.

Agent-host outcomes are a separate evidence layer. All scenario documents retain `status: not-run`; source shape, test counts, or content hashes do not establish that an agent completes real work correctly or outperforms another collection. Follow [the evaluation protocol](EVALUATION.md) before making those claims.

## Canonical maintenance

Edit each skill's name, description, and instructions in its `SKILL.md`; metadata belongs in `catalog/entries.json`. Edit bundle selections in `catalog/bundles.json` and primary category definitions in `catalog/categories.json`. Regenerate the README index with `node scripts/readme.mjs --write`. Keep published counts and selection links aligned with those sources. Private projects pin the public source and supply bindings outside this repository; see [private adapters](PRIVATE_ADAPTERS.md).

Sourcekit adds actually executable public text/feed/caption intake, not authenticated social-platform adapters. Separate local parsing, mocked transport-policy tests, live public read checks, and agent-host evaluations in evidence.
