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
  assert(!/rel="preload" as="image"/.test(html),'No hero image preload without a visible hero product');
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

test('preview mode shows a slim, plainly worded ordering notice without dates',()=>{
  const html=home(visibleProducts(products,store),store);
  const notice=html.match(/<aside class="preview-notice"[^>]*>(.*?)<\/aside>/)[1];
  assert.match(notice,/Online ordering opens soon\./);
  assert(!/\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(notice.replace(/<[^>]+>/g,'')));
  assert(!home(visibleProducts(products,store),{...store,mode:'live'}).includes('preview-notice'));
});

test('every page has the sticky header cart hooks and a footer with real links',()=>{
  const html=home(visibleProducts(products,store),store);
  assert.match(html,/<header class="site-header">/);
  assert.match(html,/<a class="cart-link" href="\/cart\/" data-testid="cart-link"/);
  assert.match(html,/data-cart-count data-count="0" data-testid="cart-count">0</);
  const foot=html.match(/<footer class="site-footer">.*<\/footer>/)[0];
  for(const href of ['/shop/','/cart/','/custom/','/privacy/'])assert(foot.includes('href="'+href+'"'));
});

test('cards are one link with a clean LKR price and test hooks',async()=>{
  const {card}=await import('../src/render.mjs');
  const html=card(products.find(p=>p.id==='HC-LEAF'));
  assert.equal([...html.matchAll(/<a\b/g)].length,1,'A single link covers the whole card');
  assert.match(html,/data-testid="product-card"/);
  assert.match(html,/<p class="price" data-testid="product-price">LKR\s400<\/p>/);
});

test('product page: gallery only with several photos, clear price, availability and an inline ordering note',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const minato=detail(visible.find(p=>p.id==='HC-MINATO'),visible,store);
  assert.equal([...minato.matchAll(/data-gallery-thumb=/g)].length,4);
  assert.match(minato,/<p class="detail-price" data-testid="product-price">LKR\s1,000<\/p>/);
  assert.match(minato,/data-testid="availability"><span aria-hidden="true"><\/span>Availability to confirm/);
  assert.match(minato,/<p class="order-note" data-testid="order-status">.*Online ordering opens soon\. Save your picks in the request cart\.<\/p>/);
  assert(!minato.includes('order-button'),'The disabled order button is gone');
  assert.match(minato,/<h2>More from HoneyComb 3D<\/h2>/);
  const baymax=detail(visible.find(p=>p.id==='HC-BAYMAX'),visible,store);
  assert(!baymax.includes('data-gallery-thumb'));
  assert.equal([...baymax.matchAll(/fetchpriority="high"/g)].length,1);
});

test('pages carry share metadata, theme colour, touch icon and price-only Product JSON-LD',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const leaf=visible.find(p=>p.id==='HC-LEAF');
  const html=detail(leaf,visible,store);
  assert.match(html,/<meta name="description" content="A Hidden Leaf design for your keyring\./);
  assert.match(html,/<meta property="og:image" content="https:\/\/honeycomb3d\.store\/assets\/hidden-leaf-share\.jpg">/);
  assert.match(html,/<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html,/<meta name="theme-color" content="#0c0b0a">/);
  assert.match(html,/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png">/);
  const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.deepEqual(Object.keys(ld).sort(),['@context','@type','image','name','offers']);
  assert.deepEqual(ld.offers,{'@type':'Offer',price:'400',priceCurrency:'LKR'});
  assert(!/availability|rating|review/i.test(JSON.stringify(ld)));
});

test('"More from HoneyComb 3D" puts the same category and shared themes first',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=detail(visible.find(p=>p.id==='HC-MINATO'),visible,store);
  const more=html.slice(html.indexOf('More from HoneyComb 3D'));
  const names=[...more.matchAll(/class="card-link" href="[^"]+">([^<]+)</g)].map(m=>m[1]);
  assert.equal(names[0],'Classic Kunai','Same category first');
  assert(names.slice(1,3).every(n=>['Hidden Leaf Keychain','Kurama Figure'].includes(n)),'Then shared Naruto theme: '+names);
});

test('product pages offer sharing without a phone number or external script',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=detail(visible.find(p=>p.id==='HC-KURAMA'),visible,store);
  const row=html.match(/<div class="share-row"[^>]*>.*?<\/div>/)[0];
  assert.match(row,/data-url="https:\/\/honeycomb3d\.store\/products\/kurama-figure\/"/);
  const wa=row.match(/href="(https:\/\/wa\.me\/[^"]+)"/)[1].replace(/&amp;/g,'&');
  assert.equal(new URL(wa).pathname,'/','No WhatsApp number in the share link');
  assert.equal(new URL(wa).searchParams.get('text'),'Kurama Figure by HoneyComb 3D https://honeycomb3d.store/products/kurama-figure/');
  assert.match(row,/rel="noopener noreferrer"/);
  assert(!/<script(?! type="application\/ld\+json")/.test(html.replace(/<script type="module" src="\/app\.mjs"><\/script>/,'')));
});

test('home has a three-step how-it-works band without timings or promises',()=>{
  const html=home(visibleProducts(products,store),store);
  const band=html.match(/<section class="wrap section how-it-works".*?<\/section>/)[0];
  assert.deepEqual([...band.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m=>m[1]),['Browse the designs','Add them to your request cart','We confirm the details with you']);
  assert(!/\b(?:day|days|hour|hours|week|weeks|guarantee|fast|free)\b/i.test(band.replace(/<[^>]+>/g,' ')));
});
