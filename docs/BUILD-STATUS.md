# Build status

Updated 9 October 2026. Implementation: `codex/storefront-mvp`, draft PR #2, repository `RINS-Enterprises/honeycomb3d-ecommerce-system`.

## Current state

The storefront continues the existing application. The recovery checkpoint found at the start of this continuation was `8255a96`, which already contained the core storefront and the original assets. The previous chat’s temporary filesystem was not used. No separate attachment was available in this workspace; the checked-in recovery brief and asset provenance supplied the handoff.

The current implementation includes:

- Responsive homepage with recovered HoneyComb branding and a real product hero.
- Searchable catalogue with category filters, URL state and an empty-results view.
- Seven product-detail pages using the original supplied product photographs.
- Persistent request cart, quantity changes/removal and explicit unknown-price handling.
- Cart notes, readable request preview, copy fallback and gated WhatsApp handoff.
- Custom-print enquiry with reference link, quantity, size and finish; no uploads or automatic sending.
- Data-handling notice, keyboard skip link, labelled controls, real 404 and data-load failure handling.
- Static build, local server, Vercel security configuration and GitHub Actions browser verification.

Architecture remains Node.js 22+ static HTML and browser ES modules, with structured catalogue/configuration in `data/`. There are no application dependencies, payment integration, order database or inventory connection.

## Recovery and QA changes in this continuation

Claude’s actual QA branch is `claude/wizardly-mendel-73bkuw` at `51964cb`, draft PR #1. The proposed `claude/recovery-qa` branch was absent. Its findings were read; its branch and files were not changed. Claude’s previous sign-off was for `2260c7f`, before original assets were integrated.

| Finding | Resolution |
| --- | --- |
| I-9: duplicate accessible product links | Image link is excluded from keyboard/screen-reader traversal; the named heading link remains. |
| I-10: WhatsApp instructions when handoff is disabled | Handoff instructions appear only when a verified live WhatsApp link exists. Preview custom-enquiry guidance explains copying instead. |
| I-11: internal workflow metadata in public data | Copy approval state and asset recovery filenames are omitted from public JSON; product approval remains for client-side filtering. |
| I-13: preview notice outside landmarks | The notice is a labelled complementary landmark. |
| I-14: catalogue heading order | Shop card titles are h2; home/related cards remain h3 under their h2 sections. |
| Additional: hard-coded Kurama hero creates a dead link after live filtering | The hero selects only a visible product; an empty catalogue uses a decorative fallback with no product link. |
| Chromium could not decode the 8,334 × 8,334 original logo | Added a crop of its empty white margins; artwork pixels and original file are preserved. See ASSET-PROVENANCE.md. |

Original logo and all seven photos are recovered. Product images remain unchanged. Current sale approval, prices and availability remain unconfirmed; recovering photos did not approve the catalogue.

## Access and saved progress

Read access was verified through GitHub and a separate clone. The GitHub connection reported write permission. The terminal’s dry-run push failed because it has no GitHub credentials; the connected GitHub write route successfully committed and advanced only `codex/storefront-mvp`. Each update used the prior head as a guard and was fetched back into the clone. No force push or main merge occurred.

Continuation commits:

- `94291ad`: recovery QA fixes, live-visible hero, public metadata cleanup and expanded browser checks.
- `0f8b5fb`: load-aware image checks with explicit failing asset diagnostics.
- `8532af3`: browser-compatible logo crop with original/pixel provenance.

## Verification

- Local `npm test`: 13/13 passed.
- Local `npm run build` and `npm run check`: 13 pages, local links and assets passed.
- Claude domain-contract suite, run read-only from its separate QA worktree against the implementation: 13/13 passed.
- Isolated live build fixtures: one approved non-Kurama product (7 pages) and no approved products (6 pages) passed build/link checks. Test-only contact values were never deployed.
- Local browser execution unavailable: the browser package download failed. Browser checks use GitHub Actions instead.
- GitHub Actions Chromium verification for application commit `8532af3`: passed in [run 37903006682](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/actions/runs/37903006682). The run also passed all 13 implementation tests and the 13-page build/link checks.
- Browser checks passed for original image decoding, accessible product links/heading order/preview landmark, search and category filters, cart persistence/quantity/removal, unknown pricing, custom enquiries, a mixed-price WhatsApp request fixture, keyboard skip link, 404, network failure and no page errors. Layouts passed at 320, 390, 768 and 1440 pixels. No message was sent.
- Desktop/mobile screenshot review passed for the homepage, catalogue, product details and cart; the custom-enquiry mobile view also passed. Original imagery remains legible and proportional, with no observed clipping or fabricated sales information.
- The successful CI artifact's generated `dist/` matches the locally verified output byte for byte. All eight recovered source images also match recovery commit `8255a96` byte for byte. The separate logo crop preserves the corresponding original artwork pixels.

The first two continuation browser runs correctly failed at image decoding. The diagnostic rerun identified the original logo, leading to the preserved-artwork crop. These failed runs are not counted as successful browser verification.

## Hosted preview

An isolated Vercel project already exists: `honeycomb3d-storefront-preview`, project `prj_gpsHMSC2HZWoBOrx79ypk36O2rsS`, team `team_dErX7uzTIgpWT6SY1Syo3uxr`.

At recovery inspection, its READY deployment `dpl_5vAADCgWroCeU2zeD6iYrP8Eonx8` served `2260c7f`, without recovered photos. Vercel labelled that initial deployment production inside the isolated preview project. It was not the business domain.

The tested application commit `8532af3e6c685420786506b1954f98a3255eefc1` is now deployed as READY preview `dpl_DffNN11Xs8mgkwAx48rwVy9MYcdj`:

[Protected storefront preview](https://honeycomb3d-storefront-preview-p41x44enh.vercel.app)

Authenticated live responses passed for `/`, `/shop/`, `/products/baymax-figure/`, `/cart/`, `/custom/` and both catalogue/configuration JSON routes (HTTP 200); an unknown route returned HTTP 404. Deployed CSP is present on these responses. The homepage also returned `X-Robots-Tag: noindex`, the noindex/nofollow meta tag, `nosniff`, `Referrer-Policy: no-referrer`, and revalidating cache headers. Hosted configuration remains preview mode and includes the seven unapproved products without internal copy/asset-recovery metadata.

Deployment Protection remains enabled. The older stable project production alias was not promoted to this preview. No business-domain, DNS, main-branch or live-ordering changes were made. Later documentation-only commits do not alter the deployed application code.

## What still blocks opening orders

`data/store.json` remains in preview mode, with `whatsappVerified: false` and no contact. All products remain `approved: false`, `priceLkr: null` and `availability: unconfirmed`. The site is noindex and external order requests are disabled.

The owner still needs to confirm the current business WhatsApp number, catalogue/description approval, availability, current prices or an explicit quote-only policy, and delivery/payment/return terms. The historical contact `94703009064` is recovery evidence, not current verification. There is no verified mailbox or recovered complete business policy text. A contact page remains deferred (Claude I-12).

A real-phone WhatsApp opening and human screen-reader check remain manual. No real request or payment was sent. The old EasyWP files/database backup remains unrecovered; changing business DNS is outside this continuation.

Run and continuation instructions: RUN-AND-RELEASE.md. Historical WooCommerce claims are preserved separately in LEGACY-WOOCOMMERCE-README.md.
