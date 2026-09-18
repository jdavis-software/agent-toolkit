---
name: connector-health-diagnostics
description: "Diagnose each source operation using separate installation, execution, connectivity, authentication, permission, and live-result evidence."
metadata:
  version: "0.1.0"
---
# Connector Health Diagnostics

Original project-agnostic procedure. Agent-host effectiveness is experimental.

## When to use

Diagnose each source operation using separate installation, execution, connectivity, authentication, permission, and live-result evidence.

## When not to use

Do not impose this workflow on unrelated edits. This package does not authorize credential access, installation, paid services, external publication, or bulk collection. Resolve the current task and private execution policy first.

## Inputs

Read the requested outcome, exact source or query scope, authorized account/operation, installed tools, time/data budget, approved output destination, and required evidence. Actual project paths, credentials, and policy bindings belong in the private adapter.

## Procedure

### 1. Declare evidence levels

List the specific adapters and operations the task needs. Use states such as missing, present-not-probed, executable, connected, authenticated, authorized, operation-tested, stale, and blocked. Never compress these into a blanket green available flag. Record which host/worktree/account each observation belongs to.

### 2. Begin with no-effect checks

Run `node tools/sourcekit.mjs doctor` to exercise its local parsers and observe optional command presence. It does not execute discovered binaries, open a browser, read credential stores, or verify live platform access. Inspect an upstream diagnostic command before running it: a command named doctor or status may start a daemon or modify config.

### 3. Probe only the required boundary

After reviewing the command and permissions, use a minimal bounded probe of the actual needed operation. A version result proves less than a successful authorized read, and a browser extension file proves less than an active connection. Keep capability tests scoped; do not perform posts, purchases, mass search, or paid model calls to validate read access.

### 4. Classify failure before repair

Distinguish a missing executable from a broken interpreter shim, expired identity, rejected scope, rate limit, network failure, challenge page, schema change, and empty result. Preserve the error class without leaking command output, tokens, cookies, signed URLs, or private paths. Retry only a documented safe transient operation with a bound.

### 5. Prescribe rather than silently fix

Report the smallest approved next step. Any installation, configuration edit, session renewal, or server startup is a separate authorized mutation. Re-run the failed operation after the fix. Expire the result after account, tool, scope, worktree, or platform changes; delegated workers must verify their own bindings.

## Output

A per-operation health matrix with evidence level, timestamp, binding, failure class, redacted evidence, and a minimal repair or recheck plan. Keep successful, partial, blocked, and not-run observations distinct.

## Failure handling

A diagnostic command would start a browser daemon. Do not run it under a read-only check mandate; use an approved passive probe or report the limitation. Preserve existing work and the last good checkpoint. Do not invent missing access or silently broaden permission to complete the task.

## Example

The transcript command is on PATH but its interpreter was removed. Report executable failure; do not tell the user the video lacks captions. This is a synthetic scenario, not a completed agent-host evaluation.

## Companion and evaluation

Use the full toolkit checkout. [Sourcekit commands](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SOURCEKIT.md) document the actual implemented boundary. The companion is a bounded reader/parser and routing adviser, not a universal authenticated connector. `references/scenarios.json` contains not-run evaluation inputs.

## Technical references

- [GitHub CLI auth status](https://cli.github.com/manual/gh_auth_status)
- [Python subprocess](https://docs.python.org/3/library/subprocess.html)

## Content-level diagnostic evidence

Keep successful transport separate from the requested result. Sourcekit 0.2 can return capture `status: ok` alongside `contentAssessment.state: authentication-required` or `unknown`. Do not turn that into a connectivity failure or a successful source read. A local parser assessment also does not establish live authentication. Preserve the original capture, limits and exact operation before choosing an authorized next step.
