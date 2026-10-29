// Policy pages (terms, refunds, shipping, privacy, contact) for payment-gateway review. Build-time only: never shipped to browsers.
// Source: data/policies/<slug>.md, a small Markdown subset plus {{tokens}} filled from store data, so contact details
// and delivery terms come from one place and nothing is promised that the owner has not set.
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {escapeHtml as e, delivery, policiesOn, POLICY_PAGES} from './domain.mjs';

// 94710599815 -> 071 059 9815 (Sri Lankan mobile); anything else as +international digits.
export const displayPhone = digits => /^94\d{9}$/.test(digits||'') ? '0'+digits.slice(2,4)+' '+digits.slice(4,7)+' '+digits.slice(7) : '+'+digits;

export function policyTokens(store) {
  const c=store.contact, d=delivery(store);
  return {
    seller:'HoneyComb 3D is operated by '+c.operator+', '+c.location,
    phone:displayPhone(store.whatsappNumber),
    email:c.email,
    location:c.location,
    hours:c.hours||'We reply on WhatsApp as soon as we can.',
    delivery:d?d.text.replace(/[.!?]?$/,'.')+' The exact delivery charge for your order is shown in your quote before you pay.':'Delivery cost and the estimated delivery time for your address are confirmed in your quote before you pay.'
  };
}

// Inline: escape first, then **bold**, [label](/internal-path) and {{token}}. Only site-relative links (no schemes, no //).
function inline(text, tokens) {
  return e(text)
    .replace(/\{\{(\w+)\}\}/g,(m,k)=>{if(!(k in tokens))throw new Error('Unknown policy token {{'+k+'}}');return e(tokens[k]);})
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((\/(?!\/)[a-z0-9/_-]*)\)/g,'<a href="$2">$1</a>');
}

// Lines: "## Heading", "- item" (bullets), "1. item" (numbered), other text (paragraphs; a blank line ends one).
// Consecutive items of one kind form one list. Anything else that looks like Markdown is refused, not shown raw.
export function renderPolicy(markdown, tokens) {
  const html=[]; let run=null;
  const flush=()=>{
    if (!run) return;
    if (run.kind==='p') html.push('<p>'+inline(run.items.join(' '),tokens)+'</p>');
    else html.push('<'+run.kind+'>'+run.items.map(x=>'<li>'+inline(x,tokens)+'</li>').join('')+'</'+run.kind+'>');
    run=null;
  };
  for (const raw of markdown.replace(/\r\n?/g,'\n').trim().split('\n')) {
    const line=raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith('## ')) { flush(); html.push('<h2>'+inline(line.slice(3),tokens)+'</h2>'); continue; }
    if (/^(#|>|\* |\+ |```|\|)/.test(line)) throw new Error('Unsupported Markdown in policy: '+line);
    const [kind,text]=line.startsWith('- ')?['ul',line.slice(2)]:/^\d+\. /.test(line)?['ol',line.replace(/^\d+\. /,'')]:['p',line];
    if (run?.kind!==kind) { flush(); run={kind,items:[]}; }
    run.items.push(text);
  }
  flush();
  return html.join('');
}

// "---\ntitle: …\neyebrow: …\ndescription: …\n---\nbody"
export function parsePolicy(source, slug) {
  const m=source.replace(/\r\n?/g,'\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Policy '+slug+' needs a front-matter block');
  const meta=Object.fromEntries(m[1].split('\n').map(l=>l.match(/^(\w+):\s*(.+)$/)).filter(Boolean).map(x=>[x[1],x[2].trim()]));
  for (const k of ['title','eyebrow','description']) if (!meta[k]) throw new Error('Policy '+slug+' is missing '+k);
  return {slug, ...meta, body:m[2]};
}

export async function loadPolicies(root, store) {
  if (!policiesOn(store)) return [];
  const tokens=policyTokens(store);
  return Promise.all(POLICY_PAGES.map(async p=>{
    const doc=parsePolicy(await readFile(join(root,'data/policies',p.slug+'.md'),'utf8'),p.slug);
    return {...doc, html:renderPolicy(doc.body,tokens), updated:store.contact.updated};
  }));
}
