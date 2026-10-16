import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const products=JSON.parse(await readFile('data/products.json','utf8')).filter(p=>p.image);
const server=spawn(process.execPath,['scripts/serve.mjs'],{stdio:'inherit'});
let browser;
try {
  let ready=false;
  for(let i=0;i<50;i++){try{if((await fetch('http://127.0.0.1:4173/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert(ready,'Image test server starts');
  browser=await chromium.launch();
  const favicon=await fetch('http://127.0.0.1:4173/favicon.ico');
  assert.equal(favicon.status,200,'Favicon route');
  assert.match(favicon.headers.get('content-type'),/image\/vnd\.microsoft\.icon/);
  const icon=Buffer.from(await favicon.arrayBuffer());
  assert.equal(icon.readUInt16LE(2),1,'ICO type');
  assert.equal(icon.readUInt16LE(4),3,'Three favicon frames');
  const iconSizes=Array.from({length:3},(_,i)=>icon[6+i*16]).sort((a,b)=>a-b);
  assert.deepEqual(iconSizes,[16,32,48]);
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
      // With srcset w-descriptors naturalWidth/Height are density-corrected; decode the file for its real pixels.
      const file=new Image();file.src=img.currentSrc;await file.decode();
      return {src:new URL(img.currentSrc).pathname,width:file.naturalWidth,height:file.naturalHeight,
              attrWidth:Number(img.getAttribute('width')),attrHeight:Number(img.getAttribute('height')),
              responsive:!!img.getAttribute('srcset'),alt:img.alt};
    })));
    const bytes=new Map();
    for(const r of responses){assert.equal(r.status(),200);bytes.set(new URL(r.url()).pathname,(await r.body()).length);}
    for(const img of imgs) {
      assert(img.alt&&img.width&&img.height,'Photo decodes with alt text: '+img.src);
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
  for(const [width,dpr] of [[320,1],[390,3],[768,1],[1280,1]]) {
    const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:dpr});
    const page=await context.newPage();
    for(const route of ['/shop/','/products/minato-kunai/']) {
      await page.goto('http://127.0.0.1:4173'+route);
      await page.evaluate(()=>{for(const img of document.images)img.loading='eager';});
      await page.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
      const samples=await page.evaluate(async()=>Promise.all(
        [...document.images].filter(img=>img.currentSrc.includes('minato-kunai')).map(async img=>{
          const decoded=new Image(); decoded.src=img.currentSrc; await decoded.decode();
          const box=img.getBoundingClientRect();
          const actualWidth=Math.min(box.width,box.height*decoded.naturalWidth/decoded.naturalHeight);
          return {src:img.currentSrc,pixels:decoded.naturalWidth,actualWidth};
        })));
      assert(samples.length,'Minato is present');
      for(const sample of samples)assert(sample.pixels/(sample.actualWidth*dpr)<=3,
        'Portrait oversampling: '+JSON.stringify({width,dpr,route,...sample}));
    }
    await context.close();
  }
  await mkdir('test-results',{recursive:true});
  await writeFile('test-results/image-mobile-report.json',JSON.stringify({viewport:{width:390,height:844,dpr:3},pages:report},null,2));
  console.log('PASS: all mobile pages decode approved photos with real proportions and stay within both image budgets.');
} finally {if(browser)await browser.close();server.kill();}
