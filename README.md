# HoneyComb 3D storefront

The recovered storefront is maintained on `codex/storefront-mvp` in this repository, with implementation draft PR [#2](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/pull/2). This continues the existing build; it is not a second application.

A static storefront for HoneyComb 3D / HONEYCOMB™ in Sri Lanka. It includes the homepage, searchable catalogue, seven product pages, a persistent request cart and a custom-print enquiry. Five owner-approved real product photos are available; Classic Kunai and Kurama use photo placeholders until their approved originals are copied into HoneyComb. See [asset provenance](docs/ASSET-PROVENANCE.md).

**Current mode: preview. Orders are not open.** The seven prices come from the owner's chosen Airtable Products source, read 11 October 2026. Availability and catalog approval remain unconfirmed, and the business WhatsApp contact is not verified. There are no sale, compare-at or stock-count claims. It makes no payment, stock, review or delivery promises.

[Protected storefront preview](https://honeycomb3d-storefront-preview-p41x44enh.vercel.app) · [Successful application verification](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/actions/runs/37903006682), both for application commit `8532af3`. See [build status](docs/BUILD-STATUS.md) for the exact deployment, evidence and remaining launch inputs.

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

GitHub Actions separately installs pinned browser-test tooling and runs `tests/browser.mjs` and `tests/images-browser.mjs`. Screenshots and the generated site are retained in its `storefront-check-output` artifact. Test contacts and test prices are used only in fixtures; no WhatsApp message is sent.

## Order requests

The cart saves product IDs and quantities on the visitor’s device. Notes and custom enquiries are not persisted. Visitors review a message before copying it or opening WhatsApp. A WhatsApp handoff opens a prepared request; the visitor must send it, and HoneyComb must confirm the details.

Preview mode disables external WhatsApp handoff. Live mode requires a verified international contact and hides unapproved products. Approved products require original photos and confirmed availability; quote-only pricing is supported. There is no payment processor, order database or inventory integration.

## Source and recovery

- `src/`: page rendering, styles, browser interactions and cart rules.
- `data/`: catalogue and store settings; unknown prices remain `null`.
- `assets/photo-sources/`: metadata-clean source inputs, excluded from served files.
- `assets/image-sources.json`: verified Drive hashes, source dimensions and crop specifications.
- `assets/derivatives.json`: output dimensions, byte counts and SHA-256 hashes.
- `public/assets/`: only 480/960/1440 px product WebP derivatives and a 660 × 198 PNG logo.
- [Build status](docs/BUILD-STATUS.md): current checkpoint, verification and remaining launch inputs.
- [Run and release](docs/RUN-AND-RELEASE.md): configuration, deployment and handoff instructions.
- [Recovery brief](docs/RECOVERY-AND-BUILD-BRIEF.md): historical specification with explicitly unverified claims.
- [Historical WooCommerce README](docs/LEGACY-WOOCOMMERCE-README.md): preserved April evidence. Its payment and stock claims do not describe this implementation.

Claude’s independent QA is in draft PR [#1](https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system/pull/1), on `claude/wizardly-mendel-73bkuw`. The implementation branch does not alter that work or merge into `main`.

## Photo maintenance

The checked-in derivatives keep the normal Node build dependency-free. To regenerate them, install Pillow 11.3.0 and run `python scripts/prepare-images.py`; this also regenerates the provenance document. `npm run check` verifies all source/output hashes, metadata removal, intrinsic dimensions, responsive candidates and image budgets, and prevents source files or unused originals from entering `dist/`. Mobile browser checks measure every page at 390 px and DPR 3.
