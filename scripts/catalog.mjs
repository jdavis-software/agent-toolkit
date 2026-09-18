import { readFile, readdir, realpath } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { load } from 'js-yaml';
// Astro bundles this module into dist/.prerender. Resolve source inputs from
// the project working directory, not the location of the generated chunk.
// Run repository commands from the root (or use pnpm --dir <repo>).
export const root = resolve(process.cwd());
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateEntries(entries) {
  if (!Array.isArray(entries)) throw new Error('Catalog must be an array');
  const ids = new Set();
  for (const e of entries) {
    if (!slugPattern.test(e.id) || e.id.length > 64 || ids.has(e.id)) throw new Error(`Invalid or duplicate id: ${e.id}`);
    ids.add(e.id);
    if(e.companionTools!==undefined && (!Array.isArray(e.companionTools)||e.companionTools.some(id=>!['agentflow','sourcekit'].includes(id))||new Set(e.companionTools).size!==e.companionTools.length))throw new Error(`Invalid companion tools: ${e.id}`);
    if (!['skill','tool','workflow'].includes(e.kind)) throw new Error(`Invalid kind: ${e.id}`);
    if (!['original','adapted','curated'].includes(e.origin)) throw new Error(`Invalid origin: ${e.id}`);
    if (!['experimental','validated','released','reference','deprecated'].includes(e.stage)) throw new Error(`Invalid stage: ${e.id}`);
    for (const key of ['category','author','note','outcome']) if (typeof e[key] !== 'string' || !e[key].trim()) throw new Error(`Missing ${key}: ${e.id}`);
    for (const key of ['requires','testedHosts','evidence']) if (!Array.isArray(e[key]) || e[key].some(v => typeof v !== 'string')) throw new Error(`Invalid ${key}: ${e.id}`);
    if (e.origin === 'curated') {
      if (!e.title?.trim() || !e.description?.trim() || e.sourcePath || e.stage !== 'reference') throw new Error(`Invalid reference: ${e.id}`);
      const url = new URL(e.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Invalid source URL: ${e.id}`);
    } else if (e.kind === 'tool') {
      if (e.origin !== 'original' || !/^tools\/[a-z][a-z0-9-]*\.mjs$/.test(e.sourcePath) || !/^docs\/[A-Z_]+\.md$/.test(e.docsPath) || !e.title?.trim() || !e.description?.trim() || e.stage !== 'experimental') throw new Error(`Invalid original tool: ${e.id}`);
    } else {
      if (e.kind !== 'skill' || e.sourcePath !== `skills/${e.id}/SKILL.md`) throw new Error(`Invalid source path: ${e.id}`);
      if (e.title || e.description) throw new Error(`Name and description belong in SKILL.md: ${e.id}`);
      if (e.origin === 'adapted' && (!e.upstreamRevision || !e.upstreamUrl || !e.licensePath)) throw new Error(`Missing adaptation provenance: ${e.id}`);
      if (['validated','released'].includes(e.stage) && (!e.evidence.length || !e.testedHosts.length)) throw new Error(`Unsupported validation claim: ${e.id}`);
    }
  }
  return entries;
}
export function parseSkill(text, id) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${id}`);
  const data = load(match[1]);
  if (!data || typeof data !== 'object' || data.name !== id || typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) throw new Error(`Invalid skill frontmatter: ${id}`);
  for (const heading of ['When to use','When not to use','Procedure','Output','Failure handling','Example']) if (!match[2].includes(`## ${heading}`)) throw new Error(`Missing ${heading}: ${id}`);
  const title = match[2].match(/^# (.+)$/m)?.[1] ?? data.name.split('-').map(word => word[0].toUpperCase()+word.slice(1)).join(' ');
  return { name: data.name, title, description: data.description, body: match[2] };
}
export async function loadCatalog() {
  const manifest = JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
  if (manifest.name !== 'agent-toolkit') throw new Error('Run catalog commands from the agent-toolkit repository root');
  const entries = validateEntries(JSON.parse(await readFile(resolve(root, 'catalog/entries.json'),'utf8')));
  const rootPath = await realpath(root);
  const local = entries.filter(e => e.kind === 'skill' && e.origin !== 'curated');
  const dirs = (await readdir(resolve(root,'skills'),{withFileTypes:true})).filter(e => e.isDirectory()).map(e => e.name).sort();
  if (JSON.stringify(dirs) !== JSON.stringify(local.map(e => e.id).sort())) throw new Error('Skill directories and catalog entries disagree');
  return Promise.all(entries.map(async e => {
    if (e.origin === 'curated') return {...e, source: e.url};
    const path = await realpath(resolve(root,e.sourcePath));
    if (!path.startsWith(`${rootPath}${sep}`)) throw new Error(`Source escapes repository: ${e.id}`);
    if (e.kind === 'tool') {
      const docPath=await realpath(resolve(root,e.docsPath));
      if(!docPath.startsWith(`${rootPath}${sep}`)) throw new Error(`Docs escape repository: ${e.id}`);
      return {...e, source: `https://github.com/jdavis-software/agent-toolkit/blob/main/${e.sourcePath}`, documentation: `https://github.com/jdavis-software/agent-toolkit/blob/main/${e.docsPath}`};
    }
    const skill = parseSkill(await readFile(path,'utf8'),e.id);
    return {...e, title: skill.title, description: skill.description, source: `https://github.com/jdavis-software/agent-toolkit/blob/main/${e.sourcePath}`};
  }));
}
