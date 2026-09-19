#!/usr/bin/env python3
"""Read-only artifact qualification. Python 3.10+, optional FFmpeg/ffprobe for media."""
import argparse
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
from publication_lib.common import Invalid, load_json
from publication_lib import records
from publication_lib.index_review import index_review
from publication_lib.timeline import timeline
from publication_lib.datasets import dataset, experiment
from publication_lib.site import audit_site
from publication_lib.media import inspect_media


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ('research', 'debt', 'storyboard', 'explanation', 'index', 'timeline', 'dataset', 'experiment'):
        p = commands.add_parser(name); p.add_argument('input'); p.add_argument('--root', required=True)
    p = commands.add_parser('site'); p.add_argument('--root', required=True); p.add_argument('--base', required=True)
    p = commands.add_parser('media'); p.add_argument('input'); p.add_argument('--root', required=True); p.add_argument('--contract', required=True)
    args = parser.parse_args(argv)
    try:
        if args.command == 'site': result = audit_site(Path(args.root), args.base)
        elif args.command == 'media': result = inspect_media(Path(args.root), args.input, load_json(args.contract))
        elif args.command in ('index', 'timeline', 'dataset', 'experiment'):
            operation = {'index': index_review, 'timeline': timeline, 'dataset': dataset, 'experiment': experiment}[args.command]
            result = operation(load_json(args.input), Path(args.root))
        else: result = getattr(records, args.command)(load_json(args.input), Path(args.root))
        print(json.dumps(result, ensure_ascii=False, allow_nan=False))
        return 0 if result['status'] == 'checks-passed' else 3
    except (Invalid, ValueError, OSError, RecursionError, TypeError, KeyError) as error:
        # Never echo input documents, absolute paths, media errors, or secrets.
        print(json.dumps({'schemaVersion': 1, 'status': 'invalid-or-unavailable', 'code': type(error).__name__, 'message': str(error) if isinstance(error, Invalid) else 'The bounded input or probe could not be inspected.'}))
        return 2

if __name__ == '__main__':
    sys.exit(main())
