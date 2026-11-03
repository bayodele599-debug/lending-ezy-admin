import {NextRequest,NextResponse} from "next/server";
import {COOKIE_NAME,validSession,sameOrigin} from "../../../../lib/security";
import {adminFetch} from "../../../../lib/backend";
type Context={params:Promise<{id:string}>};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const states=["submitted","in_review","needs_information","proceed_to_next_stage","not_proceeding","closed"];
export async function GET(req:NextRequest,ctx:Context){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:"Unauthorized"},{status:401});
 const {id}=await ctx.params;if(!uuid.test(id))return NextResponse.json({error:"Invalid reference"},{status:400});
 try{const r=await adminFetch("/api/v1/admin/financing-requests/"+id);return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}})}
 catch{return NextResponse.json({error:"Financing request service is unavailable"},{status:502})}
}
export async function PATCH(req:NextRequest,ctx:Context){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!sameOrigin(req.headers.get("origin"),req.url))return NextResponse.json({error:"Invalid origin"},{status:403});
 const {id}=await ctx.params;if(!uuid.test(id))return NextResponse.json({error:"Invalid reference"},{status:400});
 const body=await req.json().catch(()=>null);
 if(!body||!states.includes(body.status)||!states.includes(body.expected_status)||typeof body.note!=="string"||body.note.trim().length<3||body.note.length>3000)return NextResponse.json({error:"Review stage and reason required"},{status:422});
 try{const r=await adminFetch("/api/v1/admin/financing-requests/"+id,{method:"PATCH",body:JSON.stringify({status:body.status,expected_status:body.expected_status,note:body.note.trim()})});return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}})}
 catch{return NextResponse.json({error:"Financing request service is unavailable"},{status:502})}
}
