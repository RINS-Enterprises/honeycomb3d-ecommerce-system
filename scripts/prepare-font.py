#!/usr/bin/env python3
"""Build the self-hosted heading font. Requires fonttools==4.55.3 and brotli==1.1.0.
   python scripts/prepare-font.py
Source: npm @fontsource-variable/bricolage-grotesque@5.3.0, files/bricolage-grotesque-latin-standard-normal.woff2
(SIL Open Font License 1.1; licence copied to assets/font-sources/OFL.txt and public/fonts/OFL.txt).
"""
from pathlib import Path
import hashlib, json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/font-sources/bricolage-grotesque-latin-standard-normal.woff2"
SOURCE_SHA = "a756882d8a7802ebd4663b4544a62ebedafc7227c1c159ab95eea61393af3f8e"
OUTPUT = ROOT / "public/fonts/bricolage-grotesque-display.woff2"
# Display use only: optical size pinned to 48, width 100, weight kept variable from 600 to 800.
AXES = {"opsz": 48.0, "wdth": 100.0, "wght": (600.0, 800.0)}
UNICODES = list(range(0x20, 0x7F)) + [0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x2122, 0x2190, 0x2192, 0x2197]
sha = lambda b: hashlib.sha256(b).hexdigest()

raw = SOURCE.read_bytes()
assert sha(raw) == SOURCE_SHA, "Font source hash mismatch"
font = instancer.instantiateVariableFont(TTFont(SOURCE), AXES)
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["kern", "liga", "calt", "case", "tnum", "lnum"]
options.name_IDs = ["*"]
options.notdef_outline = True
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=UNICODES)
subsetter.subset(font)
font.flavor = "woff2"
# Keep the source head timestamps so the output is byte-reproducible.
font.recalcTimestamp = False
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
font.save(OUTPUT)
data = OUTPUT.read_bytes()
assert len(data) <= 100_000, "Fonts must stay under about 100 KB in total"
record = {"family": "Bricolage Grotesque", "licence": "SIL Open Font License 1.1",
          "source": "npm @fontsource-variable/bricolage-grotesque@5.3.0 files/bricolage-grotesque-latin-standard-normal.woff2",
          "sourceSha256": SOURCE_SHA, "axes": {"opsz": 48, "wdth": 100, "wght": [600, 800]},
          "unicodes": "U+0020-007E, U+00A0, U+00A9, U+00B7, U+2013-2014, U+2018-2019, U+201C-201D, U+2026, U+2122, U+2190, U+2192, U+2197",
          "output": "/fonts/bricolage-grotesque-display.woff2", "bytes": len(data), "sha256": sha(data)}
(ROOT / "assets/font.json").write_text(json.dumps(record, indent=2) + "\n")
(ROOT / "docs/FONT-PROVENANCE.md").write_text(
    "# Heading font\n\n"
    "Bricolage Grotesque by the Bricolage Grotesque Project Authors (Mathieu Triay), SIL Open Font License 1.1. "
    "The licence ships next to the font at /fonts/OFL.txt and is kept in assets/font-sources/OFL.txt.\n\n"
    + "\n".join(f"- {k}: `{v}`" for k, v in record.items())
    + "\n\nThe variable source is instanced (optical size 48, width 100, weight 600 to 800) and subset to the characters above, "
    "then saved as WOFF2. It is self-hosted; no font CDN is used. Body text keeps the system font stack. "
    "Reproduce with python scripts/prepare-font.py using fonttools 4.55.3 and brotli 1.1.0.\n")
print(json.dumps(record))
