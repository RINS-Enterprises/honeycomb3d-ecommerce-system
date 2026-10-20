import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {filterProducts,visibleProducts} from '../src/domain.mjs';
const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
test('the keychain category lists the three recovered keychains and Grogu',()=>{
  const shown=visibleProducts(products,{mode:'preview'});
  assert.equal(filterProducts(shown,'','Keychains').length,4);
  assert.equal(filterProducts(shown,'dragons','Keychains').length,2);
});
test('draft descriptions are explicitly attributed and remain unapproved',()=>{
  for(const p of products)if(p.copyStatus==='draft-needs-owner-approval')assert.equal(p.approved,false);
});

test('owner prices preserve storefront IDs and provenance; photographed designs are owner-approved as made to order',()=>{
  const prices={'HC-LEAF':400,'HC-BAYMAX':1000,'HC-KURAMA':1500,'HNYCMB501':500,'HC-MINATO':1000,'HC-LIGHTFURY':500,'HC-KUNAI':1000,
    HNYCMB505:300,HNYCMB506:500,HNYCMB507:2000,HNYCMB510:600,HNYCMB512:1750,HNYCMB513:500,HNYCMB514:500,HNYCMB515:500,HNYCMB516:1500,HNYCMB517:1500,HNYCMB518:1600};
  assert.deepEqual(Object.fromEntries(products.map(p=>[p.id,p.priceLkr])),prices);
  for(const p of products) {
    assert.equal(p.priceSource.provider,'Airtable');
    assert.equal(p.priceSource.tableId,'tblmUOdfunwP8iWKi');
    assert.equal(p.priceSource.field,'Selling Price (LKR)');
    assert.equal(p.priceSource.readAt,p.id.startsWith('HNYCMB5')&&p.id!=='HNYCMB501'?'2026-10-16':'2026-10-11');
    assert.match(p.priceSource.recordId,/^rec/);
    // Owner, 2026-10-18: "approve all 17 designs as Made to order". Only photographed designs are approved.
    if(p.image){assert.equal(p.approved,true);assert.equal(p.availability,'made-to-order');assert.equal(p.copyStatus,'owner-approved');}
    else {assert.equal(p.approved,false);assert.equal(p.availability,'unconfirmed');assert.equal(p.copyStatus,'draft-needs-owner-approval');}
    for(const key of ['compareAtPrice','compareAtLkr','stock','stockCount','stockQuantity'])assert.equal(p[key],undefined);
  }
});
test('every product with a photo has responsive square frames with real dimensions',()=>{
  for(const p of products) {
    if(p.image===null)continue;
    {
      assert.match(p.image,/^\/assets\/.+-sq-640\.webp$/);
      assert.match(p.shareImage.src,/^\/assets\/.+-share\.jpg$/);
      const widths=p.imageVariants.map(v=>v.width);
      assert([320,480,640].every(w=>widths.includes(w)),'Core responsive widths remain available');
      assert(p.imageVariants.every(v=>v.width===v.height),'Storefront frames are square');
      assert(widths.every((w,i)=>w>0&&(!i||w>widths[i-1])),'Candidate widths are positive and ascending');
      assert(p.imageWidth>0&&p.imageHeight>0&&p.imageAlt);
    }
  }
  assert.match(products.find(p=>p.id==='HC-MINATO').imageAlt,/tan engraved handle/);
  assert(!products.find(p=>p.id==='HC-MINATO').imageAlt.includes('white handle'));
});
test('Kurama and Classic Kunai return with their imported photos and unchanged data',()=>{
  const shown=visibleProducts(products,{mode:'preview'}).map(p=>p.id);
  assert(shown.includes('HC-KURAMA')&&shown.includes('HC-KUNAI'));
  assert.equal(shown.length,17,'Every product with a photo is shown; Stormtrooper (no photo) stays hidden');
  assert(!shown.includes('HNYCMB513'));
  for(const id of ['HC-KURAMA','HC-KUNAI']) {
    const p=products.find(x=>x.id===id);
    assert.equal(p.availability,'made-to-order');assert.equal(p.approved,true);
    assert(p.imageAlt.length>20);
  }
});

test('the 11 Airtable products added 2026-10-16 keep their Airtable identity; only Stormtrooper lacks a photo',()=>{
  const added=products.filter(p=>p.priceSource.readAt==='2026-10-16');
  assert.equal(added.length,11);
  const categoryMap={Keytag:'Keychains',Figurine:'Figures',Weapon:'Props',Bookmark:'Bookmarks','Desk Organizer':'Desk Organizers'};
  for(const p of added) {
    assert.match(p.id,/^HNYCMB5\d\d$/,'ID is the Airtable SKU');
    assert(p.sourceName&&p.sourceCategory,'Airtable name and category recorded: '+p.id);
    assert.equal(p.category,categoryMap[p.sourceCategory],'Category mapping: '+p.id);
    assert.match(p.priceSource.recordId,/^rec[A-Za-z0-9]{14}$/);
    if(p.id==='HNYCMB513'){assert.equal(p.approved,false);assert.equal(p.availability,'unconfirmed');}
    else {assert.equal(p.approved,true);assert.equal(p.availability,'made-to-order');}
    if(p.id==='HNYCMB513')assert.equal(p.image,null,'No verifiable real photo for Stormtrooper');
    else {assert.equal(p.imageApprovedAt,'2026-10-16');assert(p.imageAlt.length>20);}
    assert.match(p.description,/Confirm the size/);
    assert(!/\b(?:PLA|resin|cm|mm|durable|in stock|delivery|ships?|quality)\b/i.test(p.description),'No material, size, stock or delivery claims: '+p.id);
  }
  assert.equal(products.find(p=>p.id==='HNYCMB515').sourceName,'Gorgu Baby Yoda keychain','Airtable spelling kept verbatim');
  assert.equal(products.find(p=>p.id==='HNYCMB515').name,'Grogu Baby Yoda Keychain');
  assert.deepEqual([...new Set(products.map(p=>p.category))].sort(),['Bookmarks','Desk Organizers','Figures','Keychains','Props']);
  const shown=visibleProducts(products,{mode:'preview'});
  assert.deepEqual(added.filter(p=>!shown.includes(p)).map(p=>p.id),['HNYCMB513'],'Only the photo-less product is hidden');
  assert.deepEqual([...new Set(shown.map(p=>p.category))].sort(),['Bookmarks','Desk Organizers','Figures','Keychains','Props'],'Five visible categories');
});

test('live mode shows every photographed design, and only those (an empty shop must never ship)',()=>{
  const live=visibleProducts(products,{mode:'live'});
  assert.equal(live.length,17);
  assert.deepEqual(live.map(p=>p.id),visibleProducts(products,{mode:'preview'}).map(p=>p.id));
  assert(!live.some(p=>p.id==='HNYCMB513'));
});
