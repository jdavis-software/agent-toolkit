#!/usr/bin/env node
import {open} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {validatePlan,validateDebug,validateTestDesign,validateInterface} from './lib/contracts.mjs';
import {inspectWorktree} from './lib/worktree.mjs';
import {runCheck,verifyReceipt} from './lib/runner.mjs';
const help=`Jordan's skillcheck — local helpers, not an agent runtime

plan FILE.json
snapshot --repo DIR --base REF [--scope src/] [--scope test.js] [--require-clean]
run --repo DIR --id CHECK [--timeout-ms 60000] -- COMMAND ARG...
verify RECEIPT.json --repo DIR
report debug|test-design|interface FILE.json

JSON goes to stdout. Exit 0 = passed/structurally valid; 1 = check failed;
2 = invalid invocation or unavailable input. Store receipts OUTSIDE the target
repository to avoid changing the state being measured. run executes exactly the
explicit command with caller permissions; there is no shell unless YOU name one.
No automatic installation, fetch, merge, cleanup, network request, or model call.
`;
async function jsonFile(path) {
  if(!path) throw new Error('Missing JSON file');
  const handle=await open(path,'r');
  try {
    if(!(await handle.stat()).isFile()) throw new Error('JSON input must be a regular file');
    const buffer=Buffer.alloc(1048577); let used=0;
    while(used<buffer.length) {const {bytesRead}=await handle.read(buffer,used,buffer.length-used,null);if(!bytesRead)break;used+=bytesRead;}
    if(used>1048576) throw new Error('JSON input exceeds 1 MiB');
    return JSON.parse(buffer.subarray(0,used).toString('utf8'));
  } finally {await handle.close();}
}
function options(args,allowed) {
  const out={scope:[]};
  for(let i=0;i<args.length;i++) {
    const flag=args[i];
    if(!allowed.includes(flag)) throw new Error(`Unknown option: ${flag}`);
    if(flag==='--require-clean') {out.requireClean=true;continue;}
    const value=args[++i];
    if(value===undefined || value.startsWith('--')) throw new Error(`Missing value for ${flag}`);
    if(flag==='--scope') out.scope.push(value);
    else {const key=flag.slice(2);if(Object.hasOwn(out,key))throw new Error(`Duplicate option: ${flag}`);out[key]=value;}
  }
  return out;
}
export async function main(args) {
  const [command,...rest]=args;
  if(!command || command==='--help' || command==='help') {process.stdout.write(help);return 0;}
  let result;
  if(command==='plan') {if(rest.length!==1)throw new Error('Use plan FILE.json');result=validatePlan(await jsonFile(rest[0]));}
  else if(command==='snapshot') {
    const o=options(rest,['--repo','--base','--scope','--require-clean']);
    if(!o.repo || !o.base)throw new Error('snapshot requires --repo and an explicit --base');
    result=inspectWorktree(o.repo,{base:o.base,scopes:o.scope,requireClean:o.requireClean});
  } else if(command==='run') {
    const separator=rest.indexOf('--');if(separator<0)throw new Error('Separate the reviewed command with --');
    const o=options(rest.slice(0,separator),['--repo','--id','--timeout-ms']);
    if(!o.repo || !o.id)throw new Error('run requires --repo and --id');
    result=await runCheck({repo:o.repo,id:o.id,argv:rest.slice(separator+1),timeoutMs:o['timeout-ms']===undefined?60000:Number(o['timeout-ms'])});
  } else if(command==='verify') {
    const [file,...flags]=rest,o=options(flags,['--repo']);if(!o.repo)throw new Error('verify requires --repo');
    result=verifyReceipt(await jsonFile(file),o.repo);
  } else if(command==='report') {
    if(rest.length!==2)throw new Error('Use report TYPE FILE.json');
    const validators={'debug':validateDebug,'test-design':validateTestDesign,'interface':validateInterface};
    const validate=Object.hasOwn(validators,rest[0])?validators[rest[0]]:null;
    if(typeof validate!=='function')throw new Error('Unknown report type');
    result=validate(await jsonFile(rest[1]));
  } else throw new Error(`Unknown command: ${command}`);
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  return (Object.hasOwn(result,'ok')?result.ok:result.status==='passed')?0:1;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {process.exitCode=await main(process.argv.slice(2));}
  catch(error){process.stderr.write(JSON.stringify({ok:false,error:error.message})+'\n');process.exitCode=2;}
}
