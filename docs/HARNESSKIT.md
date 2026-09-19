# Harnesskit: qualification without another controller

An original, dependency-free Node helper collection. It complements Agentflow (offline coordination), Skillcheck (actual check receipts) and Bundle Resolver (read-only package selection). It does not launch a coding agent or install a scheduler. Use a full checkout with Node 22.12+; Git is needed for `observe` and `profile`.

## Context and canary evidence

`checkpoint`, `revalidate`, and `canary` add selected-file freshness and bounded end-of-run reporting. Read [the full contracts and runnable example](HARNESS_EVIDENCE.md). Checkpoint creation observes local Git/files; canary calculations operate on supplied records, preserve incomplete work, and never decide adoption. No new scheduler, live worker adapter or default dependency is introduced.

## Commands and effects

| Command | Actual behavior | Does not establish |
| --- | --- | --- |
| `observe --root REPOSITORY` | Probe Git-visible source state and this Node process; omit absolute root and changed-file names from stdout. | Agent authentication, loaded prompts/skills/MCPs, ignored files or editor overlays. |
| `profile EXPECTED.json OBSERVED.json --root REPOSITORY` | Re-probe source, reject stale/wrong-state bindings and compare required observed fields. | Authenticity of caller-supplied worker/configuration observations. |
| `readiness TASK.json SNAPSHOT.json` | Reconcile task/code repository, prerequisites, revisions, evidence presence and observed ownership. | Live tracker access, an atomic claim, or genuine independent acceptance. |
| `events CAPTURE.jsonl --format codex-exec --binding BINDING.json` | Normalize one ordered saved Codex exec stream and reconcile reported turn usage. | Live Codex execution/authentication, app-server support or accepted integration. |
| `events EVENTS.json --format normalized` | Reconcile explicit versioned observation identities, delta/cumulative counters and epochs. | That different counters describe disjoint usage or a real provider bill. |

Exit **0** means the command's stated checks are satisfied; **3** means a mismatch, missing/unknown observation, failed/interrupted turn or incomplete coverage; **2** means invalid input or a probe error. JSON evidence is retained on exit 3. `observe` is a capture, not a qualification pass. Stdout redirection is an explicit caller-owned write; put receipts outside the inspected repository.

```bash
node tools/harnesskit.mjs --help
node tools/harnesskit.mjs observe --root .
node tools/harnesskit.mjs events examples/harnesskit/exec.jsonl \
  --format codex-exec --binding examples/harnesskit/binding.json
node examples/harnesskit/profile-demo.mjs
node examples/harnesskit/controller-demo.mjs
node --test tests/harnesskit.test.mjs
```

The demos create and remove only their own disposable local fixtures. They do not contact accounts, trackers or models. All other CLI operations read and report; none performs cleanup.

## Execution profile contract

The expected document has `schemaVersion: 1`, an explicit `gitRevision` (40–64 lowercase hexadecimal), `requireClean`, `maxAgeSeconds` (1–86400), and a nonempty `fields` object mapping allowed names to expected strings. Allowed names are `nodeVersion`, `platform`, `architecture`, `model`, `reasoning`, `authMode`, `runtimeVersion`, `runtimeExecutableSha256`, `approvalPolicy`, `sandbox`, `instructionsSha256`, `skillBundleSha256`, and `mcpRootSha256`.

Observed records use the shape emitted by `observe`: `schemaVersion`, UTC `observedAt`, `workspace: {rootSha256, head, stateSha256, dirty}`, and `fields`. Each field has optional `requested`/`resolved`/`observed` strings, `provenance` (`host-probe`, `runtime-response`, `launch-arguments`, `configuration`), and `mutability` (`startup`, `reloadable`, `unknown`). Only this reporter's Node/platform/architecture fields are supplied from the fresh local probe. A separately qualified private adapter may provide worker fields bound to the same source state. Configuration or launch arguments alone cannot satisfy a required runtime observation.

The report returns field names and comparison states, not raw values. Provenance labels are caller declarations, not cryptographic trust. A dishonest adapter can forge observations; the executor must enforce real policy. Freshness permits at most five seconds of forward clock skew. The private adapter owns account/tenant binding, genuine runtime probes and revocation; this helper never opens Codex credential stores or invokes `codex login`.

Git observation reuses Skillcheck's existing worktree inspection with inherited Git overrides removed. The fingerprint covers tracked diffs and nonignored untracked content. It excludes ignored build outputs, external state, unsaved buffers and environment; it is not an atomic snapshot. Collection can fail under concurrent mutation or size limits. A root hash is an identity aid, not protection for guessable private paths.

## Tracker readiness contract

`TASK.json` contains `schemaVersion:1`, `id` in `owner/repository#number` form, a separate `codeRepository`, a 64-hex `contractRevision`, a Git `baseRevision`, `maxAgeSeconds`, and `dependencies: [{id, contractRevision}]`.

The snapshot contains `schemaVersion:1`, UTC `observedAt`, `task` with matching identity/revisions plus `ready:true` and `ownership:"available"`, and `dependencies`. A dependency is accepted only with `state:"accepted"`, the matching `contractRevision`, a `candidateRevision`, and a 64-hex `acceptanceEvidenceSha256`. Closed/open/unknown records do not satisfy acceptance. Missing, duplicate, self-referential or stale prerequisites fail appropriately. At most 200 dependencies are supported.

A full dependency list and real independent evidence must come from the trusted adapter. No GitHub API is called. A task omitted by the query is unknown, not accepted. Availability is a point-in-time observation, not a reservation; recheck and claim with the selected single lifecycle authority before starting a worker.

## Event contract and privacy

For `codex-exec`, the binding document contains `schemaVersion:1`, `attemptId`, and a caller-declared `runtimeVersion`. Input is one ordered saved JSONL stream with documented dot-separated thread/turn/item events. Turn IDs are local sequences because this interface does not supply one in every event. Summaries use the capture hash and line identity. Raw commands, patches, model output and error messages are not copied into the summary. Review metadata and hashes before sharing; this is not a general data-loss-prevention service.

A repeated whole capture yields the same report; the helper does not append that result to an authoritative ledger. There is no safe generic way to deduplicate identical provider lines without event IDs. A repeated terminal without an active turn is flagged; equal usage in two real turns counts twice. Unknown event types, missing thread/terminal/usage data and counter discontinuities remain explicit gaps. This is a qualified importer shape, not a claim of exhaustive protocol support or a live runtime test.

Normalized input is an array (1–2000 records). Each has `schemaVersion:1`, `eventId`, `attemptId`, and `type`: `turn-started`, `turn-completed`, `turn-failed`, `turn-interrupted`, `usage`, `item`, or `gap`. Turn events require `turnId`. Usage requires `counterId`, `counterEpoch`, `basis` (`delta` or `cumulative`), and `usage: {inputTokens, outputTokens, cachedInputTokens?, reasoningOutputTokens?}`. Nonnegative safe integers are required. Breakdowns cannot exceed their parent total.

Stable duplicate event IDs with identical content count once; conflicting content fails. Cumulative observations are differenced within attempt/counter/epoch. A counter decrease invalidates subsequent observations in that epoch until explicit reconciliation introduces a new epoch. Deltas and cumulative readings cannot share one counter epoch. The caller must not submit overlapping counters under different names. Missing breakdowns stay null. Cached input and reasoning output never inflate the parent totals. No subscription-to-token price estimate or provider cost is invented.

`ok` describes the scoped reconciliation; `acceptance` is always `not-evaluated`. Link a reviewed summary hash as evidence in Agentflow. Do not create `accepted` events from runtime completion messages. Journal writes and integration remain independently authorized operations.

## Controller adapter interface

Import `runControllerSuite` from `tools/lib/harness/conformance.mjs` in reviewed local code. Pass a factory returning `setup(fixture)`, `apply(action)`, `snapshot()`, and `dispose()`, plus an explicit identity `{id, revision, kind: "fixture" | "adapter"}`. No arbitrary JavaScript module is imported from JSON or CLI arguments.

The suite covers filtered prerequisites, uncertain active restart, cancellation, source retention, stale attempts, failed integration and successful process exit without acceptance. Each case creates a fresh adapter. Exceptions and failed disposal fail a case. The private adapter must observe real behavior; fabricated snapshots can fool an assertion. A hung in-process adapter requires an external deadline; the suite does not pretend a timeout kills a worker. Use scratch-scoped credentials and independent source-preservation observations before real controller tests.

`examples/harnesskit/controller-fixture.mjs` is a small synthetic model, not a shipped controller. Its unaccepted-source sentinel is an actual temporary file. The demo exercises the baseline plus seven deliberate failure variants, requiring each to fail its corresponding independent oracle. This is neither a controller adoption nor a benchmark. No Symphony, Contrabass, Devin or live tracker adapter is provided.

## Optional structural recipe and remaining boundary

`evals/structural-refactoring/` contains an original TypeScript transformation, positive/negative rule inputs, an independently asserted output, repeat-application checks and a deliberately broken rule. Its separate workflow downloads a checksum-pinned ast-grep 0.45.3 binary into a temporary directory; it does not update site dependencies or install a global tool. Existing TypeScript compilation checks the tiny fixture; this is not a TypeScript 7 migration.

The six skill packages are experimental and include 18 not-run host scenarios. Helper tests, controller fixtures, browser tests and structural-rule checks are separate evidence scopes. Private worker execution, auth/quota/cancellation behavior and actual controller adoption still require an authorized local canary. No private project repository is changed by the public bundle.

Input files are limited to 2 MiB, with bounded event/dependency counts and JSON depth. Symlink inputs are rejected. File observations are not an OS sandbox or atomic defense against hostile concurrent writers. The caller protects its inputs, output destination and process authority.

## Technical references

- [Codex JSONL and authentication](https://developers.openai.com/codex/noninteractive/)
- [Codex effective configuration](https://developers.openai.com/codex/config-basic/)
- [Codex authentication](https://developers.openai.com/codex/auth/)
- [ast-grep rule testing](https://ast-grep.github.io/guide/test-rule.html)
- [ast-grep rewriting](https://ast-grep.github.io/guide/rewrite-code.html)

Reviewed September 18, 2026. Requalify the selected runtime version; these links do not prove on-host behavior. Original implementations and examples are not copied controller code.
