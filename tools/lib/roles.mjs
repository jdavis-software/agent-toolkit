import { readFile, lstat, realpath, mkdir, writeFile, readdir, symlink } from 'node:fs/promises';
import { resolve, dirname, sep, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { resolveSelection, safeBundlePath, validateBundleDefinitions } from './bundles.mjs';

const sha = b => createHash('sha256').update(b).digest('hex');
const maxFile = 2 * 1024 * 1024;
export async function loadRoles(root) {
  const file = await safeFile(root, 'catalog/roles.json');
  const data = JSON.parse(await readFile(file, 'utf8'));
  const entries = JSON.parse(await readFile(await safeFile(root, 'catalog/entries.json'), 'utf8'));
  if (data.schemaVersion !== 1 || !Array.isArray(data.roles) || !data.roles.length || data.roles.length > 12) throw new Error('Invalid role registry');
  validateBundleDefinitions({schemaVersion:1, bundles:data.roles}, entries);
  for (const role of data.roles) if (role.skills.length > 12) throw new Error('Role exceeds twelve skills');
  return data.roles;
}
export async function resolveRole(root, id, options = {}) {
  const roles = await loadRoles(root), role = roles.find(r => r.id === id);
  if (!role) throw new Error('Unknown role');
  const result = await resolveSelection(root, role, {...options, registryPaths:['catalog/roles.json','docs/ROLE_PROFILES.md','docs/LOCAL_ADAPTER.md']});
  return {...result, kind:'role-selection', roleId:id};
}
async function safeFile(root, path) {
  safeBundlePath(path);
  let current = await realpath(root);
  for (const part of path.split('/')) {
    current = resolve(current, part);
    if ((await lstat(current)).isSymbolicLink()) throw new Error('Symlink input rejected');
  }
  const stat = await lstat(current);
  if (!stat.isFile() || stat.size > maxFile) throw new Error('Invalid package input');
  return current;
}
// Immutable staging, not a global installer: no overwrite, scripts, fetching, or cleanup.
export async function stageRole(root, id, destination, expectedRevision) {
  if (!expectedRevision) throw new Error('Reviewed revision required for staging');
  root = await realpath(root);
  const manifest = await resolveRole(root, id, {expectedRevision, requireClean:true});
  const parent = await realpath(dirname(resolve(destination))), target = resolve(parent, relative(dirname(resolve(destination)), resolve(destination)));
  if (target === root || target.startsWith(root + sep)) throw new Error('Stage outside toolkit checkout');
  // The final destination must be new. A failure deliberately retains partial evidence.
  await mkdir(target, {mode:0o700});
  for (const f of manifest.files) {
    const bytes = await readFile(await safeFile(root, f.path));
    if (bytes.length !== f.bytes || sha(bytes) !== f.sha256) throw new Error('Source changed after resolution');
    const out = resolve(target, f.path);
    await mkdir(dirname(out), {recursive:true, mode:0o700});
    await writeFile(out, bytes, {flag:'wx', mode:0o600});
  }
  const after = await resolveRole(root, id, {expectedRevision, requireClean:true});
  if (after.bundleDigest !== manifest.bundleDigest) throw new Error('Source changed during staging');
  const discovery = resolve(target, '.agents/skills');
  await mkdir(discovery, {recursive:true, mode:0o700});
  for (const skill of manifest.skills) await symlink(`../../skills/${skill}`, resolve(discovery, skill), 'dir');
  await writeFile(resolve(target, 'role-manifest.json'), JSON.stringify(manifest, null, 2)+'\n', {flag:'wx',mode:0o600});
  return {schemaVersion:1,kind:'staged-role',roleId:id,bundleDigest:manifest.bundleDigest,files:manifest.files.length,skills:manifest.skills,installedIntoProject:false,activation:'not-tested'};
}
export async function verifyStage(root) {
  root = await realpath(root);
  const m = JSON.parse(await readFile(await safeFile(root,'role-manifest.json'),'utf8'));
  if (m.roleId !== m.bundleId) throw new Error('Role identity mismatch');
  if (m.schemaVersion !== 1 || m.kind !== 'role-selection' || !Array.isArray(m.files) || !m.files.length || m.files.length>1000 || !Array.isArray(m.skills)) throw new Error('Invalid stage manifest');
  const core={schemaVersion:m.schemaVersion,bundleId:m.bundleId,bundleVersion:m.bundleVersion,skills:m.skills,files:m.files};
  if (sha(JSON.stringify(core))!==m.bundleDigest) throw new Error('Manifest digest mismatch');
  const allowed=new Set(['role-manifest.json']);
  for (const f of m.files) {
    if (allowed.has(f.path)) throw new Error('Duplicate staged path');
    allowed.add(safeBundlePath(f.path));
    const bytes=await readFile(await safeFile(root,f.path));
    if(bytes.length!==f.bytes||sha(bytes)!==f.sha256) throw new Error('Staged content changed');
  }
  for(const id of m.skills) {
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Invalid skill identity');
    const p=`.agents/skills/${id}`, link=resolve(root,p);
    if(!(await lstat(link)).isSymbolicLink() || await realpath(link)!==resolve(root,'skills',id)) throw new Error('Discovery link changed');
    allowed.add(p);
  }
  async function walk(path='') {
    for(const item of await readdir(resolve(root,path),{withFileTypes:true})) {
      const p=path ? `${path}/${item.name}` : item.name;
      if(item.isDirectory()) await walk(p);
      else if(!allowed.has(p)) throw new Error('Unexpected staged content');
    }
  }
  await walk();
  return {schemaVersion:1,kind:'stage-verification',ok:true,roleId:m.roleId,bundleDigest:m.bundleDigest,activation:'not-tested',limits:['Checks integrity, not authenticity or host activation. Do not edit staged packages; stage a new reviewed revision.']};
}
