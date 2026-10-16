import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const base=resolve(root);
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.ico':'image/vnd.microsoft.icon','.woff2':'font/woff2'};
const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'";
export const server=http.createServer(async(req,res)=>{
  res.setHeader('Content-Security-Policy',csp);res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  let path;
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname.includes('\0')||pathname.includes('\\'))throw new Error();
    path=resolve(base,'.'+pathname);
    if(path!==base&&!path.startsWith(base+sep))throw new Error();
  }catch{res.writeHead(400);return res.end('Bad request');}
  try {
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const body=await readFile(path);res.setHeader('Content-Type',types[extname(path)]||'application/octet-stream');
    res.writeHead(200);res.end(req.method==='HEAD'?undefined:body);
  }catch{
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    const body=await readFile(resolve(base,'404.html')).catch(()=>Buffer.from('Not found'));
    res.end(req.method==='HEAD'?undefined:body);
  }
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+server.address().port));
