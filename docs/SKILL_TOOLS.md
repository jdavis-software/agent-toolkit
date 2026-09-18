# Skillcheck: executable support for the collection

Skillcheck supplies the mechanical checks that an instruction file cannot perform by itself: plan coordination, Git state collection, real process receipts, stale-result detection, and report consistency. The six skills still decide what the engineering task requires. Use the helper only where it saves repeated work or catches a real failure mode.

## Run it

A full toolkit checkout and Node >=22.12 are sufficient. Git is needed for snapshot, run, and verify. The helper uses only Node built-ins; it does not require the site's npm dependencies, a model API, a hosted service, or a new MCP server. Examples below run from the toolkit repository root.

```bash
node tools/skillcheck.mjs --help
node tools/skillcheck.mjs plan examples/skillcheck/plan.json
node tools/skillcheck.mjs report debug examples/skillcheck/debug.json
node tools/skillcheck.mjs report test-design examples/skillcheck/test-design.json
node tools/skillcheck.mjs report interface examples/skillcheck/interface.json
node examples/skillcheck/defect-demo.mjs
node --test tests/skillcheck.test.mjs
```

These sample records are explicitly hypothetical. A valid unresolved debugging record or partial interface review does not mean the work passed. Schema success and engineering success are different results.

## Task planning

A version 1 plan contains a `tasks` array. Each task declares `id`, `goal`, `owns`, `dependsOn`, `checks`, and `acceptance`. Optional `blockedBy` lists unresolved conditions. Up to 200 tasks are supported per packet; split larger plans.

```json
{
  "schemaVersion": 1,
  "tasks": [{
    "id": "search",
    "goal": "Return category matches as well as title matches",
    "owns": ["src/search/", "tests/search.test.mjs"],
    "dependsOn": [],
    "checks": [{"id": "search-test", "argv": ["node", "--test", "tests/search.test.mjs"]}],
    "acceptance": [{
      "id": "category-match",
      "expect": "A category-only query returns the matching entry",
      "checkIds": ["search-test"]
    }]
  }]
}
```

The checker rejects undeclared dependencies, cycles, conflicting unordered ownership, duplicate IDs, unsafe path declarations, and acceptance criteria without a declared check. Its `waves` output is a topological plan; explicit blockers propagate to dependent tasks. It neither executes commands nor verifies their existence, correctness, side effects, or available capacity.

Scopes are case-sensitive literal paths. A trailing slash means directory prefix; otherwise the value names an exact file. No globs, absolute paths, traversal, or `.git` ownership. Overlapping paths are allowed only for genuinely ordered tasks. Symlink targets, case-insensitive aliases, databases, ports, and cloud resources are not analyzed. Declaration checks do not enforce write permissions.

## Git snapshots and scope checks

```bash
node tools/skillcheck.mjs snapshot --repo ../target-repo --base BASE_REVISION \
  --scope src/search/ --scope tests/search.test.mjs
```

Use an actual agreed revision in place of `BASE_REVISION`. The helper reports the resolved HEAD, provided baseline, comparison merge-base, branch or detached state, and changes categorized as committed, staged, unstaged, or untracked. Rename source and destination paths are both considered. Add `--require-clean` for a final committed handoff; it is intentionally optional for in-progress work.

The operation is read-only. It does not fetch a remote, resolve conflicts, stage files, reset changes, or clean worktrees. Unsupported or oversized input fails explicitly rather than silently omitting files. Untracked symbolic links are hashed by their link text without reading the destination.

## Check receipts

Create an evidence directory **outside the target repository**, inspect the command and its permissions, then run a project-owned check:

```bash
mkdir -p ../evidence
node tools/skillcheck.mjs run --repo ../target-repo --id search-tests \
  --timeout-ms 60000 -- node --test tests/search.test.mjs > ../evidence/search-check.json
node tools/skillcheck.mjs verify ../evidence/search-check.json --repo ../target-repo
```

A receipt records the command array, actual exit code/signal, elapsed time, runtime, bounded stdout/stderr, hashes of each complete output stream, and before/after Git-visible fingerprints. Captured text is limited to 64 KiB per stream by default; `truncated` and byte counts make truncation explicit. Stream hashes are integrity aids, not authenticity guarantees. Output text can contain secrets; nothing is automatically redacted or published.

| Receipt status | Meaning |
| --- | --- |
| `passed` | The process exited zero and the measured Git-visible state did not change. |
| `failed` | The process exited nonzero or was signaled outside the runner's timeout. |
| `blocked` | The executable could not start. |
| `timed-out` | The deadline expired; this never counts as passing. |
| `invalidated` | The process exited zero but the measured state changed or could not be read afterward. |

A printed `PASS` cannot override exit 7. There is no implicit shell, so shell operators passed as arguments are literal. Explicitly invoking a shell is still possible and remains the caller's responsibility. Skipped checks belong in the human report; the runner never invents a passing receipt for them.

The timeout is bounded to 50–600000 ms. On POSIX the runner attempts to kill its own process group; on Windows it can only request termination of the direct child. Escaped descendants, OS restrictions, background side effects, and environment privileges are not contained. The helper is **not a sandbox, authorization service, or safe way to execute untrusted commands**. It inherits the caller's environment and permissions; inspect commands and use disposable environments.

### What the fingerprint covers—and does not

The fingerprint combines HEAD, Git status, staged and unstaged binary diffs, and nonignored untracked file contents. It detects edits after a check even when the commit SHA is unchanged. The collector is bounded to 10000 status records and 32 MiB of untracked input; Git subprocess output is also bounded. It rejects some concurrent changes, but is not an atomic filesystem snapshot.

Ignored inputs, Git-hidden changes such as assume-unchanged paths, external files, nested/submodule content beyond Git-visible reporting, tool binaries, environment variables, services, and cache contents are **not** completely covered. Matching fingerprints cannot establish hermeticity, fresh computation, or equivalent external state. Cache status is deliberately `unknown`. Use the consuming project's own environment, cache, dependency, and release safeguards where required.

`verify` checks internal receipt consistency and the current measured state. Anyone able to edit a local JSON file can forge a receipt. It does not authenticate a producer or establish that a command's assertions are correct. Protected CI and reviewed independent tests remain separate controls.

## Report contracts

`report debug` checks that a fixed conclusion has a failed original reproduction, supporting hypothesis experiment, passing rerun of the same named check, and regression evidence. An unresolved record is valid when uncertainty is represented honestly. The checker cannot decide whether a failure signature actually matches the bug.

`report test-design` requires declared requirements, case-to-requirement links, an independent expected-result source (`oracle`), arrange/action/assertion fields, and explicit prohibited effects. It catches uncovered requirements; it does not execute assertions or assess semantic quality.

`report interface` requires primary interaction, keyboard, layout, and console rows with an explicit status. Observed results need evidence references. A complete passing review cannot contain failed or untested checks. It does not run a browser or inspect screenshots.

Use the complete JSON examples in `examples/skillcheck/` as format references. Replace their synthetic observations with real data. Artifact references are strings and are not opened or authenticated by these validators.

## Process exit contract

All commands print JSON to stdout except help. Exit 0 means the requested mechanical check passed; exit 1 means a negative check result; exit 2 means invalid invocation or unavailable input. Diagnostics go to stderr. A structurally valid partial report exits zero while retaining its partial status; callers must inspect the relevant engineering conclusion.

Do not pipe through a display command and lose the original exit code. Save the receipt first, preserve the exit result, then inspect its contents. No helper installs packages, calls a model, changes remote repositories, or publishes artifacts on its own.
