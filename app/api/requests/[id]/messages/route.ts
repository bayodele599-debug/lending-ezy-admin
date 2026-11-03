import {NextRequest,NextResponse} from "next/server";
import {COOKIE_NAME,validSession,sameOrigin} from "../../../../../lib/security";
import {adminFetch} from "../../../../../lib/backend";
type Context={params:Promise<{id:string}>};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const response=(error:string,status:number)=>NextResponse.json({error},{status,headers:{"Cache-Control":"no-store"}});
export async function GET(req:NextRequest,ctx:Context){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))return response("Unauthorized",401);
 const {id}=await ctx.params;
 if(!uuid.test(id))return response("Invalid reference",400);
 try{
  const r=await adminFetch("/api/v1/admin/financing-requests/"+id+"/messages");
  return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}});
 }catch{return response("Financing message service unavailable",502);}
}
export async function POST(req:NextRequest,ctx:Context){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))return response("Unauthorized",401);
 if(!sameOrigin(req.headers.get("origin"),req.url)||req.headers.get("sec-fetch-site")==="cross-site")return response("Invalid origin",403);
 const {id}=await ctx.params;
 if(!uuid.test(id))return response("Invalid reference",400);
 const input=await req.json().catch(()=>null);
 if(!input||typeof input.body!=="string"||input.body.trim().length<2||input.body.length>2000)return response("Enter a message between 2 and 2000 characters",422);
 try{
  const r=await adminFetch("/api/v1/admin/financing-requests/"+id+"/messages",{method:"POST",body:JSON.stringify({body:input.body.trim()})});
  return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}});
 }catch{return response("Financing message service unavailable",502);}
}
