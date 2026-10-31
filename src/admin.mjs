// HoneyComb 3D admin page: log in, approve pending listings, edit listings, stock, partner cost and promo codes.
// Ships to browsers: no regex v flag, nothing newer than iOS 16 Safari. All writes go through /api/admin/*.
import {escapeHtml as e, money} from './domain.mjs';

const root = document.getElementById('admin');
const STOCK = [['available','In stock'],['made-to-order','Made to order'],['unavailable','Sold out'],['unconfirmed','Not confirmed']];
let data = null, tab = 'pending', busy = false;

async function call(path, body) {
  const r = await fetch('/api/admin/'+path, body===undefined ? {credentials:'same-origin'} : {method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
  const json = await r.json().catch(()=>({error:'Unexpected answer ('+r.status+')'}));
  if (!r.ok) { const err = new Error(json.error||('Error '+r.status)); err.status = r.status; throw err; }
  return json;
}
const say = (text, kind='') => { const el = document.getElementById('admin-status'); el.className = 'admin-status '+kind; el.textContent = text; };
const sha256 = async t => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const colomboToday = () => new Date(Date.now()+5.5*3600e3).toISOString().slice(0,10);
const thumb = p => { const v = (p.imageVariants||[]).find(x=>x.width>=320) || (p.image ? {src:p.image} : null); return v ? '<img src="/api/admin/image?src='+encodeURIComponent(v.src)+'" alt="" width="160" height="160" loading="lazy">' : '<div class="admin-nophoto">No photo yet</div>'; };
const profit = p => p.partner && p.partner.costLkr!==null && p.priceLkr!==null ? 'Profit '+money(p.priceLkr-p.partner.costLkr)+' · partner share '+money((p.priceLkr-p.partner.costLkr)/2) : '';

function loginView(message='') {
  root.innerHTML = '<form class="admin-login" data-testid="admin-login"><h1>HoneyComb 3D admin</h1><label>Password<input type="password" name="password" autocomplete="current-password" required></label><button class="button" type="submit">Log in</button><p class="admin-status'+(message?' bad':'')+'" id="admin-status" role="status">'+e(message)+'</p></form>';
  root.querySelector('form').addEventListener('submit', async ev => {
    ev.preventDefault(); say('Checking…');
    try { await call('login', {password:ev.target.password.value}); await load(); }
    catch (err) { say(err.message, 'bad'); }
  });
  root.querySelector('input').focus();
}

function card(p) {
  const opt = (v,l,cur) => '<option value="'+e(v)+'"'+(v===cur?' selected':'')+'>'+e(l)+'</option>';
  return '<form class="admin-card" data-id="'+e(p.id)+'" data-testid="admin-card">'+
    '<div class="admin-photo">'+thumb(p)+'</div><div class="admin-fields">'+
    '<p class="admin-id">'+e(p.id)+(p.approved?' · <span class="admin-live">On the shop</span>':' · <span class="admin-pending">Pending</span>')+'</p>'+
    '<label>Name<input name="name" value="'+e(p.name)+'" maxlength="80" required></label>'+
    '<div class="admin-row"><label>Price (LKR)<input name="priceLkr" type="number" min="1" step="any" inputmode="numeric" value="'+(p.priceLkr??'')+'" placeholder="Price on request"></label>'+
    '<label>Category<input name="category" value="'+e(p.category)+'" list="admin-categories" maxlength="40" required></label>'+
    '<label>Stock<select name="availability">'+STOCK.map(([v,l])=>opt(v,l,p.availability)).join('')+'</select></label></div>'+
    '<label>Description<textarea name="description" rows="3" maxlength="600" required>'+e(p.description)+'</textarea></label>'+
    '<label>Tags (comma separated)<input name="tags" value="'+e((p.tags||[]).join(', '))+'"></label>'+
    '<div class="admin-row"><label class="admin-check"><input type="checkbox" name="isPartner"'+(p.partner?' checked':'')+'> Partner item</label>'+
    '<label>Partner cost (LKR)<input name="costLkr" type="number" min="1" step="any" inputmode="numeric" value="'+(p.partner?.costLkr??'')+'"></label><p class="admin-profit" data-testid="admin-profit">'+e(profit(p))+'</p></div>'+
    '<div class="admin-actions"><button class="button secondary" type="submit" value="save">Save</button>'+
    (p.approved?'<button class="button secondary" type="submit" value="hide" data-testid="admin-hide">Hide from shop</button>':'<button class="button" type="submit" value="approve" data-testid="admin-approve"'+(p.image?'':' disabled title="Needs a photo first"')+'>Approve &amp; publish</button>')+
    '</div>'+(p.image?'':'<p class="fine">Add photos to the Drive folder "'+e(p.id+' '+p.name)+'" in HoneyComb / 01 Products. They are imported as this pending listing.</p>')+'</div></form>';
}
function fieldsOf(form) {
  const f = form.elements, cost = f.costLkr.value.trim();
  return {name:f.name.value, category:f.category.value, availability:f.availability.value, description:f.description.value,
    priceLkr:f.priceLkr.value.trim()===''?null:Number(f.priceLkr.value), tags:f.tags.value.split(',').map(t=>t.trim()).filter(Boolean),
    partner:f.isPartner.checked?{costLkr:cost===''?null:Number(cost)}:null};
}

function promoView() {
  const rows = [...(data.legacyPromo?[{...data.legacyPromo, note:'First code (set by the PM)', legacy:true}]:[]), ...data.promos];
  const today = colomboToday();
  return '<section class="admin-promos" data-testid="admin-promos"><h2>Promo codes</h2><p class="fine">Codes are stored only as a fingerprint, so the site never shows them. Write the code down when you create it.</p>'+
    '<ul class="admin-promo-list">'+(rows.length?rows.map((x,i)=>'<li>'+e(x.note||'Code')+' · '+x.percent+'% off · '+e(x.from)+' to '+e(x.until)+(x.until<today?' (ended)':x.from>today?' (not started)':' (active)')+(x.legacy?'':' <button type="button" class="link-button" data-remove-promo="'+(i-(data.legacyPromo?1:0))+'">Remove</button>')+'</li>').join(''):'<li>No codes yet.</li>')+'</ul>'+
    '<form class="admin-card admin-promo-form" data-testid="admin-promo-form"><div class="admin-fields"><h3>New code</h3><div class="admin-row"><label>Code<input name="code" maxlength="30" autocapitalize="characters" autocomplete="off" required></label><label>Discount %<input name="percent" type="number" min="1" max="90" required></label></div>'+
    '<div class="admin-row"><label>From<input name="from" type="date" value="'+today+'" required></label><label>Until<input name="until" type="date" value="'+today+'" required></label></div><label>Note (only you see this)<input name="note" maxlength="80" placeholder="e.g. Comic Con 2027"></label>'+
    '<div class="admin-actions"><button class="button" type="submit">Create code &amp; publish</button></div></div></form></section>';
}
function newView() {
  return '<form class="admin-card" data-testid="admin-new"><div class="admin-fields"><h2>New listing</h2><p class="fine">It is saved as pending. Approve it once its photos are imported.</p>'+
    '<label>Name<input name="name" maxlength="80" required></label><div class="admin-row"><label>Price (LKR)<input name="priceLkr" type="number" min="1" step="any" inputmode="numeric" placeholder="Price on request"></label><label>Category<input name="category" list="admin-categories" maxlength="40" required></label>'+
    '<label>Stock<select name="availability">'+STOCK.map(([v,l])=>'<option value="'+v+'"'+(v==='made-to-order'?' selected':'')+'>'+l+'</option>').join('')+'</select></label></div>'+
    '<label>Description<textarea name="description" rows="3" maxlength="600" required></textarea></label><label>Tags (comma separated)<input name="tags"></label>'+
    '<div class="admin-row"><label class="admin-check"><input type="checkbox" name="isPartner"> Partner item</label><label>Partner cost (LKR)<input name="costLkr" type="number" min="1" step="any" inputmode="numeric"></label></div>'+
    '<div class="admin-actions"><button class="button" type="submit">Save as pending</button></div></div></form>';
}

function view() {
  const pending = data.products.filter(p=>!p.approved), live = data.products.filter(p=>p.approved);
  const tabs = [['pending','Pending ('+pending.length+')'],['live','On the shop ('+live.length+')'],['new','New listing'],['promos','Promo codes']];
  root.innerHTML = '<header class="admin-head"><h1>HoneyComb 3D admin</h1><button type="button" class="link-button" id="admin-logout">Log out</button></header>'+
    '<nav class="admin-tabs" aria-label="Admin sections">'+tabs.map(([k,l])=>'<button type="button" data-tab="'+k+'"'+(k===tab?' aria-current="page"':'')+'>'+e(l)+'</button>').join('')+'</nav>'+
    '<p class="admin-status" id="admin-status" role="status" data-testid="admin-status"></p>'+
    '<datalist id="admin-categories">'+data.categories.map(c=>'<option value="'+e(c)+'">').join('')+'</datalist>'+
    '<div class="admin-body">'+(tab==='pending'?(pending.length?pending.map(card).join(''):'<p>Nothing is waiting for approval.</p>'):tab==='live'?live.map(card).join(''):tab==='new'?newView():promoView())+'</div>';
  root.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;view();}));
  root.querySelector('#admin-logout').addEventListener('click', async()=>{ await call('logout',{}).catch(()=>{}); data=null; loginView(); });
  root.querySelectorAll('form[data-id]').forEach(form=>form.addEventListener('submit', ev=>{
    ev.preventDefault();
    const action = ev.submitter?.value || 'save', fields = fieldsOf(form);
    if (action==='approve') fields.approved = true;
    if (action==='hide') { if (!confirm('Hide '+fields.name+' from the shop?')) return; fields.approved = false; }
    save({edits:[{id:form.dataset.id, fields}]});
  }));
  root.querySelector('[data-testid="admin-new"]')?.addEventListener('submit', ev=>{
    ev.preventDefault(); const {partner, ...f} = fieldsOf(ev.target); save({create:partner?{...f, partner}:f});
  });
  root.querySelector('[data-testid="admin-promo-form"]')?.addEventListener('submit', async ev=>{
    ev.preventDefault(); const f = ev.target.elements, code = f.code.value.trim().toUpperCase().replace(/\s+/g,'');
    if (f.until.value < f.from.value) return say('"Until" must be on or after "From".', 'bad');
    const promo = {sha256:await sha256(code), percent:Number(f.percent.value), from:f.from.value, until:f.until.value, ...(f.note.value.trim()?{note:f.note.value.trim()}:{})};
    save({promos:[...data.promos, promo]}, 'Code '+code+' created. Write it down: it is not shown again.');
  });
  root.querySelectorAll('[data-remove-promo]').forEach(b=>b.addEventListener('click',()=>{
    if (confirm('Remove this code?')) save({promos:data.promos.filter((_,i)=>i!==Number(b.dataset.removePromo))});
  }));
}

async function save(changes, done='') {
  if (busy) return; busy = true; say('Saving…');
  try {
    const r = await call('save', {head:data.head, ...changes});
    data = await call('data'); view();
    if (done) say(done, 'good');
    if (r.warning) return say(r.warning, 'bad');
    say((done?done+' ':'')+'Saved. Publishing to honeycomb3d.store…');
    for (let i=0; i<60 && r.deployment; i++) {
      await new Promise(res=>setTimeout(res, 5000));
      const {state} = await call('status?id='+encodeURIComponent(r.deployment)).catch(()=>({state:'UNKNOWN'}));
      if (state==='READY') return say((done?done+' ':'')+'Live ✓ on honeycomb3d.store', 'good');
      if (state==='ERROR' || state==='CANCELED') return say('Saved, but the site build failed, so the live site has not changed. Ask the PM to check.', 'bad');
    }
  } catch (err) {
    if (err.status===401) return loginView('Your login expired. Please log in again.');
    say(err.message, 'bad');
  } finally { busy = false; }
}

async function load() {
  try { data = await call('data'); view(); }
  catch (err) { if (err.status===401) loginView(); else root.innerHTML = '<div class="admin-login"><h1>HoneyComb 3D admin</h1><p class="admin-status bad" data-testid="admin-error">'+e(err.message)+'</p></div>'; }
}
load();
