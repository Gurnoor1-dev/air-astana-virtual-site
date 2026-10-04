import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Plane, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer() {
  return <footer className="relative mt-20 overflow-hidden bg-[#07111f] text-white">
    <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:64px_64px]"/>
    <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a48656]/10 blur-3xl"/>
    <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] shadow-2xl"><Plane className="size-6 rotate-[-12deg] text-[#e2b85a]"/></div>
        <img src={logo} alt="Air Astana Virtual" className="mx-auto mt-5 h-12 w-auto brightness-0 invert opacity-95" width={288} height={144}/>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">A community-driven Infinite Flight virtual airline inspired by the Air Astana network across Eurasia.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/apply" className="group inline-flex items-center gap-2 rounded-xl bg-[#e2b85a] px-5 py-3 text-xs font-extrabold text-[#101827] shadow-[0_15px_35px_-18px_#e2b85a] transition hover:-translate-y-0.5">Join the crew <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1"/></Link>
          <a href="https://community.infiniteflight.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-3 text-xs font-extrabold text-white/80 transition hover:bg-white/[.1]"><img src={ifLogo} alt="" className="size-4 invert opacity-80"/>Infinite Flight Community<ExternalLink className="size-3"/></a>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-8 border-y border-white/10 py-9 text-center sm:grid-cols-3 sm:text-left">
        <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Explore</h4><div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/65 sm:justify-start"><Link to="/about" className="hover:text-[#e2b85a]">About</Link><Link to="/staff" className="hover:text-[#e2b85a]">Crew</Link><Link to="/fleet" className="hover:text-[#e2b85a]">Fleet</Link><Link to="/routes" className="hover:text-[#e2b85a]">Routes</Link></div></div>
        <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Network</h4><div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/65 sm:justify-start"><MapPin className="size-4 text-[#e2b85a]"/> ALA · Almaty <span className="text-white/20">•</span> NQZ · Astana</div></div>
        <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Virtual airline</h4><p className="mt-4 text-xs leading-5 text-white/45">Independent fan community. Not affiliated with Air Astana or Infinite Flight.</p></div>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 text-[10px] text-white/35 sm:flex-row"><span>© {new Date().getFullYear()} Air Astana Virtual</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/65 hover:text-[#e2b85a]">Gurnoor</a></p><span>From the heart of Eurasia.</span></div>
    </div>
  </footer>