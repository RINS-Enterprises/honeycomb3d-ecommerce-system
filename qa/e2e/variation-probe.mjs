// Checks "Ask about a variation" on every product page and the custom form's ?design= prefill, including hostile values.
// Usage: BASE_URL=http://127.0.0.1:4173 OUT_DIR=<scratch dir> node qa/e2e/variation-probe.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const B = process.env.BASE_URL, OUT = process.env.OUT_DIR || '.';
const b = await pw.chromium.launch();
let bad = 0;
const check = (ok, msg) => { if (!ok) bad++; console.log(ok ? 'OK ' : 'BAD', msg); };
const ctx = await b.newContext({ viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await p.goto(B + '/shop/', { waitUntil: 'networkidle' });
const pdps = await p.$$eval('a[href^="/products/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
const ideaSel = 'textarea';
let shot = false;
for (const href of pdps) {
  await p.goto(B + href, { waitUntil: 'networkidle' });
  const name = (await p.textContent('h1')).trim();
  const link = await p.$eval('[data-testid=ask-variation]', (a) => a.getAttribute('href')).catch(() => null);
  if (!link) { check(false, `${href}: no ask-variation link`); continue; }
  const id = decodeURIComponent((link.match(/[?&]design=([^&#]+)/) || [])[1] || '');
  await p.click('[data-testid=ask-variation]'); await p.waitForLoadState('networkidle');
  const idea = await p.inputValue(ideaSel).catch(() => '(no textarea)');
  const note = await p.$eval('[data-testid=design-note]', (n) => ({ text: n.textContent.replace(/\s+/g, ' ').trim(), back: n.querySelector('a')?.getAttribute('href') })).catch(() => null);
  const ok = /^\/custom\/\?design=/.test(link) && idea.startsWith(`A variation of ${name} (${id}): `) && note && note.text.includes(name) && note.back === href;
  check(ok, `${href} → ${link}: idea ${JSON.stringify(idea.slice(0, 70))}; note ${JSON.stringify(note?.text?.slice(0, 60))} back ${note?.back}`);
  if (!shot) { const n = await p.$('[data-testid=design-note]'); if (n) { await n.scrollIntoViewIfNeeded(); await p.screenshot({ path: `${OUT}/variation-custom-320.png` }); shot = true; } }
}
for (const bogus of ['<img src=x onerror=window.__x=1>', 'NOT-A-REAL-ID', '"><script>window.__x=1</script>', '']) {
  await p.goto(B + '/custom/?design=' + encodeURIComponent(bogus), { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => ({ x: window.__x, note: !!document.querySelector('[data-testid=design-note]:not([hidden])') && document.querySelector('[data-testid=design-note]').getBoundingClientRect().height > 0,
    idea: document.querySelector('textarea')?.value ?? '(none)' }));
  check(!r.x && !r.note && r.idea === '', `custom ?design=${JSON.stringify(bogus)}: ignored (note shown: ${r.note}, idea ${JSON.stringify(r.idea)})`);
}
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `custom page: no sideways scroll at 320 px (${overflow})`);
check(errors.length === 0, `no console errors ${errors.join(' | ')}`);
await b.close();
console.log(bad ? `${bad} problem(s)` : 'variation links OK');
process.exit(bad ? 1 : 0);
