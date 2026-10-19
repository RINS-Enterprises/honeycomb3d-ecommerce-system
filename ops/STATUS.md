# Ops & Automations: status

Session `session_013L9wyryuVwxe3a63LEWuHF`, branch `claude/ops-automations` from `0182080`.
The PM register (`docs/pm/PROJECT-REGISTER.md` on `claude/funny-albattani-c5a91a`) stays the source of
truth for task IDs. This file holds the ops session's own state.

Last updated: 2026-10-19

## MakerWorld to Drive (`ops/makerworld-to-drive/`)

| Check | Result (2026-10-19) |
|---|---|
| `node tests/server-test.mjs` | ALL SERVER CHECKS PASSED |
| `node tests/page-test.mjs` | ALL PAGE CHECKS PASSED |
| `node tests/bm-test.mjs` | 3/3 PASS (the bookmark line is 9,398 characters) |
| Drive imports folder `1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI` | Exists, owned by the owner, inside the HoneyComb folder, **empty**. setup() has never run, so there is no log sheet yet |
| Former partner's numbers / the typo number in `ops/` | None found |
| Live MakerWorld page | **Never tested.** makerworld.com is blocked from cloud containers |
| Gemini output | Unverified. The key is left out of the first install (it costs money) |

## Tasks

| ID | Task | Status |
|---|---|---|
| OPS-01 | Install the Apps Script (`INSTALL.md`) | **waiting on the owner**: steps sent 2026-10-19; next is getting the `/exec` URL |
| OPS-03 | First real-page test (Android paste-a-link, then Windows bookmark) | blocked on OPS-01 |
| OPS-02 | Share the imports folder with teammates | propose after OPS-03; needs team emails and the owner's yes |
| OPS-04 | Durable home for the tool | to propose: move it to `honeycomb3d-ops-system` (private, last push April 2026), or keep it on this branch. Owner decides |
| OPS-05 | Listing pipeline: Drive → Airtable draft → website | propose only, after OPS-03. A model only counts as sellable after the owner has bought and checked its MakerWorld licence by hand |
| W-17 | Make.com: storefront guard, price drift, weekly digest, monthly review | recipes ready (`ops/make/README.md` on the PM branch). **Not built.** Needs the owner to say "build the Make automations" in this session |

## Rules this session follows

- WhatsApp number: 94710599815 only. The storefront guard alerts unless `mode` is `live` and `whatsappNumber` is `94710599815`.
- Read Airtable and Drive freely. Write only with the owner's go-ahead. Never delete.
- Don't touch the website, Vercel or DNS. That's the PM session's job.
- No paid APIs or plans without the owner's OK. No secrets in the repo.
