---
name: react-forms-validation
description: "Build React forms with a deliberate native or React Hook Form lifecycle, accessible errors, stable field identity and authoritative server validation."
metadata:
  version: "0.1.0"
---
# React Forms and Validation

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Build React forms with a deliberate native or React Hook Form lifecycle, accessible errors, stable field identity and authoritative server validation. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Specify data and submission semantics

Define field types, optional/blank/null distinctions, normalization and server error shape from the accepted contract. Client validation improves feedback; it is not authorization or a replacement for server validation. Choose native forms or the existing form library before adding dependencies.

### 2. Bind fields consistently

For React Hook Form, use stable defaultValues and registered native inputs where possible. Use the installed Controller/useController contract for controlled third-party widgets; do not double-register them. Preserve field-array identity and use explicit button types.

### 3. Protect drafts and resets

Define what happens after save, cancel, record switch and background refresh. Do not call reset on every refetch while a user is typing. Qualify keepDirtyValues and subscriptions against the installed version when merging new defaults. Keep sensitive drafts out of persistent storage by default.

### 4. Handle asynchronous outcomes

Await the actual submit promise so pending state lasts until completion. Prevent duplicate admission, preserve values on failure and map server field errors to the relevant controls. Use cancellation or request identity for async validation so an old response cannot overwrite a new value.

### 5. Exercise meaningful failures

Test empty/whitespace values, boundaries, invalid server payloads, rejected submissions, double clicks, dirty refetch and identity changes. Inspect focus on the first invalid field and label/error associations. Confirm the outbound request uses normalized accepted values.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A name form looks valid locally, receives a server conflict, then resets all user input and announces success because the submit promise was not awaited. Await submission, show the server error, keep the draft, block duplicate submits and verify the success path only after actual acceptance. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A name form looks valid locally, receives a server conflict, then resets all user input and announces success because the submit promise was not awaited.

Expected behavior: Await submission, show the server error, keep the draft, block duplicate submits and verify the success path only after actual acceptance.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/react-forms-validation/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [React Hook Form](https://github.com/react-hook-form/react-hook-form)
- [Reset documentation](https://github.com/react-hook-form/documentation/blob/master/src/content/docs/useform/reset.mdx)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
