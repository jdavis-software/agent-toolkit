#!/usr/bin/env python3
"""Optional parser-only qualification. Original fixtures; no browser or live source."""
import hashlib
from importlib.metadata import distributions, version
import json
from pathlib import Path
import platform
import re
import sys
import tempfile
sys.dont_write_bytecode=True

def prohibit_effects(event,args):
    if event in {'socket.connect','socket.getaddrinfo','subprocess.Popen','os.system'}:
        raise RuntimeError('Evaluation permits local parsing only.')
sys.addaudithook(prohibit_effects)
from scrapling import Selector

# Meaning is specified independently of legacy CSS and is checked after selection.
CONTRACT={'record':'studio','field':'standard-monthly','currency':'USD','unit':'month'}
SELECTOR='#monthly-price'
BASELINE='''<main><article data-plan="studio"><h1>Studio</h1><span id="monthly-price" class="rate" data-record="studio" data-field="standard-monthly" data-currency="USD" data-unit="month">4900</span></article></main>'''
CHANGED='''<main><section class="new-layout"><article data-plan="studio"><h1>Studio</h1><div><span id="current-amount" class="new-rate" data-record="studio" data-field="standard-monthly" data-currency="USD" data-unit="month">4900</span></div></article></section></main>'''
# Reused CSS ID points to a different business field; successful CSS lookup is insufficient.
DECOY=BASELINE.replace('data-field="standard-monthly"','data-field="promotion"').replace('4900','900')
SIMILAR_DECOY=DECOY.replace('id="monthly-price"','id="offer-price"')

def checked(candidates):
    if len(candidates)!=1: return {'accepted':False,'reason':'cardinality'}
    node=candidates[0]
    if any(node.attrib.get('data-'+key)!=value for key,value in CONTRACT.items()):
        return {'accepted':False,'reason':'field-identity'}
    value=str(node.get_all_text(separator='',strip=True))
    if not re.fullmatch(r'[0-9]{1,8}',value): return {'accepted':False,'reason':'amount-shape'}
    return {'accepted':True,'amountMinor':int(value),'record':'studio','field':'standard-monthly','currency':'USD','unit':'month'}


def main():
    if version('scrapling')!='0.4.15': raise RuntimeError('Use the reviewed Scrapling version 0.4.15.')
    rows=[]
    with tempfile.TemporaryDirectory(prefix='toolkit-parser-eval-') as temporary:
        def page(html):
            return Selector(html,url='https://fixture.example/pricing',adaptive=True,
                            storage_args={'storage_file':str(Path(temporary)/'elements.db')})
        baseline=page(BASELINE)
        assert checked(baseline.css(SELECTOR,auto_save=True))['amountMinor']==4900
        cases=[
            ('baseline',BASELINE,SELECTOR,True,4900),
            ('layout-change',CHANGED,SELECTOR,True,4900),
            ('reused-selector-decoy',DECOY,SELECTOR,False,None),
            ('similarity-decoy',SIMILAR_DECOY,SELECTOR,False,None),
            ('duplicate-standard-field',BASELINE+BASELINE,'[data-field="standard-monthly"]',False,None),
            ('wrong-currency',BASELINE.replace('USD','EUR'),SELECTOR,False,None),
            ('malformed-value',BASELINE.replace('4900','NaN'),SELECTOR,False,None),
            ('missing-field','<main><h1>No plan available</h1></main>','[data-field="standard-monthly"]',False,None)
        ]
        for name,html,selector,expected,amount in cases:
            p=page(html);candidates=p.css(selector);mode='exact'
            # Recovery is evaluated only for the two explicitly planned cases.
            if not candidates and name in {'layout-change','similarity-decoy'}:
                candidates=p.css(selector,adaptive=True);mode='adaptive'
            result=checked(candidates)
            passed=result['accepted']==expected and (not expected or result['amountMinor']==amount)
            rows.append({'case':name,'fixtureSha256':hashlib.sha256(html.encode()).hexdigest(),
                         'mode':mode,'candidateCount':len(candidates),'outcome':result,'passed':passed})
    report={'schemaVersion':1,'evaluation':'scrapling-parser-contract','scraplingVersion':version('scrapling'),
            'python':platform.python_version(),'platform':sys.platform,
            'environment':sorted([{'name':d.metadata['Name'],'version':d.version} for d in distributions()],key=lambda d:d['name'].lower()),
            'cases':rows,'passed':all(r['passed'] for r in rows),
            'limits':['Synthetic local parser fixtures only, not an agent-host evaluation or full Scrapling audit.',
                      'No browser, crawler, MCP transport, login, live target, stealth backend or performance benchmark tested.',
                      'Runtime audit hook rejects network/process effects; it is not an OS security sandbox.',
                      'The field contract is synthetic; real sites require their own independently justified semantics.']}
    print(json.dumps(report,indent=2))
    return 0 if report['passed'] else 1

if __name__=='__main__':sys.exit(main())
