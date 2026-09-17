import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/G9VA-logo.png";

const links = [
  { to: "/about", label: "About" },
  { to: "/staff", label: "Crew" },
  { to: "/fleet", label: "Fleet" },
  { to: "/routes", label: "Routes" },
  { to: "/hubs", label: "Hubs" },
  { to: "/ranks", label: "Ranks" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/92 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} className="group shrink-0">
          <img src={logo} alt="Air Arabia Virtual" className="h-9 w-auto transition duration-200 group-hover:opacity-80" width={288} height={144} />
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-lg px-3.5 py-2 text-[12px] font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground" activeProps={{ className: "rounded-lg bg-foreground px-3.5 py-2 text-[12px] font-bold text-white" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link to="/apply" className="hidden items-center gap-2 rounded-lg brand-gradient px-4 py-2.5 text-xs font-extrabold text-white shadow-brand transition hover:-translate-y-0.5 md:inline-flex">
          Join the crew <ArrowRight className="size-3.5" />
        </Link>
        <button type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)} className="rounded-lg border border-border bg-white p-2.5 md:hidden">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-border bg-white p-4 shadow-lg md:hidden">
          <div className="grid gap-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted" activeProps={{ className: "rounded-lg bg-primary/8 px-4 py-3 text-sm font-bold text-primary" }}>
                {link.label}
              </Link>
            ))}
            <Link to="/apply" onClick={() => setOpen(false)} className="mt-2 rounded-lg brand-gradient px-4 py-3 text-center text-sm font-extrabold text-white">Join the crew</Link>
          </div>
        </div>
      )}
    </header>
  );
}
