#!/usr/bin/env python3
"""Remove camera, timestamp, GPS, XMP and text metadata from a verified source photo without
re-encoding it:  python scripts/clean-source.py <original> <output> <expected-original-sha256>
JPEG keeps only the ICC profile (APP2) plus the image segments; PNG keeps IHDR, PLTE, tRNS,
pHYs, IDAT and IEND. The decoded pixels of the output must equal the original's.
"""
import hashlib, struct, sys
from io import BytesIO
from PIL import Image

source, target, expected = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(source, "rb").read()
if hashlib.sha256(raw).hexdigest() != expected:
    sys.exit("Original SHA-256 mismatch")
if raw[:2] == b"\xff\xd8":
    out, p = bytearray(raw[:2]), 2
    while True:
        marker = int.from_bytes(raw[p:p + 2], "big")
        if marker == 0xFFDA:  # start of scan: the rest is entropy-coded data
            out += raw[p:]
            break
        length = int.from_bytes(raw[p + 2:p + 4], "big")
        segment = raw[p:p + 2 + length]
        is_app = 0xFFE0 <= marker <= 0xFFEF
        keep = not is_app and marker != 0xFFFE or (marker == 0xFFE2 and segment[4:16] == b"ICC_PROFILE\0")
        if marker == 0xFFEE and Image.open(BytesIO(raw)).info.get("adobe_transform") not in (None, 1):
            keep = True  # Adobe transform is needed to decode non-YCbCr data
        if keep:
            out += segment
        p += 2 + length
elif raw[:8] == b"\x89PNG\r\n\x1a\n":
    out, p = bytearray(raw[:8]), 8
    while p < len(raw):
        length = struct.unpack(">I", raw[p:p + 4])[0]
        kind = raw[p + 4:p + 8]
        if kind in (b"IHDR", b"PLTE", b"tRNS", b"pHYs", b"IDAT", b"IEND"):
            out += raw[p:p + 12 + length]
        p += 12 + length
else:
    sys.exit("Unsupported source format")
with Image.open(BytesIO(raw)) as a, Image.open(BytesIO(bytes(out))) as b:
    if a.size != b.size or a.mode != b.mode or a.tobytes() != b.tobytes():
        sys.exit("Decoded pixels changed")
    if b.getexif() or any(k in b.info for k in ("exif", "xmp", "XML:com.adobe.xmp", "photoshop", "comment")):
        sys.exit("Metadata remains")
open(target, "wb").write(out)
print(target, len(out), hashlib.sha256(out).hexdigest())
