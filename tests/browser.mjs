import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {money} from '../src/domain.mjs';
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'inherit'});
let browser;
try {
  let ready=false;
  for(let i=0;i<50;i++){try{const r=await fetch('http://127.0.0.1:4173/');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert(ready,'Preview server starts');
  browser=await chromium.launch();
  await mkdir('test-results',{recursive:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  async function screenshot(path) {
    await page.evaluate(()=>{for(const img of document.images)img.loading='eager';});
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete));
    await page.evaluate(async()=>{
      for(const img of document.images) {
        if(!img.naturalWidth)throw new Error('Image did not load: '+img.src);
        try {await img.decode();}
        catch {throw new Error('Image did not decode: '+img.src);}
      }
    });
    await page.screenshot({path,fullPage:true});
  }
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('complementary',{name:'Store preview notice'}).waitFor();
  await screenshot('test-results/home-desktop.png');
  await page.getByRole('link',{name:'Shop the collection'}).click();
  assert.equal(await page.locator('[data-product-card]').count(),7,'Every product with an approved photo is shown');
  assert.equal(await page.locator('.photo-placeholder').count(),0);
  for(const card of await page.locator('[data-product-card]').all()) {
    assert.equal(await card.getByRole('link').count(),1,'One accessible link per product card');
    assert.equal(await card.getByRole('heading',{level:2}).count(),1,'Shop heading hierarchy');
  }
  await screenshot('test-results/shop-desktop.png');
  await page.getByRole('searchbox').fill('no-match-here');
  await page.waitForFunction(()=>document.querySelector('#no-results').hidden===false);
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.getByRole('button',{name:'Clear filters'}).isHidden(),true,'Clear filters only shows for active filters');
  await page.getByTestId('filter-figures').click();
  assert.equal(await page.getByRole('radio',{name:'Figures'}).isChecked(),true);
  assert.match(page.url(),/category=Figures/);
  assert.equal(await page.locator('[data-product-card]:visible').count(),2,'Figures: Baymax and Kurama');
  await page.getByTestId('filter-all').click();
  await page.getByTestId('filter-naruto').click();
  assert.equal(await page.locator('[data-product-card]:visible').count(),4,'Theme chip: Hidden Leaf, Kurama, Minato and Classic Kunai');
  await page.goBack();
  await page.waitForFunction(()=>document.querySelectorAll('[data-product-card]:not([hidden])').length===7);
  assert.equal(await page.getByRole('radio',{name:'Any theme'}).isChecked(),true,'Back restores the previous filter');
  await page.getByTestId('filter-figures').click();
  await page.getByRole('searchbox').fill('Baymax');
  assert.equal(await page.locator('[data-product-card]:visible').count(),1);
  await page.getByRole('heading',{name:'Baymax Figure'}).getByRole('link').click();
  await page.getByRole('button',{name:'Add to request cart'}).waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
  await screenshot('test-results/product-desktop.png');
  await page.getByRole('spinbutton').fill('2');
  await page.getByRole('button',{name:'Add to request cart'}).click();
  await page.getByRole('button',{name:'Added to cart ✓'}).waitFor();
  await page.getByRole('status').filter({hasText:'Baymax Figure added to your request cart.'}).waitFor();
  assert.equal(await page.getByTestId('cart-count').textContent(),'2');
  await page.getByRole('button',{name:'Add to request cart'}).waitFor();
  await page.getByRole('link',{name:'View your request cart'}).click();
  await page.getByRole('heading',{name:'Estimated items subtotal: '+money(2000),exact:true}).waitFor();
  assert.equal(await page.getByRole('spinbutton').inputValue(),'2');
  await page.getByTestId('cart-qty-increase').click();
  await page.getByRole('heading',{name:'Estimated items subtotal: '+money(3000),exact:true}).waitFor();
  assert.equal(await page.getByTestId('cart-qty').inputValue(),'3');
  await page.getByTestId('cart-qty-decrease').click();
  await page.getByTestId('cart-qty-decrease').click();
  assert.equal(await page.getByTestId('cart-qty').inputValue(),'1');
  assert.equal(await page.getByTestId('cart-qty-decrease').isDisabled(),true,'Quantity cannot go below 1');
  await page.getByTestId('cart-qty-increase').click();
  await page.getByRole('heading',{name:'Estimated items subtotal: '+money(2000),exact:true}).waitFor();
  assert.equal(await page.getByTestId('cart-line').count(),1);
  assert.equal(await page.locator('a[href^="https://wa.me/"]').count(),0);
  assert(!await page.locator('#order-handoff').textContent().then(t=>t.includes('Opening WhatsApp')));
  assert.match(await page.locator('.message-preview').inputValue(),/Baymax Figure \[HC-BAYMAX\] x 2/);
  await screenshot('test-results/cart-desktop.png');
  await page.setViewportSize({width:390,height:844});
  await screenshot('test-results/cart-mobile.png');
  await page.setViewportSize({width:1440,height:1000});
  await page.reload();
  await page.getByRole('spinbutton').waitFor();
  assert.equal(await page.getByRole('spinbutton').inputValue(),'2');
  await page.getByRole('spinbutton').fill('3');await page.getByRole('spinbutton').press('Tab');
  await page.waitForFunction(()=>document.querySelector('.message-preview').value.includes('x 3'));
  await page.getByLabel('Notes',{exact:false}).fill('Blue & gold');
  assert.match(await page.locator('.message-preview').inputValue(),/Blue & gold/);
  await page.getByRole('button',{name:'Remove Baymax Figure'}).click();
  await page.getByRole('heading',{name:'Your cart is empty'}).waitFor();
  await page.goto('http://127.0.0.1:4173/custom/');
  await page.getByLabel('Your idea').fill('A desk sign <script>alert(1)</script>');
  await page.getByLabel('Model or reference link').fill('https://example.com/model?a=1&b=2');
  await page.waitForFunction(()=>!document.querySelector('#custom-form button').disabled);
  await page.getByRole('button',{name:'Preview enquiry'}).click();
  assert.match(await page.locator('.message-preview').inputValue(),/<script>alert\(1\)<\/script>/);
  assert.equal(await page.locator('#custom-result script').count(),0);
  assert(!await page.locator('#custom-result').textContent().then(t=>t.includes('Opening WhatsApp')));
  // Contact handoff is tested with an intercepted fixture only; no message is sent.
  await page.route('**/data/store.json',async route=>{
    const response=await route.fetch();const data=await response.json();
    await route.fulfill({json:{...data,mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'}});
  });
  await page.reload();await page.getByLabel('Your idea').fill('A blue sign');
  await page.waitForFunction(()=>!document.querySelector('#custom-form button').disabled);
  await page.getByRole('button',{name:'Preview enquiry'}).click();
  const href=await page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('href');
  assert.equal(new URL(href).hostname,'wa.me');
  assert.match(new URL(href).searchParams.get('text'),/A blue sign/);
  // Mixed-price cart fixture verifies the complete cart handoff, including cents.
  await page.route('**/data/products.json',async route=>{
    const response=await route.fetch();const data=await response.json();
    await route.fulfill({json:data.map(p=>({...p,approved:!!p.image,availability:'made-to-order',priceLkr:p.id==='HC-BAYMAX'?19.99:null}))});
  });
  for(const [slug,quantity] of [['baymax-figure','2'],['night-fury-keychain','3']]) {
    await page.goto('http://127.0.0.1:4173/products/'+slug+'/');
    await page.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
    await page.getByRole('spinbutton').fill(quantity);
    await page.getByRole('button',{name:'Add to request cart'}).click();
  }
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByRole('heading',{name:'Priced items subtotal: '+money(39.98),exact:true}).waitFor();
  const cartHref=await page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('href');
  const request=new URL(cartHref).searchParams.get('text');
  assert.match(request,/Baymax Figure \[HC-BAYMAX\] x 2/);
  assert.match(request,/Night Fury Keychain \[HNYCMB501\] x 3: price to confirm/);
  assert(request.includes(money(39.98))&&request.includes('not the full total'));
  assert.match(request,/not a confirmed purchase/);
  assert.equal(await page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('rel'),'noopener noreferrer');
  assert.match(await page.locator('#order-handoff').textContent(),/Opening WhatsApp does not send/);
  await page.evaluate(()=>localStorage.clear());
  await page.unroute('**/data/products.json');
  await page.unroute('**/data/store.json');
  for(const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:844});
    for(const path of ['/','/shop/','/products/baymax-figure/','/cart/','/custom/','/privacy/']) {
      await page.goto('http://127.0.0.1:4173'+path);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at '+width+': '+path);
    }
  }
  // System fonts differ by machine; repeat the narrowest check with a wide fallback face (as on CI runners).
  await page.route('**/styles.css',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace(/--font-sans:[^;]*;/,'--font-sans:"DejaVu Sans",sans-serif;')});});
  await page.setViewportSize({width:320,height:844});
  for(const path of ['/','/shop/','/products/baymax-figure/','/products/minato-kunai/','/cart/','/custom/','/privacy/']) {
    await page.goto('http://127.0.0.1:4173'+path);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow at 320 with a wide font: '+path);
  }
  await page.unroute('**/styles.css');
  await page.setViewportSize({width:1280,height:900});
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await page.getByRole('button',{name:'Show photo 3 of 4'}).click();
  await page.waitForFunction(()=>{const t=document.querySelector('[data-gallery-track]');return Math.round(t.scrollLeft/t.clientWidth)===2;});
  assert.equal(await page.getByRole('button',{name:'Show photo 3 of 4'}).getAttribute('aria-current'),'true');
  assert.equal(await page.locator('[data-gallery-thumb][aria-current]').count(),1,'Exactly one current thumbnail');
  assert.match(await page.getByTestId('order-status').textContent(),/Online ordering opens soon\./);
  assert.equal(await page.getByRole('button',{name:/Ordering opens soon/}).count(),0,'No disabled order button');
  await page.getByTestId('zoom-open').click();
  await page.getByRole('dialog',{name:'Product photos'}).waitFor();
  assert.match(await page.locator('.lightbox-count').textContent(),/^Photo 3 of 4$/,'Lightbox opens on the current gallery photo');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.lightbox-count').textContent(),'Photo 4 of 4');
  await page.waitForFunction(()=>{const i=document.querySelector('.lightbox-stage img');return i&&i.complete&&i.naturalWidth>0;});
  await page.locator('.lightbox-stage').click();
  assert.equal(await page.locator('.lightbox-stage.is-zoomed').count(),1,'Tap zooms');
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state:'hidden'});
  // The dialog's close event (focus return and image removal) fires as a task after it hides.
  await page.waitForFunction(()=>document.activeElement?.dataset.testid==='zoom-open'&&!document.querySelector('.lightbox-stage img'),null,{timeout:5000});
  const shareShown=await page.getByTestId('share-button').isVisible(), copyShown=await page.getByTestId('share-copy').isVisible();
  assert(shareShown!==copyShown||!copyShown,'Either the native share button or the copy-link fallback is offered');
  if(copyShown) {
    await page.context().grantPermissions(['clipboard-read','clipboard-write']);
    await page.getByTestId('share-copy').click();
    await page.getByRole('status').filter({hasText:'Link copied.'}).waitFor();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'https://honeycomb3d.store/products/minato-kunai/');
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/products/kurama-figure/');
  await page.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
  assert.equal(await page.getByTestId('sticky-buy').isVisible(),false,'No buy bar while the add button is on screen or below');
  await page.evaluate(()=>{const f=document.querySelector('#add-form');scrollTo(0,f.getBoundingClientRect().bottom+scrollY+200);});
  await page.waitForFunction(()=>document.querySelector('[data-sticky-buy]').classList.contains('is-visible'));
  await page.getByTestId('sticky-buy').getByRole('button',{name:'Add to request cart'}).click();
  await page.getByRole('status').filter({hasText:'Kurama Figure added to your request cart.'}).waitFor();
  await page.evaluate(()=>document.querySelector('.site-footer').scrollIntoView());
  await page.waitForFunction(()=>!document.querySelector('[data-sticky-buy]').classList.contains('is-visible'));
  await page.evaluate(()=>localStorage.clear());
  for(const [route,name] of [['/shop/','shop'],['/products/baymax-figure/','product'],['/custom/','custom']]) {
    await page.goto('http://127.0.0.1:4173'+route);
    await screenshot('test-results/'+name+'-mobile.png');
  }
  await page.goto('http://127.0.0.1:4173/');
  await screenshot('test-results/home-mobile.png');
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');
  await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
  const missing=await page.goto('http://127.0.0.1:4173/not-found/');
  assert.equal(missing.status(),404);
  await page.route('**/data/products.json',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByRole('heading',{name:'Your cart could not load'}).waitFor();
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: original image decoding, accessible cards/headings/preview landmark, catalogue filters, cart persistence/update/removal, owner-sourced pricing, custom enquiry, mixed-price WhatsApp fixture, 320/390/768/1440px layouts, keyboard skip link, 404, network failure and no page errors. No message was sent.');
} finally {if(browser)await browser.close();server.kill();}
