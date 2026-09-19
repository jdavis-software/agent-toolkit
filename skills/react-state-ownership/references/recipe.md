# React State Ownership — original recipe

## Recipe: classify a library screen

| Value | Owner | Reset event |
| --- | --- | --- |
| Workspace and committed filters | URL/router | Authorized navigation |
| Items received from the API | Scoped query key | Invalidation or identity change |
| Unsaved item label | Form instance keyed by item ID | Confirmed cancel/save/record switch |
| Dialog visibility | Nearest component | Close/unmount |
| Visible item count | Derived render value | Recomputed, not stored |

For the isolated React fixture, changing the workspace changes the query key rather than relabeling the previous workspace's cached rows. Query-key separation reduces cache mistakes; it is not server authorization.

## Failure fixture

A refetch overwrites a dirty form, while a local selected-object copy continues to show the previous record.

**Expected:** Preserve the draft under an explicit conflict policy, derive selection by ID, and avoid introducing another synchronized copy.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
