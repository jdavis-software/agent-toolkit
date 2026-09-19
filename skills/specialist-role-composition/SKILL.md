---
name: specialist-role-composition
description: "Compose a small task-relevant specialist preset from canonical skills, with explicit outputs and non-goals while leaving permissions and execution to the host."
metadata:
  version: "0.1.0"
---
# Specialist Role Composition

Original, project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

Compose a small task-relevant specialist preset from canonical skills, with explicit outputs and non-goals while leaving permissions and execution to the host.

## When not to use

Do not impose this procedure on unrelated small tasks. It does not install tools, create a worker, authorize spending or publication, or replace the consuming repository's rules. Private paths, account bindings and accepted policy remain outside this public package.

## Inputs

Resolve the actual task, accepted source/artifact identity, authorized scope, installed capabilities, output requirements and evidence available. Read existing project configuration before asking the user to repeat it. Identify missing prerequisites rather than fill them with invented observations.

## Procedure

### 1. Select responsibility before persona

Choose the concrete job: implement a feature, review an architecture, analyze evidence, produce a video or verify a release. Avoid fictional credentials and claims of persistent memory. Use a short task without a role when role selection would add no useful guidance.

### 2. Resolve canonical packages

Use the toolkit role registry and read-only resolver from a reviewed checkout. Inspect skill IDs and content hashes; unresolved, duplicate or nonlocal skills fail selection. Roles reference existing instructions rather than maintaining copies. Discovery returns metadata; load only the skill bodies the actual task needs.

### 3. Bind the task separately

Supply source/contract revision, owned scope, tools, account context, deadlines, budget and acceptance criteria through the consuming host. A preset's preferred review or implementation mode is a request, not an authorization rule. The host must reject an action outside its real grants even when a role asks for it.

### 4. Require an observable deliverable

Give the worker an output contract: source-linked findings for a reviewer, changed paths and check receipts for an implementer, or a traceable artifact package for a producer. Keep unresolved checks visible. A role label does not establish expertise, tool access or independently accepted results.

### 5. Evaluate and refresh the selection

Confirm required tools are actually available in the child environment. Test intended and non-trigger cases, refusal of out-of-scope effects and handoff completeness before advertising host support. Pin a role revision, review changes to selected skills, and keep private bindings out of public manifests.

## Output

A task-sized artifact and review record with input identities, decisions, source-linked observations, actual check results and limitations. Keep implementation, supplied metadata, measured behavior and independent acceptance distinct. Use passed, failed, blocked and not-inspected states rather than a blanket success claim.

## Failure handling

A preset references a missing skill or claims to grant shell permission. Reject the malformed registry; do not substitute a similarly named skill or infer authority. Preserve partial work and explain the smallest missing input or corrective step. Never broaden tool authority to conceal a blocker.

## Example

The Architecture Reviewer preset selects orientation, contract and boundary skills. Its requested mode is read-only. A private host denies a attempted repository mutation even though the agent can describe the desired repair. The public resolver itself does not run or deny that command. This is a synthetic example, not a production or agent-host result.

## Companion and evaluation

See [collection contracts and worked fixtures](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/SPECIALIST_COLLECTION.md). For role selections, use `node tools/bundle.mjs roles` and `node tools/bundle.mjs role ROLE`. The helpers check only their documented input contracts. `references/scenarios.json` contains not-run host evaluation inputs, not recorded executions.

## Technical references

- [Agent Skills specification](https://agentskills.io/specification)
- [Git worktrees](https://git-scm.com/docs/git-worktree)
