// Shared helpers for the admin API (files starting with _ are not functions on Vercel).
// Secrets come only from the Vercel project's environment variables and are never logged or returned.
import {verifySession, sessionKey, MIN_PASSWORD} from '../src/admin-core.mjs';

export const config = {
  repo: process.env.ADMIN_REPO || 'RINS-Enterprises/honeycomb3d-ecommerce-system',
  branch: process.env.ADMIN_BRANCH || 'claude/funny-albattani-c5a91a',
  team: process.env.ADMIN_VERCEL_TEAM || 'team_dErX7uzTIgpWT6SY1Syo3uxr',
  project: process.env.ADMIN_VERCEL_PROJECT || 'prj_gpsHMSC2HZWoBOrx79ypk36O2rsS',
  origins: (process.env.ADMIN_ORIGINS || 'https://honeycomb3d.store,https://www.honeycomb3d.store').split(',').map(x=>x.trim()).filter(Boolean),
};
const NEEDED = ['ADMIN_PASSWORD','ADMIN_SESSION_SECRET','GITHUB_TOKEN','VERCEL_TOKEN'];
export const COOKIE = 'hc_admin';

export function send(res, status, body, headers={}) {
  res.statusCode = status;
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex');
  for (const [k,v] of Object.entries(headers)) res.setHeader(k,v);
  res.end(JSON.stringify(body));
}
const cookie = req => Object.fromEntries((req.headers.cookie||'').split(';').map(x=>x.trim().split('=')).filter(x=>x.length===2))[COOKIE];

// Every request: set up, same origin for writes, JSON bodies, and (unless login) a valid session.
export async function guard(req, res, {method='GET', session=true}={}) {
  if (NEEDED.some(k=>!process.env[k])) { send(res,503,{error:'The admin is not set up yet. See docs/pm/ADMIN-SETUP.md.'}); return null; }
  if (process.env.ADMIN_PASSWORD.length<MIN_PASSWORD) { send(res,503,{error:'ADMIN_PASSWORD is too short: use at least '+MIN_PASSWORD+' characters.'}); return null; }
  if (req.method!==method) { send(res,405,{error:'Method not allowed'},{Allow:method}); return null; }
  if (method!=='GET') {
    if (!config.origins.includes(req.headers.origin)) { send(res,403,{error:'Wrong origin'}); return null; }
    if (!String(req.headers['content-type']||'').startsWith('application/json')) { send(res,415,{error:'JSON only'}); return null; }
  }
  if (session && !verifySession(cookie(req), sessionKey(process.env.ADMIN_SESSION_SECRET, process.env.ADMIN_PASSWORD))) { send(res,401,{error:'Please log in'}); return null; }
  if (method==='GET') return {};
  let body = req.body;
  if (body === undefined) {
    let raw=''; for await (const chunk of req) { raw+=chunk; if (raw.length>200_000) { send(res,413,{error:'Too large'}); return null; } }
    try { body = JSON.parse(raw||'{}'); } catch { send(res,400,{error:'Bad JSON'}); return null; }
  }
  if (!body || typeof body!=='object' || Array.isArray(body)) { send(res,400,{error:'Expected a JSON object'}); return null; }
  return body;
}

async function api(url, {token, method='GET', body, accept='application/vnd.github+json'}={}) {
  const r = await fetch(url, {method, headers:{Authorization:'Bearer '+token, Accept:accept, 'Content-Type':'application/json', 'User-Agent':'honeycomb3d-admin', 'X-GitHub-Api-Version':'2022-11-28'}, body:body&&JSON.stringify(body)});
  if (!r.ok) { const e = new Error(new URL(url).hostname+' '+r.status); e.status = r.status; throw e; }
  return accept.includes('raw') ? r.arrayBuffer() : r.json();
}
const gh = (path, opts={}) => api('https://api.github.com/repos/'+config.repo+path, {token:process.env.GITHUB_TOKEN, ...opts});

export const repoIsPrivate = async () => (await gh('')).private === true;
export async function readCatalog() {
  const ref = await gh('/git/ref/heads/'+encodeURIComponent(config.branch));
  const head = ref.object.sha, file = async p => JSON.parse(Buffer.from(await gh('/contents/'+p+'?ref='+head, {accept:'application/vnd.github.raw+json'})).toString('utf8'));
  return {head, products:await file('data/products.json'), store:await file('data/store.json')};
}
export const readAsset = path => gh('/contents/public'+path+'?ref='+encodeURIComponent(config.branch), {accept:'application/vnd.github.raw+json'});

// One commit with both data files on top of the head the admin page saw. If the branch moved, nothing is written.
export async function commitCatalog(baseHead, products, store, message) {
  const tree = await gh('/git/trees', {method:'POST', body:{base_tree:(await gh('/git/commits/'+baseHead)).tree.sha, tree:[
    {path:'data/products.json', mode:'100644', type:'blob', content:JSON.stringify(products,null,2)+'\n'},
    {path:'data/store.json', mode:'100644', type:'blob', content:JSON.stringify(store,null,2)+'\n'}]}});
  const commit = await gh('/git/commits', {method:'POST', body:{message:message+'\n\nSaved from the HoneyComb 3D admin page.', tree:tree.sha, parents:[baseHead]}});
  await gh('/git/refs/heads/'+encodeURIComponent(config.branch), {method:'PATCH', body:{sha:commit.sha, force:false}});
  return commit.sha;
}
const vercel = (path, opts={}) => api('https://api.vercel.com'+path+(path.includes('?')?'&':'?')+'teamId='+config.team, {token:process.env.VERCEL_TOKEN, ...opts});
export async function deploy(sha) {
  const [org, repo] = config.repo.split('/');
  const d = await vercel('/v13/deployments', {method:'POST', body:{name:'honeycomb3d-storefront-preview', project:config.project, target:'production', gitSource:{type:'github', org, repo, ref:config.branch, sha}}});
  return d.id;
}
export const deploymentState = async id => (await vercel('/v13/deployments/'+encodeURIComponent(id))).readyState;
