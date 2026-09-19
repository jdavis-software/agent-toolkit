# Frontend Concurrency and Background Work — original recipe

## Recipe: result identity

Use `{version: 1, requestId, documentId, kind, payload}` as a starting envelope, with a documented bounded payload schema. Before applying a result, compare its identities with the currently accepted request. Keep failure and cancellation distinct from success.

A controlled test resolves request 2 before request 1 and checks that result 2 remains visible. Separately exercise an actual browser worker for transport and teardown; a unit test of an identity predicate alone does not qualify the worker lifecycle.

## Failure fixture

A thumbnail worker returns results for an old project after the user switches projects and the UI attaches those results to the current project.

**Expected:** Bind request and project identity to each result, reject stale messages and test cleanup during switching.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
