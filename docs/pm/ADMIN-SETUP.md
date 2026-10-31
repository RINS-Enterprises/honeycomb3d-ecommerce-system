# Admin page: what it does and the one-time setup

**Address:** https://honeycomb3d.store/admin/ (not linked from the shop, never shown to search engines)

## What admins can do
- **Pending:** every listing that isn't on the shop yet. Set its name, price, category, stock and description, then tap **Approve & publish**.
  - **Approve needs a photo.** Put photos in the product's Drive folder (`HoneyComb / 01 Products / HNYCMB5xx Name`). The PM imports them as that pending listing.
  - **Approve needs a stock state:** In stock, Made to order or Sold out.
  - **Price** can stay empty ("price on request").
- **On the shop:** edit any listing, mark it **Sold out** (ordering for it stops), or **Hide from shop**.
- **Partner item:** tick it and enter the partner's cost price. The admin shows the profit and the partner's half. The cost price is never shown on the shop.
- **New listing:** creates a pending listing with the next HNYCMB number. Then put its photos in Drive under that number.
- **Promo codes:**
  - create a code with a % off and the dates it works (Sri Lanka time)
  - **write the code down:** the site stores only a fingerprint of it, so nobody can read it back from the website
  - the "note" is only for admins

**Each save:**
1. is recorded as a commit on GitHub, so there is history and it can be undone
2. publishes the site, and "Live ✓" shows after about a minute
3. if the site's safety checks fail, the live site stays as it was and the page says so

## Before using partner costs: make the GitHub repository private
The repository `RINS-Enterprises/honeycomb3d-ecommerce-system` is **public**. Anyone can read everything in it: the data files, the business documents (operating plan, partner-stock arrangement, Comic Con stall prices) and the code.

- **Admin saves are commits there.** So the admin **refuses partner costs and promo notes while the repository is public.** Prices, names, stock and approvals still work.
- **To make it private:** GitHub → the repository → Settings → General → Danger Zone → **Change visibility → Private**.
  - Vercel keeps deploying, because it uses the GitHub app.
  - What was public before stays in anyone's copies, so treat anything already pushed as seen.

## One-time setup (owner, about 10 minutes)
The admin stays switched off (it answers "not set up yet") until all four values below are added.

**Where to add them:** Vercel → project **honeycomb3d-storefront-preview** → Settings → Environment Variables. For each one, tick **Production** only, then **Save**.

| Name | What to put | Where to get it |
|---|---|---|
| `ADMIN_PASSWORD` | The admin password: **at least 12 characters**. Make up 4 or more unrelated words of your own; don't copy any example. | You choose it. Share it only with admins. Changing it later logs everyone out. |
| `ADMIN_SESSION_SECRET` | Any long random text (30+ characters). Never needed again. | Mash the keyboard, or use a password generator. |
| `GITHUB_TOKEN` | A fine-grained token. | See the GitHub steps below. |
| `VERCEL_TOKEN` | A Vercel token. | See the Vercel steps below. |

**GitHub token:**
1. Go to github.com → your photo → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Fill in:
   - name: `honeycomb-admin`
   - expiration: 1 year
   - resource owner: **RINS-Enterprises**
   - repository access: **Only select repositories** → `honeycomb3d-ecommerce-system`
   - permissions: **Contents → Read and write** (nothing else)
3. Copy the token into `GITHUB_TOKEN`.
4. If the organisation needs to approve the token, approve it under RINS-Enterprises → Settings → Personal access tokens.

**Vercel token:**
1. Go to vercel.com → your avatar → Account Settings → **Tokens** → Create.
2. Fill in:
   - name: `honeycomb-admin`
   - scope: the **RINS Enterprises** team
   - expiration: 1 year
3. Copy the token into `VERCEL_TOKEN`.

**Then:** tell the PM "admin env added". The PM publishes once so the values take effect. After that, log in at /admin/.

**Risk to know:** a Vercel token can manage the whole RINS Enterprises team on Vercel. Mark it **Sensitive** when you add it, and never share it.

**Recommended extra protection:** add a rate limit on logins. Vercel → project → Firewall → Add rule:
- if the path starts with `/api/admin/login`
- then rate limit to 10 requests per minute per IP, and deny the rest

**Never paste these values into a chat, an email or the repo.** If one leaks, delete it where you made it, make a new one, and update it in Vercel.

## How it works (for the PM)
- **Page and code:**
  - page: `src/admin.mjs` + `src/admin.css`, built to `dist/admin/`
  - API: `api/admin/*.mjs` (Vercel functions) with shared helpers in `api/_admin.mjs`
  - rules: `src/admin-core.mjs` (field whitelist, approval rules, new IDs, promo codes, signed 12-hour login cookie)
  - tests: `tests/admin.test.mjs`, `tests/admin-api.test.mjs`, `tests/admin-browser.mjs`
- **Saves:**
  - each save is one commit to `claude/funny-albattani-c5a91a` on top of the commit the page loaded. If the branch moved, nothing is written and the page asks you to reload.
  - the API then makes a production deployment of that commit
  - the Vercel build command is `npm run build && npm run check`
- **PM rule:** admins publish the branch head, so **only push to the release branch what is ready to go live**, and `git pull` before pushing (admin commits land there).
- **Private fields** are stripped from the shop's data and asserted by `check.mjs`: `partner`, `approvedAt`, `priceSource`, promo `note`.
