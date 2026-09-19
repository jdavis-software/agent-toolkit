---
name: search-discoverability-audit
description: "Audit a static publication for canonical URL, metadata, sitemap, internal-link and indexing-directive mistakes while separating technical findings from search ranking claims."
metadata:
  version: "0.1.0"
---
# Search Discoverability Audit

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Audit a static publication for canonical URL, metadata, sitemap, internal-link and indexing-directive mistakes while separating technical findings from search ranking claims.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Bind the audit to the publication

Identify the exact artifact revision, origin and base path, intended indexable routes, redirects and exclusions. A project site at a path prefix must not be audited as though it lives at the origin root. Bound the number of pages and bytes inspected; avoid automatically crawling other sites.

### 2. Inspect the generated representation

Check meaningful titles/descriptions, explicit canonical URLs, meta robots and project-base consistency in actual built HTML. Reconcile sitemap URLs against intended pages and inspect internal links and anchors. Distinguish a deliberate non-indexable error page from an accidental noindex on a product or article.

### 3. Inspect semantics separately

Validate structured-data syntax and then manually compare its claims with visible content and the applicable search feature rules. Do not invent reviews, ratings, organizational facts or unpublished capabilities to improve eligibility. Ensure captions and text alternatives describe actual content.

### 4. Verify the live boundary when authorized

Build checks cannot see response headers, robots served by the host, redirects, indexing or ranking. Use an authorized bounded live check or Search Console evidence where available. Do not call a local artifact technically searchable and then claim the search engine has indexed it.

### 5. Return actionable findings and limits

For each issue include the route, observed mismatch, intended target, bounded correction and verification. Rerun the original broken-path/noindex/canonical fixtures. The companion audits local HTML, metadata, sitemap/internal links and JSON-LD syntax only; it neither submits URLs nor predicts ranking or AI citation outcomes.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

A local build uses /skills/ where /agent-toolkit/skills/ is required, or points canonicals at a staging origin. Correct the public-path contract; do not merely suppress the finding to make CI green.

## Example

Run the companion on the actual dist directory. Synthetic fixtures independently introduce noindex, a wrong canonical and a missing internal target, demonstrating that these failures cannot pass unnoticed.

## Companion and evaluation

The original Publicationcheck helper provides the `site` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
