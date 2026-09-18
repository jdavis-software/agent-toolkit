---
name: work-packet-planner
description: Turn an engineering request into a bounded work packet with owned paths, dependencies, acceptance criteria, verification commands, and a handoff contract. Use before delegating non-trivial repository work.
---
# Work Packet Planner

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use for delegated work, parallel implementation, or a change with shared contracts. The purpose is to remove decisions that would otherwise stop an implementer—not to produce a large planning document.

## When not to use
For one obvious edit, state the outcome, owned file, and check in three lines. Do not force every task through JSON, a new branch, a committee, or this entire collection. Follow the consuming repository's actual instructions.

## Procedure
### Define what must change
Read the request, relevant source, and canonical repository instructions. Identify one observable outcome and the accepted baseline. Separate the behavior from one possible implementation. Mark missing decisions as blockers only when they change the result.

### Make work independently executable
For each task, identify exact owned files or directory prefixes. Give shared contracts, lockfiles, generated outputs, and shared tests one owner. Split only at stable interfaces. A task waiting for another task's contract must declare that dependency. Avoid assigning two agents the same file just because their intended line ranges differ.

Map every acceptance criterion to an actual project-owned check. A command array records an intended invocation; it is not proof the command exists or ran. Read the manifest before recording it. Use small verification targets where the project supports them.

### Check the coordination model
For machine-readable delegation, use the versioned packet format in the companion guide and run:

```bash
node tools/skillcheck.mjs plan examples/skillcheck/plan.json
```

Replace the example with the real packet. The helper rejects dependency cycles, missing references, unsafe path declarations, unmapped criteria, and unordered overlapping ownership. It computes dependency waves and propagates explicit blockers. It never launches agents or executes packet commands. Waves express dependency eligibility, not permission to start or a resource budget.

Literal scope semantics are deliberate: `src/search/` covers that directory; `src/search.ts` names one file. No globs, root wildcard, or line-range ownership. These checks are case-sensitive declarations, not a filesystem sandbox or symlink analysis.

## Output
For a small task, return the three-line plan. For delegation, return the packet, resolved baseline, checker result, and outstanding blockers. Include the smallest next action. Keep unresolved facts explicit; a structurally valid plan does not establish correct requirements or verified repository state.

## Failure handling
When ownership overlaps, consolidate the edit under one owner or declare a real dependency—do not suppress the check. When a dependency cycle appears, move the shared contract into an earlier task. Do not manufacture dependencies only to make a validator pass while still launching the tasks concurrently.

## Example
The example packet has independent search and filter tasks, followed by integration. It yields one parallel wave and one integration wave. Giving the filter task ownership of `src/search/` as well is rejected unless the workflow is genuinely serialized. This is a planning fixture, not a claim of a completed product build.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
