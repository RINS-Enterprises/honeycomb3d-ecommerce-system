#!/usr/bin/env node
// Review screenshots for design QA: every page at 320 px, 390 px and 1440 px, taken after scrolling
// so lazy images load. It also reports visible images that stayed blank, sideways overflow, console
// errors and failed requests per page, and checks that a missing page returns HTTP 404.
//   BASE_URL=http://127.0.0.1:4173 OUT_DIR=<scratch dir> node qa/e2e/screens.mjs
// JPEGs go to OUT_DIR. Keep them out of the repo, and copy downscaled ones into qa/results only
// as evidence. Exit 1 if a visible image stayed blank, a page scrolls sideways or a page returned the
// wrong status.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.env.BASE_URL || '').replace(/\/$/, '');
const OUT = process.env.OUT_DIR;
if (!BASE || !OUT) { console.error('BASE_URL and OUT_DIR required. Nothing was captured.'); process.exit(2); }
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright'); }

mkdirSync(OUT, { recursive: true });
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const probe = await browser.newPage();
await probe.goto(BASE + '/shop/', { waitUntil: 'networkidle' });
const pdps = await probe.$$eval('a[href^="/products/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
await probe.close();
const MISSING = '/qa-missing-page/';
const pages = ['/', '/shop/', ...pdps, '/cart/', MISSING];
const problems = [];

for (const [vp, viewport, dpr] of [['small', { width: 320, height: 640 }, 2], ['mobile', { width: 390, height: 844 }, 2], ['desktop', { width: 1440, height: 900 }, 1]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: vp !== 'desktop', hasTouch: vp !== 'desktop' });
  for (const path of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
    page.on('requestfailed', (r) => errors.push(`request failed: ${new URL(r.url()).pathname}`));
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    const blank = await page.$$eval('img', (els) => els
      .filter((i) => i.getBoundingClientRect().width > 0 && !(i.complete && i.naturalWidth > 0))
      .map((i) => new URL(i.currentSrc || i.src, location.href).pathname));
    const tag = `${path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')}@${vp}`;
    await page.screenshot({ path: join(OUT, `${tag}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    const status = resp.status();
    const statusOk = path === MISSING ? status === 404 : resp.ok();
    // Sideways scrolling on a phone: the page is wider than the viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (!statusOk || blank.length || overflow > 1) problems.push({ tag, status, blank, overflow });
    console.log(statusOk && !blank.length && overflow <= 1 ? 'OK     ' : 'PROBLEM', tag, status,
      overflow > 1 ? `overflows by ${overflow} px` : '',
      blank.length ? `blank: ${blank.join(', ')}` : '', errors.length ? `console: ${errors.join(' | ')}` : '');
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, 'screens.json'), JSON.stringify({ base: BASE, pages, problems }, null, 2));
console.log(problems.length ? `${problems.length} page(s) with problems` : 'all pages captured, no blank images', '->', OUT);
process.exit(problems.length ? 1 : 0);
