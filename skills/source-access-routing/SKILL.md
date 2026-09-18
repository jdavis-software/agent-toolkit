---
name: source-access-routing
description: "Select a source-specific read, search, feed, or transcript path without confusing URL recognition, configured tools, and actual authorized access."
metadata:
  version: "0.1.0"
---
# Source Access Routing

Original project-agnostic procedure. Agent-host effectiveness is experimental.

## When to use

Select a source-specific read, search, feed, or transcript path without confusing URL recognition, configured tools, and actual authorized access.

## When not to use

Do not impose this workflow on unrelated edits. This package does not authorize credential access, installation, paid services, external publication, or bulk collection. Resolve the current task and private execution policy first.

## Inputs

Read the requested outcome, exact source or query scope, authorized account/operation, installed tools, time/data budget, approved output destination, and required evidence. Actual project paths, credentials, and policy bindings belong in the private adapter.

## Procedure

### 1. Define the operation

Resolve the specific URL or bounded research question and identify whether the user needs a page, search results, feed items, repository artifacts, or time-aligned speech. A video description is not a transcript; a search snippet is not the source document. Start with tools already connected to the environment rather than installing an alternate stack.

### 2. Route on parsed identity

Use `node tools/sourcekit.mjs route <public-https-url> --intent read` for an offline routing suggestion. Match parsed hostnames, not substrings such as a trusted name inside another host or query. Sourcekit recognizes platform families but does not implement authenticated access to them. Require an explicit feed intent instead of treating every path containing feed as a syndication document.

### 3. Qualify the actual path

Separate command presence, executable health, server connection, authenticated identity, operation support, and current source access. Reuse an authorized GitHub connector for repositories and a verified caption-capable adapter for videos. Record the chosen backend/version, operation, observed result and expiration in private execution context; a category badge or route suggestion is not this evidence.

### 4. Keep fallback within the accepted boundary

A fallback may change where data goes, which account is used, what is billed, or what content is returned. Do not automatically forward private URLs to a third-party reader, switch to paid transcription, widen scopes, import browser cookies, or evade access challenges. Report missing access and request the smallest required authorization. Use direct public reads only with explicitly approved hosts.

### 5. Return an honest handoff

Give the selected path, unsupported capabilities, needed identity and data-handling approval, expected representation and validation, and the stop/recovery conditions. Carry canonical source references into the result. No eligible backend means blocked, not permission to use a less controlled one.

## Output

A routing record distinguishing requested operation, source identity, selected path, observed capabilities, authorization, missing evidence, and accepted fallback conditions. Keep successful, partial, blocked, and not-run observations distinct.

## Failure handling

A YouTube-looking host is actually youtube.com.evil.example. Treat it as an unrelated public website, not a trusted video adapter input. Preserve existing work and the last good checkpoint. Do not invent missing access or silently broaden permission to complete the task.

## Example

A user asks what a public video says. The selected adapter must provide captions and language metadata; returning the title and description does not complete the task. This is a synthetic scenario, not a completed agent-host evaluation.

## Companion and evaluation

Use the full toolkit checkout. [Sourcekit commands](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SOURCEKIT.md) document the actual implemented boundary. The companion is a bounded reader/parser and routing adviser, not a universal authenticated connector. `references/scenarios.json` contains not-run evaluation inputs.

## Technical references

- [URL standard](https://url.spec.whatwg.org/)
- [MCP tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
