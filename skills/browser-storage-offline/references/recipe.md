# Browser Storage and Offline State — original recipe

## Recipe: offline is a state, not a success label

Represent a pending edit separately from an accepted server version. On reconnect, reconcile by the same logical operation ID. A timed-out network request may already have succeeded; creating a new operation each retry can duplicate work.

For a harmless theme preference, storage failure can simply fall back to the default. For an unsaved document, specify a recovery/export path instead of silently dropping the draft. This skill does not install a service worker or new storage library.

## Failure fixture

Two accounts use the same persistent query cache and a new account briefly sees the previous account’s drafts after reload.

**Expected:** Scope and validate storage by trusted identity, clear the accepted private state at transition, and test reload and cross-tab behavior.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
