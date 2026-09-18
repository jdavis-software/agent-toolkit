"""Offline demonstration using public-safe synthetic captures, never live accounts."""
import json
import sys
from pathlib import Path
sys.dont_write_bytecode = True
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'tools'))
from sourcekit_lib.common import envelope, SourceError
from sourcekit_lib.formats import feed, compare_feeds, transcript
url='https://example.com/feed'
def snapshot(name):
    raw=(ROOT/'examples/sourcekit'/name).read_bytes()
    return envelope('feed',raw,feed(raw,url),url)
before=snapshot('feed-before.json'); after=snapshot('feed-after.json')
changes=compare_feeds(before,after)
assert changes['added']==['release-2'] and changes['changed']==['release-1']
assert changes['absentFromWindow']==['old-window-entry'] and 'deleted' not in changes
captions=transcript((ROOT/'examples/sourcekit/captions.vtt').read_bytes(),'en','automatic-captions')
assert len(captions['cues'])==2
before['content']['items'][0]['title']='unrecorded change'
try: compare_feeds(before,after)
except SourceError: tamper_detected=True
else: raise AssertionError('Tampered snapshot was accepted')
print(json.dumps({'demonstration':'synthetic','networkRequests':0,'changes':changes,'cueCount':len(captions['cues']),'tamperDetected':tamper_detected},indent=2))
