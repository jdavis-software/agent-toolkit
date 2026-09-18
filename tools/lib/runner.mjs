import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {resolve} from 'node:path';
import {inspectWorktree} from './worktree.mjs';
function capture(limit) {
  const hash=createHash('sha256'), parts=[]; let bytes=0, kept=0;
  return {
    add(chunk) { const b=Buffer.from(chunk); hash.update(b); bytes+=b.length; const n=Math.min(limit-kept,b.length); if(n>0){parts.push(b.subarray(0,n));kept+=n;} },
    result() { return {text:Buffer.concat(parts).toString('utf8'),bytes,sha256:hash.digest('hex'),truncated:bytes>kept}; }
  };
}
export async function runCheck({repo,id,argv,timeoutMs=60000,outputLimit=65536}) {
  if (typeof id!=='string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('A lowercase check id is required');
  if (!Array.isArray(argv) || !argv.length || argv.some(a=>typeof a!=='string'||a.includes('\0')) || !argv[0].trim()) throw new Error('Command must be an argument array');
  if (!Number.isInteger(timeoutMs) || timeoutMs<50 || timeoutMs>600000) throw new Error('Timeout must be 50–600000 ms');
  if (!Number.isInteger(outputLimit) || outputLimit<1 || outputLimit>1048576) throw new Error('Output limit must be 1–1048576 bytes per stream');
  const before=inspectWorktree(repo), startedAt=new Date().toISOString(), started=performance.now();
  const stdout=capture(outputLimit), stderr=capture(outputLimit);
  let timedOut=false, spawnError=null;
  const processResult=await new Promise(resolveResult=>{
    const child=spawn(argv[0],argv.slice(1),{cwd:resolve(repo),shell:false,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
    let settled=false, forceTimer;
    const finish=(code,signal)=>{if(settled)return;settled=true;clearTimeout(timer);clearTimeout(forceTimer);resolveResult({code,signal});};
    child.stdout.on('data',chunk=>stdout.add(chunk)); child.stderr.on('data',chunk=>stderr.add(chunk));
    child.on('error',e=>{spawnError=e.code??e.message;});
    child.on('close',finish);
    const timer=setTimeout(()=>{
      timedOut=true;
      try { if(process.platform!=='win32' && child.pid) process.kill(-child.pid,'SIGKILL'); else child.kill('SIGKILL'); } catch { /* Already exited, or OS refused; still not a pass. */ }
      // Bound the collector even when escaped descendants retain inherited pipes.
      forceTimer=setTimeout(()=>{child.stdout.destroy();child.stderr.destroy();finish(null,'SIGKILL');},500);
    },timeoutMs);
  });
  let after=null, snapshotError=null;
  try { after=inspectWorktree(repo); } catch(e) { snapshotError=e.message; }
  const stateChanged=!after || before.stateSha256!==after.stateSha256;
  const status=timedOut?'timed-out':spawnError?'blocked':processResult.code!==0?'failed':stateChanged?'invalidated':'passed';
  return {schemaVersion:1,kind:'check-receipt',id,argv,startedAt,durationMs:Math.round(performance.now()-started),runtime:{node:process.version,platform:process.platform,arch:process.arch},timeoutMs,status,exitCode:processResult.code,signal:processResult.signal,spawnError,snapshotError,stateChanged,before,after,stdout:stdout.result(),stderr:stderr.result(),cache:'unknown',trust:'Local observation, not signed attestation. Command inherits caller permissions and environment. Review before sharing.'};
}
export function verifyReceipt(receipt,repo) {
  const errors=[];
  if(receipt?.schemaVersion!==1 || receipt?.kind!=='check-receipt') errors.push('Not a version 1 check receipt');
  if(receipt?.status!=='passed' || receipt?.exitCode!==0 || receipt?.signal!==null || receipt?.spawnError!==null || receipt?.snapshotError!==null || receipt?.stateChanged!==false) errors.push('Receipt is not a completed, unchanged, zero-exit check');
  const before=receipt?.before?.stateSha256, after=receipt?.after?.stateSha256;
  if(!/^[a-f0-9]{64}$/.test(before??'') || before!==after) errors.push('Before/after state fingerprints disagree or are absent');
  const current=inspectWorktree(repo);
  if(after!==current.stateSha256) errors.push('Evidence is stale for the current Git-visible state');
  return {ok:errors.length===0,errors,currentHead:current.head,currentStateSha256:current.stateSha256,trust:'Checks internal consistency and current state only; a caller can forge or edit local JSON. Does not authenticate its producer or external inputs.'};
}
