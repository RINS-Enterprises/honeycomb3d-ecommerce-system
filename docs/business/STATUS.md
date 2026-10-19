# Session C · Payments & Delivery: status

Branch `claude/payments-delivery` (from `claude/funny-albattani-c5a91a`, merged up to `bb28650`). Draft PR #6 into `main`; never merged by this session. Research and owner guides only; no website code. Updated 19 Oct 2026.

| # | Document | State | Commit |
|---|---|---|---|
| 1 | [`payments.md`](payments.md) | done, fact-checked (corrections applied) | `0548554` |
| 2 | [`register-business.md`](register-business.md) | done, fact-checked (corrections applied) | `15eb458` |
| 3 | [`delivery.md`](delivery.md) | done, fact-checked (6 corrections applied) | `b98a711` |
| 4 | [`paypal.md`](paypal.md) | done, fact-checked (corrections applied) | `58498ee` |
| 5 | [`OWNER-DECISIONS.md`](OWNER-DECISIONS.md) (includes the proposed config values for session B's delivery and payment switches, plan item C5) | done | `8cb9b66` |

Each document had an independent subagent fact-check its key numbers against the cited sources before it was finalised.

## Open questions (none block the owner's decisions)

**Ask the provider, or confirm on a live page**
- **PayHere:** all PayHere pages blocked our tools (403), so every PayHere figure is from search summaries. Open: does an unregistered home seller get cards or only HelaPay? Must the account be in the business name? Is VAT added?
- **Dialog Pay Business:** is VAT added to fees? Can payouts go to an existing bank account instead of Dialog Finance?
- **Couriers:**
  - No private courier publishes COD fees, VAT treatment or whether an unregistered individual can open a COD account. The owner's phone script covers this.
  - The Domex rates are from an offline third-party table.
  - SONIC's site has an expired certificate, so its figures are from search summaries.
- **SL Post:** counter COD without a registered business is our reading of the COD manual, not stated outright.
- **PayPal:** Sampath's withdrawal fee is not published. Unclear whether ComBank's fee comes out of the amount withdrawn or is added on top. Unclear whether PayPal.Me works for Sri Lankan accounts.

**Registration (ask at the Divisional Secretariat)**
- The Sabaragamuwa registration fee and any renewal fee were not found.
- Unclear whether a home-based online shop must have a name board and a Pradeshiya Sabha trade licence.
- The 1 Nov 2026 TIN rule is from news reports (IRD notice SEC/PN/IT/2026/05); not found on ird.gov.lk.

**Hand-off to session B**
- B has not built the `delivery` or payment-method switches yet (checked `origin/claude/storefront-features` on 19 Oct 2026). The values in `OWNER-DECISIONS.md` are proposals; B chooses the actual key names.

**Out of lane, flagged only**
- `data/store.json` on the base branch still carries the typo number in its `source` note. Session B's branch has already removed it. That file belongs to the PM, so this session did not touch it.

**Top 3 owner decisions:**
1. **Delivery line:** "Islandwide by courier, LKR 400, usually 2–4 working days after printing."
2. **Payments:** LankaQR, bank transfer and cash on delivery, with Dialog Pay Business QR Smart for the QR.
3. **Registration:** don't register yet, but get the free TIN now.
