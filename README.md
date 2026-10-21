# HoneyComb 3D storefront

The storefront for HoneyComb 3D / HONEYCOMB™, a 3D-print studio in Sri Lanka, live at [honeycomb3d.store](https://honeycomb3d.store).

Visitors browse a catalogue of made-to-order prints (keychains, figures, props, bookmarks, desk organisers), build a request cart, and send the request to the business on WhatsApp. HoneyComb confirms availability, options, delivery, the final total and payment before anything is a purchase. Prices are in LKR.

> **The code is not on `main` yet.** The live site is built and deployed from the release branch
> [`claude/funny-albattani-c5a91a`](../../tree/claude/funny-albattani-c5a91a) (draft PR #4).
> `main` will carry it once the owner merges that branch. Until then, check out the release branch to work on the site.

## Where things live

| Branch | What it holds |
|---|---|
| `claude/funny-albattani-c5a91a` | **Release branch.** Storefront source, data, tests, CI and the PM register. Production deploys from here. |
| `claude/storefront-features` | Storefront feature work, merged into the release branch |
| `claude/payments-delivery` | Payment, delivery and business-registration research (`docs/business/`) |
| `claude/brand-marketing` | Brand guide and launch/marketing kit (`docs/marketing/`) |
| `claude/ops-automations` | MakerWorld → Google Drive tool (`ops/`) and QA tooling (`qa/`) |
| `claude/qa-review` | Repository QA report ([`docs/qa/QA_REPORT.md`](docs/qa/QA_REPORT.md)) |

The full branch map, with open PRs, is in the [QA report](docs/qa/QA_REPORT.md#branch-map-as-of-2026-10-21).

## Setup and run

Requires Node.js 22 or newer. The site has no application dependencies.

```sh
git checkout claude/funny-albattani-c5a91a
npm ci
npm test         # unit tests
npm run build    # static site into dist/
npm run check    # verifies pages, links, images and budgets
npm start        # serves dist/ at http://127.0.0.1:4173
```

`npm run gate` also runs the Playwright browser tests. The release branch's `docs/RUN-AND-RELEASE.md` covers Playwright setup, test fixtures and the owner switches in `data/store.json`.

## Deploy

The site is static, hosted on Vercel (`vercel.json`: build `npm run build`, output `dist/`). Production is deployed from the release branch's head, only after CI passes and an independent QA review. Every release is recorded in `docs/pm/PROJECT-REGISTER.md` §7 on that branch. No secrets are needed to build. The only environment variables are optional: `PORT` for `npm start`, and `STORE_PATCH`, which applies a test fixture and is never used for release builds. That is why there is no `.env.example`.

## History

Until October 2026 the domain ran a WooCommerce site. Its April 2026 portfolio write-up is kept in [docs/LEGACY-WOOCOMMERCE-README.md](docs/LEGACY-WOOCOMMERCE-README.md), along with the screenshots (`*.png`) at the repo root. Its payment, stock and review claims do **not** describe the current site.
