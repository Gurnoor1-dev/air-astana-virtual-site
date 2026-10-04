import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Plane, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer() {
  return (
    <footer className="footer-jakarta relative mt-20 overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a48656]/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] shadow-2xl"><Plane className="size-6 rotate-[-12deg] text-[#e2b85a]" /></div>
          <img src={logo} alt="Air Astana Virtual" className="mx-auto mt-5 h-12 w-auto brightness-0 invert opacity-95" width={288} height={144} />
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/55">A community-driven Infinite Flight virtual airline inspired by the Air Astana network across Eurasia.</p>
          <div className="relative mx-auto mt-3 h-16 max-w-3xl overflow-hidden" aria-hidden="true">
            <div className="footer-flight footer-flight-a"><Plane className="size-4" /></div>
            <div className="footer-flight footer-flight-b"><Plane className="size-3.5" /></div>
            <div className="footer-flight footer-flight-c"><Plane className="size-5" /></div>
            <div className="footer-flight footer-flight-d"><Plane className="size-3" /></div>
            <div className="footer-flight footer-flight-e"><Plane className="size-4" /></div>
            <div className="absolute inset-x-8 bottom-2 h-px bg-gradient-to-r from-transparent via-[#a48656]/10 to-transparent" />
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Link to="/apply" className="group inline-flex items-center gap-2 rounded-xl bg-[#e2b85a] px-5 py-3 text-xs font-extrabold text-[#101827] shadow-[0_15px_35px_-18px_#e2b85a] transition hover:-translate-y-0.5">Join the crew <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></Link>
            <a href="https://community.infiniteflight.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-3 text-xs font-extrabold text-white/80 transition hover:bg-white/[.1]"><img src={ifLogo} alt="" className="size-4 invert opacity-80" />Infinite Flight Community<ExternalLink className="size-3" /></a>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 border-y border-white/10 py-9 text-center font-[var(--font-footer)] sm:grid-cols-3 sm:text-left">
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Explore</h4><div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/65 sm:justify-start"><Link to="/about" className="hover:text-[#e2b85a]">About</Link><Link to="/staff" className="hover:text-[#e2b85a]">Crew</Link><Link to="/fleet" className="hover:text-[#e2b85a]">Fleet</Link><Link to="/routes" className="hover:text-[#e2b85a]">Routes</Link></div></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Network</h4><div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/65 sm:justify-start"><MapPin className="size-4 text-[#e2b85a]" /> ALA · Almaty <span className="text-white/20">•</span> NQZ · Astana</div></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Virtual airline</h4><p className="mt-4 text-xs leading-5 text-white/45">Independent fan community. Not affiliated with Air Astana or Infinite Flight.</p></div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-[10px] text-white/35 sm:flex-row"><span>© {new Date().getFullYear()} Air Astana Virtual</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/65 hover:text-[#e2b85a]">Gurnoor</a></p><span>From the heart of Eurasia.</span></div>
      </div>
      <style>{`
        .footer-flight {
          position: absolute;
          left: -8%;
          top: 42%;
          color: #a48656;
          opacity: .16;
          filter: drop-shadow(0 0 8px rgba(164,134,86,.08));
          will-change: transform;
          animation-timing-function: cubic-bezier(.37,0,.63,1);
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        .footer-flight-a { animation: footer-flight-a 17s ease-in-out -2s infinite alternate; }
        .footer-flight-b { animation: footer-flight-b 23s ease-in-out -11s infinite alternate; }
        .footer-flight-c { animation: footer-flight-c 29s ease-in-out -7s infinite alternate; }
        .footer-flight-d { animation: footer-flight-d 19s ease-in-out -15s infinite alternate; }
        .footer-flight-e { animation: footer-flight-e 26s ease-in-out -19s infinite alternate; }

        @keyframes footer-flight-a {
          0% { transform: translate3d(-4vw, 13px, 0) rotate(9deg); }
          34% { transform: translate3d(25vw, -3px, 0) rotate(2deg); }
          67% { transform: translate3d(57vw, 10px, 0) rotate(-5deg); }
          100% { transform: translate3d(108vw, -5px, 0) rotate(3deg); }
        }
        @keyframes footer-flight-b {
          0% { transform: translate3d(105vw, 5px, 0) rotate(178deg); }
          30% { transform: translate3d(74vw, 17px, 0) rotate(184deg); }
          64% { transform: translate3d(38vw, 0, 0) rotate(176deg); }
          100% { transform: translate3d(-12vw, 12px, 0) rotate(181deg); }
        }
        @keyframes footer-flight-c {
          0% { transform: translate3d(18vw, 18px, 0) rotate(-7deg); }
          28% { transform: translate3d(47vw, 4px, 0) rotate(5deg); }
          71% { transform: translate3d(12vw, -2px, 0) rotate(12deg); }
          100% { transform: translate3d(82vw, 15px, 0) rotate(-2deg); }
        }
        @keyframes footer-flight-d {
          0% { transform: translate3d(78vw, -2px, 0) rotate(186deg); }
          39% { transform: translate3d(44vw, 14px, 0) rotate(174deg); }
          68% { transform: translate3d(5vw, 3px, 0) rotate(181deg); }
          100% { transform: translate3d(-18vw, 17px, 0) rotate(177deg); }
        }
        @keyframes footer-flight-e {
          0% { transform: translate3d(38vw, 7px, 0) rotate(4deg); }
          31% { transform: translate3d(9vw, 17px, 0) rotate(-6deg); }
          63% { transform: translate3d(66vw, -1px, 0) rotate(8deg); }
          100% { transform: translate3d(102vw, 11px, 0) rotate(1deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-flight { animation: none; opacity: .12; }
        }
      `}</style>
    </footer>
  );
}
