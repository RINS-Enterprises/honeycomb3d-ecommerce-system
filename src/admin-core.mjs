// Admin rules (server side only, never shipped to browsers): which fields an admin may change, what approval needs,
// new listings, promo codes and the login session. The API functions in api/admin/ call these; tests cover them.
import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
import {validateData} from './domain.mjs';

export const EDITABLE = ['name','category','tags','description','priceLkr','availability','approved','partner'];
export const STOCK = ['available','made-to-order','unavailable','unconfirmed'];
const today = now => new Date(now+5.5*3600e3).toISOString().slice(0,10); // Colombo date
export const slugify = name => String(name).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60) || 'item';
export const nextId = products => 'HNYCMB'+(Math.max(500,...products.map(p=>/^HNYCMB(\d+)$/.exec(p.id)?.[1]).filter(Boolean).map(Number))+1);

function clean(key, value) {
  if (key==='tags') {
    if (!Array.isArray(value) || value.length>8 || value.some(t=>typeof t!=='string' || !t.trim() || t.length>30)) throw new Error('Tags: up to 8 short words');
    return [...new Set(value.map(t=>t.trim()))];
  }
  if (key==='priceLkr') return value===null||value==='' ? null : Number(value);
  if (key==='approved') { if (typeof value!=='boolean') throw new Error('approved must be true or false'); return value; }
  if (key==='availability') { if (!STOCK.includes(value)) throw new Error('Unknown stock state'); return value; }
  if (key==='partner') return value===null ? undefined : {costLkr: value.costLkr===null||value.costLkr===''||value.costLkr===undefined ? null : Number(value.costLkr)};
  if (typeof value!=='string') throw new Error(key+' must be text');
  return value.trim();
}

// changes: {edits:[{id, fields:{…}}], create:{name, category, …}, promos:[…]} (each part optional).
// Returns new copies of products and store, validated, plus a one-line summary for the commit message.
export function applyAdminChanges(products, store, changes, now=Date.now()) {
  const out = structuredClone(products), next = structuredClone(store), done = [];
  for (const {id, fields} of changes.edits || []) {
    const p = out.find(x=>x.id===id);
    if (!p) throw new Error('Unknown product '+id);
    if (!fields || typeof fields!=='object') throw new Error('Missing fields for '+id);
    for (const key of Object.keys(fields)) if (!EDITABLE.includes(key)) throw new Error('Not editable in the admin: '+key);
    const before = JSON.stringify(p), changed = new Set();
    for (const [key, value] of Object.entries(fields)) {
      const v = clean(key, value);
      if (JSON.stringify(v)!==JSON.stringify(p[key])) changed.add(key);
      if (v===undefined) delete p[key]; else p[key] = v;
    }
    // A price set in the admin is the owner's price: it replaces the earlier source and the stall-price rule.
    if (changed.has('priceLkr')) { p.priceSource = {provider:'admin', setAt:today(now)}; delete p.priceRule; delete p.stallPriceLkr; }
    if (['name','category','tags','description'].some(k=>changed.has(k)) || fields.approved===true) p.copyStatus = 'owner-approved';
    if (p.approved && fields.approved===true) {
      if (!p.image) throw new Error(p.id+' needs a photo before it can go live. Put photos in its Drive folder.');
      if (p.availability==='unconfirmed') throw new Error(p.id+': choose In stock, Made to order or Sold out before approving.');
      p.approvedAt = today(now);
    }
    if (JSON.stringify(p)!==before) done.push((fields.approved===true?'approve ':fields.approved===false?'hide ':'edit ')+p.id+' '+p.name);
  }
  if (changes.create) {
    const c = changes.create, id = nextId(out);
    for (const key of Object.keys(c)) if (!EDITABLE.includes(key) || key==='approved') throw new Error('Not allowed in a new listing: '+key);
    let slug = slugify(c.name), n = 2;
    while (out.some(x=>x.slug===slug)) slug = slugify(c.name)+'-'+n++;
    const p = {id, slug, name:'', category:'', tags:[], description:'', priceLkr:null, availability:'unconfirmed', image:null, approved:false};
    for (const [key, value] of Object.entries(c)) { const v = clean(key, value); if (v!==undefined) p[key] = v; }
    p.source = 'Added in the admin on '+today(now)+'. Photos come from the Drive folder "'+id+' '+p.name+'".';
    p.copyStatus = 'owner-approved';
    if (p.priceLkr!==null) p.priceSource = {provider:'admin', setAt:today(now)};
    out.push(p); done.push('new '+id+' '+p.name);
  }
  if (changes.promos !== undefined) {
    next.promos = changes.promos.map(({sha256, percent, from, until, note})=>({sha256, percent:Number(percent), from, until, ...(note&&String(note).trim()?{note:String(note).trim()}:{})}));
    done.push('promo codes ('+next.promos.length+')');
  }
  if (!done.length) throw new Error('Nothing changed');
  validateData(out, next);
  return {products:out, store:next, summary:'Admin: '+done.join(', ')};
}

// The JSON the admin page sees: every product (pending too), with its private fields; promo hashes without codes.
export const adminView = (products, store) => ({products, promos:store.promos||[], legacyPromo:store.promo||null, categories:[...new Set(products.map(p=>p.category))].sort()});

// Login: compare digests so the comparison time does not depend on where the password differs.
export const passwordMatches = (given, expected) => typeof given==='string' && typeof expected==='string' && expected.length>0 &&
  timingSafeEqual(createHash('sha256').update(given).digest(), createHash('sha256').update(expected).digest());
export const SESSION_HOURS = 12;
const mac = (secret, exp) => createHmac('sha256', secret).update('hc-admin.'+exp).digest('base64url');
export const signSession = (secret, now=Date.now()) => { const exp = now+SESSION_HOURS*3600e3; return exp+'.'+mac(secret, exp); };
export function verifySession(token, secret, now=Date.now()) {
  const m = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(token||'');
  if (!m || !secret || Number(m[1])<now) return false;
  const a = Buffer.from(m[2]), b = Buffer.from(mac(secret, m[1]));
  return a.length===b.length && timingSafeEqual(a, b);
}
