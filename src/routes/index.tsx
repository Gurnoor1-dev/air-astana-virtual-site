import { createFileRoute, Link } from "@tanstack/react-router";
import { Plane, Map, Users, Award, ArrowRight, Globe2, Sparkles } from "lucide-react";
import { Card, Section } from "@/components/site/Page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Air Arabia Virtual — Infinite Flight Virtual Airline" },
    { name: "description", content: "Air Arabia Virtual — a premium Infinite Flight virtual airline built around the Air Arabia network." },
    { property: "og:title", content: "Air Arabia Virtual" },
    { property: "og:description", content: "Fly the network. Build your wings. Join the crew." },
  ] }),
  component: Home,
});

const stats = [
  { value: "140+", label: "Network routes" },
  { value: "6", label: "Air Arabia hubs" },
  { value: "A320", label: "Core fleet" },
  { value: "7", label: "Pilot ranks" },
];

const features = [
  { icon: Plane, title: "Airline-grade operations", body: "A focused virtual airline experience with a real-world inspired network and clean operational standards." },
  { icon: Globe2, title: "A network built to explore", body: "From the Gulf outward, discover routes across the Middle East, Asia, Africa and Europe." },
  { icon: Users, title: "Crew culture", body: "Fly together, join events and progress alongside pilots who enjoy the same aviation obsession." },
  { icon: Award, title: "A career, not a counter", body: "Earn your way through structured ranks and turn every flight into part of your pilot journey." },
];

function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-surface">
        <div className="absolute inset-0 hairline-grid opacity-30" aria-hidden="true" />
        <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-56 bottom-[-12rem] h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_.95fr] lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[.2em] text-primary">
              <Sparkles className="size-3.5" /> Infinite Flight Virtual Airline
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-extrabold leading-[.92] tracking-[-.055em] sm:text-7xl lg:text-[5.6rem]">
              Fly the network.<br /><span className="bg-gradient-to-r from-primary via-[#ff315f] to-primary-dark bg-clip-text text-transparent">Build your wings.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Air Arabia Virtual brings the feel of a modern airline to Infinite Flight — a sharp network, structured pilot progression and a crew worth flying with.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/apply" className="group inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Join the crew <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/routes" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-bold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
                Explore routes
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-primary shadow-[0_0_14px_var(--color-primary)]" /> Live network data · Built for Infinite Flight</div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="float-slow relative overflow-hidden rounded-[2rem] border border-primary/15 bg-white/80 p-3 shadow-[0_35px_90px_-35px_rgba(0,0,0,.25)] backdrop-blur">
              <div className="relative overflow-hidden rounded-[1.5rem] brand-gradient p-7 text-white sm:p-9">
                <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/15" /><div className="absolute -right-6 -top-10 size-44 rounded-full border border-white/10" />
                <div className="relative">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-white/70">Air Arabia Virtual</p>
                  <p className="mt-3 max-w-sm text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-4xl">Your next sector is waiting.</p>
                  <div className="mt-10 grid grid-cols-2 gap-3">
                    {stats.slice(0, 4).map((s) => <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><div className="text-2xl font-extrabold">{s.value}</div><div className="mt-1 text-[11px] font-medium text-white/70">{s.label}</div></div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="pulse-soft absolute -bottom-5 -left-5 size-24 rounded-full bg-primary/10 blur-xl" aria-hidden="true" />
          </div>
        </div>
      </section>

      <Section>
        <div className="grid overflow-hidden rounded-3xl border border-border bg-white shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => <div key={s.label} className={`p-6 sm:p-7 ${i ? "border-t sm:border-l sm:border-t-0" : ""}`}><div className="text-3xl font-extrabold tracking-[-.04em] text-primary">{s.value}</div><div className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{s.label}</div></div>)}
        </div>
      </Section>

      <Section title="Built like an airline. Made for pilots." description="Everything you need for a polished virtual airline experience, without the clutter.">
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((f) => <Card key={f.title} className="p-7 sm:p-8"><div className="flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary transition-transform duration-300 group-hover:scale-110"><f.icon className="size-5" /></div><h3 className="mt-6 text-xl font-extrabold tracking-[-.03em]">{f.title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{f.body}</p></Card>)}
        </div>
      </Section>

      <section className="mx-4 mb-16 overflow-hidden rounded-[2rem] brand-gradient text-white shadow-brand sm:mx-auto sm:max-w-6xl">
        <div className="relative px-7 py-12 sm:px-12 sm:py-16"><div className="absolute -right-20 -top-28 size-80 rounded-full border border-white/10" /><div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-white/65">Ready for departure?</p><h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-.04em] sm:text-5xl">Your callsign deserves a home in our network.</h2></div><Link to="/apply" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-primary transition-transform hover:-translate-y-0.5">Apply now <ArrowRight className="size-4" /></Link></div></div>
      </section>
    </>
  );
}
