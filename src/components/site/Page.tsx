import homeHero from "@/assets/site/home-hero.jpg";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function PageHeader({ eyebrow, title, subtitle, backgroundImage = homeHero, compact = false }: { eyebrow: string; title: string; subtitle?: string; backgroundImage?: string; compact?: boolean }) {
  return (
    <section className="page-hero" style={backgroundImage ? { backgroundImage: `linear-gradient(90deg,rgba(255,255,255,.97) 0%,rgba(255,255,255,.84) 45%,rgba(255,255,255,.35) 100%), url(${backgroundImage})`, backgroundPosition: "center", backgroundSize: "cover" } : undefined}>
      {!backgroundImage && <><div className="hero-grid" /><div className="hero-orb orb-a" /><div className="hero-orb orb-b" /></>}
      <div className={`relative mx-auto max-w-7xl px-4 sm:px-6 ${compact ? "py-12 sm:py-14" : "py-16 sm:py-20 lg:py-24"}`}>
        <div className="kicker"><span className="kicker-dot" />{eyebrow}</div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_390px] lg:items-end">
          <h1 className="display-xl max-w-5xl">{title}</h1>
          {subtitle && <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

export function Section({ title, description, eyebrow, children, className = "" }: { title?: string; description?: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 ${className}`}>
      {(title || eyebrow) && (
        <div className="mb-8 max-w-3xl">
          {eyebrow && <div className="kicker mb-3"><span className="kicker-dot" />{eyebrow}</div>}
          {title && <h2 className="display-lg">{title}</h2>}
          {description && <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`premium-card ${className}`}>{children}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) {
  return <div><div className="text-3xl font-black tracking-[-.05em] sm:text-4xl">{value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{label}</div></div>;
}

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return <a href={to} className="group inline-flex items-center gap-2 text-sm font-extrabold text-primary">{children}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>;
}
