---
name: evidence-backed-visual-explanation
description: "Explain an inspected system or change with source-linked relationships, explicit assumptions, readable visual structure and an equivalent accessible narrative."
metadata:
  version: "0.1.0"
---
# Evidence-backed Visual Explanation

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Explain an inspected system or change with source-linked relationships, explicit assumptions, readable visual structure and an equivalent accessible narrative.

## When not to use

Do not impose this workflow on unrelated edits. It does not authorize installation, model calls, paid services, credential access, production changes or publication. Use the consuming environment's approved tools and authority.

## Inputs

Resolve the task, source revision, desired artifact, approved scope, evidence, actual tool versions and output constraints. Private paths, accounts, brand kits and provider bindings stay in the consuming project, not in the public skill.

## Procedure

### 1. Establish the explanation contract

Name the audience, the question they should be able to answer, and the inspected source revision. Choose the smallest useful view: sequence, dependency, state transition or comparison. Mark implementation, proposal and measured behavior separately; do not present a desired architecture as deployed.

### 2. Model relationships with provenance

Create a bounded node/relationship record. Each important connection needs an inspected passage, implementation reference or trace that supports its direction and meaning. Keep uncertainty and conflicting evidence explicit. Graph connectivity, AST matches and appealing layout are not proof of runtime behavior.

### 3. Choose an existing presentation path

Reuse the project design system and an already-qualified HTML, Mermaid or SVG renderer when appropriate. Do not introduce a new renderer merely to draw a few boxes. Treat labels and source text as data: escape markup, prevent executable links and avoid loading remote assets without approval.

### 4. Make the narrative equivalent

Use concise labels, grouping and direction cues that remain legible at small widths. Provide a visible text explanation with the same actors, order, conditions and uncertainty. Do not encode meaning only with color. Long or complex relationships need structured text, not a vague alt attribute.

### 5. Review semantics and rendering independently

Cross-check the relationship model against actual evidence, then inspect the rendered desktop/mobile view and keyboard path. Test long labels and untrusted markup. The companion checks references/excerpts and flags assumed or unsupported edges; browser tests establish rendering separately. Passing a model check is not evidence of semantic truth.

## Output

A bounded, source-linked artifact and review record: input identity, decisions, actual checks, findings, unresolved assumptions and the next authorized action. Separate mechanical checks from semantic review, runtime observations and independent acceptance.

## Failure handling

A diagram adds a direct client-to-database edge because it looks simpler, but the source only shows an API adapter. Remove or explicitly label the unsupported edge rather than using geometry validation as proof.

## Example

The public Research to Delivery example renders three synthetic stages and the two source-linked relationships. The adjacent narrative and fixture label make the meaning and limits explicit.

## Companion and evaluation

The original Publicationcheck helper provides the `explanation` command. Use a full checkout and [the exact command contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/PUBLICATIONCHECK.md). A passed helper check does not certify source truth, rights, search visibility or completed agent behavior. `references/scenarios.json` contains not-run host evaluation inputs.

## Technical references

- [W3C complex images](https://www.w3.org/WAI/tutorials/images/complex/)
- [Provenance](https://www.w3.org/TR/prov-overview/)

[Open the synthetic worked example](https://jdavis-software.github.io/agent-toolkit/examples/research-to-delivery/).
