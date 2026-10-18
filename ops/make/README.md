# HoneyComb automations (Make.com)

Prepared 2026-10-18 by the PM session. **Not built yet.** This session's permission system treats creating scenarios in the owner's Make account as an account change that needs the owner's explicit approval.

There are two ways to get them:
- Tell the PM session "build the Make automations": one explicit approval, then it builds them.
- Build them yourself in Make from the recipes below, about 5–10 minutes each.

All four only **read** data and only message **you**. None of them changes Airtable or contacts customers. The schedules keep the total around **150 operations a month**, well inside Make's free 1,000.

| # | Automation | Schedule | What it protects | Ops/month (approx.) |
|---|---|---|---|---|
| 1 | Storefront guard | daily 08:00 | ordering stays on, with your number | ~60 |
| 2 | Price drift check | Mondays 07:30 | site prices match Airtable | ~25 |
| 3 | Weekly business digest | Mondays 08:00 | orders, unpaid items, reorder list | ~40 |
| 4 | Monthly listing review | 1st of month | stale photos, prices, descriptions | ~2 |

Notifications: use Make's **Gmail › Send an email** module to `isurusandaruwan026418@gmail.com`; you connect Gmail once in Make. Telegram or Slack also work if you prefer push messages.

---

## 1. Storefront guard (most important)

**Why:** the live site is deployed from a branch. If an older branch is ever deployed, online ordering silently switches off, or a wrong number comes back. This check notices within a day.

1. **Schedule:** every day at 08:00 (Asia/Colombo).
2. **HTTP › Make a request:** GET `https://honeycomb3d.store/data/store.json`, parse response = Yes.
3. **Router** with one route, filter "something is wrong", where ANY of these is true:
   - Status code ≠ 200
   - `mode` ≠ `live`
   - `whatsappNumber` ≠ `94710599815`
   - `whatsappVerified` ≠ `true`
4. **Gmail › Send an email:** subject `⚠ HoneyComb site check failed`. Body: status code, mode and number, plus "Open honeycomb3d.store and tell Claude: roll back to the last good deployment."

It stays silent when everything is fine.

**Hard rule:** the guard must also alert if the number is either of the former partner's numbers. The `≠ 94710599815` check already covers that.

## 2. Price drift check

1. **Schedule:** Mondays 07:30.
2. **HTTP › Make a request:** GET `https://honeycomb3d.store/data/products.json`, parse response.
3. **Airtable › Search records:** base `appTRxtdHRFH7mgLX`, table **Products**, all records. Fields: SKU, Product Name, Selling Price (LKR), Status.
4. **Iterator** over the site products. For each one, look up its Airtable record and compare `priceLkr` with Selling Price (LKR). Site IDs to Airtable record IDs:
   - `HC-LEAF` recgVDtQsRTEGSyzG
   - `HC-BAYMAX` recIC7e7QDrEe31ac
   - `HC-KURAMA` recIEe7aBzmZkPiIQ
   - `HNYCMB501` rechNg8MzLC5lT3uu
   - `HC-MINATO` recjsg5yUe8VJDPWl
   - `HC-LIGHTFURY` recI8XqnYur0JllUa
   - `HC-KUNAI` recXi9upTrq3CYmlF
   - `HNYCMB505`–`518`: the ID is the Airtable SKU.
5. **Text aggregator:** one line per mismatch, e.g. `Kurama Figure: site 1,500, Airtable 1,800`. Also list Airtable products with Status = Active that are not on the site.
6. **Filter** "aggregated text is not empty", then **Gmail › Send an email** to you.

To change a price on the site: update Airtable, then tell Claude "sync prices from Airtable". Prices on the site are only changed deliberately, with a record of where each came from.

## 3. Weekly business digest

1. **Schedule:** Mondays 08:00.
2. **Airtable › Search records, Orders:** formula `IS_AFTER({Order Date}, DATEADD(TODAY(), -7, 'days'))`.
3. **Numeric aggregator:** count and SUM of Subtotal (LKR).
4. **Airtable › Search records, Orders:** where Payment Status is not paid OR Delivery Status is not delivered. Check the exact option names in your base first.
5. **Airtable › Search records, Production Jobs:** where Status is not done.
6. **Airtable › Search records, Filament Inventory:** formula `{Stock (kg)} <= {Reorder Threshold (kg)}`.
7. **Airtable › Search records, Packaging Inventory:** formula `{Current Quantity} <= {Reorder Threshold}`.
8. **Gmail › Send an email:** "HoneyComb week", with sections for orders (count, LKR total), waiting for payment or delivery, jobs in progress, and to reorder.

Note: 9 of the 16 filament rows have no stock value (QA finding F-20), so the reorder list is only as good as that data.

## 4. Monthly listing review

1. **Schedule:** the 1st of every month.
2. **Gmail › Send an email** with a fixed checklist:
   - Any new prints to photograph? (Use the photo guide in `docs/pm/NEXT-PHASE.md`.)
   - Prices changed in Airtable? Run the price check.
   - Any product sold out or discontinued? Tell Claude to mark it unavailable.
   - Instagram and Google Maps still show only 071 059 9815?

---

## Not built: ideas that need you to set something up first

| Idea | What it needs |
|---|---|
| Log every WhatsApp order into Airtable automatically | WhatsApp Business **Platform** (Cloud API) through Meta Business verification; the ordinary WhatsApp Business app cannot be automated |
| Card payment confirmations into Airtable | A PayHere (or similar) merchant account; PayHere can send payment notifications to a Make webhook |
| Auto-post new products to Instagram | An Instagram **business** account you control, connected to a Facebook Page |
| MakerWorld imports into Airtable drafts | The MakerWorld-to-Drive tool installed (register OPS-01) |
