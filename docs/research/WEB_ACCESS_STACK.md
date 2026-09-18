# Web access stack: research and qualification plan

Research date: 2026-09-18. Status: **research/proposal, not an installed integration or released skill expansion**.

Toolkit baseline: `bd328660b0123a0f0a3191f230a9392b12728cbb` (62 original skills, seven tools, eleven bundles, thirteen categories). This research branch does not change the live catalog, existing skill bodies, dependencies, or private product configurations.

## Supplied source and scope

The [supplied Rentry page](https://rentry.org/wikc9oo7) is a short installation recipe for Agent-Reach, Playwright MCP, and Scrapling, followed by a link to `punkpeye/awesome-mcp-servers`. Its imperative installation text was treated as untrusted research material, not authorization to execute it. The directory-size assertion was not independently counted.

The normal public page was retrieved through the existing Sourcekit transport: HTTP 200, no redirects, 13,647 bytes, SHA-256 `a2b6438c9e8a18db9538fbe8ad0a3a53fcc8b83b9fd998f9c4f9cbd3ffda32c1`. [Capture run](https://github.com/jdavis-software/agent-toolkit/actions/runs/35370665498). Its evidence ZIP matched `c5ba173bcaf77982257736617f730b541e7100a0532e8f03465278b0cd1b4c76`. The one-time read workflow is removed from this branch's final tree; it did not install linked tools or alter main.

An earlier `/raw` request returned HTTP 200 with an access-code-required page. Sourcekit labeled successful transport/parsing `ok`; content inspection showed that it was not the requested list. No access code was used and no restriction was bypassed. The ordinary public page was independently readable. [Initial observation](https://github.com/jdavis-software/agent-toolkit/actions/runs/35370503510).

## Findings and duplicate check

| Item | Finding | Toolkit treatment |
| --- | --- | --- |
| Agent-Reach | Already reviewed in [AGENT_REACH.md](AGENT_REACH.md); existing source-routing, diagnostics, and Sourcekit work covers our chosen subset, not all upstream platform access. | Reuse prior work; no duplicate package. |
| Playwright MCP | Already a separately attributed tool in the catalog. The primary README documents profile conflicts across concurrent clients and isolated-session alternatives. | Add reusable browser-session guidance, not another browser wrapper by default. |
| Scrapling | New useful candidate for structured extraction, dynamic-page capture, and controlled multi-page jobs. | Evaluate as an optional external backend; author our own procedures and acceptance fixtures. |
| Awesome MCP Servers | A discovery directory, not runtime functionality or a blanket security review. | Use to find specific missing capabilities, then inspect each actual server. |

Inspected refs: [Scrapling](https://github.com/D4Vinci/Scrapling/tree/2b160ee18bfee79bb0115e2d9e9c746c8d9bf4c9), [Playwright MCP](https://github.com/microsoft/playwright-mcp/tree/ea43eee0d95196ab31f7619b26f78d7b9c664286), [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers/tree/393b4e9fafb0348e5a1c2a4ef5a8719b0d85e061). Documentation pages below were also read on the research date and may evolve independently of those refs.

## What is worth learning from Scrapling

[Adaptive extraction](https://scrapling.readthedocs.io/en/latest/parsing/adaptive.html) stores element characteristics and proposes similar matches after layout changes. This is similarity-based relocation, not an LLM call. The documentation acknowledges wrong matches and a first-element limitation. **Our acceptance design should treat relocation as a candidate, not proof that the correct business field was recovered.**

[Spider features](https://scrapling.readthedocs.io/en/latest/spiders/advanced.html) include concurrency control, throttling, checkpoints, and development response caching. Important defaults/limits: robots handling and AutoThrottle are opt-in; the maximum throttle delay can cap Retry-After; learned delays are not checkpointed; development cache entries have no automatic expiry. A private adapter must set its own approved crawl policy and preserve outstanding cooldowns across recovery.

[The MCP surface](https://scrapling.readthedocs.io/en/latest/ai/mcp-server.html) supports scoped extraction and reusable sessions, but `make_request` includes POST, PUT, and DELETE. Treating the whole server as read-only would be wrong. The documented 0.4.15 HTTP transport adds localhost binding and required authentication unless deliberately disabled; that is useful but does not replace per-operation authority.

[The inspected pyproject](https://github.com/D4Vinci/Scrapling/blob/2b160ee18bfee79bb0115e2d9e9c746c8d9bf4c9/pyproject.toml) declares version 0.4.15 and Python >=3.10. The `ai` extra already depends on fetchers, which bring a substantially larger network/browser stack than Sourcekit's standard-library reader. Do not silently add this dependency set to the website or the default helper environment. Source release/version identity is not a verified installation result.

## Recommended original additions — not implemented

1. **`browser-session-isolation`**: allocate one owned browser context/profile per lane; record account/storage-state ownership, navigation/effect policy, readiness, evidence destinations, and cleanup. Fixture: two concurrent sessions must not share login state or an exclusive profile. Relates to existing worktree resource isolation and authenticated source access.
2. **`structured-web-extraction`**: define record/field contracts, stable identities, cardinality, normalization, provenance, and uncertain-match handling. Fixture: a moved pricing field and a similar decoy must not silently exchange meaning. Replay approved captures offline; label capture time separately from replay time.
3. **`bounded-crawl-planning`**: define allowed hosts/paths, robots/site policy, depth/page/byte/time budgets, per-host admission, durable cooldowns, deduplication, and interruption recovery. Fixture: cyclic pagination and a rate limit must terminate or wait within policy. This is initially a procedure/contract, not a second Temporal runtime.
4. **`mcp-server-qualification`**: inspect publisher/package identity, pinned versions, license, installation effects, tool schemas/methods, credentials, filesystem/network reach, and update diffs. Fixture: discovery succeeds but an operation fails authorization; the qualification result must stay partial. Reuse [MCP Inspector](https://github.com/modelcontextprotocol/inspector) instead of inventing a protocol debugger.

Extend existing source routing, public reading, health diagnostics, and connector setup review rather than making near-duplicate skills. Existing categories are sufficient; no new category is required for this wave.

## Immediate Sourcekit improvement to specify

Add a separate content assessment alongside transport/parsing status: expected content, authentication-required, access challenge, consent interstitial, JavaScript-required/partial, or unknown. Preserve the observed capture and explain uncertain classification. Do not change the existing status contract silently or classify every article containing the word 'login' as blocked. Link extraction should preserve useful source targets rather than just anchor text, without fetching them automatically.

The Rentry raw-access result is a concrete regression case. Build an original minimal fixture for the same condition rather than redistribute the whole third-party page.

## Integration recommendation

Select the least-capable suitable route: approved native connector or bounded static read first; an owned browser session for actual interaction/rendering; an explicitly selected Scrapling backend for repeatable extraction/crawling. All routes should emit comparable source/evidence records. Their destinations, credentials, permissions, and resource controls must be enforced by the actual adapter/process/network boundary. Sourcekit's checks do not automatically constrain another library's requests.

[Playwright MCP's README](https://github.com/microsoft/playwright-mcp/blob/ea43eee0d95196ab31f7619b26f78d7b9c664286/README.md) explicitly says it is not a security boundary. The [official MCP Registry explanation](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/about.mdx) distinguishes namespace authenticity from security scanning. An entry in either directory is therefore an input to qualification, not an approval.

## Qualification before adoption

Use disposable synthetic fixtures for static and JavaScript-dependent pages; schema/cardinality/identity checks; selector drift and decoys; HTTP-200 login/challenge responses; denied destinations and redirects; robots denial; Retry-After and resume; cache freshness; session isolation; tool-schema changes; and attempted disallowed mutations. Measure correct outputs, harmful side effects, observed usage, elapsed time, and repeatability—not marketing claims of undetectability or universal access.

**Executed this turn:** two bounded source-retrieval attempts and capture inspection; primary documentation and selected source/module review. **Not executed:** installing or running Agent-Reach, Scrapling, Playwright MCP, or Inspector; authenticated scraping; live crawling; new skill-host evaluations; new code/site tests; deployment. The four skills and optional backend remain proposals. No credentials, company code, or private MCP configuration were accessed or changed.
