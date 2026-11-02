import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Lending Ezy — Operations Preview',description:'Sandbox lending platform control centre.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
