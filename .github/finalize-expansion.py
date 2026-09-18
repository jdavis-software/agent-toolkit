"""One-time public catalog integration. No network access or external operations."""
import json
from pathlib import Path
root=Path('.')
p=root/'catalog/entries.json'
entries=json.loads(p.read_text())
assert len(entries)==39 and len([e for e in entries if e['kind']=='skill'])==36
assert not any(e['id'] in ('skillcheck','bundle-resolver') for e in entries)
tools=[]
for id,title,description,path,doc,outcome in [
 ('skillcheck','Skillcheck','Original local checks for task coordination, Git state, real command receipts, and report consistency.','tools/skillcheck.mjs','docs/SKILL_TOOLS.md','A validated plan, Git snapshot, command receipt, or consistency report with explicit limits.'),
 ('bundle-resolver','Bundle Resolver','Read-only skill selection and content fingerprints for reproducible bundle review and future private adapters.','tools/bundle.mjs','docs/BUNDLES.md','A deterministic file manifest with content hashes and separately reported Git provenance; no installation or execution.')
]:
 tools.append({'id':id,'title':title,'description':description,'kind':'tool','origin':'original','stage':'experimental','category':'MCP and bundles','sourcePath':path,'docsPath':doc,'requires':['Node >=22.12','Full toolkit checkout'],'outcome':outcome,'testedHosts':[],'evidence':[],'author':"Jordan's Agent Toolkit · AI-assisted",'note':'Original executable support. Tool tests do not establish agent-host effectiveness or a security boundary.'})
p.write_text(json.dumps(entries[:-3]+tools+entries[-3:],indent=2,ensure_ascii=False)+'\n')
readme=root/'README.md';text=readme.read_text();marker='## Skills with executable support'
assert text.count(marker)==1 and '<!-- skill-index:start -->' not in text
intro='''## The expanded skill collection

**36 original skills · 8 focused bundles · 2 original utilities · 3 selected external tools.**

Start with [TypeScript](https://jdavis-software.github.io/agent-toolkit/bundles/typescript/), [Go](https://jdavis-software.github.io/agent-toolkit/bundles/go-backend/), [contracts and data](https://jdavis-software.github.io/agent-toolkit/bundles/contracts-data/), [durable workflows](https://jdavis-software.github.io/agent-toolkit/bundles/durable-workflows/), [parallel engineering](https://jdavis-software.github.io/agent-toolkit/bundles/parallel-engineering/), [infrastructure](https://jdavis-software.github.io/agent-toolkit/bundles/infrastructure/), [media/provider pipelines](https://jdavis-software.github.io/agent-toolkit/bundles/media-integrations/), or [MCP tooling](https://jdavis-software.github.io/agent-toolkit/bundles/mcp-tooling/).

Each skill is maintained under `skills/`. Bundles reference canonical files; private adapters supply repository paths, commands, accepted contracts, and policies without forking the public instructions. TypeScript 7 qualification is covered without silently changing this Astro site's compiler dependency.

```bash
node tools/bundle.mjs list
node tools/bundle.mjs resolve typescript
node tools/bundle.mjs resolve mcp-tooling --require-clean
```

The resolver uses Node built-ins and prints selection/file hashes. It does not install skills, call models, run selected tools, or start an MCP server. See [bundle contracts](docs/BUNDLES.md), [private adapter design](docs/PRIVATE_ADAPTERS.md), and [coverage and evidence](docs/ENGINEERING_COVERAGE.md).

New domain packages contain synthetic trigger, boundary, and non-trigger scenarios. Those inputs are not completed agent-host runs; instruction effectiveness remains experimental.

<!-- skill-index:start -->
<!-- skill-index:end -->

'''
readme.write_text(text.replace(marker,intro+marker))
a=root/'AGENTS.md';text=a.read_text();anchor='## Personal collection and authoring'
assert text.count(anchor)==1
text=text.replace(anchor,"""## Bundles and project adapters
`catalog/bundles.json` selects canonical local skills. `tools/bundle.mjs` and `tools/lib/bundles.mjs` implement read-only resolution; they do not install or execute selected tools. Keep source identity and content-only resolution distinguishable. Keep private project bindings outside this public repository; follow `docs/PRIVATE_ADAPTERS.md`.

New domain skills include `references/scenarios.json` as not-run evaluation inputs. Run `node --test tests/bundles.test.mjs` for bundle/resolution tests. All local skills must appear in at least one focused bundle. Keep bundle selection, validation, site routes, and counts derived from canonical files. Use `node scripts/readme.mjs --write` to update the README index. Published instruction changes require browser verification as well as package checks.

"""+anchor);a.write_text(text)
p=root/'docs/ROADMAP.md';text=p.read_text();title,rest=text.split('\n',1)
p.write_text(title+'''\n
## Reusable engineering expansion

Implemented: 36 original skills, 8 overlapping bundles, and 5 catalogued tools (2 original, 3 external). The read-only resolver, source-linked bundle pages, JSON discovery endpoint, generated README index, and private-adapter boundary are documented and tested separately from agent-host effectiveness.

No private product MCP or configuration is installed by this change. The 30 domain packages add 90 not-run scenario inputs. Current execution/build/deployment evidence belongs in Actions, not invented historical success claims in this roadmap.

Next: evaluate selected packages in actual hosts, choose the original-content license, and implement private project bindings under separate approval. See [coverage](ENGINEERING_COVERAGE.md), [bundles](BUNDLES.md), and [private adapters](PRIVATE_ADAPTERS.md).
''' +rest)
