// The store settings for a build: data/store.json, with an optional test fixture merged over it (STORE_PATCH=path/to/patch.json).
// Production builds never set STORE_PATCH. It lets tests build preview and switched-on states without editing data/.
import {readFile} from 'node:fs/promises';
import {join,resolve,sep} from 'node:path';
export async function loadStore(root, patchPath=process.env.STORE_PATCH) {
  const store=JSON.parse(await readFile(join(root,'data/store.json'),'utf8'));
  if(!patchPath)return store;
  // Guards, not promises: a fixture can never reach a Vercel build, and only files in tests/fixtures/ are accepted.
  if(process.env.VERCEL)throw new Error('STORE_PATCH is set in a Vercel build. Fixtures are for local tests only; remove it from the project settings.');
  const fixtures=join(root,'tests','fixtures'), full=resolve(root,patchPath);
  if(!full.startsWith(fixtures+sep))throw new Error('STORE_PATCH must point to a file in tests/fixtures/');
  const patch=JSON.parse(await readFile(full,'utf8'));
  if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new Error('STORE_PATCH must be a JSON object');
  console.log('Store patch (test fixture, not for release): '+patchPath);
  return {...store,...patch};
}
