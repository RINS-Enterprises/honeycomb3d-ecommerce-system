// Run: node --test qa/
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWhatsAppUrl, amountPattern, validateHandoff } from './whatsapp-link-check.mjs';

const enc = encodeURIComponent;

test('parses wa.me links', () => {
  const p = parseWhatsAppUrl(`https://wa.me/94703009064?text=${enc('Hi\nKurama x 2')}`);
  assert.equal(p.ok, true);
  assert.equal(p.number, '94703009064');
  assert.equal(p.text, 'Hi\nKurama x 2');
});

test('parses api.whatsapp.com and whatsapp: links', () => {
  assert.equal(parseWhatsAppUrl('https://api.whatsapp.com/send?phone=94703009064&text=hi').number, '94703009064');
  assert.equal(parseWhatsAppUrl('whatsapp://send?phone=94703009064&text=hi').number, '94703009064');
});

test('rejects local-format, plus-prefixed and spaced numbers', () => {
  for (const n of ['0703009064', '+94703009064', '94%2070%20300%209064']) {
    assert.equal(parseWhatsAppUrl(`https://wa.me/${n}?text=hi`).ok, false, n);
  }
});

test('rejects non-WhatsApp hosts and missing text', () => {
  assert.equal(parseWhatsAppUrl('https://evil.example/94703009064?text=hi').ok, false);
  assert.equal(parseWhatsAppUrl('https://wa.me/94703009064').ok, false);
  assert.equal(parseWhatsAppUrl('not a url').ok, false);
});

test('amountPattern matches grouped/ungrouped and decimals but not other numbers', () => {
  const re = amountPattern(1200);
  for (const s of ['Rs. 1,200', 'LKR 1200.00', 'Total: 1,200.00']) assert.match(s, re, s);
  for (const s of ['12,000', '11200', '1,200.50', '21,200']) assert.doesNotMatch(s, re, s);
  assert.match('Rs 950.50', amountPattern(950.5));
});

const cart = {
  expectedNumber: '94703009064',
  items: [
    { name: 'Kurama Figure (Naruto)', qty: 2 },
    { name: 'Classic Kunai (Naruto)', qty: 1 },
  ],
  total: 3300,
};

test('accepts a well-formed order message', () => {
  const text = 'Order request\n- Kurama Figure (Naruto) x 2 = Rs. 2,400\n- Classic Kunai (Naruto) x 1 = Rs. 900\nTotal: Rs. 3,300';
  const r = validateHandoff(`https://wa.me/94703009064?text=${enc(text)}`, cart);
  assert.equal(r.ok, true, JSON.stringify(r.issues));
});

test('accepts "Qty: n" on the following line', () => {
  const text = 'Kurama Figure (Naruto)\nQty: 2\nClassic Kunai (Naruto)\nQty: 1\nSubtotal 3300';
  assert.equal(validateHandoff(`https://wa.me/94703009064?text=${enc(text)}`, cart).ok, true);
});

test('flags wrong number, missing item, wrong qty, wrong total, junk values', () => {
  const text = 'Kurama Figure (Naruto) x 1\nTotal: undefined';
  const r = validateHandoff(`https://wa.me/94770000000?text=${enc(text)}`, cart);
  assert.equal(r.ok, false);
  const msgs = r.issues.map((i) => i.message).join('\n');
  assert.match(msgs, /expected 94703009064/);
  assert.match(msgs, /Classic Kunai.*missing/);
  assert.match(msgs, /quantity 2 for "Kurama/);
  assert.match(msgs, /total 3300 not present/);
  assert.match(msgs, /undefined/);
});

test('flags double encoding', () => {
  const text = 'Kurama%20Figure%20(Naruto)%20x%202';
  const r = validateHandoff(`https://wa.me/94703009064?text=${enc(text)}`, { items: [] });
  assert.ok(r.issues.some((i) => /double-encoded/.test(i.message)));
});
