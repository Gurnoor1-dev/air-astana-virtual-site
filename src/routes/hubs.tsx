import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  MapPin,
  Plane,
  Ruler,
  Search,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import {
  fetchAirports,
  fetchRoutes,
  type AirportRecord,
  type RouteRecord,
} from "@/lib/csv";

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
      { title: "Hubs & Stations — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Explore Air Astana Virtual's principal hubs, domestic Kazakhstan operating bases, and network stations.",
      },
    ],
  }),
  component: Hubs,
});

const hubs = [
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
    icao: "UAAA", // Note: Replace with specific airport code if Sary-Arka (UAKK)
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
  const [airports, setAirports] = useState<AirportRecord[]>([]);
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [q, setQ] = useState("");
  const [expandedAirports, setExpandedAirports] = useState<Record<string, boolean>>({});

  const toggleAirportExpand = (code: string) => {
    setExpandedAirports((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  useEffect(() => {
    Promise.all([fetchAirports(), fetchRoutes()])
      .then(([a, r]) => {
        const map = new Map(a.map((x) => [x.icao, x]));
        r.forEach((x) => {
          if (!map.has(x.depIcao)) {
            map.set(x.depIcao, {
              icao: x.depIcao,
              name: x.depAirport,
              coords: x.dep,
              flights: String(r.filter((y) => y.depIcao === x.depIcao).length),
              moreToKnow: "Published route station.",
            });
          }
          if (!map.has(x.arrIcao)) {
            map.set(x.arrIcao, {
              icao: x.arrIcao,
              name: x.arrAirport,
              coords: x.arr,
              flights: String(r.filter((y) => y.arrIcao === x.arrIcao).length),
              moreToKnow: "Published route station.",
            });
          }
        });
        setAirports(Array.from(map.values()));
        setRoutes(r);
      })
      .catch(console.error);
  }, []);

  const stations = useMemo(
    () =>
      airports.filter((a) => {
        const s = q.toUpperCase();
        return !s || `${a.icao} ${a.name}`.toUpperCase().includes(s);
      }),
    [airports, q]
  );

  return (
    <>
      <PageHeader
        eyebrow="Principal hubs"
        title="Two gateways. One Eurasian network."
        subtitle="Explore Almaty and Astana, discover regional Kazakhstan operating stations, or search the global network directory."
      />

      {/* Main Hubs Section */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {hubs.map((h, i) => (
            <Card key={h.icao} className="overflow-hidden p-0 transition-all hover:shadow-xl">
              <div className="p-2">
                <div className="relative h-56 overflow-hidden rounded-2xl">
                  <img
                    src={h.image}
                    alt={h.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
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
                <h3 className="mt-3 text-xl font-extrabold text-foreground">
                  {h.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {h.city} · {h.icao}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {h.body}
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-muted p-3">
                    <div className="text-lg font-black">
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
                  <div className="rounded-xl bg-muted p-3">
                    <div className="text-sm font-black">
                      {h.runways[0].length.split(" ")[0]} m
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Max Runway
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <div className="text-sm font-black">
                      {routes.filter((r) => r.depIcao === h.icao).length}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                      Departures
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Regional Kazakh Stations */}
      <Section
        eyebrow="National Coverage"
        title="Other Airports We Operate From"
        description="Air Astana Virtual connects key economic and regional centers across Kazakhstan with modern infrastructure."
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
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={ap.image}
                    alt={ap.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="rounded bg-primary/80 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        {ap.code} · {ap.icao}
                      </span>
                      <h4 className="mt-1 font-extrabold text-white text-base leading-snug">
                        {ap.name}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ap.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1">
                      <Ruler className="size-3.5" />
                      {ap.runways.length} {ap.runways.length === 1 ? "Runway" : "Runways"}
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle runway details"
                      className="flex items-center gap-1 text-xs font-bold transition-transform"
                    >
                      <span>{isExpanded ? "Hide info" : "Runway details"}</span>
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expandable Runway Info Drawer */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-border"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden space-y-2">
                      {ap.runways.map((rw) => (
                        <div
                          key={rw.designation}
                          className="rounded-lg bg-muted/60 p-2.5 text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="font-extrabold text-foreground flex items-center gap-1.5">
                              <Compass className="size-3 text-primary" />
                              Runway {rw.designation}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
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

      {/* Network Search Directory */}
      <Section
        eyebrow="Network Search"
        title="Find Any Scheduled Station"
        description="This directory uses the same route-backed airport data as the interactive network map, including international stations like Tokyo Haneda (RJTT)."
      >
        <div className="relative mb-6 max-w-lg">
          <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search airport or ICAO, e.g. RJTT…"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm font-medium outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((a) => (
            <div
              key={a.icao}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary">
                  {a.icao}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {a.flights} departures
                </span>
              </div>
              <h3 className="mt-3 font-extrabold text-foreground">{a.name}</h3>
              {a.moreToKnow && (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {a.moreToKnow}
                </p>
              )}
              <Plane className="mt-5 size-4 text-border transition group-hover:text-primary" />
            </div>
          ))}
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-primary transition hover:bg-white/90"
          >
            Explore network <ArrowRight className="size-4" />
          </a>
        </div>
      </section>
    </>
  );
}
