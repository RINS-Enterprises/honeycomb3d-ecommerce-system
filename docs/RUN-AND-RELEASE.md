# Run and release

Requires Node.js 22 or newer. There are no application dependencies.

    npm ci
    npm test
    npm run build
    npm run check
    npm start

Open http://127.0.0.1:4173. `npm run dev` builds once and serves; it does not watch source changes. The generated site is in `dist/`.

## Local gate

Run this before pushing any change:

    npm run gate            # npm test, build, check, then both browser tests

The browser tests need Playwright and Chromium:

- **In CI**, Playwright 1.56.1 is installed without changing the lockfile.
- **In a Claude cloud session**, link the preinstalled copy instead: `ln -s /opt/node-tools/node_modules/playwright node_modules/playwright`, and the same for `playwright-core`.
- **Port:** nothing else may be listening on port 4173, because the tests start their own server there.

The tests use fixture WhatsApp numbers or stub the WhatsApp tab; they never send a message.

## Switch states without editing data

The browser tests follow whatever state was built, so a change behind a switch is tested in each state. Fixtures in `tests/fixtures/` are merged over `data/store.json` for one build through the `STORE_PATCH` environment variable. `data/` is never edited.

    npm run gate:preview    # mode: preview (ordering closed)
    npm run gate:all-on     # PayPal, delivery line and fee, payment methods, a social link, all three trust pages
    npm run gate:proposal   # session C's proposed delivery line (LKR 400) and payment methods, as the owner would set them
    npm run check:indexing  # searchIndexing on: robots.txt, sitemap and breadcrumb data (build and check only)

The all-on fixture's texts say "Test fixture… not an owner fact" so they cannot pass for real copy. The proposal fixture holds session C's proposed values; they are not owner facts until the owner replies. A fixture build prints `Store patch (test fixture, not for release)`. After running one, run `npm run build` again before looking at `dist/` as the real site. The loader enforces two guards: `STORE_PATCH` accepts only files in `tests/fixtures/`, and it fails the build outright on Vercel (where `VERCEL` is set). A fixture therefore cannot reach production even if the variable is set there by mistake.

## Store settings (`data/store.json`)

- **Ordering:** `mode` (`preview` or `live`), `whatsappNumber` (international digits only, no plus or spaces) and `whatsappVerified`. Live mode requires a verified number, and every approved product needs its original photo and confirmed availability.
- **Owner-fact switches:** `paypalOverseas`, `delivery`, `paymentMethods` (with `paymentNote`), `social` and `pages` stay off until the owner gives the fact. [BUILD-STATUS.md](BUILD-STATUS.md) describes the exact shape of each and what it changes. Change them only when the owner has given that fact, and record the decision in the PM's register.
- **`searchIndexing`:** a separate owner decision (D-12), independent of ordering. It requires an https `siteUrl`.

The build validates all of these and fails on a malformed value.

The business WhatsApp is 94710599815. `scripts/check.mjs` fails the build if any of the banned numbers (a former partner's two numbers and a mistyped copy of the business number) appear in the output in common formats (spaces, dashes, dots, percent-encoding or HTML entities between digits). Never weaken that check.

## Catalogue

Edit `data/products.json`, preserving IDs and slugs.

- **Prices:** keep unknown prices `null`; never use zero to mean unknown. Prices are positive LKR amounts with up to two decimal places.
- **Availability:** `unconfirmed`, `available`, `unavailable` or `made-to-order`.
- **Approval:** set `approved` only after the owner verifies the full entry.

Keep photo source inputs outside `public/`, under `assets/photo-sources/`.

1. Verify the original's SHA-256 before removing non-rendering metadata.
2. Record the hashes, source ID, orientation and crop in `assets/image-sources.json`.
3. Generate derivatives with `python scripts/prepare-images.py` (Pillow 11.3.0). It writes real dimensions and srcset variants into the catalogue and records every output hash in [ASSET-PROVENANCE.md](ASSET-PROVENANCE.md).

Only derivatives referenced by the visible catalogue are copied into `dist/`. Do not use AI-generated product photos.

## Release

The flow below is the one in [SESSIONS-PLAN.md](pm/SESSIONS-PLAN.md). The PM records each deployment in the [project register](pm/PROJECT-REGISTER.md) §7. The gate text there predates the session plan (it still names `codex/storefront-mvp` and a QA deployer), so follow the session plan where they differ.

1. A session works on its own branch and opens a draft PR into `main`, so the "Storefront checks" workflow runs. Sessions never merge their own PR and never push to another session's branch.
2. The PM session runs an independent QA review. The session fixes the findings.
3. The PM merges into the release branch `claude/funny-albattani-c5a91a`, runs the full gate, and waits for green CI.
4. The PM deploys to production and verifies the live site. Only the PM deploys, and never a commit whose CI is red.

## Hosting

Deploy `dist/` on a static host that supports directory index routes and a real 404 status for missing paths. Do not use a SPA wildcard that turns missing products into HTTP 200.

- **Vercel:** `vercel.json` sets the build command, the output directory and the security headers. The Vercel project is `honeycomb3d-storefront-preview` (`prj_gpsHMSC2HZWoBOrx79ypk36O2rsS`, team `team_dErX7uzTIgpWT6SY1Syo3uxr`), aliased to `honeycomb3d.store`. Do not create a second project or change DNS outside the PM session.
- **Another host:** apply the same CSP and other headers as `scripts/serve.mjs`.
- **Caching and transport:** revalidate HTML and data rather than keeping old prices indefinitely, and use HTTPS.

## Continue safely in a new session

- **Start from the plan:** read [SESSIONS-PLAN.md](pm/SESSIONS-PLAN.md) for your lane: the branch, the files you own and what you may not touch.
- **Check the state:** read the register and this folder's status files, and inspect the latest remote commit before editing.
- **Don't depend on old sessions:** clone fresh, and don't rely on another session's temporary files.
- **Never** force-push, rewrite another session's history, merge your own PR, deploy, or change DNS or indexing from a feature session.

If all remote write routes fail, keep the local commits and export a source archive:

```sh
git archive --format=zip --prefix=honeycomb3d-storefront/ --output=../honeycomb3d-storefront-source.zip HEAD
```

The archive includes source, original assets, data, tests and documentation. It excludes the generated `dist/` and credentials.

The former WooCommerce README is preserved in [LEGACY-WOOCOMMERCE-README.md](LEGACY-WOOCOMMERCE-README.md) as historical evidence; its integrations are not active.
