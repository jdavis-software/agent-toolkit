from pathlib import Path
import json,re
R=Path('.')
def update(path,fn):
 p=R/path;p.write_text(fn(p.read_text()))
update('scripts/catalog.mjs',lambda s:s.replace("id!=='agentflow'","!['agentflow','sourcekit'].includes(id)"))
update('tools/lib/bundles.mjs',lambda s:s.replace("  for(const id of [...b.skills].sort()) {", "  if(b.skills.some(id=>catalog.find(e=>e.id===id)?.companionTools?.includes('sourcekit'))) paths.push('tools/sourcekit.mjs','tools/sourcekit.py','docs/SOURCEKIT.md',...await filesBelow(root,'tools/sourcekit_lib'));\n  for(const id of [...b.skills].sort()) {"))
update('.gitignore',lambda s:s+'\n__pycache__/\n*.pyc\n')
p=R/'package.json';data=json.loads(p.read_text());data['scripts']['test']+=' && python3 -m unittest discover -s tests -p test_sourcekit.py -v';data['scripts']['test:sourcekit']='python3 -m unittest discover -s tests -p test_sourcekit.py -v';data['scripts']['demo:sourcekit']='python3 examples/sourcekit/demo.py';p.write_text(json.dumps(data,indent=2)+'\n')
for path in ['tests/site.spec.ts','tests/categories.spec.ts','tests/categories.test.mjs','tests/catalog.test.mjs','tests/bundles.test.mjs']:
 def changes(s):
  s=re.sub(r'\b60\b','69',s);s=re.sub(r'\b54\b','62',s);s=re.sub(r'\b144\b','168',s)
  s=s.replace('twelve primary categories','thirteen primary categories').replace('ten bundles cover','eleven bundles cover')
  s=s.replace('cs.length,12','cs.length,13').replace('toHaveCount(12)','toHaveCount(13)')
  s=s.replace('bundles:10','bundles:11').replace('bundles.length,10','bundles.length,11').replace('toHaveCount(10)','toHaveCount(11)').replace('toHaveLength(10)','toHaveLength(11)')
  s=s.replace('counts.tools,0),6','counts.tools,0),7')
  if path=='tests/site.spec.ts':
   s=s.replace("await expect(page.locator('[data-entry]:visible')).toHaveCount(6);", "await expect(page.locator('[data-entry]:visible')).toHaveCount(7);")
   s=s.replace('toHaveCount(57)','toHaveCount(66)')
  if path=='tests/catalog.test.mjs':s=s.replace("['skillcheck','bundle-resolver','agentflow']","['skillcheck','bundle-resolver','agentflow','sourcekit']")
  return s
 update(path,changes)
update('tests/categories.spec.ts',lambda s:s+'''
test('web research category, canonical skill, bundle and Sourcekit detail work',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/');
 await page.locator('[data-category-card="web-research"]').click();
 await expect(page).toHaveURL(/categories\\/web-research\\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Web & Research');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(9);
 await page.getByRole('searchbox').fill('feed-change-tracking');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Feed Change Tracking',exact:false}).first().click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Feed Change Tracking');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\\/feed-change-tracking\\/SKILL.md$/);
 await page.goto(base+'bundles/web-research/');
 await expect(page.locator('[data-entry]')).toHaveCount(8);
 await page.goto(base+'tools/sourcekit/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Sourcekit');
 await expect(page.getByRole('link',{name:'Read tool source'})).toHaveAttribute('href',/tools\\/sourcekit.mjs$/);
 await page.goto(base+'categories/web-research/');
 await page.screenshot({path:`test-results/${testInfo.project.name}-web-research.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 expect((await request.get(base+'bundles/web-research/')).status()).toBe(200);
});
''')
update('tests/bundles.test.mjs',lambda s:s+'''
test('web research includes the actual Python implementation and wrapper',async()=>{
 const result=await resolveBundle(root,'web-research');const files=new Set(result.files.map(f=>f.path));
 for(const path of ['tools/sourcekit.mjs','tools/sourcekit.py','tools/sourcekit_lib/common.py','tools/sourcekit_lib/transport.py','tools/sourcekit_lib/formats.py','tools/sourcekit_lib/routing.py','docs/SOURCEKIT.md'])assert.ok(files.has(path),path);
 assert.ok(![...files].some(p=>p.includes('__pycache__')));
});
''')
update('tests/catalog.test.mjs',lambda s:s+'''
test('only declared supported companions can enter the catalog',()=>{
 const entry=entries.find(e=>e.id==='public-web-reading');assert.deepEqual(entry.companionTools,['sourcekit']);
 assert.throws(()=>validateEntries([{...entry,companionTools:['arbitrary-shell']}]),/companion/);
});
''')
update('scripts/categories.mjs',lambda s:s.replace("['agents'","['globe','agents'"))
update('src/components/CategoryIcon.astro',lambda s:s.replace("const paths:Record<string,string>={", "const paths:Record<string,string>={\n globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',"))
p=R/'catalog/categories.json';d=json.loads(p.read_text());next(c for c in d['categories'] if c['id']=='web-research')['icon']='globe';p.write_text(json.dumps(d,indent=2)+'\n')
update('README.md',lambda s:s.replace('**54 original skills · 12 primary categories · 10 overlapping bundles · 3 original utilities · 3 selected external tools.**','**62 original skills · 13 primary categories · 11 overlapping bundles · 4 original utilities · 3 selected external tools.**').replace('The 48 domain and orchestration additions contain 144 synthetic','The 56 domain, orchestration, and source-access additions contain 168 synthetic')+'\n## Web research and source access\n\nThe original [Sourcekit](docs/SOURCEKIT.md) companion adds bounded public HTTPS reads, RSS/Atom/JSON Feed snapshots and comparisons, and WebVTT/SRT evidence parsing. [Browse the bundle](https://jdavis-software.github.io/agent-toolkit/bundles/web-research/). Authenticated platform adapters remain separate; source routing is not a claim of installed access. Python 3.10+ is required for this optional companion and its tests.\n\n[Agent-Reach architecture research](docs/research/AGENT_REACH.md) records the pinned reference and the differences in our original implementation.\n')
update('AGENTS.md',lambda s:s+'\n## Public source intake\n`tools/sourcekit.mjs` wraps `tools/sourcekit.py`; reusable modules live under `tools/sourcekit_lib/`. Python 3.10+ standard library only. Keep `docs/SOURCEKIT.md`, examples, Python tests, bundle companions, and private-adapter boundaries aligned. Default routing/doctor and local parsing have no network effects. Live reads require exact approved hosts; never weaken private-address, redirect, credential, or size checks to make a test pass. Do not install Agent-Reach or other source tools as a side effect of building this site. Run `pnpm test:sourcekit` and the existing browser suite.\n')
update('docs/BUNDLES.md',lambda s:s.replace('36 original skills selected into eight overlapping bundles','62 original skills selected into eleven overlapping bundles').replace('all 36 instructions','all 62 instructions')+'\n## Source-access companion\n\nThe `web-research` bundle selects eight canonical skills and includes the Sourcekit Node wrapper, Python implementation/modules, and command documentation. Python 3.10+ is required to run that optional tool; resolving the bundle itself remains a read-only Node operation. No connector, interpreter, or package is installed automatically.\n')
update('docs/CATEGORIES.md',lambda s:s+'\n## Web & Research\n\nThe `web-research` primary category contains eight original source-access procedures and Sourcekit. Counts derive from canonical entries. It does not advertise working access to every recognized social or video platform.\n')
update('docs/ENGINEERING_COVERAGE.md',lambda s:s.replace('54 original skills: six core procedures, 30 domain skills, and 18 orchestration/runtime/context additions. Three original utilities and three separately identified external tools make 60 catalog entries. Twelve primary categories','62 original skills: six core procedures, 30 domain skills, 18 orchestration/runtime/context additions, and eight source-access skills. Four original utilities and three separately identified external tools make 69 catalog entries. Thirteen primary categories').replace('Ten overlapping bundles','Eleven overlapping bundles').replace('144','168')+'\nSourcekit adds actually executable public text/feed/caption intake, not authenticated social-platform adapters. Separate local parsing, mocked transport-policy tests, live public read checks, and agent-host evaluations in evidence.\n')
update('docs/PRIVATE_ADAPTERS.md',lambda s:s+'\n## Source access\n\nBind Sourcekit public reads to approved hosts and operation policy; constrain process lifetime, resources, output destination, and retention. Keep authenticated source identities and secrets in the private connector. A routing suggestion, optional command on PATH, source packet hash, or category listing does not grant access. No private MCP implementation is added by this bundle.\n')
update('ATTRIBUTION.md',lambda s:s+'\n## Agent-Reach research\n\n[Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) at `a19a171fa980a0785849596492e0af4db800c82f` informed the source-access problem assessment. [The review](docs/research/AGENT_REACH.md) links the inspected implementation. Sourcekit and the eight source-access procedures are newly authored for this collection; no upstream code, skill text, assets, or packages are redistributed here. Underlying protocols and optional external tools retain their actual identities.\n')
# Generate exactly the same README index shape as the canonical Node generator.
entries=json.loads((R/'catalog/entries.json').read_text())
rows=[]
for e in entries:
 if e['kind']=='skill':
  title=re.search(r'^# (.+)$',(R/e['sourcePath']).read_text(),re.M).group(1).replace('|','\\|')
  rows.append('| ['+title+']('+e['sourcePath']+') | '+e['category']+' |')
p=R/'README.md';s=p.read_text();start='<!-- skill-index:start -->';end='<!-- skill-index:end -->';assert s.count(start)==s.count(end)==1
p.write_text(s[:s.index(start)+len(start)]+'\n\n| Skill | Area |\n| --- | --- |\n'+'\n'.join(rows)+'\n\n'+s[s.index(end):])
assert len(entries)==69 and len(rows)==62
# Reject incomplete Content-Length bodies and classify socket timeout explicitly.
update('tools/sourcekit_lib/transport.py',lambda s:s.replace("            return b''.join(chunks),", "            if length is not None and size != int(length):\n                fail('incomplete-response', 'Response ended before its declared length; partial content is rejected.')\n            return b''.join(chunks),").replace("        except (OSError, http.client.HTTPException, ssl.SSLError):", "        except socket.timeout:\n            fail('timeout', 'Public HTTPS operation timed out; partial content is rejected.')\n        except (OSError, http.client.HTTPException, ssl.SSLError):"))
update('tests/test_sourcekit.py',lambda s:s.replace('    def test_compressed_and_binary_bodies_denied(self):', '''    def test_incomplete_content_length_fails(self):
        with self.assertRaises(SourceError) as error:
            self.fake_request([(200,{'Content-Type':'text/plain','Content-Length':'100'},b'short')])
        self.assertEqual(error.exception.code,'incomplete-response')
    def test_socket_timeout_is_not_generic_error(self):
        from unittest.mock import MagicMock
        conn=MagicMock();conn.request.side_effect=socket.timeout()
        with patch('sourcekit_lib.transport.resolve_public',return_value=('numeric','only')),patch('sourcekit_lib.transport.PinnedHTTPS',return_value=conn),self.assertRaises(SourceError) as error:
            fetch_public('https://example.com/',['example.com'])
        self.assertEqual(error.exception.code,'timeout');conn.close.assert_called_once()
    def test_compressed_and_binary_bodies_denied(self):'''))
print('Integrated public source-access skills, utility, tests, and derived inventory; no workflow definitions modified.')
