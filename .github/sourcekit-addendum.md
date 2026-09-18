## Version 0.2: capture success is not content success

Document `read` and `parse` results add **`contentAssessment`** alongside the existing `status`. The capture status and normalized-content digest are unchanged by default. The tool version is 0.2.0; the packet schema remains 1. Existing callers must tolerate the additive field or update their schema. Known legacy hard challenge rejections still return their original blocked result.

`assess FILE --format html|text` produces a standalone local assessment, even for recognized challenge markup. It reads one bounded local capture and does not fetch its source or invoke another tool. The assessment binds the raw input and declared expectations through hashes. Its states are `unknown`, `expected-content`, `authentication-required`, `access-challenge`, `consent-interstitial`, and `partial-js-required`.

Without declared expectations, a normal page is **unknown**, not certified healthy. Use up to ten `--expect-text` literal markers and/or one exact `--expect-title` (whitespace/case normalized, not regular expressions). Markers are caller-owned expectations, not instructions to be inferred from the page. Recognized gates take priority even when markers match. Titles are only available in HTML captures.

`--require-content` requires an expectation and exits **3** unless the state is `expected-content`. It preserves the capture/assessment JSON so the caller can inspect why the content failed the gate. Exit 0 without this flag only means the requested operation completed; it is not content approval. Invalid input or existing transport/parser failures exit 2. Feed and transcript semantic checks remain with their dedicated parsers and are not accepted by these flags.

```bash
# Local synthetic gate: classification only, no network.
node tools/sourcekit.mjs assess examples/sourcekit/access-required.html --format html

# A deliberately strict real read; contacts only this explicitly allowed host.
node tools/sourcekit.mjs read https://jdavis-software.github.io/agent-toolkit/ \
  --allow-host jdavis-software.github.io --expect-text 'Toolkit Collection' --require-content

# Returns exit 3 and preserves evidence for the synthetic access interstitial.
node tools/sourcekit.mjs parse examples/sourcekit/access-required.html \
  --format html --source-url https://example.com/locked \
  --expect-text 'requested source' --require-content
```

These are bounded structural heuristics and literal checks, **not universal semantic or authentication detection**. The assessment ignores common script/template/hidden markup but does not compute CSS or execute JavaScript. It may miss unrecognized languages, disguises and application-specific gates. Ordinary article text mentioning login does not by itself trigger an authentication state. Even a matching page can contain prompt injection or misleading evidence. Business-level extraction needs an independent field contract.

### Optional link references

`--include-links` on an HTML read/parse adds `content.links`: up to 128 unique HTTP/HTTPS references, labels, rejection and omission counts. Relative links use the accepted source URL; HTML `base` is ignored and fragments are removed. Unsafe URL forms and common credential queries are omitted without copying their values. The existing URL filter is a guardrail, not a comprehensive secret scanner. Normalized content hashes include links only when requested.

Links are metadata: no DNS lookup, authorization, request, or recursion is performed. Source labels and arbitrary URL components may still contain sensitive data. Review before sharing. Invalid extractions never relax the public-reader host, redirect, IP or byte limits.
