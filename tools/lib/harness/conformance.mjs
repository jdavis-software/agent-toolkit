import { check, id, canonical, hash } from './common.mjs';
// These are behavior tests, not a scheduling or permission implementation.
// A caller-owned adapter implements setup/apply/snapshot/dispose. No module is loaded from JSON.
export const controllerCases = [
  {id:'filtered-blocker',setup:{prerequisite:'unknown'},actions:[{type:'dispatch'}],accept:s=>s.dispatches===0&&s.taskState==='blocked'},
  {id:'restart-active-worker',setup:{active:true,epoch:1},actions:[{type:'restart',epoch:2},{type:'dispatch'}],accept:s=>s.dispatches===1&&s.activeAttempts===1&&s.requiresReconciliation===true},
  {id:'cancel-is-not-complete',setup:{active:true,epoch:1},actions:[{type:'cancel'}],accept:s=>s.accepted===false&&s.taskState==='cancelled'},
  {id:'retain-unaccepted-source',setup:{dirty:true},actions:[{type:'cleanup'}],accept:s=>s.sourcePreserved===true&&s.cleanupPermitted===false},
  {id:'reject-stale-submission',setup:{active:true,epoch:2},actions:[{type:'submit',epoch:1}],accept:s=>s.accepted===false&&s.submitted===false&&s.staleRejected===true},
  {id:'failed-integration',setup:{active:true,epoch:1},actions:[{type:'submit',epoch:1},{type:'accept',checksPassed:false}],accept:s=>s.accepted===false&&s.taskState!=='accepted'},
  {id:'exit-is-not-acceptance',setup:{active:true,epoch:1},actions:[{type:'exit',code:0}],accept:s=>s.accepted===false&&s.taskState==='submitted'}
];
export async function runControllerSuite(factory,identity) {
  check(typeof factory==='function'&&identity&&id(identity.id)&&id(identity.revision)&&['fixture','adapter'].includes(identity.kind),'invalid-controller-adapter');
  const results=[];
  for(const test of controllerCases) {
    let adapter;
    try {
      adapter=await factory(test.id);
      check(adapter&&['setup','apply','snapshot','dispose'].every(k=>typeof adapter[k]==='function'),'invalid-controller-adapter');
      await adapter.setup(structuredClone(test.setup));
      for(const action of test.actions)await adapter.apply(structuredClone(action));
      const state=await adapter.snapshot();
      results.push({caseId:test.id,passed:test.accept(state)===true,observationSha256:hash(canonical(state))});
    } catch {results.push({caseId:test.id,passed:false,error:'adapter-or-observation-failure'});}
    finally { if(adapter)try{await adapter.dispose();}catch{results.at(-1).passed=false;results.at(-1).error='adapter-disposal-failure';} }
  }
  return {schemaVersion:1,kind:'controller-conformance',ok:results.every(r=>r.passed),identity,results,limits:['Fixture results are not qualification of an installed controller.','The adapter owns scratch scope, credentials, actual observation, process deadlines and preservation.','Identity and observations are caller supplied, not authenticated. In-process exceptions are caught; a hung adapter requires an external timeout.']};
}
