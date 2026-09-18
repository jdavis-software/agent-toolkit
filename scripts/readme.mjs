import { readFile, writeFile } from 'node:fs/promises';
import { loadCatalog } from './catalog.mjs';
const start = '<!-- collection:start -->';
const end = '<!-- collection:end -->';
export async function syncReadme(check = true) {
  const entries = (await loadCatalog()).filter(e=>e.listed!==false);
  const text = await readFile('README.md','utf8');
  const a=text.indexOf(start), b=text.indexOf(end);
  if (a<0 || b<a) throw new Error('Missing README collection markers');
  const rows=entries.map(e=>`| [${e.title}](https://jdavis-software.github.io/agent-toolkit/${e.kind==='skill'?'skills':e.kind==='tool'?'tools':'workflows'}/${e.id}/) | ${e.sourceName} | ${e.vendorPath?'Source included':e.origin==='original'?'Experimental starter':'Upstream link'} |`);
  const section='\n\n| Selection | Source | Availability |\n| --- | --- | --- |\n'+rows.join('\n')+'\n\n';
  const expected=text.slice(0,a+start.length)+section+text.slice(b);
  if (check && text!==expected) throw new Error('README catalog drift: run node scripts/readme.mjs --write');
  if (!check) await writeFile('README.md',expected);
}
if (process.argv[1]?.endsWith('/readme.mjs')) await syncReadme(!process.argv.includes('--write'));
