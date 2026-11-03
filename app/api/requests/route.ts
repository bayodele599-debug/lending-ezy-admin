import {NextRequest,NextResponse} from "next/server";
import {COOKIE_NAME,validSession} from "../../../lib/security";
import {adminFetch} from "../../../lib/backend";
export const dynamic="force-dynamic";
export async function GET(req:NextRequest){
 if(!validSession(req.cookies.get(COOKIE_NAME)?.value))return NextResponse.json({error:"Unauthorized"},{status:401});
 const u=new URL(req.url),q=new URLSearchParams(),status=u.searchParams.get("status"),kind=u.searchParams.get("kind"),offset=Number(u.searchParams.get("offset")||"0");
 if(status&&!["submitted","in_review","needs_information","proceed_to_next_stage","not_proceeding","closed"].includes(status))return NextResponse.json({error:"Invalid status"},{status:422});
 if(kind&&!["personal","business"].includes(kind))return NextResponse.json({error:"Invalid financing type"},{status:422});
 if(!Number.isSafeInteger(offset)||offset<0||offset>10000)return NextResponse.json({error:"Invalid pagination"},{status:422});
 if(status)q.set("status",status);if(kind)q.set("kind",kind);q.set("offset",String(offset));q.set("limit","50");
 try{const r=await adminFetch("/api/v1/admin/financing-requests?"+q);return NextResponse.json(await r.json(),{status:r.status,headers:{"Cache-Control":"no-store"}})}
 catch{return NextResponse.json({error:"Financing request service is unavailable"},{status:502})}
}
