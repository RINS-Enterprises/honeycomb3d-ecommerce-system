#!/usr/bin/env python3
"""Export the supplied brand symbol, without redrawing it.
Requires Pillow==11.3.0 and PyMuPDF==1.26.5.
"""
from pathlib import Path
from io import BytesIO
import hashlib, json
import fitz
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "assets/brand-sources/honeycomb-symbol.pdf"
raw = source.read_bytes()
document = fitz.open(stream=raw, filetype="pdf")
assert len(document) == 1, "Expected a single brand-symbol page"
page = document[0]
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False, colorspace=fitz.csRGB)
im = Image.open(BytesIO(pix.tobytes("png"))).convert("RGB")
# Remove only the white page margin. Preserve all nonwhite artwork.
mask = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L").point(lambda p: 255 if p > 8 else 0)
box = mask.getbbox()
assert box, "No symbol artwork found"
art = im.crop(box)
side = max(art.size)
canvas = Image.new("RGB", (side, side), "white")
canvas.paste(art, ((side-art.width)//2, (side-art.height)//2))
target = ROOT / "public/favicon.ico"
target.parent.mkdir(parents=True, exist_ok=True)
canvas.resize((256,256), Image.Resampling.LANCZOS).save(target, format="ICO", sizes=[(16,16),(32,32),(48,48)])
preview = ROOT / "test-results/favicon-preview.png"
preview.parent.mkdir(parents=True, exist_ok=True)
canvas.resize((256,256), Image.Resampling.LANCZOS).save(preview)
sha = lambda b: hashlib.sha256(b).hexdigest()
# Apple touch icon: the same symbol rendered on transparency, centred on the site's charcoal (iOS adds no transparency).
alpha_pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=True, colorspace=fitz.csRGB)
symbol = Image.open(BytesIO(alpha_pix.tobytes("png"))).convert("RGBA")
symbol = symbol.crop(symbol.getchannel("A").getbbox())
symbol.thumbnail((136, 136), Image.Resampling.LANCZOS)
touch = Image.new("RGBA", (180, 180), (12, 11, 10, 255))
touch.alpha_composite(symbol, ((180 - symbol.width) // 2, (180 - symbol.height) // 2))
touch = Image.frombytes("RGB", touch.size, touch.convert("RGB").tobytes())
touch_target = ROOT / "public/apple-touch-icon.png"
touch.save(touch_target, "PNG", optimize=True)
record = {"sourceDriveId":"1AOoBNTsdAzj_getImty-054LJWxjzfFq","sourceTitle":"HONEYCOMB Symbol.pdf",
          "sourceSha256":sha(raw),"sourcePage":1,"renderScale":2,
          "renderSize":list(im.size),"cropBox":list(box),"squarePadding":"centered, white",
          "output":"/favicon.ico","sizes":[16,32,48],"bytes":target.stat().st_size,
          "outputSha256":sha(target.read_bytes()),
          "appleTouchIcon":{"output":"/apple-touch-icon.png","size":[180,180],"background":"#0c0b0a",
                            "symbolSize":list(symbol.size),"bytes":touch_target.stat().st_size,
                            "sha256":sha(touch_target.read_bytes())}}
(ROOT / "assets/favicon.json").write_text(json.dumps(record,indent=2)+"\n")
(ROOT / "docs/FAVICON-PROVENANCE.md").write_text(
    "# Brand symbol favicon\n\nExported directly from the owner's HONEYCOMB Symbol.pdf; no generated artwork.\n\n"
    + "\n".join("- "+k+": "+str(v) for k,v in record.items())
    + "\n\nCrop coordinates refer to the 2x rendered first PDF page. Aspect ratio is preserved on a centered white square. "
    "ICO contains 16, 32 and 48 pixel frames; no EXIF/XMP/ICC metadata is copied. "
    "The 180 x 180 apple-touch-icon.png renders the same page on transparency, fits the symbol in 136 px and centres it on #0c0b0a. "
    "Reproduce with python scripts/prepare-favicon.py using Pillow 11.3.0 and PyMuPDF 1.26.5.\n")
print(json.dumps(record))
