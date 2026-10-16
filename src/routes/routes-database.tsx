import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";
import { Section } from "@/components/site/Page";
import { LockKeyhole, Search, Plane, Clock3, LogOut, ShieldCheck } from "lucide-react";

const ACCESS_ENDPOINT = "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/routes-database-access";
const SESSION_KEY = "routes-database-session";

export const Route = createFileRoute("/routes-database")({
  head: () => ({ meta: [{ title: "Routes Database — Air Astana Virtual" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: RoutesDatabasePage,
});

function blockMinutes(r: RouteRecord) {
  const rad = (n: number) => n * Math.PI / 180;
  const [a, b] = r.dep; const [c, d] = r.arr;
  const x = Math.sin(rad(c-a)/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;
  const nm = 3440.065 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  const speed = r.aircraft === "787-9" ? 485 : r.aircraft === "757-200" ? 440 : 435;
  return Math.max(30, Math.round((nm / speed * 60 + 35) / 15) * 15);
}

function duration(n: number) { 
  const h = Math.floor(n / 60), m = n % 60; 
  return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m} min`; 
}

function RoutesDatabasePage() {
  const [code, setCode] = useState(""); 
  const [session, setSession] = useState(""); 
  const [error, setError] = useState(""); 
  const [busy, setBusy] = useState(false); 
  const [routes, setRoutes] = useState<RouteRecord[]>([]); 
  const [query, setQuery] = useState(""); 
  const [ready, setReady] = useState(false);

  useEffect(() => { 
    setSession(sessionStorage.getItem(SESSION_KEY) || ""); 
    setReady(true); 
  }, []);

  useEffect(() => { 
    if (session) fetchRoutes().then(setRoutes).catch(() => setError("Could not load routes.")); 
  }, [session]);

  async function redeem(e: React.FormEvent) { 
    e.preventDefault(); 
    setBusy(true); 
    setError(""); 
    try {
      const r = await fetch(ACCESS_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "redeem", code: code.trim() })
      });
      const d = await r.json();
      if (!r.ok || !d.sessionToken) throw new Error(d.error || "Invalid, expired or already-used code.");
      sessionStorage.setItem(SESSION_KEY, d.sessionToken);
      setSession(d.sessionToken);
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not verify code.");
    } finally {
      setBusy(false);
    }
  }

  function logout() { 
    sessionStorage.removeItem(SESSION_KEY); 
    setSession(""); 
    setRoutes([]); 
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return routes.filter(r => [r.routeNo, r.routeId, r.depIcao, r.arrIcao, r.depAirport, r.arrAirport, r.aircraft].join(" ").toLowerCase().includes(q));
  }, [routes, query]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 text-foreground pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Wrapper with clearance from Navbar */}
        <div className="pt-6">
          <Section 
            eyebrow="Restricted Operations" 
            title="Routes Database" 
            description="Internal schedule reference and operational routing for Air Astana Virtual crew."
          >
            {!session ? (
              /* --- LOGIN / UNLOCK CARD --- */
              <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10 my-8 transition-all">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#1c2b4f] text-white shadow-lg shadow-[#1c2b4f]/30">
                  <LockKeyhole className="size-6" />
                </div>
                
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Enter Access Code</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Please provide your secure single-use access code generated via Discord using <code className="bg-slate-100 text-[#1c2b4f] px-1.5 py-0.5 rounded font-mono font-bold text-xs">/get-password</code>.
                </p>

                <form onSubmit={redeem} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Secure Code</label>
                    <input 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                      required 
                      autoComplete="one-time-code" 
                      placeholder="e.g. A9B2C3D4E" 
                      className="form-input w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b4f]/20 focus:border-[#1c2b4f] font-mono tracking-widest text-center uppercase text-base transition-all"
                    />
                  </div>
                  
                  <button 
                    disabled={busy} 
                    className="w-full rounded-xl bg-[#1c2b4f] hover:bg-[#16223e] px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#1c2b4f]/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                  >
                    {busy ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="size-4" /> Unlock Database
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <div role="alert" className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 text-center animate-shake">
                    {error}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <img src="https://air-astana-virtual.vercel.app/assets/Password.png" alt="Secure Guide" className="w-full rounded-xl shadow-sm border border-slate-100 object-cover"/>
                </div>
              </div>
            ) : (
              /* --- UNLOCKED DATABASE VIEW --- */
              <>
                {/* Search & Logout Toolbar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input 
                      value={query} 
                      onChange={e => setQuery(e.target.value)} 
                      placeholder="Search flight number, airport, or aircraft..." 
                      className="form-input w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c2b4f]/20 focus:border-[#1c2b4f] text-sm transition-all"
                    />
                  </div>
                  <button 
                    onClick={logout} 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 text-sm font-bold shadow-sm transition-all"
                  >
                    <LogOut className="size-4 text-slate-500" /> Lock Database
                  </button>
                </div>

                {/* Sub-header info counter */}
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500 px-1">
                  <Plane className="size-4 text-[#a48656]" />
                  <span>Showing {filtered.length} of {routes.length} sectors</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-slate-400">
                    <Clock3 className="size-3.5" /> Estimated block time
                  </span>
                </div>

                {/* Database Table Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  {/* Table Header */}
                  <div className="hidden grid-cols-[.7fr_1fr_1fr_.8fr_.75fr] gap-3 bg-[#1c2b4f] px-6 py-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/85 md:grid">
                    <div>Flight</div>
                    <div>Departure</div>
                    <div>Arrival</div>
                    <div>Aircraft</div>
                    <div>Block Time</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-slate-100">
                    {filtered.map((r) => (
                      <div key={r.routeId} className="grid gap-3 px-6 py-4 md:grid-cols-[.7fr_1fr_1fr_.8fr_.75fr] md:items-center hover:bg-slate-50/80 transition-colors">
                        <div>
                          <div className="font-extrabold text-[#a48656] text-base">{r.routeNo}</div>
                          <div className="text-xs text-slate-400 font-mono">{r.routeId}</div>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{r.depIcao}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{r.depAirport}</div>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{r.arrIcao}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]">{r.arrAirport}</div>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                            {r.aircraft}
                          </span>
                        </div>
                        <div className="font-extrabold tabular-nums text-slate-900">
                          {duration(blockMinutes(r))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty search state */}
                  {!filtered.length && (
                    <div className="p-12 text-center text-sm text-slate-500">
                      No matching routes found for your query.
                    </div>
                  )}
                </div>

                {/* Footer disclaimer */}
                <p className="mt-4 text-xs text-slate-400 leading-relaxed px-1">
                  * Rounded planning estimates based on direct route distance and typical aircraft performance profiles; these are not verified published schedules for real-world commercial operations.
                </p>
              </>
            )}
          </Section>
        </div>

      </div>
    </div>
  );
}
