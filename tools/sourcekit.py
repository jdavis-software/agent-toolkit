#!/usr/bin/env python3
"""Sourcekit: original bounded public source intake. Python standard library only."""
from __future__ import annotations
import argparse
import json
import sys
sys.dont_write_bytecode = True
from sourcekit_lib.common import SourceError, envelope, fail, json_input, public_url, read_local
from sourcekit_lib.formats import document, feed, compare_feeds, transcript
from sourcekit_lib.routing import route, doctor
from sourcekit_lib.transport import fetch_public

def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    p = commands.add_parser('route', help='Propose a source adapter without executing it')
    p.add_argument('url'); p.add_argument('--intent', choices=['read', 'search', 'feed', 'transcript'], default='read')
    commands.add_parser('doctor', help='Offline parser checks and command presence, not live access')
    p = commands.add_parser('read', help='One explicitly authorized public HTTPS read')
    p.add_argument('url'); p.add_argument('--allow-host', action='append', required=True)
    p.add_argument('--format', choices=['auto', 'html', 'text', 'feed'], default='auto')
    p = commands.add_parser('parse', help='Parse one local capture; does not fetch its source URL')
    p.add_argument('file'); p.add_argument('--source-url', required=True); p.add_argument('--format', choices=['html', 'text', 'feed', 'transcript'], required=True)
    p.add_argument('--language', default='und'); p.add_argument('--origin', choices=['unknown', 'captions', 'automatic-captions', 'human-transcript'], default='unknown')
    p = commands.add_parser('diff', help='Compare local Sourcekit feed packets')
    p.add_argument('before'); p.add_argument('after')
    args = parser.parse_args(argv)
    try:
        if args.command == 'route': result = route(args.url, args.intent)
        elif args.command == 'doctor': result = doctor()
        elif args.command == 'diff': result = compare_feeds(json_input(read_local(args.before)), json_input(read_local(args.after)))
        else:
            live = args.command == 'read'; url = public_url(args.url if live else args.source_url)
            observation = None; format = args.format
            if live:
                if route(url, 'feed' if format == 'feed' else 'read')['adapter'] not in ('sourcekit-public-reader', 'sourcekit-public-feed'):
                    fail('adapter-required', 'Use an approved platform connector for this URL; direct platform scraping is not implemented.')
                raw, observation = fetch_public(url, args.allow_host)
                if format == 'auto':
                    mime = observation['mimeType']
                    format = 'html' if mime == 'text/html' else 'feed' if mime in ('application/rss+xml', 'application/atom+xml', 'application/feed+json') else 'text'
            else: raw = read_local(args.file)
            base = observation['finalUrl'] if live else url
            if format == 'feed': kind, content = 'feed', feed(raw, base)
            elif format == 'transcript': kind, content = 'transcript', transcript(raw, args.language, args.origin)
            else: kind, content = 'document', document(raw, format)
            result = envelope(kind, raw, content, url, mode='live' if live else 'local', final_url=base,
                              observations=[observation] if observation else ['Local capture only; no network was used.'])
        print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))
        return 0
    except SourceError as error:
        print(json.dumps({'schemaVersion': 1, 'status': 'blocked', 'code': error.code, 'message': str(error)}))
        return 2
    except (ValueError, TypeError, KeyError, IndexError, UnicodeError, RecursionError):
        print(json.dumps({'schemaVersion': 1, 'status': 'blocked', 'code': 'invalid-input', 'message': 'Input did not match the supported contract.'}))
        return 2

if __name__ == '__main__':
    sys.exit(main())
