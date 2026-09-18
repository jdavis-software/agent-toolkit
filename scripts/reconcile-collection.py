from pathlib import Path
import json
r=Path(__file__).resolve().parent.parent
p=r/'catalog/entries.json';entries=json.loads(p.read_text())
new=[
 {'id':'evidence-first-debugging','kind':'skill','origin':'original','stage':'experimental','category':'Debugging','sourcePath':'skills/evidence-first-debugging/SKILL.md','requires':['A reported failure','Repository read access','An authorized reproduction environment'],'outcome':'A supported diagnosis, bounded repair, and evidence tied to the original reproduction.','testedHosts':[],'evidence':[],'author':"Jordan's Agent Toolkit · AI-assisted",'note':'New instructions and synthetic examples written for this collection. Evaluation scenarios are included; agent-host runs remain pending.'},
 {'id':'behavior-test-design','kind':'skill','origin':'original','stage':'experimental','category':'Testing','sourcePath':'skills/behavior-test-design/SKILL.md','requires':['An explicit behavior contract','Project-owned test runner and fixtures'],'outcome':'A requirement-linked case matrix and execution record that distinguishes meaningful failures from setup problems.','testedHosts':[],'evidence':[],'author':"Jordan's Agent Toolkit · AI-assisted",'note':'New instructions and synthetic examples written for this collection. Evaluation scenarios are included; agent-host runs remain pending.'},
 {'id':'interface-quality-review','kind':'skill','origin':'original','stage':'experimental','category':'Frontend','sourcePath':'skills/interface-quality-review/SKILL.md','requires':['A target user journey','A rendered interface','Authorized browser access for interaction checks'],'outcome':'Reproducible interface findings with desktop/mobile evidence, keyboard checks, and scoped repair verification.','testedHosts':[],'evidence':[],'author':"Jordan's Agent Toolkit · AI-assisted",'note':'New instructions and synthetic examples written for this collection. Evaluation scenarios are included; agent-host runs remain pending.'}
]
for e in new:
 e['why']=e['outcome']
 assert not any(x['id']==e['id'] for x in entries)
i=next(i for i,e in enumerate(entries) if e.get('listed') is False)
entries[i:i]=new
p.write_text(json.dumps(entries,indent=2,ensure_ascii=False)+'\n')
p=r/'README.md';s=p.read_text();rows=[]
for e in new:
 title=' '.join(w.title() for w in e['id'].split('-'))
 rows.append(f"| [{title}](https://jdavis-software.github.io/agent-toolkit/skills/{e['id']}/) | Jordan’s starters | Experimental starter |")
s=s.replace('\n\n<!-- collection:end -->','\n'+'\n'.join(rows)+'\n\n<!-- collection:end -->')
s=s.replace('## Using the collection','## Using the collection\n\nThe [task-to-handoff workflow](https://jdavis-software.github.io/agent-toolkit/workflows/task-to-handoff/) connects the six original starter skills. Community selections complement this workflow rather than replace it.')
p.write_text(s)
p=r/'scripts/catalog.mjs';s=p.read_text();s=s.replace('export async function loadSources() {', '/** @returns {Promise<Record<string, {title:string, repo:string, revision:string, author:string, archiveSha256:string, license:string, licensePath:string|null}>>} */\nexport async function loadSources() {');p.write_text(s)
p=r/'src/layouts/Base.astro';s=p.read_text();s=s.replace('<title>{title} · Jordan’s Agent Toolkit Collection</title>',"<title>{title === 'Jordan’s Agent Toolkit Collection' ? title : `${title} · Jordan’s Agent Toolkit Collection`}</title>");p.write_text(s)
p=r/'src/components/CatalogPage.astro';s=p.read_text().replace('    <section id="catalog"','    <slot />\n    <section id="catalog"');p.write_text(s)
p=r/'src/pages/workflows/index.astro';p.write_text('''---
import CatalogPage from '../../components/CatalogPage.astro';
import { withBase } from '../../lib/paths';
---
<CatalogPage kind="workflow" title="Engineering workflows" description="Community procedures for planning, debugging, testing, and working in isolated lanes. Choose what fits the task.">
  <p class="workflow-intro"><a class="button secondary" href={withBase('workflows/task-to-handoff/')}>Explore Jordan’s task-to-handoff workflow ↗</a></p>
</CatalogPage>
''')
p=r/'src/pages/sitemap.xml.ts';s=p.read_text().replace("'sources/',", "'sources/', 'workflows/task-to-handoff/',");p.write_text(s)
p=r/'tests/catalog.test.mjs';s=p.read_text().replace('length,22','length,25');s+='''
test('retains all six original skills and new scenario fixtures', async () => {
 assert.equal(entries.filter(e=>e.origin==='original').length,6);
 for(const id of ['evidence-first-debugging','behavior-test-design','interface-quality-review']) {
  const scenarios=await readFile(`skills/${id}/references/scenarios.md`,'utf8');
  assert.ok(scenarios.includes('Scenario') || scenarios.includes('scenario'));
 }
});
''';p.write_text(s)
p=r/'tests/site.spec.ts';s=p.read_text().replace('toHaveCount(22)','toHaveCount(25)').replace('Showing 22 of 22 entries','Showing 25 of 25 entries').replace('toHaveLength(22)','toHaveLength(25)');s=s.replace("selectOption('original');\n  await expect(page.locator('[data-entry]:visible')).toHaveCount(3);", "selectOption('original');\n  await expect(page.locator('[data-entry]:visible')).toHaveCount(6);");s+='''
test('preserves original additions and the task-to-handoff workflow',async({page,request})=>{
 for(const id of ['evidence-first-debugging','behavior-test-design','interface-quality-review']) {
  await page.goto(base+'skills/'+id+'/');
  await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',new RegExp('skills/'+id+'/SKILL.md$'));
 }
 await page.goto(base+'workflows/task-to-handoff/');
 await expect(page.locator('.prose a[href*="/skills/"]')).toHaveCount(6);
 for(const href of await page.locator('.prose a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!))) expect((await request.get(href)).status()).toBe(200);
});
''';p.write_text(s)
p=r/'AGENTS.md';s=p.read_text().replace('## Skills and licenses','## Original authoring\nFor original contributions, retain the task-first and attribution guidance in `docs/ORIGINAL_SKILLS.md`. Do not paraphrase upstream code or instructions merely to relabel them as original. Those authoring rules apply to original work; community source snapshots are explicitly curated and retain their authors and licenses.\n\n## Skills and licenses');p.write_text(s)
(r/'scripts/reconcile-collection.py').unlink()
(r/'.github/workflows/reconcile-collection.yml').unlink()
print('Preserved all six originals and the task-to-handoff workflow; 25 listed entries.')
