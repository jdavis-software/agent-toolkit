import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRoles } from '../tools/lib/roles.mjs';
export async function inventory(root=process.cwd()) {
  const read=async p=>JSON.parse(await readFile(resolve(root,p),'utf8'));
  const entries=await read('catalog/entries.json'), bundles=(await read('catalog/bundles.json')).bundles;
  const roles=await loadRoles(root);
  let scenarios=0;
  for(const e of entries) if(e.scenarioPath) scenarios+=(await read(e.scenarioPath)).cases.length;
  return {skills:entries.filter(e=>e.kind==='skill'&&e.origin==='original').length,utilities:entries.filter(e=>e.kind==='tool'&&e.origin==='original').length,externalTools:entries.filter(e=>e.kind==='tool'&&e.origin==='curated').length,categories:(await read('catalog/categories.json')).categories.length,bundles:bundles.length,roles:roles.length,scenarios,bundleDefinitions:bundles};
}
export async function syncInventory({root=process.cwd(),write=false}={}) {
  const c=await inventory(root);
  const summary=`**${c.skills} original skills · ${c.categories} primary categories · ${c.bundles} overlapping bundles · ${c.utilities} original utilities · ${c.externalTools} selected external tools · ${c.roles} optional role profiles.**\n\n${c.scenarios} synthetic scenario inputs are authored examples, not completed agent-host evaluations. Counts are generated from the catalog.`;
  const bundleTable='| Bundle ID | Focus |\n| --- | --- |\n'+c.bundleDefinitions.map(b=>`| \`${b.id}\` | ${b.description.replaceAll('|','\\|')} |`).join('\n');
  for(const path of ['README.md','docs/ENGINEERING_COVERAGE.md','docs/ROADMAP.md','docs/BUNDLES.md']) {
    let text=await readFile(resolve(root,path),'utf8'), next=text;
    if(path==='README.md') {
      const line=`**${c.skills} original skills · ${c.categories} primary categories · ${c.bundles} overlapping bundles · ${c.utilities} original utilities · ${c.externalTools} selected external tools.**`;
      const pattern=/\*\*\d+ original skills · [^\n]+selected external tools\.\*\*/g;
      if([...next.matchAll(pattern)].length!==1)throw new Error('Missing unique README inventory line');
      next=next.replace(pattern,line);
    }
    for(const [name,body] of (path==='README.md'?[]:[['inventory',summary],...(path==='docs/BUNDLES.md'?[['bundle-table',bundleTable]]:[])])) {
      const start=`<!-- ${name}:start -->`,end=`<!-- ${name}:end -->`;
      if(next.split(start).length!==2||next.split(end).length!==2||next.indexOf(start)>next.indexOf(end))throw new Error(`Missing inventory markers: ${path}`);
      next=next.slice(0,next.indexOf(start)+start.length)+'\n\n'+body+'\n\n'+next.slice(next.indexOf(end));
    }
    if(next!==text) {
      if(!write) throw new Error(`Inventory drift: ${path}; run node scripts/inventory.mjs --write`);
      await writeFile(resolve(root,path),next);
    }
  }
  return c;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  if(process.argv.slice(2).some(v=>v!=='--write'))throw new Error('Only --write is supported');
  syncInventory({write:process.argv.includes('--write')}).then(c=>console.log(JSON.stringify({...c,bundleDefinitions:undefined}))).catch(e=>{console.error(e.message);process.exitCode=1;});
}
