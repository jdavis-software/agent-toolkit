from pathlib import Path
import json,re
R=Path('.')
p=R/'tools/sourcekit_lib/common.py';p.write_text(p.read_text().replace("VERSION = '0.1.0'","VERSION = '0.2.0'"))
p=R/'package.json';j=json.loads(p.read_text());j['scripts']['test']=j['scripts']['test'].replace('-p test_sourcekit.py',"-p 'test_sourcekit*.py'");j['scripts']['test:sourcekit']=j['scripts']['test:sourcekit'].replace('-p test_sourcekit.py',"-p 'test_sourcekit*.py'");p.write_text(json.dumps(j,indent=2)+'\n')
for name in ['tests/catalog.test.mjs','tests/bundles.test.mjs','tests/categories.test.mjs','tests/site.spec.ts','tests/categories.spec.ts']:
 p=R/name;s=p.read_text()
 s=re.sub(r'\b69\b','73',s);s=re.sub(r'\b62\b','66',s);s=re.sub(r'\b168\b','180',s)
 if name=='tests/site.spec.ts':
  s=s.replace("e.origin==='original')).toHaveLength(66)","e.origin==='original')).toHaveLength(70)")
  s=s.replace("entry.origin==='original')).toHaveLength(66)","entry.origin==='original')).toHaveLength(70)")
  s=s.replace("selectOption('original');\n  await expect(page.locator('[data-entry]:visible')).toHaveCount(66)","selectOption('original');\n  await expect(page.locator('[data-entry]:visible')).toHaveCount(70)")
 if name=='tests/categories.spec.ts':
  s=s.replace("toHaveCount(9)","toHaveCount(12)").replace("toHaveCount(8)","toHaveCount(11)")
 p.write_text(s)
p=R/'tests/bundles.test.mjs';s=p.read_text().replace("'tools/sourcekit_lib/routing.py','docs/SOURCEKIT.md'", "'tools/sourcekit_lib/routing.py','tools/sourcekit_lib/assessment.py','docs/SOURCEKIT.md'");p.write_text(s)
p=R/'catalog/entries.json';entries=json.loads(p.read_text())
for e in entries:
 if e['id']=='sourcekit':
  e['description']='Bounded public HTTPS reading, content assessment, link references, feed comparisons and timestamped captions. Optional extraction experiments stay separate.'
  e['outcome']='Source packets with explicit capture-versus-content status, expectation checks and provenance; never a universal crawler or authenticated browser.'
  e['note']='Sourcekit 0.2 adds conservative content assessment and opt-in links without altering transport policy. Scrapling is tested only in an isolated optional parser evaluation.'
p.write_text(json.dumps(entries,indent=2,ensure_ascii=False)+'\n')
p=R/'README.md';s=p.read_text().replace('**62 original skills','**66 original skills').replace('The 56 domain, orchestration, and source-access additions contain 168','The 60 domain, orchestration, source-access and qualification additions contain 180')
rows=[]
for e in entries:
 if e['kind']=='skill':
  title=re.search(r'^# (.+)$',(R/e['sourcePath']).read_text(),re.M)[1]
  rows.append(f"| [{title}]({e['sourcePath']}) | {e['category']} |")
a='<!-- skill-index:start -->';b='<!-- skill-index:end -->';s=s[:s.index(a)+len(a)]+'\n\n| Skill | Area |\n| --- | --- |\n'+'\n'.join(rows)+'\n\n'+s[s.index(b):]
s+='''\n## Content correctness and web qualification\n\nSourcekit 0.2 separates capture success from a conservative content assessment. Explicit `--require-content` checks declared literal expectations without claiming semantic truth. Optional link references never trigger a crawl. Four original skills cover browser-session isolation, structured extraction, bounded crawl planning and MCP server qualification.\n\n[Implementation and limits](docs/WEB_QUALIFICATION.md) · [Optional pinned Scrapling parser evaluation](evals/scrapling/README.md). The optional parser environment is separate from the website and default tools; it adds no browser or MCP service.\n'''
p.write_text(s)
for id,text in {
 'public-web-reading':'''\n## Capture versus requested content\n\nSourcekit 0.2 adds `contentAssessment` alongside capture `status`. Use independently chosen literal markers and `--require-content` for a machine gate: exit 3 preserves the packet but signals that expected content was not established. No expectations means `unknown`, not healthy. Use `assess FILE --format html` to inspect a local interstitial without invoking a browser. A matching literal marker is not proof of semantic correctness. The optional `--include-links` emits bounded references without fetching them. See `docs/SOURCEKIT.md`.\n''',
 'connector-health-diagnostics':'''\n## Content-level diagnostic evidence\n\nKeep successful transport separate from the requested result. Sourcekit 0.2 can return capture `status: ok` alongside `contentAssessment.state: authentication-required` or `unknown`. Do not turn that into a connectivity failure or a successful source read. A local parser assessment also does not establish live authentication. Preserve the original capture, limits and exact operation before choosing an authorized next step.\n'''
}.items():
 p=R/'skills'/id/'SKILL.md';p.write_text(p.read_text()+text)
p=R/'docs/SOURCEKIT.md';p.write_text(p.read_text()+'\n'+(R/'.github/sourcekit-addendum.md').read_text())
p=R/'tests/categories.spec.ts';p.write_text(p.read_text()+'\n'+(R/'.github/qualification-browser-tests.txt').read_text())
