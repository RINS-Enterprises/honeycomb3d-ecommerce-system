import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {home} from '../src/render.mjs';
import {visibleProducts} from '../src/domain.mjs';

const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
const store=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const live={mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'};

test('the home hero only links to a product included in the live-visible catalogue',()=>{
  const approved=products.map(p=>({...p,approved:p.id==='HC-BAYMAX'}));
  const html=home(visibleProducts(approved,live),live);
  const links=[...html.matchAll(/href="(\/products\/[^\"]+)"/g)].map(m=>m[1]);
  assert(links.length>0);
  assert(links.every(link=>link==='/products/baymax-figure/'));
  assert(!html.includes('/assets/kurama.jpg'));
});

test('an empty live catalogue has no dead product link or unapproved hero photo',()=>{
  const html=home(visibleProducts(products,live),live);
  assert(!html.includes('href="/products/'));
  assert(!html.includes('class="hero-visual"'));
  assert(!html.includes('rel="preload"'));
  assert(html.includes('href="/custom/"'));
});

test('photos decode synchronously so off-screen cards never paint as empty frames',()=>{
  const html=home(products,{mode:'preview'});
  assert(html.includes('<img '));
  assert(!html.includes('decoding="async"'));
});

test('the full-bleed hero photo is the preloaded, eager, high-priority LCP image',()=>{
  const html=home(visibleProducts(products,store),store);
  const img=html.match(/<div class="hero-visual">.*?<img [^>]*>/)[0];
  assert.match(img,/loading="eager"/);
  assert.match(img,/fetchpriority="high"/);
  assert(!/loading="lazy"/.test(img));
  assert.equal([...html.matchAll(/<link rel="preload" as="image"[^>]*fetchpriority="high"/g)].length,2);
  assert.match(html,/<a class="button" href="\/shop\/">Shop the collection/);
});
