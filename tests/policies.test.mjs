import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {renderPolicy, parsePolicy, policyTokens, displayPhone, loadPolicies} from '../src/policies.mjs';
import {validateData, POLICY_PAGES} from '../src/domain.mjs';
import {policyPage} from '../src/render.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const store=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const fixture=JSON.parse(await readFile(new URL('fixtures/store-policies.json',import.meta.url),'utf8'));
const on={...store,...fixture};
// The policies switch as it was before the owner turned it on, so the off state stays tested.
const off={...store,policies:false};
const tokens={seller:'S',phone:'P',email:'E',location:'L',hours:'H',delivery:'D'};

test('policy Markdown subset: headings, lists, paragraphs, bold and internal links only',()=>{
  const html=renderPolicy('Intro line\ncontinues.\n\n## Heading\n- one **bold**\n- two [Terms](/terms/)\n\n1. first\n2. second\nText after.',tokens);
  assert.equal(html,'<p>Intro line continues.</p><h2>Heading</h2><ul><li>one <strong>bold</strong></li><li>two <a href="/terms/">Terms</a></li></ul><ol><li>first</li><li>second</li></ol><p>Text after.</p>');
});
test('policy text is escaped: no raw HTML, no external or script links, unknown tokens fail',()=>{
  assert.equal(renderPolicy('<script>x</script> & "q"',tokens),'<p>&lt;script&gt;x&lt;/script&gt; &amp; &quot;q&quot;</p>');
  assert.equal(renderPolicy('[x](https://evil.example) [y](//evil.example) [z](javascript:alert(1))',tokens).includes('<a '),false);
  assert.equal(renderPolicy('{{email}}',{...tokens,email:'<b>@x'}),'<p>&lt;b&gt;@x</p>');
  assert.throws(()=>renderPolicy('{{nope}}',tokens),/Unknown policy token/);
  assert.throws(()=>renderPolicy('> quote',tokens),/Unsupported Markdown/);
});
test('the business WhatsApp number displays in local form',()=>{
  assert.equal(displayPhone('94710599815'),'071 059 9815');
  assert.equal(displayPhone('447700900123'),'+447700900123');
});
test('policies are off unless switched on, and need complete contact details when on',()=>{
  validateData([],off);
  assert.equal(off.policies,false);
  validateData([],on);
  const bad=[{...on,contact:{...on.contact,email:undefined}},{...on,contact:{...on.contact,email:'not an email'}},{...on,contact:{...on.contact,updated:'yesterday'}},{...on,contact:{...on.contact,extra:'x'}},{...on,policies:'true'},{...on,pages:{shipping:'Owner text',returns:null,about:null}}];
  for(const s of bad)assert.throws(()=>validateData([],s));
});
test('all five policy files render with the store\'s contact details and no leftover tokens',async()=>{
  assert.deepEqual(await loadPolicies(root,off),[],'Nothing is built while the switch is off');
  const docs=await loadPolicies(root,on);
  assert.deepEqual(docs.map(d=>d.slug),POLICY_PAGES.map(p=>p.slug));
  for(const d of docs) {
    const page=policyPage(d,on);
    assert.doesNotMatch(page,/\{\{\s*\w+\s*\}\}/,d.slug);
    assert(page.includes('071 059 9815')||d.slug==='shipping'&&page.includes('071 059 9815'),'WhatsApp number on '+d.slug);
    assert(page.includes(on.contact.email),'Email on '+d.slug);
    for(const banned of ['703009064','774919109','710559815'])assert(!page.replace(/\D/g,'').includes(banned),'No banned number on '+d.slug);
  }
  const refunds=docs.find(d=>d.slug==='refunds').html;
  assert.match(refunds,/48 hours/);assert.match(refunds,/full refund/);assert.match(refunds,/do not accept returns or give refunds for a change of mind/);
  assert.match(docs.find(d=>d.slug==='shipping').html,/LKR 400/,'Shipping uses the delivery switch when it is set');
  const noDelivery=policyTokens({...on,delivery:null}).delivery;
  assert.match(noDelivery,/confirmed in your quote/);assert.doesNotMatch(noDelivery,/LKR|\d/,'No fee or time is promised without the delivery switch');
});
test('front matter is required on every policy file',()=>{
  assert.throws(()=>parsePolicy('no front matter','x'),/front-matter/);
  assert.throws(()=>parsePolicy('---\ntitle: T\n---\nbody','x'),/missing eyebrow/);
});
test('an optional token line is dropped when empty, and kept when set',()=>{
  assert.equal(renderPolicy('- a\n- {{paypal}}\n- b',{...tokens,paypal:''}),'<ul><li>a</li><li>b</li></ul>');
  assert.equal(renderPolicy('- a\n- {{paypal}}',{...tokens,paypal:'P'}),'<ul><li>a</li><li>P</li></ul>');
});
test('contact.updated must be a real calendar date',()=>{
  assert.throws(()=>validateData([],{...on,contact:{...on.contact,updated:'2026-02-31'}}),/updated/);
});
test('the agreement line shows next to Order now only when policies are on',async()=>{
  const {detail}=await import('../src/render.mjs');
  const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8')).filter(p=>p.approved);
  const p=products[0];
  assert.match(detail(p,products,on),/By sending an order request you agree to our <a href="\/terms\/">Terms<\/a>/);
  assert.doesNotMatch(detail(p,products,off),/you agree to our/);
  const docs=await loadPolicies(root,on);
  assert.doesNotMatch(docs.find(d=>d.slug==='privacy').html,/PayPal/,'No PayPal line while PayPal is off');
  assert.match((await loadPolicies(root,{...on,paypalOverseas:true})).find(d=>d.slug==='privacy').html,/PayPal processes that payment/);
});
