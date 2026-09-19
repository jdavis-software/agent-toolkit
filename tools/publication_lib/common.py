"""Bounded public-artifact inputs. Paths are local, owned and non-symlinked."""
from __future__ import annotations
import hashlib
import json
import math
import os
from pathlib import Path
import re
import stat
from typing import Any

MAX_BYTES = 2 * 1024 * 1024

class Invalid(ValueError):
    """Invalid input; messages never include source bodies or credentials."""


def text(value: Any, limit: int = 4096) -> str:
    if not isinstance(value, str) or not value.strip() or len(value) > limit or '\x00' in value:
        raise Invalid('Expected bounded nonempty text')
    return value


def ident(value: Any) -> str:
    if not isinstance(value, str) or not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', value):
        raise Invalid('Invalid record identity')
    return value


def fields(value: Any, required: set[str], optional: set[str] = frozenset()) -> dict:
    if not isinstance(value, dict) or not required <= value.keys() or value.keys() - required - optional:
        raise Invalid('Missing or unexpected fields')
    return value


def rows(value: Any, maximum: int = 200, allow_empty: bool = False) -> list:
    if not isinstance(value, list) or len(value) > maximum or (not value and not allow_empty):
        raise Invalid('Invalid list size')
    return value


def number(value: Any, low: float = 0, high: float = 10**9, integer: bool = False) -> float:
    if type(value) not in (int, float) or not math.isfinite(value) or not low <= value <= high:
        raise Invalid('Invalid numeric bound')
    if integer and type(value) is not int:
        raise Invalid('Expected integer')
    return value


def choose(value: Any, choices: set[str]) -> str:
    if not isinstance(value, str) or value not in choices:
        raise Invalid('Unsupported state')
    return value


def sha(value: Any) -> str:
    if not isinstance(value, str) or not re.fullmatch(r'[0-9a-f]{64}', value):
        raise Invalid('Invalid SHA-256')
    return value


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def local_path(root: Path, relative: str) -> Path:
    text(relative, 512)
    parts = relative.split('/')
    if relative.startswith('/') or re.search(r'[\\:\x00-\x1f]', relative) or any(x in ('', '.', '..', '.git') for x in parts):
        raise Invalid('Unsafe relative path')
    root = root.resolve(strict=True)
    p = root
    for part in parts:
        p = p / part
        if p.is_symlink():
            raise Invalid('Symlink inputs are not supported')
    if not p.resolve(strict=True).is_relative_to(root):
        raise Invalid('Input escapes root')
    return p


def read_bytes(root: Path, relative: str, maximum: int = MAX_BYTES) -> bytes:
    p = local_path(root, relative)
    initial = p.stat(follow_symlinks=False)
    if not stat.S_ISREG(initial.st_mode) or initial.st_size > maximum:
        raise Invalid('Input is not a bounded regular file')
    with p.open('rb') as f:
        info = os.fstat(f.fileno())
        if not stat.S_ISREG(info.st_mode) or info.st_size > maximum:
            raise Invalid('Input is not a bounded regular file')
        data = f.read(maximum + 1)
    if len(data) > maximum:
        raise Invalid('Input exceeds size limit')
    return data


def _object(pairs: list) -> dict:
    result = {}
    for key, value in pairs:
        if key in result:
            raise Invalid('Duplicate JSON key')
        result[key] = value
    return result


def parse_json(data: bytes) -> Any:
    if len(data) > MAX_BYTES:
        raise Invalid('JSON input exceeds size limit')
    def reject(_: str):
        raise Invalid('Non-finite JSON number')
    value = json.loads(data.decode('utf-8'), object_pairs_hook=_object, parse_constant=reject)
    def depth(x: Any, level: int = 0):
        if level > 24:
            raise Invalid('JSON nesting exceeds limit')
        if isinstance(x, dict):
            for v in x.values(): depth(v, level + 1)
        elif isinstance(x, list):
            for v in x: depth(v, level + 1)
    depth(value)
    return value


def load_json(path: str) -> Any:
    p = Path(path).absolute()
    # Check the complete path, not only its last component.
    data = read_bytes(Path(p.anchor), p.as_posix().lstrip('/'))
    return parse_json(data)


def receipt(kind: str, data: Any, findings: list, **extra: Any) -> dict:
    encoded = json.dumps(data, sort_keys=True, ensure_ascii=False, allow_nan=False, separators=(',', ':')).encode()
    return {'schemaVersion': 1, 'kind': kind, 'status': 'needs-review' if findings else 'checks-passed',
            'inputSha256': digest(encoded), 'findings': findings,
            'authority': 'consistency-check-not-approval', **extra}


def issue(code: str, item: str) -> dict:
    return {'code': code, 'item': ident(item)}


def evidence(document: list, root: Path) -> tuple[dict, list]:
    result, findings, total = {}, [], 0
    for source in rows(document):
        fields(source, {'id', 'path', 'sha256'})
        sid = ident(source['id'])
        if sid in result:
            raise Invalid('Duplicate evidence identity')
        sha(source['sha256'])
        body = read_bytes(root, source['path'])
        total += len(body)
        if total > 8 * MAX_BYTES:
            raise Invalid('Aggregate evidence exceeds limit')
        if digest(body) != source['sha256']:
            findings.append(issue('evidence-changed', sid))
        result[sid] = body.decode('utf-8')
    return result, findings


def citations(values: list, sources: dict, item: str) -> list:
    findings = []
    for cite in rows(values, 20, allow_empty=True):
        fields(cite, {'sourceId', 'quote'})
        sid = ident(cite['sourceId'])
        quote = text(cite['quote'])
        if sid not in sources:
            raise Invalid('Unknown evidence reference')
        if quote not in sources[sid]:
            findings.append(issue('quote-not-in-capture', item))
    return findings
