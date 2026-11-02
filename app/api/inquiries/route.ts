import {NextRequest,NextResponse} from 'next/server';
import {validSession,COOKIE_NAME} from '../../../lib/security';
import {adminFetch} from '../../../lib/backend';
export async function GET(request:NextRequest){
 if(!validSession(request.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const url=new URL(request.url);const qs=new URLSearchParams();for(const k of ['kind','status']){const v=url.searchParams.get(k);if(v)qs.set(k,v);}const upstream=await adminFetch('/api/v1/admin/inquiries?'+qs.toString());const body=await upstream.json();return NextResponse.json(body,{status:upstream.status});}
 catch{return NextResponse.json({error:'Backend is unavailable'},{status:502});}
}
