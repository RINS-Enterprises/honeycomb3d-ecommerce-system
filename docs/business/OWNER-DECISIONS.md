# Decisions for Isuru: payments and delivery

Six decisions. For each: what Claude recommends, why (in one line), and **the exact sentence to reply with**. Copy the sentence, or change the number or words, and send it to Claude. Details are in the linked guides. Written 19 Oct 2026.

---

### 1. Delivery line and fee (for the cart and product pages)
**Recommended:** "Islandwide delivery by courier, **LKR 400**. Usually **2–4 working days** after your order is printed."
**Why:** SL Post Courier costs Rs 200–350 for parcels up to 1 kg (official price list, Feb 2026). LKR 400 also covers the box and wrapping. If you choose a private courier after calling, use LKR 500. → [delivery.md](delivery.md)

> **Reply:** "Delivery: islandwide by courier, LKR 400, usually 2–4 working days after printing."

### 2. Payment methods to offer
**Recommended:** **LankaQR, bank transfer and cash on delivery.**
**Why:** none of these need a registered business. LankaQR has no fee to you on payments up to Rs 5,000 (since 6 Apr 2026). COD builds trust with new customers. → [payments.md](payments.md)

> **Reply:** "Payments: LankaQR, bank transfer and cash on delivery."

Want COD only for repeat customers? Reply instead: "Payments: LankaQR and bank transfer; cash on delivery for repeat customers only."

### 3. Which QR / payment app to sign up for (you do this yourself)
**Recommended now:** **Dialog Pay Business**, the **QR Smart** plan (formerly Genie Business). It's free, you sign up with your NIC only, and you're paid the next day. If you bank with HNB, **HNB SOLO** is an alternative.
**After you register:** **PayHere Lite** for card payments by link: no monthly fee, 3.30% per payment.
**Why:** QR Smart costs nothing at your prices. PayHere is the cheapest card option, but it probably needs a BR certificate (unconfirmed). → [payments.md](payments.md)

> **Reply:** "I'll sign up for Dialog Pay Business QR Smart. Tell me when to add PayHere."

### 4. Register the business, or not yet
**Recommended:** **Not yet. But get your free TIN now**, on ird.gov.lk. From 1 Nov 2026, a TIN is reported to be needed to open a bank account or register a business. Register when you want card payments through PayHere.
**Why:** everything in decision 2 works without registering. Registering takes about 3 weeks, a name board and possibly a Pradeshiya Sabha trade licence. → [register-business.md](register-business.md)

> **Reply:** "Don't register yet. I'll get my TIN this week."

### 5. PayPal for overseas buyers
**Recommended:** **Yes, after a test.** In the Commercial Bank or Sampath app, link PayPal. Ask someone abroad to send **USD 10**, and withdraw it. Set a **USD 20 minimum** for PayPal orders.
**Why:** fees take about 24% of a USD 20 order but only about 11% of a USD 100 one (our arithmetic), and a USD 1 test can't be withdrawn at ComBank (minimum withdrawal USD 3.50). → [paypal.md](paypal.md)

> **Reply (after the test arrives):** "PayPal works, switch it on. Minimum PayPal order USD 20."

### 6. Which courier
**Recommended:** **Start with SL Post Courier.** Call **Domex, Koombiyo and Pronto** (all have Kegalle branches) using the phone script, and switch if one offers home pickup and weekly payouts at a similar price.
**Why:** SL Post is the only courier with published prices, and it's the cheapest. → [delivery.md](delivery.md) (script and quote sheet)

> **Reply:** "Use SL Post for now. I'll call Domex, Koombiyo and Pronto and send you the quotes."

---

## Website settings these replies turn into (for session B)

Session B is building the switches (plan items B4 and B5). These are **proposed values**; B names the actual keys. Nothing goes live until you reply above.

| Your reply | Proposed store setting |
|---|---|
| Decision 1 | `delivery`: on, text "Islandwide delivery by courier, LKR 400. Usually 2–4 working days after your order is printed.", fee `400` |
| Decision 2 | `paymentMethods`: `["lankaqr", "bank-transfer", "cash-on-delivery"]`. The order message adds the customer's choice. Cart text: "Pay by LankaQR, bank transfer or cash on delivery. We confirm your order and send payment details on WhatsApp." |
| Decision 5 | `paypalOverseas: true` (already built), only after your test |

Until then the site keeps saying payment and delivery are arranged when you confirm the order, which is safe.
