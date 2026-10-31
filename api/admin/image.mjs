import {guard, send, readAsset} from '../_admin.mjs';
// GET ?src=/assets/x-sq-320.webp: product photos for the admin page, including pending products not on the shop yet.
const TYPES = {webp:'image/webp', jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png'};
export default async function handler(req, res) {
  if (!await guard(req, res)) return;
  const src = new URL(req.url, 'http://x').searchParams.get('src') || '';
  const m = /^\/assets\/[a-zA-Z0-9_-]+\.(webp|jpg|jpeg|png)$/.exec(src);
  if (!m) return send(res, 400, {error:'Bad image path'});
  try {
    const body = Buffer.from(await readAsset(src));
    res.statusCode = 200; res.setHeader('Content-Type', TYPES[m[1]]); res.setHeader('Cache-Control', 'private, max-age=600'); res.setHeader('X-Content-Type-Options','nosniff'); res.end(body);
  } catch { send(res, 404, {error:'Not found'}); }
}
