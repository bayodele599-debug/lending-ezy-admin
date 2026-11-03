"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,Check,ClipboardList,Inbox,LockKeyhole,RefreshCcw,ShieldCheck,X} from "lucide-react";

type Status="submitted"|"in_review"|"needs_information"|"proceed_to_next_stage"|"not_proceeding"|"closed";
type Kind="personal"|"business";
type Entry={
 id:string;reference:string;status:Status;kind:Kind;purpose:string;country:string;
 name:string;email:string;business_name:string|null;currency:string;
 amount:string;term_months:number;assumed_annual_rate:string;created_at:string;
 message?:string|null;consent_at?:string;
 estimate?:{monthly_payment:string;total_interest:string;total_repayment:string};
};
type History={id:string;old_status:string|null;new_status:string;actor:string;note:string|null;created_at:string};
type Detail={request:Entry;history:History[]};
type Listing={requests:Entry[];total:number;offset:number;limit:number;error?:string};

const states:Record<Status,string>={
 submitted:"New",in_review:"Under review",needs_information:"More information needed",
 proceed_to_next_stage:"Proceed to next stage",not_proceeding:"Not proceeding",closed:"Closed"
};
const nextStages:Record<Status,Status[]>={
 submitted:["in_review","needs_information","not_proceeding","closed"],
 in_review:["needs_information","proceed_to_next_stage","not_proceeding","closed"],
 needs_information:["in_review","not_proceeding","closed"],
 proceed_to_next_stage:["in_review","closed"],
 not_proceeding:["in_review","closed"],closed:["in_review"]
};
function money(n:string,c:string){try{return new Intl.NumberFormat("en",{style:"currency",currency:c,maximumFractionDigits:2}).format(Number(n));}catch{return c+" "+n;}}
function date(s:string){try{return new Date(s).toLocaleString(undefined,{dateStyle:"medium",timeStyle:"short"});}catch{return s;}}

export default function RequestsClient(){
 const [items,setItems]=useState<Entry[]>([]);
 const [total,setTotal]=useState(0),[offset,setOffset]=useState(0);
 const [kind,setKind]=useState<Kind|"all">("all"),[stage,setStage]=useState<Status|"all">("all");
 const [search,setSearch]=useState(""),[selected,setSelected]=useState<string|null>(null);
 const [detail,setDetail]=useState<Detail|null>(null),[decision,setDecision]=useState<Status|"">("");
 const [note,setNote]=useState(""),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 const [error,setError]=useState(""),[notice,setNotice]=useState("");
 const load=useCallback(async()=>{
  setLoading(true);setError("");
  try{
   const q=new URLSearchParams({offset:String(offset)});
   if(kind!=="all")q.set("kind",kind);
   if(stage!=="all")q.set("status",stage);
   const res=await fetch("/api/requests?"+q,{cache:"no-store"});
   const data=await res.json() as Listing;
   if(!res.ok)throw new Error(data.error||"Unable to load review queue");
   setItems(data.requests||[]);setTotal(data.total||0);
  }catch(e){setItems([]);setTotal(0);setError(e instanceof Error?e.message:"Unable to load review queue")}
  finally{setLoading(false)}
 },[kind,stage,offset]);
 const open=useCallback(async(id:string)=>{
  setSelected(id);setDetail(null);setDecision("");setNote("");
  try{const res=await fetch("/api/requests/"+id,{cache:"no-store"});const data=await res.json();
   if(!res.ok)throw new Error(data.error||"Unable to open request");
   setDetail(data as Detail);
  }catch(e){setSelected(null);setError(e instanceof Error?e.message:"Unable to open request")}
 },[]);
 useEffect(()=>{void load()},[load]);
 const shown=useMemo(()=>items.filter(x=>!search.trim()||[x.name,x.email,x.id,x.purpose,x.country,x.business_name||""].some(v=>v.toLowerCase().includes(search.trim().toLowerCase()))),[items,search]);
 const active=detail?.request;
 async function submitReview(){
  if(!active||!decision||note.trim().length<3||busy)return;
  setBusy(true);setError("");setNotice("");
  try{
   const res=await fetch("/api/requests/"+active.id,{method:"PATCH",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({status:decision,expected_status:active.status,note:note.trim()})});
   const result=await res.json();
   if(!res.ok)throw new Error(result.detail||result.error||"Unable to record review");
   setNotice("Review saved with a reason and recorded in the case history.");
   await Promise.all([open(active.id),load()]);
  }catch(e){setError(e instanceof Error?e.message:"Unable to record review")}
  finally{setBusy(false)}
 }
 async function signout(){await fetch("/api/logout",{method:"POST"});window.location.assign("/login");}
 return <main className="review-app">
  <header className="review-header"><div className="review-header-inner">
   <Link href="/requests" className="review-brand"><span>le.</span><strong>lending ezy <small>OPERATIONS</small></strong></Link>
   <nav aria-label="Operations"><Link className="selected" href="/requests"><ClipboardList size={17}/> Requests</Link><Link href="/inbox"><Inbox size={17}/> Enquiry inbox</Link></nav>
   <button onClick={signout} type="button" className="review-logout"><LockKeyhole size={15}/> Sign out</button>
  </div></header>
  <div className="review-container">
   <div className="review-hero"><div><p className="review-eyebrow">FINANCING / OPERATIONS</p>
    <h1>Financing requests<span>.</span></h1><p>Review submitted plans, record next steps and keep a clear activity history.</p></div>
    <button type="button" className="review-refresh" onClick={()=>void load()} disabled={loading}><RefreshCcw size={17}/> Refresh</button></div>
   <div className="review-stats">
    <div><span>Requests matching filters</span><strong>{loading?"—":total}</strong><small>Including other pages</small></div>
    <div><span>On this page</span><strong>{loading?"—":items.length}</strong><small>Up to 50 records</small></div>
    <div><span>Awaiting attention</span><strong>{loading?"—":items.filter(x=>["submitted","in_review"].includes(x.status)).length}</strong><small>Visible-page count</small></div>
   </div>
   {error&&<div className="review-error" role="alert">{error}</div>}
   {notice&&<div className="review-notice" role="status"><Check size={18}/>{notice}<button type="button" aria-label="Dismiss" onClick={()=>setNotice("")}><X size={16}/></button></div>}
   <div className="review-workspace">
    <section className="review-queue"><div className="review-section-head"><p className="review-eyebrow">CASE INBOX</p><h2>Review queue</h2></div>
     <div className="review-filters">
      <label>Review stage<select aria-label="Review stage filter" value={stage} onChange={e=>{setStage(e.target.value as Status|"all");setOffset(0)}}>
       <option value="all">All stages</option>{Object.entries(states).map(([value,label])=><option value={value} key={value}>{label}</option>)}
      </select></label>
      <label>Financing type<select aria-label="Financing type filter" value={kind} onChange={e=>{setKind(e.target.value as Kind|"all");setOffset(0)}}>
       <option value="all">All types</option><option value="personal">Personal</option><option value="business">Business</option>
      </select></label>
     </div>
     <label className="review-search">Search this page<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name, reference, purpose…"/></label>
     <div className="review-items">{loading?<p className="review-empty">Loading requests…</p>:shown.length===0?<p className="review-empty">No requests match these filters.</p>:shown.map(x=>
      <button key={x.id} type="button" onClick={()=>void open(x.id)} className={"review-item"+(selected===x.id?" active":"")}>
       <span className="review-item-top"><strong>{x.name}</strong><span className={"review-status status-"+x.status}>{states[x.status]}</span></span>
       <span className="review-item-info">{x.kind==="personal"?"Personal":"Business"} / {x.purpose} / {x.country}</span>
       <span className="review-item-bottom"><strong>{money(x.amount,x.currency)}</strong><time>{date(x.created_at)}</time></span>
      </button>)}</div>
     <div className="review-page-controls"><button disabled={loading||offset===0} onClick={()=>setOffset(v=>Math.max(0,v-50))}>Previous</button><span>{total ? String(offset+1)+"–"+String(Math.min(total,offset+50))+" of "+total : "0 requests"}</span><button disabled={loading||offset+50>=total} onClick={()=>setOffset(v=>v+50)}>Next <ArrowRight size={15}/></button></div>
    </section>
    <section className="review-detail" aria-label="Financing case details">
     {!active||selected!==active.id?<div className="review-placeholder"><ClipboardList size={38}/><h2>Select a request</h2><p>Choose a case to review the applicant's details, financial estimate and history.</p></div>:
      <>
       <div className="review-detail-head"><div><p className="review-eyebrow">REFERENCE / {active.id.slice(0,8).toUpperCase()}</p><h2>{active.name}</h2><p>{active.kind==="personal"?"Personal":"Business"} financing · {active.country}</p></div><span className={"review-status status-"+active.status}>{states[active.status]}</span></div>
       <div className="review-metrics">
        <div><span>Amount</span><strong>{money(active.amount,active.currency)}</strong></div>
        <div><span>Term</span><strong>{active.term_months} months</strong></div>
        <div><span>Assumed annual rate</span><strong>{active.assumed_annual_rate}%</strong></div>
        <div><span>Est. monthly payment</span><strong>{money(active.estimate?.monthly_payment||"0",active.currency)}</strong></div>
        <div><span>Est. total repayment</span><strong>{money(active.estimate?.total_repayment||"0",active.currency)}</strong></div>
        <div><span>Purpose</span><strong>{active.purpose}</strong></div>
       </div>
       <div className="review-section"><p className="review-eyebrow">CONTACT DETAILS</p><p><strong>{active.name}</strong>{active.business_name?" · "+active.business_name:""}</p><p><a href={"mailto:"+active.email}>{active.email}</a></p><p>Consent recorded {active.consent_at?date(active.consent_at):"at submission"}</p></div>
       {active.message&&<div className="review-section"><p className="review-eyebrow">CUSTOMER MESSAGE</p><p>{active.message}</p></div>}
       <div className="review-action"><p className="review-eyebrow">MANUAL REVIEW</p><h3>Choose the next step</h3>
        <p>Administrative stages track internal progress. Updating them does not send a credit offer or email.</p>
        <label>Review stage<select value={decision} onChange={e=>setDecision(e.target.value as Status|"")}><option value="">Select next stage</option>{nextStages[active.status].map(s=><option key={s} value={s}>{states[s]}</option>)}</select></label>
        <label>Reason / internal note<textarea rows={4} maxLength={3000} value={note} onChange={e=>setNote(e.target.value)} placeholder="What was reviewed, and why is this status appropriate?"/></label>
        <button disabled={busy||!decision||note.trim().length<3} onClick={submitReview}><ShieldCheck size={17}/>{busy?"Saving…":"Save review decision"}</button>
       </div>
       <div className="review-history"><p className="review-eyebrow">CASE HISTORY</p><h3>Recorded activity</h3>{(detail?.history||[]).map(event=>
        <div key={event.id}><span><strong>{states[event.new_status as Status]||event.new_status}</strong><time>{date(event.created_at)}</time></span><p>{event.note||"No additional note"}</p><small>Recorded by {event.actor}</small></div>)}</div>
      </>}
    </section>
   </div>
   <div className="review-footer"><ShieldCheck size={18}/> Review stages are internal case records, not binding lending approvals. A licensed provider remains responsible for formal credit decisions.</div>
  </div>
 </main>;
}
