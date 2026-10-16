import {escapeHtml as e, money} from './domain.mjs';

export const price = p => p.priceLkr === null ? 'Price on enquiry' : money(p.priceLkr);
export const CARD_SIZES = '(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 1000px) calc((100vw - 124px) / 3), (max-width: 1280px) calc((100vw - 146px) / 4), 284px';
// Every photo slot is a square frame filled by a square derivative (object-fit: cover).
const DETAIL_SIZES = '(max-width: 700px) 100vw, (max-width: 1280px) calc((100vw - 144px) * .584), 664px';
const THUMB_SIZES = '72px';
const TILE_SIZES = '(max-width: 700px) 88px, (max-width: 1280px) calc((100vw - 112px) / 3), 390px';
const HERO_LANDSCAPE = '(min-width: 700px)';
const srcset = variants => variants.map(v=>v.src+' '+v.width+'w').join(', ');

export function picture(p, {sizes=CARD_SIZES, loading='lazy', priority=false}={}) {
  if (!p.image) return '';
  const responsive=p.imageVariants?.length ?
    ' srcset="'+e(p.imageVariants.map(v=>v.src+' '+v.width+'w').join(', '))+'" sizes="'+e(sizes)+'"' : '';
  return '<img src="'+e(p.image)+'"'+responsive+' alt="'+e(p.imageAlt)+'" width="'+(p.imageWidth||640)+'" height="'+(p.imageHeight||640)+'" loading="'+loading+'"'+(priority?' fetchpriority="high"':'')+'>';
}
export function card(p, {headingLevel=3, loading='lazy'}={}) {
  const heading=headingLevel===2?'h2':'h3';
  // One link per card; its ::after stretches over the whole card so the photo is clickable too.
  return '<article class="product-card" data-product-card data-testid="product-card" data-category="' + e(p.category) + '" data-search="' + e([p.name,p.category,...p.tags].join(' ').toLowerCase()) + '" data-tags="' + e(p.tags.join('|')) + '">' +
    '<div class="product-image">' + picture(p,{loading}) + '</div>' +
    '<div class="card-copy"><p class="eyebrow">' + e(p.category) + '</p><'+heading+'><a class="card-link" href="/products/' + e(p.slug) + '/">' + e(p.name) + '</a></'+heading+'><p class="price" data-testid="product-price">' + e(price(p)) + '</p><p class="card-status">' + availability(p) + '</p></div></article>';
}
function availability(p) {
  return ({unconfirmed:'Availability to confirm',available:'Available',unavailable:'Currently unavailable','made-to-order':'Made to order'})[p.availability];
}
const LOGO_SIZES = '(max-width: 700px) 150px, 180px';
function brand(store) {
  if (!store.logo) return 'HONEYCOMB<span>3D PRINT STUDIO</span>';
  const srcset = store.logoVariants?.length ? ' srcset="'+e(store.logoVariants.map(v=>v.src+' '+v.width+'w').join(', '))+'" sizes="'+LOGO_SIZES+'"' : '';
  return '<img class="brand-image" src="'+e(store.logo)+'"'+srcset+' alt="HoneyComb" width="'+(store.logoWidth||220)+'" height="'+(store.logoHeight||66)+'">';
}
const CART_ICON = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>';
function footer(store) {
  return '<footer class="site-footer"><div class="footer-inner">' +
    '<div class="footer-brand"><a class="wordmark" href="/" aria-label="HoneyComb 3D home">'+brand(store)+'</a><p>3D prints, collectibles &amp; custom ideas.</p><p class="muted">Sri Lanka · Prices in LKR</p></div>' +
    '<nav class="footer-links" aria-label="Footer"><div><h2>Shop</h2><ul><li><a href="/shop/">The collection</a></li><li><a href="/cart/">Request cart</a></li></ul></div>' +
    '<div><h2>Make</h2><ul><li><a href="/custom/">Have something in mind? Tell us.</a></li></ul></div>' +
    '<div><h2>About</h2><ul><li><a href="/privacy/">How this site handles your data</a></li></ul></div></nav>' +
    '<div class="footer-bottom"><p class="fine">An enquiry is not a confirmed purchase. Availability, delivery and payment arrangements are confirmed with your quote.</p>' +
    '<p class="fine">© '+new Date().getFullYear()+' '+e(store.name||'HoneyComb 3D')+'</p></div></div></footer>';
}
const DEFAULT_DESCRIPTION = 'Explore HoneyComb 3D collectibles and custom prints. Request a quote and confirm the details before ordering.';
const absolute = (store, path) => (store.siteUrl || '').replace(/\/$/, '') + path;
function socialMeta(title, store, {description=DEFAULT_DESCRIPTION, path='/', image, imageAlt, imageWidth, imageHeight}={}) {
  const fallback = store.hero?.share;
  if (!image && fallback) ({src:image, width:imageWidth, height:imageHeight} = fallback), imageAlt = 'HoneyComb 3D Night Fury keychain held between two fingers';
  const tags = [['description',description]].map(([n,c])=>'<meta name="'+n+'" content="'+e(c)+'">').join('') +
    '<meta property="og:site_name" content="HoneyComb 3D"><meta property="og:type" content="website"><meta property="og:title" content="'+e(title)+'"><meta property="og:description" content="'+e(description)+'">' +
    (store.siteUrl ? '<meta property="og:url" content="'+e(absolute(store,path))+'">' : '') +
    (image && store.siteUrl ? '<meta property="og:image" content="'+e(absolute(store,image))+'"><meta property="og:image:width" content="'+imageWidth+'"><meta property="og:image:height" content="'+imageHeight+'"><meta property="og:image:alt" content="'+e(imageAlt||'')+'">' : '') +
    '<meta name="twitter:card" content="'+(image?'summary_large_image':'summary')+'"><meta name="twitter:title" content="'+e(title)+'"><meta name="twitter:description" content="'+e(description)+'">' +
    (image && store.siteUrl ? '<meta name="twitter:image" content="'+e(absolute(store,image))+'"><meta name="twitter:image:alt" content="'+e(imageAlt||'')+'">' : '');
  return tags;
}
export function layout(title, body, store, current='', head='', meta={}) {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + e(title) + ' | HoneyComb 3D</title>' + socialMeta(title+' | HoneyComb 3D', store, meta) +
    '<meta name="theme-color" content="#0c0b0a">' +
    (store.mode==='preview' ? '<meta name="robots" content="noindex,nofollow">' : '') +
    head+'<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" href="/fonts/bricolage-grotesque-display.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script></head><body>' +
    '<a class="skip-link" href="#main">Skip to content</a>' +
    (store.mode==='preview' ? '<aside class="preview-notice" aria-label="Store preview notice" data-testid="preview-notice"><span class="notice-mark" aria-hidden="true"></span><span>Online ordering opens soon.</span> <a href="/shop/">Browse the collection <span aria-hidden="true">→</span></a></aside>' : '') +
    '<header class="site-header"><div class="header-inner"><a class="wordmark" href="/" aria-label="HoneyComb 3D home">'+brand(store)+'</a>' +
    '<nav aria-label="Main navigation"><a href="/shop/"' + (current==='shop'?' aria-current="page"':'') + '>Shop</a><a href="/custom/"' + (current==='custom'?' aria-current="page"':'') + '>Custom<span class="nav-long">&nbsp;prints</span></a>' +
    '<a class="cart-link" href="/cart/" data-testid="cart-link"' + (current==='cart'?' aria-current="page"':'') + '>'+CART_ICON+'<span class="cart-label">Cart</span> <span class="cart-count" data-cart-count data-count="0" data-testid="cart-count">0</span><span class="sr-only"> items</span></a></nav></div></header>' +
    '<main id="main" tabindex="-1">' + body + '</main>' + footer(store) +
    '<div class="toast" role="status" aria-live="polite" id="status"></div></body></html>';
}
export function home(products,store) {
  const categories=[...new Set(products.map(p=>p.category))];
  const featured=store.hero&&products.find(p=>p.id===store.hero.product&&p.image);
  // The LCP photo: preloaded per art-directed frame, eager, high priority.
  const fallback=featured&&(store.hero.portrait.find(v=>v.width===960)||store.hero.portrait.at(-1));
  const head=featured?
    '<link rel="preload" as="image" imagesrcset="'+e(srcset(store.hero.portrait))+'" imagesizes="100vw" media="(max-width: 699px)" fetchpriority="high">'+
    '<link rel="preload" as="image" imagesrcset="'+e(srcset(store.hero.landscape))+'" imagesizes="100vw" media="'+HERO_LANDSCAPE+'" fetchpriority="high">':'';
  const visual=featured?
    '<div class="hero-visual"><picture><source media="'+HERO_LANDSCAPE+'" srcset="'+e(srcset(store.hero.landscape))+'" sizes="100vw" width="'+store.hero.landscape[0].width+'" height="'+store.hero.landscape[0].height+'">'+
    '<img src="'+e(fallback.src)+'" srcset="'+e(srcset(store.hero.portrait))+'" sizes="100vw" alt="'+e(featured.imageAlt)+'" width="'+fallback.width+'" height="'+fallback.height+'" loading="eager" fetchpriority="high"></picture></div>':'';
  return layout('Collectibles & custom prints',
    '<section class="hero'+(featured?'':' hero--plain')+'" data-testid="hero">'+visual+'<div class="hero-content wrap"><p class="eyebrow">HONEYCOMB 3D / SRI LANKA</p><h1>Make room for <em>something you.</em></h1><p class="lead">A little character for your desk. A favourite for your collection. An idea brought to life, layer by layer.</p><div class="actions"><a class="button" href="/shop/">Shop the collection <span aria-hidden="true">→</span></a><a class="button secondary" href="/custom/">Bring your own idea</a></div>'+
    (featured?'<a class="hero-credit" href="/products/'+e(featured.slug)+'/">Pictured <b>'+e(featured.name)+'</b> <span aria-hidden="true">→</span></a>':'')+'</div></section>' +
    '<div class="studio-strip"><span>COLLECTIBLES</span><span>KEYCHAINS</span><span>CUSTOM PRINTS</span><span>YOUR NEXT IDEA</span></div>' +
    (categories.length?'<section class="wrap section category-section" aria-labelledby="corner-title"><div class="section-heading"><div><p class="eyebrow">FIND YOUR CORNER</p><h2 id="corner-title">Shop by category</h2></div></div><div class="collection-links">' +
    categories.map(c=>{
      // Each tile shows the most recently listed product in its category and a factual design count.
      const inCategory=products.filter(p=>p.category===c), cover=inCategory.at(-1);
      const count=inCategory.length+' '+(inCategory.length===1?'design':'designs');
      return '<a class="category-tile" href="/shop/?category='+encodeURIComponent(c)+'" aria-label="'+e(c)+', '+count+'"><span class="category-photo">'+picture(cover,{sizes:TILE_SIZES})+'</span><span class="category-copy"><strong>'+e(c)+'</strong><span>'+count+'</span></span><span class="category-arrow" aria-hidden="true">→</span></a>';
    }).join('') + '</div></section>':'') +
    '<section class="wrap section featured-section" aria-labelledby="featured-title"><div class="section-heading"><div><p class="eyebrow">THE COLLECTION</p><h2 id="featured-title">Small objects. Big character.</h2></div><a href="/shop/">View collection →</a></div>' +
    '<div class="product-grid">' + products.slice(0,4).map(p=>card(p)).join('') + (products.length?'':'<p>Our collection is being updated. You can still explore custom-print enquiries.</p>') + '</div></section>' +
    '<section class="wrap banner-wrap"><div class="custom-banner"><p class="eyebrow">YOUR IDEA, OUR NEXT PRINT</p><h2>Can’t find it?<br>Let’s talk about making it.</h2><p>Share a model link or describe your idea. We’ll confirm what is possible, the finish and the quote.</p><a class="button" href="/custom/">Start a custom enquiry <span aria-hidden="true">→</span></a></div></section>' +
    '<section class="wrap section steps"><div><span>01 / EXPLORE</span><h3>Find your favourites</h3><p>Browse the collection or bring a custom idea.</p></div><div><span>02 / ASK</span><h3>Build your request</h3><p>Choose quantities and tell us the details that matter.</p></div><div><span>03 / CONFIRM</span><h3>Agree on the details</h3><p>Confirm price, availability, delivery and payment before placing an order.</p></div></section>',store,'',head,{description:'A little character for your desk. A favourite for your collection. An idea brought to life, layer by layer. 3D-printed collectibles from Sri Lanka, priced in LKR.'});
}
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function chips(name, legend, options) {
  return '<fieldset class="chip-group"><legend>'+legend+'</legend><div class="chips">'+options.map(([value,label],i)=>
    '<label class="chip" data-testid="filter-'+slug(value)+'"><input type="radio" name="'+name+'" value="'+e(value)+'"'+(i===0?' checked':'')+'><span>'+e(label)+'</span></label>').join('')+'</div></fieldset>';
}
export function shop(products,store) {
  const categories=[...new Set(products.map(p=>p.category))];
  // Themes come from the tags, minus tags that only repeat a category name.
  const themes=[...new Set(products.flatMap(p=>p.tags))].filter(t=>!categories.includes(t));
  return layout('Shop','<section class="wrap section shop-section"><p class="eyebrow">THE COLLECTION</p><h1>Find your next favourite.</h1><p class="lead">Explore the designs. Ask about colours, sizes and finishes.</p>' +
    '<form class="filters" id="filters" role="search" aria-label="Filter the collection"><label class="search-field">Search the collection<input type="search" id="search" name="q" placeholder="Try dragons, Naruto, keychains…" maxlength="100" autocomplete="off"></label>' +
    chips('category','Category',[['all','All'],...categories.map(c=>[c,c])]) +
    (themes.length?chips('theme','Theme',[['any','Any theme'],...themes.map(t=>[t,t])]):'') +
    '</form><div class="results-bar"><p class="muted" role="status" id="result-count">'+products.length+' designs</p><button class="text-button" id="reset-filters" type="button" hidden>Clear filters</button></div>' +
    '<div class="product-grid">'+products.map((p,i)=>card(p,{headingLevel:2,loading:i<2?'eager':'lazy'})).join('')+'</div><div class="empty state-panel" id="no-results"'+(products.length?' hidden':'')+'><h2>No matching designs</h2><p>Try a different search or clear your filters.</p><div class="actions"><a class="button secondary" href="/custom/">Ask about a custom print</a></div></div><noscript><p>All designs are shown. Enable JavaScript to use search and filters.</p></noscript></section>',store,'shop','',{description:'Explore the designs. Ask about colours, sizes and finishes. 3D-printed keychains, figures and props, priced in LKR.',path:'/shop/'});
}
function gallerySlides(p) {
  return [{src:p.image,alt:p.imageAlt,width:p.imageWidth,height:p.imageHeight,variants:p.imageVariants||[]},...(p.gallery||[])];
}
function gallery(p) {
  const slides=gallerySlides(p);
  const img=(g,i,sizes)=>'<img src="'+e(g.src)+'" srcset="'+e(srcset(g.variants))+'" sizes="'+sizes+'" alt="'+e(g.alt)+'" width="'+g.width+'" height="'+g.height+'" loading="eager"'+(i===0?' fetchpriority="high"':'')+'>';
  if(slides.length===1)return '<div class="detail-gallery"><div class="detail-image">'+img(slides[0],0,DETAIL_SIZES)+'</div></div>';
  return '<div class="detail-gallery" data-gallery><div class="gallery-track detail-image" tabindex="0" role="region" aria-label="'+e(p.name)+' photos, '+slides.length+' images" data-gallery-track>'+
    slides.map((g,i)=>'<figure class="gallery-slide" id="photo-'+(i+1)+'" data-gallery-slide>'+img(g,i,DETAIL_SIZES)+'</figure>').join('')+'</div>'+
    '<div class="gallery-thumbs" role="group" aria-label="Choose a photo">'+slides.map((g,i)=>'<button type="button" class="gallery-thumb" data-gallery-thumb="'+i+'" aria-label="Show photo '+(i+1)+' of '+slides.length+'"'+(i===0?' aria-current="true"':'')+'>'+img(g,1,THUMB_SIZES)+'</button>').join('')+'</div></div>';
}
export function detail(p,products,store) {
  const ordering=store.mode==='live'&&store.whatsappVerified;
  const crumbs='<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/shop/">Shop</a></li><li><a href="/shop/?category='+encodeURIComponent(p.category)+'">'+e(p.category)+'</a></li><li><span aria-current="page">'+e(p.name)+'</span></li></ol></nav>';
  const facts=[['Category',e(p.category)],['Price',e(price(p))],['Availability',availability(p)],['Reference',e(p.id)]];
  const themes=(p.tags||[]).filter(t=>t!==p.category);
  if(themes.length)facts.splice(1,0,['Themes',themes.map(e).join(', ')]);
  // Same category first, then shared themes, then the rest; catalogue order breaks ties.
  const themesOf=x=>new Set((x.tags||[]).filter(t=>t!==x.category));
  const mine=themesOf(p);
  const score=x=>(x.category===p.category?2:0)+([...themesOf(x)].some(t=>mine.has(t))?1:0);
  const more=products.filter(x=>x.id!==p.id).map((x,i)=>({x,i,s:score(x)})).sort((a,b)=>b.s-a.s||a.i-b.i).slice(0,4).map(o=>o.x);
  // JPEG link preview (WhatsApp and other crawlers that skip WebP).
  const share=p.shareImage||{};
  // Structured data: name, photos and the LKR price only (no availability, ratings or reviews).
  const ld={'@context':'https://schema.org','@type':'Product',name:p.name,image:gallerySlides(p).map(g=>absolute(store,(g.variants.at(-1)||g).src)),...(p.priceLkr===null?{}:{offers:{'@type':'Offer',price:String(p.priceLkr),priceCurrency:'LKR'}})};
  const head='<script type="application/ld+json">'+JSON.stringify(ld).replace(/</g,'\\u003c')+'</script>';
  return layout(p.name,'<section class="wrap section product-section">'+crumbs+'<div class="product-detail">'+gallery(p)+
    '<div class="detail-info"><p class="eyebrow">'+e(p.category)+'</p><h1>'+e(p.name)+'</h1><p class="detail-price" data-testid="product-price">'+e(price(p))+'</p>' +
    '<p class="status-chip status-'+e(p.availability)+'" data-testid="availability"><span aria-hidden="true"></span>'+availability(p)+'</p>' +
    '<p class="lead">'+e(p.description)+'</p>' +
    '<form id="add-form" data-product-id="'+e(p.id)+'"><label>Quantity<input name="quantity" type="number" min="1" max="20" step="1" value="1" required></label><button class="button" type="submit" disabled data-enable="'+(p.availability!=='unavailable')+'" data-testid="add-to-cart">'+(p.availability==='unavailable'?'Currently unavailable':'Add to request cart')+'</button></form>' +
    (ordering?'':'<button class="button secondary order-soon" type="button" disabled data-testid="order-button">Ordering opens soon</button>') +
    '<noscript><p>Enable JavaScript to build a request cart.</p></noscript>' +
    '<p class="fine">The request cart saves a list on your device. It does not reserve stock or complete a purchase.</p>' +
    '<dl class="detail-facts">'+facts.map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('')+'</dl>' +
    '<p class="fine">Confirm size, material, colours and finish before ordering. Delivery cost and timing are included in your quote.</p>' +
    '<a class="text-link" href="/cart/">View your request cart →</a></div></div></section>' +
    (more.length?'<section class="wrap section more-section"><div class="section-heading"><h2>More from HoneyComb 3D</h2><a href="/shop/">View collection →</a></div><div class="product-grid">'+more.map(p=>card(p)).join('')+'</div></section>':''),store,'shop',head,{description:p.description,path:'/products/'+p.slug+'/',image:share.src,imageWidth:share.width,imageHeight:share.height,imageAlt:p.imageAlt});
}
export function cartPage(store) {
  return layout('Your request cart','<section class="wrap section cart-section"><p class="eyebrow">YOUR SELECTION</p><h1>Request cart.</h1><p class="lead">A starting point for your order. We’ll confirm the details together.</p><div id="cart-body"><p>Loading your cart…</p></div><noscript><p>Enable JavaScript to access the cart saved on this device.</p></noscript></section>',store,'cart');
}
export function customPage(store) {
  const attachmentNote=store.mode==='live'&&store.whatsappVerified?'You can attach photos or model files in WhatsApp after opening the conversation. Nothing is uploaded by this form.':'Review and copy your enquiry below. Nothing is uploaded by this form.';
  const helps=['A model or reference link','A rough size','Colours or finish you have in mind','How many you need and how you will use it'];
  return layout('Custom-print enquiry','<section class="wrap section custom-section"><div class="custom-layout"><div class="custom-intro"><p class="eyebrow">LET’S MAKE SOMETHING</p><h1>Start with an idea.</h1><p class="lead">Tell us what you want to print. A model link, rough size and intended use help us prepare a quote.</p>' +
    '<div class="help-card"><h2>What helps us quote</h2><ul class="check-list">'+helps.map(h=>'<li>'+h+'</li>').join('')+'</ul></div>' +
    '<ol class="mini-steps"><li><b>Describe it</b> Share the idea and any references.</li><li><b>Review the draft</b> Check the enquiry before you send it.</li><li><b>Agree the details</b> Price, finish and delivery are confirmed with your quote.</li></ol></div>' +
    '<div class="form-panel"><form id="custom-form" class="enquiry-form"><label>Your idea <span>(required)</span><textarea name="idea" rows="5" maxlength="1200" required placeholder="What would you like to make?"></textarea></label><label>Model or reference link <span>(optional)</span><input name="reference" type="url" maxlength="500" placeholder="https://"></label><div class="field-row"><label>Quantity<input name="quantity" type="number" value="1" min="1" max="1000" step="1" required></label><label>Approximate size <span>(optional)</span><input name="size" maxlength="100" placeholder="For example, 15 cm tall"></label></div><label>Colour / finish <span>(optional)</span><input name="finish" maxlength="150" placeholder="Tell us what you have in mind"></label><p class="fine">'+attachmentNote+'</p><button class="button" type="submit" disabled data-enable="true">Preview enquiry →</button></form><noscript><p>Enable JavaScript to prepare your enquiry.</p></noscript><div id="custom-result"></div></div></div></section>',store,'custom','',{description:'Start a custom 3D-print enquiry with HoneyComb 3D. Share an idea, a model link, size and finish, then review your enquiry before sending it.',path:'/custom/'});
}
export function privacyPage(store) {
  return layout('How this site handles your data','<section class="wrap section narrow prose-page"><p class="eyebrow">PRIVACY</p><h1>Your data on this site.</h1><p>The request cart stores product identifiers and quantities in this browser’s local storage. Remove the items or clear site data to delete it. Cart notes and custom-enquiry fields are not saved by the application.</p><p>This storefront has no account system, payment processing or application analytics. It does not submit your enquiry to a server.</p><p>If you choose to open WhatsApp, your prepared message is included in a link to WhatsApp. Review it there and choose whether to send it. WhatsApp handles that interaction under its own terms.</p><p>Your hosting provider may process ordinary request logs. Business shipping, returns and order terms must be confirmed before purchase.</p></section>',store,'','',{description:'How the HoneyComb 3D storefront handles your data: a request cart in your browser, no accounts, payments or analytics.',path:'/privacy/'});
}
