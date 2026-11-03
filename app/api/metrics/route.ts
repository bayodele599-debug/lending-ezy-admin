import {NextRequest,NextResponse} from "next/server";
import {COOKIE_NAME,validSession} from "../../../lib/security";
import {adminFetch} from "../../../lib/backend";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))
  return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const r=await adminFetch("/api/v1/admin/financing-metrics?days=30");
  return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Finance metrics unavailable"},{status:502});}
}
