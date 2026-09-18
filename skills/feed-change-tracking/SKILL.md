---
name: feed-change-tracking
description: "Compare feed snapshots by stable item identity and content while distinguishing updates, window expiry, pagination, and malformed or incomplete captures."
metadata:
  version: "0.1.0"
---
# Feed Change Tracking

Original project-agnostic procedure. Agent-host effectiveness is experimental.

## When to use

Compare feed snapshots by stable item identity and content while distinguishing updates, window expiry, pagination, and malformed or incomplete captures.

## When not to use

Do not impose this workflow on unrelated edits. This package does not authorize credential access, installation, paid services, external publication, or bulk collection. Resolve the current task and private execution policy first.

## Inputs

Read the requested outcome, exact source or query scope, authorized account/operation, installed tools, time/data budget, approved output destination, and required evidence. Actual project paths, credentials, and policy bindings belong in the private adapter.

## Procedure

### 1. Define the observed window

Select the exact RSS 2, Atom, or JSON Feed URL and authorized polling policy. State whether the output is a current window or a complete archive. Do not claim monitoring has been scheduled just because a parser or diff was run once.

### 2. Capture and parse deliberately

Use Sourcekit read with `--format feed --allow-host <host>`, or parse a local capture with its source URL. XML document types/entities and malformed inputs are rejected. The parser uses stable item IDs, bounded size and item count, handles relative references, and never downloads enclosures or follows next pages.

### 3. Compare stable observations

Compare two successful packets with `node tools/sourcekit.mjs diff before.json after.json`. Verify feed identity and recorded content/item hashes. Classify added, changed, unchanged, and absentFromWindow; do not label absence deleted. On truncated captures, retain incomplete comparison state instead of erasing older known entries.

### 4. Keep polling semantics separate

A service wrapper owns schedule, rate limits, conditional requests, response validators, durable checkpoints, and notification delivery. Sourcekit does not implement those services. If a server returns not-modified, pair it with the verified prior representation rather than interpreting it as an empty feed. A transport failure must preserve the last good checkpoint.

### 5. Deliver bounded changes

Send only relevant, deduplicated differences with canonical links and observation time. Feed descriptions may be excerpts and item dates are publisher claims. State missing detail and obtain the source separately when needed. Review retention and destination policy before copying complete content into other systems.

## Output

A validated current feed packet plus stable-ID changes, explicit comparison completeness, preserved prior checkpoint, and delivery decisions. Keep successful, partial, blocked, and not-run observations distinct.

## Failure handling

The feed contains duplicate IDs with conflicting content. Reject the ambiguous snapshot and retain the last accepted one rather than choosing whichever item appeared last. Preserve existing work and the last good checkpoint. Do not invent missing access or silently broaden permission to complete the task.

## Example

A release-feed item keeps its ID but corrects its title. Report a changed item; an older item leaving the feed window is not a deleted release. This is a synthetic scenario, not a completed agent-host evaluation.

## Companion and evaluation

Use the full toolkit checkout. [Sourcekit commands](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SOURCEKIT.md) document the actual implemented boundary. The companion is a bounded reader/parser and routing adviser, not a universal authenticated connector. `references/scenarios.json` contains not-run evaluation inputs.

## Technical references

- [Atom format](https://www.rfc-editor.org/rfc/rfc4287.html)
- [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/)
- [RSS 2 specification](https://www.rssboard.org/rss-specification)
