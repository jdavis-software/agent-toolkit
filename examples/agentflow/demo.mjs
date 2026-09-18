// Synthetic demonstration only: no workers, models, external effects, or shell commands.
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRun, appendEvent, replayRun, taskDigests, schedule } from '../../tools/lib/agentflow.mjs';
const plan=JSON.parse(await readFile(new URL('./plan.json',import.meta.url),'utf8'));
const capabilities=JSON.parse(await readFile(new URL('./capabilities.json',import.meta.url),'utf8'));
const directory=await mkdtemp(join(tmpdir(),'agentflow-demo-'));
try {
  const initial=await schedule(plan,capabilities);
  let run=createRun(plan); const digests=taskDigests(plan);
  const record=event=>{run=appendEvent(run,event,replayRun(run).head);};
  for(const taskId of ['api','ui']) {
    const common={taskId,taskDigest:digests.get(taskId),attempt:1};
    record({...common,id:taskId+'-start',type:'started',workerId:'fixture-editor'});
    const bytes=Buffer.from('Synthetic '+taskId+' fixture; not an agent output.\n');
    await writeFile(join(directory,taskId+'.txt'),bytes);
    record({...common,id:taskId+'-submit',type:'submitted',usedTokens:0,evidence:['synthetic-fixture'],artifact:{path:taskId+'.txt',sha256:createHash('sha256').update(bytes).digest('hex')}});
    record({...common,id:taskId+'-accept',type:'accepted',reviewer:'fixture-reviewer',evidence:['synthetic-review-not-real-host-evidence']});
  }
  const resumed=await schedule(plan,capabilities,{run,artifactRoot:directory});
  await writeFile(join(directory,'api.txt'),'Changed fixture\n');
  const stale=await schedule(plan,capabilities,{run,artifactRoot:directory});
  if(initial.selected.length!==2 || resumed.selected[0]?.taskId!=='review' || !stale.blocked.some(t=>t.taskId==='api'&&t.reason==='stale-artifact'))throw new Error('Demonstration invariant failed');
  console.log(JSON.stringify({demonstration:'synthetic',initial:initial.selected.map(t=>t.taskId),resume:resumed.selected.map(t=>t.taskId),afterArtifactChange:stale.blocked,execution:'none'},null,2));
} finally {await rm(directory,{recursive:true,force:true});}
