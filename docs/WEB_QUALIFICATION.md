# Web access qualification

This wave implements four original procedures and Sourcekit content checks following the [Rentry-stack research](https://github.com/jdavis-software/agent-toolkit/blob/research/rentry-wikc9oo7/docs/research/WEB_ACCESS_STACK.md). It does not install that recipe wholesale or create another scraper service.

## Delivered boundaries

| Surface | Implemented | Not claimed |
| --- | --- | --- |
| Sourcekit content assessment | Local structural signals, literal expectation checks, input/expectation identity, opt-in strict exit behavior | Universal semantic correctness, authenticated access, prompt-injection prevention |
| Link references | Bounded, filtered HTML links with omission counts | Link discovery permission, DNS qualification or recursive fetching |
| Four skill packages | Session isolation, structured extraction, bounded crawl planning and MCP qualification procedures, examples and not-run scenarios | That an agent host has executed or followed them |
| Scrapling evaluation | A pinned optional parser environment and eight original capture fixtures | Browser, crawler, network, MCP or live-platform qualification |
| Browser fixture | Two fresh Playwright contexts are tested for cookie/localStorage separation | OS isolation, persistent-profile allocation or account-side isolation |

The optional parser example can reject a plausible field after a successful selector match. It is deliberately separate from the default Sourcekit package and does not alter the existing public-reader network policy.

## Acceptance rules

Keep capture `status`, `contentAssessment.state`, business extraction validation and authorization separate. A capture can succeed while a gate page is detected. A literal expectation can match while the extracted business value is wrong. A correctly extracted field may still be outside an account's authorized use. None of these layers may silently authorize the next.

The new skill scenario JSON files remain `not-run`. Executed Python tests, an optional parser run and browser fixtures are identified separately. This wave does not benchmark another toolkit or claim universal scraper reliability.

## Private integration

Public bundles reference the canonical skill files and Sourcekit modules. Private adapters bind repository/context roots, identity, approved operations and hosts, process/network limits, deadlines, evidence sinks and retention. They must enforce rules at the actual browser, HTTP or MCP execution boundary. An offline plan, directory entry, tool annotation or content hash is not that boundary.

Existing Agentflow coordination and Sourcekit evidence can be composed, but no automatic agent launch, monitoring task, crawl executor, credential exporter or internal MCP deployment is added. DriftGate and AvatarOps bindings remain outside this public repository.

## Validation commands

```bash
pnpm validate
pnpm test
pnpm check
pnpm build
pnpm test:site
python3 examples/sourcekit/assessment-demo.py
```

The pinned optional parser environment has its own [instructions](../evals/scrapling/README.md). Published instruction changes and category/count updates are checked through the existing Chromium desktop/mobile-emulation workflow. That is not physical-device or Safari certification. The post-deployment check verifies the exact public revision and expected inventory.
