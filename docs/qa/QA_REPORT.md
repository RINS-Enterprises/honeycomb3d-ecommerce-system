# QA report: honeycomb3d-ecommerce-system

Visiting QA review, 2026-10-21, branch `claude/qa-review` (cut from `main` @ `c78e12f`).
Scope: every branch and open PR in the repository, not just `main`.

## 1. Summary

HoneyComb 3D (brand HONEYCOMB™) is a small 3D-print studio in Sri Lanka selling printed keychains, figures, props, bookmarks and desk organisers. This repository is the source of its storefront, live at <https://honeycomb3d.store>, plus the business, marketing, ops and QA work around it. It is for the owner (as the business's site and working record) and for visitors (as the shop). **It works, but not from `main`.** `main` holds only an April 2026 portfolio README describing a former WooCommerce site and four screenshots of it. The real product is a dependency-free Node.js static storefront on the unmerged release branch `claude/funny-albattani-c5a91a`. On that branch the unit tests (63/63), build (24 pages) and output checks pass. It is the version deployed to production on Vercel; the live site's `<title>` and `noindex` tag match it.

## 2. Status

**Active.** The last commit was 2026-10-20 (`02aed36`, release branch). More than 200 commits landed between 2026-10-08 and 2026-10-20 across 11 branches and 8 draft PRs, all coordinated by a "PM" Claude session. `main` itself is **stale**: its last commit (`c78e12f`) is from 2026-04-19.

## 3. Stack & architecture

- **Storefront** (release branch): Node.js ≥ 22, with no runtime dependencies. `scripts/build.mjs` renders HTML from `data/products.json` and `data/store.json` into `dist/`. The browser side is plain ES modules plus CSS. Ordering goes through prepared WhatsApp messages: there is no payment processor, order database or inventory system. Unconfirmed business facts (delivery, payment methods, social links, trust pages, PayPal, search indexing) sit behind "owner switches" in `data/store.json`. Hosting is Vercel (`vercel.json`), with a strict CSP and security headers.
- **Images:** a Python and Pillow pipeline (`scripts/prepare-images.py`) produces committed AVIF derivatives, with provenance and hashes stored in `assets/*.json`.
- **Tests:** `node --test` unit tests, a build-output checker (`scripts/check.mjs`) and Playwright browser tests. GitHub Actions runs them in `.github/workflows/storefront.yml`.
- **Ops** (`claude/ops-automations`): a Google Apps Script web app plus a bookmarklet that copies MakerWorld models into Google Drive (`ops/makerworld-to-drive/`). It has mock tests and has not been installed yet.
- **QA tooling** (`claude/recovery-qa` line): `qa/` holds e2e smoke tests, an axe audit, image provenance checks, a secret scan and per-commit results.
- **Docs only:** business research (`claude/payments-delivery`, `docs/business/`) and a marketing kit (`claude/brand-marketing`, `docs/marketing/`).

### Branch map (as of 2026-10-21)

| Branch | PR | Role | Contained in |
|---|---|---|---|
| `main` | – | Stale portfolio README and screenshots | everything |
| `codex/storefront-mvp` | #2 | Original builder branch (superseded) | release line |
| `handoff/storefront-ux-and-catalogue-builder` | – | Handoff note | release line |
| `claude/storefront-features` | #8 | Session B features | release branch |
| **`claude/funny-albattani-c5a91a`** | #4 | **Release branch, deployed** | – (tip) |
| `claude/payments-delivery` | #6 | Session C docs | – (tip) |
| `claude/brand-marketing` | #7 | Session D docs | – (tip) |
| `claude/wizardly-mendel-73bkuw` | #1 | QA runs 1–3 | ops line |
| `claude/recovery-qa` | #3 | QA runs 4–6 and asset audit | ops line |
| `claude/handoff-recovery-qa-deploy-makerworld` | – | Handoff note | ops line |
| `claude/ops-automations` | #5 | Session A ops tool | – (tip) |
| `claude/photo-handoff` | – | **Orphan** (no shared history), product photos | – |

There are five live tips (release, payments, brand, ops, photo-handoff), and none is merged into `main`.

## 4. How to run

Run these on the release branch, not `main` (on `main` there is nothing to run):

```sh
git checkout claude/funny-albattani-c5a91a
npm ci          # no dependencies; the lockfile is empty
npm test        # verified: 63/63 pass
npm run build   # verified: "Built 24 static pages into dist/ (live mode)"
npm run check   # verified: hashes, budgets, links, and the banned-number scan pass
npm start       # serves dist/ at http://127.0.0.1:4173 (not exercised here)
```

**Verified here:** `npm test`, `npm run build` and `npm run check` on Node 22.22. **Not run here:** the Playwright browser tests (`npm run test:browser`), because they need a Playwright install. CI runs them on every PR into `main`.

## 5. Health

| Check | `main` | Release branch |
|---|---|---|
| Build | n/a (no code) | ✅ passes |
| Unit tests | n/a | ✅ 63/63 |
| Output checks | n/a | ✅ pass |
| Lint/format | none | none configured (no linter) |
| CI | none on `main` | ✅ `Storefront checks` on PRs into `main`; the PR #4 history shows green runs |
| Browser tests | n/a | in CI only (not re-run in this review) |

## 6. Findings

### Critical

None.

### High

- **H-1. The default branch does not contain the product.** `README.md:1-131` on `main` describes a WooCommerce, Stripe, COD and Trustpilot site that no longer exists. Production deploys from `claude/funny-albattani-c5a91a`, which is unmerged (draft PR #4). Anyone who clones or browses the public repo sees a stale portfolio. The GitHub repo description also still says "built with WooCommerce". *Fix:* the owner decides on merging the release branch into `main` and then makes `main` the release branch, or changes the default branch. This branch rewrites `README.md` as a stop-gap (see §12).
- **H-2. The old README's marketing claims contradict the live site and the project's own rules.** `README.md:60-64` and `README.md:83-96` (on `main`) advertise Stripe payments, cash on delivery, "Only X left" and "X sold" urgency, and automated reviews. The current rules (`docs/pm/SESSIONS-PLAN.md`, release branch) forbid invented stock, reviews and payment promises, and the live site makes none of these claims. Left on the public default branch, they are a consumer-protection and reputation risk. *Fixed on this branch:* that text now lives in `docs/LEGACY-WOOCOMMERCE-README.md`, under the same path and with the same content as on the release branch.
- **H-3. Third-party personal contact data is visible in a public screenshot.** `product.png`, in the product info block, shows a phone number that the project's rules list as a former partner's number and that `scripts/check.mjs` bans from the build. This file is on `main` and on every branch, and it stays in git history even if deleted. *Not changed here.* The owner should decide whether to redact or remove the screenshot. Removing it from history needs a history rewrite, which is out of scope.
- **H-4. The licence to sell prints of third-party models and franchise characters is unconfirmed.** This is finding F-18 in `docs/QA-FINDINGS.md` on the QA line. The catalogue includes Naruto, How to Train Your Dragon, Marvel, Star Wars and Disney characters, based on MakerWorld models. This is a business and legal risk, not a code issue, and it is still open.

### Medium

- **M-1. Branch and PR sprawl.** The repo has 11 branches, 8 draft PRs and 5 divergent tips, and the QA/ops line is not based on the release line. Draft PRs exist "for CI only" and are labelled "do not merge". A consolidation plan is needed (§11).
- **M-2. 23 MB of QA run output is committed.** `qa/results/` on `claude/ops-automations` and `claude/recovery-qa` holds 1,135 files: logs, screenshots, JSON and TAP output. These should be CI artifacts, not commits, and they would bloat `main` if merged as-is.
- **M-3. `claude/photo-handoff` is an orphan branch.** It has no common ancestor with `main`, so it cannot be merged normally. Its photos need to be cherry-picked or copied into the release line.
- **M-4. CI triggers are out of date.** In `.github/workflows/storefront.yml:3-6` (release branch), pushes run only on `codex/storefront-mvp`, which is superseded, while the release branch is tested only through PR #4. The push trigger should be the release branch, or `main` once it is merged.
- **M-5. Manual checks are still open,** as the project's own docs record: a real-phone WhatsApp handoff, Firefox and Safari, and a human screen-reader pass.

### Low

- **L-1. Broken legacy README images.** `docs/LEGACY-WOOCOMMERCE-README.md:3,104,108,112,116` uses image paths relative to the repo root (`homepage.png`), so the images break when the file is viewed from `docs/`. The file is kept byte-identical to the release branch on purpose, so both copies merge cleanly; fix the paths (`../homepage.png`) on the release branch.
- **L-2. Large screenshots on `main`.** The four PNGs at the repo root (`*.png`) total 6.7 MB (up to 1920×4436). If they stay, compress them or move them to `docs/legacy/`.
- **L-3. No LICENSE file** on any branch. For a public repo that holds brand assets and product photos, add an explicit "all rights reserved" notice or a licence.
- **L-4. No linter or formatter** is configured for `src/` and `scripts/`.
- **L-5. Broad Google permissions for the ops tool.** `ops/makerworld-to-drive/appsscript.json` requests the full `drive` scope. It works, but check whether a narrower scope would do before the owner installs it.

## 7. Security

- **Secrets:** I scanned all 216 commits on all branches for common credential formats (Stripe, GitHub, Google, AWS, Slack, private keys, Make webhooks, Airtable PATs). **No real credential values were found.** The only matches are the scanner patterns in `qa/scripts/secret-scan.sh:34-35` and prose mentions of key prefixes in `docs/QA-FINDINGS.md`.
- **Hosting:** the release branch serves a strict CSP (`default-src 'self'`, no inline script), `nosniff`, `no-referrer` and `frame-ancestors 'none'` from `vercel.json`. There is no server-side code.
- **CI:** the workflow token is `contents: read`.
- **Privacy:** see H-3. The project's own docs also name the banned former-partner numbers in plain text, which `scripts/check.mjs` needs in order to ban them. Consider moving that list to a hashed form.
- Any further security detail has been sent to the coordinator privately, not written here, because this repository is public.

## 8. Docs gaps

- `main` has no current README. This branch adds one.
- There is no single "start here" document for the branch layout. `docs/pm/PROJECT-REGISTER.md` §2 covers it, but only on the release branch.
- There is no `CONTRIBUTING` or branching policy that says how sessions' work reaches `main`.
- There is no LICENSE or usage terms for the photos and brand assets.
- The ops tool's install guide exists (`ops/makerworld-to-drive/INSTALL.md`), but nothing links it from the storefront docs.

## 9. Overlap with the owner's other repos

I judged these from repo names and from this repo's content only; I did not open the other repos.

- **`honeycomb3d-ops-system`:** strong overlap with `ops/` (the MakerWorld → Drive tool, Make.com recipes, the Drive → Airtable → site listing pipeline). The ops work should live in one of the two repos, not both.
- **`HoneyComb-3D/test01`:** same brand. It is likely a scratch or test repo and an archive candidate; it should be checked for anything not already here.
- **`rins-digital-shop`:** the same "commerce" group. It may be a second shop (digital goods) or an earlier attempt. Code reuse is low, because this storefront is purpose-built and data-driven.
- **`rins-enterprises-website`, `rins-enterprises-v2`, `rins`, `R.I.N.S.`:** parent-company sites. They should link to honeycomb3d.store but share no code.
- No meaningful overlap with the AI, trading or tool repos.

## 10. Recommendation

**KEEP-FOCUS.** This is the owner's only clearly revenue-facing, live product. It has real customers (WhatsApp orders), a working, tested, deployed codebase and active development. The problem is repository hygiene, not the product. Make this the canonical HoneyComb repo:

1. Merge the release branch into `main`.
2. Fold the HoneyComb ops work from either this repo or `honeycomb3d-ops-system` into the other.
3. Archive `HoneyComb-3D/test01` once nothing unique is found in it.

## 11. Continuation plan

| # | Task | Effort |
|---|---|---|
| 1 | Owner decision: merge `claude/funny-albattani-c5a91a` into `main` (resolve `README.md` by taking the release version), then deploy from `main` | 30 min |
| 2 | Fix the CI trigger to run on pushes to `main` and the release branch (M-4) | 10 min |
| 3 | Decide on `product.png` (redact or remove the third-party number, H-3) and fix the legacy README image paths (L-1) | 20 min |
| 4 | Merge the docs-only PRs #6 (business) and #7 (marketing) into the release line, then close them | 30 min |
| 5 | Consolidate the QA/ops line: move `qa/` scripts (without `qa/results/`) and `ops/` onto the release line, or into `honeycomb3d-ops-system`; close PRs #1, #3 and #5 | 1–2 h |
| 6 | Copy the `claude/photo-handoff` photos into the release line, then retire the orphan branch (owner OK) | 30 min |
| 7 | Close superseded PR #2 (`codex/storefront-mvp`) once its history is in `main` | 5 min |
| 8 | Get the owner's facts so the switches can go on (delivery line and fee, payment methods, trust pages) | owner time |
| 9 | Resolve the licensing question (H-4) before any paid ads or search indexing | owner time |
| 10 | Add a LICENSE / all-rights-reserved notice and update the GitHub repo description | 10 min |
