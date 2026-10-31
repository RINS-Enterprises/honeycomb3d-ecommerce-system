// The admin page in a real browser, with /api/admin/* answered by Playwright (no secrets, no network).
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {applyAdminChanges,adminView} from '../src/admin-core.mjs';

let products=JSON.parse(await readFile('data/products.json','utf8'));
let store=JSON.parse(await readFile('data/store.json','utf8'));
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'inherit'});
let browser;
try {
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:4173/admin/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  const html=await (await fetch('http://127.0.0.1:4173/admin/')).text();
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/,'Admin page is never indexed');
  for(const page of ['','shop/','cart/'])assert(!(await (await fetch('http://127.0.0.1:4173/'+page)).text()).includes('/admin'),'The shop never links to the admin');
  browser=await chromium.launch();await mkdir('test-results',{recursive:true});
  const page=await browser.newPage({viewport:{width:390,height:900}});
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  let loggedIn=false,head='h1',saves=[];
  await page.route('**/api/admin/**',async route=>{
    const url=new URL(route.request().url()),name=url.pathname.replace('/api/admin/','').replace(/\/$/,''),body=route.request().postDataJSON?.();
    const json=(v,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(v)});
    if(name==='login')return body.password==='right'?(loggedIn=true,json({ok:true})):json({error:'Wrong password'},401);
    if(name==='logout'){loggedIn=false;return json({ok:true});}
    if(!loggedIn)return json({error:'Please log in'},401);
    if(name==='data')return json({head,...adminView(products,store)});
    if(name==='image')return route.fulfill({status:200,contentType:'image/webp',body:await readFile('public'+url.searchParams.get('src'))});
    if(name==='status')return json({state:'READY'});
    if(name==='save'){
      saves.push(body);if(body.head!==head)return json({error:'stale'},409);
      try{const r=applyAdminChanges(products,store,body);products=r.products;store=r.store;head='h'+(saves.length+1);return json({head,deployment:'dpl_TESTDEPLOYMENT1',summary:r.summary});}
      catch(e){return json({error:e.message},400);}
    }
    return json({},404);
  });
  await page.clock.install();
  await page.goto('http://127.0.0.1:4173/admin/');
  await page.getByTestId('admin-login').waitFor();
  await page.fill('input[name=password]','wrong');await page.click('text=Log in');
  await page.getByText('Wrong password').waitFor();
  await page.fill('input[name=password]','right');await page.click('text=Log in');
  const pendingCount=products.filter(p=>!p.approved).length;
  await page.getByRole('button',{name:'Pending ('+pendingCount+')'}).waitFor();
  // A pending item without a photo cannot be approved.
  const pendingNoPhoto=products.find(p=>!p.approved&&!p.image);
  if(pendingNoPhoto){const c=page.locator('form[data-id="'+pendingNoPhoto.id+'"]');assert(await c.getByTestId('admin-approve').isDisabled());await c.getByText('Add photos to the Drive folder').waitFor();}
  await page.screenshot({path:'test-results/admin-390.png',fullPage:true});
  // Live tab: mark an item sold out and as a partner item with a cost price.
  const live=products.find(p=>p.approved);
  await page.getByRole('button',{name:/^On the shop/}).click();
  const c=page.locator('form[data-id="'+live.id+'"]');
  await c.locator('select[name=availability]').selectOption('unavailable');
  await c.locator('input[name=isPartner]').check();await c.locator('input[name=costLkr]').fill('300');
  await c.getByRole('button',{name:'Save'}).click();
  await page.getByTestId('admin-status').filter({hasText:'Publishing'}).waitFor({timeout:5000}).catch(async()=>{throw new Error('Status: '+await page.getByTestId('admin-status').textContent()+' saves '+JSON.stringify(saves).slice(0,300));});await page.clock.runFor(6000);
  await page.getByText('Live ✓ on honeycomb3d.store').waitFor();
  assert.deepEqual(saves.at(-1).edits[0].fields.partner,{costLkr:300});
  assert.equal(products.find(p=>p.id===live.id).availability,'unavailable');
  await page.locator('form[data-id="'+live.id+'"]').getByTestId('admin-profit').filter({hasText:'partner share'}).waitFor();
  // New listing, then a promo code (only its hash is sent).
  await page.getByRole('button',{name:'New listing'}).click();
  const n=page.getByTestId('admin-new');
  await n.locator('input[name=name]').fill('Halo Master Chief');await n.locator('input[name=category]').fill('Figures');
  await n.locator('textarea[name=description]').fill('A Master Chief figure.');await n.locator('input[name=priceLkr]').fill('2500');
  await n.getByRole('button',{name:'Save as pending'}).click();
  await page.getByTestId('admin-status').filter({hasText:'Publishing'}).waitFor({timeout:5000}).catch(async()=>{throw new Error('Status: '+await page.getByTestId('admin-status').textContent()+' saves '+JSON.stringify(saves).slice(0,300));});await page.clock.runFor(6000);await page.getByText('Live ✓').waitFor();
  assert.equal(products.at(-1).name,'Halo Master Chief');assert.equal(products.at(-1).approved,false);
  await page.getByRole('button',{name:'Promo codes'}).click();
  const f=page.getByTestId('admin-promo-form');
  await f.locator('input[name=code]').fill('newyear27');await f.locator('input[name=percent]').fill('10');await f.locator('input[name=note]').fill('New year');
  await f.getByRole('button',{name:/Create code/}).click();
  await page.getByTestId('admin-status').filter({hasText:'Publishing'}).waitFor({timeout:5000}).catch(async()=>{throw new Error('Status: '+await page.getByTestId('admin-status').textContent()+' saves '+JSON.stringify(saves).slice(0,300));});await page.clock.runFor(6000);await page.getByText(/Code NEWYEAR27 created/).waitFor();
  const sent=JSON.stringify(saves.at(-1));
  assert(!/newyear27/i.test(sent),'The plain code never leaves the browser');
  assert.equal(saves.at(-1).promos.at(-1).sha256.length,64);
  await page.getByTestId('admin-promos').getByText('New year · 10% off').waitFor();
  // A stale page is told to reload.
  head='moved';await page.getByRole('button',{name:'New listing'}).click();
  await n.locator('input[name=name]').fill('X');await n.locator('input[name=category]').fill('Y');await n.locator('textarea[name=description]').fill('Z');
  await n.getByRole('button',{name:'Save as pending'}).click();await page.getByTestId('admin-status').filter({hasText:'stale'}).waitFor();
  await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:/^On the shop/}).click();
  await page.screenshot({path:'test-results/admin-1440.png'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);assert(!overflow,'No sideways scroll');
  assert.deepEqual(errors,[]);
  console.log('Admin page: login, pending, sold out, partner cost, new listing, promo code (hash only) and stale-page checks passed.');
} finally {await browser?.close();server.kill();}
