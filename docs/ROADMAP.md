# Roadmap and handoff

## Implemented in the initial branch
- Astro static site, catalog search/filtering, detail routes, theme switching, responsive layout, source links, sitemap, and JSON export.
- Three newly written experimental starter skills: work-packet-planner, worktree-handoff, affected-verification.
- Six attributed external references. These are not installed or benchmarked by this project.
- Catalog validation, negative tests, browser tests, and GitHub Actions configuration.

Implementation is distinct from passing checks and public deployment. Current results belong in Actions; do not mark unrun tests green in this document.

## Before calling the toolkit released
- [ ] Owner selects an original-content license.
- [ ] Review the initial design and complete public diff.
- [ ] Confirm the locked install, static build, checks, and browser tests pass.
- [ ] Enable and verify GitHub Pages deployment.
- [ ] Inventory Jordan's actual existing skills and tooling; do not assume these starter names match existing assets.
- [ ] Decide which actual assets can be published without exposing company or personal information.
- [ ] Evaluate original skills in an identified agent host with success and boundary cases.
- [ ] Test selective installation, activation, update, and removal before adding install controls.

## Next useful additions
Add actual public-safe skill packages backed by evidence. Then consider contract-change review, bounded context packets, cache-invalidation review, and the separate content-writing collection. Reuse existing graph, browser, and installation tools. A custom CLI/MCP service or bundle builder is not a launch requirement.

## Parallel task boundaries
Catalog/schema owner: catalog metadata and validation. UI owner: components, styles, pages. Skill owner: one package and its fixtures. CI owner: toolchain, lockfile, workflows. Coordinate shared browser tests. Integration must validate the combined candidate, not only independent green branches.
