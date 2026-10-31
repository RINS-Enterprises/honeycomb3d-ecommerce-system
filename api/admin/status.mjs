import {guard, send, deploymentState} from '../_admin.mjs';
// GET ?id=dpl_…: READY, ERROR, BUILDING…
export default async function handler(req, res) {
  if (!await guard(req, res)) return;
  const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
  if (!/^dpl_[A-Za-z0-9]{10,40}$/.test(id)) return send(res, 400, {error:'Bad deployment id'});
  try { send(res, 200, {state:await deploymentState(id)}); } catch (e) { send(res, 502, {error:'Could not read the deployment ('+e.message+')'}); }
}
