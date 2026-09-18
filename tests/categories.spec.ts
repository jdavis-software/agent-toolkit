import { test, expect } from '@playwright/test';
const base='/agent-toolkit/';
type Category={id:string;title:string;entryIds:string[];counts:{entries:number;skills:number;tools:number}};
test('category directory renders counted cards and usable keyboard focus',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/');
 await expect(page).toHaveTitle(/Categories/);await expect(page.getByRole('heading',{level:1})).toContainText('Explore by category');
 const categories:Category[]=(await(await request.get(base+'categories.json')).json()).categories;
 await expect(page.locator('[data-category-card]')).toHaveCount(13);
 expect(categories.reduce((n,c)=>n+c.counts.entries,0)).toBe(69);
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
 await expect(page.locator('[data-entry]:visible')).toHaveCount(9);
 await page.getByRole('searchbox').fill('feed-change-tracking');
 await expect(page.locator('[data-entry]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Feed Change Tracking',exact:false}).first().click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Feed Change Tracking');
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/feed-change-tracking\/SKILL.md$/);
 await page.goto(base+'bundles/web-research/');
 await expect(page.locator('[data-entry]')).toHaveCount(8);
 await page.goto(base+'tools/sourcekit/');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Sourcekit');
 await expect(page.getByRole('link',{name:'Read tool source'})).toHaveAttribute('href',/tools\/sourcekit.mjs$/);
 await page.goto(base+'categories/web-research/');
 await page.screenshot({path:`test-results/${testInfo.project.name}-web-research.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 expect((await request.get(base+'bundles/web-research/')).status()).toBe(200);
});
