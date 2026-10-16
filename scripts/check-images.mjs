import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
function dimensions(b,src) {
  if(src.endsWith('.jpg')) {
    // Baseline JPEG link-preview images: walk the markers, refuse EXIF/XMP (APP1) and ICC (APP2), read SOF0.
    assert.equal(b.readUInt16BE(0),0xFFD8,'JPEG start: '+src);
    for(let p=2;p<b.length;) {
      const marker=b.readUInt16BE(p);
      assert(marker!==0xFFE1&&marker!==0xFFE2,'JPEG metadata: '+src);
      if(marker===0xFFC0||marker===0xFFC2)return [b.readUInt16BE(p+7),b.readUInt16BE(p+5)];
      p+=2+b.readUInt16BE(p+2);
    }
    assert.fail('Missing JPEG frame header: '+src);
  }
  if(src.endsWith('.png')) {
    assert.equal(b.subarray(1,4).toString(),'PNG');
    for(let p=8;p<b.length;) {
      const n=b.readUInt32BE(p),type=b.toString('ascii',p+4,p+8);
      assert(!['eXIf','iTXt','tEXt','zTXt','iCCP'].includes(type),'PNG metadata: '+src);
      p+=n+12;
    }
    return [b.readUInt32BE(16),b.readUInt32BE(20)];
  }
  if(src.endsWith('.avif')) {
    // ISOBMFF: an 'ftyp' with the avif brand, no Exif or XMP items, no embedded ICC profile, and the 'ispe' size.
    assert.equal(b.toString('ascii',4,8),'ftyp','AVIF ftyp: '+src);
    assert(/avif|avis/.test(b.toString('ascii',8,32)),'AVIF brand: '+src);
    const head=b.subarray(0,Math.min(b.length,4096)).toString('latin1');
    assert(!/Exif|application\/rdf\+xml/.test(head),'AVIF metadata: '+src);
    const colr=head.indexOf('colr');assert(colr<0||!['prof','rICC'].includes(head.slice(colr+4,colr+8)),'AVIF ICC profile: '+src);
    const ispe=head.indexOf('ispe');assert(ispe>0,'Missing AVIF ispe: '+src);
    return [b.readUInt32BE(ispe+8),b.readUInt32BE(ispe+12)];
  }
  assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
  let size;
  for(let p=12;p+8<=b.length;) {
    const type=b.toString('ascii',p,p+4),n=b.readUInt32LE(p+4),d=p+8;
    assert(!['EXIF','XMP ','ICCP'].includes(type),'WebP metadata: '+src);
    if(type==='VP8X')size=[b.readUIntLE(d+4,3)+1,b.readUIntLE(d+7,3)+1];
    if(type==='VP8 '&&!size)size=[b.readUInt16LE(d+6)&0x3fff,b.readUInt16LE(d+8)&0x3fff];
    if(type==='VP8L'&&!size){const v=b.readUInt32LE(d+1);size=[(v&0x3fff)+1,((v>>>14)&0x3fff)+1];}
    p+=8+n+(n%2);
  }
  assert(size,'Missing image frame dimensions: '+src);return size;
}
export async function checkImageOutputs(paths) {
  const metadata=JSON.parse(await readFile(join(root,'assets/derivatives.json'),'utf8'));
  const logoRecord=JSON.parse(await readFile(join(root,'assets/logo.json'),'utf8'));
  const outputs=new Map();
  const provenance=await readFile(join(root,'docs/ASSET-PROVENANCE.md'),'utf8')+await readFile(join(root,'docs/LOGO-PROVENANCE.md'),'utf8');
  assert(!/\.(?:jpeg|png)\.jpg\b/.test(provenance),'Source titles have extra .jpg suffixes');
  for(const asset of [...metadata.assets,logoRecord]) {
    const input=await readFile(join(root,asset.input));
    assert.equal(sha(input),asset.inputSha256,'Normalized source hash: '+asset.id);
    assert(provenance.includes(asset.sourceDriveId)&&provenance.includes(asset.sourceSha256));
    if(asset.id==='HC-MINATO')assert.deepEqual(asset.appliedCropBox,[2770,2150,4600,6250]);
    if(asset.id==='HC-LEAF')assert.deepEqual(asset.appliedCropBox,[1250,1660,3000,2430]);
    for(const output of asset.outputs) {
      const b=await readFile(join(root,'public',output.src));
      assert.equal(sha(b),output.sha256,'Derivative hash: '+output.src);
      assert.equal(b.length,output.bytes);assert(b.length<=(output.src.endsWith('.jpg')?300_000:500_000),'500 KB image limit (300 KB for share JPEGs)');
      assert.deepEqual(dimensions(b,output.src),[output.width,output.height]);
      assert(provenance.includes(output.sha256),'Derivative missing from provenance');
      outputs.set(output.src,output);
      if(output.avif) {
        // AVIF twin: same pixels and size as its WebP, smaller, hashed and documented.
        const a=await readFile(join(root,'public',output.avif.src));
        assert.equal(sha(a),output.avif.sha256,'AVIF hash: '+output.avif.src);
        assert.equal(a.length,output.avif.bytes);assert(a.length<output.bytes,'AVIF smaller than its WebP: '+output.avif.src);
        assert.deepEqual(dimensions(a,output.avif.src),[output.width,output.height]);
        assert(provenance.includes(output.avif.sha256),'AVIF missing from provenance');
        outputs.set(output.avif.src,{...output.avif,width:output.width,height:output.height});
      }
    }
  }
  const config=JSON.parse(await readFile(join(root,'dist/data/store.json'),'utf8'));
  const products=JSON.parse(await readFile(join(root,'dist/data/products.json'),'utf8'));
  const srcs=v=>[v.src,v.avif].filter(Boolean);
  const heroSrcs=config.hero?[...config.hero.portrait,...config.hero.landscape,...(config.hero.share?[config.hero.share]:[])].flatMap(srcs):[];
  const referenced=new Set([config.logo,...(config.logoVariants||[]).map(v=>v.src),...heroSrcs,...products.flatMap(p=>[p.image,...(p.imageVariants||[]).flatMap(srcs),...(p.gallery||[]).flatMap(g=>g.variants.flatMap(srcs)),p.shareImage?.src])].filter(Boolean));
  const shipped=(await readdir(join(root,'dist/assets'))).map(name=>'/assets/'+name);
  assert.deepEqual([...shipped].sort(),[...referenced].sort(),'Only referenced derivatives belong in dist/');
  for(const src of shipped) {
    assert(outputs.has(src),'Unregistered image in dist: '+src);
    const b=await readFile(join(root,'dist',src));assert.equal(sha(b),outputs.get(src).sha256);
  }
  const logo=outputs.get(config.logo);assert(logo.width<=660&&logo.height<=198,'660 × 198 logo limit');
  assert(config.logo.startsWith('/assets/honeycomb-logo-dark-'),'Header logo is the transparent dark-background export');
  const report={largestImageBytes:Math.max(...[...outputs.values()].map(o=>o.bytes)),pages:[]};
  for(const path of paths) {
    const html=await readFile(join(root,'dist',path),'utf8');let ceiling=0;
    const pictures=[...html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g)].map(m=>m[1]);
    const largest=tag=>{const set=tag.match(/srcset="([^"]*)"/);const list=set?set[1].split(',').map(x=>x.trim().split(/\s+/)[0]):[tag.match(/src="([^"]*)"/)[1]];
      for(const src of list)assert(outputs.has(src)&&referenced.has(src),'Unknown candidate: '+src);return Math.max(...list.map(src=>outputs.get(src).bytes));};
    // A <picture> downloads one candidate: count the largest across its <source>s and <img> once.
    for(const inner of pictures)ceiling+=Math.max(...[...inner.matchAll(/<(?:source|img)\b[^>]*>/g)].map(m=>largest(m[0])));
    for(const inner of pictures)for(const [tag] of inner.matchAll(/<source\b[^>]*>/g))
      if(/type="image\/avif"/.test(tag))for(const src of tag.match(/srcset="([^"]*)"/)[1].split(',').map(x=>x.trim().split(/\s+/)[0]))assert(src.endsWith('.avif'),'AVIF source lists only AVIF files');
    const outside=html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/g,'');
    for(const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      const attrs=Object.fromEntries([...tag.matchAll(/([a-z]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
      const fallback=outputs.get(attrs.src);assert(fallback,'Unknown image: '+attrs.src);
      assert.equal(Number(attrs.width),fallback.width,'Actual width attribute');
      assert.equal(Number(attrs.height),fallback.height,'Actual height attribute');
      const candidates=attrs.srcset?attrs.srcset.split(',').map(x=>x.trim().split(/\s+/)[0]):[attrs.src];
      if(attrs.src.endsWith('.webp'))assert(attrs.srcset&&attrs.sizes,'Responsive product photo');
      for(const src of candidates)assert(outputs.has(src)&&referenced.has(src),'Unknown srcset candidate: '+src);
    }
    for(const [tag] of outside.matchAll(/<img\b[^>]*>/g))ceiling+=largest(tag);
    assert(ceiling<=1_500_000,'Conservative page image budget: '+path);
    for(const [,url] of html.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
      const share=outputs.get(new URL(url).pathname);
      assert(share&&share.src.endsWith('.jpg')&&referenced.has(share.src),'og:image is a shipped JPEG: '+path);
      assert(html.includes('og:image:width" content="'+share.width+'"')&&html.includes('og:image:height" content="'+share.height+'"'),'og:image dimensions: '+path);
    }
    report.pages.push({path,conservativeImageBytes:ceiling});
  }
  await mkdir(join(root,'test-results'),{recursive:true});
  await writeFile(join(root,'test-results/image-static-report.json'),JSON.stringify(report,null,2));
  console.log('Verified image hashes, metadata removal, dimensions, srcsets, exclusive derivative distribution and 500 KB / 1.5 MB budgets.');
}
