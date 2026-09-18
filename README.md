# Jordan's Agent Toolkit Collection

A personal collection of original agent skills, engineering workflows, and selected developer tools. One place to explore the work, inspect the source, and share a useful approach from a profile or an article.

[Explore the website](https://jdavis-software.github.io/agent-toolkit/) · [Browse the skills](skills/) · [Follow the workflow](https://jdavis-software.github.io/agent-toolkit/workflows/) · [Read the engineering article](https://jdavis-software.github.io/content/articles/parallel-agent-engineering/)

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
