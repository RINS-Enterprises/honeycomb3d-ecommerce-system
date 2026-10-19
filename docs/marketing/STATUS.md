# Session D · Brand & Marketing: status

Branch `claude/brand-marketing` · draft PR #7 into `main` (not to be merged by this session).
Last updated 2026-10-19.

## Documents

| Doc | What it is | Commit | State |
|---|---|---|---|
| `brand.md` | One-page brand guide: colours, fonts, logo, tone, do/don't | `b058d92` | done |
| `launch-kit.md` | Instagram / Facebook / TikTok setup, English and Sinhala bios, handle shortlist, pins, highlight covers, optional LKR 2,000 ad test | `4c3895b` | done; Sinhala reviewed |
| `30-day-plan.md` | 30-day calendar: all 17 approved designs, exact site prices, photo file per post, English and Sinhala captions, hashtag sets, 4 reels | `4c3895b`, Sinhala fixes `f250a80` | done; Sinhala reviewed |
| `google-business-profile.md` | New service-area profile in Kegalle; categories, description, photos; how to handle the old Kandy listing without contacting anyone | `f250a80` | done; **check eligibility first** (see owner action 4) |
| `photo-guide.md` | Home studio for about LKR 1,500–3,000, phone settings, hero on black, printable shot list for all 17 products | `f250a80` | done |
| `reviews.md` | WhatsApp review request (English and Sinhala, before and after the Google profile), where real reviews go, permission log | `f250a80` | done; Sinhala reviewed |

Checks run: every price in the captions matches `data/products.json`; every named photo file exists in `public/assets/`; the only phone number used is 071 059 9815; bios are within each app's character limit.

## Owner actions (one list)

1. **Pick a handle** from `launch-kit.md` §1 (recommended: `honeycomb3d.store`) and check it's free on Instagram, TikTok and Facebook.
2. **Create a new email** you control, then **create Instagram, the Facebook Page and TikTok** with it (`launch-kit.md` §2–4). Then send Claude: *"Instagram is @…, Facebook is …, TikTok is @…"*.
3. Say **"export the profile picture"** and Claude makes the 1080 × 1080 symbol PNG from `assets/brand-sources/honeycomb-symbol.pdf`.
4. **Google profile:** tell Claude whether you **hand over orders in person** in the Kegalle area (yes = go ahead with `google-business-profile.md`; courier-only = wait). Then create it and send the Maps link.
5. **Photos:** buy the items in `photo-guide.md` §1 (about LKR 1,500–3,000) and shoot with the shot list. Start with the **Night Fury hero on black**. Upload originals to Drive and tell Claude.
6. **Canva:** say **"make the Canva templates"** if you want Claude to create the highlight covers, post and story templates in your Canva account. Nothing is created until you say so.
7. **Reviews:** send `reviews.md` version A to 3–5 happy past customers.
8. **Optional ad test:** only if you say *"boost post X with LKR 2,000"*.
9. Confirm the **printer brand** for the `#BambuLab` hashtag in `30-day-plan.md` (or say to remove it).

## Requests for the PM (website, not this session's lane)

- **Social links in the footer** (storefront backlog item 6): fill in once the owner sends the handles from action 2. Also the Google Maps link after action 4.
- **Hero photo:** when the black-sweep Night Fury hero arrives, swap it into `store.json` → `hero` with the usual import pipeline.
- **Light-background logo:** the only logo has a white wordmark (dark backgrounds only). If a light version is ever needed (e.g. packaging stickers), export it from `assets/brand-sources/honeycomb-logo-black.pdf`; don't redraw it.
- **Reviews section** on the site: later, only with real reviews and recorded permission (`reviews.md`).

## Not done (by design)

- No accounts created, nothing posted, nobody messaged, no Canva designs, no ads.
- Old accounts and the old Kandy Maps listing are never used or linked.
