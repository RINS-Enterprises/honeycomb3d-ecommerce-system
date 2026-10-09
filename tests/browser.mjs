import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
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
  await page.goto('http://127.0.0.1:4173/');
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
  await page.getByRole('link',{name:'Explore the collection'}).first().click();
  await page.getByRole('searchbox').fill('no-match-here');
  await page.waitForFunction(()=>document.querySelector('#no-results').hidden===false);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByLabel('Category',{exact:true}).selectOption('Figures');
  assert.equal(await page.locator('[data-product-card]:visible').count(),2);
  await page.getByRole('searchbox').fill('Baymax');
  assert.equal(await page.locator('[data-product-card]:visible').count(),1);
  await page.getByRole('heading',{name:'Baymax Figure'}).getByRole('link').click();
  await page.getByRole('button',{name:'Add to request cart'}).waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#add-form button').disabled);
  await page.getByRole('spinbutton').fill('2');
  await page.getByRole('button',{name:'Add to request cart'}).click();
  await page.getByRole('link',{name:'View your request cart'}).click();
  await page.getByRole('heading',{name:'Quote required for all items'}).waitFor();
  assert.equal(await page.getByRole('spinbutton').inputValue(),'2');
  assert.equal(await page.locator('a[href^="https://wa.me/"]').count(),0);
  assert.match(await page.locator('.message-preview').inputValue(),/Baymax Figure \[HC-BAYMAX\] x 2/);
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
  await page.unroute('**/data/store.json');
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/','/shop/','/products/baymax-figure/','/cart/','/custom/']) {
    await page.goto('http://127.0.0.1:4173'+path);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow: '+path);
  }
  await page.goto('http://127.0.0.1:4173/');
  await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');
  await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
  const missing=await page.goto('http://127.0.0.1:4173/not-found/');
  assert.equal(missing.status(),404);
  await page.route('**/data/products.json',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto('http://127.0.0.1:4173/cart/');
  await page.getByRole('heading',{name:'Your cart could not load'}).waitFor();
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('PASS: desktop/mobile catalogue, filters, cart persistence/update/removal, unknown pricing, custom enquiry, verified handoff fixture, keyboard skip link, 404, network failure and no page errors.');
} finally {if(browser)await browser.close();server.kill();}
