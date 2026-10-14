import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Gauge,
  Plane,
  Ruler,
  Users,
  Sparkles,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import a320Image from "@/assets/A320-AirAstana.png";
import a321Image from "@/assets/A321-AirAstana.png";
import boeing757Image from "@/assets/757-AirAstana.png";
import a321neoImage from "@/assets/A321neo-AirAstana.png";
import boeing787Image from "@/assets/787-AirAstana.png";
import homeHero from "@/assets/site/home-hero.jpg";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Air Astana Virtual" },
      {
        name: "description",
        content: "Explore the Air Astana Virtual fleet lineup for Infinite Flight.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap",
      },
    ],
  }),
  component: Fleet,
});

const fleet = [
  {
    type: "787-9",
    image: boeing787Image,
    count: "Flagship",
    seats: "~303",
    range: "Long haul",
    role: "Long-haul lead",
    isFlagship: true,
    tagline: "Ultra-long range & intercontinental routes",
    description:
      "The lead aircraft for the longest international sectors and high-capacity Asia, Europe and East Asia missions. Livery: Generic Livery.",
    livery: "Generic Livery",
  },
  {
    type: "A321neo",
    image: a321neoImage,
    count: "Primary",
    seats: "~236",
    range: "Medium / long haul",
    role: "Medium-haul lead",
    tagline: "Next-gen transcontinental workhorse",
    description:
      "Primary narrowbody for medium-haul international flying across Central Asia, the Caucasus, South Asia and the Middle East. Livery: Air Astana Livery.",
    livery: "Air Astana Livery",
  },
  {
    type: "A320-200",
    image: a320Image,
    count: "Active",
    seats: "~180",
    range: "Short / medium haul",
    role: "Domestic & regional backbone",
    tagline: "High-frequency domestic operations",
    description:
      "Domestic and regional workhorse for Kazakhstan and shorter Central Asian sectors. Livery: Generic Livery.",
    livery: "Generic Livery",
  },
  {
    type: "A321-200",
    image: a321Image,
    count: "Active",
    seats: "~200",
    range: "Medium / long haul",
    role: "Medium-haul workhorse",
    tagline: "Flexible capacity across the continent",
    description:
      "Flexible narrowbody for secondary medium-haul sectors between domestic, regional and longer international missions. Livery: Generic Livery.",
    livery: "Generic Livery",
  },
  {
    type: "757-200",
    image: boeing757Image,
    count: "Active",
    seats: "~220",
    range: "Long haul",
    role: "Selective long-haul",
    tagline: "Specialized performance for thin routes",
    description:
      "Limited-use aircraft for selected longer sectors where a smaller long-range aircraft fits the schedule. Livery: Air Astana Livery.",
    livery: "Air Astana Livery",
  },
];

function Fleet() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <PageHeader
        eyebrow="Fleet / Air Astana"
        title="Five aircraft, one seamless network."
        subtitle="From short domestic hops across the steppe to ultra-long intercontinental flights, every airframe has an intentional operational role."
        backgroundImage={homeHero}
      />

      {/* Fleet Cards Grid */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fleet.map((aircraft, i) => (
            <Card
              key={aircraft.type}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
                aircraft.isFlagship
                  ? "border-[#A48656]/50 bg-gradient-to-b from-[#A48656]/[0.08] via-card to-card shadow-[0_25px_60px_-25px_rgba(164,134,86,0.35)]"
                  : "border-border/80 bg-card hover:border-primary/40 shadow-sm"
              }`}
            >
              {/* Flagship accent glow */}
              {aircraft.isFlagship && (
                <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[#A48656]/15 blur-3xl" />
              )}

              <div>
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
                      {aircraft.isFlagship && (
                        <Sparkles className="size-3 text-[#A48656]" />
                      )}
                      {aircraft.role}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-muted-foreground/70">
                    0{i + 1}
                  </span>
                </div>

                {/* Aircraft Showcase Display Bay */}
                <div className="relative my-6 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-muted/50 to-muted/20 p-4">
                  {/* Subtle radial studio illumination */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="size-36 rounded-full bg-primary/10 blur-2xl transition duration-500 group-hover:scale-125 group-hover:bg-primary/20" />
                  </div>

                  <img
                    src={aircraft.image}
                    alt={`Air Astana Virtual ${aircraft.type}`}
                    className="relative z-10 h-full w-full object-contain drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Title & Description */}
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                      {aircraft.type}
                    </h2>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {aircraft.tagline}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {aircraft.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#b89358]/25 bg-[#b89358]/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#8f6e3f]">
                    <Plane className="size-3" />
                    {aircraft.livery}
                  </div>
                </div>
              </div>

              {/* Specs Metric Row */}
              <div className="mt-8 grid grid-cols-3 gap-2 border-t border-border/40 pt-4">
                <div className="rounded-xl border border-border/40 bg-muted/40 p-3 text-center transition group-hover:bg-muted/70">
                  <Plane className="mx-auto size-4 text-primary" />
                  <div className="mt-2 text-xs font-black tracking-tight text-foreground truncate">
                    {aircraft.count}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </div>
                </div>

                <div className="rounded-xl border border-border/40 bg-muted/40 p-3 text-center transition group-hover:bg-muted/70">
                  <Users className="mx-auto size-4 text-primary" />
                  <div className="mt-2 text-xs font-black tracking-tight text-foreground truncate">
                    {aircraft.seats}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Seats
                  </div>
                </div>

                <div className="rounded-xl border border-border/40 bg-muted/40 p-3 text-center transition group-hover:bg-muted/70">
                  <Ruler className="mx-auto size-4 text-primary" />
                  <div className="mt-2 text-xs font-black tracking-tight text-foreground truncate">
                    {aircraft.range}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Range
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Operations Matrix Section */}
      <Section
        eyebrow="Operational Philosophy"
        title="A fleet engineered around real schedules."
        description="Our fleet covers domestic, regional and long-range flying while keeping group operations intuitive for Infinite Flight pilots."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border border-border/80 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:border-primary/40 hover:shadow-lg">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Gauge className="size-6" />
            </div>
            <h3 className="mt-5 text-xl font-black tracking-tight">Flexible Operations</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Choose an airframe that matches your available time, from quick 40-minute domestic hops to 9-hour transcontinental flights.
            </p>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/80 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:border-primary/40 hover:shadow-lg">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="mt-5 text-xl font-black tracking-tight">Official Infinite Flight Liveries</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Curated exclusively around liveries present inside Infinite Flight so your pireps log without missing texture conflicts.
            </p>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/80 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:border-primary/40 hover:shadow-lg">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Compass className="size-6" />
            </div>
            <h3 className="mt-5 text-xl font-black tracking-tight">Synchronized Group Flights</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Consistent cruise profiles and speeds make escort flights, VA fly-outs, and community events run harmoniously.
            </p>
          </Card>
        </div>
      </Section>

      {/* Call to Action Banner */}
      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1C2B4F] via-[#24355F] to-[#A48656] p-8 text-white shadow-2xl sm:p-12">
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-200 backdrop-blur-md">
                <Plane className="size-3.5" />
                Find your sector
              </span>
              <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                See where the fleet can take you.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                Discover all connected destinations across Central Asia, Europe, and the Middle East logged for Air Astana Virtual.
              </p>
            </div>

            <Link
              to="/routes"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#1C2B4F] shadow-lg transition duration-300 hover:scale-105 hover:bg-amber-100"
            >
              Explore routes
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
