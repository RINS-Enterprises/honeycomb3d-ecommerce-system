# Build status

Branch: codex/storefront-mvp. Updated 2026-10-09. Checkpoint 2: complete storefront source, pending execution checks.

## Architecture

Node.js 22+ produces static HTML for home, shop, seven recovered product routes, cart, custom enquiry, data-handling notice and 404. Browser ES modules enhance these pages. There are no runtime packages, external fonts or remote scripts. Public catalogue and contact configuration live in data/*.json. Output is dist/.

This is an order-request storefront, with no order database, payment processor or inventory integration. A future checkout must add server-authoritative prices and inventory, payment webhooks and order lifecycle handling.

## Implemented

- Responsive dark/gold storefront with text branding and abstract decorative artwork.
- Pre-rendered product pages, original-photo slots with explicit missing-photo states.
- Search/category filters, URL parameters, reset and no-results state.
- Cart quantity changes, removal, storage recovery and browser persistence.
- Explicit unknown pricing; no zero-price/free implication for products awaiting quotes.
- Readable request preview, clipboard fallback and verified-contact WhatsApp gate.
- Custom enquiry with reference link, quantity, size and finish; preview before external handoff.
- Labels, skip link, native controls, keyboard focus, no-JS guidance and data-fetch failure state.
- Static server with real 404s and security headers; portable build plus Vercel configuration.
- Domain tests, generated-link checks and Playwright functional smoke tests in tests/. Claude-owned qa/ files are untouched.

## Data and launch blockers

All seven seeds remain unapproved, with null prices/photos and unconfirmed availability. Only HNYCMB501 is a recovered SKU; HC-* identifiers are new stable references. Source logo is missing. Neutral photo placeholders are not substitutes for original photos.

The public store remains in preview mode with noindex. No WhatsApp handoff is enabled until both live mode and a verified international contact are configured. Live output filters unapproved products and fails validation if approved products lack photos/confirmed availability. Price-on-enquiry remains supported.

Business shipping, returns, payment terms and contact confirmation remain outstanding. The data-handling page describes implemented behavior, not an invented business policy. No reviews, stock counts, discounts, payment badges or delivery promises have been invented.

## Verification and access

Repository read access and push permission verified through GitHub. Existing draft PR #2 and implementation branch resumed. Shell execution currently fails before launching due to the Windows managed-network sandbox backend; no local build or browser run is claimed.

In-memory JavaScript rendering successfully generated 12 normal pages, with no undefined/NaN values and preview noindex present. A GitHub Actions workflow is included to run Node tests, the real build, link checks and Chromium flows. Its actual outcome will be recorded after execution.

Claude's docs/QA-FINDINGS.md on claude/wizardly-mendel-73bkuw was read. It contains recovery findings, not an implementation review. Addressed in scope: contact gating, current-data separation, neutral placeholders, no unsupported commerce claims and actual catalogue-derived categories. No Claude branch or QA file was changed.

## Next checkpoint

Run CI, address failures, inspect generated screenshots if available, and record exact results. Recover original logo/photos and confirm sale-ready data before any public launch. No deployment or domain/account changes have occurred.
