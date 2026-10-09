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
| `e2e/storefront-smoke.mjs` | Browser smoke over nav, filters, PDP, cart qty/remove/totals, WhatsApp handoff, a11y basics, failure states, and claim scanning. Statuses: PASS / FAIL / INCONCLUSIVE (element not found, so not a pass) / REVIEW (needs human/owner evidence). |

## Reviewing an implementation commit

```bash
qa/scripts/review-commit.sh https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system codex/storefront-mvp
DOMAIN_DIR=../qa-review/review-<sha12> node --test 'qa/domain/*.test.mjs'
# then start the app from the review checkout printed above, using ITS documented command, e.g.
#   (cd ../qa-review/review-<sha12> && npm run build && npm run preview -- --port 4173)
BASE_URL=http://127.0.0.1:4173 QA_SHA=<full sha> WHATSAPP_NUMBER=<owner-confirmed digits> \
  node qa/e2e/storefront-smoke.mjs
```

Useful overrides: `CATALOG_PATH=/shop` (comma list tried in order), `CART_PATH=/cart`, `OUT_DIR=…`.
The harness prefers the `data-testid` hooks listed in QA-ACCEPTANCE §5.

Record the SHA, exit codes and result counts in QA-FINDINGS §7. A browser run that could not
start counts as **not run**, not as passed.
