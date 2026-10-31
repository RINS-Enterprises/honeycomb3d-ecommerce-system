// The admin API handlers, run against a fake GitHub and Vercel (global fetch is replaced). No network, no real secrets.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Readable} from 'node:stream';

const products=JSON.parse(await readFile(new URL('../data/products.json',import.meta.url),'utf8'));
const store=JSON.parse(await readFile(new URL('../data/store.json',import.meta.url),'utf8'));
const ENV={ADMIN_PASSWORD:'test password',ADMIN_SESSION_SECRET:'test secret',GITHUB_TOKEN:'gh-test',VERCEL_TOKEN:'vc-test'};
const ORIGIN='https://honeycomb3d.store';
let head='a'.repeat(40), calls=[], files={};
const reset=()=>{head='a'.repeat(40);calls=[];files={'data/products.json':JSON.stringify(products),'data/store.json':JSON.stringify(store)};};
globalThis.fetch=async(url,opts={})=>{
  const u=new URL(url),body=opts.body&&JSON.parse(opts.body);calls.push({url:u.pathname,method:opts.method||'GET',body,auth:opts.headers.Authorization});
  const json=(v,status=200)=>new Response(JSON.stringify(v),{status});
  if(u.pathname.endsWith('/git/ref/heads/claude%2Ffunny-albattani-c5a91a'))return json({object:{sha:head}});
  const file=/\/contents\/(.+)$/.exec(u.pathname)?.[1];
  if(file)return files[file]!==undefined?new Response(files[file]):json({},404);
  if(u.pathname.includes('/git/commits/'))return json({tree:{sha:'t0'}});
  if(u.pathname.endsWith('/git/trees')){for(const t of body.tree)files[t.path]=t.content;return json({sha:'t1'});}
  if(u.pathname.endsWith('/git/commits'))return json({sha:'b'.repeat(40)});
  if(u.pathname.includes('/git/refs/heads/')){head=body.sha;return json({});}
  if(u.hostname==='api.vercel.com'&&opts.method==='POST')return json({id:'dpl_TESTDEPLOYMENT1'});
  if(u.hostname==='api.vercel.com')return json({readyState:'READY'});
  return json({},404);
};
async function run(name,{method='GET',body,cookie,origin=ORIGIN,type='application/json',url='/api/admin/'+name}={}) {
  const req=Readable.from(body===undefined?[]:[JSON.stringify(body)]);
  Object.assign(req,{method,url,headers:{origin,'content-type':type,...(cookie?{cookie}:{})}});
  const res={statusCode:0,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;},end(b){this.body=b;}};
  await (await import('../api/admin/'+name+'.mjs')).default(req,res);
  return {status:res.statusCode,headers:res.headers,json:res.headers['content-type']?.startsWith('application/json')?JSON.parse(res.body):null,raw:res.body};
}
async function login() {
  const r=await run('login',{method:'POST',body:{password:ENV.ADMIN_PASSWORD}});
  assert.equal(r.status,200);
  const c=r.headers['set-cookie'];assert.match(c,/HttpOnly/);assert.match(c,/Secure/);assert.match(c,/SameSite=Strict/);assert.match(c,/Path=\/api\/admin/);
  return c.split(';')[0];
}

test('without its four secrets the admin answers 503 and does nothing',async()=>{
  reset();for(const k of Object.keys(ENV))delete process.env[k];
  assert.equal((await run('data')).status,503);assert.equal(calls.length,0);
});
test('login: wrong password, wrong origin and non-JSON are refused; secrets never appear in answers',async()=>{
  reset();Object.assign(process.env,ENV);
  const bad=await run('login',{method:'POST',body:{password:'nope'}});assert.equal(bad.status,401);assert.equal(bad.headers['set-cookie'],undefined);
  assert.equal((await run('login',{method:'POST',body:{password:ENV.ADMIN_PASSWORD},origin:'https://evil.example'})).status,403);
  assert.equal((await run('login',{method:'POST',body:{password:ENV.ADMIN_PASSWORD},type:'text/plain'})).status,415);
  assert.equal((await run('login',{body:{password:ENV.ADMIN_PASSWORD}})).status,405);
  const cookie=await login();
  for(const r of [await run('data',{cookie}),bad])for(const v of Object.values(ENV))assert(!JSON.stringify(r.json).includes(v),'No secret in an answer');
});
test('reads need a valid session',async()=>{
  reset();Object.assign(process.env,ENV);
  assert.equal((await run('data')).status,401);
  assert.equal((await run('data',{cookie:'hc_admin=9999999999999.'+'A'.repeat(43)})).status,401);
  const r=await run('data',{cookie:await login()});
  assert.equal(r.status,200);assert.equal(r.json.head,head);
  assert.equal(r.json.products.length,products.length,'Pending products are included');
  assert(calls.every(c=>c.url.startsWith('/repos/RINS-Enterprises/honeycomb3d-ecommerce-system/')&&c.auth==='Bearer gh-test'));
});
test('save: approve flow commits both files on the seen head, then deploys that commit to production',async()=>{
  reset();Object.assign(process.env,ENV);const cookie=await login();
  const live=products.find(p=>p.approved);
  const r=await run('save',{method:'POST',cookie,body:{head,edits:[{id:live.id,fields:{availability:'unavailable'}}]}});
  assert.equal(r.status,200);assert.equal(r.json.deployment,'dpl_TESTDEPLOYMENT1');assert.equal(r.json.head,'b'.repeat(40));
  assert.equal(JSON.parse(files['data/products.json']).find(p=>p.id===live.id).availability,'unavailable');
  const commit=calls.find(c=>c.url.endsWith('/git/commits')&&c.method==='POST');assert.deepEqual(commit.body.parents,['a'.repeat(40)]);assert.match(commit.body.message,/^Admin: edit /);
  const ref=calls.find(c=>c.method==='PATCH');assert.equal(ref.body.force,false,'Never force-push');
  const dep=calls.find(c=>c.url==='/v13/deployments'&&c.method==='POST');
  assert.equal(dep.body.target,'production');assert.equal(dep.body.gitSource.sha,'b'.repeat(40));assert.equal(dep.body.gitSource.ref,'claude/funny-albattani-c5a91a');assert.equal(dep.auth,'Bearer vc-test');
  assert.equal((await run('status',{cookie,url:'/api/admin/status?id=dpl_TESTDEPLOYMENT1'})).json.state,'READY');
  assert.equal((await run('status',{cookie,url:'/api/admin/status?id=../../x'})).status,400);
});
test('save refuses a stale page, invalid changes and non-editable fields without writing',async()=>{
  reset();Object.assign(process.env,ENV);const cookie=await login();const live=products.find(p=>p.approved);
  const before=calls.length;
  assert.equal((await run('save',{method:'POST',cookie,body:{head:'c'.repeat(40),edits:[{id:live.id,fields:{name:'X'}}]}})).status,409);
  const bad=await run('save',{method:'POST',cookie,body:{head,edits:[{id:live.id,fields:{image:'/assets/x.webp'}}]}});
  assert.equal(bad.status,400);assert.match(bad.json.error,/Not editable/);
  assert(!calls.slice(before).some(c=>c.method!=='GET'),'Nothing written');
});
test('images: only asset paths, only with a session',async()=>{
  reset();Object.assign(process.env,ENV);files['public/assets/x-sq-320.webp']='IMG';const cookie=await login();
  assert.equal((await run('image',{url:'/api/admin/image?src=/assets/x-sq-320.webp'})).status,401);
  const ok=await run('image',{cookie,url:'/api/admin/image?src=/assets/x-sq-320.webp'});assert.equal(ok.status,200);assert.equal(ok.headers['content-type'],'image/webp');
  for(const src of ['/assets/../data/store.json','/data/store.json','/assets/x.svg'])assert.equal((await run('image',{cookie,url:'/api/admin/image?src='+encodeURIComponent(src)})).status,400);
});
