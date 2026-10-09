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

Deploy dist/ on a static host that supports directory index routes and a real 404 status for missing paths. vercel.json specifies the build output and security headers, but no Vercel project or deployment has been created. Do not use a SPA wildcard that turns missing products into HTTP 200.

Apply the same CSP and other headers as scripts/serve.mjs when using another host. Revalidate HTML/data rather than retaining old prices indefinitely. Use HTTPS. Keep custom domain/DNS changes separate from preview deployment. Confirm the hosting plan permits the intended commercial use before launch.

The current README describes the historical WooCommerce site. Its integrations are not the implementation or deployment status of this branch.

## Remaining human checks before opening orders

Original brand/photo approval; current products, prices or quote-only policy and availability; business WhatsApp; actual delivery/payment/return terms; real-phone WhatsApp opening; desktop/mobile visual review and assistive-technology review. A static page build does not verify any payment or order backend.
