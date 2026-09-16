import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="Air Arabia Virtual" className="h-9 w-auto" width={288} height={144} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-primary bg-accent" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/apply"
            className="ml-2 rounded-md brand-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-opacity hover:opacity-90"
          >
            Apply
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-md p-2 text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-primary bg-accent" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/apply"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md brand-gradient px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Apply
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
