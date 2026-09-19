# Reusable engineering bundles

A bundle selects canonical skill packages for a class of work. It does not create a new agent runtime, install skills, load all instructions into every task, or grant permission to execute tools. The supported starting point is a full checkout of this repository.

<!-- inventory:start -->

**72 original skills · 13 primary categories · 12 overlapping bundles · 5 original utilities · 3 selected external tools · 4 optional role profiles.**

198 synthetic scenario inputs are authored examples, not completed agent-host evaluations. Counts are generated from the catalog.

<!-- inventory:end -->

<!-- bundle-table:start -->

| Bundle ID | Focus |
| --- | --- |
| `typescript` | Native TypeScript 7 qualification, domain types, ESM packages, and a correctly separated quality pipeline. |
| `go-backend` | Cohesive services, bounded concurrency, deterministic tests, measured performance, and transaction ownership. |
| `contracts-data` | Accepted API baselines, reproducible generated consumers, safe schema changes, and authoritative data invariants. |
| `durable-workflows` | Deterministic orchestration, retry-safe effects, version-aware worker rollouts, and job reconciliation. |
| `parallel-engineering` | Bounded tasks, current context, graph-aware work, precise cache reuse, isolated resources, and verified handoffs. |
| `infrastructure` | Reproducible tools, safe container iteration, trusted build caches, schema transitions, and artifact promotion. |
| `media-integrations` | Capability-aware integrations, asynchronous state, retry-safe metering, and asset derivation without product-specific assumptions. |
| `mcp-tooling` | Canonical public skills plus private context bindings, thin authenticated adapters, and bounded execution contracts. |
| `agent-orchestration` | Bounded goals, capability-aware routing, coordinated dispatch, recoverable attempts, and reviewed integration. |
| `agent-runtime` | Least-privilege delegation, exact approvals, budgets, context recovery, loop detection, and independent evaluation. |
| `web-research` | Route sources, qualify connector access, read bounded public content, compare feeds, and produce timestamped research evidence. |
| `harness-engineering` | Audit effective execution, reconcile task readiness and events, qualify controller failures, and apply tested structural changes without another scheduler. |

<!-- bundle-table:end -->

## Read-only commands

Use Node >=22.12. The resolver uses Node built-ins and does not need the Astro site's dependency installation. Git is needed only to establish checkout provenance. Run from the toolkit root, or supply `--root` explicitly.

```bash
node tools/bundle.mjs list
node tools/bundle.mjs resolve typescript
node tools/bundle.mjs resolve durable-workflows --require-clean
node --test tests/bundles.test.mjs
```

For a private adapter, select a reviewed full commit, check it out, and use the actual hash with `--expected-revision`. An expected revision also requires a clean observable Git checkout. No ref is fetched or resolved remotely by this command.

```bash
# Run after intentionally checking out an approved toolkit revision.
# This reports the current revision; approval is a separate project decision.
REVISION="$(git rev-parse HEAD)"
node tools/bundle.mjs resolve mcp-tooling --expected-revision "$REVISION"
```

Generating a file inside the measured repository can make the checkout dirty before the command runs. Send manifests to an owned location outside that checkout when using strict provenance checks. Review outputs before publishing them.

## Manifest contract

The resolver emits JSON containing the schema version, bundle ID/version, sorted skill IDs, sorted file records, a deterministic `bundleDigest`, and a separate source-state observation. File records contain repository-relative paths, byte lengths, and SHA-256 hashes. The digest covers the bundle selection and file records, not machine paths or observation times.

Selected packages include all regular supporting files below their skill directory. Bundles that select one of the six core skills also include the Skillcheck entry point, its three local modules, and the command-contract document. Registry files are included in the manifest, so edits to either registry invalidate the manifest even when a selected skill's bytes are unchanged. This is intentionally conservative; it is not a minimal build-cache key.

Without Git provenance, resolution is allowed in `content-only` mode and reports a null revision/dirty state. A dirty checkout is reported as such in normal mode; it is rejected in strict mode. A content hash is not a signature, proof of authorship, proof of safety, or confirmation that a specific host activated the skill.

The resolver rejects unknown or duplicate selections, malformed IDs, missing inputs, unsafe paths, symlinks, unsupported file types, and excessive file sizes. It reads selected files twice to detect observed changes and compares Git observations before/after. It is not an atomic filesystem snapshot or an adversarial sandbox; concurrent changes can still race observations. Use an isolated immutable checkout for reproducible consumption.

## Role packaging

[Four small role profiles](ROLE_PROFILES.md) reuse these canonical files and companion dependencies. `rolekit stage` writes a new immutable package from a reviewed clean checkout; it never installs globally or overwrites a consuming project. [The explicit local probe](LOCAL_ADAPTER.md) can verify Codex discovery without starting a model turn.

## Private adapter boundary

Keep one public implementation of each skill. Bind private repository roots, accepted contract paths, command IDs/argument arrays, host/tool versions, credentials references, approvals, and policies outside this repository. See [Private adapters](PRIVATE_ADAPTERS.md).

Public bundles deliberately contain no company-specific overrides. They are a foundation for later internal MCP packaging, not a claim that an internal MCP server is implemented or installed. A host-specific installer/packager must preserve declared companion requirements and pass its own discovery, activation, update, and removal tests.

## Evidence levels

Package/frontmatter and scenario checks validate structure. Bundle tests validate selection, file boundaries, fingerprints, and strict Git behavior. Skillcheck tests exercise its mechanical checks. Website tests validate browsing and rendering. None of these establishes the effectiveness of all catalogued instructions inside an agent host.

Each new domain skill includes three synthetic cases at `references/scenarios.json`: intended activation, a difficult boundary, and a non-trigger. Their status remains `not-run` until a real host evaluation is recorded separately. Do not change a source scenario into a fabricated successful transcript.

## Source-access companion

The `web-research` bundle selects the canonical source-access skills listed in `catalog/bundles.json` and includes the Sourcekit Node wrapper, Python implementation/modules, and command documentation. Python 3.10+ is required to run that optional tool; resolving the bundle itself remains a read-only Node operation. No connector, interpreter, or package is installed automatically.
