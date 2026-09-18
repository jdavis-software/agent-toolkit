#!/usr/bin/env python3
"""Copy explicitly selected, pinned source packages. Never execute upstream code.

Usage: python3 scripts/import-upstream.py [--archives /path/to/reviewed/tarballs]
Existing vendor contents must match the generated snapshot; edits are never overwritten.
For an update, review the new pin/license, then remove only the owned package and lock
in a dedicated branch before regenerating and inspecting the complete diff.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import tarfile
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
MAX_ARCHIVE = 64 * 1024 * 1024
MAX_PACKAGE = 4 * 1024 * 1024
ALLOWED = {'.md', '.txt', '.py', '.sh', '.ts', '.json', '.yaml', '.yml'}

def safe_path(value):
    p = PurePosixPath(value)
    if p.is_absolute() or not p.parts or '..' in p.parts or '\\' in value:
        raise ValueError(f'Unsafe path: {value}')
    return p

def digest(data):
    return hashlib.sha256(data).hexdigest()

def assemble(archives):
    sources = json.loads((ROOT / 'catalog/upstreams.json').read_text())
    entries = json.loads((ROOT / 'catalog/entries.json').read_text())
    outputs, packages = {}, []
    for sid, source in sources.items():
        selected = [e for e in entries if e.get('sourceId') == sid and e.get('vendorPath')]
        if not selected:
            continue
        if not re.fullmatch(r'[a-z0-9-]+', sid) or not re.fullmatch(r'[\w.-]+/[\w.-]+', source['repo']) or not re.fullmatch(r'[0-9a-f]{40}', source['revision']):
            raise ValueError('Invalid source identity')
        if archives:
            data = (archives / f'{sid}.tar.gz').read_bytes()
        else:
            url = f"https://codeload.github.com/{source['repo']}/tar.gz/{source['revision']}"
            with urllib.request.urlopen(url, timeout=90) as response:
                data = response.read(MAX_ARCHIVE + 1)
        if len(data) > MAX_ARCHIVE or digest(data) != source['archiveSha256']:
            raise ValueError(f'Archive integrity mismatch: {sid}')
        with tarfile.open(fileobj=io.BytesIO(data), mode='r:gz') as archive:
            members = {}
            for member in archive.getmembers():
                path = safe_path(member.name)
                if len(path.parts) < 2:
                    continue
                relative = str(PurePosixPath(*path.parts[1:]))
                if relative in members:
                    raise ValueError(f'Duplicate archive member: {relative}')
                members[relative] = member
            for entry in selected:
                prefix = str(safe_path(entry['upstreamPath'])) + '/'
                dest = str(safe_path(entry['vendorPath']))
                if dest != f"vendor/{sid}/{PurePosixPath(entry['upstreamPath']).name}":
                    raise ValueError('Unexpected vendor destination')
                matches = [(name, name[len(prefix):]) for name in members if name.startswith(prefix) and not members[name].isdir()]
                license_name = entry['packageLicense']
                safe_path(license_name)
                if license_name not in members:
                    raise ValueError(f'Missing license: {entry["id"]}')
                if not license_name.startswith(prefix):
                    matches.append((license_name, 'UPSTREAM_LICENSE.txt'))
                if not any(local == 'SKILL.md' for _, local in matches):
                    raise ValueError('Missing package entry point')
                records, total = [], 0
                for upstream, local in sorted(matches):
                    safe_path(local)
                    member = members[upstream]
                    if not member.isfile() or member.size > MAX_PACKAGE:
                        raise ValueError(f'Unsupported archive member: {upstream}')
                    if PurePosixPath(local).suffix.lower() not in ALLOWED:
                        raise ValueError(f'Unreviewed file type: {upstream}')
                    content = archive.extractfile(member).read()
                    content.decode('utf8')
                    total += len(content)
                    if total > MAX_PACKAGE or len(matches) > 200:
                        raise ValueError('Package exceeds review bounds')
                    local_path = f'{dest}/{local}'
                    if local_path in outputs:
                        raise ValueError(f'Duplicate destination: {local_path}')
                    outputs[local_path] = content
                    records.append({'path': local_path, 'upstreamPath': upstream, 'sha256': digest(content)})
                packages.append({'id': entry['id'], 'sourceId': sid, 'revision': source['revision'], 'vendorPath': dest, 'license': entry['license'], 'licensePath': f"{dest}/{license_name[len(prefix):] if license_name.startswith(prefix) else 'UPSTREAM_LICENSE.txt'}", 'files': records})
    lock = {'schemaVersion': 1, 'packages': sorted(packages, key=lambda p: p['id'])}
    outputs['catalog/upstream-lock.json'] = (json.dumps(lock, indent=2) + '\n').encode()
    existing = {str(p.relative_to(ROOT)) for p in (ROOT / 'vendor').rglob('*') if p.is_file() or p.is_symlink()} if (ROOT / 'vendor').exists() else set()
    if existing - outputs.keys():
        raise ValueError('Unowned or stale vendor files; review before removing')
    for path, content in outputs.items():
        target = ROOT / path
        if any(p.is_symlink() for p in [target, *target.parents]):
            raise ValueError(f'Symlink destination: {path}')
        if target.exists() and target.read_bytes() != content:
            raise ValueError(f'Refusing to overwrite changed file: {path}')
    for path, content in outputs.items():
        target = ROOT / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
    print(f"Imported {len(packages)} source packages; {len(outputs)-1} files; no upstream code executed.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archives', type=Path)
    args = parser.parse_args()
    assemble(args.archives)
