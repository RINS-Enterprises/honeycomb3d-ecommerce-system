#!/usr/bin/env python3
"""Regenerate checked-in derivatives: python -m pip install Pillow==11.3.0
   python scripts/prepare-images.py
Source files stay outside public/. No raw Drive originals are served.
"""
from pathlib import Path
from io import BytesIO
import hashlib, json
import PIL
from PIL import Image, ImageOps, ImageCms, features

ROOT = Path(__file__).resolve().parents[1]
SPECS = json.loads((ROOT / "assets/image-sources.json").read_text())
OUT = ROOT / "public/assets"
OUT.mkdir(parents=True, exist_ok=True)
digest = lambda b: hashlib.sha256(b).hexdigest()
products = json.loads((ROOT / "data/products.json").read_text())
records = []
hero = None
for entry in SPECS["assets"]:
    source = (ROOT / entry["input"]).resolve()
    if not source.is_relative_to(ROOT / "assets/photo-sources"):
        raise ValueError("Source must be inside assets/photo-sources")
    raw = source.read_bytes()
    if digest(raw) != entry["inputSha256"]:
        raise ValueError("Normalized source hash mismatch: " + entry["id"])
    with Image.open(BytesIO(raw)) as original:
        if list(original.size) != entry["sourceSize"]:
            raise ValueError("Source dimensions mismatch: " + entry["id"])
        # Orientation was read from the verified Drive original before metadata removal.
        original.getexif()[274] = entry["exifOrientation"]
        oriented = ImageOps.exif_transpose(original)
        oriented_size = list(oriented.size)
        crop = entry["cropBox"] or [0, 0, oriented.width, oriented.height]
        left, top, right, bottom = crop
        if not (0 <= left < right <= oriented.width and 0 <= top < bottom <= oriented.height):
            raise ValueError("Invalid crop: " + entry["id"])
        if entry["id"] == "HC-MINATO" and not 2756 <= left <= 2794:
            raise ValueError("Minato crop includes a neighbour or clips its wing")
        im = oriented.crop(tuple(crop))
        alpha = im.getchannel("A") if im.mode == "RGBA" else None
        icc = im.info.get("icc_profile")
        if icc:
            im = ImageCms.profileToProfile(
                im.convert("RGB"), ImageCms.ImageCmsProfile(BytesIO(icc)),
                ImageCms.createProfile("sRGB"), outputMode="RGB")
            if alpha is not None:
                im.putalpha(alpha)
        im = im.convert("RGBA" if alpha is not None else "RGB")
        def render(source_im, widths, stem):
            outputs = []
            for width in widths:
                if width > source_im.width:
                    raise ValueError("Upscaling is not permitted: " + entry["id"])
                height = round(source_im.height * width / source_im.width)
                resized = source_im.resize((width, height), Image.Resampling.LANCZOS)
                clean = Image.frombytes(resized.mode, resized.size, resized.tobytes())
                output = entry.get("output") or f'/assets/{stem}-{width}.webp'
                target = (ROOT / "public" / output.lstrip("/")).resolve()
                if target.parent != OUT.resolve():
                    raise ValueError("Unsafe output path")
                quality = None
                if entry["format"] == "png":
                    clean.save(target, "PNG", optimize=True)
                else:
                    for quality in [82, 76, 70, 64, 58]:
                        clean.save(target, "WEBP", quality=quality, method=6,
                                   exif=b"", xmp=b"", icc_profile=b"")
                        if target.stat().st_size <= 500_000:
                            break
                data = target.read_bytes()
                if len(data) > 500_000:
                    raise ValueError("Image exceeds 500 KB: " + output)
                with Image.open(target) as check:
                    check.load()
                    if check.size != (width, height):
                        raise ValueError("Incorrect output size")
                    if check.getexif() or any(k in check.info for k in ("exif", "xmp", "icc_profile")):
                        raise ValueError("Output retains metadata")
                outputs.append({"src": output, "width": width, "height": height,
                                "bytes": len(data), "sha256": digest(data), "quality": quality})
            return outputs
        outputs = render(im, entry["widths"], entry["stem"])
        square = entry.get("square")
        square_outputs = []
        if square:
            # Square frames for cards and the product page. The box is in oriented
            # source pixels and must sit inside the approved crop, so it never widens it.
            sl, st, sr, sb = square["box"]
            if sr - sl != sb - st or not (left <= sl < sr <= right and top <= st < sb <= bottom):
                raise ValueError("Square frame must be square and inside the approved crop: " + entry["id"])
            if entry["id"] == "HC-MINATO" and not 2756 <= sl <= 2794:
                raise ValueError("Minato square frame includes a neighbour or clips its wing")
            square_outputs = render(im.crop((sl - left, st - top, sr - left, sb - top)),
                                    square["widths"], entry["stem"] + "-sq")
        hero_outputs = {}
        for shape, frame in (entry.get("hero") or {}).items():
            # Art-directed home hero frames, also cut from inside the approved crop.
            hl, ht, hr, hb = frame["box"]
            if not (left <= hl < hr <= right and top <= ht < hb <= bottom):
                raise ValueError("Hero frame must sit inside the approved crop: " + entry["id"])
            hero_outputs[shape] = render(im.crop((hl - left, ht - top, hr - left, hb - top)),
                                         frame["widths"], entry["stem"] + "-hero-" + shape)
        record = {**entry, "orientedSize": oriented_size, "appliedCropBox": crop,
                  "outputs": outputs + [{**o, "frame": "square"} for o in square_outputs]
                  + [{**o, "frame": "hero-" + shape} for shape, outs in hero_outputs.items() for o in outs]}
        records.append(record)
        if entry["id"] != "brand-logo":
            product = next(p for p in products if p["id"] == entry["id"])
            # The storefront shows the square frame; full-crop outputs stay registered for later use.
            shown = square_outputs or outputs
            fallback = next((o for o in shown if o["width"] == 640), shown[-1])
            product.update(image=fallback["src"], imageAlt=entry["alt"],
                           imageWidth=fallback["width"], imageHeight=fallback["height"],
                           imageVariants=[{k: o[k] for k in ("src", "width", "height")} for o in shown],
                           imageSource=entry["sourceTitle"], imageApprovedAt=SPECS["ownerApprovalDate"])
            product.pop("imageStatus", None)
            if hero_outputs:
                hero = {"product": entry["id"]}
                for shape, outs in hero_outputs.items():
                    hero[shape] = [{k: o[k] for k in ("src", "width", "height")} for o in outs]

metadata = {"version": 1, "importedAt": SPECS["importedAt"],
            "encoder": {"Pillow": PIL.__version__, "libwebp": features.version("webp"),
                        "resize": "Lanczos", "colourSpace": "sRGB", "metadata": "stripped"},
            "assets": records, "pending": SPECS["pending"]}
(ROOT / "assets/derivatives.json").write_text(json.dumps(metadata, indent=2) + "\n")
(ROOT / "data/products.json").write_text(json.dumps(products, indent=2, ensure_ascii=False) + "\n")
store_path = ROOT / "data/store.json"
store = json.loads(store_path.read_text())
store["hero"] = hero
store_path.write_text(json.dumps(store, indent=2) + "\n")

bt = chr(96)
code = lambda value: bt + str(value) + bt
doc = [
    "# Website asset provenance", "",
    "Imported and verified 13 October 2026. The owner approved the real-photo choices on 11 October 2026.",
    "Drive originals were SHA-256 checked against Claude's qa/asset-recommendations.json before import.",
    "Camera, timestamp, GPS and text metadata were removed from the source containers without changing their compressed image pixels. Rendering colour profiles are retained only in the source files. Original EXIF orientation is recorded below and applied before cropping.",
    "Source inputs stay under assets/photo-sources/, outside public/ and dist/. The build copies only the catalog's referenced derivatives.",
    "Outputs use Lanczos resizing, sRGB, WebP (quality shown below) or PNG for the logo. EXIF, XMP and ICC metadata are stripped from every output. No artwork was generated, retouched or reconstructed.",
    "All dimensions and crops use pixels; crop boxes are (left, top, right, bottom), with exclusive right/bottom edges. Width and height attributes use the fallback derivative's actual dimensions.",
    "Reproduce with python -m pip install Pillow==11.3.0 and python scripts/prepare-images.py. assets/image-sources.json stores the input hashes and crop specifications; assets/derivatives.json stores machine-readable output hashes.", "",
]
for rec in records:
    doc += [f'## {rec["id"]}', "",
            f'- Source title: {code(rec["sourceTitle"])}',
            f'- Source Drive ID: {code(rec["sourceDriveId"])}',
            f'- Drive original SHA-256: {code(rec["sourceSha256"])}',
            f'- Metadata-clean source input: {code(rec["input"])}',
            f'- Input SHA-256: {code(rec["inputSha256"])}',
            f'- Source dimensions: {rec["sourceSize"][0]} × {rec["sourceSize"][1]}; EXIF orientation {rec["exifOrientation"]}.',
            f'- Applied crop box after orientation: {code(tuple(rec["appliedCropBox"]))}.']
    if rec.get("square"):
        doc += [f'- Square storefront frame (inside the applied crop): {code(tuple(rec["square"]["box"]))}. {rec["square"]["note"]}']
    for shape, frame in (rec.get("hero") or {}).items():
        doc += [f'- Home hero {shape} frame (inside the applied crop): {code(tuple(frame["box"]))}. {frame["note"]}']
    doc += [""]
    if rec["id"] == "HC-MINATO":
        doc += ["The left edge is x=2770, within the required x=2756…2794 bounds. The crop isolates the tan engraved handle, black blade, silver edge bevels and black ring. The full crop is not widened to include the adjacent blade. Its square storefront frame is cut from inside this crop.", ""]
    if rec["id"] == "HC-LEAF":
        doc += ["The crop selects only the upper Hidden Leaf headband plate, including its keyring loop and shadow; the other three village plates are outside the crop.", ""]
    if rec["id"] == "brand-logo":
        doc += ["This is the allowed raster option: the verified HC_WhiteBK-1.png artwork is cropped to the same established logo box and resized to 660 × 198 PNG. The former 7435 × 2229 web crop and the full 8334 × 8334 original are not served.", ""]
    doc += ["| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |",
            "|---|---:|---|---:|---:|---|"]
    for o in rec["outputs"]:
        doc += [f'| {code(o["src"])} | {o["width"]} | {o["width"]} × {o["height"]} | {o["bytes"]} | {o["quality"] if o["quality"] is not None else "PNG"} | {code(o["sha256"])} |']
    doc += [""]

doc += ["## Pending approved originals", "",
        "Classic Kunai and Kurama display photo placeholders. Their former AI images have been removed from the served assets. Neither pending source below has been imported.",
        "The owner first copies each original into the supplied HoneyComb folder. Verify the new copy against the expected original SHA-256 before adding it to the source manifest.", "",
        "| Product | Approved source title | Reference Drive ID outside HoneyComb | Expected original SHA-256 |",
        "|---|---|---|---|"]
for p in SPECS["pending"]:
    doc += [f'| {p["id"]} | {code(p["sourceTitle"])} | {code(p["referenceDriveId"])} | {code(p["expectedSourceSha256"])} |']
doc += ["", "## Superseded imports (not served)", "",
        "These exact source titles correct the extra .jpg suffixes recorded in the former provenance document.", "",
        "| Former asset | Exact source title | Drive ID | QA classification |",
        "|---|---|---|---|",
        "| hidden-leaf.jpg | WhatsApp Image 2026-01-22 at 19.46.02 (2).jpeg | 13NPWedcC7fSpsJZcGQqMb7ZtfOfGii9N | Real; replaced by a single-plate crop |",
        "| kurama.jpg | Pro-1_202604130244.jpeg | 147Cc7NRSivyNKzIixRkvvlI3OACsGVtR | Google AI; removed |",
        "| night-fury.jpg | 20260301_144017.jpg | 1E35H6xX9rDcamwGPXUATv2MMyGIQNDN4 | Real batch; replaced by single-unit photo |",
        "| minato-kunai.jpg | Product Photo (1).jpeg | 12wvXum-YXjOK2RJmaCGEmRTJI1RIqRLm | Google AI; removed |",
        "| light-fury.jpg | Product Photo  (5).jpeg | 1WtFmt7EJjed3Fmwpk7LUl_wiWT95DQzZ | Google AI; removed |",
        "| classic-kunai.jpg | Copy_of_RAV_4322.jpg_202604130724.jpeg | 1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk | Google AI; removed |", "",
        "## Catalog identity and approval", "",
        "Storefront IDs remain unchanged. Airtable Products is the owner-designated price source, read 11 October 2026; each product records its price field, base, table, record and read date.",
        "Airtable and Drive disagree on Baymax/Kurama SKUs 503/504 (QA F-17), so no SKU migration was made.",
        "There are no compare-at prices or stock counts. Availability stays unconfirmed and catalog approval stays false. Photo approval does not approve the listing, description, availability or public launch.", ""]
favicon_doc = ROOT / "docs/FAVICON-PROVENANCE.md"
if favicon_doc.exists():
    doc += ["", favicon_doc.read_text()]
(ROOT / "docs/ASSET-PROVENANCE.md").write_text("\n".join(doc))
print("Generated", sum(len(r["outputs"]) for r in records), "derivatives; largest",
      max(o["bytes"] for r in records for o in r["outputs"]), "bytes.")
