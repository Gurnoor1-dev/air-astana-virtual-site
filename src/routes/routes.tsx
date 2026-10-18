import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  Lock,
  Plane,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, Section } from "@/components/site/Page";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";

import heroBg from "@/assets/site/home-hero.jpg";
import bangkok from "@/assets/site/bangkok.jpg";
import delhi from "@/assets/site/delhi.jpg";
import dubai from "@/assets/site/dubai.jpg";
import london from "@/assets/site/london.jpg";
import tokyo from "@/assets/site/tokyo.jpg";
import manila from "@/assets/site/manila.jpg";

import { RouteMap } from "@/components/site/RouteMap";

export const Route = createFileRoute("/routes")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap",
      },
    ],
    meta: [
      { title: "Route Network — Air Astana Virtual" },
      {
        name: "description",
        content:
          "Explore the Air Astana Virtual network with an interactive map and searchable route database.",
      },
    ],
  }),
  component: RoutesPage,
});

const ITEMS_PER_PAGE = 10;
const AIRCRAFT_GROUPS = [
  "787-9",
  "A321neo",
  "A321-200",
  "A320-200",
  "757-200",
];

const SIMBRIEF_AIRCRAFT: Record<string, string> = {
  "787-9": "B789",
  "A321neo": "A21N",
  "A321-200": "A321",
  "A320-200": "A320",
  "757-200": "B752",
};

function estimatedBlockTime(route: RouteRecord) {
  const rad = (n: number) => (n * Math.PI) / 180;
  const [lat1, lon1] = route.dep, [lat2, lon2] = route.arr;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const distanceNm = 3440.065 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const cruiseKnots = route.aircraft === "787-9" ? 485 : route.aircraft === "757-200" ? 440 : 435;
  const minutes = Math.max(30, Math.round((distanceNm / cruiseKnots * 60 + 35) / 15) * 15);
  const hours = Math.floor(minutes / 60), remainder = minutes % 60;
  return hours ? `${hours}h ${String(remainder).padStart(2, "0")}m` : `${remainder} min`;
}

function simBriefUrl(route: RouteRecord) {
  const params = new URLSearchParams({
    orig: route.depIcao,
    dest: route.arrIcao,
    type: SIMBRIEF_AIRCRAFT[route.aircraft] ?? route.aircraft,
    callsign: route.routeNo,
    fltnum: route.routeNo.replace(/\D/g, ""),
  });
  return `https://dispatch.simbrief.com/options/new?${params.toString()}`;
}

function RoutesPage() {
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [q, setQ] = useState("");
  const [hub, setHub] = useState("ALL");
  const [aircraft, setAircraft] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [networkTab, setNetworkTab] = useState<"standard" | "codeshares">("standard");

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(console.error);
  }, []);

  const hubs = useMemo(() => ["ALL", "UAAA", "UACC"], []);

  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    return routes
      .filter((r) => {
        const text = [
          r.routeNo,
          r.depIcao,
          r.arrIcao,
          r.depAirport,
          r.arrAirport,
          r.aircraft,
        ]
          .join(" ")
          .toUpperCase();
        return (
          (!s || text.includes(s)) &&
          (hub === "ALL" || r.depIcao === hub) &&
          (aircraft === "ALL" || r.aircraft === aircraft)
        );
      })
      .sort((a, b) => {
        const ai = AIRCRAFT_GROUPS.indexOf(a.aircraft),
          bi = AIRCRAFT_GROUPS.indexOf(b.aircraft);
        return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
      });
  }, [routes, q, hub, aircraft]);

  useEffect(() => {
    setCurrentPage(1);
  }, [q, hub, aircraft]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedRoutes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>

      <div className="font-jakarta min-h-screen bg-background text-foreground antialiased selection:bg-[#b89358]/20 selection:text-[#b89358]">
        {/* HERO SECTION — Added robust top padding to completely clear navbar overlap */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 text-center">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat opacity-25 sm:opacity-35 transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#b89358]/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b89358]/30 bg-[#b89358]/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#b89358] shadow-sm backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#b89358] animate-pulse" />
              Network Control Center
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Explore the network.
            </h1>

            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              Browse our published sectors, search by airport or route, and
              filter the Eurasian network by hub or aircraft type.
            </p>

            {/* TOGGLE BAR */}
            <div className="mt-8 flex justify-center w-full">
              <div className="inline-flex items-center rounded-2xl border border-border/80 bg-white/80 p-1.5 shadow-md backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setNetworkTab("standard")}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                    networkTab === "standard"
                      ? "brand-gradient text-white shadow-md shadow-primary/20 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Plane className="size-4" />
                  <span>Air Astana Routes</span>
                </button>

                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-muted-foreground/55 transition-all sm:text-sm"
                  title="Codeshare operations are launching soon"
                >
                  <Lock className="size-3.5" />
                  <span>Codeshares</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                    Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & FILTER CONTROLS */}
        <Section className="!pt-2">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
            {/* Map Container */}
            <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-white p-3.5 shadow-xl shadow-slate-200/50">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-50 min-h-[440px]">
                <RouteMap search={q} aircraft={aircraft} />
              </div>

              {/* Bottom Legend Pill Bar */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-xs font-semibold text-foreground/80">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-600 shadow-sm shadow-emerald-600/50" />
                    <span className="font-bold">Hub</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
                    <span className="font-bold">Destination</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 rounded-full bg-[#b89358]" />
                    <span className="font-bold">Route</span>
                  </div>
                </div>
                <div className="rounded-full bg-background px-3 py-1 text-xs font-black text-primary shadow-sm border border-border/60">
                  {filtered.length} Direct Routes
                </div>
              </div>
            </div>

            {/* Side Filter Cards */}
            <div className="space-y-4">
              <Card className="rounded-[1.75rem] p-6 shadow-xl shadow-slate-200/50 border border-border/80 bg-white">
                <div className="kicker flex items-center gap-2 text-[#b89358]">
                  <SlidersHorizontal className="size-3.5" />
                  <span>Find a flight</span>
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Search Sectors
                </label>
                <div className="relative mt-2 flex items-center">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground z-10" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ICAO, airport, route…"
                    className="form-input w-full text-sm rounded-xl border-border/80 focus:border-primary transition shadow-inner"
                    style={{ paddingLeft: "2.75rem" }}
                  />
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Origin Hub
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {hubs.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHub(h)}
                      className={`rounded-xl px-2 py-2.5 text-xs font-extrabold transition-all ${
                        hub === h
                          ? "brand-gradient text-white shadow-md shadow-primary/20 scale-[1.02]"
                          : "bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Aircraft groups
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {AIRCRAFT_GROUPS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAircraft(a)}
                      className={`rounded-xl px-2.5 py-2.5 text-xs font-extrabold transition-all truncate ${
                        aircraft === a
                          ? "brand-gradient text-white shadow-md shadow-primary/20 scale-[1.02]"
                          : "bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Total Sectors Badge Card */}
              <div className="relative overflow-hidden rounded-[1.75rem] brand-gradient p-6 text-white shadow-xl shadow-primary/25">
                <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <RouteIcon className="size-6 text-white/90" />
                <div className="mt-6 text-4xl font-black tracking-tight">
                  {filtered.length}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/80">
                  Sectors Available
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/85">
                  Use the SimBrief dispatch button on any schedule row to open
                  a flight plan with the selected departure, arrival, aircraft and flight number.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* PUBLISHED SCHEDULE TABLE */}
        <Section
          eyebrow="Schedule"
          title="Our published routes"
          description="A detailed view of the routes available to our pilots. Browse the schedule, check the aircraft and find a sector that suits your next flight."
        >
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="hidden grid-cols-[.8fr_1.1fr_1.1fr_.7fr_.7fr] gap-4 bg-[#1c2b4f] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.18em] text-white/80 sm:grid">
              <div>Flight</div>
              <div>Departure</div>
              <div>Arrival</div>
              <div>Aircraft</div>
            </div>
            {paginatedRoutes.map((r, i) => (
              <div
                key={r.routeId}
                className={`grid gap-3 px-5 py-5 sm:grid-cols-[.8fr_1.1fr_1.1fr_.7fr_.7fr] sm:items-center sm:gap-4 sm:px-6 ${
                  i ? "border-t border-border/60" : ""
                } transition-colors hover:bg-muted/30`}
              >
                <div>
                  <div className="text-sm font-black text-primary">
                    {r.routeNo}
                  </div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {r.routeId}
                  </div>
                </div>
                <div>
                  <div className="font-extrabold">{r.depIcao}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.depAirport}
                  </div>
                </div>
                <div>
                  <div className="font-extrabold">{r.arrIcao}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.arrAirport}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-extrabold text-foreground/80">
                  <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold border border-border/50">
                    {r.aircraft}
                  </span>
                  <a
                    href={simBriefUrl(r)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#b89358] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#a9824b] hover:shadow-md"
                    title={`Open SimBrief dispatch for ${r.routeNo}`}
                  >
                    <span>SimBrief</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                No sectors match your filter.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="text-xs font-semibold text-muted-foreground">
                Showing{" "}
                <strong className="text-foreground">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-foreground">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </strong>{" "}
                of <strong className="text-foreground">{filtered.length}</strong>{" "}
                sectors
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-white text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 shadow-sm"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .map((page, idx, arr) => {
                    const prev = arr[idx - 1];
                    return (
                      <div key={page} className="flex items-center gap-1.5">
                        {prev && page - prev > 1 && (
                          <span className="px-1 text-xs text-muted-foreground">
                            …
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`size-9 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
                            currentPage === page
                              ? "brand-gradient text-white shadow-primary/25 scale-105"
                              : "border border-border/80 bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex size-9 items-center justify-center rounded-xl border border-border/80 bg-white text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 shadow-sm"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </Section>

        {/* FEATURED DESTINATIONS */}
        <Section
          eyebrow="Featured destinations"
          title="Destinations to explore."
          description="A few destinations from across the network. Search the route database to see what is currently available."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icao: "EGLL",
                name: "London Heathrow",
                image: london,
                description:
                  "A major European gateway and a natural long-haul planning point between Kazakhstan and the UK.",
              },
              {
                icao: "RPLL",
                name: "Manila Ninoy Aquino",
                image: manila,
                description:
                  "A major Philippine gateway connecting Southeast Asia with a broad regional network and longer international sectors.",
              },
              {
                icao: "RJTT",
                name: "Tokyo Haneda",
                image: tokyo,
                description:
                  "A landmark Tokyo gateway for the Asia-Pacific network, pairing naturally with long-range 787-9 operations.",
              },
              {
                icao: "VTBS",
                name: "Bangkok Suvarnabhumi",
                image: bangkok,
                description:
                  "A busy Southeast Asian gateway with strong regional connections and plenty of scope for extended operations.",
              },
              {
                icao: "OMDB",
                name: "Dubai International",
                image: dubai,
                description:
                  "A major Middle East hub and a natural bridge between Central Asia, Europe, South Asia and beyond.",
              },
              {
                icao: "VIDP",
                name: "Delhi Indira Gandhi",
                image: delhi,
                description:
                  "A key South Asian gateway with dense regional demand and a strong fit for the A321neo network.",
              },
            ].map((d) => (
              <div
                key={d.icao}
                className="group overflow-hidden rounded-[1.5rem] border border-border/80 bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17213a]/90 via-[#17213a]/30 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="inline-block rounded-md bg-[#b89358]/95 px-2 py-0.5 text-[10px] font-black uppercase tracking-[.18em] text-white backdrop-blur-sm">
                      {d.icao}
                    </div>
                    <div className="mt-1.5 text-lg font-black tracking-tight">{d.name}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setQ(d.icao)}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary transition-colors hover:text-[#b89358]"
                  >
                    <span>Search published sectors</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* OPERATIONS BANNER */}
        <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-8 sm:p-12 shadow-lg shadow-primary/5">
            <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="kicker flex items-center gap-2 text-[#b89358]">
              <Sparkles className="size-4" />
              <span>Flight Operations</span>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              SimBrief &amp; Flight Dispatch Ready
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              All published sectors mirror real-world Air Astana operations. Pilots
              can export schedule profiles directly to SimBrief and smartACARS for
              instant flight plan generation and real-time flight tracking.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
