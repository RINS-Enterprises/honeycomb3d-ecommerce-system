import {guard, send, readCatalog, commitCatalog, deploy, repoIsPrivate} from '../_admin.mjs';
import {applyAdminChanges, touchesPrivate} from '../../src/admin-core.mjs';
// POST {head, edits?, create?, promos?}: check, commit to the release branch, then publish that commit to production.
// The production build runs the site checks, so a change that breaks them fails the build and the live site stays as it was.
export default async function handler(req, res) {
  const body = await guard(req, res, {method:'POST'});
  if (!body) return;
  // The data files are committed to GitHub: partner costs and promo notes only while the repository is private.
  try { if (touchesPrivate(body) && !await repoIsPrivate()) return send(res, 400, {error:'Partner costs and promo notes are private. Make the GitHub repository private first (see docs/pm/ADMIN-SETUP.md), or leave them empty.'}); }
  catch (e) { return send(res, 502, {error:'Could not check the repository ('+e.message+').'}); }
  let catalog;
  try { catalog = await readCatalog(); } catch (e) { return send(res, 502, {error:'Could not read the catalog ('+e.message+').'}); }
  if (body.head !== catalog.head) return send(res, 409, {error:'The catalog changed since you opened this page. Reload and try again.'});
  let next;
  try { next = applyAdminChanges(catalog.products, catalog.store, {edits:body.edits, create:body.create, promos:body.promos}); }
  catch (e) { return send(res, 400, {error:e.message}); }
  let sha;
  try { sha = await commitCatalog(catalog.head, next.products, next.store, next.summary); }
  catch (e) { return send(res, e.status===422?409:502, {error:e.status===422?'The catalog changed while saving. Reload and try again.':'Could not save ('+e.message+').'}); }
  try { send(res, 200, {head:sha, deployment:await deploy(sha), summary:next.summary}); }
  catch (e) { send(res, 200, {head:sha, deployment:null, summary:next.summary, warning:'Saved, but publishing failed ('+e.message+'). Check VERCEL_TOKEN; the change goes live with the next publish.'}); }
}
