import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";
import ifLogo from "@/assets/if-logo.png";

export function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border/80 bg-white">
      {/* Subtle decorative background gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-50/60 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_.7fr_.7fr_1.1fr]">
          {/* Brand & Community info */}
          <div className="space-y-4">
            <img
              src={logo}
              alt="Air Astana Virtual"
              className="h-10 w-auto transition-opacity hover:opacity-90"
              width={288}
              height={144}
            />

            <div>
              <a
                href="https://community.infiniteflight.com"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-slate-50/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-muted-foreground shadow-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <img
                  src={ifLogo}
                  alt="Infinite Flight"
                  className="size-3.5 object-contain invert opacity-75 group-hover:opacity-100 transition-opacity"
                />
                Infinite Flight Community
                <ExternalLink className="size-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              An independent virtual airline for Infinite Flight pilots who enjoy flying the Air Astana network across the globe.
            </p>
          </div>

          {/* Navigation Links: Airline */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[.2em] text-foreground/80">
              Airline
            </h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-muted-foreground">
              <Link
                to="/about"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                About Us
              </Link>
              <Link
                to="/staff"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                Our Staff
              </Link>
              <Link
                to="/ranks"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                Ranks
              </Link>
            </div>
          </div>

          {/* Navigation Links: Operations */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[.2em] text-foreground/80">
              Operations
            </h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm font-medium text-muted-foreground">
              <Link
                to="/fleet"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                Fleet
              </Link>
              <Link
                to="/routes"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                Route Network
              </Link>
              <Link
                to="/hubs"
                className="transition-all hover:translate-x-1 hover:text-primary"
              >
                Hubs
              </Link>
            </div>
          </div>

          {/* Call to action card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-50 via-white to-slate-100/70 p-6 shadow-xs">
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-primary">
              Ready to fly?
            </span>
            <h4 className="mt-3 text-lg font-black tracking-tight text-foreground leading-snug">
              Join the crew and get your KC callsign.
            </h4>
            <Link
              to="/apply"
              className="group mt-5 inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md hover:brightness-105 active:scale-[0.98]"
            >
              Apply now
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Divider with subtle legal copy */}
        <div className="mt-12 border-t border-border/80 pt-6">
          <div className="flex flex-col justify-between gap-4 text-[11px] leading-relaxed text-muted-foreground/80 sm:flex-row sm:items-start">
            <span className="font-semibold text-foreground/90 whitespace-nowrap">
              © {new Date().getFullYear()} Air Astana Virtual
            </span>
            <p className="max-w-2xl sm:text-right">
              Air Astana Virtual is a virtual airline exclusively for the Infinite Flight platform. We have no connection or affiliation with Air Astana or any other real-world airlines, organizations, or subsidiaries. All logos and trademarks remain the property of Air Astana.
            </p>
          </div>

          {/* Developer credit badge */}
          <div className="mt-6 flex justify-center border-t border-border/40 pt-4">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-slate-50/70 px-3 py-1 text-[11px] text-muted-foreground transition hover:border-border">
              <span>Developed by</span>
              <a
                href="https://community.infiniteflight.com/u/gurnoor1/summary"
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-foreground transition-colors hover:text-primary hover:underline"
              >
                Gurnoor
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
