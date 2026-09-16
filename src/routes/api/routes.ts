import { createFileRoute } from "@tanstack/react-router";

import { parseCoordinates, parseCsv } from "@/lib/csv";

async function readCsv(request: Request, filename: string) {
  const response = await fetch(new URL(`/data/${filename}`, request.url), {
    headers: { accept: "text/csv" },
  });
  if (!response.ok) throw new Error(`Could not load ${filename}`);
  return parseCsv(await response.text());
}

export const Route = createFileRoute("/api/routes")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const [routeRows, airportRows] = await Promise.all([
            readCsv(request, "routes.csv"),
            readCsv(request, "airports.csv"),
          ]);

          const routes = routeRows.flatMap((row) => {
            const dep = parseCoordinates(row["dep_coordinates"]);
            const arr = parseCoordinates(row["arr_coordinates"]);
            if (!dep || !arr || !row["dep_icao"] || !row["arr_icao"]) return [];
            return [
              {
                routeId: row["route_id"] || row["route_no"],
                routeNo: row["route_no"],
                depIcao: row["dep_icao"].toUpperCase(),
                arrIcao: row["arr_icao"].toUpperCase(),
                depAirport: row["dep_airport"],
                arrAirport: row["arr_airport"],
                aircraft: row["aircraft_used"],
                dep,
                arr,
              },
            ];
          });

          const airports = airportRows.flatMap((row) => {
            const coords = parseCoordinates(row["airport_coordinates"]);
            if (!coords || !row["airport_icao"]) return [];
            return [
              {
                name: row["airport_name"],
                icao: row["airport_icao"].toUpperCase(),
                coords,
                flights: row["flights_from_this_airport"],
                moreToKnow: row["more_to_know"],
              },
            ];
          });

          return Response.json(
            {
              ok: true,
              generatedAt: new Date().toISOString(),
              routes,
              airports,
            },
            {
              headers: {
                "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
              },
            },
          );
        } catch (error) {
          console.error("Route API failed", error);
          return Response.json(
            { ok: false, error: "Route data is temporarily unavailable." },
            { status: 500 },
          );
        }
      },
    },
  },
});
