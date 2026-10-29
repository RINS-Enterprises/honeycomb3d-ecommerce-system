export const MAX_QUANTITY = 20;
export const MAX_LINES = 20;
export const CART_KEY = 'honeycomb.cart.v1';
// One format everywhere (AC-DATA-3): whole rupees without decimals (LKR 4,500), otherwise two decimals (LKR 19.99).
export const money = value => new Intl.NumberFormat('en-LK', {style:'currency',currency:'LKR',minimumFractionDigits:Number.isInteger(value)?0:2,maximumFractionDigits:2}).format(value);
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isHttpsUrl = v => { if (!/^https:\/\/[^\s]+$/.test(v) || v.length > 200) return false; try { const u=new URL(v); return !u.username && !u.password; } catch { return false; } };
// Owner text checks: no control or invisible-only content (a zero-width space is not a name); limits count the trimmed text.
// No regex v flag here: this file ships to browsers (Safari < 17 rejects the whole module); scripts/check.mjs guards it.
const ownerText = (v, max, {lines=false}={}) => typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max && /[^\p{Cf}\p{Z}\s]/u.test(v) && !(lines ? /(?![\n\r\t])\p{Cc}|[\u202a-\u202e\u2066-\u2069]/u : /\p{Cc}|\p{Cf}|\p{Zl}|\p{Zp}/u).test(v.trim());
const sameName = v => v.trim().replace(/\s+/g,' ').toLowerCase();
// A positive LKR amount with at most two decimal places (prices and the delivery fee).
const validLkr = v => Number.isFinite(v) && v > 0 && Number.isSafeInteger(Math.round(v*100)) && Math.abs(Math.round(v*100)-v*100) <= 1e-6;
export function validateData(products, store) {
  if (!Array.isArray(products)) throw new Error('Catalog must be an array');
  if (!['preview','live'].includes(store.mode)) throw new Error('Invalid store mode');
  if (store.searchIndexing !== undefined && typeof store.searchIndexing !== 'boolean') throw new Error('searchIndexing must be true or false');
  if (store.paypalOverseas !== undefined && typeof store.paypalOverseas !== 'boolean') throw new Error('paypalOverseas must be true or false');
  if (store.delivery !== undefined && store.delivery !== null) {
    const d=store.delivery;
    if (typeof d !== 'object' || Array.isArray(d) || Object.keys(d).some(k=>!['text','feeLkr'].includes(k)) || !ownerText(d.text,200)) throw new Error('delivery must be null or {text, feeLkr} with a short owner-given text');
    if (d.feeLkr !== undefined && d.feeLkr !== null && !validLkr(d.feeLkr)) throw new Error('delivery.feeLkr must be null or a positive LKR amount with at most two decimal places');
  }
  if (store.paymentMethods !== undefined) {
    const m=store.paymentMethods;
    if (!Array.isArray(m) || m.length > 6) throw new Error('paymentMethods must be a list of up to six owner-confirmed names');
    for (const x of m) {
      if (!ownerText(x,40)) throw new Error('paymentMethods: '+JSON.stringify(x)+' must be a short, single-line name');
      // PayPal is its own switch (paypalOverseas), so a method of that name would collide with it.
      if (/pay\s*pal/i.test(x)) throw new Error('paymentMethods: '+JSON.stringify(x)+' — use paypalOverseas for PayPal, not a payment method');
      if (sameName(x) === 'not sure yet') throw new Error('paymentMethods: "Not sure yet" is already the cart\'s default choice');
    }
    if (new Set(m.map(x=>sameName(paymentLabel(x)))).size !== m.length) throw new Error('paymentMethods must not list the same method twice');
  }
  if (store.paymentNote !== undefined && store.paymentNote !== null && !ownerText(store.paymentNote,200)) throw new Error('paymentNote must be null or a short owner-given line');
  if (store.social !== undefined) {
    const s=store.social;
    if (!Array.isArray(s) || s.length > 6 || s.some(x=>!x || typeof x !== 'object' || Object.keys(x).some(k=>!['label','url'].includes(k)) || !ownerText(x.label,30) || typeof x.url !== 'string' || !isHttpsUrl(x.url)) || new Set(s.map(x=>new URL(x.url).href)).size !== s.length) throw new Error('social must be a list of up to six distinct {label, url} links with full https:// URLs');
  }
  if (store.pages !== undefined) {
    const pg=store.pages;
    if (!pg || typeof pg !== 'object' || Array.isArray(pg) || Object.keys(pg).some(k=>!TRUST_PAGES.some(t=>t.key===k)) || Object.values(pg).some(v=>v !== null && !ownerText(v,4000,{lines:true}))) throw new Error('pages must map shipping, returns or about to null or the owner\'s text');
  }
  if (store.policies !== undefined && typeof store.policies !== 'boolean') throw new Error('policies must be true or false');
  if (store.contact !== undefined && store.contact !== null) {
    const c=store.contact;
    if (typeof c !== 'object' || Array.isArray(c) || Object.keys(c).some(k=>!['operator','location','email','hours','updated'].includes(k))) throw new Error('contact may only hold operator, location, email, hours and updated');
    for (const k of ['operator','location']) if (c[k] !== undefined && !ownerText(c[k],80)) throw new Error('contact.'+k+' must be a short, single-line name');
    if (c.email !== undefined && !(typeof c.email === 'string' && c.email.length <= 100 && /^[^\s@<>()"',;]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(c.email))) throw new Error('contact.email must be a plain email address');
    if (c.hours !== undefined && c.hours !== null && !ownerText(c.hours,120)) throw new Error('contact.hours must be a short line');
    if (c.updated !== undefined && !(typeof c.updated === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(c.updated) && !Number.isNaN(Date.parse(c.updated)))) throw new Error('contact.updated must be a YYYY-MM-DD date');
  }
  if (store.policies === true) {
    const c=store.contact||{};
    if (!['operator','location','email','updated'].every(k=>c[k])) throw new Error('Policies need contact.operator, location, email and updated');
    if (!store.whatsappVerified) throw new Error('Policies need the verified WhatsApp number as the contact phone');
    if (store.pages?.shipping || store.pages?.returns) throw new Error('Policies replace pages.shipping and pages.returns; set those to null');
  }
  if (store.whatsappVerified && !/^[1-9]\d{7,14}$/.test(store.whatsappNumber || '')) throw new Error('Use a verified international WhatsApp number, digits only');
  const ids = new Set(), slugs = new Set();
  for (const p of products) {
    if (!/^[A-Z0-9-]+$/.test(p.id) || ids.has(p.id)) throw new Error('Invalid or duplicate product ID');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw new Error('Invalid or duplicate slug');
    ids.add(p.id); slugs.add(p.slug);
    for (const k of ['name','category','description','source']) if (typeof p[k] !== 'string' || !p[k].trim()) throw new Error(`Missing ${k}: ${p.id}`);
    if (!Array.isArray(p.tags) || p.tags.some(t=>typeof t !== 'string')) throw new Error('Invalid tags');
    if (p.priceLkr !== null && !validLkr(p.priceLkr)) throw new Error('Price must be null or a positive LKR amount with at most two decimal places');
    if (!['unconfirmed','available','unavailable','made-to-order'].includes(p.availability)) throw new Error('Invalid availability');
    if (p.image !== null && (!/^\/assets\/[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp|svg)$/.test(p.image) || !p.imageAlt)) throw new Error('Image must be local with alt text');
    if (p.imageVariants !== undefined) {
      if (!Array.isArray(p.imageVariants)) throw new Error('Image variants must be an array');
      let previousWidth=0;
      for (const v of p.imageVariants) {
        if (!/^\/assets\/[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/.test(v.src) || (v.avif!==undefined && !/^\/assets\/[a-zA-Z0-9/_-]+\.avif$/.test(v.avif)) || !Number.isInteger(v.width) || !Number.isInteger(v.height) || v.width<=previousWidth || v.height<1) throw new Error('Invalid responsive image variant');
        previousWidth=v.width;
      }
      if (p.image && (!p.imageVariants.length || !p.imageVariants.some(v=>v.src===p.image && v.width===p.imageWidth && v.height===p.imageHeight))) throw new Error('Image dimensions must match its fallback variant');
      if (!p.image && p.imageVariants.length) throw new Error('A placeholder cannot have image variants');
    }
    if (p.gallery !== undefined) {
      if (!Array.isArray(p.gallery) || (!p.image && p.gallery.length)) throw new Error('Invalid gallery');
      for (const g of p.gallery) {
        if (!g.alt || !Array.isArray(g.variants) || !g.variants.some(v=>v.src===g.src && v.width===g.width && v.height===g.height) || g.variants.some(v=>!/^\/assets\/[a-zA-Z0-9/_-]+\.webp$/.test(v.src)||(v.avif!==undefined&&!/^\/assets\/[a-zA-Z0-9/_-]+\.avif$/.test(v.avif)))) throw new Error('Invalid gallery image: '+p.id);
      }
    }
    if (p.shareImage !== undefined && (!/^\/assets\/[a-zA-Z0-9_-]+\.jpg$/.test(p.shareImage.src) || !Number.isInteger(p.shareImage.width) || !Number.isInteger(p.shareImage.height))) throw new Error('Invalid share image: '+p.id);
    if (typeof p.approved !== 'boolean') throw new Error('Missing approval state');
    if (store.mode === 'live' && p.approved && (!p.image || p.availability === 'unconfirmed')) throw new Error(`Approved live product needs an original photo and confirmed availability: ${p.id}`);
  }
  if (store.mode === 'live' && !store.whatsappVerified) throw new Error('Live ordering requires a verified WhatsApp contact');
  if (searchIndexing(store) && !/^https:\/\/[a-z0-9.-]+\/?$/i.test(store.siteUrl || '')) throw new Error('Search indexing needs the site\'s https siteUrl for the sitemap');
}
// Search indexing is its own owner decision, separate from ordering (mode): off unless explicitly true.
export const searchIndexing = store => store.searchIndexing === true;
// Products without an approved original photo stay hidden until their photo is imported.
// PayPal (USD) only for payers outside Sri Lanka: Sri Lankan PayPal accounts can receive cross-border payments only
// (partner-bank launch, May 2026). Off until the owner has proven a test payment arrives.
export const paypalOverseas = store => store.paypalOverseas === true;
// Delivery line: an owner fact, null (off) until the owner gives it. When set it shows on product pages and in the cart;
// a fee, when given, rides as its own line in every order message. Off means the site reads exactly as before.
// Payment methods: owner-confirmed names (e.g. "Bank transfer"), empty (off) until the owner confirms them.
// When set, the live cart offers an optional choice that is written into the order message.
// Entries may be display names or these ids (session C's proposal); ids render as their label.
const PAYMENT_LABELS = {'lankaqr':'LankaQR','bank-transfer':'Bank transfer','cash-on-delivery':'Cash on delivery'};
const paymentLabel = m => PAYMENT_LABELS[m.trim().toLowerCase()] ?? m.trim();
export const paymentMethods = store => Array.isArray(store.paymentMethods) ? store.paymentMethods.map(paymentLabel).filter(Boolean) : [];
// The owner's own line for the cart's payment choice (e.g. how payment details are sent); null keeps the neutral default.
export const paymentNote = store => paymentMethods(store).length && typeof store.paymentNote === 'string' && store.paymentNote.trim() ? store.paymentNote.trim() : null;
// Social links: accounts the owner controls, empty (off) until given. Shown in the footer.
export const socialLinks = store => Array.isArray(store.social) ? store.social.map(x=>({label:x.label.trim(),url:new URL(x.url).href})) : [];
// Trust pages: generated, and linked from the footer, only once the owner has written their text (store.pages.<key>).
export const TRUST_PAGES = [{key:'shipping',slug:'shipping',title:'Shipping and delivery',eyebrow:'SHIPPING'},{key:'returns',slug:'returns',title:'Returns',eyebrow:'RETURNS'},{key:'about',slug:'about',title:'About HoneyComb 3D',eyebrow:'ABOUT'}];
export const trustPages = store => TRUST_PAGES.filter(t=>typeof store.pages?.[t.key] === 'string' && store.pages[t.key].trim()).map(t=>({...t,text:store.pages[t.key].replace(/\r\n?/g,'\n').trim()}));
// Policy pages for payment-gateway review (terms, refunds, shipping, privacy, contact): off until the owner approves the text
// and gives a business email (store.policies + store.contact). Built from data/policies/*.md by src/policies.mjs.
export const POLICY_PAGES = [{slug:'terms',label:'Terms and conditions'},{slug:'refunds',label:'Refunds and cancellations'},{slug:'shipping',label:'Shipping and delivery'},{slug:'privacy',label:'Privacy policy'},{slug:'contact',label:'Contact us'}];
export const policiesOn = store => store.policies === true;
export const delivery = store => store.delivery?.text?.trim() ? {text:store.delivery.text.trim(),feeLkr:store.delivery.feeLkr ?? null} : null;
export const visibleProducts = (products, store) => products.filter(p => p.image && (store.mode !== 'live' || p.approved));
export function filterProducts(products, query='', category='all') {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return products.filter(p => (category==='all' || p.category===category) && words.every(w=>[p.name,p.category,...p.tags].join(' ').toLocaleLowerCase().includes(w)));
}
export function normalizeCart(value, products) {
  if (!Array.isArray(value)) return [];
  const valid = new Set(products.filter(p=>p.availability!=='unavailable').map(p=>p.id));
  const lines = new Map();
  for (const item of value.slice(0,100)) {
    if (!item || !valid.has(item.id) || !Number.isInteger(item.quantity) || item.quantity<1) continue;
    if (!lines.has(item.id) && lines.size>=MAX_LINES) continue;
    lines.set(item.id, Math.min(MAX_QUANTITY,(lines.get(item.id)||0)+item.quantity));
  }
  return [...lines].map(([id,quantity])=>({id,quantity}));
}
export function readCart(storage, products) {
  try { return {items:normalizeCart(JSON.parse(storage.getItem(CART_KEY)||'[]'),products),error:false}; }
  catch { return {items:[],error:true}; }
}
export function cartSummary(items, products) {
  const lines=normalizeCart(items,products).map(item=>({...item,product:products.find(p=>p.id===item.id)}));
  return {lines,count:lines.reduce((n,x)=>n+x.quantity,0),knownSubtotal:lines.reduce((n,x)=>n+(x.product.priceLkr===null?0:Math.round(x.product.priceLkr*100)*x.quantity),0)/100,unpriced:lines.some(x=>x.product.priceLkr===null)};
}
// Cart suggestions: designs sharing themes with the cart (most shared themes first), never already in it and never unavailable.
// On a tie, designs from another category come first (a kunai with a keychain, not a second keychain); catalogue order breaks ties.
// Ranked from the catalogue's own themes only: there is no order history, so nothing here claims what others bought.
export function cartSuggestions(items, products, limit=3) {
  const lines=cartSummary(items,products).lines, inCart=new Set(lines.map(x=>x.id)), categories=new Set(lines.map(x=>x.product.category));
  const themesOf=p=>(p.tags||[]).filter(t=>t!==p.category);
  return products.map((p,i)=>({p,i,shared:inCart.has(p.id)||p.availability==='unavailable'?0:lines.reduce((n,x)=>n+themesOf(x.product).filter(t=>themesOf(p).includes(t)).length,0)}))
    .filter(o=>o.shared).sort((a,b)=>b.shared-a.shared||categories.has(a.p.category)-categories.has(b.p.category)||a.i-b.i).slice(0,limit).map(o=>o.p);
}
export function orderMessage(items, products, notes='', {paypal=false, payment='', deliveryFeeLkr=null}={}) {
  const s=cartSummary(items,products);
  if (!s.lines.length) return '';
  return ['Hello HoneyComb 3D, I would like to request an order.',...s.lines.map(({product:p,quantity:q})=>`- ${p.name} [${p.id}] x ${q}: ${p.priceLkr===null?'price to confirm':money(p.priceLkr*q)}`),s.unpriced?(s.lines.every(x=>x.product.priceLkr===null)?'Quote required for all items. No total is available yet.':`Priced items subtotal: ${money(s.knownSubtotal)}. Other item prices are pending; this is not the full total.`):`Estimated items subtotal: ${money(s.knownSubtotal)}`, deliveryFeeLkr?`Delivery fee: ${money(deliveryFeeLkr)}`:'', `Please confirm availability, options, ${deliveryFeeLkr?'':'delivery cost, '}final total and payment arrangements. This is an order request, not a confirmed purchase.`,paypal?'Payment: I am paying from outside Sri Lanka. Please send a PayPal payment link in USD once the total is confirmed.':payment?`Preferred payment: ${payment}`:'',notes.trim()?`Notes: ${notes.trim().slice(0,500)}`:''].filter(Boolean).join('\n');
}
export function whatsappUrl(message, store) {
  if (!message || !store.whatsappVerified || !/^[1-9]\d{7,14}$/.test(store.whatsappNumber||'')) return null;
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
// One-tap order for a single design (product page and shop cards): live ordering only, never for unavailable designs.
export const orderingOpen = store => store.mode === 'live' && store.whatsappVerified === true;
export const orderNowUrl = (p, store, quantity=1) => orderingOpen(store) && p.availability !== 'unavailable' ? whatsappUrl(orderMessage([{id:p.id,quantity}],[p],'',{deliveryFeeLkr:delivery(store)?.feeLkr}),store) : null;
