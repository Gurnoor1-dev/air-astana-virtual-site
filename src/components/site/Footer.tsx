import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer() {
  return (
    <footer className="footer-jakarta relative mt-16 overflow-hidden bg-[#07111f] text-white">
      {/* Background Subtle Mesh & Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2b85a]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Top Header Section */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* Tagline moved to the top */}
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#e2b85a]/30 bg-[#e2b85a]/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-[#e2b85a]">
              <Sparkles className="size-3" />
              FROM THE HEART OF EURASIA
            </div>

            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Air Astana Virtual"
                className="h-10 w-auto brightness-0 invert opacity-95"
                width={216}
                height={108}
              />
            </div>
            <p className="mt-3 max-w-lg text-xs leading-5 text-white/60">
              A community-driven Infinite Flight virtual airline inspired by the
              Air Astana network across Eurasia.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#e2b85a] px-5 py-2.5 text-xs font-extrabold text-[#101827] shadow-lg shadow-[#e2b85a]/10 transition hover:-translate-y-0.5 hover:bg-[#f0c76b]"
            >
              Join the crew
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://community.infiniteflight.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-white/[.12] hover:border-white/25"
            >
              <img
                src={ifLogo}
                alt="Infinite Flight"
                className="size-4 object-contain brightness-0 invert"
              />
              Infinite Flight Community
              <ExternalLink className="size-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid gap-8 py-8 sm:grid-cols-12 sm:items-start">
          {/* Quick Links Column */}
          <div className="sm:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-[.22em] text-[#e2b85a]">
              Explore
            </h4>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-white/70">
              <Link to="/about" className="transition hover:text-[#e2b85a]">
                About
              </Link>
              <Link to="/staff" className="transition hover:text-[#e2b85a]">
                Crew
              </Link>
              <Link to="/fleet" className="transition hover:text-[#e2b85a]">
                Fleet
              </Link>
              <Link to="/routes" className="transition hover:text-[#e2b85a]">
                Routes
              </Link>
            </div>
          </div>

          {/* Disclaimer Column */}
          <div className="sm:col-span-8">
            <h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">
              Virtual Airline Disclaimer
            </h4>
            <p className="mt-3 text-[11px] leading-6 text-white/40">
              Air Astana Virtual is a virtual airline exclusively for the Infinite
              Flight platform. We have no connection or affiliation with Air
              Astana or any other real-world airlines, organizations, or
              subsidiaries. All logos and trademarks remain the property of Air
              Astana.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Air Astana Virtual</span>
          <p>
            Developed by{" "}
            <a
              href="https://community.infiniteflight.com/u/gurnoor1/summary"
              target="_blank"
              rel="noreferrer noopener"
              className="font-bold text-white/70 transition hover:text-[#e2b85a]"
            >
              Gurnoor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
