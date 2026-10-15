import {readFile,writeFile,mkdir,copyFile,rm,access} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateData,visibleProducts} from '../src/domain.mjs';
import {layout,home,shop,detail,cartPage,customPage,privacyPage} from '../src/render.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const dist=resolve(root,'dist');
if(dirname(dist)!==resolve(root)||!dist.endsWith('dist'))throw new Error('Unsafe output directory');
const all=JSON.parse(await readFile(join(root,'data/products.json'),'utf8'));
const store=JSON.parse(await readFile(join(root,'data/store.json'),'utf8'));
validateData(all,store);
const products=visibleProducts(all,store);
for(const product of products) {
  if(product.image)await access(join(root,'public',product.image));
}
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
async function page(path,html) {
  const output=join(dist,path);await mkdir(dirname(output),{recursive:true});await writeFile(output,html);
}
await page('index.html',home(products,store));
await page('shop/index.html',shop(products,store));
await page('cart/index.html',cartPage(store));
await page('custom/index.html',customPage(store));
await page('privacy/index.html',privacyPage(store));
await page('404.html',layout('Page not found','<section class="wrap section narrow"><p class="eyebrow">404</p><h1>This page wandered off.</h1><p>The design you are looking for may have moved.</p><a class="button" href="/shop/">Explore the collection →</a></section>',store));
for(const p of products)await page('products/'+p.slug+'/index.html',detail(p,products,store));
for(const name of ['app.mjs','domain.mjs','styles.css'])await copyFile(join(root,'src',name),join(dist,name));
// Copy only explicitly referenced derivatives. Source images and unused assets never ship.
const heroVariants=store.hero&&products.some(p=>p.id===store.hero.product)?[...store.hero.portrait,...store.hero.landscape]:[];
const assets=new Set([store.logo,...(store.logoVariants||[]).map(v=>v.src),...heroVariants.map(v=>v.src),...products.flatMap(p=>[p.image,...(p.imageVariants||[]).map(v=>v.src)])].filter(Boolean));
await mkdir(join(dist,'assets'),{recursive:true});
for(const asset of assets) {
  if(!/^\/assets\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg)$/.test(asset))throw new Error('Invalid public derivative: '+asset);
  await copyFile(join(root,'public',asset),join(dist,asset));
}
await copyFile(join(root,'public/favicon.ico'),join(dist,'favicon.ico'));
await mkdir(join(dist,'data'),{recursive:true});
// Approval stays in the payload for client-side live filtering. Recovery and copy-workflow metadata do not.
await writeFile(join(dist,'data/products.json'),JSON.stringify(products.map(({source,copyStatus,imageSource,priceSource,imageApprovedAt,imageStatus,...p})=>({...p,source:'Public catalog'}))));
await writeFile(join(dist,'data/store.json'),JSON.stringify({name:store.name,currency:store.currency,country:store.country,mode:store.mode,whatsappNumber:store.whatsappVerified?store.whatsappNumber:null,whatsappVerified:store.whatsappVerified,logo:store.logo,logoWidth:store.logoWidth,logoHeight:store.logoHeight,logoVariants:store.logoVariants,hero:heroVariants.length?store.hero:null}));
await writeFile(join(dist,'robots.txt'),store.mode==='preview'?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\n');
console.log('Built '+(products.length+6)+' static pages into dist/ ('+store.mode+' mode).');
