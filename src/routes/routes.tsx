import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import { RouteMap } from "@/components/site/RouteMap";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";

import bangkok from "@/assets/site/bangkok.jpg";
import delhi from "@/assets/site/delhi.jpg";
import dubai from "@/assets/site/dubai.jpg";
import london from "@/assets/site/london.jpg";
import tokyo from "@/assets/site/tokyo.jpg";
import manila from "@/assets/site/manila.jpg";

export const Route = createFileRoute("/routes")({
  head: () => ({
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

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(console.error);
  }, []);

  // Updated to render strictly ALL, UAAA, and UACC
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
      <PageHeader
        eyebrow="Network control"
        title="Explore the network."
        subtitle="Browse our published sectors, search by airport or route, and filter the network by hub or aircraft."
      />
      <Section className="!pt-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_30px_90px_-45px_rgb(15_23_42/.3)]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <RouteMap search={q} aircraft={aircraft} />
            </div>
          </div>
          <div className="space-y-4">
            <Card className="p-5">
              <div className="kicker">
                <SlidersHorizontal className="size-3" /> Find a flight
              </div>
              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search
              </label>
              <div className="relative mt-2 flex items-center">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ICAO, airport, route…"
                  className="form-input w-full pl-10"
                />
              </div>
              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Origin
              </label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {hubs.map((h) => (
                  <button
                    key={h}
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
            <div className="rounded-[1.5rem] brand-gradient p-6 text-white shadow-brand">
              <RouteIcon className="size-5" />
              <div className="mt-7 text-4xl font-black tracking-[-.06em]">
                {filtered.length}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/65">
                Sectors found
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Select a route on the map to see the sector details.
              </p>
            </div>
          </div>
        </div>
      </Section>
      <Section
        eyebrow="Schedule"
        title="Our published routes"
        description="A simple view of the routes available to our pilots. Browse the schedule, check the aircraft and find a sector that suits your next flight."
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
          <div className="hidden grid-cols-[1fr_1.2fr_1.2fr_.8fr] gap-4 bg-[#1c2b4f] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-white/55 sm:grid">
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
              }`}
            >
              <div>
                <div className="text-xs font-black text-primary">
                  {r.routeNo}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
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
              <div className="text-sm font-bold text-muted-foreground">
                {r.aircraft}
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
                        onClick={() => setCurrentPage(page)}
                        className={`size-9 rounded-xl text-xs font-bold transition ${
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
      <Section
        eyebrow="Featured destinations"
        title="Destinations to explore."
        description="A few destinations from across the network. Search the route database to see what is currently available."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#17213a]/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-[10px] font-black uppercase tracking-[.16em] text-white/70">
                    {d.icao}
                  </div>
                  <div className="mt-1 text-lg font-black">{d.name}</div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  {d.description}
                </p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-[.14em] text-primary">
                  Search published sectors →
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-7 sm:p-10">
          <div className="kicker">Flight Operations</div>
          <h3 className="mt-3 text-2xl font-extrabold">
            SimBrief & Flight Dispatch Ready
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            All published sectors mirror real-world Air Astana operations.
            Pilots can export schedule profiles directly to SimBrief and
            smartACARS for instant flight plan generation and real-time flight
            tracking.
          </p>
        </div>
      </section>
    </>
  );
}
