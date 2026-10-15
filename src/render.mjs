import {escapeHtml as e, money} from './domain.mjs';

export const price = p => p.priceLkr === null ? 'Price on enquiry' : money(p.priceLkr);
export const CARD_SIZES = '(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 1000px) calc((100vw - 124px) / 3), (max-width: 1280px) calc((100vw - 146px) / 4), 284px';
// Every photo slot is a square frame filled by a square derivative (object-fit: cover).
const DETAIL_SIZES = '(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc((100vw - 110px) / 2), (max-width: 1280px) calc((100vw - 140px) / 2), 570px';
const HERO_LANDSCAPE = '(min-width: 700px)';
const srcset = variants => variants.map(v=>v.src+' '+v.width+'w').join(', ');

export function picture(p, {sizes=CARD_SIZES, loading='lazy', priority=false}={}) {
  if (!p.image) return '';
  const responsive=p.imageVariants?.length ?
    ' srcset="'+e(p.imageVariants.map(v=>v.src+' '+v.width+'w').join(', '))+'" sizes="'+e(sizes)+'"' : '';
  return '<img src="'+e(p.image)+'"'+responsive+' alt="'+e(p.imageAlt)+'" width="'+(p.imageWidth||640)+'" height="'+(p.imageHeight||640)+'" loading="'+loading+'"'+(priority?' fetchpriority="high"':'')+'>';
}
export function card(p, {headingLevel=3}={}) {
  const heading=headingLevel===2?'h2':'h3';
  return '<article class="product-card" data-product-card data-category="' + e(p.category) + '" data-search="' + e([p.name,p.category,...p.tags].join(' ').toLowerCase()) + '">' +
    '<a class="product-image" href="/products/' + e(p.slug) + '/" tabindex="-1" aria-hidden="true">' + picture(p) + '</a>' +
    '<div class="card-copy"><p class="eyebrow">' + e(p.category) + '</p><'+heading+'><a href="/products/' + e(p.slug) + '/">' + e(p.name) + '</a></'+heading+'><p class="price">' + e(price(p)) + '</p><p class="muted">' + availability(p) + '</p></div></article>';
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
export function layout(title, body, store, current='', head='') {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + e(title) + ' | HoneyComb 3D</title><meta name="description" content="Explore HoneyComb 3D collectibles and custom prints. Request a quote and confirm the details before ordering.">' +
    (store.mode==='preview' ? '<meta name="robots" content="noindex,nofollow">' : '') +
    head+'<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script></head><body>' +
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
    '<section class="wrap section"><div class="section-heading"><div><p class="eyebrow">FIND YOUR CORNER</p><h2>Small objects. Big character.</h2></div><a href="/shop/">View collection →</a></div><div class="collection-links">' +
    categories.map((c,i)=>'<a href="/shop/?category='+encodeURIComponent(c)+'"><span class="muted">0'+(i+1)+'</span><strong>'+e(c)+'</strong><span aria-hidden="true">↗</span></a>').join('') +
    '</div><div class="product-grid">' + products.slice(0,4).map(p=>card(p)).join('') + (products.length?'':'<p>Our collection is being updated. You can still explore custom-print enquiries.</p>') + '</div></section>' +
    '<section class="wrap banner-wrap"><div class="custom-banner"><p class="eyebrow">YOUR IDEA, OUR NEXT PRINT</p><h2>Can’t find it?<br>Let’s talk about making it.</h2><p>Share a model link or describe your idea. We’ll confirm what is possible, the finish and the quote.</p><a class="button" href="/custom/">Start a custom enquiry <span aria-hidden="true">→</span></a></div></section>' +
    '<section class="wrap section steps"><div><span>01 / EXPLORE</span><h3>Find your favourites</h3><p>Browse the collection or bring a custom idea.</p></div><div><span>02 / ASK</span><h3>Build your request</h3><p>Choose quantities and tell us the details that matter.</p></div><div><span>03 / CONFIRM</span><h3>Agree on the details</h3><p>Confirm price, availability, delivery and payment before placing an order.</p></div></section>',store,'',head);
}
export function shop(products,store) {
  const categories=[...new Set(products.map(p=>p.category))];
  return layout('Shop','<section class="wrap section"><p class="eyebrow">THE COLLECTION</p><h1>Find your next favourite.</h1><p class="lead">Explore the designs. Ask about colours, sizes and finishes.</p>' +
    '<form class="filters" id="filters" role="search"><label>Search the collection<input type="search" id="search" name="q" placeholder="Try dragons, Naruto, keychains…" maxlength="100"></label><label>Category<select aria-label="Category" id="category" name="category"><option value="all">All categories</option>'+categories.map(c=>'<option value="'+e(c)+'">'+e(c)+'</option>').join('')+'</select></label><button class="button secondary" type="submit">Search</button><button class="text-button" id="reset-filters" type="button">Clear filters</button></form><p class="muted" role="status" id="result-count">'+products.length+' designs</p>' +
    '<div class="product-grid">'+products.map(p=>card(p,{headingLevel:2})).join('')+'</div><div class="empty" id="no-results"'+(products.length?' hidden':'')+'><h2>No matching designs</h2><p>Try a different search or clear your filters.</p><a href="/custom/">Ask about a custom print →</a></div><noscript><p>All designs are shown. Enable JavaScript to use search and category filters.</p></noscript></section>',store,'shop');
}
export function detail(p,products,store) {
  return layout(p.name,'<section class="wrap section"><a class="text-link" href="/shop/">← Back to the collection</a><div class="product-detail"><div class="detail-image">'+picture(p,{sizes:DETAIL_SIZES,loading:'eager'})+'</div><div><p class="eyebrow">'+e(p.category)+'</p><h1>'+e(p.name)+'</h1><p class="detail-price">'+e(price(p))+'</p><p class="lead">'+e(p.description)+'</p><p>'+availability(p)+'</p><p class="muted">Confirm size, material, colours and finish before ordering. Delivery cost and timing are included in your quote.</p>' +
    '<form id="add-form" data-product-id="'+e(p.id)+'"><label>Quantity<input name="quantity" type="number" min="1" max="20" step="1" value="1" required></label><button class="button" type="submit" disabled data-enable="'+(p.availability!=='unavailable')+'">'+(p.availability==='unavailable'?'Currently unavailable':'Add to request cart')+'</button></form><noscript><p>Enable JavaScript to build a request cart.</p></noscript><p class="fine">This saves a request on your device. It does not reserve stock or complete a purchase.</p><p class="fine">Reference: '+e(p.id)+'</p><a href="/cart/">View your request cart →</a></div></div></section><section class="wrap section"><h2>Keep exploring</h2><div class="product-grid">'+products.filter(x=>x.id!==p.id).slice(0,3).map(p=>card(p)).join('')+'</div></section>',store,'shop');
}
export function cartPage(store) {
  return layout('Your request cart','<section class="wrap section narrow"><p class="eyebrow">YOUR SELECTION</p><h1>Request cart.</h1><p class="lead">A starting point for your order. We’ll confirm the details together.</p><div id="cart-body"><p>Loading your cart…</p></div><noscript><p>Enable JavaScript to access the cart saved on this device.</p></noscript></section>',store,'cart');
}
export function customPage(store) {
  const attachmentNote=store.mode==='live'&&store.whatsappVerified?'You can attach photos or model files in WhatsApp after opening the conversation. Nothing is uploaded by this form.':'Review and copy your enquiry below. Nothing is uploaded by this form.';
  return layout('Custom-print enquiry','<section class="wrap section narrow"><p class="eyebrow">LET’S MAKE SOMETHING</p><h1>Start with an idea.</h1><p class="lead">Tell us what you want to print. A model link, rough size and intended use help us prepare a quote.</p><form id="custom-form" class="enquiry-form"><label>Your idea <span>(required)</span><textarea name="idea" rows="5" maxlength="1200" required placeholder="What would you like to make?"></textarea></label><label>Model or reference link <span>(optional)</span><input name="reference" type="url" maxlength="500" placeholder="https://"></label><div class="field-row"><label>Quantity<input name="quantity" type="number" value="1" min="1" max="1000" step="1" required></label><label>Approximate size <span>(optional)</span><input name="size" maxlength="100" placeholder="For example, 15 cm tall"></label></div><label>Colour / finish <span>(optional)</span><input name="finish" maxlength="150" placeholder="Tell us what you have in mind"></label><p class="fine">'+attachmentNote+'</p><button class="button" type="submit" disabled data-enable="true">Preview enquiry →</button></form><noscript><p>Enable JavaScript to prepare your enquiry.</p></noscript><div id="custom-result"></div></section>',store,'custom');
}
export function privacyPage(store) {
  return layout('How this site handles your data','<section class="wrap section narrow"><h1>Your data on this site.</h1><p>The request cart stores product identifiers and quantities in this browser’s local storage. Remove the items or clear site data to delete it. Cart notes and custom-enquiry fields are not saved by the application.</p><p>This storefront has no account system, payment processing or application analytics. It does not submit your enquiry to a server.</p><p>If you choose to open WhatsApp, your prepared message is included in a link to WhatsApp. Review it there and choose whether to send it. WhatsApp handles that interaction under its own terms.</p><p>Your hosting provider may process ordinary request logs. Business shipping, returns and order terms must be confirmed before purchase.</p></section>',store);
}
