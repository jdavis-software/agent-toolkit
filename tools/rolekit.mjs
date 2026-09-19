#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRoles, resolveRole, stageRole, verifyStage } from './lib/roles.mjs';
const help='rolekit list | resolve ROLE [--root PATH --revision SHA] | stage ROLE --dest NEW_PATH --revision SHA [--root PATH] | verify PATH\nStaging writes a new immutable package only. No fetching, global installation, worker launch, or deletion.';
try {
 const {values:v,positionals:p}=parseArgs({allowPositionals:true,options:{root:{type:'string'},revision:{type:'string'},dest:{type:'string'},help:{type:'boolean'}}});
 const root=resolve(v.root??fileURLToPath(new URL('../',import.meta.url)));
 if(v.help || !p.length) console.log(help);
 else {
   const [cmd,arg,...rest]=p;
   if(rest.length || (cmd==='list'&&arg)) throw new Error('Unexpected arguments');
   let out;
   if(cmd==='list') out=await loadRoles(root);
   else if(cmd==='resolve'&&arg) out=await resolveRole(root,arg,v.revision?{expectedRevision:v.revision}:{});
   else if(cmd==='stage'&&arg&&v.dest&&v.revision) out=await stageRole(root,arg,v.dest,v.revision);
   else if(cmd==='verify'&&arg) out=await verifyStage(arg);
   else throw new Error('Invalid command; use --help');
   console.log(JSON.stringify(out,null,2));
 }
} catch(e) {console.error(e.message);process.exitCode=2;}
