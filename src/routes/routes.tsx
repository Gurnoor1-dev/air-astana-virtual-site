import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
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

const RouteMap = lazy(() =>
  import("@/components/site/RouteMap").then((module) => ({ default: module.RouteMap })),
);

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
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 text-center">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_20%] bg-no-repeat opacity-35 sm:opacity-45"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/25 to-background" />

          <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#b89358]">
              <span className="size-2 rounded-full bg-[#b89358]" />
              Network Control
            </div>

            <h1 className="mt-4 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Explore the network.
            </h1>

            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              Browse our published sectors, search by airport or route, and
              filter the Eurasian network by hub or aircraft type.
            </p>

            {/* TOGGLE BAR */}
            <div className="mt-8 flex justify-center w-full">
              <div className="inline-flex items-center rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setNetworkTab("standard")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition sm:text-sm ${
                    networkTab === "standard"
                      ? "brand-gradient text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Plane className="size-3.5" />
                  <span>Air Astana Routes</span>
                </button>

                <button
                  type="button"
                  disabled
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-muted-foreground/60 transition sm:text-sm"
                  title="Codeshare operations are launching soon"
                >
                  <Lock className="size-3" />
                  <span>Codeshares</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAP & FILTER CONTROLS */}
        <Section className="!pt-2">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
            {/* Map Container */}
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white p-3 shadow-soft">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-50 min-h-[420px]">
                <Suspense
                  fallback={
                    <div className="flex h-[520px] w-full items-center justify-center text-sm text-muted-foreground md:h-[620px]">
                      Preparing interactive route map…
                    </div>
                  }
                >
                  <RouteMap search={q} aircraft={aircraft} />
                </Suspense>
              </div>

              {/* Bottom Legend Pill Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-2.5 text-xs font-semibold text-foreground/80">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <span className="font-bold">Hub</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-500" />
                    <span className="font-bold">Destination</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3.5 rounded-full bg-[#b89358]" />
                    <span className="font-bold">Route</span>
                  </div>
                </div>
                <div className="text-xs font-black text-muted-foreground">
                  {filtered.length} Direct Routes
                </div>
              </div>
            </div>

            {/* Side Filter Cards */}
            <div className="space-y-4">
              <Card className="rounded-[1.75rem] p-6 shadow-soft">
                <div className="kicker flex items-center gap-2">
                  <SlidersHorizontal className="size-3" />
                  <span>Find a flight</span>
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Search Sectors
                </label>
                <div className="relative mt-2 flex items-center">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ICAO, airport, route…"
                    className="form-input w-full pl-10 text-sm"
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
                      className={`rounded-xl px-2 py-2 text-xs font-extrabold transition ${
                        hub === h
                          ? "brand-gradient text-white shadow-brand"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
                      className={`rounded-xl px-2 py-2 text-xs font-extrabold transition ${
                        aircraft === a
                          ? "brand-gradient text-white shadow-brand"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Total Sectors Badge Card */}
              <div className="rounded-[1.75rem] brand-gradient p-6 text-white shadow-brand">
                <RouteIcon className="size-5" />
                <div className="mt-6 text-4xl font-black tracking-tight">
                  {filtered.length}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/75">
                  Sectors Available
                </div>
                <p className="mt-4 text-xs leading-5 text-white/80">
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
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
            <div className="hidden grid-cols-[1fr_1.2fr_1.2fr_.8fr] gap-4 bg-[#1c2b4f] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.18em] text-white/70 sm:grid">
              <div>Flight</div>
              <div>Departure</div>
              <div>Arrival</div>
              <div>Aircraft</div>
            </div>
            {paginatedRoutes.map((r, i) => (
              <div
                key={r.routeId}
                className={`grid gap-3 px-5 py-5 sm:grid-cols-[1fr_1.2fr_1.2fr_.8fr] sm:items-center sm:gap-4 sm:px-6 ${
                  i ? "border-t border-border" : ""
                } transition hover:bg-muted/30`}
              >
                <div>
                  <div className="text-sm font-black text-primary">
                    {r.routeNo}
                  </div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold text-foreground/80">
                  <span className="rounded-lg bg-muted px-2.5 py-1">
                    {r.aircraft}
                  </span>
                  <a
                    href={simBriefUrl(r)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#b89358] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#a9824b]"
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
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
                          className={`size-9 rounded-xl text-xs font-extrabold transition ${
                            currentPage === page
                              ? "brand-gradient text-white shadow-brand"
                              : "border border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-brand"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17213a]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 text-white">
                    <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#b89358]">
                      {d.icao}
                    </div>
                    <div className="mt-0.5 text-lg font-black tracking-tight">{d.name}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                    {d.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setQ(d.icao)}
                    className="mt-4 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary transition hover:text-[#b89358]"
                  >
                    <span>Search published sectors</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* OPERATIONS BANNER */}
        <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
          <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8 sm:p-12">
            <div className="kicker flex items-center gap-2">
              <Sparkles className="size-3.5" />
              <span>Flight Operations</span>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
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
