---
name: time-windowed-research
description: "Investigate developments in an explicit time window using dated source captures, event-level deduplication, independent evidence and visible coverage gaps."
metadata:
  version: "0.1.0"
---
# Time-windowed Research

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Investigate developments in an explicit time window using dated source captures, event-level deduplication, independent evidence and visible coverage gaps.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Freeze the question and clock

Define the decision, exact interval, timezone and as-of time. Use start-inclusive/end-exclusive boundaries. Distinguish event date, publication date, update date and observation time. A thirty-day lookback and a calendar month are not interchangeable. Resolve actual approved source access and a query/time budget before searching.

### 2. Retrieve and preserve source context

Search approved primary sources and relevant independent discussion. Capture a bounded excerpt and its context, URL/revision and actual observation time. Reuse Sourcekit for supported pages; account-bound sources use approved connectors. Record blocked or not-run sources rather than interpreting unavailable sources as empty.

### 3. Identify underlying developments

Group syndicated articles, reposts and shared vendor data under one underlying event identity. Explain the grouping decision. Preserve conflicting dates rather than choosing whichever puts the event in the requested window. An uncertain event date stays uncertain; a new publication is not automatically a new event.

### 4. Assess what the evidence actually supports

Link each claim to the smallest inspected passage and label supported, contradicted or unresolved. A source response, DOI, matching quote or high engagement count cannot establish truth alone. Separate independently collected evidence from multiple copies of the same source; popularity measures attention, not consensus.

### 5. Stop and report for the decision

Stop when decisive questions are adequately supported or the agreed budget is exhausted. Return in-window developments, relevant older context, contradictions and gaps separately. The companion checks dates, supplied grouping and exact excerpts in hashed captures; it does not search, authenticate dates or judge meaning. Preserve limitations during editorial cleanup.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

An old announcement is republished yesterday and echoed by five outlets. Count one old underlying event, not five new discoveries. Missing event dates must not be silently replaced with publication dates.

## Example

Run the synthetic August fixture. It keeps a January event outside the interval and one August connector announcement inside. No search or real trend claim is involved.

## Companion and evaluation

The original Publicationcheck helper provides the `research` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [Provenance](https://www.w3.org/TR/prov-overview/)
- [Date/time format](https://www.rfc-editor.org/rfc/rfc3339)
