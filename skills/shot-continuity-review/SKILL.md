---
name: shot-continuity-review
description: "Review actual adjacent shots for visual, identity, product, caption and audio continuity while separating machine checks from subjective acceptance."
metadata:
  version: "0.1.0"
---
# Shot Continuity Review

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Review actual adjacent shots for visual, identity, product, caption and audio continuity while separating machine checks from subjective acceptance.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Define continuity that matters

Read the approved character/product references, sequence intention, shot list and delivery variants. Identify intentional discontinuities and continuity-critical properties such as outfit, product label, orientation, action direction and caption placement. An imaginative transition may be intended; do not label every change a defect.

### 2. Inspect actual boundaries

Use the current rendered candidate, not only source thumbnails. Inspect frames immediately before and after cuts and play enough surrounding footage to assess movement and sound. Record media hash, timestamp/frame, viewport or crop and whether audio was available. A contact sheet is supplementary evidence, not proof of smooth motion.

### 3. Separate categories of findings

Report identity/appearance mismatch, action discontinuity, factual product mismatch, unreadable overlay, timing drift and audio discontinuity separately. Describe visible properties without claiming to identify real people or infer consent. Keep subjective taste notes distinct from violations of an agreed requirement.

### 4. Repair only affected production stages

Link each finding to the affected clip and its source dependencies. A wrong product label can require asset regeneration; a caption overlap can require layout changes only. Recheck downstream duration and synchronization after replacing a clip. Preserve earlier candidates so a repair can be compared instead of rewriting its evidence.

### 5. Make acceptance traceable

Return findings with severity, evidence location, affected requirement and pass/fail/not-inspected status. Review portrait and landscape crops separately when required. Mechanical media checks and model similarity scores do not replace a human or authorized reviewer for identity-sensitive, nuanced or subjective approvals.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

The report has only a transcript and cannot view the render. Mark visual continuity uninspected; do not turn a structurally valid shot list into a visual pass. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

A synthetic two-card sequence changes the same product's declared capacity from 20 units to 200. The reviewer points to the exact cut and approved claim, labels it a factual continuity defect, and asks for the second card to be repaired rather than rating the animation aesthetically. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [FFprobe frame inspection](https://ffmpeg.org/ffprobe.html)
- [Accessible media](https://www.w3.org/WAI/media/av/)
