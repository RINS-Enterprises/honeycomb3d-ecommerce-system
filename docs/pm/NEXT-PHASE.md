# HoneyComb 3D: next phase

Written by the PM session on 2026-10-18, after online ordering went live (release `067d776`) and the studio redesign (`84afbe5`, not yet live).

**Goal of this phase:** from "a nice catalogue with a WhatsApp button" to a shop that looks premium, gets found, and takes money easily. In priority order: what moves sales most, for the least of your time.

---

## 1. Photos: the biggest upgrade left (owner, about 2 hours)

The redesign makes the site calmer, but mixed photo backgrounds still give it away: white wall, grass, a hand, carpet. Consistent photos change the look more than any code can.

**One-time set-up:**
- A sheet of matte mid-grey or warm beige card, curved up behind the object (a "sweep").
- Daylight from one window, to the side, never direct sun. A white card on the other side as fill.
- Phone on a stack of books or a cheap tripod, at the object's height, 1× lens (not wide-angle).

**For every product, take 3 shots:**
1. Front, 3/4 angle, whole object, centred, lots of space around it.
2. A detail close-up (print texture, paint, a moving joint).
3. Scale: next to a coin or in a hand, with clean nails, on the same background.

**Rules:** no other products in frame, no hands holding the hero shot, no filters, and nothing AI-generated. Upload the originals to the product's Drive folder and tell Claude; it imports them with the same hash-checked pipeline.

**Hero photo:** shoot the Night Fury (or the Kurama, whose orange pops on dark) on a **black** sweep. That one picture replaces the current hand-held hero.

## 2. Payments: pick one (owner decision, then about 1 day of build)

| Option | Fits | Effort |
|---|---|---|
| Bank transfer, agreed in WhatsApp | today, no setup | none, already works |
| Cash on delivery through a courier | local trust | courier account |
| **PayHere** payment links (cards, LKR) | the next step for local customers | merchant sign-up (business documents); Claude adds a "Pay by card" link step |
| PayPal (USD, overseas only) | only if your account can receive money | test with $1 from a friend abroad first |

Run the Gemini Deep Research prompt (section 1, payments) to confirm 2026 fees before choosing.

## 3. Delivery wording (owner, 5 minutes)

Give one line, e.g. "Islandwide by courier, LKR ___, usually ___ working days after printing". Claude adds it to the cart and product pages. Until then the site promises nothing, which is safe but less convincing.

## 4. Brand accounts you control (owner, see register W-15)

- Instagram, Google Maps listing, Facebook and email: make sure each is yours and shows **071 055 9815** only.
- If the old accounts are with your former partner, start fresh ones and link them from the site footer (Claude adds the links).

## 5. Get found: search indexing (owner yes/no, then about 1 hour of build)

The site is still hidden from Google on purpose. Turn it on after section 1, so Google's first look shows the good photos. Claude then:
- switches on `searchIndexing`
- adds a sitemap and BreadcrumbList data
- gives you the 3 Google Search Console steps.

## 6. Trust pages (owner text, Claude formats)

Short **Shipping**, **Returns** and **About** pages in your own words: who makes the prints, where, and what happens if something breaks in delivery. A real "About" story with a photo of you or the printer converts better than any design.

## 7. Automations

See `ops/make/README.md`: four ready recipes (site guard, price check, weekly digest, monthly review). Say "build the Make automations" and Claude builds them in your Make account.

## 8. Website, next build round (Claude, no owner input needed)

- Release the studio redesign (`84afbe5`) after your look on the preview link and a QA pass.
- A check that fails any build containing the former partner's numbers.
- A preview-mode browser test fixture (QA follow-up).
- Bring `codex/storefront-mvp` up to date with production (needs your "yes" for one push).
- Refresh the stale `BUILD-STATUS.md` and `RUN-AND-RELEASE.md`.

---

**What Claude needs from you, in one message:**
1. "Looks good, release the redesign" (after the preview link).
2. Yes/no to bringing the old storefront branch up to date.
3. "Build the Make automations."
4. The delivery line (section 3).
5. Then photos whenever you can.
