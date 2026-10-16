import {readFile,writeFile,mkdir,copyFile,rm,access} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateData,visibleProducts} from '../src/domain.mjs';
import {layout,home,shop,detail,cartPage,customPage,privacyPage,notFound} from '../src/render.mjs';

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
// The hero (and its share image) is used only when its product is visible, so pages never reference unshipped files.
const heroVariants=store.hero&&products.some(p=>p.id===store.hero.product)?[...store.hero.portrait,...store.hero.landscape,...(store.hero.share?[store.hero.share]:[])]:[];
const site={...store,hero:heroVariants.length?store.hero:null};
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
async function page(path,html) {
  const output=join(dist,path);await mkdir(dirname(output),{recursive:true});await writeFile(output,html);
}
await page('index.html',home(products,site));
await page('shop/index.html',shop(products,site));
await page('cart/index.html',cartPage(site));
await page('custom/index.html',customPage(site));
await page('privacy/index.html',privacyPage(site));
await page('404.html',notFound(products,site));
for(const p of products)await page('products/'+p.slug+'/index.html',detail(p,products,site));
for(const name of ['app.mjs','card.mjs','domain.mjs','styles.css'])await copyFile(join(root,'src',name),join(dist,name));
// Copy only explicitly referenced derivatives. Source images and unused assets never ship.
const assets=new Set([store.logo,...(store.logoVariants||[]).map(v=>v.src),...heroVariants.map(v=>v.src),...products.flatMap(p=>[p.image,...(p.imageVariants||[]).map(v=>v.src),...(p.gallery||[]).flatMap(g=>g.variants.map(v=>v.src)),p.shareImage?.src])].filter(Boolean));
await mkdir(join(dist,'assets'),{recursive:true});
for(const asset of assets) {
  if(!/^\/assets\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|svg)$/.test(asset))throw new Error('Invalid public derivative: '+asset);
  await copyFile(join(root,'public',asset),join(dist,asset));
}
await copyFile(join(root,'public/favicon.ico'),join(dist,'favicon.ico'));
await copyFile(join(root,'public/favicon.svg'),join(dist,'favicon.svg'));
// Brand texture used by styles.css (same-origin; the CSP allows no data: images).
await copyFile(join(root,'public/hex.svg'),join(dist,'hex.svg'));
await copyFile(join(root,'public/apple-touch-icon.png'),join(dist,'apple-touch-icon.png'));
await mkdir(join(dist,'fonts'),{recursive:true});
for(const name of ['bricolage-grotesque-display.woff2','OFL.txt'])await copyFile(join(root,'public/fonts',name),join(dist,'fonts',name));
await mkdir(join(dist,'data'),{recursive:true});
// Approval stays in the payload for client-side live filtering. Recovery and copy-workflow metadata do not.
await writeFile(join(dist,'data/products.json'),JSON.stringify(products.map(({source,copyStatus,imageSource,priceSource,imageApprovedAt,imageStatus,...p})=>({...p,source:'Public catalog'}))));
await writeFile(join(dist,'data/store.json'),JSON.stringify({name:store.name,currency:store.currency,country:store.country,mode:store.mode,whatsappNumber:store.whatsappVerified?store.whatsappNumber:null,whatsappVerified:store.whatsappVerified,logo:store.logo,logoWidth:store.logoWidth,logoHeight:store.logoHeight,logoVariants:store.logoVariants,hero:heroVariants.length?store.hero:null}));
// Preview: search engines stay out (with noindex on every page), but link-preview crawlers may fetch
// pages and share images so shared links show a card. WhatsApp builds previews on the sender's phone.
const PREVIEW_BOTS=['Twitterbot','facebookexternalhit','Facebot','LinkedInBot','Slackbot','Slackbot-LinkExpanding','TelegramBot','Discordbot','WhatsApp'];
await writeFile(join(dist,'robots.txt'),store.mode==='preview'?PREVIEW_BOTS.map(bot=>'User-agent: '+bot+'\nAllow: /\n').join('\n')+'\nUser-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\n');
console.log('Built '+(products.length+6)+' static pages into dist/ ('+store.mode+' mode).');
