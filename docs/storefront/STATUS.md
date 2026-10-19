# Storefront features (session B): status

Branch `claude/storefront-features`, branched from `claude/funny-albattani-c5a91a`. Draft PR into `main`, "Storefront features (session B)", for CI only; the PM merges and deploys.

Each item lists its commit, what changed, the local gate, the QA verdict and the owner fact (if any) its switch waits on. "Local gate" means `npm test`, `npm run build && npm run check`, `node tests/browser.mjs` and `node tests/images-browser.mjs`, run against both a live build (the committed `data/store.json`) and a preview build (`mode` temporarily set to `preview` locally, never committed).

| # | Item | Status | Commit |
|---|---|---|---|
| 1 | Order button on shop cards | Done | see §1 |
| 2 | Cart bundle suggestions | Not started | |
| 3 | FAQ page | Not started | |
| 4 | Delivery line (switch) | Not started | |
| 5 | Payment methods (switch) | Not started | |
| 6 | Social links | Not started | |
| 7 | Trust pages | Not started | |
| 8 | Indexing prep | Not started | |
| 9 | Testing and docs | Not started | |

## 1. Order button on shop cards

- **Commit:** _filled in after push_
- **What changed:**
  - `src/domain.mjs`: `orderingOpen(store)` (live mode and a verified number) and `orderNowUrl(p, store, quantity=1)`, built from the existing `orderMessage` and `whatsappUrl`. The product page now uses the same helpers, so its Order now link is unchanged.
  - `src/card.mjs`: `card(p, {store})` adds an **Order ↗** link next to **+ Add** when ordering is open and the design is not unavailable. It is a plain link to `wa.me/94710599815` with the one-design, quantity-1 request message, opens in a new tab, and works without JavaScript. Accessible name: "Order <name> on WhatsApp (opens in a new tab)". Cards rendered without a store, in preview mode, or for unavailable designs are exactly as before.
  - Every card call site passes the store: home, shop, "More from HoneyComb 3D", 404 picks, and in the browser the recently viewed row and the empty-cart picks.
  - `src/styles.css`: `.card-actions` / `.quick-order`. Add and Order share the card row equally; below 375px wide (two cards per row) they stack so nothing overflows at 320px.
- **Tests:** unit tests for the helpers and for live / preview / unverified / unavailable cards; the browser test checks the card link's number, message, quantity 1, new tab (stubbed, nothing reaches WhatsApp) and that the cart is untouched, and checks no Order link in a preview build. The "one link per card" assertion now counts one product link per card, plus the Order link when ordering is open.
- **Local gate:** _see below_
- **Screenshots checked:** shop at 320, 360, 375, 390 and 1440px.
- **QA verdict:** _pending_
- **Waits on owner fact:** none. It follows the existing live-ordering switch (`mode: live`, verified number).
