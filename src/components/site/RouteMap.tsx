import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAirports, fetchRoutes, type AirportRecord, type RouteRecord } from "@/lib/csv";

const HUBS = [
  { icao: "UAAA", iata: "ALA", name: "Almaty", country: "Kazakhstan", lat: 43.3521, lng: 77.0405 },
  { icao: "UACC", iata: "NQZ", name: "Astana", country: "Kazakhstan", lat: 51.0222, lng: 71.4669 },
] as const;

type GlobeRoute = RouteRecord & { startLat: number; startLng: number; endLat: number; endLng: number };
type GlobePoint = { lat: number; lng: number; size: number; color: string; name: string; icao: string; flights: string; isHub: boolean };

function uniqueOneWayRoutes(routes: RouteRecord[]) {
  const seen = new Set<string>();
  return routes.filter((route) => {
    const forward = `${route.depIcao}>${route.arrIcao}`;
    const reverse = `${route.arrIcao}>${route.depIcao}`;
    if (seen.has(forward) || seen.has(reverse)) return false;
    seen.add(forward);
    return true;
  });
}

function toGlobeRoute(route: RouteRecord): GlobeRoute {
  return { ...route, startLat: route.dep[0], startLng: route.dep[1], endLat: route.arr[0], endLng: route.arr[1] };
}

export function RouteMap({ search = "", aircraft = "ALL" }: { search?: string; aircraft?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const allRoutesRef = useRef<RouteRecord[]>([]);
  const [selectedHub, setSelectedHub] = useState("ALL");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [routes, setRoutes] = useState<RouteRecord[]>([]);
  const [airports, setAirports] = useState<AirportRecord[]>([]);
  const [showRouteArcs, setShowRouteArcs] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<RouteRecord | null>(null);

  // Mount the globe first. Load route CSV data in parallel so the user sees the scene
  // while the network data is being parsed, instead of waiting for both to finish.
  useEffect(() => {
    let cancelled = false;
    let globe: any;
    let resizeObserver: ResizeObserver | undefined;

    const init = async () => {
      try {
        const { default: Globe } = await import("globe.gl");
        if (cancelled || !containerRef.current) return;

        globe = Globe()(containerRef.current)
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight)
          .backgroundColor("#06111f")
          .showAtmosphere(true)
          .atmosphereColor("#56b4e9")
          .atmosphereAltitude(0.16)
          // One texture request only; omitting the optional bump map saves another download.
          .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
          .showGraticules(true)
          .arcsData([])
          .arcColor(() => ["#e0bd70", "#64c9f5"])
          .arcAltitude((d: GlobeRoute) => {
            const distance = Math.hypot(d.endLat - d.startLat, d.endLng - d.startLng);
            return Math.min(0.36, Math.max(0.1, distance / 170));
          })
          .arcStroke(0.42)
          .arcDashLength(0.52)
          .arcDashGap(0.2)
          .arcDashAnimateTime(1350)
          .arcsTransitionDuration(0)
          .pointLat("lat")
          .pointLng("lng")
          .pointAltitude((d: GlobePoint) => d.isHub ? 0.035 : 0.008)
          .pointRadius((d: GlobePoint) => d.size)
          .pointColor((d: GlobePoint) => d.color)
          .pointLabel((d: GlobePoint) => `<div style="font-family:system-ui;padding:9px 12px;color:#f8fafc;background:#0c2036;border:1px solid #36516c;border-radius:12px;box-shadow:0 12px 36px #0008"><b>${d.icao} · ${d.name}</b><div style="font-size:11px;color:#b9cde0;margin-top:4px">${d.flights} outbound sectors</div></div>`)
          .onPointClick((point: GlobePoint) => {
            const match = allRoutesRef.current.find((route) => route.depIcao === point.icao || route.arrIcao === point.icao);
            if (match) setSelectedRoute(match);
            globe.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.7 }, 650);
          })
          .onArcClick((route: GlobeRoute) => setSelectedRoute(route));
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.28;
        globe.controls().enableDamping = true;
        globe.controls().dampingFactor = 0.075;
        globe.pointOfView({ lat: 38, lng: 64, altitude: 2.25 }, 0);
        globeRef.current = globe;

        resizeObserver = new ResizeObserver(() => {
          if (!cancelled && containerRef.current && globe) {
            globe.width(containerRef.current.clientWidth);
            globe.height(containerRef.current.clientHeight);
          }
        });
        resizeObserver.observe(containerRef.current);

        // CSV fetches start alongside WebGL scene creation.
        const [routeRows, airportRows] = await Promise.all([fetchRoutes(), fetchAirports()]);
        if (cancelled) return;
        allRoutesRef.current = routeRows;
        setRoutes(routeRows);
        setAirports(airportRows);
        setStatus("ready");
      } catch (error) {
        console.error("Could not initialize route globe", error);
        if (!cancelled) setStatus("error");
      }
    };
    void init();
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
    const matching = routes.filter((route) => {
      const hubMatch = selectedHub === "ALL" || route.depIcao === selectedHub || route.arrIcao === selectedHub;
      const aircraftMatch = aircraft === "ALL" || route.aircraft === aircraft;
      const text = [route.routeNo, route.depIcao, route.arrIcao, route.depAirport, route.arrAirport, route.aircraft].join(" ").toUpperCase();
      return hubMatch && aircraftMatch && (!query || text.includes(query));
    });
    // Return legs remain in the published route data and schedule, but are deliberately
    // collapsed to a single visible direction on the globe.
    return uniqueOneWayRoutes(matching);
  }, [routes, search, selectedHub, aircraft]);

  const visibleAirports = useMemo(() => {
    const map = new Map<string, AirportRecord>();
    airports.forEach((airport) => map.set(airport.icao, airport));
    filteredRoutes.forEach((route) => {
      if (!map.has(route.depIcao)) map.set(route.depIcao, {
        icao: route.depIcao, name: route.depAirport, coords: route.dep, flights: "0", moreToKnow: "",
      });
      if (!map.has(route.arrIcao)) map.set(route.arrIcao, {
        icao: route.arrIcao, name: route.arrAirport, coords: route.arr, flights: "0", moreToKnow: "",
      });
    });
    const visibleCodes = new Set(filteredRoutes.flatMap((route) => [route.depIcao, route.arrIcao]));
    const counts = new Map<string, number>();
    filteredRoutes.forEach((route) => counts.set(route.depIcao, (counts.get(route.depIcao) ?? 0) + 1));
    return Array.from(map.values()).filter((airport) => visibleCodes.has(airport.icao)).map((airport) => ({
      ...airport, flights: String(counts.get(airport.icao) ?? airport.flights ?? "0"),
    }));
  }, [airports, filteredRoutes]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const hubCodes = new Set<string>(HUBS.map((hub) => hub.icao));
    const points: GlobePoint[] = visibleAirports.map((airport) => ({
      lat: airport.coords[0], lng: airport.coords[1],
      size: hubCodes.has(airport.icao) ? 0.42 : 0.19,
      color: hubCodes.has(airport.icao) ? "#f4c96b" : "#69cafa",
      name: airport.name, icao: airport.icao, flights: airport.flights,
      isHub: hubCodes.has(airport.icao),
    }));
    globe.pointsData(points);
    globe.arcsData(showRouteArcs ? filteredRoutes.map(toGlobeRoute) : []);
  }, [filteredRoutes, visibleAirports, showRouteArcs]);

  const routeCount = filteredRoutes.length;
  const airportCount = visibleAirports.length;

  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-[#23415d] bg-[#06111f] text-white shadow-[0_30px_100px_-40px_rgba(2,10,24,0.8)]">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#102c48] via-[#0c2037] to-[#071426] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-28 top-8 size-36 rounded-full bg-[#e0bd70]/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e0bd70]/25 bg-[#e0bd70]/[.08] px-3 py-1.5 text-[9px] font-black uppercase tracking-[.22em] text-[#efd28e]"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Air Astana virtual · Network control</div>
            <h3 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">Your world, connected.</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">Explore the network from Kazakhstan. Select any route arc to open its flight details.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {HUBS.map((hub) => <button key={hub.icao} type="button" onClick={() => setSelectedHub(selectedHub === hub.icao ? "ALL" : hub.icao)} aria-pressed={selectedHub === hub.icao} className={`rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${selectedHub === hub.icao ? "border-[#f0cf80] bg-[#e0bd70] text-[#071426] shadow-lg shadow-[#e0bd70]/10" : "border-white/15 bg-white/[.04] text-slate-100 hover:border-sky-300/70 hover:bg-sky-300/10"}`}>{hub.name} <span className="opacity-70">({hub.iata})</span></button>)}
            <button type="button" onClick={() => setSelectedHub("ALL")} className={`rounded-full border px-4 py-2.5 text-xs font-bold transition-all ${selectedHub === "ALL" ? "border-sky-300 bg-sky-300 text-[#071426]" : "border-white/15 bg-white/[.04] text-slate-100 hover:border-sky-300/70"}`}>All network</button>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="relative min-h-[390px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#112d49_0%,#081727_58%,#06111f_100%)] sm:min-h-[540px]">
          <div ref={containerRef} className="absolute inset-0 h-full min-h-[390px] w-full sm:min-h-[540px]" />
          {status !== "ready" && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#06111f]/85 p-6 text-center backdrop-blur-[2px]">
            <div><div className="mx-auto mb-4 size-9 animate-spin rounded-full border-2 border-sky-300/20 border-t-sky-300" />
              <p className="text-sm font-bold">{status === "error" ? "The route globe could not load" : "Opening the network…"}</p>
              <p className="mt-1 text-xs text-slate-400">{status === "error" ? "Please refresh and check that WebGL and network access are available." : "Preparing the globe and published flight data in parallel"}</p>
            </div>
          </div>}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#06111f]/75 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur-xl">
            <span className="font-black text-[#e0bd70]">{routeCount}</span><span className="text-slate-400">sectors</span><span className="mx-1 text-white/20">/</span><span className="font-black text-sky-300">{airportCount}</span><span className="text-slate-400">airports</span>
          </div>
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-[#06111f]/80 px-3 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur"><span className="mr-1.5 inline-block size-2 rounded-full bg-[#e0bd70]" />Hubs</span>
            <span className="rounded-full border border-white/10 bg-[#06111f]/80 px-3 py-1.5 text-[10px] font-bold text-slate-200 backdrop-blur"><span className="mr-1.5 inline-block size-2 rounded-full bg-sky-300" />Destinations</span>
            <span className="rounded-full border border-white/10 bg-[#06111f]/80 px-3 py-1.5 text-[10px] font-bold text-slate-300 backdrop-blur">Drag to rotate · Scroll to zoom</span>
          </div>
        </div>
        <aside className="border-t border-white/10 bg-gradient-to-b from-[#0c2035] to-[#091726] p-4 sm:p-5 lg:border-l lg:border-t-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/[.035] p-3.5"><p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-400">Visible routes</p><p className="mt-1 text-2xl font-black">{routeCount}</p><p className="mt-1 text-[10px] text-slate-500">One direction per pair</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[.035] p-3.5"><p className="text-[9px] font-black uppercase tracking-[.16em] text-slate-400">Stations</p><p className="mt-1 text-2xl font-black">{airportCount}</p><p className="mt-1 text-[10px] text-slate-500">In filtered network</p></div>
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#e0bd70]">Display settings</p>
            <button type="button" aria-pressed={showRouteArcs} onClick={() => setShowRouteArcs((value) => !value)} className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[.035] px-3.5 py-3 text-left text-xs font-semibold text-slate-200 transition hover:bg-white/[.07]"><span>Animated route arcs</span><span className={`relative h-5 w-9 rounded-full transition ${showRouteArcs ? "bg-sky-400" : "bg-slate-600"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${showRouteArcs ? "left-[18px]" : "left-0.5"}`} /></span></button>
          </div>
          {selectedRoute ? <div className="mt-5 overflow-hidden rounded-2xl border border-[#e0bd70]/30 bg-gradient-to-br from-[#19324a] to-[#0d1e30] shadow-xl shadow-black/20">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#e0bd70]/[.08] px-4 py-3"><div><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#efd28e]">Selected sector</p><p className="mt-1 text-xs font-bold text-slate-300">{selectedRoute.routeNo || "KC network"}</p></div><button type="button" aria-label="Close selected route" onClick={() => setSelectedRoute(null)} className="rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300 hover:bg-white/10">✕</button></div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0"><p className="text-2xl font-black tracking-tight">{selectedRoute.depIcao}</p><p className="mt-1 truncate text-[10px] leading-snug text-slate-400">{selectedRoute.depAirport}</p></div>
                <div className="flex min-w-[60px] flex-1 flex-col items-center px-1"><span className="text-[9px] font-bold uppercase tracking-wider text-sky-300">Direct</span><div className="relative mt-2 h-px w-full bg-gradient-to-r from-[#e0bd70] via-sky-300 to-sky-300"><span className="absolute -top-2 right-0 text-sm text-sky-200">✈</span></div></div>
                <div className="min-w-0 text-right"><p className="text-2xl font-black tracking-tight">{selectedRoute.arrIcao}</p><p className="mt-1 truncate text-[10px] leading-snug text-slate-400">{selectedRoute.arrAirport}</p></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Aircraft</p><p className="mt-1 text-xs font-bold text-white">{selectedRoute.aircraft || "Not specified"}</p></div><div className="rounded-xl border border-white/10 bg-black/10 p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Operator</p><p className="mt-1 text-xs font-bold text-white">Air Astana Virtual</p></div></div>
              <p className="mt-3 text-[10px] leading-relaxed text-slate-400">This card shows the selected direction only. Return sectors remain in the published schedule and database.</p>
            </div>
          </div> : <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-4"><div className="flex size-9 items-center justify-center rounded-xl bg-sky-300/10 text-lg text-sky-300">↗</div><p className="mt-3 text-sm font-bold">Choose a route</p><p className="mt-1 text-xs leading-relaxed text-slate-400">Click any glowing arc on the globe to view its departure, destination, flight number and aircraft here.</p></div>}
          <div className="mt-5 border-t border-white/10 pt-4"><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#e0bd70]">Network hubs</p>
            {HUBS.map((hub) => <button key={hub.icao} type="button" onClick={() => { setSelectedHub(hub.icao); globeRef.current?.pointOfView({ lat: hub.lat, lng: hub.lng, altitude: 1.6 }, 700); }} className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[.06]"><span><span className="block text-xs font-bold">{hub.name}</span><span className="mt-0.5 block text-[10px] text-slate-400">{hub.country} · {hub.icao}</span></span><span className="rounded-lg border border-[#e0bd70]/20 bg-[#e0bd70]/[.08] px-2 py-1 text-[10px] font-black text-[#efd28e]">{hub.iata}</span></button>)}
          </div>
        </aside>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#040c16] px-5 py-3 text-[10px] text-slate-500"><span>Source: published KCVA route database</span><span>Air Astana Virtual · Flight operations</span></div>
    </section>
  );
}
