# Isolated frontend fixture

Original synthetic React client application and independently controlled test responses for the public toolkit's frontend skills. This is **not a product application or an agent-host evaluation**.

See [the complete guide](../../docs/FRONTEND_ENGINEERING.md) for installation commands, exact scope and limitations. This standalone npm package has its own generated lock. The root remains a pnpm/Astro project; no root dependency changes are required.

The app implements URL-owned workspace/search, workspace-scoped TanStack Query records, a React Hook Form create draft, a serialized optimistic favorite mutation, literal Tailwind variants and named Bootstrap icons via React Icons. Test cases include initial and refresh errors, invalid payloads, late search, denied saves, duplicate submission, rollback, keyboard action names, long labels and themes.

Run from the repository root:

```bash
npm ci --prefix evals/frontend --ignore-scripts
npm --prefix evals/frontend run check
npm --prefix evals/frontend run build
npm --prefix evals/frontend test
pnpm exec playwright test --config=evals/frontend/playwright.config.ts
```

`npm --prefix evals/frontend run dev` serves `.build/` and a tiny in-memory API at `http://127.0.0.1:4343`. It is loopback-only and must not be exposed as a production service. Automated browser tests replace API responses with per-test fixtures, so they prove client behavior, not a real product API integration. No credentials, customer data, provider spending or external requests are used by the example.

The build writes measured sizes, esbuild metadata and third-party license notices. Its budgets are predeclared in `build.mjs`. Inspect `.evidence/` and CI artifacts for actual outcomes; the source README does not imply that any particular environment has passed.

The Bootstrap icon-family license is copied verbatim from upstream blob `f95243911022df8e34bb8c73c87ef491ee1696cf`. Other notices are collected from locked installed packages during build. This is not a license grant for the toolkit's original source.
