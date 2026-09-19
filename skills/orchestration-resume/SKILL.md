---
name: orchestration-resume
description: "Resume interrupted coordination from checked run records, reusing only current accepted artifacts and withholding ambiguous or stale work."
metadata:
  version: "0.1.2"
  collection: "jordans-agent-toolkit"
---
# Orchestration Resume

Original, project-agnostic guidance. Agent-host effectiveness remains experimental.

## When to use

Resume interrupted coordination from checked run records, reusing only current accepted artifacts and withholding ambiguous or stale work. Activate only when the current task crosses this boundary.

## When not to use

Do not impose orchestration on a trivial edit or use these instructions to expand authority, start paid agents, alter production, or replace the consuming host's policies.

## Procedure

### Load authoritative state

Read the plan and journal from the accepted run. Validate schema, event ordering, input identity, and observed journal integrity. Hash chains detect inconsistency but do not authenticate the writer or prevent a malicious rewrite.

### Verify what can be reused

Match task input/contract/context digests and dependency identities. Check the bytes of accepted artifacts against their recorded hashes and propagate invalidation to descendants. A successful old message or unchanged task name is insufficient.

### Classify unfinished work

Keep queued tasks distinct from running, submitted, failed, and indeterminate tasks. Reconcile uncertain external effects before retry. Preserve charged or unknown usage; interruption does not restore a budget automatically.

### Propose only safe next work

Agentflow resume checks bounded local artifacts and returns a proposal. It does not launch or mutate prior runs. Changed plans or stale tasks require an explicit replan/review rather than an automatic rewrite of accepted history.

## Output

Reusable task IDs, stale or blocked results, unresolved attempts, consumed budget, and a bounded next-wave proposal. Tie observations to actual inputs and keep passed, failed, blocked, and not-run states distinct.

## Failure handling

An accepted artifact is missing or symlinked: mark it stale rather than follow an uncontrolled path or call the task complete. Preserve partial work and report the smallest missing prerequisite rather than manufacture evidence.

## Example

The contract artifact still matches its digest, but a derived review report was edited. Retain valid unrelated work and block dependent reuse until review is restored. This is a synthetic design scenario, not a completed host evaluation.

## Companion tooling and evaluation

[Agentflow commands and boundaries](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/AGENTFLOW.md) document the optional offline coordination helper. It performs only its documented checks; the full procedure still needs a qualified host and private adapter. Use `references/scenarios.json` for trigger, boundary, and non-trigger evaluation inputs. Their `not-run` status is not a test result.

## One authority during recovery

Pause dispatch after uncertain restart. Reconcile the recorded worker/session identity and owned resources before another writer starts. A reused PID or an expired lease does not prove the previous process stopped.

Require epoch and accepted contract identity when accepting late submissions. Preserve cancelled patches and unknown effects. Keep one controller; do not stack a second retry loop under the first to manufacture progress.

## Revalidate context before reusing it

A valid orchestration record and valid context are different checks. Use Harnesskit `revalidate` for an explicitly captured file/context binding before injecting saved findings. It can detect changes to selected ignored files even when the Git-visible state is unchanged. It cannot prove worker inactivity, account authority or remote outcome; keep those reconciliation gates with the selected controller. See [evidence contracts](https://github.com/jdavis-software/agent-toolkit/blob/main/docs/HARNESS_EVIDENCE.md).
