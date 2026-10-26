import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer(){
 return <footer className="relative mt-16 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-br from-[#104b58] via-[#123f4b] to-[#173943] text-white sm:rounded-t-[3.5rem]">
  <div className="pointer-events-none absolute -right-20 -top-40 size-[34rem] rounded-full border border-white/10"/><div className="pointer-events-none absolute -right-4 -top-24 size-[25rem] rounded-full border border-[#83d5d2]/15"/>
  <div className="relative mx-auto max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16">
   <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.2fr_.8fr]">
    <div className="max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#bce9e7]"><Sparkles className="size-3"/> From the heart of Eurasia</div><img src={logo} alt="Air Astana Virtual" className="h-10 w-auto brightness-0 invert opacity-95" width={216} height={108}/><p className="mt-5 max-w-xl text-sm leading-7 text-white/65">Air Astana Virtual is a virtual airline exclusively for the Infinite Flight platform. We have no connection or affiliation with Air Astana or any other real-world airlines, organizations, or subsidiaries. All logos and trademarks remain the property of Air Astana.</p></div>
    <div className="flex flex-col justify-between gap-8"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-white/45">Your next journey starts here</div><div className="flex flex-wrap gap-3"><Link to="/apply" className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#0c6570] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d9f2f0]">Join the crew <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></Link><a href="https://community.infiniteflight.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-3 text-xs font-bold text-white transition hover:border-[#83d5d2] hover:text-[#bce9e7]"><img src={ifLogo} alt="Infinite Flight" className="size-4 object-contain brightness-0 invert"/>Infinite Flight Community<ExternalLink className="size-3 opacity-60"/></a></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/65"><Link to="/routes">Routes</Link><Link to="/fleet">Fleet</Link><Link to="/hubs">Hubs</Link><Link to="/staff">Crew</Link><Link to="/ranks">Ranks</Link></div></div>
   </div>
   <div className="flex flex-col items-start justify-between gap-3 pt-6 text-[10px] text-white/45 sm:flex-row sm:items-center"><span>© {new Date().getFullYear()} AIR ASTANA VIRTUAL / FAN-RUN COMMUNITY</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/80 transition hover:text-[#bce9e7]">Gurnoor</a></p><span>ALA — NQZ / KC NETWORK</span></div>
  </div>
 </footer>
}
