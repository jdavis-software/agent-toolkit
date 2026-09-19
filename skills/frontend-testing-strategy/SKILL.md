---
name: frontend-testing-strategy
description: "Choose unit, component and browser checks around user-visible frontend contracts, with independent network fixtures and explicit integration coverage."
metadata:
  version: "0.1.0"
---
# Frontend Testing Strategy

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Choose unit, component and browser checks around user-visible frontend contracts, with independent network fixtures and explicit integration coverage. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. List the risks and boundaries

Identify parsing/state logic, component interactions, browser APIs, network behavior, navigation and server authorization. Map each acceptance criterion to the lowest layer that can actually observe it, while retaining a complete representative browser journey.

### 2. Assert observable behavior

Prefer roles, labels and user actions over component internals and implementation snapshots. Test results and prohibited effects. Keep deterministic data, clocks and request sequencing without disabling the race or failure being tested.

### 3. Control dependencies deliberately

Use fresh query clients and isolated storage for tests. Configure retries deliberately and control asynchronous completion through gates rather than arbitrary sleeps. A mocked API proves client behavior against the mock contract; add a separate real integration check where required.

### 4. Make failure evidence meaningful

Include malformed payloads, empty and stale data, denied writes, keyboard access and aborted requests. Ensure a deliberate defect fails the intended assertion, not setup. Keep console/network failures visible and classify expected errors.

### 5. Verify the suite actually ran

Inspect the test discovery registry, executed names, retries and skips. A new test file outside an explicit testMatch is not coverage. Run production build checks and the representative flow after changes, then preserve exact versions and limitations.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A newly added test file is absent from Playwright’s explicit registry, so CI reports success without running its interaction tests. Check discovery and expected execution counts, register the file, and prove the required user journey ran without a hidden skip. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A newly added test file is absent from Playwright’s explicit registry, so CI reports success without running its interaction tests.

Expected behavior: Check discovery and expected execution counts, register the file, and prove the required user journey ran without a hidden skip.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-testing-strategy/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Testing Library principles](https://testing-library.com/docs/guiding-principles/)
- [Query tests](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
