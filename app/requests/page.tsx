import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {COOKIE_NAME,validSession} from "../../lib/security";
import RequestsClient from "./requests-client";
export const dynamic="force-dynamic";
export default async function Requests(){const jar=await cookies();if(!validSession(jar.get(COOKIE_NAME)?.value))redirect("/login");return <RequestsClient/>;}
