import {test,expect} from '@playwright/test';
const base='/agent-toolkit/';
test('design category leads through original skill to its worked example',async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'categories/');
 await page.locator('[data-category-card="design-communication"]').click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Design & Communication');
 await expect(page.locator('[data-entry]')).toHaveCount(2);
 await page.getByRole('link',{name:'Evidence-backed Visual Explanation',exact:true}).click();
 await expect(page.getByRole('link',{name:'Read SKILL.md'})).toHaveAttribute('href',/skills\/evidence-backed-visual-explanation\/SKILL.md$/);
 await expect(page.getByRole('link',{name:'Open the synthetic worked example'})).toHaveAttribute('href','https://jdavis-software.github.io/agent-toolkit/examples/research-to-delivery/');
 // Absolute public source link is checked above; the bundle flow below clicks the actual local link.
 await page.goto(base+'examples/research-to-delivery/');
 await expect(page).toHaveTitle(/Research to Delivery example/);
 await expect(page.getByRole('heading',{level:1})).toContainText('a useful artifact.');
 await expect(page.getByRole('list',{name:'Synthetic pipeline stages'}).locator('li')).toHaveCount(3);
 await expect(page.locator('.shots article')).toHaveCount(3);
 await expect(page.locator('.shots')).toContainText('Planned feature');
 await expect(page.locator('.notice')).toContainText('synthetic fixtures');
 const details=page.locator('details');await page.getByText('Relationship evidence and text explanation',{exact:true}).click();await expect(details).not.toHaveAttribute('open');
 await page.getByText('Relationship evidence and text explanation',{exact:true}).click();await expect(details).toHaveAttribute('open','');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-research-delivery.png`,fullPage:true});
 expect(errors).toEqual([]);
});

test('bundle example and publication tool have working internal navigation',async({page,request})=>{
 await page.goto(base+'bundles/research-to-delivery/');
 await expect(page.locator('[data-entry]')).toHaveCount(9);
 await page.getByRole('link',{name:'Explore the worked example'}).click();
 await expect(page).toHaveURL(/examples\/research-to-delivery\/$/);
 const tool=page.getByRole('link',{name:'Explore Publicationcheck'});await tool.focus();await expect(tool).toBeFocused();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Publicationcheck');
 await expect(page.getByRole('link',{name:'Read command contracts and limitations'})).toHaveAttribute('href',/docs\/PUBLICATIONCHECK.md$/);
 for(const id of ['time-windowed-research','technical-debt-triage','evidence-backed-visual-explanation','product-video-storyboarding','media-transform-verification','search-discoverability-audit'])expect((await request.get(base+'skills/'+id+'/')).status()).toBe(200);
});

test('worked explanation has a readable light theme and no JavaScript dependency',async({page,browser},testInfo)=>{
 await page.goto(base+'examples/research-to-delivery/');
 await page.getByRole('button',{name:'Switch to light theme'}).click();await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:`test-results/${testInfo.project.name}-research-delivery-light.png`,fullPage:true});
 const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4321'});
 try{const p=await context.newPage();await p.goto(base+'examples/research-to-delivery/');await expect(p.locator('.proof-card')).toHaveCount(3);await expect(p.locator('.evidence-details')).toContainText('The fixture reads input');}finally{await context.close();}
});
