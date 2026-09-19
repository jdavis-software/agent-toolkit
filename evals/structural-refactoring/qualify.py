"""Exercise one reviewed external binary against original local fixtures, not user code."""
import argparse, hashlib, json, os, pathlib, shutil, subprocess, tempfile
parser=argparse.ArgumentParser();parser.add_argument('--ast-grep',required=True);args=parser.parse_args()
binary=str(pathlib.Path(args.ast_grep).resolve());source=pathlib.Path(__file__).resolve().parent
root=source.parents[1]
def run(argv,cwd,allowed=(0,)):
    result=subprocess.run(argv,cwd=cwd,capture_output=True,text=True,timeout=30,env={**os.environ,'NO_COLOR':'1'})
    if result.returncode not in allowed: raise RuntimeError(result.stdout+'\n'+result.stderr)
    return result
version=run([binary,'--version'],root).stdout.strip();assert '0.45.3' in version
with tempfile.TemporaryDirectory(prefix='structural-fixture-') as temp:
    work=pathlib.Path(temp);shutil.copytree(source,work/'recipe');recipe=work/'recipe'
    config=recipe/'tsconfig.json'
    config.write_text(json.dumps({'compilerOptions':{'strict':True,'noEmit':True,'skipLibCheck':True,'target':'ES2022'},'files':['input.ts']}))
    typecheck=['node',str(root/'node_modules/typescript/bin/tsc'),'--project',str(config)]
    run([binary,'test','--skip-snapshot-tests'],recipe)
    target=recipe/'input.ts';run(['node','--experimental-strip-types',str(target)],root)
    run(typecheck,recipe)
    matches=json.loads(run([binary,'scan','--rule',str(recipe/'rules/trace-call.yml'),'--json=compact',str(target)],recipe,(0,1)).stdout)
    assert len(matches)==1, 'Unexpected match cardinality'
    run([binary,'scan','--rule',str(recipe/'rules/trace-call.yml'),'--update-all',str(target)],recipe,(0,1))
    expected=(recipe/'expected.ts').read_bytes();assert target.read_bytes()==expected, 'Unexpected rewrite'
    run([binary,'scan','--rule',str(recipe/'rules/trace-call.yml'),'--update-all',str(target)],recipe,(0,1));assert target.read_bytes()==expected, 'Second application changed bytes'
    run(['node','--experimental-strip-types',str(target)],root)
    run(typecheck,recipe)
    rule=recipe/'rules/trace-call.yml';rule.write_text(rule.read_text().replace('debug.trace($MSG)','missing.trace($MSG)'))
    # A deliberately wrong rule must fail its two match assertions, not merely exit nonzero.
    negative=subprocess.run([binary,'test','--skip-snapshot-tests'],cwd=recipe,capture_output=True,text=True,timeout=30,env={**os.environ,'NO_COLOR':'1'})
    diagnostics=negative.stdout+'\n'+negative.stderr
    assert negative.returncode>0 and diagnostics.count('[Missing]')==2 and 'FAIL trace-call' in diagnostics and 'test failed. 0 passed; 1 failed;' in diagnostics, 'Broken rule did not fail its expected match assertions: '+diagnostics
    print(json.dumps({'tool':version,'ruleInputs':7,'matchingCandidates':1,'rewriteMatchesIndependentExpected':True,'idempotent':True,'runtimeBeforeAfter':True,'typecheckBeforeAfter':True,'brokenRuleDetected':True,'brokenRuleExitCode':negative.returncode,'missingMatchAssertions':2,'transformedSha256':hashlib.sha256(expected).hexdigest(),'scope':'Synthetic TypeScript fixture; no symbol-resolution or production migration claim'},indent=2))
