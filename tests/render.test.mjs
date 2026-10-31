import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {home, privacyPage} from '../src/render.mjs';
import {visibleProducts} from '../src/domain.mjs';

const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
const store=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const live={mode:'live',whatsappVerified:true,whatsappNumber:'94700000000'};

test('the home hero only links to a product included in the live-visible catalogue',()=>{
  const approved=products.map(p=>({...p,approved:p.id==='HC-BAYMAX'}));
  const html=home(visibleProducts(approved,live),live);
  const links=[...html.matchAll(/href="(\/products\/[^\"]+)"/g)].map(m=>m[1]);
  assert(links.length>0);
  assert(links.every(link=>link==='/products/baymax-figure/'));
  assert(!html.includes('/assets/kurama.jpg'));
});

test('an empty live catalogue has no dead product link or unapproved hero photo',()=>{
  const html=home(visibleProducts(products.map(p=>({...p,approved:false})),live),live);
  assert(!html.includes('href="/products/'));
  assert(!html.includes('class="hero-visual"'));
  assert(!/rel="preload" as="image"/.test(html),'No hero image preload without a visible hero product');
  assert(html.includes('href="/custom/"'));
});

test('photos decode synchronously so off-screen cards never paint as empty frames',()=>{
  const html=home(products,{mode:'preview'});
  assert(html.includes('<img '));
  assert(!html.includes('decoding="async"'));
});

test('the full-bleed hero photo is the preloaded, eager, high-priority LCP image',()=>{
  const html=home(visibleProducts(products,store),store);
  const img=html.match(/<div class="hero-visual">.*?<img [^>]*>/)[0];
  assert.match(img,/loading="eager"/);
  assert.match(img,/fetchpriority="high"/);
  assert(!/loading="lazy"/.test(img));
  assert.equal([...html.matchAll(/<link rel="preload" as="image"[^>]*fetchpriority="high"/g)].length,2);
  assert.match(html,/<a class="button" href="\/shop\/">Shop the collection/);
});

test('preview mode shows a slim, plainly worded ordering notice without dates',()=>{
  const preview={...store,mode:'preview'};
  const html=home(visibleProducts(products,preview),preview);
  const notice=html.match(/<aside class="preview-notice"[^>]*>(.*?)<\/aside>/)[1];
  assert.match(notice,/Online ordering opens soon\./);
  assert(!/\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(notice.replace(/<[^>]+>/g,'')));
  assert(!home(visibleProducts(products,preview),{...store,...live}).includes('preview-notice'));
});

test('every page has the sticky header cart hooks and a footer with real links',()=>{
  const html=home(visibleProducts(products,store),store);
  assert.match(html,/<header class="site-header">/);
  assert.match(html,/<a class="cart-link" href="\/cart\/" data-testid="cart-link"/);
  assert.match(html,/data-cart-count data-count="0" data-testid="cart-count">0</);
  const foot=html.match(/<footer class="site-footer">.*<\/footer>/)[0];
  for(const href of ['/shop/','/cart/','/custom/','/privacy/'])assert(foot.includes('href="'+href+'"'));
});

test('cards are one link with a clean LKR price and test hooks',async()=>{
  const {card}=await import('../src/render.mjs');
  const html=card(products.find(p=>p.id==='HC-LEAF'));
  assert.equal([...html.matchAll(/<a\b/g)].length,1,'A single link covers the whole card');
  assert.match(html,/data-testid="product-card"/);
  assert.match(html,/<p class="price" data-testid="product-price">LKR\s550<\/p>/);
});

test('live cards add a one-tap WhatsApp Order for that design at quantity 1; preview and unavailable cards do not',async()=>{
  const {card,shop}=await import('../src/render.mjs');
  const leaf=products.find(p=>p.id==='HC-LEAF');
  const html=card(leaf,{store:live});
  const href=html.match(/<a class="quick-order" href="([^"]+)"/)[1].replaceAll('&amp;','&');
  const url=new URL(href);
  assert.equal(url.origin+url.pathname,'https://wa.me/94700000000');
  assert.match(url.searchParams.get('text'),/^Hello HoneyComb 3D, I would like to request an order\.\n- Hidden Leaf Keychain \[HC-LEAF\] x 1: LKR\s550\n/);
  assert.match(html,/target="_blank" rel="noopener noreferrer" data-card-order data-testid="card-order" aria-label="Order Hidden Leaf Keychain on WhatsApp \(opens in a new tab\)"/);
  assert.match(html,/data-quick-add="HC-LEAF"/,'Add stays beside Order');
  assert.equal([...html.matchAll(/<a\b/g)].length,2,'The product link plus Order');
  for(const closed of [{mode:'preview',whatsappVerified:true,whatsappNumber:'94700000000'},{...live,whatsappVerified:false},{...live,whatsappNumber:''}]) {
    assert(!card(leaf,{store:closed}).includes('data-card-order'),'No Order link when ordering is closed: '+JSON.stringify(closed));
  }
  assert(!card({...leaf,availability:'unavailable'},{store:live}).includes('data-card-order'),'Never for an unavailable design');
  assert(!card(leaf).includes('data-card-order'),'Cards rendered without a store stay as before');
  const visible=visibleProducts(products,store);
  assert.equal([...shop(visible,live).matchAll(/data-card-order/g)].length,visible.filter(p=>p.availability!=='unavailable').length,'Every orderable shop card');
  assert.equal([...shop(visible,{...live,mode:'preview'}).matchAll(/data-card-order/g)].length,0,'Preview shop: none');
});

test('product page: gallery only with several photos, clear price, availability and an inline ordering note',async()=>{
  const {detail}=await import('../src/render.mjs');
  const preview={...store,mode:'preview'};
  const visible=visibleProducts(products,preview);
  const closedMinato={...visible.find(p=>p.id==='HC-MINATO'),availability:'unconfirmed'};
  const minato=detail(closedMinato,visible,preview);
  assert.equal([...minato.matchAll(/data-gallery-thumb=/g)].length,4);
  assert.match(minato,/<p class="detail-price" data-testid="product-price">LKR\s1,350<\/p>/);
  assert.match(minato,/data-testid="availability"><span aria-hidden="true"><\/span>Availability to confirm/);
  assert.match(minato,/<p class="order-note" data-testid="order-status">.*Online ordering opens soon\. Save your picks in the request cart\.<\/p>/);
  assert(!minato.includes('order-button'),'The disabled order button is gone');
  assert.match(minato,/<h2>More from HoneyComb 3D<\/h2>/);
  // Once ordering is open the note goes; the made-to-order status takes its place.
  const open=detail({...closedMinato,availability:'made-to-order'},visible,{...store,...live});
  assert.match(open,/data-testid="availability"><span aria-hidden="true"><\/span>Made to order/);
  assert(!open.includes('data-testid="order-status"'),'No "opens soon" note once ordering is open');
  assert(!open.includes('order-button'));
  const baymax=detail(visible.find(p=>p.id==='HC-BAYMAX'),visible,preview);
  assert(!baymax.includes('data-gallery-thumb'));
  assert.equal([...baymax.matchAll(/fetchpriority="high"/g)].length,1);
});

test('pages carry share metadata, theme colour, touch icon and price-only Product JSON-LD',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const leaf=visible.find(p=>p.id==='HC-LEAF');
  const html=detail(leaf,visible,store);
  assert.match(html,/<meta name="description" content="A Hidden Leaf design for your keyring\./);
  assert.match(html,/<meta property="og:image" content="https:\/\/honeycomb3d\.store\/assets\/hidden-leaf-share\.jpg">/);
  assert.match(html,/<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html,/<meta name="theme-color" content="#0c0b0a">/);
  assert.match(html,/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png">/);
  const ld=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  assert.deepEqual(Object.keys(ld).sort(),['@context','@type','image','name','offers']);
  assert.deepEqual(ld.offers,{'@type':'Offer',price:'550',priceCurrency:'LKR'});
  assert(!/availability|rating|review/i.test(JSON.stringify(ld)));
});

test('"More from HoneyComb 3D" puts the same category and shared themes first',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=detail(visible.find(p=>p.id==='HC-MINATO'),visible,store);
  const more=html.slice(html.indexOf('More from HoneyComb 3D'));
  const names=[...more.matchAll(/class="card-link" href="[^"]+">([^<]+)</g)].map(m=>m[1]);
  assert.deepEqual(names.slice(0,2),['Classic Kunai','Shuriken Ninja Star'],'Same category first, in catalogue order');
  assert(names.slice(2,4).every(n=>['Hidden Leaf Keychain','Kurama Figure'].includes(n)),'Then shared Naruto theme: '+names);
});

test('product pages offer sharing without a phone number or external script',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=detail(visible.find(p=>p.id==='HC-KURAMA'),visible,store);
  const row=html.match(/<div class="share-row"[^>]*>.*?<\/div>/)[0];
  assert.match(row,/data-url="https:\/\/honeycomb3d\.store\/products\/kurama-figure\/"/);
  const wa=row.match(/href="(https:\/\/wa\.me\/[^"]+)"/)[1].replace(/&amp;/g,'&');
  assert.equal(new URL(wa).pathname,'/','No WhatsApp number in the share link');
  assert.equal(new URL(wa).searchParams.get('text'),'Kurama Figure by HoneyComb 3D https://honeycomb3d.store/products/kurama-figure/');
  assert.match(row,/rel="noopener noreferrer"/);
  assert(!/<script(?! type="application\/ld\+json")/.test(html.replace(/<script type="module" src="\/app\.mjs"><\/script>/,'')));
});

test('home has a three-step how-it-works band without timings or promises',()=>{
  const html=home(visibleProducts(products,store),store);
  const band=html.match(/<section class="wrap section how-it-works".*?<\/section>/)[0];
  assert.deepEqual([...band.matchAll(/<h3>([^<]+)<\/h3>/g)].map(m=>m[1]),['Browse the designs','Add them to your request cart','We confirm the details with you']);
  assert(!/\b(?:day|days|hour|hours|week|weeks|guarantee|fast|free)\b/i.test(band.replace(/<[^>]+>/g,' ')));
});

test('recently viewed row ships hidden, names the current product and renders nothing server-side',async()=>{
  const {detail,cartPage}=await import('../src/render.mjs');
  const p=products[0];
  const html=detail(p,products,store);
  assert.match(html,new RegExp('data-recent data-recent-current="'+p.id+'" data-testid="recently-viewed" aria-labelledby="recent-title" hidden>'));
  assert.match(html,/<div class="product-grid" data-recent-list><\/div>/);
  assert.match(cartPage(store),/data-recent data-testid="recently-viewed"[^>]* hidden>/);
});

test('404 keeps its message and adds a no-JS search to the shop plus four designs',async()=>{
  const {notFound}=await import('../src/render.mjs');
  const html=notFound(visibleProducts(products,store),store);
  assert.match(html,/<h1>This page wandered off\.<\/h1>/);
  assert.match(html,/<form class="nf-search" action="\/shop\/" method="get" role="search"/);
  assert.match(html,/name="q"/);
  assert.equal([...html.matchAll(/data-testid="product-card"/g)].length,4);
});

test('shop chips show design counts and list themes largest first',async()=>{
  const {shop}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=shop(visible,store);
  const chip=value=>html.match(new RegExp('value="'+value+'"[^>]*><span>[^<]*(?:<span class="chip-count"><span class="sr-only">, </span>(\\d+)</span>)?'))?.[1];
  assert.equal(Number(chip('Keychains')),visible.filter(p=>p.category==='Keychains').length);
  assert.equal(chip('all'),undefined,'"All" carries no count');
  const themes=[...html.matchAll(/name="theme" value="([^"]+)"/g)].map(m=>m[1]).filter(v=>v!=='any');
  const count=t=>visible.filter(p=>p.tags.includes(t)).length;
  assert(themes.every((t,i)=>!i||count(themes[i-1])>=count(t)),'Themes ordered by size: '+themes);
});

test('product facts link to the matching shop views and do not repeat price or availability',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const html=detail(visible.find(p=>p.id==='HC-MINATO'),visible,store);
  const facts=html.match(/<dl class="detail-facts">.*?<\/dl>/)[0];
  assert.match(facts,/<dt>Category<\/dt><dd><a href="\/shop\/\?category=Props">Props<\/a><\/dd>/);
  assert.match(facts,/<a href="\/shop\/\?theme=Naruto">Naruto<\/a>/);
  assert.match(facts,/<dt>Reference<\/dt><dd>HC-MINATO<\/dd>/);
  assert(!/<dt>(?:Price|Availability)<\/dt>/.test(facts));
  assert.equal([...html.matchAll(/data-testid="product-price"/g)].length>=1,true,'Price still shown at the top');
});

test('the related row links to the rest of the category, or the collection when the category has one design',async()=>{
  const {detail}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const minato=detail(visible.find(p=>p.id==='HC-MINATO'),visible,store);
  const props=visible.filter(p=>p.category==='Props').length;
  assert.match(minato,new RegExp('<a href="/shop/\\?category=Props" data-testid="more-category">All Props \\('+props+'\\) →</a>'));
  const single=visible.find(p=>visible.filter(x=>x.category===p.category).length===1);
  if(single)assert.match(detail(single,visible,store),/<h2>More from HoneyComb 3D<\/h2><a href="\/shop\/">View collection →<\/a>/);
});

test('home lists up to eight themes, largest first, linking to the filtered shop',async()=>{
  const visible=visibleProducts(products,store);
  const html=home(visible,store);
  const row=html.match(/<div class="theme-row" data-testid="home-themes">.*?<\/div><\/div>/)[0];
  const links=[...row.matchAll(/href="\/shop\/\?theme=([^"]+)">([^<]+)<span class="chip-count"><span class="sr-only">, <\/span>(\d+)/g)].map(m=>({t:decodeURIComponent(m[1]),n:+m[3]}));
  assert(links.length>0&&links.length<=8);
  for(const {t,n} of links)assert.equal(n,visible.filter(p=>p.tags.includes(t)).length,t);
  assert(links.every((l,i)=>!i||links[i-1].n>=l.n),'Largest first');
});

test('noindex follows searchIndexing, not ordering: turning ordering on keeps search engines out',()=>{
  const noindex='<meta name="robots" content="noindex,nofollow">';
  const visible=products.map(p=>({...p,approved:true,availability:'made-to-order'}));
  assert(home(visibleProducts(products,store),store).includes(noindex));
  assert(home(visibleProducts(visible,live),live).includes(noindex));
  assert(home(visibleProducts(visible,live),{...live,searchIndexing:false}).includes(noindex));
  assert(!home(visibleProducts(visible,live),{...live,searchIndexing:true}).includes(noindex));
});
test('the privacy page mentions PayPal only when overseas PayPal is switched on in live mode',()=>{
  const base={...store,...live};
  assert.doesNotMatch(privacyPage({...base,paypalOverseas:false}),/PayPal/);
  assert.doesNotMatch(privacyPage({...store,mode:'preview',paypalOverseas:true}),/PayPal/);
  assert.match(privacyPage({...base,paypalOverseas:true}),/PayPal, which handles that payment under its own terms/);
});

test('the FAQ covers ordering, made to order, colours and sizes, custom prints and where we are, without promises',async()=>{
  const {faqPage,cartPage}=await import('../src/render.mjs');
  const text=html=>html.replace(/<[^>]+>/g,' ');
  const liveHtml=faqPage(live), previewHtml=faqPage({mode:'preview'});
  for(const html of [liveHtml,previewHtml]) {
    assert.match(html,/<h1>Questions and answers\.<\/h1>/);
    for(const q of ['How do I order?','Is my request a confirmed purchase?','What does “made to order” mean?','Can I choose the colour or size?','Can you print something that is not in the shop?','How much is delivery, and how long does it take?','How do I pay?','Where are you based?'])assert(html.includes('<h2>'+q+'</h2>'),q);
    assert.match(html,/Sri Lanka/);assert.match(html,/href="\/custom\/"/);
    const answers=text(html.slice(html.indexOf('data-testid="faq"'),html.indexOf('</main>'))).replaceAll('3D','');
    assert(!/\d/.test(answers),'No numbers (prices, days, phone numbers) in the answers');
    assert(!/\b(?:free|guarantee\w*|warrant\w*|days?|weeks?|fortnight|hours?|refund\w*|returns?|exchange\w*|money back|cash|cards?|cod|bank transfer|express|same[- ]day|within)\b/i.test(answers),'No delivery-time, returns or payment promises');
  }
  assert.match(liveHtml,/opens in WhatsApp, and nothing is sent until you send it/);
  assert.match(previewHtml,/Online ordering opens soon/);
  for(const closed of [previewHtml,faqPage({...live,mode:'preview',paypalOverseas:true})])assert(!/WhatsApp|conversation|PayPal/.test(closed),'Preview FAQ does not describe a WhatsApp or PayPal flow that is not open');
  assert.match(previewHtml,/use “Ask about a variation” on a design’s page/);
  assert.match(liveHtml,/or ask in WhatsApp, and we confirm what is possible/);
  assert(!liveHtml.includes('PayPal')&&!faqPage({...live,mode:'preview',paypalOverseas:true}).includes('PayPal'));
  assert.match(faqPage({...live,paypalOverseas:true}),/PayPal payment link in USD from your request cart\. We send it in WhatsApp after we confirm your total\./);
  for(const html of [cartPage(live),cartPage({mode:'preview'})])assert.match(html,/<a href="\/faq\/">Questions and answers<\/a>/,'Footer links the FAQ');
});

test('the delivery line shows on product pages and in the FAQ only when set, escaped, and the old wording stays when off',async()=>{
  const {detail,faqPage}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const leaf=visible.find(p=>p.id==='HC-LEAF');
  const off=detail(leaf,visible,live);
  assert(!off.includes('data-testid="delivery-line"'));
  assert.match(off,/Delivery cost and timing are included in your quote\./);
  assert.match(faqPage(live),/<p>Delivery cost and timing are included in your quote\.<\/p>/);
  const on={...live,delivery:{text:'Islandwide by courier <b>& more</b>',feeLkr:500}};
  const html=detail(leaf,visible,on);
  assert.match(html,/<p class="delivery-line" data-testid="delivery-line"><span>Delivery<\/span> Islandwide by courier &lt;b&gt;&amp; more&lt;\/b&gt;<\/p>/);
  assert(!html.includes('Delivery cost and timing are included in your quote'));
  const orderNow=new URL(html.match(/href="([^"]+)"[^>]*data-order-now/)[1].replaceAll('&amp;','&'));
  assert.match(orderNow.searchParams.get('text'),/\nDelivery fee: LKR\s500\n/,'Order now carries the fee');
  assert.match(faqPage(on),/Islandwide by courier &lt;b&gt;&amp; more&lt;\/b&gt;\. The final total is confirmed with your quote\./);
  assert.match(detail(leaf,visible,{...on,mode:'preview'}),/data-testid="delivery-line"/,'Shown in preview too: it is store information, not ordering');
  assert.match(faqPage({...live,delivery:{text:'Islandwide by courier.'}}),/<p>Islandwide by courier\. The final total is confirmed with your quote\.<\/p>/,'No doubled full stop');
  assert.match(faqPage({...live,delivery:{text:'Islandwide by courier!'}}),/<p>Islandwide by courier! The final total/);
});

test('the FAQ names the owner\'s payment methods only when they are set and ordering is open',async()=>{
  const {faqPage}=await import('../src/render.mjs');
  assert.doesNotMatch(faqPage(live),/how you would like to pay/);
  assert.match(faqPage({...live,paymentMethods:['Bank transfer','Cash on delivery','Card <b>']}),/In your request cart you can tell us how you would like to pay: Bank transfer, Cash on delivery or Card &lt;b&gt;\./);
  assert.match(faqPage({...live,paymentMethods:['Bank transfer']}),/how you would like to pay: Bank transfer\./);
  assert.doesNotMatch(faqPage({...live,mode:'preview',paymentMethods:['Bank transfer']}),/Bank transfer/,'Preview: ordering is closed');
});

test('the footer lists the owner\'s social accounts only when set, escaped, opening in a new tab',async()=>{
  const {cartPage,faqPage,privacyPage}=await import('../src/render.mjs');
  for(const html of [cartPage(live),faqPage({mode:'preview'})])assert(!html.includes('footer-social')&&!html.includes('<h2>Follow</h2>'));
  const on={...live,social:[{label:'Instagram',url:'https://www.instagram.com/example?a=1&b="2"'},{label:'Face<b>book',url:'https://www.facebook.com/example'}]};
  for(const html of [cartPage(on),privacyPage(on),faqPage({...on,mode:'preview'})]) {
    const block=html.match(/<div data-testid="footer-social">.*?<\/div>/)[0];
    assert.match(block,/<h2>Follow<\/h2>/);
    assert.match(block,/<a href="https:\/\/www\.instagram\.com\/example\?a=1&amp;b=%222%22" target="_blank" rel="me noopener noreferrer">Instagram<span class="sr-only"> \(opens in a new tab\)<\/span><\/a>/,'Normalised and escaped');
    assert.match(block,/>Face&lt;b&gt;book</);
  }
});

test('trust pages render the owner\'s words as paragraphs, escaped, and appear in the footer only when written',async()=>{
  const {trustPage,cartPage}=await import('../src/render.mjs');
  const {trustPages}=await import('../src/domain.mjs');
  for(const slug of ['shipping','returns','about'])assert(!cartPage(live).includes('href="/'+slug+'/"'),'No link to an unwritten page: '+slug);
  const on={...live,pages:{shipping:null,returns:'First <b>para</b>.\nSame para.\n\n  Second para.  ',about:'We print in Kegalle.'}};
  const footer=cartPage(on);
  assert.match(footer,/<li><a href="\/returns\/">Returns<\/a><\/li><li><a href="\/about\/">About HoneyComb 3D<\/a><\/li><li><a href="\/faq\/">/);
  assert(!footer.includes('href="/shipping/"'));
  const html=trustPage(trustPages(on).find(t=>t.key==='returns'),on);
  assert.match(html,/<h1>Returns\.<\/h1><p>First &lt;b&gt;para&lt;\/b&gt;\.<br>Same para\.<\/p><p>Second para\.<\/p><\/section>/);
  assert.match(html,/<meta name="description" content="First &lt;b&gt;para&lt;\/b&gt;\. Same para\. Second para\.">/,'Description escaped once');
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
});

test('indexing prep: breadcrumb data and the sitemap exist only once searchIndexing is on',async()=>{
  const {detail,sitemap}=await import('../src/render.mjs');
  const visible=visibleProducts(products,store);
  const leaf=visible.find(p=>p.id==='HC-LEAF');
  const site={...live,siteUrl:'https://honeycomb3d.store'};
  assert(!detail(leaf,visible,site).includes('BreadcrumbList'),'Off: no breadcrumb data');
  const html=detail(leaf,visible,{...site,searchIndexing:true});
  const lds=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.deepEqual(lds.map(x=>x['@type']),['Product','BreadcrumbList']);
  assert.deepEqual(lds[1].itemListElement,[
    {'@type':'ListItem',position:1,name:'Shop',item:'https://honeycomb3d.store/shop/'},
    {'@type':'ListItem',position:2,name:'Keychains',item:'https://honeycomb3d.store/shop/?category=Keychains'},
    {'@type':'ListItem',position:3,name:'Hidden Leaf Keychain',item:'https://honeycomb3d.store/products/hidden-leaf-keychain/'}],'Mirrors the visible breadcrumb');
  assert.doesNotMatch(html,/noindex/);
  const xml=sitemap(visible,{...site,searchIndexing:true,pages:{about:'Owner text'}});
  const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.deepEqual(locs.slice(0,6),['/','/shop/','/custom/','/faq/','/privacy/','/about/'].map(p=>'https://honeycomb3d.store'+p));
  assert.equal(locs.length,6+visible.length);
  assert(!xml.includes('/cart/')&&!xml.includes('404'),'Cart and 404 are not listed');
  assert(!/lastmod|priority|changefreq/.test(xml),'No invented dates or priorities');
});

test('trust page descriptions end on a whole word; CRLF text renders cleanly; payment lists read naturally (QA, items 5-7)',async()=>{
  const {trustPage,faqPage}=await import('../src/render.mjs');
  const {trustPages}=await import('../src/domain.mjs');
  const long='We accept returns of unused prints in their original packaging. '.repeat(4)+'Returns accepted within 7 days.';
  const html=trustPage(trustPages({pages:{returns:long}})[0],live);
  const description=html.match(/<meta name="description" content="([^"]*)">/)[1];
  assert(description.endsWith('…')&&[...description].length<=156,description);
  assert(long.replace(/\s+/g,' ').startsWith(description.slice(0,-1)),'A prefix of the owner text');
  assert.match(description,/[a-z]…$/,'Cut at a word boundary');
  const emoji=trustPage(trustPages({pages:{about:'😀'.repeat(200)}})[0],live);
  assert(!emoji.includes('\ufffd'),'Never splits a character');
  const crlf=trustPage(trustPages({pages:{about:'Line one\r\nline two\r\n\r\nPara two'}})[0],live);
  assert.match(crlf,/<p>Line one<br>line two<\/p><p>Para two<\/p>/);
  assert.match(faqPage({...live,paymentMethods:['Card, debit','Bank transfer']}),/how you would like to pay: Card, debit or Bank transfer\./);
});

test('indexing on keeps the cart and 404 out of search results; descriptions never split a grapheme (QA, items 8-9)',async()=>{
  const {cartPage,notFound,faqPage,trustPage}=await import('../src/render.mjs');
  const {trustPages}=await import('../src/domain.mjs');
  const on={...live,searchIndexing:true,siteUrl:'https://honeycomb3d.store'};
  for(const html of [cartPage(on),notFound([],on)])assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(faqPage(on),/<meta name="robots"/);
  const sinhala='ක'.repeat(100)+'කා'.repeat(60);
  const description=trustPage(trustPages({pages:{about:sinhala}})[0],live).match(/<meta name="description" content="([^"]*)">/)[1];
  assert(description.endsWith('කා…'),'Ends on a whole letter with its vowel sign');
  const family='👨‍👩‍👧'.repeat(160);
  const d2=trustPage(trustPages({pages:{about:family}})[0],live).match(/<meta name="description" content="([^"]*)">/)[1];
  assert(d2.replace('…','').split('👨‍👩‍👧').every(x=>x===''),'ZWJ sequences stay whole');
});

