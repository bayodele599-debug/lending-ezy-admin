import {NextRequest,NextResponse} from 'next/server';
import {validSession,COOKIE_NAME,sameOrigin} from '../../../../../lib/security';
import {adminFetch} from '../../../../../lib/backend';
type Context={params:Promise<{id:string}>};
export async function POST(request:NextRequest,ctx:Context){
 if(!validSession(request.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!sameOrigin(request.headers.get('origin'),request.url))return NextResponse.json({error:'Invalid origin'},{status:403});
 const {id}=await ctx.params;
 if(!/^[0-9a-f-]{36}$/i.test(id))return NextResponse.json({error:'Invalid ID'},{status:400});
 const body=await request.json().catch(()=>null);
 if(!body||typeof body.body!=='string'||body.body.trim().length<1||body.body.length>10000||!['save_draft','send'].includes(body.action))return NextResponse.json({error:'Invalid reply'},{status:422});
 try{const r=await adminFetch('/api/v1/admin/inquiries/'+encodeURIComponent(id)+'/reply',{method:'POST',body:JSON.stringify({body:body.body,action:body.action})});const out=await r.json();return NextResponse.json(out,{status:r.status});}
 catch{return NextResponse.json({error:'Backend is unavailable'},{status:502});}
}
