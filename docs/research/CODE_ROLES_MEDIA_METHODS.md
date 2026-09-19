# Selected research: code intelligence, roles, production and methods

Reviewed 2026-09-19. The implementation uses independently written procedures and synthetic examples rather than copied upstream skills or engines. This record describes selected source findings and decisions; it is not an exhaustive security audit or reproduced benchmark.

| Source | Reviewed revision | Decision |
| --- | --- | --- |
| [Graft](https://github.com/trailhq/Graft) | `8c05769618d413041ea2c8891f82d566f0461b3c` | Optional code-intelligence candidate; use original orientation and index qualification procedures. |
| [OpenMontage](https://github.com/calesthio/OpenMontage) | `08e2151fa02de28a5d6a312b3d575692bf147ad7` | Learn production stages and input revision handling; do not vendor the application. |
| [Codebase Memory MCP](https://github.com/DeusData/codebase-memory-mcp) | `59a05eb1bf9e11deb060d782cd7d3a29f2ae2866` | Alternative optional graph backend, not a second mandatory store. |
| [Agency Agents](https://github.com/msitarzewski/agency-agents) | `ad9264e309bd5e5422c04784372d7841b1e5d604` | Select a small role-to-skill abstraction, not hundreds of copied personas. |
| [Scientific Agent Skills](https://github.com/K-Dense-AI/scientific-agent-skills) | `330c8e764435a731eff571e3efdda70b363d0792` | Use broadly applicable experiment and data-review requirements, not specialized laboratory dependencies. |

## Source findings that informed requirements

Graft's [refresh implementation](https://github.com/trailhq/Graft/blob/8c05769618d413041ea2c8891f82d566f0461b3c/src/graph/refresh.ts) checks drift before retrieval and coordinates rebuilds, but may fall back to an existing graph with a warning on lock timeout or failure. The structural query refresh and readable Markdown projections can follow different update paths. Our requirements therefore preserve stale/unknown states and selected input identities rather than claim every returned graph answer is fresh.

Codebase Memory's [measurement guide](https://github.com/DeusData/codebase-memory-mcp/blob/59a05eb1bf9e11deb060d782cd7d3a29f2ae2866/docs/MEASURING_SAVINGS.md) distinguishes current repository status from the revision that produced indexed records. It calls for a fresh successful index and known-answer checks. Its separation of answer quality, engine latency and agent usage supports using the existing canary infrastructure instead of repeating advertised savings as toolkit results.

OpenMontage's [agent guide](https://github.com/calesthio/OpenMontage/blob/08e2151fa02de28a5d6a312b3d575692bf147ad7/AGENT_GUIDE.md) separates reference analysis, production proposals, assets, decisions and composition. Its [cost tracker](https://github.com/calesthio/OpenMontage/blob/08e2151fa02de28a5d6a312b3d575692bf147ad7/tools/cost_tracker.py) distinguishes warning and rejecting budget modes. Our additions preserve input revisions and task-specific approval boundaries. The root license is [AGPL-3.0](https://github.com/calesthio/OpenMontage/blob/08e2151fa02de28a5d6a312b3d575692bf147ad7/LICENSE); no application or source asset was copied. Any later actual reuse requires its own license/dependency review.

Agency Agents' [sample frontend profile](https://github.com/msitarzewski/agency-agents/blob/ad9264e309bd5e5422c04784372d7841b1e5d604/engineering/engineering-frontend-developer.md) supplies responsibilities and examples through Markdown. Our original role registry composes already-canonical skill IDs. It makes no claim of trained specialization, inherited memory or runtime permissions.

K-Dense's [experimental-design](https://github.com/K-Dense-AI/scientific-agent-skills/blob/330c8e764435a731eff571e3efdda70b363d0792/skills/experimental-design/SKILL.md) and [EDA](https://github.com/K-Dense-AI/scientific-agent-skills/blob/330c8e764435a731eff571e3efdda70b363d0792/skills/exploratory-data-analysis/SKILL.md) highlight grouping, units, missingness and scope. Our CSV checker is deliberately limited to a fixed engineering workload. It reports descriptive paired differences without implying statistical significance or broad superiority. Clinical, laboratory and specialized scientific integrations were excluded.

## Independent technical references

[Agent Skills specification](https://agentskills.io/specification) informs progressive use of references; [Tree-sitter query syntax](https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html) distinguishes structural matching; [NIST paired observations](https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm) describes within-unit differences; [NIST experimental design](https://www.itl.nist.gov/div898/handbook/pri/section3/pri3.htm) guides experiment planning; [FFprobe documentation](https://ffmpeg.org/ffprobe.html) distinguishes stream/frame observations and notes seeking limitations. The implemented helpers do not run Tree-sitter, inference libraries or FFmpeg as part of these record checks.

## What is actually implemented

Eight original skills, eight role presets, read-only role resolution using bundle mechanics, two new bundles, an expanded existing media bundle, and Publicationcheck index/timeline/dataset/experiment contracts. Local synthetic fixtures check current source/asset/dependency bytes, malformed records, incomplete tasks and paired descriptive arithmetic. Website discovery includes Roles, role detail contracts, canonical skill links and JSON metadata. Runtime graph/index behavior, media rendering/continuity, host authority and agent effectiveness remain untested by these helpers.

The unlinked labels “Open-source agent tools” and “Diagram Design” were not mapped to guessed repositories. No upstream installs, auto-paid summarization, private project configuration, production data, new scheduler or human-knowledge-base export is included.
