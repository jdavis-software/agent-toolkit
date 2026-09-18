---
name: connector-setup-review
description: "Review connector installation and upgrade plans for exact provenance, scoped mutations, credential exposure, operation tests, and recoverable removal."
metadata:
  version: "0.1.0"
---
# Connector Setup Review

Original project-agnostic procedure. Agent-host effectiveness is experimental.

## When to use

Review connector installation and upgrade plans for exact provenance, scoped mutations, credential exposure, operation tests, and recoverable removal.

## When not to use

Do not impose this workflow on unrelated edits. This package does not authorize credential access, installation, paid services, external publication, or bulk collection. Resolve the current task and private execution policy first.

## Inputs

Read the requested outcome, exact source or query scope, authorized account/operation, installed tools, time/data budget, approved output destination, and required evidence. Actual project paths, credentials, and policy bindings belong in the private adapter.

## Procedure

### 1. Read before executing

Inspect the actual repository revision, package identity, install scripts, dependencies, and documented effects. A same-named registry package may be unrelated to a repository. Never turn a URL into an unattended shell pipeline or assume an installer is passive because its name sounds safe.

### 2. Build a mutation plan

List system packages, user/global tools, configuration paths, local daemons, browser extensions, agent instruction files, and external endpoints that would change. Separate a no-effect audit from installation/configuration. Preserve existing settings and authorize the smallest useful subset rather than enabling every channel.

### 3. Pin and isolate the change

Use reviewed revisions and real lockfiles where supported, approved installation scope, and least-privileged identity. Do not hand-author dependency locks or silently modify shell profiles, browser stores, or all agent hosts. Treat transitive install scripts as code execution with inherited authority.

### 4. Verify installation and operation separately

After approved setup, check the actual executable/version and then the narrowly required authorized operation. Use Connector Health Diagnostics for layered evidence. Record what was not tested; successful package installation is not working platform access, free usage, or host compatibility.

### 5. Keep upgrades and removal recoverable

Preserve prior configuration and a tested recovery route. Review capability/permission/data-destination changes before upgrading. Remove only owned components; an uninstall must not delete shared tools, unrelated sessions, or another project's agent instructions. Store secrets privately and redact exported evidence.

## Output

A reviewed setup or upgrade plan with source pin, effect inventory, permissions, execution scope, operation tests, recovery, and owned uninstall boundaries. Keep successful, partial, blocked, and not-run observations distinct.

## Failure handling

The installer wants elevated access to replace global Node tooling. Stop at the audit result and propose an authorized scoped alternative instead of elevating automatically. Preserve existing work and the last good checkpoint. Do not invent missing access or silently broaden permission to complete the task.

## Example

An optional search adapter would register a remote endpoint and write several agent config files. Approve only the intended host and endpoint after reviewing data handling and cost. This is a synthetic scenario, not a completed agent-host evaluation.

## Companion and evaluation

Use the full toolkit checkout. [Sourcekit commands](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SOURCEKIT.md) document the actual implemented boundary. The companion is a bounded reader/parser and routing adviser, not a universal authenticated connector. `references/scenarios.json` contains not-run evaluation inputs.

## Technical references

- [Python virtual environments](https://docs.python.org/3/library/venv.html)
- [GitHub immutable releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
