import 'server-only';
import {createHmac,timingSafeEqual} from 'crypto';
const COOKIE='lending_ezy_admin_session';
export const COOKIE_NAME=COOKIE;
function secret(){const s=process.env.ADMIN_SESSION_SECRET||'';return s.length>=32?s:'';}
function digest(value:string){return createHmac('sha256',secret()).update(value).digest('hex');}
export function issueSession(){if(!secret())throw new Error('Admin sessions not configured');const deadline=String(Date.now()+8*60*60*1000);return deadline+'.'+digest(deadline);}
export function validSession(value:string|undefined):boolean{
 if(!value||!secret())return false;const parts=value.split('.');if(parts.length!==2)return false;
 const [deadline,mac]=parts;if(!/^\d{13}$/.test(deadline)||!Number.isSafeInteger(Number(deadline))||Number(deadline)<Date.now()||!(/^[a-f0-9]{64}$/.test(mac)))return false;
 return timingSafeEqual(Buffer.from(mac,'hex'),Buffer.from(digest(deadline),'hex'));
}
export function checkPassword(password:string):boolean{
 const configured=process.env.ADMIN_PASSWORD||'';if(configured.length<16||!secret())return false;
 const digestInput=createHmac('sha256',secret()).update(password).digest();
 const expected=createHmac('sha256',secret()).update(configured).digest();
 return timingSafeEqual(digestInput,expected);
}
export function configured(){return (process.env.ADMIN_PASSWORD||'').length>=16 && Boolean(secret()) && (process.env.ADMIN_API_TOKEN||'').length>=32;}
export function sameOrigin(origin:string|null,requestUrl:string):boolean{return !origin||origin===new URL(requestUrl).origin;}
