// Runs bookmark-link.txt (the exact line people paste) on mock MakerWorld pages.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const pw = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const line = readFileSync(new URL('../', import.meta.url).pathname + 'bookmark-link.txt', 'utf8').trim().replace(encodeURIComponent('PASTE_YOUR_WEB_APP_URL_HERE'), encodeURIComponent('https://script.google.com/macros/s/TEST/exec'));
assert.ok(line.startsWith('javascript:'));
const src = decodeURIComponent(line.slice('javascript:'.length));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const nd = { props: { pageProps: { design: { title: 'Cute Dragon', designCreator: { name: 'Maker Mia' }, license: 'Standard Digital File License', summary: '<p>Dragon</p>',
  coverUrl: 'https://public-cdn.bblmw.com/a/cover.jpg', designExtension: { design_pictures: [{ url: 'https://public-cdn.bblmw.com/a/p1.jpg' }] },
  instances: [{ title: '0.2mm PLA', weight: 34.6, prediction: 8100 }] },
  comments: [{ nickname: 'Printer Pat', images: ['https://public-cdn.bblmw.com/c/make1.jpg'] }] } } };
const b = await pw.chromium.launch();
const results = {};
for (const variant of ['nextdata', 'dom-only', 'other-site']) {
  const ctx = await b.newContext();
  await ctx.route(() => true, (r) => {
    const u = r.request().url();
    if (/\.(png|jpg)/.test(u)) return r.fulfill({ contentType: 'image/png', body: png });
    return r.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head><title>Cute Dragon | MakerWorld</title><meta property="og:image" content="https://public-cdn.bblmw.com/a/cover.jpg?x-oss-process=image/resize,w_400">
      ${variant === 'nextdata' ? `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(nd)}</script>` : ''}</head>
      <body><a href="/en/@makermia">Maker Mia</a><div>2h 15m · 34.6 g</div><img id="big" src="https://public-cdn.bblmw.com/a/p3.png?x-oss-process=image/resize,w_1200">
      <div class="comment-item"><a href="/en/@pat">Printer Pat</a><img id="c" src="https://public-cdn.bblmw.com/c/make2.jpg"></div></body></html>` });
  });
  const p = await ctx.newPage();
  await p.goto(variant === 'other-site' ? 'https://example.com/' : 'https://makerworld.com/en/models/12345-cute-dragon#comments', { waitUntil: 'load' });
  await p.evaluate(() => {
    for (const [id, w] of [['big', 1200], ['c', 600]]) { const i = document.getElementById(id); if (i) Object.defineProperty(i, 'naturalWidth', { get: () => w }); }
    window.open = (u) => { window.__opened = u; }; window.alert = (m) => { window.__alert = m; };
  });
  await p.evaluate(src);
  const opened = await p.evaluate(() => window.__opened);
  results[variant] = { opened, alert: await p.evaluate(() => window.__alert), data: opened ? JSON.parse(decodeURIComponent(opened.split('#')[1])) : null };
  await ctx.close();
}
await b.close();
const n = results.nextdata.data;
assert.ok(results.nextdata.opened.startsWith('https://script.google.com/macros/s/TEST/exec#'));
assert.equal(n.title, 'Cute Dragon'); assert.equal(n.designer, 'Maker Mia');
assert.deepEqual(n.designerImages, ['https://public-cdn.bblmw.com/a/cover.jpg', 'https://public-cdn.bblmw.com/a/p1.jpg', 'https://public-cdn.bblmw.com/a/p3.png']);
assert.deepEqual(n.community, [{ src: 'https://public-cdn.bblmw.com/c/make1.jpg', author: 'Printer Pat' }, { src: 'https://public-cdn.bblmw.com/c/make2.jpg', author: 'Printer Pat' }]);
assert.deepEqual(n.profiles, [{ name: '0.2mm PLA', weightG: 34.6, timeRaw: 8100 }]);
console.log('PASS bookmark on a page with page data (author carried to photo lists)');
const dm = results['dom-only'].data;
assert.equal(dm.title, 'Cute Dragon | MakerWorld'); assert.equal(dm.designer, 'Maker Mia');
assert.deepEqual(dm.community, [{ src: 'https://public-cdn.bblmw.com/c/make2.jpg', author: 'Printer Pat' }]);
assert.equal(dm.profiles[0].weightG, 34.6); assert.equal(dm.profiles[0].hours, 2.25);
console.log('PASS bookmark on a page without page data (visible photos, comment author, "2h 15m · 34.6 g")');
assert.equal(results['other-site'].opened, undefined); assert.match(results['other-site'].alert, /Open a MakerWorld model page first/);
console.log('PASS bookmark refuses other sites');
console.log('bookmark line length', line.length);
