# Engineering coverage and evidence

This expansion adds 30 original, project-agnostic skill packages to the six core skills. The 36 skills cover TypeScript, Go, contracts, PostgreSQL, Temporal, parallel engineering, infrastructure, integrations, security/state, media lineage, and MCP composition. Two original utilities and three separately identified external tools make 41 catalog entries. Eight overlapping bundles select the same canonical packages rather than duplicate them.

## Inputs to the design

Jordan's [Parallel Agent Engineering article](https://jdavis-software.github.io/content/articles/parallel-agent-engineering/) and the independent architecture/tooling experiment plan identify useful engineering problems: bounded tasks, cohesive ownership, generated contracts, semantic navigation, worktree/resource isolation, accurate invalidation, trusted caches, fresh evidence, and combined-candidate validation.

Those sources mix architectural direction, proposed experiments, illustrative models, and vendor capabilities. This collection does not treat every proposal as an installed product feature or a proven performance gain. No private knowledge-base export or product configuration is included.

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

The six existing skills retain their executable Skillcheck support. New domain skills are procedures with examples and 90 synthetic scenario inputs, not 30 newly implemented compilers, servers, or testing frameworks.

## Version-sensitive guidance

TypeScript 7 is a subject of qualification, not a silent dependency upgrade for the Astro website. Its release-specific compiler API and integration limitations must be checked against official documentation. Go, Nx, PostgreSQL, Docker, Temporal, providers, and MCP likewise require the actual installed version and configured command rather than an invented universal setup.

Each domain package links underlying technical documentation. None is a vendored or paraphrased upstream skill body. Existing historical research and notices remain intact.

## What the checks establish

Catalog checks verify IDs, paths, frontmatter, local source, and generated README consistency. Bundle checks verify selection, file boundaries, hashes, and optional clean Git provenance. Helper tests verify executable behavior in controlled Git/process fixtures. Website tests exercise actual rendered routes, search, filters, theme, mobile layout, and source links.

Agent-host outcomes are a separate evidence layer. All new scenario documents retain `status: not-run`; source shape, test counts, or content hashes do not establish that an agent completes real work correctly or outperforms another collection. Follow [the evaluation protocol](EVALUATION.md) before making those claims.

## Canonical maintenance

Edit each skill's name, description, and instructions in its `SKILL.md`; metadata belongs in `catalog/entries.json`. Edit bundle selections in `catalog/bundles.json`. Regenerate the README index with `node scripts/readme.mjs --write`. Keep published counts and selection links derived from these sources. Private projects pin the public source and supply bindings outside this repository; see [private adapters](PRIVATE_ADAPTERS.md).
