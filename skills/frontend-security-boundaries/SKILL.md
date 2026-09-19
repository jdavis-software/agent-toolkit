---
name: frontend-security-boundaries
description: "Keep untrusted content, navigation, credentials and server effects behind explicit boundaries while testing the real browser-to-server trust model."
metadata:
  version: "0.1.0"
---
# Frontend Security Boundaries

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Keep untrusted content, navigation, credentials and server effects behind explicit boundaries while testing the real browser-to-server trust model. Use for a concrete implementation, review or repair in this domain.

## When not to use

Do not impose this full workflow on unrelated or trivial edits. Do not replace the existing framework, design system or package manager merely to follow this skill. Installation, publication and private-data access require the consuming task's authority.

## Inputs

Resolve the user flow, accepted requirements, owned files, installed package versions, runtime/deployment target, existing component and token contracts, supported browsers, and actual check commands. Private product paths, credentials and policy stay in the consuming adapter. Read existing source and configuration before asking for information it already contains.

## Procedure

### 1. Map data to sinks

Trace URL input, markdown/HTML, stored data, third-party widgets, messages and API payloads into rendering and execution. React text escaping does not make arbitrary HTML insertion, navigation URLs or third-party script APIs safe.

### 2. Constrain rendering and navigation

Prefer text and structured nodes. Use a maintained context-appropriate sanitizer only when approved rich HTML is required; do not invent a sanitizer from a short regex. Validate destination schemes/origins, reject executable navigation and avoid rendering untrusted SVG markup as trusted code.

### 3. Keep credentials and authority server-side

Do not put secrets in public environment variables, URLs, bundles or serialized props. A hidden control or client role flag is not authorization. Check credentials and resource scope at every server effect; account for the actual session/CSRF model.

### 4. Isolate communication and storage

For postMessage, verify source/origin and message schema; minimize browser persistence of private material. Apply tenant/account cleanup and cache boundaries. CSP and Trusted Types can add defense but do not replace safe sinks or server policy.

### 5. Exercise hostile fixtures

Use synthetic XSS text, unsafe URLs, forged identifiers, malformed messages and cross-identity cache data. Assert no execution, leaked secret or unauthorized effect. Review response headers and real server denial separately from browser presentation tests.

## Output

Return the bounded implementation or review, the state/ownership decisions that matter to the task, exact changed paths, actual checks and evidence, and remaining limitations. Distinguish a passing build, a browser observation and an agent-host evaluation. Do not claim production accessibility, performance or security from a narrow fixture.

## Failure handling

A user-supplied `javascript:` destination is passed to navigation, or a sanitized-looking preview uses raw innerHTML for later updates. Constrain the actual sink on every path and verify hostile input remains text or is rejected without execution. When a required tool, dependency or permission is unavailable, preserve work and report the specific untested boundary instead of fabricating a pass.

## Example

Consider this synthetic case: A user-supplied `javascript:` destination is passed to navigation, or a sanitized-looking preview uses raw innerHTML for later updates.

Expected behavior: Constrain the actual sink on every path and verify hostile input remains text or is rejected without execution.

See the [original worked recipe](https://github.com/jdavis-software/agent-toolkit/blob/main/skills/frontend-security-boundaries/references/recipe.md) for the acceptance path.

## Evaluation and implementation scope

`references/scenarios.json` contains three not-run host-evaluation inputs, not completed evaluation results. The [frontend engineering guide](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/FRONTEND_ENGINEERING.md) maps the separate executable fixture coverage and untested boundaries. The optional React fixture is not a Next.js, native-device, screen-reader or production-security certification.

## Technical references

- [OWASP XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Next security](https://nextjs.org/docs/app/guides/data-security)

Use documentation matching installed versions. These are references to the underlying technology; upstream skill text, style databases and code are not repackaged as original instructions.
