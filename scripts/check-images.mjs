import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
function dimensions(b,src) {
  if(src.endsWith('.png')) {
    assert.equal(b.subarray(1,4).toString(),'PNG');
    for(let p=8;p<b.length;) {
      const n=b.readUInt32BE(p),type=b.toString('ascii',p+4,p+8);
      assert(!['eXIf','iTXt','tEXt','zTXt','iCCP'].includes(type),'PNG metadata: '+src);
      p+=n+12;
    }
    return [b.readUInt32BE(16),b.readUInt32BE(20)];
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
  const outputs=new Map();
  const provenance=await readFile(join(root,'docs/ASSET-PROVENANCE.md'),'utf8');
  assert(!/\.(?:jpeg|png)\.jpg\b/.test(provenance),'Source titles have extra .jpg suffixes');
  for(const asset of metadata.assets) {
    const input=await readFile(join(root,asset.input));
    assert.equal(sha(input),asset.inputSha256,'Normalized source hash: '+asset.id);
    assert(provenance.includes(asset.sourceDriveId)&&provenance.includes(asset.sourceSha256));
    if(asset.id==='HC-MINATO')assert.deepEqual(asset.appliedCropBox,[2770,2150,4600,6250]);
    if(asset.id==='HC-LEAF')assert.deepEqual(asset.appliedCropBox,[1250,1660,3000,2430]);
    for(const output of asset.outputs) {
      const b=await readFile(join(root,'public',output.src));
      assert.equal(sha(b),output.sha256,'Derivative hash: '+output.src);
      assert.equal(b.length,output.bytes);assert(b.length<=500_000,'500 KB image limit');
      assert.deepEqual(dimensions(b,output.src),[output.width,output.height]);
      assert(provenance.includes(output.sha256),'Derivative missing from provenance');
      outputs.set(output.src,output);
    }
  }
  const config=JSON.parse(await readFile(join(root,'dist/data/store.json'),'utf8'));
  const products=JSON.parse(await readFile(join(root,'dist/data/products.json'),'utf8'));
  const referenced=new Set([config.logo,...products.flatMap(p=>[p.image,...(p.imageVariants||[]).map(v=>v.src)])].filter(Boolean));
  const shipped=(await readdir(join(root,'dist/assets'))).map(name=>'/assets/'+name);
  assert.deepEqual([...shipped].sort(),[...referenced].sort(),'Only referenced derivatives belong in dist/');
  for(const src of shipped) {
    assert(outputs.has(src),'Unregistered image in dist: '+src);
    const b=await readFile(join(root,'dist',src));assert.equal(sha(b),outputs.get(src).sha256);
  }
  const logo=outputs.get(config.logo);assert(logo.width<=660&&logo.height<=198,'660 × 198 logo limit');
  const report={largestImageBytes:Math.max(...[...outputs.values()].map(o=>o.bytes)),pages:[]};
  for(const path of paths) {
    const html=await readFile(join(root,'dist',path),'utf8');let ceiling=0;
    for(const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      const attrs=Object.fromEntries([...tag.matchAll(/([a-z]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
      const fallback=outputs.get(attrs.src);assert(fallback,'Unknown image: '+attrs.src);
      assert.equal(Number(attrs.width),fallback.width,'Actual width attribute');
      assert.equal(Number(attrs.height),fallback.height,'Actual height attribute');
      const candidates=attrs.srcset?attrs.srcset.split(',').map(x=>x.trim().split(/\s+/)[0]):[attrs.src];
      if(attrs.src.endsWith('.webp'))assert(attrs.srcset&&attrs.sizes,'Responsive product photo');
      for(const src of candidates)assert(outputs.has(src)&&referenced.has(src),'Unknown srcset candidate: '+src);
      ceiling+=Math.max(...candidates.map(src=>outputs.get(src).bytes));
    }
    assert(ceiling<=1_500_000,'Conservative page image budget: '+path);
    report.pages.push({path,conservativeImageBytes:ceiling});
  }
  await mkdir(join(root,'test-results'),{recursive:true});
  await writeFile(join(root,'test-results/image-static-report.json'),JSON.stringify(report,null,2));
  console.log('Verified image hashes, metadata removal, dimensions, srcsets, exclusive derivative distribution and 500 KB / 1.5 MB budgets.');
}
