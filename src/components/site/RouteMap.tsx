import { useEffect, useRef, useState } from "react";

import {
  fetchAirports,
  fetchRoutes,
  type AirportRecord,
  type RouteRecord,
} from "@/lib/csv";

const CARTO_API_KEY = "cb1_3nf4_1_7b20991e74f9ccb93b421f1f";

/** Great-circle interpolation so long routes render as a natural arc. */
function greatCircle(
  from: [number, number],
  to: [number, number],
  segments = 48,
): [number, number][] {
  const toRad = Math.PI / 180;
  const [lat1, lon1] = [from[0] * toRad, from[1] * toRad];
  const [lat2, lon2] = [to[0] * toRad, to[1] * toRad];
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    );
  if (!Number.isFinite(d) || d === 0) return [from, to];

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);
    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    points.push([
      Math.atan2(z, Math.sqrt(x * x + y * y)) / toRad,
      Math.atan2(y, x) / toRad,
    ]);
  }
  return points;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

function routePopup(r: RouteRecord) {
  return `
    <div style="min-width:220px;padding:14px 16px;font-family:inherit">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98">Flight</div>
      <div style="font-size:18px;font-weight:700;color:#FF0041;margin-bottom:10px">${escapeHtml(r.routeNo)}</div>
      <div style="display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:#23262c">
        <span>${escapeHtml(r.depIcao)}</span><span style="color:#FF0041">&#8594;</span><span>${escapeHtml(r.arrIcao)}</span>
      </div>
      <div style="font-size:12px;color:#6b7078;margin-top:4px;line-height:1.5">
        ${escapeHtml(r.depAirport)}<br/>${escapeHtml(r.arrAirport)}
      </div>
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #ececef;font-size:12px;color:#23262c">
        <strong style="font-weight:600">Aircraft:</strong> ${escapeHtml(r.aircraft)}
      </div>
    </div>`;
}

function airportPopup(a: AirportRecord) {
  return `
    <div style="min-width:220px;padding:14px 16px;font-family:inherit">
      <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8a8f98">Airport</div>
      <div style="font-size:18px;font-weight:700;color:#FF0041;margin-bottom:2px">${escapeHtml(a.icao)}</div>
      <div style="font-size:14px;font-weight:600;color:#23262c">${escapeHtml(a.name)}</div>
      <div style="margin-top:10px;font-size:12px;color:#23262c">
        <strong style="font-weight:600">Flights from here:</strong> ${escapeHtml(a.flights || "—")}
      </div>
      ${
        a.moreToKnow
          ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #ececef;font-size:12px;color:#6b7078;line-height:1.5">${escapeHtml(a.moreToKnow)}</div>`
          : ""
      }
    </div>`;
}

export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [counts, setCounts] = useState({ routes: 0, airports: 0 });

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [{ default: L }, routes, airportRows] = await Promise.all([
          import("leaflet"),
          fetchRoutes(),
          fetchAirports(),
        ]);
        if (cancelled || !containerRef.current) return;

        const airports = new Map<string, AirportRecord>();
        airportRows.forEach((a) => airports.set(a.icao, a));
        // Any airport referenced by a route but missing from airports.csv still gets a dot.
        routes.forEach((r) => {
          if (!airports.has(r.depIcao))
            airports.set(r.depIcao, {
              icao: r.depIcao,
              name: r.depAirport,
              coords: r.dep,
              flights: String(routes.filter((x) => x.depIcao === r.depIcao).length),
              moreToKnow: "",
            });
          if (!airports.has(r.arrIcao))
            airports.set(r.arrIcao, {
              icao: r.arrIcao,
              name: r.arrAirport,
              coords: r.arr,
              flights: String(routes.filter((x) => x.depIcao === r.arrIcao).length),
              moreToKnow: "",
            });
        });

        const map = L.map(containerRef.current, {
          center: [25, 40],
          zoom: 3,
          minZoom: 2,
          worldCopyJump: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });

        L.tileLayer(
          `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_API_KEY)}`,
          {
            subdomains: "abcd",
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
          },
        ).addTo(map);

        const bounds = L.latLngBounds([]);

        routes.forEach((r) => {
          const path = greatCircle(r.dep, r.arr);
          // Wide invisible hit line makes taps easy on mobile.
          const hit = L.polyline(path, { color: "#FF0041", weight: 16, opacity: 0 }).addTo(map);
          const line = L.polyline(path, {
            color: "#FF0041",
            weight: 2,
            opacity: 0.75,
          }).addTo(map);
          const popup = routePopup(r);
          [hit, line].forEach((layer) => {
            layer.bindPopup(popup, { closeButton: true, maxWidth: 300 });
            layer.on("mouseover", () => line.setStyle({ weight: 4, opacity: 1 }));
            layer.on("mouseout", () => line.setStyle({ weight: 2, opacity: 0.75 }));
          });
          bounds.extend(path[0]).extend(path[path.length - 1]);
        });

        airports.forEach((a) => {
          const isHub = Number(a.flights) >= 3;
          L.circleMarker(a.coords, {
            radius: isHub ? 7 : 4.5,
            color: "#FF0041",
            weight: 2,
            fillColor: isHub ? "#FF0041" : "#ffffff",
            fillOpacity: 1,
          })
            .addTo(map)
            .bindPopup(airportPopup(a), { closeButton: true, maxWidth: 300 });
          bounds.extend(a.coords);
        });

        if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });

        setCounts({ routes: routes.length, airports: airports.size });
        setStatus("ready");
        cleanup = () => map.remove();
      } catch (err) {
        console.error(err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <div className="relative">
        <div ref={containerRef} className="h-[420px] w-full sm:h-[540px]" />
        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-surface text-sm text-muted-foreground">
            {status === "loading" ? "Loading route network…" : "Route data could not be loaded."}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-6 bg-primary" /> Route
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-full bg-primary" /> Hub
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-full border-2 border-primary bg-surface" />
          Destination
        </span>
        {status === "ready" && (
          <span className="ml-auto">
            {counts.routes} routes · {counts.airports} airports
          </span>
        )}
      </div>
    </div>
  );
}
