# Optional Scrapling parser qualification

This is an explicitly opt-in, **local parser-only evaluation**, not a Sourcekit dependency, installed MCP server, browser adapter, or production crawler. The executable fixture and field-validation logic are original; Scrapling remains the external project by Karim Shoair.

## Reproduce

Use **Linux x86_64 and CPython 3.13** for the committed wheel-hash lock. Other platforms need a separately reviewed lock; do not disable hash checks or silently install browser extras to make this one fit.

```bash
python3.13 -m venv /tmp/toolkit-scrapling-eval
/tmp/toolkit-scrapling-eval/bin/python -m pip install --require-hashes --only-binary=:all: \
  -r evals/scrapling/requirements-linux-py313.lock
/tmp/toolkit-scrapling-eval/bin/python evals/scrapling/qualify.py
```

The install is an explicit network/dependency action inside this disposable environment. The subsequent evaluation uses synthetic HTML and a temporary adaptive-selection database. It registers an audit hook rejecting socket connections, DNS requests and process launching; that is fixture instrumentation, not an OS sandbox. The code makes no model, account, browser or source requests. It removes only its owned temporary selection database.

The lock was generated from downloaded wheels with actual package metadata and SHA-256 hashes, not invented versions. It pins Scrapling **0.4.15** and the parser's transitive dependency wheels. The isolation is intentional: the Astro dependency lock and Python-standard-library Sourcekit implementation do not gain these dependencies. The optional GitHub Actions workflow repeats this check only when its relevant files change or when explicitly dispatched.

## Independent acceptance contract

The fixture identifies a `studio` record, a `standard-monthly` field, USD and a monthly unit, with a bounded integer amount in minor units. Selector success does not satisfy this contract by itself. The fixture oracle knows which field and amount each page should produce; these are synthetic data, not real pricing.

The eight cases are baseline, changed layout, reused-selector decoy, similarity decoy, duplicate field, wrong currency, malformed value and missing field. A failed selection is not automatically an evaluation failure: rejected decoys and malformed values are the intended results. The script exits nonzero if any expected acceptance or rejection is wrong, and prints all outcomes and fixture hashes.

In the initial local run, the layout-change case recovered the intended field; both the exact-selector decoy and the adaptive decoy returned candidates, which the independent field checks rejected. This demonstrates why matching and correctness must be tested separately. Refer to the PR/CI artifact for execution evidence tied to the published revision rather than treating this description as a reusable certification.

## Not tested

No live targets, browser rendering, stealth features, crawler/session behavior, MCP transport, access control, throughput benchmark or agent-host performance is qualified by these eight tests. Field attributes alone are not universally trustworthy; an actual consumer must justify its own record semantics and acceptance source. Review the upstream [selection](https://scrapling.readthedocs.io/en/latest/parsing/selection.html) and [adaptive](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html) documentation for the installed version.
