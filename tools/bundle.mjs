#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { loadBundles, resolveBundle } from './lib/bundles.mjs';
import { loadRoles, resolveRole } from './lib/roles.mjs';

const help=`Jordan's Bundle Resolver — read-only skill selection

node tools/bundle.mjs roles [--root DIR]
node tools/bundle.mjs role ROLE [--root DIR] [--require-clean] [--expected-revision SHA]
node tools/bundle.mjs list [--root DIR]
node tools/bundle.mjs resolve BUNDLE [--root DIR] [--require-clean] [--expected-revision SHA]

JSON is written to stdout. Exit 0 = resolved; 2 = invalid or unavailable input.
This does not install skills, call models, start an MCP server, or run selected tools.
Keep generated manifests outside the checkout when requiring a clean Git state.
`;
export async function main(args=process.argv.slice(2)) {
  if(!args.length || (args.length===1 && args[0]==='--help')) {process.stdout.write(help);return;}
  const command=args.shift();
  if(!['list','resolve','roles','role'].includes(command))throw new Error('Unknown command');
  const id=['resolve','role'].includes(command)?args.shift():undefined;
  let root=process.cwd(), requireClean=false, expectedRevision;
  const seen=new Set();
  for(let i=0;i<args.length;i++) {
    const f=args[i];
    if(!['--root','--require-clean','--expected-revision'].includes(f)||seen.has(f))throw new Error('Unknown or duplicate option');
    seen.add(f);
    if(['list','roles'].includes(command)&&f!=='--root')throw new Error('Option is only supported by resolve');
    if(f==='--require-clean'){requireClean=true;continue;}
    const value=args[++i];if(!value||value.startsWith('--'))throw new Error('Missing option value');
    if(f==='--root')root=resolve(value);else expectedRevision=value;
  }
  const result=command==='list'?{schemaVersion:1,bundles:await loadBundles(root)}:command==='roles'?{schemaVersion:1,roles:await loadRoles(root),execution:'none'}:command==='role'?await resolveRole(root,id,{requireClean,expectedRevision}):await resolveBundle(root,id,{requireClean,expectedRevision});
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])) {
  main().catch(error=>{console.error(JSON.stringify({error:error.message}));process.exitCode=2;});
}
