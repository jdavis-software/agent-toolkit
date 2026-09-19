---
name: tanstack-query-engineering
description: "Implement React Query data access with complete query identities, explicit freshness, cancellation, mutation reconciliation and isolated server-rendering caches."
metadata:
  version: "0.1.0"
---
# TanStack Query Engineering

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Implement React Query data access with complete query identities, explicit freshness, cancellation, mutation reconciliation and isolated server-rendering caches. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Define identities and defaults

Inventory the installed TanStack Query version and existing QueryClient ownership. Put every response-defining variable, including workspace, filters and pagination, in a stable serializable key. Freshness (staleTime), retention (gcTime) and persistence are different policies; do not confuse them.

### 2. Make the query function a real boundary

Check HTTP failures and validate unknown payloads before caching. Consume the supplied AbortSignal for supported fetches. Use enabled/dependent queries only for true dependencies; start independent work together. Configure retries by failure class and do not retry writes merely because reads retry.

### 3. Reconcile mutations without clobbering newer work

Choose pessimistic confirmation or an explicit optimistic protocol. Before a snapshot-based optimistic write, cancel conflicting reads, capture the affected key, and restore only the owned update on failure. Serialize conflicting mutations or use operation/version-aware rollback; one old snapshot must not erase another successful mutation.

### 4. Cover lists, pages and server rendering

Invalidate the narrow related key families after accepted writes; handle detail/list consistency and pagination movement. Decide whether placeholder data may show a prior page; never carry data across an identity boundary accidentally. Create server QueryClients per request and dehydrate only intended public/client data. Qualify hydration and stale times for the actual framework.

### 5. Test real cache behavior

Use a fresh client per test, deliberate retry settings and independently controlled request completion. Check scoped invalidation, late responses, cancellation, refetch errors with stale data, failed mutation rollback and overlapping writes. Reset private caches at the accepted account transition.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

Two optimistic edits overlap and the first failure restores a snapshot that deletes the second successful edit. Use a demonstrated serialization or operation-aware rollback strategy, preserve the later edit, and invalidate only related query families. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: Two optimistic edits overlap and the first failure restores a snapshot that deletes the second successful edit.

Expected behavior: Use a demonstrated serialization or operation-aware rollback strategy, preserve the later edit, and invalidate only related query families.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/tanstack-query-engineering/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
- [SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
