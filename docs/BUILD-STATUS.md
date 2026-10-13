# HoneyComb storefront build status

Updated 13 October 2026. Branch: codex/storefront-mvp.

## QA Run 5 follow-ups (I-21 / I-22)

- /favicon.ico now serves a 5,500-byte ICO containing 16, 32 and 48 px frames exported from the supplied HONEYCOMB Symbol.pdf (Drive 1AOoBNTsdAzj_getImty-054LJWxjzfFq). Every page declares it, and the local server sends image/vnd.microsoft.icon.
- Portrait srcset sizes describe the contained image width within the square card, hero and detail boxes. Minato also has 160 px (3,536 bytes) and 240 px (6,474 bytes) derivatives from the unchanged approved source and crop.
- Favicon source/output hashes and crop details are recorded in assets/favicon.json, docs/FAVICON-PROVENANCE.md and docs/ASSET-PROVENANCE.md. The PDF source stays outside dist/.
- Independent CI scripts are pinned to QA Run 5, 97780b00907571e64703daa3adfd5f03d5d5263d, including real srcset-pixel measurement and failure on AI markers.
- Browser regression checks cover favicon HTTP status/type/frames and actual Minato resource resolution in card/detail views at 320/390/768/1280 px, DPR 1 and 3.
- Classic Kunai and Kurama are still placeholders: the latest Drive search found only the original Kunai outside HoneyComb and no matching Kurama copy.
- Temporary asset-generation workflow removed. CI permissions are read-only.

## QA handoff implementation

Continued the existing application from 8d13b91 using the QA handoff on claude/recovery-qa at aedc1e4. That review branch and main were not changed.

- Prices are the owner's designated Airtable Products prices, read 11 October 2026: Hidden Leaf 400, Baymax 1000, Kurama 1500, Night Fury 500, Minato 1000, Light Fury 500 and Classic Kunai 1000 LKR. Each product records the Airtable base, table, record, field and read date in priceSource.
- No compare-at prices, sale badges or stock counts. Availability remains unconfirmed and every catalog approval remains false.
- Storefront IDs and slugs are unchanged. Baymax/Kurama SKUs are not migrated while QA F-17 remains unresolved.
- Light Fury, Night Fury, Minato and Hidden Leaf use the approved real photos. Baymax keeps the same real source and is resized only.
- Source originals matched the exact QA SHA-256 values. Camera/GPS/text metadata were removed from their containers without altering compressed image pixels; both hashes are recorded.
- Hidden Leaf's crop isolates the upper white plate. Minato's crop is (2770, 2150, 4600, 6250), within the required left-edge bounds, and its alt text describes the tan engraved handle and black blade.
- Sixteen outputs: five product photos at widths 480/960/1440, plus a 660 × 198 PNG logo. Images use real intrinsic width/height attributes; cards, hero and detail pages have responsive srcset/sizes.
- The build copies only explicitly referenced derivatives into dist/. Full-size sources and unused images cannot ship.
- Source Drive IDs, original and normalized SHA-256 hashes, orientation, crop boxes, resize widths, output dimensions, bytes and output hashes are in docs/ASSET-PROVENANCE.md and assets/derivatives.json.
- Incorrect extra .jpg suffixes in historical source titles are corrected.
- Former AI product images were removed. Classic Kunai and Kurama use placeholders pending their approved original copies into HoneyComb.

## Verification

Verified implementation: 692945e. The identical generated photo/data/provenance snapshot is committed at 838d0e1.

- [PR verification run](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/actions/runs/38340605075): passed.
- [Push verification and snapshot run](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/actions/runs/38340699446): passed.
- 15/15 unit tests; npm ci, build and checks passed for 13 generated pages.
- Browser smoke passed at 320/390/768/1440 px, including prices in cart totals, cart persistence/updates/removal, custom enquiry, a mixed-price WhatsApp fixture, 404, network failure and zero page errors. No message was sent.
- Source/output hashes, EXIF/XMP/ICC removal, actual dimensions, srcset candidates, the 660 × 198 logo, exclusive derivative distribution and both image budgets passed.
- Independent QA image-provenance.py and image-audit.mjs from aedc1e4 passed. The browser image audit returned 18 PASS, 58 INFO (contain letterboxing), and zero failures across nine pages on mobile and desktop.
- Largest output: 251,428 bytes (1440 px Minato). Real mobile DPR 3 transfers peaked at 424,249 bytes; the independent audit's more conservative per-image sum peaked at about 0.47 MB. Both are below 1.5 MB.
- Leaf and Minato's committed crop outputs and the resized logo were visually inspected. No neighbouring product appears in either crop.

| Mobile route (390 px, DPR 3) | Image transfer bytes |
|---|---:|
| / | 385,121 |
| /shop/ | 331,603 |
| /cart/ | 42,747 |
| /custom/ | 42,747 |
| /privacy/ | 42,747 |
| /products/hidden-leaf-keychain/ | 250,939 |
| /products/baymax-figure/ | 293,499 |
| /products/kurama-figure/ | 210,253 |
| /products/night-fury-keychain/ | 238,109 |
| /products/minato-kunai/ | 424,249 |
| /products/light-fury-keychain/ | 223,083 |
| /products/classic-kunai/ | 172,821 |

CI used pinned Pillow to create the derivatives and run the normal Node build. The final checkout contains the verified outputs, so ordinary npm ci / npm test / npm run build / npm run check needs no Python or image-processing dependency.

Local execution became unavailable during this session; execution evidence comes from GitHub Actions.

## Remaining owner actions

- Copy Classic Kunai RAV_4322.jpg and the business-account Kurama 1.png into HoneyComb. Expected hashes and reference IDs are in the provenance document.
- Reconcile Baymax/Kurama SKUs across Airtable and Drive before any ID migration.
- Confirm availability and full listing/description approval, business WhatsApp and delivery/payment/return terms before launch.
- Confirm previously flagged photo/Canva/logo rights.

The store remains in preview mode, noindex, with external ordering disabled.
