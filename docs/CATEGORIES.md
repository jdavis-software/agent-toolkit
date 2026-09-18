# Category browsing

Categories answer **what area does this solve?** Bundles answer **which skills are useful together?** An entry has exactly one primary `categoryId` for navigation, while bundles can overlap. The existing `category` field is a finer topic and remains available in catalog filters and shared URLs.

`catalog/categories.json` owns names, short descriptions, ordering, and approved icon keys. `scripts/categories.mjs` validates the registry against canonical entries and derives membership and counts. Unknown assignments, duplicate IDs, unsupported icons, and empty categories fail the build. Do not create empty category cards or manually maintained counts to imply more content.

The twelve initial areas are Agent Orchestration, Runtime & Governance, Context & Memory, TypeScript, Go Engineering, APIs & Integrations, Data & State, Durable Workflows, Testing & Quality, DevOps & Delivery, Media Pipelines, and MCP & CLI Tooling.

The category index uses a responsive three-column icon-card grid, inspired by the browsing pattern Jordan selected. It retains the toolkit's identity and palette, with original descriptions and icon paths. Each card opens a statically generated category page; search and topic/origin filters then operate only within that category. Reset does not remove the category boundary. Category contents work without JavaScript; interactive filters need JavaScript.

Counts explicitly describe entries and their skill/tool breakdown. Categories do not imply the presence of hosted agents or MCP servers: an instruction package remains a skill, and a linked tool remains an external tool. JSON discovery, build metadata, and the sitemap are generated from the same validated definitions.
