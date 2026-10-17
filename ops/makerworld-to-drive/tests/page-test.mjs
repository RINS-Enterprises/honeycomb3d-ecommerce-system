// Drives the real Page.html in Chromium, with google.script.run wired to the real Code.gs on the fake Drive.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { makeEnv } from './gas-fake.mjs';

const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const OUT = process.env.OUT || new URL('./shots', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
// Apps Script adds the viewport tag from doGet's addMetaTag; do the same here.
const PAGE = readFileSync(new URL('../', import.meta.url).pathname + 'Page.html', 'utf8').replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1">');
const img = (c) => execSync(`python3 -c "from PIL import Image;import sys,io;b=io.BytesIO();Image.new('RGB',(400,400),'${c}').save(b,'PNG');sys.stdout.buffer.write(b.getvalue())"`);
const tiles = { cover: img('#c58b2a'), p1: img('#3c6e8f'), p2: img('#6f8f3c'), make1: img('#8f3c5e'), own: img('#555555') };
const nextPage = `<html><head><meta property="og:image" content="https://public-cdn.bblmw.com/a/cover.jpg?x-oss-process=image/resize,w_400">
<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: {
  design: { title: 'Cute Dragon', designCreator: { name: 'Maker Mia' }, license: 'Standard Digital File License', summary: '<p>Print in place dragon</p>',
    coverUrl: 'https://public-cdn.bblmw.com/a/cover.jpg', designExtension: { design_pictures: [{ url: 'https://public-cdn.bblmw.com/a/p1.jpg' }, { url: 'https://public-cdn.bblmw.com/a/p2.jpg' }] },
    instances: [{ title: '0.2mm PLA', weight: 34.6, prediction: 8100 }, { title: '0.16mm PLA', weight: 36, prediction: 10800 }] },
  comments: [{ nickname: 'Printer Pat', images: ['https://public-cdn.bblmw.com/c/make1.jpg'] }] } } })}</script></head></html>`;
const cdn = (u) => ({ body: tiles[(u.match(/\/(\w+)\.jpg/) || [])[1]] || tiles.own, type: 'image/png' });
const { ctx, state } = makeEnv({ codePath: new URL('../', import.meta.url).pathname + 'Code.gs', fetchRoutes: {
  'https://makerworld.com/en/models/111': () => ({ body: nextPage }),
  'https://makerworld.com/en/models/333': () => ({ code: 403, body: '<title>Just a moment...</title>' }),
  'https://public-cdn.bblmw.com/': cdn,
  'https://generativelanguage.googleapis.com/': () => ({ body: JSON.stringify({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: tiles.own.toString('base64') } }] } }] }) }),
} });
ctx.setup();
ctx.savePricing({ filamentCostPerKg: 6500, wastePercent: 10, machineCostPerHour: 40, labourPerItem: 100, packagingPerItem: 50, markupPercent: 80, roundTo: 50 });
state.props.GEMINI_API_KEY = 'k';
state.user = 'team@example.com';

const SHIM = `(() => {
  const runner = (ok, fail) => new Proxy({}, { get(_, name) {
    if (name === 'withSuccessHandler') return (f) => runner(f, fail);
    if (name === 'withFailureHandler') return (f) => runner(ok, f);
    return (...args) => { window.__gs(name, JSON.stringify(args)).then((res) => { const r = JSON.parse(res); if ('error' in r) { fail && fail(new Error(r.error)); } else { ok && ok(r.value); } }); };
  } });
  window.google = { script: { run: runner(null, null), url: { getLocation: (cb) => setTimeout(() => cb(window.__loc || { hash: '', parameter: {} }), 0) } } };
})();`;
const calls = [];
const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
async function openApp(name, viewport, loc, mobile = true) {
  const c = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await c.exposeFunction('__gs', async (fn, argsJson) => {
    calls.push(fn);
    if (fn.endsWith('_') || typeof ctx[fn] !== 'function') return JSON.stringify({ error: `Script function not found: ${fn}` });
    await new Promise((r) => setTimeout(r, 30));
    try { return JSON.stringify({ value: ctx[fn](...JSON.parse(argsJson)) ?? null }); } catch (e) { return JSON.stringify({ error: e.message }); }
  });
  await c.addInitScript(`window.__loc = ${JSON.stringify(loc || { hash: '', parameter: {} })}; ${SHIM}`);
  await c.route('https://script.google.com/**', (r) => r.fulfill({ contentType: 'text/html', body: PAGE }));
  await c.route('https://public-cdn.bblmw.com/**', (r) => { const x = cdn(r.request().url()); r.fulfill({ contentType: 'image/png', body: x.body }); });
  await c.route('https://drive.google.com/thumbnail**', (r) => r.fulfill({ contentType: 'image/png', body: tiles.own }));
  const p = await c.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await p.goto('https://script.google.com/macros/s/TEST/exec');
  p.errors = errors; p.ctxName = name;
  return p;
}
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const ok = (m) => console.log('PASS', m);

// A) Phone, teammate: paste a share text, review, add an own photo, save, make an AI version.
let p = await openApp('phone', { width: 390, height: 844 });
await p.waitForSelector('#start:not([hidden])');
assert.equal(await p.textContent('#who'), 'Signed in as team@example.com');
assert.equal(await p.isVisible('#folderLink'), true);
await p.waitForFunction(() => document.querySelector('#recent').textContent.includes('Nothing saved yet'));
await p.screenshot({ path: `${OUT}/phone-1-start.png`, fullPage: true });
await p.fill('#link', 'Check out this model on MakerWorld! https://makerworld.com/en/models/111-cute-dragon#profileId-9');
await p.tap('#getModel');
await p.waitForSelector('#form:not([hidden])');
assert.equal(await p.inputValue('#title'), 'Cute Dragon'); assert.equal(await p.inputValue('#designer'), 'Maker Mia');
assert.equal(await p.locator('#designer-grid .shot').count(), 3); assert.equal(await p.locator('#community-grid .shot').count(), 1);
assert.equal(await p.textContent('#community-grid small'), 'by Printer Pat');
assert.equal(await p.inputValue('#grams'), '34.6'); assert.equal(await p.inputValue('#hours'), '2.25');
assert.equal(await p.inputValue('#yourPrice'), '900');
assert.equal(await p.$eval('#savePricing', (b) => b.hidden), true);
assert.match(await p.textContent('#pricingNote'), /only owner@example.com can save them/);
await p.selectOption('#profile', '1');
assert.equal(await p.inputValue('#grams'), '36'); assert.equal(await p.inputValue('#hours'), '3.00');
await p.selectOption('#profile', '0');
ok('phone: paste share text → model read, community author, profiles, shared price, teammate cannot save pricing');
await p.locator('#designer-grid .shot').nth(2).tap();
assert.equal(await p.textContent('#countDesigner'), '(2 of 3 selected)');
await p.setInputFiles('#deviceFiles', [{ name: 'IMG_2041.jpg', mimeType: 'image/jpeg', buffer: tiles.own }]);
assert.equal(await p.locator('#device-grid .shot').count(), 1);
assert.match(await p.textContent('#device-grid small'), /own photo · IMG_2041.jpg/);
await p.check('#licensed');
await p.screenshot({ path: `${OUT}/phone-2-form.png`, fullPage: true });
assert.ok((await overflow(p)) <= 1, 'phone form overflows');
await p.tap('#save');
await p.waitForFunction(() => document.querySelector('#save').textContent === 'Saved', null, { timeout: 15000 });
assert.match(await p.textContent('#result'), /^Saved 4 photo\(s\)\. Open the Drive folder$/);
assert.equal(await p.locator('#ai-grid .shot').count(), 4);
assert.equal(await p.locator('#ai-grid .shot img').count(), 4, 'every AI tile has a thumbnail');
const row = state.sheets.get(state.props.LOG_SHEET_ID).sheet.rows[1];
assert.deepEqual([row[1], row[2], row[5], row[8], row[9], row[10]], ['team@example.com', 'Cute Dragon', 'Yes', 2, 1, 1]);
ok('phone: save uploads the device photo after the MakerWorld photos; log row correct');
await p.getByRole('button', { name: 'Wooden desk' }).tap();
assert.match(await p.inputValue('#aiPrompt'), /wooden desk/);
await p.locator('#ai-grid .shot').nth(0).tap();
await p.tap('#aiGo');
await p.waitForFunction(() => /Made \d/.test(document.querySelector('#aiResult').textContent), null, { timeout: 15000 });
assert.match(await p.textContent('#aiResult'), /^Made 1 AI version\(s\)\./);
await p.screenshot({ path: `${OUT}/phone-3-saved-ai.png`, fullPage: true });
assert.deepEqual(p.errors, []);
ok('phone: preset + AI version made');

// B) Back to start: recent imports now lists it; blocked link → fill in by hand with device photos only.
await p.tap('#back');
await p.waitForFunction(() => document.querySelector('#recent').textContent.includes('Cute Dragon'));
assert.match(await p.textContent('#recent li'), /team@example.com/);
await p.fill('#link', 'https://makerworld.com/en/models/333-flexi-fox');
await p.tap('#getModel');
await p.waitForSelector('#byHand:not([hidden])');
assert.match(await p.textContent('#getStatus'), /did not let Google's server read this page/);
await p.screenshot({ path: `${OUT}/phone-4-blocked.png`, fullPage: true });
await p.tap('#byHand');
await p.waitForSelector('#form:not([hidden])');
assert.equal(await p.inputValue('#title'), 'Flexi Fox');
assert.equal(await p.locator('#designer-grid .shot').count(), 0);
assert.equal(await p.textContent('#countDesigner'), '(none found)');
assert.equal(await p.isDisabled('#profile'), true);
assert.equal(await p.inputValue('#grams'), '');
await p.tap('#save');
assert.match(await p.textContent('#result'), /Select at least one photo, or add photos from this device/);
await p.selectOption('#deviceKind', 'designer');
await p.setInputFiles('#deviceFiles', [{ name: 'a.png', mimeType: 'image/png', buffer: tiles.p1 }, { name: 'b.png', mimeType: 'image/png', buffer: tiles.p2 }]);
await p.fill('#grams', '21.5'); await p.fill('#hours', '1.5');
assert.equal(await p.inputValue('#yourPrice'), '700'); // 21.5×1.1×6.5 + 60 + 150 = 363.7; ×1.8 = 654.7 → 700
await p.tap('#save');
await p.waitForFunction(() => document.querySelector('#save').textContent === 'Saved', null, { timeout: 15000 });
assert.match(await p.textContent('#result'), /^Saved 2 photo\(s\)/);
const row2 = state.sheets.get(state.props.LOG_SHEET_ID).sheet.rows[2];
assert.deepEqual([row2[2], row2[5], row2[8], row2[11], row2[12]], ['Flexi Fox', 'NO - check before listing', 2, 21.5, 1.5]);
assert.deepEqual(p.errors, []);
ok('phone: blocked page → fill in by hand → device photos saved as designer photos, licence flagged');
await p.context().close();

// C) Tablet, recent imports → AI versions of an earlier import.
p = await openApp('tablet', { width: 800, height: 1280 });
await p.waitForFunction(() => document.querySelectorAll('#recent li button').length === 2);
await p.locator('#recent li button').nth(1).tap();
await p.waitForSelector('#ai:not([hidden])');
await p.waitForFunction(() => document.querySelectorAll('#ai-grid .shot').length === 4);
assert.match(await p.textContent('#aiTitle'), /Cute Dragon/);
await p.screenshot({ path: `${OUT}/tablet-recent-ai.png`, fullPage: true });
assert.ok((await overflow(p)) <= 1);
assert.deepEqual(p.errors, []);
ok('tablet: recent import opens its photos for AI');
await p.context().close();

// D) Windows desktop, bookmark hash; owner can save pricing.
state.user = 'owner@example.com';
const bm = { v: 2, url: 'https://makerworld.com/en/models/111-cute-dragon', title: 'Cute Dragon', designer: 'Maker Mia', license: 'SDFL', description: 'x',
  designerImages: ['https://public-cdn.bblmw.com/a/cover.jpg'], community: [{ src: 'https://public-cdn.bblmw.com/c/make1.jpg', author: 'Printer Pat' }],
  profiles: [{ name: 'Profile', weightG: 34.6, timeRaw: 8100 }] };
p = await openApp('desktop', { width: 1440, height: 900 }, { hash: encodeURIComponent(JSON.stringify(bm)), parameter: {} }, false);
await p.waitForSelector('#form:not([hidden])');
assert.equal(await p.isVisible('#start'), false);
assert.equal(await p.$eval('#savePricing', (b) => b.hidden), false); // inside the closed <details>, so check the attribute
await p.click('#form details summary');
await p.fill('#p_markupPercent', '100');
await p.click('#savePricing');
await p.waitForFunction(() => document.querySelector('#pricingSaved').textContent.includes('Saved for everyone'));
assert.equal(JSON.parse(state.props.PRICING).markupPercent, 100);
await p.screenshot({ path: `${OUT}/desktop-bookmark.png`, fullPage: true });
assert.deepEqual(p.errors, []);
ok('desktop: bookmark data opens the form directly; owner saves pricing for everyone');
await p.context().close();

// E) Someone the folder is not shared with; ?url= link auto-reads; 320 px has no sideways scroll.
state.user = 'stranger@example.com';
state.noAccess.push({ folder: state.props.ROOT_FOLDER_ID, user: 'stranger@example.com' });
p = await openApp('small', { width: 320, height: 640 }, { hash: '', parameter: { url: 'https://makerworld.com/en/models/111' } });
await p.waitForSelector('#notice:not([hidden])');
assert.match(await p.textContent('#notice'), /Ask owner@example.com to share it with stranger@example.com as Editor/);
await p.waitForSelector('#form:not([hidden])');
assert.ok((await overflow(p)) <= 1, '320 px overflows');
await p.screenshot({ path: `${OUT}/small-noaccess.png`, fullPage: false });
ok('320 px: no-access notice; ?url= link reads the model straight away; no sideways scroll');
await p.context().close();

await browser.close();
assert.ok(!calls.some((c) => c.endsWith('_')), 'page called a private function');
console.log('server functions used by the page:', [...new Set(calls)].join(', '));
console.log('ALL PAGE CHECKS PASSED');
