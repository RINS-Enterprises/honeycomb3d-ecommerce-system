# HoneyComb website: project register and decision log

The single place for the HoneyComb website's status, task ownership, open owner
decisions and decision history. Maintained by the PM session.

- **PM session:** `session_01R5ExKrg6wn9ckahNmypHvG`, branch `claude/funny-albattani-c5a91a`.
- **Created:** 2026-10-17, at takeover. Every "verified" line below was checked by the PM on that date unless marked otherwise.
- **Scope:** the HoneyComb 3D website (`honeycomb3d.store`). The MakerWorld-to-Drive tool is a separate Operations & Tools workstream (§8).

How to use it:
- Owners update their task row's status and evidence in a commit to this file, or tell the PM and the PM updates it.
- An owner decision is recorded only with its date and where it was given. A quote relayed from another session counts as context, not as a decision, until the owner confirms it.
- Earlier records stay where they are: QA evidence in `docs/QA-FINDINGS.md` on `claude/recovery-qa`, builder history in git and `docs/handoffs/`. This register links to them rather than copying them.

---

## 1. Verified current state (PM, 2026-10-17)

| Item | Reported in handoffs | PM verification |
|---|---|---|
| Storefront head | `cc21b85` | **Confirmed.** `codex/storefront-mvp` = `cc21b85` (2026-10-16 13:55 UTC). `handoff/storefront-ux-and-catalogue-builder` = `cc21b85` + one docs commit `29e4521`. |
| Production | `dpl_EfNAbF2b1c8p6sYHNmDNo64CDnDk` | **Confirmed** via Vercel API: READY, target production, built from `cc21b85`, aliased to `honeycomb3d.store`, `www.honeycomb3d.store` and the preview hostnames. No deployment since. |
| CI on head | green | **Confirmed.** Storefront checks push run 38911670020 and PR run 38911678145: success. |
| Local checks on head | all green | **Re-run by the PM** on a clean checkout of `cc21b85`: `npm test` 35/35; build + check 23 pages; `tests/browser.mjs` exit 0; `tests/images-browser.mjs` exit 0; QA image audit at the CI pin `97780b0` `{"PASS":38,"INFO":1}`; provenance scan exit 0. |
| Catalogue | 17 visible designs, 5 categories | **Confirmed** from `data/products.json`: 18 records, 17 with a photo. Figures 8, Keychains 4, Props 3, Bookmarks 1, Desk Organizers 1. HNYCMB513 Stormtrooper has no photo, so it is hidden. All 18: `approved: false`, `availability: "unconfirmed"`, `copyStatus: draft-needs-owner-approval`. |
| Ordering | disabled | **Confirmed.** `data/store.json`: `mode: "preview"`, `whatsappNumber: null`, `whatsappVerified: false`. Pages say "Online ordering opens soon." |
| Search indexing | disabled | **Confirmed** in code: preview mode writes `noindex,nofollow` on every page and `robots.txt` `Disallow: /` (link-preview bots allowed); `check.mjs` enforces it. (The live site itself cannot be fetched from this environment; proxy 403, as QA also found.) |
| `main` | lacks the storefront | **Confirmed.** `main` = `c78e12f` (2026-04-19), an ancestor of the storefront. Nothing merged. |
| Other sessions | builder and QA idle | **Confirmed** from the session list: both idle; no other HoneyComb PM, builder or integration session exists. |
| GPT/Codex builder | unknown | **No activity since 2026-10-13.** Its 18 commits on the storefront branch are authored as `Isuru Rajapaksha <rins.enterprises.404@gmail.com>`, last `948dff5` at 2026-10-13 18:03 UTC. All 57 later commits carry the Claude builder's session trailer. The GPT side cannot be contacted from here; treat it as inactive but tell it about the branch rules if the owner reopens it (§4). |

### 1a. Material discrepancies and new findings

1. **Switching `mode` to `live` hides the whole catalogue.** `visibleProducts()` shows only `approved: true` products in live mode, and `validateData()` rejects an approved live product with `availability: "unconfirmed"`. Every product is unapproved and unconfirmed, so the builder handoff's step "set `mode` to `live` with the verified number" would publish an empty shop. The builder's own test asserts this (`tests/domain.test.mjs`: `visibleProducts(products,{mode:'live'})` is `[]`). Enabling ordering therefore needs per-product approval and an availability value as well as the number. See OD-4.
2. **Live mode also turns on search indexing.** `src/render.mjs` emits `noindex` only in preview, and `scripts/build.mjs` writes `Allow: /` for live. Ordering and indexing must be decoupled before go-live, or enabling ordering silently decides D-12. See W-02. **Fixed on the PM branch 2026-10-18** (W-02); not yet on `codex/storefront-mvp` or production.
3. **"Every deployed SHA passed CI" is not true.** Of 29 production deployments, 27 had a green CI push run; `e5bdc9d` and `878bd69` (2026-10-15) were deployed with red CI. QA recorded this honestly in QA-FINDINGS §7c ("Process gap found in D7–D8"), but its handoff §3a summarises it away. Every deploy since `868c92f` has green CI. Full table in §7.
4. **The CI re-pin target in both handoffs is out of date.** They recommend `c6931c6`. QA changed the pinned scripts again in `3b91946` (adds the Gemini/Canva AI-marker checks after F-21). See §9.
5. **F-22 is not resolved.** The owner said "list those" after seeing QA's contact sheet, and the 10 photos went live. QA's separate question, whether some are the model designers' photos rather than the shop's own prints, was never answered. These photos are public now. See OD-4.
6. **Stale documents.** `docs/BUILD-STATUS.md` (2026-10-13: 7 products, Kunai/Kurama placeholders); `docs/RUN-AND-RELEASE.md` (says Claude's QA branch is `claude/wizardly-mendel-73bkuw`; it is `claude/recovery-qa`); the PR #2 description (2026-10-09 state); QA-FINDINGS headline (`948dff5`) and §9 item 3 ("Nothing is deployed"). Disposition in W-09. Until refreshed, this register is the current-state source.
7. **PR #3 does not include the QA handoff.** PR #3's head is `claude/recovery-qa` @ `6407430`. The handoff document and the MakerWorld tool are only on `claude/handoff-recovery-qa-deploy-makerworld` @ `0182080` (one commit ahead).

---

## 2. Branches, PRs and where things live

| Branch | Head | Owner | Purpose | Rule |
|---|---|---|---|---|
| `codex/storefront-mvp` | `cc21b85` | Builder | Storefront code and data. The only branch CI runs push checks on and the only one production deploys from. PR #2 (draft) → `main`. | One builder at a time. |
| `handoff/storefront-ux-and-catalogue-builder` | `29e4521` | Builder (frozen) | `cc21b85` + builder handoff doc. | Read-only record. |
| `claude/recovery-qa` | `6407430` | QA | QA docs, suite (`qa/`), per-SHA results. PR #3 (draft) → `main`. | Preserve independently. Do not merge wholesale. |
| `claude/handoff-recovery-qa-deploy-makerworld` | `0182080` | QA (frozen) | `6407430` + QA handoff + `ops/makerworld-to-drive/`. | **Only copy of the MakerWorld tool.** Do not delete (§8, OPS-04). |
| `claude/wizardly-mendel-73bkuw` | `51964cb` | QA (superseded) | First QA round, PR #1 (draft). | Leave; owner may close PR #1 later. |
| `claude/photo-handoff` | `fe19da8` | QA (temporary) | Photo transfer, already imported. | Owner may delete; git proxy refuses deletion from sessions. |
| `claude/funny-albattani-c5a91a` | this commit | PM | `29e4521` + PM documents (`docs/pm/`). | Docs only. |
| `main` | `c78e12f` | Owner | Integration target. | No merges during takeover. |

External systems (from the handoffs; IDs not re-verified except Vercel): Vercel team `team_dErX7uzTIgpWT6SY1Syo3uxr`, project `prj_gpsHMSC2HZWoBOrx79ypk36O2rsS` (verified); Airtable base `appTRxtdHRFH7mgLX`, Products `tblmUOdfunwP8iWKi`; Drive HoneyComb folder `1BAhuPuAvAvgschy6bv-qW1YcBd74zaId`, MakerWorld imports `1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI`.

---

## 3. Team, responsibilities and coordination

| Role | Who | Responsibility now | State |
|---|---|---|---|
| Owner | Isuru | Decisions, real-phone test, photos, licences, installs | Decisions pending (§5) |
| PM | `session_01R5ExKrg6wn9ckahNmypHvG` | Priorities, assignments, this register, release authorisation | Active |
| Builder (implementation) | `session_01TEeSdr5WV5Hvnw8RC17Exi` "HoneyComb \| Website \| Storefront Builder" | Writes code and data on `codex/storefront-mvp`. Never deploys. | Idle by agreement since 2026-10-16. Context ~748k of 1M. |
| QA & release | `session_013P5Y2u35xPGTnfAHfm2K1t` "HoneyComb \| Website \| QA & Release Lead" | Independent QA per SHA; the only deployer, after the gate in §7. | Idle. Context ~609k of 1M. |
| GPT/Codex | outside Claude | Original builder | Inactive since 2026-10-13 (§1). Not assigned. |

**Coordination access (checked 2026-10-17).** This session has the `send_message` tool, and both sessions report `cross_session_inbound: available`, so direct messages can be sent. The PM has **not** sent any yet: neither session has unblocked work, every account session shows the 7-day limit at `allowed_warning` (resets about 2026-10-19 12:00 UTC), and waking two large-context sessions would only spend usage. Messages are drafted in `docs/pm/RELAY-MESSAGES.md` and will be sent when their task starts, or the owner can paste them.

**Approval guard (reported, applies to the builder).** The builder refuses data writes unless the owner types the confirmation in the builder's own session, and refuses edits to `.github/workflows`. The PM has not tested this guard; it is a property of that session's permission checks. Practical effect: the owner should give the OD answers directly in the session that implements them (§6).

**Rules kept from the handoffs:** one implementation owner and an independent QA reviewer per change; no force-push or history rewrite; no merges to `main` without the owner; no invented prices, stock, reviews, delivery times or payment claims; no new runtime dependencies; fewer, larger, bundled rounds, only for valuable or broken things (owner, 2026-10-16).

---

## 4. Task register

Status: `blocked` (waiting on a dependency), `ready`, `in progress`, `done`, `deferred`.

### Website

| ID | Task | Implements | QA | Depends on | Acceptance criteria | Status / evidence |
|---|---|---|---|---|---|---|
| W-01 | Collect the ordering decisions OD-1…OD-5 | Owner (PM asks) | – | – | Each OD answered or explicitly deferred, recorded in §6 with date and source | **blocked on owner**; asked 2026-10-17 |
| W-02 | Decouple indexing from ordering: a separate store setting (`searchIndexing`, default off) controls `noindex`, `robots.txt` and the sitemap guard, independent of `mode` | PM (builder idle; see decision log 2026-10-18) | Independent reviewer subagent; QA full run before deploy | – (no owner decision needed) | With `mode: live` and indexing off: every page keeps `noindex,nofollow`, `robots.txt` keeps `Disallow: /` with link-preview bots allowed, no sitemap; `check.mjs` enforces this from the new setting, not from `mode`; unit tests cover both settings; CI green | **implemented and reviewed, not deployed.** On `claude/funny-albattani-c5a91a` (see git log). Evidence 2026-10-18: `npm test` 37/37 (2 new tests, which fail if the helper is reverted to `mode`); build + check 23 pages; `tests/browser.mjs` and `tests/images-browser.mjs` exit 0; QA audit at `97780b0` `{"PASS":38,"INFO":1}`; default `dist/` byte-identical to `cc21b85` except the shipped `domain.mjs`; a simulated live build (all 17 approved, `made-to-order`) has `noindex` on 23/23 pages, `Disallow: /`, no sitemap, and passes check. An independent reviewer reached PASS on all four requirements. CI cannot run until it is on `codex/storefront-mvp` (push trigger) or in a PR to `main`. **Integration:** the builder fast-forwards `codex/storefront-mvp` to it at the start of the W-03 round (it is `cc21b85` + docs + W-02, so no conflicts) |
| W-03 | Enable WhatsApp order requests: set the verified number, `whatsappVerified: true`, `mode: live`; set `approved` and `availability` per OD-4; adjust payment/delivery wording per OD-3/OD-5; remove "opens soon" copy | Builder | QA | W-01, W-02 | All 17 photographed designs stay visible in live mode; cart's primary action opens `https://wa.me/<number>?text=…` with ID, quantity, line totals and the "not a confirmed purchase" line (AC-WA-1…5); no payment, delivery-time or stock claim beyond what OD-3/OD-5 approve; indexing still off; `npm test`, build, check, both browser tests and the pinned QA audit pass; CI push run green | **blocked** on W-01 |
| W-04 | Independent QA and production deploy of the W-02/W-03 bundle | QA | – (PM authorises) | W-03 | `qa/scripts/full-run.sh` PASS on the SHA, including live-fixture smoke and domain tests; CI push run for that exact SHA green; visual review at 320/390/1440; a §7c-style row with the `dpl_` ID; PM records it in §7 | blocked on W-03 |
| W-05 | Real-phone check: open (do not send) the order message on an Android phone and a desktop | Owner | QA observes the result | W-04 deployed, or a preview URL from W-03 | WhatsApp opens on the confirmed number with the full prepared message (AC-WA-6). Owner reports "works" or a screenshot of the failure | blocked on W-03 |
| W-06 | Stormtrooper HNYCMB513 photo | Owner supplies; Builder imports | QA (hash and AI-marker check) | A real photo of the shop's print | Same import as `e9f5c19`; 18 designs visible; audit passes | **blocked on owner**; not needed for ordering |
| W-07 | Re-pin CI QA scripts from `97780b0` to `3b91946` | Builder (or owner edits the file) | QA | Owner approval of a workflow edit | `.github/workflows/storefront.yml` fetches `3b91946`; CI green on the next push | **ready, low priority**; bundle with W-03 if the owner approves (§9) |
| W-08 | Merge strategy for `main` | PM proposes, owner decides | – | W-04 | Owner chooses when PR #2 is merged; QA docs are brought in selectively (e.g. `docs/QA-*`, `qa/`), not by merging `claude/recovery-qa` wholesale | deferred until ordering is live |
| W-09 | Refresh stale docs: `BUILD-STATUS.md` and `RUN-AND-RELEASE.md` (builder, inside the W-03 bundle); QA-FINDINGS headline and §9 (QA, on its branch); PR #2/#3 descriptions | Builder / QA | PM reviews | – | Each doc states the current head, catalogue and process, or points to this register | ready, low priority; not a standalone round |
| W-10 | Search indexing launch (D-12) | Builder | QA | Owner decision D-12; W-02 | Indexing setting on; `noindex` removed; `sitemap.xml`; BreadcrumbList JSON-LD; checks updated; PM gives the owner Search Console steps | **separate launch decision**; not part of ordering |
| W-11 | Baymax/Kurama SKU swap (F-17, D-11) | Owner fixes the source; Builder migrates IDs only after | QA | Owner | One SKU per product across Airtable, Drive and the site | open; **not blocking**: the site uses `HC-BAYMAX`/`HC-KURAMA`, so order messages carry neither disputed SKU |
| W-12 | Policy pages: shipping, returns, terms (D-5) | Owner supplies text; Builder publishes | QA | Owner text | Pages show only owner-supplied text; footer links added | deferred; not required if wording stays "confirmed with your quote" |
| W-13 | Business email `info@honeycomb3d.store` (no MX records per QA E-8) | Owner | QA | – | Test message received before the address appears on the site | deferred |
| W-14 | Branch housekeeping: delete `claude/photo-handoff`; close superseded PR #1 | Owner | – | – | Done in the GitHub UI by the owner | deferred; PM does not delete branches or close PRs |

### Operations & Tools (separate workstream, §8)

| ID | Task | Implements | QA | Depends on | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| OPS-01 | Install the MakerWorld-to-Drive Apps Script | Owner (~10 min, `ops/makerworld-to-drive/README.md` "Owner setup") | – | – | `/exec` URL received; bookmark line generated | blocked on owner |
| OPS-02 | Share the imports folder with the team (Editor) | Owner | – | Team emails | Teammates can open the folder | blocked on owner |
| OPS-03 | First real-page test on Windows and Android | Owner/teammate; fixes by an ops implementer | ops QA | OPS-01 | One model saved from a live MakerWorld page; anything the real page breaks is fixed in `ops/makerworld-to-drive/` with tests updated | blocked |
| OPS-04 | Give the tool a durable home: move `ops/makerworld-to-drive/` to `honeycomb3d-ops-system` (or keep it on its branch and later merge) | PM proposes, owner decides | – | – | Tool lives on a branch that is protected from cleanup and outside the website's release path | open |
| OPS-05 | Listing pipeline (Drive import → Airtable → site) | Proposed only | – | OPS-03, D-10 licences | Defined by the owner later | deferred |
| OPS-06 | Start an "Ops & Tools" session? | Owner | – | – | Yes/no recorded | open; QA asked 2026-10-16, no answer |

---

## 5. Owner decisions needed

### To enable ordering (the smallest set)

Each has a recommended default that keeps today's honest wording; the owner can accept the defaults and supply only the number.

| ID | Question | Recommended default | Why it is needed |
|---|---|---|---|
| OD-1 | **Ordering method.** Turn on the existing WhatsApp order request (the customer sends a prepared message; you confirm and arrange payment in the chat; nothing is paid on the site)? A card checkout would be a separate, larger project with a payment provider and backend. | WhatsApp order request | Decides W-03's scope (D-1, F-03) |
| OD-2 | **WhatsApp number.** Is `+94 70 300 9064` (from April) still the business number, and who answers it? | – (must come from the owner) | The only order channel (D-2, F-11) |
| OD-3 | **Payment wording.** Keep "payment arranged when we confirm your order", or name methods (bank transfer, cash on delivery, both)? | Keep generic | Avoid unconfirmed payment claims (F-03). PayPal: a PayPal connector is available to this session (invoices, payment links), but PayPal does not list LKR as a supported currency. As the PM understands it, Sri Lankan PayPal accounts have historically been unable to receive payments. Neither point has been verified for this account, so PayPal is not recommended for local orders without checking the account first; it could suit overseas buyers paying in USD. |
| OD-4 | **Listings.** Approve the 17 live listings as they are (photos, draft descriptions, Airtable prices) and set every one to "Made to order" (or "Available")? This also confirms that the 10 new photos are your own prints, not the designers' (F-22), and that you may sell prints of these models (F-18/D-10). | Approve all; "Made to order" | Without approval and an availability value, live mode shows no products (§1a.1) |
| OD-5 | **Delivery wording.** Keep "delivery cost and timing are included in your quote", or give a rate and coverage (the old site said islandwide, Rs. 300)? | Keep current wording | Avoid unconfirmed delivery promises (D-4, F-08) |

### Separate decisions (not needed for ordering)

- **D-12 search indexing**: yes/no, when. Implementation W-10 after W-02.
- **CI re-pin** to `3b91946` (W-07): approve a one-line workflow change.
- **Ops & Tools session** (OPS-06), MakerWorld install (OPS-01), team emails (OPS-02).
- **D-11** Baymax/Kurama SKUs; **D-7** franchise-character stance; **D-5** policy text; Stormtrooper photo.

---

## 6. Decision log

Newest first. "Source" says where the owner said it; relayed quotes are marked.

| Date | Decision | Source | Effect |
|---|---|---|---|
| 2026-10-17 | PM takes over coordination; builder and QA stay idle until a decision unblocks work; no deploys, merges, DNS, ordering or indexing changes during takeover | Owner's takeover brief to the PM session | This register |
| 2026-10-18 | The PM implemented W-02 itself on the PM branch instead of waking the builder: the change is small, needs no owner decision, and saves the builder's usage. An independent reviewer subagent checked it; QA's full run and a green CI run are still required before any deploy | PM | W-02 |
| 2026-10-18 | The owner declined the batched OD questions for now. Work continues on everything that does not need them | Owner, in the PM session | W-01 stays blocked |
| 2026-10-17 | Ordering prerequisites: decouple indexing (W-02) and require per-product approval + availability with the number | PM, from code evidence §1a | W-02, OD-4 |
| 2026-10-17 | Recommended CI re-pin target changed from `c6931c6` to `3b91946` | PM, from test evidence §9 | W-07 |
| 2026-10-16 | Fewer, larger, bundled rounds; only clearly valuable or broken things | Owner, relayed by QA to the builder (handoffs agree) | Builder idle after `cc21b85` |
| 2026-10-16 | Add all 11 remaining Active Airtable products ("Add them.") | Owner, typed in the builder session | `8a0440b`, `e9f5c19` |
| 2026-10-16 | List the 10 verified photos ("list those") | Owner, in the QA session after a contact sheet | Live since D49–D50. F-22 authorship still open |
| 2026-10-16 | MakerWorld sourcing goes ahead; owner buys licences and checks models by hand | Owner, in the QA session (QA-FINDINGS §5b) | OPS workstream |
| 2026-10-16 | AI-edited photos allowed only if labelled, with at least one real photo, and recorded `aiEdited: true` | QA's conditions, applied because the owner stated no preference (§5b) | Rule for future listings |
| 2026-10-15 | Make the site public now | Owner (QA-FINDINGS §7c) | DNS moved to Vercel; ordering and indexing stay off |
| 2026-10-15 | Claude builder session replaces the GPT builder on `codex/storefront-mvp` | Owner (QA-FINDINGS §7c) | GPT not active since 2026-10-13 |
| 2026-10-15 | Deploy only when QA's full run passes **and** the CI push run for that exact SHA is green | QA, after the D7–D8 gap | Release gate §7 |
| 2026-10-11 | Airtable is the price and stock source; recommended photos approved; Minato variant tan/black | Owner (QA-FINDINGS §5a) | Prices with provenance |

Earlier decisions and the full evidence register: QA-FINDINGS §2, §5 and §5a on `claude/recovery-qa`.

---

## 7. Release process (corrected) and release evidence

**Gate for every production deploy** (all must hold for the exact SHA):
1. The builder ran `npm test`, `npm run build`, `npm run check`, `tests/browser.mjs`, `tests/images-browser.mjs` and the pinned QA image audit locally, then pushed to `codex/storefront-mvp`.
2. The GitHub "Storefront checks" **push** run for that SHA is green. (The workflow's push trigger covers only `codex/storefront-mvp`; work on other branches gets CI only through a PR to `main`.)
3. QA, a different session from the builder, runs `qa/scripts/full-run.sh` on the SHA with an overall PASS, plus any feature probe, and reviews screenshots at 320/390/1440 px.
4. The PM authorises the deploy; QA deploys with Vercel `create_deployment` (`gitSource` ref `codex/storefront-mvp`, full SHA, `target: production`) and confirms READY plus the aliases with `get_deployment`.
5. QA records the round and `dpl_` ID in QA-FINDINGS §7c; the PM adds the row below.

Never deploy a SHA whose CI is red, even if QA's own checks pass (D7–D8). A changed data or ordering state also needs the owner decision recorded in §6.

**Production deployments, verified by the PM from the Vercel and GitHub APIs on 2026-10-17** (project `honeycomb3d-storefront-preview`; all READY):

| Created (UTC) | Commit | Deployment | CI push run | Result |
|---|---|---|---|---|
| 2026-10-16 14:16 | `cc21b85` | `dpl_EfNAbF2b1c8p6sYHNmDNo64CDnDk` | 38911670020 | green (current) |
| 2026-10-16 13:51 | `2b0f4b4` | `dpl_H3c4G5bvUv7YTCULgSurYFNj8cj9` | 38909857316 | green |
| 2026-10-16 13:37 | `8e854d7` | `dpl_FKE57yCau5EhjvXT3aWCZMg3n2LZ` | 38908217834 | green |
| 2026-10-16 13:25 | `86d6560` | `dpl_57eX4rnURi3MVMHtkMXaPGgj9vfm` | 38905680276 | green |
| 2026-10-16 13:05 | `4501811` | `dpl_4RmsS8cmD1mTWxSAv5QwKvjNe4hG` | 38903451914 | green |
| 2026-10-16 12:46 | `a327c0b` | `dpl_8k3XnLieSM1BB9or19YDTp1vBg5r` | 38894543520 | green |
| 2026-10-16 11:29 | `e9f5c19` | `dpl_8D1ADQQpme7KWMYuqk7XpZtzAwN6` | 38889794042 | green |
| 2026-10-16 08:05 | `44a0f95` | `dpl_9RQLfKYo2SfyKBGFTKEtkZxbrnku` | 38869743349 | green |
| 2026-10-16 07:57 | `2173682` | `dpl_C2EJryhoX4X3wvFmGh3iFCeGf4Rb` | 38868662237 | green |
| 2026-10-16 07:40 | `060ae0c` | `dpl_2w3yTuAfwrEKVJHXMkn6PaJPyKBW` | 38868239742 | green |
| 2026-10-16 04:54 | `34a5722` | `dpl_A3q4YV1kttqqpMjnzpwSNrgUnhRn` | 38849143190 | green |
| 2026-10-16 03:29 | `144febc` | `dpl_SxCBLqVFWw7GVAMra3yzAaCjdqJA` | 38843749752 | green |
| 2026-10-16 03:24 | `19458c7` | `dpl_2MfSdVAS36MzCR2boxdu8fYvG5iY` | 38843018145 | green |
| 2026-10-16 03:01 | `2ae5546` | `dpl_D7cr178YpjUBdtipfZtmGoVUgJFR` | 38842909462 | green |
| 2026-10-16 02:54 | `02746d7` | `dpl_HFvLjUNY4UdPQxfzUJWiRjX5muRe` | 38842374070 | green |
| 2026-10-16 02:49 | `d262565` | `dpl_GHbE1YUiMM2rrtFhVkwKEkQQEkPz` | 38841939198 | green |
| 2026-10-16 02:44 | `c8d8220` | `dpl_947x8oRKGJ6KzyJff68Dc4BG8o8a` | 38806333977 | green |
| 2026-10-15 21:01 | `7890062` | `dpl_CiiaFqD4apGhZkTcyF49JMX6zcdf` | 38805420090 | green |
| 2026-10-15 20:53 | `ed752db` | `dpl_BdyEGqXWbhBjk2x5anAruJ5UEWTa` | 38804429618 | green |
| 2026-10-15 20:49 | `1c7716b` | `dpl_FoaRpvotoXDkVDnd6p7pbzeu9K4L` | 38803724268 | green |
| 2026-10-15 20:37 | `a7c3b85` | `dpl_886hnihyu676wWRqrc76y7hJfLhp` | 38802643905 | green |
| 2026-10-15 20:32 | `868c92f` | `dpl_2WujsHtS2GF4NLC8RxQ6K2H5Ae7X` | 38802144313 | green |
| 2026-10-15 20:27 | `878bd69` | `dpl_8wY8eZbHcjVM9LXQM6aCswjrY9mu` | 38801263583 | **red: deployed with failing CI** |
| 2026-10-15 20:24 | `e5bdc9d` | `dpl_AFveJFKTBVeSohV87ju3ARsmNocG` | 38801001391 | **red: deployed with failing CI** |
| 2026-10-15 20:21 | `4475bf0` | `dpl_DmzM1Nacq2W4PLdzXT6ejrZLg1Rw` | 38800344145 | green |
| 2026-10-15 20:20 | `341fc3c` | `dpl_3bHxjSKBQhERuyCv7sGjAKrd4QUN` | 38799609374 | green |
| 2026-10-15 20:12 | `2b3ccb3` | `dpl_Bs5jEV7Htedur8aGL73va9NRJmv1` | 38797908395 | green |
| 2026-10-15 06:58 | `948dff5` | `dpl_5GmV5ARhUXgdZ4J3bkZZkVg5w3g3` | 38443630696 | green |
| 2026-10-09 05:57 | `2260c7f` | `dpl_5vAADCgWroCeU2zeD6iYrP8Eonx8` | 37889803597 | green |

CI push runs that failed and were **not** deployed: `5d1c6a4`, `94291ad`, `0f8b5fb`, `40d0f1e`, `d2a4a7b`, `ef2774a`, `f3866f6`, `ca7c369`, `2ec9e8a`, `e3e83b8`, `ec6c1c2`, `cad746d`, `f6b6d42` (74 push runs in total).

---

## 8. Operations & Tools: MakerWorld-to-Drive

- **What:** a Google Apps Script web app plus a bookmarklet that saves a MakerWorld model's photos, print data and a computed price into the shared Drive folder and a log sheet (team version v3).
- **Where:** `ops/makerworld-to-drive/` on `claude/handoff-recovery-qa-deploy-makerworld` @ `0182080` only. It is not on the storefront or PM branches, and it must not be dropped during website integration (OPS-04).
- **State (reported by QA, not re-run by the PM):** mock-tested only (`server-test.mjs` 18 checks, `page-test.mjs` 7 flows, `bm-test.mjs` 3 checks, all passing on 2026-10-17). **Not installed. Never run against a live MakerWorld page** (`makerworld.com` is blocked from these environments) and Gemini output is unverified.
- **Team guide:** private artifact <https://claude.ai/artifact/Vb6NXqyDGWMdxooDM7a198>; the owner must share it.
- **Tasks:** OPS-01…OPS-06 in §4. Nothing here blocks the website.

---

## 9. CI QA-script re-pin assessment (PM, 2026-10-17)

- CI fetches `qa/e2e/image-audit.mjs` and `qa/scripts/image-provenance.py` from QA commit `97780b0` (2026-10-13).
- Since then QA changed them twice: `c6931c6` (decorative `alt=""` beside a described photo is INFO, not FAIL) and `3b91946` (provenance flags Gemini `trainedAlgorithmicMedia`/`algorithmicallyEnhanced`, "Added visible watermark", and reports Canva exports). No later changes up to QA head `6407430`.
- **Tested on `cc21b85`:** audit at `97780b0` and at `3b91946` both `{"PASS":38,"INFO":1}`; provenance at both versions exit 0.
- **Recommendation:** re-pin to `3b91946`, not `c6931c6`; it includes both changes. Value is modest. The builder's `060ae0c` already works around the alt rule, and the published derivatives are metadata-stripped, so the new markers mostly matter for future imports. Risk is low (identical results today). Needs the owner's approval because the builder will not edit shared CI. Bundle with W-03 rather than spend a round on it.

---

## 10. Next review points

- When the owner answers OD-1…OD-5: record them in §6, update W-01, and start W-03 (W-02 is ready to fast-forward in) as one bundle (messages in `RELAY-MESSAGES.md`).
- When W-04 deploys: add the row to §7, run W-05 with the owner.
- No scheduled check-ins are armed. Nothing in this register needs polling.
