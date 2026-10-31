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
    if (!Array.isArray(value) || value.length>8 || value.some(t=>typeof t!=='string')) throw new Error('Tags: up to 8 short words');
    return [...new Set(value.map(t=>safeText('tag', t)))];
  }
  if (key==='priceLkr') return value===null||value==='' ? null : Number(value);
  if (key==='approved') { if (typeof value!=='boolean') throw new Error('approved must be true or false'); return value; }
  if (key==='availability') { if (!STOCK.includes(value)) throw new Error('Unknown stock state'); return value; }
  if (key==='partner') return value===null ? undefined : {costLkr: value.costLkr===null||value.costLkr===''||value.costLkr===undefined ? null : Number(value.costLkr)};
  if (typeof value!=='string') throw new Error(key+' must be text');
  return safeText(key, value);
}
// Same limits for every admin text, and nothing the site checks would refuse (so a save can never break the build).
const LIMITS = {name:80, category:40, description:600, tag:30};
const BANNED_DIGITS = ['703009064','774919109','710559815'];
export function safeText(key, value, max=LIMITS[key]||80) {
  const v = String(value).trim();
  if (!v || v.length>max) throw new Error(key+' must be 1 to '+max+' characters');
  if (/[\u0000-\u0008\u000b-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/.test(v) || (key!=='description' && /[\n\r\t]/.test(v))) throw new Error(key+' contains hidden or control characters');
  if (/\b(?:undefined|NaN)\b/.test(v) || /\{\{|\}\}/.test(v)) throw new Error(key+' contains text the site cannot show ("undefined", "NaN" or curly braces)');
  if (/COMICCON/i.test(v)) throw new Error(key+' must not contain a promo code');
  if (BANNED_DIGITS.some(d=>v.replace(/\D/g,'').includes(d))) throw new Error(key+' contains a phone number that must not appear on the site');
  return v;
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
    const before = JSON.stringify(p), wasApproved = p.approved, changed = new Set();
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
      if (!wasApproved) p.approvedAt = today(now);
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
    if (!Array.isArray(changes.promos)) throw new Error('promos must be a list');
    next.promos = changes.promos.map(({sha256, percent, from, until, note})=>({sha256, percent:Number(percent), from, until, ...(note&&String(note).trim()?{note:safeText('note', note)}:{})}));
    done.push('promo codes ('+next.promos.length+')');
  }
  if (!done.length) throw new Error('Nothing changed');
  validateData(out, next);
  return {products:out, store:next, summary:'Admin: '+done.join(', ')};
}

// Fields that must stay private: refused while the GitHub repository is public.
export const touchesPrivate = changes => [...(changes.edits||[]).map(x=>x.fields||{}), changes.create||{}].some(f=>f.partner) || (changes.promos||[]).some(x=>x&&x.note);

// The JSON the admin page sees: every product (pending too), with its private fields; promo hashes without codes.
export const adminView = (products, store) => ({products, promos:store.promos||[], legacyPromo:store.promo||null, categories:[...new Set(products.map(p=>p.category))].sort()});

// Login: compare digests so the comparison time does not depend on where the password differs.
export const passwordMatches = (given, expected) => typeof given==='string' && typeof expected==='string' && expected.length>0 &&
  timingSafeEqual(createHash('sha256').update(given).digest(), createHash('sha256').update(expected).digest());
export const SESSION_HOURS = 12;
const mac = (secret, exp) => createHmac('sha256', secret).update('hc-admin.'+exp).digest('base64url');
// The signing key includes the password, so changing ADMIN_PASSWORD ends every existing login.
export const sessionKey = (secret, password) => secret && password ? secret+'\u0000'+createHash('sha256').update(password).digest('hex') : '';
export const MIN_PASSWORD = 12;
export const signSession = (secret, now=Date.now()) => { const exp = now+SESSION_HOURS*3600e3; return exp+'.'+mac(secret, exp); };
export function verifySession(token, secret, now=Date.now()) {
  const m = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(token||'');
  if (!m || !secret || Number(m[1])<now) return false;
  const a = Buffer.from(m[2]), b = Buffer.from(mac(secret, m[1]));
  return a.length===b.length && timingSafeEqual(a, b);
}
