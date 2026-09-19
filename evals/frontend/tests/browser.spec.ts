import { test, expect, type Page } from '@playwright/test';
type Item = {id:string;label:string;favorite:boolean};
const seed:Record<string,Item[]>={studio:[{id:'cedar',label:'Cedar collection',favorite:false},{id:'maple',label:'Maple studies',favorite:false}],docs:[{id:'guide',label:'Design guide',favorite:false}]};
async function setup(page:Page) {
 const state={rows:structuredClone(seed),reads:0,writes:0,failReads:false,malformed:false,failFavorite:false,postGate:Promise.resolve(),favoriteGate:Promise.resolve()};
 await page.route('**/api/**',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(request.method()==='GET') {
   state.reads++;
   if(state.failReads)return route.fulfill({status:503,json:{error:'synthetic-outage'}});
   if(state.malformed)return route.fulfill({json:[{id:123,label:'Invalid wire value',favorite:false}]});
   const rows=state.rows[url.searchParams.get('workspace')??'studio']??[];
   return route.fulfill({json:rows.filter(i=>i.label.toLowerCase().includes((url.searchParams.get('q')??'').toLowerCase()))});
  }
  state.writes++;const body=request.postDataJSON();
  if(request.method()==='POST') {
   await state.postGate;
   if(body.label==='Conflict')return route.fulfill({status:409,json:{error:'conflict'}});
   state.rows[body.workspace].push({id:'created',label:body.label,favorite:false});return route.fulfill({status:201,json:{ok:true}});
  }
  await state.favoriteGate;
  if(state.failFavorite)return route.fulfill({status:503,json:{error:'synthetic-failure'}});
  const id=url.pathname.split('/').at(-1);const row=state.rows[body.workspace].find(i=>i.id===id);if(row)row.favorite=body.favorite;
  return route.fulfill({json:{ok:true}});
 });
 return state;
}
function gate(){let release!:()=>void;const promise=new Promise<void>(r=>{release=r;});return {promise,release};}
test('actual React, query, Tailwind and icons render meaningful responsive content',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await setup(page);await page.goto('/');
 await expect(page).toHaveTitle('Frontend Foundations · Synthetic Lab');await expect(page.getByRole('heading',{level:1})).toHaveText('Frontend foundations.');
 await expect(page.getByText('Cedar collection',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Refresh items'})).toBeVisible();
 const primary=page.getByRole('button',{name:'Create item',exact:true});expect(await primary.evaluate(e=>getComputedStyle(e).minHeight)).toBe('44px');
 expect(await primary.evaluate(e=>getComputedStyle(e).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 await page.screenshot({path:info.outputPath(`${info.project.name}-frontend-react.png`),fullPage:true});
});
test('URL, visible controls and scoped query restore on back and reload',async({page})=>{
 await setup(page);await page.goto('/?workspace=docs');await expect(page.getByText('Design guide',{exact:true})).toBeVisible();
 await page.getByLabel('Workspace',{exact:true}).selectOption('studio');await expect(page.getByText('Cedar collection',{exact:true})).toBeVisible();
 await page.goBack();await expect(page.getByLabel('Workspace',{exact:true})).toHaveValue('docs');await expect(page.getByText('Design guide',{exact:true})).toBeVisible();await expect(page.getByText('Cedar collection',{exact:true})).toHaveCount(0);
 await page.getByLabel('Search items',{exact:true}).fill('guide');await page.reload();await expect(page.getByLabel('Search items',{exact:true})).toHaveValue('guide');await expect(page.getByText('Design guide',{exact:true})).toBeVisible();
});
test('React Hook Form distinguishes local invalidity, server rejection and accepted save',async({page})=>{
 const state=await setup(page);await page.goto('/');await page.getByRole('button',{name:'Create item',exact:true}).click();
 await expect(page.getByRole('alert')).toHaveText('Use at least 3 characters.');expect(state.writes).toBe(0);await expect(page.getByLabel('Item label',{exact:true})).toBeFocused();
 await page.getByLabel('Item label',{exact:true}).fill('Conflict');await page.getByRole('button',{name:'Create item',exact:true}).click();
 await expect(page.getByRole('alert')).toHaveText('That label already exists.');await expect(page.getByLabel('Item label',{exact:true})).toHaveValue('Conflict');
 await page.getByLabel('Item label',{exact:true}).fill('  Elm collection  ');await page.getByRole('button',{name:'Create item',exact:true}).click();
 await expect(page.getByText('Item created.',{exact:true})).toBeVisible();await expect(page.getByText('Elm collection',{exact:true})).toBeVisible();await expect(page.getByLabel('Item label',{exact:true})).toHaveValue('');expect(state.rows.studio.at(-1)?.label).toBe('Elm collection');
});
test('pending form submission prevents a duplicate write',async({page})=>{
 const state=await setup(page),pending=gate();state.postGate=pending.promise;await page.goto('/');await page.getByLabel('Item label',{exact:true}).fill('Elm collection');
 await page.getByRole('button',{name:'Create item',exact:true}).dblclick();await expect(page.getByRole('button',{name:'Saving…',exact:true})).toBeDisabled();expect(state.writes).toBe(1);
 pending.release();await expect(page.getByText('Item created.',{exact:true})).toBeVisible();expect(state.writes).toBe(1);
});
test('failed optimistic mutation restores the actual prior cached state',async({page})=>{
 const state=await setup(page),pending=gate();state.favoriteGate=pending.promise;state.failFavorite=true;await page.goto('/');
 const button=page.getByRole('button',{name:'Favorite Cedar collection',exact:true});await expect(button).toHaveAttribute('aria-pressed','false');await button.click();
 await expect(button).toHaveAttribute('aria-pressed','true');await expect(button).toBeDisabled();pending.release();
 await expect(page.getByRole('alert')).toHaveText('Favorite failed; the previous value was restored.');await expect(button).toHaveAttribute('aria-pressed','false');expect(state.rows.studio[0].favorite).toBe(false);
});
test('accepted mutation stays in its workspace',async({page})=>{
 const state=await setup(page);await page.goto('/');const favorite=page.getByRole('button',{name:'Favorite Cedar collection',exact:true});await favorite.click();await expect(favorite).toBeEnabled();await expect(favorite).toHaveAttribute('aria-pressed','true');
 await page.getByLabel('Workspace',{exact:true}).selectOption('docs');await expect(page.getByText('Design guide',{exact:true})).toBeVisible();await expect(page.getByText('Cedar collection',{exact:true})).toHaveCount(0);expect(state.rows.docs[0].favorite).toBe(false);
});
test('late obsolete search cannot replace the current result',async({page})=>{
 await setup(page);const old=gate(),done=gate();
 await page.route('**/api/items?*',async route=>{const q=new URL(route.request().url()).searchParams.get('q');if(q!=='Cedar')return route.fallback();await old.promise;try{await route.fulfill({json:[{id:'cedar',label:'Cedar collection',favorite:false}]});}finally{done.release();}});
 await page.goto('/');await expect(page.getByText('Maple studies',{exact:true})).toBeVisible();await page.getByLabel('Search items',{exact:true}).fill('Cedar');await expect(page.getByText('Loading items…',{exact:true})).toBeVisible();
 await page.getByLabel('Search items',{exact:true}).fill('Maple');await expect(page.getByText('Maple studies',{exact:true})).toBeVisible();old.release();await done.promise;
 await expect(page.getByText('Cedar collection',{exact:true})).toHaveCount(0);await expect(page.getByLabel('Search items',{exact:true})).toHaveValue('Maple');
});
test('refresh failure retains same-identity data and a retry control',async({page})=>{
 const state=await setup(page);await page.goto('/');await expect(page.getByText('Cedar collection',{exact:true})).toBeVisible();state.failReads=true;await page.getByRole('button',{name:'Refresh items'}).click();
 await expect(page.getByRole('alert')).toHaveText('Refresh failed. Showing previous items.');await expect(page.getByText('Cedar collection',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Refresh items'})).toBeEnabled();
});
test('invalid success payload is an error, not an empty successful list',async({page})=>{
 const state=await setup(page);state.malformed=true;await page.goto('/');await expect(page.getByRole('alert')).toHaveText('Items could not be loaded.');await expect(page.getByText('No matching items.',{exact:false})).toHaveCount(0);
});
test('icon-only controls are named, decorative icons are hidden, keyboard refresh works',async({page},info)=>{
 const state=await setup(page);await page.goto('/');await expect(page.getByText('Cedar collection',{exact:true})).toBeVisible();
 const refresh=page.getByRole('button',{name:'Refresh items'});await refresh.focus();await expect(refresh).toBeFocused();await page.keyboard.press('Enter');await expect.poll(()=>state.reads).toBeGreaterThan(1);
 expect(await page.locator('button svg').evaluateAll(icons=>icons.every(icon=>icon.getAttribute('aria-hidden')==='true'&&icon.getAttribute('focusable')==='false'))).toBeTruthy();
 await page.getByRole('button',{name:'Switch to light theme'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');await expect(page.getByRole('button',{name:'Switch to dark theme'})).toBeVisible();
 await page.screenshot({path:info.outputPath(`${info.project.name}-frontend-light.png`),fullPage:true});
});
test('untrusted labels remain text and do not create active elements',async({page})=>{
 const state=await setup(page);state.rows.studio=[{id:'unsafe',label:'<img src=x onerror=alert(1)>',favorite:false}];let dialog=false;page.on('dialog',async d=>{dialog=true;await d.dismiss();});await page.goto('/');
 await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();await expect(page.locator('img')).toHaveCount(0);expect(dialog).toBe(false);
});
test('long labels and reduced motion retain usable controls without document overflow',async({page},info)=>{
 const state=await setup(page);state.rows.studio=[{id:'long',label:'A long synthetic collection label '.repeat(4),favorite:false}];await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByText(state.rows.studio[0].label,{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.getByRole('button',{name:'Create item',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Refresh items'})).toBeVisible();
 await page.screenshot({path:info.outputPath(`${info.project.name}-frontend-long-label.png`),fullPage:true});
});
