// Contract tests for the storefront domain module (src/domain.mjs) and shipped data.
// Runs against a REVIEW checkout, never the implementer's working copy:
//   DOMAIN_DIR=/path/to/review-<sha> node --test qa/domain/
// Each test names the acceptance criterion it covers (docs/QA-ACCEPTANCE.md).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateHandoff } from '../lib/whatsapp-link-check.mjs';

const DIR = process.env.DOMAIN_DIR;
const skip = !DIR && 'DOMAIN_DIR not set (point it at a review checkout)';
const load = async () => {
  const d = await import(pathToFileURL(join(DIR, 'src/domain.mjs')).href);
  const products = JSON.parse(readFileSync(join(DIR, 'data/products.json'), 'utf8'));
  const store = JSON.parse(readFileSync(join(DIR, 'data/store.json'), 'utf8'));
  return { d, products, store };
};
// A priced, verified fixture derived from the shipped catalog. Test-only values, NOT real prices.
const priced = (products) => products.map((p, i) => ({ ...p, priceLkr: 100 * (i + 1) }));
const verified = (store) => ({ ...store, whatsappNumber: '94000000000', whatsappVerified: true });
const mem = (v) => ({ getItem: () => v });

test('AC-DATA-1: shipped catalog and store config pass the module\'s own validation', { skip }, async () => {
  const { d, products, store } = await load();
  assert.doesNotThrow(() => d.validateData(products, store));
  for (const p of products) assert.ok(p.source?.trim(), `${p.id} has no provenance`);
});

test('AC-CONTENT-1: no stock counts, sale prices, sold counts or reviews in data', { skip }, async () => {
  const { products } = await load();
  const forbidden = /\b(sold|only \d+ left|in stock|sale|review|rating|bestseller|high demand)\b/i;
  for (const p of products) {
    for (const k of ['compareAtPriceLkr', 'stock', 'soldCount', 'rating', 'reviews']) assert.equal(p[k], undefined, `${p.id}.${k}`);
    assert.doesNotMatch(`${p.name} ${p.description}`, forbidden, p.id);
  }
});

test('AC-CAT-2: the category filter returns every product of that type (keychains)', { skip }, async () => {
  const { d, products } = await load();
  const keychains = products.filter((p) => /keychain/i.test(p.name)).map((p) => p.id).sort();
  const cats = [...new Set(products.filter((p) => keychains.includes(p.id)).map((p) => p.category))];
  const viaFilter = d.filterProducts(products, '', cats[0]).filter((p) => /keychain/i.test(p.name)).map((p) => p.id).sort();
  assert.deepEqual(viaFilter, keychains, `keychains are split across categories ${JSON.stringify(cats)}`);
});

test('AC-CART-1/3: duplicates merge, quantities cap, invalid lines drop', { skip }, async () => {
  const { d, products } = await load();
  const [a, b] = products;
  const out = d.normalizeCart(
    [{ id: a.id, quantity: 2 }, { id: a.id, quantity: 3 }, { id: b.id, quantity: 999 }, { id: a.id, quantity: '4' },
      { id: a.id, quantity: 1.5 }, { id: a.id, quantity: 0 }, { id: 'NOT-A-PRODUCT', quantity: 1 }, null, 'x'],
    products,
  );
  assert.deepEqual(out, [{ id: a.id, quantity: 5 }, { id: b.id, quantity: d.MAX_QUANTITY }]);
});

test('AC-FAIL-2: corrupt, non-array and throwing storage yield an empty cart without crashing', { skip }, async () => {
  const { d, products } = await load();
  assert.deepEqual(d.readCart(mem('{"items":[{"id":42'), products).items, []);
  assert.deepEqual(d.readCart(mem('{"a":1}'), products).items, []);
  assert.deepEqual(d.readCart({ getItem() { throw new Error('SecurityError'); } }, products).items, []);
  assert.deepEqual(d.readCart(mem(null), products), { items: [], error: false });
});

test('AC-CART-2: subtotal = sum of unit x qty in exact rupees', { skip }, async () => {
  const { d, products } = await load();
  const P = priced(products);
  const s = d.cartSummary([{ id: P[0].id, quantity: 3 }, { id: P[1].id, quantity: 2 }], P);
  assert.equal(s.count, 5);
  assert.equal(s.knownSubtotal, P[0].priceLkr * 3 + P[1].priceLkr * 2);
  assert.equal(s.unpriced, false);
  const cents = P.map((p) => ({ ...p, priceLkr: 0.1 }));
  assert.equal(d.cartSummary([{ id: P[0].id, quantity: 3 }], cents).knownSubtotal, 0.3);
});

test('AC-WA-2: handoff message carries name, ID, qty, subtotal and is a valid wa.me URL', { skip }, async () => {
  const { d, products, store } = await load();
  const P = priced(products);
  const items = [{ id: P[2].id, quantity: 2 }, { id: P[3].id, quantity: 1 }];
  const msg = d.orderMessage(items, P, 'Colour: blue');
  const url = d.whatsappUrl(msg, verified(store));
  const total = P[2].priceLkr * 2 + P[3].priceLkr;
  const v = validateHandoff(url, { expectedNumber: '94000000000', items: [{ name: P[2].name, qty: 2 }, { name: P[3].name, qty: 1 }], total });
  assert.ok(v.ok, JSON.stringify(v.issues));
  for (const it of items) assert.match(msg, new RegExp(`\\[${it.id}\\]`), `product identifier ${it.id} missing`);
});

test('AC-WA-4: message says it is a request awaiting confirmation, not a purchase', { skip }, async () => {
  const { d, products } = await load();
  const msg = d.orderMessage([{ id: products[0].id, quantity: 1 }], products);
  assert.match(msg, /not a confirmed purchase|awaiting confirmation|request/i);
  assert.doesNotMatch(msg, /order (is )?(confirmed|placed)|payment (received|successful)|paid\b/i);
});

test('AC-WA-2: an all-unpriced cart does not present a 0.00 subtotal', { skip }, async () => {
  const { d, products } = await load();
  const unpriced = products.map((p) => ({ ...p, priceLkr: null }));
  const msg = d.orderMessage([{ id: unpriced[0].id, quantity: 1 }], unpriced);
  assert.doesNotMatch(msg, /\b0\.00\b/, `message shows a zero subtotal:\n${msg}`);
});

test('AC-WA-1/3: handoff is disabled unless the number is verified; empty cart gives no URL', { skip }, async () => {
  const { d, store } = await load();
  assert.equal(d.whatsappUrl('hello', { ...store, whatsappVerified: false, whatsappNumber: '94000000000' }), null);
  assert.equal(d.whatsappUrl('hello', { ...store, whatsappVerified: true, whatsappNumber: '+94 70 000 0000' }), null);
  assert.equal(d.whatsappUrl('', verified(store)), null);
  assert.equal(d.orderMessage([], []), '');
});

test('AC-DATA-3: any LKR price with at most 2 decimals is accepted by validation', { skip }, async () => {
  const { d, products, store } = await load();
  for (const v of [1, 450, 1200, 999.5, 10.15, 19.99]) {
    assert.doesNotThrow(() => d.validateData([{ ...products[0], priceLkr: v }], store), `price ${v}`);
  }
});

test('AC-SEC-4: escapeHtml neutralises markup and attribute breakouts', { skip }, async () => {
  const { d } = await load();
  assert.equal(d.escapeHtml(`<img src=x onerror="a('1')">&`), '&lt;img src=x onerror=&quot;a(&#39;1&#39;)&quot;&gt;&amp;');
});

test('AC-DATA-2: live mode hides unapproved products and requires a verified contact', { skip }, async () => {
  const { d, products, store } = await load();
  const live = { ...verified(store), mode: 'live' };
  assert.ok(d.visibleProducts(products, live).every((p) => p.approved));
  assert.throws(() => d.validateData(products, { ...store, mode: 'live', whatsappVerified: false }));
});
