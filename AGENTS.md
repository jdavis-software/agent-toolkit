# Repository instructions

## Canonical files
`skills/*/SKILL.md` owns each original skill's name, description, and instructions. `catalog/entries.json` owns catalog metadata and external tool references. `scripts/catalog.mjs` validates and assembles them. Astro generates pages and `catalog.json`; do not maintain separate hand-edited copies of skill descriptions.

## Personal collection and authoring
The public identity is Jordan's Agent Toolkit Collection. Lead with local skill packages and practical workflows, not a directory of entire upstream skill libraries. Write new instructions from task requirements, with new examples and evaluation scenarios. Do not paraphrase an upstream file and label it independent merely because its wording changed. Follow `docs/ORIGINAL_SKILLS.md`.

External executable tools retain their actual identities. A skill about a CLI or MCP server is not a reimplementation of that software. Record research and actual reuse accurately; retain required notices. Never claim legal clean-room status, prior personal use, or a completed best-of-ecosystem evaluation without evidence.

## Work boundaries
Use an owned branch/worktree for non-trivial work. Assign one owner to shared catalog contracts, the lockfile, configuration, and release workflows. Read the actual diff and current branch before editing. Never reset or delete another task's work. Do not change external project repositories as part of this site.

## Checks
Run `pnpm validate`, `pnpm test`, `pnpm check`, and `pnpm build`. For UI changes, also run `pnpm test:site` after installing the required browser. Test the `/agent-toolkit/` base, mobile layout, keyboard access, theme persistence, filters, empty states, and source links. Report commands and actual results; skipped checks do not pass. Evaluation scenario files are inputs for later host runs, not test results.

## Trust and publication
This repository is public, including branches. Never commit private research, local paths, customer data, credentials, personal context, or company code. A hidden website card is not a privacy boundary. No automatic Notion export. Do not invent adoption, authorship, benchmark, installer, or host-compatibility claims. Do not install a curated tool merely because it appears in the catalog.

## Skills and licenses
The skills are AI-assisted experimental packages. Preserve that distinction until real evaluations justify an update. Adaptations require upstream source, pinned revision, applicable license, and a change summary. Do not add a license grant for original repository content without the owner's decision. Prefer links over redistribution when upstream terms are unclear.

## Dependencies
Use the pinned versions and committed lockfile. Never hand-author a lockfile or silently switch package managers. Dependency upgrades are separate reviewed changes. Avoid new frameworks, remote APIs, telemetry, installers, or MCP services unless an actual requirement warrants them.
