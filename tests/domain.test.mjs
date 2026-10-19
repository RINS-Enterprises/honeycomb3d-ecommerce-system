import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCart,cartSummary,orderMessage,whatsappUrl,readCart,filterProducts,validateData,visibleProducts,escapeHtml,searchIndexing,paypalOverseas} from '../src/domain.mjs';
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

test('decimal prices accept normal currency and reject sub-cent values',()=>{
  validateData([p('A',19.99)],preview);
  assert.throws(()=>validateData([p('A',19.999)],preview));
});
test('live-visible catalogue strips unapproved items from every cart operation',()=>{
  const visible=visibleProducts(products,{mode:'live'});
  assert.deepEqual(normalizeCart([{id:'A',quantity:1}],visible),[]);
  assert.equal(cartSummary([{id:'A',quantity:1}],visible).count,0);
  assert.equal(orderMessage([{id:'A',quantity:1}],visible),'');
});
test('products without an approved photo are hidden in preview and live',()=>{
  const withPhoto={...p('P',100),image:'/assets/x-sq-640.webp',imageAlt:'Photo'};
  assert.deepEqual(visibleProducts([...products,withPhoto],preview),[withPhoto]);
  assert.deepEqual(visibleProducts([...products,{...withPhoto,approved:true}],{mode:'live'}).map(x=>x.id),['P']);
  assert.deepEqual(visibleProducts([withPhoto],{mode:'live'}),[]);
});
test('LKR amounts use one format: whole rupees without decimals, otherwise two decimals',async()=>{
  const {money}=await import('../src/domain.mjs');
  assert.match(money(4500),/^LKR\s4,500$/);
  assert.match(money(19.99),/^LKR\s19\.99$/);
  assert.match(money(39.98),/^LKR\s39\.98$/);
});
test('search indexing is a separate setting: off unless explicitly true, in preview and live alike',()=>{
  const live={mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'};
  for(const store of [preview,live,{...live,searchIndexing:false}])assert.equal(searchIndexing(store),false);
  assert.equal(searchIndexing({...live,searchIndexing:true}),true);
  for(const value of ['true',1,null])assert.throws(()=>validateData(products,{...preview,searchIndexing:value}),/searchIndexing/);
  validateData(products,{...preview,searchIndexing:true});
});
test('PayPal for overseas payers is off unless explicitly true and only adds a request line',()=>{
  for(const store of [preview,{...preview,paypalOverseas:false}])assert.equal(paypalOverseas(store),false);
  assert.equal(paypalOverseas({...preview,paypalOverseas:true}),true);
  for(const value of ['true',1,null])assert.throws(()=>validateData(products,{...preview,paypalOverseas:value}),/paypalOverseas/);
  const items=[{id:'A',quantity:1}];
  assert.doesNotMatch(orderMessage(items,products),/PayPal/);
  const message=orderMessage(items,products,'Blue please',{paypal:true});
  assert.match(message,/PayPal payment link in USD once the total is confirmed/);
  assert.match(message,/not a confirmed purchase/);
  assert.equal(orderMessage([],products,'',{paypal:true}),'');
});
