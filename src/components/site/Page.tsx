import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {title && <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>}
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <div className={title || description ? "mt-8" : ""}>{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-brand/40 ${className}`}
    >
      {children}
    </div>
  );
}
