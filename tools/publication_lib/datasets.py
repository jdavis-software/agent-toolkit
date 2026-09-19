"""Bounded, fixed-workload CSV review and descriptive pairing, without statistical inference."""
import csv
import io
import math
import statistics
from .common import fields, rows, ident, sha, read_bytes, digest, text, receipt, issue, Invalid
HEADERS = ['task', 'condition', 'attempt', 'outcome', 'duration_ms', 'input_tokens', 'output_tokens']
OUTCOMES = {'accepted', 'failed', 'timeout', 'incomplete'}


def _numeric(value, integer=False):
    if value == '': return None
    # Do not parse formulas, arbitrary floats like NaN, booleans or mixed-unit text.
    if not value.isascii() or (not value.isdigit() if integer else not value.replace('.', '', 1).isdigit()):
        raise Invalid('Unsupported numeric cell')
    n = int(value) if integer else float(value)
    if not math.isfinite(n) or not 0 <= n <= 10**12:
        raise Invalid('Numeric cell outside limit')
    return n


def _review(doc, root):
    fields(doc, {'schemaVersion', 'path', 'sha256', 'tasks', 'conditions', 'durationUnit'})
    if type(doc['schemaVersion']) is not int or doc['schemaVersion'] != 1 or doc['durationUnit'] != 'ms':
        raise Invalid('Unsupported dataset contract or unit')
    sha(doc['sha256']); tasks = rows(doc['tasks'], 100)
    for t in tasks: ident(t)
    if len(set(tasks)) != len(tasks): raise Invalid('Duplicate task')
    conditions = rows(doc['conditions'], 2)
    if len(conditions) != 2 or len(set(conditions)) != 2: raise Invalid('Exactly two distinct conditions required')
    for c in conditions: ident(c)
    raw = read_bytes(root, doc['path']); hashed = digest(raw)
    if hashed != doc['sha256']: raise Invalid('Dataset bytes do not match declared identity')
    reader = csv.reader(io.StringIO(raw.decode('utf-8'), newline=''), strict=True)
    if next(reader, None) != HEADERS: raise Invalid('Unsupported CSV header')
    findings = []; groups = {(t,c):[] for t in tasks for c in conditions}; seen = set(); count = 0
    unknown = {k:0 for k in HEADERS[4:]}
    for row in reader:
        count += 1
        if count > 1000 or len(row) != len(HEADERS) or any(len(v) > 200 for v in row):
            raise Invalid('CSV row shape or size exceeded')
        t,c,attempt,outcome,*values = row
        ident(t); ident(c)
        if (t,c) not in groups: raise Invalid('Row outside fixed workload')
        a = _numeric(attempt, True)
        if a is None or not 1 <= a <= 50 or outcome not in OUTCOMES: raise Invalid('Invalid attempt or outcome')
        rid = (t,c,a)
        if rid in seen:
            findings.append(issue('duplicate-attempt', t))
        seen.add(rid)
        parsed = [_numeric(values[0]),_numeric(values[1],True),_numeric(values[2],True)]
        for k,v in zip(unknown,parsed):
            if v is None: unknown[k] += 1
        groups[(t,c)].append({'attempt':a,'outcome':outcome,'duration':parsed[0],'input':parsed[1],'output':parsed[2]})
    if not count: raise Invalid('Empty dataset')
    task_results = []
    for (t,c), attempts in groups.items():
        attempts.sort(key=lambda x:x['attempt'])
        if not attempts:
            findings.append(issue('missing-task-condition', t))
            task_results.append({'task':t,'condition':c,'accepted':False,'attempts':0,'attemptExecutionMs':None,'inputTokens':None,'outputTokens':None})
            continue
        if [a['attempt'] for a in attempts] != list(range(1,len(attempts)+1)):
            findings.append(issue('noncontiguous-attempts', t))
        if any(a['outcome'] in ('accepted','incomplete') for a in attempts[:-1]):
            findings.append(issue('attempt-after-terminal-or-incomplete', t))
        def total(k): return None if any(a[k] is None for a in attempts) else sum(a[k] for a in attempts)
        task_results.append({'task':t,'condition':c,'accepted':attempts[-1]['outcome']=='accepted','attempts':len(attempts),
                             'attemptExecutionMs':total('duration'),'inputTokens':total('input'),'outputTokens':total('output')})
    if digest(read_bytes(root, doc['path'])) != hashed:
        findings.append(issue('data-changed-during-review','dataset'))
    return receipt('dataset', doc, findings, rows=count,tasks=len(tasks),conditions=conditions,unknownCells=unknown,
                   taskResults=task_results,dataSha256=hashed,semanticValidation='not-established',
                   limits=['Exact small CSV contract only; unknown metrics stay null and failures remain in the workload.',
                           'Durations are declared attempt execution milliseconds, not end-to-end wall latency.',
                           'No imputation, row deletion, causal inference, authentication or adoption decision.'])


def dataset(doc, root):
    try: return _review(doc,root)
    except (csv.Error, UnicodeError, OverflowError) as e: raise Invalid('Invalid bounded CSV') from e


def experiment(doc, root):
    report = dataset(doc,root); report['kind']='experiment'
    if report['findings']:
        report.update(comparison=None,inference='not-performed',adoption='not-evaluated')
        return report
    baseline,candidate=doc['conditions']; lookup={(r['task'],r['condition']):r for r in report['taskResults']}
    deltas=[];excluded=[]
    for t in doc['tasks']:
        a,b=lookup[(t,baseline)],lookup[(t,candidate)]
        if not a['accepted'] or not b['accepted'] or a['attemptExecutionMs'] is None or b['attemptExecutionMs'] is None:
            excluded.append(t);continue
        deltas.append(b['attemptExecutionMs']-a['attemptExecutionMs'])
    outcomes={c:{'accepted':sum(r['accepted'] for r in report['taskResults'] if r['condition']==c),'tasks':len(doc['tasks'])} for c in doc['conditions']}
    report.update(comparison={'baseline':baseline,'candidate':candidate,'outcomes':outcomes,'pairedTasks':len(deltas),
                             'excludedTimingTasks':excluded,'candidateMinusBaselineAttemptMs':deltas,
                             'meanDifferenceMs':statistics.mean(deltas) if deltas else None,
                             'medianDifferenceMs':statistics.median(deltas) if deltas else None},
                  inference='not-performed',adoption='not-evaluated')
    return report
