---
name: media-timeline-assembly
description: "Assemble approved media into an explicit frame timeline and renderer handoff, validating asset identities and invalidating dependent timing after source revisions."
metadata:
  version: "0.1.0"
---
# Media Timeline Assembly

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Assemble approved media into an explicit frame timeline and renderer handoff, validating asset identities and invalidating dependent timing after source revisions.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Freeze the delivery contract

Read the accepted storyboard, output dimensions, frame rate, duration, sound/caption requirements and current asset manifest. Choose an installed, approved compositor separately from the asset-generation provider. Record unavailable capabilities rather than quietly replacing moving footage with a still image or swapping paid providers.

### 2. Normalize time deliberately

Use one declared output timebase and half-open frame intervals. Record source trims and rate conversion decisions. Audio sample positions and variable-frame-rate footage need a qualified mapping; rounded seconds are not universally frame-accurate. The included timeline checker supports normalized constant-rate cuts, not arbitrary speed ramps or overlapping dissolves.

### 3. Assemble tracks with stable identities

Give assets and clips stable IDs, source hashes, source ranges, timeline ranges and track roles. Keep the primary visual sequence, sound and overlays distinguishable. Check missing references, positive duration, complete primary coverage and source bounds. Reusing an asset is allowed; silently aliasing two different files to one asset ID is not.

### 4. Bind the handoff to current dependencies

Hash the actual selected asset bytes plus the approved narration, caption and storyboard dependencies. Recheck after changes. A narration revision invalidates dependent timing even when the clip filenames did not change. Preserve a previous accepted render and make a new candidate rather than overwriting it while composing.

### 5. Render through a separately qualified path

Run the selected compositor only within its approved process, filesystem, network and budget boundaries. Validate the exported media with Media Transform Verification and inspect cut boundaries with Shot Continuity Review. A passing timeline manifest proves neither that the assets decode nor that the final composition looks good.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

The storyboard specifies 30 fps but a clip carries unconverted 24-fps frame positions. Reject the ambiguous time mapping; do not stretch the file silently to make the numbers fit. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

Two synthetic SVG cards form a 60-frame, 30-fps cut timeline. The checker confirms complete coverage and byte identities. Editing the linked narration file invalidates the handoff without rendering or contacting a model provider. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [FFmpeg filters and timebases](https://ffmpeg.org/ffmpeg-filters.html)
- [Media accessibility](https://www.w3.org/WAI/media/av/)
