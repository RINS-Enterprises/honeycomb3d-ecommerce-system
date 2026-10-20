#!/usr/bin/env python3
"""Export the owner's dark-background logo as a transparent PNG, without redrawing it.
Requires Pillow==11.3.0 and PyMuPDF==1.26.5:  python scripts/prepare-logo.py
"""
from pathlib import Path
from io import BytesIO
import hashlib, json
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/brand-sources/honeycomb-logo-black.pdf"
SOURCE_SHA = "c56586348b8cba098db3b75a7c63731974b5810035c23863b85ee3005a289a20"
BACKGROUND = b"0.137255 0.121569 0.12549 rg /a0 gs\n0 0 3000 3000 re f\n"
WIDTHS = [264, 660]
sha = lambda b: hashlib.sha256(b).hexdigest()

raw = SOURCE.read_bytes()
assert sha(raw) == SOURCE_SHA, "Logo source hash mismatch"
document = fitz.open(stream=raw, filetype="pdf")
assert len(document) == 1, "Expected a single logo page"
page = document[0]
contents = page.get_contents()
assert len(contents) == 1
stream = document.xref_stream(contents[0])
# The only change: drop the full-page charcoal background fill so the page renders
# on transparency. Every logo path, colour and the TM text stay as supplied.
assert stream.count(BACKGROUND) == 1, "Background fill not found exactly once"
document.update_stream(contents[0], stream.replace(BACKGROUND, b""))
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=True, colorspace=fitz.csRGB)
im = Image.open(BytesIO(pix.tobytes("png"))).convert("RGBA")
box = im.getchannel("A").point(lambda a: 255 if a > 0 else 0).getbbox()
assert box, "No logo artwork found"
art = im.crop(box)
outputs = []
for width in WIDTHS:
    height = round(art.height * width / art.width)
    resized = art.resize((width, height), Image.Resampling.LANCZOS)
    clean = Image.frombytes("RGBA", resized.size, resized.tobytes())
    src = f"/assets/honeycomb-logo-dark-{width}.png"
    target = ROOT / "public" / src.lstrip("/")
    clean.save(target, "PNG", optimize=True)
    data = target.read_bytes()
    outputs.append({"src": src, "width": width, "height": height, "bytes": len(data),
                    "sha256": sha(data), "quality": None})
record = {"id": "brand-logo-dark", "sourceTitle": "HONEYCOMB Logo in Black Background.pdf",
          "sourceDriveId": "1pIsPgG9hIyL3ox8ocN9arP65yd6asYF7", "sourceSha256": SOURCE_SHA,
          "input": "assets/brand-sources/honeycomb-logo-black.pdf", "inputSha256": SOURCE_SHA,
          "sourcePage": 1, "renderScale": 2, "renderSize": [pix.width, pix.height],
          "removed": "full-page background fill rgb(35,31,32) only", "cropBox": list(box),
          "outputs": outputs}
(ROOT / "assets/logo.json").write_text(json.dumps(record, indent=2) + "\n")
(ROOT / "docs/LOGO-PROVENANCE.md").write_text(
    "# Header and footer logo\n\n"
    "Exported directly from the owner's HONEYCOMB Logo in Black Background.pdf; no generated or redrawn artwork.\n\n"
    f"- Source Drive ID: `{record['sourceDriveId']}`\n"
    f"- Source SHA-256: `{SOURCE_SHA}` (22114 bytes; verified against the Drive file size on download)\n"
    f"- Source copy: `{record['input']}`\n"
    f"- Rendered page 1 at 2x ({pix.width} × {pix.height}). The single full-page background fill, rgb(35, 31, 32), was removed from the page content so the logo renders on transparency. "
    "The bee line art inside the hexagon keeps its supplied charcoal colour.\n"
    f"- Crop to the artwork bounds: `{tuple(box)}`; Lanczos resize to RGBA PNG at {', '.join(str(w) for w in WIDTHS)} px wide; no metadata.\n\n"
    "| Output | Dimensions | Bytes | SHA-256 |\n|---|---|---:|---|\n"
    + "".join(f"| `{o['src']}` | {o['width']} × {o['height']} | {o['bytes']} | `{o['sha256']}` |\n" for o in outputs) + "\n"
    "Reproduce with python scripts/prepare-logo.py using Pillow 11.3.0 and PyMuPDF 1.26.5.\n")
print(json.dumps(outputs))
