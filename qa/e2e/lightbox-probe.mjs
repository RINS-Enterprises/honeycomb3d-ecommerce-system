#!/usr/bin/env node
// Product-photo lightbox probe (from 6b37b27): opens [data-testid="zoom-open"] by keyboard on a product page
// and reports the dialog's role, label, initial focus, Tab order (it must never reach the page behind),
// axe WCAG 2.2 A/AA violations while open, and that Esc closes it and returns focus to the opener.
//   BASE_URL=http://127.0.0.1:4173 node qa/e2e/lightbox-probe.mjs <path to axe.min.js> [product path]
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { readFileSync } from 'node:fs';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const AXE = readFileSync(process.argv[2], 'utf8');
const b = await pw.chromium.launch();
for (const [vp, opts] of [['mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, bypassCSP: true }], ['desktop', { viewport: { width: 1440, height: 900 }, bypassCSP: true }]]) {
  const p = await (await b.newContext(opts)).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto((process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '') + (process.argv[3] || '/products/minato-kunai/'), { waitUntil: 'networkidle' });
  const trigger = p.locator('[data-testid="zoom-open"]').first();
  await trigger.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const st = await p.evaluate(() => {
    const d = document.querySelector('dialog[open], [role="dialog"]:not([hidden])');
    const a = document.activeElement;
    return { dialog: !!d, tag: d?.tagName, modal: d ? (d.tagName === 'DIALOG' ? 'native-dialog' : d.getAttribute('aria-modal')) : null,
      label: d ? (d.getAttribute('aria-label') || (d.getAttribute('aria-labelledby') && document.getElementById(d.getAttribute('aria-labelledby'))?.textContent)) : null,
      focusInside: !!(d && d.contains(a)), focused: a?.getAttribute('aria-label') || a?.textContent?.trim().slice(0, 30) || a?.tagName,
      img: d?.querySelector('img') ? { w: d.querySelector('img').naturalWidth, alt: d.querySelector('img').alt?.slice(0, 40) } : null };
  });
  // Tab cycling stays inside the dialog
  const inside = [];
  for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); inside.push(await p.evaluate(() => { const d = document.querySelector('dialog[open]'); const a = document.activeElement; return d?.contains(a) ? 'in:' + (a.getAttribute('aria-label') || a.tagName) : a === document.body ? 'body(browser)' : 'OUT:' + a.tagName + '.' + a.className; })); }
  await p.addScriptTag({ content: AXE });
  const ax = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }); return r.violations.map((v) => `${v.id}(${v.nodes.length})`); });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ open: !!document.querySelector('dialog[open], [role="dialog"]:not([hidden])'), focusBack: document.activeElement?.getAttribute('data-testid') || document.activeElement?.tagName }));
  console.log(vp, JSON.stringify(st), 'tabOrder:', inside.join(' > '), 'modal:', await p.evaluate(() => document.querySelector('dialog[open]')?.matches(':modal')), 'axeOpen:', ax.length ? ax.join(',') : 'none', 'afterEsc:', JSON.stringify(after), 'pageErrors:', errs.length);
}
await b.close();
