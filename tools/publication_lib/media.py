"""Bounded, explicit local media probe/decode. No transforms or network protocols."""
from __future__ import annotations
from fractions import Fraction
from pathlib import Path
import os
import selectors
import shutil
import subprocess
import time
from .common import Invalid, fields, number, text, choose, read_bytes, local_path, parse_json, digest, receipt


def command(argv: list[str], timeout: float = 30) -> bytes:
    """Bound output while reading both pipes, with an actual elapsed-time deadline."""
    executable = shutil.which(argv[0])
    if not executable: raise Invalid('Required local media executable is unavailable')
    proc = subprocess.Popen([executable, *argv[1:]], stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=False)
    result = bytearray(); size = 0; start = time.monotonic()
    try:
        with selectors.DefaultSelector() as sel:
            sel.register(proc.stdout, selectors.EVENT_READ, 'stdout')
            sel.register(proc.stderr, selectors.EVENT_READ, 'stderr')
            while sel.get_map():
                remaining = timeout - (time.monotonic() - start)
                if remaining <= 0: raise Invalid('Media command timed out')
                for key, _ in sel.select(min(remaining, 0.2)):
                    chunk = os.read(key.fileobj.fileno(), 8192)
                    if not chunk: sel.unregister(key.fileobj); continue
                    size += len(chunk)
                    if size > 1024 * 1024: raise Invalid('Media command output exceeds limit')
                    if key.data == 'stdout': result.extend(chunk)
            try:
                proc.wait(timeout=max(.001, timeout - (time.monotonic() - start)))
            except subprocess.TimeoutExpired as error:
                raise Invalid('Media command timed out') from error
        if proc.returncode: raise Invalid('Media probe or decode failed')
        return bytes(result)
    finally:
        if proc.poll() is None: proc.kill(); proc.wait()
        proc.stdout.close(); proc.stderr.close()


def inspect_media(root: Path, relative: str, spec: dict) -> dict:
    fields(spec, {'schemaVersion', 'width', 'height', 'durationSeconds', 'toleranceSeconds', 'fps', 'audio'})
    if type(spec['schemaVersion']) is not int or spec['schemaVersion'] != 1: raise Invalid('Unsupported schema')
    for name in ('width', 'height'): number(spec[name], 1, 7680, True)
    number(spec['durationSeconds'], .01, 120); number(spec['toleranceSeconds'], 0, 1)
    text(spec['fps'], 32); choose(spec['audio'], {'required', 'absent', 'optional'})
    try: wanted_fps = Fraction(spec['fps'])
    except (ValueError, ZeroDivisionError): raise Invalid('Invalid frame-rate ratio')
    if not 0 < wanted_fps <= 120: raise Invalid('Invalid frame-rate bound')
    path = local_path(root, relative)
    # Single-file containers only. Input demuxers and protocols are restricted too.
    if path.suffix.lower() not in {'.mp4', '.mov', '.mkv', '.webm'}: raise Invalid('Unsupported single-file container')
    before = read_bytes(root, relative, 32 * 1024 * 1024)
    options = ['-v', 'error', '-protocol_whitelist', 'file', '-format_whitelist', 'mov,matroska,webm', '-threads', '1']
    raw = command(['ffprobe', *options, '-show_entries', 'format=duration:stream=codec_type,width,height,avg_frame_rate,sample_aspect_ratio:stream_side_data=rotation', '-of', 'json', '-i', str(path)])
    probe = parse_json(raw)
    if not isinstance(probe, dict) or not isinstance(probe.get('streams'), list): raise Invalid('Malformed probe output')
    video = [s for s in probe['streams'] if s.get('codec_type') == 'video']
    audio = [s for s in probe['streams'] if s.get('codec_type') == 'audio']
    findings = []
    def add(code): findings.append({'code': code, 'item': 'output'})
    duration = None
    try:
        duration = float(probe.get('format', {}).get('duration')); number(duration, .001, 120)
    except (TypeError, ValueError):
        duration = None
        add('unknown-or-excessive-duration')
    if duration is not None and abs(duration - spec['durationSeconds']) > spec['toleranceSeconds']: add('duration-mismatch')
    if len(video) != 1: add('expected-one-video-stream')
    else:
        v = video[0]
        if (v.get('width'), v.get('height')) != (spec['width'], spec['height']): add('dimension-mismatch')
        try: actual_fps = Fraction(v.get('avg_frame_rate', '0/0'))
        except (ValueError, ZeroDivisionError): actual_fps = None
        if actual_fps != wanted_fps: add('frame-rate-mismatch')
        if v.get('sample_aspect_ratio') not in (None, '1:1'): add('non-square-pixels')
        if any(side.get('rotation', 0) != 0 for side in v.get('side_data_list', [])): add('rotation-needs-review')
    if spec['audio'] == 'required' and not audio: add('missing-audio')
    if spec['audio'] == 'absent' and audio: add('unexpected-audio')
    # Bound expensive decoding using probe-derived size/time checks and an external timeout.
    safe_decode = duration is not None and 0 < duration <= 120 and len(video) == 1 and len(audio) <= 2 and number(video[0].get('width'), 1, 7680) and number(video[0].get('height'), 1, 7680)
    decoded = False
    if safe_decode:
        command(['ffmpeg', '-nostdin', *options, '-xerror', '-i', str(path), '-map', '0:v:0', '-map', '0:a?', '-threads', '1', '-f', 'null', '-'])
        decoded = True
    else: add('decode-not-performed')
    after = read_bytes(root, relative, 32 * 1024 * 1024)
    if digest(before) != digest(after): add('input-changed-during-check')
    return receipt('media', {'spec': spec, 'inputSha256': digest(before)}, findings, decoded=decoded,
                   durationSeconds=duration, audioStreams=len(audio), videoStreams=len(video),
                   limitations=['Trusted owned local input only; not an OS sandbox.', 'Metadata and decoding do not prove perceptual quality, audible content, rights or caption synchronization.', 'No output file is written.'])
