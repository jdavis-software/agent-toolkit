---
name: technical-debt-triage
description: "Produce evidence-linked technical-debt findings with consequences, deliberate tradeoffs, bounded repair targets and independent reproduction checks rather than a style-driven rewrite list."
metadata:
  version: "0.1.0"
---
# Technical Debt Triage

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Produce evidence-linked technical-debt findings with consequences, deliberate tradeoffs, bounded repair targets and independent reproduction checks rather than a style-driven rewrite list.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Scope the system and consequence

Choose a bounded feature or vertical execution path and the decision the audit should support. Read its authoritative interfaces, ownership and tests. Distinguish business invariants, operational constraints and maintainability concerns. Do not turn a scoped audit into an unsolicited repository-wide restructuring.

### 2. Collect evidence before ranking

Inspect call/data flow and reproduce suspected behavior in an owned fixture where possible. Capture source revision, relevant lines, actual failing condition, affected users and prohibited side effects. A TODO, large file, old dependency or complex function is a lead, not by itself a defect.

### 3. Classify and preserve tradeoffs

Separate confirmed defects, risk hypotheses, deliberate tradeoffs and style preferences. Identify generated/vendor code and locate the canonical generator before proposing edits. Record why a design may exist and its compatibility constraints. Unknown history stays unknown, not invented negligence.

### 4. Prioritize the repair outcome

Rank by demonstrated consequence, affected scope, urgency, confidence and repair cost. Describe the scale used; avoid precise invented financial loss or universal weighted scores. Prefer a small verified invariant repair over deleting a harmless generated listing. Identify dependencies and what remains out of scope.

### 5. Produce a bounded handoff

Convert an accepted finding into a Work Packet Planner input with owned paths, tests, rollback and expected observable result. Run relevant negative cases. The companion only reconciles supplied classification, excerpts and check status; it does not scan arbitrary code or execute the declared reproduction. Compare subsequent audits using finding identity, not counts alone.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

A size-only generated-file complaint should not outrank a demonstrated concurrent reservation defect. Do not label an unrun reproduction as confirmed or edit derived files to conceal the cause.

## Example

The synthetic record contains an overbooking observation and a large generated catalog. It identifies the defect as an action candidate while preserving generated size as a deliberate tradeoff.

## Companion and evaluation

The original Publicationcheck helper provides the `debt` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [Git diff evidence](https://git-scm.com/docs/git-diff)
- [Go race testing](https://go.dev/doc/articles/race_detector)
