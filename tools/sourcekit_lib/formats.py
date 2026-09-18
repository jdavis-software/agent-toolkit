"""Conservative text extraction, feed snapshots, and timestamped captions."""
from __future__ import annotations
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urljoin
from .common import digest, fail, json_input, public_url, text_bytes

class PlainText(HTMLParser):
    IGNORE = {'script', 'style', 'template', 'noscript', 'svg', 'head'}
    BREAK = {'p', 'div', 'li', 'br', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'tr', 'blockquote', 'pre'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hidden = []; self.parts = []; self.titles = []; self.in_title = False
    def handle_starttag(self, tag, attrs):
        if tag == 'title': self.in_title = True
        if tag in self.IGNORE: self.hidden.append(tag)
        if tag in self.BREAK and not self.hidden: self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag in self.hidden:
            index = len(self.hidden) - 1 - self.hidden[::-1].index(tag)
            self.hidden = self.hidden[:index]
        if tag in self.BREAK and not self.hidden: self.parts.append('\n')
    def handle_data(self, data):
        if self.in_title: self.titles.append(data)
        elif not self.hidden: self.parts.append(data)
    def value(self):
        return '\n'.join(s for s in (re.sub(r'[ \t\r\f\v]+', ' ', line).strip() for line in ''.join(self.parts).split('\n')) if s)

def html_text(value: str):
    parser = PlainText(); parser.feed(value); parser.close()
    return parser.value(), ' '.join(parser.titles).strip()

def document(raw: bytes, format: str):
    text = text_bytes(raw)
    title = None
    if format == 'html':
        text, title = html_text(text)
        # This is a narrow rejection heuristic, not universal challenge detection.
        if (title or '').strip().lower() in ('just a moment...', 'access denied', 'verify you are human', 'attention required! | cloudflare'):
            fail('access-challenge', 'The response appears to be an access/challenge page, not accepted source content.')
    if not text.strip(): fail('empty-content', 'No usable text was extracted.')
    return {'title': title, 'text': text, 'extraction': 'static-html-text' if format == 'html' else 'verbatim-text',
            'limitations': ['No JavaScript, linked assets, paywalls, or semantic article extraction are evaluated.']}

def optional_text(value, label):
    if value is None: return None
    if not isinstance(value, str): fail('invalid-feed', f'{label} must be text.')
    return value

def feed(raw: bytes, source_url: str):
    base = public_url(source_url); text = text_bytes(raw); rows = []; title = None
    if text.lstrip().startswith('{'):
        data = json_input(raw)
        if not isinstance(data, dict) or data.get('version') not in ('https://jsonfeed.org/version/1', 'https://jsonfeed.org/version/1.1') or not isinstance(data.get('items'), list):
            fail('invalid-feed', 'Expected a JSON Feed 1 or 1.1 document.')
        title = optional_text(data.get('title'), 'title'); format = 'json-feed'
        for item in data['items']:
            if not isinstance(item, dict) or not isinstance(item.get('id'), str) or not item['id']:
                fail('invalid-feed', 'Each JSON Feed item requires a nonempty string id.')
            content = optional_text(item.get('content_text'), 'content_text')
            if content is None: content = html_text(optional_text(item.get('content_html'), 'content_html') or '')[0]
            rows.append({'id': item['id'], 'title': optional_text(item.get('title'), 'item title'), 'url': optional_text(item.get('url'), 'url'), 'text': content,
                         'published': optional_text(item.get('date_published'), 'date_published'), 'updated': optional_text(item.get('date_modified'), 'date_modified')})
    else:
        if re.search(r'<!\s*(DOCTYPE|ENTITY)\b', text, re.I):
            fail('unsafe-xml', 'XML document types and entity declarations are not accepted.')
        try: root = ET.fromstring(text)
        except (ET.ParseError, ValueError): fail('invalid-feed', 'Malformed XML feed.')
        if sum(1 for _ in root.iter()) > 20000: fail('too-large', 'Feed contains too many XML nodes.')
        atom = '{http://www.w3.org/2005/Atom}'
        xmlbase = '{http://www.w3.org/XML/1998/namespace}base'
        if root.tag == 'rss' and root.find('channel') is not None:
            channel = root.find('channel'); title = channel.findtext('title'); format = 'rss2'
            for item in channel.findall('item'):
                link = item.findtext('link'); identity = item.findtext('guid') or link
                if not identity: fail('invalid-feed', 'RSS items require a guid or link for stable comparison.')
                rows.append({'id': identity, 'title': item.findtext('title'), 'url': link,
                             'text': html_text(item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded') or item.findtext('description') or '')[0],
                             'published': item.findtext('pubDate'), 'updated': None})
        elif root.tag == atom + 'feed':
            title = root.findtext(atom + 'title'); format = 'atom'
            feed_base = urljoin(base, root.attrib.get(xmlbase, ''))
            for item in root.findall(atom + 'entry'):
                identity = item.findtext(atom + 'id')
                if not identity: fail('invalid-feed', 'Atom entries require an id.')
                item_base = urljoin(feed_base, item.attrib.get(xmlbase, ''))
                links = [l for l in item.findall(atom + 'link') if l.attrib.get('rel', 'alternate') == 'alternate']
                link = urljoin(item_base, links[0].attrib.get('href', '')) if links else None
                node = item.find(atom + 'content')
                if node is None: node = item.find(atom + 'summary')
                content = ''.join(node.itertext()) if node is not None else ''
                if node is not None and node.attrib.get('type') == 'html': content = html_text(content)[0]
                rows.append({'id': identity, 'title': item.findtext(atom + 'title'), 'url': link, 'text': content,
                             'published': item.findtext(atom + 'published'), 'updated': item.findtext(atom + 'updated')})
        else: fail('unsupported-feed', 'Only RSS 2, Atom, and JSON Feed are supported.')
    seen = set(); items = []
    for row in rows:
        if row['id'] in seen: fail('duplicate-item', 'Duplicate feed item identities make comparison ambiguous.')
        seen.add(row['id'])
        if len(row['id']) > 4096: fail('invalid-feed', 'Item identity exceeds the supported limit.')
        if row['url']: row['url'] = public_url(urljoin(base, row['url']), allow_http=True)
        row['sha256'] = digest(row)
        items.append(row)
    return {'title': title, 'format': format, 'items': items[:200], 'complete': len(items) <= 200,
            'omittedItems': max(0, len(items) - 200), 'limits': ['Feed absence is not deletion; enclosures and next pages are not fetched.']}

def compare_feeds(before, after):
    def checked(packet):
        if not isinstance(packet, dict) or packet.get('schemaVersion') != 1 or packet.get('kind') != 'feed' or packet.get('status') != 'ok':
            fail('invalid-snapshot', 'Compare requires two successful Sourcekit feed packets.')
        content = packet.get('content'); evidence = packet.get('evidence')
        if not isinstance(content, dict) or not isinstance(evidence, dict) or evidence.get('contentSha256') != digest(content):
            fail('invalid-snapshot', 'Feed content no longer matches its recorded checksum.')
        if not isinstance(content.get('items'), list) or len(content['items']) > 200 or not isinstance(content.get('complete'), bool):
            fail('invalid-snapshot', 'Invalid feed snapshot shape.')
        result = {}
        for row in content['items']:
            if not isinstance(row, dict) or not isinstance(row.get('id'), str) or not row['id'] or row['id'] in result:
                fail('invalid-snapshot', 'Invalid or duplicate snapshot identity.')
            if row.get('sha256') != digest({k: v for k, v in row.items() if k != 'sha256'}):
                fail('invalid-snapshot', 'Feed item checksum does not match.')
            result[row['id']] = row['sha256']
        source = packet.get('source')
        if not isinstance(source, dict): fail('invalid-snapshot', 'Missing feed source identity.')
        return public_url(source.get('url')), result, content['complete']
    old_source, old, old_complete = checked(before); new_source, new, new_complete = checked(after)
    if old_source != new_source: fail('source-mismatch', 'Snapshots belong to different feed URLs.')
    return {'schemaVersion': 1, 'kind': 'feed-diff', 'sourceUrl': old_source,
            'added': sorted(new.keys() - old.keys()), 'changed': sorted(i for i in new.keys() & old.keys() if new[i] != old[i]),
            'unchanged': sorted(i for i in new.keys() & old.keys() if new[i] == old[i]),
            'absentFromWindow': sorted(old.keys() - new.keys()) if new_complete else [],
            'windowComparisonComplete': old_complete and new_complete,
            'limits': ['Absent entries may have aged out of a feed window; this is not deletion evidence.', 'Checksums are not authenticated provenance.']}

STAMP = re.compile(r'(?:(\d{1,3}):)?(\d{2}):(\d{2})[.,](\d{3})')
def timestamp(value):
    m = STAMP.fullmatch(value)
    if not m or int(m[2]) > 59 or int(m[3]) > 59: fail('invalid-transcript', 'Invalid cue timestamp.')
    return ((int(m[1] or 0) * 60 + int(m[2])) * 60 + int(m[3])) * 1000 + int(m[4])

def transcript(raw: bytes, language='und', origin='unknown'):
    if not re.fullmatch(r'[A-Za-z0-9-]{2,35}', language) or origin not in ('unknown', 'captions', 'automatic-captions', 'human-transcript'):
        fail('invalid-transcript', 'Invalid language or declared transcript origin.')
    text = text_bytes(raw).replace('\r\n', '\n').replace('\r', '\n'); cues = []; last = -1
    is_vtt = text.startswith('WEBVTT')
    for block in re.split(r'\n\s*\n', text.strip()):
        lines = block.splitlines()
        if not lines: continue
        if is_vtt and (lines[0].startswith('WEBVTT') or re.match(r'^(NOTE|STYLE|REGION)(\s|$)', lines[0])): continue
        timing = next((i for i, line in enumerate(lines[:2]) if '-->' in line), None)
        if timing is None: fail('invalid-transcript', 'A caption block has no supported timing line.')
        parts = lines[timing].split('-->')
        if len(parts) != 2: fail('invalid-transcript', 'Invalid caption timing separator.')
        start = timestamp(parts[0].strip()); end = timestamp(parts[1].strip().split()[0])
        if end <= start or start < last: fail('invalid-transcript', 'Cues must have positive duration and nondecreasing start times.')
        last = start
        payload = '\n'.join(lines[timing + 1:])
        if is_vtt: payload = re.sub(r'<\d{2}:\d{2}(?::\d{2})?\.\d{3}>', '', payload)
        plain = html_text(payload)[0]
        if not plain.strip(): fail('invalid-transcript', 'Empty caption cue.')
        cues.append({'startMs': start, 'endMs': end, 'text': plain})
        if len(cues) > 5000: fail('too-large', 'More than 5000 transcript cues.')
    if not cues: fail('invalid-transcript', 'No timestamped cues found.')
    return {'format': 'webvtt' if is_vtt else 'srt', 'language': language, 'origin': origin,
            'originEvidence': 'caller-declared', 'cues': cues,
            'limits': ['Captions are not visual scene evidence.', 'Overlapping cues are preserved; no transcript, translation, or audio is generated.']}
