import {guard, send, COOKIE} from '../_admin.mjs';
export default async function handler(req, res) {
  if (!await guard(req, res, {method:'POST', session:false})) return;
  send(res, 200, {ok:true}, {'Set-Cookie':COOKIE+'=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});
}
