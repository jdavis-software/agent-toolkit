# Contributing to Jordan’s collection

Suggest one concrete skill or tool and the problem it solves. The goal is a useful personal collection, not the largest list or a copy of entire frameworks.

## Selection criteria

Usefulness for real engineering work, clarity of instructions, supporting examples, inspectable provenance, maintenance context, and manageable dependencies. Popularity can help discovery but is not a substitute for reviewing the actual package. Explain overlap with existing selections and when a different approach is appropriate.

## Catalog entry

Add the author, official source, category, selection rationale (`why`), prerequisites, and limitations. Keep original, adapted, and curated origins separate. Do not claim personal usage, production readiness, host compatibility, or performance without actual evidence. Repository overviews retained for old links use `listed: false`; they do not inflate the visible selection count.

## Including source

Review package-level terms first. Pin the repository revision and archive digest in `catalog/upstreams.json`; declare only the selected package path and license in `catalog/entries.json`. Use `python3 scripts/import-upstream.py` to generate the snapshot and integrity lock. It downloads public archives but never executes their code. A changed archive, unexpected file type, unsafe path, or edited destination fails rather than silently overriding the review.

Preserve license notices and supporting files. Keep an unmodified snapshot separate from any future adaptations. Updates need a dedicated reviewed diff; do not auto-merge remote changes. When terms are unresolved, link upstream.

## Checks

From the repository root, run `node scripts/readme.mjs --write` after metadata edits, then `pnpm validate`, `pnpm test`, `pnpm check`, `pnpm build`, and `pnpm test:site`. Inspect desktop/mobile rendering for changes to catalog content. Check links and any declared integration manually as appropriate. Skipped or unrun checks are not passing evidence.

No private documents, credentials, internal company code, or local machine settings. Do not treat upstream skill prose as an instruction to the site build or importer. The owner has not yet selected a license for original toolkit/site content.
