import { spawn } from 'node:child_process';
import { access, readFile, realpath } from 'node:fs/promises';
import { constants } from 'node:fs';
import { isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
const limit=2*1024*1024;
export const hash=b=>createHash('sha256').update(b).digest('hex');
export async function executableIdentity(path) {
  if(typeof path!=='string'||!isAbsolute(path))throw new Error('Absolute executable required');
  const target=await realpath(path);await access(target,constants.X_OK);
  return {path:target,sha256:hash(await readFile(target))};
}
function signal(child,name) {
  if(!Number.isSafeInteger(child.pid)||child.exitCode!==null||child.signalCode!==null)return;
  try {if(process.platform==='win32')child.kill(name);else process.kill(-child.pid,name);}catch(e){if(e.code!=='ESRCH')throw e;}
}
// A bounded process created by this adapter only. No shell, arbitrary RPC proxy or inherited stdin.
export function openRPC(command,args,{cwd,env=process.env,timeoutMs=15000}={}) {
  if(!Number.isInteger(timeoutMs)||timeoutMs<100||timeoutMs>120000)throw new Error('Invalid RPC timeout');
  const child=spawn(command,args,{cwd,env,stdio:['pipe','pipe','pipe'],detached:process.platform!=='win32'});
  child.stdout.setEncoding('utf8');
  let buffer='',bytes=0,nextId=0,failure,closed=false,stderrBytes=0;
  const pending=new Map();
  const fail=code=>{if(failure)return;failure=new Error(code);for(const {reject,timer}of pending.values()){clearTimeout(timer);reject(failure);}pending.clear();signal(child,'SIGTERM');};
  const exited=new Promise(resolve=>child.once('close',(code,sig)=>{closed=true;for(const {reject,timer}of pending.values()){clearTimeout(timer);reject(new Error('RPC process exited'));}pending.clear();resolve({code,signal:sig});}));
  child.once('error',()=>fail('RPC executable unavailable'));
  child.stdin.on('error',()=>fail('RPC input closed'));
  child.stderr.on('data',chunk=>{stderrBytes+=chunk.length;if(stderrBytes>limit)fail('RPC stderr limit');});
  child.stdout.on('data',text=>{
    if(failure)return;
    bytes+=Buffer.byteLength(text);buffer+=text;
    if(bytes>8*limit||Buffer.byteLength(buffer)>limit){fail('RPC output limit');return;}
    let i;
    while((i=buffer.indexOf('\n'))>=0){
      const line=buffer.slice(0,i);buffer=buffer.slice(i+1);if(!line.trim())continue;
      let msg;try{msg=JSON.parse(line);}catch{fail('Invalid RPC JSON');return;}
      if(!msg||typeof msg!=='object'||Array.isArray(msg)){fail('Invalid RPC envelope');return;}
      if(msg.method&&msg.id!==undefined){ // Never auto-approve a server request.
        child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:msg.id,error:{code:-32601,message:'Unsupported by read-only probe'}})+'\n');continue;
      }
      const p=pending.get(msg.id);if(!p)continue;pending.delete(msg.id);clearTimeout(p.timer);
      if(msg.error)p.reject(new Error('RPC request rejected'));else if('result'in msg)p.resolve(msg.result);else p.reject(new Error('Invalid RPC response'));
    }
  });
  async function close(){
    child.stdin.end();
    const wait=ms=>new Promise(resolve=>{const timer=setTimeout(()=>resolve(false),ms);exited.then(()=>{clearTimeout(timer);resolve(true);});});
    if(!closed&&!await wait(1000)){signal(child,'SIGTERM');if(!await wait(1000)){signal(child,'SIGKILL');if(!await wait(1000))throw new Error('RPC process termination unconfirmed');}}
    return exited;
  }
  return {request(method,params={}){
    if(failure)return Promise.reject(failure);if(closed)return Promise.reject(new Error('RPC process closed'));
    return new Promise((resolve,reject)=>{const id=++nextId;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('RPC deadline exceeded'));signal(child,'SIGTERM');},timeoutMs);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});
  },notify(method,params={}){if(failure||closed)throw new Error('RPC process closed');child.stdin.write(JSON.stringify({jsonrpc:'2.0',method,params})+'\n');},close};
}
export async function capture(command,args,{cwd,env=process.env,timeoutMs=15000}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn(command,args,{cwd,env,stdio:['ignore','pipe','pipe'],detached:process.platform!=='win32'});
    let output='',bytes=0,failed=false;
    const timer=setTimeout(()=>{failed=true;signal(child,'SIGKILL');},timeoutMs);
    const collect=b=>{bytes+=b.length;if(bytes>limit){failed=true;signal(child,'SIGKILL');}};
    child.stdout.on('data',b=>{collect(b);if(!failed)output+=b.toString('utf8');});child.stderr.on('data',collect);
    child.once('error',()=>{clearTimeout(timer);reject(new Error('Probe executable unavailable'));});
    child.once('close',code=>{clearTimeout(timer);if(failed)reject(new Error('Probe deadline/output limit'));else if(code!==0)reject(new Error('Probe command failed'));else resolve(output);});
  });
}
