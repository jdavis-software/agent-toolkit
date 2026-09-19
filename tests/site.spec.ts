import { test, expect } from '@playwright/test';
const base = '/agent-toolkit/';
test('personal collection renders without errors or horizontal overflow',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await expect(page).toHaveTitle('Jordan’s Agent Toolkit Collection');
  await expect(page.getByRole('heading',{level:1})).toContainText('Jordan’s Agent');
  await expect(page.getByRole('heading',{level:1})).toContainText('Toolkit Collection.');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(88);
  await expect(page.locator('#result-count')).toHaveText('Showing 88 of 88 entries');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
  await page.screenshot({path:`test-results/${testInfo.project.name}-home.png`,fullPage:true});
});
test('search, reset, category and origin filters work',async({page})=>{
  await page.goto(base);
  await page.getByRole('searchbox').fill('behavior-test-design');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
  await expect(page).toHaveURL(/q=behavior-test-design/);
  await page.getByRole('button',{name:'Reset filters'}).click();
  await expect(page.locator('[data-entry]:visible')).toHaveCount(88);
  await page.locator('[data-filter-category="Frontend"]').click();
  await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
  await page.getByRole('button',{name:'Reset filters'}).click();
  await page.getByLabel('Filter by origin').selectOption('original');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(85);
  await page.getByLabel('Filter by origin').selectOption('adapted');
  await expect(page.locator('#empty-state')).toBeVisible();
});
test('shareable URL restores filters and treats search as text',async({page})=>{
  await page.goto(base+'?origin=original&q=worktree-handoff');
  await expect(page.getByRole('searchbox')).toHaveValue('worktree-handoff');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
  await page.getByRole('searchbox').fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('#empty-state')).toBeVisible();
  await expect(page.locator('img')).toHaveCount(0);
});
test('detail, source, nested route and theme work',async({page},testInfo)=>{
  await page.goto(base+'skills/work-packet-planner/');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Work Packet Planner');
  await expect(page.getByRole('heading',{name:'Procedure',exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/work-packet-planner\/SKILL.md$/);
  await page.getByRole('button',{name:'Switch to light theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:`test-results/${testInfo.project.name}-detail-light.png`,fullPage:true});
});
test('catalog export and all local navigation targets resolve',async({page,request})=>{
  const catalog = await request.get(base+'catalog.json');expect(catalog.status()).toBe(200);
  const entries = (await catalog.json()).entries;
  expect(entries).toHaveLength(88);
  expect(entries.filter((entry:{origin:string})=>entry.origin==='original')).toHaveLength(85);
  await page.goto(base);
  const links = await page.locator('a[href^="/agent-toolkit/"]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.getAttribute('href')!))]);
  for (const href of links) expect((await request.get(href)).status(),href).toBe(200);
  expect((await request.get(base+'sitemap.xml')).status()).toBe(200);
});
test('keyboard shortcut and collection navigation work',async({page})=>{
  await page.goto(base);
  await page.keyboard.press('/');await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Tools',exact:true}).click();
  await expect(page).toHaveURL(/tools\/$/);
  await expect(page.locator('[data-entry]:visible')).toHaveCount(9);
});
test('skills are local packages with working instructions',async({page})=>{
  await page.goto(base+'skills/');
  await expect(page.locator('[data-entry]')).toHaveCount(79);
  await expect(page.locator('[data-entry][data-origin="curated"]')).toHaveCount(0);
  for (const id of ['evidence-first-debugging','behavior-test-design','interface-quality-review']) {
    await page.goto(base+`skills/${id}/`);
    await expect(page.getByRole('heading',{name:'Procedure',exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Example',exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',`https://github.com/jdavis-software/agent-toolkit/blob/main/skills/${id}/SKILL.md`);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});
test('workflow connects the original collection rather than external skill libraries',async({page,request},testInfo)=>{
  await page.goto(base+'workflows/');
  await expect(page.getByRole('heading',{level:1})).toContainText('From task');
  const links = await page.locator('.prose a[href^="/agent-toolkit/skills/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!));
  expect(links).toHaveLength(6);
  for (const href of links) expect((await request.get(href)).status(),href).toBe(200);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:`test-results/${testInfo.project.name}-workflow.png`,fullPage:true});
});

test('TypeScript 7 and Go are searchable canonical packages',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);
 await page.getByRole('searchbox').fill('typescript 7');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(2);
 await page.getByRole('link',{name:'TypeScript 7 Adoption'}).click();
 await expect(page).toHaveURL(/skills\/typescript-7-adoption\/$/);
 await expect(page.getByRole('heading',{level:1})).toHaveText('TypeScript 7 Adoption');
 await expect(page.getByRole('heading',{name:'Inputs and tailoring',exact:true})).toBeVisible();
 await expect(page.locator('.prose')).toContainText('compiler API');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/typescript-7-adoption\/SKILL.md$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-typescript.png`,fullPage:true});
 await page.goto(base+'skills/go-concurrency-cancellation/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Go Concurrency and Cancellation');
 await expect(page.locator('.prose')).toContainText('backpressure');
 expect(errors).toEqual([]);
});

test('bundle navigation links to canonical skills and a read-only command',async({page,request},testInfo)=>{
 await page.goto(base);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Bundles',exact:true}).click();
 await expect(page).toHaveURL(/bundles\/$/);
 await expect(page.locator('.bundle-card')).toHaveCount(13);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-bundles.png`,fullPage:true});
 await page.getByRole('link',{name:'TypeScript Engineering'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('TypeScript Engineering');
 await expect(page.locator('.bundle-command code')).toHaveText('node tools/bundle.mjs resolve typescript');
 await expect(page.locator('[data-entry]')).toHaveCount(7);
 const hrefs=await page.locator('.bundle-skill-grid a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!));
 for(const href of hrefs)expect((await request.get(href)).status(),href).toBe(200);
 const data=await request.get(base+'bundles.json');expect(data.status()).toBe(200);
 const bundles=(await data.json()).bundles;expect(bundles).toHaveLength(13);
 expect(new Set(bundles.flatMap((b:{skills:string[]})=>b.skills)).size).toBe(79);
});

test('original executable tools are not mislabeled upstream skills',async({page})=>{
 for(const id of ['skillcheck','bundle-resolver','agentflow','harnesskit']){
  await page.goto(base+'tools/'+id+'/');
  await expect(page.getByRole('heading',{name:'Original executable support'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Read tool source'})).toHaveAttribute('href',/blob\/main\/tools\/[a-z-]+\.mjs$/);
  await expect(page.getByRole('link',{name:'Read command contracts and limitations'})).toHaveAttribute('href',/blob\/main\/docs\/[A-Z_]+\.md$/);
  await expect(page.getByRole('link',{name:'Visit upstream'})).toHaveCount(0);
 }
});
