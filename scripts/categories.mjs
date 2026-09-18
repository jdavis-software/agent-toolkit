import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export const categoryIcons=['globe','agents','shield','context','code','terminal','plug','database','workflow','test','server','media','tools'];
export function validateCategories(document,entries) {
  if(!document || document.schemaVersion!==1 || !Array.isArray(document.categories) || !document.categories.length || document.categories.length>30 || !Array.isArray(entries))throw new Error('Invalid category registry');
  const seen=new Set();
  for(const c of document.categories) {
    if(!c || typeof c.id!=='string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) || c.id.length>64 || seen.has(c.id))throw new Error('Invalid or duplicate category');
    seen.add(c.id);
    if(typeof c.title!=='string'||!c.title.trim()||c.title.length>60||typeof c.description!=='string'||!c.description.trim()||c.description.length>260||!categoryIcons.includes(c.icon))throw new Error('Invalid category metadata');
  }
  const ids=new Set();
  for(const e of entries) {
    if(!e || typeof e.id!=='string'||ids.has(e.id)||!seen.has(e.categoryId)||!['skill','tool','workflow'].includes(e.kind))throw new Error('Missing, unknown or duplicate category assignment');
    ids.add(e.id);
  }
  return document.categories.map(c=>{
    const members=entries.filter(e=>e.categoryId===c.id);
    if(!members.length)throw new Error(`Empty category: ${c.id}`);
    return {...c,entryIds:members.map(e=>e.id),counts:{entries:members.length,skills:members.filter(e=>e.kind==='skill').length,tools:members.filter(e=>e.kind==='tool').length,workflows:members.filter(e=>e.kind==='workflow').length}};
  });
}
export async function loadCategories(root=process.cwd()) {
  const [categories,entries]=await Promise.all(['catalog/categories.json','catalog/entries.json'].map(p=>readFile(resolve(root,p),'utf8').then(JSON.parse)));
  return validateCategories(categories,entries);
}
