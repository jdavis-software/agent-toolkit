import { readFile, writeFile } from 'node:fs/promises';
import { loadCatalog } from './catalog.mjs';
export async function syncReadme({write=false}={}) {
  const entries=await loadCatalog();
  const rows=entries.filter(e=>e.kind==='skill').map(e=>`| [${e.title.replaceAll('|','\\|')}](${e.sourcePath}) | ${e.category} |`);
  const text=await readFile('README.md','utf8');
  const start='<!-- skill-index:start -->', end='<!-- skill-index:end -->';
  if(text.split(start).length!==2 || text.split(end).length!==2 || text.indexOf(start)>text.indexOf(end))throw new Error('Missing or duplicate README index markers');
  const next=text.slice(0,text.indexOf(start)+start.length)+'\n\n| Skill | Area |\n| --- | --- |\n'+rows.join('\n')+'\n\n'+text.slice(text.indexOf(end));
  if(next!==text) {
    if(!write)throw new Error('README skill index drift; run node scripts/readme.mjs --write');
    await writeFile('README.md',next);
  }
}
if(process.argv[1]?.endsWith('/scripts/readme.mjs')||process.argv[1]==='scripts/readme.mjs') syncReadme({write:process.argv.includes('--write')}).catch(e=>{console.error(e.message);process.exitCode=1;});
