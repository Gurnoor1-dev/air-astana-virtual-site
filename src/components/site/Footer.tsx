import { Link } from "@tanstack/react-router";
import { ArrowRight, Plane } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_.7fr_.7fr_1fr]">
          <div>
            <img src={logo} alt="Air Arabia Virtual" className="h-9 w-auto" width={288} height={144} />
            <div className="mt-5 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-muted-foreground"><Plane className="size-3.5 text-primary" /> Infinite Flight Virtual Airline</div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A fan-run, non-commercial virtual airline experience built around the Air Arabia network.</p>
          </div>
          <div><h4 className="text-[10px] font-extrabold uppercase tracking-[.18em] text-muted-foreground">Airline</h4><div className="mt-4 grid gap-3 text-sm font-semibold"><Link to="/about" className="hover:text-primary">About Us</Link><Link to="/staff" className="hover:text-primary">Our Staff</Link><Link to="/ranks" className="hover:text-primary">Ranks</Link></div></div>
          <div><h4 className="text-[10px] font-extrabold uppercase tracking-[.18em] text-muted-foreground">Operations</h4><div className="mt-4 grid gap-3 text-sm font-semibold"><Link to="/fleet" className="hover:text-primary">Fleet</Link><Link to="/routes" className="hover:text-primary">Route Network</Link><Link to="/hubs" className="hover:text-primary">Hubs</Link></div></div>
          <div className="rounded-2xl bg-[#f7f7f8] p-5"><div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-primary">Ready for departure?</div><h4 className="mt-3 text-xl font-black tracking-tight">Get your callsign on the roster.</h4><Link to="/apply" className="mt-5 inline-flex items-center gap-2 rounded-lg brand-gradient px-4 py-2.5 text-xs font-extrabold text-white">Apply now <ArrowRight className="size-3.5" /></Link></div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-border pt-5 text-[11px] text-muted-foreground sm:flex-row"><span>© {new Date().getFullYear()} Air Arabia Virtual</span><span>Fan-made virtual airline · Not affiliated with Air Arabia PJSC</span></div>
      </div>
    </footer>
  );
}
