import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {loadStore} from '../scripts/store.mjs';
import {validateData,orderingOpen,delivery,paymentMethods,paymentNote,socialLinks,trustPages,searchIndexing} from '../src/domain.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));

test('without STORE_PATCH the build reads data/store.json unchanged',async()=>{
  assert.deepEqual(await loadStore(root,''),data);
  assert.deepEqual(await loadStore(root,undefined),data);
});

test('the committed store keeps every owner-fact switch off',()=>{
  assert.equal(delivery(data),null);
  assert.deepEqual(paymentMethods(data),[]);
  assert.equal(paymentNote(data),null);
  assert.deepEqual(socialLinks(data),[]);
  assert.deepEqual(trustPages(data),[]);
  assert.equal(searchIndexing(data),false);
});

test('fixtures merge over the store, validate, and switch exactly what they name',async()=>{
  const preview=await loadStore(root,'tests/fixtures/store-preview.json');
  assert.deepEqual(preview,{...data,mode:'preview'});
  assert.equal(orderingOpen(preview),false);
  for(const name of ['store-preview','store-all-on','store-indexing','store-session-c-proposal']) {
    const patch=JSON.parse(await readFile(new URL('fixtures/'+name+'.json',import.meta.url),'utf8'));
    const merged=await loadStore(root,'tests/fixtures/'+name+'.json');
    for(const key of Object.keys(data))if(!(key in patch))assert.deepEqual(merged[key],data[key],name+' leaves '+key+' alone');
  }
  const on=await loadStore(root,'tests/fixtures/store-all-on.json');
  validateData(products,on);
  assert.equal(delivery(on).feeLkr,450.5);
  assert.equal(paymentMethods(on).length,2);
  assert.equal(socialLinks(on).length,1);
  assert.deepEqual(trustPages(on).map(t=>t.slug),['shipping','returns','about']);
  for(const t of trustPages(on))assert.match(t.text,/Test fixture/,'Fixture text can never pass for an owner fact');
  assert.match(delivery(on).text,/Test fixture/);
  const indexing=await loadStore(root,'tests/fixtures/store-indexing.json');
  validateData(products,indexing);
  assert.equal(searchIndexing(indexing),true);
  await assert.rejects(loadStore(root,'tests/fixtures/missing.json'));
});

test('session C\'s proposed delivery and payment values (PM, 2026-10-19) validate and render as intended',async()=>{
  const proposal=await loadStore(root,'tests/fixtures/store-session-c-proposal.json');
  validateData(products,proposal);
  assert.deepEqual(delivery(proposal),{text:'Islandwide delivery by courier, LKR 400. Usually 2–4 working days after your order is printed.',feeLkr:400});
  assert.deepEqual(paymentMethods(proposal),['LankaQR','Bank transfer','Cash on delivery']);
  assert.match(paymentNote(proposal),/^Pay by LankaQR, bank transfer or cash on delivery\./);
});

test('STORE_PATCH accepts only test fixtures and never runs in a Vercel build',async()=>{
  for(const path of ['data/store.json','../store.json','/etc/hosts','tests/fixtures/../../data/store.json','tests/fixtures-evil/x.json'])await assert.rejects(loadStore(root,path),/tests\/fixtures/,path);
  process.env.VERCEL='1';
  try{await assert.rejects(loadStore(root,'tests/fixtures/store-preview.json'),/Vercel/);assert.deepEqual(await loadStore(root,''),data,'A normal Vercel build is unaffected');}
  finally{delete process.env.VERCEL;}
});

