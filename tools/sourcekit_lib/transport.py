"""Explicit single-URL GETs: exact hosts, public DNS, pinned socket, TLS identity."""
from __future__ import annotations
import http.client
import ipaddress
import socket
import ssl
import time
from urllib.parse import urlsplit, urljoin
from .common import MAX_BYTES, SourceError, fail, public_url

# Refuse transition/mapped ranges rather than depend on network-specific routing.
EXCLUDED = tuple(ipaddress.ip_network(x) for x in ('192.0.0.0/24', '198.18.0.0/15', '64:ff9b::/96', '64:ff9b:1::/48', '2001::/32', '2002::/16'))

def public_ip(value: str) -> bool:
    try:
        ip = ipaddress.ip_address(value)
    except ValueError:
        return False
    return ip.is_global and not ip.is_multicast and not ip.is_reserved and not any(ip.version == n.version and ip in n for n in EXCLUDED) and not getattr(ip, 'ipv4_mapped', None)

def resolve_public(host: str):
    try:
        records = socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)
    except OSError:
        fail('dns-unavailable', 'The destination could not be resolved.')
    if not records or len(records) > 64 or any(not public_ip(row[4][0]) for row in records):
        fail('private-target', 'All resolved addresses must be public unicast destinations.')
    return records[0]

class PinnedHTTPS(http.client.HTTPSConnection):
    def __init__(self, host, address, timeout):
        super().__init__(host, 443, timeout=timeout, context=ssl.create_default_context())
        self.address = address
    def connect(self):
        family, socktype, proto, _, sockaddr = self.address
        raw = socket.socket(family, socktype, proto)
        try:
            raw.settimeout(self.timeout)
            raw.connect(sockaddr)  # Numeric address; no second DNS resolution.
            if not public_ip(raw.getpeername()[0]):
                fail('private-target', 'Connected peer is not a public address.')
            self.sock = self._context.wrap_socket(raw, server_hostname=self.host)
        except BaseException:
            raw.close()
            raise

def fetch_public(url: str, allowed_hosts: list[str], *, timeout=15):
    current = public_url(url)
    if not allowed_hosts or len(allowed_hosts) > 8:
        fail('host-not-approved', 'Supply one to eight explicit --allow-host names.')
    for host in allowed_hosts:
        if urlsplit(public_url('https://' + host + '/')).hostname != host:
            fail('invalid-host', 'Allow-host values must be exact lowercase hostnames.')
    if not isinstance(timeout, (int, float)) or not 1 <= timeout <= 30:
        fail('invalid-timeout', 'Socket timeout must be between 1 and 30 seconds.')
    deadline = time.monotonic() + timeout
    visited = set()
    for hop in range(4):
        p = urlsplit(current)
        if p.hostname not in allowed_hosts:
            fail('host-not-approved', 'Destination or redirect is outside the approved host list.')
        if current in visited:
            fail('redirect-loop', 'Repeated redirect target.')
        visited.add(current)
        address = resolve_public(p.hostname)
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            fail('timeout', 'Public read exceeded the request deadline.')
        conn = PinnedHTTPS(p.hostname, address, remaining)
        try:
            conn.request('GET', p.path + ('?' + p.query if p.query else ''), headers={
                'User-Agent': 'Jordans-Sourcekit/0.1 (single-source research)',
                'Accept': 'text/html, text/plain, application/json, application/atom+xml, application/rss+xml, application/xml',
                'Accept-Encoding': 'identity', 'Connection': 'close'})
            response = conn.getresponse()
            status = response.status
            if status in (301, 302, 303, 307, 308):
                location = response.getheader('Location')
                if not location or hop == 3:
                    fail('redirect-limit', 'Redirect target missing or hop limit reached.')
                current = public_url(urljoin(current, location))
                continue
            if status != 200:
                code = {401: 'authentication-required', 403: 'access-denied', 404: 'not-found', 429: 'rate-limited'}.get(status, 'http-error')
                fail(code, f'Upstream returned HTTP {status}; no response body was accepted.')
            if (response.getheader('Content-Encoding') or 'identity').lower() != 'identity':
                fail('unsupported-encoding', 'Compressed HTTP payloads are not accepted in this reader version.')
            content_type = (response.getheader('Content-Type') or '').lower()
            mime = content_type.split(';')[0].strip()
            if mime not in ('text/html', 'text/plain', 'text/markdown', 'text/vtt', 'application/json', 'application/feed+json', 'application/rss+xml', 'application/atom+xml', 'application/xml', 'text/xml'):
                fail('unsupported-content', 'Response is not a supported text/feed representation.')
            if 'charset=' in content_type and content_type.split('charset=', 1)[1].strip(' "') not in ('utf-8', 'utf8', 'us-ascii'):
                fail('unsupported-encoding', 'Only UTF-8/ASCII HTTP text is supported.')
            length = response.getheader('Content-Length')
            if length and (not length.isdigit() or int(length) > MAX_BYTES):
                fail('too-large', 'Response Content-Length is invalid or exceeds 1 MiB.')
            chunks = []; size = 0
            while True:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    fail('timeout', 'Public read exceeded the request deadline.')
                if conn.sock is not None:
                    conn.sock.settimeout(remaining)
                block = response.read1(min(65536, MAX_BYTES + 1 - size))
                if not block:
                    break
                chunks.append(block); size += len(block)
                if size > MAX_BYTES:
                    fail('too-large', 'Response exceeds 1 MiB; partial content is rejected.')
            if length is not None and size != int(length):
                fail('incomplete-response', 'Response ended before its declared length; partial content is rejected.')
            return b''.join(chunks), {'finalUrl': current, 'mimeType': mime, 'redirects': hop, 'httpStatus': status}
        except SourceError:
            raise
        except socket.timeout:
            fail('timeout', 'Public HTTPS operation timed out; partial content is rejected.')
        except (OSError, http.client.HTTPException, ssl.SSLError):
            fail('network-error', 'Public HTTPS read failed; no credential or private-network fallback was attempted.')
        finally:
            conn.close()
    fail('redirect-limit', 'Too many redirects.')
