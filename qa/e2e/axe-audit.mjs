#!/usr/bin/env node
// Automated WCAG 2.2 A/AA audit with axe-core over every storefront page, desktop + mobile,
// including interactive states (filled cart, custom-enquiry preview, empty filter result).
// axe-core is NOT an app dependency: install it anywhere QA-owned and pass its path.
//   AXE_PATH=/path/to/axe-core/axe.min.js BASE_URL=http://127.0.0.1:4173 QA_SHA=<sha> node qa/e2e/axe-audit.mjs
// Exit 1 if any serious/critical violation is found.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE_URL || '').replace(/\/$/, '');
const AXE = process.env.AXE_PATH;
const SHA = process.env.QA_SHA || 'adhoc';
const OUT = process.env.OUT_DIR || join(here, '..', 'results', SHA, 'axe');
if (!BASE || !AXE || !existsSync(AXE)) {
  console.error('Set BASE_URL and AXE_PATH (path to axe.min.js). Nothing was tested.');
  process.exit(2);
}
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright'); }

// A product the catalogue lists (products without an approved photo are hidden).
const PDP = `/products/${process.env.PROBE_PRODUCT || (await (await fetch(BASE + '/data/products.json')).json())[0].slug}/`;
const PAGES = (process.env.PAGES || `/,/shop/,/cart/,/custom/,/privacy/,${PDP},/qa-missing-page/`).split(',');
const STATES = {
  'cart-filled': async (p) => {
    await p.goto(BASE + PDP, { waitUntil: 'networkidle' });
    const add = p.getByRole('button', { name: /add to (request )?(cart|bag)/i });
    await add.waitFor(); await p.waitForFunction(() => ![...document.querySelectorAll('button')].some((b) => /add to/i.test(b.textContent) && b.disabled));
    await add.click();
    await p.goto(BASE + '/cart/', { waitUntil: 'networkidle' });
  },
  'custom-preview': async (p) => {
    await p.goto(BASE + '/custom/', { waitUntil: 'networkidle' });
    await p.getByLabel(/idea/i).fill('A small desk sign');
    const btn = p.getByRole('button', { name: /preview|continue|send/i });
    await p.waitForFunction(() => [...document.querySelectorAll('form button[type=submit]')].every((b) => !b.disabled));
    await btn.click();
  },
  'shop-no-results': async (p) => {
    await p.goto(BASE + '/shop/?q=zzzz-no-match', { waitUntil: 'networkidle' });
  },
};

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const report = [];
for (const [vp, size] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 390, height: 844 }]]) {
  // bypassCSP only so axe can be injected: the site's CSP (script-src 'self') correctly blocks it otherwise.
  // CSP itself is verified separately (storefront-smoke.mjs security-headers check).
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile', bypassCSP: true });
  const targets = [...PAGES.map((path) => [path, (p) => p.goto(BASE + path, { waitUntil: 'networkidle' })]), ...Object.entries(STATES)];
  for (const [name, go] of targets) {
    const p = await ctx.newPage();
    try {
      await go(p);
      await p.addScriptTag({ path: AXE });
      const r = await p.evaluate(async (t) => {
        const res = await window.axe.run(document, { runOnly: { type: 'tag', values: t }, resultTypes: ['violations', 'incomplete'] });
        const slim = (v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').slice(0, 300) })), count: v.nodes.length });
        return { violations: res.violations.map(slim), incomplete: res.incomplete.map(slim) };
      }, tags);
      report.push({ page: name, viewport: vp, ...r });
      const sev = r.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
      console.log(`${sev.length ? 'FAIL' : r.violations.length ? 'MINOR' : 'PASS'}`.padEnd(6), vp.padEnd(8), name.padEnd(28),
        r.violations.map((v) => `${v.id}(${v.impact},${v.count})`).join(' ') || 'no violations',
        r.incomplete.length ? `| needs review: ${r.incomplete.map((v) => v.id).join(',')}` : '');
    } catch (e) {
      report.push({ page: name, viewport: vp, error: String(e.message || e).slice(0, 300) });
      console.log('ERROR ', vp.padEnd(8), name.padEnd(28), String(e.message || e).slice(0, 160));
    }
    await p.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, 'axe-results.json'), JSON.stringify({ base: BASE, reviewed_sha: SHA, axe: AXE.split('/').slice(-3).join('/'), tags, report }, null, 2));
const serious = report.flatMap((r) => (r.violations || []).filter((v) => ['serious', 'critical'].includes(v.impact)));
const errors = report.filter((r) => r.error).length;
console.log(`\nserious/critical: ${serious.length}, minor/moderate: ${report.flatMap((r) => (r.violations || [])).length - serious.length}, errors: ${errors} -> ${OUT}`);
process.exit(serious.length ? 1 : errors ? 2 : 0);
