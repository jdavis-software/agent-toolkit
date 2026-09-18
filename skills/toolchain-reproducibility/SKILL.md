---
name: toolchain-reproducibility
description: "Compare actual compiler, runtime, package-manager, container, and agent-tool identities across environments and verify targeted drift corrections."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Toolchain Reproducibility

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Compare actual compiler, runtime, package-manager, container, and agent-tool identities across environments and verify targeted drift corrections. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Read canonical version/dependency locks, then inspect executables used by the CLI, editor, app server, containers, and agents. Record versions, architecture, command resolution, and relevant configuration.

### 2. Choose the supported contract

Separate tool installation locks from language dependency locks. A qualified installer such as mise does not replace pnpm-lock.yaml, go.sum, or container image identity.

### 3. Implement or qualify the path

Probe required flags, APIs, protocol behavior, and target-platform execution through actual entry points. Matching major versions are insufficient where integrations rely on specific capabilities.

### 4. Exercise failure and integration seams

Classify environment differences as required, compatible, or unresolved. Propose the smallest owned correction. Do not replace global machine configuration or install across inaccessible devices without authorization.

### 5. Verify and hand back evidence

Repeat the original probes after changes, update relevant build/cache identity, and preserve rollback. Do not declare synchronization from one version file or remove locks to hide resolution problems.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Only one of two developer machines is accessible: the other remains uninspected, not synchronized. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

The CLI uses a newer compiler while an app server and container remain older; verify each actual execution path after its approved correction. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [mise.lock](https://mise.jdx.dev/dev-tools/mise-lock.html)
- [Go toolchains](https://go.dev/doc/toolchain)
- [Node packages](https://nodejs.org/api/packages.html)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
