---
name: browser-session-isolation
description: "Assign browser contexts and account state to explicit agent lanes, verify readiness and isolation, and preserve evidence before releasing only owned resources."
metadata:
  version: "0.1.0"
---
# Browser Session Isolation

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

A task needs rendered-page interaction, authenticated inspection, or concurrent browser agents. Apply this before acquiring or reusing a browser, not after two agents have already changed the same page.

## When not to use

A bounded static read is enough, or the task is a local code edit. Do not attach to a personal profile, install a browser extension, export cookies, grant credentials, or launch a remote session merely because a URL appears in context.

## Inputs

Resolve the authorized goal, canonical source/policy baseline, actual tool versions, owned resources, required evidence and task limits from the consuming project. Keep private roots, credentials and concrete command bindings in its adapter.

## Procedure

### 1. Declare session ownership before acquisition

Identify lane, browser provider, context/profile identifier, source-account scope, permitted effects, lease owner, and evidence destination. Distinguish a browser process from its separate contexts and pages. Reuse an accepted allocator; a Git worktree does not isolate browser state. A persistent profile has an exclusive owner while in use. Do not share one writable profile across simultaneous processes.

### 2. Choose the smallest appropriate isolation boundary

Prefer a fresh context for anonymous work. Supply approved synthetic or scoped account state only where the task requires it. Distinct contexts isolate browser storage, not host files, operating-system privileges, account-side state, or every network effect. Distinct profiles do not themselves create a security sandbox. Never assume copied storage state is safe to publish or that an inherited authenticated session authorizes a mutation.

### 3. Verify identity and readiness

Confirm URL, page title, meaningful content, and expected controls. Wait for the task-specific state, such as the loaded record or enabled action, rather than relying on a fixed sleep or network-idle alone. Treat an access challenge, login page, unexpected account, and incomplete JavaScript shell as separate outcomes. Record a small DOM observation or screenshot without exporting private session material.

### 4. Execute and check isolation

Keep each lane on its owned context and selected page. Restrict navigation, downloads, uploads, cross-origin requests, and mutation tools in the actual executing environment. Before irreversible effects, use the accepted approval mechanism. Test with two independent synthetic contexts: write a cookie and local storage in one; the other should not see either. Server-side account state requires a separate test.

### 5. Release with evidence

On completion, cancellation, or timeout, save permitted evidence, close owned pages/contexts, and release the allocation. Do not kill a shared browser or clear another lane's profile. On uncertain ownership, preserve work and reconcile instead. A browser crash or lost client connection does not prove a submitted server-side action was cancelled.

## Output

A lane-specific record containing context/profile ownership, source account scope, allowed actions, readiness observations, actual checks, evidence references, and cleanup status. Report uninspected account/server isolation explicitly.

## Failure handling

A stale lease, busy profile, mismatched account, or missing approval blocks execution. Do not repair it by using another agent's logged-in session. An unresponsive page may require a bounded retry, but retries must not duplicate an uncertain side effect.

## Example

Two agents review different synthetic pricing pages. Each gets a fresh context. The first stores a synthetic session cookie; the second still has no cookie or local storage. Both close only their own contexts. This demonstrates browser-storage separation, not account-level or operating-system isolation.

## Evaluation

`references/scenarios.json` contains three not-run agent-host inputs. Executed utility, parser and browser fixture tests are separate evidence and do not establish that an agent follows this procedure.

## Technical references

- [Playwright browser contexts](https://playwright.dev/docs/browser-contexts)
- [Playwright MCP isolation and security limits](https://github.com/microsoft/playwright-mcp)
