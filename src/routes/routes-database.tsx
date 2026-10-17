import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchRoutes, type RouteRecord } from "@/lib/csv";
import { Section } from "@/components/site/Page";
import { LockKeyhole, Search, Plane, Clock3, LogOut, ShieldCheck, Star } from "lucide-react";

const ACCESS_ENDPOINT = "https://huqvffdiwqilbpxepfpo.supabase.co/functions/v1/routes-database-access";
const SESSION_KEY = "routes-database-session";

export const Route = createFileRoute("/routes-database")({
  head: () => ({ meta: [{ title: "Routes Database — Air Astana Virtual" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: RoutesDatabasePage,
});

type BlockTime = { minutes: number; source: "Published schedule" | "Planning estimate" };

// Published examples are route-direction-specific and can change by season.
// ALA–FRA is based on Air Astana KC221 schedules; ALA–LHR is based on Air Astana's published non-stop schedule.
const PUBLISHED_BLOCK_TIMES: Record<string, number> = {
  "UAAA-EDDF": 505, // 8h 25m — KC221 schedule
  "EDDF-UAAA": 435, // 7h 15m — Air Astana-operated return schedule
  "UAAA-EGLL": 575, // 9h 35m — Air Astana non-stop schedule
};

function blockTime(r: RouteRecord): BlockTime {
  const published = PUBLISHED_BLOCK_TIMES[`${r.depIcao}-${r.arrIcao}`];
  if (published) return { minutes: published, source: "Published schedule" };

  const rad = (n: number) => n * Math.PI / 180;
  const [a, b] = r.dep; const [c, d] = r.arr;
  const x = Math.sin(rad(c-a)/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;
  const nm = 3440.065 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  const speed = r.aircraft === "787-9" ? 485 : r.aircraft === "757-200" ? 440 : 435;
  return {
    minutes: Math.max(30, Math.round((nm / speed * 60 + 35) / 5) * 5),
    source: "Planning estimate",
  };
}

type RankInfo = {
  rank: string;
  minHours: string;
  stripes: number;
  isSenior?: boolean;
  isElite?: boolean;
  perk: string;
};

function rankForRoute(r: RouteRecord): RankInfo {
  const codes = [r.depIcao, r.arrIcao];
  const distanceNm = (() => {
    const rad = (n: number) => n * Math.PI / 180;
    const [a, b] = r.dep; const [c, d] = r.arr;
    const x = Math.sin(rad(c-a)/2)**2 + Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;
    return 3440.065 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  })();

  const kazakhstan = new Set(["UAAA", "UACC", "UATE", "UATT", "UATG", "UAUU", "UAOO", "UAII", "UARR", "UASK"]);
  const centralAsia = new Set(["UAFM", "UAFO", "UTDD", "UTTT"]);
  const caucasus = new Set(["UBBB", "UGTB", "UGSB"]);
  const europe = new Set(["LTFM", "LTAI", "LTFE", "EHAM", "EDDF", "EGLL", "LFPG", "LYPG"]);
  const asia = new Set(["ZBAA", "ZGGG", "ZSPD", "ZWWW", "ZJSY", "RKSI", "VIDP", "VABB", "OTHH", "OMDB", "OEJN", "OEMA", "VRMM", "VTBS", "VTSP", "VVDN", "VVCR", "VVPQ", "WMKK", "WADD", "VCBI", "RJAA", "RJTT", "RPLL"]);
  const bothKazakhstan = codes.every(code => kazakhstan.has(code));
  const touchesCentralAsia = codes.some(code => centralAsia.has(code));
  const touchesCaucasusOrEurope = codes.some(code => caucasus.has(code) || europe.has(code));
  const touchesAsia = codes.some(code => asia.has(code));

  // Long-range privilege takes precedence for routes beyond the network's long-haul threshold.
  if (distanceNm >= 3500) return { rank: "Captain", minHours: "150h", stripes: 4, perk: "Long-range operations" };
  if (bothKazakhstan) return { rank: "Cadet", minHours: "0h", stripes: 0, perk: "Domestic network" };
  if (touchesCentralAsia) return { rank: "Second Officer", minHours: "10h", stripes: 1, perk: "Central Asia" };
  if (touchesCaucasusOrEurope) return { rank: "First Officer", minHours: "30h", stripes: 2, perk: "Caucasus & Europe" };
  if (touchesAsia) return { rank: "Senior First Officer", minHours: "75h", stripes: 3, perk: "Asia network" };
  return { rank: "First Officer", minHours: "30h", stripes: 2, perk: "International network" };
}

function RankStripes({ rank }: { rank: RankInfo }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className={`relative flex h-9 w-[76px] shrink-0 items-center justify-end gap-1 rounded-xl px-2.5 shadow-inner ${rank.isElite ? "bg-gradient-to-r from-[#a48656] via-[#2a3b66] to-[#1c2b4f]" : "bg-gradient-to-r from-[#263b67] to-[#1c2b4f]"}`}>
        {(rank.isElite || rank.isSenior) && <Star className="mr-auto size-3.5 fill-amber-100 text-amber-100" />}
        {rank.stripes === 0 ? (
          <span className="w-full text-center text-[9px] font-extrabold uppercase tracking-wider text-white">Cadet</span>
        ) : Array.from({ length: rank.stripes }).map((_, i) => (
          <span key={i} className={`h-6 w-1.5 rounded-sm ${rank.isElite ? "bg-amber-100" : "bg-white"}`} />
        ))}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-extrabold leading-tight text-slate-900">{rank.rank}</div>
        <div className="mt-0.5 text-[10px] font-semibold text-slate-500">{rank.minHours} required</div>
      </div>
    </div>
  );
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
    return routes.filter(r => [r.routeNo, r.routeId, r.depIcao, r.arrIcao, r.depAirport, r.arrAirport, r.aircraft, rankForRoute(r).rank, rankForRoute(r).perk].join(" ").toLowerCase().includes(q));
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
                  Please provide your secure access code generated via Discord using <code className="bg-slate-100 text-[#1c2b4f] px-1.5 py-0.5 rounded font-mono font-bold text-xs">/get-password</code> or your partner codeshare code.
                </p>

                <form onSubmit={redeem} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Secure Code</label>
                    <input 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                      required 
                      autoComplete="one-time-code" 
                      placeholder="Enter code..." 
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
              </div>
            ) : (
              /* --- UNLOCKED DATABASE VIEW --- */
              <>
                {/* Search & Logout Toolbar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center justify-between">
                  <div className="relative w-full min-w-0 sm:max-w-xl">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-400" />
                    <input 
                      value={query} 
                      onChange={e => setQuery(e.target.value)} 
                      placeholder="Search flight number, airport, or aircraft..." 
                      className="form-input !w-full !min-w-0 !pl-12 !pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1c2b4f]/20 focus:border-[#1c2b4f] text-sm transition-all"
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
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-slate-500 ring-1 ring-slate-200">
                    <Clock3 className="size-3.5 text-[#a48656]" /> Scheduled / estimated time
                  </span>
                </div>

                {/* Database Table Container */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  {/* Table Header */}
                  <div className="hidden grid-cols-[.72fr_1fr_1fr_.72fr_1.12fr_.68fr] gap-4 bg-gradient-to-r from-[#172541] via-[#1c2b4f] to-[#263b60] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/80 xl:grid">
                    <div>Flight</div>
                    <div>Departure</div>
                    <div>Arrival</div>
                    <div>Aircraft</div>
                    <div>Rank unlocked</div>
                    <div>Block time</div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-slate-100">
                    {filtered.map((r) => (
                      <div key={r.routeId} className="group grid gap-3 border-l-2 border-l-transparent px-4 py-4 transition-all hover:border-l-[#a48656] hover:bg-[#f8f9fc] sm:px-6 xl:grid-cols-[.72fr_1fr_1fr_.72fr_1.12fr_.68fr] xl:items-center xl:gap-4">
                        <div className="flex items-center justify-between gap-3 xl:block">
                          <div>
                            <div className="font-extrabold text-[#a48656] text-base tracking-tight">{r.routeNo}</div>
                            <div className="mt-0.5 text-[11px] text-slate-400 font-mono">Sector {r.routeId}</div>
                          </div>
                          <span className="xl:hidden rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">{r.aircraft}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Departure</div>
                          <div className="mt-0.5 font-black tracking-wide text-slate-900">{r.depIcao}</div>
                          <div className="truncate text-xs text-slate-500" title={r.depAirport}>{r.depAirport}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Arrival</div>
                          <div className="mt-0.5 font-black tracking-wide text-slate-900">{r.arrIcao}</div>
                          <div className="truncate text-xs text-slate-500" title={r.arrAirport}>{r.arrAirport}</div>
                        </div>
                        <div className="hidden xl:block">
                          <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700">{r.aircraft}</span>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none">
                          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 xl:hidden">Rank unlocked</div>
                          <RankStripes rank={rankForRoute(r)} />
                        </div>
                        <div className="flex items-center justify-between gap-3 xl:block">
                          <div>
                            <div className="font-black tabular-nums text-slate-900">{duration(blockTime(r).minutes)}</div>
                            <div className={`mt-1 inline-flex items-center gap-1 text-[10px] font-bold ${blockTime(r).source === "Published schedule" ? "text-emerald-700" : "text-slate-400"}`}>
                              {blockTime(r).source === "Published schedule" ? <ShieldCheck className="size-3" /> : <Clock3 className="size-3" />}
                              {blockTime(r).source}
                            </div>
                          </div>
                          <span className="xl:hidden rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{r.aircraft}</span>
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
                <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs leading-relaxed text-slate-500 sm:flex-row sm:items-start">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-[#a48656]" />
                  <p><strong className="text-slate-700">Block time note:</strong> Published schedule values are marked individually where a public scheduled duration was verified. Other sectors are clearly labelled planning estimates derived from route distance and typical aircraft performance; wind, routing, season and airline schedules can change actual times.</p>
                </div>
              </>
            )}
          </Section>
        </div>

      </div>
    </div>
  );
}
