import { readFile, readdir, realpath, lstat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
export const root = resolve(process.cwd());
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const shaPattern = /^[a-f0-9]{40}$/;
const repoPattern = /^[\w.-]+\/[\w.-]+$/;
const hashPattern = /^[a-f0-9]{64}$/;
const repository = 'https://github.com/jdavis-software/agent-toolkit';
const safeRelative = path => typeof path === 'string' && path.length > 0 && !path.startsWith('/') && !path.includes('\\') && !path.split('/').some(p => p === '..' || p === '.' || !p);
function https(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid source URL');
  return value;
}
export function validateEntries(entries) {
  if (!Array.isArray(entries)) throw new Error('Catalog must be an array');
  const ids = new Set();
  for (const e of entries) {
    if (typeof e.id !== 'string' || !slugPattern.test(e.id) || e.id.length > 64 || ids.has(e.id)) throw new Error(`Invalid or duplicate id: ${e.id}`);
    ids.add(e.id);
    if (!['skill','tool','workflow'].includes(e.kind)) throw new Error(`Invalid kind: ${e.id}`);
    if (!['original','adapted','curated'].includes(e.origin)) throw new Error(`Invalid origin: ${e.id}`);
    if (!['experimental','validated','released','reference','deprecated'].includes(e.stage)) throw new Error(`Invalid stage: ${e.id}`);
    for (const key of ['category','author','note','outcome','why']) if (typeof e[key] !== 'string' || !e[key].trim()) throw new Error(`Missing ${key}: ${e.id}`);
    for (const key of ['requires','testedHosts','evidence']) if (!Array.isArray(e[key]) || e[key].some(v => typeof v !== 'string')) throw new Error(`Invalid ${key}: ${e.id}`);
    if (e.listed !== undefined && typeof e.listed !== 'boolean') throw new Error('Invalid listing state');
    if (e.origin === 'curated') {
      if (!e.title?.trim() || !e.description?.trim() || e.sourcePath || e.stage !== 'reference') throw new Error(`Invalid reference: ${e.id}`);
      https(e.url);
      if (e.vendorPath) {
        if (!slugPattern.test(e.sourceId) || !safeRelative(e.upstreamPath) || !safeRelative(e.packageLicense) || e.vendorPath !== `vendor/${e.sourceId}/${e.upstreamPath.split('/').at(-1)}` || !safeRelative(e.vendorPath)) throw new Error(`Invalid vendor path/provenance: ${e.id}`);
        if (!['MIT','Apache-2.0'].includes(e.license)) throw new Error(`Unreviewed redistribution license: ${e.id}`);
      }
    } else {
      if (e.kind !== 'skill' || e.sourcePath !== `skills/${e.id}/SKILL.md`) throw new Error(`Invalid source path: ${e.id}`);
      if (e.title || e.description) throw new Error(`Name and description belong in SKILL.md: ${e.id}`);
      if (e.vendorPath) throw new Error('An upstream snapshot is not original work');
      if (e.origin === 'adapted' && (!e.upstreamRevision || !e.upstreamUrl || !e.licensePath)) throw new Error(`Missing adaptation provenance: ${e.id}`);
      if (['validated','released'].includes(e.stage) && (!e.evidence.length || !e.testedHosts.length)) throw new Error(`Unsupported validation claim: ${e.id}`);
    }
  }
  return entries;
}
export function parseSkill(text, id, original = true) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${id}`);
  const data = load(match[1]);
  if (!data || typeof data !== 'object' || typeof data.name !== 'string' || !data.name.trim() || typeof data.description !== 'string' || !data.description.trim()) throw new Error(`Invalid skill frontmatter: ${id}`);
  if (original) {
    if (data.name !== id || data.description.length > 1024) throw new Error(`Invalid skill frontmatter: ${id}`);
    for (const heading of ['When to use','When not to use','Procedure','Output','Failure handling','Example']) if (!match[2].includes(`## ${heading}`)) throw new Error(`Missing ${heading}: ${id}`);
  }
  return { name: data.name, description: data.description, body: match[2] };
}
export async function loadSources() {
  const sources = JSON.parse(await readFile(resolve(root,'catalog/upstreams.json'),'utf8'));
  for (const [id,s] of Object.entries(sources)) {
    if (!slugPattern.test(id) || !repoPattern.test(s.repo) || !shaPattern.test(s.revision) || !hashPattern.test(s.archiveSha256) || !s.title || !s.author) throw new Error(`Invalid source registry: ${id}`);
  }
  return sources;
}
async function regularFiles(directory) {
  const results = [];
  for (const d of await readdir(resolve(root,directory),{withFileTypes:true})) {
    const path = `${directory}/${d.name}`;
    if (d.isSymbolicLink()) throw new Error(`Symlink in vendor snapshot: ${path}`);
    if (d.isDirectory()) results.push(...await regularFiles(path));
    else if (d.isFile()) results.push(path);
    else throw new Error(`Unsupported vendor file: ${path}`);
  }
  return results;
}
export function verifyFileDigest(content, expected, label) {
  if (createHash('sha256').update(content).digest('hex') !== expected) throw new Error(`Snapshot hash mismatch: ${label}`);
}
export async function verifySnapshots(entries, sources) {
  const lock = JSON.parse(await readFile(resolve(root,'catalog/upstream-lock.json'),'utf8'));
  if (lock.schemaVersion !== 1 || !Array.isArray(lock.packages)) throw new Error('Invalid upstream lock');
  const expected = entries.filter(e => e.vendorPath);
  if (JSON.stringify(lock.packages.map(p=>p.id).sort()) !== JSON.stringify(expected.map(e=>e.id).sort())) throw new Error('Snapshot registry and catalog disagree');
  const allFiles = new Set();
  const rootPath = await realpath(root);
  for (const p of lock.packages) {
    const e = expected.find(e=>e.id===p.id);
    if (!e || p.sourceId !== e.sourceId || p.revision !== sources[e.sourceId]?.revision || p.vendorPath !== e.vendorPath || p.license !== e.license || !Array.isArray(p.files) || !p.files.length) throw new Error(`Snapshot provenance mismatch: ${p.id}`);
    const license = p.files.find(f=>f.path === p.licensePath && f.upstreamPath === e.packageLicense);
    if (!license || !p.files.some(f=>f.path===`${e.vendorPath}/SKILL.md`)) throw new Error(`Missing snapshot license or entry point: ${p.id}`);
    for (const f of p.files) {
      if (!safeRelative(f.path) || !safeRelative(f.upstreamPath) || !f.path.startsWith(`${e.vendorPath}/`) || !hashPattern.test(f.sha256) || allFiles.has(f.path)) throw new Error(`Unsafe snapshot file: ${f.path}`);
      if (!(f.upstreamPath.startsWith(`${e.upstreamPath}/`) || f.upstreamPath === e.packageLicense)) throw new Error('Unselected upstream file');
      allFiles.add(f.path);
      const fullPath = await realpath(resolve(root,f.path));
      if (!fullPath.startsWith(`${rootPath}${sep}`) || !(await lstat(resolve(root,f.path))).isFile()) throw new Error('Snapshot escapes repository');
      const content = await readFile(fullPath);
      verifyFileDigest(content, f.sha256, f.path);
    }
  }
  if (JSON.stringify((await regularFiles('vendor')).sort()) !== JSON.stringify([...allFiles].sort())) throw new Error('Untracked or missing vendor files');
  return lock;
}
export async function loadCatalog() {
  const manifest = JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
  if (manifest.name !== 'agent-toolkit') throw new Error('Run catalog commands from the agent-toolkit repository root');
  const entries = validateEntries(JSON.parse(await readFile(resolve(root,'catalog/entries.json'),'utf8')));
  const sources = await loadSources();
  const lock = await verifySnapshots(entries, sources);
  const rootPath = await realpath(root);
  const local = entries.filter(e=>e.origin!=='curated');
  const dirs = (await readdir(resolve(root,'skills'),{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>e.name).sort();
  if (JSON.stringify(dirs) !== JSON.stringify(local.map(e=>e.id).sort())) throw new Error('Skill directories and catalog entries disagree');
  return Promise.all(entries.map(async e=>{
    if (e.origin === 'curated') {
      if (e.sourceId && !sources[e.sourceId]) throw new Error(`Unknown upstream: ${e.id}`);
      const s = sources[e.sourceId];
      if (e.upstreamPath && e.url !== `https://github.com/${s?.repo}/blob/${s?.revision}/${e.upstreamPath}/SKILL.md`) throw new Error(`Unpinned selection URL: ${e.id}`);
      const p = lock.packages.find(p=>p.id===e.id);
      if (e.vendorPath) parseSkill(await readFile(resolve(root,`${e.vendorPath}/SKILL.md`),'utf8'),e.id,false);
      return {...e, source:e.url, sourceName:s?.title ?? e.author, upstreamRevision:s?.revision, upstreamRepo:s?.repo, packageSource:e.vendorPath ? `${repository}/tree/main/${e.vendorPath}` : undefined, licenseSource:p ? `${repository}/blob/main/${p.licensePath}` : undefined, fileCount:p?.files.length};
    }
    const path = await realpath(resolve(root,e.sourcePath));
    if (!path.startsWith(`${rootPath}${sep}`)) throw new Error(`Source escapes repository: ${e.id}`);
    const skill = parseSkill(await readFile(path,'utf8'),e.id);
    return {...e, title:skill.name.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '), description:skill.description, sourceName:'Jordan’s starters', source:`${repository}/blob/main/${e.sourcePath}`};
  }));
}
