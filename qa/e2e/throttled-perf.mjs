#!/usr/bin/env node
// Page speed on emulated slow mobile networks (CDP network + 4x CPU throttling), mobile 390x844 at DPR 3.
//   BASE_URL=http://127.0.0.1:4173 QA_SHA=<sha> node qa/e2e/throttled-perf.mjs
// Writes qa/results/<sha>/perf-throttled.json. This is an emulation against a local server, not a real device or network.
// Reports only; it does not fail. Web Vitals "good": LCP <= 2500 ms, CLS <= 0.1.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE_URL || '').replace(/\/$/, '');
const SHA = process.env.QA_SHA || 'adhoc';
const PAGES = (process.env.PAGES || '/,/shop/,/products/minato-kunai/,/products/baymax-figure/,/cart/').split(',');
if (!BASE) { console.error('BASE_URL required. Nothing was tested.'); process.exit(2); }
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright'); }

const PROFILES = { // Roughly Lighthouse's slow 4G, and a slower 3G.
  'slow-4g': { latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8 * 0.9, uploadThroughput: 750 * 1024 / 8 * 0.9, cpu: 4 },
  '3g': { latency: 300, downloadThroughput: 750 * 1024 / 8, uploadThroughput: 250 * 1024 / 8, cpu: 4 },
};
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const rows = [];
for (const [profile, p] of Object.entries(PROFILES)) for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: p.latency, downloadThroughput: p.downloadThroughput, uploadThroughput: p.uploadThroughput });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: p.cpu });
  let bytes = 0; cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = Math.max(window.__lcp, e.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const t0 = Date.now();
  const resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0) }));
  rows.push({ profile, path, status: resp.status(), fcpMs: m.fcp, lcpMs: m.lcp, loadMs, cls: m.cls, kb: Math.round(bytes / 1024), lcpGood: m.lcp <= 2500, clsGood: m.cls <= 0.1 });
  await ctx.close();
}
await browser.close();
console.table(rows);
const out = join(here, '..', 'results', SHA); mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'perf-throttled.json'), JSON.stringify({ base: BASE, reviewed_sha: SHA, note: 'Emulated network and CPU against a local server; not a real device.', profiles: PROFILES, rows }, null, 2));
