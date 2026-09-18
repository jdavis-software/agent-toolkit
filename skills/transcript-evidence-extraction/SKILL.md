---
name: transcript-evidence-extraction
description: "Turn authorized caption files into timestamped evidence with declared language/origin and clear separation between speech, descriptions, and visual content."
metadata:
  version: "0.1.0"
---
# Transcript Evidence Extraction

Original project-agnostic procedure. Agent-host effectiveness is experimental.

## When to use

Turn authorized caption files into timestamped evidence with declared language/origin and clear separation between speech, descriptions, and visual content.

## When not to use

Do not impose this workflow on unrelated edits. This package does not authorize credential access, installation, paid services, external publication, or bulk collection. Resolve the current task and private execution policy first.

## Inputs

Read the requested outcome, exact source or query scope, authorized account/operation, installed tools, time/data budget, approved output destination, and required evidence. Actual project paths, credentials, and policy bindings belong in the private adapter.

## Procedure

### 1. Acquire the correct source

Use the environment's authorized video/caption connector or a reviewed extraction tool. Record canonical video identity, language, caption type, capture time, and any transformations. A tool being installed does not prove captions exist or the source can be accessed. Sourcekit does not download videos or obtain authenticated subtitles.

### 2. Parse time-aligned text

Use `node tools/sourcekit.mjs parse captions.vtt --format transcript --source-url <video-url> --language en --origin automatic-captions`. Sourcekit handles a bounded WebVTT/SRT subset, retains milliseconds and overlaps, and rejects invalid durations or out-of-order cue starts. Origin is caller-declared, never independently inferred from a filename.

### 3. Ground claims in cue spans

Associate each summary claim with the relevant start/end interval and supporting words. Retain uncertainty from automatic recognition, speaker ambiguity, translation, missing segments, and domain terms. Do not invent a confident statement from the title, thumbnail, or surrounding comments.

### 4. Respect modality boundaries

Captions establish what was represented as speech, not everything displayed on screen. Visual claims need separate visual evidence. No captions is a distinct condition from denied access or tool failure. Sending audio to a transcription provider changes data exposure and potentially cost; obtain the appropriate approval before doing so.

### 5. Preserve an inspectable result

Store the bounded source packet, input hash, extracted cues, declared language/origin, and claim-to-time references. Do not publish complete copyrighted transcripts or private voice data merely because extraction was possible. Keep short necessary quotations and follow the task's retention policy.

## Output

A local or live-adapter caption provenance record, timestamped cue packet, and summary with traceable time ranges and modality limits. Keep successful, partial, blocked, and not-run observations distinct.

## Failure handling

A silent demonstration changes the UI without speech. The caption packet cannot establish the visual behavior; require separate viewing evidence. Preserve existing work and the last good checkpoint. Do not invent missing access or silently broaden permission to complete the task.

## Example

A tutorial says a feature is experimental at 02:10. The summary retains that qualifier and time reference rather than treating the feature as generally released. This is a synthetic scenario, not a completed agent-host evaluation.

## Companion and evaluation

Use the full toolkit checkout. [Sourcekit commands](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SOURCEKIT.md) document the actual implemented boundary. The companion is a bounded reader/parser and routing adviser, not a universal authenticated connector. `references/scenarios.json` contains not-run evaluation inputs.

## Technical references

- [WebVTT](https://www.w3.org/TR/webvtt1/)
- [yt-dlp upstream documentation](https://github.com/yt-dlp/yt-dlp)
