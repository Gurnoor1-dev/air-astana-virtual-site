import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAirports, fetchRoutes, type AirportRecord, type RouteRecord } from "@/lib/csv";

type LatLng = [number, number];
type LeafletMap = import("leaflet").Map;
type LeafletLayerGroup = import("leaflet").LayerGroup;

const HUBS = [
  { icao: "UAAA", iata: "ALA", name: "Almaty", country: "Kazakhstan" },
  { icao: "UACC", iata: "NQZ", name: "Astana", country: "Kazakhstan" },
] as const;

function greatCircle(from: LatLng, to: LatLng, segments = 28): LatLng[] {
  const [lat1, lon1] = from.map((v) => (v * Math.PI) / 180) as LatLng;
  const [lat2, lon2] = to.map((v) => (v * Math.PI) / 180) as LatLng;
  const a = [Math.cos(lat1) * Math.cos(lon1), Math.cos(lat1) * Math.sin(lon1), Math.sin(lat1)];
  const b = [Math.cos(lat2) * Math.cos(lon2), Math.cos(lat2) * Math.sin(lon2), Math.sin(lat2)];
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return [from, to];
  const sinOmega = Math.sin(omega);
  return Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments,
      s1 = Math.sin((1 - t) * omega) / sinOmega,
      s2 = Math.sin(t * omega) / sinOmega,
      x = s1 * a[0] + s2 * b[0],
      y = s1 * a[1] + s2 * b[1],
      z = s1 * a[2] + s2 * b[2];
    return [(Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI];
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c] ?? c));
}

function routePopup(r: RouteRecord) {
  return `
    <div class="kc-route-card">
      <div class="kc-card-header">
        <span class="kc-header-tag">FLIGHT DETAILS</span>
        <span class="kc-aircraft-badge">${escapeHtml(r.aircraft || "Air Astana Fleet")}</span>
      </div>
      
      <div class="kc-route-main">
        <div class="kc-airport-node">
          <span class="kc-icao">${escapeHtml(r.depIcao)}</span>
          <span class="kc-airport-name" title="${escapeHtml(r.depAirport)}">${escapeHtml(r.depAirport)}</span>
        </div>
        
        <div class="kc-flight-path">
          <div class="kc-line"></div>
          <div class="kc-plane-icon">✈</div>
        </div>
        
        <div class="kc-airport-node right">
          <span class="kc-icao">${escapeHtml(r.arrIcao)}</span>
          <span class="kc-airport-name" title="${escapeHtml(r.arrAirport)}">${escapeHtml(r.arrAirport)}</span>
        </div>
      </div>

      <div class="kc-card-footer">
        <div class="kc-info-block">
          <span class="kc-label">Route No</span>
          <span class="kc-value">${escapeHtml(r.routeNo || "KC-GLOBAL")}</span>
        </div>
        <div class="kc-info-block right">
          <span class="kc-label">Operator</span>
          <span class="kc-value">Air Astana</span>
        </div>
      </div>
    </div>
  `;
}

function airportPopup(a: AirportRecord) {
  return `
    <div class="kc-route-card">
      <div class="kc-card-header">
        <span class="kc-header-tag">AIRPORT STATION</span>
        <span class="kc-aircraft-badge gold">${escapeHtml(a.flights)} ROUTES</span>
      </div>
      
      <div class="kc-airport-header-single">
        <div class="kc-icao-lg">${escapeHtml(a.icao)}</div>
        <div class="kc-airport-fullname">${escapeHtml(a.name)}</div>
      </div>

      ${
        a.moreToKnow
          ? `
        <div class="kc-card-extra">
          <span class="kc-label">Station Information</span>
          <p class="kc-extra-text">${escapeHtml(a.moreToKnow)}</p>
        </div>
      `
          : ""
      }
    </div>
  `;
}

export function RouteMap({ search = "", aircraft = "ALL" }: { search?: string; aircraft?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const networkLayerRef = useRef<LeafletLayerGroup | null>(null);
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [mapReady, setMapReady] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [counts, setCounts] = useState({ routes: 0, airports: 0, totalRoutes: 0, totalAirports: 0 });
  const [mapData, setMapData] = useState<{
    routes: RouteRecord[];
    airports: AirportRecord[];
    routePaths: Map<RouteRecord, LatLng[]>;
  } | null>(null);

  const selectedHubData = useMemo(() => HUBS.find((h) => h.icao === selectedHub) ?? null, [selectedHub]);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const [routes, airportRows] = await Promise.all([fetchRoutes(), fetchAirports()]);
        if (cancelled || !containerRef.current) return;
        const airports = new Map<string, AirportRecord>();
        airportRows.forEach((a) => airports.set(a.icao, a));

        // Count departures in one pass instead of scanning every route per airport.
        const departureCounts = new Map<string, number>();
        routes.forEach((r) => {
          departureCounts.set(r.depIcao, (departureCounts.get(r.depIcao) ?? 0) + 1);
        });

        routes.forEach((r) => {
          if (!airports.has(r.depIcao))
            airports.set(r.depIcao, {
              icao: r.depIcao,
              name: r.depAirport,
              coords: r.dep,
              flights: String(departureCounts.get(r.depIcao) ?? 0),
              moreToKnow: "",
            });
          if (!airports.has(r.arrIcao))
            airports.set(r.arrIcao, {
              icao: r.arrIcao,
              name: r.arrAirport,
              coords: r.arr,
              flights: String(departureCounts.get(r.arrIcao) ?? 0),
              moreToKnow: "",
            });
        });

        // Great-circle geometry is stable across filters; calculate it only once per route.
        const routePaths = new Map<RouteRecord, LatLng[]>();
        routes.forEach((r) => routePaths.set(r, greatCircle(r.dep, r.arr)));
        setMapData({ routes, airports: Array.from(airports.values()), routePaths });
        const [{ default: L }] = await Promise.all([import("leaflet")]);
        if (cancelled || !containerRef.current) return;
        const map = L.map(containerRef.current, {
          center: [48, 60],
          zoom: 3,
          minZoom: 2,
          maxZoom: 18,
          worldCopyJump: true,
          scrollWheelZoom: false,
          attributionControl: true,
        });
        mapRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          subdomains: ["a", "b", "c"],
          maxZoom: 19,
          crossOrigin: true,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);
        networkLayerRef.current = L.layerGroup().addTo(map);
        setCounts({
          routes: routes.length,
          airports: airports.size,
          totalRoutes: routes.length,
          totalAirports: airports.size,
        });
        setStatus("ready");
        setMapReady(true);
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
      const hubIcaos = new Set(HUBS.map((h) => h.icao));
      const searchText = search.trim().toUpperCase();
      const routes = mapData.routes.filter((r) => {
        const hubMatch = selectedHub === "ALL" || r.depIcao === selectedHub || r.arrIcao === selectedHub;
        const aircraftMatch = aircraft === "ALL" || r.aircraft === aircraft;
        const text = [r.routeNo, r.depIcao, r.arrIcao, r.depAirport, r.arrAirport, r.aircraft].join(" ").toUpperCase();
        return hubMatch && aircraftMatch && (!searchText || text.includes(searchText));
      });
      const routeAirports = new Set<string>();
      routes.forEach((r) => {
        routeAirports.add(r.depIcao);
        routeAirports.add(r.arrIcao);
      });
      const airportMap = new Map(mapData.airports.map((a) => [a.icao, a]));
      const visibleAirports =
        selectedHub === "ALL"
          ? Array.from(airportMap.values())
          : Array.from(airportMap.values()).filter((a) => routeAirports.has(a.icao));

      networkLayerRef.current.clearLayers();
      const bounds = L.latLngBounds([]);

      const popupOptions: import("leaflet").PopupOptions = {
        closeButton: true,
        className: "custom-leaflet-popup",
        maxWidth: 310,
        minWidth: 270,
      };

      // One interactive route layer per flight keeps map hit-testing and redraw work low.
      routes.forEach((r) => {
        const path = mapData.routePaths.get(r) ?? [r.dep, r.arr];
        const line = L.polyline(path, {
          color: "#A48656",
          weight: 1.4,
          opacity: 0.78,
        }).addTo(networkLayerRef.current!);
        line.bindPopup(routePopup(r), popupOptions);
        line.on("mouseover", () => line.setStyle({ weight: 2.8, opacity: 1 }));
        line.on("mouseout", () => line.setStyle({ weight: 1.4, opacity: 0.78 }));
        bounds.extend(path[0]).extend(path[path.length - 1]);
      });

      visibleAirports.forEach((a) => {
        const isHub = hubIcaos.has(a.icao);
        L.circleMarker(a.coords, {
          radius: isHub ? 5.5 : 3,
          color: "#A48656",
          weight: isHub ? 2 : 1.5,
          fillColor: isHub ? "#A48656" : "#ffffff",
          fillOpacity: 1,
          renderer: canvasRenderer,
        })
          .addTo(networkLayerRef.current!)
          .bindPopup(airportPopup(a), popupOptions);
        bounds.extend(a.coords);
      });

      if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [44, 44], maxZoom: selectedHub === "ALL" ? 4 : 7 });
      setCounts((c) => ({ ...c, routes: routes.length, airports: visibleAirports.length }));
    })();
    return () => {
      cancelled = true;
    };
  }, [mapData, mapReady, selectedHub, search, aircraft]);

  return (
    <div className="relative z-0 overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_24px_70px_-38px_rgba(20,25,40,0.35)]">
      {/* Font & Leaflet Pop-up Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');

        /* Leaflet popup overrides */
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          background: transparent !important;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.4) !important;
          border-radius: 1rem !important;
          overflow: hidden !important;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 100% !important;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: #17213a !important;
        }
        .custom-leaflet-popup a.leaflet-popup-close-button {
          color: rgba(255, 255, 255, 0.7) !important;
          padding: 10px 10px 0 0 !important;
          font-size: 18px !important;
          transition: color 0.2s ease;
          z-index: 10;
        }
        .custom-leaflet-popup a.leaflet-popup-close-button:hover {
          color: #ffffff !important;
        }

        /* Card component styling */
        .kc-route-card {
          background: #ffffff;
          border: 1px solid rgba(23, 33, 58, 0.12);
          border-radius: 1rem;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        }
        .kc-card-header {
          background: #17213a;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kc-header-tag {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #a48656;
          text-transform: uppercase;
        }
        .kc-aircraft-badge {
          background: rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }
        .kc-aircraft-badge.gold {
          background: #a48656;
          color: #ffffff;
        }
        .kc-route-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 14px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px dashed rgba(23, 33, 58, 0.12);
        }
        .kc-airport-node {
          display: flex;
          flex-direction: column;
          max-width: 42%;
        }
        .kc-airport-node.right {
          align-items: flex-end;
          text-align: right;
        }
        .kc-icao {
          font-size: 20px;
          font-weight: 900;
          color: #17213a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .kc-airport-name {
          font-size: 10px;
          font-weight: 600;
          color: #64748b;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
        .kc-flight-path {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin: 0 8px;
        }
        .kc-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: #e2e8f0;
          top: 50%;
          transform: translateY(-50%);
        }
        .kc-plane-icon {
          position: relative;
          z-index: 1;
          background: #ffffff;
          padding: 2px 6px;
          border-radius: 9999px;
          color: #a48656;
          font-size: 11px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }
        .kc-card-footer {
          display: flex;
          justify-content: space-between;
          padding: 12px 14px;
          background: #ffffff;
        }
        .kc-info-block {
          display: flex;
          flex-direction: column;
        }
        .kc-info-block.right {
          align-items: flex-end;
        }
        .kc-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
        }
        .kc-value {
          font-size: 12px;
          font-weight: 800;
          color: #17213a;
          margin-top: 2px;
        }
        .kc-airport-header-single {
          padding: 16px 14px;
          background: #ffffff;
        }
        .kc-icao-lg {
          font-size: 24px;
          font-weight: 900;
          color: #17213a;
          letter-spacing: -0.03em;
        }
        .kc-airport-fullname {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          margin-top: 2px;
        }
        .kc-card-extra {
          padding: 10px 14px 14px 14px;
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
        }
        .kc-extra-text {
          font-size: 11px;
          color: #475569;
          margin-top: 4px;
          line-height: 1.4;
        }
      `}</style>

      <div className="border-b border-black/5 bg-[linear-gradient(135deg,rgba(164,134,86,0.10),rgba(255,255,255,0.96)_48%,rgba(245,247,250,0.96))] p-3 sm:p-4">
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
                ? "brand-gradient text-white shadow-brand"
                : "border-black/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            All Hubs
          </button>
          {HUBS.map((h) => (
            <button
              key={h.icao}
              type="button"
              aria-pressed={selectedHub === h.icao}
              onClick={() => setSelectedHub(h.icao)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                selectedHub === h.icao
                  ? "brand-gradient text-white shadow-brand"
                  : "border-black/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5"
              }`}
              title={`${h.name} — ${h.country}`}
            >
              {h.name} <span className="ml-1 opacity-70">({h.iata})</span>
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <div ref={containerRef} className="h-[520px] w-full md:h-[620px]" />
        <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur-md">
          {status === "loading" && "Loading route network…"}
          {status === "error" && "Unable to load route network."}
          {status === "ready" &&
            `${counts.routes} routes · ${counts.airports} airports${selectedHub !== "ALL" ? ` · ${selectedHubData?.iata ?? selectedHub}` : ""}`}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/5 bg-white px-4 py-3 text-[11px] text-muted-foreground">
        <span>
          {counts.totalRoutes} published routes · {counts.totalAirports} airports in the dataset
        </span>
        <span className="font-medium text-primary">Click a line or airport for details</span>
      </div>
    </div>
  );
}
