// Probes the shop's no-results state: query echo, markup safety, category buttons, focus and history.
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const B = process.env.BASE_URL, OUT = process.env.OUT_DIR || '.';
// Usage: BASE_URL=http://127.0.0.1:4173 OUT_DIR=<scratch dir> node qa/e2e/empty-state-probe.mjs
const b = await pw.chromium.launch();
let bad = 0;
const check = (ok, msg) => { if (!ok) bad++; console.log(ok ? 'OK ' : 'BAD', msg); };
for (const [vp, w, h] of [['phone', 320, 640], ['desktop', 1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: vp === 'phone', hasTouch: vp === 'phone' });
  const p = await ctx.newPage();
  const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto(B + '/shop/', { waitUntil: 'networkidle' });
  const visible = () => p.$$eval('[data-testid=product-card]', (els) => els.filter((e) => e.getBoundingClientRect().width > 0).length);
  check(!(await p.isVisible('[data-testid=no-results]')), `${vp}: no-results hidden with all ${await visible()} designs`);
  await p.fill('#search', 'unicorn'); await p.waitForTimeout(400);
  check(await p.isVisible('[data-testid=no-results]') && (await visible()) === 0, `${vp}: "unicorn" shows the empty state and 0 cards`);
  const msg = (await p.textContent('[data-testid=no-results]')).replace(/\s+/g, ' ').trim();
  check(/Nothing matches “unicorn”/.test(msg), `${vp}: message names the query: ${JSON.stringify(msg.slice(0, 140))}`);
  if (vp === 'phone') await p.screenshot({ path: `${OUT}/empty-${vp}.png`, fullPage: false });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 1, `${vp}: no sideways scroll (${overflow})`);
  // Markup in the query is shown as text, never parsed.
  await p.fill('#search', '<img src=x onerror="window.__xss=1"><b>bold</b>'); await p.waitForTimeout(400);
  const injected = await p.evaluate(() => ({ xss: window.__xss, imgs: document.querySelectorAll('[data-testid=no-results] img, [data-testid=no-results] b').length,
    text: document.querySelector('[data-testid=no-results]').textContent }));
  check(!injected.xss && injected.imgs === 0 && injected.text.includes('<img src=x'), `${vp}: markup query stays text (no element created, no script run)`);
  // A category button clears search and theme, applies the category, moves focus to the first result.
  await p.fill('#search', 'unicorn'); await p.waitForTimeout(400);
  const before = p.url();
  await p.click('[data-testid=try-figures]'); await p.waitForTimeout(400);
  const after = await p.evaluate(() => ({ q: document.querySelector('#search').value, url: location.href,
    focus: document.activeElement?.closest('[data-testid=product-card]') ? 'first card' : (document.activeElement?.outerHTML || '').slice(0, 80) }));
  check(after.q === '' && (await visible()) === 8 && /category=Figures/.test(after.url), `${vp}: "Figures" button clears the search and shows 8 figures (${after.url.replace(B, '')})`);
  check(after.focus === 'first card', `${vp}: focus moves to the first result (${after.focus})`);
  check(!(await p.isVisible('[data-testid=no-results]')), `${vp}: empty state hidden again`);
  await p.goBack(); await p.waitForTimeout(400);
  check(p.url() !== after.url, `${vp}: Back leaves the category view (${p.url().replace(B, '')}; before click ${before.replace(B, '')})`);
  // Filters alone excluding everything (category + theme with no overlap) say so instead of naming a query.
  await p.goto(B + '/shop/?category=Bookmarks&theme=Naruto', { waitUntil: 'networkidle' });
  const filt = (await p.isVisible('[data-testid=no-results]')) ? (await p.textContent('[data-testid=no-results]')).replace(/\s+/g, ' ').trim() : '(not shown)';
  check(!/“/.test(filt.split('.')[0]) && filt !== '(not shown)', `${vp}: filter-only empty state: ${JSON.stringify(filt.slice(0, 120))}`);
  check(errors.length === 0, `${vp}: no console errors ${errors.join(' | ')}`);
  await ctx.close();
}
await b.close();
console.log(bad ? `${bad} problem(s)` : 'empty state OK');
process.exit(bad ? 1 : 0);
