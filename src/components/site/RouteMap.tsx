import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAirports, fetchRoutes, type AirportRecord, type RouteRecord } from "@/lib/csv";

const HUBS = [
  { icao: "UAAA", iata: "ALA", name: "Almaty", country: "Kazakhstan", lat: 43.3521, lng: 77.0405 },
  { icao: "UACC", iata: "NQZ", name: "Astana", country: "Kazakhstan", lat: 51.0222, lng: 71.4669 },
] as const;

type GlobeRoute = RouteRecord & { startLat: number; startLng: number; endLat: number; endLng: number };
type GlobePoint = { lat: number; lng: number; size: number; color: string; name: string; icao: string; flights: string; isHub: boolean };

export function RouteMap({ search = "", aircraft = "ALL" }: { search?: string; aircraft?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [airports, setAirports] = useState<AirportRecord[]>([]);
  const [showCodeshare, setShowCodeshare] = useState(true);
  const [globeMode, setGlobeMode] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<RouteRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    let globe: any;
    let resizeObserver: ResizeObserver | undefined;
    const mount = async () => {
      try {
        const [{ default: Globe }, data] = await Promise.all([
          import("globe.gl"),
          Promise.all([fetchRoutes(), fetchAirports()]),
        ]);
        if (cancelled || !containerRef.current) return;
        setRoutes(data[0]);
        setAirports(data[1]);

        globe = Globe()(containerRef.current)
          .backgroundColor("#071426")
          .showAtmosphere(true)
          .atmosphereColor("#56b4e9")
          .atmosphereAltitude(0.18)
          .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
          .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
          .showGraticules(true)
          .arcColor((d: GlobeRoute) => [selectedHub !== "ALL" ? "#65c7f3" : "#d6b36a", "#65c7f3"])
          .arcAltitude((d: GlobeRoute) => {
            const distance = Math.hypot(d.endLat - d.startLat, d.endLng - d.startLng);
            return Math.min(0.42, Math.max(0.12, distance / 150));
          })
          .arcStroke(0.55)
          .arcDashLength(0.45)
          .arcDashGap(0.18)
          .arcDashAnimateTime(1800)
          .arcsTransitionDuration(500)
          .pointLat("lat")
          .pointLng("lng")
          .pointAltitude((d: GlobePoint) => d.isHub ? 0.035 : 0.012)
          .pointRadius((d: GlobePoint) => d.size)
          .pointColor((d: GlobePoint) => d.color)
          .pointLabel((d: GlobePoint) => `<div style="font-family:system-ui;padding:8px 10px;color:#f8fafc;background:#10233d;border:1px solid #3b5c78;border-radius:10px"><b>${d.icao} · ${d.name}</b><div style="font-size:11px;color:#b9cde0;margin-top:3px">${d.flights} network routes</div></div>`)
          .onPointClick((d: GlobePoint) => {
            const match = routes.find((r) => r.depIcao === d.icao || r.arrIcao === d.icao);
            if (match) setSelectedRoute(match);
            globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.7 }, 900);
          })
          .onArcClick((d: GlobeRoute) => setSelectedRoute(d));
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.32;
        globe.controls().enableDamping = true;
        globe.controls().dampingFactor = 0.08;
        globe.pointOfView({ lat: 38, lng: 64, altitude: 2.35 }, 0);
        globeRef.current = globe;
        resizeObserver = new ResizeObserver(() => {
          if (containerRef.current && globe) {
            globe.width(containerRef.current.clientWidth);
            globe.height(containerRef.current.clientHeight);
          }
        });
        resizeObserver.observe(containerRef.current);
        globe.width(containerRef.current.clientWidth);
        globe.height(containerRef.current.clientHeight);
        setStatus("ready");
      } catch (error) {
        console.error("Could not initialize route globe", error);
        if (!cancelled) setStatus("error");
      }
    };
    void mount();
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (globe) {
        globe._destructor?.();
        if (containerRef.current) containerRef.current.innerHTML = "";
      }
      globeRef.current = null;
    };
  }, []);

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toUpperCase();
    return routes.filter((route) => {
      const hubMatch = selectedHub === "ALL" || route.depIcao === selectedHub || route.arrIcao === selectedHub;
      const aircraftMatch = aircraft === "ALL" || route.aircraft === aircraft;
      const haystack = [route.routeNo, route.depIcao, route.arrIcao, route.depAirport, route.arrAirport, route.aircraft].join(" ").toUpperCase();
      return hubMatch && aircraftMatch && (!query || haystack.includes(query));
    });
  }, [routes, search, selectedHub, aircraft]);

  const visibleAirports = useMemo(() => {
    const map = new Map<string, AirportRecord>();
    airports.forEach((airport) => map.set(airport.icao, airport));
    const count = new Map<string, number>();
    filteredRoutes.forEach((route) => {
      count.set(route.depIcao, (count.get(route.depIcao) ?? 0) + 1);
      if (!map.has(route.arrIcao)) map.set(route.arrIcao, {
        icao: route.arrIcao, name: route.arrAirport, coords: route.arr, flights: "0", moreToKnow: "",
      });
      if (!map.has(route.depIcao)) map.set(route.depIcao, {
        icao: route.depIcao, name: route.depAirport, coords: route.dep, flights: "0", moreToKnow: "",
      });
    });
    return Array.from(map.values()).filter((airport) => {
      if (selectedHub !== "ALL") return filteredRoutes.some((r) => r.depIcao === airport.icao || r.arrIcao === airport.icao);
      return filteredRoutes.some((r) => r.depIcao === airport.icao || r.arrIcao === airport.icao);
    }).map((airport) => ({ ...airport, flights: String(count.get(airport.icao) ?? airport.flights ?? "0") }));
  }, [airports, filteredRoutes, selectedHub]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const routeData: GlobeRoute[] = filteredRoutes.map((route) => ({
      ...route, startLat: route.dep[0], startLng: route.dep[1], endLat: route.arr[0], endLng: route.arr[1],
    }));
    const hubCodes = new Set(HUBS.map((hub) => hub.icao));
    const points: GlobePoint[] = visibleAirports.map((airport) => ({
      lat: airport.coords[0], lng: airport.coords[1],
      size: hubCodes.has(airport.icao) ? 0.55 : 0.22,
      color: hubCodes.has(airport.icao) ? "#f4c96b" : "#6ecbfa",
      name: airport.name, icao: airport.icao, flights: airport.flights,
      isHub: hubCodes.has(airport.icao),
    }));
    globe.arcsData(routeData).pointsData(points);
  }, [filteredRoutes, visibleAirports, selectedHub]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.arcsData(showCodeshare ? filteredRoutes.map((route) => ({
      ...route, startLat: route.dep[0], startLng: route.dep[1], endLat: route.arr[0], endLng: route.arr[1],
    })) : []);
  }, [showCodeshare, filteredRoutes]);

  const routeCount = filteredRoutes.length;
  const airportCount = visibleAirports.length;

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-[#1d3853] bg-[#071426] text-white shadow-[0_28px_90px_-42px_rgba(2,10,24,0.85)]">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-gradient-to-r from-[#0d2239] via-[#102c48] to-[#0a1a2e] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#e0bd70]">Air Astana · Route network</p>
          <h3 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">Explore our world</h3>
          <p className="mt-1 text-xs text-slate-300">Interactive route globe centered on Kazakhstan</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {HUBS.map((hub) => (
            <button key={hub.icao} type="button" onClick={() => setSelectedHub(selectedHub === hub.icao ? "ALL" : hub.icao)}
              aria-pressed={selectedHub === hub.icao}
              className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${selectedHub === hub.icao ? "border-[#e0bd70] bg-[#e0bd70] text-[#071426]" : "border-white/15 bg-white/5 text-slate-100 hover:border-sky-300/70"}`}>
              {hub.name} <span className="opacity-70">({hub.iata})</span>
            </button>
          ))}
          <button type="button" onClick={() => setSelectedHub("ALL")} className={`rounded-full border px-3.5 py-2 text-xs font-bold transition ${selectedHub === "ALL" ? "border-sky-300 bg-sky-300 text-[#071426]" : "border-white/15 bg-white/5 text-slate-100 hover:border-sky-300/70"}`}>All network</button>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="relative min-h-[420px] bg-[#071426] sm:min-h-[560px]">
          <div ref={containerRef} className="absolute inset-0 h-full min-h-[420px] w-full sm:min-h-[560px]" />
          {status !== "ready" && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#071426]/90 p-6 text-center">
            <div><div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-sky-300/25 border-t-sky-300" />
              <p className="text-sm font-bold">{status === "error" ? "The route globe could not load" : "Loading Air Astana network…"}</p>
              <p className="mt-1 text-xs text-slate-400">{status === "error" ? "Check the route data and network connection, then refresh." : "Preparing routes and airport stations"}</p>
            </div>
          </div>}
          <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/10 bg-[#071426]/80 px-3 py-2 text-xs text-slate-200 backdrop-blur">
            <span className="font-black text-[#e0bd70]">{routeCount}</span> routes <span className="mx-1 text-white/30">·</span> <span className="font-black text-sky-300">{airportCount}</span> airports
          </div>
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-[#071426]/80 px-3 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur"><span className="mr-1.5 inline-block size-2 rounded-full bg-[#e0bd70]" />Main hubs</span>
            <span className="rounded-full border border-white/10 bg-[#071426]/80 px-3 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur"><span className="mr-1.5 inline-block size-2 rounded-full bg-sky-300" />Destinations</span>
          </div>
        </div>
        <aside className="border-t border-white/10 bg-[#0b1b2e] p-4 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Visible sectors</p>
              <p className="mt-1 text-2xl font-black text-white">{routeCount}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Destinations</p>
              <p className="mt-1 text-2xl font-black text-white">{airportCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#e0bd70]">Network controls</p>
            <button type="button" onClick={() => setShowCodeshare((value) => !value)} className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-left text-xs font-semibold text-slate-200">
              <span>Show route arcs</span><span className={`relative h-5 w-9 rounded-full transition ${showCodeshare ? "bg-sky-400" : "bg-slate-600"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${showCodeshare ? "left-[18px]" : "left-0.5"}`} /></span>
            </button>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Drag to rotate the globe, scroll to zoom, and select an airport or route for details.</p>
          </div>
          {selectedRoute && <div className="mt-4 rounded-xl border border-[#e0bd70]/30 bg-[#e0bd70]/[.07] p-3">
            <div className="text-[9px] font-black uppercase tracking-[.16em] text-[#e0bd70]">Selected route</div>
            <div className="mt-2 text-sm font-black">{selectedRoute.depIcao} <span className="text-sky-300">→</span> {selectedRoute.arrIcao}</div>
            <div className="mt-1 text-xs text-slate-300">{selectedRoute.depAirport} to {selectedRoute.arrAirport}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold text-slate-300"><span className="rounded-md bg-white/5 px-2 py-1">{selectedRoute.routeNo || "KC network"}</span><span className="rounded-md bg-white/5 px-2 py-1">{selectedRoute.aircraft}</span></div>
            <button type="button" onClick={() => setSelectedRoute(null)} className="mt-3 text-[10px] font-bold uppercase tracking-wider text-sky-300 hover:text-white">Clear selection</button>
          </div>}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#e0bd70]">Hubs</p>
            {HUBS.map((hub) => <button key={hub.icao} type="button" onClick={() => { setSelectedHub(hub.icao); globeRef.current?.pointOfView({ lat: hub.lat, lng: hub.lng, altitude: 1.6 }, 900); }} className="mt-2 flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-white/5">
              <span><span className="block text-xs font-bold text-white">{hub.name}</span><span className="text-[10px] text-slate-400">{hub.country}</span></span><span className="text-xs font-black text-[#e0bd70]">{hub.iata}</span>
            </button>)}
          </div>
        </aside>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#06111f] px-4 py-3 text-[10px] text-slate-400">
        <span>Route data: published KCVA schedule</span><span>Air Astana virtual operations</span>
      </div>
    </section>
  );
}
