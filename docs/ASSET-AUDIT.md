# HoneyComb 3D asset audit

Owner: independent recovery QA (Claude), branch `claude/recovery-qa`. Date: **2026-10-09**.
Implementation reviewed: `codex/storefront-mvp` @ `8d13b910bc4ff156a2ffd049cd4cc381f19828ad`
(GPT's `public/assets/` and `docs/ASSET-PROVENANCE.md`).
Source: owner's Drive folder **HoneyComb** (`1BAhuPuAvAvgschy6bv-qW1YcBd74zaId`).

> **Summary.**
> - GPT imported 8 files, and **all 8 are byte-identical to the Drive files they cite**. The logo web derivative is a verified pixel-identical crop.
> - However, **4 of the 7 product images are signed Google-AI-generated images** (C2PA "Created by Google Generative AI", SynthID watermark): Kurama, Classic Kunai, Minato Kunai and Light Fury. They are not the "product photographs" the provenance record and commit message call them, and the brief forbids substitute generated images.
> - Real photographs exist for Classic Kunai, Minato Kunai and Hidden Leaf, including a professional Nikon D810 shoot. **No real Kurama photo was found.**
> - Images do **not** establish price, availability, current product variant or permission to sell. Those stay owner decisions (§6).

Method labels used below:
- **Verified:** bytes downloaded and checked here.
- **Visual:** I looked at the image.
- **Metadata:** EXIF, XMP or C2PA read from the file.
- **Listing:** Drive name, size and date only; not downloaded.

---

## 1. Access and method (what was actually done)

| Step | Result |
|---|---|
| Drive access via the owner's Drive connector | **Works**: read metadata, listings and file content. **Read-only**: nothing was moved, renamed, shared or uploaded. |
| Listing | Folder-by-folder `parentId` queries (the connector returns ≤10 items per page). All folders named in the request were listed, plus every SKU folder for the 7 catalogue products. **Not exhaustively listed:** `Productions/New` and `Old list/SKU` (both returned empty), deeper pages of `HoneyComb 3D - Listing Kit` and `HoneyComb Product Studio` (top level only), `Photo Gallery/List` and `Portrait`, `Pikachu KeyChain`, and the large ZIPs. |
| Downloads | 35 files (≈100 MB) were downloaded into the QA scratch directory only. **None were committed or copied into the repo.** For each: SHA-256, dimensions, EXIF/XMP/C2PA scan (`c2pa.claim`, `Created by Google Generative AI`, `SynthID`, `CreatorTool`), and a visual contact sheet. |
| Comparison with GPT's assets | SHA-256 of each `public/assets/*` file at `8d13b91` compared with the Drive file ID listed in `docs/ASSET-PROVENANCE.md`. The logo crop was compared by decoded pixels. |
| Browser checks | `qa/e2e/image-audit.mjs` on the built site at `8d13b91` (Chromium; 9 pages × mobile DPR 3 and desktop DPR 1). Results are in `qa/results/8d13b91…/images/`. |

## 2. GPT's imported assets vs. originals (`8d13b91`)

| Repo file | Catalogue ID | Drive source (ID / exact title) | Byte-identical | Dimensions | Provenance (metadata + visual) | Verdict |
|---|---|---|---|---|---|---|
| `honeycomb-logo.png` | brand | `1sHmDdDKtS_qnh76ctrgYkJj_Uokaj23e` / `HC_WhiteBK-1.png` | **Yes** (`1a31b02c…`) | 8334×8334 | Designer export (Brand Kit, 2025-08-29). No AI markers. | Authentic. Too large to serve (see I-17). |
| `honeycomb-logo-web.png` | brand | derived from the above | n/a | 7435×2229 | **Verified:** crop `(583,3156,8018,5385)` is pixel-identical to the source region. The non-white content bbox is `(631,3204,7970,5337)`, so the padding is exactly 48 px. | Faithful derivative, but still 16.6 MP (I-17). |
| `hidden-leaf.jpg` | HC-LEAF | `13NPWedcC7fSpsJZcGQqMb7ZtfOfGii9N` / `WhatsApp Image 2026-01-22 at 19.46.02 (2).jpeg` | **Yes** (`5cfaa3d9…`) | 960×1280 | WhatsApp-recompressed phone photo (EXIF stripped). Same grass mat and white corner as the Baymax photos. | **Real photo**, low resolution; the product fills a small part of the frame. |
| `baymax.png` | HC-BAYMAX | `1XGpES0PDcZuXp46hSPsD_gtHMsP_qVbY` / `HNYCMB504 (1).png` | **Yes** (`d9c9b702…`) | 1536×2048 | XMP `CreatorTool: Canva (Renderer) … brand=Anthony Dyer's team`. Visual: real print with visible layer lines, same set as Hidden Leaf. | **Real photo, exported via Canva.** Confirm the Canva team/account is the owner's. 3.2 MB PNG (I-16). |
| `kurama.jpg` | HC-KURAMA | `147Cc7NRSivyNKzIixRkvvlI3OACsGVtR` / `Pro-1_202604130244.jpeg` | **Yes** (`1069dc83…`) | 1024×1024 | **C2PA: 4 chained manifests, each "Created by Google Generative AI", IPTC `trainedAlgorithmicMedia`, "Applied imperceptible SynthID watermark".** | **AI-generated.** No real Kurama photo found anywhere inspected. |
| `night-fury.jpg` | HNYCMB501 | `1E35H6xX9rDcamwGPXUATv2MMyGIQNDN4` / `20260301_144017.jpg` | **Yes** (`58f957a6…`) | 4000×3000, EXIF Orientation 6 (renders 3000×4000) | Phone-camera filename pattern. Make/Model stripped. No AI markers. Visual: real batch of ~10 units on a blue mat. | **Real photo.** Shows many units for a single-unit listing. 2.4 MB (I-16). |
| `minato-kunai.jpg` | HC-MINATO | `12wvXum-YXjOK2RJmaCGEmRTJI1RIqRLm` / `Product Photo (1).jpeg` | **Yes** (`c33cd7f2…`) | 1024×1024 | **C2PA "Created by Google Generative AI" + SynthID, with 1 input ingredient.** Visual: an AI re-render of the real phone photo `12KT8iT8zQ8iOOfAhFek8cqeYQJKzjF8n`. Background replaced, hand regenerated, handle engraving added. | **AI-edited derivative**; it does not preserve the real print surface. |
| `light-fury.jpg` | HC-LIGHTFURY | `1WtFmt7EJjed3Fmwpk7LUl_wiWT95DQzZ` / `Product Photo  (5).jpeg` (two spaces) | **Yes** (`a2e97be4…`) | 1024×1024 | **C2PA "Created by Google Generative AI" + SynthID.** Visual: smooth studio render, with no print layer lines visible. | **AI-generated/edited.** |
| `classic-kunai.jpg` | HC-KUNAI | `1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk` / `Copy_of_RAV_4322.jpg_202604130724.jpeg` | **Yes** (`26d7c997…`) | 1024×1024 | **C2PA "Created by Google Generative AI" + SynthID.** Visual: re-render of the professional photo `RAV_4322.jpg`, background changed from light grey to black, proportions subtly altered. | **AI-edited derivative**; a real original exists (§3). |

Other provenance-record issues in GPT's `docs/ASSET-PROVENANCE.md`:
- Six source titles carry an extra `.jpg` suffix that the Drive titles don't have. For example, the record says `Pro-1_202604130244.jpeg.jpg`, but the Drive title is `Pro-1_202604130244.jpeg`. The IDs are correct.
- "Files were inspected and copied without regenerating the product" is true of GPT's own handling, but it omits that the sources are themselves AI generations.
- The SKU-folder mappings (HC-LEAF→HNYCMB511, BAYMAX→504, KURAMA→503, MINATO→508, LIGHTFURY→502, KUNAI→509) **match the Drive folder names** (Verified).

## 3. Real-photo candidates per product (recommendations; nothing imported)

All "Verified" rows were downloaded, hashed and inspected. File IDs are exact.

| Product | Best real candidate(s) | Location | Notes |
|---|---|---|---|
| **HC-KUNAI** Classic Kunai | `RAV_4322.jpg`, `1mx3YRM6o4CrGZtIl6TX2ZqnG8cacFDQo`, 4912×7360, 4,887,510 B, sha256 `f41368de…` (Verified, Visual) | **Outside the supplied folder**: owner Drive `…/Download` (`1X1vuCjd-d7qEwmaXammBkbJEcTjp6DnI`). The business account `honeycomb.3d.sl@gmail.com` holds same-size copies: `Copy of RAV_4322.jpg` `1pXQXPxzZSGacNSmSVGp7z3-9Lp4SfiUF`, `Copy of RAV_4326.jpg` `14ezBceiU3WQ5aND_EydTa46fETLBXq79`, `Copy of RAV_4332.jpg` `1Na5mpWeyftPAxu3VmHcZ7_JdtV_SY06l` (Listing) | Clean, professional, light-grey backdrop. Also in group shot `Copy of RAV_4468.jpg` `1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F` (Verified). **Best replacement.** |
| **HC-MINATO** Minato Kunai | (a) white-handle: `WhatsApp Image 2025-12-22 at 14.39.39.jpeg` `12KT8iT8zQ8iOOfAhFek8cqeYQJKzjF8n`, 899×1599 (Verified). (b) tan cord-wrapped handle: `Copy of RAV_4468.jpg` `1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F`, a group shot with the Classic Kunai and Azuma Blade (Verified) | `HNYCMB508 Minato Kunai` (`19Zde1TJYKaTElJ6qk62ZtuyyFKkvbNr1`); `Naruto` (`1OkxJXSmdwn7ec6uW_sqk_O-mnSl79y0o`) | **Two variants exist.** The owner must say which is sold now. The AI image shows the white variant. |
| **HC-LEAF** Hidden Leaf Keychain | `Copy of RAV_4459.jpg` `1rW98jCTB1kwWoP0gMThUrnWitqN8-q_v`, Nikon D810, Lightroom Classic 14.5.1, shot 2025-10-09 (Verified Metadata). It shows 4 village headband plates, so it needs a crop. Also `Copy of RAV_4463.jpg` `1NIqS9NGhOtB9AFwximWhxC5ZSUj9dWEG` (6 plates) | `Naruto` | Far higher quality than the current 960 px WhatsApp image. **Identity caveat:** `Copy of RAV_4361.jpg` `1GCyzwWxds8eT26kaak3xMXHsGsxZKZtr` is a *leaf-symbol* keychain, a different design. The April storefront showed a *grey* headband plate; the photos show *white* plates. |
| **HC-KURAMA** Kurama Figure | **None found.** The `HNYCMB503 Kurama` folder (`1a9HcP0gS5kuGiPzY0o6Dt1A2jePDzZFw`) contains only `download/` with 5 AI files (`Pro-1…Pro-5_202604130244.jpeg`) and an empty `Untitled design/`. A business-account folder `HNYCMB503 Kurama` (`1AV2PhFDGihCTDXph5SRToMQgZ4AwObJj`) exists but was not listed. | — | **Missing real image.** Use the neutral placeholder or an owner-supplied photo; the AI image should not be presented as the product. |
| **HC-LIGHTFURY** Light Fury | `Variation 1 (1).jpg` `1RIgISQZuseq_Vr69vMqig1ztODPDmWwb`, 1500×2000: painted print held in a hand, no metadata, so **provenance uncertain** (the "Variation" naming could be an edit). `20260308_160213.jpg` `1kqwnUbpCyoJ5waS7zcBTfT9Jq-poskak`, 4000×3000 phone photo, real but **unpainted** (Verified) | `HNYCMB502 Light Fury` (`1bVcPHq8OTZC5aKz7fuJAyURLBbidRzvd`) | Owner to confirm `Variation 1 (n)` are unedited photos. `Product Photo  (2–4).png` (4.5–5.2 MB) and `Product Photo Angels (1–3).jpeg` are Gemini-era names; `Angels (1)` is C2PA AI (Verified). |
| **HNYCMB501** Night Fury | Current file is real. Single-unit alternatives not inspected: `20260301_152139.jpg` `1w5Ulskt4b-WEdJkQLXcR52s3YucH5Rfg`, `WhatsApp Image 2026-04-13 at 05.55.33.jpeg` `1JLAPvlSlaYNEA-jlr6yVN35MmoRoxlNn` (Listing) | `HNYCMB501 Night Fury` (`1qSnm2uGbMlekXqsqPQjwFDosX0HHfWE_`) | `20260301_144334.jpg` (Verified) is a 1500×2000 resized copy of the same batch shoot. |
| **HC-BAYMAX** | Current file is acceptable (real). Alternates `HNYCMB504 (2…8).png` are the same Canva export series (`(2)` Verified). | `Baymax HNYCMB504/Images` (`1Zr_gD236oF1mSXoBhZ7CVYkOw4yBLoR7`) | Confirm the Canva team ownership. |

**Recommendation for GPT (do not act without owner sign-off):**
1. Replace `classic-kunai.jpg` with a resized copy of `RAV_4322.jpg`, once the owner copies it into the HoneyComb folder.
2. Replace `minato-kunai.jpg` with the real photo of the variant actually sold.
3. Replace `hidden-leaf.jpg` with a documented crop of `RAV_4459`/`4463`, if the owner confirms the white headband is the product.
4. Show the placeholder for Kurama, and for Light Fury until provenance is confirmed.
5. Record each derivative (crop and resize parameters, source SHA-256) in `ASSET-PROVENANCE.md`.

## 4. Classification of other inspected Drive assets

| Class | Files (ID) | Evidence |
|---|---|---|
| **Professional camera originals** (Nikon D810 resolution 4912×7360, January 2026 Drive copies) | `Copy of RAV_4348/4361/4370/4378/4399/4401/4407/4411/4424/4427/4430/4433/4440/4459/4463/4468.jpg` (IDs in §7) | One file carries EXIF Nikon D810 + Lightroom; all are D810 native size; no AI markers. Subjects: Uchiha crest, Akatsuki cloud, mini kunai, Jashin symbol, Sharingan and Uzumaki-spiral pendants, headband plates, leaf symbol, kunai trio. **Most of these products are not in the catalogue.** |
| **Phone originals** (Samsung-style `YYYYMMDD_HHMMSS`) | `20260301_*.jpg` (Night Fury), `20260308_160213.jpg` (Light Fury) | Phone filename pattern; Make/Model stripped. |
| **WhatsApp-recompressed** | `WhatsApp Image …` files in the SKU folders, `Brand Kit`, `Clean White BG`, `Photo Gallery` | 30–200 KB, ≤1600 px, EXIF stripped: usable only as a last resort. |
| **Uncertain origin** | `Imagen de WhatsApp 2025-10-29 a las 21.34.01_cf2bbadf.jpg` `1sBz3bH6mqjuY5YayCn3AbVGYKWKqh_OE` (Verified, Visual) | **Spanish-locale WhatsApp filename**, showing a gold/engraved-handle Minato kunai on a desk. Possibly a third party's (designer's or supplier's) photo. **Do not publish without confirmation.** |
| **AI-generated / AI-edited (Google Gemini/Imagen)** | `Pro-1…5_202604130244.jpeg` (Kurama); `Copy_of_RAV_4322/4326/4332.jpg_202604130724.jpeg` (Kunai); `Product Photo (1–3).jpeg` (Minato); `Product Photo  (5).jpeg`, `Product Photo Angels (1–3).jpeg` (Light Fury); Hidden Leaf `download/` files such as `Use_this_image_202604160149*.jpeg`, `Place_the_keychain_202604160149.jpeg`, `Ensure_the_keychain_202604160149.jpeg`; Night Fury `download/` files such as `Use_this_image_202604152118*.jpeg`, `20260301_142700.jpg_202604130505_-_Edited.jpg_202604152120.jpeg`; Light Fury `download/` files such as `Dragon_keychain_with_202604130452.jpeg` | C2PA verified on 5 downloaded files. The rest are **inferred** from the identical `_YYYYMMDDhhmm` suffix and prompt-text filenames, but not opened. |
| **AI brand imagery** | `Gemini_Generated_Image_nb816onb816onb81.png` `1Q6j0A5ltTyWQ3QaTM4ot_yZn3E1mAsiS` (Brand Kit) | Filename says Gemini; no embedded C2PA (stripped). Visual: a workshop scene containing **Groot figurines (Marvel IP)**. **Not suitable** for product or brand use. |
| **Brand sources** | `HONEYCOMB Logo in White Background.pdf` `1D_VZuA8Lshe78K_Gz1qBmpYKS9tuLG8s` (vector: Inkscape/cairo PDF, 22 KB, Verified); `.ai` `14DrrUBO_Bs77ODomY6sAaAGUOeIZ1XXs`; `HONEYCOMB Logo in Black Background.pdf` `1pIsPgG9hIyL3ox8ocN9arP65yd6asYF7`; `HONEYCOMB Symbol.pdf` `1AOoBNTsdAzj_getImty-054LJWxjzfFq`; PNG exports `HC_WhiteBK-1.png`, `HC_BlackBK-1.png` `1qM3cl5S3yQreDKVC6tQL3SQXlDfUFMjy`, `HC_Symbol-1.png` `1fQ26KF0njNk9Hykgy12hIGxgKl_B2seX` (8334² Verified) | **Vector sources exist.** An SVG or a small PNG from the PDF would replace the 16.6 MP web logo. |
| **Rights document** | `Agreement - Honeycomb - Logo and Brand Book - 15Aug2025.pdf` `13SvXdyuRnM7qOQWu1bNIU4FQgQfcgaeq` (read) | Calysma (Viran Amarasena) ↔ Honeycomb. "Full rights … transfer to the Client **upon full payment**". The signature lines in the Drive copy are **blank**. |

**Probable duplicates (Listing: same byte size; not hashed):**
- `20260301_151906_1-ezgif.com-cut.gif` `1LYQ7XIaxFFMijvFU-cZZuNgIn8V9eMe3` = `…cut (1).gif` `1cA-g-dQSeEK26nG3krzkm5OKqI3mkIqc` (1,343,037 B)
- `Clear BG products(1).jpeg` `13OeHUP99bHC5NvyOKTiT09Eaz5IE9Onn` = `(2).jpeg` `1bpOSp0-D88Y37dMuOoNyzBNPEIv5E09D` (42,218 B)
- The AI kunai files exist in both accounts with equal sizes (e.g. `1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk` and `1DWHIbqMrsbbWewbfgr0IYzWWq7XoR3JM`, 306,622 B).

**Verified identical:** `RAV_4322.jpg` (owner Drive, 4,887,510 B) has the same size and date lineage as the business-account `Copy of RAV_4322.jpg`. Only the former was hashed.

## 5. Technical image checks on the built site (`8d13b91`, Chromium, tested)

From `qa/e2e/image-audit.mjs`. Details are in `qa/results/8d13b91…/images/summary.md`.

| Check | Result |
|---|---|
| Decoding | **PASS.** All 8 assets decode (`img.decode()` resolves, naturalWidth > 0) on 9 pages × 2 viewports. GPT's logo fix works. |
| Orientation | **PASS.** `night-fury.jpg` (EXIF Orientation 6) renders 3000×4000 portrait, correctly rotated (screenshot reviewed). |
| Mobile crops | **PASS (no cropping).** `object-fit: contain` in square boxes letterboxes the 3:4 photos (Hidden Leaf, Baymax, Night Fury), so no product is cut off. Visual review of the shop and PDP at 390 px. |
| Alt text | **PASS.** Every image has non-empty alt text. All 7 product alts were checked against the pictures and are accurate. The logo alt is "HoneyComb". |
| Page weight | **FAIL.** 4.65–7.87 MB of images per page, identical on mobile and desktop (no `srcset`/`sizes`). `/shop/` is 7.87 MB. Largest files: `baymax.png` 3.23 MB, `night-fury.jpg` 2.41 MB. |
| Oversampling | **FAIL.** Cards render at about 282 CSS px (desktop) while serving 960–4000 px sources. The logo is 7435×2229 for a 220×66 slot (34× the needed resolution), decoding about 66 MB of RGBA per page view. |
| LCP (local server, not representative of mobile networks) | 120–276 ms locally. On real mobile data, the 2.4–3.2 MB hero/PDP images dominate. **Not measured on a throttled network.** |

## 6. Uncertainties that images cannot resolve (owner decisions, not technical findings)

1. **Price, availability and stock:** no image establishes these. All catalogue prices stay `null`.
2. **Which variant is current:** the Minato white versus tan-wrapped handle; the Hidden Leaf grey (April site) versus white plates (shoot and phone); Light Fury painted versus unpainted.
3. **AI imagery policy:** whether any AI-edited image may be used at all. The brief says no. If the owner allows it, label it, because the files carry public C2PA/SynthID markers that platforms can surface.
4. **Photo rights:**
   - The `RAV_*` shoot looks professional. Confirm who shot it and that HoneyComb may use it.
   - Confirm the Canva team "Anthony Dyer's team" belongs to the owner.
   - Confirm the Spanish WhatsApp image's origin.
5. **Logo rights:** the agreement transfers rights on full payment, and the Drive copy is unsigned. Confirm payment completion and keep a signed copy.
6. **Franchise IP** (QA-FINDINGS F-06) is unchanged by the photos.

## 7. Inspected-file register (Verified = downloaded and hashed; SHA-256 prefix)

```
12KT8iT8zQ8iOOfAhFek8cqeYQJKzjF8n  WhatsApp Image 2025-12-22 at 14.39.39.jpeg          98909  80805c0c5ba62ec2  real (Minato, white)
12wvXum-YXjOK2RJmaCGEmRTJI1RIqRLm  Product Photo (1).jpeg                              469935  c33cd7f2835166a3  AI (C2PA) = minato-kunai.jpg
13NPWedcC7fSpsJZcGQqMb7ZtfOfGii9N  WhatsApp Image 2026-01-22 at 19.46.02 (2).jpeg       81218  5cfaa3d98d673249  real = hidden-leaf.jpg
147Cc7NRSivyNKzIixRkvvlI3OACsGVtR  Pro-1_202604130244.jpeg                             522603  1069dc838bb311ee  AI (C2PA x4) = kurama.jpg
16lTy3YED8Lg3ttKOT5Vwgc1_y_bvr3-c  Copy of RAV_4401.jpg                               3846301  0d8da34773523a72  pro photo (mini kunai)
18L-OLskQ9znfwprb8XSfPcS_M2BtMyUm  Copy of RAV_4411.jpg                               3217089  5468d317ecd65723  pro photo (Jashin symbol)
18oM_OFh0gcmV3iHexKXHtw_glaIw-GP2  Product Photo Angels (1).jpeg                       519554  70ae90b684d65263  AI (C2PA) Light Fury
1Cl2K6PEFrLUvxxhVt6h_QDbLqLu29GmZ  Copy of RAV_4430.jpg                               4819888  53b9f536699aa6b4  pro photo (Sharingan)
1E35H6xX9rDcamwGPXUATv2MMyGIQNDN4  20260301_144017.jpg                                2408049  58f957a6b335db81  real = night-fury.jpg
1GCyzwWxds8eT26kaak3xMXHsGsxZKZtr  Copy of RAV_4361.jpg                               5087033  bb028e76c44761d2  pro photo (leaf-symbol keychain)
1LpCNMIGZtfyg0VJvhi--qLmWIXVGxrHM  Copy of RAV_4370.jpg                               5287277  cadabfe687cfb736  pro photo (Akatsuki cloud)
1NIqS9NGhOtB9AFwximWhxC5ZSUj9dWEG  Copy of RAV_4463.jpg                               5172434  61df0bba4a54c3c3  pro photo (6 headband plates)
1Q6j0A5ltTyWQ3QaTM4ot_yZn3E1mAsiS  Gemini_Generated_Image_nb816onb816onb81.png        1745618  b1c7611b506ae944  AI brand scene (contains Groot)
1RIgISQZuseq_Vr69vMqig1ztODPDmWwb  Variation 1 (1).jpg                                1571630  62d15907a0680b6c  uncertain (Light Fury, painted)
1Rxdr_djzU7VD5tNTjpUrMsYiW030xrUq  20260301_144334.jpg                                2189035  27da2682a37e7579  real, resized (Night Fury batch)
1V7aF7xUAy9-_JdEJxkPxBXl8L1S4dszr  Copy of RAV_4407.jpg                               4183675  bc499260e84f84aa  pro photo (Jashin symbol)
1WtFmt7EJjed3Fmwpk7LUl_wiWT95DQzZ  Product Photo  (5).jpeg                             342699  a2e97be471c145eb  AI (C2PA) = light-fury.jpg
1XGpES0PDcZuXp46hSPsD_gtHMsP_qVbY  HNYCMB504 (1).png                                  3230970  d9c9b702a5af80a9  real via Canva = baymax.png
1Zh3oM_yAylvP_1gbTjqI2yz79OREcGUe  Copy of RAV_4433.jpg                               5745888  e6c8a520c094869d  pro photo (Sharingan set)
1bWM-BXmihA_64Spsw9mRxFO6u-i4-Q3H  Copy of RAV_4399.jpg                               4971258  9cbbf9fa41b3e31f  pro photo (mini kunai)
1dtFDvX586ab3wD4lTmnk3WfHuMSJtonh  Copy of RAV_4424.jpg                               4788284  4a1524bce88fd81d  pro photo (Sharingan, 3 pendants)
1fQ26KF0njNk9Hykgy12hIGxgKl_B2seX  HC_Symbol-1.png                                     572561  95cddb17a6b782ce  brand symbol 8334²
1gfdle29B3qhNZbD3HjR9qjYSbD9T8s3K  Copy of RAV_4440.jpg                               6194945  639d0008707766a0  pro photo (pendant set)
1hQFJ9eoJmMbZLpjorb82N0phk5nhi4nS  Copy of RAV_4378.jpg                               4497493  3ec3a4acd90b71af  pro photo (Akatsuki cloud)
1kqwnUbpCyoJ5waS7zcBTfT9Jq-poskak  20260308_160213.jpg                                2660781  8ffff594fbf20233  real (Light Fury, unpainted)
1mx3YRM6o4CrGZtIl6TX2ZqnG8cacFDQo  RAV_4322.jpg                                       4887510  f41368debf7c8dad  pro photo (Classic Kunai) - source of classic-kunai AI
1nuDFE2iLyv3_zR0-MfeE1rwH7K-wGaQN  HNYCMB504 (2).png                                  3370066  aef78d42803d53a7  real via Canva (Baymax)
1rW98jCTB1kwWoP0gMThUrnWitqN8-q_v  Copy of RAV_4459.jpg                               5200933  d1f9cb985d101fde  pro photo (4 headband plates), Nikon D810 EXIF
1sBz3bH6mqjuY5YayCn3AbVGYKWKqh_OE  Imagen de WhatsApp 2025-10-29 a las 21.34.01_cf2bbadf.jpg  211157  1b16242ba086364a  uncertain origin (Minato, gold handle)
1sHmDdDKtS_qnh76ctrgYkJj_Uokaj23e  HC_WhiteBK-1.png                                    737060  1a31b02c4343ed65  logo = honeycomb-logo.png
1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F  Copy of RAV_4468.jpg                               5305478  6bed862cf24b3c95  pro photo (Classic Kunai, Azuma Blade, Minato tan)
1xF1cMoJKtnUon4UaK4NcmwSJ1H9L0E-I  Copy of RAV_4427.jpg                               4737677  faa6c2f7f8e61563  pro photo (spiral pendant)
1xgQx1gPc0au7Q4mNE_In0xrHmQC0JgFk  Copy_of_RAV_4322.jpg_202604130724.jpeg              306622  26d7c99758835b30  AI (C2PA) = classic-kunai.jpg
1yOsMn0Ynoz-AANMtW1q_dTNMLlVA67Ls  Copy of RAV_4348.jpg                               5153924  9e15331b3cac7998  pro photo (Uchiha crest)
```

Folder IDs: Brand Kit `1_XuhStCc-GR_fH0jKq-p7NtHF3O1onDI`, Productions `1LoG3r7AZPp4pUyj2iuWdS_STWLIh4TC9`, Old list `19mlCcm3dHXH1LUkwUBAoqBbuajMSuHua`, Naruto `1OkxJXSmdwn7ec6uW_sqk_O-mnSl79y0o`, How to Train Your Dragon `1u2D7okJdQkSx0i8lyzIU-eUbpOEq7ZPf`, Baymax HNYCMB504 `1o4lJ9_zSS8dx5DR2uCl2spHV0gpNXfFI`, Photo Gallery `1_rBrhwHMfTwF3UCnXYokR_kraHClQzDB`, SKU `1VmZhBBo47p-ae2D4cQXmODhlzj-QxbmE` (empty), Phone Stand `1pPpXoGxpL-p0s8tOt5BtF98zsI6fnBDB`, Clean White BG `1IoLGWP128KbNDbezQu98hgUsHv-EAhS4`, New `1yW0RtOV6bcjaQvHOl5HS9Ra45ETrfe2P` (empty), HoneyComb Product Studio `1DeDdQmZO6wFDEpZBGsiaLUhwvK6IWnoC`, HoneyComb 3D - Listing Kit `1HN49uPs2p5IvmDYrZ2SwueUhCUZysEiP` (with `04 Gemini Outputs` `1KkwqUdFEO1g3sG1LcxBLDCvwyIcSoP74`, `05 Daraz Final Listings` `11sQD58o5RnK0yOLBzV3DNmOinKEYjGGB`, `06 Product Records and Pricing` `1b9NvsYqSzkjWyvGQ99wz1blpD8himUWC`, not opened), Pikachu KeyChain `1xYY5H7mJQ25KMIinSgRnmcsYbUeAtWG3`, `Naruto-20260105T130713Z-3-001.zip` `1xBr7H9UBbNZe7cs_NfocvPZq3swoQ1v7` (165 MB, not opened).

## 8. Not done / gaps

- Not every Drive file was opened. Classifications marked "inferred" rely on filename patterns.
- ZIPs and videos were not inspected: `Final by RINS.mp4`, `Articulated Light Fury Dragon Keychain.mp4`, `download.zip` files, and the 165 MB Naruto ZIP.
- `06 Product Records and Pricing` was **deliberately not opened** for pricing. Prices are owner decisions, and images must not be used to infer them.
- C2PA signatures were detected by manifest content, **not cryptographically validated** with a C2PA verifier.
- No throttled-network performance run, and no Firefox/Safari image decoding check.
