import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {money} from '../src/domain.mjs';
// Assertions follow the built configuration: preview (ordering closed) or live (WhatsApp order requests open).
const builtStore=JSON.parse(await readFile('dist/data/store.json','utf8'));
const ordering=builtStore.mode==='live'&&builtStore.whatsappVerified;
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
    // Full-page captures do not scroll, so settle reveal motion first.
    await page.evaluate(()=>{for(const img of document.images)img.loading='eager';document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('reveal','is-in'));});
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
  if(ordering)assert.equal(await page.getByRole('complementary',{name:'Store preview notice'}).count(),0,'No preview notice once ordering is open');
  else await page.getByRole('complementary',{name:'Store preview notice'}).waitFor();
  await screenshot('test-results/home-desktop.png');
  await page.getByRole('link',{name:'Shop the collection'}).click();
  assert.equal(await page.locator('[data-product-card]').count(),17,'Every product with an approved photo is shown (Stormtrooper has none)');
  assert.equal(await page.locator('.photo-placeholder').count(),0);
  for(const card of await page.locator('[data-product-card]').all()) {
    assert.equal(await card.getByRole('link').count(),1,'One accessible link per product card');
    assert.equal(await card.getByRole('heading',{level:2}).count(),1,'Shop heading hierarchy');
  }
  await screenshot('test-results/shop-desktop.png');
  await page.getByRole('searchbox').fill('no-match-here');
  await page.waitForFunction(()=>document.querySelector('#no-results').hidden===false);
  assert.equal(await page.locator('[data-no-results-text]').textContent(),'Nothing matches “no-match-here”. Try another word, or browse a category.');
  await page.getByRole('searchbox').fill('<img src=x onerror=alert(1)>');
  assert.equal(await page.locator('#no-results img').count(),0,'The query is shown as text, never markup');
  await page.getByTestId('try-props').click();
  await page.waitForFunction(()=>document.querySelectorAll('[data-product-card]:not([hidden])').length===3);
  assert.equal(await page.getByRole('searchbox').inputValue(),'','Browsing a category clears the search');
  assert.match(page.url(),/category=Props/);
  assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('card-link')),true,'Focus moves to the first result');
  await page.getByRole('searchbox').fill('no-match-here');
  await page.waitForFunction(()=>document.querySelector('#no-results').hidden===false);
  assert.equal(await page.getByTestId('shop-custom-tile').isHidden(),true,'No results: the empty state carries the custom link instead');
  await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.getByRole('button',{name:'Clear filters'}).isHidden(),true,'Clear filters only shows for active filters');
  await page.getByTestId('filter-figures').click();
  assert.equal(await page.getByRole('radio',{name:'Figures'}).isChecked(),true);
  assert.match(page.url(),/category=Figures/);
  assert.equal(await page.locator('[data-product-card]:visible').count(),8,'Figures: Baymax, Kurama and the six new figures');
  await page.getByTestId('filter-all').click();
  await page.getByTestId('filter-naruto').click();
  assert.equal(await page.locator('[data-product-card]:visible').count(),4,'Theme chip: Hidden Leaf, Kurama, Minato and Classic Kunai');
  await page.goBack();
  await page.waitForFunction(()=>document.querySelectorAll('[data-product-card]:not([hidden])').length===17);
  assert.equal(await page.getByRole('radio',{name:'Any theme'}).isChecked(),true,'Back restores the previous filter');
  // Hover photo: gallery products get a decorative second photo, loaded lazily; size never changes.
  const leafCard=page.locator('[data-product-card]').filter({hasText:'Hidden Leaf Keychain'});
  await leafCard.locator('.has-alt .card-alt').waitFor({state:'attached'});
  assert.equal(await leafCard.locator('.card-alt').getAttribute('aria-hidden'),'true','Hover photo is hidden from assistive tech');
  assert.match(await leafCard.locator('.card-alt').getAttribute('alt'),/\S/,'Hover photo still carries its gallery alt text');
  assert.equal(await page.locator('[data-product-card]').filter({hasText:'Baymax Figure'}).locator('.card-alt').count(),0,'No gallery, no hover photo');
  const before=await leafCard.boundingBox();
  await leafCard.hover();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.has-alt .card-alt')).opacity==='1');
  const after=await leafCard.boundingBox();
  assert.equal(Math.round(after.height),Math.round(before.height),'Hover photo does not resize the card');
  await page.mouse.move(0,0);
  const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await touch.goto('http://127.0.0.1:4173/shop/');await touch.waitForLoadState('networkidle');
  assert.equal(await touch.locator('.card-alt').count(),0,'No hover photo without hover');
  await touch.close();
  const kuramaCard=page.locator('[data-product-card]').filter({hasText:'Kurama Figure'});
  await kuramaCard.getByTestId('quick-add').click();
  await page.getByRole('status').filter({hasText:'Kurama Figure added to your request cart.'}).waitFor();
  assert.equal(await page.getByTestId('cart-count').textContent(),'1','Quick add adds one');
  assert.match(page.url(),/\/shop\//,'Quick add stays on the page');
  assert.equal(await kuramaCard.getByRole('link').count(),1,'Quick add is not a link and not nested in one');
  // Reveal motion: below-the-fold content only, settles after scrolling, off under reduced motion.
  const motion=await browser.newPage({viewport:{width:390,height:844}});
  await motion.goto('http://127.0.0.1:4173/');
  await motion.waitForFunction(()=>document.querySelectorAll('.reveal').length>0);
  assert.equal(await motion.evaluate(()=>[...document.querySelectorAll('.reveal')].some(el=>el.getBoundingClientRect().top<innerHeight-60)),false,'Nothing on the first screen is hidden');
  for(let y=0;y<await motion.evaluate(()=>document.body.scrollHeight);y+=400){await motion.evaluate(y=>scrollTo(0,y),y);await motion.waitForTimeout(60);}
  await motion.waitForFunction(()=>!document.querySelector('.reveal'),null,{timeout:5000});
  await motion.close();
  const still=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await still.goto('http://127.0.0.1:4173/');await still.waitForLoadState('networkidle');
  assert.equal(await still.locator('.reveal').count(),0,'Reduced motion: no reveal');
  await still.close();
  // Recently viewed: newest first, never the current product, hidden when empty or when storage is blocked.
  await page.evaluate(()=>localStorage.clear());
  // Empty cart with no history offers a few designs; quick add from there fills the cart in place.
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByTestId('cart-picks').waitFor();
  assert.equal(await page.getByTestId('cart-picks').getByTestId('product-card').count(),4);
  await page.getByTestId('cart-picks').getByTestId('quick-add').first().click();
  await page.getByTestId('cart-line').waitFor();
  assert.equal(await page.getByTestId('cart-picks').count(),0,'Picks go once the cart has a line');
  assert.equal(await page.evaluate(()=>document.activeElement?.dataset.quantity),'HC-LEAF','Focus lands on the new line');
  await page.evaluate(()=>localStorage.clear());
  await page.goto('http://127.0.0.1:4173/products/baymax-figure/');
  await page.waitForFunction(()=>localStorage.getItem('honeycomb-recent-v1')!==null);
  assert.equal(await page.getByTestId('recently-viewed').isHidden(),true,'Empty history stays hidden');
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await page.getByTestId('recently-viewed').waitFor();
  assert.deepEqual(await page.locator('[data-recent-list] .card-link').allTextContents(),['Baymax Figure']);
  await page.goto('http://127.0.0.1:4173/products/baymax-figure/');
  await page.getByTestId('recently-viewed').waitFor();
  assert.deepEqual(await page.locator('[data-recent-list] .card-link').allTextContents(),['Minato Kunai'],'Current product is excluded');
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByTestId('recently-viewed').waitFor();
  assert.deepEqual(await page.locator('[data-recent-list] .card-link').allTextContents(),['Baymax Figure','Minato Kunai'],'Cart shows newest first');
  await page.locator('[data-recent-list]').getByTestId('quick-add').first().waitFor();
  await page.getByTestId('recently-viewed-clear').click();
  await page.getByTestId('recently-viewed').waitFor({state:'hidden'});
  await page.reload();await page.getByRole('heading',{name:'Your cart is empty'}).waitFor();
  assert.equal(await page.getByTestId('recently-viewed').isHidden(),true,'Clear persists');
  const blocked=await browser.newPage();
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));
  await blocked.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await blocked.waitForFunction(()=>!document.querySelector('[data-testid="add-to-cart"]').disabled);
  assert.equal(await blocked.getByTestId('recently-viewed').isHidden(),true,'Blocked storage hides the row');
  await blocked.close();
  await page.goto('http://127.0.0.1:4173/shop/');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  const firstVisible=()=>page.locator('[data-product-card]:visible .card-link').first().textContent();
  await page.getByTestId('sort').selectOption('price-asc');
  assert.equal(await firstVisible(),'Bridgerton Bookmark','Cheapest first (LKR 300)');
  assert.match(page.url(),/sort=price-asc/);
  await page.getByTestId('sort').selectOption('price-desc');
  assert.equal(await firstVisible(),'Office Desk Organizer with Phone Holder','Most expensive first (LKR 2,000)');
  await page.getByTestId('filter-keychains').click();
  assert.deepEqual(await page.locator('[data-product-card]:visible .card-link').allTextContents(),['Night Fury Keychain','Light Fury Keychain','Grogu Baby Yoda Keychain','Hidden Leaf Keychain'],'Sort works with category chips; equal prices keep catalogue order');
  await page.getByTestId('sort').selectOption('name');
  assert.equal(await firstVisible(),'Grogu Baby Yoda Keychain');
  assert.equal(await page.locator('.product-grid > :last-child').getAttribute('data-testid'),'shop-custom-tile','Custom tile stays last after sorting');
  await page.getByTestId('sort').selectOption('featured');
  await page.getByTestId('filter-all').click();
  await page.getByTestId('filter-figures').click();
  // Search polish: "/" focuses search, matches are marked (escaped), the × clears it.
  await page.locator('body').click({position:{x:5,y:300}});
  await page.keyboard.press('/');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'search','"/" focuses search');
  assert.equal(await page.getByRole('searchbox').inputValue(),'','"/" is not typed into the box');
  await page.keyboard.type('fig');
  assert.deepEqual(await page.locator('[data-product-card]:visible .card-link mark').allTextContents(),['Fig','Fig','Fig'],'Matches marked in names (Baymax, Kurama, Horse)');
  await page.getByTestId('search-clear').click();
  assert.equal(await page.getByRole('searchbox').inputValue(),'');
  assert.equal(await page.getByTestId('search-clear').isHidden(),true);
  assert.equal(await page.locator('.card-link mark').count(),0,'Marks cleared');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'search','Focus stays in search');
  await page.getByRole('searchbox').fill('<b>');
  assert.equal(await page.locator('.card-link b').count(),0,'Search text is never parsed as HTML');
  assert.equal(await page.locator('#result-count').getAttribute('role'),'status','Result count is a polite live region');
  await page.getByRole('searchbox').fill('Baymax');
  assert.equal(await page.locator('[data-product-card]:visible').count(),1);
  await page.getByRole('heading',{name:'Baymax Figure'}).getByRole('link').click();
  await page.getByRole('button',{name:'Add to request cart'}).waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
  await screenshot('test-results/product-desktop.png');
  await page.getByRole('spinbutton').fill('2');
  if(ordering) {
    // One-tap order: same business number, just this design at the chosen quantity, nothing added to the cart.
    const orderNow=new URL(await page.locator('.order-now').getByRole('link',{name:'Order now on WhatsApp'}).getAttribute('href'));
    assert.equal(orderNow.origin+orderNow.pathname,'https://wa.me/'+builtStore.whatsappNumber);
    assert.match(orderNow.searchParams.get('text'),/^Hello HoneyComb 3D, I would like to request an order\.\n- Baymax Figure \[HC-BAYMAX\] x 2: /);
    assert.match(orderNow.searchParams.get('text'),/not a confirmed purchase/);
  } else assert.equal(await page.getByTestId('order-now').count(),0);
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
  if(ordering) {
    const url=new URL(await page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('href'));
    assert.equal(url.origin+url.pathname,'https://wa.me/'+builtStore.whatsappNumber,'Order requests go to the configured business number');
    assert.match(url.searchParams.get('text'),/Baymax Figure \[HC-BAYMAX\] x 2/);
    assert.match(await page.locator('#order-handoff').textContent(),/Opening WhatsApp does not send/);
  } else {
    assert.equal(await page.locator('a[href^="https://wa.me/"]').count(),0);
    assert(!await page.locator('#order-handoff').textContent().then(t=>t.includes('Opening WhatsApp')));
  }
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
  if(ordering)assert.equal(new URL(await page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('href')).pathname,'/'+builtStore.whatsappNumber);
  else assert(!await page.locator('#custom-result').textContent().then(t=>t.includes('Opening WhatsApp')));
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
  // PayPal for overseas payers: no option unless the store switch is on; when on, it only adds a request line.
  if(!builtStore.paypalOverseas)assert.equal(await page.getByTestId('cart-paypal').count(),0);
  assert.doesNotMatch(request,/PayPal/);
  await page.unroute('**/data/store.json');
  await page.route('**/data/store.json',async route=>{
    const response=await route.fetch();const data=await response.json();
    await route.fulfill({json:{...data,mode:'live',whatsappVerified:true,whatsappNumber:'94700000000',paypalOverseas:true}});
  });
  await page.reload();
  await page.getByLabel(/Paying from outside Sri Lanka/).check();
  const paypalHref=()=>page.getByRole('link',{name:'Open WhatsApp request'}).getAttribute('href').then(h=>new URL(h).searchParams.get('text'));
  assert.match(await paypalHref(),/PayPal payment link in USD once the total is confirmed/);
  // The choice survives a cart re-render (quantity change).
  await page.getByRole('button',{name:'Increase quantity of Baymax Figure'}).click();
  await page.waitForFunction(()=>document.querySelector('.message-preview').value.includes('Baymax Figure [HC-BAYMAX] x 3'));
  assert.equal(await page.getByLabel(/Paying from outside Sri Lanka/).isChecked(),true);
  assert.match(await paypalHref(),/PayPal payment link in USD/);
  await page.getByLabel(/Paying from outside Sri Lanka/).uncheck();
  assert.doesNotMatch(await paypalHref(),/PayPal/);
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
  // Phone gallery position: decorative dots plus "n / N", following the swipe.
  await page.setViewportSize({width:390,height:844});
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await page.getByTestId('gallery-position').waitFor();
  assert.equal(await page.getByTestId('gallery-position').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('[data-gallery-index]').textContent(),'1');
  await page.evaluate(()=>{const t=document.querySelector('[data-gallery-track]');t.scrollTo({left:t.clientWidth,behavior:'instant'});});
  await page.waitForFunction(()=>document.querySelector('[data-gallery-index]').textContent==='2');
  assert.equal(await page.locator('[data-gallery-dots] .is-current').count(),1);
  await page.setViewportSize({width:1280,height:900});
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  assert.equal(await page.getByTestId('gallery-position').isHidden(),true,'Desktop uses the thumbnails only');
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await page.getByRole('button',{name:'Show photo 3 of 4'}).click();
  await page.waitForFunction(()=>{const t=document.querySelector('[data-gallery-track]');return Math.round(t.scrollLeft/t.clientWidth)===2;});
  assert.equal(await page.getByRole('button',{name:'Show photo 3 of 4'}).getAttribute('aria-current'),'true');
  assert.equal(await page.locator('[data-gallery-thumb][aria-current]').count(),1,'Exactly one current thumbnail');
  if(ordering)assert.equal(await page.getByTestId('order-status').count(),0,'No "opens soon" note once ordering is open');
  else assert.match(await page.getByTestId('order-status').textContent(),/Online ordering opens soon\./);
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
  if(ordering) {
    // Live: the bar carries the one-tap order link, kept in step with the quantity field.
    const stickyOrder=page.getByTestId('sticky-buy').getByRole('link',{name:'Order now'});
    const text=new URL(await stickyOrder.getAttribute('href')).searchParams.get('text');
    assert.match(text,/Kurama Figure \[HC-KURAMA\] x 1/);
    await page.locator('#add-form input[name="quantity"]').fill('4');
    assert.match(new URL(await stickyOrder.getAttribute('href')).searchParams.get('text'),/Kurama Figure \[HC-KURAMA\] x 4/);
    await page.locator('#add-form input[name="quantity"]').fill('1');
  } else {
    await page.getByTestId('sticky-buy').getByRole('button',{name:'Add to request cart'}).click();
    await page.getByRole('status').filter({hasText:'Kurama Figure added to your request cart.'}).waitFor();
  }
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
  // Product facts link onward: the Naruto theme opens the shop already filtered.
  await page.goto('http://127.0.0.1:4173/products/minato-kunai/');
  await page.locator('.detail-facts').getByRole('link',{name:'Naruto'}).click();
  await page.waitForURL(/\/shop\/\?theme=Naruto/);
  await page.waitForFunction(()=>document.querySelectorAll('[data-product-card]:not([hidden])').length===4);
  assert.equal(await page.getByRole('radio',{name:/^Naruto/}).isChecked(),true,'Theme chip selected from the link');
  // "Ask about a variation" opens the custom enquiry with the design named (as a value, not markup).
  await page.goto('http://127.0.0.1:4173/products/horse-figurine/');
  await page.getByTestId('ask-variation').click();
  await page.waitForURL(/\/custom\/\?design=HNYCMB518/);
  await page.getByTestId('design-note').waitFor();
  assert.equal(await page.getByLabel('Your idea',{exact:false}).inputValue(),'A variation of Horse Figurine (HNYCMB518): ');
  assert.equal(await page.getByTestId('design-note').getByRole('link').getAttribute('href'),'/products/horse-figurine/');
  await page.goto('http://127.0.0.1:4173/custom/?design=%3Cimg%20src%3Dx%3E');
  await page.waitForFunction(()=>!document.querySelector('#custom-form button').disabled);
  assert.equal(await page.getByTestId('design-note').isHidden(),true,'Unknown design ids are ignored');
  assert.equal(await page.getByLabel('Your idea',{exact:false}).inputValue(),'');
  const missing=await page.goto('http://127.0.0.1:4173/not-found/');
  assert.equal(missing.status(),404);
  assert.equal(await page.getByTestId('notfound-picks').getByTestId('product-card').count(),4,'404 offers four designs');
  await page.getByTestId('notfound-search').fill('kunai');
  await page.getByTestId('notfound-search').press('Enter');
  await page.waitForURL(/\/shop\/\?q=kunai/);
  await page.waitForFunction(()=>document.querySelector('#result-count').textContent==='2 designs');
  assert.equal(await page.getByRole('searchbox').inputValue(),'kunai','Search carries over to the shop');
  await page.route('**/data/products.json',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByRole('heading',{name:'Your cart could not load'}).waitFor();
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: original image decoding, accessible cards/headings/preview landmark or live WhatsApp handoff ('+builtStore.mode+' build), catalogue filters, cart persistence/update/removal, owner-sourced pricing, custom enquiry, mixed-price WhatsApp fixture, 320/390/768/1440px layouts, keyboard skip link, 404, network failure and no page errors. No message was sent.');
} finally {if(browser)await browser.close();server.kill();}
