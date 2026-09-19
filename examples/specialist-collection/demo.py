"""Synthetic record checks with actual disposable source changes. No external engines."""
import copy
import json
from pathlib import Path
import shutil
import sys
import tempfile
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'tools'))
from publication_lib.index_review import index_review
from publication_lib.timeline import timeline
from publication_lib.datasets import experiment
source=Path(__file__).resolve().parent
with tempfile.TemporaryDirectory(prefix='toolkit-example-') as temp:
    root=Path(temp)
    for p in source.iterdir():
        if p.suffix in ('.json','.go','.ts','.svg','.txt','.csv'): shutil.copyfile(p,root/p.name)
    i=json.loads((root/'index.json').read_text());t=json.loads((root/'timeline.json').read_text());d=json.loads((root/'dataset.json').read_text())
    assert index_review(i,root)['status']=='checks-passed'
    assert timeline(t,root)['status']=='checks-passed'
    result=experiment(d,root)
    assert result['comparison']['meanDifferenceMs']==-8
    assert result['comparison']['outcomes']['candidate']=={'accepted':2,'tasks':3}
    (root/'worker.go').write_text('package sample\nfunc Renamed() string { return "export" }\n')
    stale=index_review(i,root);assert any(f['code']=='source-bytes-changed' for f in stale['findings'])
    (root/'narration.txt').write_text('Changed timing requires a new handoff.\n')
    revised=timeline(t,root);assert any(f['code']=='dependency-bytes-changed' for f in revised['findings'])
    print(json.dumps({'mode':'synthetic','indexDriftDetected':True,'narrationRevisionDetected':True,'comparison':result['comparison'],
                      'unknownCells':result['unknownCells'],'execution':'no-indexer-renderer-model-or-worker'},indent=2))
