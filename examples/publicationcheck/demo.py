#!/usr/bin/env python3
"""Exercise original records and intentionally misleading variants; no network."""
import copy
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tools'))
from publication_lib import records

results = {}
for kind in ('research', 'debt', 'storyboard', 'explanation'):
    doc = json.loads((ROOT / f'examples/publicationcheck/{kind}.json').read_text())
    report = getattr(records, kind)(doc, ROOT)
    assert report['status'] == 'checks-passed'
    broken = copy.deepcopy(doc)
    if kind == 'research': broken['claims'][0]['eventAt'] = None
    elif kind == 'debt': broken['findings'][0]['check']['status'] = 'not-run'
    elif kind == 'storyboard': broken['shots'][2]['presentedAs'] = 'available'
    else: broken['edges'][0]['citations'] = []
    failed = getattr(records, kind)(broken, ROOT)
    assert failed['status'] == 'needs-review'
    results[kind] = {'validFixture': report['status'], 'misleadingFixture': failed['findings']}
print(json.dumps({'synthetic': True, 'records': results, 'hostEffectiveness': 'not-evaluated'}))
