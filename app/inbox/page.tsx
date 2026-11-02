import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {COOKIE_NAME,validSession} from '../../lib/security';
import InboxClient from './inbox-client';
export const dynamic='force-dynamic';
export default async function Inbox(){const cookieStore=await cookies();if(!validSession(cookieStore.get(COOKIE_NAME)?.value))redirect('/login');return <InboxClient/>;}
