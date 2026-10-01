import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  MapPin,
  Ruler,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";

import hubAlmaty from "@/assets/site/hub-almaty.jpg";
import hubAstana from "@/assets/site/hub-astana.jpg";

import airportShymkent from "@/assets/site/kc-airports/shymkent.jpg";
import airportAktau from "@/assets/site/kc-airports/aktau.jpg";
import airportAtyrau from "@/assets/site/kc-airports/atyrau.jpg";
import airportKaraganda from "@/assets/site/kc-airports/karaganda.jpg";
import airportKostanay from "@/assets/site/kc-airports/kostanay.jpg";
import airportKyzylorda from "@/assets/site/kc-airports/kyzylorda.jpg";

export const Route = createFileRoute("/hubs")({
  head: () => ({
    meta: [
      { title: "Hubs & Operating Bases — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Explore Air Astana Virtual's principal hubs and regional operating airports across Kazakhstan.",
      },
    ],
  }),
  component: Hubs,
});

interface AirportHub {
  icao: string;
  code: string;
  name: string;
  city: string;
  image: string;
  body: string;
  runways: {
    designation: string;
    length: string;
    surface: string;
  }[];
}

const hubs: AirportHub[] = [
  {
    icao: "UAAA",
    code: "ALA",
    name: "Almaty International Airport",
    city: "Almaty, Kazakhstan",
    image: hubAlmaty,
    body: "The principal southern hub and a natural centre for Central Asian, Asian and European flying.",
    runways: [
      { designation: "05L/23R", length: "4,400 m (14,436 ft)", surface: "Asphalt / Concrete" },
      { designation: "05R/23L", length: "4,500 m (14,764 ft)", surface: "Asphalt / Concrete" },
    ],
  },
  {
    icao: "UACC",
    code: "NQZ",
    name: "Astana International Airport",
    city: "Astana, Kazakhstan",
    image: hubAstana,
    body: "The northern capital gateway, connecting Kazakhstan with Europe, Central Asia and destinations across Asia.",
    runways: [
      { designation: "04/22", length: "3,500 m (11,483 ft)", surface: "Asphalt" },
    ],
  },
];

interface RegionalAirport {
  icao: string;
  code: string;
  name: string;
  city: string;
  image: string;
  description: string;
  runways: {
    designation: string;
    length: string;
    surface: string;
  }[];
}

const otherKazakhstanAirports: RegionalAirport[] = [
  {
    icao: "UAII",
    code: "CIT",
    name: "Shymkent International Airport",
    city: "Shymkent, Kazakhstan",
    image: airportShymkent,
    description: "Key southern domestic and regional focus city serving South Kazakhstan.",
    runways: [
      { designation: "08/26", length: "3,300 m (10,827 ft)", surface: "Concrete" },
    ],
  },
  {
    icao: "UATE",
    code: "SCO",
    name: "Aktau International Airport",
    city: "Aktau, Kazakhstan",
    image: airportAktau,
    description: "Caspian Sea coastal hub facilitating oil sector feeder flights and Trans-Caspian routes.",
    runways: [
      { designation: "12/30", length: "3,050 m (10,007 ft)", surface: "Asphalt" },
    ],
  },
  {
    icao: "UATG",
    code: "GUW",
    name: "Atyrau Airport",
    city: "Atyrau, Kazakhstan",
    image: airportAtyrau,
    description: "Primary Western Kazakhstan oil capital station with heavy European charter connections.",
    runways: [
      { designation: "14/32", length: "3,000 m (9,843 ft)", surface: "Asphalt" },
    ],
  },
  {
    icao: "UAKK",
    code: "KGF",
    name: "Sary-Arka Airport",
    city: "Karaganda, Kazakhstan",
    image: airportKaraganda,
    description: "Strategic central alternate airfield capable of heavy cargo and widebody diversions.",
    runways: [
      { designation: "05/23", length: "3,500 m (11,483 ft)", surface: "Concrete" },
    ],
  },
  {
    icao: "UAUU",
    code: "KSN",
    name: "Kostanay Airport",
    city: "Kostanay, Kazakhstan",
    image: airportKostanay,
    description: "Northern regional outpost serving agricultural and regional passenger routes.",
    runways: [
      { designation: "15/33", length: "2,814 m (9,232 ft)", surface: "Asphalt" },
    ],
  },
  {
    icao: "UAOO",
    code: "KZO",
    name: "Kyzylorda Airport",
    city: "Kyzylorda, Kazakhstan",
    image: airportKyzylorda,
    description: "Southeastern regional station connecting the Syr Darya river basin network.",
    runways: [
      { designation: "06/24", length: "2,700 m (8,858 ft)", surface: "Asphalt" },
    ],
  },
];

function Hubs() {
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [expandedAirports, setExpandedAirports] = useState<Record<string, boolean>>({});

  const toggleAirportExpand = (code: string) => {
    setExpandedAirports((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  useEffect(() => {
    fetchRoutes()
      .then((r) => setRoutes(r))
      .catch(console.error);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Principal hubs"
        title="Two gateways. One Eurasian network."
        subtitle="Explore Almaty and Astana, or discover key regional operating stations throughout Kazakhstan."
      />

      {/* Main Hubs Section */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {hubs.map((h, i) => {
            const isExpanded = !!expandedAirports[h.code];
            return (
              <Card
                key={h.icao}
                onClick={() => toggleAirportExpand(h.code)}
                className="group cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="p-2">
                  <div className="relative h-60 overflow-hidden rounded-2xl">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17213a]/90 via-[#17213a]/30 to-transparent" />
                    <div className="absolute bottom-5 left-6 text-white">
                      <div className="text-xs font-extrabold uppercase tracking-[.18em] text-white/70">
                        {h.code} · {h.icao}
                      </div>
                      <div className="mt-1 text-3xl font-black">
                        {h.name.replace(" International Airport", "")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4">
                  <div className="flex items-start justify-between">
                    <div className="kicker">
                      <MapPin className="size-3" /> {h.code}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-black text-foreground">
                    {h.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {h.city} · {h.icao}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {h.body}
                  </p>

                  {/* Summary Grid */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-muted/70 p-3.5 transition group-hover:bg-muted">
                      <div className="text-xl font-black">
                        {
                          new Set(
                            routes
                              .filter((r) => r.depIcao === h.icao)
                              .map((r) => r.arrIcao)
                          ).size
                        }
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Destinations
                      </div>
                    </div>

                    <div className="rounded-xl bg-muted/70 p-3.5 transition group-hover:bg-muted">
                      <div className="text-xl font-black">
                        {routes.filter((r) => r.depIcao === h.icao).length}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Departures
                      </div>
                    </div>

                    <div className="rounded-xl bg-muted/70 p-3.5 transition group-hover:bg-muted">
                      <div className="text-xl font-black">
                        {h.runways.length}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        {h.runways.length === 1 ? "Runway" : "Runways"}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Action Bar */}
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Ruler className="size-4" />
                      Runway Information
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle runway details"
                      className="flex items-center gap-1.5 font-extrabold"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible Runway Information Drawer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden space-y-2.5">
                      {h.runways.map((rw) => (
                        <div
                          key={rw.designation}
                          className="flex items-center justify-between rounded-xl bg-muted/80 p-3.5 text-xs transition hover:bg-muted"
                        >
                          <div>
                            <div className="flex items-center gap-2 font-extrabold text-foreground">
                              <Compass className="size-3.5 text-primary" />
                              Runway {rw.designation}
                            </div>
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              Surface: {rw.surface}
                            </div>
                          </div>
                          <div className="text-right font-black text-sm text-foreground">
                            {rw.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Regional Kazakh Stations */}
      <Section
        eyebrow="National Coverage"
        title="Other Airports We Operate From"
        description="Air Astana Virtual connects key economic and regional centers across Kazakhstan with modern aviation infrastructure."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherKazakhstanAirports.map((ap) => {
            const isExpanded = !!expandedAirports[ap.code];
            return (
              <div
                key={ap.code}
                onClick={() => toggleAirportExpand(ap.code)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ap.image}
                    alt={ap.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="rounded bg-primary/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                        {ap.code} · {ap.icao}
                      </span>
                      <h4 className="mt-1 font-extrabold text-white text-base leading-snug">
                        {ap.name}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs leading-5 text-muted-foreground line-clamp-2">
                    {ap.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1 font-bold">
                      <Ruler className="size-3.5" />
                      {ap.runways.length} {ap.runways.length === 1 ? "Runway" : "Runways"}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle runway details"
                      className="flex items-center gap-1 font-extrabold"
                    >
                      <span>{isExpanded ? "Hide" : "Runway details"}</span>
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible Runway Info Drawer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-3"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden space-y-2">
                      {ap.runways.map((rw) => (
                        <div
                          key={rw.designation}
                          className="flex items-center justify-between rounded-lg bg-muted/70 p-2.5 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-extrabold text-foreground">
                              <Compass className="size-3 text-primary" />
                              Runway {rw.designation}
                            </div>
                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                              Surface: {rw.surface}
                            </div>
                          </div>
                          <div className="text-right font-black text-foreground">
                            {rw.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Call to Action Banner */}
      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="brand-gradient flex flex-col justify-between gap-7 rounded-[2rem] p-8 text-white shadow-brand sm:flex-row sm:items-end sm:p-12">
          <div>
            <div className="kicker !text-white/60">Choose your departure</div>
            <h3 className="mt-4 text-4xl font-black tracking-[-.06em]">
              Then pick a route.
            </h3>
          </div>
          <a
            href="/routes"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-primary transition hover:bg-white/90 hover:shadow-lg"
          >
            Explore network <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
