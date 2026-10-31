# Handoff: second PM session (owner's other Claude account)

Written 2026-10-20 by the PM session `session_01R5ExKrg6wn9ckahNmypHvG`. The owner's main account is at 62% of its weekly limit, which resets on 25 Oct at 17:30. A second account with a one-week Pro trial takes over day-to-day PM work until about 27 Oct. Then this file is updated and handed back.

**You are the HoneyComb 3D website PM.** Read these first, in this order: this file, `PROJECT-REGISTER.md`, `SESSIONS-PLAN.md`, then `NEXT-PHASE.md`.

## State on 2026-10-20
- **Live:** https://honeycomb3d.store, release `f1a2b1c`, Vercel deployment `dpl_C3tu5TsqLJLCzqRcn1GZKgC66t7X`.
  - WhatsApp ordering on **94710599815 (071 059 9815)**, 17 designs "Made to order".
  - Order now on product pages, Order on cards, cart suggestions, `/faq/`.
- **Release branch:** `claude/funny-albattani-c5a91a`, draft PR #4 into `main`. Never merge it; the owner decides.
- **Built but off** in `data/store.json`: `delivery`, `paymentMethods`, `paymentNote`, `social`, `pages`, `paypalOverseas`, `searchIndexing`.
- **Waiting on the owner:** every remaining item. See "Owner decisions" below.
- **Other sessions on the main account** (A Ops, B Storefront, C Payments, D Marketing) are idle. Their work is on branches `claude/ops-automations` (PR #5), `claude/storefront-features` (PR #8), `claude/payments-delivery` (PR #6) and `claude/brand-marketing` (PR #7). You can't message those sessions. Work from their branches and docs instead.

## Hard rules (never break)
1. **WhatsApp numbers:**
   - The only order number is `94710599815`.
   - Never use `+94 70 300 9064` or `+94 77 491 9109` (former business partner) or `0710559815` (a typo).
   - `scripts/check.mjs` fails the build if any of them appears.
2. Never invent prices, stock, reviews, licences, delivery times or payment promises.
3. Search indexing stays off until the owner decides separately.
4. **Branches:**
   - Push only to your own branch, plus `claude/funny-albattani-c5a91a` for releases.
   - Never merge to `main`, delete branches or close PRs.
   - Don't push to `codex/storefront-mvp`. It's behind production, and deploying it would switch ordering off.
5. **Accounts:** no paid services, and no account changes (Make, Canva, Airtable writes, social posts) without the owner's explicit OK in your session.
6. **Secrets:** never print them.

## Release process (every website change)
1. Change the code on the release branch, or merge a session branch into it.
2. Run the local gate:
   - `npm run gate:preview`, `npm run gate:all-on`, `npm run gate:proposal`, `npm run check:indexing`, then `npm run gate` **last**, so `dist/` ends in the committed state.
   - Browser tests need `node_modules/playwright` and `playwright-core` symlinked from `/opt/node-tools/node_modules`, and port 4173 must be free.
3. Have an **independent QA subagent** review the diff before release.
4. Push, then wait for the PR #4 `verify` check to go green.
5. Deploy with the Vercel connector, `create_deployment`:
   - team `team_dErX7uzTIgpWT6SY1Syo3uxr`, project `prj_gpsHMSC2HZWoBOrx79ypk36O2rsS`
   - `target: "production"`
   - `gitSource {type:"github", org:"RINS-Enterprises", repo:"honeycomb3d-ecommerce-system", ref:"claude/funny-albattani-c5a91a", sha:<head>}`
6. Verify the live site: `/data/store.json` shows `mode: live` and `94710599815`, and pages carry `noindex`. Add a row to register §7.

## Owner decisions → what to change
| Owner says | Change in `data/store.json` | Source |
|---|---|---|
| Delivery line, e.g. "islandwide by courier, LKR 400, usually 2–4 working days after printing" | `delivery: {"text": "<their words>", "feeLkr": 400}` | `docs/business/OWNER-DECISIONS.md` on `claude/payments-delivery` |
| Payment methods, e.g. "LankaQR, bank transfer and cash on delivery" | `paymentMethods: ["lankaqr","bank-transfer","cash-on-delivery"]`, plus optional `paymentNote` | same |
| Social handles | `social: [...]` (see the shape in `tests/fixtures/store-all-on.json`) | `docs/marketing/` on `claude/brand-marketing` |
| Shipping, returns or about text in their own words | `pages.<name>` | – |
| "PayPal works, switch it on" (only after a **USD 10** test) | `paypalOverseas: true` | `docs/business/paypal.md` |

Use the owner's exact words. If something is unclear, ask; don't fill gaps.

## Ops work you may pick up (main-account session A is idle)
- Branch `claude/ops-automations` holds the MakerWorld → Drive tool and its short install guide. The Make recipes are in `ops/make/README.md` on the release branch.
- Building Make scenarios needs the owner to say "build the Make automations" in **your** session, and the Make connector connected on **your** account.
- The proposed free **WhatsApp order log** (paste an order message → Airtable record, no WhatsApp API) needs the owner's yes.

## Usage
- **Your account:** this trial week is the main capacity. Run one or two sessions at a time, not five. Five at once exhausted a 5-hour limit in about 20 minutes on the main account. Keep each change small and committed.
- **Main account:** keep it for emergencies until it resets on 25 Oct.

## Hand back (about 26 Oct)
Update this file and the register (what changed, live release, open items), push, and tell the owner. The main-account PM resumes from the register.
