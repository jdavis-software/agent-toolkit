import { check, doc, object, id, hash, canonical, limits } from './common.mjs';
const integer=v=>Number.isSafeInteger(v)&&v>=0;
const checkedAdd=(a,b)=>{check(Number.isSafeInteger(a+b),'usage-overflow');return a+b;};
function usage(v) {
  check(object(v)&&integer(v.inputTokens)&&integer(v.outputTokens),'invalid-usage');
  for (const [key,total] of [['cachedInputTokens','inputTokens'],['reasoningOutputTokens','outputTokens']]) check(v[key]==null||(integer(v[key])&&v[key]<=v[total]),'invalid-usage-breakdown');
  return {inputTokens:v.inputTokens,outputTokens:v.outputTokens,cachedInputTokens:v.cachedInputTokens??null,reasoningOutputTokens:v.reasoningOutputTokens??null};
}
export function reconcileEvents(events) {
  check(Array.isArray(events)&&events.length>0&&events.length<=2000,'invalid-events');
  const seen=new Map(), counters=new Map(), kinds=new Map();
  const issues=[], normalized=[];let duplicates=0,input=0,output=0,cached=0,reasoning=0,cachedKnown=true,reasoningKnown=true;
  const turns=new Map();
  for (const e of events) {
    doc(e);check(id(e.eventId)&&id(e.attemptId)&&['turn-started','turn-completed','turn-failed','turn-interrupted','usage','item','gap'].includes(e.type),'invalid-event');
    const key=e.attemptId+'|'+e.eventId, bytes=canonical(e);
    if(seen.has(key)){check(seen.get(key)===bytes,'conflicting-event-id');duplicates++;continue;}seen.set(key,bytes);
    if(e.type.startsWith('turn-')) {
      check(id(e.turnId),'missing-turn-identity');const t=e.attemptId+'|'+e.turnId, current=turns.get(t);
      if(e.type==='turn-started'){if(current)issues.push('duplicate-turn-start');else turns.set(t,'running');}
      else if(current!=='running')issues.push('unmatched-turn-terminal');
      else turns.set(t,e.type.slice(5));
    }
    if(e.type==='gap') issues.push('source-coverage-gap');
    if(e.type==='usage') {
      check(id(e.counterId)&&id(e.counterEpoch)&&['delta','cumulative'].includes(e.basis),'invalid-counter');
      const u=usage(e.usage), scope=e.attemptId+'|'+e.counterId+'|'+e.counterEpoch;
      check(!kinds.has(scope)||kinds.get(scope)===e.basis,'mixed-counter-basis');kinds.set(scope,e.basis);
      let inc=u;
      if(e.basis==='cumulative') {
        const prev=counters.get(scope);
        if(prev===false){issues.push('unresolved-counter-reset');normalized.push({eventId:e.eventId,type:e.type,accepted:false});continue;}
        if(prev && (u.inputTokens<prev.inputTokens || u.outputTokens<prev.outputTokens || (u.cachedInputTokens!=null&&prev.cachedInputTokens!=null&&u.cachedInputTokens<prev.cachedInputTokens) || (u.reasoningOutputTokens!=null&&prev.reasoningOutputTokens!=null&&u.reasoningOutputTokens<prev.reasoningOutputTokens))){issues.push('counter-reset-needs-new-epoch');counters.set(scope,false);normalized.push({eventId:e.eventId,type:e.type,accepted:false});continue;}
        inc={inputTokens:u.inputTokens-(prev?.inputTokens??0),outputTokens:u.outputTokens-(prev?.outputTokens??0),cachedInputTokens:u.cachedInputTokens==null||prev?.cachedInputTokens===null?null:u.cachedInputTokens-(prev?.cachedInputTokens??0),reasoningOutputTokens:u.reasoningOutputTokens==null||prev?.reasoningOutputTokens===null?null:u.reasoningOutputTokens-(prev?.reasoningOutputTokens??0)};
        counters.set(scope,u);
      }
      input=checkedAdd(input,inc.inputTokens);output=checkedAdd(output,inc.outputTokens);
      if(inc.cachedInputTokens==null)cachedKnown=false;else cached=checkedAdd(cached,inc.cachedInputTokens);
      if(inc.reasoningOutputTokens==null)reasoningKnown=false;else reasoning=checkedAdd(reasoning,inc.reasoningOutputTokens);
    }
    const item={};
    if(e.type==='item'&&e.itemType!==undefined) {
      check(['command_execution','agent_message','reasoning','file_change','mcp_tool_call','web_search','todo_list','unknown'].includes(e.itemType),'invalid-item-type');
      check(e.itemStatus==null||['in_progress','completed','failed','declined','unknown'].includes(e.itemStatus),'invalid-item-status');
      check(e.exitCode==null||Number.isSafeInteger(e.exitCode),'invalid-exit-code');
      Object.assign(item,{itemType:e.itemType,itemStatus:e.itemStatus??null,exitCode:e.exitCode??null});
    }
    normalized.push({eventId:e.eventId,attemptId:e.attemptId,type:e.type,...(e.turnId?{turnId:e.turnId}:{}),...item});
  }
  if([...turns.values()].includes('running'))issues.push('unterminated-turn');
  const hasUsage=events.some(e=>e.type==='usage');if(!hasUsage)issues.push('usage-not-observed');
  const failed=[...turns.values()].some(s=>s==='failed'||s==='interrupted');
  return {schemaVersion:1,kind:'event-reconciliation',ok:issues.length===0&&!failed,events:normalized,duplicates,issues:[...new Set(issues)],turns:[...turns].map(([turn,state])=>({turn,state})),usage:{basis:'known-observations',coverage:issues.length?'partial':'reported',inputTokens:hasUsage?input:null,outputTokens:hasUsage?output:null,totalTokens:hasUsage?checkedAdd(input,output):null,cachedInputTokens:hasUsage&&cachedKnown?cached:null,reasoningOutputTokens:hasUsage&&reasoningKnown?reasoning:null},acceptance:'not-evaluated',limits:[...limits,'Cached input and reasoning output are subsets, not additional totals. Counters must describe disjoint scope; overlapping provider totals cannot be inferred.','Partial totals are known observations, never a zero-cost assumption or a billing receipt.']};
}
export function importCodexExec(text,binding) {
  doc(binding);check(id(binding.attemptId)&&id(binding.runtimeVersion),'invalid-binding');
  check(typeof text==='string'&&Buffer.byteLength(text)<=2*1024*1024,'input-too-large');
  const lines=text.split(/\r?\n/).filter(s=>s.trim());check(lines.length>0&&lines.length<=1000,'invalid-jsonl');
  const stream=hash(text), mapped=[];let thread=null,turn=0,active=null;
  function add(line,type,extra={}) {mapped.push({schemaVersion:1,eventId:`${stream}:${line}:${type}`,attemptId:binding.attemptId,type,...extra});}
  for(let i=0;i<lines.length;i++) {
    let e;try{e=JSON.parse(lines[i]);}catch{throw new Error('invalid-jsonl');}
    check(object(e)&&typeof e.type==='string','invalid-source-event');
    if(e.type==='thread.started') {check(id(e.thread_id),'invalid-thread');if(thread&&thread!==e.thread_id)throw new Error('mixed-threads');thread=e.thread_id;}
    else if(e.type==='turn.started') {if(active)add(i,'gap');active=`local-turn-${++turn}`;add(i,'turn-started',{turnId:active});}
    else if(['turn.completed','turn.failed'].includes(e.type)) {
      if(!active){add(i,'gap');continue;}
      add(i,e.type==='turn.completed'?'turn-completed':'turn-failed',{turnId:active});
      if(e.usage && integer(e.usage.input_tokens)&&integer(e.usage.output_tokens))add(i,'usage',{counterId:active,counterEpoch:'0',basis:'delta',usage:{inputTokens:e.usage.input_tokens,outputTokens:e.usage.output_tokens,cachedInputTokens:e.usage.cached_input_tokens??null,reasoningOutputTokens:e.usage.reasoning_output_tokens??null}});
      else add(i,'gap');active=null;
    } else if(['item.started','item.updated','item.completed'].includes(e.type)) {
      const item=e.item??{};
      const itemType=['command_execution','agent_message','reasoning','file_change','mcp_tool_call','web_search','todo_list'].includes(item.type)?item.type:'unknown';
      const itemStatus=item.status==null?null:['in_progress','completed','failed','declined'].includes(item.status)?item.status:'unknown';
      if(itemType==='unknown'||itemStatus==='unknown')add(i,'gap');
      add(i,'item',{itemType,itemStatus,exitCode:item.exit_code??null}); // Never copy command, patch, model output or error text.
    } else {add(i,'gap');} // Unknown versions/events remain visible; no fabricated support.
  }
  if(!thread||mapped.length===0)add(lines.length,'gap');
  const report=reconcileEvents(mapped);
  return {...report,source:{format:'codex-exec-jsonl',streamSha256:stream,runtimeVersion:binding.runtimeVersion,threadSha256:thread?hash(thread):null,turnIdentity:'local-sequence'},limits:[...report.limits,'This imports one ordered saved exec stream, not app-server. Identical valid usage in distinct turns is counted twice.','Without stable source event IDs, duplicate terminals become gaps; identical lines are not silently deduplicated. Importing the same whole capture produces the same report.','Source runtime version is caller-declared. No live Codex authentication, launch or continuation has been tested by an import.']};
}
