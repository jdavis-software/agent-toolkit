# Sourcekit

An original, bounded source-intake utility for Jordan’s Agent Toolkit. It implements a small public reader and local evidence parsers, not a clone of Agent-Reach’s installation ecosystem or a universal web scraper.

## Implemented surface

| Command | Implemented behavior | Not implied |
| --- | --- | --- |
| `route URL --intent read` | Parse a public source identity and propose a source-specific path | Working platform access or installed adapters |
| `doctor` | Exercise local parsers and report optional command presence | Executable, network, authentication, or operation health |
| `read URL --allow-host HOST` | One authorized, bounded public HTTPS read; JSON evidence output | Crawling, JavaScript rendering, access-control bypass, or private-page access |
| `parse FILE --format html\|text\|feed\|transcript --source-url URL` | Parse one local capture with explicit provenance | Fetching that URL or authenticating caller-supplied metadata |
| `diff BEFORE AFTER` | Compare successful feed packets by stable item identity and hashes | A background subscription or evidence that absent items were deleted |

Use Python **3.10+**. The implementation uses only the Python standard library. `tools/sourcekit.mjs` is an optional Node wrapper around the same Python entry point. No pip/npm dependency is installed by a command. The full toolkit checkout is the supported distribution form.

```bash
# Offline discovery; no network, credential inspection, or optional CLI execution.
node tools/sourcekit.mjs doctor
node tools/sourcekit.mjs route 'https://www.youtube.com/watch?v=example' --intent transcript

# Explicit public network read. This makes a request to the named host.
node tools/sourcekit.mjs read https://example.com/ --allow-host example.com

# Local synthetic examples; source-url is metadata, not a network request.
node tools/sourcekit.mjs parse examples/sourcekit/feed-before.json \
  --format feed --source-url https://example.com/feed
node tools/sourcekit.mjs parse examples/sourcekit/captions.vtt \
  --format transcript --source-url 'https://www.youtube.com/watch?v=synthetic' \
  --language en --origin automatic-captions

# Executable offline demonstration and regression suite.
python3 examples/sourcekit/demo.py
python3 -m unittest discover -s tests -p test_sourcekit.py -v
```

To compare real feed captures, save packets to an owned private evidence directory and pass them to `diff`. Review content before sharing; output may include source text even when credentials are not accepted. Sourcekit writes results to stdout, never a credential store or agent configuration. Shell redirection is a separate caller-owned write.

## Data contract

Successful captures have `schemaVersion`, tool identity/version, kind, status, source metadata, content, evidence hashes, trust label, and limitations. `inputSha256` identifies captured bytes; `contentSha256` identifies normalized output. A live read includes its final URL, retrieval observation, MIME type, status, and redirect count. A local parse is explicitly `mode: local` and has no asserted retrieval timestamp. Publisher dates and transcript origin are source/caller claims, not independently validated facts.

Failures exit nonzero with a bounded `blocked` JSON object and a reason code. Authentication-required, access-denied, rate-limited, unsupported-content, malformed-input, and network failures remain distinct. Failure output excludes response bodies and does not intentionally echo credentials or local file paths. Argument-parser errors can repeat invalid option strings; never pass secrets as arguments. This is not a general redaction/DLP service.

## Public network policy

Reads require an exact lowercase allow-host list. Hostnames must be fully qualified, HTTPS-only, and credential-free on port 443. Numeric/ambiguous hosts, local/internal suffixes, encoded control characters, and common secret-bearing query keys are rejected. The query-key check is a guardrail, not proof that a URL contains no secret.

All DNS answers must be public unicast addresses under the supported IP policy. Mixed public/private answers fail. The connection uses the selected numeric address without resolving the hostname again, while TLS verifies the original hostname. Redirects repeat validation and must remain inside the explicitly listed hosts; at most three redirects are followed. Proxy environment variables, authorization headers, cookies, browser sessions, and remote rendering services are not used.

Response input is limited to **1 MiB**. Only supported UTF-8/ASCII text/feed types are accepted; compressed bodies, binary media, and unsupported encodings are rejected. Socket operations have a bounded request deadline. The system DNS resolver itself can block beyond that deadline: a private service wrapper must impose a process-level timeout and resource limits. Local files must be regular, bounded inputs with no observed symlink components; these checks are not an OS sandbox or an atomic defense against a malicious concurrent filesystem writer.

No recursive link discovery, automatic retries, robots fetching, or robots-policy evaluation is implemented. A service using the reader owns source authorization, site/crawler policy, scheduling, rate limits, and retention. One permitted host does not authorize every document or operation on that host.

## Representation limits

**HTML:** conservative static text extraction; no scripts, linked images, browser rendering, or main-article heuristics. A short set of clear challenge titles is rejected, but other login/challenge pages can look like normal content. Check semantic relevance before accepting evidence. Text can still contain prompt injection; it remains untrusted data.

**Feeds:** RSS 2, Atom, and JSON Feed 1/1.1. XML document types and entities are rejected; malformed/duplicate identities fail. Up to 200 items are emitted, with omitted counts and incomplete-window labels. HTTP/HTTPS item references may be retained as metadata; the network reader still only fetches HTTPS. Enclosures, pagination, and arbitrary XML extensions are not executed/fetched. `absentFromWindow` is never deletion evidence. A truncated new window does not produce absence claims.

**Captions:** a bounded WebVTT/SRT subset with explicit milliseconds, nondecreasing starts, positive durations, and preserved overlaps. WebVTT metadata blocks are ignored. No automatic download, speech recognition, translation, or visual analysis exists. Language and origin are caller-declared; speech text cannot prove on-screen behavior.

**Routing:** platform-family recognition covers GitHub, YouTube, Bilibili, X, Reddit, Facebook, Instagram, LinkedIn, Xiaohongshu, Boss, V2EX, Xueqiu, and Xiaoyuzhou. These are adapter suggestions, not native connector implementations or endorsements of a particular scraping backend. Generic search always requires a separately approved search connector.

## Private adapter contract

A private MCP adapter can expose bounded operations such as `sources.read_public`, `sources.parse_capture`, and `sources.compare_feed` by binding this tool. Those names are design examples, **not deployed MCP tools**. The adapter must derive account/tenant identity from trusted context; enforce host, operation, data-recipient, timeout, size, and effect policy; keep credentials outside public files; and record actual execution receipts. Authenticated platform access remains with approved platform-native or connected tools.

Sourcekit packets can be registered as artifacts in Agentflow or checked by an authorized Skillcheck runner. A packet digest is not a signed attestation, authentication proof, approval, or signal to execute source text.
