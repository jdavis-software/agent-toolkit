import { readFile, readdir, lstat, realpath } from 'node:fs/promises';
import { resolve, sep, posix } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const semver = /^\d+\.\d+\.\d+$/;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const companions = ['tools/skillcheck.mjs','tools/lib/contracts.mjs','tools/lib/runner.mjs','tools/lib/worktree.mjs'];
const companionSkills = new Set(['work-packet-planner','worktree-handoff','affected-verification','evidence-first-debugging','behavior-test-design','interface-quality-review']);
const MAX_FILE = 2 * 1024 * 1024;
const MAX_TOTAL = 10 * 1024 * 1024;
export function safeBundlePath(path) {
  if (typeof path !== 'string' || !path || path.length > 512 || path.startsWith('/') || /[\\\x00-\x1f:]/.test(path) || path.split('/').some(p => !p || p === '.' || p === '..' || p === '.git')) throw new Error('Unsafe bundle path');
  return path;
}
async function confined(root, path) {
  safeBundlePath(path);
  const canonical = await realpath(root);
  let current = canonical;
  for (const part of path.split('/')) {
    current = resolve(current,part);
    if ((await lstat(current)).isSymbolicLink()) throw new Error(`Symlinks are not bundle inputs: ${path}`);
  }
  const target = await realpath(current);
  if (!target.startsWith(canonical+sep)) throw new Error('Bundle input escapes root');
  return target;
}
async function bytesAt(root,path) {
  const target=await confined(root,path), stat=await lstat(target);
  if(!stat.isFile() || stat.size>MAX_FILE) throw new Error(`Invalid or oversized bundle file: ${path}`);
  const bytes=await readFile(target);
  if(bytes.length>MAX_FILE) throw new Error(`Oversized bundle file: ${path}`);
  return bytes;
}
export function validateBundleDefinitions(document, entries) {
  if(!document || document.schemaVersion!==1 || !Array.isArray(document.bundles) || !document.bundles.length || document.bundles.length>50 || !Array.isArray(entries)) throw new Error('Invalid bundle registry');
  const local=new Map(entries.filter(e=>e && e.kind==='skill' && e.origin==='original').map(e=>[e.id,e]));
  const seen=new Set();
  for(const b of document.bundles) {
    if(!b || typeof b.id!=='string' || !slug.test(b.id) || b.id.length>64 || seen.has(b.id)) throw new Error('Invalid or duplicate bundle id');
    seen.add(b.id);
    if(typeof b.title!=='string' || !b.title.trim() || typeof b.description!=='string' || !b.description.trim() || !semver.test(b.version) || b.stage!=='experimental') throw new Error(`Invalid bundle metadata: ${b.id}`);
    if(!Array.isArray(b.skills) || !b.skills.length || b.skills.length>100 || new Set(b.skills).size!==b.skills.length) throw new Error(`Invalid or duplicate skill selection: ${b.id}`);
    for(const id of b.skills) {
      if(typeof id!=='string' || !slug.test(id) || id.length>64) throw new Error(`Invalid selected skill: ${b.id}`);
      const e=local.get(id);
      if(!e || e.sourcePath!==`skills/${id}/SKILL.md`) throw new Error(`Unknown or nonlocal skill: ${id}`);
    }
  }
  return document.bundles;
}
export async function loadBundles(root=process.cwd()) {
  const document=JSON.parse((await bytesAt(root,'catalog/bundles.json')).toString('utf8'));
  const entries=JSON.parse((await bytesAt(root,'catalog/entries.json')).toString('utf8'));
  return validateBundleDefinitions(document,entries);
}
async function filesBelow(root,path) {
  const dir=await confined(root,path), stat=await lstat(dir);
  if(!stat.isDirectory()) throw new Error(`Invalid package directory: ${path}`);
  const paths=[];
  async function walk(path) {
    for(const e of (await readdir(await confined(root,path),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
      const child=posix.join(path,e.name); safeBundlePath(child);
      if(e.isSymbolicLink()) throw new Error(`Symlinks are not bundle inputs: ${child}`);
      if(e.isDirectory()) await walk(child);
      else if(e.isFile()) paths.push(child);
      else throw new Error(`Unsupported bundle file type: ${child}`);
      if(paths.length>500) throw new Error('Too many bundle files');
    }
  }
  await walk(path); return paths;
}
function gitObservation(root) {
  // No shell, fetch, hooks, or inherited Git command/config overrides.
  const env=Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.startsWith('GIT_')));
  const git=(args)=>execFileSync('git',['-c','core.fsmonitor=false','-C',root,...args],{encoding:'utf8',env,timeout:5000,maxBuffer:1024*1024,stdio:['ignore','pipe','pipe']});
  try {
    if(resolve(git(['rev-parse','--show-toplevel']).trim())!==resolve(root)) throw new Error('Toolkit root must equal Git root');
    const revision=git(['rev-parse','--verify','HEAD']).trim();
    if(!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(revision)) throw new Error('Invalid Git revision');
    const dirty=git(['status','--porcelain=v1','-z','--untracked-files=all','--ignore-submodules=none']).length>0;
    return {revision,dirty,verification:'git-observed'};
  } catch {return {revision:null,dirty:null,verification:'content-only'};}
}
export async function resolveBundle(root,id,{requireClean=false,expectedRevision}={}) {
  root=await realpath(root);
  if(typeof id!=='string' || !slug.test(id)) throw new Error('Invalid bundle id');
  if(typeof requireClean!=='boolean') throw new Error('Invalid clean-check option');
  if(expectedRevision!==undefined && (typeof expectedRevision!=='string'||!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(expectedRevision))) throw new Error('Invalid expected revision');
  const bundles=await loadBundles(root), b=bundles.find(b=>b.id===id);
  if(!b) throw new Error(`Unknown bundle: ${id}`);
  const before=gitObservation(root);
  if((requireClean || expectedRevision!==undefined) && (before.dirty!==false || !before.revision)) throw new Error('A clean verified Git checkout is required');
  if(expectedRevision!==undefined && before.revision!==expectedRevision) throw new Error('Revision mismatch');
  const paths=['catalog/bundles.json','catalog/entries.json'];
  const catalog=JSON.parse((await bytesAt(root,'catalog/entries.json')).toString('utf8'));
  if(b.skills.some(id=>catalog.find(e=>e.id===id)?.companionTools?.includes('agentflow'))) paths.push('tools/agentflow.mjs','tools/lib/agentflow.mjs','tools/lib/contracts.mjs','docs/AGENTFLOW.md');
  if(b.skills.some(id=>catalog.find(e=>e.id===id)?.companionTools?.includes('sourcekit'))) paths.push('tools/sourcekit.mjs','tools/sourcekit.py','docs/SOURCEKIT.md',...await filesBelow(root,'tools/sourcekit_lib'));
  for(const id of [...b.skills].sort()) {
    const selected=await filesBelow(root,`skills/${id}`);
    if(!selected.includes(`skills/${id}/SKILL.md`)) throw new Error(`Missing skill document: ${id}`);
    paths.push(...selected);
  }
  if(b.skills.some(id=>companionSkills.has(id))) paths.push(...companions,'docs/SKILL_TOOLS.md');
  const files=[];let total=0;
  for(const path of [...new Set(paths)].sort()) {
    const bytes=await bytesAt(root,path); total+=bytes.length;
    if(total>MAX_TOTAL) throw new Error('Bundle exceeds 10 MiB');
    files.push({path,bytes:bytes.length,sha256:digest(bytes)});
  }
  for(const f of files) if(digest(await bytesAt(root,f.path))!==f.sha256) throw new Error('Bundle changed while resolving');
  const after=gitObservation(root);
  if(JSON.stringify(before)!==JSON.stringify(after)) throw new Error('Git state changed while resolving');
  const core={schemaVersion:1,bundleId:b.id,bundleVersion:b.version,skills:[...b.skills].sort(),files};
  return {...core,bundleDigest:digest(JSON.stringify(core)),source:after,limits:['Read-only selection; no installation, tool execution, or MCP server.','File digests are observations, not signed provenance or permission grants.','Git status excludes ignored state; selected files are hashed separately.','Two-pass reads detect observed changes, not every possible concurrent mutation.','Full toolkit checkout is the supported consumption form.']};
}
export async function validateExpansion(root=process.cwd()) {
  const bundles=await loadBundles(root), covered=new Set(bundles.flatMap(b=>b.skills));
  const entries=JSON.parse((await bytesAt(root,'catalog/entries.json')).toString('utf8'));
  let cases=0;
  for(const e of entries.filter(e=>e.kind==='skill'&&e.origin==='original')) {
    if(!covered.has(e.id)) throw new Error(`Unbundled skill: ${e.id}`);
    if(!e.scenarioPath) continue;
    if(e.scenarioPath!==`skills/${e.id}/references/scenarios.json`) throw new Error('Unsafe scenario path');
    const d=JSON.parse((await bytesAt(root,e.scenarioPath)).toString('utf8'));
    if(d.schemaVersion!==1 || d.skill!==e.id || d.status!=='not-run' || !Array.isArray(d.cases) || d.cases.length!==3) throw new Error(`Invalid scenarios: ${e.id}`);
    if(new Set(d.cases.map(c=>c?.id)).size!==3 || ['trigger','boundary','non-trigger'].some(k=>d.cases.filter(c=>c?.kind===k).length!==1)) throw new Error(`Incomplete scenarios: ${e.id}`);
    for(const c of d.cases) for(const key of ['id','input','expected']) if(typeof c[key]!=='string'||!c[key].trim())throw new Error(`Empty scenario ${key}: ${e.id}`);
    cases+=d.cases.length;
  }
  for(const b of bundles) await resolveBundle(root,b.id);
  return {bundles:bundles.length,skills:covered.size,scenarioInputs:cases};
}
