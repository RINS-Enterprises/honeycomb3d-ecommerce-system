# Run and release

Requirements: Node.js 22 or newer. No application dependencies are required.

    npm ci
    npm test
    npm run build
    npm run check
    npm start

Open http://127.0.0.1:4173. npm run dev builds once and serves; it does not watch source changes.

GitHub Actions also installs Playwright 1.56.1 without changing the lockfile and runs tests/browser.mjs. Its output artifact contains static dist/ and desktop/mobile screenshots. These tests cover a fixture WhatsApp URL; they never send messages.

## Catalogue

Edit data/products.json, preserving IDs and slugs. Keep unknown prices null. Prices are positive LKR amounts with up to two decimal places. Never use zero to mean unknown. Supported availability: unconfirmed, available, unavailable, made-to-order.

Place original product photos in public/assets/. Set image to /assets/filename.webp (or png/jpg/jpeg) and provide descriptive imageAlt. Do not replace actual products with AI-generated pictures or screenshot crops. Record provenance in source. Set approved only after the owner verifies the entry.

## Contact and live mode

Confirm the current business contact. Set whatsappNumber to international digits only (no plus/spaces), whatsappVerified to true, and mode to live in data/store.json. Every approved live product must have its original photo and confirmed availability. Test with the real contact without sending an order unless requested.

Preview uses noindex and disables external WhatsApp handoff. This is an indexing hint, not access control: keep preview hosting private if its contents should not be public.

## Hosting

Deploy dist/ on a static host that supports directory index routes and a real 404 status for missing paths. vercel.json specifies the build output and security headers. An isolated preview project already exists: `honeycomb3d-storefront-preview`, project `prj_gpsHMSC2HZWoBOrx79ypk36O2rsS`, team `team_dErX7uzTIgpWT6SY1Syo3uxr`. Its initial deployment served the older `2260c7f` checkpoint. Consult BUILD-STATUS.md for the current tested deployment; do not create a second application or overwrite the business domain. Do not use a SPA wildcard that turns missing products into HTTP 200.

Apply the same CSP and other headers as scripts/serve.mjs when using another host. Revalidate HTML/data rather than retaining old prices indefinitely. Use HTTPS. Keep custom domain/DNS changes separate from preview deployment. Confirm the hosting plan permits the intended commercial use before launch.

The former WooCommerce README is preserved in docs/LEGACY-WOOCOMMERCE-README.md. Its integrations are historical evidence, not active behavior. README.md describes this storefront.

## Remaining human checks before opening orders

Original logo and all seven photos have been restored, and desktop/mobile Chromium screenshots have been reviewed. Remaining human checks: approval of product identity and draft descriptions; current products, prices or quote-only policy and availability; business WhatsApp; actual delivery/payment/return terms; real-phone WhatsApp opening and assistive-technology review. Firefox and Safari have not been tested. A static page build does not verify any payment or order backend.

## Continue safely in a new chat

Use `RINS-Enterprises/honeycomb3d-ecommerce-system` and `codex/storefront-mvp`. Read BUILD-STATUS.md and inspect the latest remote commit before editing. Clone separately; do not depend on another chat’s temporary files. Claude’s actual QA branch is `claude/wizardly-mendel-73bkuw`, with draft PR #1. Implementation draft PR #2 already exists. Do not create a duplicate PR/application, edit Claude’s branch, force-push or merge into main.

If a terminal lacks GitHub credentials but the GitHub connection permits writes, publish through that connection, then fetch and verify the branch head. Reject a changed expected head and reconcile it before retrying. Do not call a local commit “pushed” until the remote has been read back.

If all remote write routes fail, keep local commits and export a complete source archive:

```sh
git archive --format=zip --prefix=honeycomb3d-storefront/ --output=../honeycomb3d-storefront-source.zip HEAD
```

The archive includes source, original assets, data, tests and documentation. It excludes generated dist/ and credentials. Run the local commands above after extracting it. This is a source export, not an EasyWP/WordPress files-and-database backup.
