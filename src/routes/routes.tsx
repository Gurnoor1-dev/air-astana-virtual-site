import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
  Lock,
  Plus,
  Minus,
  RotateCcw,
  Plane,
  Sparkles,
} from "lucide-react";
import { Card, Section } from "@/components/site/Page";
import { RouteMap } from "@/components/site/RouteMap";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";

import heroBg from "@/assets/site/home-hero.jpg";
import bangkok from "@/assets/site/bangkok.jpg";
import delhi from "@/assets/site/delhi.jpg";
import dubai from "@/assets/site/dubai.jpg";
import london from "@/assets/site/london.jpg";
import tokyo from "@/assets/site/tokyo.jpg";
import manila from "@/assets/site/manila.jpg";

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
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-[center_top_25%] bg-no-repeat opacity-45 sm:opacity-55"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#b89358]/30 bg-background/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b89358] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b89358]" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#b89358]">
                  Network Control
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-[-0.035em] text-foreground sm:text-6xl md:text-7xl">
                Explore the{" "}
                <span className="bg-gradient-to-r from-primary via-[#b89358] to-cyan-500 bg-clip-text text-transparent">
                  network.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-normal leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
                Browse our published sectors, search by airport or route, and
                filter the Eurasian network by hub or aircraft type.
              </p>
            </div>
          </div>
        </section>

        {/* TOGGLE BAR (Air Astana Routes vs Codeshares) */}
        <div className="relative z-20 mx-auto -mt-6 max-w-7xl px-5 sm:px-8">
          <div className="inline-flex items-center rounded-2xl border border-border/80 bg-card/90 p-1.5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <button
              onClick={() => setNetworkTab("standard")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                networkTab === "standard"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plane className="size-4" />
              <span>Air Astana Routes</span>
            </button>

            <button
              disabled
              className="flex cursor-not-allowed items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-muted-foreground/50 transition-all sm:text-sm"
              title="Codeshare operations are launching soon"
            >
              <Lock className="size-3.5" />
              <span>Codeshares</span>
              <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                Coming Soon
              </span>
            </button>
          </div>
        </div>

        {/* MAP & FILTER CONTROLS */}
        <Section className="!pt-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Map Container with Image-style Overlays */}
            <div className="relative overflow-hidden rounded-[2.25rem] border border-border/80 bg-card/70 p-2 shadow-2xl shadow-slate-200/50 backdrop-blur-md dark:shadow-none">
              <div className="relative overflow-hidden rounded-[1.75rem]">
                <RouteMap search={q} aircraft={aircraft} />

                {/* Top Center Route Preview Callout (Reference match) */}
                <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-border/70 bg-background/90 px-5 py-2 shadow-lg backdrop-blur-md">
                  <span className="text-xs font-black tracking-tight text-foreground sm:text-sm">
                    Almaty (UAAA) <span className="text-primary font-bold">⇄</span> Astana (UACC)
                  </span>
                </div>

                {/* Top Right Zoom / Reset Controls (Reference match) */}
                <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-border/80 bg-background/90 shadow-md backdrop-blur-md">
                  <button
                    type="button"
                    title="Zoom in"
                    aria-label="Zoom in"
                    className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
                  >
                    <Plus className="size-4" />
                  </button>
                  <div className="h-px w-full bg-border/60" />
                  <button
                    type="button"
                    title="Zoom out"
                    aria-label="Zoom out"
                    className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
                  >
                    <Minus className="size-4" />
                  </button>
                  <div className="h-px w-full bg-border/60" />
                  <button
                    type="button"
                    title="Reset view"
                    aria-label="Reset view"
                    className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>

                {/* Bottom Legend Pill Bar (Reference match) */}
                <div className="absolute bottom-4 right-4 flex flex-wrap items-center gap-3 sm:gap-4 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-xs font-semibold text-foreground/80 shadow-lg backdrop-blur-md">
                  {/* Hub Dot */}
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    <span className="font-bold">Hub</span>
                  </div>

                  {/* Destination Dot */}
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#0ea5e9] shadow-sm shadow-[#0ea5e9]/50" />
                    <span className="font-bold">Destination</span>
                  </div>

                  {/* Route Line indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-3.5 rounded-full bg-primary" />
                    <span className="font-bold">Route</span>
                  </div>

                  <span className="hidden text-border sm:inline">|</span>

                  {/* Direct Routes Counter */}
                  <span className="text-xs font-extrabold text-muted-foreground">
                    {filtered.length} Direct Routes
                  </span>
                </div>
              </div>
            </div>

            {/* Side Filter Cards */}
            <div className="space-y-4">
              <Card className="rounded-[2rem] border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#b89358]">
                  <SlidersHorizontal className="size-3.5" />
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
                    className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pl-10 pr-3 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Origin Hub
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {hubs.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHub(h)}
                      className={`rounded-xl px-2 py-2.5 text-xs font-black transition-all ${
                        hub === h
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "border border-border/60 bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"
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
                      onClick={() => setAircraft(a)}
                      className={`rounded-xl px-2 py-2 text-xs font-bold transition-all ${
                        aircraft === a
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "border border-border/60 bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Total Sectors Badge Card */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1c2b4f] via-primary to-emerald-950 p-6 text-white shadow-xl">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                  <RouteIcon className="size-5 text-white" />
                </div>
                <div className="mt-6 text-5xl font-black tracking-tight">
                  {filtered.length}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  Sectors Available
                </div>
                <p className="mt-4 text-xs leading-5 text-white/70">
                  Select a sector on the map or the schedule table below to view
                  dispatch details.
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
          <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/80 shadow-lg backdrop-blur-md">
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
                  i ? "border-t border-border/60" : ""
                } transition hover:bg-muted/30`}
              >
                <div>
                  <div className="text-sm font-extrabold text-primary">
                    {r.routeNo}
                  </div>
                  <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {r.routeId}
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-foreground">{r.depIcao}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.depAirport}
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-foreground">{r.arrIcao}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.arrAirport}
                  </div>
                </div>
                <div className="text-xs font-extrabold text-foreground/80">
                  <span className="rounded-lg bg-muted px-2.5 py-1">
                    {r.aircraft}
                  </span>
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
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
                          onClick={() => setCurrentPage(page)}
                          className={`size-9 rounded-xl text-xs font-extrabold transition ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
                className="group overflow-hidden rounded-[2rem] border border-border/80 bg-card/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#b89358]/40 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17213a]/90 via-[#17213a]/30 to-transparent" />
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
          <div className="relative overflow-hidden rounded-[2.25rem] border border-[#b89358]/20 bg-gradient-to-br from-card/90 via-card/60 to-primary/5 p-8 shadow-xl backdrop-blur-md sm:p-12">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#b89358]">
              <Sparkles className="size-4" />
              Flight Operations
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
