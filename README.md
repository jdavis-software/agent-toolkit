# Agent Toolkit

A curated collection of agent skills, workflows, and developer tooling for building, coordinating, and validating AI-assisted software engineering.

**Initial implementation:** an Astro catalog and three original, experimental starter skills. These are newly written packages, not a claim that Jordan has already used or validated them in production. External tools remain clearly attributed upstream references.

## Explore

- [Original skills](skills/) — task planning, worktree handoffs, and affected verification.
- [Catalog metadata](catalog/entries.json) — original and curated entries, without duplicated skill descriptions.
- [Getting started](docs/GETTING_STARTED.md) · [Roadmap](docs/ROADMAP.md) · [Contribution guide](CONTRIBUTING.md).

The configured GitHub Pages target is `https://jdavis-software.github.io/agent-toolkit/`. A configured target is not confirmation of deployment. Check the repository's Actions runs and Pages settings for the current deployment status.

## Develop

Use Node 24 and the pinned package manager, `pnpm@12.4.2`.

```bash
npm install --global pnpm@12.4.2
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm validate  # Package shape and provenance checks
pnpm test      # Catalog boundary tests
pnpm check     # Astro / TypeScript checks
pnpm build     # Static output in dist/
pnpm exec playwright install chromium
pnpm test:site # Browser tests against the production build
```

The site uses `/agent-toolkit/` as its base, including during local development. Validation and browser tests do not establish agent-host behavior. The site and skills have separate evidence requirements.

## Hosting

The deployment workflow builds and publishes after changes reach `main`. Set **Settings → Pages → Source → GitHub Actions** once. No database, hosted MCP server, paid CMS, or Notion credentials are needed by the site.

## Scope and attribution

Original, adapted, and curated are separate origins. New skills are experimental until evaluated. Do not copy private configurations, credentials, product code, or unapproved knowledge-base content here. See [ATTRIBUTION.md](ATTRIBUTION.md) and [AGENTS.md](AGENTS.md).

A license for this repository's original content has not yet been selected. Public source visibility does not itself grant a reuse license. External projects retain their own terms; none are relicensed by this repository.
