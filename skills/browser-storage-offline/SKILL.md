---
name: browser-storage-offline
description: "Persist frontend state only under explicit privacy, schema, quota and reconciliation policies; distinguish local durability from synchronized server acceptance."
metadata:
  version: "0.1.0"
---
# Browser Storage and Offline State

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Persist frontend state only under explicit privacy, schema, quota and reconciliation policies; distinguish local durability from synchronized server acceptance. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Classify the stored information

Specify owner identity, sensitivity, lifetime, deletion and cross-tab needs. Use local/session storage only for small suitable values, IndexedDB for structured asynchronous storage where warranted, and the server for authoritative shared records. Do not store credentials or private drafts by default.

### 2. Design schemas and upgrades

Version stored shapes and validate them on read. For IndexedDB, define upgrade transactions, blocked-version behavior and connection cleanup. Include the identity in namespaces and make logout/account changes clear appropriate private state.

### 3. Expect failure and eviction

Handle unavailable storage, corrupt records, quota failures and eviction. Fall back without losing in-memory work where possible. Do not make a successful local write mean backup, indefinite persistence or server synchronization.

### 4. Make offline effects explicit

A queued write needs stable operation identity, accepted retry/idempotency rules and a conflict policy. Surface pending versus settled status. A service worker response cache and TanStack Query cache are different systems; assign freshness and invalidation to each.

### 5. Exercise recovery

Test old schema migration, multiple tabs, blocked upgrades, identity changes, storage denial and reconnect with duplicate delivery. Use synthetic private values. Verify no protected data survives a cleanup boundary it should not cross.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

Two accounts use the same persistent query cache and a new account briefly sees the previous account’s drafts after reload. Scope and validate storage by trusted identity, clear the accepted private state at transition, and test reload and cross-tab behavior. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: Two accounts use the same persistent query cache and a new account briefly sees the previous account’s drafts after reload.

Expected behavior: Scope and validate storage by trusted identity, clear the accepted private state at transition, and test reload and cross-tab behavior.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/browser-storage-offline/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Storage limits](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
