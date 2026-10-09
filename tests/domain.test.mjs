import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCart,cartSummary,orderMessage,whatsappUrl,readCart,filterProducts,validateData,visibleProducts,escapeHtml} from '../src/domain.mjs';
const p=(id,priceLkr=null,availability='unconfirmed')=>({id,slug:id.toLowerCase(),name:id,category:'Figures',tags:['Anime'],description:'Example',source:'Test fixture',priceLkr,availability,image:null,imageAlt:null,approved:false});
const products=[p('A',10.25),p('B'),p('C',10,'unavailable')];
const preview={mode:'preview',whatsappVerified:false,whatsappNumber:null};
test('restored cart rejects tampering, unavailable and unknown IDs and clamps duplicates',()=>{
  assert.deepEqual(normalizeCart([{id:'A',quantity:19},{id:'A',quantity:8},{id:'B',quantity:-1},{id:'C',quantity:1},{id:'D',quantity:1},{id:'B',quantity:1.5},null],products),[{id:'A',quantity:20}]);
});
test('money is computed in cents and unknown prices remain explicit',()=>{
  const items=[{id:'A',quantity:3},{id:'B',quantity:2}];
  const summary=cartSummary(items,products);
  assert.equal(summary.knownSubtotal,30.75);assert.equal(summary.count,5);assert.equal(summary.unpriced,true);
  assert.match(orderMessage(items,products),/not the full total/);
  assert.match(orderMessage(items,products),/not a confirmed purchase/);
  assert(!/0\.00/.test(orderMessage([{id:'B',quantity:1}],products)));
});
test('bad storage and invalid JSON are recoverable',()=>{
  assert.equal(readCart({getItem(){throw Error();}},products).error,true);
  assert.equal(readCart({getItem(){return '{bad';}},products).error,true);
  assert.deepEqual(readCart({getItem(){return '{}';}},products).items,[]);
});
test('WhatsApp gate rejects missing contacts; message round trips Unicode and symbols',()=>{
  assert.equal(whatsappUrl('Hello',preview),null);
  assert.equal(whatsappUrl('Hello',{whatsappVerified:true,whatsappNumber:'+94 70'}),null);
  const message='Hello & colours #1\nසිංහල';
  const url=new URL(whatsappUrl(message,{mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'}));
  assert.equal(url.origin,'https://wa.me');assert.equal(url.searchParams.get('text'),message);
});
test('all search words and category must match',()=>{
  assert.equal(filterProducts([{...products[0],name:'Dragon'},products[1]],'dragon anime','Figures').length,1);
  assert.equal(filterProducts(products,'missing').length,0);
  assert.equal(filterProducts(products,'','Dragons').length,0);
});
test('live build requires verified contact, approvals, original photos and availability',()=>{
  assert.throws(()=>validateData(products,{mode:'live',whatsappVerified:false}));
  assert.throws(()=>validateData([{...products[0],approved:true}],{mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'}));
  assert.deepEqual(visibleProducts(products,{mode:'live'}),[]);
  assert.throws(()=>validateData([...products,products[0]],preview));
  assert.throws(()=>validateData([{...products[0],image:'/assets/../secret.png'}],preview));
});
test('escaping prevents catalogue text from becoming markup',()=>{
  assert.equal(escapeHtml('<img onerror="x">&'), '&lt;img onerror=&quot;x&quot;&gt;&amp;');
});
