import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Route as RouteIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Card, PageHeader, Section } from "@/components/site/Page";
import { RouteMap } from "@/components/site/RouteMap";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";

export const Route = createFileRoute("/routes")({
  head: () => ({
    meta: [
      { title: "Route Network — Air Arabia Virtual" },
      {
        name: "description",
        content:
          "Explore the Air Arabia Virtual network with an interactive map and searchable route database.",
      },
    ],
  }),
  component: RoutesPage,
});

const ITEMS_PER_PAGE = 10;

function RoutesPage() {
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [q, setQ] = useState("");
  const [hub, setHub] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(console.error);
  }, []);

  const hubs = useMemo(
    () => ["ALL", ...Array.from(new Set(routes.map((r) => r.depIcao)))],
    [routes]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    return routes.filter((r) => {
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
      return (!s || text.includes(s)) && (hub === "ALL" || r.depIcao === hub);
    });
  }, [routes, q, hub]);

  // Reset pagination whenever search query or hub changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q, hub]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedRoutes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <>
      <PageHeader
        eyebrow="Network control"
        title="The world, connected by red lines."
        subtitle="Explore the published Air Arabia Virtual network. Search a route, filter an origin hub, then use the map to inspect each sector."
      />

      <Section className="!pt-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-white p-2 shadow-[0_30px_90px_-45px_rgb(15_23_42/.3)]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <RouteMap />
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="kicker">
                <SlidersHorizontal className="size-3" /> Network filter
              </div>

              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search
              </label>
              {/* Vertically centered icon with pointer-events-none */}
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
            </Card>

            <div className="rounded-[1.5rem] brand-gradient p-6 text-white shadow-brand">
              <RouteIcon className="size-5" />
              <div className="mt-7 text-4xl font-black tracking-[-.06em]">
                {filtered.length}
              </div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[.16em] text-white/65">
                Matching sectors
              </div>
              <p className="mt-5 text-sm leading-6 text-white/70">
                Click any route on the map for its full sector card.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Schedule"
        title="Published sectors"
        description="A searchable operational view of the same CSV-backed data powering the map."
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
          <div className="hidden grid-cols-[1fr_1.2fr_1.2fr_.8fr] gap-4 bg-[#111319] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-white/50 sm:grid">
            <div>Route</div>
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

        {/* Pagination Bar */}
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
              of <strong className="text-foreground">{filtered.length}</strong> sectors
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

      <section className="mx-auto mb-20 max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="kicker">Data driven</div>
              <h3 className="mt-3 text-2xl font-extrabold">
                One network. One source of truth.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Routes and airport details remain CSV-backed, so operations can
                update the network without rebuilding the interface.
              </p>
            </div>
            <ArrowRight className="hidden size-6 text-primary md:block" />
          </div>
        </div>
      </section>
    </>
  );
}
