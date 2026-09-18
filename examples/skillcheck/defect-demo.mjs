// Deliberately small, original fixtures. Neither implementation is upstream code.
import assert from 'node:assert/strict';
function searchController(discardObsolete) {
  let generation=0,visible=null;
  return {
    request(query) {const own=++generation;return results=>{if(!discardObsolete||own===generation)visible={query,results};};},
    cancel(){generation++;}, read(){return visible;}
  };
}
const cases=[
  {id:'search-normal-order',run:fixed=>{const c=searchController(fixed),a=c.request('a'),b=c.request('b');a(['a']);b(['b']);return c.read().query==='b';}},
  {id:'search-reverse-order',run:fixed=>{const c=searchController(fixed),a=c.request('a'),b=c.request('b');b(['b']);a(['a']);return c.read().query==='b';}},
  {id:'search-cancelled',run:fixed=>{const c=searchController(fixed),a=c.request('a');c.cancel();a(['a']);return c.read()===null;}},
  ...[99,100,101].map(now=>({id:`lease-at-${now}`,run:fixed=>{
    const lease={expiresAt:100}; const expired=fixed?now>=lease.expiresAt:now>lease.expiresAt;
    const accepted=!expired;if(accepted)lease.expiresAt=now+30;
    return now<100 ? accepted && lease.expiresAt===129 : !accepted && lease.expiresAt===100;
  }}))
];
const rows=cases.map(c=>({id:c.id,deliberatelyFaulty:c.run(false),corrected:c.run(true)}));
assert.ok(rows.every(c=>c.corrected),'A corrected fixture violated its independent expectation');
assert.equal(rows.filter(c=>!c.deliberatelyFaulty).length,3,'The probes must still detect their three seeded defects');
console.log(JSON.stringify({kind:'synthetic-defect-demo',cases:rows,seededFailuresDetected:3,correctedPasses:6,scope:'Controlled functions authored for this demo; not an agent run, production result, or benchmark against external repositories.'},null,2));
