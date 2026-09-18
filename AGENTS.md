# Repository instructions

## Canonical files
`skills/*/SKILL.md` owns each original skill's name, description, and instructions. `catalog/entries.json` owns catalog metadata and external tool references. `scripts/catalog.mjs` validates and assembles them. Astro generates pages and `catalog.json`; do not maintain separate hand-edited copies of skill descriptions.

`tools/skillcheck.mjs` is the executable helper entry point; its original contracts, Git inspection, and process collection modules live in `tools/lib/`. `examples/skillcheck/` contains synthetic fixtures, not real user evidence. `docs/SKILL_TOOLS.md` documents supported commands and limits. Keep CLI behavior, docs, and tests aligned.

## Bundles and project adapters
`catalog/bundles.json` selects canonical local skills. `tools/bundle.mjs` and `tools/lib/bundles.mjs` implement read-only resolution; they do not install or execute selected tools. Keep source identity and content-only resolution distinguishable. Keep private project bindings outside this public repository; follow `docs/PRIVATE_ADAPTERS.md`.

New domain skills include `references/scenarios.json` as not-run evaluation inputs. Run `node --test tests/bundles.test.mjs` for bundle/resolution tests. All local skills must appear in at least one focused bundle. Keep bundle selection, validation, site routes, and counts derived from canonical files. Use `node scripts/readme.mjs --write` to update the README index. Published instruction changes require browser verification as well as package checks.

## Personal collection and authoring
The public identity is Jordan's Agent Toolkit Collection. Lead with local skill packages and practical workflows, not a directory of entire upstream skill libraries. Write new instructions from task requirements, with new examples and evaluation scenarios. Do not paraphrase an upstream file and label it independent merely because its wording changed. Follow `docs/ORIGINAL_SKILLS.md`.

External executable tools retain their actual identities. A skill about a CLI or MCP server is not a reimplementation of that software. Record research and actual reuse accurately; retain required notices. Never claim legal clean-room status, prior personal use, or a completed best-of-ecosystem evaluation without evidence.

## Work boundaries
Use an owned branch/worktree for non-trivial work. Assign one owner to shared catalog contracts, the lockfile, configuration, and release workflows. Read the actual diff and current branch before editing. Never reset or delete another task's work. Do not change external project repositories as part of this site.

## Checks
Run `pnpm validate`, `pnpm test`, `pnpm check`, and `pnpm build`. `pnpm test` includes catalog and helper tests. The dependency-free helper suite can also run as `node --test tests/skillcheck.test.mjs`; `node examples/skillcheck/defect-demo.mjs` exercises controlled defects. Keep failures and boundary cases, not just happy paths.

For UI or published instruction changes, run `pnpm test:site` after installing the required browser. Test the `/agent-toolkit/` base, mobile layout, keyboard access, theme persistence, filters, empty states, and source links. Report commands and actual results; skipped checks do not pass. Scenario files and structurally valid reports are not completed host evaluations. Follow `docs/EVALUATION.md` before making comparison claims.

## Trust and publication
This repository is public, including branches. Never commit private research, local paths, customer data, credentials, personal context, or company code. A hidden website card is not a privacy boundary. No automatic Notion export. Do not invent adoption, authorship, benchmark, installer, or host-compatibility claims. Do not install a curated tool merely because it appears in the catalog.

Store live command receipts outside the target worktree and review them for sensitive output before sharing. Helper JSON is not signed attestation. Scope declarations are not a sandbox. Process execution inherits caller authority; no helper may silently add network access, publication, cleanup, installation, or a model call.

## Skills and licenses
The skills are AI-assisted experimental packages. Preserve that distinction until real evaluations justify an update. Adaptations require upstream source, pinned revision, applicable license, and a change summary. Do not add a license grant for original repository content without the owner's decision. Prefer links over redistribution when upstream terms are unclear.

## Dependencies
Use the pinned versions and committed lockfile. Never hand-author a lockfile or silently switch package managers. Dependency upgrades are separate reviewed changes. Keep helper modules dependency-free unless a concrete requirement warrants a reviewed exception. Avoid new frameworks, remote APIs, telemetry, installers, or MCP services without a demonstrated task gap.

## Category and orchestration contracts
`catalog/categories.json` owns primary category metadata; each entry has exactly one `categoryId`. Counts are derived. Fine-grained `category` topics and overlapping bundles remain distinct. `tools/agentflow.mjs` and `tools/lib/agentflow.mjs` provide offline coordination only. Use explicit private adapters for actual workers and authority. Keep `companionTools` and resolved package files aligned. Agentflow tests and synthetic scenarios do not establish agent-host effectiveness.

## Public source intake
`tools/sourcekit.mjs` wraps `tools/sourcekit.py`; reusable modules live under `tools/sourcekit_lib/`. Python 3.10+ standard library only. Keep `docs/SOURCEKIT.md`, examples, Python tests, bundle companions, and private-adapter boundaries aligned. Default routing/doctor and local parsing have no network effects. Live reads require exact approved hosts; never weaken private-address, redirect, credential, or size checks to make a test pass. Do not install Agent-Reach or other source tools as a side effect of building this site. Run `pnpm test:sourcekit` and the existing browser suite.
