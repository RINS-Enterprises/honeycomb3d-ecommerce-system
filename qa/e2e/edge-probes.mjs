// Implementation-specific browser probes for codex/storefront-mvp (selectors from src/render.mjs).
// Usage: BASE_URL=http://127.0.0.1:4173 node qa/e2e/edge-probes.mjs   (exit 1 on any FAIL)
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/x.js')('playwright');
const B=(process.env.BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,''); const b = await chromium.launch(); const out=[];
const ctx = await b.newContext(); const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
// Probe products the catalogue actually lists: products without an approved photo are hidden, so
// a hard-coded product can disappear. PROBE_PRODUCT=<slug> picks one explicitly.
const listed = await (await fetch(B + '/data/products.json')).json();
const P0 = (process.env.PROBE_PRODUCT && listed.find((x) => x.slug === process.env.PROBE_PRODUCT)) || listed[0];
const P1 = listed.find((x) => x.id !== P0.id);
// The active category: a <select id="category"> (before cc01cb7) or the checked category chip.
const category = (pg) => pg.evaluate(() => document.querySelector('#category')?.value ?? document.querySelector('input[name=category]:checked')?.value ?? '(none)');
// 1. URL params: XSS attempt and unknown category
await p.goto(B+'/shop/?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E&category=%3Cscript%3E', {waitUntil:'networkidle'});
out.push(['xss-params', await p.locator('img[src=x]').count()===0 && (await p.inputValue('#search')).includes('<img') ? 'PASS':'FAIL', 'search box shows text; no injected img; category='+await category(p)]);
// 2. search + category combination & URL restore
await p.goto(B+'/shop/?q=dragon&category=Keychains',{waitUntil:'networkidle'});
const vis=await p.$$eval('[data-product-card]',cs=>cs.filter(c=>!c.hidden).map(c=>c.querySelector('h2,h3,h4').textContent));
out.push(['url-restore-combined', vis.length===2?'PASS':'FAIL', JSON.stringify(vis)]);
// 3. tampered localStorage: huge qty, unknown id, wrong types
await p.goto(B+'/cart/'); await p.evaluate(([a,c])=>localStorage.setItem('honeycomb.cart.v1', JSON.stringify([{id:a,quantity:999},{id:'EVIL<script>',quantity:1},{id:c,quantity:'5'}])), [P0.id, P1.id]);
await p.reload({waitUntil:'networkidle'});
const q=await p.$$eval('[data-quantity]',i=>i.map(x=>x.dataset.quantity+'='+x.value));
out.push(['tampered-storage', JSON.stringify(q)===JSON.stringify([P0.id+'=20'])?'PASS':'FAIL', JSON.stringify(q)]);
// 4. add beyond max from PDP
await p.goto(B+'/products/'+P0.slug+'/',{waitUntil:'networkidle'}); await p.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
await p.fill('#add-form input[name=quantity]','5'); await p.click('#add-form button'); await p.waitForTimeout(300);
out.push(['add-over-max', (await p.textContent('#status')).includes('up to 20')?'PASS':'FAIL', await p.textContent('#status')]);
// 5. notes with markup go into textarea as text only
await p.goto(B+'/cart/',{waitUntil:'networkidle'}); await p.fill('#order-notes','</textarea><img src=x onerror=alert(2)>');
out.push(['notes-escaping', await p.locator('img[src=x]').count()===0 && (await p.inputValue('.message-preview')).includes('</textarea><img')?'PASS':'FAIL','notes rendered as text']);
// 6. storage blocked
const c2 = await b.newContext(); await c2.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError')}})});
const p2=await c2.newPage(); const e2=[]; p2.on('pageerror',e=>e2.push(e.message));
await p2.goto(B+'/products/'+P0.slug+'/',{waitUntil:'networkidle'}); await p2.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
await p2.click('#add-form button'); await p2.waitForTimeout(300);
out.push(['storage-blocked', e2.length===0 && /could not save/.test(await p2.textContent('#status'))?'PASS':'FAIL', (await p2.textContent('#status'))+' errors:'+e2.length]);
// 7. keyboard: duplicate tab stops per product card
await p.goto(B+'/shop/',{waitUntil:'networkidle'});
const links=await p.$$eval('[data-product-card] a:not([tabindex="-1"])',as=>as.length); const cards=await p.$$eval('[data-product-card]',c=>c.length);
out.push(['card-tab-stops', links===cards?'PASS':'REVIEW', `${links} focusable links for ${cards} cards`]);
// 8. JS errors overall
out.push(['page-errors', errs.length===0?'PASS':'FAIL', errs.join('|')||'none']);
for (const o of out) console.log(o[1].padEnd(7), o[0].padEnd(22), o[2]);
await b.close();
process.exit(out.some(o=>o[1]==="FAIL")?1:0);
