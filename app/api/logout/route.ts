import {NextRequest,NextResponse} from 'next/server';
import {COOKIE_NAME,sameOrigin} from '../../../lib/security';
export async function POST(request:NextRequest){
 if(!sameOrigin(request.headers.get('origin'),request.url))return NextResponse.json({error:'Invalid origin'},{status:403});
 const response=NextResponse.json({success:true});response.cookies.set({name:COOKIE_NAME,value:'',path:'/',maxAge:0});return response;
}
