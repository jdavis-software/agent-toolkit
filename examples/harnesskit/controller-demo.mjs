import assert from 'node:assert/strict';
import {controllerCases,runControllerSuite} from '../../tools/lib/harness/conformance.mjs';
import {fixtureController} from './controller-fixture.mjs';
const identity={id:'synthetic-controller',revision:'fixture-v1',kind:'fixture'};
const baseline=await runControllerSuite(()=>fixtureController(),identity);assert.equal(baseline.ok,true);
const defects=[];
for(const {id} of controllerCases) {
  const result=await runControllerSuite(()=>fixtureController(id),identity);
  assert.equal(result.ok,false);assert.equal(result.results.find(r=>r.caseId===id).passed,false);
  defects.push({defect:id,detected:true});
}
console.log(JSON.stringify({baseline,defects,scope:'Seven controlled defects in a synthetic fixture; no Codex, Symphony, Contrabass or GitHub tracker is exercised.'},null,2));
