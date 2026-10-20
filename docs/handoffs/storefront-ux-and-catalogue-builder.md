# Handoff: storefront UX and catalogue builder (session 01TEeSdr5WV5Hvnw8RC17Exi)

Written 2026-10-17 for the incoming PM session.

- **Repository:** RINS-Enterprises/honeycomb3d-ecommerce-system. This is the HoneyComb 3D shop, honeycomb3d.store: 3D-printed collectibles, Sri Lanka, prices in LKR.
- **Work branch:** `codex/storefront-mvp`, head **cc21b85**. It is clean and identical to origin.
- **PR:** #2 (draft, open, mergeable, base `main` c78e12f). CI `verify` passed on cc21b85.
- **Production:** honeycomb3d.store serves cc21b85. QA round D56 deployed it as Vercel deployment `dpl_EfNAbF2b1c8p6sYHNmDNo64CDnDk`.

## 1. What this session was

This session was the **BUILDER** in a two-session setup:

- **Owner:** Isuru (`isurusandaruwan026418@gmail.com`).
- **QA session:** `session_013P5Y2u35xPGTnfAHfm2K1t`. It tests every commit, runs its own probes and deploys to Vercel. Its QA documents live on branch `claude/recovery-qa` (latest 6407430, round D56).
- **This session:** wrote code, data and image derivatives, and pushed only to `codex/storefront-mvp`. It never deployed, and never touched Vercel, DNS or GitHub settings.

### What the owner asked for

"Keep upgrading the site, one by one, make it the best looking, best UI, don't stop."

Later, in this session: "Add them." That message approved adding the 11 remaining Airtable products and the 10 verified photos.

### Brief and constraints (agreed at the start; all still in force)

1. **Git.** Never force-push, rebase or amend pushed commits. Before each push, run `git fetch` and merge if the branch moved.
2. **Data stays as it is.** Don't change prices, SKUs, IDs or names. Availability stays `"unconfirmed"`. `approved` stays false. WhatsApp number stays null and ordering stays off. The one deliberate exception is the owner-approved product addition in section 2.
3. **No invented claims.** No reviews, ratings, stock counts, "bestseller" or "sale" badges, discounts, delivery times, shipping promises or guarantees.
4. **Dependencies.** No new runtime dependencies and no CDN scripts or fonts. A self-hosted OFL font is allowed, with its licence committed and fonts totalling about 100 KB or less.
5. **Tests.** Keep them green. Update tests on purpose when markup changes, and never delete coverage.
6. **Accessibility.** WCAG 2.2 AA contrast, visible focus, real alt text, landmarks, and respect for `prefers-reduced-motion`.
7. **Images.**
   - At most 500 KB per image and 1.5 MB per page.
   - No image decoded at more than 3× its rendered size.
   - Real width and height on every image.
   - The LCP image is preloaded and never lazy-loaded.
8. **Per-commit gate.** All of these must pass before a push:
   - `npm test`, `npm run build`, `npm run check`
   - `node tests/browser.mjs` and `node tests/images-browser.mjs`
   - QA's pinned image audit (see section 4)
   - Screenshots at 390 px (DPR 3) and 1280 px
   - Then push, wait for CI to pass, and only then message QA the SHA. QA deploys only commits whose CI push run is green.
9. Commit trailers name the session; no model identifiers appear in commits or PRs.
10. **Owner correction on 2026-10-16, relayed by QA.** UI polish has reached diminishing returns and the owner hit usage limits several times. From now on: **fewer, larger, bundled rounds, and only clearly valuable or broken things.** The BUILDER went idle after cc21b85 on that instruction.

## 2. What was completed (all pushed, CI green, QA PASS, deployed)

This session made 57 commits, **2b3ccb3 to cc21b85** (2026-10-15 19:56 to 2026-10-16 13:55 UTC). `git log --format='%h %(trailers:key=Claude-Session,valueonly)'` shows `session_01TEeSdr5WV5Hvnw8RC17Exi` on each.

### Design system and pages

- Design tokens, a dark warm theme with the honey accent `#fba31b` and hexagon motifs.
- Self-hosted Bricolage Grotesque (OFL, about 21 KB, hash-checked).
- Redesigned home page: full-bleed hero, category tiles, "How it works", custom banner, a theme row and a faint honeycomb texture (`/hex.svg`).
- Shop:
  - category and theme chips with counts and URL history
  - search with a `/` shortcut, a clear button and `<mark>` highlights
  - sort options
  - a custom-print tile at the end of the grid
  - an empty state that names the query and offers categories
- Product page:
  - gallery with phone dots and a lightbox with zoom
  - sticky mobile buy bar
  - Web Share, WhatsApp share (no number) and Copy link
  - facts that link to the filtered shop
  - related products ranked by category and theme
  - an "All <Category> (n)" link
  - an "Ask about a variation" link that pre-fills `/custom/?design=ID`
- Cart: photo lines, quantity steppers, a sticky summary, and picks when empty.
- Recently viewed row (localStorage only).
- Quick "+ Add" on cards and a hover cross-fade to the second gallery photo.
- Subtle reveal motion, switched off under reduced motion.
- A 404 page with search and four designs.
- SVG favicon.

### Images

- `scripts/prepare-images.py`, using Pillow 11.3.0:
  - square frames, plus a whole-object "pad" mode that pads with the photo's own edge tones
  - gallery frames, hero portrait and landscape frames
  - JPEG share images
  - AVIF twins of every WebP (quality 60, speed 4, deterministic, 37% smaller); WebP stays as the fallback inside `<picture>`
- Gallery thumbnails stay plain WebP on purpose (see section 3).
- `scripts/check-images.mjs` verifies hashes, sizes, metadata stripping, budgets and AVIF `ispe` dimensions.
- `scripts/clean-source.py` strips metadata without re-encoding and asserts the pixels are identical.
- `scripts/prepare-favicon.py` writes `favicon.svg` from the PDF's vector paths, copied verbatim.

### Catalogue (owner-approved)

- **8a0440b.** Added the 11 remaining Active Airtable products: HNYCMB505–507, 510 and 512–518. The owner typed "Add them." in this session.
  - Prices, SKUs and names were verified by this session directly against Airtable base `appTRxtdHRFH7mgLX`, table `tblmUOdfunwP8iWKi`, on 2026-10-16.
  - Each record has `sourceName`, `sourceCategory`, and a `priceSource` with its Airtable `recordId` and `readAt` 2026-10-16.
  - Airtable spells HNYCMB515 "Gorgu Baby Yoda keychain". That spelling is kept verbatim as `sourceName`; the site displays "Grogu Baby Yoda Keychain".
  - Two new categories: Bookmarks and Desk Organizers.
- **e9f5c19.** Photos for 10 of the 11.
  - Source: QA branch `claude/photo-handoff` at **fe19da8**, `new-products/`. Every file's SHA-256 and size matched its README, and none carried AI markers.
  - Cleaned copies are in `assets/photo-sources/`. Crop boxes and Drive IDs are recorded in `assets/image-sources.json` and `docs/ASSET-PROVENANCE.md`.
  - **HNYCMB513 Stormtrooper** has no verifiable real photo (QA finding F-21). It stays hidden because products without a photo are never shown.
- The site now shows **17 designs in 5 categories**.

### Earlier in the session

- Real Kurama and Classic Kunai photos (00eab92, from photo-handoff 4cefd25).
- `robots.txt` allows link-preview bots while every page stays `noindex`.
- Product JSON-LD.

## 3. Decisions, rejected approaches, failures to avoid

- **The CI workflow edit was blocked.** QA asked this session to re-pin `.github/workflows/storefront.yml` from QA commit `97780b0` to `c6931c62cb939fcdc23356b68f8dc60da273bf3a`, which has a looser decorative-alt rule. The permission guard refused the edit as a shared-CI change. **The workflow is still pinned to 97780b0.** Work-around shipped in 060ae0c: the card hover photo now carries its gallery alt text plus `aria-hidden="true"`. Re-pinning needs the owner's approval.
- **The data write was blocked until the owner confirmed it in this session.** A quote relayed from the QA session didn't count as approval. The owner's "Add them." unlocked it. Treat owner instructions relayed through other sessions the same way.
- **CI went red on 2ec9e8a, e3e83b8, ec6c1c2, cad746d and f6b6d42.** Cause: `tests/images-browser.mjs` uses an `isMobile` context without `hasTouch`, so Chromium reports `hover: hover` and the hover photo loads. **Always run `tests/images-browser.mjs` and the pinned QA audit locally**, not just `browser.mjs`. None of these commits should be deployed.
- **AVIF inside `<picture>` for 72 px thumbnails** made Chrome reuse a cached 640 px file and broke the 3× decode rule. Thumbnails stay WebP `<img>`. Limiting thumbnail srcsets to small sizes didn't help either, because Chrome still reused whatever was cached.
- **Pad-mode squares:** flat-colour padding showed bands and was replaced by edge-tone padding. That works poorly on textured or busy edges such as Iron Man's carpet and hand. A square crop inside the photo is preferred when the object fits.
- **5 category tiles on desktop:** wide 3:2 tiles cropped the photos (audit REVIEW, and the bookmark slid under the label gradient). Rejected in favour of 3 + 2 centred square tiles.
- **Card srcsets are capped at 960w.** 17 cards pushed the shop's conservative image ceiling just over 1.5 MB; the cap brings it to 1.08 MB.
- Don't re-propose features that already exist. QA did this several times: share, recently viewed, swipe dots, chip fade, 404 search and breadcrumbs are all live.
- **BreadcrumbList JSON-LD is deliberately deferred** until indexing is switched on.

## 4. Checks: what ran and on which version

At **cc21b85**, all run locally before pushing:

- `npm test`: 35/35
- `npm run build` and `npm run check`: 23 pages
- `tests/browser.mjs`: exit 0
- `tests/images-browser.mjs`: exit 0
- QA audit at 97780b0: `{"PASS":38,"INFO":1}`. The one INFO is the known hero `<source>` width/height attribute note.
- axe-core: 0 violations on all routes at 390 and 1280 px
- CLS: 0.0000

GitHub CI `verify` passed on cc21b85 (runs 38911670020 and 38911678145). QA's D56 report: smoke 88/88, live 89/89, axe 0, deployed.

To reproduce the pinned audit locally:

```sh
git fetch --depth=1 origin 97780b00907571e64703daa3adfd5f03d5d5263d
git show 97780b0:qa/e2e/image-audit.mjs > /tmp/image-audit.mjs
npm run build && (node scripts/serve.mjs &)
BASE_URL=http://127.0.0.1:4173 QA_SHA=local OUT_DIR=test-results/qa node /tmp/image-audit.mjs
```

The image pipeline needs Python with `Pillow==11.3.0` (AVIF support), plus `PyMuPDF==1.26.5` for the favicon. Playwright 1.56.1 is installed `--no-save`, with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.

## 5. State and documents

- No uncommitted or untracked work. The helper scripts under `test-results/` (screenshots, axe and CLS runners) are gitignored scratch files and are intentionally not preserved. The commands above replace them.
- **Stale documents:**
  - `docs/BUILD-STATUS.md` was last updated 2026-10-13 (948dff5). It still describes 7 products and placeholder Kurama/Kunai.
  - PR #2's description still describes the 2026-10-09 state and links an old preview deployment.
  - Neither was updated in this session. Use this handoff, the commit log and QA's D-round records on `claude/recovery-qa` instead.
- **Inherited, not this session's work:**
  - commits f801d31 to 948dff5 (earlier builder sessions and Isuru)
  - `main` c78e12f (old WooCommerce-era README)
  - `claude/wizardly-mendel-73bkuw` (51964cb, an earlier QA sign-off)
  - `claude/photo-handoff` (QA's photo transfer branch; leave it, as the git proxy refuses deletion)
  - `claude/recovery-qa` (QA docs; never push there)

## 6. Open problems and owner decisions

1. **Ordering and payment.** Online ordering is shown as "opens soon". There is no payment or order backend.
2. **WhatsApp number.** `store.whatsappNumber` is null and `whatsappVerified` is false. The WhatsApp handoff code exists and is tested with a fixture.
3. **Indexing.** Every page is `noindex` and there's no sitemap. When indexing is turned on, remove `noindex`, add a sitemap and add BreadcrumbList JSON-LD.
4. **Photos.** HNYCMB513 Stormtrooper needs a real, verifiable photo.
5. **Copy and approval.** All descriptions are drafts (`copyStatus: draft-needs-owner-approval`). Availability is unconfirmed everywhere.
6. **CI re-pin** to QA c6931c6, which needs owner approval (section 3).
7. **Airtable typo** "Gorgu" for the owner to fix at the source if they want. The site doesn't depend on it.
8. **QA finding F-17:** Baymax/Kurama storefront IDs vs Airtable SKUs 503/504. Not migrated.

## 7. Suggested next tasks, in priority order

1. **When the owner provides the WhatsApp number and ordering terms:**
   - Set `data/store.json` `mode` to `live` with the verified number.
   - Review the cart handoff copy and the delivery and returns wording.
   - Done when: CI and QA live smoke pass and a real phone test opens WhatsApp with the prepared message.
2. **When the owner approves indexing:**
   - Remove `noindex` and the preview-mode robots rules.
   - Add `sitemap.xml` and BreadcrumbList JSON-LD.
   - Update `check.mjs`, which currently enforces noindex.
   - Done when: CI passes and QA's preview-to-live checks pass.
3. **When a Stormtrooper photo arrives:** run the same import as e9f5c19 (hash-verify, `clean-source.py`, crop spec, `prepare-images.py`). Done when: 18 designs show and the audit passes.
4. **Refresh the stale documents.** Update `docs/BUILD-STATUS.md`, and the PR #2 description if wanted, to the current state. Docs only, one commit.
5. Only after that: further UX work, in bundled rounds, per the owner's 2026-10-16 instruction.

## 8. Monitoring and workers

- This session was subscribed to PR #2 activity. That subscription doesn't transfer.
- No scheduled check-ins or background workers are running.
- The QA session (`session_013P5Y2u35xPGTnfAHfm2K1t`) is separate and was told this session is idle.
