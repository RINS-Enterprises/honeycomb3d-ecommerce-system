import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCart,cartSummary,orderMessage,whatsappUrl,readCart,filterProducts,validateData,visibleProducts,escapeHtml,searchIndexing,paypalOverseas,orderingOpen,orderNowUrl,cartSuggestions,delivery,money,paymentMethods,paymentNote,socialLinks,trustPages} from '../src/domain.mjs';
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
  validateData(products,{...preview,searchIndexing:true,siteUrl:'https://honeycomb3d.store'});
  for(const siteUrl of [undefined,'','http://honeycomb3d.store','https://honeycomb3d.store/shop','honeycomb3d.store'])assert.throws(()=>validateData(products,{...preview,searchIndexing:true,siteUrl}),/siteUrl/,'Indexing needs the https site address for the sitemap: '+siteUrl);
  assert.doesNotThrow(()=>validateData(products,{...preview,searchIndexing:false}),'Without indexing no siteUrl is needed');
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

test('one-tap order links only open in live mode with a verified number and never for unavailable designs',()=>{
  const p={id:'A',name:'Alpha',priceLkr:500,availability:'made-to-order'};
  const live={mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'};
  assert.equal(orderingOpen(live),true);
  for(const s of [{...live,mode:'preview'},{...live,whatsappVerified:false},{...live,whatsappVerified:'true'}])assert.equal(orderingOpen(s),false);
  const url=new URL(orderNowUrl(p,live));
  assert.equal(url.searchParams.get('text'),orderMessage([{id:'A',quantity:1}],[p]));
  assert.match(new URL(orderNowUrl(p,live,3)).searchParams.get('text'),/Alpha \[A\] x 3/);
  assert.equal(orderNowUrl(p,{...live,mode:'preview'}),null);
  assert.equal(orderNowUrl({...p,availability:'unavailable'},live),null);
});

test('cart suggestions share the cart\'s themes, skip the cart and unavailable designs, and never invent anything',()=>{
  const d=(id,category,tags,availability='made-to-order',priceLkr=100)=>({id,category,tags,availability,priceLkr,name:id});
  const catalogue=[d('LEAF','Keychains',['Naruto','Anime']),d('KEY2','Keychains',['Naruto','Anime']),d('KUNAI','Props',['Naruto','Anime']),d('GONE','Props',['Naruto'],'unavailable'),
    d('MOVIE','Figures',['Movies']),d('ANIME','Figures',['Anime'],'made-to-order',null),d('NONE','Props',[])];
  const ids=items=>cartSuggestions(items,catalogue).map(p=>p.id);
  assert.deepEqual(ids([{id:'LEAF',quantity:1}]),['KUNAI','KEY2','ANIME'],'Most shared themes first, another category before the same one, limit 3');
  assert.deepEqual(ids([{id:'LEAF',quantity:1},{id:'KUNAI',quantity:1}]),['KEY2','ANIME'],'Nothing already in the cart; unavailable never');
  assert.deepEqual(ids([{id:'MOVIE',quantity:1}]),[],'No shared theme, no suggestion');
  assert.deepEqual(ids([{id:'NONE',quantity:1}]),[]);
  assert.deepEqual(ids([]),[]);
  assert.deepEqual(ids([{id:'GONE',quantity:1}]),[],'An unavailable item never makes it into the cart');
  assert.deepEqual(cartSuggestions([{id:'LEAF',quantity:1}],catalogue,1).map(p=>p.id),['KUNAI']);
  assert.equal(cartSuggestions([{id:'LEAF',quantity:1}],catalogue).find(p=>p.id==='ANIME').priceLkr,null,'Prices are the catalogue\'s own, even when unknown');
});

test('delivery is off unless the owner gives a line; a fee becomes its own message line',()=>{
  for(const value of [undefined,null])assert.equal(delivery({delivery:value}),null);
  assert.equal(delivery({delivery:{text:'   '}}),null);
  assert.deepEqual(delivery({delivery:{text:' Islandwide by courier '}}),{text:'Islandwide by courier',feeLkr:null});
  assert.deepEqual(delivery({delivery:{text:'Courier',feeLkr:500}}),{text:'Courier',feeLkr:500});
  for(const value of [null,{text:'Courier'},{text:'Courier',feeLkr:null},{text:'Courier',feeLkr:450.5}])assert.doesNotThrow(()=>validateData(products,{...preview,delivery:value}));
  for(const value of [{},{text:''},{text:'x'.repeat(201)},'Courier',['Courier'],{text:'Courier',feeLkr:0},{text:'Courier',feeLkr:-5},{text:'Courier',feeLkr:'500'},{text:'Courier',feeLkr:1.005},{text:'Courier',fee:500}])assert.throws(()=>validateData(products,{...preview,delivery:value}),/delivery/,JSON.stringify(value));
  const items=[{id:'A',quantity:2}];
  const base=orderMessage(items,products);
  assert.equal(orderMessage(items,products,'',{deliveryFeeLkr:null}),base,'No fee: the message is unchanged');
  const lines=orderMessage(items,products,'',{deliveryFeeLkr:500}).split('\n');
  assert.deepEqual(lines,[...base.split('\n').slice(0,3),'Delivery fee: '+money(500),base.split('\n')[3].replace('delivery cost, ','')],'The fee is one extra line after the subtotal; the request no longer asks to confirm a delivery cost it states');
  assert.doesNotThrow(()=>validateData(products,{...preview,delivery:{text:'  '+'x'.repeat(200)+'  '}}),'The length limit counts the trimmed text');
  const live={mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'};
  const a={id:'A',name:'Alpha',priceLkr:500,availability:'made-to-order'};
  assert.doesNotMatch(new URL(orderNowUrl(a,live)).searchParams.get('text'),/Delivery fee/);
  assert.match(new URL(orderNowUrl(a,{...live,delivery:{text:'Courier',feeLkr:500}})).searchParams.get('text'),/\nDelivery fee: LKR\s500\n/);
});

test('payment methods are off unless the owner lists them, and only add a line naming the chosen one',()=>{
  for(const value of [undefined,[]])assert.deepEqual(paymentMethods({paymentMethods:value}),[]);
  assert.deepEqual(paymentMethods({paymentMethods:[' Bank transfer ','Cash on delivery']}),['Bank transfer','Cash on delivery']);
  for(const value of [[],['Bank transfer'],['Bank transfer','Cash on delivery']])assert.doesNotThrow(()=>validateData(products,{...preview,paymentMethods:value}));
  for(const value of ['Bank transfer',{},[''],['  '],[1],['x'.repeat(41)],['Bank transfer','bank transfer'],['a','b','c','d','e','f','g'],null])assert.throws(()=>validateData(products,{...preview,paymentMethods:value}),/paymentMethods/,JSON.stringify(value));
  const items=[{id:'A',quantity:1}];
  const base=orderMessage(items,products);
  assert.equal(orderMessage(items,products,'',{payment:''}),base);
  assert.deepEqual(orderMessage(items,products,'Blue',{payment:'Bank transfer'}).split('\n').slice(-2),['Preferred payment: Bank transfer','Notes: Blue']);
  const both=orderMessage(items,products,'',{paypal:true,payment:'Bank transfer'});
  assert.match(both,/PayPal payment link in USD/);assert.doesNotMatch(both,/Preferred payment/,'PayPal and a method are never both written');
});

test('social links are off unless the owner gives accounts, and only https links are accepted',()=>{
  for(const value of [undefined,[]])assert.deepEqual(socialLinks({social:value}),[]);
  assert.deepEqual(socialLinks({social:[{label:' Instagram ',url:'https://www.instagram.com/example'}]}),[{label:'Instagram',url:'https://www.instagram.com/example'}]);
  assert.doesNotThrow(()=>validateData(products,{...preview,social:[{label:'Instagram',url:'https://www.instagram.com/example'},{label:'Facebook',url:'https://www.facebook.com/example'}]}));
  for(const value of [{},'https://instagram.com/x',[{label:'Instagram'}],[{url:'https://instagram.com/x'}],[{label:'',url:'https://instagram.com/x'}],[{label:'Instagram',url:'http://instagram.com/x'}],[{label:'Instagram',url:'javascript:alert(1)'}],[{label:'Instagram',url:'instagram.com/x'}],[{label:'Instagram',url:'https://user:pw@instagram.com/x'}],[{label:'x'.repeat(31),url:'https://instagram.com/x'}],Array(7).fill({label:'A',url:'https://a.example/'}),[null]])assert.throws(()=>validateData(products,{...preview,social:value}),/social/,JSON.stringify(value));
});

test('trust pages exist only once the owner has written them',()=>{
  for(const value of [undefined,{},{shipping:null,returns:null,about:null},{about:'   '}])assert.deepEqual(trustPages({pages:value}),[]);
  assert.deepEqual(trustPages({pages:{shipping:null,returns:' We accept returns when… ',about:null}}).map(t=>[t.slug,t.title,t.text]),[['returns','Returns','We accept returns when…']]);
  assert.doesNotThrow(()=>validateData(products,{...preview,pages:{shipping:'Owner text',returns:null,about:null}}));
  for(const value of [null,[],'text',{faq:'x'},{shipping:''},{shipping:5},{about:'x'.repeat(4001)}])assert.throws(()=>validateData(products,{...preview,pages:value}),/pages/,JSON.stringify(value));
});

test('payment method ids render as labels, and the owner\'s cart line shows only with methods',()=>{
  assert.deepEqual(paymentMethods({paymentMethods:['lankaqr','bank-transfer','cash-on-delivery']}),['LankaQR','Bank transfer','Cash on delivery']);
  assert.deepEqual(paymentMethods({paymentMethods:['LANKAQR','Card at pickup']}),['LankaQR','Card at pickup'],'Unknown names stay as written');
  assert.throws(()=>validateData(products,{...preview,paymentMethods:['bank-transfer','Bank transfer']}),/paymentMethods/,'An id and its label are the same method');
  const note='Pay by LankaQR. We send payment details on WhatsApp.';
  assert.equal(paymentNote({paymentMethods:['lankaqr'],paymentNote:'  '+note+' '}),note);
  assert.equal(paymentNote({paymentMethods:[],paymentNote:note}),null,'No methods, no note');
  assert.equal(paymentNote({paymentMethods:['lankaqr'],paymentNote:null}),null);
  assert.doesNotThrow(()=>validateData(products,{...preview,paymentNote:null}));
  for(const value of ['',' ',5,'x'.repeat(201)])assert.throws(()=>validateData(products,{...preview,paymentNote:value}),/paymentNote/,JSON.stringify(value));
});

