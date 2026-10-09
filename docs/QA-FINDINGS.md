# HoneyComb 3D storefront rebuild: QA findings

Owner: independent recovery QA (Claude). Acceptance criteria: [`QA-ACCEPTANCE.md`](QA-ACCEPTANCE.md).
Last updated: **2026-10-09**.

> **Headline (2026-10-09):** the implementation is `codex/storefront-mvp` in **this** repository. Three commits have been reviewed
> (§7). **Current head `2260c7f913a340914a74249cefc8f668b962160c`:** install, test (11), build, check, audit and secret scan all
> pass. QA domain contract tests 13/13. Chromium browser smoke 88/88 (preview) and 89/89 (live fixture with test-only data).
> axe-core WCAG audit: 0 serious/critical. Earlier implementation findings I-1…I-7 are **fixed and re-tested**.
> Open: I-9, I-10, I-13, I-14 (Low), I-11, I-12 (Info).
> **QA sign-off (§7a):** code approved for a *private preview*. **Public launch not approved**, for data reasons, not code:
> owner decisions D-1…D-9 (§5), original photos, a pricing decision and a verified WhatsApp number are still missing.

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
| 2026-10-09 | Namecheap account (read-only connector) | — | Domain list; DNS host records for `honeycomb3d.store` | E-8. No changes made. |
| 2026-10-09 | `https://honeycomb3d.store`, `ingress-cinna.easywp.com`, web archive | — | Fetch via a second tool | Inconclusive: that tool's DNS also failed for `www.namecheap.com`, so the failure says nothing about the site. |

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

### Run 3: 2026-10-09 · `codex/storefront-mvp` @ `2260c7f913a340914a74249cefc8f668b962160c` (current head)

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


## 7a. QA sign-off and launch readiness (2026-10-09, head `2260c7f`)

**Code: approved for a private preview deployment.** No open Blocker, High or Medium implementation finding. Build,
tests, browser flows, failure states, security headers (local server) and an automated WCAG audit all pass. Open items
I-9, I-10, I-13, I-14 (Low) and I-11, I-12 (Info) can ride the next change.

**Public launch: NOT approved.** Every blocker is data or an owner decision; none is code. In priority order:

| # | Owner action | Unblocks | Ref |
|---|---|---|---|
| 1 | **Secure the old site before touching DNS.** Open the EasyWP dashboard or ask Namecheap support for a files/DB backup. The apex still points at EasyWP. Don't pay for reactivation until a backup is confirmed available. | Original photos, product data, policy text, prices | F-15, E-8, brief task 3 |
| 2 | **Confirm the WhatsApp number** (`94703009064`?) and who answers it. Then GPT sets `whatsappNumber` and `whatsappVerified: true`. Test on a real phone without sending an order. | Any order request | D-2, F-11, AC-WA-6 |
| 3 | **Choose prices or a quote-only policy** per product. The evidence conflicts (§3.1), so nothing can be copied. Leaving prices `null` with "Price on enquiry" is a valid launch choice. | Cart totals | D-3, F-02 |
| 4 | **Supply original product photos** (no screenshot crops, no AI images) and approve or replace the draft descriptions (`copyStatus`). | `approved: true`, live mode | D-9, F-07, I-7 |
| 5 | **Decide payment and delivery wording** (COD? bank transfer? courier fee, typical days). The site currently promises none, which is safe. | Quote conversations, policy pages | D-1, D-4, F-03, F-08 |
| 6 | **Provide policy text** (shipping, returns, terms). The current `/privacy/` page accurately describes the app's own data handling, but the owner should approve it. | Footer policy links | D-5, F-10 |
| 7 | **IP stance** on franchise-character products. | Catalogue scope | D-7, F-06 |
| 8 | **Email:** add MX records and test `info@honeycomb3d.store`, or keep it off the site. | Contact page (I-12) | E-8 |
| 9 | **Hosting:** pick a plan that permits commercial use. Deploy `dist/` privately first and re-run `qa/e2e/storefront-smoke.mjs` against that URL to verify the real headers and 404 status. | Launch | RUN-AND-RELEASE.md |

**Re-test procedure after the owner's data lands:** run `qa/scripts/review-commit.sh` on the new SHA, then `qa/domain/`,
`storefront-smoke.mjs` (preview and `QA_LIVE_FIXTURE=1`), `edge-probes.mjs` and `axe-audit.mjs`. Then do one manual real-phone
WhatsApp check with the confirmed number (open it, don't send) before switching `mode` to `live`.

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
| Domain contract tests (new, 2026-10-09) | `DOMAIN_DIR=<review checkout> node --test 'qa/domain/*.test.mjs'` | `f801d31`: 10/13. `5d1c6a4`: 11/13. `2260c7f`: 13/13. Without `DOMAIN_DIR` they skip. |

The fixture rows validate the **tools only**. §7 holds the results against the storefront.

## 9. Remaining verification gaps

1. Real-phone WhatsApp opening (AC-WA-6) is manual. The handoff was tested only with a test-only number via request interception, because the shipped config keeps it disabled pending D-2.
2. Browsers: Chromium only. No Firefox or Safari. No screen-reader pass (only automated name, role and focus checks).
3. Nothing is deployed. Security headers were verified on `scripts/serve.mjs` only. `vercel.json` headers are inspected, not tested.
4. Automated a11y is covered by axe-core (0 serious). There has been no human screen-reader pass. Contrast is computed from CSS plus axe's rendered checks.
5. Live site and EasyWP state could not be fetched from this environment. Baserow data not inspected.
6. The brief is second-hand (chat retrieval). Its historical claims are unverified.
7. Screenshot capture date for the April evidence is inferred, not recorded.
