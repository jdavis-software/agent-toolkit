"""Local, conservative content assessment. Never fetches links or grants authority."""
from __future__ import annotations
import re
from html.parser import HTMLParser
from urllib.parse import urljoin
from .common import SourceError, digest, fail, public_url, text_bytes

LIMITATIONS = [
    'Heuristics inspect markup, not computed visibility, authentication, or page truth.',
    'Literal expectations can be present in misleading content; a match is not semantic proof.',
    'Unrecognized, translated, or deliberately disguised interstitials may remain unknown.',
    'Source text and links remain untrusted data; no link is fetched or authorized by extraction.'
]

def normalized(value: str) -> str:
    return ' '.join(value.split()).casefold()

class Signals(HTMLParser):
    """Bounded markup signals; controls are observed, never invoked."""
    VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    HIDDEN = {'script','style','template','svg','noscript'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []; self.nodes = 0; self.words = []; self.headings = []
        self.title = []; self.noscript = []; self.buttons = []; self.links = []
        self.password = False; self.scripts = 0; self.challenge = False
    def handle_starttag(self, tag, pairs):
        self.nodes += 1
        if self.nodes > 20000: fail('too-large', 'Markup assessment exceeds 20000 elements.')
        attrs = dict(pairs)
        hidden = (bool(self.stack and self.stack[-1]['hidden']) or tag in self.HIDDEN or
                  'hidden' in attrs or 'inert' in attrs or (attrs.get('aria-hidden') or '').lower() == 'true')
        if tag == 'script': self.scripts += 1
        if not hidden:
            if tag == 'input' and (attrs.get('type') or '').lower() == 'password': self.password = True
            if tag in {'div','form','iframe'} and any('cf-chl-' in (attrs.get(k) or '') for k in ['id','class']): self.challenge = True
        item = {'tag':tag,'hidden':hidden,'text':[],'href':attrs.get('href')}
        if tag not in self.VOID:
            if len(self.stack)>=256: fail('too-deep','Markup assessment exceeds 256 nested elements.')
            self.stack.append(item)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID: self.handle_endtag(tag)
    def handle_data(self, text):
        if self.stack and not self.stack[-1]['hidden'] and any(s['tag']=='title' for s in self.stack): self.title.append(text)
        if any(s['tag']=='noscript' for s in self.stack): self.noscript.append(text)
        if not self.stack or not self.stack[-1]['hidden']:
            if not any(s['tag']=='head' for s in self.stack): self.words.append(text)
            for item in self.stack:
                if item['tag'] in {'h1','h2','button','a'}: item['text'].append(text)
    def finish(self, item):
        if item['hidden']: return
        text = ' '.join(''.join(item['text']).split())
        if item['tag'] in {'h1','h2'} and len(self.headings)<3: self.headings.append(text)
        if item['tag']=='button' and len(self.buttons)<30: self.buttons.append(text)
        if item['tag']=='a' and item['href'] is not None: self.links.append((item['href'],text[:256]))
    def handle_endtag(self, tag):
        index = next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i]['tag']==tag),None)
        if index is not None:
            for item in reversed(self.stack[index:]): self.finish(item)
            del self.stack[index:]
    def complete(self):
        self.close()
        for item in reversed(self.stack): self.finish(item)
        self.stack.clear()


def validate_expectations(expected_text=None, expected_title=None):
    expected_text = [] if expected_text is None else expected_text
    if (not isinstance(expected_text,list) or len(expected_text)>10 or
        any(not isinstance(x,str) or not x.strip() or len(x)>200 for x in expected_text) or
        (expected_title is not None and (not isinstance(expected_title,str) or not expected_title.strip() or len(expected_title)>200))):
        fail('invalid-expectation', 'Use at most ten nonblank literal markers of at most 200 characters and one bounded title.')
    return expected_text, expected_title


def inspect_markup(raw: bytes):
    parser=Signals(); parser.feed(text_bytes(raw)); parser.complete(); return parser


def assess(raw: bytes, format: str, expected_text=None, expected_title=None):
    """Classify apparent gates independently of transport success; no universal acceptance."""
    markers, title_expected=validate_expectations(expected_text,expected_title)
    if format not in {'html','text'}: fail('unsupported-assessment', 'Assessment supports HTML or text captures only.')
    value=text_bytes(raw); scanner=inspect_markup(raw) if format=='html' else None
    text=normalized(' '.join(scanner.words) if scanner else value)
    title=normalized(' '.join(scanner.title)) if scanner else ''
    headings=[title]+[normalized(h) for h in scanner.headings] if scanner else [normalized(x) for x in value.splitlines()[:2]]
    state='unknown'; reasons=[]
    auth_heading=any(re.fullmatch(r'(access code required|authentication required|login required|sign in|log in|login|sign in to continue)[.!]?',h) for h in headings)
    auth_instruction=bool(re.search(r'(sign in|log in|enter (?:an? |the )?access code) to (continue|view|access)|(?:valid )?access code (?:is required|must be set)',text))
    challenge_heading=any(h in {'just a moment...','verify you are human','attention required! | cloudflare','security verification','access denied'} for h in headings)
    consent_heading=any(h in {'consent required','before you continue','privacy choices'} for h in headings)
    if auth_heading and (auth_instruction or bool(scanner and scanner.password)):
        state='authentication-required'; reasons=['gating-heading','credential-control-or-access-instruction']
    elif challenge_heading and (not scanner or scanner.challenge or 'verify' in text or 'ray id' in text or 'access denied' in headings):
        state='access-challenge'; reasons=['challenge-heading','challenge-structure-or-instruction']
    elif consent_heading and scanner and any(re.fullmatch(r'(accept( all)?|agree|reject( all)?)',normalized(b)) for b in scanner.buttons):
        state='consent-interstitial'; reasons=['consent-heading','consent-choice-control']
    elif scanner and scanner.scripts and len(text)<100 and re.search(r'enable javascript|javascript (?:is )?required',normalized(' '.join(scanner.noscript))):
        state='partial-js-required'; reasons=['script-shell','noscript-requirement','little-static-text']
    title_match=None if title_expected is None else title==normalized(title_expected)
    matches=[normalized(marker) in text for marker in markers]
    has_contract=bool(markers or title_expected is not None)
    criteria_match=(all(matches) and title_match is not False) if has_contract else None
    if state=='unknown':
        if not text: reasons=['no-static-text']
        elif has_contract and criteria_match:
            state='expected-content'; reasons=['declared-literal-expectations-match','no-recognized-gate']
        elif has_contract: reasons=['declared-expectation-mismatch']
        else: reasons=['no-declared-content-expectations']
    return {'schemaVersion':1,'assessmentVersion':'0.1.0','state':state,'basis':'structural-heuristics-and-literal-expectations',
            'inputSha256':digest(raw),'expectationsSha256':digest({'text':markers,'title':title_expected}),
            'criteriaMatched':criteria_match,'textMatches':matches,'titleMatches':title_match,
            'reasons':reasons,'limits':LIMITATIONS}


def extract_links(raw: bytes, source_url: str, *, limit=128):
    """Return bounded approved-shape references only; not an access decision or crawl."""
    if not isinstance(limit,int) or isinstance(limit,bool) or not 1<=limit<=128: fail('invalid-limit','Link limit must be 1 to 128.')
    base=public_url(source_url); scanner=inspect_markup(raw); result=[]; seen=set(); rejected=0; omitted=0
    for href,label in scanner.links:
        try:
            if len(href)>4096 or re.search(r'[\s\\\x00-\x1f\x7f]',href): raise ValueError()
            url=public_url(urljoin(base,href),allow_http=True)
        except (SourceError,ValueError):
            rejected+=1;continue
        if url in seen: continue
        seen.add(url)
        if len(result)==limit: omitted+=1;continue
        result.append({'url':url,'label':label})
    return {'items':result,'rejected':rejected,'omitted':omitted,'complete':not omitted,
            'limits':['References only; no DNS lookup, network request, or permission is implied.',
                      'HTML base elements are ignored; fragments are removed; computed visibility is not evaluated.']}
