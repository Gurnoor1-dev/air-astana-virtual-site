import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return <section className="page-hero"><div className="hero-grid"/><div className="hero-orb orb-a"/><div className="hero-orb orb-b"/><div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28"><div className="kicker"><span className="kicker-dot"/>{eyebrow}</div><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end"><h1 className="display-xl max-w-5xl">{title}</h1>{subtitle && <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p>}</div></div></section>;
}

export function Section({ title, description, eyebrow, children, className = "" }: { title?: string; description?: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 ${className}`}>{(title || eyebrow) && <div className="mb-9 max-w-3xl">{eyebrow && <div className="kicker mb-3"><span className="kicker-dot"/>{eyebrow}</div>}{title && <h2 className="display-lg">{title}</h2>}{description && <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>}</div>}{children}</section>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`premium-card ${className}`}><div className="card-shine"/>{children}</div>;
}

export function Stat({ value, label }: { value: string; label: string }) { return <div><div className="text-3xl font-black tracking-[-.05em] sm:text-4xl">{value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{label}</div></div>; }

export function ArrowLink({ to, children }: { to: string; children: ReactNode }) { return <a href={to} className="inline-flex items-center gap-2 text-sm font-extrabold text-primary group">{children}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>; }
