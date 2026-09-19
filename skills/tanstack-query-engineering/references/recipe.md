# TanStack Query Engineering — original recipe

## Recipe: a complete list identity

```tsx
const itemKeys = {
  all: (workspace: string) => ['items', workspace] as const,
  list: (workspace: string, query: string) =>
    ['items', workspace, { query }] as const,
};
```

The isolated fixture runs TanStack Query v5 against controlled synthetic responses. It disables retries to make failures observable, consumes cancellation, and serializes its small favorite mutation. That deliberately limited strategy is not a general solution for collaborative concurrent editing.

Define separate cases for initial loading, background fetching, empty results and error-with-existing-data. `isPending` and `isFetching` answer different questions. Keep the server's authorization independent of the browser key.

## Failure fixture

Two optimistic edits overlap and the first failure restores a snapshot that deletes the second successful edit.

**Expected:** Use a demonstrated serialization or operation-aware rollback strategy, preserve the later edit, and invalidate only related query families.

This recipe is synthetic. A consuming project must bind real versions, components, tools and authority before applying it.
