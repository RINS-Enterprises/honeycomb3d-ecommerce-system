#!/usr/bin/env node
// Image QA: decoding, natural vs rendered size, aspect/orientation, alt text, bytes and LCP per page.
//   BASE_URL=http://127.0.0.1:4173 QA_SHA=<sha> node qa/e2e/image-audit.mjs
// Writes qa/results/<sha>/images/{image-audit.json,summary.md,<page>-<vp>.png}. Exit 1 on any FAIL.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE_URL || '').replace(/\/$/, '');
const SHA = process.env.QA_SHA || 'adhoc';
const OUT = process.env.OUT_DIR || join(here, '..', 'results', SHA, 'images');
// Thresholds (documented in docs/QA-ACCEPTANCE.md AC-IMG-*).
const MAX_OVERSAMPLE = Number(process.env.MAX_OVERSAMPLE || 3); // natural px per CSS px at DPR 1 (allows 2x/3x screens)
const MAX_IMAGE_BYTES = Number(process.env.MAX_IMAGE_BYTES || 500_000);
const MAX_PAGE_IMAGE_BYTES = Number(process.env.MAX_PAGE_IMAGE_BYTES || 1_500_000);
const MAX_DECODED_MP = Number(process.env.MAX_DECODED_MP || 12); // megapixels per image
if (!BASE) { console.error('BASE_URL required. Nothing was tested.'); process.exit(2); }
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright'); }

mkdirSync(OUT, { recursive: true });
const results = [];
const rec = (status, id, detail, extra = {}) => { results.push({ status, id, detail, ...extra }); console.log(status.padEnd(7), id, '-', detail); };

const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
// Discover product pages from the catalogue.
const probe = await (await browser.newContext()).newPage();
await probe.goto(BASE + '/shop/', { waitUntil: 'networkidle' });
const pdps = await probe.$$eval('a[href^="/products/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
const pages = ['/', '/shop/', ...pdps];

for (const [vp, size, dpr] of [['mobile', { width: 390, height: 844 }, 3], ['desktop', { width: 1280, height: 800 }, 1]]) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: dpr, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  for (const path of pages) {
    const page = await ctx.newPage();
    const bytes = new Map();
    page.on('response', async (r) => {
      if (r.request().resourceType() !== 'image') return;
      try { bytes.set(new URL(r.url()).pathname, (await r.body()).length); } catch {}
    });
    await page.addInitScript(() => {
      window.__lcp = null;
      new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = { t: Math.round(e.startTime), url: e.url, size: e.size }; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    // Scroll through so lazy images load, then wait for decode.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForLoadState('networkidle');
    const imgs = await page.$$eval('img', async (els) => Promise.all(els.map(async (img) => {
      let decodeOk = true; try { await img.decode(); } catch { decodeOk = false; }
      const r = img.getBoundingClientRect(); const cs = getComputedStyle(img);
      return { src: new URL(img.currentSrc || img.src).pathname, alt: img.getAttribute('alt'), complete: img.complete, decodeOk,
        nw: img.naturalWidth, nh: img.naturalHeight, rw: Math.round(r.width), rh: Math.round(r.height), fit: cs.objectFit,
        loading: img.getAttribute('loading'), attrW: img.getAttribute('width'), attrH: img.getAttribute('height'), visible: r.width > 0 && r.height > 0 };
    })));
    const lcp = await page.evaluate(() => window.__lcp);
    const tag = `${path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')}@${vp}`;
    await page.screenshot({ path: join(OUT, `${tag}.png`), fullPage: path !== '/shop/' || vp === 'mobile' }).catch(() => {});
    let pageBytes = 0;
    for (const im of imgs) {
      const b = bytes.get(im.src) ?? 0; pageBytes += b;
      const id = `${tag} ${im.src}`;
      if (!im.complete || !im.decodeOk || !im.nw) rec('FAIL', id, `did not decode (complete=${im.complete}, decode=${im.decodeOk}, natural=${im.nw}x${im.nh})`);
      if (im.alt === null || (im.alt.trim() === '' && !/logo|brand/i.test(im.src))) rec('FAIL', id, `missing/empty alt`);
      if (!im.visible) continue;
      const over = Math.max(im.nw / (im.rw * dpr), im.nh / (im.rh * dpr));
      const mp = (im.nw * im.nh) / 1e6;
      if (over > MAX_OVERSAMPLE) rec('FAIL', id, `oversized: ${im.nw}x${im.nh} natural for ${im.rw}x${im.rh} CSS px at DPR ${dpr} (${over.toFixed(1)}x needed resolution)`, { over, mp });
      if (mp > MAX_DECODED_MP) rec('FAIL', id, `decodes to ${mp.toFixed(1)} MP (~${Math.round(mp * 4)} MB RGBA)`, { mp });
      if (b > MAX_IMAGE_BYTES) rec('FAIL', id, `${(b / 1e6).toFixed(2)} MB transferred (limit ${(MAX_IMAGE_BYTES / 1e6).toFixed(1)} MB)`, { bytes: b });
      const boxRatio = im.rw / im.rh, imgRatio = im.nw / im.nh;
      if (im.fit !== 'contain' && Math.abs(boxRatio - imgRatio) / imgRatio > 0.05) rec('REVIEW', id, `object-fit:${im.fit} crops: image ${imgRatio.toFixed(2)} vs box ${boxRatio.toFixed(2)}`);
      if (im.fit === 'contain' && Math.abs(boxRatio - imgRatio) / imgRatio > 0.05) rec('INFO', id, `letterboxed (contain): image ${imgRatio.toFixed(2)} in box ${boxRatio.toFixed(2)}`);
      if (im.attrW && im.attrH && Math.abs(im.attrW / im.attrH - imgRatio) / imgRatio > 0.05) rec('INFO', id, `width/height attrs ${im.attrW}x${im.attrH} disagree with intrinsic ratio ${imgRatio.toFixed(2)}`);
    }
    rec(pageBytes > MAX_PAGE_IMAGE_BYTES ? 'FAIL' : 'PASS', `${tag} page-image-bytes`, `${(pageBytes / 1e6).toFixed(2)} MB of images on ${path} (limit ${(MAX_PAGE_IMAGE_BYTES / 1e6).toFixed(1)} MB); LCP ${lcp ? `${lcp.t} ms (${lcp.url ? new URL(lcp.url).pathname : 'text'})` : 'n/a'} on local server`, { pageBytes, lcp, httpStatus: resp.status(), imgs });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
// Per-asset worst case and per-page totals, so repeated findings read as one line each.
const assets = {};
for (const r of results) for (const im of r.imgs || []) {
  const a = (assets[im.src] ??= { src: im.src, natural: `${im.nw}x${im.nh}`, decodeOk: true, maxRendered: 0, alts: new Set() });
  a.decodeOk &&= im.decodeOk && im.complete && im.nw > 0; a.maxRendered = Math.max(a.maxRendered, im.rw, im.rh); a.alts.add(im.alt);
}
const pageTotals = results.filter((r) => r.id.endsWith('page-image-bytes')).map((r) => `${r.id.replace(' page-image-bytes', '')}: ${(r.pageBytes / 1e6).toFixed(2)} MB`);
const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
writeFileSync(join(OUT, 'image-audit.json'), JSON.stringify({ base: BASE, reviewed_sha: SHA, thresholds: { MAX_OVERSAMPLE, MAX_IMAGE_BYTES, MAX_PAGE_IMAGE_BYTES, MAX_DECODED_MP }, counts, results }, null, 2));
writeFileSync(join(OUT, 'summary.md'), ['# Image audit', '', `- Reviewed commit: \`${SHA}\``, `- Counts: ${JSON.stringify(counts)}`, '',
  '## Assets', '', '| Asset | Natural | Decodes | Largest rendered side (CSS px) | Alt text(s) |', '|---|---|---|---|---|',
  ...Object.values(assets).map((a) => `| ${a.src} | ${a.natural} | ${a.decodeOk ? 'yes' : '**NO**'} | ${a.maxRendered} | ${[...a.alts].join(' / ')} |`), '',
  '## Image bytes per page', '', ...pageTotals.map((x) => `- ${x}`), '', '## All checks', '', '| Status | Check | Detail |', '|---|---|---|',
  ...results.map((r) => `| ${r.status} | ${r.id} | ${String(r.detail).replace(/\|/g, '\\|')} |`)].join('\n') + '\n');
console.log('\n' + JSON.stringify(counts), '->', OUT);
process.exit(counts.FAIL ? 1 : 0);
