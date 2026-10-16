# HoneyComb 3D storefront rebuild: QA findings

Owner: independent recovery QA (Claude). Acceptance criteria: [`QA-ACCEPTANCE.md`](QA-ACCEPTANCE.md).
Last updated: **2026-10-15**.

> **Headline (2026-10-13, Run 6):** current head **`948dff5f6e37e6f07100a554fb8b49eb64aa846e`**.
> - **Fixed and verified:** the favicon (I-21, made from the owner's brand-symbol PDF) and the Minato image sizing (I-22).
> - **Image weight:** at most **281 KB per page**. The Minato page dropped from 467 KB to 173 KB.
> - **Checks:**
>   - Build, tests, audit and secret scan pass. Domain 13/13. Smoke 88/88 in 3 of 3 preview runs and 89/89 live. axe 0. Image audit 18 PASS, 0 FAIL.
>   - GPT's CI is green, read-only, and runs the QA scripts at `97780b0`.
> - **Photos copied (later on 2026-10-13):** the owner copied the Kurama and Classic Kunai originals into the HoneyComb folder. QA downloaded both, and their SHA-256 hashes equal the approved originals (§7, "Owner photo copies"). GPT can now replace the two placeholders.
> - **Process note (I-23, Info):** one more write-enabled workflow produced the favicon commit; it is now deleted.
> - **Sign-off:** OK for a private or invite-only preview. Public launch is blocked only by owner items (§7a).
>
> **Earlier headline (2026-10-13, Run 5, superseded):** head at the time was **`acca67f326a2036d527a1ffef5a727dcc3ca2d7d`**.
> - **GPT's fixes are verified:**
>   - All 4 AI images are gone, and the approved real photos are cropped and resized faithfully.
>   - Image weight is down from **4.7–7.9 MB per page to at most 467 KB**, and the logo is 660×198.
>   - The Airtable prices are in, and availability stays "to confirm".
> - **Checks:** build, tests, audit and secret scan pass. Domain 13/13. Smoke 88/88 (3 of 4 preview runs; one intermittent console 404) and 89/89 live. axe: 0.
> - **New Low/Info items:**
>   - No favicon (I-21).
>   - The tall Minato image is oversampled (I-22).
>   - CI briefly had write access (I-23, now fixed).
> - **Waiting on the owner:** Kurama and Classic Kunai show "Original photo coming soon" until their photos are copied into the HoneyComb folder.
> - **Sign-off (§7a):** OK for a private or invite-only preview. Public launch is still blocked by owner decisions.
>
> **Owner answers (2026-10-11, §5a):**
> - The owner approved the recommended real photos.
> - Minato Kunai variant: **tan handle, black blade**.
> - Airtable is the owner's **price and stock source**. It has a price for all 7 storefront products (§3.2), but **no per-product stock count**.
> - Two new problems came out of it:
>   - **Baymax and Kurama SKUs are swapped** between Airtable and Drive (F-17).
>   - Airtable shows the products are printed from **third-party MakerWorld models**, whose licences for selling prints are unconfirmed (F-18).
> - At the time, `codex/storefront-mvp` was still at `8d13b91`.
>
> **Earlier headline (2026-10-09, Run 4, superseded by Run 5):** head at the time was **`8d13b910bc4ff156a2ffd049cd4cc381f19828ad`**. Build, tests, check, audit and
> secret scan pass. Domain contract tests 13/13. Browser smoke 88/88 and 89/89. axe: 0 violations. I-1…I-14 are fixed except I-12 (Info).
> **New from the asset audit ([`ASSET-AUDIT.md`](ASSET-AUDIT.md)):** GPT's 8 imported files are byte-identical to the Drive files they cite, but
> **4 of the 7 product images are Google-AI-generated (C2PA + SynthID)** (I-15, High). Pages also ship **4.7–7.9 MB of images**
> with no responsive sizes (I-16, High) and a 16.6 MP logo (I-17, Medium).
> **Sign-off (§7a):** code is OK for a *private* preview; the **image set must be corrected before any wider preview or launch**. Public launch is still
> blocked by owner decisions D-1…D-9.

Finding labels: **Tested failure** = reproduced by running something. **Inspection** = found by reading
code/evidence, not executed. Severity: Blocker > High > Medium > Low > Info.

---

## 1. Review log

| Date (UTC) | Target | Commit | What was done | Result |
|---|---|---|---|---|
| 2026-10-08 | `RINS-Enterprises/honeycomb3d-website` (brief, `codex/storefront-mvp`) | — | Attach via session repo tooling; `git ls-remote` | **No access.** Not found or no permission. Not in the session's accessible-repo list. |
| 2026-10-08 | `RINS-Enterprises/honeycomb3d-ecommerce-system` `main` | `c78e12f024e9c6f2652b4e2961f0e79d57cffcff` | Read README, all 4 screenshots (zoomed crops), full git history (7 commits, 2026-04-19); `qa/scripts/review-commit.sh` (no `package.json`, so nothing to build); `qa/scripts/secret-scan.sh` | No code. Evidence catalogued in §2–3. Secret scan: no HIGH findings. |
| 2026-10-08 | `RINS-Enterprises/honeycomb3d-ops-system` `main` | `a0cfadb38fda01262e40a258f0b6c7c3291a8d2d` | Read README + LICENSE; secret scan | README only (Appsmith + Baserow internal tool). Secret scan: no HIGH findings. |
| 2026-10-08 | `https://honeycomb3d.store` | — | HTTPS GET | Blocked by this environment's egress policy (proxy 403). **Live status unknown**, not "down". |
| 2026-10-08 | Rebuild ZIP | — | Filesystem search for `*.zip` / recovery files | Not present. |
| 2026-10-09 | `honeycomb3d-ecommerce-system` `codex/storefront-mvp` | `f801d314663470d5d4539f594e80acc0d63418e8` | Read `docs/RECOVERY-AND-BUILD-BRIEF.md` (E-7), `docs/BUILD-STATUS.md`, all source and data. `review-commit.sh` in a separate checkout. QA domain contract tests. Secret scan. | See §7 Run 1. |
| 2026-10-09 | `codex/storefront-mvp` | `8d13b910bc4ff156a2ffd049cd4cc381f19828ad` | Run 4: review-commit, domain tests, smoke (preview/live), edge probes, axe, **image audit**; Drive asset provenance (35 files downloaded to QA scratch, hashed, C2PA-scanned, visually inspected) | See §7 Run 4 and `ASSET-AUDIT.md` |
| 2026-10-09 | Owner Drive folder `HoneyComb` (`1BAhuPuAvAvgschy6bv-qW1YcBd74zaId`) | — | Read-only Drive connector: listing, metadata, downloads to scratch | Access works; nothing changed in Drive |
| 2026-10-09 | Namecheap account (read-only connector) | — | Domain list; DNS host records for `honeycomb3d.store` | E-8. No changes made. |
| 2026-10-09 | `https://honeycomb3d.store`, `ingress-cinna.easywp.com`, web archive | — | Fetch via a second tool | Inconclusive: that tool's DNS also failed for `www.namecheap.com`, so the failure says nothing about the site. |
| 2026-10-11 | Owner's Airtable base `appTRxtdHRFH7mgLX` | — | Read-only via the owner's Airtable connector. Read the schema of every table, the records of **Products** (`tblmUOdfunwP8iWKi`, 18 rows) and **Filament Inventory** (`tbl2kT7YFNC6Jm0Pk`, 16 rows). **Not read:** cost and supplier fields, and all finance tables (Orders, Financial Periods, Capital, Loans, Withdrawals, Expenses and so on). | §3.2, F-17…F-20. Nothing in Airtable was changed. |
| 2026-10-11 | Drive `HoneyComb/Stock` (`1FaOJQ7XVN3uQMVxoo04_IvXZq5ff6FTs`) and SKU folders | — | Read the sheet `HC-BOX`. Read metadata for the folder `HNYCMB503 Kurama` (`1AV2PhFD…`) and for `Baymax.3mf` (`1SfuSyhm…`). Listed `06 Product Records and Pricing`, which came back empty. | E-11, F-17. Nothing in Drive was changed. |
| 2026-10-11 | `codex/storefront-mvp` | `8d13b91` (unchanged since 2026-10-09) | `git ls-remote` | No new commit, so no re-test was needed. |
| 2026-10-15 | `codex/storefront-mvp` | `948dff5` (unchanged) | `git ls-remote` (no new commit from GPT). Ran an emulated slow-network check (slow 4G and 3G, 4× CPU). Tried to read the MakerWorld licence pages, which the network policy blocked. | §7 "Slow-network check", I-24 |
| 2026-10-13 | Owner Drive, HoneyComb folder | — | Searched for the two pending photos. Downloaded both new copies to QA scratch, hashed them, and checked them for AI markers. Checked their folder chain up to the HoneyComb root. | Both match the approved originals (§7, "Owner photo copies"). Nothing in Drive was changed by QA. |
| 2026-10-13 | `codex/storefront-mvp` | `948dff5f6e37e6f07100a554fb8b49eb64aa846e` | Run 6: review-commit, domain tests, smoke (3 preview runs, 1 live), edge probes, axe, image audit, provenance scan, a hash and pixel check of all 18 derivatives and 6 sources, a favicon source and frame check, PR #2 CI and workflow review, and a Drive title search. | See §7 Run 6 |
| 2026-10-13 | `codex/storefront-mvp` | `acca67f326a2036d527a1ffef5a727dcc3ca2d7d` | Run 5: review-commit, domain tests, smoke (4 preview runs, 1 live), edge probes, axe, image audit, provenance scan, a pixel and hash check of every source and derivative, and PR #2 CI status. Drive title search for the two pending photos. | See §7 Run 5 |

## 2. Evidence register (directly recovered)

All from `honeycomb3d-ecommerce-system@c78e12f`, committed 2026-04-19 (+05:30). The screenshots are
1920 px wide desktop captures of the WooCommerce/Blocksy site. Their capture date is not recorded,
but it is on or after the newest review shown (2026-04-05) and on or before the commit (2026-04-19).

| ID | File | SHA-256 | Shows |
|---|---|---|---|
| E-1 | `homepage.png` (1920×4436) | `78da25e2bde4bbe244c5878341918598cc9d5433dca99159b4e7fa96982fc66c` | Hero, "Shop by Universe" (Anime / Superheroes / Movies & TV), Best Sellers page 1 of 2 (6 products), 2 reviews, "Why collectors choose" |
| E-2 | `shop.png` (1920×2143) | `cb751142ca4ce3b0a0c2415a048f98ff2755255bbf1c5066aa7034a1dc8f705c` | "Showing all 7 results", every card with price, compare-at price, sold/stock badges, footer links |
| E-3 | `product.png` (1920×3597) | `c5b3e4b9aff04a90c8f07149717ae632662b17e3c718af65ef92bd56acaf37d5` | Night Fury Keychain PDP: SKU, stock, categories, tags, 9 gallery images, description, related products |
| E-4 | `checkout.png` (1920×2128) | `dfd25f20b11dad429adb24054468049ad26a7ef98c176960207d0aa6c598d534` | Checkout with Night Fury ×1: shipping, payment options, review opt-in |
| E-5 | `README.md` | — | Historical claims about features/integrations (§4.2) |
| E-6 | ops-system `README.md` | — | Internal tool: Appsmith front end, **Baserow** DB, Products → Order Items → Orders, cost/profit; inventory tracking listed as a *future* improvement |
| E-7 | `docs/RECOVERY-AND-BUILD-BRIEF.md` @ `f801d31` (dated 2026-10-08) | — | Recovered **from chat history, second-hand**: EasyWP/WooCommerce/Blocksy platform, `info@honeycomb3d.store`, CSS colours, a shipping draft, historical prices, scope and acceptance checks. The brief itself classifies most of this as historical/unverified. |
| E-8 | Namecheap read via the user's connector, 2026-10-09 | — | `honeycomb3d.store` **registered** 2026-03-31, expires **2027-03-31**, auto-renew **on**. DNS: apex `ALIAS → ingress-cinna.easywp.com`, `www CNAME → apex`, SPF `include:spf.easywp.com`, a Comodo DCV CNAME, an ACME TXT. **No MX records** returned by the host-records API. |
| E-9 | Airtable `appTRxtdHRFH7mgLX` / Products `tblmUOdfunwP8iWKi`, read 2026-10-11 | — | 18 products, all `Active`. Fields: SKU, name, category, **Selling Price (LKR)**, status, asset name, model/source link. There is no compare-at price, no stock quantity, and every Bill of Materials link is empty. Records were created 2026-08-23 ("original workbook"); the connector does not return a last-modified time. **The owner named this as the price source (E-12).** |
| E-10 | Airtable Filament Inventory `tbl2kT7YFNC6Jm0Pk`, read 2026-10-11 | — | 16 filament rows (colour, material, stock in kg, status). This is raw material, not finished products. |
| E-11 | Drive sheet `HC-BOX` `1qSC_e4OGonIkcnxZehLXo1bSWBQfQwAp4s8WOXmQTWQ`, in `HoneyComb/Stock`, created 2026-10-09, modified 2026-10-10 | — | Free-text contents of storage boxes `HC-BOX-001…012`, e.g. "NightFury x3" (005), "Lightfiry x5" (007), "Naruto Keytags" (008, no count). |
| E-12 | Owner's answers in the QA chat, 2026-10-11 | — | "1. approved" (the real-photo recommendations). "2. tan handle, kunai black colour" (Minato). "3. okay" plus the Airtable link, as the source for prices and stock. |

## 3. Recovered catalog (as observed, not current-verified)

All prices are LKR as displayed with the "රු" sign. "Compare-at" is the struck-through price.
**None of these values is owner-confirmed as current.**

| # | Name (verbatim) | Price | Compare-at | Badges on shop card (E-2) | Other recovered data | Source |
|---|---|---|---|---|---|---|
| 1 | Hidden Leaf Keychain (Naruto) | 400.00 | 600.00 | SALE | — | E-1, E-2 |
| 2 | Baymax Figure (Big Hero 6) | 800.00 | 1,200.00 | SALE, Bestseller, "10 sold • Only 3 left" | — | E-1, E-2 |
| 3 | Kurama Figure (Naruto) | 1,200.00 | 1,500.00 | SALE, Bestseller, "9 sold • Only 5 left" | Orange print | E-1, E-2 |
| 4 | Night Fury Keychain | 500.00 | 900.00 | SALE, Bestseller, "7 sold" | SKU `HNYCMB501`; "6 in stock"; categories Dragons, How to Train Your Dragon, Key Chains, Movies & TV; tags dragons, how to train your dragon, nightfury, toothless; brand HONEYCOMB; full description; 9 gallery images (thumbnails only) | E-2, E-3, E-4 |
| 5 | Minato Kunai (Naruto) | 1,000.00 | 1,500.00 | SALE, "4 sold • Only 2 left" | — | E-1, E-2 |
| 6 | Light Fury Keychain | 500.00 | 900.00 | SALE, "5 sold" | — | E-1, E-2 |
| 7 | Classic Kunai (Naruto) | 900.00 | 1,200.00 | SALE | — | E-1, E-2 |

Cross-checks performed: home and shop prices agree for all 6 products shown on both. The checkout
line for #4 (500, save 400) agrees with E-2/E-3.
Shipping observed (E-4): one method, "Islandwide Delivery (Rs. 300)" at රු300.00. Checkout country: Sri Lanka.
Contact observed (E-1, E-3): WhatsApp `+94 70 300 9064` (3 occurrences, consistent).

### 3.1 Price evidence conflicts (E-2 vs E-7)

| Product | Screenshot price / compare-at (April, E-2) | Brief historical figures (E-7) |
|---|---|---|
| Kurama Figure | 1,200 / 1,500 | 2,000 / 1,000 ("175 g", September) |
| Baymax Figure | 800 / 1,200 | 900 / 600 ("50 g", September) |
| Classic Kunai | 900 / 1,200 | 600 / 400 (September) |
| Night Fury | 500 / 900 (keychain) | 1,500 ("Articulated Dragon", April suggested). It may be a different product. |
| Dragon keychain | 500 / 900 (Night/Light Fury) | 500 / 250 (September) |

No two sources agree, so **no price can be published from the evidence**. Implementation
`f801d31` correctly sets every `priceLkr` to `null`.

### 3.2 Owner-designated catalogue source: Airtable (read 2026-10-11)

On 2026-10-11 the owner named the Airtable base as the source for prices and stock (E-12). For the storefront, that
**supersedes §3 and §3.1**. The data below was read without changes (E-9). A machine-readable copy is in
[`qa/owner-catalog-airtable.json`](../qa/owner-catalog-airtable.json).

| Storefront ID (`8d13b91`) | Airtable SKU (record) | Airtable name | Airtable category | **Price LKR (Airtable)** | April site price / compare-at (§3) | Airtable status |
|---|---|---|---|---|---|---|
| HC-LEAF | HNYCMB511 (`recgVDtQsRTEGSyzG`) | Hidden Leaf Keychain Naruto | Keytag | **400** | 400 / 600 | Active |
| HC-BAYMAX | **HNYCMB503** (`recIC7e7QDrEe31ac`), see F-17 | BayMax | Figurine | **1,000** | 800 / 1,200 | Active |
| HC-KURAMA | **HNYCMB504** (`recIEe7aBzmZkPiIQ`), see F-17 | Kurama | Figurine | **1,500** | 1,200 / 1,500 | Active |
| HNYCMB501 | HNYCMB501 (`rechNg8MzLC5lT3uu`) | Night Fury Keytag | Keytag | **500** | 500 / 900 | Active |
| HC-MINATO | HNYCMB508 (`recjsg5yUe8VJDPWl`) | Minato Kunai (Naruto) | Weapon | **1,000** | 1,000 / 1,500 | Active |
| HC-LIGHTFURY | HNYCMB502 (`recI8XqnYur0JllUa`) | Light Fury Keytag | Keytag | **500** | 500 / 900 | Active |
| HC-KUNAI | HNYCMB509 (`recXi9upTrq3CYmlF`) | Classic Kunai (Naruto) | Weapon | **1,000** | 900 / 1,200 | Active |

- **Prices:**
  - Four of the seven prices match the April site.
  - Three are higher: Baymax by 200, Kurama by 300 and Classic Kunai by 100.
  - Airtable's records date from 2026-08-23. They count as current only because the owner says so; QA cannot verify that.
- **No compare-at prices.** Airtable has no former-price field, so the site must not show SALE badges or struck-through prices (F-04).
- **"Active" is a catalogue status, not availability.** None of the 18 Products rows has a quantity field.
- **Stock evidence that does exist:**
  - **Filament Inventory (E-10)** tracks raw filament by weight:
    - 9 of the 16 rows have no stock value, including Black PLA (`FIL-009`).
    - Beige PLA (`FIL-007`) is at 0.1 kg, below its 0.2 kg reorder threshold, and marked "Reorder Needed".
    - If the Minato's tan handle is printed in Beige, the chosen variant may be limited. The owner should say which filament the handle uses, because the Bill of Materials links are empty.
  - **The owner's box sheet `HC-BOX` (E-11)** has free-text counts. How each entry maps to a SKU is QA's reading, not confirmed:
    - "NightFury x3" (`HC-BOX-005`) is probably HNYCMB501.
    - "Lightfiry x5" (`HC-BOX-007`) is HNYCMB502 or HNYCMB510 (Light Fury Big Wings).
    - "Naruto Keytags" (`HC-BOX-008`) has no count; it may be HNYCMB511.
    - Kurama, Baymax, Minato Kunai and Classic Kunai appear in no box.
- **QA recommendation for D-8:** show **no stock counts**. A hand-kept box list goes out of date, and the brief forbids invented scarcity.
  - The app already supports per-product `availability`: `unconfirmed`, `available`, `unavailable` or `made-to-order`.
  - The owner should pick one value per product. Example: `available` for items on hand and `made-to-order` for the rest, with a lead time the owner states.
  - Until the owner does, keep `unconfirmed`.
- **Other Active Airtable products that are not on the storefront** (F-19):
  - HNYCMB505 Bridgerton Bookmark: 300
  - HNYCMB506 Flexi Derpy (Kpop Demon Hunters): 500
  - HNYCMB507 Office Desk Organizer With Phone Holder: 2,000
  - HNYCMB510 Light Fury Big Wings: 600
  - HNYCMB512 Urban Spider Man: 1,750
  - HNYCMB513 Stormtrooper Star Wars keychain: 500
  - HNYCMB514 Shuriken Ninja Star: 500
  - HNYCMB515 "Gorgu" Baby Yoda keychain: 500
  - HNYCMB516 Dummy13 Iron Man: 1,500
  - HNYCMB517 Dummy 13 Spider Man: 1,500
  - HNYCMB518 Horse figurine: 1,600

## 4. Classification of what is known

### 4.1 Directly recovered evidence (seen in E-1…E-4)
- 7 product names, displayed prices and compare-at prices (§3); 1 SKU; 1 full description; Night Fury taxonomy.
- Visual design: dark theme, navy header, orange (#F5A623-like) accents, purple SALE badges, bee-hexagon "HONEYCOMB™" logo. Fonts look like Poppins (headings); **not confirmed**.
- IA: Home, Shop, About, Contact; search, account and cart icons; footer links T&C, Privacy, Refund & Return, Shipping, Contact, About, My Account. **Page contents not recovered.**
- Checkout at capture time offered **Stripe card (with Google Pay / Link express)** and **"Bank Transfer (WhatsApp Confirmation)"**, plus an opt-in for **CusRev** review invitations. No COD radio option was visible.
- PDP copy claimed "Cash on Delivery available", "Islandwide delivery across Sri Lanka", "Fast delivery across Sri Lanka", "Locally made in Sri Lanka".
- Two homepage reviews (§F-05) and "Reviews (0)" on the Night Fury PDP.

### 4.2 Historical claims (README text, not evidenced by artefacts)
- Stripe integration; COD; FluentSMTP email; "Trustpilot review automation (BCC logic)"; low-stock and "X sold" "urgency system"; WhatsApp contact; "live store designed to generate actual sales".
- No code, configuration, plugin export, credentials or DB dump backs any of these. **Treat every integration as non-functional.**
- From the brief (E-7, chat-derived): `info@honeycomb3d.store` as the customer email; a shipping draft of "1–3 business days processing, typically 1–5 business days delivery, courier-dependent customer-paid fees"; an April terms draft; and the September/April price figures in §3.1.

### 4.3 Old proposals / practices (not to be carried over without a decision)
- "Psychological triggers", "scarcity triggers ('Only X left')", "social proof ('X sold')": README §"What I Optimized". These were deliberate conversion tactics, not data.
- Ops-system future items: dashboard, inventory tracking, order history. **Inventory tracking did not exist** at the time of that README (2026-04-22).
- From the brief (E-7): payment providers PayHere, WebXPay, KOKO and Mint were *considered*, never evidenced as active. Hero variants "Precision in Every Layer" / "LEVEL UP YOUR SETUP". A September homepage layout proposal. Category suggestions Anime, Weapons/props, Gaming, Keychains, Collectibles, Dragons.

### 4.4 Current unknowns
See owner decisions §5. Also unknown: whether the EasyWP site, its database, `wp-content/uploads` or a hosting backup still exist (DNS still points at EasyWP, E-8); whether `info@honeycomb3d.store` receives mail (no MX records returned, E-8); whether the Baserow product table is current; actual stock and print lead times; product dimensions, materials and colour options; legal business name and registration for policy pages.

## 5. Owner decisions required

| ID | Decision | Why it blocks | Relates to |
|---|---|---|---|
| D-1 | Ordering/payment model for MVP: WhatsApp-only? Bank transfer? COD (with or without fee)? Card payments later? | Checkout copy and AC-WA-4 depend on it; recovered evidence conflicts | F-03 |
| D-2 | Confirm the WhatsApp number `94703009064`, who answers it, and the hours | It becomes the only order channel | F-11 |
| D-3 | Confirm or replace each of the 7 products: still sold? current price? is the compare-at a genuine former price? SKU, description, size, material, colours, lead time. Add products not in screenshots (the home "Superheroes" collection has none). | No catalog can ship without it | F-02, F-04, F-12 |
| D-4 | Delivery: price (Rs. 300 flat?), coverage, typical days, COD fee | Cart total and claims | F-08 |
| D-5 | Supply text for Terms, Privacy, Refund & Return, Shipping, About, Contact | Must not be invented | F-10 |
| D-6 | Reviews: drop all, or provide consented reviews with source | Trust/consumer-protection risk | F-05 |
| D-7 | IP stance on franchise-character products and franchise names in titles; any "fan-made, not affiliated" notice | Legal/marketplace risk | F-06 |
| D-8 | Stock/urgency: show stock at all? If so, from what source? | Avoid fabricated scarcity | F-04 |
| D-9 | Provide original assets: vector logo, original product photos, collection images, brand colours/fonts, favicon | Screenshot crops are not production assets | F-07 |
| D-10 | Confirm that each MakerWorld model's licence (or the designer's permission) allows selling printed copies | Permission to sell, separate from character IP | F-18 |
| D-11 | Which SKU is right for Baymax and Kurama, `HNYCMB503` or `HNYCMB504`? Then fix the other source. | SKUs in order messages and ops records | F-17 |

### 5a. Owner answers received (2026-10-11, E-12)

| Decision | Owner's answer | What QA recorded | Still open |
|---|---|---|---|
| D-9 photos | "approved" | QA reads this as approval of the **recommended photo for every product** in `ASSET-AUDIT.md` §3: Classic Kunai `RAV_4322`, Kurama `1.png`, Light Fury `Variation 1 (2)` (painted), Hidden Leaf `RAV_4459` crop (white plate), Night Fury `20260301_152139` (single unit) and Baymax unchanged. If any of these is not what the owner meant, the owner should say which. | Copy the originals that sit outside the HoneyComb folder into it (`ASSET-AUDIT.md` §3). Confirm rights for the photographer, the Canva exports and the logo (`ASSET-AUDIT.md` §6). |
| D-9 Minato variant | "tan handle, kunai black colour" | Use `Copy of RAV_4468.jpg` (`1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F`). It is the only real photo of that variant QA has found, and it matches the request (Visual): black blade with silver edge bevels, tan handle with engraved characters, black ring. It is a group shot, so it needs a documented crop (`ASSET-AUDIT.md` §3). The white-handle photo is **not** to be used for this listing. | None for the photo. The filament question is in §3.2. |
| D-3 price | Airtable is the source | The prices are in §3.2 and `qa/owner-catalog-airtable.json`. | Descriptions, size, material and lead time. SKU conflict D-11. |
| D-8 stock | Airtable is the source | Airtable has **no per-product stock** (§3.2). QA recommends no counts on the site and an owner-chosen `availability` value per product. | The owner picks `availability` per product, and a lead time if any product is `made-to-order`. |

## 6. Findings

### F-01 · Closed 2026-10-09 · Target repository was a proposal; work moved to this repo
- **Type:** Tested (access). **Reviewed commit:** n/a.
- **What happened:** `RINS-Enterprises/honeycomb3d-website` could not be attached (2026-10-08) because it was never created. The brief only *suggests* it (E-7 §"Two-agent workflow"). The implementation is on `codex/storefront-mvp` in `honeycomb3d-ecommerce-system`, which QA can read.
- **Residual:** QA work is on the session-assigned branch `claude/wizardly-mendel-73bkuw`, not the brief's `claude/recovery-qa`. Both agents should treat this branch as the QA branch, or the owner can ask for it to be mirrored.

### F-02 · High · Catalog cannot be rebuilt from recovered evidence alone
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Reproduction:** Compare §3 with what a PDP needs (AC-PDP-1/2, AC-DATA-1).
- **Expected:** Per product: name, slug, price, SKU, description, category/franchise, type, images, availability.
- **Actual:** 7 products. Only #4 has a SKU, description, categories, tags and stock. The other 6 have just name, price, compare-at and one card image. The 9 Night Fury gallery images exist only as ~70 px thumbnails. No product images exist as files at all, only inside screenshots (cards ~320 px). Categories for 6/7 products are unknown. The "Superheroes" collection has no matching product.
- **Evidence:** E-1, E-2, E-3; §3.
- **Recommended fix:** Recover from source rather than screenshots: a WooCommerce product CSV export or DB backup, `wp-content/uploads`, the Baserow product table (cost/profit fields excluded), or a web archive. Until then, ship only owner-confirmed products, each with provenance (AC-DATA-1/2). GPT: please keep catalog data in one typed file with a `source` field per product.

### F-03 · High · Payment/ordering evidence is contradictory (COD)
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Reproduction:** Read README "Key Features" and the PDP trust list (E-3), then the checkout payment options (E-4).
- **Expected:** Consistent statement of how customers pay.
- **Actual:** README says "Stripe or COD". PDP says "Cash on Delivery available". The captured checkout shows only **Stripe** and **"Bank Transfer (WhatsApp Confirmation)"**, with no COD option.
- **Evidence:** E-3 (crop: "Cash on Delivery available"), E-4 payment section, E-5.
- **Recommended fix:** Owner decision D-1. The new site must not say "COD available" (or any payment method) unless confirmed. With the WhatsApp-handoff MVP, state that payment is arranged on WhatsApp (AC-WA-4).

### F-04 · High · Urgency, stock and sale signals have no data source
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`; ops `a0cfadb`.
- **Reproduction:** E-2 shows "X sold", "Only X left" and SALE on all 7 products. E-1 hero shows "Limited pieces available — high demand", "Limited batches — once gone, it's gone", "Limited stock per batch — once sold out, restock is not guaranteed".
- **Expected:** Stock, sold counts and former prices reflect real records.
- **Actual:** The README describes these as "psychological triggers" / "scarcity triggers". The ops README lists inventory tracking as not yet built. Every product is permanently "SALE", so there is no evidence the compare-at prices were ever charged. This is a misleading-pricing / fake-scarcity risk.
- **Evidence:** E-1, E-2, E-5 §"What I Optimized", E-6 §"Future Improvements".
- **Recommended fix:** MVP shows none of these (AC-CONTENT-1) unless D-3/D-8 supply real data. The harness reports any such text as `REVIEW`.

### F-05 · High · Recovered reviews are unverifiable; review-system claims conflict
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Reproduction:** E-1 "What Our Customers Say — Real reviews from real collectors — ✓ Verified buyers".
- **Expected:** Reviews with provenance and consent; "verified" only where verified.
- **Actual:** 2 reviews: `thilini98` (Light Fury, 2026-04-05, verified tick) and `rins99` (Kurama, 2026-04-03, **no** verified tick). The handle `rins99` matches the business's organisation name ("RINS Enterprises"), so it may be an owner or test review; **unconfirmed**. The Night Fury PDP shows "Reviews (0)". The README claims Trustpilot automation, but the checkout shows a **CusRev** opt-in. No Trustpilot evidence exists.
- **Evidence:** E-1 reviews crop, E-3 tab "REVIEWS (0)", E-4 "Additional order information", E-5.
- **Recommended fix:** Ship no reviews and no "verified buyers" or Trustpilot badges (AC-CONTENT-2) unless D-6 supplies consented, sourced reviews. Do not re-use `rins99`.

### F-06 · High (decision) · Products depict third-party franchise characters
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Reproduction:** §3 names: Naruto (Kurama, Hidden Leaf, Kunai), Big Hero 6 (Baymax), How to Train Your Dragon (Night/Light Fury). E-1 collection tiles use Iron Man-like and Darth Vader-like figure photos. No such products exist in §3, and the photos' provenance is unknown.
- **Expected:** An explicit owner position on IP before relaunch.
- **Actual:** No licensing evidence. The hero copy targets "anime fans" while 3/7 products are Western film properties.
- **Recommended fix:** Owner/legal decision D-7. QA will only check that the site makes no "official/licensed" claim (AC-CONTENT-5) and uses no franchise logos or studio artwork. Do not reuse the Iron Man / Darth Vader collection images unless their source and rights are confirmed.

### F-07 · Medium · Brand and product source assets missing
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Expected:** Vector logo, favicon, original photos, colour/typography spec.
- **Actual:** Only raster screenshots. Cropping them yields low-resolution, JPEG-artefacted assets with baked-in badges (SALE) on cards.
- **Recommended fix:** D-9. Until supplied, use neutral placeholders that are clearly placeholders in data (and fail AC-CONTENT-3 if they reach production), not crops.

### F-08 · Medium · Delivery terms incomplete; "fast delivery" unsupported
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** Only "Islandwide Delivery (Rs. 300)" is evidenced. No timelines, regions, COD fee or free-shipping threshold. "Fast delivery" and "quick dispatch" are claims without numbers.
- **Recommended fix:** D-4. Cart shows the confirmed rate or "delivery cost confirmed on WhatsApp" (AC-CART-6). No time promises.

### F-09 · Medium · Legacy integrations unrecoverable
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** Stripe (+Google Pay, Link), FluentSMTP, CusRev and Trustpilot are evidenced only visually or by claim. No keys, webhooks, plugin settings or account ownership info were recovered.
- **Recommended fix:** Out of MVP scope. Any later re-introduction needs server-side secrets via environment config, never committed and never behind `NEXT_PUBLIC_`/`VITE_` (AC-SEC-1). It should be a separate reviewed change.

### F-10 · Medium · Policy page content not recovered
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** Footer links exist (E-2), but no text survives. Checkout asserted agreement to T&C and Privacy Policy (E-4).
- **Recommended fix:** D-5. Do not generate legal text. Omit the links until supplied (AC-CONTENT-4).

### F-11 · Medium · Single order channel depends on an unconfirmed phone number
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** `+94 70 300 9064` is consistent across E-1/E-3 but was last evidenced in April 2026. The brief's alternate contact `info@honeycomb3d.store` has **no MX records** in the domain's DNS (E-8), so it should be assumed **not to receive mail** until a test message is delivered.
- **Recommended fix:** D-2. Keep the number in one config value (AC-WA-3). Run the harness with `WHATSAPP_NUMBER=<confirmed>`. Do not show the email until a test message to it has been received. `f801d31` already keeps both disabled (`whatsappNumber: null`, `whatsappVerified: false`).

### F-12 · Medium · Navigation taxonomy doesn't match catalog
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** "Shop by Universe: Anime / Superheroes / Movies & TV". Superheroes has no product in §3. Movies & TV is evidenced only for Night Fury. Filters built on these would produce an empty collection.
- **Recommended fix:** Derive filters from the categories actually present in the data. Hide empty ones, or show the AC-CAT-2 empty state.

### F-13 · Low · Naming and currency-format inconsistencies
- **Type:** Inspection. **Reviewed commit:** reference `c78e12f`.
- **Actual:** Franchise suffix used on 5/7 names ("(Naruto)", "(Big Hero 6)") but not on the Fury keychains. "Keychain" vs breadcrumb "Key Chains". Currency shown as "රු" in prices and "Rs." in the shipping label.
- **Recommended fix:** One naming convention and one currency format (AC-DATA-3), decided with D-3.

### F-14 · Low · Old design has likely contrast failures
- **Type:** Inspection of screenshots (not measured with a tool). **Reviewed commit:** reference `c78e12f`.
- **Actual:** Small grey strikethrough compare-at prices on near-black, small orange text and dim nav links (E-1 header) look below 4.5:1.
- **Recommended fix:** If the new design reuses the palette, verify AC-A11Y-8 with measured contrast ratios.

### F-15 · Info · Better recovery sources may exist
- **Type:** Inspection plus a read-only account check (E-8). The domain is safe until 2027-03-31 with auto-renew on. Its apex still aliases to `ingress-cinna.easywp.com`. That means either the EasyWP site still exists, or DNS was left pointing at a cancelled instance; this could not be fetched from here. The best sources are, in order: EasyWP dashboard backup / WooCommerce DB, WooCommerce product CSV export, `wp-content/uploads`, the Baserow product table, then a web archive.
- **Recommended fix:** The owner opens the EasyWP dashboard (or asks Namecheap support) **before** any DNS change, because re-pointing the apex to a new host could cut access to a recoverable site. This matches the brief's outstanding task 3. Do not change DNS until a backup is secured.

### F-16 · Info · Ops data contains cost/profit fields
- **Type:** Inspection. **Reviewed commit:** ops `a0cfadb`.
- **Actual:** The ops README says Products hold cost, and order items hold profit.
- **Recommended fix:** If the storefront ever reads from Baserow, use a read-only view or token limited to public fields, server-side only. Cost/profit must never reach the client bundle.
- **Update 2026-10-11:** the same applies to the Airtable base (E-9). It also holds cost, supplier and finance tables. Any future sync must use a token scoped to the Products table's public fields, server-side only.

### F-17 · Medium · Inspection (data) · Baymax and Kurama SKUs are swapped between Airtable and Drive
- **Evidence:**
  - **Airtable (E-9):** `HNYCMB503` is BayMax (`recIC7e7QDrEe31ac`, asset field "HNYCMB503 BayMax"). `HNYCMB504` is Kurama (`recIEe7aBzmZkPiIQ`, "HNYCMB504 Kurama").
  - **Drive:** the folder `HNYCMB503 Kurama` exists in both accounts: `1a9HcP0gS5kuGiPzY0o6Dt1A2jePDzZFw`, and `1AV2PhFDGihCTDXph5SRToMQgZ4AwObJj` (business account, created 2026-04-01). The Baymax folder is `Baymax HNYCMB504` (`1o4lJ9_zSS8dx5DR2uCl2spHV0gpNXfFI`), and its images are named `HNYCMB504 (n).png`.
  - **GPT:** `docs/ASSET-PROVENANCE.md` at `8d13b91` follows Drive (BAYMAX→504, KURAMA→503; Verified in `ASSET-AUDIT.md` §2).
  - **Other SKUs:** 501, 502, 508, 509 and 511 agree everywhere.
- **Expected:** One SKU per product across ops data, asset folders and the storefront.
- **Actual:** Today the storefront uses `HC-BAYMAX` and `HC-KURAMA` as IDs, so it shows neither number. The WhatsApp message does include the product ID (`src/domain.mjs`: `- ${p.name} [${p.id}] x …`).
- **Impact:** If GPT switches IDs to the Airtable SKUs before this is settled, Baymax and Kurama order requests could be logged against each other's Airtable record.
- **Fix:**
  1. The owner settles D-11.
  2. The owner corrects Airtable or renames the Drive folders.
  3. Only then should GPT use the SKUs as IDs.

### F-18 · High (decision) · Products are printed from third-party MakerWorld models; licence for sale unconfirmed
- **Evidence (E-9, `Model/Source Link`):**
  - 17 of the 18 products link to a MakerWorld model page.
  - Storefront products:
    - Night Fury: `makerworld.com/en/models/2465337-articulated-toothless-dragon-keychain`
    - Light Fury: `…/2495866-articulated-light-fury-dragon-keychain`
    - Kurama: `…/19101-nine-tailed-demon-fox`
    - Classic Kunai: `…/672914-kunai-fidget-spinner`
    - Minato: `…/814550-minato-kunai-fidget-spinner`
    - Hidden Leaf: `…/2282457-akatsuki-headband-keychains`
  - Baymax links to a 3MF file in the business Drive (`Baymax.3mf`, `1SfuSyhm_kCdzrSHToEen4813earSuITj`), with no designer recorded.
- **Expected:** Each model's licence allows commercial sale of prints, or the designer has given permission, and this is recorded.
- **Actual:** Not checked. Licence terms are set per model on each page. QA did not open the pages.
- **Fix:** Owner decision D-10. Add a licence or permission column next to the Airtable source link. This is **separate** from the franchise-character question (F-06, D-7): a model can be licensed for sale and still depict a character the seller has no rights to.

### F-19 · Info · Airtable lists 11 Active products that the storefront doesn't have
- **Evidence:** §3.2 lists the 11 extra products (E-9).
- **Note:**
  - "Active" in Airtable does not mean ready to list. Each extra product would still need a real photo, a description and the D-7/D-10 checks.
  - Several are franchise characters: Spider-Man, Iron Man, Star Wars, Baby Yoda, Kpop Demon Hunters and Bridgerton.
- **Fix:** The owner decides the launch scope. The 7-product scope stays valid until then.

### F-20 · Low · Ops-data quality issues seen while reading Airtable
- **Filament stock:** 9 of the 16 filament rows have no stock value or status, including Black, White (`FIL-008`) and Orange PLA.
- **Colour codes don't match names:**
  - "Blue" is `#dcb3b7`, which is pink.
  - "Yellow" is `#dbcea1`, which is beige.
  - One White is `##f6f8f9`, with a double `#`; the row's own note flags it.
- **Duplicate rows:** White PLA appears twice (`FIL-002`, `FIL-008`).
- **No product-to-filament mapping:** every product's Bill of Materials link is empty.
- **Shared model link:** HNYCMB505 Bridgerton Bookmark and HNYCMB506 Flexi Derpy point to the same MakerWorld link (`models/1710900`).
- **Impact:** None on the storefront today. It matters if colour swatches, availability or sourcing are ever generated from Airtable.

## 7. Implementation review: `codex/storefront-mvp`

### Run 1: 2026-10-09 · `codex/storefront-mvp` @ `f801d314663470d5d4539f594e80acc0d63418e8`

Checkpoint 1 ("Establish recovered catalog schema and honest order-request boundary", 2026-10-08).
Files: `package.json`, `package-lock.json`, `.gitignore`, `data/products.json`, `data/store.json`,
`src/domain.mjs`, `docs/BUILD-STATUS.md`, `docs/RECOVERY-AND-BUILD-BRIEF.md`.
Reviewed in a separate checkout created by `qa/scripts/review-commit.sh`. GPT's branch and checkout were not touched.
Raw output: `qa/results/f801d314663470d5d4539f594e80acc0d63418e8/`.

| Check | Result |
|---|---|
| `npm ci` | exit 0 (no dependencies) |
| `npm run check` | **exit 1**: `Cannot find module …/scripts/check.mjs` |
| `npm test` | exit 0, but **0 tests** ran (`tests/` does not exist) |
| `npm run build` | **exit 1**: `Cannot find module …/scripts/build.mjs` |
| lint / typecheck / test:e2e | not defined |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `qa/scripts/secret-scan.sh` | no HIGH findings |
| QA domain contract tests (`qa/domain/`) | **10 pass, 3 fail** (I-3, I-4, I-5) |
| Browser smoke (`qa/e2e/`) | **Not run**: no pages or server exist at this commit |

**Verified as good at this commit (tested):** every price is `null`, so nothing is invented. No stock,
sold, sale or review fields exist. WhatsApp is disabled until `whatsappVerified` and a digits-only
number are set. Cart arithmetic is done in whole cents. Quantities are capped at 20 and invalid lines
are dropped. Corrupt or throwing `localStorage` yields an empty cart. `escapeHtml` is correct. The
order message carries the product name, `[ID]`, quantity and subtotal, and says *"This is an order
request, not a confirmed purchase."* Live mode hides unapproved products. These match the brief's
acceptance checks and AC-CONTENT-1/2, AC-WA-1/3/4 and AC-FAIL-2.

#### I-1 · High · Tested failure · `build` and `check` scripts are declared but missing
- **Reviewed commit:** `f801d31`.
- **Reproduction:** `npm ci && npm run build`; `npm run check`.
- **Expected:** Both exit 0, or are not declared until they exist (AC-BUILD-1).
- **Actual:** Both exit 1 with `MODULE_NOT_FOUND` for `scripts/build.mjs` and `scripts/check.mjs`. `dev` and `start` also reference the missing `scripts/serve.mjs` (by inspection).
- **Evidence:** `qa/results/f801d31…/build.log`, `check.log`.
- **Recommended fix:** Add the scripts at the next checkpoint (BUILD-STATUS says pages come next). Until then, don't commit `package.json` entries that can't run, so a red build means a real regression.

#### I-2 · Medium · Tested failure · `npm test` is green with zero tests
- **Reviewed commit:** `f801d31`.
- **Reproduction:** `npm test`.
- **Expected:** Domain logic is covered by tests, and an empty test run fails.
- **Actual:** `node --test tests/*.test.mjs` prints `1..0 … # pass 0` and exits 0. `tests/` doesn't exist.
- **Evidence:** `qa/results/f801d31…/test.log`.
- **Recommended fix:** Add `tests/domain.test.mjs`, which may reuse cases from `qa/domain/domain-contract.test.mjs`. Make `check` fail when no test files are found.

#### I-3 · Medium · Tested failure · Category filter splits keychains across two categories
- **Reviewed commit:** `f801d31`.
- **Reproduction:** `filterProducts(products, '', 'Keychains')`.
- **Expected:** The category filter returns all 3 keychains (AC-CAT-2).
- **Actual:** It returns only *Hidden Leaf Keychain*. *Night Fury Keychain* and *Light Fury Keychain* have category `Dragons`, so "Keychains" sits in tags only. A shopper filtering by Keychains misses 2 of 3.
- **Evidence:** QA contract test 3: `keychains are split across categories ["Keychains","Dragons"]`.
- **Recommended fix:** Use two facets: a product type (`Keychain`, `Figure`, `Prop`) and a collection/franchise (`Naruto`, `How to Train Your Dragon`, `Big Hero 6`, or the brief's `Dragons`). Filter on both. The final taxonomy is still owner decision D-3.

#### I-4 · Low · Tested failure · An all-unpriced handoff shows "Priced items subtotal: LKR 0.00"
- **Reviewed commit:** `f801d31`.
- **Reproduction:** `orderMessage([{id:'HC-KURAMA',quantity:2}], products)` with the shipped data, where every price is null.
- **Expected:** No zero amount when nothing is priced (AC-WA-2).
- **Actual:** The message contains `Priced items subtotal: LKR 0.00. Other item prices are pending; this is not the full total.` A customer or staff member can read LKR 0.00 as a price.
- **Evidence:** QA contract test 9.
- **Recommended fix:** When `knownSubtotal === 0 && unpriced`, emit "Prices to be confirmed by HoneyComb 3D" and no amount. Keep the current wording for mixed carts.

#### I-5 · Low · Tested failure · Price validation rejects valid amounts, with a misleading message
- **Reviewed commit:** `f801d31`.
- **Reproduction:** `validateData([{...products[0], priceLkr: 19.99}], store)`.
- **Expected:** Any positive LKR amount with ≤ 2 decimals is accepted, or the schema states "whole rupees only".
- **Actual:** 19.99 is rejected but 10.15 is accepted, because `Number.isSafeInteger(19.99*100)` hits float error (`1998.9999…`). The error text says "LKR amount in cents", but the field holds rupees.
- **Evidence:** QA contract test 11.
- **Recommended fix:** If LKR prices are whole rupees, require `Number.isSafeInteger(priceLkr)` with message "whole rupees". Otherwise check `Math.abs(Math.round(v*100) - v*100) < 1e-6`.

#### I-6 · Medium · Inspection (reproduced at function level) · Cart can keep products hidden in live mode
- **Reviewed commit:** `f801d31`.
- **Reproduction:** Live config (`mode:'live'`, verified contact). Then `normalizeCart([{id:'HC-KUNAI',quantity:1}], products)` with the full catalog.
- **Expected:** An unapproved product, invisible in live mode, can't stay in a cart or reach the WhatsApp message (AC-DATA-2, AC-CART-7).
- **Actual:** It is kept, because `normalizeCart`/`cartSummary`/`orderMessage` trust whatever product list the caller passes. Whether the UI passes `visibleProducts()` can't be checked yet (no UI).
- **Recommended fix:** Pass `visibleProducts(products, store)` into every cart function, or filter `approved` inside them when `store.mode === 'live'`. Add a test. QA will re-check at the UI checkpoint.

#### I-7 · Low · Inspection · New product copy is attributed to recovered sources
- **Reviewed commit:** `f801d31`.
- **Actual:** Descriptions such as "Ask about available sizes, colours and finishing options" and "A decorative Minato-inspired kunai prop" are newly written. Each `source` says "Recovery brief; April storefront screenshots…", but neither contains that text. The brief calls one item "Minato spinner", while the data says "Minato Kunai" (the screenshots also say Minato Kunai). The copy also implies colour/size options that no source evidences.
- **Expected:** Provenance distinguishes recovered facts from drafted copy (AC-DATA-1, AC-PDP-2).
- **Recommended fix:** Add `copyStatus: "draft-needs-owner-approval"`, or limit `source` to identity facts. Keep `approved: false` until the owner signs off the wording.

#### I-8 · Info · Branch naming
- `docs/BUILD-STATUS.md` correctly notes that QA is on `claude/wizardly-mendel-73bkuw`, not `claude/recovery-qa`. That is this session's assigned branch. See F-01.

### Run 2: 2026-10-09 · `codex/storefront-mvp` @ `5d1c6a45686bf9df6b5c0670fb1541e7e8c0c7c2`

Checkpoint 2: pages, request cart, custom enquiry, CI workflow, `vercel.json`.
- `review-commit.sh` (documented order): install ✔, test ✔ (7), build ✔ (13 pages), check ✔, audit ✔ (0), secret scan ✔.
  *QA tooling note:* my first pass reported `check` exit 1, because my script ran `check` before `build`. That was a
  QA bug, fixed in `qa/scripts/review-commit.sh`; it was not an app defect. A separate QA bug made one pass review the wrong
  commit when given an abbreviated SHA. That is fixed too, and the script now refuses a mismatched SHA.
- QA domain contract tests: 11 pass, 2 fail (I-3, I-5 still open; I-4 fixed).
- Browser smoke (Chromium, `scripts/serve.mjs` on the build output): preview 88 PASS / 0 FAIL. Live fixture 89 PASS / 0 FAIL.
  The first harness run showed 4 FAIL, all from **QA harness heuristics**: it expected a numeric price where
  "Price on enquiry" is correct, and an "Add to cart" label where "Add to request cart" is used. The harness is fixed. Not app defects.
- GitHub Actions on this commit: **failed** in GPT's own Chromium test (ambiguous category label, per BUILD-STATUS). Fixed in `09b5cd1`.

### Run 3: 2026-10-09 · `codex/storefront-mvp` @ `2260c7f913a340914a74249cefc8f668b962160c` 

Includes `09b5cd1` ("Address Claude QA findings…"). GitHub Actions: success on both commits (runs 3–6).

| Check | Result |
|---|---|
| `npm ci` / `npm test` / `npm run build` / `npm run check` | all exit 0. 11 unit tests. 13 pages. `check` now fails if no test files exist. |
| `npm audit --omit=dev` / secret scan | 0 vulnerabilities / no HIGH findings |
| QA domain contract tests | **13 / 13 pass** |
| Browser smoke, preview (as shipped) | **88 PASS, 0 FAIL**. Screenshots and `summary.md` in `qa/results/2260c7f…/browser-preview/` |
| Browser smoke, live fixture (`QA_LIVE_FIXTURE=1`: test-only number `94000000000` and test-only prices injected by request interception; nothing sent) | **89 PASS, 0 FAIL**. The `wa.me` URL carries name, `[ID]`, qty, line and subtotal, plus "not a confirmed purchase". `rel="noopener noreferrer"`. |
| Extra browser probes (`qa/e2e/edge-probes.mjs`) | PASS: `?q=`/`?category=` injection rendered as text. Search+category restored from URL. Tampered storage clamped (999→20, unknown/`'5'` dropped). Add beyond 20 refused with a message. Notes markup escaped. Blocked `localStorage` degrades with a notice and 0 page errors. |
| Contrast (computed from `src/styles.css`) | Text 17.4:1, muted 9.4:1 (8.6:1 on panels), accent 9.6:1, button text 9.3:1, preview notice 10.9:1, price 12.7:1, form-control border 3.9:1. All meet WCAG AA. |
| Visual review (QA read the screenshots) | Home, PDP and cart on mobile and desktop: legible, no overflow. Preview banner visible. Neutral photo placeholders. No stock, sale, review or payment claims. |

Status of earlier findings at `2260c7f`:

| ID | Status | Evidence |
|---|---|---|
| I-1 build/check missing | **Fixed** | all scripts exit 0 |
| I-2 zero tests green | **Fixed** | 11 tests; `check` asserts test files exist |
| I-3 keychain category split | **Fixed** | contract test 3; browser filter Keychains → 3 visible |
| I-4 `LKR 0.00` subtotal | **Fixed** | contract test 9; cart shows "Quote required for all items" |
| I-5 19.99 rejected | **Fixed** | contract test 11 |
| I-6 hidden products in live cart | **Fixed (UI)** | `app.mjs` passes `visibleProducts()`; GPT test + live-fixture run |
| I-7 copy provenance | **Fixed** | `copyStatus: "draft-needs-owner-approval"`, `approved: false` |

New findings at `2260c7f` (all Low/Info; none block the preview):

#### I-9 · Low · Tested · Every product card has two links to the same page
- **Reproduction:** `/shop/`. Count `[data-product-card] a`.
- **Expected:** One focusable link per card (AC-A11Y-5 tab order, less screen-reader repetition).
- **Actual:** 14 links for 7 cards: an image link with a visually hidden name, plus the heading link. Keyboard users tab twice per product, and screen readers announce each name twice.
- **Recommended fix:** Give the image link `tabindex="-1"` and `aria-hidden="true"`, or wrap the card in a single link.

#### I-10 · Low · Inspection (seen in screenshot) · WhatsApp wording shown when WhatsApp is off
- **Reproduction:** Preview mode. Add an item, then open `/cart/`.
- **Actual:** Under "Online requests are not open yet", the page still says "Opening WhatsApp does not send the message. Review and send it yourself…", although no WhatsApp button exists. Same on `/custom/` after preview.
- **Recommended fix:** In `handoff()`, render that sentence only when `url` is set.

#### I-11 · Info · Inspection · Public data file carries internal workflow fields
- `dist/data/products.json` publishes `approved` and `copyStatus: "draft-needs-owner-approval"`. The build comment says internal approval flags are not storefront payloads. `approved` is needed by the client's live-mode filter, so the fix is the comment, plus dropping `copyStatus` from the public payload.

#### I-12 · Info · Not built yet: contact page
- The brief lists a contact page. It is reasonably deferred until D-2 confirms a working contact; `/custom/` covers enquiries meanwhile.

#### Accessibility audit (axe-core 4.10.3) at `2260c7f`
- **Command:** `AXE_PATH=… BASE_URL=… node qa/e2e/axe-audit.mjs`, using WCAG 2.0/2.1/2.2 A+AA plus best-practice rules. It covers 7 pages and 3 interactive states (filled cart, custom-enquiry preview, empty search) at desktop and mobile: 20 audits. Results are in `qa/results/2260c7f…/axe/axe-results.json`.
- **Result: 0 serious or critical violations.** Two moderate best-practice issues: I-13 and I-14.
- **Contrast items axe marked "needs review"**, because of gradients and overlays: placeholder text 8.1:1 and textarea text 14.6:1 (computed). The hero artwork is `aria-hidden` decoration, so it is exempt. **Pass.**
- **Side observation:** the site's CSP (`script-src 'self'`) blocked axe injection until the audit browser was told to bypass CSP. That is positive evidence the CSP is enforced.

#### I-13 · Low · Tested (axe `region`) · Preview banner sits outside any landmark
- **Reproduction:** Any page in preview mode, axe-core.
- **Actual:** `.preview-notice` is outside `<header>` and `<main>`, so screen-reader users navigating by landmark can skip the "Orders are not open yet" notice.
- **Recommended fix:** Move it inside `<header>`, or make it `<aside aria-label="Store preview notice">`.

#### I-14 · Low · Tested (axe `heading-order`) · Shop page jumps from h1 to h3
- **Reproduction:** `/shop/`, axe-core.
- **Actual:** Product card titles are `h3` with no `h2` between them and the page `h1`.
- **Recommended fix:** Use `h2` for card titles on `/shop/`, or add a visually hidden `<h2>Designs</h2>` before the grid.

**Not verified at `2260c7f`:** real-phone WhatsApp opening (AC-WA-6). Firefox and Safari. A screen-reader pass.
Deployed headers: `vercel.json` sets CSP, nosniff and Referrer-Policy, but nothing is deployed. Only the local `serve.mjs` headers were tested.


### Run 4: 2026-10-09 · `codex/storefront-mvp` @ `8d13b910bc4ff156a2ffd049cd4cc381f19828ad` (current head)

Commits since Run 3: `8255a96` (branding and 7 product images), `94291ad` (QA fixes), `0f8b5fb`, `8532af3` (browser-compatible logo), `8d13b91`.
Reviewed in a separate checkout. Asset provenance was checked against the owner's Drive; full detail is in **[`ASSET-AUDIT.md`](ASSET-AUDIT.md)**.

| Check | Result |
|---|---|
| `npm ci` / `test` / `build` / `check` / `npm audit` / secret scan | all exit 0 |
| QA domain contract tests | 13/13 |
| Browser smoke: preview / live fixture | 88/88 PASS / 89/89 PASS |
| Edge probes | all PASS (after making my probe heading-level agnostic; GPT changed card titles from `h3`) |
| axe-core, 20 audits | **0 violations** (I-13 and I-14 fixed) |
| Image audit (`qa/e2e/image-audit.mjs`, 9 pages × mobile DPR 3 / desktop DPR 1) | Decode, orientation, crops and alt text: PASS. Size and weight: **FAIL** (I-16, I-17) |
| Imported assets vs Drive (SHA-256) | **8/8 byte-identical** to the cited Drive file IDs. The logo crop is pixel-identical. |
| Provenance metadata | **4/7 product images carry Google Generative AI C2PA manifests + SynthID** (I-15) |

Earlier findings re-tested at `8d13b91`:

| ID | Status |
|---|---|
| I-9 duplicate card links | **Fixed**: the image link has `tabindex="-1"` and `aria-hidden`; 7 tab stops for 7 cards |
| I-10 WhatsApp wording when off | **Fixed**: the sentence renders only when a WhatsApp URL exists |
| I-11 internal fields in public JSON | **Fixed**: `copyStatus` and `imageSource` are stripped from `dist/data/products.json` |
| I-12 contact page | Still deferred (Info) |
| I-13 banner outside landmark / I-14 heading order | **Fixed** (axe: 0 violations) |

#### I-15 · High · Tested (metadata) + Visual · Four "product photographs" are Google-AI-generated images
- **Reviewed commit:** `8d13b91`.
- **Reproduction:** Scan `public/assets/{kurama,classic-kunai,minato-kunai,light-fury}.jpg` for `c2pa.claim`, `Created by Google Generative AI` and `SynthID` (see `ASSET-AUDIT.md` §1). Compare `classic-kunai.jpg` with Drive `RAV_4322.jpg` (`1mx3YRM6o4CrGZtIl6TX2ZqnG8cacFDQo`).
- **Expected:** The brief says "Use the user's original product photos. Preserve shape, color, proportions and visible 3D-print texture. Do not generate substitute product images." Provenance should state when an image is generated.
- **Actual:** All four carry signed C2PA manifests ("Created by Google Generative AI", IPTC `trainedAlgorithmicMedia`, "Applied imperceptible SynthID watermark"); `kurama.jpg` has 4 chained generations. Visual comparison shows backgrounds replaced, a hand regenerated (Minato), handle engraving added, and print layer lines smoothed. GPT's commit `8255a96` calls them "seven product photographs", and `ASSET-PROVENANCE.md` does not mention AI. GPT did not generate them; they were already AI outputs in Drive.
- **Evidence:** `ASSET-AUDIT.md` §2–3; contact sheets in the QA scratch directory (not committed).
- **Recommended fix:**
  1. Replace Classic Kunai with the real `RAV_4322.jpg`, after the owner copies it into the HoneyComb folder.
  2. Replace Minato with the real photo of the variant that is actually sold.
  3. Kurama: the real photo `1.png` exists in the business account; Light Fury: use the real `Variation 1 (2).jpg` (see the update below and `ASSET-AUDIT.md` §3).
  4. Add an "AI-generated: yes/no" field to `ASSET-PROVENANCE.md`.
  - **Owner decision:** if the owner explicitly accepts AI imagery, label it, because the embedded C2PA/SynthID is publicly detectable.

#### I-16 · High (performance) · Tested · 4.7–7.9 MB of images per page, no responsive variants
- **Reviewed commit:** `8d13b91`.
- **Reproduction:** `BASE_URL=… node qa/e2e/image-audit.mjs`.
- **Expected:** Images sized to their slot (AC-IMG-2/3), at most ~1.5 MB of images per page on mobile.
- **Actual:**
  - `/shop/` loads 7.87 MB of images on both mobile and desktop; PDPs load 4.65–6.75 MB.
  - Cards render at ~282 CSS px but receive `night-fury.jpg` (4000×3000, 2.41 MB) and `baymax.png` (1536×2048 PNG, 3.23 MB).
  - There is no `srcset`/`sizes` and no WebP/AVIF.
- **Evidence:** `qa/results/8d13b91…/images/summary.md` ("Image bytes per page").
- **Recommended fix:** Generate resized derivatives at build time (e.g. 480/960/1440 px JPEG or WebP, with EXIF orientation applied and metadata stripped). Serve them with `srcset` and `sizes`. Keep the originals out of `dist/`, and record each derivative's source SHA-256 and parameters in `ASSET-PROVENANCE.md`. Any new image dependency is a GPT decision; Node-only options are possible.

#### I-17 · Medium · Tested · 16.6-megapixel logo for a 220×66 slot on every page
- **Reproduction:** Image audit, any page.
- **Actual:** `honeycomb-logo-web.png` is 7435×2229 (253 KB transferred, ~66 MB decoded RGBA), displayed at 220×66 CSS px: 34× the needed resolution at DPR 1 and 11× at DPR 3. The same file appears in the header and footer. Chromium already failed to decode the 69 MP original in GPT's CI (`ASSET-PROVENANCE.md`), so low-memory phones are at risk with this one too.
- **Recommended fix:** Use the **vector** brand source (`HONEYCOMB Logo in White Background.pdf` `1D_VZuA8Lshe78K_Gz1qBmpYKS9tuLG8s`, 22 KB, or the `.ai`) exported as SVG, or a 660×198 PNG. Record the derivation.

#### I-18 · Low · Inspection · `ASSET-PROVENANCE.md` source titles don't match Drive
- Six entries append `.jpg` to titles that end in `.jpeg` on Drive. For example, the record says `Pro-1_202604130244.jpeg.jpg`, but the Drive title is `Pro-1_202604130244.jpeg`. The Light Fury title has two spaces (`Product Photo  (5).jpeg`). The IDs are correct, so this is a cosmetic accuracy fix.

#### I-19 · Low · Visual · Catalogue imagery is inconsistent and two images under-represent the product
- **Actual:** Dark AI studio renders sit next to real grass-mat and blue-mat phone photos. In `hidden-leaf.jpg` (960×1280) the keychain occupies a small part of the frame. `night-fury.jpg` shows a batch of about 10 units for a single-unit listing.
- **Recommended fix:** Use the consistent light-grey professional `RAV_*` shoot where available, and a cropped single unit where possible (`ASSET-AUDIT.md` §3).

#### I-20 · Info · `width`/`height` attributes are 640×640 for 3:4 images
- No layout shift, because the CSS box has a fixed `aspect-ratio` with `object-fit: contain`. Matching attributes would still help if the CSS changes.

**Not verified at `8d13b91`:** real-device image decode on low-memory phones. A throttled-network LCP. Firefox and Safari.

**Update (second asset pass, same day):** C2PA is now cryptographically validated: claim signatures and data hashes are valid, issuer Google LLC, and the only code is `signingCredential.untrusted` (trust anchor not configured). **Real photos were found for all 7 products**, including Kurama (business-account `1.png`, with the background removed in Canva) and Light Fury (`Variation 1 (2)`). I-15's fix is therefore fully actionable once the owner copies the originals into the HoneyComb folder. See `ASSET-AUDIT.md` §3 and `qa/asset-recommendations.json`.

**Update 2026-10-11 (owner, §5a):**
- The recommended photos are approved.
- Minato will use the tan-handle, black-blade photo `Copy of RAV_4468.jpg`, cropped. The suggested crop box is in `ASSET-AUDIT.md` §3.
- The current Minato alt text ("…with a white handle held in a hand") must change with the image.
- I-15 is no longer waiting on an owner choice. It still needs:
  - the originals copied into the HoneyComb folder;
  - GPT's change;
  - a QA re-run of `image-provenance.py` on the new outputs.

### Run 5: 2026-10-13 · `codex/storefront-mvp` @ `acca67f326a2036d527a1ffef5a727dcc3ca2d7d` (current head)

Commits since `8d13b91`:
- `40d0f1e`: prices and photos.
- `692945e`: test fixtures and docs.
- `838d0e1`: image derivatives, committed by `github-actions[bot]`.
- `acca67f`: CI returned to read-only.

GPT reported that items 1–8 of the §7b handoff are done. QA checked each claim independently in a separate checkout. Results are in `qa/results/acca67f…/`.

| Check | Result |
|---|---|
| `review-commit.sh` | Install, test, build, check, `npm audit --omit=dev --audit-level=high` and secret scan all exit 0. lint, typecheck and test:e2e are not defined. |
| Domain contract tests | 13/13 |
| Browser smoke, preview | 4 runs. Runs 2–4: 88/88 PASS. Run 1: 87 PASS and 1 FAIL (`js-errors-home@mobile`, console "Failed to load resource: 404"). The harness did not record the URL at the time; see I-21. |
| Browser smoke, live fixture | 89/89 PASS, after a QA fixture fix (below). The WhatsApp handoff has the number, item, quantity and total, and `rel="noopener noreferrer"`. |
| Edge probes | All PASS |
| axe-core 4.10.3 | 0 violations at any level |
| Image audit (corrected tool) | All images decode. **Image bytes per page:** at most **467 KB** (Minato page, mobile); home 428 KB; shop 374 KB. At `8d13b91` this was 4.65–7.87 MB. The largest file is 251 KB (`minato-kunai-1440.webp`). The logo is 660×198 and 42.7 KB. **4 FAIL:** the Minato image is oversampled 3.1–4.3× (I-22). |
| Provenance | **No** C2PA, "Google Generative AI" or SynthID marker in any served image or committed source. **Sources:** the 6 committed sources in `assets/photo-sources/` are **pixel-identical** to the Drive originals QA hashed on 2026-10-09. Only metadata was stripped, and GPT records both hashes (`sourceSha256`, `inputSha256`). **Derivatives:** all 16 records in `assets/derivatives.json` match their files (SHA-256, bytes, size). **Re-derivation:** rebuilding each 960 px image from the committed source and recorded crop box matches GPT's file at 34–39 dB PSNR. That is what WebP re-encoding of the same crop and resize gives, so there were no other edits. **Crops:** the Minato crop box is exactly QA's recommendation, and the Hidden Leaf crop shows one whole plate (Visual). |
| Catalogue data | All 7 prices equal Airtable (§3.2), and each product records its Airtable record in `priceSource`. No compare-at or sale prices. All 7 have `availability: unconfirmed` and `approved: false`. IDs are unchanged. The Airtable IDs do **not** reach `dist/` (searched). The Minato alt text now describes the tan handle. |
| Placeholders | Kurama and Classic Kunai have `image: null` and show "Original photo coming soon" (Visual). The owner's copies were still missing from Drive on 2026-10-13: a title search found no `RAV_4322` or `1.png` created since 2026-10-10. |
| CI on `acca67f` | PR #2 has two `verify` check runs, both successful (03:21 UTC). |

**Status of earlier findings at `acca67f`:**
- **I-15 (High) → Low, mostly fixed.**
  - All 4 AI images are gone from the repo and the site.
  - Minato and Light Fury now use the approved real photos.
  - Kurama and Classic Kunai show an honest placeholder until the owner copies `RAV_4322.jpg` and `1.png` into the HoneyComb folder. It closes when those two photos are in.
- **I-16 (High): fixed.**
- **I-17 (Medium): fixed.**
- **I-18 (Low): fixed.** No `.jpeg.jpg` titles are left, and the removed AI files are listed as "Google AI; removed".
- **I-19 (Low): fixed** for the 5 products with photos: consistent real photos, a single-unit Night Fury and a single-plate Hidden Leaf.
- **I-20 (Info): fixed.** No width/height ratio mismatches remain.

#### I-21 · Low · Tested · No favicon, so browsers get a 404 for `/favicon.ico`
- **Reproduction:** `curl -I http://127.0.0.1:4173/favicon.ico` returns 404, and no page has `<link rel="icon">`.
- **Impact:** a 404 and a console error in each new browser session. It is the only same-origin 404 QA could find, and the most likely cause of the one intermittent smoke failure above. That is **not proven**: 72 further targeted page loads and 3 full runs did not reproduce it.
- **Fix:** add a small favicon made from the brand symbol (`HONEYCOMB Symbol.pdf` `1AOoBNTsdAzj_getImty-054LJWxjzfFq`, or `HC_Symbol-1.png`), and record it in `ASSET-PROVENANCE.md`.

#### I-22 · Low · Tested · The tall Minato image is oversampled 3.1–4.3×
- **Reproduction:** `qa/e2e/image-audit.mjs` (corrected version).
- **Actual:**
  - The Minato images are 0.45:1. In the square `object-fit: contain` boxes their height is what limits them, but `srcset` picks a file by the box *width*.
  - The shop at mobile DPR 3 loads `minato-kunai-960.webp` (960×2151) for a 167 px box: 4.3×.
  - The product page loads the 1440 file: 3.1×.
  - The cost is small, about 70–160 KB extra per page, and every page is still far under 1.5 MB.
- **Fix:** give portrait images a `sizes` value scaled by their aspect ratio (box width × 0.45 for the Minato), or add height-based widths for tall images.

#### I-23 · Info · Inspection · CI briefly had write access while running third-party code
- **What happened:**
  - From `692945e` to `acca67f`, the `verify` job had `contents: write`.
  - With that token it ran `npm ci`, installed Playwright and ran QA scripts fetched from `claude/recovery-qa`.
  - It then pushed `838d0e1` as `github-actions[bot]`.
  - `acca67f` returned the job to `contents: read`.
- **Now:** QA verified the bot-generated content independently (Provenance row above), so nothing is wrong at `acca67f`.
- **Recommendation:** don't give a job that runs installed packages a write token again. Generate derivatives locally, or in a separate job that runs no third-party code.
- **QA scripts pinned in GPT's CI:** GPT's CI pins two QA scripts at `aedc1e4`.
  - At that pin, `image-audit.mjs` under-reports oversampling for `srcset` images. This was a QA bug, fixed in the commit that records this run.
  - At that pin, `image-provenance.py` always exits 0. It now exits 1 on AI markers. Because GPT strips metadata, though, the scan can't see markers on stripped files anyway. Provenance rests on the source-hash chain QA verified.
  - If GPT re-pins to the new QA commit, its CI will fail on I-22 until the Minato `sizes` are fixed.

**QA tooling fixes in this run.** These were QA bugs, not app defects.
1. **Live fixture (`storefront-smoke.mjs`):** it gave products without a photo a stand-in image.
   - Since `acca67f`, the app rejects a photo that has no matching responsive variant. So the whole live data set failed validation and the add buttons stayed disabled; the app correctly failed closed.
   - The fixture now approves only products that have a real photo, as GPT's own fixture does.
2. **Console errors (`storefront-smoke.mjs`):** it now records the URL of each console error.
3. **Oversampling (`image-audit.mjs`):** it measured oversampling from `naturalWidth`, which browsers density-correct for `srcset` images. It now decodes the chosen file to get real pixels. Earlier runs had no `srcset`, so their results stand.
4. **Provenance gate (`image-provenance.py`):** it now exits 1 when any file carries generative-AI markers.

GPT reported a peak mobile image transfer of 424 KB. QA measured 428 KB on the home page and 467 KB on the Minato product page (mobile, DPR 3). Both are far under the limit; the difference is probably which pages were measured.

### Run 6: 2026-10-13 · `codex/storefront-mvp` @ `948dff5f6e37e6f07100a554fb8b49eb64aa846e` (current head)

Commits since `acca67f`:
- `d2a4a7b`, `16763db`: a one-off, write-enabled asset workflow (see I-23).
- `12354a5`: the favicon and two smaller Minato images, pushed by that workflow.
- `ef2774a`: portrait `sizes`, the favicon link, the QA pin moved to `97780b0`, and the one-off workflow deleted.
- `5196210`, `948dff5`: tests and docs.

GPT reported I-21 and I-22 fixed. QA checked this independently in a separate checkout. Results are in `qa/results/948dff5…/`.

| Check | Result |
|---|---|
| `review-commit.sh` | Install, test, build, check, `npm audit --omit=dev --audit-level=high` and secret scan all exit 0. |
| Domain contract tests | 13/13 |
| Browser smoke | Preview: **88/88 in all 3 runs** (the Run 5 console 404 did not recur). Live fixture: 89/89. |
| Edge probes | All PASS |
| axe-core 4.10.3 | 0 violations at any level |
| Image audit | **18 PASS, 0 FAIL** (58 INFO letterbox notes). **Image bytes per page:** at most **281 KB** (home, mobile). The Minato product page dropped from 467 KB to **173 KB** at mobile DPR 3, counting the logo and related-product images; GPT's 130 KB likely counts differently. **Sizing:** the worst oversampling is 3.0× (logo, desktop), and nothing is upscaled; the lowest ratio is 1.02×, the Minato on its product page. |
| Provenance | No AI markers in any served image, the favicon or the committed sources (26 files). All 18 derivative records match their files. The 6 sources are still pixel-identical to the Drive originals. The new `minato-kunai-160/240.webp` re-derive from the recorded crop at 39.8 and 40.0 dB PSNR. No unlisted image files. |
| Favicon (I-21) | `/favicon.ico` returns 200 `image/vnd.microsoft.icon` (5,500 B), and every page links it.<br>**Source PDF:** the committed `assets/brand-sources/honeycomb-symbol.pdf` matches Drive `HONEYCOMB Symbol.pdf` (`1AOoBNTsdAzj_getImty-054LJWxjzfFq`) on byte size (14,143), header, trailer, xref offset, producer and creation date. The connector returned the file inline, so QA compared those fingerprints rather than a full SHA-256.<br>**Frames:** `favicon.json` hashes match the files. The 16/32/48 px frames match the owner's separate PNG export of the symbol (`HC_Symbol-1.png`) at 52–56 dB PSNR, so this is the brand symbol, not redrawn artwork. |
| Portrait sizing (I-22) | Portrait images now carry `sizes` scaled by their aspect ratio (Minato × 0.446, Baymax and Light Fury × 0.75). |
| CI on `948dff5` | PR #2 has two `verify` runs, both successful (18:04 UTC). `storefront.yml` is `contents: read`, and it is the only workflow. It now runs QA scripts pinned at `97780b0`. |
| Pending photos | At the time of Run 6, there was no `RAV_4322` or Kurama `1.png` copy in Drive. Both were copied in later that day; see "Owner photo copies" below. |

**Status at `948dff5`:**
- **I-21: fixed.**
- **I-22: fixed.**
- **I-15:** unchanged (Low). Kurama and Classic Kunai still show placeholders, waiting on the owner.
- **I-23 (Info): updated.** The current CI is read-only, but the favicon and Minato images were again produced by a write-enabled workflow (`prepare-run5.yml`).
  - That workflow was separate and triggered only by edits to itself. It installed Pillow and PyMuPDF (version-pinned), ran GPT's scripts and pushed `12354a5`. It was deleted in `ef2774a`.
  - It was narrower than the Run 5 job (no npm, no Playwright, no QA scripts), but it still ran installed packages with a write token.
  - `12354a5` is attributed to GPT's usual human git identity rather than the bot, so the log doesn't show it was CI-generated.
  - QA verified the generated files independently (rows above), so nothing is wrong at `948dff5`. The recommendation from Run 5 stands for next time.

#### Slow-network check on `948dff5` (2026-10-15)
`qa/e2e/throttled-perf.mjs` emulates a slow network and a 4× slower CPU with Chrome DevTools throttling, against a local server. The screen is a 390×844 phone at DPR 3. This is an **emulation, not a real device or network**. Results are in `qa/results/948dff5…/perf-throttled.json`; a second, ad hoc run gave the same picture.

| Page | Slow 4G LCP | 3G LCP | CLS (slow 4G / 3G) | Transferred |
|---|---|---|---|---|
| `/` | 0.70 s | 1.20 s | 0 / 0 | 276 KB |
| `/shop/` | 0.58 s | 1.10 s | 0 / 0 | 204 KB |
| `/products/minato-kunai/` | 0.71 s | 1.37 s | 0 / 0 | 168 KB |
| `/products/baymax-figure/` | 1.73 s | **3.30 s** | 0 / 0 | 246 KB |
| `/cart/` | 0.57 s | 1.03 s | 0 / **0.096** | 77 KB |

Every page is inside Google's "good" LCP limit (≤ 2.5 s) on slow 4G. On 3G, all but one are too. Layout shift is "good" everywhere (≤ 0.1).

#### I-24 · Info · Tested (emulated) · Product-page photo is not prioritised; Baymax page LCP is 3.3 s on emulated 3G
- **Actual:**
  - The main product photo has `loading="eager"` but no `fetchpriority="high"` and no preload. So on a slow connection it competes with the stylesheet and other images.
  - The Baymax page, which has the heaviest image of the product pages, reaches LCP at 3.30 s on emulated 3G. That is Google's "needs improvement" band (2.5–4 s).
  - The cart page shows a small layout shift on 3G (0.096, just under the 0.1 limit).
- **Fix (optional):** add `fetchpriority="high"` to the product-page photo. Optionally, give the cart's late-filled area a reserved height.

#### Owner photo copies (2026-10-13, after Run 6)
The owner copied the two remaining approved originals into the HoneyComb folder. QA downloaded each copy and hashed it.

| Product | HoneyComb copy (Drive ID) | Location | SHA-256 | Matches the approved original | AI markers |
|---|---|---|---|---|---|
| Classic Kunai | `Copy of RAV_4322.jpg` (`1PaOuVcZ82ij2vV2hq08fiFC42_w9iKua`), 4,887,510 B, 4912×7360 | `HoneyComb/Productions/Old list/Naruto-20260105T130713Z-3-001/Naruto/HNYCMB509 Kunai` | `f41368de…3c8722` | **Yes**, byte-identical to `RAV_4322.jpg` `1mx3YRM6…` | None |
| Kurama | `1.png` (`1wkBiKm7ZUMRYRpHJojCI9YPhv3ePKIXn`), 2,348,045 B, 3415×5120 | `HoneyComb/Productions/Old list/Naruto-20260105T130713Z-3-001/Naruto/HNYCMB503 Kurama` | `d33853df…f5a494` | **Yes**, byte-identical to the business-account `1.png` `1nQvOC8n…` | None (Canva export, as before) |

- **Duplicate copy:** a same-size `1.png` also sits in that folder's `Untitled design` subfolder (`1icgn6MlRI_NzuiQScFc65tN9457JqqJq`). QA did not hash it, so GPT should use the verified ID above.
- **Other files copied in the same batch:** they include the AI-generated Kurama renders (`Pro_1…5.png`) and Minato `Product Photo (n).png` files. None of them is approved, so the site must not use them.
- **What this unblocks:** GPT can replace the two placeholders (handoff §7b, item 4). I-15 closes once QA verifies that change.

## 7a. QA sign-off and launch readiness (2026-10-09, updated for head `948dff5` on 2026-10-13)

**Update for `948dff5` (2026-10-13):**
- No implementation finding is open apart from I-15's two placeholders, which wait on the owner's photos, and I-23 (Info, process only).
- **QA approval for a private or invite-only preview stands.**
- **Public launch is still not approved.** The owner items below remain.

**Update for `acca67f` (2026-10-13):**
- No High or Medium implementation finding is open. I-21 and I-22 (Low) and I-23 (Info) can ride the next change.
- The image set now follows the brief (real photos only, or an honest placeholder) and is resized.
- QA approves this build for a **private or invite-only preview**. Two products show "Original photo coming soon" until the owner copies their photos.
- **Public launch is still not approved.** The owner items below remain.

**Update for `8d13b91`:** the code itself remains sound, but **I-15 (AI product images) and I-16 (image weight) are open High findings**. The site is fine for a *private* owner review. It is **not** approved for any wider preview or launch until the image set follows the brief and is resized. I-17 (logo) should ride the same change.

**Previous sign-off (`2260c7f`): code approved for a private preview deployment.** No open Blocker, High or Medium implementation finding. Build,
tests, browser flows, failure states, security headers (local server) and an automated WCAG audit all pass. Open items
I-9, I-10, I-13, I-14 (Low) and I-11, I-12 (Info) can ride the next change.

**Public launch: NOT approved.** Every blocker is data or an owner decision; none is code. In priority order:

| # | Owner action | Unblocks | Ref |
|---|---|---|---|
| 1 | **Secure the old site before touching DNS.** Open the EasyWP dashboard or ask Namecheap support for a files/DB backup. The apex still points at EasyWP. Don't pay for reactivation until a backup is confirmed available. | Original photos, product data, policy text, prices | F-15, E-8, brief task 3 |
| 2 | **Confirm the WhatsApp number** (`94703009064`?) and who answers it. Then GPT sets `whatsappNumber` and `whatsappVerified: true`. Test on a real phone without sending an order. | Any order request | D-2, F-11, AC-WA-6 |
| 3 | ~~Choose prices~~ **Done 2026-10-11:** Airtable is the price source (§3.2). **Still to do:** settle the Baymax/Kurama SKU swap (D-11), and choose `availability` per product, with a lead time for `made-to-order` items (D-8). | Cart totals, order messages | D-3, D-8, D-11, F-17 |
| 4 | ~~Choose real product photos~~ **Done 2026-10-11** (§5a). ~~Copy the originals into the HoneyComb folder~~ **Done 2026-10-13**, and QA verified the hashes. **Still to do:** confirm the photographer, Canva and logo rights, and approve or replace the draft descriptions. | `approved: true`, live mode | D-9, F-07, I-7, I-15 |
| 4b | **Model licences:** confirm that each MakerWorld model may be printed for sale. | Permission to sell | D-10, F-18 |
| 5 | **Decide payment and delivery wording** (COD? bank transfer? courier fee, typical days). The site currently promises none, which is safe. | Quote conversations, policy pages | D-1, D-4, F-03, F-08 |
| 6 | **Provide policy text** (shipping, returns, terms). The current `/privacy/` page accurately describes the app's own data handling, but the owner should approve it. | Footer policy links | D-5, F-10 |
| 7 | **IP stance** on franchise-character products. | Catalogue scope | D-7, F-06 |
| 8 | **Email:** add MX records and test `info@honeycomb3d.store`, or keep it off the site. | Contact page (I-12) | E-8 |
| 9 | **Hosting:** pick a plan that permits commercial use. Deploy `dist/` privately first and re-run `qa/e2e/storefront-smoke.mjs` against that URL to verify the real headers and 404 status. | Launch | RUN-AND-RELEASE.md |

**Re-test procedure after the owner's data lands:** run `qa/scripts/review-commit.sh` on the new SHA, then `qa/domain/`,
`storefront-smoke.mjs` (preview and `QA_LIVE_FIXTURE=1`), `edge-probes.mjs` and `axe-audit.mjs`. Then do one manual real-phone
WhatsApp check with the confirmed number (open it, don't send) before switching `mode` to `live`.

### 7b. Handoff to GPT (2026-10-11, for `codex/storefront-mvp` after `8d13b91`)

The owner relays this to GPT. These are QA recommendations: GPT owns the code, data and dependency choices.

```
QA handoff for codex/storefront-mvp @ 8d13b91. Details are on branch claude/recovery-qa:
docs/QA-FINDINGS.md (§3.2, §5a, I-15..I-20, F-17), docs/ASSET-AUDIT.md §3,
qa/asset-recommendations.json and qa/owner-catalog-airtable.json.

Can be done now:
1. I-16 (High): build resized image copies (for example 480/960/1440 px JPEG or WebP,
   EXIF orientation applied, metadata stripped) and serve them with srcset/sizes. Keep the
   originals out of dist/. Targets: at most 500 KB per image and 1.5 MB of images per
   mobile page.
2. I-17 (Medium): export the logo as SVG from the vector PDF
   (Drive 1D_VZuA8Lshe78K_Gz1qBmpYKS9tuLG8s), or use a PNG of at most 660x198.
3. I-18 (Low): remove the extra ".jpg" from source titles in docs/ASSET-PROVENANCE.md.
4. I-20 (Info): set width/height attributes to each image's real proportions.
5. Prices, from the owner's chosen source (Airtable Products, read 2026-10-11), in LKR:
   HC-LEAF 400, HC-BAYMAX 1000, HC-KURAMA 1500, HNYCMB501 500, HC-MINATO 1000,
   HC-LIGHTFURY 500, HC-KUNAI 1000.
   Record that source on each product. Airtable has no compare-at prices, so show no sale
   or struck-through prices.
6. Keep availability "unconfirmed" and approved=false until the owner sets them. Show no
   stock counts.
7. Don't switch product IDs to Airtable SKUs yet. Airtable and Drive disagree on the
   Baymax and Kurama SKUs (F-17).
8. I-15 (High): the owner approved real photos on 2026-10-11. These are already in the
   HoneyComb folder:
   - Light Fury: "Variation 1 (2).jpg" (1pMK8OOE9bvE4WsKDRONnPk38k5HQbVaU)
   - Minato, tan handle with black blade: a crop of "Copy of RAV_4468.jpg"
     (1saPgsNnYGHltaJeXCLFe4w5pL48P4v9F). Suggested box: left 2770, top 2150,
     right 4600, bottom 6250 in the 4912x7360 frame; the left edge must stay between
     x=2756 and x=2794. Its alt text must stop saying "white handle".
   - Hidden Leaf: a crop to one plate of "Copy of RAV_4459.jpg"
     (1rW98jCTB1kwWoP0gMThUrnWitqN8-q_v)
   - Night Fury, single unit: "20260301_152139.jpg" (1w5Ulskt4b-WEdJkQLXcR52s3YucH5Rfg)
   - Baymax: keep the current file and resize it only.

After the owner copies these into the HoneyComb folder:
9. Classic Kunai: "RAV_4322.jpg". Kurama: the business-account "1.png".
   Check that each copy's SHA-256 matches qa/asset-recommendations.json.

For every image: record the source Drive ID and SHA-256, the crop box, the resize width and
the output SHA-256 in docs/ASSET-PROVENANCE.md.
```

The photographer, Canva and logo rights (`ASSET-AUDIT.md` §6) gate a **public launch**, not a private preview.

**Status 2026-10-13:** items 1–8 are done at `acca67f`, and QA verified them (Run 5). Item 9 waits on the owner copying the two photos.

**Next handoff to GPT (2026-10-13, after `acca67f`).** All of these are Low or Info and can ride one change:

```
QA Run 5 on codex/storefront-mvp @ acca67f: items 1-8 verified (docs/QA-FINDINGS.md §7 Run 5
on claude/recovery-qa). Optional follow-ups:
1. I-21 (Low): add a favicon made from the brand symbol (Drive "HONEYCOMB Symbol.pdf"
   1AOoBNTsdAzj_getImty-054LJWxjzfFq, or HC_Symbol-1.png) and record it in
   ASSET-PROVENANCE.md. /favicon.ico currently returns 404.
2. I-22 (Low): the Minato image (0.45:1) is chosen by box width but shown height-limited
   in square contain boxes, so it is 3.1-4.3x oversampled. Give portrait images a sizes
   value scaled by their aspect ratio, or add height-based widths.
3. I-23 (Info): CI is read-only again; keep write tokens away from jobs that run installed
   packages. If you re-pin the QA scripts, use the claude/recovery-qa commit that records
   Run 5: image-audit.mjs now measures real pixels for srcset images, and
   image-provenance.py exits 1 on AI markers. The re-pinned audit will fail on I-22 until
   it is fixed.
4. Item 9 from the earlier handoff, once the owner has copied RAV_4322.jpg and Kurama 1.png
   into the HoneyComb folder.
```

**Status at `948dff5`:** items 1–3 are done and verified (Run 6).

**Update 2026-10-13:** item 4 is unblocked. The owner copied both photos, and QA verified them:
- Classic Kunai: `Copy of RAV_4322.jpg`, `1PaOuVcZ82ij2vV2hq08fiFC42_w9iKua`
- Kurama: `1.png`, `1wkBiKm7ZUMRYRpHJojCI9YPhv3ePKIXn`

Both SHA-256 hashes equal the `expectedSourceSha256` values already recorded in GPT's `assets/image-sources.json`.

**2026-10-14: GPT's chat ended mid-task.** GPT's chat for item 4 hit its length limit while it was setting up a temporary workflow. QA checked the repository afterwards:
- `codex/storefront-mvp` is still at `948dff5`, with no new commits and no new branches.
- `storefront.yml` (read-only) is the only workflow.
- Nothing was half-applied.

Restart prompt for a new GPT chat (also given to the owner in chat):

```
Continue the HoneyComb 3D storefront work in RINS-Enterprises/honeycomb3d-ecommerce-system on
branch codex/storefront-mvp. The current head is 948dff5f6e37e6f07100a554fb8b49eb64aa846e.
The previous chat ended before pushing anything. QA notes are on branch claude/recovery-qa
(docs/QA-FINDINGS.md §7 Run 6 and "Owner photo copies"; qa/asset-recommendations.json).

Task: replace the two "Original photo coming soon" placeholders with the owner-approved photos
(approved 2026-10-11, copied into the HoneyComb Drive folder 2026-10-13, hashes verified by QA):
- HC-KUNAI: "Copy of RAV_4322.jpg", Drive 1PaOuVcZ82ij2vV2hq08fiFC42_w9iKua, 4912x7360,
  SHA-256 f41368debf7c8dad784374727a8c374e64bd33fc89461a0d907f16d5ce3c8722
  (black blade and ring, white handle, light-grey backdrop)
- HC-KURAMA: "1.png", Drive 1wkBiKm7ZUMRYRpHJojCI9YPhv3ePKIXn, 3415x5120, a Canva background-removed
  real photo, SHA-256 d33853df877263dab5a27300b0f92bd545a12b2111f9828bb411e7d3e9f5a494
  (orange figure on white)

Do it the same way as the other five photos:
1. Verify each download's SHA-256 before use.
2. Strip metadata in the committed source copy and record both hashes
   (assets/image-sources.json, assets/derivatives.json).
3. Make WebP derivatives with scripts/prepare-images.py. Include the small portrait widths and
   aspect-scaled sizes. Write accurate alt text.
4. Set image, imageVariants, imageWidth and imageHeight in data/products.json.
5. Update docs/ASSET-PROVENANCE.md.
6. Remove both entries from "pending".

Optional QA-suggested crops (record any crop you use):
- Kunai: [627,1370,4205,6142], 3:4. At full frame the kunai fills only about 52% of the height.
- Kurama: [487,1228,2937,3876]. At full frame the figure fills about 62% x 45%.

Keep these unchanged: prices, availability "unconfirmed", approved=false, and product IDs
(the Baymax/Kurama SKU conflict is still open).

Don't use any other file from those folders. Pro_*.png and "Product Photo" files are
AI-generated and not approved.

Prefer generating files without a write-enabled workflow. If you must use one:
- trigger it manually or only on its own file;
- install only hash-pinned packages;
- run only scripts/prepare-images.py;
- commit as github-actions[bot];
- delete the workflow in the next commit.

Before pushing, run npm test, npm run build, npm run check, tests/images-browser.mjs and the
pinned QA image audit. Report the final commit SHA.
```

**2026-10-14, later: a second GPT chat also ended before pushing.**
- **What happened:** GPT said it had a local commit but could not reach `localhost` to run the browser checks. It was trying a workaround when its chat hit the length limit.
- **Repository state:** unchanged. `codex/storefront-mvp` is still at `948dff5`, there are no new branches or pull requests, and the only workflow is still `storefront.yml`.
- **Correction to the restart prompt:** GPT does not need to run browser checks locally.
  - The read-only `Storefront checks` workflow already runs `tests/browser.mjs`, `tests/images-browser.mjs` and the pinned QA image checks on every push to `codex/storefront-mvp`.
  - QA re-tests every pushed commit in a separate checkout.
  - GPT should therefore run `npm test`, `npm run build` and `npm run check`, then push and report the SHA and the CI result.
  - It should not create workflows or other workarounds for `localhost`.


### 7c. Public launch and design rounds (from 2026-10-15)

**Public launch (owner decision, 2026-10-15).**
- **Decision:** the owner asked for the site to be public at once and said updates will continue as normal. This overrides the §7a gate for owner items. Those items stay open: WhatsApp number, availability, F-17 and F-18.
- **What is live:** `https://honeycomb3d.store` serves commit `948dff5` through Vercel. Project `honeycomb3d-storefront-preview`, deployment `dpl_5GmV5ARhUXgdZ4J3bkZZkVg5w3g3`.
- **State of that version:** preview mode, ordering off, and availability "to confirm".
- **DNS:** the owner entered the records in Namecheap. QA checked them, and Vercel issued certificates for both hostnames.
- **Rollback DNS:** `ALIAS @ ingress-cinna.easywp.com.`, `CNAME www honeycomb3d.store.`

**Builder switch (owner decision, 2026-10-15).**
- **Why:** both GPT chats hit their limits. The owner asked for continuous design upgrades and approved a Claude Opus builder session (`session_01TEeSdr5WV5Hvnw8RC17Exi`) on `codex/storefront-mvp`.
- **Builder rules:**
  - The data rules are unchanged: no price, SKU, availability or WhatsApp changes, and no invented claims.
  - No new runtime dependencies.
  - One improvement per commit, and the SHA is reported to QA.
- **QA's part:** QA does not write to that branch. It re-tests each reported commit with `qa/scripts/full-run.sh` and reviews the screenshots from `qa/e2e/screens.mjs`. It deploys a commit to production only when both its own checks and the GitHub CI push run for that SHA pass.

| Round | Commit | Change | QA result | Deployed |
|---|---|---|---|---|
| Baseline | `948dff5` | Live version before the design work | `full-run.sh` PASS on 2026-10-15: tests, build, check, audit, secret scan, domain, smoke 88/88 and live 89/89, edge, axe 0, images 18 PASS and 0 FAIL, provenance, slow network, and screenshots with no blank image at 390 px. The blank Baymax card seen earlier did not recur. | live since 2026-10-15 |
| D1 | `2b3ccb3` | Square, cover-fit photo frames on cards, product pages and the hero; new square WebP derivatives cut inside the approved crops | PASS: smoke 88/88 and live 89/89, edge, axe 0, images 18 PASS with no letterbox INFO left, no blank images. **Visual:** Minato's square crop cuts off the ring and the blade tip, and Hidden Leaf loses both ends of the plate. Sent to the builder. | **yes**, `dpl_Bs5jEV7Htedur8aGL73va9NRJmv1`, READY and aliased to both hostnames |
| D2–D3 | `b1ccd60`, `4d54be9` | Synchronous image decoding; hide Kurama and Classic Kunai until their photos are added | Tested `4d54be9`, which includes `b1ccd60`. Project checks, domain, smoke and live smoke, images and screens PASS. Edge probes and axe errored because both hard-coded the now-hidden Kurama page. That is a QA harness defect, not an app defect, and it is fixed in this commit: the probes now use a product the catalogue lists. | superseded by the next head |
| D4 | `341fc3c` | Owner's dark-background logo on transparency (`scripts/prepare-logo.py`, provenance recorded), no white box | PASS: smoke 88/88 and live 89/89, edge and axe 0 with the fixed probes, images 14 PASS, no blank images. **Visual:** the logo sits cleanly on the dark header and footer. | **yes**, `dpl_3bHxjSKBQhERuyCv7sGjAKrd4QUN` |
| D5 | `4475bf0` | Full-bleed hero: Night Fury photo with a dark gradient, headline from the store copy, "Shop the collection" CTA | PASS: all checks, images 14 PASS and 1 INFO, no blank images. **Visual:** strong and readable at 390 px and 1440 px. | **yes**, `dpl_DmzM1Nacq2W4PLdzXT6ejrZLg1Rw` |
| D6–D7 | `827c6c3`, `e5bdc9d` | Slim notice bar ("Online ordering opens soon"); design tokens, button system, sticky blurred header, footer, "Keep exploring" row | Tested `e5bdc9d`, which includes `827c6c3`: all checks PASS (images 14 PASS and 1 INFO). **Visual:** cohesive. The product-page photo is small at 1440 px; sent to the builder for item 8. | **yes**, `dpl_AFveJFKTBVeSohV87ju3ARsmNocG` |
| D8 | `878bd69` | Product cards: the whole card is a link, hover lift, clean "LKR 1,000" prices, equal heights | First run: smoke 84 PASS and 4 FAIL (cart subtotal). Cause: the new card markup carries `data-testid="product-price"`, so on a product page the harness read a "Keep exploring" card's price. The app's cart totals were correct. **QA harness fix:** the product-page price lookup now ignores prices inside product cards. Re-run: smoke 88/88. All other checks PASS. Asked the builder to put the hook on the product page's own price as well (QA-ACCEPTANCE §5). | **yes**, `dpl_8wY8eZbHcjVM9LXQM6aCswjrY9mu` |
| D9–D10 | `f3866f6`, `868c92f` | Product page redesign: breadcrumbs, large square photo, gallery with whole-object frames for Minato and Hidden Leaf, sticky info column, "Ordering opens soon" state, details table, "More from HoneyComb 3D". Then the add-to-cart button may wrap at 320 px. | Tested `868c92f`, which includes `f3866f6`: all QA checks PASS. GitHub CI is green on `868c92f`. **Visual:** professional, and the whole Minato kunai is now visible in the gallery. | **yes**, `dpl_2WujsHtS2GF4NLC8RxQ6K2H5Ae7X` |
| D11 | `a7c3b85` | Meta descriptions, Open Graph and Twitter tags, Product JSON-LD, apple-touch-icon, empty-cart and 404 states, product-page price hook | All QA checks PASS, CI green. JSON-LD carries only name, image, price and LKR. No availability, rating or review markup appears anywhere in `dist/`. Suggested JPEG share images, because `og:image` is WebP and WhatsApp previews matter for the owner. | **yes**, `dpl_886hnihyu676wWRqrc76y7hJfLhp` |
| D12–D15 | `cc01cb7`, `f726815`, `4a16fb9`, `1c7716b` | Shop filter chips (category and theme, URL history, live search); home category tiles with photos; cart with photo lines, quantity steppers and a sticky summary; two-column custom-print page | **`cc01cb7`:** the smoke filter step was INCONCLUSIVE and the edge probe crashed, because both still expected the old `<select id=category>`. QA harness fixed. **`1c7716b`** (includes the others): all checks PASS and CI is green. The first run silently skipped `cart-qty-invalid`, because the cart now has a "+" stepper and the check only ran when the quantity was typed. Harness fixed so it runs whenever a typed field exists. Re-run 88/88, including `cart-qty-invalid` on both viewports. **Visual:** polished. | **yes**, `dpl_FoaRpvotoXDkVDnd6p7pbzeu9K4L` |
| D16–D18 | `5fa39a0`, `dc2667c`, `ed752db` | Self-hosted Bricolage Grotesque (OFL 1.1, 21 KB WOFF2, hash-checked, licence shipped, provenance in `docs/FONT-PROVENANCE.md`) for headings and prices; add-to-cart confirmation, badge bump, self-clearing toast, header shadow on scroll (all off under reduced motion); privacy page polish | Tested `ed752db`, which includes the others: all checks PASS (smoke 88/88 and live 89/89, edge, axe 0, images 14 PASS and 1 INFO, no blank images, no overflow at 320 px). CI is green. | **yes**, `dpl_BdyEGqXWbhBjk2x5anAruJ5UEWTa` |
| D19–D21 | `ace9821`, `ca7c369`, `7890062` | Honey hexagon markers in the home strip (2×2 on phones); stronger gradients so text over photos is at least 6.5:1; first row of shop cards loads eagerly (the builder measured mobile LCP 1.78 s → 1.29 s on a throttled link) | CI was red on `ca7c369` and green on `7890062`, which includes it. Tested `7890062`: all QA checks PASS. | **yes** (`7890062`) |
| D22 | `2dd14f9` | Whole-object squares for Minato (whole kunai, ring to tip) and Hidden Leaf (whole plate), padded with the photo's own backdrop; tight crops move into the gallery | All QA checks PASS. Superseded before deployment by `34e4125` (seamless edge-tone padding) and `c8d8220` (product page 7/12 and 5/12 grid). | superseded |
| D23–D24 | `34e4125`, `c8d8220` | Whole-object squares padded with the photo's own edge tones (no seam); product page grid 7fr/5fr | Tested `c8d8220`: all checks PASS, CI green. **Visual:** the whole Minato kunai (ring to blade tip) and the whole Hidden Leaf plate are now the main photos, with no visible padding seam. | **yes**, `dpl_947x8oRKGJ6KzyJff68Dc4BG8o8a` |
| D25 | `d262565` | JPEG link-preview images: `site-share.jpg` 1200×630 (88 KB) and a 1200×1200 JPEG per product (67–194 KB), no metadata; `og:image` and `twitter:image` use them, with alt text | All QA checks PASS, CI green. Checked in `dist/`: `og:image` is the JPEG with matching width and height, and every file is under 300 KB. | **yes** |
| D26–D27 | `00eab92`, `02746d7` | The approved Kurama and Classic Kunai photos are imported from `claude/photo-handoff`, with whole-object squares and the optional QA crops, so both products return (7 designs). Related products rank the same category first, then shared themes. | Tested `02746d7`: all QA checks PASS (images 18 PASS and 1 INFO), CI green. **Import check:** the committed `kurama.png` and `classic-kunai.jpg` hashes differ from the approved originals because metadata was removed (Kurama: EXIF and XMP; Kunai: EXIF, Photoshop and Adobe APP segments). QA decoded both: the pixels are **identical** to the originals, and the JPEG scan data is byte-identical. `image-sources.json` records both `sourceSha256` (the approved original) and `inputSha256` (the committed file). The data is unchanged (prices 1500 and 1000, IDs, availability "unconfirmed"). **Visual:** both read well on the dark theme. | **yes** |

**2026-10-16, builder pause and photo handoff.**
- **Pause:** the builder session hit its usage limit at about 21:03 UTC on 2026-10-15 and stopped after `c8d8220`. This QA session's worker also restarted, and work resumed at 02:40 UTC.
- **Photo handoff:** the builder's Drive connector could not carry the full-size Kurama (2.3 MB) and Classic Kunai (4.9 MB) originals. QA pushed the two hash-verified copies to the temporary branch `claude/photo-handoff` (`4cefd25`), with a README giving the Drive IDs, hashes and optional crops. The branch should be deleted after the builder imports the photos.

**Process gap found in D7–D8 (Low, closed).**
- **What happened:** GitHub CI (`Storefront checks`) was red on `e5bdc9d` and `878bd69`. At 320 px the product page overflowed sideways by 22 px, because CI's Chromium renders `system-ui` as the wider DejaVu Sans. QA had deployed both on its own checks alone.
- **Effect:** `honeycomb3d.store` had that overflow at 320 px from about 20:15 to 20:32 UTC.
- **Fix:** the builder fixed the overflow in `868c92f`. QA now requires the CI push run for the exact SHA to be green before deploying. `qa/e2e/screens.mjs` also sweeps 320 px and flags any sideways overflow.

## 8. QA tooling: what was actually executed (2026-10-08, 2026-10-09)

| Check | Command | Result |
|---|---|---|
| WhatsApp-link validator unit tests | `node --test 'qa/**/*.test.mjs'` | 9/9 pass, after fixing one bug the tests caught (`1,200.50` was wrongly matching 1200) |
| Secret scan, real repos | `qa/scripts/secret-scan.sh <repo>` | No HIGH findings in either reference repo |
| Secret scan, planted-secret control (scratch repo) | same | Detected the committed `.env`, `sk_live_…` key and `NEXT_PUBLIC_SMTP_PASSWORD`; exit 1 as designed |
| Commit review script | `qa/scripts/review-commit.sh` against a scratch npm project and against reference `c78e12f` | Recorded the SHA. Ran `npm ci`/`test`/`build`/`audit` and captured a failing `test` exit 3. Reported "no package.json" for the reference repo. |
| Browser harness, **synthetic fixture only** (scratch, not committed) | `node qa/e2e/storefront-smoke.mjs` on Chromium (Playwright 1.56.1) | Correct fixture: 90 PASS, 0 FAIL, 1 REVIEW (no security headers on the plain server). Defect-seeded fixture: 15 FAIL + 4 REVIEW, catching every planted defect (subtotal off by 1, local-format WhatsApp number, soft-404, Escape not closing the menu, horizontal overflow, "Only 2 left" copy). |

| Browser harness fixes (2026-10-09) | After the first run on real pages | Accepts "Price on enquiry" and "Add to request cart". Counts *visible* cards for filters. Edits quantity through the number input. Adds `QA_LIVE_FIXTURE=1`. Re-validated on the defect-seeded fixture: still 15 FAIL, all planted defects caught. |
| `review-commit.sh` fixes (2026-10-09) | — | An abbreviated SHA had silently fallen back to `main`; it now resolves exactly or refuses. `check` now runs after `build`, as documented. |
| axe-core audit (2026-10-09) | `qa/e2e/axe-audit.mjs`, with axe-core 4.10.3 installed in a QA scratch directory (no app dependency) | `2260c7f`: 20 audits, 0 serious/critical, 22 moderate (I-13, I-14). Its first run reported 20 ERRORs, not passes, while CSP blocked injection. |
| Image audit (new, 2026-10-09) | `qa/e2e/image-audit.mjs` | `8d13b91`: decode, orientation and alt PASS; weight/oversampling FAIL (I-16, I-17). An early run mislabelled page totals because of a field-name clash in my script; fixed. |
| Drive asset provenance (2026-10-09) | Drive connector downloads → `decode.py`/`prov.py` in QA scratch (not committed) | 35 files hashed and classified. 8/8 GPT assets byte-identical; 4/7 product images C2PA AI. |
| Domain contract tests (new, 2026-10-09) | `DOMAIN_DIR=<review checkout> node --test 'qa/domain/*.test.mjs'` | `f801d31`: 10/13. `5d1c6a4`: 11/13. `2260c7f`, `8d13b91` and `acca67f`: 13/13. Without `DOMAIN_DIR` they skip. |
| Run 5 tooling fixes (2026-10-13) | `storefront-smoke.mjs`, `image-audit.mjs`, `image-provenance.py` | The live fixture now approves only products with a real photo, and console errors record their URL. Oversampling is measured on the decoded file, not the density-corrected `naturalWidth`. The provenance scan exits 1 on AI markers (checked: exit 1 on a Google-AI sample, exit 0 on `RAV_4322.jpg`). |
| Source and derivative verification (2026-10-13) | Ad hoc Python/Pillow in QA scratch | 6 committed sources are pixel-identical to the Drive originals. 16 derivative records match their files. Re-derivations match at 34–39 dB PSNR. |

The fixture rows validate the **tools only**. §7 holds the results against the storefront.

## 9. Remaining verification gaps

1. Real-phone WhatsApp opening (AC-WA-6) is manual. The handoff was tested only with a test-only number via request interception, because the shipped config keeps it disabled pending D-2.
2. Browsers: Chromium only. No Firefox or Safari. No screen-reader pass (only automated name, role and focus checks).
3. Nothing is deployed. Security headers were verified on `scripts/serve.mjs` only. `vercel.json` headers are inspected, not tested.
4. Automated a11y is covered by axe-core (0 serious). There has been no human screen-reader pass. Contrast is computed from CSS plus axe's rendered checks.
5. Live site and EasyWP state could not be fetched from this environment. Baserow data not inspected.
6. The brief is second-hand (chat retrieval). Its historical claims are unverified.
7. Screenshot capture date for the April evidence is inferred, not recorded.
8. Airtable (2026-10-11): QA read only Products and Filament Inventory. **MakerWorld licence pages (F-18) could not be checked.** On 2026-10-15 this environment's network policy blocked `makerworld.com` (proxy 403). The owner can check each model page, or allow that host in the environment's network settings. The "current" status of the Airtable prices rests on the owner's word, because the connector shows creation dates only.
9. Asset audit: not every Drive file was opened (videos, ZIPs, `06 Product Records and Pricing` (empty listing on 2026-10-11), deep Listing Kit and Product Studio pages). C2PA manifests were validated with `c2pa-python` (signatures valid; Google root not in the default trust list). No real-device low-memory decode test. The throttled-network LCP was run on 2026-10-15 in emulation (see I-24). See `ASSET-AUDIT.md` §8.
