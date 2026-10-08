# HoneyComb 3D storefront rebuild: QA findings

Owner: independent recovery QA (Claude). Acceptance criteria: [`QA-ACCEPTANCE.md`](QA-ACCEPTANCE.md).
Last updated: **2026-10-08**.

> **Headline:** the implementation (`codex/storefront-mvp` in `RINS-Enterprises/honeycomb3d-website`) has
> **not been reviewed**. That repository was not accessible to this session (F-01). Everything below is
> a **requirements and evidence audit, by inspection**, plus verification of the QA tooling itself.
> **No storefront build, test or browser run has been performed, and no implementation finding exists yet.**

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

### 4.3 Old proposals / practices (not to be carried over without a decision)
- "Psychological triggers", "scarcity triggers ('Only X left')", "social proof ('X sold')": README §"What I Optimized". These were deliberate conversion tactics, not data.
- Ops-system future items: dashboard, inventory tracking, order history. **Inventory tracking did not exist** at the time of that README (2026-04-22).

### 4.4 Current unknowns
See owner decisions §5. Also unknown: whether the WooCommerce site, its database, `wp-content/uploads` or a hosting backup still exist; who controls `honeycomb3d.store` DNS and hosting; whether the Baserow product table is current; actual stock and print lead times; product dimensions, materials and colour options; legal business name and registration for policy pages.

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

## 6. Findings

### F-01 · Blocker · Target repository and implementation branch inaccessible
- **Type:** Tested failure (access). **Reviewed commit:** none (no access).
- **Reproduction:** From this session: (1) attach `RINS-Enterprises/honeycomb3d-website`, which fails with "not found or credential doesn't have access"; (2) `git ls-remote https://github.com/RINS-Enterprises/honeycomb3d-website` is refused (no credential for the repo); (3) the session's accessible-repo listing shows only `honeycomb3d-ecommerce-system` and `honeycomb3d-ops-system`.
- **Expected:** Read access to the brief and `codex/storefront-mvp`; write access to `claude/recovery-qa`.
- **Actual:** No read or write access. The brief, the ZIP and GPT's branch could not be inspected. QA work is staged on `claude/wizardly-mendel-73bkuw` of `honeycomb3d-ecommerce-system` instead.
- **Evidence:** Session tool output, 2026-10-08.
- **Recommended fix:** Check the repo name. Install the Claude GitHub App on `honeycomb3d-website` (or grant the connected account access), then start a session with it selected. Then run `qa/scripts/review-commit.sh https://github.com/RINS-Enterprises/honeycomb3d-website codex/storefront-mvp` and copy `docs/QA-*.md` + `qa/` onto `claude/recovery-qa`.

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
- **Actual:** `+94 70 300 9064` is consistent across E-1/E-3 but was last evidenced in April 2026.
- **Recommended fix:** D-2. Keep the number in one config value (AC-WA-3). Run the harness with `WHATSAPP_NUMBER=<confirmed>`.

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
- **Type:** Inspection. The live site could not be checked from here (egress 403). The best sources are, in order: hosting backup / WooCommerce DB, WooCommerce product CSV export, `wp-content/uploads`, the Baserow product table, then a web archive of `honeycomb3d.store`.
- **Recommended fix:** The owner checks the hosting account and Baserow before more screenshot-based reconstruction.

### F-16 · Info · Ops data contains cost/profit fields
- **Type:** Inspection. **Reviewed commit:** ops `a0cfadb`.
- **Actual:** The ops README says Products hold cost, and order items hold profit.
- **Recommended fix:** If the storefront ever reads from Baserow, use a read-only view or token limited to public fields, server-side only. Cost/profit must never reach the client bundle.

## 7. Implementation review: `codex/storefront-mvp`

**Not started. Blocked by F-01.** No commit SHA recorded, no build run, no browser test run.
Once access exists, each run is recorded here as:

```
### Run N: <date> · codex/storefront-mvp @ <full sha>
review-commit.sh summary: install / lint / typecheck / test / build / audit / secret-scan exit codes
storefront-smoke.mjs: counts {PASS, FAIL, INCONCLUSIVE, REVIEW}; results under qa/results/<sha>/browser/
Findings: I-<n> (severity, Tested failure | Inspection, repro, expected, actual, evidence, fix)
Re-test of earlier findings: I-<n> fixed at <sha> / still open
```

## 8. QA tooling: what was actually executed (2026-10-08)

| Check | Command | Result |
|---|---|---|
| WhatsApp-link validator unit tests | `node --test 'qa/**/*.test.mjs'` | 9/9 pass, after fixing one bug the tests caught (`1,200.50` was wrongly matching 1200) |
| Secret scan, real repos | `qa/scripts/secret-scan.sh <repo>` | No HIGH findings in either reference repo |
| Secret scan, planted-secret control (scratch repo) | same | Detected the committed `.env`, `sk_live_…` key and `NEXT_PUBLIC_SMTP_PASSWORD`; exit 1 as designed |
| Commit review script | `qa/scripts/review-commit.sh` against a scratch npm project and against reference `c78e12f` | Recorded the SHA. Ran `npm ci`/`test`/`build`/`audit` and captured a failing `test` exit 3. Reported "no package.json" for the reference repo. |
| Browser harness, **synthetic fixture only** (scratch, not committed) | `node qa/e2e/storefront-smoke.mjs` on Chromium (Playwright 1.56.1) | Correct fixture: 90 PASS, 0 FAIL, 1 REVIEW (no security headers on the plain server). Defect-seeded fixture: 15 FAIL + 4 REVIEW, catching every planted defect (subtotal off by 1, local-format WhatsApp number, soft-404, Escape not closing the menu, horizontal overflow, "Only 2 left" copy). |

These results validate the **tools only**. They say nothing about the HoneyComb storefront.

## 9. Remaining verification gaps

1. Brief, ZIP and `codex/storefront-mvp`: unread (F-01). Acceptance criteria marked *(confirm vs brief)* are assumptions.
2. No build, test, browser, accessibility or security check has run against the implementation.
3. Firefox/WebKit are not available here (Chromium only). Real-phone WhatsApp handoff (AC-WA-6) is manual.
4. No automated contrast or axe-core audit. axe-core is not installed, and adding it is a dependency change for GPT to decide. Contrast (AC-A11Y-8) is manual for now.
5. Live site, hosting backups and Baserow data: not inspected.
6. Screenshot capture date is inferred (2026-04-05 to 2026-04-19), not recorded.
