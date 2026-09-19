# Frontend Loading and Error States — original recipe

## Recipe: a region state table

| Data | Fetch outcome | Presentation |
| --- | --- | --- |
| None | Pending | Initial progress with a stable layout |
| Empty array | Accepted success | Real empty state and next action |
| Existing rows | Refetching | Rows plus bounded refresh feedback |
| Existing rows | Refresh failed | Rows plus failure/retry, not a fake empty list |
| None | Failed | Error with reachable recovery |

The isolated fixture exercises these states with controlled HTTP responses and zero read retries. That test setting is chosen for determinism; production retry policy must match actual failure classes.

## Failure fixture

A refetch fails while valid cached rows exist; the screen replaces them with an empty-state message saying no items exist.

**Expected:** Retain the same-identity data with an explicit refresh error and scoped retry, and do not relabel a request failure as successful emptiness.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
