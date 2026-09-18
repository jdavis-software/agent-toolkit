---
name: behavior-test-design
description: Turn a feature or bug contract into focused tests with explicit input partitions, observable outcomes, boundary cases, and evidence that the tests detect the behavior they are meant to protect.
---
# Behavior Test Design

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use when implementing an observable behavior or when a reproduced defect escaped existing tests. The contract, not the current implementation, supplies expected results.

## When not to use
Do not chase a coverage percentage, switch the project's test framework, or demand exhaustive tests for a trivial edit. Do not delete useful implementation merely because it was written before a test. Add evidence around the actual task.

## Procedure
### Establish an independent expectation
Read requirements and neighboring conventions. Assign each required behavior an ID and an observable expected result. Identify unresolved assumptions before encoding them permanently. Select the smallest test boundary that still exercises the real interaction being protected; do not mock away that boundary.

### Build a small case matrix
Each case records the requirement IDs, initial state, action, assertion, source of the expected result, input partition, and prohibited side effects. Include meaningful ordinary, boundary, invalid, concurrency, cancellation, or authorization cases only where the feature requires them. Record excluded partitions with a reason rather than generating irrelevant cases.

### Demonstrate that the assertion can catch the bug
Run regression cases against the original behavior and the candidate fix. A missing dependency, syntax error, or empty test selection is not evidence of detecting the intended defect. Where practical, seed one controlled fault in a disposable copy and verify rejection. Never modify the user's current code just to run a mutation probe.

Preserve test isolation: control time, randomness, completion order, and fixtures. Check state changes as well as return values. Snapshot updates require inspection, not automatic approval. Avoid assertions that merely duplicate the implementation's calculation.

### Check the matrix and run the cases

```bash
node tools/skillcheck.mjs report test-design examples/skillcheck/test-design.json
node examples/skillcheck/defect-demo.mjs
```

The matrix checker catches missing requirement coverage, undeclared requirement IDs, missing oracles, and omitted side-effect fields. It does not execute tests or judge the semantics of their assertions. Use the project's runner through Affected Verification to collect execution receipts separately.

## Output
Return requirement-linked cases, chosen boundaries, real and simulated dependencies, expected-result sources, forbidden effects, actual execution outcomes, and excluded coverage. A complete matrix is design evidence; executed assertions are behavior evidence. Keep them distinct.

## Failure handling
Resolve ambiguous outcomes with the requirement owner, not by accepting whatever the current code does. Repair fixtures that pass without exercising the target. Preserve valid failing assertions. Record blocked and unrun checks instead of counting them as successes.

## Example
A lease is expired at `now >= expiresAt`. At time 100 with expiry 100, renewal must fail and leave persistent expiry unchanged. The included demo tests 99, 100, and 101, and shows that the exact-boundary case rejects a deliberately faulty `>` implementation. This is one controlled defect probe, not comprehensive mutation coverage.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
