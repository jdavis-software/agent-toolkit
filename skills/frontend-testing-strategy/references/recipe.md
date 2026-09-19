# Frontend Testing Strategy — original recipe

## Recipe: one flow, multiple seams

Pure tests cover URL parsing and payload validation. Real TanStack Query tests cover scoped cache identity and invalidation. Browser tests cover typing, delayed requests, mutation rollback, field errors and keyboard controls. The server is a synthetic fixture; production authentication and provider integration remain separate.

Before accepting a green run, inspect the test names and report. A retry that eventually passes is useful evidence of flakiness, not identical to a clean first-attempt pass.

## Failure fixture

A newly added test file is absent from Playwright’s explicit registry, so CI reports success without running its interaction tests.

**Expected:** Check discovery and expected execution counts, register the file, and prove the required user journey ran without a hidden skip.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
