---
name: media-transform-verification
description: "Qualify a bounded media transformation using input identity, installed capabilities, independent output properties and decode evidence without treating process exit as delivery acceptance."
metadata:
  version: "0.1.0"
---
# Media Transform Verification

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Qualify a bounded media transformation using input identity, installed capabilities, independent output properties and decode evidence without treating process exit as delivery acceptance.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Freeze the delivery contract

Record owned input identities and approved output location, container, dimensions, orientation, frame rate, duration, audio and caption requirements. Specify tolerances and aspect-ratio policy. Distinguish audible content from merely having an audio stream; specify a separate listening/perceptual check where required.

### 2. Qualify tools and plan effects

Inspect the actual FFmpeg/ffprobe installation and required demuxers, codecs and filters. Use explicit argument arrays and a bounded operation mapping, not arbitrary shell strings. Preserve inputs and reject unexpected overwrite, network protocols or unauthorized paths. An MCP discovery subset is not an invocation allowlist.

### 3. Transform only authorized inputs

Use an owned output, time/resource budget and an agreed transformation plan. Record command/tool identity, exit status, input/output digests and meaningful diagnostics. Handle variable frame rate, rotation, sample aspect ratio, color and subtitle differences explicitly rather than assuming metadata labels are interchangeable.

### 4. Probe and decode the result

Read output metadata with ffprobe and compare it against an independent contract. For the bounded supported path, decode the selected video/audio streams to a null sink with a deadline. Verify source preservation. Require separate visual, listening and caption-sync checks rather than claiming metadata proves them.

### 5. Report failures without hiding artifacts

A command can exit zero and still produce the wrong deliverable. Preserve rejected outputs and diagnostics in the approved location. The companion accepts short trusted local MP4/MOV/MKV/WebM inputs, checks dimensions/duration/frame rate/audio and decoding, and writes no media. Unsupported or missing capabilities remain not qualified.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

A two-second export is expected with audio, but an encoder returns a silent video-only container. Successful encoding is insufficient: reject the missing audio stream and preserve the input.

## Example

The synthetic media smoke test generates two short local fixtures, accepts the matching one, rejects wrong duration and missing audio, and compares input hashes before and after checks. It is not a FAL generation or paid provider test.

## Companion and evaluation

The original Publicationcheck helper provides the `media` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [ffprobe](https://ffmpeg.org/ffprobe.html)
- [FFmpeg protocols](https://ffmpeg.org/ffmpeg-protocols.html)
