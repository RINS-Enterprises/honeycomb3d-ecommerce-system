// Checks the "More from HoneyComb 3D" link on every product page against the shop's real filter counts.
// Usage: BASE_URL=http://127.0.0.1:4173 node qa/e2e/more-category-probe.mjs
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const B = process.env.BASE_URL;
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto(B + '/shop/', { waitUntil: 'networkidle' });
const pdps = await p.$$eval('a[href^="/products/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
const visibleCards = () => p.$$eval('[data-testid=product-card]', (els) => els.filter((e) => e.getBoundingClientRect().width > 0).length);
let bad = 0;
const seen = new Map();
for (const href of pdps) {
  await p.goto(B + href, { waitUntil: 'networkidle' });
  const link = await p.$eval('[data-testid=more-category]', (a) => [a.textContent.trim().replace(/\s+/g, ' '), a.getAttribute('href')]).catch(() => null);
  const category = await p.$eval('dl a[href^="/shop/?category="]', (a) => a.textContent.trim()).catch(() => null);
  if (!link) { console.log('NO more-category link', href, 'category', category); bad++; continue; }
  const [text, url] = link;
  let count = seen.get(url);
  if (count === undefined) { await p.goto(B + url, { waitUntil: 'networkidle' }); count = await visibleCards(); seen.set(url, count); }
  const m = text.match(/^All (.+) \((\d+)\)/);
  const ok = m ? (m[1] === category && Number(m[2]) === count && url === `/shop/?category=${encodeURIComponent(category)}` && count > 1)
    : (/View collection/.test(text) && (url === '/shop/' || count === 1 || url.includes('category=')));
  if (!ok) bad++;
  console.log(ok ? 'OK ' : 'BAD', href.padEnd(40), category?.padEnd(16), JSON.stringify(text), url, 'cards:', count);
}
await b.close();
console.log(bad ? `${bad} problem(s)` : 'all product pages link to the right category with the right count');
process.exit(bad ? 1 : 0);
