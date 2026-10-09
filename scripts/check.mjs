import {readFile,stat,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {validateData,visibleProducts} from '../src/domain.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
assert((await readdir(join(root,'tests'))).some(name=>name.endsWith('.test.mjs')), 'At least one unit-test file must exist');
const all=JSON.parse(await readFile(join(root,'data/products.json'),'utf8'));
const store=JSON.parse(await readFile(join(root,'data/store.json'),'utf8'));
validateData(all,store);
const products=visibleProducts(all,store);
const publicProducts=JSON.parse(await readFile(join(root,'dist/data/products.json'),'utf8'));
for(const p of publicProducts) {
  assert.equal(p.copyStatus,undefined,'Copy approval workflow must not be published');
  assert.equal(p.imageSource,undefined,'Recovery asset filenames must not be published');
  assert.equal(p.source,'Public catalog','Recovery evidence must stay in source data');
}
const paths=['index.html','shop/index.html','cart/index.html','custom/index.html','privacy/index.html','404.html',...products.map(p=>'products/'+p.slug+'/index.html')];
for(const path of paths) {
  const html=await readFile(join(root,'dist',path),'utf8');
  assert.match(html,/<html lang="en">/);assert.match(html,/<main id="main"/);
  assert.match(html,/<title>[^<]+<\/title>/);
  assert(!/\b(?:undefined|NaN)\b/.test(html),'Unexpected value: '+path);
  for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    let local=decodeURIComponent(href.split('?')[0]);
    if(local.endsWith('/'))local+='index.html';
    await stat(join(root,'dist',local));
  }
}
console.log('Verified '+paths.length+' generated pages and their local links/assets.');
