'use client';
import {FormEvent,useState} from 'react';
import {LockKeyhole,ShieldAlert,ArrowRight} from 'lucide-react';
export default function Login(){
 const [password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(event:FormEvent){event.preventDefault();setBusy(true);setError('');try{
 const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
 const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Unable to sign in');window.location.assign('/requests');
 }catch(e){setError(e instanceof Error?e.message:'Authentication failed');}finally{setBusy(false)}}
 return <main className="login-shell"><div className="login-card"><div className="login-mark"><LockKeyhole size={28}/></div><span className="login-label">LENDING EZY · SECURE OPERATIONS</span><h1>Admin access</h1><p>Sign in to review financing requests, make administrative decisions and manage enquiries.</p><form onSubmit={submit}><label htmlFor="admin-pass">Administrator password</label><input id="admin-pass" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/>{error&&<p role="alert" className="login-error">{error}</p>}<button disabled={busy} type="submit"> {busy?'Checking…':'Sign in securely'} <ArrowRight size={17}/></button></form><div className="login-foot"><ShieldAlert size={17}/> Login requires configured server secrets. No default administrator account exists.</div></div></main>;
}
