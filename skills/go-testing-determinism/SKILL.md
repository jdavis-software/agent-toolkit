---
name: go-testing-determinism
description: "Design Go tests with independent assertions, controlled in-process timing, bounded fuzz/race checks, and isolated real dependencies for persistence and network semantics."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Go Deterministic Testing

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Design Go tests with independent assertions, controlled in-process timing, bounded fuzz/race checks, and isolated real dependencies for persistence and network semantics. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Derive expected behavior from accepted requirements. Use meaningful input partitions and check both results and prohibited state changes. Give fixtures isolated state and explicit cleanup ownership.

### 2. Choose the supported contract

Qualify testing/synctest or another supported timing strategy against the pinned Go version. Its fake clock and bubble do not simulate real database or network operations. Prefer event coordination to arbitrary sleeps and bound real external waits.

### 3. Implement or qualify the path

Prove regression detection against a known defective fixture when practical. A compiler error or missing service is not the intended assertion failure. Keep any deliberate mutation small, controlled, and confined to disposable work.

### 4. Exercise failure and integration seams

Separate unit, race-detector, bounded fuzzing, and integration scopes. Preserve meaningful fuzz failures. Do not mock the exact transaction or serialization boundary whose correctness the test is supposed to establish.

### 5. Verify and hand back evidence

Record cache reuse and attempts. Use go test -count=1 when a trial requires fresh execution, not as a universal cache disable. Repeat timing-sensitive cases and report failures instead of rerunning until one pass appears.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

The test depends on a real PostgreSQL response: do not claim fake-clock unit coverage proves its integration behavior. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Check a lease immediately before, at, and after expiry using the specified inclusivity rule; a separate real database test verifies rejected renewal leaves stored state unchanged. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Go synctest](https://pkg.go.dev/testing/synctest)
- [Go testing](https://pkg.go.dev/testing)
- [Go fuzzing](https://go.dev/doc/security/fuzz/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
