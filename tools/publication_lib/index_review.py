"""Check a supplied index receipt against selected current bytes; never run an indexer."""
from .common import fields, rows, ident, text, sha, read_bytes, digest, choose, receipt, issue, Invalid


def index_review(doc, root):
    fields(doc, {'schemaVersion', 'engine', 'expectedRoot', 'observedRoot', 'freshness', 'coverage', 'files', 'probes'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1:
        raise Invalid('Unsupported index receipt')
    fields(doc['engine'], {'id', 'version'})
    ident(doc['engine']['id']); text(doc['engine']['version'], 80)
    ident(doc['expectedRoot']); ident(doc['observedRoot'])
    choose(doc['freshness'], {'fresh', 'stale', 'unavailable', 'unknown'})
    choose(doc['coverage'], {'complete-for-probes', 'partial', 'unknown'})
    findings = []
    if doc['expectedRoot'] != doc['observedRoot']:
        findings.append(issue('wrong-index-view', 'index'))
    if doc['freshness'] != 'fresh':
        findings.append(issue('index-not-fresh', 'index'))
    if doc['coverage'] != 'complete-for-probes':
        findings.append(issue('probe-coverage-unestablished', 'index'))
    files = {}; total = 0
    for item in rows(doc['files'], 100):
        fields(item, {'id', 'path', 'sha256'})
        fid = ident(item['id']); sha(item['sha256'])
        if fid in files:
            raise Invalid('Duplicate source identity')
        body = read_bytes(root, item['path']); total += len(body)
        if total > 10 * 1024 * 1024:
            raise Invalid('Selected source exceeds limit')
        files[fid] = (item['path'], digest(body))
        if files[fid][1] != item['sha256']:
            findings.append(issue('source-bytes-changed', fid))
    seen = set()
    for probe in rows(doc['probes'], 100):
        fields(probe, {'id', 'sourceIds', 'expected', 'actual', 'status'})
        pid = ident(probe['id'])
        if pid in seen:
            raise Invalid('Duplicate probe identity')
        seen.add(pid)
        ids = rows(probe['sourceIds'], 100)
        if len(set(ids)) != len(ids) or any(ident(x) not in files for x in ids):
            raise Invalid('Invalid probe source scope')
        choose(probe['status'], {'completed', 'failed', 'not-run'})
        for key in ('expected', 'actual'):
            values = rows(probe[key], 200, allow_empty=True)
            for value in values: text(value, 300)
            if len(set(values)) != len(values):
                raise Invalid('Duplicate probe answer')
        if probe['status'] != 'completed':
            findings.append(issue('probe-not-completed', pid))
        elif set(probe['expected']) != set(probe['actual']):
            findings.append(issue('probe-answer-mismatch', pid))
    # Detect observed drift during the bounded read, without claiming atomicity.
    for fid, (path, hashed) in files.items():
        if digest(read_bytes(root, path)) != hashed:
            findings.append(issue('source-changed-during-review', fid))
    return receipt('index-review', doc, findings, checkedFiles=len(files), checkedProbes=len(seen),
                   execution='no-indexer-invoked', authenticity='not-established',
                   limits=['Supplied roots, freshness, coverage and expected answers are not authenticated.',
                           'Selected source bytes are checked; omitted files and unsaved buffers are outside scope.',
                           'Probe equality is not full semantic correctness or a performance benchmark.'])
