// Explicit upstream-tool smoke. Uses disposable local fixtures, no model/account calls.
import { mkdtemp,writeFile,readFile,mkdir,rm,symlink } from 'node:fs/promises';
import { execFileSync,spawnSync } from 'node:child_process';
import { join,resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { parseArgs } from 'node:util';
import assert from 'node:assert/strict';
import { openRPC } from '../../tools/lib/local-adapter/rpc.mjs';
const {values:v}=parseArgs({options:{gopls:{type:'string'},oasdiff:{type:'string'},'nx-package':{type:'string'}}});
for(const k of ['gopls','oasdiff','nx-package'])if(!v[k])throw new Error('Explicit tool paths required');
const root=await mkdtemp(join(tmpdir(),'practical-tooling-'));
const run=(command,args,cwd,extra={})=>execFileSync(command,args,{cwd,env:{...process.env,GOTELEMETRY:'off',NX_DAEMON:'false',NX_NO_CLOUD:'true',NX_TUI:'false',NX_INTERACTIVE:'false',...extra},encoding:'utf8',timeout:90000,maxBuffer:2*1024*1024,stdio:['ignore','pipe','pipe']});
const report={schemaVersion:1,scope:'real upstream binaries; disposable Linux fixtures',modelCalls:0,checks:[]};
try {
 const go=join(root,'go');await mkdir(go);await writeFile(join(go,'go.mod'),'module example.invalid/canary\n\ngo 1.23.0\n');
 const lines=['package canary','','func ToolkitCanary() int { return 41 }','func UseCanary() int { return ToolkitCanary() }'];
 const file=join(go,'canary.go');await writeFile(file,lines.join('\n')+'\n');
 const version=run(v.gopls,['version'],go);assert.match(version,/v0\.23\.0/);
 const definition=run(v.gopls,['definition',`${file}:4:${lines[3].indexOf('ToolkitCanary')+1}`],go,{GOPROXY:'off'});assert.match(definition,/canary\.go:3:/);
 const rpc=openRPC(v.gopls,['mcp'],{cwd:go,env:{...process.env,GOPROXY:'off',GOTELEMETRY:'off'},timeoutMs:30000});
 let toolCount;
 try {const init=await rpc.request('initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'toolkit-fixture',version:'0.1.0'}});assert(init.protocolVersion);rpc.notify('notifications/initialized');const listed=await rpc.request('tools/list',{});assert(Array.isArray(listed.tools)&&listed.tools.length>0);toolCount=listed.tools.length;}finally{await rpc.close();}
 report.checks.push({tool:'gopls',version:version.trim(),definition:'passed',mcpDiscovery:'passed',toolCount,mcpOperations:'not-exhaustively-tested'});
 const nxroot=join(root,'nx');await mkdir(nxroot);await symlink(resolve(v['nx-package'],'node_modules'),join(nxroot,'node_modules'),'dir');
 await writeFile(join(nxroot,'package.json'),JSON.stringify({name:'toolkit-canary',private:true,devDependencies:{nx:'23.2.1'}}));
 await writeFile(join(nxroot,'nx.json'),JSON.stringify({defaultBase:'main',plugins:[]}));
 for(const name of ['alpha','beta']){await mkdir(join(nxroot,name));await writeFile(join(nxroot,name,'project.json'),JSON.stringify({name,root:name,implicitDependencies:name==='beta'?['alpha']:[],targets:{}}));}
 const nxPackage=resolve(v['nx-package'],'node_modules/nx');
 const nxMetadata=JSON.parse(await readFile(join(nxPackage,'package.json'),'utf8'));assert.equal(nxMetadata.version,'23.2.1');
 const nxEntry=typeof nxMetadata.bin==='string'?nxMetadata.bin:nxMetadata.bin?.nx;assert.equal(typeof nxEntry,'string');
 const nx=resolve(nxPackage,nxEntry);
 const projects=JSON.parse(run(process.execPath,[nx,'show','projects','--json'],nxroot));assert.deepEqual(projects.sort(),['alpha','beta']);
 const beta=JSON.parse(run(process.execPath,[nx,'show','project','beta','--json'],nxroot));assert(beta.implicitDependencies.includes('alpha'));
 report.checks.push({tool:'nx',version:'23.2.1',projectDiscovery:'passed',dependency:'passed',mcpHostBinding:'not-run'});
 const base={openapi:'3.0.3',info:{title:'fixture',version:'1.0.0'},paths:{'/health':{get:{operationId:'health',responses:{'200':{description:'ok'}}}}}};
 const baseFile=join(root,'base.json'),changedFile=join(root,'changed.json');await writeFile(baseFile,JSON.stringify(base));await writeFile(changedFile,JSON.stringify({...base,paths:{}}));
 const same=spawnSync(v.oasdiff,['breaking',baseFile,baseFile,'--format','json','--fail-on','ERR'],{encoding:'utf8',timeout:30000,maxBuffer:2*1024*1024});assert.equal(same.status,0,same.stderr);
 const changed=spawnSync(v.oasdiff,['breaking',baseFile,changedFile,'--format','json','--fail-on','ERR'],{encoding:'utf8',timeout:30000,maxBuffer:2*1024*1024});assert.equal(changed.status,1,changed.stderr);assert(JSON.parse(changed.stdout));assert.match(changed.stdout,/health/);
 report.checks.push({tool:'oasdiff',version:run(v.oasdiff,['--version'],root).trim(),identical:'passed',removedOperation:'rejected-as-required'});
 console.log(JSON.stringify(report,null,2));
}finally{await rm(root,{recursive:true,force:true});}
