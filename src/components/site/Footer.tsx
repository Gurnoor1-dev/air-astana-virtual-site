import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer(){
 return <footer className="relative mt-16 overflow-hidden bg-[#191a17] text-[#f1f0e9]">
  <div className="pointer-events-none absolute inset-0 hairline-grid opacity-40"/><div className="pointer-events-none absolute -right-20 -top-40 size-[32rem] rounded-full border border-[#c8fa3e]/20"/>
  <div className="relative mx-auto max-w-[90rem] px-5 py-10 sm:px-8 sm:py-14">
   <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-[1.2fr_.8fr]">
    <div className="max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 bg-[#c8fa3e] px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#191a17]"><Sparkles className="size-3"/> From the heart of Eurasia</div><img src={logo} alt="Air Astana Virtual" className="h-10 w-auto brightness-0 invert opacity-95" width={216} height={108}/><p className="mt-5 max-w-xl text-sm leading-7 text-white/55">Air Astana Virtual is a virtual airline exclusively for the Infinite Flight platform. We have no connection or affiliation with Air Astana or any other real-world airlines, organizations, or subsidiaries. All logos and trademarks remain the property of Air Astana.</p></div>
    <div className="flex flex-col justify-between gap-8"><div className="font-mono text-[10px] uppercase tracking-[.18em] text-white/40">Continue your journey / 01</div><div className="flex flex-wrap gap-3"><Link to="/apply" className="group inline-flex items-center gap-3 bg-[#c8fa3e] px-5 py-3 text-xs font-extrabold text-[#191a17] transition hover:bg-white">Join the crew <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></Link><a href="https://community.infiniteflight.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-xs font-extrabold text-white transition hover:border-[#c8fa3e] hover:text-[#c8fa3e]"><img src={ifLogo} alt="Infinite Flight" className="size-4 object-contain brightness-0 invert"/>Infinite Flight Community<ExternalLink className="size-3 opacity-60"/></a></div><div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-white/45"><Link to="/routes">Routes</Link><Link to="/fleet">Fleet</Link><Link to="/hubs">Hubs</Link><Link to="/staff">Crew</Link><Link to="/ranks">Ranks</Link></div></div>
   </div>
   <div className="flex flex-col items-start justify-between gap-3 pt-5 font-mono text-[10px] text-white/35 sm:flex-row sm:items-center"><span>© {new Date().getFullYear()} AIR ASTANA VIRTUAL / FAN-RUN COMMUNITY</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/70 transition hover:text-[#c8fa3e]">Gurnoor</a></p><span>ALA — NQZ / KC NETWORK</span></div>
  </div>
 </footer>
}
