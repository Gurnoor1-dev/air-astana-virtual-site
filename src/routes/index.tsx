import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, Plane, Radio, ShieldCheck, Users } from "lucide-react";
import { Section, Stat } from "@/components/site/Page";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Air Arabia Virtual — Infinite Flight" }, { name: "description", content: "Air Arabia Virtual — a polished Infinite Flight virtual airline built around the Air Arabia network." }] }),
  component: Home,
});

const stats = [
  { value: "140+", label: "Network routes" },
  { value: "6", label: "Main hubs" },
  { value: "A320", label: "Core fleet" },
  { value: "7", label: "Pilot ranks" },
];

const hubs = ["SHJ", "RKT", "CMN", "HBE", "AUH", "KHI"];

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,#ff004112,transparent_27%),radial-gradient(circle_at_10%_90%,#ff004108,transparent_24%)]" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="kicker"><span className="kicker-dot" /> Infinite Flight Virtual Airline</div>
            <h1 className="mt-5 display-xl">Fly the <span className="text-primary">network.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Experience Air Arabia in Infinite Flight through a connected network, structured pilot progression and a crew that enjoys every sector.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className="inline-flex items-center gap-2 rounded-lg brand-gradient px-5 py-3 text-sm font-extrabold text-white shadow-brand transition hover:-translate-y-0.5">Join the crew <ArrowRight className="size-4" /></Link>
              <Link to="/routes" className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-3 text-sm font-extrabold transition hover:bg-muted">Explore routes <ArrowRight className="size-4" /></Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" /> Network ready · Built for Infinite Flight</div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#111319] p-6 text-white sm:p-8">
            <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 75% 20%,#ff004150,transparent 32%),linear-gradient(90deg,transparent 49.8%,#ffffff12 50%,transparent 50.2%),linear-gradient(0deg,transparent 49.8%,#ffffff12 50%,transparent 50.2%)", backgroundSize: "auto, 56px 56px, 56px 56px" }} />
            <div className="relative flex h-full min-h-[308px] flex-col justify-between">
              <div className="flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[.2em] text-white/45">Air Arabia Virtual</div><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70">Operational</span></div>
              <div className="relative flex items-center justify-center"><div className="absolute size-56 rounded-full border border-white/10" /><div className="absolute size-40 rounded-full border border-white/10" /><Plane className="relative size-24 rotate-[-12deg] text-white/90" strokeWidth={1.2} /></div>
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5"><div><div className="text-xl font-black">140+</div><div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Routes</div></div><div><div className="text-xl font-black">6</div><div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Hubs</div></div><div><div className="text-xl font-black">A320</div><div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Fleet</div></div></div>
            </div>
          </div>
        </div>
        <div className="border-y border-border bg-[#fafafa]"><div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-hidden px-4 py-5 sm:px-6"><span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[.18em] text-muted-foreground">Our network</span><div className="flex gap-8">{hubs.map((hub) => <span key={hub} className="text-xs font-black tracking-[.2em] text-foreground/55">{hub}</span>)}</div></div></div>
      </section>

      <Section className="!py-10 sm:!py-14">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="border-b border-border p-6 last:border-0 md:border-b-0 md:border-r md:last:border-0 sm:p-8"><Stat {...stat} /></div>)}</div>
      </Section>

      <Section eyebrow="The experience" title="Everything you need to fly." description="A simple, polished home for the network, aircraft and people behind Air Arabia Virtual.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="premium-card md:col-span-2 min-h-[250px] bg-[#111319] text-white"><div className="flex h-full flex-col justify-between"><div><Radio className="size-5 text-primary" /><h3 className="mt-8 text-3xl font-extrabold">A network made to explore.</h3><p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Search routes, discover hubs and choose your next sector from a growing Air Arabia network.</p></div><Link to="/routes" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-primary">Explore the network <ArrowRight className="size-4" /></Link></div></div>
          <div className="premium-card"><Globe2 className="size-5 text-primary" /><h3 className="mt-8 text-2xl font-extrabold">Six hubs.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Follow the network from the Gulf through Africa, Asia and beyond.</p><Link to="/hubs" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">View hubs <ArrowRight className="size-4" /></Link></div>
          <div className="premium-card"><Plane className="size-5 text-primary" /><h3 className="mt-8 text-2xl font-extrabold">Built around Airbus.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Explore the A320-family fleet and the aircraft we use across our network.</p><Link to="/fleet" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Explore fleet <ArrowRight className="size-4" /></Link></div>
          <div className="premium-card"><Users className="size-5 text-primary" /><h3 className="mt-8 text-2xl font-extrabold">Fly with a crew.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Meet the team, take part in events and progress through our pilot ranks.</p><Link to="/staff" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">Meet the crew <ArrowRight className="size-4" /></Link></div>
          <div className="premium-card"><ShieldCheck className="size-5 text-primary" /><h3 className="mt-8 text-2xl font-extrabold">Progress your way.</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">A clear rank structure gives every flight a reason to keep climbing.</p><Link to="/ranks" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary">View ranks <ArrowRight className="size-4" /></Link></div>
        </div>
      </Section>

      <section className="mx-auto mb-16 max-w-7xl px-4 sm:px-6 sm:mb-20"><div className="overflow-hidden rounded-[2rem] brand-gradient text-white"><div className="relative px-7 py-12 sm:px-12 sm:py-16"><div className="absolute right-[-6rem] top-[-9rem] size-80 rounded-full border border-white/15" /><div className="relative max-w-2xl"><div className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/65">Ready for departure?</div><h2 className="mt-4 text-4xl font-extrabold leading-none tracking-[-.06em] sm:text-5xl">Your next flight starts here.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/75">Join Air Arabia Virtual and turn every Infinite Flight sector into part of a bigger journey.</p><Link to="/apply" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-[#15171b]">Apply now <ArrowRight className="size-4" /></Link></div></div></div></section>
    </div>
  );
}
