import { test, expect } from '@playwright/test';
const base = '/agent-toolkit/';
test('home renders without errors and has no horizontal overflow',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  await expect(page.getByRole('heading',{level:1})).toContainText('Better agents.');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(9);
  await expect(page.locator('#result-count')).toHaveText('Showing 9 of 9 entries');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
  await page.screenshot({path:`test-results/${testInfo.project.name}-home.png`,fullPage:true});
});
test('search, reset, category and origin filters work',async({page})=>{
  await page.goto(base);
  await page.getByRole('searchbox').fill('verification');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(3);
  await expect(page).toHaveURL(/q=verification/);
  await page.getByRole('button',{name:'Reset filters'}).click();
  await expect(page.locator('[data-entry]:visible')).toHaveCount(9);
  await page.getByLabel('Filter by origin').selectOption('original');
  await expect(page.locator('[data-entry]:visible')).toHaveCount(3);
  await page.getByLabel('Filter by origin').selectOption('adapted');
  await expect(page.locator('#empty-state')).toBeVisible();
});
test('shareable URL restores filters and treats search as text',async({page})=>{
  await page.goto(base+'?origin=original&q=worktree');
  await expect(page.getByRole('searchbox')).toHaveValue('worktree');
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
  expect((await catalog.json()).entries).toHaveLength(9);
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
  await expect(page.locator('[data-entry]:visible')).toHaveCount(3);
});
