import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Plane, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/about", label: "About" }, { to: "/ceo-message", label: "CEO Message" },
  { to: "/staff", label: "Crew" }, { to: "/fleet", label: "Fleet" },
  { to: "/routes", label: "Routes" }, { to: "/hubs", label: "Hubs" }, { to: "/ranks", label: "Ranks" }
] as const;
const SESSION_KEY = "aav_crew_session";

export function Navbar() {
  const [open, setOpen] = useState(false), [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { const sync=()=>setLoggedIn(Boolean(sessionStorage.getItem(SESSION_KEY))); sync(); window.addEventListener("storage",sync); return()=>window.removeEventListener("storage",sync)},[]);
  const crewPath=loggedIn?"/crew-center":"/crew-login";
  return <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
    <nav className="mx-auto flex h-[68px] max-w-6xl items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 shadow-[0_18px_50px_-30px_rgba(23,33,58,.5)] backdrop-blur-2xl sm:px-4">
      <Link to="/" onClick={()=>setOpen(false)} className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5">
        <img src={logo} alt="Air Astana Virtual" className="h-9 w-auto transition duration-300 group-hover:scale-[1.02] group-hover:opacity-85" width={288} height={144}/>
      </Link>
      <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex">
        {links.map(link=><Link key={link.to} to={link.to} className="relative rounded-xl px-3 py-2.5 text-[11px] font-extrabold tracking-wide text-muted-foreground transition hover:bg-slate-100 hover:text-foreground" activeProps={{className:"relative rounded-xl bg-[#17213a] px-3 py-2.5 text-[11px] font-extrabold tracking-wide text-white shadow-lg shadow-[#17213a]/15"}}>{link.label}</Link>)}
      </div>
      <Link to={crewPath} className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#17213a] px-4 py-2.5 text-[11px] font-extrabold text-white shadow-[0_10px_25px_-12px_#17213a] transition hover:-translate-y-0.5 hover:bg-[#223458] md:inline-flex">
        <LogIn className="size-3.5"/>{loggedIn?"Crew Center":"Crew Login"}<ArrowRight className="size-3.5"/>
      </Link>
      <button type="button" aria-label="Toggle menu" onClick={()=>setOpen(v=>!v)} className="ml-auto rounded-xl border border-border bg-white p-2.5 shadow-sm transition hover:bg-slate-50 md:hidden">{open?<X className="size-5"/>:<Menu className="size-5"/>}</button>
    </nav>
    {open&&<div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border/80 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="grid gap-1">{links.map(link=><Link key={link.to} to={link.to} onClick={()=>setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted" activeProps={{className:"rounded-xl bg-[#17213a] px-4 py-3 text-sm font-bold text-white"}}>{link.label}</Link>)}</div>
      <div className="mt-2 grid gap-2"><Link to={crewPath} onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-extrabold text-white"><LogIn className="size-4"/>{loggedIn?"Crew Center":"Crew Login"}</Link>{!loggedIn&&<Link to="/apply" onClick={()=>setOpen(false)} className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-extrabold"><Plane className="size-4"/>Join the crew</Link>}</div>
    </div>}
  </header>
}