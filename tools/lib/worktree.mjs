import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {lstatSync, readFileSync, readlinkSync, realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {validScope, ownsPath} from './contracts.mjs';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const LIMIT=32*1024*1024;
function gitEnvironment() {
  const env={...process.env};
  // An inherited repository override must not silently redirect evidence collection.
  for (const key of Object.keys(env)) if (/^GIT_(DIR|WORK_TREE|COMMON_DIR|INDEX_FILE|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|CONFIG.*|EXTERNAL_DIFF|DIFF_OPTS|PREFIX)$/.test(key)) delete env[key];
  return {...env,GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
}
function git(repo,args) {
  const r=spawnSync('git',['--no-pager','-c','core.fsmonitor=false','-c','core.untrackedCache=false',...args],{cwd:repo,env:gitEnvironment(),shell:false,timeout:10000,maxBuffer:LIMIT});
  if (r.error || r.status!==0) throw new Error(`Git ${args[0]} failed: ${r.error?.code ?? r.stderr?.toString('utf8').trim() ?? r.status}`);
  return r.stdout;
}
const line = buffer => buffer.toString('utf8').replace(/\r?\n$/,'');
function revision(repo,ref) {
  if (typeof ref!=='string' || !ref || ref.startsWith('-') || ref.includes('\0')) throw new Error('Expected an explicit, non-option Git revision');
  return line(git(repo,['rev-parse','--verify','--end-of-options',`${ref}^{commit}`]));
}
export function parseStatus(buffer) {
  const parts=buffer.toString('utf8').split('\0'), result=[];
  for (let i=0;i<parts.length && parts[i];i++) {
    const raw=parts[i];
    if (raw.length<4 || raw[2]!==' ') throw new Error('Unrecognized Git porcelain status record');
    const code=raw.slice(0,2), path=raw.slice(3), paths=[path];
    if (/[RC]/.test(code)) {
      const old=parts[++i]; if (!old) throw new Error('Incomplete Git rename record'); paths.push(old);
    }
    const layers=code==='??' ? ['untracked'] : [code[0]!==' ' ? 'staged' : '',code[1]!==' ' ? 'unstaged' : ''].filter(Boolean);
    result.push({code,paths,layers});
  }
  return result;
}
export function inspectWorktree(repo,{base='HEAD',scopes=[],requireClean=false}={}) {
  if (typeof repo!=='string' || !repo) throw new Error('Repository directory is required');
  if (!Array.isArray(scopes) || !scopes.every(validScope)) throw new Error('Scopes must be literal relative files or directory prefixes ending in /');
  const requested=realpathSync(resolve(repo));
  const root=line(git(requested,['rev-parse','--show-toplevel']));
  const head=revision(root,'HEAD'), baseCommit=revision(root,base);
  const comparisonBase=line(git(root,['merge-base',baseCommit,head]));
  const branch=line(git(root,['branch','--show-current'])) || null;
  const statusBytes=git(root,['status','--porcelain=v1','-z','--untracked-files=all','--ignore-submodules=none']);
  const status=parseStatus(statusBytes);
  if (status.length>10000) throw new Error('Too many changed files for a bounded snapshot');
  const committed=git(root,['diff','--no-ext-diff','--no-textconv','--no-renames','--name-only','-z',`${comparisonBase}..${head}`,'--']).toString('utf8').split('\0').filter(Boolean);
  const staged=git(root,['diff','--no-ext-diff','--no-textconv','--binary','--cached','HEAD','--']);
  const unstaged=git(root,['diff','--no-ext-diff','--no-textconv','--binary','--']);
  const untracked=[]; let bytes=0;
  for (const entry of status.filter(e=>e.code==='??')) {
    const p=entry.paths[0], path=resolve(root,p), stat=lstatSync(path);
    // Hash a link's destination text, never follow it outside the worktree.
    if (!stat.isFile() && !stat.isSymbolicLink()) throw new Error(`Unsupported untracked file type: ${p}`);
    bytes+=stat.size;
    if (bytes>LIMIT) throw new Error('Untracked contents exceed the 32 MiB snapshot limit');
    const content=stat.isSymbolicLink() ? Buffer.from(readlinkSync(path)) : readFileSync(path);
    untracked.push({path:p,kind:stat.isSymbolicLink()?'symlink':'file',sha256:digest(content)});
  }
  const stateSha256=digest(JSON.stringify({head,status:digest(statusBytes),staged:digest(staged),unstaged:digest(unstaged),untracked}));
  const paths=new Map();
  const add=(p,layers)=>paths.set(p,[...new Set([...(paths.get(p)??[]),...layers])]);
  committed.forEach(p=>add(p,['committed']));
  status.forEach(e=>e.paths.forEach(p=>add(p,e.layers)));
  const changes=[...paths].sort(([a],[b])=>a.localeCompare(b)).map(([path,layers])=>({path,layers}));
  const outOfScope=scopes.length ? changes.filter(e=>!scopes.some(scope=>ownsPath(scope,e.path))).map(e=>e.path) : [];
  // Detect ordinary concurrent edits during collection; this is not an atomic snapshot.
  if (revision(root,'HEAD')!==head || !git(root,['status','--porcelain=v1','-z','--untracked-files=all','--ignore-submodules=none']).equals(statusBytes)) throw new Error('Worktree changed while collecting evidence; retry when quiescent');
  const dirty=status.length>0;
  return {schemaVersion:1,kind:'worktree-snapshot',ok:outOfScope.length===0 && (!requireClean || !dirty),head,baseCommit,comparisonBase,branch,dirty,stateSha256,changes,outOfScope,scopeChecked:scopes.length>0,coverage:'Git-visible tracked diffs and nonignored untracked contents; excludes ignored inputs, external state and environment; not atomic or a sandbox'};
}
