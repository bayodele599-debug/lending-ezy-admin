import {NextRequest,NextResponse} from 'next/server';
import {checkPassword,configured,issueSession,COOKIE_NAME,sameOrigin} from '../../../lib/security';
export async function POST(request:NextRequest){
 if(!sameOrigin(request.headers.get('origin'),request.url))return NextResponse.json({error:'Invalid origin'},{status:403});
 if(!configured())return NextResponse.json({error:'Admin login has not been configured yet'},{status:503});
 const data=await request.json().catch(()=>({}));
 if(typeof data.password!=='string'||data.password.length>500||!checkPassword(data.password))return NextResponse.json({error:'Invalid credentials'},{status:401});
 const response=NextResponse.json({authenticated:true});
 response.cookies.set({name:COOKIE_NAME,value:issueSession(),httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*60*60});
 return response;
}
