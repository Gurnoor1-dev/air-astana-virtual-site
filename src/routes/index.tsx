import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Map, Users, Award } from "lucide-react";

import { Card, Section } from "@/components/site/Page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Air Arabia Virtual — Infinite Flight Virtual Airline" },
      {
        name: "description",
        content:
          "Join Air Arabia Virtual and fly the real Air Arabia network in Infinite Flight from our hubs in Sharjah, Casablanca and Cairo.",
      },
      { property: "og:title", content: "Air Arabia Virtual — Infinite Flight Virtual Airline" },
      {
        property: "og:description",
        content: "Fly the real Air Arabia network in Infinite Flight. Applications open.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "120+", label: "Scheduled routes" },
  { value: "3", label: "Operating hubs" },
  { value: "A320 family", label: "Single-type fleet" },
  { value: "7", label: "Pilot ranks" },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 hairline-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Infinite Flight Virtual Airline
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Fly the Air Arabia network, <span className="text-primary">virtually</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Air Arabia Virtual is a low-cost operation built for Infinite Flight pilots who love
            tight turnarounds, busy Gulf skies and a single-type A320 fleet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="rounded-md brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand"
            >
              Apply as a pilot
            </Link>
            <Link
              to="/routes"
              className="rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Explore the route map
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Why fly with us"
        description="Everything is kept simple: one fleet type, clear ranks and a network you can actually fly after work."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Plane,
              title: "Single-type fleet",
              body: "A320, A320neo and A321neo LR only — learn one aircraft properly.",
            },
            {
              icon: Map,
              title: "Real schedules",
              body: "Routes mirror the real Air Arabia timetable, from 40-minute hops to Europe.",
            },
            {
              icon: Users,
              title: "Friendly crew",
              body: "Group flights, events and a staff team that answers quickly.",
            },
            {
              icon: Award,
              title: "Rank progression",
              body: "Climb from Cadet to Fleet Captain by logging hours on the network.",
            },
          ].map((f) => (
            <Card key={f.title}>
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
