import { createHash } from 'node:crypto';
import { readSelectionBytes, resolveSkillSelection, validateBundleDefinitions } from './bundles.mjs';
const keys=['id','title','kind','description','version','stage','requestedMode','skills','deliverables','context','nonGoals'];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
function text(value,max=800) {return typeof value==='string'&&value.trim().length>0&&value.length<=max&&!/[\x00-\x1f]/.test(value);}
export function validateRoles(document,entries) {
  if(!document || Object.keys(document).some(k=>!['schemaVersion','roles'].includes(k)) || document.schemaVersion!==1 || !Array.isArray(document.roles)||!document.roles.length||document.roles.length>32)throw new Error('Invalid role registry');
  const seen=new Set();
  for(const r of document.roles) {
    if(!r || Object.keys(r).length!==keys.length || keys.some(k=>!Object.hasOwn(r,k)) || Object.keys(r).some(k=>!keys.includes(k)))throw new Error('Invalid role fields; roles cannot grant permissions');
    validateBundleDefinitions({schemaVersion:1,bundles:[r]},entries);
    if(seen.has(r.id))throw new Error('Duplicate role id');seen.add(r.id);
    if(!text(r.title,80)||!text(r.description,400)||r.skills.length>24||!['review','implementation','analysis','production'].includes(r.kind))throw new Error('Invalid role metadata');
    const required=['review','analysis'].includes(r.kind)?'read-only':'task-bound';
    if(r.requestedMode!==required)throw new Error('Invalid requested role mode');
    for(const k of ['deliverables','context','nonGoals'])if(!Array.isArray(r[k])||!r[k].length||r[k].length>8||r[k].some(x=>!text(x))||new Set(r[k]).size!==r[k].length)throw new Error('Invalid role guidance');
  }
  return document.roles;
}
export async function loadRoles(root=process.cwd()) {
  const doc=JSON.parse((await readSelectionBytes(root,'catalog/roles.json')).toString('utf8'));
  const entries=JSON.parse((await readSelectionBytes(root,'catalog/entries.json')).toString('utf8'));
  return validateRoles(doc,entries);
}
export async function resolveRole(root,id,options={}) {
  if(typeof id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)||id.length>64)throw new Error('Invalid role id');
  const role=(await loadRoles(root)).find(r=>r.id===id);
  if(!role)throw new Error('Unknown role');
  const selected=await resolveSkillSelection(root,role,{...options,registryPaths:['catalog/roles.json']});
  const after=(await loadRoles(root)).find(r=>r.id===id);
  if(JSON.stringify(after)!==JSON.stringify(role))throw new Error('Role changed while resolving');
  const core={schemaVersion:1,role,skills:selected.skills,files:selected.files};
  return {...core,roleDigest:hash(core),source:selected.source,execution:'none',authority:'host-enforced-not-granted-by-role',limits:[...selected.limits,'A specialist preset requests a working mode; it is not an agent, tool grant or proof of expertise.','Only required skill bodies should be loaded by the consuming host.']};
}
export async function validateRolePackages(root=process.cwd()) {
  const roles=await loadRoles(root);
  for(const role of roles)await resolveRole(root,role.id);
  return roles.length;
}
