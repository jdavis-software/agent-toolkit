import { createHash } from 'node:crypto';
import { lstatSync, openSync, readSync, closeSync, fstatSync, constants } from 'node:fs';
import { resolve, parse, relative, join, sep } from 'node:path';
export const MAX_BYTES = 2 * 1024 * 1024;
export const hash = value => createHash('sha256').update(value).digest('hex');
export function check(ok, code) { if (!ok) throw new Error(code); }
export function object(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
export function doc(v) { check(object(v) && v.schemaVersion === 1, 'invalid-document'); }
export const id = v => typeof v === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._:/#-]{0,159}$/.test(v);
export const digest = v => typeof v === 'string' && /^[a-f0-9]{64}$/.test(v);
export const revision = v => typeof v === 'string' && /^[a-f0-9]{40,64}$/.test(v);
export const instant = v => typeof v === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(v) && Number.isFinite(Date.parse(v));
export function canonical(v, depth=0) {
  check(depth < 50, 'input-too-deep');
  if (Array.isArray(v)) return '[' + v.map(x=>canonical(x,depth+1)).join(',') + ']';
  if (object(v)) return '{' + Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k],depth+1)).join(',') + '}';
  return JSON.stringify(v);
}
export function readText(path) {
  const absolute=resolve(path), root=parse(absolute).root;
  let p=root;
  for (const part of relative(root,absolute).split(sep)) { p=join(p,part); check(!lstatSync(p).isSymbolicLink(),'symlink-input'); }
  const fd=openSync(absolute,constants.O_RDONLY|(constants.O_NOFOLLOW??0)|(constants.O_NONBLOCK??0));
  try {
    const stat=fstatSync(fd); check(stat.isFile() && stat.size<=MAX_BYTES,'invalid-input-file');
    const buffer=Buffer.alloc(MAX_BYTES+1); let n=0, got;
    while (n<buffer.length && (got=readSync(fd,buffer,n,buffer.length-n,null))>0) n+=got;
    check(n<=MAX_BYTES,'input-too-large');
    return new TextDecoder('utf-8',{fatal:true}).decode(buffer.subarray(0,n));
  } finally { closeSync(fd); }
}
export function readJSON(path) { const v=JSON.parse(readText(path)); canonical(v); return v; }
export function freshness(observedAt, now, maxAgeSeconds) {
  check(instant(observedAt) && Number.isFinite(now) && Number.isSafeInteger(maxAgeSeconds) && maxAgeSeconds>=1 && maxAgeSeconds<=86400,'invalid-observation-time');
  const age=now-Date.parse(observedAt); return age>=-5000 && age<=maxAgeSeconds*1000;
}
export const limits = ['Observations and hashes are not authenticated permissions or attestations.', 'No worker launch, model call, tracker mutation, installation, or cleanup.', 'The executing adapter must enforce actual ownership, access, budgets, and acceptance.'];
