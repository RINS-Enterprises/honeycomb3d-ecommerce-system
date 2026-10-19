# Tests for MakerWorld to Drive

The real `Code.gs` and `Page.html` run against in-memory stand-ins for the Apps Script services (`gas-fake.mjs`). Nothing touches Google or MakerWorld.

    node server-test.mjs            # 18 server checks
    node bm-test.mjs                # 3 checks on the exact bookmark-link.txt line (Playwright)
    OUT=/tmp/shots node page-test.mjs   # 7 page flows in Chromium at 320/390/800/1440 px (Playwright)

Playwright is loaded from the global npm root. These tests used mock MakerWorld pages only; the live site was blocked from the environment where they were written.
