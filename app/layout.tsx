import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Lending Ezy — Operations',description:'Protected financing request review and enquiry operations.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
