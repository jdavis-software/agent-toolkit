#!/usr/bin/env node
// Explicit local file operations only. No agent, model, provider, or shell execution.
import { open } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateFlow, validateCapabilities, taskDigests, createRun, appendEvent, schedule, runStatus } from './lib/agentflow.mjs';

const HELP = `Agentflow — offline coordination, not an agent launcher
  plan <plan.json>
  capabilities <registry.json>
  schedule <plan.json> <registry.json>
  init <plan.json> --out <new-run.json>
  record <run.json> <event.json> --expect-head <sha256> --out <new-run.json>
  status <run.json>
  verify <run.json>
  resume <plan.json> <registry.json> <run.json> [--artifacts <directory>]
Writes create new files only; serialize updates externally. See docs/AGENTFLOW.md.
`;
async function readJSON(path) {
  const file=await open(path,constants.O_RDONLY | (constants.O_NOFOLLOW||0));
  try {
    const stat=await file.stat();
    if(!stat.isFile() || stat.size>2*1024*1024)throw new Error('Input must be a regular JSON file of at most 2 MiB');
    const data=await file.readFile('utf8');
    if(Buffer.byteLength(data)>2*1024*1024)throw new Error('Input too large');
    return JSON.parse(data);
  } finally {await file.close();}
}
async function writeNew(path,value) {
  const data=JSON.stringify(value,null,2)+'\n';
  if(Buffer.byteLength(data)>2*1024*1024)throw new Error('Output exceeds 2 MiB; archive and begin a new bounded run');
  const file=await open(path,'wx',0o600);
  try {await file.writeFile(data);await file.sync();} finally {await file.close();}
}
export async function main(argv) {
  if(argv.length===1 && ['--help','help'].includes(argv[0]))return HELP;
  const [command,...args]=argv, positional=[], options={};
  for(let i=0;i<args.length;i++) {
    const a=args[i];
    if(a.startsWith('--')) {
      if(!['--out','--expect-head','--artifacts'].includes(a)||options[a]!==undefined||!args[i+1]||args[i+1].startsWith('--'))throw new Error('Unknown, repeated, or incomplete option');
      options[a]=args[++i];
    } else positional.push(a);
  }
  const contracts={plan:[1,[]],capabilities:[1,[]],schedule:[2,[]],init:[1,['--out']],record:[2,['--expect-head','--out']],status:[1,[]],verify:[1,[]],resume:[3,['--artifacts']]};
  const spec=contracts[command];
  if(!spec||positional.length!==spec[0]||Object.keys(options).some(k=>!spec[1].includes(k)))throw new Error('Invalid command or argument count; use --help');
  if(['init','record'].includes(command) && !options['--out'])throw new Error('A new output file is required');
  if(command==='record'&&!options['--expect-head'])throw new Error('An expected journal head is required');
  const docs=await Promise.all(positional.map(readJSON)); let result;
  if(command==='plan')result={...validateFlow(docs[0]),taskDigests:Object.fromEntries(taskDigests(docs[0])),execution:'none'};
  if(command==='capabilities'){validateCapabilities(docs[0]);result={...docs[0],source:'caller-supplied; not live discovery',execution:'none'};}
  if(command==='schedule')result=await schedule(...docs);
  if(command==='init')result=createRun(docs[0]);
  if(command==='record')result=appendEvent(docs[0],docs[1],options['--expect-head']);
  if(command==='status'||command==='verify')result={...runStatus(docs[0]),verification:'journal consistency only; not signed or authenticated evidence'};
  if(command==='resume')result=await schedule(docs[0],docs[1],{run:docs[2],artifactRoot:options['--artifacts']});
  if(options['--out']) {await writeNew(options['--out'],result);return JSON.stringify({written:true,execution:'none'});}
  return JSON.stringify(result,null,2);
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then(output=>console.log(output)).catch(error=>{console.error(JSON.stringify({ok:false,error:error.message}));process.exitCode=1;});
}
