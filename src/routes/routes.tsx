import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
          "Interactive Air Arabia Virtual route map for Infinite Flight. Tap a route line for flight details or an airport dot for airport information.",
      },
      { property: "og:title", content: "Route Network — Air Arabia Virtual" },
      {
        property: "og:description",
        content: "Browse every published Air Arabia Virtual route on an interactive map.",
      },
    ],
  }),
  component: RoutesPage,
});

function RoutesPage() {
  const [mounted, setMounted] = useState(false);
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchRoutes()
      .then(setRoutes)
      .catch((e) => console.error(e));
  }, []);

  const q = query.trim().toUpperCase();
  const filtered = q
    ? routes.filter((r) =>
        [r.routeNo, r.depIcao, r.arrIcao, r.depAirport, r.arrAirport, r.aircraft]
          .join(" ")
          .toUpperCase()
          .includes(q),
      )
    : routes;

  return (
    <>
      <PageHeader
        eyebrow="Routes"
        title="Our route network"
        subtitle="Every line below is a route you can fly today. Tap a red line to see the flight number, both airports and the aircraft used — or tap an airport dot for details about that station."
      />

      <Section>
        {mounted ? (
          <RouteMap />
        ) : (
          <div className="h-[420px] w-full rounded-2xl border border-border bg-surface sm:h-[540px]" />
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          Route lines are drawn as great circles between the departure and arrival coordinates in
          the schedule file, so they match the track you fly in Infinite Flight.
        </p>
      </Section>

      <Section
        title="How the network is kept up to date"
        description="The map reads two plain CSV files, so anyone on the operations team can update the network without touching the website."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="font-semibold">public/data/routes.csv</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              One row per route. Columns: route_id, route_no, dep_icao, arr_icao, dep_airport,
              arr_airport, aircraft_used, dep_coordinates, arr_coordinates. Coordinates are
              latitude then longitude and must be quoted, e.g.{" "}
              <span className="font-medium text-foreground">"25.3286,55.5172"</span>.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">public/data/airports.csv</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              One row per airport. Columns: airport_name, airport_icao, airport_coordinates,
              flights_from_this_airport, more_to_know. Airports with three or more departures are
              drawn as filled hub dots.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="Published schedule">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search flight number, ICAO or aircraft…"
          className="mb-4 w-full rounded-md border border-input bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30 sm:max-w-sm"
        />
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Flight</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Aircraft</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.routeId} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-primary">{r.routeNo}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.depIcao}</div>
                    <div className="text-xs text-muted-foreground">{r.depAirport}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.arrIcao}</div>
                    <div className="text-xs text-muted-foreground">{r.arrAirport}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.aircraft}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {routes.length === 0 ? "Loading schedule…" : "No routes match that search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
