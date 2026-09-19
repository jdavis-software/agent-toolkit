# Explicit local Codex/GitHub observations

This adapter connects the existing Harnesskit profile/readiness checks to real
local Codex app-server and exact GitHub issue reads through `gh`. It is a small
probe, not a controller, worker launcher, OAuth proxy, or authority database.
Running `--help`, imports and repository tests do not contact accounts or models.

```sh
node tools/local-adapter.mjs --help
node tools/local-adapter.mjs probe /absolute/private-config.json
```

## Private bindings

Keep configuration and receipts outside this public checkout and the observed
worktree. The JSON object has `schemaVersion:1` and explicit absolute paths:
`codeRoot`, `codexExecutable`, `profilePath`; optionally `ghExecutable`, `taskPath`,
`acceptanceRoot`, `skillRoot`, `expectedSkills`, `expectedPlanType`, and
`expectedAccountSha256`. No arbitrary command or RPC method can be supplied.
The expected profile and task use the existing `HARNESSKIT.md` schemas.

The expected profile should require the desired `authMode`, actual approved
runtime version/executable hash, and relevant source state. Unsupported observed
fields stay unknown rather than being manufactured from configuration. The
executable hash covers the resolved entry point, not every transitive runtime file.
`expectedPlanType: "pro"` checks the returned plan when that is the intended plan.
The optional account binding is SHA-256 of the expected exact account email;
compute and retain it privately. No account email or token is returned in reports.
Without this binding the report explicitly says `not-configured`.

`expectedSkills` is an array of `{name,path,sha256}` referencing the actual staged
`SKILL.md` files. `skillRoot` may name the staged `skills/` directory. The probe
uses `skills/list` extra roots, verifies enabled discovery, exact paths and bytes,
and rejects duplicates. It does not alter global discovery settings. Merely
listing a skill does not establish model invocation or improved engineering.

Only `initialize`, `initialized`, `account/read` with token refresh disabled, and
`skills/list` are issued. No thread or model turn is started. Existing API-key
environment overrides block this subscription-only path. Child tracker-token
environment variables are removed; normal local Codex credential management is
preserved. Probe responses/errors are reduced to bounded, non-secret summaries.
The probe starts/stops only its own bounded subprocess. A trusted executable can
still have effects of its own; the adapter is not an OS sandbox.

## Real readiness, not a label shortcut

The optional task uses full `owner/repo#number` identity and separates task/code
repositories. The adapter checks the code root's origin and base, then reads each
prerequisite individually, even when it is outside the `agent-ready` candidate
filter. Unavailable dependencies remain unknown. Open or merely closed issues
are never independently accepted by this probe.

A prerequisite can become an accepted observation only when it is closed with a
completed reason and a matching record exists in the **private trusted acceptance
store**. Name that record `sha256(full-task-id).json`. Its fields are
`schemaVersion`, `taskId`, `codeRepository`, `verdict: "accepted"`,
`contractRevision`, `candidateRevision`, `evidenceFile` (a basename), and
`acceptanceEvidenceSha256`. The referenced evidence bytes must hash correctly.
A hash is integrity, not an authenticated reviewer: the consumer must protect
this store from implementation workers and issue it only after independent
combined-candidate acceptance. Cross-project evidence needs a separately qualified
binding; do not weaken this single-code-repository adapter to assume equivalence.

The CLI cannot know the chosen controller's atomic ownership state and returns
**unknown ownership**, hence blocked readiness when a task is supplied. An actual
controller can import `probeLocal(config, {ownership})`, providing a trusted
function that observes its own current ownership. This is still not a reservation:
recheck/claim at dispatch. The callback is reviewed code, never a JSON command.
No labels, assignees, issues, branches or source files are changed by the probe.

## Evidence scopes and the real-host smoke

Fixture tests exercise a real local subprocess speaking a synthetic protocol,
exact-issue lookup logic, redaction, source bindings, and failure cases. They are
not authenticated Codex/GitHub tests. GitHub Actions may qualify actual gopls,
Nx, ast-grep and oasdiff binaries against scratch fixtures; that does not qualify
another machine, MCP configuration, or product repository.

On an authorized Codex host, use the existing controller and two owned worktrees:
verify staged skill discovery, explicitly invoke the selected skill on a harmless
bounded task, record its output, cancel a second task while retaining dirty source,
and independently validate the combined candidate. Preserve runtime, task,
attempt, source and check identities with the existing helpers. Mark invocation,
two-lane runtime isolation, cancellation retention and integration separately.
These remain NOT RUN until actual host evidence exists. No API key or additional
paid service is needed for the intended ChatGPT-authenticated Codex path.

Primary interfaces: [Codex app-server](https://developers.openai.com/codex/app-server/),
[local skill discovery](https://developers.openai.com/codex/skills/),
[GitHub issue API](https://docs.github.com/en/rest/issues/issues#get-an-issue).
Pin and requalify the actual installed interface rather than assuming a moving
upstream document proves compatibility.
