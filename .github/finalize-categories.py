import json, re
from pathlib import Path
R=Path('.')
def edit(path, old, new):
 p=R/path; text=p.read_text()
 if old not in text: raise ValueError(f'Missing expected input in {path}: {old[:100]}')
 p.write_text(text.replace(old,new))
entries=json.loads((R/'catalog/entries.json').read_text())
assert len(entries)==60
new=[e for e in entries if e.get('scenarioPath') and e['id'] in {p.parent.name for p in (R/'skills').glob('*/SKILL.md') if 'Agentflow commands and boundaries' in p.read_text()}]
assert len(new)==18
for e in new:e['companionTools']=['agentflow']
(R/'catalog/entries.json').write_text(json.dumps(entries,indent=2,ensure_ascii=False)+'\n')
p=R/'package.json'; doc=json.loads(p.read_text());doc['scripts']['test']='node --test tests/catalog.test.mjs tests/skillcheck.test.mjs tests/bundles.test.mjs tests/agentflow.test.mjs tests/categories.test.mjs';doc['scripts']['test:agentflow']='node --test tests/agentflow.test.mjs';doc['scripts']['demo:agentflow']='node examples/agentflow/demo.mjs';p.write_text(json.dumps(doc,indent=2)+'\n')
edit('tools/lib/bundles.mjs', "  const paths=['catalog/bundles.json','catalog/entries.json'];", "  const paths=['catalog/bundles.json','catalog/entries.json'];\n  const catalog=JSON.parse((await bytesAt(root,'catalog/entries.json')).toString('utf8'));\n  if(b.skills.some(id=>catalog.find(e=>e.id===id)?.companionTools?.includes('agentflow'))) paths.push('tools/agentflow.mjs','tools/lib/agentflow.mjs','tools/lib/contracts.mjs','docs/AGENTFLOW.md');")
edit('scripts/catalog.mjs', "    ids.add(e.id);", "    ids.add(e.id);\n    if(e.companionTools!==undefined && (!Array.isArray(e.companionTools)||e.companionTools.some(id=>id!=='agentflow')||new Set(e.companionTools).size!==e.companionTools.length))throw new Error(`Invalid companion tools: ${e.id}`);")
edit('scripts/validate.mjs', "import { syncReadme }", "import { loadCategories } from './categories.mjs';\nimport { syncReadme }")
edit('scripts/validate.mjs', "  await syncReadme();", "  const categories=await loadCategories();\n  await syncReadme();\n  console.log(`Category registry valid: ${categories.length} primary categories.`);")
edit('src/layouts/Base.astro', "import '../styles/bundles.css';", "import '../styles/bundles.css';\nimport '../styles/categories.css';")
edit('src/layouts/Base.astro', "['Skills','Tools','Bundles','Workflows','About']", "['Categories','Skills','Tools','Bundles','Workflows','About']")
edit('src/components/CatalogPage.astro', "interface Props { kind?: string; title?: string; description?: string; home?: boolean; }", "interface Props { kind?: string; title?: string; description?: string; home?: boolean; categoryId?: string; }")
edit('src/components/CatalogPage.astro', "description, home = false }", "description, home = false, categoryId }" )
edit('src/components/CatalogPage.astro', "const entries = kind === 'all' ? all : all.filter(e => e.kind === kind);", "const entries = all.filter(e => (kind === 'all' || e.kind === kind) && (!categoryId || e.categoryId === categoryId));")
edit('src/components/CatalogPage.astro', "const active = kind === 'all'", "const active = categoryId ? 'categories' : kind === 'all'")
edit('src/components/CatalogPage.astro', "active={active}>", "active={active} description={description}>")
edit('src/components/CatalogPage.astro', '<section class="page-heading"><h1>', '<section class="page-heading">{categoryId && <a class="back-link category-return" href={withBase("categories/")}>← All categories</a>}<h1>')
edit('src/components/CatalogPage.astro', '<p class="filter-heading">CATEGORIES</p>', '<p class="filter-heading">TOPICS</p><a class="topic-directory" href={withBase("categories/")}>Browse category directory →</a>')
edit('src/components/CatalogPage.astro', '<a class="text-link" href={withBase(\'workflows/\')}>See the workflow', '<a class="text-link" href={withBase(\'categories/\')}>Browse categories')
edit('src/pages/sitemap.xml.ts', "import type { APIRoute }", "import { loadCategories } from '../../scripts/categories.mjs';\nimport type { APIRoute }")
edit('src/pages/sitemap.xml.ts', "const paths = ['',", "const categoryPaths=(await loadCategories()).map(c=>`categories/${c.id}/`);\n  const paths = ['categories/', ...categoryPaths, '',")
edit('playwright.config.ts', "testMatch: ['**/site.spec.ts', '**/publication.spec.ts']", "testMatch: ['**/site.spec.ts', '**/publication.spec.ts', '**/categories.spec.ts']")
for f in ['tests/site.spec.ts','tests/catalog.test.mjs','tests/bundles.test.mjs']:
 p=R/f;t=p.read_text()
 for a,b in [('41','60'),('36','54')]:t=re.sub(r'\b'+a+r'\b',b,t)
 t=t.replace("38)","57)").replace("38 original","57 original")
 if f.endswith('site.spec.ts'):t=t.replace('toHaveCount(5)','toHaveCount(6)').replace('toHaveCount(8)','toHaveCount(10)').replace('toHaveLength(8)','toHaveLength(10)')
 if f.endswith('catalog.test.mjs'):t=t.replace("['skillcheck','bundle-resolver']","['skillcheck','bundle-resolver','agentflow']")
 if f.endswith('bundles.test.mjs'):t=t.replace('eight bundles','ten bundles').replace('90 new scenario','144 new scenario').replace('{bundles:8,skills:54,scenarioInputs:90}','{bundles:10,skills:54,scenarioInputs:144}').replace('.bundles.length,8)', '.bundles.length,10)')
 p.write_text(t)
edit('tests/publication.spec.ts', '    bundles: bundles.length,', "    bundles: bundles.length,\n    categories: (await (await request.get(base+'categories.json')).json()).categories.length,")
edit('tests/site.spec.ts', "for(const id of ['skillcheck','bundle-resolver'])", "for(const id of ['skillcheck','bundle-resolver','agentflow'])")
edit('.github/workflows/deploy-pages.yml', "{'entries':41,'skills':36,'tools':5,'bundles':8}", "{'entries':60,'skills':54,'tools':6,'bundles':10,'categories':12}")
edit('.github/workflows/deploy-pages.yml', 'len(entries)==41 and len(bundles)==8', 'len(entries)==60 and len(bundles)==10')
edit('.github/workflows/deploy-pages.yml', "])==36", "])==54")
edit('.github/workflows/deploy-pages.yml', "))==36", "))==54")
edit('.github/workflows/deploy-pages.yml', "                  for path,needle", "                  categories=json.loads(get('categories.json'))['categories']\n                  assert len(categories)==12 and sum(c['counts']['entries'] for c in categories)==60\n                  assert len({i for c in categories for i in c['entryIds']})==60\n                  for path,needle")
edit('.github/workflows/deploy-pages.yml', "('tools/bundle-resolver/','Bundle Resolver')", "('tools/bundle-resolver/','Bundle Resolver'),('categories/','Explore by category'),('categories/agent-orchestration/','Agent Orchestration'),('tools/agentflow/','Agentflow'),('skills/orchestration-resume/','Orchestration Resume')")
def task(id,depends,phase):return {'id':id,'goal':'Produce the synthetic '+id+' fixture','owns':[id+'/'],'dependsOn':depends,'checks':[{'id':id+'-check','argv':['node','--version']}],'acceptance':[{'id':id+'-criterion','expect':'Synthetic expected artifact is present','checkIds':[id+'-check']}],'inputDigest':('a' if id=='api' else 'b' if id=='ui' else 'c')*64,'capabilities':['edit' if phase=='implementation' else 'review'],'effects':['local-write'],'phase':phase,'tokenBudget':100,'maxAttempts':2,'resources':{'cpu':1},'requiresApproval':False}
plan={'schemaVersion':1,'runId':'synthetic-example','policy':{'maxConcurrent':3,'reservedReviewSlots':1,'maxTokens':1000,'allowedEffects':['read','local-write'],'resources':{'cpu':3}},'tasks':[task('api',[],'implementation'),task('ui',[],'implementation'),task('review',['api','ui'],'verification')]}
registry={'schemaVersion':1,'validUntil':'2099-01-01T00:00:00Z','workers':[{'id':'fixture-editor','capabilities':['edit'],'effects':['local-write'],'phases':['implementation'],'capacity':2,'available':True,'rank':1},{'id':'fixture-reviewer','capabilities':['review'],'effects':['local-write'],'phases':['verification','integration'],'capacity':1,'available':True,'rank':1}],'approvals':[]}
for filename,obj in [('plan.json',plan),('capabilities.json',registry)]:(R/'examples/agentflow'/filename).write_text(json.dumps(obj,indent=2)+'\n')
p=R/'README.md'; text=p.read_text(); start='<!-- skill-index:start -->';end='<!-- skill-index:end -->'
rows=[]
for e in entries:
 if e['kind']!='skill':continue
 body=(R/e['sourcePath']).read_text();title=re.search(r'^# (.+)$',body,re.M).group(1).replace('|','\\|');rows.append(f"| [{title}]({e['sourcePath']}) | {e['category']} |")
text=text[:text.index(start)+len(start)]+'\n\n| Skill | Area |\n| --- | --- |\n'+'\n'.join(rows)+'\n\n'+text[text.index(end):]
text=text.replace('## The skill collection', '## Categories and orchestration\n\nBrowse [12 categories](https://jdavis-software.github.io/agent-toolkit/categories/) covering 54 skills and 6 tools. Ten overlapping bundles compose canonical packages. [Agentflow](docs/AGENTFLOW.md) supplies offline scheduling, run-record checks, and artifact-aware resume proposals; it does not launch agents or call models.\n\n## The skill collection')
p.write_text(text)
p=R/'AGENTS.md';p.write_text(p.read_text()+'\n## Category and orchestration contracts\n`catalog/categories.json` owns primary category metadata; each entry has exactly one `categoryId`. Counts are derived. Fine-grained `category` topics and overlapping bundles remain distinct. `tools/agentflow.mjs` and `tools/lib/agentflow.mjs` provide offline coordination only. Use explicit private adapters for actual workers and authority. Keep `companionTools` and resolved package files aligned. Agentflow tests and synthetic scenarios do not establish agent-host effectiveness.\n')
print('Integrated categories, Agentflow, samples, checks and publication metadata')
