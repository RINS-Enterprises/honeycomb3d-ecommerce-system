# Team 2 brief: lead session + interns on the owner's second Claude account

Written 2026-10-30 by the main PM session (`session_01R5ExKrg6wn9ckahNmypHvG`, main account). The owner (Isuru) has unused usage on a second account until Monday. **Team 2 does the building. The main PM reviews, merges and releases.** The two accounts can't message each other, so GitHub is the only channel.

## You are the Team 2 lead
Read in this order: this file, `docs/pm/PROJECT-REGISTER.md`, `docs/business/OPERATING-PLAN.md`, `README.md`.

Then:
1. **Start item 1 (Comic Con kit) yourself immediately**, or put Intern A on it right away. The owner needs it **today**.
2. Create intern sessions in your account (A, B, C; see the backlog). Give each intern this file plus its item. Run them in parallel. This account's usage is meant to be used up before Monday.
3. Keep `docs/team2/STATUS.md` on branch `team2/lead`: each item, its owner, branch, PR, state and the last commit.
4. Check your PRs for comments from the main PM every 60–90 minutes (schedule it with `send_later`) and route fixes to the right intern.

## Protocol: how work reaches the live site
1. **Branches:**
   - one per item: `team2/<item>` (e.g. `team2/comic-con-kit`), branched from `origin/claude/funny-albattani-c5a91a`
   - never push to `claude/funny-albattani-c5a91a`, `main`, `codex/*`, or other sessions' branches
2. **PRs:** open a **draft PR into `main`** titled `[team2] <item>` so CI runs. Never merge it.
3. **Before "ready":**
   - the full local gate passes (below)
   - an **independent QA subagent** has reviewed the diff and its findings are fixed
   - CI on the PR is green
4. **Ready:** mark the PR "Ready for review" and end its description with:
   `READY FOR PM REVIEW: <one-line summary> · owner decision needed: yes/no (<which>)`
5. **The main PM** reviews and then does one of:
   - merges it into the release branch, deploys and comments `Merged in <sha>, live in <deployment>`
   - comments findings for you to fix
   - merges it with the switch **off** and asks the owner
6. **Deploys:** only the main PM deploys. **Never touch Vercel, DNS, or production settings.**

## Local gate (every code item)
```
for l in playwright playwright-core; do [ -e node_modules/$l ] || ln -s /opt/node-tools/node_modules/$l node_modules/$l; done
npm test
npm run gate:preview && npm run gate:all-on && npm run gate:proposal && npm run gate:policies && npm run check:indexing && npm run gate
```
Run `npm run gate` **last**, so `dist/` ends in the committed state. Port 4173 must be free. To stop a local server, kill it in a separate command. Check screenshots at 390px and 1440px yourself.

## Hard rules
- **Numbers:** the business WhatsApp is **94710599815 (071 059 9815)**. Never use +94 70 300 9064, +94 77 491 9109 or 0710559815, in any format. `scripts/check.mjs` fails the build if they appear.
- **Facts:** never invent prices, stock, reviews, licences, delivery times or payment promises. Prices come only from `data/products.json`.
- **Owner decisions:** anything that needs one (delivery fee, payment methods, policies, social handles, prices for painted or display editions) is built behind a **switch that is off** in `data/store.json`.
- **Accounts and money:** no paid services or plans. No account changes (Airtable writes, Make imports, Canva designs, social posts, sign-ups) without the owner's explicit OK in that session.
- **Secrets:** never print or commit them.
- **Search indexing:** stays off.
- **Code style:** match the existing style (dense one-line HTML builders, `e()` escaping, tokens in `src/styles.css`). `src/domain.mjs`, `src/app.mjs` and `src/card.mjs` ship to browsers: no regex `v` flag, nothing newer than iOS 16 Safari supports.

## Backlog (priority order)

### 1. Comic Con stall kit: TODAY (lead or Intern A)
Lanka Comic Con is this weekend. Build print-ready PDFs with a script under `tools/printables/`:
- Use Playwright `page.pdf()` from HTML.
- A QR library may be added as a **devDependency** only. It must never ship in `dist/`.
- Output to `print/comic-con-2026/`.

What to make:
- **`price-board-A4.pdf`:** all 17 approved designs with photo (from `public/assets`), name and exact price from `data/products.json`, grouped by category. Dark HoneyComb style, readable from 2 m. Footer: "Order on WhatsApp 071 059 9815 · honeycomb3d.store". Painted pieces: "Painted versions: ask us". Don't invent a price.
- **`table-signs-A5.pdf`:**
  - (a) "Order on WhatsApp" with a big QR to `https://wa.me/94710599815`
  - (b) "See the full collection" with a QR to `https://honeycomb3d.store`
  - (c) a blank framed slot labelled "Pay by LankaQR" for the owner's own QR sticker
- **`business-card.pdf`:** 85×55 mm, front and back, plus an A4 sheet of 10 cards with crop marks. Contents: logo, "3D-printed collectibles, made in Sri Lanka", WhatsApp, website QR.
- **`tally-sheet-A4.pdf`:** a table of design / price / start stock / sold (tick boxes) / paid by (cash, QR, transfer), with daily totals.

Then:
- QA: decode every QR code in the PDFs programmatically and assert the exact targets. Assert every price matches `products.json`. Render each PDF page to PNG and look at it.
- **Send the PDFs to the owner directly** from your session (file share) as soon as they pass QA, with one line on printing: A4 at 100% scale, cards on 250–300 gsm.
- Then open the PR.

### 2. Business systems (Intern A, after item 1)
Files only. Nothing is created in Airtable or Google.
- `docs/business/tools/pricing-calculator.xlsx`, one row per product:
  - inputs: filament grams × cost per gram, print hours × machine rate, paint minutes × painter rate, packaging, margin %
  - output: suggested price and margin next to the current site price
  - rates live in clearly labelled owner-editable cells, starting **empty**
- `print/checklists/job-checklist-A4.pdf`: order confirmed → printed → cleaned → painted → photographed → packed → posted → customer messaged.
- `docs/business/AIRTABLE-BOARD.md`: a design for one board (fields, views *To print → Printing → Painting → Packing → Shipped*, owner and due date). A design only.
- `docs/business/PARTNERSHIP-AGREEMENT-TEMPLATE.md`: ownership, profit split, spending limits, helpers, exit. Blanks for every number. A "have a lawyer or notary review" note.
- `docs/business/SUNDAY-CHECKIN.md`: a 20-minute agenda and a one-page printable.

### 3. Website upgrades (Intern B)
Every item sits behind an **off** switch, and the off state stays byte-identical to today.
- **Editions:** optional per-product `editions` in `data/products.json`, e.g. `[{"id":"standard"},{"id":"painted","priceLkr":null},{"id":"display","priceLkr":null}]`.
  - An edition shows only when it has an owner-given price.
  - The order message names the edition.
  - Tests cover both states.
- **Event banner:** `store.event` (null by default), e.g. `{"text":"Find us at Lanka Comic Con this weekend","until":"2026-11-02"}`. A slim banner on the home and shop pages, hidden automatically after `until`.
- **Speed and accessibility pass:** Lighthouse-style checks with Playwright. Fix real issues only, with before/after numbers in the PR.
- **Photo-import readiness:** document and test the existing image pipeline (`scripts/prepare-images.py`, `scripts/check-images.mjs`) so new owner photos can be imported in one command. No new photos are imported without the owner.

### 4. Order log + automation blueprints (Intern C)
- **`tools/order-log/`:** a static page (not part of the shop's navigation).
  1. The owner pastes a WhatsApp order message (the format comes from `orderMessage` in `src/domain.mjs`).
  2. It's parsed in the browser into items, quantities and totals.
  3. It opens a **pre-filled Airtable form URL**.

  No API keys in the browser. Nothing is written until the owner submits the form. Document the form fields the owner must create. Unit-test the parser against `orderMessage` output.
- **`ops/make/blueprints/*.json`:** importable Make scenario blueprints for the recipes in `ops/make/README.md`, with placeholders for connections. **Do not import them into Make.**

### 5. Payments checkout prep (Intern C, after item 4)
- **What:** a card checkout for PayHere and/or Dialog Genie, built as a Vercel serverless function behind `store.checkout` (off).
- **Mode:** sandbox/test only, with secrets read from env vars the owner adds later. Never put real keys in the repo.
- **Docs:** the CSP changes in `vercel.json` and the exact steps the owner takes after approval.
- **Review:** the main PM's QA is required before merge. Mark it **owner decision needed: yes**.

## When you finish everything
Pick up the open nits in `docs/storefront/STATUS.md` on `origin/claude/storefront-features`. The main ones:
- suggestion relevance: weigh specific tags over broad ones
- the FAQ says "tap Order" while product pages say "Order now"

Keep `docs/team2/STATUS.md` current. When the week ends, write a hand-back summary at the top of it.
