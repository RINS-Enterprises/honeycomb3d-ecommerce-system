export const MAX_QUANTITY = 20;
export const MAX_LINES = 20;
export const CART_KEY = 'honeycomb.cart.v1';
export const money = value => new Intl.NumberFormat('en-LK', {style:'currency',currency:'LKR'}).format(value);
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateData(products, store) {
  if (!Array.isArray(products)) throw new Error('Catalog must be an array');
  if (!['preview','live'].includes(store.mode)) throw new Error('Invalid store mode');
  if (store.whatsappVerified && !/^[1-9]\d{7,14}$/.test(store.whatsappNumber || '')) throw new Error('Use a verified international WhatsApp number, digits only');
  const ids = new Set(), slugs = new Set();
  for (const p of products) {
    if (!/^[A-Z0-9-]+$/.test(p.id) || ids.has(p.id)) throw new Error('Invalid or duplicate product ID');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw new Error('Invalid or duplicate slug');
    ids.add(p.id); slugs.add(p.slug);
    for (const k of ['name','category','description','source']) if (typeof p[k] !== 'string' || !p[k].trim()) throw new Error(`Missing ${k}: ${p.id}`);
    if (!Array.isArray(p.tags) || p.tags.some(t=>typeof t !== 'string')) throw new Error('Invalid tags');
    if (p.priceLkr !== null && (!Number.isFinite(p.priceLkr) || p.priceLkr <= 0 || (!Number.isSafeInteger(Math.round(p.priceLkr*100)) || Math.abs(Math.round(p.priceLkr*100)-p.priceLkr*100)>1e-6))) throw new Error('Price must be null or a positive LKR amount with at most two decimal places');
    if (!['unconfirmed','available','unavailable','made-to-order'].includes(p.availability)) throw new Error('Invalid availability');
    if (p.image !== null && (!/^\/assets\/[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp|svg)$/.test(p.image) || !p.imageAlt)) throw new Error('Image must be local with alt text');
    if (p.imageVariants !== undefined) {
      if (!Array.isArray(p.imageVariants)) throw new Error('Image variants must be an array');
      let previousWidth=0;
      for (const v of p.imageVariants) {
        if (!/^\/assets\/[a-zA-Z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/.test(v.src) || !Number.isInteger(v.width) || !Number.isInteger(v.height) || v.width<=previousWidth || v.height<1) throw new Error('Invalid responsive image variant');
        previousWidth=v.width;
      }
      if (p.image && (!p.imageVariants.length || !p.imageVariants.some(v=>v.src===p.image && v.width===p.imageWidth && v.height===p.imageHeight))) throw new Error('Image dimensions must match its fallback variant');
      if (!p.image && p.imageVariants.length) throw new Error('A placeholder cannot have image variants');
    }
    if (typeof p.approved !== 'boolean') throw new Error('Missing approval state');
    if (store.mode === 'live' && p.approved && (!p.image || p.availability === 'unconfirmed')) throw new Error(`Approved live product needs an original photo and confirmed availability: ${p.id}`);
  }
  if (store.mode === 'live' && !store.whatsappVerified) throw new Error('Live ordering requires a verified WhatsApp contact');
}
// Products without an approved original photo stay hidden until their photo is imported.
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
export function orderMessage(items, products, notes='') {
  const s=cartSummary(items,products);
  if (!s.lines.length) return '';
  return ['Hello HoneyComb 3D, I would like to request an order.',...s.lines.map(({product:p,quantity:q})=>`- ${p.name} [${p.id}] x ${q}: ${p.priceLkr===null?'price to confirm':money(p.priceLkr*q)}`),s.unpriced?(s.lines.every(x=>x.product.priceLkr===null)?'Quote required for all items. No total is available yet.':`Priced items subtotal: ${money(s.knownSubtotal)}. Other item prices are pending; this is not the full total.`):`Estimated items subtotal: ${money(s.knownSubtotal)}`, 'Please confirm availability, options, delivery cost, final total and payment arrangements. This is an order request, not a confirmed purchase.',notes.trim()?`Notes: ${notes.trim().slice(0,500)}`:''].filter(Boolean).join('\n');
}
export function whatsappUrl(message, store) {
  if (!message || !store.whatsappVerified || !/^[1-9]\d{7,14}$/.test(store.whatsappNumber||'')) return null;
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
