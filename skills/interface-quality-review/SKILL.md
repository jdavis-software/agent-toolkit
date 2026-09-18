---
name: interface-quality-review
description: Review a rendered web interaction for usability, responsive layout, keyboard behavior, state handling, and implementation defects, producing reproducible findings rather than a generic design checklist.
---
# Interface Quality Review

Original AI-assisted instructions for Jordan's collection. Companion helpers have automated fixture tests; agent-host effectiveness remains experimental.

## When to use
Use when a rendered interface or UI change is ready for a specific journey review. Start from the existing design, required behavior, actual URL, and available browser—not a generic design checklist.

## When not to use
Do not redesign by default, label preferences defects, infer interactive behavior from screenshots, or claim accessibility certification. A Chromium mobile viewport is not Safari or a physical-device test.

## Procedure
### Define a short acceptance journey
Record entry state, actions, expected result, route, and relevant application revision. Confirm the actual page identity, meaningful content, loaded assets, and console condition. A framework error overlay is not a valid UI under review.

### Exercise failures as well as success
Perform the primary path and a relevant recovery path: empty search and reset, invalid submission and correction, interrupted load and retry, or a comparable state. Verify the actual rendered result after every significant action. Check whether user input, selection, and focus remain sensible. Avoid real publication, purchase, messaging, and deletion during testing unless that specific test is authorized.

### Inspect the views that matter
Use desktop and a narrow viewport. Inspect the first screen and downstream content for overlap, clipped copy, content-driven shifts, obscured controls, and overflow. Include long or missing text when relevant. Navigate the same journey by keyboard, including focus after closing dialogs or resetting results. Use tools for numeric contrast claims.

### Close findings with comparable evidence
For each defect, record its task impact, exact reproduction, expected and actual state, and screenshot or DOM/trace evidence. Prioritize blocked user actions over cosmetic differences. When editing is authorized, make the smallest fix and repeat the same journey at the same viewport. Compare screenshots as well as state assertions.

### Keep the review structurally honest

```bash
node tools/skillcheck.mjs report interface examples/skillcheck/interface.json
```

The report requires primary interaction, keyboard, layout, and console entries—even when not tested. A complete passing review cannot contain untested or failed checks. Observed results require evidence references. The helper does not operate a browser, read a screenshot, or authenticate those references; the reviewer must do that work. Use the available browser integration or the consuming repository's existing Playwright suite.

## Output
Return the scoped journey and exact environment, checks and observations, reproduced findings, corrections, evidence locations, and untested conditions. Use partial when a required observation is absent. A full passing result applies only to the declared journey and environment.

## Failure handling
When browser access is unavailable, deliver a static review and leave interactions untested. Missing design references prevent fidelity claims, not useful bug findings. Missing backend credentials remain an environment limitation; do not invent successful transactions. Redact private content before sharing screenshots.

## Example
Search/reset works with a mouse, but keyboard focus becomes hidden under a fixed header. A screenshot of the default page cannot close this finding. Record the keyboard path, capture the focused state, make a scoped correction, and repeat the path. The report checker rejects marking the review complete while its keyboard row remains not-tested.

## Companion tools

[Runnable helpers and input formats](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SKILL_TOOLS.md) · [Evaluation method and limitations](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/EVALUATION.md). Commands above run from a full toolkit checkout; they are not standalone host-installation instructions.
