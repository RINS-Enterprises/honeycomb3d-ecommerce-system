#!/usr/bin/env python3
# QA helper: classify image provenance markers (C2PA / Google Generative AI / SynthID, XMP CreatorTool, camera EXIF).
# Usage: python3 -I qa/scripts/image-provenance.py <image>...   (detects markers by content; does not cryptographically validate C2PA)
import sys, re, os
from PIL import Image, ExifTags
Image.MAX_IMAGE_PIXELS = None
for f in sys.argv[1:]:
    b = open(f, 'rb').read()
    ai = len(re.findall(rb'Created by Google Generative AI', b))
    synth = len(re.findall(rb'SynthID', b))
    c2pa = len(re.findall(rb'c2pa\.claim', b))
    tool = re.findall(rb'CreatorTool>([^<]{0,60})', b) or re.findall(rb'xmp:CreatorTool="([^"]{0,60})"', b)
    try:
        im = Image.open(f); size = im.size
        ex = im.getexif(); sub = ex.get_ifd(0x8769)
        tags = {ExifTags.TAGS.get(k, k): v for k, v in list(ex.items()) + list(sub.items())}
        cam = ' '.join(str(tags.get(k, '')).strip('\x00 ') for k in ('Make', 'Model')).strip()
        sw = str(tags.get('Software', '')).strip('\x00 ')
        dt = str(tags.get('DateTimeOriginal', tags.get('DateTime', ''))).strip('\x00 ')
        ori = tags.get('Orientation', '')
    except Exception as e:
        size, cam, sw, dt, ori = ('?',) * 5
    if ai: cls = 'AI-GENERATED (C2PA: Google Generative AI)'
    elif tool: cls = 'EDITED/EXPORTED (' + tool[0].decode('utf8', 'replace')[:30] + ')'
    elif cam: cls = 'CAMERA ORIGINAL'
    else: cls = 'NO PROVENANCE METADATA'
    name = os.path.basename(f).split('__', 1)[-1]
    print(f"{name[:46]:46s} {str(size):14s} {cls:44s} cam='{cam}' sw='{sw}' date='{dt}' orient={ori} c2pa={c2pa} synthid={synth}")
