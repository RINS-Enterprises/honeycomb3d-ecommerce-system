import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {filterProducts} from '../src/domain.mjs';
const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
test('all three recovered keychains appear under the keychain category',()=>{
  assert.equal(filterProducts(products,'','Keychains').length,3);
  assert.equal(filterProducts(products,'dragons','Keychains').length,2);
});
test('draft descriptions are explicitly attributed and remain unapproved',()=>{
  for(const p of products)if(p.copyStatus==='draft-needs-owner-approval')assert.equal(p.approved,false);
});

test('owner prices preserve storefront IDs, provenance and unconfirmed approval',()=>{
  const prices={'HC-LEAF':400,'HC-BAYMAX':1000,'HC-KURAMA':1500,'HNYCMB501':500,'HC-MINATO':1000,'HC-LIGHTFURY':500,'HC-KUNAI':1000};
  assert.deepEqual(Object.fromEntries(products.map(p=>[p.id,p.priceLkr])),prices);
  for(const p of products) {
    assert.equal(p.priceSource.provider,'Airtable');
    assert.equal(p.priceSource.tableId,'tblmUOdfunwP8iWKi');
    assert.equal(p.priceSource.field,'Selling Price (LKR)');
    assert.equal(p.priceSource.readAt,'2026-10-11');
    assert.match(p.priceSource.recordId,/^rec/);
    assert.equal(p.approved,false);
    assert.equal(p.availability,'unconfirmed');
    for(const key of ['compareAtPrice','compareAtLkr','stock','stockCount','stockQuantity'])assert.equal(p[key],undefined);
  }
});
test('pending owner copies use placeholders; approved photos are responsive with real dimensions',()=>{
  for(const p of products) {
    if(['HC-KURAMA','HC-KUNAI'].includes(p.id)) {
      assert.equal(p.image,null);assert.deepEqual(p.imageVariants,[]);
    } else {
      assert.match(p.image,/^\/assets\/.+-960\.webp$/);
      assert.deepEqual(p.imageVariants.map(v=>v.width),[480,960,1440]);
      assert(p.imageWidth>0&&p.imageHeight>0&&p.imageAlt);
    }
  }
  assert.match(products.find(p=>p.id==='HC-MINATO').imageAlt,/tan engraved handle/);
  assert(!products.find(p=>p.id==='HC-MINATO').imageAlt.includes('white handle'));
});
