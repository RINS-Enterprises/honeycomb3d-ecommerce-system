// Checks the home page "shop by theme" row against the shop, and the 404 page's search box.
// Usage: BASE_URL=http://127.0.0.1:4173 OUT_DIR=<scratch dir> node qa/e2e/home-themes-probe.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const B = process.env.BASE_URL, OUT = process.env.OUT_DIR || '.';
const b = await pw.chromium.launch();
let bad = 0;
const check = (ok, msg) => { if (!ok) bad++; console.log(ok ? 'OK ' : 'BAD', msg); };
const ctx = await b.newContext({ viewport: { width: 320, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errors = []; p.on('pageerror', (e) => errors.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const visible = () => p.$$eval('[data-testid=product-card]', (els) => els.filter((e) => e.getBoundingClientRect().width > 0).length);

await p.goto(B + '/', { waitUntil: 'networkidle' });
const pills = await p.$$eval('[data-testid=home-themes] a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.replace(/\s+/g, ' ').trim(),
  label: a.getAttribute('aria-label') || '' })));
check(pills.length > 0 && pills.length <= 8, `home: ${pills.length} theme pills (at most 8)`);
const counts = pills.map((x) => Number((x.text.match(/(\d+)\s*$/) || [])[1]));
check(counts.every((n, i) => i === 0 || n <= counts[i - 1]), `home: ordered largest first (${counts.join(', ')})`);
const row = await p.$('[data-testid=home-themes]');
await row.scrollIntoViewIfNeeded(); await row.screenshot({ path: `${OUT}/home-themes-320.png` });
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `home: no sideways scroll at 320 px (${overflow})`);
for (const x of pills) {
  await p.goto(B + x.href, { waitUntil: 'networkidle' });
  const n = await visible();
  const expected = Number((x.text.match(/(\d+)\s*$/) || [])[1]);
  const chip = await p.$$eval('[data-testid^="filter-"] input:checked, [data-testid^="filter-"][aria-pressed="true"]', (els) => els.map((e) => (e.closest('[data-testid]')?.dataset.testid || '')));
  check(/^\/shop\/\?theme=/.test(x.href) && n === expected, `${JSON.stringify(x.text)} → ${x.href}: ${n} cards (pill says ${expected}); selected ${chip.join(', ')}`);
}
// 404 page: search box sends a GET to /shop/?q= and the shop shows the matches.
// Chrome logs the 404 document itself as a failed resource; that one message is expected.
const before404 = errors.length;
const resp = await p.goto(B + '/no-such-page/', { waitUntil: 'networkidle' });
check(resp.status() === 404, `404 page returns HTTP ${resp.status()}`);
const form = await p.$('form[action*="/shop/"]');
check(!!form, '404 page has a search form that goes to the shop');
if (form) {
  await p.fill('form[action*="/shop/"] input[type=search], form[action*="/shop/"] input[name=q]', 'naruto');
  await Promise.all([p.waitForURL(/\/shop\/\?q=naruto/), p.keyboard.press('Enter')]);
  await p.waitForLoadState('networkidle');
  const n = await visible();
  check(n > 0 && (await p.inputValue('#search')) === 'naruto', `404 search "naruto" → ${p.url().replace(B, '')}: ${n} cards, search box filled`);
}
const unexpected = errors.filter((e, i) => !(i >= before404 && /status of 404/.test(e) && i === before404));
check(unexpected.length === 0, `no console errors besides the 404 document itself ${unexpected.join(' | ')}`);
await b.close();
console.log(bad ? `${bad} problem(s)` : 'theme row and 404 search OK');
process.exit(bad ? 1 : 0);
