# Attribution and upstream provenance

**Collection curator:** Jordan Davis. Curation, editorial notes, and organization do not transfer authorship of upstream material.

| Source | Authors | Selected package terms |
| --- | --- | --- |
| [ECC](https://github.com/affaan-m/ECC) | Affaan Mustafa and contributors | MIT; root license preserved as `UPSTREAM_LICENSE.txt` in each selected package |
| [Superpowers](https://github.com/obra/superpowers) | Jesse Vincent and contributors | MIT; root license preserved in each selected package |
| [Anthropic Skills](https://github.com/anthropics/skills) | Anthropic | `frontend-design` and `webapp-testing`: their Apache-2.0 `LICENSE.txt` files are preserved |
| [Supabase Agent Skills](https://github.com/supabase/agent-skills) | Supabase | MIT; root license preserved in the selected package |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | Vercel | Individual packages linked, not copied; inspect upstream terms |

Copied files are unchanged from the revisions in `catalog/upstreams.json`. `catalog/upstream-lock.json` maps every imported file—including licenses—to its exact upstream path and SHA-256. Added root-license copies do not modify the upstream instructions. Supporting files in each selected subtree are preserved; the wider framework is not necessarily included.

Vercel’s pinned snapshot declares MIT but has no standalone repository license file. The current collection links those selections instead of manufacturing missing copyright notices. Anthropic’s `doc-coauthoring` remains linked because that selected folder has no package-level license file. Do not infer rights from a neighboring skill. Anthropic document-generation packages with different terms are not copied.

Tool references—Vercel Skills CLI, Nx AI integration, and Microsoft Playwright MCP—remain upstream. No affiliation or endorsement is implied. ECC’s browsable catalog inspired the discovery model; the Agent Skills specification informs packaging.

The site escapes raw HTML, omits remote images, and resolves relative reference links during rendering. Those display transformations do not alter the files in `vendor/` or their authorship. Original toolkit/site licensing remains the owner’s separate decision; there is no blanket root license that overrides upstream terms.
