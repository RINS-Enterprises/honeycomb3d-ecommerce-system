# HoneyComb 3D website recovery and rebuild

Prepared 8 October 2026 for Isuru / RINS. This is a recovered specification, not a WordPress backup or exhaustive export of every project chat.

## Evidence and access

- Earlier chats were searched through available personal-context retrieval. Direct browsing of every conversation in the HoneyComb project is not available.
- GitHub repository list and the old repository tree/README were directly read.
- Existing reference repository: https://github.com/RINS-Enterprises/honeycomb3d-ecommerce-system
- Its main commit at inspection: c78e12f024e9c6f2652b4e2961f0e79d57cffcff.
- It contains README.md, homepage.png, shop.png, product.png and checkout.png. No application source or WordPress database is present in that tree.
- Library ChatGPT_Export.md was located; search returned CSS snippets, but direct read returned no readable content. Complete export extraction remains outstanding.
- No authenticated WordPress/EasyWP access or website backup has been obtained.
- GitHub read access works. No callable repository-create/push capability was available in this session; no remote repository or branch has been created.

## Recovered store identity

- Brand: HoneyComb 3D / HONEYCOMB™.
- Domain: honeycomb3d.store.
- Market: Sri Lanka; currency LKR.
- Old platform: Namecheap EasyWP, WordPress.org, WooCommerce, Blocksy. Elementor/Hello Biz were used earlier and replaced; Gutenberg and Stackable appear in later page work.
- Customer-facing WhatsApp from April chats: +94 70 300 9064. Confirm it is still current before launch.
- Customer-facing email from April drafts: info@honeycomb3d.store. Verify mailbox delivery before displaying it.
- Visual direction: dark, clean, tech/futuristic with anime/comic influence and orange/gold accents.
- Retrieved old CSS colors: body #0d0d0d; cards #1a1a1a; accent #ff6a00; button/branding gold #fba31b. Legal surfaces #0f0f0f, #111111 and #161616.
- Rounded cards and buttons, hover lift, restrained shadows; responsive mobile layouts. Exact logo assets and typography remain unrecovered.

## Old website behavior: evidence versus assumptions

The April GitHub README claims WooCommerce catalog, cart, checkout, Stripe and COD, FluentSMTP order emails, WhatsApp contact and Trustpilot review automation using email/BCC logic. These are documented historical claims, not verified working integrations today.

Earlier chat plans considered PayHere, WebXPay, KOKO and Mint. Do not label any of these active without account/integration verification. Do not assume the old Stripe setup remains usable.

The old README describes stock/sold counters. Rebuild these only from real stock/order records. Never invent reviews, sales totals or scarcity.

## Recovered page and content direction

- Homepage, shop/category listings, individual product pages, cart, checkout, contact and custom-print enquiry.
- Policy pages: shipping, returns/refunds, privacy and terms. Complete approved text has not yet been recovered.
- Proposed historical hero variants: “Precision in Every Layer” and “LEVEL UP YOUR SETUP”. Neither is established as the final production heading.
- Historical category suggestions: Anime, Weapons/props, Gaming, Keychains, Collectibles and Dragons. Confirm final catalog taxonomy.
- Homepage featured collections/products, custom-print CTA, why HoneyComb and contact CTA appeared in a September proposal, not a confirmed production source.
- Historical shipping draft: islandwide Sri Lanka; 1–3 business days processing and typically 1–5 business days delivery; courier-dependent customer-paid fees. Treat these as old draft promises requiring operational confirmation.
- April terms draft covered products, orders, LKR prices, third-party payments, shipping/refunds, acceptable use, IP, liability, changes and contact. Do not republish its date as a new review date.

## Product recovery seed, not a current inventory

Products mentioned in project context: Naruto items, articulated dragons/Night Fury, Baymax, Hidden Leaf keychains, Classic Kunai, Minato spinner, T-Rex, Hueforge art, Stranger Things coasters, Batarang, Eren sword, One Piece, HTTYD and Kurama.

Historical examples only:

| Product | Retrieved historical figures | Status |
| --- | --- | --- |
| Dragon keychain | LKR 500 / 250 | September retail/discount context; verify |
| Classic Kunai | LKR 600 / 400 | September retail/discount context; verify |
| Kurama, 175 g | LKR 2,000 / 1,000 | September retail/discount context; verify |
| Baymax, 50 g | LKR 900 / 600 | September retail/discount context; verify |
| Articulated Dragon (Night Fury) | LKR 1,500 | April suggested listing; not current price |

Use the user's original product photos. Preserve shape, color, proportions and visible 3D-print texture. Do not generate substitute product images. Old screenshots are design references, not a substitute for clean listing photos. Verify model selling permissions when sourcing new products.

## Build today: proposed scope

Build a Git-backed responsive storefront with catalog/search/category filters, product details, a cart and a clearly labeled WhatsApp order-request handoff. The handoff must include product identifiers, quantities and estimated subtotal; availability, delivery and final total require confirmation. Never display a fake successful payment or completed order.

Keep structured product data separate from UI. Unknown prices, stock and photos must stay visibly unconfirmed or excluded from published catalog. Paid checkout, customer accounts, order database and inventory synchronization require a real backend and verified providers; they are not recovered automatically from chats.

This scope is a launch proposal to avoid blocking storefront recovery on missing WooCommerce access. It is not a claim that the user has permanently abandoned WooCommerce. Preserve migration options if EasyWP yields a backup.

## Two-agent workflow

Suggested private repository: RINS-Enterprises/honeycomb3d-website.

- ChatGPT implementation branch: codex/storefront-mvp.
- Claude review/content/QA branch: claude/recovery-qa.
- main is the integration branch. No force pushes, branch deletion or automatic main merges.
- Each agent works in its own checkout/worktree. Claude reads ChatGPT commits for review, writes findings/tests in its own branch, and does not rewrite implementation files concurrently.
- Share this brief and a single catalog schema. Secrets stay in environment variables; never commit customer data, banking credentials or hosting archives.
- Keep source, assets, deployment instructions and recovered evidence in the repository. Maintain an independent export/backup.

## Outstanding recovery tasks

1. Recover or materialize full historical chat export and extract original homepage CSS/Gutenberg code and complete policy drafts.
2. Inspect old screenshots and collect clean logo/product assets.
3. Ask Namecheap whether files/database/backups remain, confirm cancellation date and any export/reactivation cost. Do not pay before backup availability is confirmed.
4. Verify current catalog, prices, stock, phone/email, courier terms and payment accounts.
5. Create the new private repository and grant both agents repository access.
6. Choose deployment compatible with commercial use; verify provider plan terms before deployment.

## Acceptance checks

- Mobile/desktop navigation, catalog filters, product detail and cart work.
- Cart quantity/removal and totals are consistent; filenames and identifiers remain stable.
- WhatsApp handoff encodes a readable order request; customers are told it is awaiting confirmation.
- No unsupported payment claims, placeholder reviews, invented stock or live secrets.
- Keyboard navigation, labeled controls, contrast and empty/error states work.
- Document exact build/deploy commands and integration limitations.

## Claude handoff prompt

Work on RINS-Enterprises/honeycomb3d-website, branch claude/recovery-qa. Read docs/RECOVERY-AND-BUILD-BRIEF.md first. ChatGPT owns implementation on codex/storefront-mvp. Independently review requirements and recovered references, prepare a prioritized missing-data list and meaningful browser/flow QA, and review ChatGPT's branch without editing it. Distinguish historical proposals from directly recovered source. Do not invent prices, stock, reviews, shipping promises or payment availability. Do not merge into main. Report findings with concrete reproduction steps and recommended fixes. Work autonomously within your branch.
