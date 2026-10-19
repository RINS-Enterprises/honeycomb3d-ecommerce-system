# HoneyComb 3D: work plan across Claude sessions

Written by the PM session (`session_01R5ExKrg6wn9ckahNmypHvG`) on 2026-10-19.
Owner: "create different claude sessions and you manage them to get these things done separately. i want it all done to the maximum capacity."

## How it works

- **One session per workstream.** Each has its own branch and its own draft PR into `main`. Sessions never merge, and never push to another session's branch.
- **The PM session manages.** It sends work, reads progress, runs an independent QA review on every change, merges website changes into the release branch `claude/funny-albattani-c5a91a`, and is the **only** one that deploys honeycomb3d.store.
- **Each session owns separate files**, so the sessions don't collide:

| Workstream | Session | Branch | Owns | Draft PR |
|---|---|---|---|---|
| PM, release, QA | `session_01R5ExKrg6wn9ckahNmypHvG` | `claude/funny-albattani-c5a91a` | `docs/pm/`, `data/`, merges, deploys | #4 |
| A. Ops & Automations | `session_013L9wyryuVwxe3a63LEWuHF` | `claude/ops-automations` | `ops/` (MakerWorld → Drive, Make.com) | #5 |
| B. Storefront Features | `session_01P4rDTmJdNnBT11zLsVBDUc` | `claude/storefront-features` | `src/`, `tests/`, `scripts/` | yes |
| C. Payments & Delivery | `session_01GuJ8iA9VxoWbiFWcjJw3gQ` | `claude/payments-delivery` | `docs/business/` | yes |
| D. Brand & Marketing | `session_01Dnbbn6C3L45QMsHHFSUNNK` | `claude/brand-marketing` | `docs/marketing/` | yes |

- **Owner decisions are asked in one place.** Each session tells the owner directly what it needs; the PM keeps the master list in `PROJECT-REGISTER.md` §5.

## Rules for every session

- The business WhatsApp is **071 059 9815 (94710599815)**.
- Never use +94 70 300 9064, +94 77 491 9109 (a former partner's numbers) or 0710559815 (a typo).
- Never invent prices, stock, reviews, licences, delivery times or payment promises.
- No deploys, DNS changes or search-indexing changes outside the PM session.
- No paid APIs or plans, and no account changes (Make, Canva, Airtable writes, social posts), without the owner's explicit OK in that session.
- Never print secrets. Never delete branches, files or records.

## Backlog by session

**A. Ops & Automations**
1. Install the MakerWorld → Drive tool and test it on one real model (OPS-01, OPS-03).
2. Build the four Make recipes once the owner says so (W-17).
3. Propose the listing pipeline: Drive → Airtable → site (OPS-05).

**B. Storefront Features** (code; each item behind a switch where it needs an owner fact)
1. Order button on shop cards.
2. Cart bundle suggestions (existing prices only).
3. FAQ page (how ordering works, made to order, colours and sizes; no promises).
4. Delivery line: a `delivery` setting in store data, shown in the cart and on product pages. Off until the owner gives the line.
5. Payment-method choice in the order message (bank transfer / cash on delivery), behind a switch. Off until the owner confirms which methods.
6. Social links in the footer, from store data. Empty until the owner gives accounts they control.
7. Trust pages: Shipping, Returns, About. Templates with owner-text placeholders, hidden until filled.
8. Indexing prep: sitemap and BreadcrumbList data, behind `searchIndexing`. Stays off (D-12).
9. Preview-mode browser test fixture (QA follow-up); refresh `BUILD-STATUS.md` and `RUN-AND-RELEASE.md`.

**C. Payments & Delivery** (research and owner guides; no code)
1. Sri Lanka payment options compared for 2026: PayHere, WebXPay, Genie Business, KOKO/Mintpay, bank transfer, COD. Cover fees, documents, payout time and static-site fit.
2. Step-by-step business registration (sole proprietorship) for Kegalle, with costs and the documents PayHere needs.
3. Courier comparison: published rates, plus a phone script and quote sheet for the owner. Recommends the delivery line and fee.
4. PayPal (Sri Lanka) receive setup through Commercial Bank or Sampath, with the USD 1 test.
5. Exact config values for B's delivery and payment switches once the owner decides.

**D. Brand & Marketing** (content; nothing posted or created in accounts without the owner's OK)
1. Launch kit: Instagram, Facebook and TikTok bios, a 30-day post plan using the existing approved photos, and captions in English and Sinhala.
2. Google Business Profile: setup guide for a new listing the owner controls (not the old Kandy one).
3. Photo upgrade: shot list and a cheap home-studio guide (builds on NEXT-PHASE §1).
4. Customer reviews: a WhatsApp message asking past buyers for a review (real reviews only), and where to show them.
5. Canva templates for posts and stories, created only after the owner says yes in that session.

## Release flow (website)

1. B pushes to its branch, and CI runs on its PR.
2. The PM runs an independent QA review.
3. B fixes the findings.
4. The PM merges into `claude/funny-albattani-c5a91a`, runs the full gate, waits for green CI, and deploys to production.
5. The PM verifies the live site and records the release in the register.

## Check-ins

The PM reviews every session about every 1–2 hours while work is active. It answers blockers, re-prioritises, and reports to the owner in one short message.
