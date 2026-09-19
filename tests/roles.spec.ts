import {test,expect} from '@playwright/test';
const base='/agent-toolkit/';
test('Roles navigation opens eight presets without inflating the skill catalog',async({page,request},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Roles',exact:true}).click();
 await expect(page).toHaveURL(/roles\/$/);await expect(page).toHaveTitle(/Specialist roles/);
 await expect(page.getByRole('heading',{level:1})).toContainText('A clear responsibility.');
 await expect(page.locator('[data-role-card]:visible')).toHaveCount(8);
 const data=await(await request.get(base+'roles.json')).json();expect(data.roles).toHaveLength(8);expect(data.execution).toBe('none');
 const entries=(await(await request.get(base+'catalog.json')).json()).entries;expect(entries).toHaveLength(121);expect(entries.some((e:{kind:string})=>e.kind==='role')).toBe(false);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 await page.screenshot({path:`test-results/${testInfo.project.name}-roles.png`,fullPage:true});
});
test('role search restores the URL and reset and empty states work',async({page})=>{
 await page.goto(base+'roles/');await page.getByRole('searchbox',{name:'Search roles'}).fill('video');
 await expect(page.locator('[data-role-card]:visible')).toHaveCount(1);await expect(page).toHaveURL(/q=video/);
 await page.reload();await expect(page.getByRole('searchbox')).toHaveValue('video');await expect(page.locator('[data-role-card]:visible')).toHaveCount(1);
 await page.getByRole('searchbox').fill('<script>untrusted</script>');await expect(page.locator('#role-empty')).toBeVisible();
 await page.getByRole('button',{name:'Reset roles'}).click();await expect(page.locator('[data-role-card]:visible')).toHaveCount(8);await expect(page.getByRole('searchbox')).toBeFocused();
});
test('reviewer role exposes its contract and links through to canonical skill and bundle',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'roles/');const link=page.getByRole('link',{name:'Architecture Reviewer',exact:false});await link.focus();await expect(link).toBeFocused();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Architecture Reviewer');
 await expect(page.locator('.notice')).toContainText('read-only');await expect(page.locator('.notice')).toContainText('does not launch');
 await expect(page.locator('.bundle-command code')).toHaveText('node tools/bundle.mjs role architecture-reviewer');
 await expect(page.getByRole('region',{name:'Role handoff contract'})).toContainText('Do not rewrite');
 await expect(page.locator('[data-entry]')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-architecture-role.png`,fullPage:true});
 await page.getByRole('link',{name:'Code Index Qualification',exact:true}).click();
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/code-index-qualification\/SKILL.md$/);
 await expect(page.getByRole('navigation',{name:'Skill roles'}).getByRole('link',{name:'Architecture Reviewer',exact:true})).toBeVisible();
 await page.getByRole('navigation',{name:'Skill bundles'}).getByRole('link',{name:'Code Intelligence and Orientation',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Code Intelligence and Orientation');
 expect(errors).toEqual([]);
});
test('roles remain readable without JavaScript and in light theme',async({page,browser},testInfo)=>{
 await page.goto(base+'roles/');await page.getByRole('button',{name:'Switch to light theme'}).click();await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-roles-light.png`,fullPage:true});
 const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4321'});
 try{const p=await context.newPage();await p.goto(base+'roles/');await expect(p.locator('[data-role-card]')).toHaveCount(8);await p.getByRole('link',{name:'Video Producer',exact:false}).click();await expect(p.locator('[data-entry]')).toHaveCount(7);}finally{await context.close();}
});
test('new packages, role links and sitemap resolve without adding external tool claims',async({request,page})=>{
 const ids=['codebase-orientation','code-index-qualification','reference-video-analysis','media-timeline-assembly','shot-continuity-review','specialist-role-composition','engineering-experiment-analysis','dataset-readiness-review'];
 for(const id of ids){await page.goto(base+'skills/'+id+'/');await expect(page.getByRole('heading',{name:'Procedure',exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',new RegExp(`skills/${id}/SKILL.md$`));}
 const sitemap=await(await request.get(base+'sitemap.xml')).text();expect(sitemap).toContain('/roles/video-producer/');
 for(const role of (await(await request.get(base+'roles.json')).json()).roles)expect((await request.get(base+'roles/'+role.id+'/')).status()).toBe(200);
 expect((await request.get(base+'roles/no-such-role/')).status()).toBe(404);
});
test('new bundles and extended media bundle reference all selected procedures',async({page,request})=>{
 const bundles=(await(await request.get(base+'bundles.json')).json()).bundles;
 expect(bundles).toHaveLength(18);
 await page.goto(base+'bundles/engineering-methods/');await expect(page.locator('[data-entry]')).toHaveCount(5);
 await page.getByRole('link',{name:'Dataset Readiness Review',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Dataset Readiness Review');
 await page.goto(base+'bundles/media-integrations/');await expect(page.locator('[data-entry]')).toHaveCount(11);
 await page.getByRole('link',{name:'Media Timeline Assembly',exact:true}).click();await expect(page.locator('.prose')).toContainText('does not');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
