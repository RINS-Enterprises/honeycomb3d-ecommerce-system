import {CART_KEY, MAX_QUANTITY, MAX_LINES, normalizeCart, readCart, cartSummary, money, escapeHtml as e, orderMessage, whatsappUrl, validateData, visibleProducts} from './domain.mjs';

const status=document.querySelector('#status');
function announce(message) { status.textContent=message; }
let products=[],store={},cart=[],storage;
function updateCount() {
  const count=String(cartSummary(cart,products).count);
  document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=count;el.dataset.count=count;});
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
    (url?'<a class="button" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">Open WhatsApp request ↗</a>':'<p class="notice">Online requests are not open yet. You can copy this draft and keep it for later.</p>')+
    '<button type="button" class="button secondary" data-copy>Copy message</button></div>'+
    (url?'<p class="fine">Opening WhatsApp does not send the message. Review and send it yourself. Your order is only confirmed after HoneyComb agrees on the details.</p>':'')+'</div>';
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('[data-copy]');
  if(!button)return;
  const area=button.closest('.request-preview').querySelector('textarea');
  try { await navigator.clipboard.writeText(area.value); announce('Message copied.'); }
  catch { area.focus();area.select();announce('Automatic copying is unavailable. Copy the selected text manually.'); }
});
function initFilters() {
  const form=document.querySelector('#filters');if(!form)return;
  const search=form.querySelector('#search'), reset=document.querySelector('#reset-filters');
  const choice=name=>form.elements[name]?.value;
  const set=(name,value)=>{const group=form.elements[name];if(!group)return;const fallback=group[0]?.value??group.value;
    group.value=[...(group.length?group:[group])].some(x=>x.value===value)?value:fallback;};
  function readUrl() {
    const params=new URLSearchParams(location.search);
    search.value=(params.get('q')||'').slice(0,100);
    set('category',params.get('category')||'all');set('theme',params.get('theme')||'any');
  }
  function filter(history='') {
    const words=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const category=choice('category')||'all', theme=choice('theme')||'any';
    let count=0;
    document.querySelectorAll('[data-product-card]').forEach(card=>{
      const matches=(category==='all'||card.dataset.category===category)&&(theme==='any'||card.dataset.tags.split('|').includes(theme))&&words.every(w=>card.dataset.search.includes(w));
      card.hidden=!matches;if(matches)count++;
    });
    document.querySelector('#result-count').textContent=count+' '+(count===1?'design':'designs');
    document.querySelector('#no-results').hidden=count>0;
    const active=words.length>0||category!=='all'||theme!=='any';
    reset.hidden=!active;
    if(history) {
      const query=new URLSearchParams();
      if(search.value.trim())query.set('q',search.value.trim());
      if(category!=='all')query.set('category',category);
      if(theme!=='any')query.set('theme',theme);
      const url=location.pathname+(query.size?'?'+query:'');
      // Chip changes add a history entry (Back restores them); typing replaces it.
      try { if(url!==location.pathname+location.search)window.history[history==='push'?'pushState':'replaceState'](null,'',url); } catch {}
    }
  }
  form.addEventListener('submit',event=>{event.preventDefault();filter('replace');});
  search.addEventListener('input',()=>filter('replace'));
  form.addEventListener('change',event=>{if(event.target.type==='radio')filter('push');});
  reset.addEventListener('click',()=>{form.reset();filter('push');search.focus();});
  window.addEventListener('popstate',()=>{readUrl();filter();});
  readUrl();filter();
}
function initAdd() {
  const form=document.querySelector('#add-form');if(!form)return;
  form.addEventListener('submit',event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const quantity=Number(form.elements.quantity.value);
    const product=products.find(p=>p.id===form.dataset.productId);
    if(!product||product.availability==='unavailable')return announce('This item is not available for a request.');
    const existing=cart.find(x=>x.id===product.id);
    if(!existing&&cart.length>=MAX_LINES)return announce('Your request is full. Remove an item before adding another.');
    if((existing?.quantity||0)+quantity>MAX_QUANTITY)return announce('You can request up to '+MAX_QUANTITY+' of this design. Adjust the quantity in your cart.');
    if(existing)existing.quantity+=quantity;else cart.push({id:product.id,quantity});
    announce(product.name+' added to your request cart.');saveCart();
  });
}
function initCart() {
  const root=document.querySelector('#cart-body');if(!root)return;
  let notes='';
  function render(focusKey) {
    const s=cartSummary(cart,products);
    if(!s.lines.length) {
      root.innerHTML='<div class="empty state-panel"><div class="state-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></div><h2>Your cart is empty</h2><p>Find a design you like and add it to start a request.</p><div class="actions"><a class="button" href="/shop/">Shop the collection <span aria-hidden="true">→</span></a><a class="button secondary" href="/custom/">Start a custom enquiry</a></div></div>';
      if(focusKey)root.querySelector('a').focus();return;
    }
    const hasPriced=s.lines.some(x=>x.product.priceLkr!==null);
    root.innerHTML='<div class="cart-lines">'+s.lines.map(({product:p,quantity:q})=>'<article class="cart-line"><div><h2><a href="/products/'+e(p.slug)+'/">'+e(p.name)+'</a></h2><p>'+e(p.priceLkr===null?'Price to confirm':money(p.priceLkr*q))+'</p></div><label>Quantity for '+e(p.name)+'<input data-quantity="'+e(p.id)+'" type="number" min="1" max="20" step="1" value="'+q+'" required></label><button type="button" class="text-button" data-remove="'+e(p.id)+'" aria-label="Remove '+e(p.name)+'">Remove</button></article>').join('')+'</div><div class="cart-summary"><h2>'+(s.unpriced?(hasPriced?'Priced items subtotal: '+e(money(s.knownSubtotal)):'Quote required for all items'):'Estimated items subtotal: '+e(money(s.knownSubtotal)))+'</h2><p>'+(s.unpriced?'Unpriced items are not included in a subtotal. ':'')+'Delivery and the final total will be confirmed with your quote.</p></div><label>Notes <span>(optional)</span><textarea id="order-notes" maxlength="500" rows="3" placeholder="Colours, sizes or anything else we should know">'+e(notes)+'</textarea></label><div id="order-handoff">'+handoff(orderMessage(cart,products,notes))+'</div>';
    if(focusKey) {
      const target=[...root.querySelectorAll('[data-quantity]')].find(x=>x.dataset.quantity===focusKey);
      (target||root.querySelector('[data-quantity]'))?.focus();
    }
    root.querySelector('#order-notes').addEventListener('input',event=>{
      notes=event.target.value;
      root.querySelector('#order-handoff').innerHTML=handoff(orderMessage(cart,products,notes));
    });
  }
  root.addEventListener('change',event=>{
    const input=event.target.closest('[data-quantity]');if(!input)return;
    const item=cart.find(x=>x.id===input.dataset.quantity);
    if(!item)return;
    if(!input.checkValidity()){input.reportValidity();input.value=item.quantity;return;}
    item.quantity=Number(input.value);saveCart();render(item.id);
  });
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-remove]');if(!button)return;
    const id=button.dataset.remove;cart=cart.filter(x=>x.id!==id);saveCart();render(id);announce('Item removed from your cart.');
  });
  render();
}
function initCustom() {
  const form=document.querySelector('#custom-form');if(!form)return;
  const result=document.querySelector('#custom-result');
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
  const mark=index=>thumbs.forEach((t,i)=>{if(i===index)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current');});
  thumbs.forEach((thumb,index)=>thumb.addEventListener('click',()=>{
    track.scrollTo({left:index*track.clientWidth,behavior:reduce.matches?'auto':'smooth'});mark(index);
  }));
  let frame;
  track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>mark(Math.round(track.scrollLeft/track.clientWidth)));},{passive:true});
}
initFilters();initGallery();
try {
  const responses=await Promise.all([fetch('/data/products.json'),fetch('/data/store.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Data unavailable');
  const [all,config]=await Promise.all(responses.map(r=>r.json()));
  validateData(all,config);store=config;products=visibleProducts(all,store);
  try{storage=window.localStorage;}catch{}
  const saved=readCart(storage,products);cart=saved.items;
  if(saved.error)announce('Saved cart unavailable. You can start a new request here.');
  updateCount();
  initAdd();initCart();initCustom();
  document.querySelectorAll('[data-enable="true"]').forEach(button=>button.disabled=false);
} catch {
  announce('We could not load ordering details. Please reload the page to try again.');
  const root=document.querySelector('#cart-body');
  if(root)root.innerHTML='<div class="empty"><h2>Your cart could not load</h2><p>Your saved cart has not been changed.</p><a class="button" href="/cart/">Try again</a></div>';
}
