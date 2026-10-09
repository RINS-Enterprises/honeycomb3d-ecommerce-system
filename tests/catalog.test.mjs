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
