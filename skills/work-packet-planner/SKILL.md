---
name: work-packet-planner
description: Turn an engineering request into a bounded work packet with owned paths, dependencies, acceptance criteria, verification commands, and a handoff contract. Use before delegating non-trivial repository work.
---
# Work Packet Planner

New experimental starter instructions. Host behavior has not yet been evaluated.

## When to use
Use before a change spans multiple files, crosses a contract boundary, or will be delegated to another agent. The output is a plan, not permission to start implementation.

## When not to use
Do not expand a trivial, clearly specified edit into a project. Do not override the repository's own instructions or change accepted contracts to make a task easier.

## Procedure
1. Read the request, repository instructions, and relevant source. Identify the accepted base revision. Record missing access instead of inventing context.
2. State one observable outcome. Separate required behavior from suggested implementation details.
3. Define owned paths and explicit exclusions. Treat lockfiles, schemas, shared configuration, and generated outputs as separately owned unless the task says otherwise.
4. Identify upstream dependencies, shared files, migration requirements, and integration order. Overlapping ownership is a coordination issue, not a reason to race.
5. Find actual project-owned checks in manifests and documentation. Do not invent commands or assume a framework. Map each acceptance criterion to evidence.
6. Estimate the smallest useful work packet. Split independently verifiable work only when its inputs are stable; expose unresolved decisions as blockers.
7. Return the packet and wait for implementation authorization where required by the host or request.

## Output
Return these fields: task ID, goal, accepted base, inputs, owned paths, excluded paths, dependencies, acceptance criteria, planned checks, risks, unresolved decisions, and required handoff. Use `unknown` for an unverified revision. A planned check is not a passed check.

## Failure handling
When source access is missing, mark the plan provisional. When requirements conflict, identify the exact conflict and request a decision. Never silently broaden scope or claim that a task can run independently when it changes shared contracts.

## Example
Synthetic task: make catalog search match category names as well as titles.

```text
goal: Searching "verification" finds matching category entries.
owned paths: src/scripts/catalog.ts, tests/site.spec.ts
excluded paths: catalog/entries.json, skills/**, package.json
accepted base: unknown until git rev-parse HEAD is read
acceptance: query matches title, description, or category; clear restores all
planned checks: pnpm test:site (inspect package.json first)
handoff: commit, changed paths, commands/results, remaining limitations
```

The example is a proposed packet, not a recorded run. Confirm ownership before editing shared tests.
