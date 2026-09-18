---
name: integration-artifact-promotion
description: "Validate combined parallel changes and promote identified artifacts while preserving independent release approval, integration capacity, and recovery."
metadata:
  version: "0.1.0"
  collection: "jordans-agent-toolkit"
---
# Integration Artifact Promotion

Original, project-agnostic instructions. Agent-host effectiveness remains experimental.

## When to use

Validate combined parallel changes and promote identified artifacts while preserving independent release approval, integration capacity, and recovery. Use for an actual task in this domain, under the consuming repository's approved policies.

## When not to use

Do not impose this procedure on unrelated or trivial work. Do not migrate tools, install services, perform production effects, publish, or delete resources without the task's required authorization.

## Inputs and tailoring

Resolve the task goal, accepted source/contract baseline, relevant paths, installed versions, actual project-owned commands, effect policy, and required evidence. Read existing configuration before asking for information it already contains. Concrete repository roots, credentials references, command bindings, and private policies belong in the consuming adapter, not this public skill.

## Procedure

### 1. Establish the boundary

Record the actual integration base, proposed branches, and preceding queued changes. Use a qualified queue or protected serialized integration. Independently green branches are not evidence that their combination works.

### 2. Choose the supported contract

Reserve validation/integration resources separately from model agents, compiler threads, databases, tests, and image builds. Reduce admission when the integration queue saturates instead of endlessly increasing fan-out.

### 3. Implement or qualify the path

Bind checks to candidate source, contracts, toolchain, fixtures, and artifact digests. Detect edits after verification and distinguish fresh execution from cache restoration with a qualified producer.

### 4. Exercise failure and integration seams

Promote the validated object where supported rather than rebuild an unverified replacement. Record environment configuration separately and coordinate schema/API/worker transitions beyond what source graphs can infer.

### 5. Verify and hand back evidence

Keep release authorization separate from build success. After an authorized deployment, verify the actual environment and a bounded behavior path. Preserve the prior artifact and compatible rollback/recovery.

## Output

Return a task-sized implementation or review record containing the accepted invariant, source/environment identity, concrete decisions and changed paths, actual check results, evidence locations, remaining uncertainty, and next action. Distinguish passed, failed, blocked, and not-run checks; package shape is not behavior evidence.

## Failure handling

Deployment rebuilds from a newer untested commit: require new evidence or use the previously validated artifact. When access or prerequisites are unavailable, preserve existing work and report the smallest missing input. Do not fabricate commands, results, compatibility, or successful external effects.

## Example

Two branches change a response and its consumer incompatibly. The combined candidate fails before promotion despite each branch passing independently. This is a synthetic example, not a completed production or agent-host run.

## Evaluation

Use `references/scenarios.json` for intended, boundary, and non-trigger evaluation inputs. Keep their status not-run until a separate real host evaluation records actual outcomes.

## Technical references

- [GitHub merge queues](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [Build attestations](https://docs.docker.com/build/metadata/attestations/)

Consult documentation for the installed versions before using version-sensitive APIs. These are underlying-technology references, not copied upstream skill bodies.
