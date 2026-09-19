#!/usr/bin/env node
import { readText,readJSON,check } from './lib/harness/common.mjs';
import { observeWorkspace,auditProfile } from './lib/harness/profile.mjs';
import { reconcileReadiness } from './lib/harness/readiness.mjs';
import { reconcileEvents,importCodexExec } from './lib/harness/events.mjs';
import { createCheckpoint,verifyCheckpoint } from './lib/harness/checkpoint.mjs';
import { reportCanary } from './lib/harness/canary.mjs';
const help=`Harnesskit — read-only harness evidence helpers\n\nobserve --root REPOSITORY\ncheckpoint REQUEST.json --root REPOSITORY\nrevalidate CHECKPOINT.json BINDING.json --root REPOSITORY\ncanary RUN.json\nprofile EXPECTED.json OBSERVED.json --root REPOSITORY\nreadiness TASK.json SNAPSHOT.json\nevents CAPTURE.jsonl --format codex-exec --binding BINDING.json\nevents EVENTS.json --format normalized\n\nNo worker launch, authentication inspection, model call, tracker mutation or installation.\nExit 0: checks satisfied; 3: mismatch/unknown/failed or incomplete run; 2: invalid input/tool error.\nRead docs/HARNESSKIT.md for source, privacy and evidence limitations.`;
try {
  const argv=process.argv.slice(2);
  if(!argv.length||argv.length===1&&['--help','help'].includes(argv[0]))console.log(help);
  else {
    const command=argv.shift(), positional=[], options={};
    for(let i=0;i<argv.length;i++){
      if(argv[i].startsWith('--')){const key=argv[i].slice(2);check(['root','format','binding'].includes(key)&&!Object.hasOwn(options,key)&&typeof argv[i+1]==='string'&&!argv[i+1].startsWith('--'),'invalid-options');options[key]=argv[++i];}
      else positional.push(argv[i]);
    }
    let result;
    if(command==='observe'){check(positional.length===0&&options.root&&Object.keys(options).length===1,'invalid-options');result=observeWorkspace(options.root);}
    else if(command==='checkpoint'){check(positional.length===1&&options.root&&Object.keys(options).length===1,'invalid-options');result=createCheckpoint(readJSON(positional[0]),options.root);}
    else if(command==='revalidate'){check(positional.length===2&&options.root&&Object.keys(options).length===1,'invalid-options');result=verifyCheckpoint(readJSON(positional[0]),readJSON(positional[1]),options.root);}
    else if(command==='canary'){check(positional.length===1&&Object.keys(options).length===0,'invalid-options');result=reportCanary(readJSON(positional[0]));}
    else if(command==='profile'){check(positional.length===2&&options.root&&Object.keys(options).length===1,'invalid-options');result=auditProfile(readJSON(positional[0]),readJSON(positional[1]),observeWorkspace(options.root));}
    else if(command==='readiness'){check(positional.length===2&&Object.keys(options).length===0,'invalid-options');result=reconcileReadiness(readJSON(positional[0]),readJSON(positional[1]));}
    else if(command==='events'){
      check(positional.length===1&&!options.root,'invalid-options');
      if(options.format==='codex-exec'){check(options.binding&&Object.keys(options).length===2,'invalid-options');result=importCodexExec(readText(positional[0]),readJSON(options.binding));}
      else {check(options.format==='normalized'&&Object.keys(options).length===1,'invalid-options');result=reconcileEvents(readJSON(positional[0]));}
    } else throw new Error('invalid-command');
    console.log(JSON.stringify(result,null,2));if(result.ok===false)process.exitCode=3;
  }
} catch {console.error(JSON.stringify({schemaVersion:1,ok:false,error:'invalid-input-or-probe-failure',hint:'Use --help and check private inputs. Raw values, paths and subprocess errors are deliberately omitted.'}));process.exitCode=2;}
