#!/usr/bin/env node
import { readJSON } from './lib/harness/common.mjs';
import { probeLocal } from './lib/local-adapter/probe.mjs';
const [cmd,path,...extra]=process.argv.slice(2);
if(cmd==='--help'||!cmd)console.log('local-adapter probe /absolute/private-config.json\nExplicitly starts local Codex app-server for account/skill reads and optionally calls gh for exact issue reads. No model turn or tracker write. See docs/LOCAL_ADAPTER.md.');
else try {
  if(cmd!=='probe'||!path||extra.length)throw new Error('Invalid command');
  const report=await probeLocal(readJSON(path));console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=3;
}catch(e){console.error(JSON.stringify({ok:false,state:'blocked',reason:e.code??'adapter-probe-failed',workerInvocation:'not-run',integrationAcceptance:'not-evaluated'}));process.exitCode=2;}
