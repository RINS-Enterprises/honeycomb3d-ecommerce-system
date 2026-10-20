# Prepared coordination messages

Drafted by the PM on 2026-10-17. None have been sent yet (see `PROJECT-REGISTER.md` §3).
The PM sends them with `send_message` when the task starts, or the owner pastes them into the session.

---

## 1. To the builder (`session_01TEeSdr5WV5Hvnw8RC17Exi`), when OD-1…OD-5 are answered

> PM here. The PM session `session_01R5ExKrg6wn9ckahNmypHvG` now coordinates HoneyComb; QA still runs QA and deploys. Task register: `docs/pm/PROJECT-REGISTER.md` on `claude/funny-albattani-c5a91a`.
>
> One bundled round on `codex/storefront-mvp`, tasks W-03 on top of W-02 (+ W-07 and W-09 if listed below):
>
> 1. **W-02 is already done** on `claude/funny-albattani-c5a91a` (PM, reviewed; see register W-02). Start by fast-forwarding `codex/storefront-mvp` to that branch (`git merge --ff-only origin/claude/funny-albattani-c5a91a`; it is `cc21b85` + docs + W-02). Run the full gate on it.
> 2. **W-03.** Apply the owner's ordering answers exactly as recorded in register §6: the WhatsApp number (`whatsappVerified: true`), `mode: live`, `approved` and `availability` per OD-4, and payment/delivery wording per OD-3/OD-5. Remove the "opens soon" copy. In live mode all 17 photographed designs must stay visible; `visibleProducts()` hides unapproved ones.
> 3. If listed: W-07 re-pin CI QA scripts to `3b91946` (owner approved it); W-09 refresh `BUILD-STATUS.md` and `RUN-AND-RELEASE.md`.
>
> Data rules are unchanged otherwise: no price, SKU, ID or name changes, and no invented claims. The owner will confirm the data change in this session. Run the full per-commit gate, push, wait for a green CI push run, then send the SHA to QA. Do not deploy.

## 2. To QA (`session_013P5Y2u35xPGTnfAHfm2K1t`), when the builder reports the SHA

> PM here. The PM session `session_01R5ExKrg6wn9ckahNmypHvG` now coordinates HoneyComb (register: `docs/pm/PROJECT-REGISTER.md` on `claude/funny-albattani-c5a91a`). Please QA the ordering bundle at `<SHA>` (W-04):
>
> - `qa/scripts/full-run.sh` on the SHA, including the live-fixture smoke and the domain tests with `WHATSAPP_NUMBER=<confirmed>`.
> - Confirm all 17 photographed designs are visible, the cart opens `wa.me/<number>` with the full message (AC-WA-1…5), and the payment and delivery copy matches register §6 exactly.
> - **Indexing must still be off:** `noindex,nofollow` on every page, `robots.txt` `Disallow: /`, no sitemap.
> - Confirm the CI push run for that exact SHA is green.
>
> Report PASS/FAIL to the PM with the evidence. Deploy only after the PM authorises it, then record the `dpl_` ID in QA-FINDINGS §7c.

## 3. To the owner (to send from any session)

> To switch on ordering I need five answers; defaults in brackets keep today's honest wording:
> 1. Use the WhatsApp order request (customer sends a prepared message, you confirm and arrange payment in chat)? [yes]
> 2. Is +94 70 300 9064 still the business WhatsApp, and who answers it?
> 3. Payment wording: keep "arranged when we confirm your order", or name methods (bank transfer, COD)? [keep]
> 4. Approve the 17 live listings as they are, all "Made to order"? This also confirms the 10 new photos are your own prints and that you may sell these models. [yes]
> 5. Delivery wording: keep "cost and timing included in your quote", or give a rate and coverage? [keep]
>
> Search-engine indexing stays off until you decide it separately.
