import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Plane, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

type Flight = {
  node: HTMLDivElement | null;
  trail: SVGPathElement | null;
  glowTrail: SVGPathElement | null;
  start: { x: number; y: number };
  end: { x: number; y: number };
  c1: { x: number; y: number };
  c2: { x: number; y: number };
  duration: number;
  elapsed: number;
  history: { x: number; y: number }[];
  previousAngle: number;
  seed: number;
};

function FooterFlightTraffic() {
  return (
    <div className="footer-flight-traffic" aria-hidden="true">
      <svg className="footer-flight-route" viewBox="0 0 900 64" preserveAspectRatio="none">
        <defs>
          <linearGradient id="footerFlightTrail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A48656" stopOpacity="0" />
            <stop offset="38%" stopColor="#A48656" stopOpacity=".05" />
            <stop offset="100%" stopColor="#A48656" stopOpacity=".22" />
          </linearGradient>
        </defs>
        <path
          className="footer-flight-path"
          d="M -80 38 C 170 38, 320 38, 455 36 C 560 34, 660 28, 980 24"
        />
        <path
          className="footer-flight-trail"
          d="M -80 38 C 170 38, 320 38, 455 36 C 560 34, 660 28, 980 24"
        />
      </svg>

      <div className="footer-flight-aircraft">
        <Plane className="size-4" strokeWidth={1.7} />
      </div>
    </div>
  );
}

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
          <FooterFlightTraffic />
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <Link to="/apply" className="group inline-flex items-center gap-2 rounded-xl bg-[#e2b85a] px-5 py-3 text-xs font-extrabold text-[#101827] shadow-[0_15px_35px_-18px_#e2b85a] transition hover:-translate-y-0.5">Join the crew <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></Link>
            <a href="https://community.infiniteflight.com" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-3 text-xs font-extrabold text-white/80 transition hover:bg-white/[.1]"><img src={ifLogo} alt="" className="size-4 invert opacity-80" />Infinite Flight Community<ExternalLink className="size-3" /></a>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 border-y border-white/10 py-9 text-center font-[var(--font-footer)] sm:grid-cols-3 sm:text-left">
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Explore</h4><div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/65 sm:justify-start"><Link to="/about" className="hover:text-[#e2b85a]">About</Link><Link to="/staff" className="hover:text-[#e2b85a]">Crew</Link><Link to="/fleet" className="hover:text-[#e2b85a]">Fleet</Link><Link to="/routes" className="hover:text-[#e2b85a]">Routes</Link></div></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Network</h4><div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/65 sm:justify-start"><MapPin className="size-4 text-[#e2b85a]" /> ALA · Almaty <span className="text-white/20">•</span> NQZ · Astana</div></div>
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Virtual airline</h4><p className="mt-4 text-xs leading-5 text-white/45">Air Astana Virtual is a virtual airline exclusively for the Infinite Flight platform. We have no connection or affiliation with Air Astana or any other real-world airlines, organizations, or subsidiaries. All logos and trademarks remain the property of Air Astana.</p></div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-[10px] text-white/35 sm:flex-row"><span>© {new Date().getFullYear()} Air Astana Virtual</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/65 hover:text-[#e2b85a]">Gurnoor</a></p><span>From the heart of Eurasia.</span></div>
      </div>
      <style>{`
        .footer-flight-traffic {
          position: relative;
          height: 64px;
          max-width: 900px;
          margin: 12px auto 0;
          overflow: hidden;
          pointer-events: none;
        }
        .footer-flight-route {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .footer-flight-path {
          fill: none;
          stroke: #A48656;
          stroke-width: 0.7;
          stroke-linecap: round;
          opacity: .045;
        }
        .footer-flight-trail {
          fill: none;
          stroke: url(#footerFlightTrail);
          stroke-width: 1.2;
          stroke-linecap: round;
          stroke-dasharray: 5 895;
          stroke-dashoffset: 900;
          animation: footer-trail-follow 19s linear infinite;
          filter: drop-shadow(0 0 4px rgba(164,134,86,.08));
        }
        .footer-flight-aircraft {
          position: absolute;
          left: 0;
          top: 0;
          color: #A48656;
          opacity: .17;
          transform-origin: center;
          will-change: transform;
          offset-path: path("M -80px 38px C 170px 38px, 320px 38px, 455px 36px C 560px 34px, 660px 28px, 980px 24px");
          offset-distance: -5%;
          offset-rotate: auto;
          animation: footer-aircraft-flight 19s cubic-bezier(.55,.08,.28,1) infinite;
          filter: drop-shadow(0 0 7px rgba(164,134,86,.1));
        }
        @keyframes footer-aircraft-flight {
          0% { offset-distance: -8%; opacity: 0; }
          8% { opacity: .17; }
          78% { opacity: .17; }
          100% { offset-distance: 108%; opacity: 0; }
        }
        @keyframes footer-trail-follow {
          0% { stroke-dashoffset: 900; opacity: 0; }
          8% { opacity: .8; }
          78% { opacity: .8; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-flight-aircraft { animation: none; offset-distance: 55%; opacity: .1; }
          .footer-flight-trail { animation: none; stroke-dasharray: 0; opacity: .35; }
        }
      `}</style>
    </footer>
  );
}
