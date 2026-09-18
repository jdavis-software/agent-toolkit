---
name: bounded-crawl-planning
description: "Specify finite, authorized multi-page collection with persistent cooldowns, deduplication, freshness and recovery rules, without treating a plan as an executing crawler."
metadata:
  version: "0.1.0"
---
# Bounded Crawl Planning

Original project-agnostic procedure. Agent-host effectiveness remains experimental.

## When to use

An approved research task actually needs multiple pages, pagination, or repeated source collection. Use before enabling recursion or concurrency and when resuming interrupted work.

## When not to use

One explicit URL or feed snapshot answers the question. This skill does not authorize a crawl, subscribe to updates, launch a service, bypass an access restriction, or install a new spider framework.

## Inputs

Resolve the authorized goal, canonical source/policy baseline, actual tool versions, owned resources, required evidence and task limits from the consuming project. Keep private roots, credentials and concrete command bindings in its adapter.

## Procedure

### 1. Freeze purpose and scope

Record allowed origins and path boundaries, accepted starting points, data classes, site/crawler policy, evidence destination and retention. Define page, depth, request, byte and total-time budgets. Distinguish page origin from browser subresources and redirected destinations. Apply destination checks where requests execute; Sourcekit restrictions do not automatically constrain a separate browser or spider.

### 2. Control admission and identity

Canonicalize source identities under an explicit policy without merging URLs whose queries change meaning. Keep a visited set and detect pagination cycles. Bound global and per-origin concurrency. Review robots/site requirements with the selected backend; availability of an API or robots permission is not general account authorization. Never quietly switch proxies/accounts in response to a block.

### 3. Make waiting and retry limits durable

Honor valid Retry-After and accepted per-origin scheduling policy. Persist not-before timestamps, failure categories and attempts. Do not shorten a server-requested delay to fit a client maximum. If a wait exceeds the task budget, stop or defer instead. Authentication errors and challenges are not transient failures to hammer with retries.

### 4. Checkpoint sufficient state

Record queue, visited identities, committed results, in-flight uncertainty, budgets spent, source/policy revision and cooldowns. On resume, retain waits and consumed budgets. Reconcile in-flight writes or expensive effects instead of assuming interruption cancelled them. Development-cache data needs capture age and revision; replay is not live freshness.

### 5. Verify termination and completeness

Use disposable fixtures for a pagination loop, duplicate query variants, denied redirect, body limit, interruption and outstanding cooldown. Prove the plan terminates and reports partial results when limits are reached. Completion means the accepted finite scope was covered or its remaining work was explicitly recorded, not that the entire website was scraped.

## Output

A reviewable finite collection plan and checkpoint schema with scope, admission, budgets, deduplication, waits, evidence, freshness and recovery rules. Clearly label which controls are implemented by the selected backend and which still require an adapter.

## Failure handling

A resume that loses a five-minute cooldown is invalid even if the queue loads successfully. Block or reconstruct the missing state from reliable evidence. Stop at scope or resource limits and return partial coverage rather than silently raising limits or broadening access.

## Example

An approved synthetic docs crawl is limited to 25 pages and two requests per origin at once. Page 4 repeats page 2; it is deduplicated. A server wait extends beyond the current run budget, so the checkpoint records its absolute not-before time and remaining work. A later run preserves that wait. No real crawl is performed by this skill or Sourcekit.

## Evaluation

`references/scenarios.json` contains three not-run agent-host inputs. Executed utility, parser and browser fixture tests are separate evidence and do not establish that an agent follows this procedure.

## Technical references

- [Scrapling advanced spider controls](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html)
- [HTTP Retry-After semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-retry-after)
