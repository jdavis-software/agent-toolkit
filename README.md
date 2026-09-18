# Jordan's Agent Toolkit Collection

A personal collection of original agent skills, engineering workflows, and selected developer tools. One place to explore the work, inspect the source, and share a useful approach from a profile or an article.

[Explore the website](https://jdavis-software.github.io/agent-toolkit/) · [Browse the skills](skills/) · [Follow the workflow](https://jdavis-software.github.io/agent-toolkit/workflows/) · [Read the engineering article](https://jdavis-software.github.io/content/articles/parallel-agent-engineering/)

## The skill collection

| Skill | What it produces |
| --- | --- |
| [Work Packet Planner](skills/work-packet-planner/SKILL.md) | A bounded task with ownership, dependencies, and acceptance criteria. |
| [Worktree Handoff](skills/worktree-handoff/SKILL.md) | A commit-specific account of changes, checks, and unresolved work. |
| [Affected Verification](skills/affected-verification/SKILL.md) | Focused checks with explicit passed, failed, blocked, and untested results. |
| [Evidence First Debugging](skills/evidence-first-debugging/SKILL.md) | A supported diagnosis and bounded repair tied to the original reproduction. |
| [Behavior Test Design](skills/behavior-test-design/SKILL.md) | Requirement-linked cases that test observable behavior and meaningful boundaries. |
| [Interface Quality Review](skills/interface-quality-review/SKILL.md) | Reproducible rendered-interface findings and scoped verification. |

These skills were written for this collection with AI assistance. They are experimental: synthetic examples and evaluation scenarios are not claims of completed agent-host tests, prior production use, or productivity gains. The latest additions are new task-specific procedures, not renamed upstream files.

## Collection, not a link directory

The primary skill catalog contains local instructions and examples. External executable tools remain in a separate Tools collection with their real authors and source links. The website does not install them, and this repository does not claim to have implemented them.

[Original authoring approach](docs/ORIGINAL_SKILLS.md) · [Catalog metadata](catalog/entries.json) · [Getting started](docs/GETTING_STARTED.md) · [Roadmap](docs/ROADMAP.md) · [Contribution guide](CONTRIBUTING.md)

## Develop

Use Node 24 and the pinned package manager, `pnpm@12.4.2`.

```bash
npm install --global pnpm@12.4.2
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm validate  # Package shape and provenance checks
pnpm test      # Catalog and boundary tests
pnpm check     # Astro / TypeScript checks
pnpm build     # Static output in dist/
pnpm exec playwright install chromium
pnpm test:site # Browser tests against the production build
```

The site uses `/agent-toolkit/` as its base, including during local development. Repository checks and browser tests do not evaluate agent-host behavior.

## Hosting

The deployment workflow builds and publishes changes that reach `main`. GitHub Pages uses GitHub Actions as its source. No database, hosted MCP server, paid CMS, or Notion credentials are needed by the site. Check the deployment run for the revision currently published.

## Authorship and terms

The collection is maintained for Jordan Davis. Research can guide which problems to solve; each original package needs its own instructions, examples, and honest evidence. Actual reused materials and dependencies retain applicable notices and terms. See [ATTRIBUTION.md](ATTRIBUTION.md), [docs/ORIGINAL_SKILLS.md](docs/ORIGINAL_SKILLS.md), and [AGENTS.md](AGENTS.md).

A license for this repository's original content has not yet been selected. Public source visibility does not itself grant a reuse license. External projects retain their own terms; none are relicensed by this repository. Never publish private configurations, credentials, company code, or unapproved knowledge-base content here.
