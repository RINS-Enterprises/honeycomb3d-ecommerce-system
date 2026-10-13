import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const products=JSON.parse(await readFile('data/products.json','utf8'));
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'inherit'});
let browser;
try {
  let ready=false;
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:4173/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert(ready,'Image test server starts');
  browser=await chromium.launch();
  const report=[];
  for(const route of ['/','/shop/','/cart/','/custom/','/privacy/',...products.map(p=>'/products/'+p.slug+'/')]) {
    const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true});
    const page=await context.newPage();const responses=[];
    page.on('response',r=>{if(r.request().resourceType()==='image')responses.push(r);});
    await page.goto('http://127.0.0.1:4173'+route);
    await page.evaluate(()=>{for(const img of document.images)img.loading='eager';});
    await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
    await page.waitForLoadState('networkidle');
    const imgs=await page.evaluate(async()=>Promise.all([...document.images].map(async img=>{
      await img.decode();
      return {src:new URL(img.currentSrc).pathname,width:img.naturalWidth,height:img.naturalHeight,
              attrWidth:Number(img.getAttribute('width')),attrHeight:Number(img.getAttribute('height')),
              responsive:!!img.getAttribute('srcset'),alt:img.alt};
    })));
    const bytes=new Map();
    for(const r of responses){assert.equal(r.status(),200);bytes.set(new URL(r.url()).pathname,(await r.body()).length);}
    for(const img of imgs) {
      assert(img.alt&&img.width&&img.height,'Photo decodes with alt text');
      assert(Math.abs(img.attrWidth/img.attrHeight-img.width/img.height)/(img.width/img.height)<.01,'Intrinsic proportions match: '+img.src);
      if(img.src.endsWith('.webp'))assert(img.responsive,'Responsive photo');
    }
    const total=[...bytes.values()].reduce((a,b)=>a+b,0);
    assert(total<=1_500_000,'Mobile page exceeds 1.5 MB: '+route);
    assert([...bytes.values()].every(n=>n<=500_000),'Mobile image exceeds 500 KB');
    assert(!imgs.some(img=>/original|photo-sources/.test(img.src)),'No source original requested');
    report.push({route,imageBytes:total,images:imgs.map(img=>({src:img.src,bytes:bytes.get(img.src)}))});
    console.log(route+' mobile DPR 3: '+total+' image bytes');
    if(['/','/products/minato-kunai/','/products/hidden-leaf-keychain/'].includes(route)) {
      await mkdir('test-results',{recursive:true});
      await page.screenshot({path:'test-results/'+(route==='/'?'home-approved-photos':route.split('/')[2])+'-mobile.png',fullPage:true});
    }
    await context.close();
  }
  await mkdir('test-results',{recursive:true});
  await writeFile('test-results/image-mobile-report.json',JSON.stringify({viewport:{width:390,height:844,dpr:3},pages:report},null,2));
  console.log('PASS: all mobile pages decode approved photos with real proportions and stay within both image budgets.');
} finally {if(browser)await browser.close();server.kill();}
