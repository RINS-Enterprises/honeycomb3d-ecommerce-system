import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {loadStore} from '../scripts/store.mjs';
import {validateData,orderingOpen,delivery,paymentMethods,socialLinks,trustPages,searchIndexing} from '../src/domain.mjs';

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
  assert.deepEqual(socialLinks(data),[]);
  assert.deepEqual(trustPages(data),[]);
  assert.equal(searchIndexing(data),false);
});

test('fixtures merge over the store, validate, and switch exactly what they name',async()=>{
  const preview=await loadStore(root,'tests/fixtures/store-preview.json');
  assert.deepEqual(preview,{...data,mode:'preview'});
  assert.equal(orderingOpen(preview),false);
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
