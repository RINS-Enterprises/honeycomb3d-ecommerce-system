# Website asset provenance

Imported and verified 13 October 2026. The owner approved the real-photo choices on 11 October 2026.
Drive originals were SHA-256 checked against Claude's qa/asset-recommendations.json before import.
Camera, timestamp, GPS and text metadata were removed from the source containers without changing their compressed image pixels. Rendering colour profiles are retained only in the source files. Original EXIF orientation is recorded below and applied before cropping.
Source inputs stay under assets/photo-sources/, outside public/ and dist/. The build copies only the catalog's referenced derivatives.
Outputs use Lanczos resizing, sRGB, WebP (quality shown below) or PNG for the logo. EXIF, XMP and ICC metadata are stripped from every output. No artwork was generated, retouched or reconstructed.
All dimensions and crops use pixels; crop boxes are (left, top, right, bottom), with exclusive right/bottom edges. Width and height attributes use the fallback derivative's actual dimensions.
Reproduce with python -m pip install Pillow==11.3.0 and python scripts/prepare-images.py. assets/image-sources.json stores the input hashes and crop specifications; assets/derivatives.json stores machine-readable output hashes.

## HC-LEAF

- Source title: `Copy of RAV_4459.jpg`
- Source Drive ID: `1rW98jCTB1kwWoP0gMThUrnWitqN8-q_v`
- Drive original SHA-256: `d1f9cb985d101fde84d3decfb82c3b9ae8f90f67a2c82db03606b214ccef9b04`
- Metadata-clean source input: `assets/photo-sources/hidden-leaf.jpg`
- Input SHA-256: `6550f9d1c2a03ffedba857715ddfb9cbb55d3c2c5f566d789dde966b94b9145e`
- Source dimensions: 4299 × 6442; EXIF orientation 1.
- Applied crop box after orientation: `(1250, 1660, 3000, 2430)`.

The crop selects only the upper Hidden Leaf headband plate, including its keyring loop and shadow; the other three village plates are outside the crop.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/hidden-leaf-480.webp` | 480 | 480 × 211 | 9786 | 82 | `a11f9205ab677bf93b12e72f75b823b9ce0d2f9254d04badbeb2cefbad6f5bda` |
| `/assets/hidden-leaf-960.webp` | 960 | 960 × 422 | 38452 | 82 | `784dbe7234ac62af94f162c336a0031c7ec5eac014b8da942a3de8fcf6fc3614` |
| `/assets/hidden-leaf-1440.webp` | 1440 | 1440 × 634 | 79138 | 82 | `437caad3c0dfffb60dd8daf0d6e47384893ed3dd566993e1e513aef72a559723` |

## HC-BAYMAX

- Source title: `HNYCMB504 (1).png`
- Source Drive ID: `1XGpES0PDcZuXp46hSPsD_gtHMsP_qVbY`
- Drive original SHA-256: `d9c9b702a5af80a9019a2224dbd5e102e4f0afd4fef9cab4948e471ea0efcdb5`
- Metadata-clean source input: `assets/photo-sources/baymax.png`
- Input SHA-256: `2caef48ac4bbcbcc586df925b59e77a4f1c706ca07b51d0d9061aa8babe4bc7e`
- Source dimensions: 1536 × 2048; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1536, 2048)`.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/baymax-480.webp` | 480 | 480 × 640 | 28300 | 82 | `250873e25a2a5060e8b62bf90093cd3ad84356ea5f2f96800995e0e9c2354d93` |
| `/assets/baymax-960.webp` | 960 | 960 × 1280 | 91622 | 82 | `72e907f1342fbb8e4e489114a48109874a0b19c36071d5643a3250c21565106f` |
| `/assets/baymax-1440.webp` | 1440 | 1440 × 1920 | 174868 | 82 | `0c76fede0f9678fda981bf49026d6c25f688df3954f19cbe5676a83fdc520dcf` |

## HNYCMB501

- Source title: `20260301_152139.jpg`
- Source Drive ID: `1w5Ulskt4b-WEdJkQLXcR52s3YucH5Rfg`
- Drive original SHA-256: `408785f66536cca48db02286bdc9fdc50a3e246e4d69a6cd7f1343329f87807b`
- Metadata-clean source input: `assets/photo-sources/night-fury.jpg`
- Input SHA-256: `775dddb36cf5d98a07ce92ba4a1ddad26c0e27bd7868c55bfe5822b447b04959`
- Source dimensions: 1893 × 1420; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1893, 1420)`.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/night-fury-480.webp` | 480 | 480 × 360 | 14324 | 82 | `7e480852833cecbdf57660165d7a6a3ad44296980114f566f72db051f6c0a9d8` |
| `/assets/night-fury-960.webp` | 960 | 960 × 720 | 37432 | 82 | `2071959e347554061056f0c997e4834b37519adb10c4b609ccfce9bf7867bb70` |
| `/assets/night-fury-1440.webp` | 1440 | 1440 × 1080 | 65288 | 82 | `e1f5abdffb91b9542ea26845ca57a53a66980d2cf97773b9c271005110b16dbe` |

## HC-MINATO

- Source title: `Copy of RAV_4468.jpg`
- Source Drive ID: `1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F`
- Drive original SHA-256: `6bed862cf24b3c9522222aa839198a94326ff1ca06c98f3dd0a43f9f24b02028`
- Metadata-clean source input: `assets/photo-sources/minato-kunai.jpg`
- Input SHA-256: `4c9673b96abc990ab4505ef0f46e6f4050029e0ed0ee44ba21b681c47af77479`
- Source dimensions: 4912 × 7360; EXIF orientation 1.
- Applied crop box after orientation: `(2770, 2150, 4600, 6250)`.

The left edge is x=2770, within the required x=2756…2794 bounds. The crop isolates the tan engraved handle, black blade, silver edge bevels and black ring. It is letterboxed with object-fit: contain; it is not widened to include the adjacent blade.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/minato-kunai-480.webp` | 480 | 480 × 1075 | 20718 | 82 | `9880a18df2a171585733ea002c0dec08d1b319dd1a11d1d832020b3333617f79` |
| `/assets/minato-kunai-960.webp` | 960 | 960 × 2151 | 93218 | 82 | `3490f32cac68d84b5c6097e9f5a2af038298c2fcec41e090c367bb263ad259e4` |
| `/assets/minato-kunai-1440.webp` | 1440 | 1440 × 3226 | 251428 | 82 | `34d72359b337d2f5f14ef44c1c1e9754a98dc05d39530adfc70748aca137c1f2` |

## HC-LIGHTFURY

- Source title: `Variation 1 (2).jpg`
- Source Drive ID: `1pMK8OOE9bvE4WsKDRONnPk38k5HQbVaU`
- Drive original SHA-256: `508c5590ee15f6f55c3db605080b0c8a8000e6c9758f0b61aad333786ee1c9e9`
- Metadata-clean source input: `assets/photo-sources/light-fury.jpg`
- Input SHA-256: `371ebf51441bcf82c1feb7afa256b420e0d95d15a2834ad1811fd3f538fe069d`
- Source dimensions: 1500 × 2000; EXIF orientation 1.
- Applied crop box after orientation: `(0, 0, 1500, 2000)`.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/light-fury-480.webp` | 480 | 480 × 640 | 10204 | 82 | `b3f42484e301ce003661b4fbb88a6693514483b2aac08158eeb5aef79b119a60` |
| `/assets/light-fury-960.webp` | 960 | 960 × 1280 | 28132 | 82 | `e108d5ac558aca70ca553bdcf48d9ee310da6d878b7d3ac076520acc2568b7a6` |
| `/assets/light-fury-1440.webp` | 1440 | 1440 × 1920 | 50262 | 82 | `76caea753630918bead191910048b3c652b94d5ce562af537bf114ddaebb0cee` |

## brand-logo

- Source title: `HC_WhiteBK-1.png`
- Source Drive ID: `1sHmDdDKtS_qnh76ctrgYkJj_Uokaj23e`
- Drive original SHA-256: `1a31b02c4343ed657a62d3dd49a86d5fe6b950b0d68b747877828ab4288ad08e`
- Metadata-clean source input: `assets/photo-sources/honeycomb-logo.png`
- Input SHA-256: `1a31b02c4343ed657a62d3dd49a86d5fe6b950b0d68b747877828ab4288ad08e`
- Source dimensions: 8334 × 8334; EXIF orientation 1.
- Applied crop box after orientation: `(583, 3156, 8018, 5385)`.

This is the allowed raster option: the verified HC_WhiteBK-1.png artwork is cropped to the same established logo box and resized to 660 × 198 PNG. The former 7435 × 2229 web crop and the full 8334 × 8334 original are not served.

| Output | Resize width | Actual dimensions | Bytes | WebP quality | Output SHA-256 |
|---|---:|---|---:|---:|---|
| `/assets/honeycomb-logo-web.png` | 660 | 660 × 198 | 42747 | PNG | `e959b5e60bec3285396e419f8623a43208260257b25b2ebd7f0055c7f45d3421` |

## Pending approved originals

Classic Kunai and Kurama display photo placeholders. Their former AI images have been removed from the served assets. Neither pending source below has been imported.
The owner first copies each original into the supplied HoneyComb folder. Verify the new copy against the expected original SHA-256 before adding it to the source manifest.

| Product | Approved source title | Reference Drive ID outside HoneyComb | Expected original SHA-256 |
|---|---|---|---|
| HC-KUNAI | `RAV_4322.jpg` | `1mx3YRM6o4CrGZtIl6TX2ZqnG8cacFDQo` | `f41368debf7c8dad784374727a8c374e64bd33fc89461a0d907f16d5ce3c8722` |
| HC-KURAMA | `1.png` | `1nQvOC8nPm9BNK496GZveJEim2dspvYwN` | `d33853df877263dab5a27300b0f92bd545a12b2111f9828bb411e7d3e9f5a494` |

## Superseded imports (not served)

These exact source titles correct the extra .jpg suffixes recorded in the former provenance document.

| Former asset | Exact source title | Drive ID | QA classification |
|---|---|---|---|
| hidden-leaf.jpg | WhatsApp Image 2026-01-22 at 19.46.02 (2).jpeg | 13NPWedcC7fSpsJZcGQqMb7ZtfOfGii9N | Real; replaced by a single-plate crop |
| kurama.jpg | Pro-1_202604130244.jpeg | 147Cc7NRSivyNKzIixRkvvlI3OACsGVtR | Google AI; removed |
| night-fury.jpg | 20260301_144017.jpg | 1E35H6xX9rDcamwGPXUATv2MMyGIQNDN4 | Real batch; replaced by single-unit photo |
| minato-kunai.jpg | Product Photo (1).jpeg | 12wvXum-YXjOK2RJmaCGEmRTJI1RIqRLm | Google AI; removed |
| light-fury.jpg | Product Photo  (5).jpeg | 1WtFmt7EJjed3Fmwpk7LUl_wiWT95DQzZ | Google AI; removed |
| classic-kunai.jpg | Copy_of_RAV_4322.jpg_202604130724.jpeg | 1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk | Google AI; removed |

## Catalog identity and approval

Storefront IDs remain unchanged. Airtable Products is the owner-designated price source, read 11 October 2026; each product records its price field, base, table, record and read date.
Airtable and Drive disagree on Baymax/Kurama SKUs 503/504 (QA F-17), so no SKU migration was made.
There are no compare-at prices or stock counts. Availability stays unconfirmed and catalog approval stays false. Photo approval does not approve the listing, description, availability or public launch.
