import {CART_KEY, MAX_QUANTITY, MAX_LINES, normalizeCart, readCart, cartSummary, money, escapeHtml as e, orderMessage, whatsappUrl, validateData, visibleProducts} from './domain.mjs';

const status=document.querySelector('#status');
function announce(message) { status.textContent=message; }
let products=[],store={},cart=[],storage;
function saveCart() {
  cart=normalizeCart(cart,products);
  try { if(!storage) throw new Error(); storage.setItem(CART_KEY,JSON.stringify(cart)); }
  catch { announce('Your cart works for this page, but this browser could not save it. Keep this page open to copy your request.'); }
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartSummary(cart,products).count);
}
function handoff(message) {
  const url=store.mode==='live'?whatsappUrl(message,store):null;
  return '<div class="request-preview"><h2>Review your request</h2><label>Message to HoneyComb<textarea class="message-preview" rows="10" readonly>'+e(message)+'</textarea></label><div class="actions">'+
    (url?'<a class="button" href="'+e(url)+'" target="_blank" rel="noopener noreferrer">Open WhatsApp request ↗</a>':'<p class="notice">Online requests are not open yet. You can copy this draft and keep it for later.</p>')+
    '<button type="button" class="button secondary" data-copy>Copy message</button></div><p class="fine">Opening WhatsApp does not send the message. Review and send it yourself. Your order is only confirmed after HoneyComb agrees on the details.</p></div>';
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
  const search=form.querySelector('#search'), category=form.querySelector('#category');
  const params=new URLSearchParams(location.search);
  search.value=(params.get('q')||'').slice(0,100);
  const initialCategory=params.get('category');
  if([...category.options].some(x=>x.value===initialCategory))category.value=initialCategory;
  function filter(update=true) {
    const words=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count=0;
    document.querySelectorAll('[data-product-card]').forEach(card=>{
      const matches=(category.value==='all'||card.dataset.category===category.value)&&words.every(w=>card.dataset.search.includes(w));
      card.hidden=!matches;if(matches)count++;
    });
    document.querySelector('#result-count').textContent=count+' '+(count===1?'design':'designs');
    document.querySelector('#no-results').hidden=count>0;
    if(update) {
      const query=new URLSearchParams();
      if(search.value.trim())query.set('q',search.value.trim());
      if(category.value!=='all')query.set('category',category.value);
      try { history.replaceState(null,'',location.pathname+(query.size?'?'+query:'')); } catch {}
    }
  }
  form.addEventListener('submit',event=>{event.preventDefault();filter();});
  search.addEventListener('input',()=>filter());
  category.addEventListener('change',()=>filter());
  document.querySelector('#reset-filters').addEventListener('click',()=>{form.reset();filter();search.focus();});
  filter(false);
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
      root.innerHTML='<div class="empty"><h2>Your cart is empty</h2><p>Find a design you like and add it to start a request.</p><a class="button" href="/shop/">Explore the collection →</a></div>';
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
initFilters();
try {
  const responses=await Promise.all([fetch('/data/products.json'),fetch('/data/store.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Data unavailable');
  const [all,config]=await Promise.all(responses.map(r=>r.json()));
  validateData(all,config);store=config;products=visibleProducts(all,store);
  try{storage=window.localStorage;}catch{}
  const saved=readCart(storage,products);cart=saved.items;
  if(saved.error)announce('Saved cart unavailable. You can start a new request here.');
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartSummary(cart,products).count);
  initAdd();initCart();initCustom();
  document.querySelectorAll('[data-enable="true"]').forEach(button=>button.disabled=false);
} catch {
  announce('We could not load ordering details. Please reload the page to try again.');
  const root=document.querySelector('#cart-body');
  if(root)root.innerHTML='<div class="empty"><h2>Your cart could not load</h2><p>Your saved cart has not been changed.</p><a class="button" href="/cart/">Try again</a></div>';
}
