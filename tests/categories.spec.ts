import { test, expect } from '@playwright/test';
const base='/agent-toolkit/';
type Category={id:string;title:string;entryIds:string[];counts:{entries:number;skills:number;tools:number}};
test('category directory renders counted cards and usable keyboard focus',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/');
 await expect(page).toHaveTitle(/Categories/);await expect(page.getByRole('heading',{level:1})).toContainText('Explore by category');
 const categories:Category[]=(await(await request.get(base+'categories.json')).json()).categories;
 await expect(page.locator('[data-category-card]')).toHaveCount(13);
 expect(categories.reduce((n,c)=>n+c.counts.entries,0)).toBe(81);
 for(const c of categories){const card=page.locator(`[data-category-card="${c.id}"]`);await expect(card).toContainText(c.title);await expect(card).toContainText(`${c.counts.entries} ${c.counts.entries===1?'entry':'entries'}`);await expect(card).toHaveAttribute('href',base+`categories/${c.id}/`);}
 const first=page.locator('[data-category-card]').first();await first.focus();await expect(first).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 await page.screenshot({path:`test-results/${testInfo.project.name}-categories.png`,fullPage:true});
 await page.keyboard.press('Enter');await expect(page).toHaveURL(/categories\/agent-orchestration\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Agent Orchestration');
});
test('category search and reset preserve membership and URL boundaries',async({page,request},testInfo)=>{
 const categories:Category[]=(await(await request.get(base+'categories.json')).json()).categories;
 const category=categories.find(c=>c.id==='agent-orchestration')!;
 await page.goto(base+'categories/agent-orchestration/');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(category.counts.entries);
 await page.getByRole('searchbox').fill('agent-task-routing');await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.reload();await expect(page.getByRole('searchbox')).toHaveValue('agent-task-routing');await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Reset filters'}).click();await expect(page.locator('[data-entry]:visible')).toHaveCount(category.counts.entries);
 await expect(page).toHaveURL(/categories\/agent-orchestration\/$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-orchestration-category.png`,fullPage:true});
 await page.getByRole('searchbox').fill('no-such-category-query');await expect(page.locator('#empty-state')).toBeVisible();
});
test('category contents remain available without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4321'});const page=await context.newPage();
 try{await page.goto(base+'categories/typescript/');await expect(page.getByRole('heading',{level:1})).toHaveText('TypeScript');await expect(page.locator('[data-entry]')).toHaveCount(4);await expect(page.getByRole('link',{name:'TypeScript 7 Adoption'})).toBeVisible();}finally{await context.close();}
});
test('categories work in light theme and new bundle/tool routes resolve',async({page,request},testInfo)=>{
 await page.goto(base+'categories/');await page.getByRole('button',{name:'Switch to light theme'}).click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:`test-results/${testInfo.project.name}-categories-light.png`,fullPage:true});
 for(const slug of ['agent-orchestration','agent-runtime'])expect((await request.get(base+`bundles/${slug}/`)).status()).toBe(200);
 await page.goto(base+'tools/agentflow/');await expect(page.getByRole('heading',{level:1})).toHaveText('Agentflow');
 await expect(page.getByRole('link',{name:'Read tool source'})).toHaveAttribute('href',/tools\/agentflow.mjs$/);
 await page.goto(base+'skills/orchestration-resume/');await expect(page.getByRole('heading',{name:'Procedure',exact:true})).toBeVisible();
 expect((await request.get(base+'categories/missing/')).status()).toBe(404);
});

test('web research category, canonical skill, bundle and Sourcekit detail work',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/');
 await page.locator('[data-category-card="web-research"]').click();
 await expect(page).toHaveURL(/categories\/web-research\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Web & Research');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(12);
 await page.getByRole('searchbox').fill('feed-change-tracking');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Feed Change Tracking',exact:false}).first().click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Feed Change Tracking');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/feed-change-tracking\/SKILL.md$/);
 await page.goto(base+'bundles/web-research/');
 await expect(page.locator('[data-entry]')).toHaveCount(11);
 await page.goto(base+'tools/sourcekit/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Sourcekit');
 await expect(page.getByRole('link',{name:'Read tool source'})).toHaveAttribute('href',/tools\/sourcekit.mjs$/);
 await page.goto(base+'categories/web-research/');
 await page.screenshot({path:`test-results/${testInfo.project.name}-web-research.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 expect((await request.get(base+'bundles/web-research/')).status()).toBe(200);
});

test('web qualification additions expose original source and remain searchable',async({page,request},testInfo)=>{
 const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/web-research/');
 await page.getByRole('searchbox').fill('structured-web-extraction');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Structured Web Extraction',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Structured Web Extraction');
 await expect(page.locator('.prose')).toContainText('decoy');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/structured-web-extraction\/SKILL.md$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-web-qualification.png`,fullPage:true});
 for(const id of ['browser-session-isolation','bounded-crawl-planning','mcp-server-qualification']){
  await page.goto(base+'skills/'+id+'/');
  await expect(page.getByRole('heading',{name:'Procedure',exact:true})).toBeVisible();
 }
 await page.goto(base+'tools/sourcekit/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Sourcekit');
 await expect(page.locator('main')).toContainText('content assessment');
 expect(errors).toEqual([]);
});

test('fresh synthetic browser contexts do not share cookie or localStorage state',async({browser})=>{
 const a=await browser.newContext(), b=await browser.newContext();
 try{
  const pa=await a.newPage(),pb=await b.newPage();
  await Promise.all([pa.goto('http://127.0.0.1:4321'+base),pb.goto('http://127.0.0.1:4321'+base)]);
  await pa.evaluate(()=>{localStorage.setItem('synthetic-lane','alpha');document.cookie='synthetic_session=alpha; Path=/';});
  expect(await pa.evaluate(()=>localStorage.getItem('synthetic-lane'))).toBe('alpha');
  expect(await pb.evaluate(()=>localStorage.getItem('synthetic-lane'))).toBeNull();
  expect(await pb.evaluate(()=>document.cookie)).not.toContain('synthetic_session');
  expect((await a.cookies()).some(c=>c.name==='synthetic_session')).toBeTruthy();
 }finally{await a.close();await b.close();}
});


test('harness bundle leads to canonical qualification skills and original tool',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'bundles/');
 await page.getByRole('link',{name:'Harness Engineering and Qualification',exact:true}).click();
 await expect(page).toHaveURL(/bundles\/harness-engineering\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Harness Engineering and Qualification');
 await expect(page.locator('[data-entry]')).toHaveCount(12);
 await expect(page.locator('.bundle-command code')).toHaveText('node tools/bundle.mjs resolve harness-engineering');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-harness-bundle.png`,fullPage:true});
 await page.getByRole('link',{name:'Execution Profile Audit',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Execution Profile Audit');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/execution-profile-audit\/SKILL.md$/);
 await expect(page.locator('.prose')).toContainText('requested, resolved, and observed');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-harness-profile.png`,fullPage:true});
 for(const id of ['agent-runtime-qualification','tracker-readiness-reconciliation','controller-conformance-testing','agent-event-reconciliation','tested-structural-refactoring'])expect((await request.get(base+'skills/'+id+'/')).status()).toBe(200);
 await page.goto(base+'tools/harnesskit/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Harnesskit');
 await expect(page.getByRole('link',{name:'Read command contracts and limitations'})).toHaveAttribute('href',/docs\/HARNESSKIT.md$/);
 expect(errors).toEqual([]);
});

test('harness skills are searchable without adding a second controller category',async({page})=>{
 await page.goto(base+'?q=tracker-readiness-reconciliation');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Reset filters'}).click();
 await expect(page.locator('[data-entry]:visible')).toHaveCount(81);
 await page.goto(base+'categories/');await expect(page.locator('.category-card')).toHaveCount(13);
});


test('bounded canary discovery, source, bundle and context evidence links work',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'?q=bounded-harness-canary');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Bounded Harness Canary',exact:true}).click();
 await expect(page).toHaveURL(/skills\/bounded-harness-canary\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('Bounded Harness Canary');
 await expect(page.locator('.prose')).toContainText('A partial report remains useful evidence');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/bounded-harness-canary\/SKILL.md$/);
 await expect(page.getByRole('link',{name:'Checkpoint and canary contracts'})).toHaveAttribute('href',/docs\/HARNESS_EVIDENCE.md$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-bounded-canary.png`,fullPage:true});
 const bundleLink=page.getByRole('navigation',{name:'Skill bundles'}).getByRole('link',{name:'Harness Engineering and Qualification',exact:true});
 await expect(bundleLink).toBeVisible();
 await bundleLink.click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Harness Engineering and Qualification');
 await expect(page.locator('[data-entry]')).toHaveCount(12);
 await page.getByRole('link',{name:'Context Checkpointing',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Executable file revalidation'})).toBeVisible();
 await expect(page.getByRole('link',{name:'checkpoint contracts'})).toHaveAttribute('href',/docs\/HARNESS_EVIDENCE.md$/);
 expect(errors).toEqual([]);
});
