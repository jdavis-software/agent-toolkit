// Disposable loopback-only synthetic API. No credentials, persistence or production integration.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '.build');
const data = { studio: [{id:'cedar',label:'Cedar collection',favorite:false},{id:'maple',label:'Maple studies',favorite:false}], docs: [{id:'guide',label:'Design guide',favorite:false}] };
const assets = new Map([['/', ['index.html','text/html']], ['/app.js',['app.js','text/javascript']], ['/app.css',['app.css','text/css']], ['/measurements.json',['measurements.json','application/json']], ['/THIRD_PARTY_NOTICES.txt',['THIRD_PARTY_NOTICES.txt','text/plain']]]);
const send = (res,status,value) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
let nextId = 1;
const server = createServer(async(req,res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:4343');
    if(req.method === 'GET' && assets.has(url.pathname)) { const [file,type] = assets.get(url.pathname); res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'}); res.end(await readFile(join(root,file))); return; }
    if(url.pathname === '/api/items' && req.method === 'GET') { const workspace = url.searchParams.get('workspace'); if(!Object.hasOwn(data,workspace)) return send(res,400,{error:'workspace'}); const q=(url.searchParams.get('q')??'').toLowerCase(); return send(res,200,data[workspace].filter(i=>i.label.toLowerCase().includes(q))); }
    if(!['POST','PUT'].includes(req.method) || !url.pathname.startsWith('/api/items')) return send(res,404,{error:'not-found'});
    if(req.headers.origin && req.headers.origin !== 'http://127.0.0.1:4343') return send(res,403,{error:'origin'});
    let body='';for await(const chunk of req){body+=chunk;if(body.length>4096){send(res,413,{error:'too-large'});return;}}
    const value=JSON.parse(body);if(!Object.hasOwn(data,value.workspace))return send(res,400,{error:'workspace'});
    if(req.method==='POST' && url.pathname==='/api/items') {
      if(typeof value.label!=='string'||value.label.trim().length<3||value.label.trim().length>60)return send(res,400,{error:'label'});
      if(value.label.toLowerCase()==='conflict')return send(res,409,{error:'conflict'});
      if(data[value.workspace].length>=100)return send(res,409,{error:'capacity'});
      const item={id:`created-${nextId++}`,label:value.label.trim(),favorite:false};data[value.workspace].push(item);return send(res,201,item);
    }
    const id=url.pathname.split('/')[3],item=data[value.workspace].find(i=>i.id===id);if(!item||typeof value.favorite!=='boolean')return send(res,400,{error:'item'});
    item.favorite=value.favorite;return send(res,200,item);
  } catch { if(!res.headersSent)send(res,400,{error:'invalid-fixture-request'});else res.end(); }
});
server.listen(4343,'127.0.0.1',()=>console.log('Synthetic frontend fixture: http://127.0.0.1:4343'));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
