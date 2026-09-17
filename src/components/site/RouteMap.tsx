import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAirports, fetchRoutes, type AirportRecord, type RouteRecord } from "@/lib/csv";

const CARTO_API_KEY = "cb1_3nf4_1_7b20991e74f9ccb93b421f1f";

type LatLng = [number, number];
type LeafletMap = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup;

const HUBS = [
  { icao: "OMSJ", iata: "SHJ", name: "Sharjah", country: "UAE" },
  { icao: "OMRK", iata: "RKT", name: "Ras Al Khaimah", country: "UAE" },
  { icao: "GMMN", iata: "CMN", name: "Casablanca", country: "Morocco" },
  { icao: "HEBA", iata: "HBE", name: "Alexandria", country: "Egypt" },
  { icao: "OMAA", iata: "AUH", name: "Abu Dhabi", country: "UAE" },
  { icao: "OPKC", iata: "KHI", name: "Karachi", country: "Pakistan" },
] as const;

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

function routePopup(r: RouteRecord) {
  return `<div class="route-popup"><strong>${escapeHtml(r.depIcao)} → ${escapeHtml(r.arrIcao)}</strong><div>${escapeHtml(r.depAirport)} → ${escapeHtml(r.arrAirport)}</div><div>Aircraft: ${escapeHtml(r.aircraft || "Air Arabia fleet")}</div><div>Route: ${escapeHtml(r.routeNo)}</div></div>`;
}

function airportPopup(a: AirportRecord) {
  return `<div class="route-popup"><strong>${escapeHtml(a.icao)}</strong><div>${escapeHtml(a.name)}</div><div>Routes from here: ${escapeHtml(a.flights)}</div>${a.moreToKnow ? `<div>${escapeHtml(a.moreToKnow)}</div>` : ""}</div>`;
}

export function RouteMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const networkLayerRef = useRef<LeafletLayerGroup | null>(null);
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [counts, setCounts] = useState({ routes: 0, airports: 0, totalRoutes: 0, totalAirports: 0 });
  const [mapData, setMapData] = useState<{ routes: RouteRecord[]; airports: AirportRecord[] } | null>(null);

  const selectedHubData = useMemo(
    () => HUBS.find((hub) => hub.icao === selectedHub) ?? null,
    [selectedHub],
  );

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      try {
        const [routes, airportRows] = await Promise.all([fetchRoutes(), fetchAirports()]);
        if (cancelled || !containerRef.current) return;

        const airports = new Map<string, AirportRecord>();
        airportRows.forEach((a) => airports.set(a.icao, a));
        routes.forEach((r) => {
          if (!airports.has(r.depIcao)) {
            airports.set(r.depIcao, {
              icao: r.depIcao,
              name: r.depAirport,
              coords: r.dep,
              flights: String(routes.filter((x) => x.depIcao === r.depIcao).length),
              moreToKnow: "",
            });
          }
          if (!airports.has(r.arrIcao)) {
            airports.set(r.arrIcao, {
              icao: r.arrIcao,
              name: r.arrAirport,
              coords: r.arr,
              flights: String(routes.filter((x) => x.depIcao === r.arrIcao).length),
              moreToKnow: "",
            });
          }
        });

        setMapData({ routes, airports: Array.from(airports.values()) });

        const [{ default: L }] = await Promise.all([import("leaflet")]);
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current, {
          center: [25, 40],
          zoom: 3,
          minZoom: 2,
          worldCopyJump: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });
        mapRef.current = map;

        L.tileLayer(
          `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_API_KEY)}`,
          {
            subdomains: "abcd",
            maxZoom: 18,
            attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
          },
        ).addTo(map);

        networkLayerRef.current = L.layerGroup().addTo(map);
        setCounts({ routes: routes.length, airports: airports.size, totalRoutes: routes.length, totalAirports: airports.size });
        setStatus("ready");
        cleanup = () => {
          networkLayerRef.current = null;
          mapRef.current = null;
          map.remove();
        };
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

  useEffect(() => {
    if (!mapData || !mapRef.current || !networkLayerRef.current) return;
    let cancelled = false;

    (async () => {
      const { default: L } = await import("leaflet");
      if (cancelled || !mapRef.current || !networkLayerRef.current) return;

      const hubIcaos = new Set(HUBS.map((hub) => hub.icao));
      // A hub marker is earned by operating the network, not merely appearing
      // as the destination of another hub-to-hub sector. This prevents routes
      // such as CMN → AUH/SHJ from making CMN look like an additional hub on
      // that sector; CMN is still a hub wherever it has its own network feed.
      const operationalHubIcaos = new Set(
        mapData.routes
          .filter((route) => hubIcaos.has(route.depIcao) && !hubIcaos.has(route.arrIcao))
          .map((route) => route.depIcao),
      );

      const routes = selectedHub === "ALL"
        ? mapData.routes
        : mapData.routes.filter((route) => route.depIcao === selectedHub || route.arrIcao === selectedHub);
      const routeAirports = new Set<string>();
      routes.forEach((route) => {
        routeAirports.add(route.depIcao);
        routeAirports.add(route.arrIcao);
      });

      const airportMap = new Map(mapData.airports.map((airport) => [airport.icao, airport]));
      const visibleAirports = selectedHub === "ALL"
        ? Array.from(airportMap.values())
        : Array.from(airportMap.values()).filter((airport) => routeAirports.has(airport.icao));

      networkLayerRef.current.clearLayers();
      const bounds = L.latLngBounds([]);

      routes.forEach((route) => {
        const path = greatCircle(route.dep, route.arr);
        const hit = L.polyline(path, { color: "#FF0041", weight: 12, opacity: 0 }).addTo(networkLayerRef.current!);
        const line = L.polyline(path, { color: "#FF0041", weight: 1.25, opacity: 0.72 }).addTo(networkLayerRef.current!);
        const popup = routePopup(route);
        hit.bindPopup(popup, { closeButton: true, maxWidth: 300 });
        line.bindPopup(popup, { closeButton: true, maxWidth: 300 });
        hit.on("mouseover", () => line.setStyle({ weight: 2.5, opacity: 1 }));
        hit.on("mouseout", () => line.setStyle({ weight: 1.25, opacity: 0.72 }));
        line.on("mouseover", () => line.setStyle({ weight: 2.5, opacity: 1 }));
        line.on("mouseout", () => line.setStyle({ weight: 1.25, opacity: 0.72 }));
        bounds.extend(path[0]).extend(path[path.length - 1]);
      });

      visibleAirports.forEach((airport) => {
        const isHub = operationalHubIcaos.has(airport.icao);
        L.circleMarker(airport.coords, {
          radius: isHub ? 5.5 : 3,
          color: "#FF0041",
          weight: isHub ? 2 : 1.5,
          fillColor: isHub ? "#FF0041" : "#ffffff",
          fillOpacity: 1,
        })
          .addTo(networkLayerRef.current!)
          .bindPopup(airportPopup(airport), { closeButton: true, maxWidth: 300 });
        bounds.extend(airport.coords);
      });

      if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [44, 44], maxZoom: selectedHub === "ALL" ? 4 : 7 });
      setCounts((current) => ({ ...current, routes: routes.length, airports: visibleAirports.length }));
    })();

    return () => {
      cancelled = true;
    };
  }, [mapData, selectedHub]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_24px_70px_-38px_rgba(20,25,40,0.35)]">
      <div className="border-b border-black/5 bg-[linear-gradient(135deg,rgba(255,0,65,0.08),rgba(255,255,255,0.96)_48%,rgba(245,247,250,0.96))] p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Network hubs</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Filter the map by operating hub</p>
          </div>
          <span className="hidden rounded-full border border-primary/15 bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary sm:inline-flex">
            {selectedHubData ? selectedHubData.iata : "Global network"}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            aria-pressed={selectedHub === "ALL"}
            onClick={() => setSelectedHub("ALL")}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
              selectedHub === "ALL"
                ? "border-primary bg-[linear-gradient(135deg,#FF0041,#C20041)] text-white shadow-[0_8px_22px_-12px_rgba(255,0,65,0.8)]"
                : "border-black/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            All Hubs
          </button>
          {HUBS.map((hub) => (
            <button
              key={hub.icao}
              type="button"
              aria-pressed={selectedHub === hub.icao}
              onClick={() => setSelectedHub(hub.icao)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                selectedHub === hub.icao
                  ? "border-primary bg-[linear-gradient(135deg,#FF0041,#C20041)] text-white shadow-[0_8px_22px_-12px_rgba(255,0,65,0.8)]"
                  : "border-black/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5"
              }`}
              title={`${hub.name} — ${hub.country}`}
            >
              {hub.name} <span className="ml-1 opacity-70">({hub.iata})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={containerRef} className="h-[520px] w-full md:h-[620px]" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur-md">
          {status === "loading" && "Loading route network…"}
          {status === "error" && "Unable to load route network."}
          {status === "ready" && `${counts.routes} routes · ${counts.airports} airports${selectedHub !== "ALL" ? ` · ${selectedHubData?.iata ?? selectedHub}` : ""}`}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/5 bg-white px-4 py-3 text-[11px] text-muted-foreground">
        <span>{counts.totalRoutes} published routes · {counts.totalAirports} airports in the dataset</span>
        <span className="font-medium text-primary">Click a line or airport for details</span>
      </div>
    </div>
  );
}
