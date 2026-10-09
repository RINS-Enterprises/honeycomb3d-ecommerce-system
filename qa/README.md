# QA tooling (QA-owned)

Independent checks for the HoneyComb 3D storefront rebuild. They add **no dependencies** to the
app, and they never write to the implementer's checkout or branch. Criteria are in
[`../docs/QA-ACCEPTANCE.md`](../docs/QA-ACCEPTANCE.md). Findings go in
[`../docs/QA-FINDINGS.md`](../docs/QA-FINDINGS.md).

Requirements: Node ≥ 18, git, and for browser checks Playwright + Chromium. The harness resolves
`playwright` locally or from `npm root -g`; set `CHROMIUM_PATH` if needed.

| Path | Purpose |
|---|---|
| `scripts/review-commit.sh <repo> <ref> [workdir]` | Clone into a QA-owned dir **outside** this repo, check out the exact SHA, run install + the project's own `lint/typecheck/check/test/build/test:e2e` + `npm audit` + secret scan. Writes `results/<sha>/`. |
| `scripts/secret-scan.sh <checkout>` | Scan tracked files for secrets, committed `.env`, and secrets behind client-exposed env prefixes. Exit 1 on HIGH. Also run it on the build output. |
| `lib/whatsapp-link-check.mjs` | Parse and validate a `wa.me` order handoff (number format, items, qty, total, encoding). |
| `lib/whatsapp-link-check.test.mjs` | Unit tests: `node --test 'qa/**/*.test.mjs'` |
| `domain/domain-contract.test.mjs` | Contract tests for the implementation's `src/domain.mjs` and `data/*.json` (cart merge/caps, totals, corrupt storage, WhatsApp message, filters, live/preview rules). `DOMAIN_DIR=<review checkout> node --test 'qa/domain/*.test.mjs'`. Skips without `DOMAIN_DIR`. |
| `e2e/edge-probes.mjs` | Implementation-specific probes: URL-parameter injection, filter state restore, tampered/blocked storage, quantity cap, notes escaping, duplicate card links. `BASE_URL=… node qa/e2e/edge-probes.mjs` |
| `e2e/axe-audit.mjs` | axe-core WCAG 2.2 A/AA audit of every page plus interactive states, desktop and mobile. Needs `AXE_PATH` to an `axe.min.js` installed in a QA-owned directory (`npm i axe-core` in a scratch folder), never in the app. |
| `e2e/image-audit.mjs` | Per page and viewport (mobile DPR 3, desktop DPR 1): image decode, natural vs rendered size, oversampling, bytes per image and page, object-fit crops, alt, LCP. `BASE_URL=… QA_SHA=… node qa/e2e/image-audit.mjs` |
| `scripts/image-provenance.py` | Flags C2PA "Created by Google Generative AI"/SynthID, Canva/Adobe `CreatorTool`, camera EXIF. Detection by content only. |
| `scripts/c2pa-validate.py` | Cryptographic C2PA validation (signature, data hash, issuer, actions) via `c2pa-python` in a QA-owned venv. |
| `asset-recommendations.json` | Machine-readable per-product image recommendations (Drive IDs, SHA-256, provenance, owner decisions) from `docs/ASSET-AUDIT.md`. |
| `scripts/drive-decode.py` | Decodes a saved Drive-connector download into a scratch directory outside the repo, for hashing and inspection. Never import such files into the app. |
| `e2e/storefront-smoke.mjs` | Browser smoke over nav, filters, PDP, cart qty/remove/totals, WhatsApp handoff, a11y basics, failure states, and claim scanning. Statuses: PASS / FAIL / INCONCLUSIVE (element not found, so not a pass) / REVIEW (needs human/owner evidence). |

## Reviewing an implementation commit

```bash
qa/scripts/review-commit.sh https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system codex/storefront-mvp
DOMAIN_DIR=../qa-review/review-<sha12> node --test 'qa/domain/*.test.mjs'
# then start the app from the review checkout printed above, using ITS documented command, e.g.
#   (cd ../qa-review/review-<sha12> && npm run build && PORT=4173 npm start)
BASE_URL=http://127.0.0.1:4173 QA_SHA=<full sha> CATALOG_PATH=/shop/ CART_PATH=/cart/ node qa/e2e/storefront-smoke.mjs
QA_LIVE_FIXTURE=1 OUT_DIR=qa/results/<sha>/browser-live BASE_URL=… QA_SHA=<sha> CATALOG_PATH=/shop/ CART_PATH=/cart/ node qa/e2e/storefront-smoke.mjs
BASE_URL=http://127.0.0.1:4173 node qa/e2e/edge-probes.mjs
AXE_PATH=/scratch/axe/node_modules/axe-core/axe.min.js BASE_URL=http://127.0.0.1:4173 QA_SHA=<sha> node qa/e2e/axe-audit.mjs
```

Useful overrides: `CATALOG_PATH=/shop` (comma list tried in order), `CART_PATH=/cart`, `OUT_DIR=…`.
The harness prefers the `data-testid` hooks listed in QA-ACCEPTANCE §5.

Record the SHA, exit codes and result counts in QA-FINDINGS §7. A browser run that could not
start counts as **not run**, not as passed.
