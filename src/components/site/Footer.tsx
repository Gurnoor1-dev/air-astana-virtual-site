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
  const rootRef = useRef<HTMLDivElement>(null);
  const flightsRef = useRef<Flight[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const wrap = (value: number, min: number, max: number) => {
      const range = max - min;
      return ((value - min) % range + range) % range + min;
    };

    const makeFlight = (flight?: Flight): Flight => {
      const w = root.clientWidth || 900;
      const h = root.clientHeight || 64;
      const pad = Math.max(40, w * 0.08);
      const edge = Math.random();
      const direction = Math.random() > 0.5 ? 1 : -1;
      const start = {
        x: direction > 0 ? -pad : w + pad,
        y: rand(10, h - 10),
      };
      const end = {
        x: direction > 0 ? w + pad : -pad,
        y: rand(8, h - 8),
      };
      const bend = rand(-h * 0.75, h * 0.75);
      const c1 = {
        x: start.x + (end.x - start.x) * rand(0.22, 0.38),
        y: wrap(start.y + bend + rand(-12, 12), -h * 0.5, h * 1.5),
      };
      const c2 = {
        x: start.x + (end.x - start.x) * rand(0.58, 0.8),
        y: wrap(end.y - bend * rand(0.65, 1.05) + rand(-14, 14), -h * 0.5, h * 1.5),
      };

      if (flight) {
        flight.start = start;
        flight.end = end;
        flight.c1 = c1;
        flight.c2 = c2;
        flight.duration = rand(15000, 27000);
        flight.elapsed = 0;
        flight.history = [];
        flight.seed = Math.random() * Math.PI * 2;
        return flight;
      }

      return {
        node: null,
        trail: null,
        glowTrail: null,
        start,
        end,
        c1,
        c2,
        duration: rand(15000, 27000),
        elapsed: rand(0, 22000),
        history: [],
        previousAngle: direction > 0 ? 0 : 180,
        seed: Math.random() * Math.PI * 2,
      };
    };

    const flights = Array.from({ length: 5 }, () => makeFlight());
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-footer-flight]"));
    const trails = Array.from(root.querySelectorAll<SVGPathElement>("[data-footer-trail]"));
    const glows = Array.from(root.querySelectorAll<SVGPathElement>("[data-footer-trail-glow]"));
    flights.forEach((flight, i) => {
      flight.node = nodes[i] ?? null;
      flight.trail = trails[i] ?? null;
      flight.glowTrail = glows[i] ?? null;
    });
    flightsRef.current = flights;

    const pointAt = (flight: Flight, t: number) => {
      const u = 1 - t;
      return {
        x: u * u * u * flight.start.x +
          3 * u * u * t * flight.c1.x +
          3 * u * t * t * flight.c2.x +
          t * t * t * flight.end.x,
        y: u * u * u * flight.start.y +
          3 * u * u * t * flight.c1.y +
          3 * u * t * t * flight.c2.y +
          t * t * t * flight.end.y,
      };
    };

    const tangentAt = (flight: Flight, t: number) => {
      const u = 1 - t;
      return {
        x: 3 * u * u * (flight.c1.x - flight.start.x) +
          6 * u * t * (flight.c2.x - flight.c1.x) +
          3 * t * t * (flight.end.x - flight.c2.x),
        y: 3 * u * u * (flight.c1.y - flight.start.y) +
          6 * u * t * (flight.c2.y - flight.c1.y) +
          3 * t * t * (flight.end.y - flight.c2.y),
      };
    };

    const pathD = (history: { x: number; y: number }[]) => {
      if (history.length < 2) return "";
      return history.reduce(
        (d, p, i) => d + (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
        "",
      );
    };

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      flights.forEach((flight) => {
        flight.elapsed += dt;
        if (flight.elapsed >= flight.duration) {
          makeFlight(flight);
        }

        const t = Math.min(0.999, flight.elapsed / flight.duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const p = pointAt(flight, eased);
        const tangent = tangentAt(flight, eased);
        const angle = Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
        const deltaAngle = ((angle - flight.previousAngle + 540) % 360) - 180;
        const bank = Math.max(-8, Math.min(8, deltaAngle * 1.7));
        flight.previousAngle = angle;

        flight.history.push(p);
        if (flight.history.length > 26) flight.history.shift();

        const d = pathD(flight.history);
        if (flight.trail) flight.trail.setAttribute("d", d);
        if (flight.glowTrail) flight.glowTrail.setAttribute("d", d);

        if (flight.node) {
          const bob = Math.sin(now / 900 + flight.seed) * 0.8;
          flight.node.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(p.y + bob).toFixed(1)}px, 0) rotate(${(angle + bank).toFixed(1)}deg)`;
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      flightsRef.current = [];
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto mt-3 h-16 max-w-3xl overflow-hidden" aria-hidden="true">
      <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" viewBox="0 0 100 64" preserveAspectRatio="none">
        <path data-footer-trail-glow className="footer-flight-trail-glow" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail className="footer-flight-trail" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail-glow className="footer-flight-trail-glow" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail className="footer-flight-trail" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail-glow className="footer-flight-trail-glow" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail className="footer-flight-trail" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail-glow className="footer-flight-trail-glow" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail className="footer-flight-trail" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail-glow className="footer-flight-trail-glow" d="" vectorEffect="non-scaling-stroke" />
        <path data-footer-trail className="footer-flight-trail" d="" vectorEffect="non-scaling-stroke" />
      </svg>
      <div data-footer-flight className="footer-flight footer-flight-a"><Plane className="size-4" /></div>
      <div data-footer-flight className="footer-flight footer-flight-b"><Plane className="size-3.5" /></div>
      <div data-footer-flight className="footer-flight footer-flight-c"><Plane className="size-5" /></div>
      <div data-footer-flight className="footer-flight footer-flight-d"><Plane className="size-3" /></div>
      <div data-footer-flight className="footer-flight footer-flight-e"><Plane className="size-4" /></div>
      <div className="absolute inset-x-8 bottom-2 h-px bg-gradient-to-r from-transparent via-[#a48656]/10 to-transparent" />
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
          <div><h4 className="text-[10px] font-black uppercase tracking-[.22em] text-white/40">Virtual airline</h4><p className="mt-4 text-xs leading-5 text-white/45">Independent fan community. Not affiliated with Air Astana or Infinite Flight.</p></div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-[10px] text-white/35 sm:flex-row"><span>© {new Date().getFullYear()} Air Astana Virtual</span><p>Developed by <a href="https://community.infiniteflight.com/u/gurnoor1/summary" target="_blank" rel="noreferrer noopener" className="font-bold text-white/65 hover:text-[#e2b85a]">Gurnoor</a></p><span>From the heart of Eurasia.</span></div>
      </div>
      <style>{`
        .footer-flight {
          position: absolute;
          left: 0;
          top: 0;
          color: #A48656;
          opacity: .18;
          transform-origin: center;
          will-change: transform;
          transition: filter 180ms ease;
          filter: drop-shadow(0 0 6px rgba(164,134,86,.12));
        }
        .footer-flight-trail {
          fill: none;
          stroke: #A48656;
          stroke-width: 1.15;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: .14;
          filter: drop-shadow(0 0 3px rgba(164,134,86,.16));
        }
        .footer-flight-trail-glow {
          fill: none;
          stroke: #A48656;
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: .045;
          filter: blur(2.5px);
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-flight { opacity: .12; }
          .footer-flight-trail,
          .footer-flight-trail-glow { opacity: .06; }
        }
      `}</style>
    </footer>
  );
}
