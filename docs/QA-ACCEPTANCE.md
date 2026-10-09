# HoneyComb 3D storefront rebuild: QA acceptance criteria

Owner: independent recovery QA (Claude), branch `claude/wizardly-mendel-73bkuw` of
`RINS-Enterprises/honeycomb3d-ecommerce-system`.
Status: **v2, 2026-10-09**. Now aligned with `docs/RECOVERY-AND-BUILD-BRIEF.md` (read from
`codex/storefront-mvp@f801d31`). v1 (2026-10-08) was written before the brief was readable.

Companion documents: [`QA-FINDINGS.md`](QA-FINDINGS.md) (evidence register, findings) and
[`../qa/README.md`](../qa/README.md) (how to run the checks).

---

## 0. Access and basis

| Item | State on 2026-10-09 |
|---|---|
| Implementation | `codex/storefront-mvp` in **this** repo (`honeycomb3d-ecommerce-system`). The brief's suggested `honeycomb3d-website` repo was never created. |
| Brief | `docs/RECOVERY-AND-BUILD-BRIEF.md` on the implementation branch. Its "Acceptance checks" section is the owner-level source. This document makes them testable. |
| QA branch | `claude/wizardly-mendel-73bkuw` (session-assigned; the brief suggests `claude/recovery-qa`) |
| Historical live site | `honeycomb3d.store` is registered to 2027-03-31; DNS still aims at EasyWP. Not fetchable from the QA environment. |

## 1. MVP scope (from the brief, §"Build today")

1. Catalog with **search** and **category filters**, product details, cart.
2. **WhatsApp order-request handoff** carrying product identifiers, quantities and an estimated subtotal. Availability, delivery and final total stay "to be confirmed".
3. Contact page and **custom-print enquiry** (brief §"Recovered page and content direction").
4. Policy pages only with approved text (none recovered yet).
5. **Preview vs live** mode: unknown prices, stock and photos stay visibly unconfirmed or excluded from the published catalog.

Out of scope: paid checkout, accounts, order database, inventory sync, Stripe/PayHere/WebXPay/KOKO/Mint,
SMTP, Trustpilot/CusRev. None of these is assumed to work (QA-FINDINGS F-09, §4.3).

## 2. Global rules (apply to every page)

| ID | Criterion | Verify |
|---|---|---|
| AC-DATA-1 | Every product name, price, compare-at price, SKU, description, category, image, and stock figure shown to customers comes from a single catalog data file/source with a recorded provenance (`recovered-screenshot`, `owner-confirmed <date>`, or similar). Nothing is invented. | Inspect data file and diff against QA-FINDINGS §3 |
| AC-DATA-2 | Products whose price or details are not owner-confirmed are either hidden or visibly marked by a reviewed flag in data, never silently shipped as current. | Inspect |
| AC-DATA-3 | Prices are in LKR, shown in a single consistent format (e.g. `Rs. 1,200`), and the same value appears on card, PDP, cart line, and WhatsApp message. | Harness `cart-line`, `whatsapp-handoff` + manual |
| AC-CONTENT-1 | No sold counts, "Only X left", "X in stock", "high demand", "limited batch", countdowns, or "SALE"/strikethrough prices unless backed by a data field with a source and date. Harness flags these as REVIEW. | Harness `claim-*` + inspect |
| AC-CONTENT-2 | No customer reviews, ratings, "verified buyer", or third-party review badges unless the owner provides each review with consent and provenance. No placeholder reviews. | Inspect |
| AC-CONTENT-3 | No placeholder text: lorem ipsum, TODO, `example.com`, `$` prices, `undefined`, `NaN`. | Harness `junk-*` |
| AC-CONTENT-4 | Delivery, payment (COD / bank transfer), returns, and lead-time statements appear only if owner-confirmed. Footer policy links go to real owner-supplied text or are absent; no empty or 404 policy pages. | Inspect + click every footer link |
| AC-CONTENT-5 | Copy does not claim official licensing or affiliation with any franchise. Whether a "fan-made, not affiliated" notice is shown is an owner decision (QA-FINDINGS F-06). | Inspect |
| AC-SEC-1 | No secrets in the repo or client bundle (Stripe secret/webhook keys, SMTP passwords, API tokens, `.env`). No secret-looking vars behind client-exposed prefixes (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`). | `qa/scripts/secret-scan.sh` on the review checkout and on the built output |
| AC-SEC-2 | No dead third-party integrations (old Stripe, Trustpilot, CusRev, analytics) loaded without an owner decision. Third-party hosts requested at runtime are listed and justified. | Harness network log + inspect |
| AC-SEC-3 | Deployed responses send `Content-Security-Policy` (at least `default-src 'self'` plus listed exceptions), `X-Content-Type-Options: nosniff`, and `Referrer-Policy`. Dev server exempt. | Harness `security-headers` against the deployed preview |
| AC-SEC-4 | External links opened in a new tab carry `rel="noopener"` (or `noreferrer`). User-controlled text (cart notes, names) is never injected as HTML. | Harness `whatsapp-rel` + inspect |
| AC-BUILD-1 | A clean clone builds with the documented commands and committed lockfile (`npm ci` or equivalent). Lint/typecheck/tests that the project defines pass. `npm audit --omit=dev` shows no high/critical issues, or each one is triaged. | `qa/scripts/review-commit.sh` |

## 3. Customer flows

### 3.1 Navigation (desktop and mobile)

| ID | Criterion |
|---|---|
| AC-NAV-1 | At 1280×800, a `<nav>` landmark shows links to Home, Shop/Catalog and Contact, plus a cart link showing the current item count. Home returns 2xx. |
| AC-NAV-2 | At 390×844 and 360×740, either all primary nav links are visible without overflow, or a menu button opens the nav. If a menu button is used: The button has an accessible name and toggles `aria-expanded` false→true. **Escape** closes it and returns focus to the button. Tapping a link closes the menu and navigates. |
| AC-NAV-3 | No horizontal page scroll at 360, 390, 768, 1280 px widths. Tap targets are ≥ 24×24 CSS px (WCAG 2.2 2.5.8). |
| AC-NAV-4 | Every internal link resolves (no 404s from header, footer, cards, breadcrumbs). |

### 3.2 Catalog and filters

| ID | Criterion |
|---|---|
| AC-CAT-1 | The catalog lists every published product exactly once. Each card shows image (with meaningful `alt`), name, and price, and links to its PDP. The count shown matches the products rendered. |
| AC-CAT-2 | Filters exist for the categories in the data (at minimum franchise/universe and product type,). Applying one updates the list without a full error state. The active filter is visible and exposed to AT (`aria-pressed` / checked state). Clearing restores the full list. A filter result of zero shows an explicit "no products" message with a clear action. |
| AC-CAT-3 | The filter state is reflected in the URL (shareable, survives reload, back button restores the previous state) *(recommended)*. |
| AC-CAT-5 | Search matches product name, tags and category, ignoring case and word order. An empty query shows everything; a no-match query shows the empty state. Combined search + filter narrows correctly. |
| AC-CAT-4 | Sorting, if offered, is correct for price ascending/descending using numeric values, not string order. |

### 3.3 Product detail page (PDP)

| ID | Criterion |
|---|---|
| AC-PDP-1 | `/products/<slug>` (or the documented route) renders one `h1` with the product name, the price, at least one image with `alt`, and an add-to-cart button. The page title includes the product name. |
| AC-PDP-2 | Only data-backed attributes are shown (material, size, colour, SKU). Missing attributes are omitted, never filled with guesses. |
| AC-PDP-3 | Image gallery, if present, is keyboard operable and each thumbnail has an accessible name. |
| AC-PDP-4 | A product marked unavailable in data cannot be added to the cart, and the reason is shown as text, not only through colour. |
| AC-PDP-5 | The PDP has a "Ask on WhatsApp" link only if the brief wants it. If so, it obeys AC-WA-2 with a product-specific message. |

### 3.4 Cart

| ID | Criterion |
|---|---|
| AC-CART-1 | Add-to-cart raises the header cart count by exactly 1, announces the change through a polite live region, and does not navigate away unless that is the documented behaviour. Adding the same product again increments its quantity and does not create a duplicate line. |
| AC-CART-2 | Each cart line shows name, unit price, quantity, and line total = unit × qty. Cart subtotal = Σ line totals, computed in integer rupees (no float drift such as `1799.9999`). |
| AC-CART-3 | +/− controls change quantity by 1. Minimum is 1; going below 1 either removes the line with a confirmation or is blocked. Typing a quantity rejects 0, negatives, decimals and non-numbers, and caps at a documented maximum. Totals update immediately. |
| AC-CART-4 | Remove deletes the line. When the cart becomes empty, it shows an empty-state message with a link back to the catalog, the header count is 0, and the WhatsApp checkout is hidden or disabled. |
| AC-CART-5 | The cart survives reload and navigation, via `localStorage` or another documented mechanism. |
| AC-CART-6 | Shipping is shown either as an owner-confirmed rate (the old site used a flat "Islandwide Delivery Rs. 300", see QA-FINDINGS F-08) or as "Delivery cost confirmed on WhatsApp". It is never omitted silently from a "Total". |
| AC-CART-7 | If a stored cart references a product that no longer exists or whose price changed, the cart drops or updates it with a visible notice and never sends stale prices to WhatsApp. |

### 3.5 WhatsApp order handoff

| ID | Criterion |
|---|---|
| AC-WA-1 | The cart has one clearly labelled primary action (e.g. "Send order on WhatsApp"), available only when the cart is non-empty. |
| AC-WA-2 | The action opens `https://wa.me/<number>?text=<encoded>`. `<number>` is the **owner-confirmed** number in international digits-only format (the old site showed `+94 70 300 9064`, i.e. `94703009064`, which has not been re-confirmed). The decoded text has no `%XX`, `undefined`, `NaN` or `[object Object]`. It lists every line with name, quantity and line total, then the subtotal, the delivery note, and the currency. Validated by `qa/lib/whatsapp-link-check.mjs`. |
| AC-WA-2a | Each line also carries the stable product identifier, e.g. `[HNYCMB501]` (brief). An unpriced line reads "price to confirm". An all-unpriced cart shows **no** amount (never `0.00`). A mixed cart's subtotal is labelled partial. |
| AC-WA-3 | The number lives in one config value; it is not hard-coded in multiple components. |
| AC-WA-4 | The page states plainly that the order is **not placed or paid** until confirmed on WhatsApp. It makes no claim of order confirmation, email receipt, or payment. |
| AC-WA-5 | The cart is not cleared just because the WhatsApp link was clicked, so the customer can return if WhatsApp failed to open. |
| AC-WA-6 | Works on mobile (opens the WhatsApp app) and desktop (opens WhatsApp Web or the app chooser). Tested manually on at least one real phone before launch. |

### 3.5a Preview mode, unknown data, enquiry

| ID | Criterion |
|---|---|
| AC-PREV-1 | While `mode: preview`, every page shows a persistent, plainly worded preview notice. No published URL is presented as the live store. |
| AC-PREV-2 | A product with `priceLkr: null` shows "Price to be confirmed" (never blank, 0, or a strikethrough). `availability: unconfirmed` is shown as text. A missing photo uses a neutral placeholder, never a generated or scraped image (brief: "Do not generate substitute product images"). |
| AC-PREV-3 | While the WhatsApp contact is unverified, the order-request button is visibly disabled with a reason, and the cart still works. No historical number or email is shown. |
| AC-PREV-4 | Live mode hides unapproved products everywhere, including stale cart lines (QA-FINDINGS I-6). |
| AC-ENQ-1 | The custom-print enquiry collects only what is needed. It hands off via the same verified channel, or says the channel isn't available yet. It never claims a request was "received" unless a real backend confirms it. Free text is length-limited and never rendered as HTML. |

### 3.6 Failure states

| ID | Criterion |
|---|---|
| AC-FAIL-1 | Unknown product slug and unknown route return HTTP 404 with a "not found" message and a link to the shop (no soft-404 with 200). |
| AC-FAIL-2 | Corrupt or malformed cart storage does not crash the page. The cart resets to empty, or to the valid subset. |
| AC-FAIL-3 | A missing product image shows a sized placeholder without layout shift or broken-image icon. |
| AC-FAIL-4 | No uncaught JS errors and no same-origin 4xx/5xx requests on home, catalog, PDP, cart. |
| AC-FAIL-5 | With JavaScript disabled, catalog and PDP content is still readable *(recommended for SEO; REVIEW, not blocking)*. |
| AC-FAIL-6 | If the catalog data fails to load (for a client-fetched design), a retryable error message is shown instead of an empty grid. |

### 3.7 Accessibility (WCAG 2.2 AA target)

| ID | Criterion |
|---|---|
| AC-A11Y-1 | `<html lang="en">` (or the documented locale) and a unique `<title>` per page. |
| AC-A11Y-2 | Exactly one visible `h1` per page; heading levels don't skip. |
| AC-A11Y-3 | Every `img` has `alt`. Product images get descriptive alt text; decorative images get `alt=""`. |
| AC-A11Y-4 | Every button/link has an accessible name. Icon-only cart/search/menu buttons use `aria-label`. |
| AC-A11Y-5 | A skip link is the first Tab stop. All interactive elements show a visible focus indicator. Tab order follows the visual order. |
| AC-A11Y-6 | Disclosure widgets (menu, filters, drawer) expose `aria-expanded`. A cart drawer, if used, traps focus while open and returns focus on close. |
| AC-A11Y-7 | Cart changes are announced through `role=status` / `aria-live=polite`. |
| AC-A11Y-8 | Text contrast is ≥ 4.5:1 (≥ 3:1 for large text and UI boundaries) on the dark theme. The old design's orange-on-black and grey strikethrough prices need checking. |
| AC-A11Y-9 | Usable at 200% zoom and 320 px width without loss of content. `prefers-reduced-motion` disables non-essential animation. |

## 4. Test matrix

| Dimension | Values |
|---|---|
| Viewports | 360×740, 390×844 (mobile, touch); 768×1024 (manual); 1280×800 (desktop) |
| Browsers | Chromium (Playwright, available in QA env). Firefox/WebKit: **not available** here, so manual or a CI follow-up is needed. |
| Devices | One real Android + WhatsApp app for AC-WA-6 (manual, owner) |
| Data | Full catalog; one product with a missing image; an empty cart; a corrupted cart; a 2-item cart with qty 2 + 1 |

## 5. Test-hook contract requested from the implementer

So the QA harness can find elements reliably without coupling to styling, please add these
`data-testid` attributes. The harness falls back to roles/text, but where it can't find an
element it reports INCONCLUSIVE rather than PASS.

`nav-toggle`, `cart-link`, `cart-count`, `product-card`, `product-price`, `add-to-cart`,
`filter-<value>`, `cart-line`, `cart-qty`, `cart-qty-increase`, `cart-qty-decrease`,
`cart-remove`, `cart-subtotal`, `whatsapp-checkout`.

## 6. Release gate (MVP)

All of the following must hold, at a recorded commit SHA:

1. Zero open **Blocker** or **High** findings in QA-FINDINGS for that SHA.
2. `qa/scripts/review-commit.sh` shows install, build, and every project-defined check passing.
3. `qa/scripts/secret-scan.sh` shows no HIGH findings on the source **and** on the build output directory.
4. `qa/e2e/storefront-smoke.mjs` reports zero FAIL. Each REVIEW item is either signed off by the owner with evidence or removed.
5. Owner decisions D-1…D-9 in QA-FINDINGS §5 are answered in writing.
6. Manual checks done: real-phone WhatsApp handoff (AC-WA-6), contrast (AC-A11Y-8), footer links (AC-CONTENT-4).
7. `DOMAIN_DIR=<review checkout> node --test 'qa/domain/*.test.mjs'` shows 0 failures.
