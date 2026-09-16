import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="absolute inset-0 hairline-grid opacity-35" aria-hidden="true" />
      <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="eyebrow-chip inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
          {eyebrow}
        </div>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

export function Section({ title, description, children }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
      {title && <h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{title}</h2>}
      {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
      <div className={title || description ? "mt-8" : ""}>{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-brand/40 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  );
}
