# Publicationcheck

Original read-only checks for the Research to Delivery bundle. Python 3.10+ standard library; the optional Node wrapper requires the existing supported Node version. Filesystem and media process handling are qualified on Linux, not Windows. No package manager installation, model API, account connection, renderer or MCP service is required.

## What it does

| Command | What is actually checked | What it cannot establish |
| --- | --- | --- |
| `research` | Explicit half-open time interval; supplied event grouping; source/capture SHA-256; exact excerpts; unknown dates and coverage. | Independent discovery, authentic event dates, semantic claim support, actual source independence. |
| `debt` | Evidence identity, excerpt presence, finding classification and declared reproduction status. | Scanning a repository, reproducing a bug, ranking business impact automatically. |
| `storyboard` | Frame-based primary timeline; caption bounds; referenced assets; declared rights state and product-claim presentation. | Authentic permission, real product capability, legal clearance or authorization to render. |
| `explanation` | Node/edge integrity, evidence hashes, exact excerpts, explicit assumptions and unsupported edges. | Truth of the relationship or legibility of its rendered diagram. |
| `site` | Actual static HTML title/description, canonical URLs, index directives, sitemap membership, local links/anchors and JSON-LD syntax. | HTTP headers, robots.txt at the host, external targets, structured-data eligibility, indexing, ranking or AI citations. |
| `media` | Actual local ffprobe metadata and FFmpeg decode; dimensions, average frame rate, duration, audio presence and unchanged input bytes. | Audible content, perceptual quality, color accuracy, caption sync, rights or all possible container behavior. |

**Exit status:** 0 means only the declared mechanical checks passed; 3 returns a useful `needs-review` JSON record; 2 indicates invalid input or an unavailable/failed probe. JSON remains on stdout. No result authorizes publishing, spending, installation or execution of an agent.

## Use from a full checkout

```bash
node tools/publicationcheck.mjs research examples/publicationcheck/research.json --root .
node tools/publicationcheck.mjs debt examples/publicationcheck/debt.json --root .
node tools/publicationcheck.mjs storyboard examples/publicationcheck/storyboard.json --root .
node tools/publicationcheck.mjs explanation examples/publicationcheck/explanation.json --root .
python3 examples/publicationcheck/demo.py
```

The `examples/publicationcheck/*.json` files are complete example contracts with synthetic evidence. Their observations are not customer interviews, audited production facts, real product screenshots, or a completed agent-host run. The companion inspects actual bytes at the explicit root and checks those against the supplied hashes. It does not fetch URLs or trust the record merely because it contains an assessment label.

### Record rules

Every record has `schemaVersion: 1`, with explicit required keys. Unknown root/object keys, duplicate JSON keys, nonfinite numbers, oversized/deep inputs, duplicate identities, unknown references, path traversal and symlinked evidence fail. Selected evidence is regular UTF-8 text: at most 2 MiB each, 16 MiB aggregate, 200 records. Source bodies and absolute root paths are not copied to the report. Hashes are consistency checks, not signatures; dishonest records and semantic false positives remain possible. Use an owned, quiescent input tree: this is not a race-proof sandbox or atomic snapshot.

Research records separately represent the requested window, observation cutoff, source publication time, underlying event time and inspected-source coverage. Event IDs and independence groups are caller-supplied decisions, not inferred by the code. Missing event dates remain uncertain. A claim marked supported still requires a nonempty exact excerpt from the captured bytes; exact inclusion does not prove that excerpt supports the claim.

Debt findings include a consequence, deliberate-tradeoff explanation, canonical repair target, check identifier/status and citations. `actionCandidate` is a structured suggestion, not an accepted work item. It is never inferred from file size or complexity.

Storyboards describe one ordered primary timeline, not a general multi-track compositor. Times are integer frame boundaries. Captions may leave gaps but may not overlap or exceed the declared duration. A claim presented as available needs the declared implemented state. Asset approval is a caller-supplied condition, not proof of ownership or consent. No visual/audio assets are generated.

Explanation records are bounded to 40 nodes and 100 edges. Relationships labeled assumptions remain visible and produce `needs-review`. A visible text narrative and rendered browser inspection remain separate obligations. The website example uses ordinary escaped Astro text and simple CSS rather than a copied renderer or a new diagram engine.

## Audit the actual static artifact

After the normal production build:

```bash
node tools/publicationcheck.mjs site \
  --root dist --base https://jdavis-software.github.io/agent-toolkit/
```

The static audit reads no more than 500 indexable HTML pages, 2 MiB per file and 32 MiB aggregate. The supplied base is the full HTTPS deployment prefix. Canonicals must match the intended individual route. An unexpected `<base>` element is flagged. Sitemap `urlset` membership must match the inspected HTML routes; `404.html` is explicitly excluded. The first implementation does not follow sitemap indexes or redirects. External links and other projects on the same origin are not fetched. JSON-LD checking covers syntax only; semantic and visibility rules need independent review.

The report binds its observations to hashes of the inspected HTML and sitemap. It does not invoke a browser; HTTP and interactive checks remain separate. This is a useful publishing check, not an SEO score or an assurance of search-engine visibility.

## Optional media verification

Use trusted, short owned local inputs and a reviewed FFmpeg/ffprobe installation. No binaries are installed by this command. The implemented path accepts single-file MP4/MOV/MKV/WebM, one video stream, at most two audio streams, up to 32 MiB and 120 seconds. It restricts input protocols/demuxers, uses explicit argument arrays without a shell, caps process output at 1 MiB, and enforces a 30-second deadline per process. Source bytes are hashed before/after and no media output is written. The caller's PATH selects the installed executables; this is not binary attestation or an OS filesystem/network sandbox. The file protocol can still reach files allowed to that process; use only trusted owned containers.

```bash
python3 tools/publicationcheck.py media result.mp4 \
  --root /path/to/owned/exports \
  --contract examples/publicationcheck/media.json

# Explicitly generate two tiny synthetic fixtures in a temporary directory.
python3 examples/publicationcheck/media-smoke.py
```

The smoke test creates a two-second 320×180 MPEG-4/AAC test clip and a video-only variant. It accepts matching metadata and decoding, rejects missing audio and a wrong duration requirement, and proves the checked input was not changed. It does not make a provider call, generate an avatar, download media, or perform perceptual/caption evaluation.

## Validation and independence

```bash
python3 -m unittest discover -s tests -p 'test_publicationcheck.py' -v
```

Tests include valid and deliberately misleading records, stale evidence, unknown dates, invalid relationships, unavailable product claims, denied asset state, time gaps/overlaps, malformed JSON, path/symlink/FIFO checks, and independent static-site failures. Mocked metadata checks are separate from the actual media smoke. The public example and canonical skill pages require the repository's desktop/mobile Playwright checks before publication.

External research supplied problem ideas, not implementation code or prose templates. These modules, records and fixtures are original to this collection. FFmpeg and the existing site tools remain external dependencies with their own identities and terms.
