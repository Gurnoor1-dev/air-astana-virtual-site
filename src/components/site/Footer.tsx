import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Plane, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer() {
  return (
    <footer className="footer-jakarta relative mt-14 overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a48656]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-11">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06]">
                <Plane className="size-5 rotate-[-12deg] text-[#e2b85a]" />
              </div>
              <img
                src={logo}
                alt="Air Astana Virtual"
                className="h-9 w-auto brightness-0 invert opacity-95"
                width={216}
                height={108}
              />
            </div>
            <p className="mt-3 max-w-lg text-xs leading-5 text-white/50">
              A community-driven Infinite Flight virtual airline inspired by
              the Air Astana network across Eurasia.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/apply"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#e2b85a] px-4 py-2.5 text-xs font-extrabold text-[#101827] transition hover:-translate-y-0.5"
            >
              Join the crew
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://community.infiniteflight.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-4 py-2.5 text-xs font-extrabold text-white/75 transition hover:bg-white/[.1]"
            >
              <img src={ifLogo} alt="" className="size-4 invert opacity-80" />
              Infinite Flight Community
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 py-7 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">
              Explore
            </h4>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-white/60 sm:justify-start">
              <Link to="/about" className="hover:text-[#e2b85a]">About</Link>
              <Link to="/staff" className="hover:text-[#e2b85a]">Crew</Link>
              <Link to="/fleet" className="hover:text-[#e2b85a]">Fleet</Link>
              <Link to="/routes" className="hover:text-[#e2b85a]">Routes</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">
              Network
            </h4>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/60 sm:justify-start">
              <MapPin className="size-3.5 text-[#e2b85a]" />
              ALA · Almaty <span className="text-white/20">•</span> NQZ · Astana
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">
              Virtual airline
            </h4>
            <p className="mt-3 text-[11px] leading-5 text-white/40">
              Air Astana Virtual is an Infinite Flight virtual airline and is
              not affiliated with Air Astana or any other real-world airline.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-[10px] text-white/30 sm:flex-row">
          <span>© {new Date().getFullYear()} Air Astana Virtual</span>
          <p>
            Developed by{" "}
            <a
              href="https://community.infiniteflight.com/u/gurnoor1/summary"
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold text-white/55 hover:text-[#e2b85a]"
            >
              Gurnoor
            </a>
          </p>
          <span>From the heart of Eurasia.</span>
        </div>
      </div>
    </footer>
  );
}
