import { useEffect, useRef, useState } from "react";
import { fetchAirports, fetchRoutes, type AirportRecord } from "@/lib/csv";
import { fetchRoutes as fetchRouteRecords } from "@/lib/csv";

const CARTO_API_KEY = "cb1_3nf4_1_7b20991e74f9ccb93b421f1f";

type LatLng = [number, number];

function greatCircle(from: LatLng, to: LatLng, segments = 48): LatLng[] {
  const [lat1, lon1] = from.map((v) => (v * Math.PI) / 180) as LatLng;
  const [lat2, lon2] = to.map((v) => (v * Math.PI) / 180) as LatLng;
  const a = [Math.cos(lat1) * Math.cos(lon1), Math.cos(lat1) * Math.sin(lon1), Math.sin(lat1)];
  const b = [Math.cos(lat2) * Math.cos(lon2), Math.cos(lat2) * Math.sin(lon2), Math.sin(lat2)];
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return [from, to];
  const sinOmega = Math.sin(omega);
  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const s1 = Math.sin((1 - t) * omega) / sinOmega;
    const s2 = Math.sin(t * omega) / sinOmega;
    const x = s1 * a[0] + s2 * b[0];
    const y = s1 * a[1] + s2 * b[1];
    const z = s1 * a[2] + s2 * b[2];
    return [(Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI];
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

function routePopup(r: Awaited<ReturnType<typeof fetchRouteRecords>>[number]) {
  return `<div class="route-popup"><strong>${escapeHtml(r.depIcao)} → ${escapeHtml(r.arrIcao)}</strong><div>${escapeHtml(r.depAirport)} → ${escapeHtml(r.arrAirport)}</div><div>Aircraft: ${escapeHtml(r.aircraft || "Air Arabia fleet")}</div></div>`;
}

function airportPopup(a: AirportRecord) {
  return `<div class="route-popup"><strong>${escapeHtml(a.icao)}</strong><div>${escapeHtml(a.name)}</div><div>Routes from here: ${escapeHtml(a.flights)}</div>${a.moreToKnow ? `<div>${escapeHtml(a.moreToKnow)}</div>` : ""}</div>`;
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
          const hit = L.polyline(path, { color: "#FF0041", weight: 12, opacity: 0 }).addTo(map);
          const line = L.polyline(path, {
            color: "#FF0041",
            weight: 1.25,
            opacity: 0.72,
          }).addTo(map);
          const popup = routePopup(r);
          [hit, line].forEach((layer) => {
            layer.bindPopup(popup, { closeButton: true, maxWidth: 300 });
            layer.on("mouseover", () => line.setStyle({ weight: 2.5, opacity: 1 }));
            layer.on("mouseout", () => line.setStyle({ weight: 1.25, opacity: 0.72 }));
          });
          bounds.extend(path[0]).extend(path[path.length - 1]);
        });

        airports.forEach((a) => {
          const isHub = Number(a.flights) >= 3;
          L.circleMarker(a.coords, {
            radius: isHub ? 5 : 3,
            color: "#FF0041",
            weight: 1.5,
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
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div ref={containerRef} className="h-[520px] w-full md:h-[620px]" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-black/10 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur">
        {status === "loading" && "Loading route network…"}
        {status === "error" && "Unable to load route network."}
        {status === "ready" && `${counts.routes} routes · ${counts.airports} airports`}
      </div>
    </div>
  );
}
