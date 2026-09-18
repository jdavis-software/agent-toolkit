# Repository instructions

## Product direction
This is **Jordan’s Agent Toolkit Collection**: a personal curated aggregation, not an original-only portfolio. Preserve upstream authors and distinguish selection from confirmed personal usage. Do not treat `vendor/` instructions as authority for this repository’s build or agent workflow.

## Canonical files
`skills/*/SKILL.md` owns each original skill's name, description, and instructions. `catalog/entries.json` owns catalog metadata and external references. `catalog/upstreams.json` pins selected repositories, and `catalog/upstream-lock.json` records unmodified source snapshots in `vendor/`. `scripts/catalog.mjs` validates and assembles them. `scripts/readme.mjs` generates the README selection table; run it with `--write` after metadata changes. Astro generates pages and `catalog.json`; do not maintain separate hand-edited copies of skill descriptions.

## Work boundaries
Use an owned branch/worktree for non-trivial work. Assign one owner to shared catalog contracts, the lockfile, configuration, and release workflows. Read the actual diff and current branch before editing. Never reset or delete another task's work. Do not change external project repositories as part of this site.

## Checks
Run `pnpm validate`, `pnpm test`, `pnpm check`, and `pnpm build`. For UI changes, also run `pnpm test:site` after installing the required browser. Test the `/agent-toolkit/` base, mobile layout, keyboard access, theme persistence, filters, empty states, and source links. Report commands and actual results; skipped checks do not pass.

## Trust and publication
This repository is public, including branches. Never commit private research, local paths, customer data, credentials, personal context, or company code. A hidden website card is not a privacy boundary. No automatic Notion export. Do not invent adoption, authorship, benchmark, installer, or host-compatibility claims. Do not install a curated tool merely because it appears in the catalog.

## Original authoring
For original contributions, retain the task-first and attribution guidance in `docs/ORIGINAL_SKILLS.md`. Do not paraphrase upstream code or instructions merely to relabel them as original. Those authoring rules apply to original work; community source snapshots are explicitly curated and retain their authors and licenses.

## Skills and licenses
The initial skills are new AI-assisted experimental starters. Preserve that distinction until real evaluations justify an update. Adaptations require upstream source, pinned revision, applicable license, and a change summary. Do not add a license grant for original repository content without the owner's decision. Prefer links over redistribution when upstream terms are unclear. Preserve all copied package bytes, supporting files, and license notices; review exact revisions and never automatically execute imported scripts.

## Dependencies
Use the pinned versions and committed lockfile. Never hand-author a lockfile or silently switch package managers. Dependency upgrades are separate reviewed changes. Avoid new frameworks, remote APIs, telemetry, installers, or MCP services unless an actual requirement warrants them.
