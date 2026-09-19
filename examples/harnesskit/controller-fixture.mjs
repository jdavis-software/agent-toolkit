import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Deliberately small synthetic model, NOT a controller offered for real work.
// Each negative variant injects exactly the failure named by its fixture case.
export async function fixtureController(defect=null) {
  const root=await mkdtemp(join(tmpdir(),'harness-case-')), file=join(root,'unaccepted.txt');
  let state;
  return {
    async setup(input) {
      await writeFile(file,'synthetic work must survive', {mode:0o600});
      state={epoch:input.epoch??1,prerequisite:input.prerequisite??'accepted',dirty:input.dirty??false,dispatches:input.active?1:0,activeAttempts:input.active?1:0,requiresReconciliation:false,taskState:input.active?'running':'queued',accepted:false,submitted:false,cleanupPermitted:false,staleRejected:false};
    },
    async apply(a) {
      switch(a.type) {
        case 'dispatch':
          if(state.prerequisite!=='accepted'&&defect!=='filtered-blocker'){state.taskState='blocked';break;}
          if(state.requiresReconciliation||state.activeAttempts)break;
          state.dispatches++;state.activeAttempts++;state.taskState='running';break;
        case 'restart':state.epoch=a.epoch;state.requiresReconciliation=!!state.activeAttempts;
          if(defect==='restart-active-worker'){state.requiresReconciliation=false;state.activeAttempts=0;}break;
        case 'cancel':state.taskState='cancelled';state.activeAttempts=0;if(defect==='cancel-is-not-complete')state.accepted=true;break;
        case 'cleanup':if(defect==='retain-unaccepted-source'){await rm(file);state.cleanupPermitted=true;}break;
        case 'submit':
          if(a.epoch!==state.epoch&&defect!=='reject-stale-submission'){state.staleRejected=true;break;}
          state.submitted=true;state.taskState='submitted';break;
        case 'accept':if(state.submitted&&(a.checksPassed||defect==='failed-integration')){state.accepted=true;state.taskState='accepted';}break;
        case 'exit':state.taskState='submitted';state.submitted=true;state.activeAttempts=0;if(defect==='exit-is-not-acceptance')state.accepted=true;break;
        default:throw new Error('unknown-action');
      }
    },
    async snapshot(){let preserved=false;try{preserved=(await readFile(file,'utf8'))==='synthetic work must survive';}catch{}return {...state,sourcePreserved:preserved};},
    async dispose(){await rm(root,{recursive:true,force:true});}
  };
}
