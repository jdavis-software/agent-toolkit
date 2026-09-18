---
name: structured-web-extraction
description: "Extract records against an independent field contract, rejecting decoy matches, wrong cardinality, and unsupported adaptive recovery while preserving source evidence."
metadata:
  version: "0.1.0"
---
# Structured Web Extraction

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Repeated research needs named records and fields instead of an undifferentiated page summary. Use when layout changes, similar elements, or derived values make silent wrong matches plausible.

## When not to use

A single source quotation or ordinary document summary is enough. Do not install a scraping framework for every web read, invoke an LLM merely to locate stable fields, or enable stealth/network features for a local parser task.

## Inputs

Resolve the authorized goal, canonical source/policy baseline, actual tool versions, owned resources, required evidence and task limits from the consuming project. Keep private roots, credentials and concrete command bindings in its adapter.

## Procedure

### 1. Define meaning independently of selectors

Write the record identity, fields, units, currency/precision when relevant, expected cardinality, null/missing policy, and authoritative acceptance source. Separate standard values from promotions and estimates. CSS is a location mechanism, not the business specification. Do not derive expected answers solely from the extractor output.

### 2. Acquire and assess the appropriate representation

Use an approved native connector, static capture, or owned browser according to task requirements. Record source URL, observation time, raw-byte digest, representation and limitations. Check that the capture is the requested content, not merely HTTP 200. Sourcekit content assessment can catch known interstitial structures and check literal markers; it cannot certify semantic correctness or access rights.

### 3. Extract with bounded, explainable logic

Use pinned parsers and a deliberately scoped record container. Validate the number of candidates before reading the first match. Keep source text and normalized values separate. Record exact versus recovered selection and transformation rules. An optional Scrapling parser may locate candidates; do not load its browser, crawler, or MCP extras unless a separate need and approval exists.

### 4. Treat recovery as a hypothesis

When the legacy selector fails, compare recovered candidates with the independent record/field/unit contract. Reject mismatches even when a candidate looks plausible. Do not let a successful similarity match silently reset the saved baseline. Validate both missing selectors and reused selectors that now point at the wrong field. Ambiguous matches stay unresolved; a confidence score is not proof of field meaning.

### 5. Replay and review

Use preserved synthetic captures for baseline, changed layout, decoy, duplicate, missing, malformed and wrong-unit cases. Compare with independently defined expected results. Record versions, selectors, capture hashes, rejected candidates, and observed outcomes. Requalify relevant changes before promoting a new parser/configuration. A cached capture is replay evidence, not a fresh observation of a live site.

## Output

A typed record set or explicit incomplete result, with source/capture identity, extraction version, candidate cardinality, transformation rules, acceptance/rejection reasons, and unresolved fields. Avoid silently replacing missing values with invented defaults.

## Failure handling

A renamed selector that finds two plausible prices fails the single-field contract. An adaptive result whose record or field identity differs must be rejected. Stop on authentication/challenge content; do not escalate into session access or paid extraction without authorization.

## Example

The included optional parser evaluation uses a synthetic Studio plan. The standard monthly amount is 4900 minor units; a promotional decoy is 900. The legacy CSS ID can point at the decoy and still match. An independent standard-monthly field contract rejects it. Run `evals/scrapling/qualify.py` only in its pinned optional environment; this is a fixture evaluation, not a live integration.

## Evaluation

`references/scenarios.json` contains three not-run agent-host inputs. Executed utility, parser and browser fixture tests are separate evidence and do not establish that an agent follows this procedure.

## Technical references

- [Scrapling selection](https://scrapling.readthedocs.io/en/latest/parsing/selection.html)
- [Scrapling adaptive matching and limitations](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html)
