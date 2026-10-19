# HoneyComb 3D storefront

A static storefront for HoneyComb 3D / HONEYCOMB™, a 3D-print studio in Sri Lanka, live at [honeycomb3d.store](https://honeycomb3d.store).

It includes:
- a homepage and a searchable catalogue of 17 approved designs, each with its own product page;
- a persistent request cart;
- a custom-print enquiry;
- an FAQ.

**Mode: live.** Visitors send order requests through WhatsApp to the business number, and HoneyComb confirms availability, options, delivery, the final total and payment before anything is a purchase. Prices are in LKR. There are no sale, compare-at or stock-count claims, and the site makes no payment, stock, review or delivery promises of its own. Delivery, payment methods, social links and the Shipping/Returns/About pages are switches that stay off until the owner gives those facts. Search engines are kept out (`noindex`) until the owner decides otherwise.

Work is split across Claude sessions; see the [session plan](docs/pm/SESSIONS-PLAN.md). The PM session merges into the release branch `claude/funny-albattani-c5a91a` and is the only one that deploys. See [build status](docs/BUILD-STATUS.md) for what the site does and which owner facts are pending, and [run and release](docs/RUN-AND-RELEASE.md) for commands, fixtures and the release flow.

## Run locally

Requires Node.js 22 or newer. No application dependencies.

```sh
npm ci
npm test
npm run build
npm run check
npm start
```

Open http://127.0.0.1:4173. `npm run dev` builds once and serves; it does not watch for edits. The generated site is in `dist/`.

`npm run gate` runs the unit tests, build, checks and both browser tests (see [run and release](docs/RUN-AND-RELEASE.md) for the Playwright setup and the preview / all-switches-on fixtures). GitHub Actions separately installs pinned browser-test tooling and runs `tests/browser.mjs` and `tests/images-browser.mjs`. Screenshots and the generated site are retained in its `storefront-check-output` artifact. Test contacts and test prices are used only in fixtures; no WhatsApp message is sent.

## Order requests

The cart saves product IDs and quantities on the visitor’s device. Notes and custom enquiries are not persisted. Visitors review a message before copying it or opening WhatsApp. A WhatsApp handoff opens a prepared request; the visitor must send it, and HoneyComb must confirm the details.

Order requests can also start from "Order now on WhatsApp" on a product page or "Order" on a product card; both open the same kind of prepared message for one design. Preview mode disables external WhatsApp handoff. Live mode requires a verified international contact and hides unapproved products. Approved products require original photos and confirmed availability; quote-only pricing is supported. There is no payment processor, order database or inventory integration.

## Source and recovery

- `src/`: page rendering, styles, browser interactions and cart rules.
- `data/`: catalogue and store settings; unknown prices remain `null`.
- `assets/photo-sources/`: metadata-clean source inputs, excluded from served files.
- `assets/image-sources.json`: verified Drive hashes, source dimensions and crop specifications.
- `assets/derivatives.json`: output dimensions, byte counts and SHA-256 hashes.
- `public/assets/`: only the generated photo derivatives and logo files referenced by the build.
- `tests/fixtures/`: store patches for testing preview and switched-on states (`STORE_PATCH`); never used for release builds.
- [Build status](docs/BUILD-STATUS.md): current checkpoint, verification and remaining launch inputs.
- [Run and release](docs/RUN-AND-RELEASE.md): configuration, deployment and handoff instructions.
- [Recovery brief](docs/RECOVERY-AND-BUILD-BRIEF.md): historical specification with explicitly unverified claims.
- [Historical WooCommerce README](docs/LEGACY-WOOCOMMERCE-README.md): preserved April evidence. Its payment and stock claims do not describe this implementation.

## Photo maintenance

The checked-in derivatives keep the normal Node build dependency-free. To regenerate them, install Pillow 11.3.0 and run `python scripts/prepare-images.py`; this also regenerates the provenance document. `npm run check` verifies all source/output hashes, metadata removal, intrinsic dimensions, responsive candidates and image budgets, and prevents source files or unused originals from entering `dist/`. Mobile browser checks measure every page at 390 px and DPR 3.
