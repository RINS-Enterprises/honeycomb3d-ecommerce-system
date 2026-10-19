# Storefront features (session B): status

Branch `claude/storefront-features`, branched from `claude/funny-albattani-c5a91a`. Draft PR into `main`, "Storefront features (session B)", for CI only; the PM merges and deploys.

Each item lists its commit, what changed, the local gate, the QA verdict and the owner fact (if any) its switch waits on. "Local gate" means `npm test`, `npm run build && npm run check`, `node tests/browser.mjs` and `node tests/images-browser.mjs`, run against both a live build (the committed `data/store.json`) and a preview build (`mode` temporarily set to `preview` locally, never committed).

| # | Item | Status | Commit |
|---|---|---|---|
| 1 | Order button on shop cards | Done, QA fixed | `878df30`, `082d32c` |
| 2 | Cart bundle suggestions | Done, QA fixed | `9a7f1e4` + QA-fix commit |
| 3 | FAQ page | Done, QA fixed | `4c32420` + QA-fix commit |
| 4 | Delivery line (switch) | Done, QA in progress | `2c7b46b` |
| 5 | Payment methods (switch) | Not started | |
| 6 | Social links | Not started | |
| 7 | Trust pages | Not started | |
| 8 | Indexing prep | Not started | |
| 9 | Testing and docs | Not started | |

## 1. Order button on shop cards

- **Commits:** `878df30` (feature), plus a QA-fix commit (see the QA verdict below). PR #8.
- **What changed:**
  - `src/domain.mjs`: `orderingOpen(store)` (live mode and a verified number) and `orderNowUrl(p, store, quantity=1)`, built from the existing `orderMessage` and `whatsappUrl`. The product page now uses the same helpers, so its Order now link is unchanged.
  - `src/card.mjs`: `card(p, {store})` adds an **Order ↗** link next to **+ Add** when ordering is open and the design is not unavailable. It is a plain link to `wa.me/94710599815` with the one-design, quantity-1 request message, opens in a new tab, and works without JavaScript. Accessible name: "Order <name> on WhatsApp (opens in a new tab)". Cards rendered without a store, in preview mode, or for unavailable designs are exactly as before.
  - Every card call site passes the store: home, shop, "More from HoneyComb 3D", 404 picks, and in the browser the recently viewed row and the empty-cart picks.
  - `src/styles.css`: `.card-actions` / `.quick-order`. Add and Order share the card row and wrap onto two lines whenever they don't fit (narrow cards or larger text). No overflow at 320–1440px with text at 100%, 120% or 150%.
  - The Order link appears wherever a product card does: shop, home featured, "More from HoneyComb 3D", 404 picks, recently viewed and empty-cart picks. This is one consistent card. If the PM wants it on the shop page only, drop `store` from the other `card()` calls.
- **Tests:** unit tests for the helpers and for live / preview / unverified / unavailable cards; the browser test checks the card link's number, message, quantity 1, new tab (stubbed, nothing reaches WhatsApp) and that the cart is untouched, and checks no Order link in a preview build. The "one link per card" assertion now counts one product link per card, plus the Order link when ordering is open.
- **Local gate:** passed on live and preview builds (re-run after the QA fixes). `npm test` gave 42 passed and 0 failed. `build` and `check` passed (23 pages), as did `browser.mjs` and `images-browser.mjs`.
- **Screenshots checked:** shop at 320, 360, 375, 390 and 1440px, plus a measured overflow probe at 320/360/375/390/414/768/1440px × 100/120/150% text.
- **QA verdict:** independent read-only review: **PASS WITH FIXES**, now fixed.
  - Should-fix, fixed: the Order button overflowed the card at 375px with enlarged text (120–150%). The fixed 374px breakpoint was replaced with content-based wrapping.
  - Nit, fixed: the browser test now expects the Order link only on available cards, so marking a design unavailable won't break it.
  - Nit, noted: Order appears on every card, not only the shop page (see above).
  - Nit, for the PM (out of my lane): the `source` note in `data/store.json` contains the typo number's digits. It is stripped from the published `dist/data/store.json`, so nothing ships, but the source data still breaks the "never in any format" rule. Suggest rewording it without the digits.
  - Verified OK: the number, the message text, gating, escaping (hostile names), click targets over the card-wide link, keyboard order and accessible names, client-rendered cards, the unchanged product-page Order now, and no-JS behaviour.
- **Waits on owner fact:** none. It follows the existing live-ordering switch (`mode: live`, verified number).

## 2. Cart bundle suggestions

- **Commits:** `9a7f1e4` (feature), plus the QA-fix commit that follows it.
- **What changed:**
  - `src/domain.mjs`: `cartSuggestions(items, products, limit=3)`. It picks designs that share themes (tags other than the category) with what's in the cart. The most shared themes rank first; on a tie, another category comes before the same one (a kunai with a keychain, not a second keychain); catalogue order breaks any remaining tie.
    - It never suggests a design already in the cart, or an unavailable one.
    - A cart with no shared themes gets no suggestions.
  - `src/app.mjs` / `src/styles.css`: the cart shows **"Goes well with your request"** after the request's own fields (lines, notes, PayPal option). Each row has a thumbnail, the name linking to the product, the catalogue price (or "Price on enquiry"), and **+ Add**.
    - Add uses the existing quick-add path, so limits, announcements and focus on the new line are unchanged.
    - The order message only ever contains cart items.
- **Wording:** the brief said "Often added together". There is no order history to support that claim, so the heading says "Goes well with your request". No discounts or bundle prices are shown.
- **Example (live catalogue):** Hidden Leaf Keychain → Kurama Figure, Minato Kunai, Classic Kunai. Night Fury Keychain → Light Fury, Baymax, then a dragon figure.
- **Tests:** a unit test covers ranking, exclusions, the limit, no-shared-theme and empty carts, and unknown prices. The browser test checks the heading, names and prices, Add from a suggestion (focus, cart line, message), and that the added design drops out of the list. It runs in both builds; suggestions don't depend on the mode.
- **Local gate:** passed on live and preview builds (re-run after the QA fixes): `npm test` (43 pass), `build` + `check` (23 pages), `browser.mjs`, `images-browser.mjs`.
- **Screenshots checked:** cart with one line at 320, 390 and 1440px (no overflow).
- **QA verdict:** independent read-only review: **PASS WITH FIXES**, now fixed. No blockers.
  - Should-fix, fixed: the block sat between the cart lines and the Notes / PayPal fields. It now comes after them, so the request's fields stay together for touch, keyboard and screen-reader users.
  - Should-fix, fixed: a full cart (20 lines) shows no suggestions instead of Add buttons that can only fail. This can't happen yet, because there are only 17 visible designs.
  - Nit, fixed: an unpriced suggestion reads "Price to confirm", like a cart line.
  - Nit, fixed: suggestion Add buttons are 44px tall (touch target).
  - Nit, fixed: the browser test checks that typed notes survive Add from suggestions, and that suggestions come after the notes. It runs on both the live and preview builds.
  - Nit, accepted: broad genre tags such as "Movies" weigh the same as franchise tags (Baymax → dragon keychains). This is honest; worth revisiting if the owner adds tag tiers.
  - Out of scope, existing before item 2: at 320/390px with 200% root text the cart scrolls sideways (`.cart-summary`, `.cart-line-total`). Removing the suggestions doesn't change it. Logged for a later fix.
  - Verified OK: ranking and exclusions, escaping (hostile names), notes and PayPal state after Add, focus and announcement, message unaffected, preview mode, heading order, layout at 320–1440px (including 200% text inside the block), and the heading wording.
- **Waits on owner fact:** none.

## 3. FAQ page

- **Commits:** `4c32420` (feature), plus the QA-fix commit that follows it.
- **What changed:**
  - `src/render.mjs`: `faqPage(store)` at `/faq/`, linked as "Questions and answers" in the footer's About column on every page. It has eight short answers, each built from wording the site already uses:
    - How ordering works.
    - A request is not a confirmed purchase.
    - What "made to order" means.
    - Colours and sizes: ask us (in WhatsApp when live; through "Ask about a variation" in preview).
    - Custom prints, with a link to `/custom/`.
    - Delivery cost and timing come with the quote.
    - Payment arrangements come with the quote.
    - We are based in Sri Lanka and our prints are made here, with prices in LKR.
  - Mode-aware:
    - Live: describes the WhatsApp request and that nothing is sent until you send it.
    - Preview: "Online ordering opens soon" and no mention of WhatsApp, including the meta description.
    - The PayPal sentence appears only when `paypalOverseas` is on in live mode.
  - `scripts/build.mjs` builds it (24 pages). `scripts/check.mjs` adds it to the verified pages (links, noindex, favicons). This only extends the check.
- **Tests:**
  - A unit test runs live, preview and PayPal on/off. It checks the questions, the absence of any digits in the answers (no prices, days or phone numbers), and the absence of delivery-time and payment-promise words. It also checks the footer link.
  - The browser test follows the footer link to the page. `/faq/` is in the 320–1440px overflow and wide-font sweeps.
- **Local gate:** passed on live and preview builds (re-run after the QA fixes): `npm test` (44 pass), `build` + `check` (24 pages), `browser.mjs`, `images-browser.mjs`.
- **Screenshots checked:** 320, 390 and 1440px (no overflow).
- **QA verdict:** independent read-only review: **PASS WITH FIXES**, now fixed. Every claim was checked against existing site copy, and no new promises were found.
  - Should-fix, fixed: in preview mode the colour/size answer said "ask in the conversation", pointing at a WhatsApp flow that isn't open. It now says "ask in WhatsApp" when live and "use “Ask about a variation” on a design’s page" in preview. The trailing "Please confirm size… before ordering" was dropped, because it put the confirming back on the customer.
  - Nit, fixed: "printed for you after we confirm your order with you" (was "once").
  - Nit, fixed: "We are based in Sri Lanka, and our prints are made here", which echoes the hero's "made in Sri Lanka". "Studio" isn't used elsewhere.
  - Nit, fixed: the PayPal sentence adds the cart's caveat, "We send it in WhatsApp after we confirm your total."
  - Nit, fixed: the promise guard now also bans warranty, returns, exchange, money back, cash, card, COD, express, same-day and "within". There is a new preview + PayPal-on case, and preview is checked for "conversation" as well as WhatsApp and PayPal.
  - Nit, kept: "tap Order on a design" matches the shop-card button label ("Order"). The product page's button reads "Order now on WhatsApp".
  - Verified OK: the footer link on all 24 pages, check/build inclusion (check.mjs only extended), noindex, title and description, heading order and landmarks, layout at 320–1440px and 200% text, banned numbers absent.
- **Waits on owner fact:** none. Delivery and payment answers will pick up items 4 and 5 once their switches are set.

## 4. Delivery line (switch, off by default)

- **Commit:** `2c7b46b`
- **Switch:** `store.delivery` in `data/store.json`, added as `null` (off). To turn it on, set e.g. `{"text": "Islandwide by courier, LKR 500, usually 2–4 working days after printing", "feeLkr": 500}`. `feeLkr` is optional.
- **What changed (only when set):**
  - **Product pages:** a "Delivery" line with the owner's text replaces "Delivery cost and timing are included in your quote." "Confirm size, material, colours and finish before ordering." stays.
  - **Cart summary:** the Delivery row shows the fee (or "Confirmed with your quote" when there is no fee), with the owner's text under it. The closing line becomes "The final total will be confirmed with your quote."
  - **FAQ:** the delivery answer is the owner's text plus "The final total is confirmed with your quote."
  - **Order messages:** when `feeLkr` is set, a separate `Delivery fee: LKR 500` line follows the items subtotal in every order message: cart, product-page Order now (it keeps the live quantity) and card Order.
  - **Not changed:** no total including delivery is computed; the message still asks the owner to confirm delivery cost and the final total.
  - **Published data:** `dist/data/store.json` carries `delivery`.
  - **Validation:** the text must be non-empty and at most 200 characters; the fee must be null or a positive LKR amount with at most 2 decimals. Anything else fails the build. The existing price check now shares the same `validLkr` helper; behaviour is unchanged.
- **Off = unchanged:** with `delivery: null`, every generated HTML page is byte-identical to the item 3 build (diffed). Only `dist/data/store.json` gains `"delivery": null`.
- **Tests:**
  - Unit tests cover normalisation, validation (accepted and rejected shapes), the fee line placement, no change without a fee, Order now / card Order with the fee, the product-page line (escaped), the FAQ answer (and no doubled full stop) and preview.
  - The browser test branches on the published switch: product line and Order now fee, cart text and fee, and the message line; or their absence when off.
- **Local gate:** passed in four states: live with delivery null (the committed state), preview, live with text and fee, and live with text only. Each state ran `npm test` (46 pass), `build` + `check` (24 pages), `browser.mjs` and `images-browser.mjs`. The switched states were temporary local edits, never committed.
- **Screenshots checked:** product page and cart at 390 and 1440px with the example line on. The spacing of the cart note was fixed after the first look.
- **QA verdict:** _in progress_
- **Waits on owner fact:** the delivery line and fee (session C, item 3/5 recommends them). The example text above is the PM's illustration, not an owner fact.

