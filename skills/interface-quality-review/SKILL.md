---
name: interface-quality-review
description: Review a rendered web interaction for usability, responsive layout, keyboard behavior, state handling, and implementation defects, producing reproducible findings rather than a generic design checklist.
---
# Interface Quality Review

A browser-review procedure for Jordan's Agent Toolkit Collection. Written for this collection with AI assistance; experimental until evaluated in an identified agent host.

## When to use

Use when a web interface or UI change is ready to inspect in a browser. Begin with a concrete user journey, target URL, relevant requirements, and available browser tooling. Apply it to the existing framework and visual system rather than redesigning by default.

## When not to use

Do not treat this as a new visual design brief, a security assessment, a legal accessibility certification, or evidence of support for browsers and devices that were not tested. A screenshot-only review cannot establish that controls work.

## Procedure

### Select the journey and evidence

Describe the path under review: entry state, user action, and intended result. Confirm the requested page actually loaded and record browser, viewport, zoom, relevant data state, and application revision when available. Inspect console errors and failed resources. Do not proceed as though an error page were the application.

Use a provided design reference when there is one. Otherwise judge against the task requirements and the application's existing visual system. Do not invent a reference or use personal styling preferences as defects.

### Exercise meaningful states

Perform the primary interaction and observe a real state change. Check relevant loading, success, empty, invalid, and failure states. Distinguish an unavailable backend from a broken frontend. Review whether controls expose feedback, retain necessary input, and support an appropriate recovery path.

Do not send real messages, purchase items, delete data, or publish content merely to test a control. Use fixtures, a non-destructive path, or an explicitly approved test environment for external effects.

### Inspect layout and keyboard use

Inspect a desktop and a narrow viewport, including the first screen and downstream content. Look for clipped headings, unreadable labels, content overlap, unexpected horizontal scrolling, obscured controls, and layout changes as data arrives. Test long text and empty data when they belong to the interface.

Navigate the journey with a keyboard. Check that interactive elements can be reached and operated, focus remains visible, and opening or closing a dialog leaves focus in a sensible place. Inspect labels and rendered semantics. Use measurements or appropriate tools for claims about contrast; do not infer a numeric ratio by eye.

### Separate defects from preferences

For each finding, record the user impact, reproduction steps, expected versus actual result, and screenshot or DOM evidence. Categorize it as blocked task, degraded task, or polish. Identify the likely source file when inspected; otherwise leave ownership unconfirmed. Prioritize a broken primary action above cosmetic consistency.

### Verify bounded corrections

When editing is authorized, make the smallest correction consistent with the existing design. Re-run the same journey and capture the same viewport/state to compare. Inspect the resulting screenshot as well as the DOM. Passing compilation does not close a visual or interaction finding.

## Output

Return a review containing the tested journey and environment, reproducible findings, changes made, before/after evidence locations, and remaining untested conditions. List each observation as `observed`, `not-reproduced`, or `not-tested`; do not infer a pass from missing evidence.

Conclude with a scoped result such as: the specified search/reset journey passed in the recorded Chromium viewports. Do not turn that into a claim that the entire interface is accessible or works on all devices.

## Failure handling

If a browser is unavailable, report a static-code or screenshot review and keep interactive checks untested. If a reference is missing, do not claim pixel fidelity. If content is private, redact the evidence before sharing it. If a defect cannot be reproduced, preserve the reported conditions and identify the next observation needed.

## Example

Synthetic scenario: a catalog filter shows an empty state correctly with a mouse, but keyboard focus is hidden under a fixed header after selecting Reset. Reproduce the keyboard path at the recorded viewport, capture the obscured focus target, and compare after a focused correction. Mouse behavior alone does not close the keyboard finding.

Evaluation scenarios are in `references/scenarios.md`.
