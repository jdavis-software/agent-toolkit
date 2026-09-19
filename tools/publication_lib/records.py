"""Validate original research/debt/storyboard/explanation records.

A matching excerpt is a mechanical check, never a semantic truth classifier.
"""
from __future__ import annotations
from datetime import datetime
from pathlib import Path
from .common import Invalid, fields, rows, text, ident, number, choose, evidence, citations, issue, receipt


def instant(value: str) -> datetime:
    text(value, 64)
    dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if dt.tzinfo is None or 'T' not in value:
        raise Invalid('An explicit timezone-aware timestamp is required')
    return dt


def research(doc: dict, root: Path) -> dict:
    fields(doc, {'schemaVersion', 'window', 'asOf', 'sources', 'evidence', 'claims', 'coverage'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1: raise Invalid('Unsupported schema')
    fields(doc['window'], {'start', 'end'})
    start, end, asof = [instant(v) for v in (doc['window']['start'], doc['window']['end'], doc['asOf'])]
    if not start < end <= asof: raise Invalid('Invalid half-open research window')
    captures, findings = evidence(doc['evidence'], root)
    sources = {}
    for s in rows(doc['sources']):
        fields(s, {'id', 'publishedAt', 'observedAt', 'independenceGroup'})
        sid = ident(s['id'])
        if sid in sources or sid not in captures: raise Invalid('Unknown or repeated source')
        if instant(s['observedAt']) > asof: raise Invalid('Observation is later than as-of time')
        if s['publishedAt'] is not None and instant(s['publishedAt']) > asof: raise Invalid('Future publication date')
        ident(s['independenceGroup']); sources[sid] = s
    if set(sources) != set(captures): raise Invalid('Every source must have a capture')
    coverage, seen = [], set()
    for c in rows(doc['coverage']):
        fields(c, {'id', 'status'})
        cid = ident(c['id'])
        if cid in seen: raise Invalid('Duplicate coverage identity')
        seen.add(cid)
        status = choose(c['status'], {'inspected', 'blocked', 'not-run'})
        coverage.append({'id': cid, 'status': status})
        if status != 'inspected': findings.append(issue('source-coverage-gap', cid))
    groups, seen = {}, set()
    for claim in rows(doc['claims']):
        fields(claim, {'id', 'text', 'eventId', 'eventAt', 'assessment', 'citations'})
        cid, eid = ident(claim['id']), ident(claim['eventId'])
        if cid in seen: raise Invalid('Duplicate claim identity')
        seen.add(cid); text(claim['text'])
        status = choose(claim['assessment'], {'supported', 'contradicted', 'unresolved'})
        refs = rows(claim['citations'], 20, allow_empty=True)
        errors = citations(refs, captures, cid); findings.extend(errors)
        date = instant(claim['eventAt']) if claim['eventAt'] is not None else None
        if date is None:
            classification = 'uncertain-date'; findings.append(issue('unknown-event-date', cid))
        elif date > asof:
            classification = 'future-event'; findings.append(issue('future-event', cid))
        else: classification = 'in-window' if start <= date < end else 'outside-window'
        if not refs or status != 'supported': findings.append(issue('claim-needs-review', cid))
        group = groups.setdefault(eid, {'eventId': eid, 'classification': classification, 'claimIds': [], 'independenceGroups': set(), 'eventAt': date})
        if group['eventAt'] != date: raise Invalid('Conflicting dates for one declared event')
        group['claimIds'].append(cid)
        for ref in refs: group['independenceGroups'].add(sources[ref['sourceId']]['independenceGroup'])
    events = [{'eventId': g['eventId'], 'classification': g['classification'], 'claimIds': g['claimIds'],
               'declaredIndependentGroups': len(g['independenceGroups'])} for g in groups.values()]
    return receipt('research', doc, findings, events=events, coverage=coverage,
                   semanticSupport='caller-assessed-not-authenticated', dateBoundary='start-inclusive-end-exclusive')


def debt(doc: dict, root: Path) -> dict:
    fields(doc, {'schemaVersion', 'evidence', 'findings'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1: raise Invalid('Unsupported schema')
    captures, problems = evidence(doc['evidence'], root)
    captures_valid = not problems
    output, seen = [], set()
    for f in rows(doc['findings']):
        fields(f, {'id', 'classification', 'consequence', 'tradeoff', 'repairTarget', 'check', 'citations'})
        fid = ident(f['id'])
        if fid in seen: raise Invalid('Duplicate finding')
        seen.add(fid)
        category = choose(f['classification'], {'confirmed-defect', 'risk-hypothesis', 'deliberate-tradeoff', 'style'})
        for k in ('consequence', 'tradeoff', 'repairTarget'): text(f[k])
        fields(f['check'], {'id', 'status'}); ident(f['check']['id'])
        state = choose(f['check']['status'], {'reproduced', 'not-reproduced', 'not-run'})
        errors = citations(f['citations'], captures, fid); problems.extend(errors)
        if not f['citations']: problems.append(issue('missing-finding-evidence', fid))
        if category == 'confirmed-defect' and state != 'reproduced': problems.append(issue('unconfirmed-defect', fid))
        output.append({'id': fid, 'classification': category, 'reproduction': state,
                       'actionCandidate': captures_valid and category == 'confirmed-defect' and state == 'reproduced' and bool(f['citations']) and not errors})
    return receipt('debt', doc, problems, findingsReview=output, priority='not-inferred-from-file-size',
                   reproduction='supplied-record-not-rerun')


def storyboard(doc: dict, root: Path) -> dict:
    fields(doc, {'schemaVersion', 'fps', 'totalFrames', 'aspectRatio', 'evidence', 'assets', 'claims', 'shots', 'captions'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1: raise Invalid('Unsupported schema')
    number(doc['fps'], 1, 120, True); number(doc['totalFrames'], 1, 432000, True)
    choose(doc['aspectRatio'], {'16:9', '9:16', '1:1'})
    captures, problems = evidence(doc['evidence'], root)
    assets, claims = {}, {}
    for a in rows(doc['assets']):
        fields(a, {'id', 'evidenceId', 'usage', 'rightsReference'})
        aid = ident(a['id']); sid = ident(a['evidenceId'])
        if aid in assets or sid not in captures: raise Invalid('Invalid asset reference')
        usage = choose(a['usage'], {'approved', 'unknown', 'denied'}); text(a['rightsReference'])
        if usage != 'approved': problems.append(issue('asset-not-approved', aid))
        assets[aid] = a
    for c in rows(doc['claims']):
        fields(c, {'id', 'text', 'status', 'citations'})
        cid = ident(c['id'])
        if cid in claims: raise Invalid('Duplicate product claim')
        text(c['text']); choose(c['status'], {'implemented', 'planned', 'unknown'})
        problems.extend(citations(c['citations'], captures, cid))
        if not c['citations']: problems.append(issue('missing-claim-evidence', cid))
        claims[cid] = c
    cursor, seen = 0, set()
    for shot in rows(doc['shots']):
        fields(shot, {'id', 'startFrame', 'endFrame', 'assetIds', 'claimIds', 'presentedAs', 'purpose'})
        sid = ident(shot['id'])
        if sid in seen: raise Invalid('Duplicate shot')
        seen.add(sid); text(shot['purpose'])
        a = number(shot['startFrame'], 0, doc['totalFrames'], True)
        b = number(shot['endFrame'], 1, doc['totalFrames'], True)
        if not a < b: raise Invalid('Nonpositive shot duration')
        if a != cursor: problems.append(issue('timeline-gap-or-overlap', sid))
        cursor = b
        status = choose(shot['presentedAs'], {'available', 'planned'})
        for aid in rows(shot['assetIds'], 20):
            if aid not in assets: raise Invalid('Missing storyboard asset')
        for cid in rows(shot['claimIds'], 20):
            if cid not in claims: raise Invalid('Missing storyboard claim')
            if status == 'available' and claims[cid]['status'] != 'implemented': problems.append(issue('unavailable-feature-presented-live', sid))
    if cursor != doc['totalFrames']: problems.append(issue('timeline-incomplete', 'storyboard'))
    last = 0
    for caption in rows(doc['captions'], 1000, True):
        fields(caption, {'startFrame', 'endFrame', 'text'})
        text(caption['text'], 500)
        a, b = caption['startFrame'], caption['endFrame']
        number(a, 0, doc['totalFrames'], True); number(b, 1, doc['totalFrames'], True)
        if not last <= a < b: problems.append(issue('invalid-caption-timing', 'captions'))
        last = b
    return receipt('storyboard', doc, problems, seconds=doc['totalFrames']/doc['fps'],
                   renderAuthorization='not-granted', rights='caller-supplied-not-authenticated')


def explanation(doc: dict, root: Path) -> dict:
    fields(doc, {'schemaVersion', 'title', 'description', 'evidence', 'nodes', 'edges'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1: raise Invalid('Unsupported schema')
    text(doc['title']); text(doc['description'])
    captures, problems = evidence(doc['evidence'], root)
    nodes, seen = set(), set()
    for n in rows(doc['nodes'], 40):
        fields(n, {'id', 'label', 'description'})
        nid = ident(n['id'])
        if nid in nodes: raise Invalid('Duplicate diagram node')
        nodes.add(nid); text(n['label'], 300); text(n['description'])
    for e in rows(doc['edges'], 100):
        fields(e, {'id', 'from', 'to', 'meaning', 'status', 'citations'})
        eid = ident(e['id'])
        if eid in seen or e['from'] not in nodes or e['to'] not in nodes: raise Invalid('Invalid diagram edge')
        seen.add(eid); text(e['meaning'])
        state = choose(e['status'], {'source-supported', 'assumption'})
        problems.extend(citations(e['citations'], captures, eid))
        if state == 'source-supported' and not e['citations']: problems.append(issue('unsupported-connection', eid))
        if state == 'assumption': problems.append(issue('assumed-connection', eid))
    return receipt('explanation', doc, problems, nodes=len(nodes), edges=len(seen),
                   relationshipTruth='requires-semantic-review', rendering='not-tested-by-this-command')
