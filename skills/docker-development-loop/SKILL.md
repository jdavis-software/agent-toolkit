---
name: docker-development-loop
description: "Distinguish file synchronization, restart, recompilation, image rebuild, and platform validation in a container loop that preserves owned application state."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Docker Development Loop

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Distinguish file synchronization, restart, recompilation, image rebuild, and platform validation in a container loop that preserves owned application state. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Map source, dependency, configuration, and image changes to necessary actions. Go source sync alone does not replace a running binary. Identify which paths require compile, restart, or image rebuild.

### 2. Choose the supported contract

Review build context, ignores, COPY/layer boundaries, cache mounts, generated inputs, and secret handling. Avoid sending private/unrelated files or baking credentials into image layers.

### 3. Implement or qualify the path

Qualify installed Compose Watch behavior and test representative changes for each action. Verify the running endpoint or process actually reflects the edit; a sync log is not reload evidence.

### 4. Exercise failure and integration seams

Record build/runtime OS and architecture and compare native/emulated paths only with matched end-to-end workload and transfer costs. Give each active database server and lane its own writable state.

### 5. Verify and hand back evidence

Test production images through real entry points, health/shutdown behavior, and affected integrations. A development bind mount is not a release artifact. Preserve persistent volumes during narrow development repairs.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Two PostgreSQL containers share one writable data directory: reject that resource allocation instead of treating it as reusable cache. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

A Go handler edit recompiles and restarts the process; a dependency lock edit rebuilds the dependency image path. The owned test database persists. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/)
- [Docker caching](https://docs.docker.com/build/cache/optimize/)
- [Multi-platform builds](https://docs.docker.com/build/building/multi-platform/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
