#!/usr/bin/env python3
"""Contact sheets for design review: the top of every page from qa/e2e/screens.mjs on one image.

    python3 -I qa/scripts/contact-sheet.py <screens-dir> [viewports-shown=2]

Writes <screens-dir>/sheet-mobile.jpg and sheet-desktop.jpg. Each tile is the top N viewport
heights of a full-page screenshot, labelled with the page. Reading two sheets reviews a whole
round without opening 22 screenshots.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

src = Path(sys.argv[1])
shown = float(sys.argv[2]) if len(sys.argv) > 2 else 2
# (viewport, viewport height in screenshot px, tile width, columns)
layouts = {'mobile': (844 * 2, 200, 6), 'desktop': (900, 380, 4)}

for vp, (vh, tile_w, cols) in layouts.items():
    shots = sorted(src.glob(f'*@{vp}.jpg'), key=lambda p: (not p.name.startswith(('home', 'shop', 'cart')), p.name))
    if not shots:
        continue
    tiles = []
    for p in shots:
        im = Image.open(p).convert('RGB')
        im = im.crop((0, 0, im.width, min(im.height, int(vh * shown))))
        im = im.resize((tile_w, round(im.height * tile_w / im.width)), Image.LANCZOS)
        tiles.append((p.name.split('@')[0], im))
    label_h, pad = 16, 8
    tile_h = max(t.height for _, t in tiles)
    rows = (len(tiles) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (tile_w + pad) + pad, rows * (tile_h + label_h + pad) + pad), (60, 60, 60))
    draw = ImageDraw.Draw(sheet)
    for i, (name, t) in enumerate(tiles):
        x = pad + (i % cols) * (tile_w + pad)
        y = pad + (i // cols) * (tile_h + label_h + pad)
        draw.text((x, y + 2), name[:34], fill=(255, 255, 255))
        sheet.paste(t, (x, y + label_h))
    out = src / f'sheet-{vp}.jpg'
    sheet.save(out, quality=80)
    print(out, sheet.size)
