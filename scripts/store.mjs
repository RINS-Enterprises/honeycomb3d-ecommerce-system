// The store settings for a build: data/store.json, with an optional test fixture merged over it (STORE_PATCH=path/to/patch.json).
// Production builds never set STORE_PATCH. It lets tests build preview and switched-on states without editing data/.
import {readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
export async function loadStore(root, patchPath=process.env.STORE_PATCH) {
  const store=JSON.parse(await readFile(join(root,'data/store.json'),'utf8'));
  if(!patchPath)return store;
  const patch=JSON.parse(await readFile(resolve(root,patchPath),'utf8'));
  if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new Error('STORE_PATCH must be a JSON object');
  console.log('Store patch (test fixture, not for release): '+patchPath);
  return {...store,...patch};
}
