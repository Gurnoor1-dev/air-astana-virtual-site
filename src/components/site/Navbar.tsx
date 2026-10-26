import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Plane } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

const CREW_CENTER_URL = "https://crew-center-air-astana-virtual.vercel.app/";
const links = [
 {to:"/about",label:"About"},{to:"/ceo-message",label:"CEO Message"},{to:"/staff",label:"Crew"},{to:"/fleet",label:"Fleet"},{to:"/routes",label:"Routes"},{to:"/hubs",label:"Hubs"},{to:"/ranks",label:"Ranks"}
] as const;

export function Navbar(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>16);scroll();window.addEventListener("scroll",scroll,{passive:true});return()=>window.removeEventListener("scroll",scroll)},[]);
 const crewButtonClass="inline-flex items-center justify-center gap-2 rounded-full bg-[#087f88] px-5 py-3 text-[11px] font-bold text-white shadow-[0_10px_28px_-16px_#007f88] transition duration-300 hover:-translate-y-0.5 hover:bg-[#086b74]";
 return <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
  <motion.nav className="mx-auto flex h-[68px] max-w-[88rem] items-center gap-3 rounded-full border px-3 sm:px-5" animate={{backgroundColor:scrolled?"rgba(255,255,255,.94)":"rgba(255,255,255,.76)",borderColor:scrolled?"rgba(25,91,103,.16)":"rgba(255,255,255,.7)",boxShadow:scrolled?"0 14px 44px -26px rgba(13,69,82,.3)":"0 10px 35px -28px rgba(13,69,82,.15)",backdropFilter:"blur(22px) saturate(145%)"}} transition={{duration:.4,ease:[.16,1,.3,1]}}>
   <Link to="/" onClick={()=>setOpen(false)} className="group flex min-w-0 shrink-0 items-center gap-2 rounded-full px-2 py-1.5"><img src={logo} alt="Air Astana Virtual" className="h-8 w-auto transition duration-500 group-hover:scale-[1.03] group-hover:opacity-80 sm:h-9" width={288} height={144}/></Link>
   <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">{links.map(link=><Link key={link.to} to={link.to} className="whitespace-nowrap rounded-full px-3 py-2.5 text-[11px] font-semibold text-[#55727b] transition hover:bg-[#edf7f8] hover:text-[#007f88] xl:px-3.5" activeProps={{className:"whitespace-nowrap rounded-full bg-[#e4f5f4] px-3 py-2.5 text-[11px] font-bold text-[#007f88] xl:px-3.5"}}>{link.label}</Link>)}</div>
   <a href={CREW_CENTER_URL} className={crewButtonClass+" ml-auto hidden shrink-0 lg:inline-flex"}><Plane className="size-3.5"/><span>Crew Center</span><ArrowRight className="size-3.5"/></a>
   <motion.button type="button" aria-label={open?"Close navigation menu":"Open navigation menu"} aria-expanded={open} onClick={()=>setOpen(v=>!v)} whileTap={{scale:.92}} className="ml-auto rounded-full border border-[#dce9ec] bg-white p-2.5 text-[#285b66] lg:hidden"><AnimatePresence mode="wait" initial={false}><motion.span key={open?"close":"menu"} className="block" initial={{opacity:0,rotate:-45,scale:.65}} animate={{opacity:1,rotate:0,scale:1}} exit={{opacity:0,rotate:45,scale:.65}} transition={{duration:.18}}>{open?<X className="size-5"/>:<Menu className="size-5"/>}</motion.span></AnimatePresence></motion.button>
  </motion.nav>
  <AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.22}} className="mx-auto mt-2 max-w-[88rem] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 p-3 shadow-[0_24px_70px_-28px_#17465355] backdrop-blur-xl lg:hidden"><div className="grid gap-1 sm:grid-cols-2">{links.map(link=><Link key={link.to} to={link.to} onClick={()=>setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-[#55727b] transition hover:bg-[#edf7f8] hover:text-[#007f88]" activeProps={{className:"rounded-xl bg-[#e4f5f4] px-4 py-3 text-sm font-bold text-[#007f88]"}}>{link.label}</Link>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><a href={CREW_CENTER_URL} onClick={()=>setOpen(false)} className={crewButtonClass+" px-4 py-3 text-sm"}><Plane className="size-4"/>Crew Center<ArrowRight className="size-4"/></a><Link to="/apply" onClick={()=>setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dce9ec] px-4 py-3 text-sm font-bold text-[#285b66]"><Plane className="size-4"/>Join the crew</Link></div></motion.div>}</AnimatePresence>
 </header>
}
