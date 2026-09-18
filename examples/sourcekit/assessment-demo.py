"""Original synthetic cases. Demonstrates detection, not actual account access."""
import json
from pathlib import Path
import sys
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'tools'))
from sourcekit_lib.assessment import assess
cases=[('access-page',(ROOT/'examples/sourcekit/access-required.html').read_bytes(),'requested source','authentication-required'),
       ('article-about-login',b'<title>Login troubleshooting</title><h1>API guide</h1><p>The API guide discusses login and access code errors.</p>','API guide','expected-content'),
       ('wrong-page',b'<h1>Unrelated document</h1><p>This is not the requested specification.</p>','Required contract','unknown')]
rows=[]
for name,raw,marker,expected in cases:
 result=assess(raw,'html',[marker]);assert result['state']==expected
 rows.append({'case':name,'state':result['state'],'criteriaMatched':result['criteriaMatched']})
print(json.dumps({'cases':rows,'passed':True,'networkCalls':0},indent=2))
