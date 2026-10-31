import {guard, send, COOKIE} from '../_admin.mjs';
import {passwordMatches, signSession, sessionKey, SESSION_HOURS} from '../../src/admin-core.mjs';
// POST {password}. A wrong password waits before answering, to slow down guessing.
export default async function handler(req, res) {
  const body = await guard(req, res, {method:'POST', session:false});
  if (!body) return;
  if (!passwordMatches(body.password, process.env.ADMIN_PASSWORD)) {
    await new Promise(r=>setTimeout(r,800));
    return send(res, 401, {error:'Wrong password'});
  }
  send(res, 200, {ok:true}, {'Set-Cookie':COOKIE+'='+signSession(sessionKey(process.env.ADMIN_SESSION_SECRET, process.env.ADMIN_PASSWORD))+'; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age='+SESSION_HOURS*3600});
}
