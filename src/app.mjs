import {card} from './card.mjs';
import {CART_KEY, MAX_QUANTITY, MAX_LINES, normalizeCart, readCart, cartSummary, money, escapeHtml as e, orderMessage, whatsappUrl, validateData, visibleProducts, paypalOverseas, cartSuggestions, delivery, orderNowUrl, paymentMethods, paymentNote} from './domain.mjs';

const status=document.querySelector('#status');
let toastTimer;
// Status messages are read by assistive tech and shown as a toast that clears itself.
function announce(message) { status.textContent=message; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{status.textContent='';},4500); }
let products=[],store={},cart=[],storage;
function updateCount() {
  const count=String(cartSummary(cart,products).count);
  document.querySelectorAll('[data-cart-count]').forEach(el=>{
    if(el.dataset.count!==count&&el.dataset.count!==undefined&&products.length){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}
    el.textContent=count;el.dataset.count=count;
  });
}
function saveCart() {
  cart=normalizeCart(cart,products);
  try { if(!storage) throw new Error(); storage.setItem(CART_KEY,JSON.stringify(cart)); }
  catch { announce('Your cart works for this page, but this browser could not save it. Keep this page open to copy your request.'); }
  updateCount();
}
function handoff(message) {
  const url=store.mode==='live'?whatsappUrl(message,store):null;
  return '<div class="request-preview"><h2>Review your request</h2><label>Message to HoneyComb<textarea class="message-preview" rows="10" readonly>'+e(message)+'</textarea></label><div class="actions">'+
    (url?'<a class="button" href="'+e(url)+'" target="_blank" rel="noopener noreferrer" data-testid="whatsapp-checkout">Open WhatsApp request ↗</a>':'<p class="notice">Online requests are not open yet. You can copy this draft and keep it for later.</p>')+
    '<button type="button" class="button secondary" data-copy>Copy message</button></div>'+
    (url?'<p class="fine">Opening WhatsApp does not send the message. Review and send it yourself. Your order is only confirmed after HoneyComb agrees on the details.'+(store.policies===true?' By sending an order request you agree to our <a href="/terms/">Terms</a>, <a href="/refunds/">Refund</a>, <a href="/shipping/">Shipping</a> and <a href="/privacy/">Privacy</a> policies.':'')+'</p>':'')+'</div>';
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-copy]');
  if(!button)return;
  const area=button.closest('.request-preview').querySelector('textarea');
  try { await navigator.clipboard.writeText(area.value); announce('Message copied.'); }
  catch { area.focus();area.select();announce('Automatic copying is unavailable. Copy the selected text manually.'); }
});
// Wrap the parts of a name that match the search words in <mark>; every piece is escaped.
function highlight(name,words) {
  const lower=name.toLowerCase(), hit=new Array(name.length).fill(false);
  for(const w of words){let i=lower.indexOf(w);while(w&&i>=0){hit.fill(true,i,i+w.length);i=lower.indexOf(w,i+1);}}
  let html='',i=0;
  while(i<name.length){let j=i;while(j<name.length&&hit[j]===hit[i])j++;html+=hit[i]?'<mark>'+e(name.slice(i,j))+'</mark>':e(name.slice(i,j));i=j;}
  return html;
}
function initFilters() {
  const form=document.querySelector('#filters');if(!form)return;
  const search=form.querySelector('#search'), reset=document.querySelector('#reset-filters'), sort=document.querySelector('#sort');
  const grid=document.querySelector('.product-grid'), cards=[...document.querySelectorAll('[data-product-card]')];
  cards.forEach((card,i)=>card.dataset.order=i);
  const SORTS={
    featured:(a,b)=>a.dataset.order-b.dataset.order,
    // Numeric prices; items without a price always go last.
    'price-asc':(a,b)=>(a.dataset.price===''?Infinity:+a.dataset.price)-(b.dataset.price===''?Infinity:+b.dataset.price)||a.dataset.order-b.dataset.order,
    'price-desc':(a,b)=>(b.dataset.price===''?-Infinity:+b.dataset.price)-(a.dataset.price===''?-Infinity:+a.dataset.price)||a.dataset.order-b.dataset.order,
    name:(a,b)=>a.dataset.name.localeCompare(b.dataset.name,'en')||a.dataset.order-b.dataset.order,
  };
  const tile=grid.querySelector('[data-grid-cta]');
  function applySort(){const order=SORTS[sort?.value]||SORTS.featured;grid.append(...cards.slice().sort(order));if(tile)grid.append(tile);}
  const choice=name=>form.elements[name]?.value;
  const set=(name,value)=>{const group=form.elements[name];if(!group)return;const fallback=group[0]?.value??group.value;
    group.value=[...(group.length?group:[group])].some(x=>x.value===value)?value:fallback;};
  function readUrl() {
    const params=new URLSearchParams(location.search);
    search.value=(params.get('q')||'').slice(0,100);
    set('category',params.get('category')||'all');set('theme',params.get('theme')||'any');
    if(sort)sort.value=SORTS[params.get('sort')]?params.get('sort'):'featured';
  }
  function filter(history='') {
    const words=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const category=choice('category')||'all', theme=choice('theme')||'any';
    let count=0;applySort();
    document.querySelectorAll('[data-product-card]').forEach(card=>{
      const matches=(category==='all'||card.dataset.category===category)&&(theme==='any'||card.dataset.tags.split('|').includes(theme))&&words.every(w=>card.dataset.search.includes(w));
      card.hidden=!matches;if(matches)count++;
      const link=card.querySelector('.card-link');if(link)link.innerHTML=highlight(card.dataset.name,matches?words:[]);
    });
    document.querySelector('#result-count').textContent=count+' '+(count===1?'design':'designs');
    document.querySelector('#no-results').hidden=count>0;
    // Empty state names what was searched (as text, never markup) and offers the categories to browse instead.
    if(!count&&noResultsText)noResultsText.textContent=search.value.trim()?'Nothing matches “'+search.value.trim()+'”'+(category!=='all'||theme!=='any'?' with these filters':'')+'. Try another word, or browse a category.':'No designs match these filters. Clear them, or browse a category.';
    if(tile)tile.hidden=count===0;
    const active=words.length>0||category!=='all'||theme!=='any';
    reset.hidden=!active;
    if(history) {
      const query=new URLSearchParams();
      if(search.value.trim())query.set('q',search.value.trim());
      if(category!=='all')query.set('category',category);
      if(theme!=='any')query.set('theme',theme);
      if(sort&&sort.value!=='featured')query.set('sort',sort.value);
      const url=location.pathname+(query.size?'?'+query:'');
      // Chip changes add a history entry (Back restores them); typing replaces it.
      try { if(url!==location.pathname+location.search)window.history[history==='push'?'pushState':'replaceState'](null,'',url); } catch {}
    }
  }
  const clear=form.querySelector('[data-search-clear]'), box=search.closest('.search-box');
  const noResultsText=document.querySelector('[data-no-results-text]');
  document.querySelectorAll('[data-try-category]').forEach(button=>button.addEventListener('click',()=>{
    search.value='';set('category',button.dataset.tryCategory);set('theme','any');syncClear();filter('push');
    document.querySelector('[data-product-card]:not([hidden]) .card-link')?.focus();
  }));
  const syncClear=()=>{const filled=search.value!=='';clear.hidden=!filled;box.classList.toggle('is-filled',filled);};
  form.addEventListener('submit',event=>{event.preventDefault();filter('replace');});
  search.addEventListener('input',()=>{syncClear();filter('replace');});
  clear.addEventListener('click',()=>{search.value='';syncClear();filter('replace');search.focus();});
  // "/" jumps to search unless you are already typing somewhere.
  document.addEventListener('keydown',event=>{
    if(event.key!=='/'||event.ctrlKey||event.metaKey||event.altKey||event.defaultPrevented)return;
    const t=event.target;if(t.closest?.('input,textarea,select,[contenteditable=""],[contenteditable="true"]'))return;
    event.preventDefault();search.focus();search.select();
  });
  form.addEventListener('change',event=>{if(event.target.type==='radio')filter('push');});
  sort?.addEventListener('change',()=>filter('push'));
  reset.addEventListener('click',()=>{form.reset();if(sort)sort.value='featured';syncClear();filter('push');search.focus();});
  window.addEventListener('popstate',()=>{readUrl();syncClear();filter();});
  readUrl();syncClear();filter();
}
// Recently viewed: the last few product ids on this device, newest first.
const RECENT_KEY='honeycomb-recent-v1',RECENT_SHOWN=4,RECENT_KEPT=5;
function initRecent() {
  const section=document.querySelector('[data-recent]');if(!section||!storage)return;
  const current=section.dataset.recentCurrent||'';
  let ids=[];
  try{const saved=JSON.parse(storage.getItem(RECENT_KEY)||'[]');if(Array.isArray(saved))ids=saved.filter(id=>typeof id==='string');}catch{}
  const known=new Set(products.map(p=>p.id));
  ids=ids.filter(id=>known.has(id));
  const shown=ids.filter(id=>id!==current).slice(0,RECENT_SHOWN).map(id=>products.find(p=>p.id===id));
  if(current){try{storage.setItem(RECENT_KEY,JSON.stringify([current,...ids.filter(id=>id!==current)].slice(0,RECENT_KEPT)));}catch{}}
  if(!shown.length)return;
  section.querySelector('[data-recent-list]').innerHTML=shown.map(p=>card(p,{store})).join('');
  section.hidden=false;
  reveal(section);armAltPhotos(section);
  section.querySelector('[data-recent-clear]').addEventListener('click',()=>{
    try{storage.setItem(RECENT_KEY,JSON.stringify(current?[current]:[]));}catch{}
    section.hidden=true;announce('Recently viewed list cleared.');
  });
}
// Reveal: content below the first screen fades up 8px the first time it scrolls into view.
// Transform and opacity only (no layout shift); skipped under reduced motion or without IntersectionObserver.
const REVEAL='.product-card,.grid-cta,.category-tile,.how-steps>li,.section-heading,.custom-banner,.studio-strip>*';
let revealer=null;
function reveal(root=document) {
  if(!revealer)return;
  const fold=innerHeight;
  root.querySelectorAll(REVEAL).forEach(el=>{
    if(el.dataset.revealed||el.getBoundingClientRect().top<fold)return;
    el.dataset.revealed='pending';el.classList.add('reveal');revealer.observe(el);
  });
}
function initReveal() {
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  revealer=new IntersectionObserver(entries=>{
    const batch=entries.filter(x=>x.isIntersecting).map(x=>x.target);
    batch.forEach((el,i)=>{
      revealer.unobserve(el);el.dataset.revealed='done';
      el.style.transitionDelay=Math.min(i,5)*60+'ms';
      el.classList.add('is-in');
      const done=()=>{el.classList.remove('reveal','is-in');el.style.transitionDelay='';};
      el.addEventListener('transitionend',done,{once:true});setTimeout(done,1200);
    });
  },{rootMargin:'0px 0px -6% 0px'});
  reveal();
}
// Card hover photo: on hover-capable devices, cards with a gallery cross-fade to their second photo.
// The <img> is created only when the card nears the viewport or is first hovered.
let altLoader=null;
function loadAltPhoto(frame) {
  if(frame.dataset.altLoaded)return;frame.dataset.altLoaded='1';altLoader?.unobserve(frame);
  const img=new Image();img.className='card-alt';img.alt=frame.dataset.altText||'';img.setAttribute('aria-hidden','true');img.decoding='async';
  img.sizes=frame.querySelector('img')?.sizes||'';img.srcset=frame.dataset.altSrcset;img.src=frame.dataset.altSrc;
  img.width=640;img.height=640;
  img.addEventListener('load',()=>frame.classList.add('has-alt'),{once:true});
  frame.append(img);
}
function armAltPhotos(root=document) {
  if(!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches)return;
  if(!altLoader&&'IntersectionObserver' in window)altLoader=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting)loadAltPhoto(x.target);}),{rootMargin:'200px 0px'});
  root.querySelectorAll('[data-alt-srcset]:not([data-alt-armed])').forEach(frame=>{
    frame.dataset.altArmed='1';
    frame.closest('.product-card')?.addEventListener('pointerenter',()=>loadAltPhoto(frame),{once:true});
    altLoader?.observe(frame);
  });
}
// Shared by the product page form and the cards' quick-add buttons.
function addToCart(product,quantity) {
  if(!product||product.availability==='unavailable'){announce('This item is not available for a request.');return false;}
  const existing=cart.find(x=>x.id===product.id);
  if(!existing&&cart.length>=MAX_LINES){announce('Your request is full. Remove an item before adding another.');return false;}
  if((existing?.quantity||0)+quantity>MAX_QUANTITY){announce('You can request up to '+MAX_QUANTITY+' of this design. Adjust the quantity in your cart.');return false;}
  if(existing)existing.quantity+=quantity;else cart.push({id:product.id,quantity});
  announce(product.name+' added to your request cart.');saveCart();
  document.dispatchEvent(new CustomEvent('cart:change',{detail:{id:product.id}}));return true;
}
// Quick add is delegated so cards rendered later (recently viewed, empty-cart picks) work too.
function armQuickAdd(root=document) {
  root.querySelectorAll('[data-quick-add]').forEach(button=>{
    const product=products.find(p=>p.id===button.dataset.quickAdd);
    if(product&&product.availability!=='unavailable')button.hidden=false;
  });
}
function initQuickAdd() {
  armQuickAdd();
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-quick-add]');if(!button||button.hidden)return;
    if(addToCart(products.find(p=>p.id===button.dataset.quickAdd),1)){button.classList.remove('is-added');void button.offsetWidth;button.classList.add('is-added');}
  });
}
function initAdd() {
  const form=document.querySelector('#add-form');if(!form)return;
  const orderNow=[...document.querySelectorAll('[data-order-now]')];
  if(orderNow.length) {
    // The links always carry the quantity on screen. An invalid quantity blocks the tap and shows why,
    // like Add to request cart, instead of silently sending the last valid number.
    const field=form.elements.quantity;
    const sync=()=>{
      const valid=field.checkValidity();
      const product=products.find(p=>p.id===form.dataset.productId);
      const url=valid&&product&&orderNowUrl(product,store,Number(field.value));
      orderNow.forEach(link=>{if(url)link.href=url;link.toggleAttribute('data-invalid',!url);});
    };
    ['input','change'].forEach(type=>field.addEventListener(type,sync));
    addEventListener('pageshow',sync);
    sync();
    orderNow.forEach(link=>link.addEventListener('click',event=>{
      if(!link.hasAttribute('data-invalid'))return;
      event.preventDefault();form.reportValidity();
    }));
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const quantity=Number(form.elements.quantity.value);
    const product=products.find(p=>p.id===form.dataset.productId);
    if(!addToCart(product,quantity))return;
    const button=form.querySelector('button[type="submit"]');
    clearTimeout(button.resetTimer);button.dataset.state='added';button.textContent='Added to cart ✓';
    button.resetTimer=setTimeout(()=>{button.textContent='Add to request cart';delete button.dataset.state;},1800);
  });
}
function initCart() {
  const root=document.querySelector('#cart-body');if(!root)return;
  let notes='',paypal=false,payment='';
  // Payment choice (owner switch, live only): radios for the owner's methods, with PayPal as one of them when that switch is on.
  // Without methods the PayPal checkbox stays exactly as before.
  const methods=store.mode==='live'?paymentMethods(store):[];
  const shipping=delivery(store);
  const paypalOn=store.mode==='live'&&paypalOverseas(store);
  const message=()=>orderMessage(cart,products,notes,{paypal:paypalOn&&(methods.length?payment==='paypal':paypal),payment:methods.includes(payment)?payment:'',deliveryFeeLkr:shipping?.feeLkr});
  const paymentChoice=()=>'<fieldset class="cart-payment" data-testid="cart-payment"><legend>How would you like to pay? <span>(optional)</span></legend>'+
    [['','Not sure yet',''],...methods.map(m=>[m,m,'']),...(paypalOn?[['paypal','PayPal link in USD, paying from outside Sri Lanka','We send it in WhatsApp after we confirm your total. Payments from Sri Lankan PayPal accounts are not supported.']]:[])].map(([value,label,help],i)=>
    '<label class="cart-choice"><input type="radio" name="order-payment" data-payment-index="'+i+'"'+(help?' aria-describedby="payment-help-'+i+'"':'')+(payment===value?' checked':'')+'><span>'+e(label)+(help?'<small id="payment-help-'+i+'" aria-hidden="true">'+e(help)+'</small>':'')+'</span></label>').join('')+
    '<p class="fine" data-testid="cart-payment-note">'+e(paymentNote(store)||'Payment arrangements are confirmed with your quote.')+'</p></fieldset>';
  const paymentValues=()=>['',...methods,...(paypalOn?['paypal']:[])];
  function render(focusKey) {
    const s=cartSummary(cart,products);
    if(!s.lines.length) {
      root.innerHTML='<div class="empty state-panel"><div class="state-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></div><h2>Your cart is empty</h2><p>Find a design you like and add it to start a request.</p><div class="actions"><a class="button" href="/shop/">Shop the collection <span aria-hidden="true">→</span></a><a class="button secondary" href="/custom/">Start a custom enquiry</a></div></div>';
      // Nothing in the cart and no recently viewed row: offer a few designs to start from.
      const recent=document.querySelector('[data-recent]');
      if((!recent||recent.hidden)&&products.length){
        root.insertAdjacentHTML('beforeend','<section class="empty-picks" aria-labelledby="picks-title" data-testid="cart-picks"><div class="section-heading"><h2 id="picks-title">A few to start with</h2><a href="/shop/">View collection →</a></div><div class="product-grid">'+products.filter(p=>p.availability!=='unavailable').slice(0,4).map(p=>card(p,{store})).join('')+'</div></section>');
        armQuickAdd(root);reveal(root);armAltPhotos(root);
      }
      if(focusKey)root.querySelector('a').focus();return;
    }
    const hasPriced=s.lines.some(x=>x.product.priceLkr!==null);
    const thumb=p=>{const v=(p.imageVariants||[]).filter(x=>x.width>=160);if(!p.image)return '';
      return '<img src="'+e((v[0]||p).src||p.image)+'" srcset="'+e(v.map(x=>x.src+' '+x.width+'w').join(', '))+'" sizes="80px" alt="'+e(p.imageAlt)+'" width="'+(v[0]?.width||p.imageWidth)+'" height="'+(v[0]?.height||p.imageHeight)+'" loading="lazy">';};
    const lines=s.lines.map(({product:p,quantity:q})=>'<article class="cart-line" data-testid="cart-line"><a class="cart-thumb" href="/products/'+e(p.slug)+'/" tabindex="-1" aria-hidden="true">'+thumb(p)+'</a>'+
      '<div class="cart-line-copy"><h2><a href="/products/'+e(p.slug)+'/">'+e(p.name)+'</a></h2><p class="muted">'+e(p.priceLkr===null?'Price to confirm':money(p.priceLkr)+' each')+'</p>'+
      '<button type="button" class="text-button" data-remove="'+e(p.id)+'" data-testid="cart-remove" aria-label="Remove '+e(p.name)+'">Remove</button></div>'+
      '<div class="cart-line-end"><div class="stepper"><button type="button" data-step="-1" data-id="'+e(p.id)+'" data-testid="cart-qty-decrease" aria-label="Decrease quantity of '+e(p.name)+'"'+(q<=1?' disabled':'')+'>−</button>'+
      '<label><span class="sr-only">Quantity for '+e(p.name)+'</span><input data-quantity="'+e(p.id)+'" data-testid="cart-qty" type="number" inputmode="numeric" min="1" max="'+MAX_QUANTITY+'" step="1" value="'+q+'" required></label>'+
      '<button type="button" data-step="1" data-id="'+e(p.id)+'" data-testid="cart-qty-increase" aria-label="Increase quantity of '+e(p.name)+'"'+(q>=MAX_QUANTITY?' disabled':'')+'>+</button></div>'+
      '<p class="cart-line-total">'+e(p.priceLkr===null?'To confirm':money(p.priceLkr*q))+'</p></div></article>').join('');
    // A full cart cannot take another line, so it gets no suggestions.
    const picks=cart.length>=MAX_LINES?[]:cartSuggestions(cart,products);
    const suggest=picks.length?'<section class="cart-suggest" aria-labelledby="suggest-title" data-testid="cart-suggestions"><h2 id="suggest-title">Goes well with your request</h2><ul>'+picks.map(p=>'<li class="suggest-item" data-testid="cart-suggestion"><a class="cart-thumb" href="/products/'+e(p.slug)+'/" tabindex="-1" aria-hidden="true">'+thumb(p)+'</a><div><h3><a href="/products/'+e(p.slug)+'/">'+e(p.name)+'</a></h3><p class="muted">'+e(p.priceLkr===null?'Price to confirm':money(p.priceLkr))+'</p></div>'+
      '<button type="button" class="quick-add" data-quick-add="'+e(p.id)+'" data-testid="suggestion-add" aria-label="Add '+e(p.name)+' to request cart"><span aria-hidden="true">+</span> Add</button></li>').join('')+'</ul></section>':'';
    root.innerHTML='<div class="cart-layout"><div class="cart-main"><div class="cart-lines">'+lines+'</div>'+
      '<label class="cart-notes">Notes <span>(optional)</span><textarea id="order-notes" maxlength="500" rows="3" placeholder="Colours, sizes or anything else we should know">'+e(notes)+'</textarea></label>'+
      (methods.length?paymentChoice():'')+(!methods.length&&paypalOn?'<div class="cart-paypal"><input type="checkbox" id="order-paypal" data-testid="cart-paypal" aria-describedby="order-paypal-help"'+(paypal?' checked':'')+'><div><label for="order-paypal">Paying from outside Sri Lanka? Ask for a PayPal link in USD.</label><small id="order-paypal-help">We send it in WhatsApp after we confirm your total. Payments from Sri Lankan PayPal accounts are not supported.</small></div></div>':'')+suggest+'</div>'+
      '<aside class="cart-aside" aria-label="Request summary"><div class="cart-summary"><p class="eyebrow">Summary</p><dl class="summary-rows"><div><dt>Items</dt><dd>'+s.count+'</dd></div><div><dt>Delivery</dt><dd data-testid="cart-delivery-fee">'+(shipping?.feeLkr?e(money(shipping.feeLkr)):'Confirmed with your quote')+'</dd></div></dl>'+(shipping?'<p class="fine cart-delivery" data-testid="cart-delivery">'+e(shipping.text)+'</p>':'')+
      '<h2 data-testid="cart-subtotal">'+(s.unpriced?(hasPriced?'Priced items subtotal: '+e(money(s.knownSubtotal)):'Quote required for all items'):'Estimated items subtotal: '+e(money(s.knownSubtotal)))+'</h2><p>'+(s.unpriced?'Unpriced items are not included in a subtotal. ':'')+(shipping?'The final total will be confirmed with your quote.':'Delivery and the final total will be confirmed with your quote.')+'</p></div>'+
      '<div id="order-handoff">'+handoff(message())+'</div></aside></div>';
    if(focusKey) {
      const [id,kind]=String(focusKey).split(':');
      const target=kind?root.querySelector('[data-step="'+kind+'"][data-id="'+CSS.escape(id)+'"]:not(:disabled)'):null;
      (target||[...root.querySelectorAll('[data-quantity]')].find(x=>x.dataset.quantity===id)||root.querySelector('[data-quantity]'))?.focus();
    }
    root.querySelector('#order-notes').addEventListener('input',event=>{
      notes=event.target.value;
      root.querySelector('#order-handoff').innerHTML=handoff(message());
    });
    root.querySelector('#order-paypal')?.addEventListener('change',event=>{
      paypal=event.target.checked;
      root.querySelector('#order-handoff').innerHTML=handoff(message());
    });
    root.querySelector('[data-testid="cart-payment"]')?.addEventListener('change',event=>{
      payment=paymentValues()[Number(event.target.dataset.paymentIndex)]??'';
      root.querySelector('#order-handoff').innerHTML=handoff(message());
    });
  }
  document.addEventListener('cart:change',event=>render(event.detail.id));
  root.addEventListener('change',event=>{
    const input=event.target.closest('[data-quantity]');if(!input)return;
    const item=cart.find(x=>x.id===input.dataset.quantity);
    if(!item)return;
    if(!input.checkValidity()){input.reportValidity();input.value=item.quantity;return;}
    item.quantity=Number(input.value);saveCart();render(item.id);
  });
  root.addEventListener('click',event=>{
    const step=event.target.closest('[data-step]');
    if(step) {
      const item=cart.find(x=>x.id===step.dataset.id);if(!item)return;
      const next=item.quantity+Number(step.dataset.step);
      if(next<1||next>MAX_QUANTITY)return;
      item.quantity=next;saveCart();render(item.id+':'+step.dataset.step);announce('Quantity updated to '+next+'.');return;
    }
    const button=event.target.closest('[data-remove]');if(!button)return;
    const id=button.dataset.remove;cart=cart.filter(x=>x.id!==id);saveCart();render(id);announce('Item removed from your cart.');
  });
  render();
}
function initCustom() {
  const form=document.querySelector('#custom-form');if(!form)return;
  const result=document.querySelector('#custom-result');
  // Arriving from a product page (?design=ID) starts the idea with that design; values only, never markup.
  const design=products.find(p=>p.id===new URLSearchParams(location.search).get('design'));
  if(design&&!form.elements.idea.value){
    form.elements.idea.value='A variation of '+design.name+' ('+design.id+'): ';
    const note=document.querySelector('[data-design-note]');
    if(note){note.querySelector('a').href='/products/'+design.slug+'/';note.querySelector('a').textContent=design.name;note.hidden=false;}
  }
  form.addEventListener('input',()=>{result.replaceChildren();});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const d=new FormData(form),idea=String(d.get('idea')).trim(),reference=String(d.get('reference')).trim();
    if(!idea){form.elements.idea.setCustomValidity('Describe your idea first.');form.elements.idea.reportValidity();return;}
    if(reference&&!/^https?:\/\//i.test(reference)){form.elements.reference.setCustomValidity('Use an http or https link.');form.elements.reference.reportValidity();return;}
    const message=['Hello HoneyComb 3D, I would like a custom-print quote.','Idea: '+idea,reference?'Reference: '+reference:'','Quantity: '+d.get('quantity'),d.get('size')?'Size: '+d.get('size'):'',d.get('finish')?'Colour / finish: '+d.get('finish'):'','Please confirm feasibility, price, availability, delivery and payment arrangements. This is an enquiry, not a confirmed purchase.'].filter(Boolean).join('\n');
    result.innerHTML=handoff(message);result.querySelector('textarea').focus();
  });
  ['idea','reference'].forEach(name=>form.elements[name].addEventListener('input',()=>form.elements[name].setCustomValidity('')));
}
function initGallery() {
  // Thumbnails steer a scroll-snap track; swiping the track updates the current thumbnail.
  const root=document.querySelector('[data-gallery]');if(!root)return;
  const track=root.querySelector('[data-gallery-track]'), thumbs=[...root.querySelectorAll('[data-gallery-thumb]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const dots=[...root.querySelectorAll('[data-gallery-dots] > span:not(.gallery-count)')], index=root.querySelector('[data-gallery-index]');
  const mark=current=>{
    thumbs.forEach((t,i)=>{if(i===current)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current');});
    dots.forEach((d,i)=>d.classList.toggle('is-current',i===current));if(index)index.textContent=String(current+1);
  };
  thumbs.forEach((thumb,index)=>thumb.addEventListener('click',()=>{
    track.scrollTo({left:index*track.clientWidth,behavior:reduce.matches?'auto':'smooth'});mark(index);
  }));
  let frame;
  track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>mark(Math.round(track.scrollLeft/track.clientWidth)));},{passive:true});
}
function initLightbox() {
  // Larger photos in a native <dialog>: tap or click to zoom 2x and pan by scrolling; arrows step through.
  const root=document.querySelector('[data-photos]');if(!root||!window.HTMLDialogElement)return;
  const photos=JSON.parse(root.dataset.photos), opener=root.querySelector('[data-zoom-open]');
  const track=root.querySelector('[data-gallery-track]');
  const dialog=document.createElement('dialog');dialog.className='lightbox';dialog.setAttribute('aria-label','Product photos');
  dialog.innerHTML='<div class="lightbox-bar"><p class="lightbox-count" aria-live="polite"></p><button type="button" class="lightbox-close" data-close>Close</button></div><div class="lightbox-stage" data-stage></div>'+
    (photos.length>1?'<div class="lightbox-nav"><button type="button" data-step="-1">Previous photo</button><button type="button" data-step="1">Next photo</button></div>':'')+
    '<p class="lightbox-hint">Tap the photo to zoom. Press Esc to close.</p>';
  document.body.append(dialog);
  const stage=dialog.querySelector('[data-stage]');let index=0;
  function show(i) {
    index=(i+photos.length)%photos.length;const photo=photos[index];
    const img=document.createElement('img');img.srcset=photo.srcset;img.src=photo.src;img.alt=photo.alt;img.sizes='min(100vw, 1200px)';
    stage.classList.remove('is-zoomed');stage.replaceChildren(img);
    dialog.querySelector('.lightbox-count').textContent='Photo '+(index+1)+' of '+photos.length;
  }
  const current=()=>track?Math.round(track.scrollLeft/track.clientWidth):0;
  const open=()=>{show(current());dialog.showModal();dialog.querySelector('[data-close]').focus();};
  opener.hidden=false;opener.addEventListener('click',open);
  root.querySelectorAll('.detail-image img').forEach(img=>{img.style.cursor='zoom-in';img.addEventListener('click',open);});
  stage.addEventListener('click',event=>{
    const zoomed=stage.classList.toggle('is-zoomed');
    if(zoomed){const r=stage.getBoundingClientRect();stage.scrollTo((event.clientX-r.left)/r.width*stage.scrollWidth-r.width/2,(event.clientY-r.top)/r.height*stage.scrollHeight-r.height/2);}
  });
  dialog.addEventListener('click',event=>{
    if(event.target.closest('[data-close]'))dialog.close();
    const step=event.target.closest('[data-step]');if(step)show(index+Number(step.dataset.step));
    if(event.target===dialog)dialog.close();
  });
  dialog.addEventListener('keydown',event=>{if(photos.length>1&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1));}});
  dialog.addEventListener('close',()=>{stage.replaceChildren();opener.focus();});
}
function initStickyBuy() {
  // Phones: when the main add button scrolls away, a bottom bar keeps name, price and the add button in reach.
  const bar=document.querySelector('[data-sticky-buy]'), form=document.querySelector('#add-form');
  if(!bar||!form)return;
  const footer=document.querySelector('.site-footer'), narrow=matchMedia('(max-width: 699px)');
  bar.hidden=false;
  // Positions, not IntersectionObserver: a fast fling can jump the form from below to above the
  // viewport without it ever intersecting, and the observer would then never report.
  function update() {
    const scrolledPast=form.getBoundingClientRect().bottom<0;
    const footerShown=footer?footer.getBoundingClientRect().top<innerHeight:false;
    const show=narrow.matches&&scrolledPast&&!footerShown&&!form.querySelector('button[type="submit"]').disabled;
    bar.classList.toggle('is-visible',show);bar.inert=!show;document.body.classList.toggle('has-sticky-buy',show);
  }
  let frame;
  addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
  addEventListener('resize',update);
  narrow.addEventListener('change',update);
  bar.querySelector('[data-sticky-add]')?.addEventListener('click',()=>form.requestSubmit());
  update();
}
function initShare() {
  const row=document.querySelector('[data-share-row]');if(!row)return;
  const {url,title}=row.dataset;
  const native=row.querySelector('[data-share]'), copy=row.querySelector('[data-copy-link]');
  if(navigator.share) {
    native.hidden=false;row.querySelectorAll('[data-share-fallback]').forEach(el=>el.hidden=true);
    native.addEventListener('click',async()=>{try{await navigator.share({title,text:title,url});}catch(error){if(error?.name!=='AbortError')announce('Sharing is unavailable here. Copy the address bar link instead.');}});
  } else if(navigator.clipboard) {
    copy.hidden=false;
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);announce('Link copied. Paste it anywhere to share this design.');}catch{announce('Copying is unavailable here. Copy the address bar link instead.');}});
  }
}
function initHeader() {
  const header=document.querySelector('.site-header');if(!header)return;
  const update=()=>header.classList.toggle('is-scrolled',scrollY>8);
  addEventListener('scroll',update,{passive:true});update();
}
// Scrollable chip rows fade at whichever edge has more chips beyond it.
function initChipFades() {
  document.querySelectorAll('.chips').forEach(row=>{
    const update=()=>{const max=row.scrollWidth-row.clientWidth;row.classList.toggle('fade-start',row.scrollLeft>2);row.classList.toggle('fade-end',max>2&&row.scrollLeft<max-2);};
    row.addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  });
}
initHeader();initChipFades();armAltPhotos();initFilters();initGallery();initShare();initLightbox();initStickyBuy();initReveal();
try {
  const responses=await Promise.all([fetch('/data/products.json'),fetch('/data/store.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Data unavailable');
  const [all,config]=await Promise.all(responses.map(r=>r.json()));
  validateData(all,config);store=config;products=visibleProducts(all,store);
  try{storage=window.localStorage;}catch{}
  const saved=readCart(storage,products);cart=saved.items;
  if(saved.error)announce('Saved cart unavailable. You can start a new request here.');
  updateCount();
  initRecent();initAdd();initQuickAdd();initCart();initCustom();
  document.querySelectorAll('[data-enable="true"]').forEach(button=>button.disabled=false);
} catch {
  announce('We could not load ordering details. Please reload the page to try again.');
  const root=document.querySelector('#cart-body');
  if(root)root.innerHTML='<div class="empty"><h2>Your cart could not load</h2><p>Your saved cart has not been changed.</p><a class="button" href="/cart/">Try again</a></div>';
}
