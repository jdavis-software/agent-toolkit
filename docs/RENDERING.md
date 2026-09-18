# Rendering source packages safely

The website renders selected `SKILL.md` files without changing the underlying package. `vendor/` is an unmodified source snapshot; rendering transforms are not edits to upstream instructions.

Astro 7 uses Sätteri by default. This collection explicitly uses Astro’s official `@astrojs/markdown-remark@7.3.1` processor because `scripts/safe-markdown.mjs` transforms Markdown syntax trees before they become HTML. The processor and its transitive dependencies are recorded in the committed pnpm lockfile. Reference: [Astro 7 upgrade guidance](https://docs.astro.build/en/guides/upgrade-to/v7/).

The display transform:

- Demotes document-level headings beneath the page’s own title.
- Displays raw HTML as text rather than rendering it as active markup.
- Displays image descriptions without loading remote images.
- Rejects executable link schemes and relative links that escape the intended source revision.
- Resolves supporting-file links to the pinned upstream revision, or to this repository for original skills.

The site build reads instructions as content, never as build commands. Copied scripts are not executed. Source integrity checks reject missing files, unexpected files, hashes that no longer match, and missing license records. Those checks detect drift; they do not replace review of changes to the source and integrity lock together.

Unit tests exercise the display transformations and snapshot boundaries. Browser tests verify rendered source pages and links. Neither is an agent-host evaluation or a claim that every linked upstream tool is safe or compatible with every environment.

When changing the processor, re-run catalog validation, unit tests, Astro checks, the production build, and desktop/mobile browser tests. Inspect the actual rendered instructions and original source links, not just the landing page.
