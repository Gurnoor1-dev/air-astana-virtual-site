import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, Plane, Ruler, Users } from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import a320Image from "@/assets/A320-AirArabia.png";
import a320neoImage from "@/assets/A320neo-AirArabia.png";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Air Arabia Virtual" },
      { name: "description", content: "Explore the Air Arabia Virtual Airbus A320 family fleet." },
    ],
  }),
  component: Fleet,
});

const fleet = [
  {
    type: "A320-200",
    image: a320Image,
    count: "38",
    seats: "174",
    range: "5,700 km",
    role: "Network backbone",
    description: "The core aircraft of our virtual operation, covering the majority of Air Arabia sectors across the network.",
  },
  {
    type: "A320neo",
    image: a320neoImage,
    count: "—",
    seats: "174",
    range: "6,300 km",
    role: "Coming soon",
    description: "The A320neo is coming soon to Infinite Flight Simulator and will join our virtual fleet when it becomes available.",
  },
];

function Fleet() {
  return (
    <>
      <PageHeader
        eyebrow="Fleet / Airbus A320 family"
        title="One family. Every sector."
        subtitle="Our virtual fleet keeps the operation focused: familiar systems, consistent procedures and an aircraft family made for a network like ours."
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {fleet.map((aircraft, i) => (
            <Card key={aircraft.type} className={`overflow-hidden ${i === 1 ? "brand-gradient text-white border-transparent" : ""}`}>
              <div className="flex items-start justify-between">
                <div className={`kicker ${i === 1 ? "!text-white/70" : ""}`}>{aircraft.role}</div>
                <span className={`text-xs font-black ${i === 1 ? "text-white/50" : "text-primary"}`}>0{i + 1}</span>
              </div>

              <div className={`my-8 flex h-52 items-center justify-center overflow-hidden rounded-2xl ${i === 1 ? "bg-white/10" : "bg-muted"}`}>
                <img
                  src={aircraft.image}
                  alt={`Air Arabia ${aircraft.type}`}
                  className="h-full w-full object-contain p-4 transition duration-300 hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              <h2 className="text-3xl font-black tracking-[-.05em]">Airbus {aircraft.type}</h2>
              <p className={`mt-3 max-w-xl text-sm leading-6 ${i === 1 ? "text-white/70" : "text-muted-foreground"}`}>
                {aircraft.description}
              </p>

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[[aircraft.count, "aircraft", Plane], [aircraft.seats, "seats", Users], [aircraft.range, "range", Ruler]].map(([value, label, Icon]) => (
                  <div key={String(label)} className={`rounded-xl p-3 ${i === 1 ? "bg-white/10" : "bg-muted"}`}>
                    <Icon className="size-4" />
                    <div className="mt-3 text-sm font-black">{String(value)}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${i === 1 ? "text-white/55" : "text-muted-foreground"}`}>
                      {String(label)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Operations" title="Built for consistency" description="The fleet philosophy is simple: know the aircraft, fly the procedure and focus on the sector.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Gauge className="size-5 text-primary" />
            <h3 className="mt-6 text-xl font-extrabold">Operational simplicity</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">A concentrated A320-family operation means pilots spend less time learning new types and more time flying.</p>
          </Card>
          <Card>
            <Plane className="size-5 text-primary" />
            <h3 className="mt-6 text-xl font-extrabold">Infinite Flight ready</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Use the appropriate Air Arabia livery and aircraft variant available in your Infinite Flight setup.</p>
          </Card>
          <Card>
            <Users className="size-5 text-primary" />
            <h3 className="mt-6 text-xl font-extrabold">Crew first</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Standardized flying gives group operations and events a common platform.</p>
          </Card>
        </div>
      </Section>

      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="brand-gradient rounded-[2rem] p-8 text-white shadow-brand sm:p-12">
          <div className="max-w-2xl">
            <div className="kicker !text-white/60">Find your sector</div>
            <h3 className="mt-4 text-4xl font-black tracking-[-.06em]">See where the fleet can take you.</h3>
            <Link to="/routes" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-primary">
              Explore routes <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
