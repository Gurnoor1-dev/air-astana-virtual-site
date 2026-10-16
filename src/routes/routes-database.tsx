import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";
import { Section } from "@/components/site/Page";
import { LockKeyhole, Search, Plane, Clock3, LogOut } from "lucide-react";

const ACCESS_ENDPOINT = "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/routes-database-access";
const SESSION_KEY = "routes-database-session";
export const Route = createFileRoute("/routes-database")({
  head: () => ({ meta: [{ title: "Routes Database — Air Astana Virtual" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: RoutesDatabasePage,
});
function blockMinutes(r: RouteRecord) {
  const rad = (n: number) => n * Math.PI / 180;
  const [a, b] = r.dep; const [c, d] = r.arr;
  const x = Math.sin(rad(c-a)/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;
  const nm = 3440.065 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  const speed = r.aircraft === "787-9" ? 485 : r.aircraft === "757-200" ? 440 : 435;
  return Math.max(30, Math.round((nm / speed * 60 + 35) / 15) * 15);
}
function duration(n: number) { const h=Math.floor(n/60), m=n%60; return h ? `${h}h ${String(m).padStart(2,"0")}m` : `${m} min`; }
function RoutesDatabasePage() {
 const [code,setCode]=useState(""); const [session,setSession]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const [routes,setRoutes]=useState<RouteRecord[]>([]); const [query,setQuery]=useState(""); const [ready,setReady]=useState(false);
 useEffect(()=>{setSession(sessionStorage.getItem(SESSION_KEY)||"");setReady(true)},[]);
 useEffect(()=>{if(session) fetchRoutes().then(setRoutes).catch(()=>setError("Could not load routes."))},[session]);
 async function redeem(e: React.FormEvent) { e.preventDefault();setBusy(true);setError("");try{const r=await fetch(ACCESS_ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"redeem",code:code.trim()})});const d=await r.json();if(!r.ok||!d.sessionToken)throw new Error(d.error||"Invalid, expired or already-used code.");sessionStorage.setItem(SESSION_KEY,d.sessionToken);setSession(d.sessionToken);setCode("")}catch(e){setError(e instanceof Error?e.message:"Could not verify code.")}finally{setBusy(false)}}
 function logout(){sessionStorage.removeItem(SESSION_KEY);setSession("");setRoutes([])}
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return routes.filter(r=>[r.routeNo,r.routeId,r.depIcao,r.arrIcao,r.depAirport,r.arrAirport,r.aircraft].join(" ").toLowerCase().includes(q))},[routes,query]);
 if(!ready)return null;
 return <div className="min-h-screen bg-background text-foreground"><Section eyebrow="Restricted operations" title="Routes database" description="Internal schedule reference for Air Astana Virtual crew.">
 {!session?<div className="mx-auto max-w-md rounded-3xl border border-border bg-white p-7 shadow-soft sm:p-9"><div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#1c2b4f] text-white"><LockKeyhole className="size-5"/></div><h2 className="text-xl font-extrabold">Enter one-time access code</h2><p className="mt-2 text-sm text-muted-foreground">Use the single-use code from Discord with /get-password.</p><form onSubmit={redeem} className="mt-6 space-y-4"><input value={code} onChange={e=>setCode(e.target.value)} required autoComplete="one-time-code" placeholder="Access code" className="form-input w-full"/><button disabled={busy} className="w-full rounded-xl bg-[#1c2b4f] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-60">{busy?"Verifying…":"Unlock database"}</button></form>{error&&<p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}<img src="https://air-astana-virtual.vercel.app/assets/Password.png" alt="" className="mt-6 w-full rounded-xl"/></div>:<>
 <div className="mb-5 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search flight, airport or aircraft…" className="form-input w-full pl-10"/></div><button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold"><LogOut className="size-4"/>Lock database</button></div>
 <div className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground"><Plane className="size-4"/>{filtered.length} of {routes.length} sectors<span className="ml-auto inline-flex items-center gap-1"><Clock3 className="size-3.5"/>Estimated block time</span></div>
 <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft"><div className="hidden grid-cols-[.7fr_1fr_1fr_.8fr_.75fr] gap-3 bg-[#1c2b4f] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-white/75 md:grid"><div>Flight</div><div>Departure</div><div>Arrival</div><div>Aircraft</div><div>Block time</div></div>{filtered.map((r,i)=><div key={r.routeId} className={`grid gap-2 px-5 py-4 md:grid-cols-[.7fr_1fr_1fr_.8fr_.75fr] md:items-center ${i?"border-t border-border":""}`}><div><div className="font-extrabold text-[#a48656]">{r.routeNo}</div><div className="text-xs text-muted-foreground">{r.routeId}</div></div><div><div className="font-extrabold">{r.depIcao}</div><div className="text-xs text-muted-foreground">{r.depAirport}</div></div><div><div className="font-extrabold">{r.arrIcao}</div><div className="text-xs text-muted-foreground">{r.arrAirport}</div></div><div className="text-sm font-semibold">{r.aircraft}</div><div className="font-extrabold tabular-nums">{duration(blockMinutes(r))}</div></div>)}{!filtered.length&&<div className="p-10 text-center text-sm text-muted-foreground">No routes match your search.</div>}</div>
 <p className="mt-3 text-xs text-muted-foreground">Rounded planning estimates based on route distance and typical aircraft performance; these are not verified published schedules for each real-world flight.</p>
 </>}
 </Section></div>;
}