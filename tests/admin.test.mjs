import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {applyAdminChanges, nextId, slugify, passwordMatches, signSession, verifySession, adminView, safeText, sessionKey, touchesPrivate} from '../src/admin-core.mjs';
import {activePromos, promoActive, validateData} from '../src/domain.mjs';

const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
const store=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const NOW=Date.parse('2026-11-05T06:00:00Z');
const live=products.find(p=>p.approved);
// A pending listing without a photo, as the admin creates them.
const pending={id:'HNYCMB999',slug:'test-pending',name:'Test pending',category:'Figures',tags:[],description:'Pending.',priceLkr:null,availability:'unconfirmed',image:null,approved:false,source:'test'};
products.push(pending);

test('an edit changes only whitelisted fields, records an admin price, and keeps the input untouched',()=>{
  const r=applyAdminChanges(products,store,{edits:[{id:live.id,fields:{priceLkr:999,availability:'unavailable'}}]},NOW);
  const p=r.products.find(x=>x.id===live.id);
  assert.equal(p.priceLkr,999);assert.equal(p.availability,'unavailable');
  assert.deepEqual(p.priceSource,{provider:'admin',setAt:'2026-11-05'});
  assert.equal(p.priceRule,undefined);assert.equal(p.stallPriceLkr,undefined);
  assert.notEqual(products.find(x=>x.id===live.id).priceLkr,999,'Input not mutated');
  assert.match(r.summary,new RegExp('edit '+live.id));
  for(const key of ['image','slug','id','source','priceSource','imageVariants'])assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{[key]:'x'}}]},NOW),/Not editable/);
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:'NOPE',fields:{name:'x'}}]},NOW),/Unknown product/);
});
test('saving an unchanged price keeps its source and the stall-price rule',()=>{
  const r=applyAdminChanges(products,store,{edits:[{id:live.id,fields:{priceLkr:live.priceLkr,availability:'unavailable'}}]},NOW);
  const p=r.products.find(x=>x.id===live.id);
  assert.deepEqual(p.priceSource,live.priceSource);assert.deepEqual(p.priceRule,live.priceRule);
});
test('approval needs a photo and a confirmed stock state; hiding takes it off the shop',()=>{
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:pending.id,fields:{approved:true,availability:'made-to-order'}}]},NOW),/needs a photo/);
  const withPhoto=products.map(p=>p.id===pending.id?{...p,...Object.fromEntries(['image','imageAlt','imageWidth','imageHeight','imageVariants','gallery','shareImage'].map(k=>[k,live[k]]))}:p);
  assert.throws(()=>applyAdminChanges(withPhoto,store,{edits:[{id:pending.id,fields:{approved:true,availability:'unconfirmed'}}]},NOW),/choose In stock/);
  const ok=applyAdminChanges(withPhoto,store,{edits:[{id:pending.id,fields:{approved:true,availability:'made-to-order'}}]},NOW).products.find(x=>x.id===pending.id);
  assert.equal(ok.approved,true);assert.equal(ok.copyStatus,'owner-approved');assert.equal(ok.approvedAt,'2026-11-05');
  assert.equal(applyAdminChanges(products,store,{edits:[{id:live.id,fields:{approved:false}}]},NOW).products.find(x=>x.id===live.id).approved,false);
});
test('bad values are refused by the shared catalog validation',()=>{
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{priceLkr:-5}}]},NOW),/Price/);
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{name:'   '}}]},NOW),/name must be 1 to 80/);
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{availability:'lots'}}]},NOW),/Unknown stock/);
  assert.throws(()=>applyAdminChanges(products,store,{},NOW),/Nothing changed/);
});
test('partner cost is stored privately and removed with null',()=>{
  const r=applyAdminChanges(products,store,{edits:[{id:live.id,fields:{partner:{costLkr:'400'}}}]},NOW);
  assert.deepEqual(r.products.find(x=>x.id===live.id).partner,{costLkr:400});
  const off=applyAdminChanges(r.products,store,{edits:[{id:live.id,fields:{partner:null}}]},NOW);
  assert.equal(off.products.find(x=>x.id===live.id).partner,undefined);
  assert.throws(()=>validateData([{...live,partner:{costLkr:-1}}],store),/partner/);
  assert.throws(()=>validateData([{...live,partner:{costLkr:1,secret:1}}],store),/partner/);
});
test('a new listing gets the next HNYCMB number, a unique slug, and stays pending without a photo',()=>{
  const r=applyAdminChanges(products,store,{create:{name:'Mandalorian Helmet',category:'Figures',description:'A helmet.',priceLkr:2500,availability:'made-to-order',tags:['Star Wars']}},NOW);
  const p=r.products.at(-1);
  assert.equal(p.id,nextId(products));assert.match(p.id,/^HNYCMB\d+$/);
  assert.equal(p.slug,'mandalorian-helmet');assert.equal(p.approved,false);assert.equal(p.image,null);
  assert.deepEqual(p.priceSource,{provider:'admin',setAt:'2026-11-05'});
  assert.equal(applyAdminChanges(r.products,store,{create:{name:'Mandalorian Helmet',category:'Figures',description:'Again.'}},NOW).products.at(-1).slug,'mandalorian-helmet-2');
  assert.throws(()=>applyAdminChanges(products,store,{create:{name:'X',category:'Y',description:'Z',approved:true}},NOW),/Not allowed/);
  assert.equal(slugify('Shadow ninja — Dark Warrior!'),'shadow-ninja-dark-warrior');
});
test('promo codes: admin codes join the first code, notes are optional, and only active ones apply',()=>{
  const code={sha256:'a'.repeat(64),percent:10,from:'2026-11-04',until:'2026-11-06',note:'Test'};
  const r=applyAdminChanges(products,store,{promos:[code]},NOW);
  assert.deepEqual(r.store.promos,[code]);
  assert.equal(activePromos(r.store,NOW).length,1);assert(promoActive(r.store,NOW));
  assert.equal(activePromos(r.store,Date.parse('2026-11-08T06:00:00Z')).length,0);
  for(const bad of [{...code,percent:95},{...code,until:'2026-11-01'},{...code,sha256:'xyz'},...(store.promo?[{...code,sha256:store.promo.sha256}]:[])])
    assert.throws(()=>applyAdminChanges(products,store,{promos:[bad]},NOW),/promos/);
  assert.deepEqual(applyAdminChanges(products,store,{promos:[{...code,extra:1}]},NOW).store.promos,[code],'Unknown promo fields are dropped');
  assert.throws(()=>validateData(products,{...store,promos:[{...code,extra:1}]}),/promos/);
  assert.deepEqual(adminView(products,r.store).promos,[code]);
});
test('login: password comparison and signed, expiring sessions',()=>{
  assert(passwordMatches('honey comb','honey comb'));assert(!passwordMatches('honey','honey comb'));
  assert(!passwordMatches(undefined,'x'));assert(!passwordMatches('','') ,'An empty password is never accepted');
  const t=signSession('secret',NOW);
  assert(verifySession(t,'secret',NOW+3600e3));
  assert(!verifySession(t,'other',NOW),'Wrong secret');
  assert(!verifySession(t,'secret',NOW+13*3600e3),'Expired after 12 hours');
  assert(!verifySession(t.replace(/.$/,c=>c==='A'?'B':'A'),'secret',NOW),'Tampered');
  assert(!verifySession('9'.repeat(13)+'.'+'A'.repeat(43),'secret',NOW),'Forged');
  assert(!verifySession(t,'',NOW));
});
test('admin text: limits and anything the site checks would refuse; every current listing passes',()=>{
  for(const p of products){safeText('name',p.name);safeText('category',p.category);safeText('description',p.description);for(const t of p.tags)safeText('tag',t);}
  for(const bad of ['x'.repeat(81),'a\u202eb','line\nbreak','NaN deal','undefined','{{phone}}','COMICCON26 special','Call 070 300 9064'])
    assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{name:bad}}]},NOW),/name/);
  assert.equal(applyAdminChanges(products,store,{edits:[{id:live.id,fields:{description:'Two\nlines'}}]},NOW).products.find(x=>x.id===live.id).description,'Two\nlines');
  assert.throws(()=>applyAdminChanges(products,store,{edits:[{id:live.id,fields:{tags:['ok','x'.repeat(31)]}}]},NOW),/tag/);
  assert.throws(()=>applyAdminChanges(products,store,{promos:'x'},NOW),/promos must be a list/);
});
test('re-saving an approved listing keeps its first approval date',()=>{
  const p={...live,approvedAt:'2026-10-01'};
  assert.equal(applyAdminChanges(products.map(x=>x.id===live.id?p:x),store,{edits:[{id:live.id,fields:{approved:true,availability:'available'}}]},NOW).products.find(x=>x.id===live.id).approvedAt,'2026-10-01');
});
test('changing the password ends existing logins; private fields are detected',()=>{
  const t=signSession(sessionKey('s','password one'),NOW);
  assert(verifySession(t,sessionKey('s','password one'),NOW));assert(!verifySession(t,sessionKey('s','password two'),NOW));
  assert.equal(sessionKey('s',''),'');
  assert(touchesPrivate({edits:[{id:'x',fields:{partner:{costLkr:1}}}]}));assert(touchesPrivate({create:{partner:{costLkr:null}}}));assert(touchesPrivate({promos:[{note:'n'}]}));
  assert(!touchesPrivate({edits:[{id:'x',fields:{partner:null,name:'a'}}],promos:[{sha256:'a'}]}));
});
