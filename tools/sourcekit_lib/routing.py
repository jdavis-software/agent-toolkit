"""Semantic routing guidance, never a claim of authenticated connector access."""
import platform
import shutil
import sys
from urllib.parse import urlsplit
from .common import VERSION, fail, public_url, host_matches

PLATFORMS = {
 'github': ['github.com', 'raw.githubusercontent.com'],
 'youtube': ['youtube.com', 'youtu.be'],
 'bilibili': ['bilibili.com', 'b23.tv'],
 'x': ['x.com', 'twitter.com', 't.co'],
 'reddit': ['reddit.com', 'redd.it'],
 'instagram': ['instagram.com'], 'facebook': ['facebook.com', 'fb.com'],
 'linkedin': ['linkedin.com'], 'xiaohongshu': ['xiaohongshu.com', 'xhslink.com'],
 'boss': ['zhipin.com'], 'v2ex': ['v2ex.com'], 'xueqiu': ['xueqiu.com'],
 'xiaoyuzhou': ['xiaoyuzhoufm.com']}

def route(url, intent='read'):
    url = public_url(url)
    if intent not in ('read', 'search', 'feed', 'transcript'): fail('invalid-intent', 'Unsupported source intent.')
    host = urlsplit(url).hostname
    channel = next((name for name, domains in PLATFORMS.items() if any(host_matches(host, domain) for domain in domains)), 'public-web')
    adapter = 'approved-platform-connector'
    if intent == 'search': adapter = 'approved-search-connector'
    elif intent == 'feed': adapter = 'sourcekit-public-feed'
    elif channel == 'github': adapter = 'connected-github-or-reviewed-gh'
    elif intent == 'transcript' or channel in ('youtube', 'bilibili', 'xiaoyuzhou'): adapter = 'approved-caption-or-transcription-adapter'
    elif channel == 'public-web': adapter = 'sourcekit-public-reader'
    return {'schemaVersion': 1, 'kind': 'source-route', 'url': url, 'channel': channel, 'intent': intent,
            'adapter': adapter, 'execution': 'none', 'availability': 'not-probed',
            'requirements': ['Authorize the specific source and operation.', 'Verify the actual operation, identity, and fresh access evidence.',
                             'Stop on authentication, access challenges, or rate limits; do not widen authority through fallback.'],
            'limits': ['Domain recognition is not implemented platform access.', 'No platform commands, installation, cookies, or models are invoked.']}

def doctor():
    from .formats import html_text, feed, transcript
    parser_ok = html_text('<p>check</p>')[0] == 'check'
    feed_ok = len(feed(b'<rss><channel><item><guid>one</guid></item></channel></rss>', 'https://example.com/feed')['items']) == 1
    captions_ok = len(transcript(b'WEBVTT\n\n00:00.000 --> 00:01.000\ncheck')['cues']) == 1
    return {'schemaVersion': 1, 'kind': 'sourcekit-doctor', 'version': VERSION, 'mode': 'offline',
            'python': platform.python_version(), 'runtimeSupported': sys.version_info >= (3, 10),
            'parsers': {'html': parser_ok, 'feeds': feed_ok, 'captions': captions_ok},
            'optionalCommands': [{'name': name, 'state': 'present-not-probed' if shutil.which(name) else 'missing'} for name in ('gh', 'yt-dlp', 'ffmpeg', 'node')],
            'liveAccess': 'not-tested', 'authorization': 'not-evaluated',
            'limits': ['Command presence is not health, authentication, or operation readiness.', 'No commands, browsers, credential stores, services, or network probes are executed.']}
