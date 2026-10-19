# HoneyComb storefront build status

Updated 19 October 2026 by the storefront features session (session B). This file describes what the code and data on the release line do today. Deployments, release evidence and owner decisions live in the PM's [project register](pm/PROJECT-REGISTER.md); the session plan is in [SESSIONS-PLAN.md](pm/SESSIONS-PLAN.md). The previous version of this file, last current on 13 October 2026, is in git history.

## Where the code lives

- **Release branch:** `claude/funny-albattani-c5a91a`. Only the PM session merges into it and deploys from it.
- **Feature work:** session branches with their own draft PRs into `main`, for CI only. Storefront features are on `claude/storefront-features` (PR #8). Per-item status, commits, QA verdicts and the owner facts each switch waits on are in [storefront/STATUS.md](storefront/STATUS.md).
- **`codex/storefront-mvp`:** the original builder branch. It is not where current work happens.

## What the site does

- **Mode:** `live`. Order requests go to the business WhatsApp, 94710599815 (`whatsappVerified: true`). Visitors review a prepared message and send it themselves; nothing is a confirmed purchase until the details are agreed.
- **Catalogue:** 18 products in `data/products.json`. The 17 with an owner-approved photo are shown. All 17 are "Made to order", and all have an LKR price. Categories: Keychains, Figures, Props, Bookmarks, Desk Organizers.
- **Pages:**
  - Home, shop (search, category and theme filters, sort), one page per product, request cart, custom-print enquiry, FAQ (`/faq/`), privacy, and 404.
  - Shipping, Returns and About are built only when the owner has written them (see below).
- **Ordering paths:** the request cart (with notes); "Order now on WhatsApp" on product pages and their sticky bar; and a one-tap "Order" on every product card. All three use the same message format and number.
- **Cart extras:**
  - "Goes well with your request": up to three designs sharing the cart's themes, at catalogue prices.
  - Recently viewed designs.
  - A few picks when the cart is empty.
- **Search engines:** kept out. `searchIndexing` is `false`, so every page is `noindex,nofollow`. `robots.txt` admits only link-preview crawlers, and there is no sitemap or breadcrumb data.

## Owner-fact switches in `data/store.json`

Each switch is off in the committed data. With a switch off, the site is exactly as it was before that feature (checked by diffing the built pages).

| Key | Off value | When the owner sets it |
|---|---|---|
| `paypalOverseas` | `false` | The cart offers payers outside Sri Lanka a PayPal link in USD, which the owner sends after confirming the total. The privacy page and FAQ mention it. |
| `delivery` | `null` | `{"text": "…", "feeLkr": 500}` (`feeLkr` optional). The owner's line shows on product pages, in the cart summary and in the FAQ. A fee becomes its own "Delivery fee" line in every order message. No total including delivery is computed. |
| `paymentMethods` | `[]` | Names such as `"Bank transfer"`, or the ids `lankaqr`, `bank-transfer` and `cash-on-delivery`, which show as "LankaQR", "Bank transfer" and "Cash on delivery". The live cart offers an optional choice that adds "Preferred payment: …" to the request. With `paypalOverseas` on, PayPal becomes one of the choices. The FAQ names the methods. |
| `paymentNote` | `null` | The owner's line under the cart's payment choice. It is shown only when methods are set; otherwise the cart says "Payment arrangements are confirmed with your quote". |
| `social` | `[]` | `[{"label": "Instagram", "url": "https://…"}]`. The footer gains a Follow column. https links only. |
| `pages` | `{"shipping": null, "returns": null, "about": null}` | The owner's text for a key builds `/shipping/`, `/returns/` or `/about/` and links it in the footer. Blank lines separate paragraphs. |
| `searchIndexing` | `false` | Owner decision D-12. When true, public pages lose `noindex` (the cart and 404 keep it), `robots.txt` allows crawling and points to `sitemap.xml`, the sitemap lists the public pages, and product pages carry BreadcrumbList data. It requires an https `siteUrl`. A canonical link for filtered shop URLs is left for the indexing launch (W-10). |

Every value is validated at build time; a malformed value fails the build instead of shipping.

## Verification

- **Unit tests:** `npm test` runs domain, catalogue, render and store-loader tests.
- **Build checks:** `npm run build && npm run check` verifies every generated page, local link and asset, image budgets and hashes, the font and favicons, `noindex` and the sitemap in both indexing states, and trust pages in both states. It also scans the output for the banned phone numbers in common formats, and checks that every shipped browser module parses without newer syntax such as the regex `v` flag, so older Safari still runs the site.
- **Browser tests:** `tests/browser.mjs` (layouts at 320/390/768/1440 px, catalogue, cart, all ordering paths, FAQ, switches, 404, network failure, no page errors) and `tests/images-browser.mjs` (mobile image decoding and budgets). They follow whatever state was built.
- **Fixtures:** `npm run gate:preview`, `npm run gate:all-on` and `npm run gate:proposal` (session C's proposed delivery and payment values) build and test the preview state and every switch on, using fixtures in `tests/fixtures/`, without editing `data/`. `npm run check:indexing` builds and checks the indexing-on state. See [RUN-AND-RELEASE.md](RUN-AND-RELEASE.md).

## Still waiting on the owner

These are the facts the switches above wait for. The PM's register §5 is the master list.

- The delivery line and fee, and the payment methods accepted. Session C's proposed values are in `docs/business/OWNER-DECISIONS.md` on its branch, and `tests/fixtures/store-session-c-proposal.json` holds them for testing; they stay off in `data/` until the owner replies.
- Social accounts the owner controls.
- Shipping, returns and about text.
- Whether and when to allow search indexing (D-12).
- Whether to turn on PayPal for overseas payers, after a test payment arrives.
- Real-phone check of the WhatsApp handoff. Firefox and Safari have not been tested by this session.
