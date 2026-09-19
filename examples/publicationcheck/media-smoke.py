#!/usr/bin/env python3
"""Generate two tiny owned clips; run actual local ffprobe/FFmpeg verification."""
import json
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
import tempfile
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT/'tools'))
from publication_lib.common import digest
from publication_lib.media import inspect_media

spec = json.loads((ROOT/'examples/publicationcheck/media.json').read_text())
with tempfile.TemporaryDirectory(prefix='publication-media-') as folder:
    root = Path(folder)
    video = ['ffmpeg','-nostdin','-v','error','-f','lavfi','-i','color=c=gray:s=320x180:r=30:d=2']
    encode = ['-c:v','mpeg4','-q:v','5','-threads','1','-pix_fmt','yuv420p']
    subprocess.run([*video,'-f','lavfi','-i','sine=frequency=440:sample_rate=48000:duration=2',*encode,'-c:a','aac','-shortest',str(root/'valid.mp4')],check=True,timeout=30,capture_output=True)
    subprocess.run([*video,*encode,str(root/'no-audio.mp4')],check=True,timeout=30,capture_output=True)
    original = digest((root/'valid.mp4').read_bytes())
    valid = inspect_media(root,'valid.mp4',spec)
    missing = inspect_media(root,'no-audio.mp4',spec)
    wrong = inspect_media(root,'valid.mp4',{**spec,'durationSeconds':5})
    assert valid['status']=='checks-passed' and valid['decoded']
    assert missing['status']=='needs-review' and any(f['code']=='missing-audio' for f in missing['findings'])
    assert wrong['status']=='needs-review' and any(f['code']=='duration-mismatch' for f in wrong['findings'])
    assert original == digest((root/'valid.mp4').read_bytes())
    versions = {name:subprocess.run([name,'-version'],check=True,capture_output=True,text=True).stdout.splitlines()[0] for name in ('ffmpeg','ffprobe')}
    print(json.dumps({'synthetic':True,'versions':versions,'valid':valid,'missingAudio':missing['findings'],'wrongDuration':wrong['findings'],'inputPreserved':True}))
