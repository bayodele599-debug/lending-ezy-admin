import 'server-only';
export async function adminFetch(path:string,init:RequestInit={}):Promise<Response>{
 const host=(process.env.INTERNAL_API_URL||'http://localhost:8000').replace(/\/$/,'');
 const secret=process.env.ADMIN_API_TOKEN||'';
 if(secret.length<32)throw new Error('Administrative backend not configured');
 const headers=new Headers(init.headers);
 headers.set('X-Admin-Key',secret);headers.set('Accept','application/json');
 if(init.body)headers.set('Content-Type','application/json');
 return fetch(host+path,{...init,headers,cache:'no-store',redirect:'error'});
}
