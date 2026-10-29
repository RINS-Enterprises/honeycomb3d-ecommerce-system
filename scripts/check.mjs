import {loadStore} from './store.mjs';
import {checkImageOutputs} from './check-images.mjs';
import {readFile,stat,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {validateData,visibleProducts,searchIndexing,trustPages,TRUST_PAGES,policiesOn,POLICY_PAGES} from '../src/domain.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
assert((await readdir(join(root,'tests'))).some(name=>name.endsWith('.test.mjs')), 'At least one unit-test file must exist');
const all=JSON.parse(await readFile(join(root,'data/products.json'),'utf8'));
const store=await loadStore(root);
validateData(all,store);
const products=visibleProducts(all,store);
const publicProducts=JSON.parse(await readFile(join(root,'dist/data/products.json'),'utf8'));
for(const p of publicProducts) {
  assert.equal(p.copyStatus,undefined,'Copy approval workflow must not be published');
  assert.equal(p.imageSource,undefined,'Recovery asset filenames must not be published');
  for(const key of ['priceSource','imageApprovedAt','imageStatus'])assert.equal(p[key],undefined,'Source workflow metadata must not be published');
  assert.equal(p.source,'Public catalog','Recovery evidence must stay in source data');
}
const paths=['index.html','shop/index.html','cart/index.html','custom/index.html','privacy/index.html','faq/index.html','404.html',...trustPages(store).map(t=>t.slug+'/index.html'),...(policiesOn(store)?POLICY_PAGES.filter(p=>p.slug!=='privacy').map(p=>p.slug+'/index.html'):[]),...products.map(p=>'products/'+p.slug+'/index.html')];
// Policy pages (payment-gateway review): all five, linked from every footer, with the seller line, only when switched on.
for(const p of POLICY_PAGES.filter(p=>p.slug!=='privacy'))assert.equal((await readdir(join(root,'dist'))).includes(p.slug),policiesOn(store)||trustPages(store).some(t=>t.slug===p.slug),'Policy page '+p.slug+' is built only when policies are on (or as an owner-written trust page)');
for(const path of ['index.html','404.html','privacy/index.html']) {
  const html=await readFile(join(root,'dist',path),'utf8');
  for(const p of POLICY_PAGES.filter(p=>p.slug!=='privacy'&&!trustPages(store).some(t=>t.slug===p.slug)))assert.equal(html.includes('href="/'+p.slug+'/"'),policiesOn(store),'Footer links '+p.slug+' only when policies are on: '+path);
  assert.equal(html.includes('data-testid="footer-seller"'),policiesOn(store),'Seller line only when policies are on: '+path);
  if(policiesOn(store))assert(html.includes(store.contact.email)&&html.includes(store.contact.operator),'Seller line names the operator and email: '+path);
}
if(policiesOn(store))assert.match(await readFile(join(root,'dist/privacy/index.html'),'utf8'),/data-testid="policy-page"/,'The privacy page is the full privacy policy when policies are on');
// Trust pages exist, and are linked, only once the owner has written them.
for(const t of TRUST_PAGES.filter(t=>!(policiesOn(store)&&POLICY_PAGES.some(p=>p.slug===t.slug)))) {
  const written=trustPages(store).some(x=>x.key===t.key);
  assert.equal((await readdir(join(root,'dist'))).includes(t.slug),written,'Trust page '+t.slug+' is built only with owner text');
  for(const path of ['index.html','404.html'])assert.equal((await readFile(join(root,'dist',path),'utf8')).includes('href="/'+t.slug+'/"'),written,'Footer links '+t.slug+' only with owner text');
}
for(const path of paths) {
  const html=await readFile(join(root,'dist',path),'utf8');
  assert.match(html,/<html lang="en">/);assert.match(html,/<main id="main"/);
  assert.match(html,/<title>[^<]+<\/title>/);
  assert(!/\b(?:undefined|NaN)\b/.test(html),'Unexpected value: '+path);
  assert(!/\{\{\s*\w+\s*\}\}/.test(html),'Unfilled template token: '+path);
  for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    let local=decodeURIComponent(href.split('?')[0]);
    if(local.endsWith('/'))local+='index.html';
    await stat(join(root,'dist',local));
  }
}
await checkImageOutputs(paths);
if(!searchIndexing(store)) {
  const robots=await readFile(join(root,'dist/robots.txt'),'utf8');
  assert.match(robots,/User-agent: \*\nDisallow: \/\n$/,'Search engines stay out until searchIndexing is on');
  for(const bot of ['Twitterbot','facebookexternalhit','LinkedInBot','Slackbot','TelegramBot','Discordbot'])assert.match(robots,new RegExp('User-agent: '+bot+'\nAllow: /'),'Link-preview crawler allowed: '+bot);
  for(const path of paths)assert.match(await readFile(join(root,'dist',path),'utf8'),/<meta name="robots" content="noindex,nofollow">/,'noindex while searchIndexing is off: '+path);
  assert(!(await readdir(join(root,'dist'))).includes('sitemap.xml'),'No sitemap until the owner decides on indexing');
  for(const path of paths)assert(!(await readFile(join(root,'dist',path),'utf8')).includes('"BreadcrumbList"'),'No breadcrumb structured data until indexing is on: '+path);
} else {
  // Indexing on (D-12): crawlable, with a sitemap of exactly the public pages and breadcrumb data on every product page.
  const site=store.siteUrl.replace(/\/$/,'');
  assert.equal(await readFile(join(root,'dist/robots.txt'),'utf8'),'User-agent: *\nAllow: /\n\nSitemap: '+site+'/sitemap.xml\n');
  const xml=await readFile(join(root,'dist/sitemap.xml'),'utf8');
  assert.match(xml,/^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">\n(?:<url><loc>https:\/\/[^<\s]+<\/loc><\/url>\n)+<\/urlset>\n$/,'Well-formed sitemap of absolute URLs');
  const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
  const closed=['cart/index.html','404.html'];
  const publicPaths=paths.filter(path=>!closed.includes(path)).map(path=>site+'/'+path.replace(/index\.html$/,''));
  assert.deepEqual([...locs].sort(),[...publicPaths].sort(),'The sitemap lists exactly the public pages');
  for(const path of paths) {
    const html=await readFile(join(root,'dist',path),'utf8');
    if(closed.includes(path))assert.match(html,/<meta name="robots" content="noindex,nofollow">/,'The cart and 404 stay out of search results: '+path);
    else assert(!/<meta name="robots"/.test(html),'Indexable page carries no robots restriction: '+path);
    const lds=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
    const crumbs=lds.filter(x=>x['@type']==='BreadcrumbList');
    const product=products.find(p=>path==='products/'+p.slug+'/index.html');
    if(!product){assert.equal(crumbs.length,0,'Breadcrumb data on product pages only: '+path);continue;}
    // Mirrors the visible Shop > category > design trail, with absolute URLs.
    assert.deepEqual(crumbs,[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Shop','/shop/'],[product.category,'/shop/?category='+encodeURIComponent(product.category)],[product.name,'/products/'+product.slug+'/']].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:site+url}))}],'Breadcrumb data: '+path);
  }
}
// Shipped browser modules must load on older browsers (Safari < 17): no syntax newer than they parse, such as the regex v flag.
for(const name of (await readdir(join(root,'dist'))).filter(n=>n.endsWith('.mjs'))) {
  const run=spawnSync(process.execPath,['--no-harmony-regexp-unicode-sets','--check',join(root,'dist',name)],{encoding:'utf8'});
  if(/bad option/i.test(run.stderr))assert(!/\/[dgimsuy]*v[dgimsuy]*[,;)\s]/.test(await readFile(join(root,'dist',name),'utf8')),'No regex v flag: '+name);
  else assert.equal(run.status,0,'Browser module parses without the regex v flag: '+name+'\n'+run.stderr);
}
// Self-hosted heading font: hash matches its provenance record, licence ships with it, total stays under ~100 KB.
const fontRecord=JSON.parse(await readFile(join(root,'assets/font.json'),'utf8'));
const fontBytes=await readFile(join(root,'dist',fontRecord.output));
assert.equal(createHash('sha256').update(fontBytes).digest('hex'),fontRecord.sha256,'Font hash');
assert(fontBytes.length<=100_000,'Fonts stay under 100 KB');
assert.match(await readFile(join(root,'dist/fonts/OFL.txt'),'utf8'),/SIL OPEN FONT LICENSE Version 1\.1/);
// SVG favicon: the recorded export, plain vector paths only, linked from every page beside the ICO fallback.
const faviconRecord=JSON.parse(await readFile(join(root,'assets/favicon.json'),'utf8')).svgIcon;
const faviconSvg=await readFile(join(root,'dist/favicon.svg'));
assert.equal(createHash('sha256').update(faviconSvg).digest('hex'),faviconRecord.sha256,'favicon.svg matches its provenance record');
assert(!/<script|<image|<foreignObject|on\w+=|href=/i.test(faviconSvg.toString()),'favicon.svg is plain vector paths');
for(const path of paths){const html=await readFile(join(root,'dist',path),'utf8');
  assert(html.includes('<link rel="icon" href="/favicon.ico"')&&html.includes('<link rel="icon" href="/favicon.svg" type="image/svg+xml">'),'Both favicons linked: '+path);}
// Brand texture: tiny, same-origin, referenced by the stylesheet, and free of scripts.
const hex=await readFile(join(root,'dist/hex.svg'),'utf8');
assert(Buffer.byteLength(hex)<=1024,'Hex texture stays at or under 1 KB');
assert(!/<script|on\w+=|href=/i.test(hex),'Hex texture is plain vector paths');
assert.match(await readFile(join(root,'dist/styles.css'),'utf8'),/url\(\/hex\.svg\)/);
// Numbers that must never ship, in any spacing or format (owner, 2026-10-18): two held by a former business
// partner, and 0710559815, a mistyped copy of the business number that was live for a few hours.
const forbiddenNumbers=['703009064','774919109','710559815'].map(d=>new RegExp(d.split('').join('(?:[^0-9A-Za-z]|%[0-9A-Fa-f]{2}|&#?\\w+;){0,3}')));
async function scanText(dir){for(const entry of await readdir(dir,{withFileTypes:true})){
  const full=join(dir,entry.name);
  if(entry.isDirectory()){await scanText(full);continue;}
  if(!/\.(?:html|json|mjs|js|css|txt|svg|xml)$/.test(entry.name))continue;
  const text=await readFile(full,'utf8');
  for(const re of forbiddenNumbers)assert(!re.test(text),'A former partner\'s number must never ship: '+full);
}}
await scanText(join(root,'dist'));
console.log('Verified '+paths.length+' generated pages and their local links/assets.');
