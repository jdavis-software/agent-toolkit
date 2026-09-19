"""Offline technical checks over static HTML. Not a crawler or ranking predictor."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, urljoin, quote, unquote
import re
import xml.etree.ElementTree as ET
from .common import Invalid, read_bytes, digest, receipt


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.description, self.canonicals, self.robots, self.links = '', [], [], [], []
        self.bases, self.jsonld, self.ids = [], [], set()
        self.in_head, self.in_title, self.script, self.script_text = False, False, False, ''

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'head': self.in_head = True
        if tag == 'title' and self.in_head: self.in_title = True
        if values.get('id'): self.ids.add(values['id'])
        if tag == 'link' and 'canonical' in (values.get('rel') or '').lower().split(): self.canonicals.append(values.get('href', ''))
        if tag == 'meta':
            name = (values.get('name') or '').lower()
            if name == 'description': self.description.append(values.get('content', ''))
            if name in ('robots', 'googlebot', 'bingbot'): self.robots.append(values.get('content', ''))
        if tag == 'base': self.bases.append(values.get('href', ''))
        if tag == 'a' and values.get('href'): self.links.append(values['href'])
        if tag == 'script' and (values.get('type') or '').lower() == 'application/ld+json':
            self.script, self.script_text = True, ''

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'head': self.in_head = False
        if tag == 'script' and self.script:
            self.jsonld.append(self.script_text); self.script = False

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.script: self.script_text += data


def audit_site(root: Path, base: str) -> dict:
    from .common import parse_json
    b = urlsplit(base)
    if b.scheme != 'https' or not b.netloc or b.username or b.password or b.query or b.fragment or not b.path.endswith('/'):
        raise Invalid('Expected absolute HTTPS deployment base ending in slash')
    root = root.resolve(strict=True)
    files = []
    # Do not follow symlinked files or directories, even if not HTML.
    def walk(folder: Path):
        if len(files) > 5000: raise Invalid('Site file count exceeds limit')
        for p in sorted(folder.iterdir()):
            if p.is_symlink(): raise Invalid('Symlink in static build')
            if p.is_dir(): walk(p)
            elif p.is_file(): files.append(p.relative_to(root).as_posix())
            else: raise Invalid('Nonregular static build entry')
    walk(root)
    html_files = [p for p in files if p.endswith('.html') and p != '404.html']
    if not html_files or len(html_files) > 500: raise Invalid('Expected 1–500 indexable HTML pages')
    findings, pages, identities, total = [], {}, {}, 0
    def add(code, path): findings.append({'code': code, 'path': path})
    for path in html_files:
        data = read_bytes(root, path)
        total += len(data)
        if total > 32 * 1024 * 1024: raise Invalid('Static HTML aggregate exceeds limit')
        route = path[:-10] if path.endswith('index.html') else path
        url = base + quote(route, safe='/')
        p = Page(); p.feed(data.decode('utf-8')); p.close()
        pages[url] = p; identities[path] = digest(data)
        if not p.title.strip(): add('missing-title', path)
        if len(p.description) != 1 or not p.description[0].strip(): add('missing-or-duplicate-description', path)
        if p.canonicals != [url]: add('canonical-mismatch', path)
        if p.bases: add('unexpected-base-element', path)
        if any(re.search(r'\b(noindex|none)\b', r, re.I) for r in p.robots): add('indexing-disabled', path)
        for content in p.jsonld:
            try: parse_json(content.encode())
            except (Invalid, ValueError, RecursionError): add('invalid-jsonld', path)
    for url, page in pages.items():
        path = url[len(base):] or 'index.html'
        for href in page.links:
            target = urlsplit(urljoin(url, href))
            if target.scheme not in ('http', 'https') or target.netloc != b.netloc: continue
            if not target.path.startswith(b.path):
                # Other projects on this GitHub Pages origin are outside this audit.
                # Root-relative links to our collection routes usually indicate a bad base.
                if target.path.startswith(('/skills/', '/tools/', '/bundles/', '/categories/', '/examples/')): add('internal-link-wrong-base', path)
                continue
            dest = unquote(target.path[len(b.path):])
            if any(x in ('.', '..') for x in dest.split('/')) or '\\' in dest: add('unsafe-local-link', path); continue
            local = dest + 'index.html' if dest.endswith('/') or not dest else dest
            if local not in files: add('broken-internal-link', path); continue
            noquery = target._replace(query='', fragment='').geturl()
            if target.fragment and noquery in pages and unquote(target.fragment) not in pages[noquery].ids:
                add('missing-fragment', path)
    if 'sitemap.xml' not in files:
        add('missing-sitemap', 'sitemap.xml')
    else:
        raw = read_bytes(root, 'sitemap.xml')
        identities['sitemap.xml'] = digest(raw)
        if re.search(br'<!\s*(?:DOCTYPE|ENTITY)', raw, re.I): raise Invalid('DTD/entity input rejected')
        try:
            tree = ET.fromstring(raw)
            if tree.tag != '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset': raise Invalid('Expected a bounded URL sitemap, not an index')
            urls = [node.text or '' for node in tree.findall('{*}url/{*}loc')]
        except ET.ParseError as error: raise Invalid('Malformed sitemap') from error
        if len(urls) != len(set(urls)): add('duplicate-sitemap-url', 'sitemap.xml')
        if set(urls) != set(pages): add('sitemap-page-mismatch', 'sitemap.xml')
    return receipt('site', {'base': base, 'files': identities}, findings, inspectedPages=len(pages),
                   limitations=['Offline HTML and URL checks only.', 'No HTTP headers, robots.txt fetch, external link fetch, index/rank, or rich-result eligibility verification.',
                                'JSON-LD syntax only; visible-content agreement requires human review.', '404.html excluded from indexable pages.'])
