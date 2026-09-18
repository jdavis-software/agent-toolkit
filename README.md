# Jordan’s Agent Toolkit Collection

A personal collection of standout agent skills, workflows, and developer tools from across the community—selected by Jordan Davis and gathered in one place.

**[Explore the collection](https://jdavis-software.github.io/agent-toolkit/)** · [Sources & authors](https://jdavis-software.github.io/agent-toolkit/sources/) · [My GitHub](https://github.com/jdavis-software) · [Engineering articles](https://jdavis-software.github.io/content/)

This is a curated collection, not a claim that I authored every component. It brings together individual selections from Vercel, ECC, Superpowers, Anthropic, and Supabase, alongside useful tools and a small original starter collection. Each entry explains why it is included and what to consider before using it.

## Explore the selections

<!-- collection:start -->

| Selection | Source | Availability |
| --- | --- | --- |
| [React Best Practices](https://jdavis-software.github.io/agent-toolkit/skills/vercel-react-best-practices/) | Vercel Agent Skills | Upstream link |
| [React Composition Patterns](https://jdavis-software.github.io/agent-toolkit/skills/vercel-composition-patterns/) | Vercel Agent Skills | Upstream link |
| [Frontend Design](https://jdavis-software.github.io/agent-toolkit/skills/anthropic-frontend-design/) | Anthropic Skills | Source included |
| [Web Interface Review](https://jdavis-software.github.io/agent-toolkit/skills/vercel-web-design-guidelines/) | Vercel Agent Skills | Upstream link |
| [Search Before You Build](https://jdavis-software.github.io/agent-toolkit/workflows/ecc-search-first/) | ECC | Source included |
| [Systematic Debugging](https://jdavis-software.github.io/agent-toolkit/workflows/superpowers-systematic-debugging/) | Superpowers | Source included |
| [Test-Driven Development](https://jdavis-software.github.io/agent-toolkit/workflows/ecc-tdd-workflow/) | ECC | Source included |
| [Web App Testing](https://jdavis-software.github.io/agent-toolkit/skills/anthropic-webapp-testing/) | Anthropic Skills | Source included |
| [Verification Loop](https://jdavis-software.github.io/agent-toolkit/workflows/ecc-verification-loop/) | ECC | Source included |
| [Evidence Before Completion](https://jdavis-software.github.io/agent-toolkit/workflows/superpowers-verification-before-completion/) | Superpowers | Source included |
| [Working in Git Worktrees](https://jdavis-software.github.io/agent-toolkit/workflows/superpowers-using-git-worktrees/) | Superpowers | Source included |
| [API Design](https://jdavis-software.github.io/agent-toolkit/skills/ecc-api-design/) | ECC | Source included |
| [Go Development Patterns](https://jdavis-software.github.io/agent-toolkit/skills/ecc-golang-patterns/) | ECC | Source included |
| [Go Testing Patterns](https://jdavis-software.github.io/agent-toolkit/skills/ecc-golang-testing/) | ECC | Source included |
| [Postgres Best Practices](https://jdavis-software.github.io/agent-toolkit/skills/supabase-supabase-postgres-best-practices/) | Supabase Agent Skills | Source included |
| [Document Co-Authoring](https://jdavis-software.github.io/agent-toolkit/workflows/anthropic-doc-coauthoring/) | Anthropic Skills | Upstream link |
| [Skills CLI](https://jdavis-software.github.io/agent-toolkit/tools/skills-cli/) | Vercel | Upstream link |
| [Nx AI Integration](https://jdavis-software.github.io/agent-toolkit/tools/nx/) | Nx | Upstream link |
| [Playwright MCP](https://jdavis-software.github.io/agent-toolkit/tools/playwright-mcp/) | Microsoft | Upstream link |
| [Work Packet Planner](https://jdavis-software.github.io/agent-toolkit/skills/work-packet-planner/) | Jordan’s starters | Experimental starter |
| [Worktree Handoff](https://jdavis-software.github.io/agent-toolkit/skills/worktree-handoff/) | Jordan’s starters | Experimental starter |
| [Affected Verification](https://jdavis-software.github.io/agent-toolkit/skills/affected-verification/) | Jordan’s starters | Experimental starter |

<!-- collection:end -->

## What is included

**Source included:** the selected package is copied byte-for-byte into `vendor/<source>/<package>/`, including its supporting files and applicable license. Original authors keep their credit. `catalog/upstream-lock.json` records each file’s source revision and SHA-256; validation fails on drift.

**Upstream link:** the full tool or package stays with its author. Some packages remain linked because redistribution details need further review. A link can still be a useful curated selection; it is not counted as an original skill.

**Experimental starter:** newly written AI-assisted instructions in `skills/`. These are not represented as existing private production tools. A license for original repository content has not yet been selected. The licenses of copied packages apply to those packages, not to this entire repository.

## Using the collection

Choose the problem first, then read the selection notes and complete source package. Keep the original package folder intact so references and helpers are available. Follow the target agent host’s documented installation method in a disposable project before enabling a skill in real work. The collection does not automatically install tools, activate hooks, or grant credentials. Some packages reference broader frameworks or live external documents.

Several testing and verification workflows overlap. Compare them; do not blindly enable all of them. Source review and website tests are not agent-host evaluations, security certifications, or claims that Jordan uses every selection in production.

## Contributing and maintenance

Suggest a concrete skill or tool with its use case and source. See [CONTRIBUTING.md](CONTRIBUTING.md), [ATTRIBUTION.md](ATTRIBUTION.md), and [the curation policy](docs/CURATION.md). Upstream changes are reviewed before adoption, never silently synchronized at build time. No private Notion exports, credentials, company code, or machine configurations belong here.

## Website development

Run commands from the repository root with Node 24 and the pinned `pnpm@12.4.2`:

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm test
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test:site
pnpm dev
```

The Astro site uses `/agent-toolkit/` as its base. The catalog, source registry, public JSON, and this README’s selection table share the same metadata. After changing metadata, run `node scripts/readme.mjs --write`; CI checks for drift. The website builds offline from the committed source packages, without calling Notion or upstream repositories.

GitHub Actions validates the combined changes and deploys approved `main` revisions to GitHub Pages. See [the roadmap](docs/ROADMAP.md) for work that remains separate from publishing the website.
