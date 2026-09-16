import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/about", label: "About Us" },
  { to: "/staff", label: "Our Staff" },
  { to: "/fleet", label: "Fleet" },
  { to: "/routes", label: "Routes" },
  { to: "/hubs", label: "Hubs" },
  { to: "/ranks", label: "Ranks" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <Link to="/" className="group flex items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="Air Arabia Virtual" className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.03]" width={288} height={144} />
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-border bg-white/80 p-1 shadow-sm md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground" activeProps={{ className: "rounded-full bg-primary/8 px-3.5 py-2 text-[13px] font-semibold text-primary" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:block">
          <Link to="/apply" className="group inline-flex items-center gap-1.5 rounded-full brand-gradient px-5 py-2.5 text-sm font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:shadow-lg">
            Join the crew <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <button type="button" aria-label="Toggle menu" className="rounded-full border border-border p-2.5 text-foreground shadow-sm md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && <div className="border-t border-border bg-white/95 px-4 py-4 shadow-lg backdrop-blur md:hidden"><div className="flex flex-col gap-1">{links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "rounded-xl bg-primary/8 px-4 py-3 text-sm font-semibold text-primary" }}>{l.label}</Link>)}<Link to="/apply" onClick={() => setOpen(false)} className="mt-2 rounded-xl brand-gradient px-4 py-3 text-center text-sm font-bold text-white shadow-brand">Join the crew</Link></div></div>}
    </header>
  );
}
