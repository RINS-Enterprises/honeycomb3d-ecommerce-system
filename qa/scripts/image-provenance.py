#!/usr/bin/env python3
# QA helper: classify image provenance markers (C2PA / Google Generative AI / SynthID, XMP CreatorTool, camera EXIF).
# Usage: python3 -I qa/scripts/image-provenance.py <image>...   (detects markers by content; does not cryptographically validate C2PA)
# Exit 1 if any file carries Google Generative AI / SynthID markers, or C2PA records of a Gemini edit
# (visible watermark, algorithmicallyEnhanced). Canva exports are reported as EDITED/EXPORTED (Canva). No markers is NOT proof of a real photo:
# stripped metadata removes them, so check stripped files through their recorded source hash instead.
import sys, re, os
from PIL import Image, ExifTags
Image.MAX_IMAGE_PIXELS = None
flagged = []
for f in sys.argv[1:]:
    b = open(f, 'rb').read()
    ai = len(re.findall(rb'Created by Google Generative AI|digitalsourcetype/(?:trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia)', b))
    synth = len(re.findall(rb'SynthID', b))
    # Gemini edits of real photos: C2PA records "Added visible watermark" (the sparkle) and/or an
    # algorithmicallyEnhanced source type, without a trainedAlgorithmicMedia claim.
    ai_edit = len(re.findall(rb'Added visible watermark|digitalsourcetype/algorithmicallyEnhanced', b))
    c2pa = len(re.findall(rb'c2pa\.claim', b))
    tool = re.findall(rb'CreatorTool>([^<]{0,60})', b) or re.findall(rb'xmp:CreatorTool="([^"]{0,60})"', b)
    if not tool and re.search(rb'Attrib:FbId|Canva', b): tool = [b'Canva']
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
    if ai or synth or ai_edit: flagged.append(f)
    if ai: cls = 'AI-GENERATED (C2PA: Google Generative AI)'
    elif synth: cls = 'AI MARKER (SynthID)'
    elif ai_edit: cls = 'AI-EDITED (C2PA: Gemini watermark/enhanced)'
    elif tool: cls = 'EDITED/EXPORTED (' + tool[0].decode('utf8', 'replace')[:30] + ')'
    elif cam: cls = 'CAMERA ORIGINAL'
    else: cls = 'NO PROVENANCE METADATA'
    name = os.path.basename(f).split('__', 1)[-1]
    print(f"{name[:46]:46s} {str(size):14s} {cls:44s} cam='{cam}' sw='{sw}' date='{dt}' orient={ori} c2pa={c2pa} synthid={synth} aiedit={ai_edit}")
if flagged:
    print(f'{len(flagged)} file(s) carry generative-AI markers', file=sys.stderr)
    sys.exit(1)
