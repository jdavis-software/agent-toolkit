---
name: evidence-first-debugging
description: Investigate a reproducible software failure by separating observations from explanations, testing competing hypotheses, and verifying a minimal repair against the original failure.
---
# Evidence First Debugging

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use for an observable failure: an incorrect response, broken interaction, failed assertion, or environment mismatch. The goal is the smallest supported repair with evidence that the original failure is gone.

## When not to use
Do not turn a feature request into a debugging exercise or expand a local bug into an architecture rewrite. Incident response, production access, and destructive experiments require their own authorization.

## Procedure
### Preserve the failure contract
Capture input, expected behavior, actual failure signature, revision, and relevant environment. Run the original reproduction before touching implementation. Distinguish the target assertion failing from installation, import, or service-availability failures. Use the receipt runner for executable checks and preserve the failing result.

### Spend experiments on uncertainty
Write one to three plausible causes and a falsifying observation for each. Select the cheapest experiment that distinguishes them. Keep a bounded experiment budget; after an inconclusive budget, report the remaining uncertainty rather than retrying identical actions. Parallelize independent read-only investigations, not overlapping repairs.

For asynchronous defects, control completion order explicitly instead of adding arbitrary sleeps. For state defects, use an isolated fixture instead of clearing shared caches. Change one meaningful variable per probe. Separate observation, interpretation, and proposed change.

### Repair and replay
Make the smallest correction supported by the observations. Add an assertion that rejects the original behavior; prove that failure is about the target defect, not broken setup. Run the same reproduction after the repair, then neighboring behaviors that share the changed boundary. Keep generated instrumentation separate from the final change.

### Validate the record, then inspect its evidence
For multi-step investigations, use a structured debugging record:

```bash
node tools/skillcheck.mjs report debug examples/skillcheck/debug.json
node examples/skillcheck/defect-demo.mjs
```

The example record is unresolved. The checker rejects a fixed conclusion without a failed original reproduction, a supporting experiment, the same check passing afterward, and regression evidence. It checks record consistency, not whether referenced artifacts are authentic. Open the actual receipts or traces before accepting the diagnosis.

## Output
Return the failure contract, tested explanations and falsifiers, observed experiments, supported cause or unresolved alternatives, repair, before/after evidence, and next action. Use unresolved, supported, or fixed precisely. A speculative explanation is not promoted because code was changed.

## Failure handling
A blocked reproduction remains blocked. When the environment is the problem, describe the environmental finding separately from application correctness. Preserve unrelated work. Do not delete a valid test, relax its requirement, or broadly reset state to manufacture success.

## Example
Two searches complete out of order; the older response replaces the latest results. The included original defect demo controls both completion orders and cancellation with no timers. It demonstrates a request-generation check on small synthetic functions. Its results are reproducible fixture evidence—not a production fix or an agent-performance benchmark.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
