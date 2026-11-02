import {NextRequest,NextResponse} from 'next/server';
import {validSession,COOKIE_NAME,sameOrigin} from '../../../../lib/security';
import {adminFetch} from '../../../../lib/backend';
type Context={params:Promise<{id:string}>};
const uuid=/^[0-9a-f-]{36}$/i;
export async function GET(request:NextRequest,ctx:Context){
 if(!validSession(request.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:'Unauthorized'},{status:401});
 const {id}=await ctx.params;if(!uuid.test(id))return NextResponse.json({error:'Invalid ID'},{status:400});
 try{const r=await adminFetch('/api/v1/admin/inquiries/'+encodeURIComponent(id));return NextResponse.json(await r.json(),{status:r.status});}
 catch{return NextResponse.json({error:'Backend is unavailable'},{status:502});}
}
export async function PATCH(request:NextRequest,ctx:Context){
 if(!validSession(request.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!sameOrigin(request.headers.get('origin'),request.url))return NextResponse.json({error:'Invalid origin'},{status:403});
 const {id}=await ctx.params;if(!uuid.test(id))return NextResponse.json({error:'Invalid ID'},{status:400});
 const body=await request.json().catch(()=>null);
 if(!body||!['new','in_progress','replied','closed'].includes(body.status))return NextResponse.json({error:'Invalid status'},{status:422});
 try{const r=await adminFetch('/api/v1/admin/inquiries/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({status:body.status})});return NextResponse.json(await r.json(),{status:r.status});}
 catch{return NextResponse.json({error:'Backend is unavailable'},{status:502});}
}
