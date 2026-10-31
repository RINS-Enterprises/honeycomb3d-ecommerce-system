import {guard, send, readCatalog} from '../_admin.mjs';
import {adminView} from '../../src/admin-core.mjs';
// GET: every product (pending too) and the promo codes, at the release branch's latest commit.
export default async function handler(req, res) {
  if (!await guard(req, res)) return;
  try { const {head, products, store} = await readCatalog(); send(res, 200, {head, ...adminView(products, store)}); }
  catch (e) { send(res, 502, {error:'Could not read the catalog ('+e.message+'). Check GITHUB_TOKEN.'}); }
}
