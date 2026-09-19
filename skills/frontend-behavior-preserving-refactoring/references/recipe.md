# Frontend Behavior-preserving Refactoring — original recipe

## Recipe: a safe extraction sequence

First pin an observable test for editing and submitting a row. Extract its presentation without changing state ownership. Next extract the network boundary if it has a separate responsibility, checking that exactly one mutation still occurs per accepted user action.

Only then consider a shared hook, and only if its lifecycle and consumers justify it. Keep the original failing fixtures for stale closures, duplicate effects and lost drafts so a later refactor cannot silently reintroduce them.

## Failure fixture

Extracting a row editor changes its key, causing unsaved input to reset whenever a background query refreshes.

**Expected:** Preserve the editor’s accepted record identity and draft policy, then test refetch while typing and keyboard focus.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
