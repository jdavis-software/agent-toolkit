---
name: evidence-first-debugging
description: Investigate a reproducible software failure by separating observations from explanations, testing competing hypotheses, and verifying a minimal repair against the original failure.
---
# Evidence First Debugging

A debugging procedure for Jordan's Agent Toolkit Collection. Written for this collection with AI assistance; experimental until evaluated in an identified agent host.

## When to use

Use when a concrete behavior differs from its contract: a failing test, an incorrect response, a rendering defect, or a reproducible environment mismatch. Start with the observed failure, not a favored explanation.

## When not to use

Do not use for speculative cleanup, a new feature without a defined outcome, or a security incident requiring the organization's incident process. Investigation does not authorize production access, dependency upgrades, destructive cleanup, or unrelated fixes.

## Procedure

### Establish the observation

Read repository instructions and inspect the current changes before running commands. Record the relevant revision, input, environment, expected result, and observed result. Redact secrets and personal data from evidence. Choose a bounded reproduction in a disposable or explicitly authorized environment.

Attempt the original reproduction without changing the implementation. Record the command, result, and evidence location. A failure to install a dependency is a blocked reproduction, not confirmation of the reported application bug. For intermittent failures, preserve attempt counts and conditions rather than rerunning until a convenient result appears.

### Compare explanations

Write at most three plausible explanations. For each, specify what observation would distinguish it from the others and what result would contradict it. Prefer a small experiment over a large rewrite. Inspect the narrowest relevant data or execution boundary; expand only when evidence points outward.

Change one meaningful variable per experiment. Keep temporary instrumentation separate from the proposed repair. Do not clear shared caches, reset databases, or alter another worktree merely to make the symptom disappear. Use isolated state when state itself is under investigation.

### Repair the demonstrated cause

Once evidence supports a cause, describe the violated invariant and the smallest proposed correction. Add a regression case when practical. Establish that the case detects the original defect before accepting a passing result after the fix; explain when that comparison cannot be run.

Make the bounded repair, rerun the original reproduction, and run the relevant project checks. Check neighboring behavior that the same correction could affect. A passing new test does not replace the original reproduction. Remove temporary instrumentation unless retaining it is part of the approved change.

### Close with a falsifiable account

Tie findings to the final diff and revision. Separate a confirmed cause, a plausible explanation, and an unresolved symptom. State which checks ran and which remain blocked. Do not upgrade an uncertain diagnosis to certainty because implementation work has finished.

## Output

Return a debugging record containing:

- Failure contract: input, expected result, observed result, revision, and environment.
- Experiments: hypothesis, discriminating observation, actual result, and evidence location.
- Repair: supported cause, owned paths changed, and regression coverage.
- Verification: original reproduction after the repair, focused checks, and remaining uncertainty.

Use status `confirmed`, `partially-supported`, or `unresolved` for the diagnosis. A blocked check retains its own blocked status.

## Failure handling

If reproduction fails, request the smallest missing input or capture a bounded diagnostic plan. If requirements conflict, identify the conflict before patching. If an experiment requires unapproved access, stop at that boundary. After repeated inconclusive experiments, summarize what has been ruled out rather than accumulating unrelated changes.

## Example

Synthetic scenario: a result list shows the wrong item after two overlapping searches. Input A starts first; input B starts second. B finishes first, then A finishes and replaces B's displayed results.

One hypothesis is that obsolete responses are still accepted. A discriminating test controls completion order while keeping the query inputs unchanged. The required outcome is that the result associated with the current query remains displayed. A repair must pass both normal and reversed completion order, plus error and cancellation behavior defined by the application. This is a proposed experiment, not a record of an executed test.

Evaluation scenarios are in `references/scenarios.md`.
