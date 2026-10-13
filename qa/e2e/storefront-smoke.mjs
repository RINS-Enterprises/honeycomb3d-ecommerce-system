#!/usr/bin/env node
// HoneyComb 3D storefront browser smoke test (QA-owned, implementation-agnostic).
//
//   BASE_URL=http://127.0.0.1:4173 QA_SHA=<reviewed commit> \
//   WHATSAPP_NUMBER=94703009064 node qa/e2e/storefront-smoke.mjs
//
// Locates elements by the data-testid contract in docs/QA-ACCEPTANCE.md first, then by
// accessible role/text heuristics. A check that cannot locate its target reports
// INCONCLUSIVE, never PASS. Results: qa/results/<QA_SHA|adhoc>/browser/{results.json,summary.md,*.png}
// Exit code: 0 no FAIL, 1 at least one FAIL, 2 could not run.

import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateHandoff } from '../lib/whatsapp-link-check.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.BASE_URL || '').replace(/\/$/, '');
const SHA = process.env.QA_SHA || 'adhoc';
const WA_NUMBER = process.env.WHATSAPP_NUMBER || '';
const OUT = process.env.OUT_DIR || join(here, '..', 'results', SHA, 'browser');
const CATALOG_PATHS = (process.env.CATALOG_PATH || '/shop,/products,/catalog,/').split(',');
const CART_PATH = process.env.CART_PATH || '';
// QA_LIVE_FIXTURE=1: intercept /data/store.json and /data/products.json so the client runs in live
// mode with a TEST-ONLY number and TEST-ONLY prices. Nothing is sent; wa.me is never opened.
const LIVE_FIXTURE = process.env.QA_LIVE_FIXTURE === '1';
const FIXTURE_NUMBER = WA_NUMBER || '94000000000';
const ADD_RE = /add to (request |my )?(cart|bag|basket)/i;
const UNPRICED_RE = /price (on enquiry|to confirm|on request)|quote required/i;

if (!BASE) {
  console.error('BASE_URL is required. Nothing was tested.');
  process.exit(2);
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const root = execSync('npm root -g').toString().trim();
    return createRequire(join(root, 'noop.js'))('playwright');
  }
}

const results = [];
const record = (id, ac, status, detail, extra = {}) => {
  results.push({ id, ac, status, detail, ...extra });
  console.log(`${status.padEnd(12)} ${id} [${ac}] ${detail}`);
};

const MONEY = /(?:Rs\.?|LKR|රු)\s*([\d,]+(?:\.\d{1,2})?)/gi;
const parseMoney = (t) => [...String(t).matchAll(MONEY)].map((m) => Number(m[1].replace(/,/g, '')));

async function first(...locators) {
  for (const l of locators) {
    const n = await l.count().catch(() => 0);
    for (let i = 0; i < Math.min(n, 10); i++) {
      if (await l.nth(i).isVisible().catch(() => false)) return l.nth(i);
    }
  }
  return null;
}
const tid = (scope, id) => scope.locator(`[data-testid="${id}"]`);

function watch(page, label) {
  const errs = { console: [], page: [], http: [], thirdParty: new Set() };
  const origin = new URL(BASE).origin;
  // Keep the failing resource's URL: "Failed to load resource" text alone does not say what failed.
  page.on('console', (m) => m.type() === 'error' && errs.console.push(`${m.text().slice(0, 200)}${m.location()?.url ? ` @ ${m.location().url}` : ''}`));
  page.on('pageerror', (e) => errs.page.push(String(e.message || e).slice(0, 200)));
  page.on('response', (r) => {
    const u = r.url();
    if (u.startsWith(origin) && r.status() >= 400) errs.http.push(`${r.status()} ${u}`);
  });
  page.on('request', (r) => {
    try {
      const u = new URL(r.url());
      if (/^https?:$/.test(u.protocol) && u.origin !== origin) errs.thirdParty.add(u.host);
    } catch {}
  });
  errs.label = label;
  return errs;
}

const CLAIMS = [
  [/\b\d+\s+sold\b/i, 'sold count'],
  [/only\s+\d+\s+left/i, 'low-stock count'],
  [/\b\d+\s+in stock\b/i, 'stock count'],
  [/high demand|selling fast|almost gone/i, 'demand claim'],
  [/limited (pieces|stock|batch|edition)/i, 'scarcity claim'],
  [/verified (buyer|purchase|review)/i, 'verified-review claim'],
  [/trustpilot|cusrev/i, 'third-party review service'],
  [/cash on delivery|\bCOD\b/i, 'COD claim'],
  [/free (shipping|delivery)/i, 'free-shipping claim'],
  [/next[- ]day|within \d+\s*(hours|days)|same[- ]day/i, 'delivery-time promise'],
  [/guarantee|warranty|money[- ]back/i, 'guarantee claim'],
  [/\bofficial(ly)? licen[cs]ed\b/i, 'licensing claim'],
];
const JUNK = /lorem ipsum|\bTODO\b|\bFIXME\b|example\.com|\bundefined\b|\bNaN\b|\[object Object\]|\$\s?\d/;

async function scanText(page, where) {
  const text = await page.locator('body').innerText().catch(() => '');
  for (const [re, label] of CLAIMS) {
    const m = text.match(re);
    if (m) record(`claim-${label.replace(/\W+/g, '-')}-${where}`, 'AC-CONTENT-1', 'REVIEW', `"${m[0]}" on ${where}: needs owner-confirmed evidence`);
  }
  const j = text.match(JUNK);
  if (j) record(`junk-${where}`, 'AC-CONTENT-3', 'FAIL', `placeholder/junk text "${j[0]}" on ${where}`);
}

async function pageBasics(page, errs, where, vp) {
  const info = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    h1: [...document.querySelectorAll('h1')].filter((h) => h.offsetParent !== null).length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    imgNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    unnamedButtons: [...document.querySelectorAll('button,[role=button]')].filter(
      (b) => !(b.getAttribute('aria-label') || b.textContent.trim() || b.getAttribute('title') || b.getAttribute('aria-labelledby')),
    ).length,
  }));
  const tag = `${where}@${vp}`;
  record(`lang-${tag}`, 'AC-A11Y-1', info.lang ? 'PASS' : 'FAIL', `html lang="${info.lang}"`);
  record(`title-${tag}`, 'AC-A11Y-1', info.title.trim() ? 'PASS' : 'FAIL', `title "${info.title}"`);
  record(`h1-${tag}`, 'AC-A11Y-2', info.h1 === 1 ? 'PASS' : 'FAIL', `${info.h1} visible h1`);
  record(`overflow-${tag}`, 'AC-NAV-3', info.overflow <= 1 ? 'PASS' : 'FAIL', `horizontal overflow ${info.overflow}px`);
  record(`img-alt-${tag}`, 'AC-A11Y-3', info.imgNoAlt === 0 ? 'PASS' : 'FAIL', `${info.imgNoAlt} img without alt attribute`);
  record(`button-name-${tag}`, 'AC-A11Y-4', info.unnamedButtons === 0 ? 'PASS' : 'FAIL', `${info.unnamedButtons} buttons without accessible name`);
  const bad = [...errs.page, ...errs.console];
  record(`js-errors-${tag}`, 'AC-FAIL-4', bad.length ? 'FAIL' : 'PASS', bad.length ? bad.slice(0, 3).join(' | ') : 'no console/page errors');
  record(`http-errors-${tag}`, 'AC-FAIL-4', errs.http.length ? 'FAIL' : 'PASS', errs.http.length ? errs.http.slice(0, 3).join(' | ') : 'no same-origin 4xx/5xx');
  errs.console.length = errs.page.length = errs.http.length = 0;
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true }).catch(() => {});
}

async function gotoCatalog(page) {
  for (const p of CATALOG_PATHS) {
    const r = await page.goto(BASE + p, { waitUntil: 'networkidle' }).catch(() => null);
    if (r && r.status() < 400 && (await productLinks(page)).length) return p;
  }
  return null;
}

async function productLinks(page) {
  const card = tid(page, 'product-card');
  const scope = (await card.count()) ? card.locator('a[href]') : page.locator('main a[href*="/product"], a[href*="/products/"], a[href*="/product/"]');
  const hrefs = await scope.evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  return hrefs.filter((h) => h && !/^(#|mailto:|tel:|https?:\/\/(wa\.me|api\.whatsapp))/.test(h));
}

async function visibleProductCount(page) {
  const card = tid(page, 'product-card');
  const scope = (await card.count()) ? card : page.locator('[data-product-card], main a[href*="/product"]');
  return scope.evaluateAll((els) => new Set(els.filter((e) => e.offsetParent !== null).map((e) => e.querySelector?.('a[href]')?.getAttribute('href') || e.getAttribute('href'))).size);
}

async function cartCount(page) {
  const el = await first(tid(page, 'cart-count'));
  if (el) return Number((await el.innerText()).replace(/\D/g, '') || 0);
  const link = await first(tid(page, 'cart-link'), page.getByRole('link', { name: /cart|bag/i }), page.getByRole('button', { name: /cart|bag/i }));
  if (!link) return null;
  const t = (await link.innerText().catch(() => '')) + ' ' + ((await link.getAttribute('aria-label')) || '');
  const m = t.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

async function openCart(page) {
  if (CART_PATH) {
    await page.goto(BASE + CART_PATH, { waitUntil: 'networkidle' });
    return true;
  }
  const link = await first(tid(page, 'cart-link'), page.getByRole('link', { name: /cart|bag/i }), page.getByRole('button', { name: /cart|bag/i }));
  if (!link) return false;
  await link.click();
  await page.waitForTimeout(500);
  return true;
}

async function cartState(page) {
  const qtyEl = await first(tid(page, 'cart-qty'), page.getByRole('spinbutton'), page.locator('input[type=number]'));
  let qty = null;
  if (qtyEl) {
    const v = (await qtyEl.inputValue().catch(() => null)) ?? (await qtyEl.innerText().catch(() => ''));
    qty = Number(String(v).replace(/\D/g, '')) || null;
  }
  const subEl = await first(tid(page, 'cart-subtotal'), tid(page, 'cart-total'));
  let subtotal = null;
  if (subEl) subtotal = parseMoney(await subEl.innerText())[0] ?? null;
  else {
    const t = await page.locator('body').innerText();
    const m = t.match(/sub\s*total[^\d]{0,30}([\d,]+(?:\.\d{1,2})?)/i) || t.match(/\btotal[^\d]{0,30}([\d,]+(?:\.\d{1,2})?)/i);
    if (m) subtotal = Number(m[1].replace(/,/g, ''));
  }
  return { qty, subtotal };
}

async function captureWhatsApp(context, page) {
  const btn = await first(
    tid(page, 'whatsapp-checkout'),
    page.locator('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="whatsapp:"]'),
    page.getByRole('button', { name: /whatsapp/i }),
    page.getByRole('link', { name: /whatsapp/i }),
  );
  if (!btn) return { found: false };
  const href = await btn.getAttribute('href');
  const target = await btn.getAttribute('target');
  const rel = (await btn.getAttribute('rel')) || '';
  if (href && /wa\.me|whatsapp/.test(href)) return { found: true, href, target, rel, how: 'href' };
  // Button: capture window.open / navigation without leaving for whatsapp.
  await page.evaluate(() => {
    window.__qaOpened = [];
    const o = window.open;
    window.open = (u, ...a) => (window.__qaOpened.push(String(u)), null);
    window.__qaRestore = () => (window.open = o);
  });
  let navUrl = null;
  await context.route(/wa\.me|whatsapp\.com/, (route) => {
    navUrl = route.request().url();
    route.abort();
  });
  await btn.click().catch(() => {});
  await page.waitForTimeout(800);
  const opened = await page.evaluate(() => window.__qaOpened || []).catch(() => []);
  const url = opened.find((u) => /wa\.me|whatsapp/.test(u)) || navUrl;
  return url ? { found: true, href: url, how: opened.length ? 'window.open' : 'navigation' } : { found: true, href: null, how: 'none' };
}

const fixturePrices = {};
const PNG_1PX = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
async function installLiveFixture(ctx) {
  await ctx.route('**/data/store.json', async (route) => {
    const data = await (await route.fetch()).json();
    await route.fulfill({ json: { ...data, mode: 'live', whatsappVerified: true, whatsappNumber: FIXTURE_NUMBER } });
  });
  await ctx.route('**/data/products.json', async (route) => {
    const data = await (await route.fetch()).json();
    await route.fulfill({ json: data.map((p, i) => {
      fixturePrices[p.name] = 100 * (i + 1); // TEST-ONLY prices
      // Approve only products that already have a real photo. Since acca67f the app rejects a
      // photo that has no matching responsive variant, so a stand-in image would make the whole
      // live data set invalid (fail-closed) instead of testing the cart.
      if (Array.isArray(p.imageVariants)) return { ...p, approved: !!p.image, availability: 'made-to-order', priceLkr: 100 * (i + 1) };
      return { ...p, approved: true, availability: 'made-to-order', priceLkr: 100 * (i + 1), image: p.image || '/assets/qa-fixture.png', imageAlt: p.imageAlt || p.name };
    }) });
  });
  await ctx.route('**/assets/qa-fixture.png', (route) => route.fulfill({ contentType: 'image/png', body: PNG_1PX }));
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const started = new Date().toISOString();
  let headers = {};

  // 1. Layout, navigation, basics at each viewport.
  for (const [vp, size] of [['mobile', { width: 390, height: 844 }], ['small', { width: 360, height: 740 }], ['desktop', { width: 1280, height: 800 }]]) {
    const ctx = await browser.newContext({ viewport: size, isMobile: vp !== 'desktop', hasTouch: vp !== 'desktop' });
    const page = await ctx.newPage();
    const errs = watch(page, vp);
    const resp = await page.goto(BASE + '/', { waitUntil: 'networkidle' }).catch((e) => e);
    if (!resp || resp instanceof Error) {
      record(`home-load-${vp}`, 'AC-FAIL-4', 'FAIL', `home did not load: ${resp && resp.message}`);
      await ctx.close();
      continue;
    }
    if (vp === 'desktop') headers = resp.headers();
    record(`home-load-${vp}`, 'AC-NAV-1', resp.status() < 400 ? 'PASS' : 'FAIL', `GET / -> ${resp.status()}`);
    await shot(page, `home-${vp}`);
    await pageBasics(page, errs, 'home', vp);
    if (vp === 'desktop') await scanText(page, 'home');

    const nav = page.getByRole('navigation').first();
    if (vp === 'desktop') {
      const n = await nav.getByRole('link').evaluateAll((ls) => ls.filter((l) => l.offsetParent !== null).length).catch(() => 0);
      record('nav-desktop', 'AC-NAV-1', n > 0 ? 'PASS' : 'FAIL', `${n} visible links in first navigation landmark`);
    } else {
      const toggle = await first(tid(page, 'nav-toggle'), page.getByRole('button', { name: /menu|navigation|open nav/i }));
      if (!toggle) {
        const n = await nav.getByRole('link').evaluateAll((ls) => ls.filter((l) => l.offsetParent !== null).length).catch(() => 0);
        record(`nav-${vp}`, 'AC-NAV-2', n > 0 ? 'PASS' : 'FAIL', `no menu toggle; ${n} nav links visible directly (overflow checked separately)`);
      } else {
        const before = await toggle.getAttribute('aria-expanded');
        await toggle.click();
        await page.waitForTimeout(300);
        const after = await toggle.getAttribute('aria-expanded');
        const visibleLinks = await page.getByRole('navigation').getByRole('link').evaluateAll((ls) => ls.filter((l) => l.offsetParent !== null && l.getBoundingClientRect().width > 0).length).catch(() => 0);
        record(`nav-${vp}-open`, 'AC-NAV-2', visibleLinks > 0 ? 'PASS' : 'FAIL', `menu opened: ${visibleLinks} links visible`);
        record(`nav-${vp}-aria-expanded`, 'AC-A11Y-6', before === 'false' && after === 'true' ? 'PASS' : 'FAIL', `aria-expanded ${before} -> ${after}`);
        await shot(page, `nav-open-${vp}`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        const esc = await toggle.getAttribute('aria-expanded');
        record(`nav-${vp}-escape`, 'AC-NAV-2', esc === 'false' ? 'PASS' : 'FAIL', `after Escape aria-expanded=${esc}`);
      }
    }

    if (vp === 'desktop') {
      // Keyboard: first Tab stops are visible, named, and show a focus indicator.
      const stops = [];
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        stops.push(
          await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              name: (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').trim().slice(0, 40),
              visible: r.width > 0 && r.height > 0,
              indicator: (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none',
            };
          }),
        );
      }
      const real = stops.filter(Boolean);
      const skip = real[0] && /skip/i.test(real[0].name);
      record('kbd-skip-link', 'AC-A11Y-5', skip ? 'PASS' : 'FAIL', `first Tab stop: ${real[0] ? `${real[0].tag} "${real[0].name}"` : 'none'}`);
      const noInd = real.filter((s) => !s.indicator);
      record('kbd-focus-indicator', 'AC-A11Y-5', real.length && !noInd.length ? 'PASS' : real.length ? 'FAIL' : 'INCONCLUSIVE', `${noInd.length}/${real.length} focused elements without outline/box-shadow`, { stops: real });
    }
    await ctx.close();
  }

  // 2. Catalog -> PDP -> cart -> WhatsApp -> removal (desktop and mobile).
  for (const [vp, size] of [['desktop', { width: 1280, height: 800 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
    if (LIVE_FIXTURE) await installLiveFixture(ctx);
    const page = await ctx.newPage();
    const errs = watch(page, vp);
    const catPath = await gotoCatalog(page);
    if (!catPath) {
      record(`catalog-${vp}`, 'AC-CAT-1', 'FAIL', `no product links found on ${CATALOG_PATHS.join(', ')}`);
      await ctx.close();
      continue;
    }
    const links = await productLinks(page);
    record(`catalog-${vp}`, 'AC-CAT-1', 'PASS', `${links.length} product links on ${catPath}`);
    await shot(page, `catalog-${vp}`);
    await pageBasics(page, errs, 'catalog', vp);
    if (vp === 'desktop') await scanText(page, 'catalog');

    if (vp === 'desktop') {
      const filter = await first(
        page.locator('[data-testid^="filter-"]'),
        page.locator('main select'),
        page.locator('main input[type=checkbox], main input[type=radio]'),
        page.locator('main [aria-pressed]'),
      );
      if (!filter) record('filter-apply', 'AC-CAT-2', 'INCONCLUSIVE', 'no filter control located');
      else {
        const url0 = page.url();
        const before = await visibleProductCount(page);
        const tag = await filter.evaluate((e) => e.tagName);
        if (tag === 'SELECT') {
          const opts = await filter.locator('option').evaluateAll((os) => os.map((o) => o.value));
          if (opts.length > 1) await filter.selectOption(opts[1]);
        } else await filter.click();
        await page.waitForTimeout(600);
        const after = await visibleProductCount(page);
        const narrowed = after < before;
        const empty = after === 0 ? await page.getByText(/no (products|results|items|matching)|nothing (found|matches)/i).count() : 1;
        record('filter-apply', 'AC-CAT-2', narrowed && empty ? 'PASS' : after === before ? 'INCONCLUSIVE' : 'FAIL',
          `filter (${tag}) -> ${before} to ${after} visible products, url ${page.url() === url0 ? 'unchanged' : 'changed'}${after === 0 && !empty ? ', no empty-state message' : ''}`);
        await shot(page, 'catalog-filtered');
        await page.goto(BASE + catPath, { waitUntil: 'networkidle' });
      }
    }

    // PDP
    const href = links[0];
    const pdpResp = await page.goto(new URL(href, BASE + '/').href, { waitUntil: 'networkidle' });
    const name = (await page.locator('h1').first().innerText().catch(() => '')).trim();
    const priceEl = await first(tid(page, 'product-price'));
    const price = priceEl ? parseMoney(await priceEl.innerText())[0] : parseMoney(await page.locator('main').first().innerText().catch(() => ''))[0];
    const unpricedLabel = price == null ? ((await page.locator('main').first().innerText().catch(() => '')).match(UNPRICED_RE) || [])[0] : null;
    record(`pdp-${vp}`, 'AC-PDP-1', pdpResp.status() < 400 && name && (price || unpricedLabel) ? 'PASS' : 'FAIL',
      `${href} -> ${pdpResp.status()}, name "${name}", price ${price ?? `unpriced ("${unpricedLabel}")`}`);
    await shot(page, `pdp-${vp}`);
    await pageBasics(page, errs, 'pdp', vp);
    if (vp === 'desktop') await scanText(page, 'pdp');

    const add = await first(tid(page, 'add-to-cart'), page.getByRole('button', { name: ADD_RE }));
    if (!add) {
      record(`add-to-cart-${vp}`, 'AC-CART-1', 'FAIL', 'no add-to-cart button');
      await ctx.close();
      continue;
    }
    const c0 = await cartCount(page);
    await add.click();
    await page.waitForTimeout(600);
    const c1 = await cartCount(page);
    const live = await page.locator('[aria-live]:not([aria-live=off]), [role=status], [role=alert]').allInnerTexts().catch(() => []);
    record(`add-to-cart-${vp}`, 'AC-CART-1', c0 != null && c1 === c0 + 1 ? 'PASS' : c1 == null ? 'INCONCLUSIVE' : 'FAIL', `cart count ${c0} -> ${c1}`);
    record(`add-to-cart-announce-${vp}`, 'AC-A11Y-7', live.some((t) => t.trim()) ? 'PASS' : 'FAIL', `live region text: ${JSON.stringify(live.filter((t) => t.trim()).slice(0, 2))}`);

    if (!(await openCart(page))) {
      record(`cart-open-${vp}`, 'AC-CART-2', 'FAIL', 'no cart link/button');
      await ctx.close();
      continue;
    }
    await shot(page, `cart-${vp}`);
    const unit = LIVE_FIXTURE ? fixturePrices[name] : price;
    const s1 = await cartState(page);
    if (unit == null) {
      const txt = await page.locator('main').first().innerText();
      record(`cart-line-${vp}`, 'AC-PREV-2', s1.qty === 1 && UNPRICED_RE.test(txt) && !/\b0\.00\b/.test(txt) ? 'PASS' : 'FAIL',
        `unpriced item: qty ${s1.qty}, unpriced label ${UNPRICED_RE.test(txt) ? 'shown' : 'missing'}, zero amount ${/\b0\.00\b/.test(txt) ? 'shown' : 'absent'}`);
    } else {
      record(`cart-line-${vp}`, 'AC-CART-2', s1.qty === 1 && s1.subtotal === unit ? 'PASS' : s1.qty == null || s1.subtotal == null ? 'INCONCLUSIVE' : 'FAIL',
        `qty ${s1.qty}, subtotal ${s1.subtotal}, expected 1 x ${unit}`);
    }

    const inc = await first(tid(page, 'cart-qty-increase'), page.getByRole('button', { name: /increase|add one|more|^\+$/i }));
    const qtyInput = inc ? null : await first(tid(page, 'cart-qty'), page.getByRole('spinbutton'));
    let s2 = s1;
    if (!inc && !qtyInput) record(`cart-qty-inc-${vp}`, 'AC-CART-3', 'INCONCLUSIVE', 'no quantity control');
    else {
      if (inc) await inc.click();
      else { await qtyInput.fill('2'); await qtyInput.press('Tab'); }
      await page.waitForTimeout(400);
      s2 = await cartState(page);
      const okTotal = unit == null ? s2.subtotal == null : s2.subtotal === unit * 2;
      record(`cart-qty-inc-${vp}`, 'AC-CART-3', s2.qty === 2 && okTotal ? 'PASS' : 'FAIL',
        `via ${inc ? '+ button' : 'quantity input'}: qty ${s2.qty}, subtotal ${s2.subtotal}, expected ${unit == null ? 'none (unpriced)' : `2 x ${unit} = ${unit * 2}`}`);
      // Invalid quantities must be rejected without corrupting the cart.
      if (qtyInput) {
        for (const bad of ['0', '21', '1.5']) {
          const q = await first(tid(page, 'cart-qty'), page.getByRole('spinbutton'));
          await q.fill(bad); await q.press('Tab'); await page.waitForTimeout(300);
        }
        const s4 = await cartState(page);
        record(`cart-qty-invalid-${vp}`, 'AC-CART-3', s4.qty === 2 ? 'PASS' : 'FAIL', `after entering 0, 21, 1.5: qty ${s4.qty} (expected to stay 2)`);
        await page.keyboard.press('Escape');
      }
      await page.reload({ waitUntil: 'networkidle' });
      if (!CART_PATH) await openCart(page);
      const s3 = await cartState(page);
      record(`cart-persist-${vp}`, 'AC-CART-5', s3.qty === s2.qty ? 'PASS' : 'FAIL', `after reload qty ${s3.qty} (was ${s2.qty})`);
    }

    if (vp === 'desktop') {
      const wa = await captureWhatsApp(ctx, page);
      const closedNotice = await page.getByText(/not open yet|orders are not open|requests are not open/i).count();
      if (!wa.found && !LIVE_FIXTURE && closedNotice) record('whatsapp-handoff', 'AC-PREV-3', 'PASS', 'preview: no WhatsApp link, "not open yet" notice shown (run with QA_LIVE_FIXTURE=1 to test the handoff)');
      else if (!wa.found) record('whatsapp-handoff', 'AC-WA-1', 'FAIL', 'no WhatsApp checkout control in cart');
      else if (!wa.href) record('whatsapp-handoff', 'AC-WA-1', 'FAIL', 'WhatsApp control produced no wa.me URL');
      else {
        const v = validateHandoff(wa.href, { expectedNumber: LIVE_FIXTURE ? FIXTURE_NUMBER : WA_NUMBER || undefined, items: [{ name, qty: s2.qty }], total: s2.subtotal ?? undefined });
        record('whatsapp-handoff', 'AC-WA-2', v.ok ? 'PASS' : 'FAIL', v.issues.map((i) => `${i.severity}: ${i.message}`).join('; ') || 'number, item, qty, total present', { href: wa.href, text: v.parsed.text });
        if (wa.target === '_blank') record('whatsapp-rel', 'AC-SEC-4', /noopener|noreferrer/.test(wa.rel) ? 'PASS' : 'FAIL', `target=_blank rel="${wa.rel}"`);
        if (!WA_NUMBER && !LIVE_FIXTURE) record('whatsapp-number', 'AC-WA-2', 'INCONCLUSIVE', `sends to ${v.parsed.number}; set WHATSAPP_NUMBER to the owner-confirmed number`);
      }
    }

    const rm = await first(tid(page, 'cart-remove'), page.getByRole('button', { name: /remove|delete/i }));
    if (!rm) record(`cart-remove-${vp}`, 'AC-CART-4', 'FAIL', 'no remove control');
    else {
      await rm.click();
      await page.waitForTimeout(500);
      const emptyMsg = await page.getByText(/(cart|bag) is empty|no items|empty (cart|bag)/i).count();
      const waLeft = await first(tid(page, 'whatsapp-checkout'), page.locator('a[href*="wa.me"]'));
      const waEnabled = waLeft ? await waLeft.isEnabled().catch(() => true) : false;
      const cc = await cartCount(page);
      record(`cart-remove-${vp}`, 'AC-CART-4', emptyMsg && !waEnabled && (cc === 0 || cc == null) ? 'PASS' : 'FAIL',
        `empty-state ${emptyMsg ? 'shown' : 'missing'}, WhatsApp checkout ${waEnabled ? 'still enabled' : 'unavailable'}, cart count ${cc}`);
      await shot(page, `cart-empty-${vp}`);
    }
    await ctx.close();
  }

  // 3. Failure states.
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = watch(page, 'failure');
    const r = await page.goto(`${BASE}/products/qa-nonexistent-product-404`, { waitUntil: 'networkidle' });
    const nf = await page.getByText(/not found|doesn.t exist|no longer available|404/i).count();
    const back = await page.getByRole('link', { name: /home|shop|browse|catalog/i }).count();
    record('unknown-product', 'AC-FAIL-1', r.status() === 404 && nf && back ? 'PASS' : 'FAIL', `status ${r.status()}, not-found text ${nf ? 'yes' : 'no'}, recovery link ${back ? 'yes' : 'no'}`);
    await shot(page, 'unknown-product');

    // Seed a cart first so there is client state to corrupt.
    if (await gotoCatalog(page)) {
      const [h] = await productLinks(page);
      await page.goto(new URL(h, BASE + '/').href, { waitUntil: 'networkidle' });
      const add = await first(tid(page, 'add-to-cart'), page.getByRole('button', { name: ADD_RE }));
      if (add) await add.click().then(() => page.waitForTimeout(400));
    }
    const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => /cart|bag|basket/i.test(k)));
    if (!keys.length) record('corrupt-cart-storage', 'AC-FAIL-2', 'INCONCLUSIVE', 'no cart key in localStorage (cart may be server-side or empty)');
    else {
      await page.evaluate((ks) => ks.forEach((k) => localStorage.setItem(k, '{"items":[{"id":42,"qty":"abc"}')), keys);
      errs.page.length = 0;
      await page.reload({ waitUntil: 'networkidle' });
      const ok = (await page.locator('h1').count()) > 0 && errs.page.length === 0;
      record('corrupt-cart-storage', 'AC-FAIL-2', ok ? 'PASS' : 'FAIL', `keys ${keys.join(',')}; page errors: ${errs.page.join(' | ') || 'none'}`);
    }
    await ctx.close();

    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const p2 = await noJs.newPage();
    await p2.goto(BASE + (CATALOG_PATHS[0] || '/'), { waitUntil: 'load' }).catch(() => {});
    const n = await productLinks(p2).catch(() => []);
    record('no-js-catalog', 'AC-FAIL-5', n.length ? 'PASS' : 'REVIEW', `${n.length} product links rendered without JavaScript`);
    await noJs.close();
  }

  // 4. Response headers (meaningful only on a production-like server).
  const want = ['content-security-policy', 'x-content-type-options', 'referrer-policy'];
  const missing = want.filter((h) => !headers[h]);
  record('security-headers', 'AC-SEC-3', missing.length ? 'REVIEW' : 'PASS', missing.length ? `missing: ${missing.join(', ')} (check deployed config, not dev server)` : 'present');

  await browser.close();
  const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  const meta = { base: BASE, reviewed_sha: SHA, whatsapp_expected: WA_NUMBER || null, started, finished: new Date().toISOString(), counts };
  writeFileSync(join(OUT, 'results.json'), JSON.stringify({ meta, results }, null, 2));
  const md = [`# Browser smoke results`, '', `- Reviewed commit: \`${SHA}\``, `- Base URL: ${BASE}`, `- Run: ${started} -> ${meta.finished}`, `- Counts: ${JSON.stringify(counts)}`, '',
    '| Status | Check | AC | Detail |', '|---|---|---|---|',
    ...results.map((r) => `| ${r.status} | ${r.id} | ${r.ac} | ${String(r.detail).replace(/\|/g, '\\|')} |`)].join('\n');
  writeFileSync(join(OUT, 'summary.md'), md + '\n');
  console.log(`\n${JSON.stringify(counts)} -> ${OUT}`);
  process.exit(counts.FAIL ? 1 : 0);
}

main().catch((e) => {
  console.error('harness error:', e);
  process.exit(2);
});
