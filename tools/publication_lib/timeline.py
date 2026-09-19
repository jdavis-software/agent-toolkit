"""Normalized constant-rate cuts and explicit dependencies. No rendering or media decoding."""
from .common import fields, rows, ident, sha, read_bytes, digest, choose, number, receipt, issue, Invalid


def timeline(doc, root):
    fields(doc, {'schemaVersion', 'revision', 'fps', 'totalFrames', 'assets', 'dependencies', 'clips'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1:
        raise Invalid('Unsupported timeline')
    ident(doc['revision']); fields(doc['fps'], {'numerator', 'denominator'})
    n = number(doc['fps']['numerator'], 1, 120000, integer=True)
    d = number(doc['fps']['denominator'], 1, 10000, integer=True)
    if not 1 <= n / d <= 120:
        raise Invalid('Unsupported frame rate')
    end = number(doc['totalFrames'], 1, 1000000, integer=True)
    findings = []; assets = {}; selected = []; ids = set(); total = 0
    def inspect(item):
        nonlocal total
        iid = ident(item['id']); sha(item['sha256'])
        if iid in ids:
            raise Invalid('Duplicate asset or dependency identity')
        ids.add(iid)
        body = read_bytes(root, item['path']); total += len(body)
        if total > 10 * 1024 * 1024:
            raise Invalid('Selected assets exceed limit')
        hashed = digest(body); selected.append((iid, item['path'], hashed))
        if hashed != item['sha256']:
            findings.append(issue('dependency-bytes-changed', iid))
    for asset in rows(doc['assets'], 100):
        fields(asset, {'id', 'path', 'sha256', 'kind', 'frames'})
        choose(asset['kind'], {'image', 'video', 'audio'}); inspect(asset)
        if asset['kind'] == 'image':
            if asset['frames'] is not None:
                raise Invalid('Still images have no source frame count')
        else: number(asset['frames'], 1, 1000000, integer=True)
        assets[asset['id']] = asset
    for dep in rows(doc['dependencies'], 100):
        fields(dep, {'id', 'path', 'sha256'}); inspect(dep)
    clips = set(); visual = []
    for clip in rows(doc['clips'], 200):
        fields(clip, {'id', 'assetId', 'track', 'start', 'end', 'sourceStart'})
        cid = ident(clip['id']); aid = ident(clip['assetId'])
        if cid in clips or aid not in assets:
            raise Invalid('Duplicate clip or unknown asset')
        clips.add(cid)
        track = choose(clip['track'], {'visual', 'audio', 'overlay'})
        start = number(clip['start'], 0, end, integer=True)
        stop = number(clip['end'], 1, end, integer=True)
        source = number(clip['sourceStart'], 0, 1000000, integer=True)
        if stop <= start:
            raise Invalid('Nonpositive clip span')
        asset = assets[aid]
        if (track == 'audio') != (asset['kind'] == 'audio'):
            findings.append(issue('track-type-mismatch', cid))
        if asset['kind'] == 'image':
            if source != 0: findings.append(issue('still-image-trim', cid))
        elif source + stop - start > asset['frames']:
            findings.append(issue('source-trim-overrun', cid))
        if track == 'visual': visual.append((start, stop, cid))
    cursor = 0
    for start, stop, cid in sorted(visual):
        if start != cursor:
            findings.append(issue('primary-gap-or-overlap', cid))
        cursor = max(cursor, stop)
    if cursor != end or not visual:
        findings.append(issue('primary-incomplete', 'timeline'))
    for iid, path, hashed in selected:
        if digest(read_bytes(root, path)) != hashed:
            findings.append(issue('dependency-changed-during-review', iid))
    return receipt('timeline', doc, findings, clips=len(clips), primaryClips=len(visual),
                   durationSeconds=end*d/n, execution='no-renderer-invoked',
                   limits=['Cut-only timeline in one normalized constant-rate timebase; no implicit conversion.',
                           'Source frame counts and approval are supplied, not established by byte hashes.',
                           'No decoding, perceptual continuity, rights verification or rendering occurs.'])
